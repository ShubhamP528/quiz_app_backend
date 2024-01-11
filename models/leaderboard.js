const mongoose=require('mongoose')


const leaderboardSchema=new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    score:{
        type:Number,
        require:true
    }
})

const LeaderBoard=mongoose.model('Leaderboard',leaderboardSchema)

module.exports=LeaderBoard