const router = require("express").Router();

const handler = require("../handlers/auth");

router.post("/register", handler.CompanyRegistration);
router.post("/login", handler.CompanyLogin);

router.post('/PDCUserRegister', handler.PDCUserRegistration);
router.post('/UserLogin', handler.PDCUserLogin);

router.post('/verifyEmail', handler.VerifyEmail);

module.exports = router;