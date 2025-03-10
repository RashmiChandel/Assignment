const express = require("express")
const db = require("../database")
const router =express.Router()

 console.log("Fire")

router.get("/studsubs", (request, response) => {
    
   const statement = ` SELECT     s.id,     s.name,  GROUP_CONCAT(sub.Subject_name ORDER BY sub.Subject_name SEPARATOR ', ')
    AS subjects FROM Students s LEFT JOIN StudentSubjects ss ON s.id = ss.student_id LEFT JOIN Subjects sub ON 
    ss.subject_id = sub.id GROUP BY s.id `

     console.log("encountring error");

   db.query(statement, (error,result) => {
    if(error) {
        console.log("Error in fetching res");
    }
    return response.send( result)
   })
})

router.get("/:id", (request, response) => {
const id = request.params.id
const statement = ` SELECT     s.id,     s.name,    
 GROUP_CONCAT(sub.Subject_name ORDER BY sub.Subject_name SEPARATOR ', ') AS Subjects FROM Students s LEFT JOIN
 StudentSubjects ss ON s.id = ss.student_id LEFT JOIN subjects sub ON ss.subject_id = sub.id WHERE s.id = ? GROUP BY s.id `

db.query(statement,[id], (error, result) => {
    response.send(result)
})

})
module.exports = router