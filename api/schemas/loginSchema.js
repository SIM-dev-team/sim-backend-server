const joi = require('joi');

const LoginSchema = joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().required()
});

module.exports = LoginSchema;