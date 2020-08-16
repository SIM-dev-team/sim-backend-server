const router = require("express").Router();

const handler = require("../handlers/student");

router.post("/add", handler.AddNewStudent);
router.post("/login" , handler.login);
router.post("/setPassword" , handler.setPassword);
router.post("/forgotpassword" , handler.forgotPassword)

module.exports = router;