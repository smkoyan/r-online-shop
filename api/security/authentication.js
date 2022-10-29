const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = async (ctx, next) => {
    let token = ctx.get('Authorization').trim();

    if (token === '') {
        token = ctx.query.token;
    }

    if (typeof token === 'undefined') {
        ctx.status = 401;
        ctx.body = {message: 'Token not found or has been expired'};
        return;
    }

    let decoded = null;

    try {
        // here the synchronous version of verify api used
        // as all the internal logic happens synchronously
        // https://github.com/auth0/node-jsonwebtoken/issues/111#issuecomment-122368376
        decoded = jwt.verify(token, config.app.key);
    } catch (error) {
        ctx.status = 401;
        ctx.body = {message: 'Token not found or has been expired'};
        return;
    }

    ctx.state.user = {
        id: decoded.id,
        username: decoded.username,
        type: decoded.type,
    };

    await next();
};
