const express =  require('express');
const Student = require('../models/student');
const Subject = require('../models/subject');
const StudentSubject = require('../models/studentsubject');
const routerStudent = express.Router()


routerStudent.post('/students', async (req, res) => {
    try {
        const {name, email,phone_no } = req.body;

        if(!name || !email || !phone_no){
          return res.status(400).json({ error: "All fields are required" });
        }

        const student = await Student.create({name, email, phone_no});

    return res.status(201).json({ message: " Student created successfully"});
} catch ( error) {
  if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({ error: "Email already exists" });
}
  console.error("Error creating Students", error);
    res.status(500).json({ error: "Internal server error" });
}

});

 //Get all students
 routerStudent.get('/student', async (req, res) => {
  try {
    const students = await Student.findAll();

    res.json(students);
} catch(error){
  res.status(500).json({ error: error.message});
}
  });

  routerStudent.get('/students', async (req, res) => {
    try {
        const students = await Student.findAll({
            include: {
                model: Subject,
                attributes: ['subject_name'],
                through: { attributes: [] }, // This removes the join table attributes
            }
        });

        if (!students || students.length === 0) {
            return res.status(404).json({ error: "No students found" });
        }

        const studentSubjects = students.map(st => ({
            id: st.id,
            name: st.name,
            email: st.email,
            phone_no: st.phone_no,
            subjects: st.Subjects ? st.Subjects.map(subject => subject.subject_name) : [] // Ensure it doesn't break if no subjects are found
        }));

        //res.json(studentSubjects); // ✅ Send response only once
          res.json(students);

    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

  

// routerStudent.get('/students', async (req, res) => {
//     try {
//       const student = await Student.findAll({
//         include: {
//           model: Subject,
//           attributes: ['subject_name'],
//           through: { attributes: [] }, 
//         },
//       });
//       // console.log(student.map((st) => st.Subjects));
//       const studentSubjects = student.map(st => ({ 
//         id: st.id, name: st.name, email: st.email, phone_no: st.phone_no,
//         subjects: st.Subjects.map(subject => subject.subject_name)
//       }));
      
//       console.log(studentSubjects);
//       res.json(studentSubjects);

//     if(!student) {
//    return res.status(404).json({error: "student not found"});
//     }

//     // const subjectNames = student.Subject.map(subject => subject.subject_name);
//     res.status(200).json(student);
//     } catch (error) {
//       console.error("Error fetching students:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   });


  routerStudent.put("/students/:id", async (req, res) => {
    try {
        const { id } = req.params;  
        const { name, email, phone_no } = req.body;  

        
        const studentId = parseInt(id, 10);

      
        const student = await Student.findByPk(studentId);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        } 
        await Student.update(
            { name, email, phone_no }, 
            { where: { id: studentId } } 
        );

        const updatedStudent = await Student.findByPk(studentId);

        res.json({ message: "Student updated successfully", student: updatedStudent });

    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

  
  
 
routerStudent.delete('/students/:id', async (req, res) => {
try {
  const { id } = req.params;

  const student = await Student.findByPk(id);               //Find student
  if(!student) {
    return res.status(404).json({error: ' Student not found'});
  }
  await student.destroy();
res.json({message: ' Student deleted successfully'});
} catch(error) {
  res.status(500).json({error: error.message});
}

});

 routerStudent.post('/insert-marks', async (req, res) => {
  try {
      const { studentId, marks } = req.body;

      // Check if the student exists
      const student = await Student.findByPk(studentId);
      if (!student) {
          return res.status(404).json({ message: "Student not found" });
      }

      // Loop through each subject mark and insert into StudentSubject table
      for (let subjectMark of marks) {
        console.log(subjectMark)
          const { subjectId, mark } = subjectMark;
          console.log(subjectId)
          // Check if the subject exists
          const subject = await Subject.findByPk(subjectId);
          if (!subject) {
              return res.status(404).json({ message: `Subject with ID ${subjectId} not found` });
          }

          // Insert or update marks in StudentSubject table
          subject_id=subjectId
          student_id = studentId
          await StudentSubject.create({
              student_id,
              subject_id,
              marks: mark
          });
      }

      res.status(200).json({ message: "Marks inserted successfully" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = routerStudent 