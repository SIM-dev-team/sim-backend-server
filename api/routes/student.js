const router = require("express").Router();

const handler = require("../handlers/student");

router.post("/add", handler.AddNewStudent);
router.post("/login" , handler.login);
router.post("/setPassword" , handler.setPassword);
router.get("/getAll", handler.getAllData)
router.post("/addNewStudent", handler.addNewStudent)
router.post("/forgotpassword" , handler.forgotPassword);
router.post("/getStudentData" , handler.getStudentData);
router.post("/getStudentDataById" , handler.getStudentDataById);
router.post("/update" , handler.UpdateStudent);
router.post("/addProject" , handler.AddProject);
router.get("/getProject/:id", handler.getProject);
router.get("/studentState", handler.GetStudentState);
router.post("/confirmApplicant" , handler.ConfirmStudent);
router.get("/getInternshipInfo" , handler.GetConfirmedStudentDetails);
router.get("/studentcount", handler.GetStudentCount);

module.exports = router;