import express from 'express';
// const express = require('express');
const router = express.Router();
import signupController from '../controllers/signup';
import loginController from '../controllers/login';
import notificationController from '../controllers/notification';
import userController from '../controllers/user';
import projectController from '../controllers/project';
import articleController from '../controllers/article';
import copyWriterController from '../controllers/copyWriter';
import dummyController from '../controllers/dummy';

// const signupController = require('../controllers/signup');
// const loginController = require('../controllers/login');
// const notificationController = require('../controllers/notification');
// const userController = require('../controllers/user')
// const projectController = require('../controllers/project')
// const articleController = require('../controllers/article')
// const copyWriterController = require('../controllers/copyWriter')
// const dummyController = require('../controllers/dummy')


router.get('/dummy', dummyController.dummyIndex);
router.post('/step-1', signupController.step_1);
router.post('/verify-code', signupController.verify_code);
router.post('/step-2', signupController.step_2);
router.post('/social-register', signupController.social_register);
router.post('/login', loginController.login);
router.post('/forget-password', loginController.forget_password);
router.post('/login-verify-code', loginController.verify_code);
router.post('/reset-password', loginController.reset_password);
router.post('/social-register', loginController.social_register);
router.post('/get-notification', notificationController.get_notification);
router.post('/view-notification', notificationController.notification_view);
router.post('/delete-notification', notificationController.delete_notification);
router.post('/user-avatar', userController.user_avatar);
router.post('/user-subscription', userController.user_subscription);
router.post('/user-usage', userController.user_usage);
router.post('/save-project', projectController.save_project);
router.post('/get-project', projectController.get_project);
router.post('/delete-project', projectController.delete_project);
router.post('/edit-project', projectController.edit_project);
router.get('/get-project-id', projectController.get_project_id);
router.post('/save-category', projectController.save_category);
router.post('/get-category', projectController.get_category);

router.post('/add-article', articleController.add_article);
router.post('/get-articles', articleController.get_articles);
router.post('/get-article', articleController.get_article);
router.post('/update-article', articleController.update_article);

router.post('/copy-writer', copyWriterController.copy_writer);




export default router;
// module.exports = router;