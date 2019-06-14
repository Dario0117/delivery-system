const express = require('express');
const routes = require('./routes');
const passport = require('passport');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use('/', routes);

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, function () {
        console.log(`Express server started on ${PORT}`);
    });
}

module.exports = app;