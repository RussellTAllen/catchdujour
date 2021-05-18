const CatchPost = require('../models/CatchPost')

module.exports = {
    // getIndex: (req,res)=>{
    //     res.render('index.ejs')
    // }
    getIndex: async (req,res)=>{
        console.log(req.user)
        if (!req.user) req.user = 'guest'

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
}