const jwt=require('jsonwebtoken')
const User= require('../models/user')

const requireAuth= async(req, res, next)=>{

    // verify authentication
    const {authorization}=req.headers

    if(!authorization){
        return res.status(401).json({error:'Authorization token required'})
    }

    const token=authorization.split(' ')[1]

    try{
        const {_id}=jwt.verify(token, "ubeilabvjnloikjesgvnoilekjbv")

        // req.user= await User.findOne({_id}).select('_id')
        req.user= await User.findOne({_id})
        next()
    }
    catch(error){
        console.log(error.message)
        res.status(401).json({error:'Request is not authorized'})
    }
}

module.exports=requireAuth