const router = require("express").Router();

const handler = require("../handlers/company");

router.get("/get/:token", handler.GetCompanyData);

module.exports = router;