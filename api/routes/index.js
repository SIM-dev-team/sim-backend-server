const router = require('express').Router();
const path = require('path')

const authRoutes = require("./auth")

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../../index.html'));
});

router.use('/auth', authRoutes);

module.exports = router;