var request = require('request');
const { body, checkSchema, validationResult } = require('express-validator');
var db = require('../connection');


exports.user_subscription = [

    (req, res, next) => {

        // get_oauth_token(req.user.userid),
        //     async function (err, result, fields) {

        //         if (result[0].id === req.headers['authorization'].split(' ')[1]) {

        request({
            method: 'GET',
            url: process.env.AMEMBER_BASEURL + '/check-access/by-email?_key=' + process.env.AMEMBER_KEY + '&email=ali@siliconwebteam.com'

        }, function (error, response, body) {

            var dataJSON = JSON.parse(response.body);
            var subscriptionsId = Object.keys(dataJSON.subscriptions);

            request({
                method: 'GET',
                url: process.env.AMEMBER_BASEURL + '/products?_key=' + process.env.AMEMBER_KEY

            }, function (error2, response2, body2) {

                var productList = JSON.parse(response2.body);

                var data = [];

                subscriptionsId.forEach(item => {

                    for (let i = 0; i <= productList["_total"] - 1; i++) {

                        if (productList[i]["product_id"] == item) {
                            data.push({ id: item, title: productList[i]["title"] });
                        }
                    }
                });

                try {
                    res.status(200).json({ 'success': true, 'subscription_plan': data })

                } catch (e) {

                }

            });

        });

        // } else {
        //     let responseResult = {
        //         message: 'Token is not matched'
        //     }
        //     return res.status(200).json({ 'success': false, 'result': responseResult })
        // }
        // }

    }
];


exports.user_avatar = [

    (req, res, next) => {

        db.query(

            get_oauth_token(req.user.userid),
            async function (err, result, fields) {

                if (result[0].id === req.headers['authorization'].split(' ')[1]) {


                    let pathURL = process.env.BACKEND_BASEURL + '/public/storage/uploads/';

                    let responseResult = {
                        path: pathURL
                    }

                    return res.status(200).json({ 'success': true, 'result': responseResult })



                } else {
                    let responseResult = {
                        message: 'Token is not matched'
                    }
                    return res.status(200).json({ 'success': false, 'result': responseResult })
                }

            })
    }

    // }
];


exports.user_usage = [

    (req, res, next) => {




        db.query(

            get_oauth_token(req.user.userid),
            async function (err, result, fields) {


                if (result[0].id === req.headers['authorization'].split(' ')[1]) {

                    db.query(

                        get_user_usage(req.user.userid),
                        async function (err, result, fields) {

                            let responseResult = {
                                data: result
                            }

                            return res.status(200).json({ 'success': true, 'result': responseResult })
                        })

                } else {
                    let responseResult = {
                        message: 'Token is not matched'
                    }
                    return res.status(200).json({ 'success': false, 'result': responseResult })
                }
            }
        )
    }

    // }
];

function get_user_usage(user_id) {
    const rows = `
    SELECT
        SUM(credit_tabs) - SUM(debit_tabs) as tabs_total,
        SUM(credit_articals) - SUM(debit_articals) as articals_total,
        SUM(credit_tabs) as month_tabs,
        user_id,
        SUM(credit_articals) as month_articals
    FROM
        user_plans
    WHERE
        user_id = ${user_id}
        AND used = 0
        AND expired = 0
        AND invoice_payment_id != 0
    GROUP BY
        user_id
    LIMIT 1;`;
    return rows;
}


function get_oauth_token(user_id) {
    const rows = `SELECT * FROM oauth_access_tokens WHERE user_id = '${user_id}' `;
    return rows;
}