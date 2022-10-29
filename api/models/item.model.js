const { DataTypes } = require('sequelize');
const sequelize = require('../db/client');

const Image = require('./image.model');
const Tag = require('./tag.model');

const Item = sequelize.define('Items', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },

    availableCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

Item.hasMany(Image, {
    onDelete: 'cascade',
});
Image.belongsTo(Item);

Item.hasMany(Tag, {
    onDelete: 'cascade',
});
Tag.belongsTo(Item);

module.exports = Item;
