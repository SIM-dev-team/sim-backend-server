const jwt = require('jsonwebtoken');
const { env_data } = require('../config/data');

exports.VerifyJWTToken = (req, res, next) => {
    const token = req.header('token');
    if (!token) {
        return res.status(401).send('access denied');
    }
    try {
        const verified = jwt.verify(token, env_data.JWT_TOKEN);
        return res.status(200).send('valid token');
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}