const Sequelize  = require('sequelize');
const sequelize = require('../util/database');
const Student = require('../models/student');
const Subject = require('../models/subject');

const StudentSubject = sequelize.define('StudentSubject', {
    id: { type: Sequelize.DataTypes.INTEGER,
         autoIncrement: true, primaryKey: true },

    student_id: { type: Sequelize.DataTypes.INTEGER,
        allowNull : false,
    references: {
        model: Student,
        key: 'id'
    },
    onDelete: 'CASCADE'
 },

    subject_id: { type: Sequelize.DataTypes.INTEGER,
        allowNull : false,
    references: {
        model: Subject,
        key: 'id'
},
onDelete:'CASCADE'
 },

//  marks: {
//     type: Sequelize.DataTypes.INTEGER,
//     allowNull: true // Marks can be null initially
// }

}, {tableName: 'student_subject', timestamps: false });

 Student.belongsToMany(Subject, {through: StudentSubject, foreignkey: 'student_id'});
 Subject.belongsToMany(Student, {through: StudentSubject, foreignkey: 'subject_id'});
 
 
 module.exports = StudentSubject;