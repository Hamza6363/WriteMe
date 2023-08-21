var request = require('request');
const { body, checkSchema, validationResult } = require('express-validator');
var db = require('../connection');

exports.save_project = [

    (req, res, next) => {

        if (req.body.title == undefined) {
            return res.status(400).json({
                success: false,
                errors: 'Title field cannot be empty'
            });
        }
        if (req.body.keyword === "") {
            return res.status(400).json({
                success: false,
                errors: 'keyword must be in array'
            });
        }

        if (req.body.keyword[0] === undefined) {
            return res.status(400).json({
                success: false,
                errors: 'keyword field type array not be Empty'
            });
        }

        db.query(

            get_oauth_token(req.user.userid),
            async function (err, result, fields) {

                if (result[0] && result[0].id === req.headers['authorization'].split(' ')[1]) {

                    db.query(
                        add_project(req.user.userid, req.body.title),

                        async function (err, result, fields) {
                            let projectId = result.insertId;

                            req.body.keyword.map(item =>

                                db.query(

                                    add_keyword(req.user.userid, projectId, item),
                                    async function (err, result, fields) {

                                    }
                                )
                            )

                            let responseResult = {
                                title: req.body.title,
                                projectId: projectId
                            }
                            return res.status(200).json({ 'success': true, 'result': responseResult })


                        }
                    )

                } else {
                    let responseResult = {
                        message: 'Token is not matched'
                    }
                    return res.status(200).json({ 'success': false, 'result': responseResult })
                }
            }
        )
    }
];

exports.get_project = [

    (req, res, next) => {

        db.query(

            get_oauth_token(req.user.userid),
            async function (err, result, fields) {

                if (result[0] && result[0].id === req.headers['authorization'].split(' ')[1]) {

                    db.query(

                        get_project(req.user.userid),
                        async function (err, result, fields) {

                            let responseResult = {
                                data: result
                            }
                            return res.status(200).json({ 'success': true, 'result': responseResult })

                        }
                    )
                } else {
                    let responseResult = {
                        message: 'Token is not matched'
                    }
                    return res.status(200).json({ 'success': false, 'result': responseResult })
                }
            }
        )
    }
]

exports.delete_project = [

    (req, res, next) => {

        if (req.body.projectId == undefined) {
            return res.status(400).json({
                success: false,
                errors: 'Project id field cannot be empty'
            });
        }

        db.query(

            get_oauth_token(req.user.userid),
            async function (err, result, fields) {

                if (result[0] && result[0].id === req.headers['authorization'].split(' ')[1]) {

                    const date = new Date();
                    let time = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
                    
                    db.query(

                        delete_project(req.body.projectId, time),
                        async function (err, result, fields) {

                            let responseResult = {
                                message: "project delete successfully"
                            }
                            return res.status(200).json({ 'success': true, 'result': responseResult })

                        }
                    )
                } else {
                    let responseResult = {
                        message: 'Token is not matched'
                    }
                    return res.status(200).json({ 'success': false, 'result': responseResult })
                }
            }
        )
    }
];

exports.edit_project = [

    (req, res, next) => {

        if (req.body.projectId == undefined) {
            return res.status(400).json({
                success: false,
                errors: 'Project id cannot be empty'
            });
        }
        // if (req.body.title == undefined) {
        //     return res.status(400).json({
        //         success: false,
        //         errors: 'Title id field cannot be empty'
        //     });
        // }

        db.query(

            get_oauth_token(req.user.userid),
            async function (err, result, fields) {

                if (result[0] && result[0].id === req.headers['authorization'].split(' ')[1]) {

                    db.query(

                        edit_project_title(req.body.projectId),
                        async function (err, result, fields) {

                            let responseResult = {
                                result: result
                            }
                            return res.status(200).json({ 'success': true, 'result': responseResult })

                        }
                    )
                } else {
                    let responseResult = {
                        message: 'Token is not matched'
                    }
                    return res.status(200).json({ 'success': false, 'result': responseResult })
                }
            }
        )
    }
]

exports.save_category = [

    (req, res, next) => {

        if (req.body.title == undefined) {
            return res.status(400).json({
                success: false,
                errors: 'Title field cannot be empty'
            });
        }
        if (req.body.project_id == undefined) {
            return res.status(400).json({
                success: false,
                errors: 'project id cannot be empty'
            });
        }

        let parentCategoryId;
        if (req.body.parent_category_id === undefined) {
            parentCategoryId = 0;
        }
        else {
            parentCategoryId = req.body.parent_category_id;
        }


        db.query(

            get_oauth_token(req.user.userid),
            async function (err, result, fields) {

                if (result[0] && result[0].id === req.headers['authorization'].split(' ')[1]) {

                    db.query(

                        add_category(req.user.userid, req.body.project_id, req.body.title, parentCategoryId),
                        async function (err, result, fields) {

                            let responseResult = {
                                message: 'category add successfully'
                            }
                            return res.status(200).json({ 'success': false, 'result': responseResult })
                        }
                    )
                } else {
                    let responseResult = {
                        message: 'Token is not matched'
                    }
                    return res.status(200).json({ 'success': false, 'result': responseResult })
                }
            }
        )
    }
];

exports.get_category = [

    (req, res, next) => {

        db.query(

            get_oauth_token(req.user.userid),
            async function (err, result, fields) {

                if (result[0] && result[0].id === req.headers['authorization'].split(' ')[1]) {

                    db.query(

                        get_categories(req.user.userid),
                        async function (err, result, fields) {

                            console.log(result);

                        }
                    )
                } else {
                    let responseResult = {
                        message: 'Token is not matched'
                    }
                    return res.status(200).json({ 'success': false, 'result': responseResult })
                }
            }
        )
    }
];

exports.get_project_id = [

    (req, res, next) => {

        db.query(

            get_oauth_token(req.user.userid),
            async function (err, result, fields) {

                if (result[0] && result[0].id === req.headers['authorization'].split(' ')[1]) {

                    db.query(

                        get_project_id(req.user.userid),
                        async function (err, result, fields) {
                            let responseResult = {
                                project_id: result[0].id,
                            }
                            return res.status(200).json({ 'success': true, 'result': responseResult })
                        }
                    )
                } else {
                    let responseResult = {
                        message: 'Token is not matched'
                    }
                    return res.status(200).json({ 'success': false, 'result': responseResult })
                }
            }
        )
    }
]

function get_oauth_token(user_id) {
    const rows = `SELECT * FROM oauth_access_tokens WHERE user_id = '${user_id}' `;
    return rows;
}

function add_project(userid, title) {
    const rows = `INSERT INTO projects(user_id, title) VALUES ('${userid}','${title}')`;
    return rows;
}

function get_project(userid) {
    const rows = `SELECT id, title, details FROM projects WHERE user_id = '${userid}' AND deleted_at IS NULL;`;
    return rows;
}

function delete_project(id, time) {
    const rows = `UPDATE projects SET deleted_at='${time}' WHERE id=${id}`;
    return rows;
}

function edit_project_title(id) {
    // const rows = `UPDATE projects SET title='${title}' WHERE id=${id}`;
    const rows = `SELECT title FROM projects WHERE id=${id}`;
    return rows;
}

function add_keyword(userid, productId, keyword) {
    const rows = `INSERT INTO keywords(user_id, project_id, keyword) VALUES ('${userid}','${productId}','${keyword}')`;
    return rows;
}

function add_category(userId, productId, title, parentCategoryId) {
    const rows = `INSERT INTO categories (user_id, project_id , title, parent_category_id) VALUES ('${userId}','${productId}','${title}','${parentCategoryId}')`;
    return rows;
}
function get_categories(userId) {
    const rows = `SELECT id, title, parent_category_id FROM categories WHERE user_id='${userId}';`;
    return rows;
}

function get_project_id(userid){
    const rows = `SELECT * FROM projects WHERE user_id = ${userid} ORDER BY id DESC LIMIT 0 , 1; `;
    return rows;
}
// function add_article(userId, projectId, title, language, wordLength, intent, articleHeading) {
//     const rows = `INSERT INTO articals (user_id, project_id, title, language, words_length, intent, article_heading) VALUES ('${userId}',${projectId},'${title}','${language}','${wordLength}','${intent}','${articleHeading}')`;
//     return rows;
// }