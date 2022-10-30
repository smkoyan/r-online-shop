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
};

exports.getCategoriesTree = async () => {
    /*(select id, name, parentId, 1 as depth
    from Categories
    where parentId is null
    limit 1)*/ // can be used for pagination


    const query = `
            with recursive child_categories(id, name, parentId, depth) as (
                select id, name, parentId, 1 as depth
                from Categories
                where parentId is null
                union all
                select Categories.id, Categories.name, Categories.parentId, depth + 1
                from Categories
                join child_categories on child_categories.id = Categories.parentId
            )
            select id, name, parentId, depth
            from child_categories
    `;

    const categories = await sequelize.query(query, {
        type: QueryTypes.SELECT,
        raw: true,
    });

    return buildTree(categories);
};

const buildTree = categories => {
    const tree = {};

    // build the first level
    categories.filter(c => c.depth === 1)
        .forEach(category => {
            tree[category.id] = {
                ...category,
                children: [],
            };
        });


    // fill in children level by level
    let parentCategories = tree;
    let depth = 2;
    while (true) {
        // this can be optimised by creating a map of all levels
        // by just one linear iteration
        const categoriesOnDepth = categories.filter(c => c.depth === depth);

        if (categoriesOnDepth.length === 0) {
            break;
        }

        const tmp = {};
        categoriesOnDepth.forEach(category => {
            const child = {
                ...category,
                children: [],
            };
            parentCategories[category.parentId].children.push(child);
            tmp[category.id] = child;
        });
        parentCategories = tmp;
        depth++;
    }

    return tree;
}
