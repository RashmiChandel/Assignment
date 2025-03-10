const express = require("express")
const db = require("../database")
const router =express.Router()

 console.log("Hii")

router.get("/students", (request, response) => {
   const statement = 'select * from Students'
   db.query(statement, (error,result) => {
    if(error) {
        console.log("Error in fetching res");
    }
    return response.send( result)
   })
})
 
router.post("/addstudent", (request, response) => {
    const{Name, Email, Phone_no } = request.body
    db.query( "INSERT into Students(Name, Email, Phone_no) VALUES(?,?,?)",
       [Name, Email, Phone_no],
       (error, result) => {
        response.send(result)
       }
    )
})


router.put("/ustudent", (request, response) => {
    const{Name, id } = request.body
    db.query( "UPDATE Students SET Name = ? WHERE id = ? ",
       [Name, id],
       (error, result) => {
        if(error) {
            console.log("error", error);
        }
        response.send(result)
       }
    )
})


router.delete("/dstudent", (request, response) => {
    const{Phone_no} = request.body
    // console.log('Email ->', Email)
    db.query( "DELETE from Students WHERE Phone_no= ?",
       [Phone_no],
       (error, result) => {
        if(error){
            console.log(error)
        }
         response.send(result)
       }
    )

})



module.exports = router