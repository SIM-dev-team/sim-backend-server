const router = require('express').Router();
const path = require('path');

const authRoutes = require("./auth");
const verifyToken = require("./verifyToken");

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../../index.html'));
});

router.use('/auth', authRoutes);
router.use('/verify', verifyToken);

module.exports = router;