const express =  require('express');
const Student = require('../models/student');
const Subject= require('../models/subject');
const StudentSubject = require('../models/studentsubject');
const sequelize = require('../util/database');
const routerSubject = express.Router()

routerSubject.post('/subjects', async (req, res) => {
    try {
        const { subject_name } = req.body;

        const subject = await Subject.create({ subject_name });     
       res.status(201).json({message : "Subject added"});
} catch ( error) {
  if (error.subject_namename === "SequelizeUniqueConstraintError") {
    return res.status(400).json({ error: "Subject name already exists" });
}

    res.status(500).json({ error: "Internal server error" });
}
});

 //Get all subjects with students
 routerSubject.get('/subjects', async (req, res) => {
    try {
      const subjects = await Student.findAll({
        include: Subject
      });
  
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  //Get all subjects
  routerSubject.get('/subject', async (req, res) => {
  try {
    const subjects = await Subject.findAll();

    res.json(subjects);
} catch(error){
  res.status(500).json({ error: error.message});
}
  });


 routerSubject.put('/subjects/:id', async (req,res) => {
    try{
      const { id } = req.params;
      const { subject_name } = req.body;
  
      const subject = await Subject.findByPk(id); //find student
      if(!subject){
        return  res.status(404).json({error: " Subject not found" });
      }
  
      await subject.update({ subject_name}); //Update Subject
      res.json(subject);
    } catch (error) {
      res.status(500).json({ error: " Subject not  updated" });
    }
  
  });


  routerSubject.delete('/subjects/:id', async (req, res) => {
  try {
    const { id } = req.params;
  
    const subject = await Subject.findByPk(id);                              //Find student
    if(!subject) {
      return res.status(404).json({error: ' Student not found'});
    }
    await subject.destroy();
  res.json({message: ' Sujbect deleted successfully'});
  } catch(error) {
    res.status(500).json({error: error.message});
  }
  
  });


// Assign subjects to a student
routerSubject.post('/assignSubjects',  async (req, res) => {
  try {
      const { studentId, subjectIds } = req.body;

      if (!studentId || !subjectIds || !Array.isArray(subjectIds)) {
          return res.status(400).json({ error: "Invalid input. Provide studentId and an array of subjectIds." });
      }

      const student = await Student.findByPk(studentId);
      if (!student) {
          return res.status(404).json({ error: "Student not found" });
      }
      
      const subjects = await Subject.findAll({ where: { id: subjectIds } });
      if (subjects.length !== subjectIds.length) {
          return res.status(400).json({ error: "Some subjects not found" });
      }

      // ✅ Assign Subjects to Student (Many-to-Many Relationship)
      await student.setSubjects(subjectIds);  // Sequelize automatically manages associations

      // ✅ Fetch Updated Data
      const updatedStudent = await Student.findByPk(studentId, {
          include: {
              model: Subject,
              through: { attributes: [] }, // Exclude junction table fields
          },
      });

      return res.json({
          message: "Subjects assigned successfully",
          student: updatedStudent,
      });

  } catch (error) {
      console.error("Error assigning subjects:", error);
      return res.status(500).json({ error: "Internal Server Error" });
  }
} );

  module.exports = routerSubject