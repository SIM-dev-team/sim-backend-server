const router = require("express").Router();

const handler = require("../handlers/student");

router.post("/add", handler.AddNewStudent);
router.post("/login" , handler.login);
router.post("/setPassword" , handler.setPassword);
router.post("/forgotpassword" , handler.forgotPassword)
router.get("/getAll", handler.getAllData)
router.put("/update", handler.updateStudent)
router.post("/addNewStudent", handler.addNewStudent)

module.exports = router;