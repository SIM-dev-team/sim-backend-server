const express = require("express");
const pool = require('../../db');
const jwt = require('jsonwebtoken');
const { env_data } = require('../config/data');

const joi = require('joi');

const StudentSchema = require("../schemas/studentSchema");

exports.AddNewStudent = (req, res) => {
    const result = joi.validate(req.body, StudentSchema);
    if (result.error) {
        res.send('data validation faild');
    } else {
        console.log(result)
    }

}

exports.login = (req, res) => {
    console.log(req.body)
}

exports.setPassword = (req, res) => {
    console.log(res)
}

exports.forgotPassword = (req, res) => {
    console.log(res)
}