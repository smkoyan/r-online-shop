require('dotenv').config();

const Koa = require('koa');
const koaBody = require('koa-body');
const serve = require('koa-static');
const cors = require('@koa/cors');

const sequelize = require('./api/db/client');

// synchronize sequelize models with database
sequelize.sync().then(() => {
    console.log('database models successfully synced');
}).catch(error => {
    console.log('error happened during database sync', error);
    process.exit(1);
});


const app = new Koa();

// would be better to configure client facing server like nginx
// to host this static directory for images
app.use(serve('./uploads'));

// http body parser middleware
// multipart form data is not parsed by default
// multer package used for particular endpoints
app.use(koaBody({}));

// allow cors for development purposes to access
// server from different domains in case of deployed backend
app.use(cors({
    credentials: true,
}));

// router configuration
const router = require('./api/router');
app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
