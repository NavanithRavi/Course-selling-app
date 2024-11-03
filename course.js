const express = require('express');
const fs = require('fs')
const bodyParser= require('body-parser')
const app = express();
const port =3001;
const jwt = require('jsonwebtoken')
const cors = require('cors');
const secretAdmin = "benchod";
const secretUser = "chutiya";
app.use(bodyParser.json());
const authenticateAdmin =(req,res,next)=>{
      const token = req.headers.authorization;
      const extract  = token.split(' ')[1];
      const email = jwt.verify(extract,secretAdmin,(err,user)=>{
        if(err){
            res.status(403).json({message:"Authentication failed"})
        }
        else{
            next();
        }
      })
}
const generateAdmintoken = (user) =>{
       const payload = {email:user.email};
      return jwt.sign(payload,secretAdmin);
};
const generateUsertoken = (user) =>{
    const payload = {email:user.email};
   return jwt.sign(payload,secretUser);
};
app.use(cors());
app.post('/adminSignin',(req,res)=>{
   var jsonBody=[];
   const {email,password}=req.body;
   fs.readFile("admin.json","utf-8",(err,data)=>{
    jsonBody=JSON.parse(data);
    var check = jsonBody.find((user)=> user.email===email);
    if(check){
        res.json({message:"Admin already exist"});
    }
    else{
        jsonBody.push(req.body);
        var stringObject = JSON.stringify(jsonBody,null,2);
        fs.writeFile("admin.json",stringObject,(err)=>{
          const token = generateAdmintoken({email:email});
          res.json({message:"Signedin successfully",token});
        })
    }
   })
})
app.post('/adminLogin',(req,res)=>{
    var jsonBody=[];
    const {email,password}= req.body;
    fs.readFile('admin.json','utf-8',(err,data)=>{
            jsonBody = JSON.parse(data);
            const user =jsonBody.find((data)=> data.email===email&& data.password===password);
            if(user){
                const token = generateAdmintoken(user);
                res.json({message:"loginSuccessful",token});
            }
            else{
                res.status(403).send({message:"Admin Authentication failed"})
            }
 })
})
app.post('/userLogin',(req,res)=>{
    var jsonBody=[];
    const {email,password}= req.body;
    fs.readFile('user.json','utf-8',(err,data)=>{
            jsonBody = JSON.parse(data);
            const user =jsonBody.find((data)=> data.email===email&& data.password===password);
            if(user){
                const token = generateUsertoken(user);
                res.json({message:"loginSuccessful",token});
            }
            else{
                res.status(403).send({message:"user Authentication failed"})
            }
 })
})
app.post('/userSignin',(req,res)=>{
    var jsonBody=[];
    const {email,password}=req.body;
    fs.readFile("user.json","utf-8",(err,data)=>{
     jsonBody=JSON.parse(data);
     var check = jsonBody.find((user)=> user.email===email);
     if(check){
         res.json({message:"user already exist"});
     }
     else{
         jsonBody.push(req.body);
         var stringObject = JSON.stringify(jsonBody,null,2);
         fs.writeFile("user.json",stringObject,(err)=>{
           const token = generateUsertoken({email:email});
           res.json({message:"Signedin successfully",token});
         })
     }
    })
 })
app.post("/addCourse",authenticateAdmin,(req,res)=>{
    var jsonBody=[];
    const course=req.body;
    fs.readFile("course.json","utf-8",(err,data)=>{
     jsonBody=JSON.parse(data);
     var check = jsonBody.find((course)=> course.id===course.id);
     if(check){
         res.json({message:"Course already exist"});
     }
     else{
         jsonBody.push(req.body);
         var stringObject = JSON.stringify(jsonBody,null,2);
         fs.writeFile("course.json",stringObject,(err)=>{
           res.json({message:"Course Added successfully"});
         })
     }
    })
})
app.listen(port,()=>{
    console.log("running on 3001");
});