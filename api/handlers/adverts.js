const express = require("express");
const pool = require('../../db');
const jwt = require('jsonwebtoken');
const { env_data } = require('../config/data');

const joi = require('joi');

const AdvertSchema = require("../schemas/advertSchema");

// create an advert by company
exports.CreateAdvert = (req, res) => {
    const result = joi.validate(req.body, AdvertSchema);
    const token = req.body.token;
    // console.log(req.body)
    if (!token) {
        return res.status(401).send('access denied');
    }
    try {
        const verified = jwt.verify(token, env_data.JWT_TOKEN);
        console.log(verified);
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else {
                client.query(
                    `INSERT INTO adverts
                    (   comp_id,
                        cat_id,
                        comp_name,
                        comp_website,
                        profile_pic_url,
                        date_created ,
                        internship_position ,
                        position_desc ,
                        job_desc ,
                        knowledge_skills ,
                        benefits ,
                        no_of_positions ,
                        no_of_applicants ,
                        attachment_url ,
                        status   ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
                    [
                        verified.id,
                        parseInt(req.body.cat_id),
                        req.body.comp_name,
                        req.body.comp_website,
                        req.body.profile_pic,
                        new Date(),
                        result.value.internship_position,
                        result.value.position_desc,
                        result.value.job_desc,
                        req.body.knowledge_skills,
                        req.body.benefits,
                        result.value.no_of_positions,
                        0,
                        result.value.attachment_url,
                        'pending'
                    ],
                    (err, resp) => {
                        client.release();
                        if (err) {
                            console.log(err.stack)
                        } else {
                            return res.send(resp.rows[0]);
                        }
                    });
            }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

// get advert by id
exports.GetAdvert = (req, res) => {
    try {
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else {
                client.query(`SELECT * FROM adverts WHERE ad_id = '${req.params.id}'`, (errp, resp) => {
                    client.release();
                    if (errp) {
                        res.send('no data');
                    } else {
                        res.status(200).json(resp.rows[0]);
                    }
                });
            }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

// get all adverts
exports.GetAllAdverts = (req, res) => {
    try {
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else {
                client.query(`SELECT * FROM adverts`, (errp, resp) => {
                    client.release();
                    if (errp) {
                        res.send('no data');
                    } else {
                        res.status(200).json(resp.rows);
                    }
                });
            }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

exports.GetAllApproved = (req , res) =>{
    try {
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else{
            client.query(`SELECT * FROM adverts WHERE status = 'approved'`, (errp, resp) => {
                client.release();
                if (errp) {
                    res.send('no data');
                } else {
                    res.status(200).json(resp.rows);
                }
            });
        }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

// get all adverts by a given company
exports.GetAllAdvertsByCompany = (req, res) => {
    const token = req.body.token;
    if (!token) {
        return res.status(401).send('access denied');
    }
    try {
        const verified = jwt.verify(token, env_data.JWT_TOKEN);
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else {
                client.query(`SELECT * FROM adverts WHERE comp_id = '${verified.id}'`, (errp, resp) => {
                    client.release();
                    if (errp) {
                        res.send('no data');
                    } else {
                        res.status(200).json(resp.rows);
                    }
                });
            }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

// get all adverts by a given company id
exports.GetAllAdvertsByCompanyId = (req, res) => {
    try {
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else {
                client.query(`SELECT * FROM adverts WHERE comp_id = '${req.params.id}'`, (errp, resp) => {
                    client.release();
                    if (errp) {
                        res.send('no data');
                    } else {
                        res.status(200).json(resp.rows);
                    }
                });
            }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

exports.GetApprovedAdvertsByCompanyId = (req, res) => {
    try {
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else {
                client.query(`SELECT * FROM adverts WHERE comp_id = '${req.params.id}' AND status = 'approved'`, (errp, resp) => {
                    client.release();
                    if (errp) {
                        res.send('no data');
                    } else {
                        res.status(200).json(resp.rows);
                    }
                });
            }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

// get all adverts by a given category
exports.GetAllAdvertsByCategory = (req, res) => {
    try {
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else {
                client.query(`SELECT * FROM adverts WHERE cat_id = '${req.params.cat_id}'`, (errp, resp) => {
                    client.release();
                    if (errp) {
                        res.send('no data');
                    } else {
                        res.status(200).json(resp.rows);
                    }
                });
            }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

//approve an advert by PDC
exports.ApproveAdvert = (req, res) => {
    try {
        // const verified = jwt.verify(token, env_data.JWT_TOKEN);
        console.log(req.body.id)
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else {
                client.query(`UPDATE adverts SET status = 'approved' WHERE ad_id= '${req.body.id}' RETURNING *`, (errp, resp) => {
                    client.release();
                    if (errp) {
                        res.send('no data');
                    } else {
                        res.status(200).json(resp.rows);
                    }
                });
            }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

//decline an advert by PDC
exports.DeclineAdvert = (req, res) => {
    try {
        //const verified = jwt.verify(token, env_data.JWT_TOKEN);
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else {
                client.query(`UPDATE adverts SET status = 'declined' WHERE ad_id= '${req.body.id}' RETURNING *`, (errp, resp) => {
                    client.release();
                    if (errp) {
                        res.send('no data');
                    } else {
                        res.status(200).json(resp.rows);
                    }
                });
            }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

//apply for a advert by a student
exports.ApplyForAdvert = ( req , res ) => {
    try {
        console.log(req.body.Data);
        const verified = jwt.verify(req.body.Data.token, env_data.JWT_TOKEN);
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else{
                client.query(`INSERT INTO advert_student(id,s_id , a_id , cv_link,is_available)VALUES(nextval('student_advert_sequence'),$1,$2,$3,$4) RETURNING *`,[verified.id , req.body.Data.advert , req.body.Data.link, true ], (errp, resp) => {
                    
                    if (errp) {
                        res.send(errp);
                    } else {
                        client.query(`UPDATE adverts SET no_of_applicants = no_of_applicants + 1 WHERE ad_id = ${req.body.Data.advert} RETURNING *`, (errpp, resp) => {
                            if(errpp){
                                res.send(errpp); 
                            }else{
                                res.status(200).json(resp.rows[0]);
                            }
                        });
                    }
                });
            }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

//get applied adverts by a student
exports.GetAppliedAdverts = ( req , res ) => {
    try {
        const verified = jwt.verify(req.body.token, env_data.JWT_TOKEN);
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else{
                // console.log("token >" , verified.id);
                client.query(`SELECT * FROM  advert_student WHERE s_id = '${verified.id}'`, (errp, resp) => {
                    client.release();
                    if (errp) {
                        res.send(errp);
                    } else {
                        res.status(200).json(resp.rows);
                    }
                });
            }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

//publish adverts for students by PDC
exports.PublishAdverts = (req, res) => {
    try {
        const verified = jwt.verify(token, env_data.JWT_TOKEN);
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else {
                client.query(`UPDATE adverts SET status = 'published' WHERE status = 'approved' RETURNING *`, (errp, resp) => {
                    client.release();
                    if (errp) {
                        res.send('no data');
                    } else {
                        res.status(200).json(resp.rows);
                    }
                });
            }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

// add new intenship position category
exports.AddNewCategory = (req, res) => {
    try {
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else {
                client.query(`INSERT INTO categories(cat_id , cat_name)VALUES(nextval('category_sequence'),$1) RETURNING *`, [req.body.category], (errp, resp) => {
                    client.release();
                    if (errp) {
                        res.send('something went wrong');
                    } else {
                        res.status(200).json(resp.rows[0]);
                    }
                });
            }
        });
    } catch (e) {
        return res.status(400).send('something went wrong');
    }
}

// get intenship position category by category id
exports.GetCategory = (req, res) => {
    try {
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else {
                client.query(`SELECT * FROM categories WHERE cat_id = '${req.params.id}'`, (errp, resp) => {
                    client.release();
                    if (errp) {
                        res.send('no data');
                    } else {
                        res.status(200).json(resp.rows[0]);
                    }
                });
            }
        });
    } catch (e) {
        return res.status(400).send('something went wrong');
    }
}


// get all internship position categories

exports.GetCategories = (req, res) => {
    try {
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else {
                client.query(`SELECT * FROM categories`, (errp, resp) => {
                    client.release();
                    if (errp) {
                        res.send('no data');
                    } else {
                        res.status(200).json(resp.rows);
                    }
                });
            }
        });
    } catch (e) {
        return res.status(400).send('error');
    }
}

//get all pending adverts
exports.GetPendingAdverts = (req, res) => {
    try {
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else {
                client.query(`SELECT * FROM adverts WHERE status ='pending'`, (errp, resp) => {
                    client.release();
                    if (errp) {
                        res.send('no data');
                    } else {
                        res.status(200).json(resp.rows);
                    }
                });
            }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

//get all approved adverts
exports.GetApprovedAdverts = (req, res) => {
    try {
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else {
                client.query(`SELECT * FROM adverts WHERE status ='approved'`, (errp, resp) => {
                    client.release();
                    if (errp) {
                        res.send('no data');
                    } else {
                        res.status(200).json(resp.rows);
                    }
                });
            }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

//get declined ads 
exports.GetDeclinedAdverts = (req, res) => {
    try {
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else {
                client.query(`SELECT * FROM adverts WHERE status ='declined'`, (errp, resp) => {
                    client.release();
                    if (errp) {
                        res.send('no data');
                    } else {
                        res.status(200).json(resp.rows);
                    }
                });
            }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

//get registered companies that posted ads
exports.CompaniesPostedAds = (req, res) => {
    try {
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else {
                client.query(`SELECT COUNT(DISTINCT comp_id) FROM adverts`, (errp, resp) => {
                    client.release();
                    if (errp) {
                        res.send('no data');
                    } else {
                        res.status(200).json(resp.rows);
                    }
                });
            }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}

exports.GetStudentsForAnAdvert = (req,res) =>{
    try {
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else {
                client.query(`SELECT * FROM advert_student WHERE a_id = ${req.body.a_id}`, (errp, resp) => {
                    client.release();
                    if (errp) {
                        res.send('error');
                    } else {
                        res.status(200).json(resp.rows);
                    }
                });
            }
        });
    } catch (e) {
        return res.status(400).send('error');
    }
}

exports.RequestAdverts = (req, res) =>{
    try {
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else {
                console.log(req.body.date);
                client.query(`UPDATE states SET val = true , deadline = ${req.body.date} WHERE state_id = 1  RETURNING *`, (errp, resp) => {
                    client.release();
                    if (errp) {
                        res.send('error');
                    } else {
                        res.status(200).json(resp.rows[0]);
                    }
                });
            }
        });
    } catch (e) {
        return res.status(400).send('invalid token');
    }
}


exports.GetAdvertState = (req, res) =>{
    try {
        pool.connect((err, client, done) => {
            if (err) res.send('error connecting to database...');
            else {
                client.query(`SELECT val,deadline FROM states WHERE state_id = 1`, (errp, resp) => {
                    client.release();
                    if (errp) {
                        res.send('error');
                    } else {
                        res.status(200).json(resp.rows[0]);
                    }
                });
            }
        });
    } catch (e) {
        return res.status(400).send('error');
    }
}
