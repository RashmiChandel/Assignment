const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../util/database');

const Student = sequelize.define('Student', {
    id: {
        type: Sequelize.DataTypes.INTEGER,autoIncrement: true,
        primaryKey: true },
    name: {
        type: Sequelize.DataTypes.STRING},
    email:{ 
        type: Sequelize.DataTypes.STRING, unique: true },
    phone_no: 
    {
        type: Sequelize.DataTypes.STRING, allowNull: false},
createdAt: {
    type: Sequelize.DataTypes.DATE, allowNull: false, defaultValue: Sequelize.DataTypes.NOW,
    // field: "created_at", 
    },
  updatedAt: {
    type: Sequelize.DataTypes.DATE, allowNull: false, defaultValue: Sequelize.DataTypes.NOW,
    // field: "updated_at",
  },
    
}, {tableName: 'student', timestamps: true});

module.exports = Student;






















