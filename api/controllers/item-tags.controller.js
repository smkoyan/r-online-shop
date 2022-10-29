const Item = require('../models/item.model');
const Tag = require('../models/tag.model');

// to not make update endpoint of items too huge
// separate endpoints would be provided here to control
// tags of items


// retrieve tags of particular item
// can also be done in get endpoint of item itself
// as nested field of item response body
exports.index = async ctx => {
    const item = ctx.state.instance;

    ctx.body = await item.getTags({
        attributes: ['id', 'name']
    });
    ctx.status = 200;
};

// add new tags to item
exports.store = async ctx => {
    const tags = ctx.request.body.tags;

    const item = ctx.state.instance;

    ctx.status = 201;
    ctx.body = await Tag.bulkCreate(tags.map(tag => {
        return {
            name: tag,
            ItemId: item.id,
        }
    }));
};

// remove tag from item
// can be done in tags controller which would be better idea
exports.destroy = async ctx => {

};
