const router = require("express").Router();

const handler = require("../handlers/adverts");

router.post("/create", handler.CreateAdvert);
router.get("/get/:id", handler.GetAdvert);
router.get("/getAll" , handler.GetAllAdverts);
router.get("/getAdvertsByCompany/:comp_id" , handler.GetAllAdvertsByCategory);
router.get("/getAdvertsByCategory/:cat_id" , handler.GetAllAdvertsByCategory);
router.put("/ApproveAdvert" , handler.ApproveAdvert);
router.put("/DeclineAdvert" , handler.DeclineAdvert);
router.post("/Apply/:id" , handler.ApplyForAdvert);
router.put("/publish" , handler.PublishAdverts);

module.exports = router;
