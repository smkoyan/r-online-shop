const controller = require('../../controllers/item.controller');
const authenticate = require('../../security/authentication');
const upload = require('../../middleware/image-upload.middleware')();
const authorizeOwnerShipOf = require('../../security/authorization/authorizeOwnershipOf');
const Item = require('../../models/item.model');

module.exports = router => {
    router
        .get('/items',
            controller.index,
        )
        .post('/items',
            authenticate,
            controller.store,
        )
        .put('/items/:id',
            authenticate,
            authorizeOwnerShipOf(Item, ['id']),
            controller.update,
        )
        .delete('/items/:id',
            authenticate,
            controller.destroy,
        )
        .get('/categories/:category/items',
            controller.byCategory,
        )
        .post('/items/:id/images',
            authenticate,
            upload.array('uploads'),
            controller.storeImages,
        )
        .get('/items/images/create',
            controller.create,
        );
};
