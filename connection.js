var mysql = require('mysql2');
require('dotenv').config(); 


var pool = mysql.createPool({
  host:  process.env.MYSQL_HOST,
  port:  process.env.MYSQL_PORT,
  user:  process.env.MYSQL_USER,
  password:  process.env.MYSQL_PASSWORD,
  database:  process.env.MYSQL_DATABASE
});

pool.getConnection((err,connection)=> {
  if(err)
  throw err;
  console.log('Database connected successfully');
  connection.release();
});

module.exports = pool;





// require('dotenv').config(); 
// const { createConnection } = require('typeorm');
// const Dummy = require('./src/entities/Dummy.ts')


// createConnection({
//   type: 'mysql',
//   host:  process.env.MYSQL_HOST,
//   port:  process.env.MYSQL_PORT,
//   username: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
//   entities: [Dummy],
//   synchronize: true // Automatically creates database tables based on entities
// }).then(connection => {
//   console.log('Connected to database');

//   // Your application logic here
// }).catch(error => {
//   console.error('Database connection error', error);
// });