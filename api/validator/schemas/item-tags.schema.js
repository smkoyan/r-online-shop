const Joi = require('joi');

module.exports = {
    'POST:/api/items/:id/tags': {
        rules: {
            params: Joi.object().keys({
                id: Joi.number().required(),
            }),

            body: Joi.object().keys({
                tags: Joi.array().items(Joi.string()),
            }),
        },

        auto: true,
    },
};
