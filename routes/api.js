var express = require("express");
var mongoose = require("mongoose");
var url = "mongodb://127.0.0.1:27017/mydatabase";
const jwt= require("jsonwebtoken");

mongoose.connect(url,err=>{
    if(err){
        console.log('Errror!!' + err);
    }else{
        console.log("connect to mongodb")
    }
})

// to server
var router= express.Router();
var User= require("../models/users");


function verifyToken(req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send("Unauthorized Reques")
    }
     let token = req.headers.authorization.split(' ')[1]
     if(token== null){
         return res.status(401).send("Unauthorized Reques")
    }
    let payload= jwt.verify(token,'secretKey')
    if (!payload){
        return res.status(401).send("Unauthorized Reques")
    }
    req.userdb= payload.subject;
    next();
}


router.get("/",function(req,res){
    res.send("hello from api")
});




router.post("/register",(req,res)=>{
    let userData= req.body;
    let userdb= new User(userData);   
    userdb.save((err,registeredUser)=>{
        if(err){
            console.log(err)
        }else{
            res.status(200).send(registeredUser);
            // let payload= {subject:registeredUser._id}
            // let token= jwt.sign(payload,' ')
            // res.status(200).send({token});
        }
    })
})

router.post("/login",(req,res)=>{
    let userData= req.body;

    User.findOne({emailid: userData.username},(err,userdb)=>{
        if(err){
            console.log(err);
        }else{
            if(!userdb){
                res.status(401).send('invalid email');
            }else{
                if(userdb.password !== userData.password){ 
                    res.status(401).send('invalid password');
                }else{
                    let payload= {subject:userdb._id}
                    let token= jwt.sign(payload,'secretKey')
                    res.status(200).send({token})
                }
            }
        }
    })
})

router.get("/users",(req,res)=>{
    User.find({},(err,users)=>{
        if(err){
            res.status(401).send(err);
        }res.status(200).send(users)
    });
 })


module.exports = router; 