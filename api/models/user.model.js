const { DataTypes } = require('sequelize');
const sequelize = require('../db/client');

const Item = require('./item.model');

const User = sequelize.define('Users', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'buyer',
        validate: {
            isIn: [['seller', 'buyer']],
        },
    },
});

User.hasMany(Item);
Item.belongsTo(User);

module.exports = User;
