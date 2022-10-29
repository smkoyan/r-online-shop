const controller = require('../../controllers/auth.controller');

module.exports = router => {
    router
        .post('/signup',
            controller.signup,
        )
        .post('/signin',
            controller.signin,
        );
};
