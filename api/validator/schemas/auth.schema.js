const Joi = require('joi');

module.exports = {
    'POST:/api/signup': {
        rules: {
            body: Joi.object().keys({
                username: Joi.string().required(),

                password: Joi.string().required(),

                type: Joi.string().valid('seller', 'buyer'),

                // passwordConfirmation: Joi.any().equal(Joi.ref('password')).required(),
            }),
        },

        auto: true,
    },

    'POST:/api/signin': {
        rules: {
            body: Joi.object().keys({
                username: Joi.string().required(),
                password: Joi.string().required(),
            }),
        },

        auto: true,
    },
};
