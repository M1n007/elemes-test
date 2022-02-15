const jwt = require('jsonwebtoken');
const globalConfig = require('../configs/globalConfigs');
const helper = require('../helpers/helper');
const constants = require('../helpers/constants');
const connection = require('../helpers/databases/mysql/mysql').connection
const authQuery = require('../routes/auth/queries');

const generateTokenAuth = payload => {
    const verifyOptions = {
        issuer: 'archv',
        expiresIn: '1d'
    };
    return jwt.sign(payload, globalConfig.get('/').jwtSecret, verifyOptions)
};

const generateRefreshToken = payload => {
    const verifyOptions = {
        issuer: 'archv',
        expiresIn: '30d'
    };
    const tokenRefresh = jwt.sign(payload, globalConfig.get('/').jwtRefresh, verifyOptions)
    return tokenRefresh
};

const generateToken = payload => {
    return {
        accessToken: generateTokenAuth(payload),
        refreshToken: generateRefreshToken(payload)
    }
}

const getToken = headers => {
    if (headers && headers.authorization && headers.authorization.includes('Bearer')) {
        const parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        }
    }
    return undefined;
};

const init = async (req, res, next) => {
    const UnauthorizedError = helper.responseCode(401).result
    const permissionDenied = helper.response(403, 403, 'Permission denied!', false).result
    const originalUrl = req.originalUrl
    const endpointWithoutAuth = constants.endpointWithoutAuth;

    const cantAccessBy = {
        superadmin: [],
        polres: [],
        guest: [],
    }

    const newOriginalUrl = originalUrl.includes('?') ? originalUrl.split('?')[0] : originalUrl;
    if (!endpointWithoutAuth.includes(newOriginalUrl)) {
        const token = getToken(req.headers)
        if (token) {
            try {
                decodeToken = jwt.verify(token, globalConfig.get('/').jwtSecret)
            } catch (error) {
                res.status(401).json(UnauthorizedError)
            }

            req.user = {
                email: decodeToken.email,
                userPhone: decodeToken.phoneNumber,
                userId: decodeToken.userId
            }
        } else {
            res.status(401).json(UnauthorizedError)
        }
    }
    next()
}

const checkRefreshToken = async token => {
    const refreshToken = await connection
        .promise()
        .query(
            `SELECT A.user_id, B.role, B.province_id, B.sector_id FROM token_tmp A
            INNER JOIN users B on B.id = A.user_id
             WHERE expired >= CURDATE() AND token=? LIMIT 1 `,
            [token]
        ).then(([rows, fields]) => {
            return { err: false, result: rows };
        }).catch(e => {
            console.log("getUser --> ", e)
            return { err: true, result: false };
        });

    if (refreshToken.err) {
        return refreshToken
    } else if (!refreshToken.result.length) {
        return { err: true, result: false }
    } else {
        return {
            err: false,
            result: generateToken({
                user_id: refreshToken.result[0].user_id,
                role: refreshToken.result[0].role,
                province_id: refreshToken.result[0].province_id,
                sector_id: refreshToken.result[0].sector_id
            })
        }
    }
}

const verifyTokenBasic = async (req, res, next) => {
    const UnauthorizedError = helper.responseCode(401).result
    const permissionDenied = helper.response(403, 403, 'Permission denied!', false).result
    const token = getToken(req.headers)
    if (token) {
        try {
            decodeToken = jwt.verify(token, globalConfig.get('/').jwtSecret)
        } catch (error) {
            res.status(401).json(UnauthorizedError)
        }

        req.user = {
            email: decodeToken.email,
            userId: decodeToken.userId
        }
    } else {
        res.status(403).json(permissionDenied)
    }
    next();
};

const isAdmin = async (req) => {
    const token = getToken(req.headers)
    let decodeToken;
    if (token) {
        try {
            decodeToken = jwt.verify(token, globalConfig.get('/').jwtSecret)
        } catch (error) {
            res.status(401).json(UnauthorizedError)
        }

        const dataUser = await authQuery.findOneUserByUserId(decodeToken.userId)
        const detailDataUser = dataUser.result.content[0];
        const isAdminRole = detailDataUser.role.filter(x => x.roleId == 'admin');

        if (isAdminRole.length >= 1) {
            return true;
        }

        return false;
    }
};



module.exports = {
    generateToken,
    init,
    checkRefreshToken,
    verifyTokenBasic,
    isAdmin
}