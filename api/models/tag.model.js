const { DataTypes } = require('sequelize');
const sequelize = require('../db/client');

const Tag = sequelize.define('Tags', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Tag;
