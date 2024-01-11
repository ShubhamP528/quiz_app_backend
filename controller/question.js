// const Question=require('../models/question')
const QuestionList=require('../models/questionList')
const User=require('../models/user')
const Question=require('../models/question')
const LeaderBoard=require('../models/leaderboard')
const Score = require('../models/score')

// geting perticuler questionlist

const questions=async(req,res)=>{
    const {subject}=req.body
    console.log(req.body)
    try{
        const questionList2=await (await QuestionList.find({title:subject}))[0].populate('questions')
        res.status(200).json({questionList2})
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}




// scrore controller

const score=async (req, res)=>{
    const {subject, ans}=req.body
    try{
        let serverAns=[]
        const result={
            correct:0,
            attempt:0,
            wrong:0,
            total:ans.length
        }

        let userFlag=false
        let questionListFlag=false

        // finding questionList and populate
        const questionList2=await (await QuestionList.findOne({title:subject})).populate('questions')

        // finding server and and store in serverAns array
        for(let i of questionList2.questions){
            serverAns.push(i.answer)
        }

        // calculate the score
        for(let i=0; i<serverAns.length; i++){
            if(parseInt(ans[i])===serverAns[i]){
                result.correct++
            } else if(parseInt(ans[i])!==serverAns[i] && parseInt(ans[i])!==0){
                result.wrong++
            } 
            if(parseInt(ans[i])!==0){
                result.attempt++
            }
        }

        // checking that score in user data already exist or not
        const populatedUser=await req.user.populate('score')

        for(i of populatedUser.score){
           if(i.type===subject){
                i.score=result.correct
                await populatedUser.save()
                userFlag=true
                break
           } 
        }


        // checking that username in questionList already exist or not
        const questionList3=await (await QuestionList.findOne({title:subject})).populate('leaderboardList')
        // console.log(questionList3)
        for(i of questionList3.leaderboardList){
            if(i.username===req.user.username){
                i.score=result.correct
                await questionList3.save()
                questionListFlag=true
                break
            }
        }

        if(userFlag===false){
            const score=await Score.create({type:subject,score:result.correct})
            req.user.score.push(score._id)
            await req.user.save()
        }

        if(questionListFlag===false){
            const leaderboard=await LeaderBoard.create({username:req.user.username,score:result.correct})
            questionList2.leaderboardList.push(leaderboard._id)
            await questionList2.save()
        }
        res.status(200).json({result})

    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

// geting questionList

const questionList=async (req,res)=>{
    try{
        // console.log(req.body)
        const user=req.user
        const userWithDetail=await (await User.findById(user._id)).populate('questionList')
        const list=userWithDetail.questionList
        res.status(200).json({list})
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

// inserting QuestionList

const insertQuestionList=async (req, res)=>{
    try{

        // console.log(req.body.FinalList)

        const user=req.user
        console.log(user)
        const title=req.body.FinalList.title
        const answers=req.body.FinalList.answers
        const Qlist=req.body.FinalList.questions
        const Qid=[]
        for (let i=0; i<Qlist.length; i++){
            const Ques=await Question.create(Qlist[i])
            Qid.push(Ques._id)
        }
        const newList=await QuestionList.create({title,answers,questions:Qid})
        user.questionList.push(newList._id)
        await user.save();
        res.status(200).json({message:`Question List ${newList.title} is inserted successfully`})
    }
    catch(error){
        res.status(400).json({error:error.message})
    }

}

// deleting QuestionList

const deleteQuestionList=async (req,res)=>{

    const {subject}=req.params
    console.log(subject)

    try{
        const questionList=await QuestionList.findOne({title:subject})
        for(i of questionList.questions){
            await Question.findByIdAndDelete(i)
        }
    
        for(i of questionList.leaderboardList){
            await LeaderBoard.findByIdAndDelete(i)
        }

        const newArrayWithoutDeletedId = req.user.questionList.filter(id => !id.equals(questionList._id));
    

        console.log(newArrayWithoutDeletedId)

        req.user.questionList=newArrayWithoutDeletedId
        console.log(req.user.questionList)

        await req.user.save()
    
        await QuestionList.findByIdAndDelete(questionList._id)

        res.status(200).json({message:`${subject} deleted successfully`})
    }
    catch(error){
        res.status(400).json({error:error.message})
        console.log(error.message)
    }
}

//Update QuestionList

const updateQuestionList=async(req,res)=>{
    const{subject}=req.params
    try{
        const questionList=await QuestionList.findOne({title:subject})
        for(i of questionList.questions){
            await Question.findByIdAndDelete(i)
        }
        const Qlist=req.body.FinalList.questions
        const Qid=[]
        for (let i=0; i<Qlist.length; i++){
            const Ques=await Question.create(Qlist[i])
            Qid.push(Ques._id)
        }
        const updatedList=await QuestionList.findOneAndUpdate({title:subject},{title:subject,questions:Qid})


        res.status(200).json({message:`${subject} updated successfully`})
    }
    catch(error){
        console.log(error.message)
        res.status(400).json({message:error.message})
    }
}


const leaderboard=async(req,res)=>{

}


module.exports={questions, score,questionList, insertQuestionList, deleteQuestionList, updateQuestionList,leaderboard}