const { Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize('records', 'Rashmi', 'rashmi@22', {
    dialect: 'mysql',
    host: 'localhost'
});
sequelize.authenticate().
then(() => console.log("Database connected ...")).
catch(err => console.error("Database connection error:", err));


module.exports = sequelize; 

























// const mysql = require('mysql2')

// const connection = mysql.createPool({
//     user : "Rashmi",
//     password : "rashmi@22",
//     host : "localhost",
//     port : 3306 ,
//     database : "records",
//     connectTimeout: 30000,
//     waitForConnections:true,
//     connectionLimit:30
// })


// connection.getConnection((err, connection) => {
//     if(err) {
//         console.log('iSSUE IN DB CONN');
//         console.log(err)
//     }
//     else{
//         console.log('Connected to db')
//     }
// })

// module.exports = connection