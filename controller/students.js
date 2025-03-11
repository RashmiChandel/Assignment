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
//  routerStudent.get('/student', async (req, res) => {
//   try {
//     const students = await Student.findAll();

//     res.json(students);
// } catch(error){
//   res.status(500).json({ error: error.message});
// }
//   });

// routerStudent.post('/students', (req, res) => {
//   if (!req.body || Object.keys(req.body).length === 0) {
//       return res.status(400).json({ error: "Invalid JSON or empty request body" });
//   }
//   res.json({ message: "Student added successfully", data: req.body });
// });

//GET ALL STUDENTS WITH THEIR SUBJECTS
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
          res.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

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
}});



 
module.exports = routerStudent 