const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./model/user');
const OtpUser = require('./model/otp');
const bcrypt = require('bcryptjs')
const sendEmail = require("./sendEmail");
const dotenv = require('dotenv');
var nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const app = express();

dotenv.config();
app.use("/",express.static(path.join(__dirname,'static')));
// middleware to decode the body coming 
app.use(express.urlencoded({extended: true }))
  
app.use(express.json())


app.post('/api/register',async(req,res) => {
           console.log(req.body);
           const {username,password:plainTextPassword,email} = req.body;
           if(!username || typeof username !== 'string'){
                return res.json({status:'error',error:"Invalid username"});
           }
           if(!plainTextPassword || typeof plainTextPassword !== 'string'){
                return res.json({status:'error',error:"Invalid password"});
           }
           if(plainTextPassword.length<5){
                return res.json({status:'error',error:"Password too small.Should be atleast 6 characters"});
           }
           const password = await bcrypt.hash(plainTextPassword,10);
            
           try{
           const response = await User.create({username,password,email});
           console.log("User:",response);
           }
           catch(error){
               console.log(error.message);
               if(error.code === 11000){
               return res.json({status:"error",error:"Username already in use"});
               }
               throw error;
           }
           res.json({status:"ok"})
})
app.post('/api/login',async (req, res)=>{
      const {username,password} = req.body;
      const user = await User.findOne({username}).lean();
      if(!user){
            return res.json({status:"error",error:"Invalid username/password"})
      }
      if(await bcrypt.compare(password,user.password)){
            const token = jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRET)
            return res.json({status:"ok",data:token})
      }
})

app.post('/api/reset/:userId',async(req,res)=>{
      const {password,email} = req.body;
      const user = await User.findById(req.params.userId)
      if(!user){
        return res.json({status:'error',error:'No user exist with this email address'})
        }
      user.password = password;
      await user.save();
      res.json({status:'success',message:"Password changed successfully"})
})


app.post('/api/changePassword',async(req, res)=>{
    const user = await User.findOne({email:req.body.email})
    if(!user){
    return res.json({status:'error',error:'No user exist with this email address'})
    }
    else{
        const link = `http://localhost:3000/reset/${user._id}`;
        await sendEmail(user.email, "Password reset", link);
        res.json({status:'ok',message:"Link for password reset sent to your mail"});
    }
})



mongoose.connect('mongodb://localhost:27017/login',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
})
app.listen(3000,()=>{
     console.log("Server running at port 3000");
});