const Category = require('../models/category.model');

exports.storeCategory = async name => {
    const category = await Category.create({name});

    return category.id;
};

exports.storeSubcategory = async (name, parentId) => {
    const parentCategory = await Category.findOne({
        where: {
            id: parentId,
        },
        attributes: ['id']
    });


    if (parentCategory === null) {
        return null;
    }

    const category = await Category.create({name, parentId});
    return category.id;
}