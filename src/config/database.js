const { Sequelize } = require("sequelize");
const fs = require("fs");


const fileData = fs.readFileSync(__dirname + '/../ssl/certificate.pem', 'utf8');

// Kết nối tới MySQL
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: "mysql",
    logging: false,

    dialectOptions: {
        ssl: {
            ca: fileData
        }
    }
});


module.exports = sequelize;
