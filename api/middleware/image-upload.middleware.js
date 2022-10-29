const multer = require('@koa/multer');
const path = require('path');

// project uses CommonJS modules
// this packages has no support for it
let nanoid;
import('nanoid').then(module => {
    nanoid = module.nanoid;
});


module.exports = function () {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, nanoid() + path.extname(file.originalname));
        }
    });

    return multer({ storage });
};

