const express= require('express')
const app=express()
const mongoose=require('mongoose')
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Routes
const questionRoute=require('./routes/question')
const userRoute=require('./routes/user')

dotenv.config();
// const seedQuestionList=require('./seed')

mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log('Connected!'))
    .catch((e)=>console.log(e.message))



// seedQuestionList()


// Middleware to parse body
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));



app.use(questionRoute)
app.use(userRoute)

app.listen(8080,()=>{
    console.log("server running at port 8080")
})