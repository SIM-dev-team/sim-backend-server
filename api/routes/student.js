const router = require("express").Router();

const handler = require("../handlers/student");

router.post("/add", handler.AddNewStudent);
router.post("/login" , handler.login);
router.post("/setPassword" , handler.setPassword);
router.post("/forgotpassword" , handler.forgotPassword);
router.post("/getStudentData" , handler.getStudentData);
router.post("/update" , handler.UpdateStudent);
router.post("/addProject" , handler.AddProject);
router.get("/getProject/:id", handler.getProject);

module.exports = router;