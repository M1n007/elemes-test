const helper = require('../../helpers/helper')
const hash = require('../../helpers/hash')
const query = require('./queries')
const { v4: uuidv4 } = require('uuid')

const addCategory = async param => {
    const times = helper.generateTime();

    let userId = param.userId;
    delete param.userId;

    const payload = {
        categoryId: uuidv4(),
        ...param,
        createdAt: times,
        updatedAt: times,
        categoryClick: 0,
        active: true,
        createdBy: userId,
        updatedBy: ''
    }

    const addCategory = await query.insertOneCategory(payload)
    if (addCategory.err) {
        return helper.responseCode(500, addCategory.result.resultDesc)
    }

    return helper.responseCode(0, 'Success add category!', payload)
}

const getAllCategory= async (param) => {

    let pages = parseInt(param.page);
    let sizes = parseInt(param.size);
    let filters = {};

    const sort = {};

    if(param.active === true || param.active === false){
        filters.isActive = param.active
    }

    if (param.sortType && param.sortType == 'popular') {
        sort.categoryClick = param.sort == 'asc' ? 1 : param.sort == 'desc' ? -1 : 1
    }

    if (param.search) {
        filters.categoryName = {'$regex' : param.search, '$options' : 'i'}
    }

    
    const findAllCategory = await query.findAllCategory( 
        sort,
        sizes,
        pages,
        filters
    )
    const result = findAllCategory.result.content;

    if (!result) {
        return helper.responseCode(404, 'No Data Found!');
    }

    const countDataCategory = await query.countDataCategory(filters);


    const newResult = result.map(data => {
        delete data._id;
        return data;
    });

    const metaData = {
        page: pages,
        size: sizes,
        totalPages: Math.ceil(countDataCategory.result.content / sizes),
        totalData: countDataCategory.result.content
    };

    const newResults = {
        data: newResult,
        metaData
    }

    return helper.responseCode(0, 'Success get all category!', newResults)
}

const deleteCategory = async (param) => {
    const findOneCategoryByCategoryId = await query.findOneCategoryByCategoryId(param.categoryId)
    if (findOneCategoryByCategoryId.err) {
        return helper.responseCode(404)
    }

    const payload = {
        active: false
    }

    const params = {
        categoryId: param.categoryId
    }

    const updateOneCategory = await query.updateOneCategory(params, payload);
    if (updateOneCategory.err) {
        return helper.responseCode(500, updateOneCourse.result.resultDesc)
    }

    return helper.responseCode(0, 'Success delete category!', false)
}




module.exports = {
    addCategory,
    getAllCategory,
    deleteCategory
}