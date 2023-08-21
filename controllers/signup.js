var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const { body, checkSchema, validationResult } = require('express-validator');
var db = require('../connection');
var nodemailer = require('nodemailer');

// validation
const step_1_Schema = {
    first_name: {
        notEmpty: true,
        errorMessage: "First Name field cannot be empty"
    },
    last_name: {
        notEmpty: true,
        errorMessage: "Last Name field cannot be empty"
    }
}

exports.step_1 = [
    // // for email validation
    body('email').isEmail().normalizeEmail(),

    // // require validtion
    checkSchema(step_1_Schema),

    (req, res, next) => {

        const errors = validationResult(req);

        if (req.body.first_name == "") {
            return res.status(400).json({
                success: false,
                errors: 'First Name field cannot be empty'
            });
        }

        if (req.body.last_name == "") {
            return res.status(400).json({
                success: false,
                errors: 'Last Name field cannot be empty'
            });
        }


        // filter
        db.query(filterEmailFromDB(req.body.email), async function (err, result, fields) {
            if (result[0] != undefined && result[0].email === req.body.email) {
                let responseResult = {
                    message: 'Email already exist'
                }
                return res.status(400).json({ 'success': false, 'result': responseResult })
            }

            else {
                // nodemailer start
                // create reusable transporter object using the default SMTP transport
                const transporter = nodemailer.createTransport({
                    port: process.env.NODEMAILER_PORT,               // true for 465, false for other ports
                    host: process.env.NODEMAILER_HOST,
                    secureConnection: false,
                    auth: {
                        user: process.env.NODEMAILER_USER,
                        pass: process.env.NODEMAILER_PASSWORD,
                    },
                    tls: {
                        ciphers: 'SSLv3'
                    }
                });

                const verifyCode = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);

                const mailData = {
                    from: process.env.NODEMAILER_USER,  // sender address
                    to: 'ameer@siliconwebteam.com',   // list of receivers
                    subject: 'Sending Email using Node.js',
                    html: 'Your verification code is: <strong>' + verifyCode + '</strong>',
                };

                // nodemailer end
                db.query(
                    add_step_1(req.body.first_name, req.body.last_name, req.body.email, verifyCode),

                    async function (err, result, fields) {

                        const accessToken = jwt.sign({ userid: result.insertId }, 'SECRET_KEY');

                        try {

                            db.query(oauth_insert(accessToken, result.insertId), async function (err, result, fields) {
                                console.log('call successfull');
                            })

                            transporter.sendMail(mailData, function (err, info) {
                                if (err) {

                                }
                            });

                            let responseResult = {
                                data: {
                                    id: result.insertId,
                                    accessToken: accessToken
                                },
                                message: 'your data is save successfully'
                            }
                            return res.status(200).json({ 'success': true, 'result': responseResult })


                        } catch (e) {
                            console.log(e);
                        }
                    });
            }
        })
    }
];

// query
function oauth_insert(id, user_id) {
    const rows = `INSERT INTO oauth_access_tokens(id, user_id, client_id, name, scopes) VALUES ('${id}', '${user_id}', '1', 'MyApp', '[]');`
    return rows;
}
function add_step_1(first_name, last_name, email, verifyCode) {
    const rows = `INSERT INTO users(first_name, last_name, email, verify_code) VALUES ('${first_name}', '${last_name}','${email}','${verifyCode}')`;
    return rows;
}
function filterEmailFromDB(email) {
    const rows = `SELECT * FROM users WHERE users.email = '${email}'`;
    return rows;
}

exports.verify_code = [

    async function (req, res, next) {

        if (req.body.id == undefined) {
            return res.status(400).json({
                success: false,
                errors: 'User Id field cannot be empty'
            });
        }

        if (req.body.verify_code == undefined) {
            return res.status(400).json({
                success: false,
                errors: 'Verify Code field cannot be empty'
            });
        }

        db.query(checkVerifyCode(req.body.id, req.body.verify_code), async function (err, result, fields) {

            if (result[0].verify_code !== req.body.verify_code) {
                let responseResult = {
                    message: 'your Verification is not matched'
                }
                return res.status(400).json({ 'success': false, 'result': responseResult })
            }

            try {
                let responseResult = {
                    message: 'your Verification is matched'
                }
                res.status(200).json({ 'success': true, 'result': responseResult })
            } catch (e) {

            }
        });

    }
];

// query
function checkVerifyCode(userId) {
    const rows = `SELECT verify_code FROM users WHERE users.id = ${userId}`;
    return rows;
}

exports.step_2 = [

    async function (req, res, next) {

        if (req.body.id == undefined) {
            return res.status(400).json({
                success: false,
                errors: 'User Id field cannot be empty'
            });
        }
        if (req.body.user_name == undefined) {
            return res.status(400).json({
                success: false,
                errors: 'User Name field cannot be empty'
            });
        }
        if (req.body.password == undefined) {
            return res.status(400).json({
                success: false,
                errors: 'Password field cannot be empty'
            });
        } 
        else if(req.body.password.length < 8){
            return res.status(400).json({
                success: false,
                errors: 'Password must be in 8 character'
            });
        }


        let saltRounds = 10; // Define the salt rounds
        let myPlaintextPassword = req.body.password;
        let hashed_password;
        bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
            // Store hash.
            hashed_password = hash;

            db.query(add_step_2(req.body.id, req.body.user_name, hashed_password), async function (err, result, fields) {

                try {
                    let responseResult = {
                        message: 'Username is save successfully'
                    }
                    res.status(200).json({ 'success': true, 'result': responseResult })
                } catch (e) {

                }

            });
        });

    }
];

// query
function add_step_2(userId, user_name, password) {
    const rows = `UPDATE users SET user_name='${user_name}', pic='default.png', password='${password}' WHERE users.id = '${userId}'`;
    return rows;
}


exports.social_register = [
    async function (req, res, next) {
        let saltRounds = 10; // Define the salt rounds
        let myPlaintextPassword = req.body.password;
        let hashed_password;
        bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
            // Store hash.
            hashed_password = hash;

            db.query(social_register_query(req.body.first_name, req.body.last_name, req.body.user_name, req.body.email, hashed_password, req.body.token_for_business, req.body.login_type), async function (err, result, fields) {

                if (err) throw err;
                try {
                    var responseResult = {
                        message: 'login successfully'
                    }
                    res.status(200).json({ 'success': true, 'result': responseResult })

                } catch (e) {

                }
            });
        });
    }
];


function social_register_query(firstName, lastName, userName, email, password, tokenForBusiness, loginType) {
    const rows = `INSERT INTO users(first_name, last_name, user_name, email, password, token_for_business, login_type) VALUES ('${firstName}', '${lastName}', '${userName}', '${email}', '${password}', '${tokenForBusiness}', '${loginType}')`;
    return rows;
}