const { Op } = require("sequelize");
const Tag = require("../models/tag.model");

exports.buildSearchFilter = async query => {
    const filter = {
        [Op.or]: []
    };

    if (query.name) {
        filter[Op.or].push({
            name: {
                [Op.substring]: query.name,
            }
        });
    }

    if (query.description) {
        filter[Op.or].push({
            description: {
                [Op.substring]: query.description,
            }
        });
    }

    if (query.tags) {
        const tags = await Tag.findAll({
            where: {
                id: query.tags,
            },
            attributes: ['ItemId'],
            group: 'ItemId',
            raw: true,
        });

        const itemIds = tags.map(tag => tag.ItemId);

        filter[Op.or].push({
            id: itemIds,
        });
    }

    return filter[Op.or].length ? filter : {};
};