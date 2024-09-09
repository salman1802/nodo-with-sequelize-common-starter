require("dotenv").config();

const Sequelize = require("sequelize");
const db = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USERNAME,
    process.env.MYSQL_PASSWORD,
    {
        dialect: "mysql",
        logging: false,
        host: process.env.MYSQL_DOMAIN,
        port: process.env.MYSQL_PORT,
    }
);

db.authenticate()
    .then(() => {
        console.log("Connected to the database successfully");
    })
    .catch((err) => {
        console.error("Unable to connect to the database:", err);
    });

module.exports = db;
