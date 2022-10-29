const Router = require('koa-router');

const router = new Router({
    prefix: '/api',
});

router.use(require('../validator').middleware);

(function loadRoutes (dir) {
    const fs = require('fs');

    fs.readdirSync(`${__dirname}/${dir}`).forEach(filename => {
        if ( filename.endsWith('.js') ) {
            require(`${__dirname}/${dir}/${filename}`)(router);
        } else {
            loadRoutes(`${dir}/${filename}`);
        }
    });
})('routes');

module.exports = router;