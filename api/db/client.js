const { Sequelize } = require('sequelize');
const dbConfig = require('../config').db;


const host = dbConfig.host;
const database = dbConfig.database;
const username = dbConfig.username;
const password = dbConfig.password;

const dialect = 'mysql';

const sequelize = new Sequelize(database, username, password, {
    host,
    dialect,
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(error => {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
});

module.exports = sequelize;
