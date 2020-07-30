const router = require("express").Router();

const handler = require("../handlers/adverts");

router.post("/create", handler.CreateAdvert);
router.get("/get/:id", handler.GetAdvert);
router.get("/getAll" , handler.GetAllAdverts);
router.post("/getAdvertsByCompany/" , handler.GetAllAdvertsByCompany);
router.get("/getAdvertsByCompanyId/:id" , handler.GetAllAdvertsByCompanyId);
router.get("/getAdvertsByCategory/:cat_id" , handler.GetAllAdvertsByCategory);
router.put("/ApproveAdvert" , handler.ApproveAdvert);
router.put("/DeclineAdvert" , handler.DeclineAdvert);
router.post("/Apply/:id" , handler.ApplyForAdvert);
router.put("/publish" , handler.PublishAdverts);
router.post("/addCategory" , handler.AddNewCategory);
router.get("/getCategory/:id" , handler.GetCategory);
router.get("/getCategories" , handler.GetCategories);

module.exports = router;
