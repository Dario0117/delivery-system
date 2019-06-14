const router = require('express').Router();

router.use('/', (req, res) => {
    res.json({
        message: 'Hello world'
    })
});

module.exports = router;