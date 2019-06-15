const router = require('express').Router();
const deliveries = require('./delivery.route');
const clients = require('./client.route');

router.use('/', deliveries);
router.use('/', clients);

module.exports = router;