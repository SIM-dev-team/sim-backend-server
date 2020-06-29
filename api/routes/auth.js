const router = require("express").Router();

const handler = require("../handlers/auth");

router.post("/register", handler.CompanyRegistration);
router.post("/login", handler.CompanyLogin);

module.exports = router;