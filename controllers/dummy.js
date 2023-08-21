const AppDataSource = require('../index.ts');
const { User } = require('../src/entities/User.js');
// import { User } from '../src/entities/User'
// const { body, checkSchema, validationResult } = require('express-validator');
// var db = require('../connection');
// var { User } = require('./../src/entities/User');
// import AppDataSource from '../index'

// var { AppDataSource } = require('../index');

exports.dummyIndex = [
    async (req, res, next) => {

        console.log(" i am here");
        

// const user = new User()
// photo.name = "Me and Bears"
// photo.description = "I am near polar bears"
// photo.filename = "photo-with-bears.jpg"
// photo.views = 1
// photo.isPublished = true
// user.login = `1`
// user.first_name = `1`
// user.last_name = `1`
// user.user_name = `1`
// user.email = `1`
// user.password = `1`
// user.last_artical_id = `1`
// user.verify_code = `1`
// user.amember_id = `1`
// user.pic = `1`
// user.login_type = `1`

// AppDataSource.manager.save(user)
console.log("Photo has been saved. Photo id is")
    }
];


// function get_user(email) {
//     const rows = `SELECT * FROM users WHERE users.email='${email}';`;
//     return rows;
// }   