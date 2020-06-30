const express = require("express");
const pool = require('../../db');
const { request } = require("express");


exports.CompanyRegistration = (req, res) => {
    const newCompany = {
        email: req.body.email,
        comp_name: req.body.comp_name,
        date_of_establishment: req.body.date_of_establishment,
        description: req.body.description,
        profile_pic_url: req.body.profile_pic_url,
        comp_website: req.body.websiteUrl,
        address: req.body.address,
        contact_number: req.body.contact,
        fax_number: req.body.fax,
        num_of_employees: req.body.employees,
        num_of_techleads: req.body.techleads,
        provide_internships: req.body.isProvideIntern,
        approved_by: req.body.approved_by,
        approved_date: req.body.approved_date,
        user_id: req.body.user_id
    }
    console.log(newCompany);
    pool.connect((err, client, done) => {
        if (err) {
            return console.log('err');
        }
        client.query('INSERT INTO company(email ,comp_name,date_of_establishment,description,profile_pic_url,comp_website,address,contact_number,fax_number,num_of_employees,num_of_techleads,provide_internships,approved_by,approved_date,user_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)', [newCompany.email, newCompany.comp_name, newCompany.date_of_establishment, newCompany.description,
            newCompany.profile_pic_url, newCompany.comp_website, newCompany.address, newCompany.contact_number, newCompany.fax_number, newCompany.num_of_employees,
            newCompany.num_of_techleads, newCompany.provide_internships, newCompany.approved_by, newCompany.approved_date, newCompany.user_id
        ], (errp, resp) => {
            if (errp) {
                console.error(errp.stack);
            } else {
                return res.send(resp.rows[0]);
            }
        });
    });
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