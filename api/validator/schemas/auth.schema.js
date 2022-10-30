const Joi = require('joi');
const { USER_TYPES } = require('../../enums');

module.exports = {
    'POST:/api/signup': {
        rules: {
            body: Joi.object().keys({
                username: Joi.string().required(),

                password: Joi.string().required(),

                type: Joi.string().valid(...Object.values(USER_TYPES)),

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
