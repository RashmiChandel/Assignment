 const express = require("express")
const cors = require("cors")
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = require('./util/database');
const routerStudent = require('./controller/students')
const routerSubject = require('./controller/subjects')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true}));
app.use(cors());

app.use((req, res, next) => {
    console.log("Request received:", req.method, req.url);
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    next();
});


app.use('/api' , routerStudent );
app.use('/api' , routerSubject);


sequelize.sync()
.then(() => {
    console.log(' Database synced successfully')})
 .catch((err) => console.error('Error in syncing database :', err));

app.listen(3001, () => console.log('Server running on port 3001'));






// app.use("/student", routerStudent)
// app.use("/subject", routerSubjects)
// app.use("/studsub",routerStudSub)

// sequelize.authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//     return sequelize.sync(); // Returning sync() ensures proper promise chaining
//   })
//   .then(result => {
//     console.log(result);
//     app.listen(3000, () => {
//       console.log("Server started at 3000");
//     });
//   })
//   .catch(error => {
//     console.error('Unable to connect to the database:', error);
//   });


// sequelize.sync()
// .then(result => {
//   console.log("Tables created successfully")
// })
// .catch(error => {
// console.log(error)
// console.error("Error creating tables:", error)
// });

// app.listen(3000,  () => {
//   console.log(`Server running on port 3000 `);
// })

// async function main() { 
//   if (sequelize) {

//     const Student = require('./models/student');

//     try {
//       await sequelize.authenticate();
//       console.log('Database connection established.');
//       await sequelize.sync({force: true});
//       console.log('student table synced.');

//       const newStudent = await Student.create({
//         name: 'Alice',
//         email: 'alice.smith@example.com',
//         phone_no: "56535677855",
//       });

//       console.log('New user created:', newStudent.toJSON());

//       const users = await Student.findAll();
//       console.log('All Users:', JSON.stringify(users));

//     } catch (error) {
//       console.error('Error:', error);
//     } finally {
//         sequelize.close();
//     }
//   }
// }

// main();




  


