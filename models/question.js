const mongoose=require('mongoose')



const questionSchema=new mongoose.Schema({
    question:{
        type:String,
        require:true
    },
    option1:{
        type:String,
        require:true,
        // unique:true
    },
    option2:{
        type:String,
        require:true,
        // unique:true
    },
    option3:{
        type:String,
        require:true,
        // unique:true
    },
    option4:{
        type:String,
        require:true,
        // unique:true
    },
    answer:{
        type:Number,
        require:true,
    }
})

const question=mongoose.model('Question',questionSchema)

module.exports=question