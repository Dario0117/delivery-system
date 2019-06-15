const router = require('express').Router();
const deliveries = require('./delivery.route');

router.use('/', deliveries);

module.exports = router;