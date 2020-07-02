const router = require("express").Router();

const handler = require("../handlers/verifyToken");


router.post('/jwtToken', handler.VerifyJWTToken);

module.exports = router;