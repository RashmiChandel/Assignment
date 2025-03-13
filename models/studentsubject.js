const Sequelize  = require('sequelize');
const sequelize = require('../util/database');
const Student = require('../models/student');
const Subject = require('../models/subject');

const StudentSubject = sequelize.define('StudentSubject', {
    id: { type: Sequelize.DataTypes.INTEGER,
         autoIncrement: true, primaryKey: true },

    marks:{ type: Sequelize.DataTypes.INTEGER,
           allowNull: true }    
}, {tableName: 'student_subject', timestamps: false });

 Student.belongsToMany(Subject, {through: StudentSubject, foreignKey: 'studentId'});
 Subject.belongsToMany(Student, {through: StudentSubject, foreignKey: 'subjectId'});
 
 StudentSubject.belongsTo(Student, {foreignKey: "studentId"});
 StudentSubject.belongsTo(Subject, {foreignKey: "subjectId"});
 module.exports = StudentSubject;