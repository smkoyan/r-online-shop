const Joi = require('joi');

module.exports = {
    'POST:/api/items': {
        rules: {
            body: Joi.object().keys({
                name: Joi.string().required(),

                description: Joi.string().required(),

                price: Joi.number().precision(2).required(),

                availableCount: Joi.number().positive().required(),

                // the list of tags to be created
                tags: Joi.array().items(Joi.string()),

                // id of category
                category: Joi.number().required(),
            }),
        },

        auto: true,
    },

    'PUT:/api/items/:id': {
        rules: {
            params: Joi.object().keys({
                id: Joi.number().required(),
            }),

            body: Joi.object().keys({
                name: Joi.string(),

                description: Joi.string(),

                price: Joi.number().precision(2),

                availableCount: Joi.number().positive(),

                // id of category
                // category: Joi.number().required(),
            }),
        },

        auto: true,
    },

    'GET:/api/items': {
        rules: {
            query: Joi.object().keys({
                name: Joi.string(),
                description: Joi.string(),
                tags: Joi.array().items(Joi.number()),
            }),
        },

        auto: true,
    },

    'GET:/api/categories/:category/items': {
        rules: {
            params: Joi.object().keys({
                category: Joi.number().required(),
            }),
        },

        auto: true,
    },

    'DELETE:/api/items/:id': {
        rules: {
            params: Joi.object().keys({
                id: Joi.number().required(),
            }),
        },

        auto: true,
    },
};
