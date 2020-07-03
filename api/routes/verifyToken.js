const router = require("express").Router();

const handler = require("../handlers/verifyToken");

router.get('/jwtToken', handler.VerifyJWTToken);

module.exports = router;