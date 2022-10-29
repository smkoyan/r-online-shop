// authorization middleware to allow only some type
// of user perform action after this middleware
module.exports = type => async (ctx, next) => {
    const user = ctx.state.user;

    if (!user) {
        await next();
    }

    if (user.type !== type) {
        ctx.status = 403;
        ctx.body = {
            message: 'you are not allowed to perform this action',
        };
        return;
    }

    await next();
};
