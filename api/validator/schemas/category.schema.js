const Joi = require('joi');

module.exports = {
    'POST:/api/categories': {
        rules: {
            body: Joi.object().keys({
                name: Joi.string().required(),
                // id of parent category
                parentId: Joi.number(),
            }),
        },

        auto: true,
    },

    'DELETE:/api/categories/:id': {
        rules: {
            params: Joi.object().keys({
                id: Joi.number().required(),
            }),
        },

        auto: true,
    }
};
