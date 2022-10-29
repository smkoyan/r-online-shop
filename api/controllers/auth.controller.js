const User = require('../models/user.model');
require('../models/item_category.model');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.signup = async ctx => {
    let user = ctx.request.body;

    try {
        user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());
        user = await User.create(user);

        ctx.status = 201;
        ctx.body = {
            id: user.id,
        };
    } catch (error) {
        // check for existing username can be done in try body
        // by trying to find user by that username or by checking
        // error caused by insert operation like here without
        // additional db query
        if (error.name === 'SequelizeUniqueConstraintError') {
            ctx.status = 409;
            ctx.body = { message: `User with username(${user.username}) already exists` };
            return;
        }

        console.error(error);
        ctx.status = 500;
    }
};

exports.signin = async ctx => {
    try {
        const { username } = ctx.request.body;

        const user = await User.findOne({
            where: {
                username,
            },
            attributes: ['id', 'password', 'type'],
        });


        if (user === null) {
            ctx.status = 400;
            ctx.body = {
                message: 'Wrong username or password',
            };
            return;
        }

        const password = ctx.request.body.password;

        if (! (await bcrypt.compare(password, user.password))) {
            ctx.status = 400;
            ctx.body = {
                message: 'Wrong email or password',
            };
            return;
        }

        // to make the logic of token signing reusable and clear
        // controller action code we can extract this logic
        // to it's dedicated `manager` (auth manager)
        // also environment variables may be taken from `config`
        const token = jwt.sign({
            id: user.id,
            username,
            type: user.type,
        }, config.app.key, {
            expiresIn: config.jwt.expiresIn,
        });

        ctx.body = {
            success: true,
            token,
        };
    } catch (error) {
        console.error(error);
        ctx.status = 500;
    }
};
