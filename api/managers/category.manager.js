const Category = require('../models/category.model');
const sequelize = require('../db/client');
const { QueryTypes } = require('sequelize');

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
};

exports.getParentCategories = async id => {
    const query = `
                with recursive parent_categories(id, name, parentId) as (
                    select id, name, parentId
                    from Categories
                    where id = ?
                    union all
                    select Categories.id, Categories.name, Categories.parentId
                    from Categories
                    join parent_categories on parent_categories.parentId = Categories.id
                )
                select id, name, parentId
                from parent_categories
            `;

    const categories = await sequelize.query(query, {
        type: QueryTypes.SELECT,
        model: Category,
        replacements: [id],
    });

    return categories.length ? categories : null;
}
