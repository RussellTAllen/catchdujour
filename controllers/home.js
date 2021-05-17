const CatchPost = require('../models/CatchPost')

module.exports = {
    // getIndex: (req,res)=>{
    //     res.render('index.ejs')
    // }
    getIndex: async (req,res)=>{
        console.log('user: '+req.user)
        try{
            const catchPosts = await CatchPost.find()
            res.render('index.ejs', {
                catchPosts: catchPosts, 
                user: req.user,
            })
        }catch(err){
            console.log(err)
        }
    },
    getCatchPost: async (req,res)=>{
        console.log(req.params.id)
        try{
            const catchPost = await CatchPost.find({ _id: req.params.id })
            res.render('catchPost.ejs', {
                catchPost: catchPost,
                user: req.user
            })
        }catch(err){
            console.log(err)
        }
    },
}