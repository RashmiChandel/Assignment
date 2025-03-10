const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Subject = sequelize.define('Subject', {
    id: {
        type: Sequelize.DataTypes.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true
    },
    subject_name: {
  type: Sequelize.DataTypes.STRING, allowNull: false, unique: true },
    
}, {tableName: 'subject', timestamps: false});

module.exports = Subject;