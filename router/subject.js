const express = require("express")
const db = require("../database")
const router =express.Router()

 console.log("Hello")

router.get("/subjects", (request, response) => {
   const statement = 'select * from Subjects'
   db.query(statement, (error,result) => {
    return response.send( result)
   })
})


router.post("/addsub", (request, response) => {
    const{Subject_name} = request.body
    db.query( "INSERT into Subjects(Subject_name) VALUES(?)",
       [Subject_name],
       (error, result) => {
        response.send(result)
       }
    )
})


router.delete("/dsub", (request, response) => {
    const{Subject_name} = request.body
    db.query( "DELETE from Subjects WHERE Subject_name = ?",
       [Subject_name],
       (error, result) => {
        response.send(result)
       }
    )
})


module.exports = router