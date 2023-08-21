import router from './routes/routes';
// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// const cors = require('cors');
// var bodyParser = require('body-parser');
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

var app = express();
// const router = require('./routes/routes');
// var router = require('./routes/routes');

// import { jwt } from 'jsonwebtoken';
// const jwt = require('jsonwebtoken');



app.use(cors());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// // Implement token verification function
// const verifyToken = (token) => {
//   // Replace this with your actual token verification logic
//   // For demonstration purposes, it always returns true
//   return true;
// }

// // The Auth middleware
// const authMiddleware = (req, res, next) => {
//   if (req.headers.authorization) {
//     // Assume 'Bearer <token>' structure
//     const token = req.headers.authorization.split(' ')[1];
//     // Implement your token verification process here
//     if (verifyToken(token)) {
//       next();
//     } else {
//       res.status(401).json({ error: "Unauthorized" });
//     }
//   } else {
//     res.status(400).json({ error: "Authorization header required" });
//   }
// };

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ error: "Unauthorized" });;

  jwt.verify(token, 'SECRET_KEY', (err, user) => {
    if (err) return res.status(400).json({ error: "Authorization header required" });
    req.user = user;
    next();
  });
}

app.use('/signup', router);
app.use('/login', router);
app.use(authenticateToken);
app.use('/notifation', router);
app.use('/user', router);
app.use('/project', router);
app.use('/article', router);
app.use('/copy-writer', router);
// app.use('/getchats', chatRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
// module.exports = app;
