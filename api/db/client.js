const { Sequelize } = require('sequelize');


const database = 'renderforest_online_shop';
const username = 'root';
const password = '';

const host = '127.0.0.1'; // fails to connect to localhost
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
