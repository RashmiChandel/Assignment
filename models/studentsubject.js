const Sequelize  = require('sequelize');
const sequelize = require('../util/database');
const Student = require('../models/student');
const Subject = require('../models/subject');

const StudentSubject = sequelize.define('StudentSubject', {
    id: { type: Sequelize.DataTypes.INTEGER,
         autoIncrement: true, primaryKey: true },

}, {tableName: 'student_subject', timestamps: false });

 Student.belongsToMany(Subject, {through: StudentSubject, foreignkey: 'student_id'});
 Subject.belongsToMany(Student, {through: StudentSubject, foreignkey: 'subject_id'});
 
 
 module.exports = StudentSubject;