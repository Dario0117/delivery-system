const Sequelize = require('sequelize');

require('dotenv').config();

const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PW = process.env.MYSQL_PASSWORD;
const MYSQL_HOST = process.env.MYSQL_HOST; 

const sequelize = new Sequelize(
    `mysql://${MYSQL_USER}:${MYSQL_PW}@${MYSQL_HOST}/delivery`,{
        define: {
            timestamps: false
        }
    }
);

const models = require('./models')(sequelize);

module.exports = {
    connection: sequelize,
    ...models
}