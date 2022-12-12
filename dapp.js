
const mongoose = require("mongoose"); 
const express = require("express");
const app = express();
const validator = require("validator");
const port = process.env.PORT || 8000;

app.use(express.json());


mongoose.set('strictQuery',false);
mongoose.connect("mongodb://0.0.0.0:27017/register").then(()=>
console.log("Connection done")).
catch((err)=>
console.log(err));

const studentSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true,
        minlength:3
    },
    email : {
        type:String,
        required:true,
        unique:[true,"Email id already present"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email")
            }
        }
    },
    phone : {
        type:String,
        required:true,
        min:10,
        max:10,
        unique:true
    }
})

const Student = new mongoose.model('Student',studentSchema);
//create 
app.post("/students",async(req,res)=>{
try{
    const user = new Student(req.body);
    const createUser = await user.save();
    res.status(201).send(createUser);
}
catch(e){
    res.status(400).send(e);
}
})
//get all the students
app.get("/students",async(req,res)=>{
    try{
       const data=await Student.find();
       res.send(data);
    }catch(e){
        res.send(e);
    }
})

// get individual data
app.get("/students/:id", async (req,res) =>{
    try{
        const _id = req.params.id;
        const studentData = await Student.findById(_id);
        console.log(studentData);

        if(!studentData){
            return res.status(404).send("No data found");
        }
        else{
            res.send(studentData);
        }
    }
    catch(err){
        res.status(400).send(err);
    }
})
//delete 
    app.delete("/students/:id",async(req,res) =>{
        try{
        const _id=req.params.id;
        console.log(_id);
        const deleteStud=  await Student.findByIdAndDelete(req.params.id);
        if(!req.params.id){
        return res.status(400).send();
        }
        else{
       res.send(deleteStud);
        
        }
     } catch(e){
            res.status(500).send(e);
        }

     })

//update
app.patch("/students/:id",async(req,res) =>{
    try{
    const _id=req.params.id;
    console.log(_id);
    const updateStud=  await Student.findByIdAndUpdate(req.params.id,req.body);
    
   res.send(updateStud);
 } catch(e){
        res.status(404).send(e);
    }

 })



app.listen(port,()=>{
    console.log(`connection is established at ${port}`);
})

