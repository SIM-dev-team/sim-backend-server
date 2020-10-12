const joi = require('joi');

const StudentSchema = joi.object().keys({
    email: joi.string().email().required(),
    reg_no: joi.string().required(),
    index_no: joi.string(),
    name: joi.string().required(),
    gpa: joi.string().required(),
    contact: joi.string().required(),
    course: joi.number().required()
});

module.exports = StudentSchema;