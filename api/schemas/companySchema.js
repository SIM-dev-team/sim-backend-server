const joi = require('joi');

const CompanySchema = joi.object().keys({
    email: joi.string().email().required(),
    comp_name: joi.string().required(),
    date_of_establishment: joi.date().required(),
    comp_website: joi.string().required(),
    reg_no: joi.string(),
    description: joi.string().required(),
    address: joi.string().required(),
    contact_number: joi.string().required(),
    fax_number: joi.string().required(),
    num_of_employees: joi.number().required(),
    num_of_techleads: joi.number().required(),
    // provide_internships: joi.boolean().required(),
    password: joi.string().required(),
    re_password: joi.string()
});

module.exports = CompanySchema;