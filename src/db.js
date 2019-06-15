const Sequelize = require('sequelize');

require('dotenv').config();

const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PW = process.env.MYSQL_PASSWORD;
let MYSQL_HOST = process.env.MYSQL_HOST;
let MYSQL_SCHEMA = 'delivery';
if (process.env.NODE_ENV === 'test') {
    MYSQL_SCHEMA = 'test';
    MYSQL_HOST = process.env.MYSQL_TEST_HOST;
}

const sequelize = new Sequelize(
    `mysql://${MYSQL_USER}:${MYSQL_PW}@${MYSQL_HOST}/${MYSQL_SCHEMA}`,{
        define: {
            timestamps: false
        },
        logging: false
    }
);

const models = require('./models')(sequelize);

module.exports = {
    connection: sequelize,
    ...models
}