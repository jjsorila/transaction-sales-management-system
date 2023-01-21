const mysql = require("mysql");

module.exports = mysql.createConnection({
    database: "piggery",
    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
    multipleStatements: true
})

