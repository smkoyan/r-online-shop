const { DataTypes } = require('sequelize');
const sequelize = require('../db/client');

const Item = require('./item.model');
const Category = require('./category.model');

const ItemCategories = sequelize.define('ItemCategories', {
    ItemId: {
        type: DataTypes.INTEGER,
        references: {
            model: Item, // 'Items' would also work
            key: 'id'
        }
    },

    CategoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Category, // 'Categories' would also work
            key: 'id'
        }
    }
});

Item.belongsToMany(Category, { through: ItemCategories });
Category.belongsToMany(Item, { through: ItemCategories });

module.exports = ItemCategories;
