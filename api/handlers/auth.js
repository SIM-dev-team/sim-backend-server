const express = require("express");
const pool = require('../../db');

const joi = require('joi');
const randomString = require('randomstring');
const jwt = require('jsonwebtoken');

const CompanySchema = require("../schemas/companySchema");
const LoginSchema = require('../schemas/loginSchema');

const hash = require('../hashPasswords');
const mailer = require('../misc/mailer');

const verifymail = require('../mails/verifyEmail');
const passwordResetmail = require('../mails/passwordResetEmail');

const config = require('../config/data');

exports.CompanyRegistration = (req, res) => {
    const result = joi.validate(req.body, CompanySchema);

    if (result.error) {
        // console.log(result);
        res.send('data validation faild');
    } else {
        hash.hashPassword(result.value.password).then(
            (hashedPass) => {
                pool.connect((err, client, done) => {
                    if (err) {
                        res.send('error connecting to database');
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
                                        client.
                                        query(`INSERT INTO company(   
                                                            email,
                                                            password ,
                                                            comp_name,
                                                            date_of_establishment,
                                                            description,
                                                            profile_pic_url,
                                                            comp_website,
                                                            address,
                                                            contact_number,
                                                            fax_number,
                                                            num_of_employees,
                                                            num_of_techleads,
                                                            provide_internships,
                                                            is_verified,
                                                            is_approved,
                                                            approved_date,
                                                            user_id , 
                                                            secretKey) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *`
                                                            , [ req.body.email,
                                                                hashedPass, 
                                                                req.body.comp_name, 
                                                                req.body.date_of_establishment, 
                                                                req.body.description,
                                                                'https://firebasestorage.googleapis.com/v0/b/sim-ucsc-6b57b.appspot.com/o/CompanyProfilePictures%2Ftoppng.com-business-icon-establish-a-company-ico-901x901.png?alt=media&token=f02b5595-a09c-4fd2-af60-beb08fa5eb79', 
                                                                req.body.comp_website, 
                                                                req.body.address, 
                                                                req.body.contact_number, 
                                                                req.body.fax_number, 
                                                                req.body.num_of_employees,
                                                                req.body.num_of_techleads, 
                                                                true, 
                                                                false, 
                                                                false, 
                                                                null, 
                                                                '001', 
                                                                secretToken
                                        ], (errp, resp) => {
                                            client.release();
                                            if (errp) {
                                                res.send('error connecting to the database');
                                            } else {
                                                res.send(resp.rows[0]);
                                            }
                                        });
                                    }
                                ).catch(e => console.log(e))

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
                    client.release();
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
    // console.log(req);
    const result = joi.validate(req.body, LoginSchema);
    if (result.error) {
        res.send('no user data found');
    } else {
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            client.query(`SELECT password,comp_id,is_verified FROM company WHERE email = '${req.body.email}'`, (errp, resp) => {
                client.release();
                if (errp) {
                    res.send(errp.stack);
                } else {
                    if (resp.rows[0]) {
                        if(resp.rows[0].is_verified){
                            hash.comparePasswords(req.body.password, resp.rows[0].password).then(
                                resopnd => {
                                    if (resopnd) {
                                        const token = jwt.sign({ id: resp.rows[0].comp_id }, config.env_data.JWT_TOKEN)
                                        res.status(200).header('authtoken', token).send(token);
                                    } else {
                                        res.send('Incorrect password');
                                    }
                                }
                            )
                        }else{
                            res.send('Account not verified');
                        }
                    } else {
                        res.send('no user data found');
                    }
                }
            });

        });
    }
}

exports.PDCUserLogin = (req, res) => {
    const result = joi.validate(req.body, LoginSchema);
    if (result.error) {
        res.send('data validation faild');
    } else {
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            client.query(`SELECT password FROM pdc_users WHERE email = '${req.body.email}'`, (errp, resp) => {
                client.release();
                if (errp) {
                    res.status(400).send('no user data found x');
                } else {
                    if (resp.rows[0]) {
                        hash.comparePasswords(req.body.password, resp.rows[0].password).then(
                            resopnd => {
                                if (resopnd) {
                                    const token = jwt.sign({ id: req.body.email }, config.env_data.JWT_TOKEN)
                                    res.header('auth-token', token).send(token);
                                } else {
                                    res.status(401).send('incorrect password');
                                }
                            }
                        )

                    } else {
                        res.status(400).send('no user data found');
                    }
                }
            });

        });
    }
}

exports.VerifyEmail = (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            res.send('error connecting to database');
        }
        client.query(`UPDATE company SET is_verified = true , secretKey = '' WHERE secretKey= '${req.body.token}' RETURNING *`, (errp, resp) => {
            client.release();
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

exports.ForgotPassword = (req,res) => {
    pool.connect((err, client, done) => {
        if (err) res.send('error connecting to database');
        client.query(`SELECT is_verified FROM company WHERE email = '${req.body.email}'`, (errp, resp) => {
            if (errp) {
                res.status(400).send('no user data found x');
            } else {
                if (resp.rows[0]) {
                    if(resp.rows[0].is_verified){
                        const secretToken = randomString.generate();
                        const html = passwordResetmail.html(secretToken);
                        mailer.sendEmail('admin@pdc.com', req.body.email, 'Password reset', html).then(
                            client.query(`UPDATE company SET secretKey = '${secretToken}' WHERE email = '${req.body.email}' RETURNING *`,
                                (err, resp) => {
                                    client.release();
                                    if (err) {
                                        res.send('error');
                                    } else {
                                        res.send('sent mail');
                                    }
                                })
                        );
                    }else{
                        res.send('Account not verified');
                    }
                } else {
                    res.status(400).send('no user data found');
                }
            }
        });

    });
}

exports.ResetPassword = (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            res.send('error connecting to database');
        }
        hash.hashPassword(req.body.password).then(
            (hashedPass) => { 
                client.query(`UPDATE company SET password = '${hashedPass}' , secretKey = '' WHERE secretKey= '${req.body.id}' RETURNING *`, (errp, resp) => {
                    client.release();
                    if (errp) {
                        console.error(errp.stack);
                    } else {
                        if (!resp.rows[0]) {
                            res.send('invalid');
                        } else {
                            res.send('password changed successfully');
                        }
                    }
                });
            }).catch((e)=>{res.send('error');})  
    });
}