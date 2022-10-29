const controller = require('../../controllers/category.controller');
const authenticate = require('../../security/authentication');
const allowUserOfType = require('../../security/authorization/allowUserOfType');
const { USER_TYPES } = require('../../enums');

module.exports = router => {
    router
        .post('/categories',
            authenticate,
            allowUserOfType(USER_TYPES.SELLER),
            controller.store,
        )
        .delete('/categories/:id',
            authenticate,
            controller.destroy,
        );
};
