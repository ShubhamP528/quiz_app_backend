const mongoose=require('mongoose')
const Question= require('../models/question')
const LeaderBoard=require('../models/leaderboard')

const questionListSchema=new mongoose.Schema({
    title:{
        type:String,
        require:true,
        unique:true
    },
    questions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    answers:[{
        type:Number,
        require:true
    }],
    leaderboardList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Leaderboard' 
    }]
})

const QuestionList=mongoose.model('QuestionList',questionListSchema)

module.exports=QuestionList