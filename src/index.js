const express = require('express');
const passport = require('passport');
const cors = require('cors');
const routes = require('./routes');
const { connection, Driver } = require('./db');
const auth = require('./auth');

require('dotenv').config();
auth();

const app = express();
const PORT = process.env.PORT || 5000;

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