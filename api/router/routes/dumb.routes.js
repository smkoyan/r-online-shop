module.exports = router => {
    router
        .get('/dumb', (ctx => {
            ctx.body = 'dumb route response';
        }));
};