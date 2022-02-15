const helper = require('../../helpers/helper')
const authHelper = require('../../auth/jwt_helper')
const hash = require('../../helpers/hash')
const query = require('./queries')
const queryCourse = require('../course/queries')
const { v4: uuidv4 } = require('uuid')

const sigIn = async (param) => {
    try {
        const times = helper.generateTime();
        const phoneNumber = param.username;
        const getUser = await query.findOneUserByphoneNumber(phoneNumber)
        let userData;

        if (getUser.err) {
            return helper.responseCode(404)
        } else if (!getUser.result.content) {
            return helper.responseCode(400, 'Incorrect username or password!')
        } else {
            userData = getUser.result.content[0];
        }

        if (!userData.active) {
            return helper.responseCode(401, 'This account currently inactive!')
        }

        if (hash.passwordDecrypt(userData.password) !== param.password) {
            return helper.responseCode(400, 'Incorrect username or password!')
        }

        const data = {
            lastLogin: times
        }

        const params = {
            phoneNumber
        }

        await query.updateOneUser(params, data);

        const resultToken = authHelper.generateToken({
            userId: userData.userId,
            phoneNumber: userData.phoneNumber,
            email: userData.email
        });

        delete userData._id;

        const result = {
            ...resultToken
        }


        return helper.responseCode(0, 'Success!', result)
    }catch(e){
        return helper.responseCode(500, 'Gagal Login!', false)
    }

}

const register = async param => {
    const times = helper.generateTime();
    const findUserByEmail = await query.findOneUserByphoneNumber(param.phoneNumber)
    if (!findUserByEmail.err) {
        return helper.responseCode(409, '', false)
    }

    const passwordHash = hash.passwordEncrypt(param.password);
    delete param.password

    const payload = {
        userId: uuidv4(),
        ...param,
        lastLogin: '',
        password: passwordHash,
        active: true,
        createdAt: times,
        updatedAt: times,
    }

    const registerUser = await query.insertOneUser(payload)
    if (registerUser.err) {
        return helper.responseCode(500, registerUser.result.resultDesc)
    }
    return helper.responseCode(0, 'Success register user!', true)
}

const getAllUser = async (param) => {
    const findAllUser = await query.findManyUsers({})
    const result = findAllUser.result.content;
    const newResult = result.map(data => {
        delete data._id;
        return data;
    })
    return helper.responseCode(0, 'Success get all user!', newResult)
}

const getDetailUser = async (param) => {
    const findOneUserByUserId = await query.findOneUserByUserId(param.userId)
    if (findOneUserByUserId.err) {
        return helper.responseCode(404)
    }
    const result = findOneUserByUserId.result.content[0];
    delete result._id;
    return helper.responseCode(0, 'Success get user!', result)
}


const updateUser = async param => {
    const times = helper.generateTime();
    const findOneUserByUserId = await query.findOneUserByUserId(param.userId)
    if (findOneUserByUserId.err) {
        return helper.responseCode(404, '', false)
    }

    const oldDataUser = findOneUserByUserId.result.content[0];

    const newActive = typeof param.active != 'undefined' ? param.active.toString() : '';

    const payload = {
        email: param.email ? param.email : oldDataUser.email,
        password: param.password ? hash.passwordEncrypt(param.password) : oldDataUser.password,
        name: param.name ? param.name : oldDataUser.name,
        phoneNumber: param.phoneNumber ? param.phoneNumber : oldDataUser.phoneNumber,
        role: param.role ? param.role : oldDataUser.role,
        active: newActive ? param.active : oldDataUser.active ? oldDataUser.active : false,
        updatedAt: times,
    }

    const params = {
        userId: param.userId
    }

    const updateUser = await query.updateOneUser(params, payload);
    if (updateUser.err) {
        return helper.responseCode(500, updateUser.result.resultDesc)
    }
    return helper.responseCode(0, 'Success update user!', true)
}

const deleteUser = async (param) => {
    const findOneUserByUserId = await query.findOneUserByUserId(param.userId)
    if (findOneUserByUserId.err) {
        return helper.responseCode(404)
    }

    const payload = {
        active: false
    }

    const params = {
        userId: param.userId
    }

    const updateUser = await query.updateOneUser(params, payload);
    if (updateUser.err) {
        return helper.responseCode(500, updateUser.result.resultDesc)
    }

    return helper.responseCode(0, 'Success delete user!', false)
}

const analythic = async (param) => {

    const countDataUser = await query.countDataUser({});
    const countDataCourse = await queryCourse.countDataCourse({});
    const countDataCourseFree = await queryCourse.countDataCourse({
        isFree: true
    });

    const result = {
        user: countDataUser.result.content,
        course: {
            totalCourse: countDataCourse.result.content,
            totalFreeCourse: countDataCourseFree.result.content
        }
    }

    return helper.responseCode(0, 'Success get analytic!', result)
}



module.exports = {
    register,
    getAllUser,
    sigIn,
    updateUser,
    getDetailUser,
    deleteUser,
    analythic
}