const router = require('express').Router();
const path = require('path');

const authRoutes = require("./auth");
const verifyToken = require("./verifyToken");
const verifyAndProceed = require('../handlers/verifyToken')
const CompanyRoutes = require('./company');
const AdvertRoute = require('./advert');
const StudentRoute = require('./student');


router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../../index.html'));
});

router.use('/auth', authRoutes);
router.use('/verify', verifyToken);
router.use('/company', CompanyRoutes);
router.use('/advert' , AdvertRoute);
router.use('/student' , StudentRoute);

router.use('/secretRoutes', verifyAndProceed.VerifyJWTTokenAndProceed, (req, res) => {
    res.send(req.user);
})

module.exports = router;