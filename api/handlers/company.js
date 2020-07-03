const express = require("express");
const pool = require('../../db');
const jwt = require('jsonwebtoken');
const { env_data } = require('../config/data');

const joi = require('joi');

exports.GetCompanyData = (req, res) => {
    const token = req.header('token');
    if (!token) {
        return res.status(401).send('access denied');
    }
    try {
        const verified = jwt.verify(token, env_data.JWT_TOKEN);
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            client.query(`SELECT reg_no,email,comp_name,date_of_establishment,comp_website,profile_pic_url,description,address,contact_number,fax_number,num_of_employees,num_of_techleads,provide_internships,is_verified,is_approved FROM company WHERE comp_id = '${verified.id}'`, (errp, resp) => {
                if (errp) {
                    res.send('no user data found');
                } else {
                    res.status(200).json(resp.rows[0]);
                }
            });

        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}