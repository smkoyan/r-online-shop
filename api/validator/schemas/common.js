const Joi = require('joi');

module.exports = {
    email: Joi.string().email({ minDomainAtoms: 2 }),
};
