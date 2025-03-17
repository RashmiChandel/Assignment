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
}});

//GET ALL STUDENTS WITH THEIR SUBJECTS
  routerStudent.get('/students', async (req, res) => {
    try {
        const students = await Student.findAll({
            include: {
                model: Subject,
                attributes: ['id', 'subject_name'],
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

  const student = await Student.findByPk(id);                      //Find student
  if(!student) {
    return res.status(404).json({error: ' Student not found'});
  }
  await student.destroy();
res.json({message: ' Student deleted successfully'});
} catch(error) {
  res.status(500).json({error: error.message});
}});

// PARTICULAR STUDENT SELECTED ALL SUBJECTS AND THEIR MARKS
routerStudent.get('/students/:studentId', async(req, res) => {
  try{
    const { studentId } = req.params;

    const student = await Student.findOne({
      where: { id: studentId },
      attributes: ["name"],
      include: [
        { model: Subject,
          attributes: ["subject_name"],
         through: {attributes: ["marks"],
          },
        },
      ],
    });

if(!student){
  return res.status(404).json({message: "Student not found"});
}
const subjects = student.Subjects.map((subject) => ({
  subjectName: subject.subject_name,
  marks: subject.StudentSubject.marks, 
}));
const response = {studentName: student.name, subjects};
res.status(200).json(response);
  } catch(error){
    console.error("Error fetching student report: ", error);
    res.status(500).json({error: "Internal server error" });
  }
});

//MARKSHEET FORMAT
routerStudent.get('/students/:studentId/marksheet', async(req,res) => {
try{
  const { studentId } = req.params;

  const student = await Student.findOne({
    where: { id: studentId },
    attributes: ["name"],
    include: [
      { model: Subject,
        attributes: ["subject_name"],
        through: { attributes: ["marks"] },
      },
    ],
  });

  if(!student) {
    return res.status(404).json({message: " Student not found" });
  }

  let totalMarks = 0;
  let subjects = student.Subjects.map((subject) => {
    totalMarks += subject.StudentSubject.marks;
    return{
      "Subject Name": subject.subject_name,
      "Marks": subject.StudentSubject.marks,
    };
  });

  let percentage = (totalMarks / (subjects.length * 100)) * 100;

  const marksheet = {
    "Student Name": student.name,
    "Subjects": subjects,
    "Total Marks": totalMarks,
    "Percentage": `${percentage.toFixed(2)}%`,
  };

  res.status(200).json(marksheet);
} catch(error){
  console.error("Error in fetching student marksheet:", error);
  res.status(500).json({message: " Internal server error"});
}
});

//MARKSHEET OF ALL STUDENTS
routerStudent.get('/students/marksheets/percentage', async(req,res) => {
try{
  const students = await Student.findAll({
    attributes: ['id', 'name'],
    include: [
      {model: Subject,
       attributes: ["subject_name"],
      through: { attributes: ["marks"]},
      },
    ],
  });
  if(!students || students.length === 0) {
    return res.status(404).json({message: " No students found"});
  }

  const formattedResponse = students.map(student => {
    const subjects = student.Subjects.map(subject => ({
      subjectName: subject.subject_name,
      marks: subject.StudentSubject ? subject.StudentSubject.marks : 0, }));

  const totalMarks = subjects.reduce((sum, subject) => sum + subject.marks, 0);
  const percentage = subjects.length > 0 ? (totalMarks / (subjects.length * 100)) * 100 : 0;
   return { studentId: student.id,
          studentName: student.name,
          subjects,
          totalMarks,
          percentage: percentage.toFixed(2) + '%'};
  });
  return res.json(formattedResponse);
} catch(error){
  console.error("Error fetching studentys marksheet ", error);
  return res.status(500).json({message: " Internal server error"});
}
});

module.exports = routerStudent 