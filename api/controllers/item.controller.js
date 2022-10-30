const Category = require('../models/category.model');
const Tag = require('../models/tag.model');
const Item = require('../models/item.model');
const Image = require('../models/image.model');
const itemManager = require('../managers/item.manager');
const categoryManager = require('../managers/category.manager');
const { unlink } = require('fs/promises');

exports.store = async ctx => {
    try {
        const { user } = ctx.state;
        const itemData = ctx.request.body;

        // check if provided Category exists
        const category = await Category.findOne({
            where: {
                id: itemData.category,
            },
            attributes: ['id'],
        });

        if (category === null) {
            ctx.status = 400;
            ctx.body = {
                message: 'Please provide correct category',
            };
            return;
        }

        const item = await Item.create({
            ...itemData,
            UserId: user.id,
        });

        // also includes provided category
        // this method can be used solely to check category existence
        // and also to fetch whole hierarchy of categories
        const categories = await categoryManager.getParentCategories(category.id);

        await item.addCategories(categories);

        let { tags } = itemData;

        if (tags) {
            tags = tags.map(tag => ({name: tag, ItemId: item.id}));
            await Tag.bulkCreate(tags);
        }

        ctx.status = 201;
        ctx.body = {
            id: item.id,
        };
    } catch (error) {
        console.error(error);
        ctx.status = 500;
    }
};

exports.update = async ctx => {
    const updatedFields = ctx.request.body;

    // authorization middleware which is used to check
    // ownership of item which is going to be updated
    // fetches item from database and stores it in request context
    // to narrow down database usage
    const item = ctx.state.instance;

    // as the fields are already validated in joi validator middleware
    // there is no need to list fields one by one to prevent excessive fields
    await item.update(updatedFields);

    ctx.status = 200;
    ctx.body = {
        message: 'Item has been successfully updated',
    };
};


// not paginated endpoint yet
exports.index = async ctx => {
    const query = ctx.query;

    const filter = await itemManager.buildSearchFilter(query);

    const items = await Item.findAll({
        where: filter,
        include: {
            model: Image,
            attributes: ['path']
        },
        attributes: { exclude: ['updatedAt'] },
        row: true,
    });

    ctx.body = {
        items,
    };
};

exports.byCategory = async ctx => {
    const categoryId = ctx.params.category;

    const category = await Category.findOne({
        where: {
            id: categoryId,
        },
        attributes: [],

        include: {
            model: Item,
            attributes: {exclude: ['createdAt', 'updatedAt']},
            through: {
                attributes: [],
            }
        },
    });

    // instead of throwing not found return empty result
    // to not provide unnecessary information about
    // category existence
    ctx.body = {
        items: category === null ? [] : category.Items,
    };
}


exports.storeImages = async ctx => {
    const id = ctx.params.id;
    const userId = ctx.state.user.id;

    const item = await Item.findOne({
        where: {
            id,
            UserId: userId,
        },
        attributes: ['id'],
    });


    // if the authorization check fails
    // already uploaded files should be deleted to not make mess
    // files can be deleted right after authorization fail,
    // or they can be deleted using jobs
    // this can be avoided by creating separate authorization middleware
    // which will work before `multer` middleware and will stop action
    // before reaching to file storing logic
    if (item === null) {
        await Promise.all(ctx.files.map(file => unlink(file.path)));

        ctx.status = 403;
        ctx.body = {
            message: 'you are not allowed to perform this action',
        };
        return;
    }

    const imagesData = ctx.files.map(file => {
        return {
            path: file.path,
            originalName: file.originalname,
            ItemId: item.id,
        };
    })

    const images = await Image.bulkCreate(imagesData);

    ctx.status = 201;
    ctx.body = images.map(({id, path}) => ({
        id,
        path
    }));
};

exports.destroy = async ctx => {
    const id = ctx.params.id;
    const userId = ctx.state.user.id;

    const item = await Item.findOne({
        where: {
            id,
            UserId: userId,
        },
        attributes: ['id'],
        include: {
            model: Image,
            attributes: ['path'],
        }
    });

    // in case of not found item and item belonging to other user
    // the same forbidden error are thrown
    // to not give detail to client about not found items
    if (item === null) {
        ctx.status = 403;
        ctx.body = {
            message: 'you are not allowed to perform this action',
        };
        return;
    }

    // remove item images
    await Promise.all(item.Images.map(image => unlink(image.path)));
    // remove item itself
    await item.destroy();

    ctx.status = 204;
};


exports.create = async ctx => {
    ctx.set('Content-Type', 'text/html');
    ctx.body = `
<!doctype html>
<html>
  <body>
    <form action="/api/items/1/images" enctype="multipart/form-data" method="post">
    <input type="file" name="uploads" multiple="multiple"><br>
    <input type="text" name="text" placeholder="text"><br>
    <button type="submit">Upload</button>
    </form>
  </body>
</html>`;

};
