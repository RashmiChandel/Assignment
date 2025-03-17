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
  }});


  //STUDENT CAN CHOOSE SUBJECTS
  routerSubject.post('/add-subjects', async(req, res) => {
  try{
    const{studentId, subjectId} = req.body;
  
    const student = await Student.findByPk(studentId);
    if(!student){
      return res.status(404).json({ error : 'Student not found'});
    }
    const subjects = await Subject.findAll({
      where: {id: subjectId }
    });
  
    if(subjects.length !== subjectId.length){
      return res.status(404).json({ message: "One or more subjects not found"});
    }
    await student.addSubjects(subjects);
    return res.status(200).json({ message: " Subjects assigned successfully"});
  } catch(error){
  console.log('Error adding subjects', error);
  return res.status(500).json({ error: 'Internal server error'});
  }
  });

  //STUDENT CAN UPDATE CHOOSED SUBJETS
routerSubject.put('/update-subjects', async (req,res) => {
try{
  const { studentId, subjectId} = req.body;

   const student = await Student.findByPk(studentId);
   if(!student){
    return res.status(404).json({ error: " Student not found"});
   }
   const subjects = await Subject.findAll({
    where: { id: subjectId }
   });

   if(subjects.length !== subjectId.length){
    return res.status(404).json({message: " One or more subjects not found"});
   }

   await student.setSubjects([]);    //If want to add subjects without deleting previous one then remove this

   await student.addSubjects(subjects);

   return res.status(200).json({message: "Subjects updated successfully"});
}  
catch(error){
console.error(" Error in updating subjects: ", error);
return res.status(500).json({ error: " Internal server error"});
}
});

//INSERT MARKS INTO SUBJECTS
routerSubject.post('/students/:studentId/subjects/:subjectId/marks', async (req,res) =>{
     const { studentId, subjectId } = req.params;
     const { marks } = req.body;

     try{
      let record = await StudentSubject.findOne({
        where: { studentId, subjectId},
      });
      if(record){
        record.marks = marks;
        await record.save();
        return res.json({message: "Marks updated successfully", data : record });
       } else {
        const newRecord = await StudentSubject.create({
          studentId, subjectId, marks,
        });
    return res.json({message: "Marks added successfully", data: newRecord});    
       }
     } catch(error){
      console.error("Error in updating marks", error);
      return res.status(500).json({error: "Internal server error" });
     }
});

// GET PARTICULAR STUDENT SUBJECT MARK
routerSubject.get("/students/:studentId/subjects/:subjectId", async(req,res) => {
  const { subjectId,studentId} = req.params;
  try{
    const result = await StudentSubject.findOne({
      where: {studentId, subjectId},
      include: [
      {
        model: Student, attributes: ["name"],
      },
      {
        model: Subject , attributes: ["subject_name"],
      },
      ],
      attributes: ["marks"],
    });

    if(!result){
      return res.status(404).json({message: "Student has not enrolled into this subject"});
    }
    return res.json({
      studentName: result.Student.name,
      subjectName: result.Subject.subject_name,
      marks: result.marks,
    });
  } catch(error){
    console.error(error,"Error in fetching student marks: ");
    return res.status(500).json({error: "Internal server error"});
  }
});

  module.exports = routerSubject