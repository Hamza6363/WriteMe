// import "reflect-metadata";
const reflectMetadata = require("reflect-metadata");
const { DataSource } = require("typeorm");
const { User } = require("./src/entities/User.ts");
// import { DataSource } from "typeorm";
// import { User } from "./src/entities/User";

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.MYSQL_HOST,
    port: 3306,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: ["src/entity/*.ts"],
    synchronize: true,
    logging: false,
})

// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource.initialize()
    .then(() => {

        console.log("this file working perfectly");
        // here you can start to work with your database
    })
    .catch((error) => console.log(error))