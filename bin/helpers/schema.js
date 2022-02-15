const Joi = require('joi');
const validate = require('validate.js');
const helper = require('../helpers/helper');
const badRequest = helper.badRequest;
const constant = require('./constants');

const validatePayload = (param, schema) => {
    const { value, error } = Joi.validate(param, schema);
    if (!validate.isEmpty(error)) {
        return { err: true, data: badRequest(error.details) }
    }
    return { err: false, data: value }
}

const signIn = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required()
})

const refreshToken = Joi.object().keys({
    token: Joi.string().required(),
})

const rolesKey = Joi.object().keys({
    roleId: Joi.string().valid(constant.ROLES.ADMIN, constant.ROLES.USER),
})

const registers = Joi.object().keys({
    email: Joi.string(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    role: Joi.array().items(rolesKey).required()
})



const updateUser = Joi.object().keys({
    userId: Joi.string().required(),
    email: Joi.string(),
    password: Joi.string(),
    name: Joi.string(),
    phoneNumber: Joi.string(),
    role: Joi.array().items(rolesKey),
    active: Joi.bool()
})

const getOneUser = Joi.object().keys({
    userId: Joi.string().required()
})


const getUser = Joi.object().keys({
    page: Joi.number().default(1),
    max: Joi.number().default(10)
})

const getRandom = Joi.object().keys({
    tags: Joi.string().default('quotes')
})


const mediaValidate = Joi.object({
    files: Joi.object().required()
})

const addCourse = Joi.object().keys({
    userId: Joi.string().required(),
    courseName: Joi.string().required(),
    courseImageUrl: Joi.string().optional().allow(''),
    isFree: Joi.bool().optional().default(false),
    active: Joi.bool(),
    category:  Joi.array().optional().allow([]),
    price: Joi.number().when('isFree',
    {
      is: false,
      then: Joi.number().required(),
      otherwise: Joi.number().optional(),
    }),
    discount: Joi.bool().optional().default(false),
    discountPrice: Joi.number().when('discount',
    {
      is: true,
      then: Joi.number().required(),
      otherwise: Joi.number().optional(),
    })
})

const getCourse = Joi.object().keys({
    page: Joi.number().default(1),
    size: Joi.number().default(10),
    search: Joi.string().optional().allow(''),
    sort: Joi.string().optional(),
    sortType: Joi.string().when('sort',
    {
      is: Joi.any().valid(null, ""),
      then: Joi.string().optional(),
      otherwise: Joi.string().required().valid('price', 'popular')
    }),
    active: Joi.bool().optional()
})

const detailCourse = Joi.object().keys({
    slug: Joi.string().required()
})

const addCategory = Joi.object().keys({
    userId: Joi.string().required(),
    categoryName: Joi.string().required(),
    categoryIconUrl: Joi.string().optional().allow('')
})

const getCategory = Joi.object().keys({
    page: Joi.number().default(1),
    size: Joi.number().default(10),
    search: Joi.string().optional().allow(''),
    sort: Joi.string().optional(),
    sortType: Joi.string().when('sort',
    {
      is: Joi.any().valid(null, ""),
      then: Joi.string().optional(),
      otherwise: Joi.string().required().valid('popular')
    }),
    active: Joi.bool().optional()
})


const deleteCategory = Joi.object().keys({
    categoryId: Joi.string().required()
})






module.exports = {
    validatePayload,
    signIn,
    refreshToken,
    registers,
    updateUser,
    getUser,
    getOneUser,
    getRandom,
    mediaValidate,
    addCourse,
    getCourse,
    detailCourse,
    addCategory,
    deleteCategory,
    getCategory
}