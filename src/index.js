require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const passport = require('passport');
const cors = require('cors');
const { connection, Driver } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

require('./auth')();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use('/', routes);

if (process.env.NODE_ENV !== 'test') {
    connection
        .sync()
        .then(() => {
            console.log('Connection has been established successfully.');
            Driver.bulkCreate(require('./defaultData/Drivers.data'))
            app.listen(PORT, function () {
                console.log(`Express server started on ${PORT}`);
            });
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
}

module.exports = app;