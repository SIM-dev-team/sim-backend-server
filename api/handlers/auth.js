const express = require("express");
const pool = require('../../db');
const { request } = require("express");

const joi = require('joi');
const randomString = require('randomstring');

const CompanySchema = require("../schemas/companySchema");
const e = require("express");

const hash = require('../hashPasswords');
const mailer = require('../misc/mailer');

const verifymail = require('../mails/verifyEmail');

exports.CompanyRegistration = (req, res) => {
    const result = joi.validate(req.body, CompanySchema);

    if (result.error) {
        console.log(result);
        res.send('data validation faild');
    } else {
        hash.hashPassword(result.value.password).then(
            (hashedPass) => {
                pool.connect((err, client, done) => {
                    if (err) {
                        return console.log('err');
                    }
                    client.query(`SELECT email FROM company WHERE email = '${req.body.email}'`, (errp, resp) => {
                        if (errp) {
                            console.error(errp.stack);
                        } else {
                            if (resp.rows[0]) {
                                res.send('email already exist');
                            } else {
                                const secretToken = randomString.generate();
                                const html = verifymail.html(secretToken);

                                mailer.sendEmail('admin@pdc.com', req.body.email, 'Please verify your email', html).then(
                                    () => {
                                        client.query('INSERT INTO company(email,password ,comp_name,date_of_establishment,description,profile_pic_url,comp_website,address,contact_number,fax_number,num_of_employees,num_of_techleads,provide_internships,is_verified,is_approved,approved_date,user_id , secretKey) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *', [req.body.email, hashedPass, req.body.comp_name, req.body.date_of_establishment, req.body.description,
                                            req.body.profile_pic_url, req.body.comp_website, req.body.address, req.body.contact_number, req.body.fax_number, req.body.num_of_employees,
                                            req.body.num_of_techleads, req.body.provide_internships, false, false, null, '001', secretToken
                                        ], (errp, resp) => {
                                            if (errp) {
                                                return res.send(errp.stack);
                                            } else {
                                                return res.send(resp.rows[0]);
                                            }
                                        });
                                    }
                                )

                            }
                        }
                    });

                });
            }
        )
    }

}

exports.PDCUserRegistration = (req, res) => {
    const newUser = {
        user_id: req.body.user_id,
        f_name: req.body.f_name,
        l_name: req.body.l_name,
        email: req.body.email,
        user_name: req.body.user_name,
        password: req.body.password,
        role: req.body.role,
    }
    pool.connect((err, client, done) => {
        if (err) {
            return console.log('err');
        }
        try {
            client.query('INSERT INTO pdc_users(user_id,f_name,l_name,email,user_name,password,role) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *', [newUser.user_id, newUser.f_name, newUser.l_name, newUser.email, newUser.user_name, newUser.password, newUser.role],
                (err, resp) => {
                    if (err) {
                        console.log(err.stack)
                    } else {
                        return res.send(resp.rows[0]);
                    }
                });

        } catch (e) {
            return e;
        }
    });
}

exports.CompanyLogin = (req, res) => {
    res.send('company login api set up');
}

exports.PDCUserLogin = (req, res) => {
    res.send('pcd user login api set up');
}

exports.VerifyEmail = (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.log('err');
        }
        client.query(`UPDATE company SET is_verified = true , secretKey = '' WHERE secretKey= '${req.body.token}' RETURNING *`, (errp, resp) => {
            if (errp) {
                console.error(errp.stack);
            } else {
                if (!resp.rows[0]) {
                    res.send('Please enter a valid token');
                } else {
                    res.send('account verified successfully');
                }
            }
        });

    });
}