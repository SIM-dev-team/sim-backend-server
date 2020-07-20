const joi = require('joi');

const AdvertSchema = joi.object().keys({
    id: joi.string().required(),
    comp_id: joi.string().required(),
    date: joi.date().required(),
    position: joi.string().required(),
    position_desc: joi.string().required(),
    job_desc: joi.string(),
    no_of_positions: joi.number().required(),
    attachment_url: joi.string().required(),
    status: joi.string().default('pending')
});

module.exports = AdvertSchema;