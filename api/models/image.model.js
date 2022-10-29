const { DataTypes } = require('sequelize');
const sequelize = require('../db/client');

const Image = sequelize.define('Images', {
    path: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    originalName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Image;
