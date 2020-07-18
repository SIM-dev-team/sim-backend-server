const express = require("express");
const pool = require('../../db');
const jwt = require('jsonwebtoken');
const { env_data } = require('../config/data');

const joi = require('joi');

// create an advert by company
exports.CreateAdvert = (req, res) => {
    console.log('create advert works');
}

// get advert by id
exports.GetAdvert = ( req , res) => {
    console.log('get adverts works');
}

// get all adverts
exports.GetAllAdverts = ( req , res) => {
    console.log('get all adverts works');
}

// get all adverts by a given company
exports.GetAllAdvertsByCompany = ( req , res) => {
    console.log('get all adverts by a company works');
}

// get all adverts by a given category
exports.GetAllAdvertsByCategory = ( req , res) => {
    console.log('get all adverts by a category works');
}

//approve an advert by PDC
exports.ApproveAdvert = ( req , res) => {
    console.log('approve advert works');
}

//decline an advert by PDC
exports.DeclineAdvert = ( req , res ) => {
    console.log('decline advert works')
}

//apply for a advert by a student
exports.ApplyForAdvert = ( req , res ) => {
    console.log('apply for advert works');
}

//publish adverts for students by PDC
exports.PublishAdverts = (req , res) => {
    console.log('publish adverts works')
}