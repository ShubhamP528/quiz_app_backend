const express= require('express')
const { questions, score, questionList, insertQuestionList, deleteQuestionList ,updateQuestionList,leaderboard , defaultQuestionList} = require('../controller/question')
const router=express.Router()
const requireAuth=require('../middlerware/requireAuth')

// Authorizetion middleware

// get Questions
router.post('/questions',requireAuth,questions)

// get Score
router.post('/score',requireAuth,score)

// get LeaderBoard
router.post('/leaderboard',leaderboard)

// get list of questions

router.get('/questionList',requireAuth,questionList)

// insert a question List

router.post('/questionList', requireAuth,insertQuestionList)

// delete question List

router.delete('/questionList/:subject', requireAuth, deleteQuestionList)

// update questionList

router.patch('/questionList/:subject',requireAuth,updateQuestionList)

// geting default list

router.get('/defaultQuestionList',requireAuth,defaultQuestionList)



module.exports=router