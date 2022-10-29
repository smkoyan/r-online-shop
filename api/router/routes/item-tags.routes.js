const controller = require('../../controllers/item-tags.controller');
const authenticate = require('../../security/authentication');
const authorizeOwnerShipOf = require('../../security/authorization/authorizeOwnershipOf');
const Item = require('../../models/item.model');

module.exports = router => {
    router
        .get('/items/:id/tags',
            controller.index,
        )
        .post('/items/:id/tags',
            authenticate,
            authorizeOwnerShipOf(Item, ['id']),
            controller.store,
        );
};
