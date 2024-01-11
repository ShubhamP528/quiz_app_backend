const mongoose=reqi=require('mongoose')
const bcrypt=require('bcrypt')
const validator=require('validator')
const QuestionList=require('./questionList')
const Score =require('../models/score')
const nodemailer=require('nodemailer')
const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    questionList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'QuestionList'
    }],
    score:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Score'
    }]
})

// static signup method
userSchema.statics.signup=async function (username,email,password){

    // validation
    if (!username || !email || !password) {
        throw Error('All fields must be filled')
    }

    if(!validator.isEmail(email)){
    throw Error("Email is not valid")
    }

    if(!validator.isStrongPassword(password)){
        throw Error("Password is not strong enough")
    }

    const exists1=await this.findOne({username})
    const exists2=await this.findOne({email})

    if(exists1){
        throw Error("Username already in use")
    }

    if(exists2){
        throw Error("Email already in use")
    }

    const salt=await bcrypt.genSalt(10)
    const hash=await bcrypt.hash(password, salt)

    const user=await this.create({username, email, password:hash})
    
    return user
}

// static login method

userSchema.statics.login=async function(email, password){

    if (!email || !password) {
        throw Error('All fields must be filled')
    }

    const user=await this.findOne({email})
    if(!user){
        throw Error("Incorrect Email")
    }

    const match=await bcrypt.compare(password,user.password)

    if(!match){
        throw Error("Incorrect Password")
    }

    return user
}
// Load the HTML template
const htmlTemplate = fs.readFileSync('htmlTemplates/newSignUp.html', 'utf-8');

// Function to replace placeholders in the template
function replacePlaceholders(template, username) {
  return template.replace('{{username}}', username);
}

userSchema.post('save',async (doc)=>{
    try{
        // console.log("Document is " , doc)
        // transporter
        let transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        });

        // Email configuration
        const username = doc.username; // Replace this with the actual username
        const replacedHtml = replacePlaceholders(htmlTemplate, username);

        //send mail
        let info=await transporter.sendMail({
            from:`Quiz Application`,
            to:doc.email,
            subject:"New Account Created Successfully",
            html:replacedHtml
        });
        // console.log("info is ", info)
    }
    catch(error){
            console.log(error)
    }
})



module.exports=mongoose.model('User',userSchema)