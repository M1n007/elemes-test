const cronManajer = require('cron-job-manager');
const cron = new cronManajer();
const logger = require('../helpers/logger');
const constant = require('../helpers/constants');
const globalConfig = require('../configs/globalConfigs');
const helpers = require('../helpers/helper');
const queryHandler = require('./queries');
const queryOrder = require('../routes/orders/queries');
const async = require('async');
const { query } = require('express');
const Insta = require('../helpers/ig/index');
const InstaClient = new Insta();
const delay = require('delay');
const { default: proxy } = require('node-global-proxy');



const orderProcess = async () => {
    logger.log('sendMessage-orderProcess', 'run process order', 200)
    cron.add(constant.nameCronJob.orderProcess, '* * * * * *', async () => {
        const orderProcessResult = await queryOrder.findAllorder({}, 1000000, 1, {
            status: 'process'
        });

        const resultDataOrder = orderProcessResult.result.content;
        if (resultDataOrder == false) {
            logger.log('sendMessage-orderProcess', 'No Have Order!!', 200)
        } else {
            logger.log('sendMessage-orderProcess', 'Process The Order!', 200);
            async.each(resultDataOrder, async (element, callback) => {
                try {
                    if (element.remains >= 1) {
                        const igAccountResult = await queryOrder.findOneIgAcc({
                            orderId: {
                                $nin: [element.orderId]
                            },
                            data: {
                                $nin: [element.data]
                            },
                            status: 'active'
                        });

                        const igAccountResultOne = igAccountResult.result.content[0];

                        if (igAccountResultOne) {

                            let loginResult = {
                                response: {
                                    status: 'fail',
                                    authenticated: false
                                }
                            }
                            await helpers.proxyStart();
                            if (igAccountResultOne.cookies) {
                                
                                try {
                                    await InstaClient.useExistingCookie(igAccountResultOne.cookies);
                                    loginResult.response.status = 'ok';
                                    loginResult.response.authenticated = true;
                                } catch (e) {
                                    loginResult = await InstaClient.login(igAccountResultOne.username, igAccountResultOne.password);
                                    if (loginResult.response.hasOwnProperty('authenticated') && loginResult.response.authenticated == true) {
                                        await queryOrder.updateOneIgAccount({
                                            username: igAccountResultOne.username
                                        }, {
                                            status: 'active',
                                            responseAccount: loginResult.response.message,
                                            cookies: loginResult.headers
                                        })
                                    }

                                }
                            } else {
                                loginResult = await InstaClient.login(igAccountResultOne.username, igAccountResultOne.password);
                                if (loginResult.response.hasOwnProperty('authenticated') && loginResult.response.authenticated == true) {
                                    await queryOrder.updateOneIgAccount({
                                        username: igAccountResultOne.username
                                    }, {
                                        status: 'active',
                                        responseAccount: loginResult.response.message,
                                        cookies: loginResult.headers
                                    })
                                }
                            }

                            if (loginResult.response.status && loginResult.response.status == 'fail' || loginResult.response.authenticated == false) {
                                await queryOrder.updateOneIgAccount({
                                    username: igAccountResultOne.username
                                }, {
                                    status: 'inactive',
                                    responseAccount: loginResult.response.message
                                })
                            } else {
                                if (element.type == 'Followers') {

                                    let targetFollow = element.data;
                                    let doneFollowProcess = false;
                                    let breakStatus = false;
                                    let retryCount = 0;
                                    let retryCountNoCatch = 0;

                                    do {
                                        try {
                                            const follow = await InstaClient.followByUsername(targetFollow);
                                            if (follow.status && follow.status == 'ok') {
                                                logger.log('sendMessage-orderProcess-success', `Sukses Follow IG ${targetFollow}`, 200);
                                                igAccountResultOne.orderId.push(element.orderId)
                                                igAccountResultOne.data.push(element.data)
                                                await queryOrder.updateOneIgAccount({
                                                    username: igAccountResultOne.username,
                                                }, {
                                                    orderId: igAccountResultOne.orderId,
                                                    data: igAccountResultOne.data
                                                });

                                                await queryOrder.updateOneOrder({
                                                    orderId: element.orderId
                                                }, {
                                                    remains: element.remains - 1
                                                });

                                                const resultNewOrderDetail = await queryOrder.findOneorder({
                                                    orderId: element.orderId
                                                });

                                                const orderDetail = resultNewOrderDetail.result.content;
                                                if (orderDetail[0].remains < 1) {
                                                    await queryOrder.updateOneOrder({
                                                        orderId: element.orderId
                                                    }, {
                                                        status: 'done'
                                                    });

                                                }
                                                doneFollowProcess = true;
                                            } else {
                                                retryCountNoCatch++
                                                if (retryCountNoCatch <= 2) {
                                                    logger.log('sendMessage-orderProcess-error', `Gagal Follow IG ${targetFollow}, sedang kita coba kembali...`, 200);
                                                    await delay(5000);
                                                } else {
                                                    logger.log('sendMessage-orderProcess-error', `Gagal Follow IG ${targetFollow}, Reason : ${follow.message}`, 200);
                                                    doneFollowProcess = true;
                                                    breakStatus = true;
                                                }
                                            }
                                        } catch (error) {
                                            retryCount++
                                            if (retryCount <= 2) {
                                                logger.log('sendMessage-orderProcess-error', `Gagal Follow IG ${targetFollow}, sedang kita coba kembali...`, 200);
                                                await delay(5000);
                                            } else {
                                                logger.log('sendMessage-orderProcess-error', `Waktu retry follow habis, lanjut ke next proses...`, 200);
                                                doneFollowProcess = true;
                                                breakStatus = true;
                                            }

                                        }
                                    } while (!doneFollowProcess);

                                    logger.log('sendMessage-orderProcess-success', `success processing order!`, 200);

                                } else if (element.type == 'Likes') {

                                    let shortCode = '';

                                    if (element.data.includes('http')) {
                                        shortCode = element.data.split('/')[4];
                                    } else {
                                        shortCode = element.data;
                                    }

                                    try {
                                        const resultLikeMedia = await InstaClient.likeMediaByShortCode(shortCode);
                                        if (resultLikeMedia.status && resultLikeMedia.status == 'ok') {
                                            logger.log('sendMessage-orderProcess-success', `Success process data ${element.data}`, 200);
                                            igAccountResultOne.orderId.push(element.orderId)
                                            igAccountResultOne.data.push(element.data)
                                            await queryOrder.updateOneIgAccount({
                                                username: igAccountResultOne.username,
                                            }, {
                                                orderId: igAccountResultOne.orderId,
                                                data: igAccountResultOne.data
                                            });

                                            await queryOrder.updateOneOrder({
                                                orderId: element.orderId
                                            }, {
                                                remains: element.remains - 1
                                            });

                                            const resultNewOrderDetail = await queryOrder.findOneorder({
                                                orderId: element.orderId
                                            });

                                            const orderDetail = resultNewOrderDetail.result.content;
                                            if (orderDetail[0].remains < 1) {
                                                await queryOrder.updateOneOrder({
                                                    orderId: element.orderId
                                                }, {
                                                    status: 'done'
                                                });

                                            }

                                            logger.log('sendMessage-orderProcess-success', `success processing order!`, 200);
                                        } else {
                                            logger.log('sendMessage-orderProcess-error', `Error like data ${element.data}`, 200);
                                        }
                                    } catch (e) {
                                        logger.log('sendMessage-orderProcess-error', `Error like data ${element.data}`, 200);
                                    }

                                }
                            }
                            await helpers.proxyStop()
                        } else {
                            logger.log('sendMessage-orderProcess-error', `tidak ada akun ig untuk memproses data ${element.data}`, 200);
                        }
                    }
                } catch (e) {
                    logger.log('sendMessage-orderProcess-error', `Ada masalah process order untuk data ${element.data} - ${e}`, 200);
                }
            }, (err) => {
                if (err) {
                    logger.log('sendMessage-orderProcess-error', `Ada masalah process order ${e}`, 200);
                }

            });

        }
    });
    cron.start(constant.nameCronJob.orderProcess);
};

module.exports = {
    orderProcess
}