const express = require("express")
const cors = require("cors")
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = require('./util/database');
const routerStudent = require('./controller/students')
const routerSubject = require('./controller/subjects')

const app = express()
app.use(express.json())
app.use(cors());

app.use('/api' , routerStudent );
app.use('/api' , routerSubject);

sequelize.sync()
.then(() => {
    console.log(' Database synced successfully')})
 .catch((err) => console.error('Error in syncing database :', err));

app.listen(3001, () => console.log('Server running on port 3001'));






  


