const helper = require('../../helpers/helper')
const hash = require('../../helpers/hash')
const query = require('./queries')
const queryCategory = require('../category/queries')
const { v4: uuidv4 } = require('uuid')

const addCourse = async param => {
    const times = helper.generateTime();

    let userId = param.userId;
    delete param.userId;

    const payload = {
        courseId: uuidv4(),
        ...param,
        slug: (param.courseName.replace(' ', '-')+'-'+helper.generateChar(5)).toLowerCase(),
        createdAt: times,
        updatedAt: times,
        courseClick: 0,
        createdBy: userId,
        updatedBy: ''
    }

    const addCourse = await query.insertOneCourse(payload)
    if (addCourse.err) {
        return helper.responseCode(500, addCourse.result.resultDesc)
    }

    return helper.responseCode(0, 'Success add course!', payload)
}

const getAllCourse = async (param) => {

    let pages = parseInt(param.page);
    let sizes = parseInt(param.size);
    let filters = {};

    const sort = {};

    if(param.active === true || param.active === false){
        filters.isActive = param.active
    }

    if (param.sortType && param.sortType == 'price') {
        if (param.sort == 'free') {
            sort.isFree = -1;
        }else{
            sort.price = param.sort == 'asc' ? 1 : param.sort == 'desc' ? -1 : 1;
        }
    }

    if (param.sortType && param.sortType == 'popular') {
        sort.courseClick = param.sort == 'asc' ? 1 : param.sort == 'desc' ? -1 : 1
    }

    if (param.search) {
        filters.courseName = {'$regex' : param.search, '$options' : 'i'}
    }

    
    const findAllCourse = await query.findAllCourse( 
        sort,
        sizes,
        pages,
        filters
    )
    const result = findAllCourse.result.content;

    if (!result) {
        return helper.responseCode(404, 'No Data Found!');
    }

    const countDataCourse = await query.countDataCourse(filters);


    const newResult = result.map(data => {
        delete data._id;
        return data;
    });

    const metaData = {
        page: pages,
        size: sizes,
        totalPages: Math.ceil(countDataCourse.result.content / sizes),
        totalData: countDataCourse.result.content
    };

    const newResults = {
        data: newResult,
        metaData
    }

    return helper.responseCode(0, 'Success get all course!', newResults)
}


const getDetailCourse = async (param) => {
    const findOneCourseBySlug = await query.findOneCourseBySlug(param.slug)
    if (findOneCourseBySlug.err) {
        return helper.responseCode(404)
    }

    const result = findOneCourseBySlug.result.content[0];
    delete result._id;

    await Promise.all(await result.category.map(async data => {
        const categoryResult = await queryCategory.findOneCategoryByCategoryName(data);

        if (!categoryResult.err) {
            await queryCategory.updateOneCategory({
                categoryName: data
            }, {
                categoryClick: categoryResult.result.content[0].categoryClick + 1
            });
        }
    }));

    await query.updateOneCourse({
        slug: param.slug
    }, {
        courseClick: result.courseClick + 1
    });

    return helper.responseCode(0, 'Success get course!', result)
}

const deleteCourse = async (param) => {
    const findOneCourseBySlug = await query.findOneCourseBySlug(param.slug)
    if (findOneCourseBySlug.err) {
        return helper.responseCode(404)
    }

    const payload = {
        active: false
    }

    const params = {
        slug: param.slug
    }

    const updateOneCourse = await query.updateOneCourse(params, payload);
    if (updateOneCourse.err) {
        return helper.responseCode(500, updateOneCourse.result.resultDesc)
    }

    return helper.responseCode(0, 'Success delete course!', false)
}




module.exports = {
    addCourse,
    getAllCourse,
    getDetailCourse,
    deleteCourse
}