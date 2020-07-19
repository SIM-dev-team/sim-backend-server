const router = require("express").Router();

const handler = require("../handlers/company");

router.get("/get/:token", handler.GetCompanyData);
router.get("/getAll" , handler.GetAll);

module.exports = router;