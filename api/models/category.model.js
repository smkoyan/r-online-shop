const { DataTypes } = require('sequelize');
const sequelize = require('../db/client');

const Category = sequelize.define('Categories', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

Category.hasMany(Category, {foreignKey: 'parentId', as: 'subcategories'});
Category.belongsTo(Category, {foreignKey: 'parentId', as: 'parentCategory'})


module.exports = Category;
