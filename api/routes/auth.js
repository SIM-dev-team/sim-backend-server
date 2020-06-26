const router = require("express").Router();

const handler = require("../handlers/auth");

router.post("/register", handler.CompanyRegistration);

module.exports = router;