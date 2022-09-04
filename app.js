//jshint esversion:6
require("dotenv").config();
const express= require("express");
const ejs= require("ejs");
const bodyParser= require("body-parser");
const mongoose= require("mongoose");
const encrypt= require("mongoose-encryption");

const app= express();
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema= new mongoose.Schema({
    email: String,
    password: String    
})

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

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
    const newUSer= new User({
        email: req.body.username,
        password: req.body.password
    });
    newUSer.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets");
        }
    })
});

app.post("/Login", function(req,res){
    const userName= req.body.username;
    const password= req.body.password;

    User.findOne({email: userName}, function(err, foundUser){
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }  
        }
    });
});




app.listen(3000, function(){
    console.log("Server started at Port number 3000");
})
