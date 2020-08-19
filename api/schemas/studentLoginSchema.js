const joi = require('joi');

const LoginSchema = joi.object().keys({
    reg_no: joi.string().required(),
    password: joi.string().required()
});

module.exports = LoginSchema;