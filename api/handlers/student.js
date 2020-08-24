const express = require("express");
const pool = require('../../db');
const jwt = require('jsonwebtoken');
const { env_data } = require('../config/data');

const joi = require('joi');

const hash = require('../hashPasswords');
const mailer = require('../misc/mailer');

const StudentSchema = require("../schemas/studentSchema");
const LoginSchema = require("../schemas/studentLoginSchema");

const studentmail = require('../mails/student/studentMail');
const passwordResetmail = require('../mails/student/studentPasswordReset');

exports.AddNewStudent = (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            return console.log('err');
        }
        try {
            const result = joi.validate(req.body, StudentSchema);
            const token = jwt.sign({ reg_no : result.value.reg_no }, env_data.JWT_TOKEN);
            console.log(result);
            client.query(`INSERT INTO students(
                                        reg_no,
                                        index_no,
                                        name,
                                        email,
                                        course,
                                        password,
                                        is_verified,
                                        secretKey) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, 
                                        [result.value.reg_no, 
                                         result.value.index_no, 
                                         result.value.name, 
                                         result.value.email,
                                         result.value.course, 
                                         '', 
                                         false, 
                                         ''],
                (err, resp) => {
                    client.release();
                    if (err) {
                        console.log(err.stack)
                    } else {
                        let message = '';
                        const html = studentmail.html(token);
                        mailer.sendEmail('admin@pdc.com', result.value.email, 'Please set your password', html).then(
                            message = resp.rows[0]
                        ).catch(e => console.log(e))

                        res.send(message);
                    }
                });

        } catch (e) {
            return e;
        }
    });

}

exports.login = (req, res) => {
    const result = joi.validate(req.body, LoginSchema);
    if (result.error) {
        res.send('data validation faild');
    } else {
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            client.query(`SELECT password , is_verified FROM students WHERE reg_no = '${req.body.reg_no}'`, (errp, resp) => {
                client.release();
                if (errp) {
                    res.status(400).send('no user data found x');
                } else {
                    if (resp.rows[0]) {
                        if(!resp.rows[0].is_verified){
                            res.status(401).send('not verified');
                        }else{
                            hash.comparePasswords(req.body.password, resp.rows[0].password).then(
                                resopnd => {
                                    if (resopnd) {
                                        const token = jwt.sign({ id: req.body.email }, env_data.JWT_TOKEN)
                                        res.header('auth-token', token).send(token);
                                    } else {
                                        res.status(401).send('incorrect password');
                                    }
                                }
                            )
                        }

                    } else {
                        res.status(400).send('no user data found');
                    }
                }
            });

        });
    }
}

exports.setPassword = (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            res.send('error connecting to database');
        }
        hash.hashPassword(req.body.password).then(
            (hashedPass) => { 
                const verified = jwt.verify(req.body.token, env_data.JWT_TOKEN);
                console.log(verified);
                client.query(`UPDATE students SET password = '${hashedPass}' , is_verified = 'true' WHERE reg_no = '${verified.reg_no}' RETURNING *`, (errp, resp) => {
                    client.release();
                    if (errp) {
                        console.error(errp.stack);
                    } else {
                        if (!resp.rows[0]) {
                            res.send('invalid');
                        } else {
                            res.send('password set successfully');
                        }
                    }
                });
        }).catch((e)=>{res.send('error');})  
    });
}

exports.forgotPassword = (req, res) => {
    const token = jwt.sign({ reg_no : req.body.reg_no }, env_data.JWT_TOKEN);
    const html = passwordResetmail.html(token);
    pool.connect((err, client, done) => {
        if (err) res.send('error connecting to database...');
        client.query(`SELECT email FROM students WHERE reg_no = '${req.body.reg_no}'`, (errp, resp) => {
            client.release();
            if (errp) {
                res.status(400).send('no user data found');
            } else {
                if (resp.rows[0]) {
                    mailer.sendEmail('admin@pdc.com', resp.rows[0].email , 'You have requested to reset your password', html).then(
                        res.send(resp.rows[0])
                    ).catch(e => console.log(e));
                } else {
                    res.status(400).send('no user data found');
                }
            }
        });

    });
}