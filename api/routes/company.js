const router = require("express").Router();

const handler = require("../handlers/company");

router.get("/get/:token", handler.GetCompanyData);
router.get("/getAll" , handler.GetAll);
router.post("/update" , handler.UpdateProfile);
router.get("/getCompany/:id" , handler.GetCompanyById)

module.exports = router;