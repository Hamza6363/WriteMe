const { body, checkSchema, validationResult } = require('express-validator');
var db = require('../connection');


exports.get_notification = [

    (req, res, next) => {

        db.query(

            get_oauth_token(req.user.userid),
            async function (err, result, fields) {

                console.log(req.user.userid);
                console.log(result);
                console.log(req.headers['authorization'].split(' ')[1]);
                if (result[0].id === req.headers['authorization'].split(' ')[1]) {

                    db.query(
                        getUnViewNotification(req.user.userid),
                        async function (err, result, fields) {

                            var notificationActive;

                            if (result[0] == undefined) {
                                notificationActive = false;
                            } else {
                                notificationActive = true;
                            }

                            db.query(
                                getNotification(req.user.userid),

                                async function (err, result2, fields) {

                                    try {

                                        let responseResult = {
                                            data: result2,
                                            notification: notificationActive,
                                            message: 'Get All Notifications'
                                        }
                                        return res.status(200).json({ 'success': true, 'result': responseResult })


                                    } catch (e) {
                                        console.log(e);
                                    }
                                });
                        });

                } else {
                    let responseResult = {
                        message: 'Token is not matched'
                    }
                    return res.status(200).json({ 'success': false, 'result': responseResult })
                }

            })
    }
];

function get_oauth_token(user_id) {
    const rows = `SELECT * FROM oauth_access_tokens WHERE user_id = ${user_id} `;
    return rows;
}
function getNotification(id) {
    const rows = `SELECT * FROM notifications WHERE user_id='${id}' AND deleted_at IS NULL`;
    return rows;
}

exports.notification_view = [

    (req, res, next) => {

        get_oauth_token(req.user.userid),
            async function (err, result, fields) {

                if (result[0].id === req.headers['authorization'].split(' ')[1]) {

                    db.query(
                        viewNotification(req.user.userid),

                        async function (err, result, fields) {

                            try {

                                let responseResult = {
                                    data: result,
                                    message: 'get new notification'
                                }

                                return res.status(200).json({ 'success': true, 'result': responseResult })

                            } catch (e) {
                                console.log(e);
                            }
                        });
                } else {
                    let responseResult = {
                        message: 'Token is not matched'
                    }
                    return res.status(200).json({ 'success': false, 'result': responseResult })
                }
            }
    }
];

function getUnViewNotification(userId) {
    const rows = `SELECT * FROM notifications WHERE user_id='${userId}' AND view='0'`;
    return rows;
}

function viewNotification(userId) {
    const rows = `UPDATE notifications SET view='1' WHERE user_id='${userId}' AND view='0'`;
    return rows;
}

exports.delete_notification = [

    (req, res, next) => {
        get_oauth_token(req.user.userid),
            async function (err, result, fields) {

                if (result[0].id === req.headers['authorization'].split(' ')[1]) {

                    const date = new Date();
                    let time = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);

                    db.query(
                        deleteNotification(req.user.userid, req.body.id, time),

                        async function (err, result, fields) {

                            try {

                                let responseResult = {
                                    message: 'your is delete successfull'
                                }

                                return res.status(200).json({ 'success': true, 'result': responseResult })

                            } catch (e) {
                                console.log(e);
                            }
                        });
                } else {
                    let responseResult = {
                        message: 'Token is not matched'
                    }
                    return res.status(200).json({ 'success': false, 'result': responseResult })
                }
            }
    }
];

function deleteNotification(user_id, id, time) {
    const rows = `UPDATE notifications SET deleted_at="${time}" WHERE user_id='${user_id}' AND id='${id}'`;
    return rows;
}