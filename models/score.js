const mongoose=require('mongoose')


const scoreSchema=new mongoose.Schema({
    type:{
        type:String,
        require:true
    },
    score:{
        type:Number,
        require:true
    }
})

const Score=mongoose.model('Score',scoreSchema)

module.exports=Score