var request = require('request');
const { body, checkSchema, validationResult } = require('express-validator');
var db = require('../connection');

exports.add_article = [

    (req, res, next) => {

        if (req.body.language == undefined) {
            return res.status(400).json({
                success: false,
                errors: 'language field cannot be empty'
            });
        }
        if (req.body.word_length === undefined) {
            return res.status(400).json({
                success: false,
                errors: 'word length cannot be empty'
            });
        }
        if (req.body.intent == undefined) {
            return res.status(400).json({
                success: false,
                errors: 'intent field cannot be empty'
            });
        }
        if (req.body.category === "") {
            return res.status(400).json({
                success: false,
                errors: 'category must be in array'
            });
        }
        if (req.body.category[0] === undefined) {
            return res.status(400).json({
                success: false,
                errors: 'category field type array not be Empty'
            });
        }
        if (req.body.title == undefined) {
            return res.status(400).json({
                success: false,
                errors: 'title field cannot be empty'
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
                        add_article(req.user.userid, req.body.project_id, req.body.title, req.body.language, req.body.word_length, req.body.intent, req.body.article_heading),
                        async function (err, result, fields) {


                            let responseResult = {
                                message: 'Article Created successfully.'
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

exports.get_articles = [

    (req, res, next) => {

        if (req.body.project_id == undefined) {
            return res.status(400).json({
                success: false,
                errors: 'Project Id cannot be empty'
            });
        }

        db.query(

            get_oauth_token(req.user.userid),
            async function (err, result, fields) {

                if (result[0] && result[0].id === req.headers['authorization'].split(' ')[1]) {

                    db.query(
                        get_articles(req.user.userid, req.body.project_id),
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
];

exports.get_article = [

    (req, res, next) => {

        if (req.body.project_id == undefined) {
            return res.status(400).json({
                success: false,
                errors: 'project Id cannot be empty'
            });
        }
        if (req.body.article_id == undefined) {
            return res.status(400).json({
                success: false,
                errors: 'article Id cannot be empty'
            });
        }

        db.query(

            get_oauth_token(req.user.userid),
            async function (err, result, fields) {

                if (result[0] && result[0].id === req.headers['authorization'].split(' ')[1]) {

                    db.query(
                        get_article(req.body.project_id, req.body.article_id),
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
];

exports.update_article = [

    (req, res, next) => {

        if (req.body.project_id == undefined) {
            return res.status(400).json({
                success: false,
                errors: 'project Id cannot be empty'
            });
        }
        if (req.body.article_id == undefined) {
            return res.status(400).json({
                success: false,
                errors: 'article Id cannot be empty'
            });
        }
        if (req.body.article_text == undefined) {
            return res.status(400).json({
                success: false,
                errors: 'article Id cannot be empty'
            });
        }

        db.query(

            get_oauth_token(req.user.userid),
            async function (err, result, fields) {

                if (result[0] && result[0].id === req.headers['authorization'].split(' ')[1]) {
                    db.query(
                        update_article(req.body.project_id, req.body.article_id, req.body.article_text),
                        async function (err, result, fields) {
                            let responseResult = {
                                message: 'Article Save successfully'
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

function get_oauth_token(user_id) {
    const rows = `SELECT * FROM oauth_access_tokens WHERE user_id = '${user_id}' `;
    return rows;
}

function add_article(userId, projectId, title, language, wordLength, intent, articleHeading) {
    const rows = `INSERT INTO articals (user_id, project_id, title, language, words_length, intent, article_heading) VALUES ('${userId}',${projectId},'${title}','${language}','${wordLength}','${intent}','${articleHeading}')`;
    return rows;
}

function get_articles(userId, projectId) {
    const rows = `SELECT * FROM articals WHERE user_id = ${userId} AND project_id = ${projectId}`;
    return rows;
}

function get_article(projectId, ArticleId) {
    const rows = `SELECT * FROM articals WHERE project_id=${projectId} AND id=${ArticleId}`;
    return rows;
}

function get_project_id(userId, projectId) {
    const rows = `SELECT * FROM categories WHERE user_id = ${userId} AND project_id=${projectId}`;
    return rows;
}

function update_article(projectId, articleId, articleText) {
    const rows = `UPDATE articals SET artical2='${articleText}' WHERE id='${articleId}' AND project_id='${projectId}'`;
    return rows;
}