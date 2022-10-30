const categoryManager = require('../managers/category.manager');
const Category = require('../models/category.model');

exports.store = async ctx => {
    try {
        const { name, parentId } = ctx.request.body;

        let categoryId;

        if (!parentId) {
            categoryId = await categoryManager.storeCategory(name);
        } else {
            categoryId = await categoryManager.storeSubcategory(name, parentId);

            if (!categoryId) {
                ctx.status = 400;
                ctx.body = {
                    message: 'please provide correct parent category',
                };
                return;
            }
        }

        ctx.status = 201;
        ctx.body = {
            id: categoryId,
        };
    } catch (error) {
        console.error(error);
        ctx.status = 500;
    }
};


exports.index = async ctx => {
    ctx.body = await categoryManager.getCategoriesTree();
    ctx.status = 200;
};


exports.destroy = async ctx => {
    // deleting category which is associated with item
    // will leave that item without category assigned
    // and without a way to find item under that category
    // there are 2 ways to perform this action
    // restrict deletion if there is any associated item or
    // delete and leave item without category

    const id = ctx.params.id;

    const category = await Category.findByPk(id, {
        attributes: ['id'],
    });

    if (category === null) {
        ctx.status = 404;
        ctx.body = {
            message: `category with id(${id}) not found`,
        };
        return;
    }

    const hasItem = (await category.countItems()) > 0;

    if (hasItem) {
        ctx.status = 400;
        ctx.body = {
            message: 'Categories associated with items can\'t be deleted',
        };
        return;
    }

    // ownership of category is not checked as per requirement
    // seller should be able to create categories
    // but categories can be used by other sellers to assign to their items
    // thus for now every seller is considered as admin
    await category.destroy();
    ctx.status = 204;
};

