module.exports = (model, attributes = []) => async (ctx, next) => {
    const user = ctx.state.user;

    if (!user) {
        await next();
    }

    const filter = {
        where: {
            id: ctx.params.id,
            UserId: user.id,
        },
    };

    if (attributes.length) {
        filter.attributes = attributes;
    }

    const instance = await model.findOne(filter);

    if (instance === null) {
        ctx.status = 403;
        ctx.body = {
            message: 'you are not allowed to perform this action',
        };
        return;
    }

    ctx.state.instance = instance;

    await next();
};
