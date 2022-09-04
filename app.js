//jshint esversion:6
require("dotenv").config();
const express= require("express");
const ejs= require("ejs");
const bodyParser= require("body-parser");
const mongoose= require("mongoose");
//const encrypt= require("mongoose-encryption");

//const md5= require("md5");
const bcrypt= require("bcrypt");
const saltRounds= 10;

const app= express();
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema= new mongoose.Schema({
    email: String,
    password: String    
})

//userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User= new mongoose.model("User", userSchema);

app.get("/", function(req,res){
    res.render("Home");
})

app.get("/Login", function(req,res){
    res.render("Login");
})

app.get("/Register", function(req,res){
    res.render("Register");
})

app.post("/Register", function(req,res){
    
    bcrypt.hash(req.body.password, saltRounds, function(err,hash){
        const newUSer= new User({
            email: req.body.username,
            password: hash
        });
        newUSer.save(function(err){
            if(err){
                console.log(err);
            }
            else{
                res.render("secrets");
            }
        }); 
    })
    
    // const newUSer= new User({
    //     email: req.body.username,
    //     password: md5(req.body.password)
    // });
    // newUSer.save(function(err){
    //     if(err){
    //         console.log(err);
    //     }
    //     else{
    //         res.render("secrets");
    //     }
    // });
});

app.post("/Login", function(req,res){
    const userName= req.body.username;
    const password= req.body.password;
//    const password= md5(req.body.password);

    User.findOne({email: userName}, function(err, foundUser){
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                bcrypt.compare(password, foundUser.password, function(err, result){
                    if(result === true){
                        res.render("secrets");
                    }
                });
                // if(foundUser.password === password){
                //     res.render("secrets");
                // }
            }  
        }
    });
});




app.listen(3000, function(){
    console.log("Server started at Port number 3000");
})
