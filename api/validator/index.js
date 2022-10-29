const Joi = require('joi');
const schemas = loadSchemas();

const payloads = {
    params: ctx => {
        const layer = ctx.matched[1];

        return layer.params(ctx.path, layer.captures(ctx.path));
    },

    query: ctx => ctx.query,

    body: ctx => ctx.request.body,
};

exports.middleware = async (ctx, next) => {
    const schema = getSchema(ctx);

    if (typeof schema === 'undefined' || schema.auto === false) {
        await next();
        return;
    }

    for (const payload in payloads) {
        const rules = schema.rules[payload];

        if (typeof rules === 'undefined') {
            continue;
        }

        const result = Joi.validate(payloads[payload](ctx), rules);

        if (result.error !== null) {
            //ctx.throw(422, result.error);
            ctx.status = 422;
            ctx.body = result.error;

            return;
        }
    }

    await next();
};

exports.validate = (ctx, payloads) => {
    const schema = getSchema(ctx);

    if (typeof schema === 'undefined') {
        return {success: true};
    }

    for (const payload in payloads) {
        if (!payloads.hasOwnProperty(payload)) {
            continue;
        }

        const rules = schema.rules[payload];

        if (typeof rules === 'undefined') {
            continue;
        }

        const result = Joi.validate(payloads[payload], rules);

        if (result.error !== null) {
            return {
                success: false,
                error: result.error,
            };
        }
    }

    return {success: true};
};

function getSchema(ctx) {
    const method = ctx.request.method;
    const route = ctx._matchedRoute;
    const path = `${method}:${route}`;

    return schemas[path];
}

function loadSchemas() {
    const schemas = {};
    const fs = require('fs');

    fs.readdirSync('api/validator/schemas').forEach(filename => {
        if (filename.endsWith('.js') && filename !== 'common.js') {
            Object.assign(schemas, require(`./schemas/${filename}`));
        }
    });

    return schemas;
}
