var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const { body, checkSchema, validationResult } = require('express-validator');
var db = require('../connection');
var nodemailer = require('nodemailer');


exports.login = [
    // for email validation
    body('email').isEmail().normalizeEmail(),

    async function (req, res, next) {

        db.query(get_user(req.body.email),

            async function (err, result, fields) {

                if (result[0] === undefined) {
                    let responseResult = {
                        message: 'Email does not exist.'
                    }
                    return res.status(400).json({ 'success': false, 'result': responseResult })
                }



                const accessToken = jwt.sign({ userid: result[0].id }, 'SECRET_KEY');

                bcrypt.compare(req.body.password, result[0].password, async (err, data2) => {
                    //if error than throw error
                    if (err) throw err

                    //if both match than you can do anything
                    if (data2) {
                        var responseResult = {
                            message: 'login successfully',
                            accessToken: accessToken,
                            first_name: result[0].first_name,
                            last_name: result[0].last_name,
                            id : result[0].id,
                            email: result[0].email,
                            pic: result[0].pic,
                            login_type: result[0].login_type
                        }
                        res.status(200).json({ 'success': true, 'result': responseResult })

                        db.query(update_oauth_token(result[0].id, accessToken),

                            async function (err, result, fields) {
                            });

                    } else {
                        let responseResult = {
                            message: 'Incorrect email or password.'
                        }
                        return res.status(400).json({ 'success': false, 'result': responseResult })
                    }

                })
            });
    }
];

// query
function get_user(email) {
    const rows = `SELECT * FROM users WHERE users.email='${email}';`;
    return rows;
}

function update_oauth_token(id, token) {
    const rows = `UPDATE oauth_access_tokens SET id='${token}' WHERE user_id = '${id}'`;
    return rows;
}

exports.forget_password = [

    // for email validation
    body('email').isEmail().normalizeEmail(),

    async function (req, res, next) {

        db.query(forget_password_id(req.body.email),

            async function (err, result, fields) {

                if (result[0] === undefined) {
                    let responseResult = {
                        message: 'This account does not exist'
                    }
                    return res.status(400).json({ 'success': false, 'result': responseResult })
                }

                const user_id = result[0].id;

                // nodemailer start
                // create reusable transporter object using the default SMTP transport
                const transporter = nodemailer.createTransport({
                    port: process.env.NODEMAILER_PORT,
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
                    to: req.body.email,   // list of receivers
                    subject: 'Sending Email using Node.js',
                    html: 'Your verification code is: <strong>' + verifyCode + '</strong>',
                };
                // nodemailer end

                db.query(
                    forget_password_verify_code(req.body.email, verifyCode),

                    async function (err, result, fields) {
                        transporter.sendMail(mailData, function (err, info) {
                            if (err) {

                            }
                        });

                        try {
                            var responseResult = {
                                data: {
                                    id: user_id,
                                },
                                message: 'Email is sent successfully'
                            }
                            res.status(200).json({ 'success': true, 'result': responseResult })

                        } catch (e) {

                        }
                    });
            });
    }
];

// query
function forget_password_id(email) {
    const rows = `SELECT id FROM users WHERE email='${email}';`;
    return rows;
}

function forget_password_verify_code(email, verify_code) {
    const rows = `UPDATE users SET verify_code='${verify_code}' WHERE users.email='${email}';`;
    return rows;
}

exports.verify_code = [

    async function (req, res, next) {

        if (req.body.id == undefined) {
            return res.status(400).json({
                success: false,
                errors: 'User Id is empty'
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
                    message: 'Please enter a correct code'
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

function checkVerifyCode(userId) {
    const rows = `SELECT verify_code FROM users WHERE users.id = ${userId}`;
    return rows;
}

exports.reset_password = [
    // require validtion
    body('password').isStrongPassword({ minLength: 8 }),

    async function (req, res, next) {
        let saltRounds = 10; // Define the salt rounds
        let myPlaintextPassword = req.body.password;
        let hashed_password;
        bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
            // Store hash.
            hashed_password = hash;

            db.query(login_reset_password(req.body.id, hashed_password), async function (err, result, fields) {

                try {
                    let responseResult = {
                        message: 'password save successfully'
                    }
                    res.status(200).json({ 'success': true, 'result': responseResult })
                } catch (e) {

                }
            });
        });

    }
];


function login_reset_password(userId, password) {
    const rows = `UPDATE users SET password='${password}' WHERE users.id = '${userId}'`;
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