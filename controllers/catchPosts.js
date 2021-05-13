const User = require('../models/User')
const CatchPost = require('../models/CatchPost')

module.exports = {
    getCatchPosts: async (req,res)=>{
        console.log(req.user)
        try{
            const catchPosts = await CatchPost.find({ userId:req.user.id })
            console.log(typeof catchPosts)
            res.render('catchPosts.ejs', {
                catchPosts: catchPosts, 
                user: req.user,
            })
        }catch(err){
            console.log(err)
        }
    },
    createCatchPost: async (req, res)=>{
        try{
            await CatchPost.create({
                catchTitle: req.body.catchTitle,
                catchPost: req.body.catchPost, 
                catchegories: req.body.catchegories,
                userId: req.user.id,
                postedBy: req.user,
                likes: 0,
                date: new Date().toLocaleDateString('en-US', { 
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                })
            })
            console.log('CatchPost has been added!')
            res.redirect('/catchPosts')
        }catch(err){
            console.log(err)
        }
    },
    omitCatchegory: async (req, res)=>{
        console.log(req.user._id, req.body.omitCatchegory)
        try{
            await User.update( { _id: req.user._id },
                { $push: { omittedCatchegories: req.body.omitCatchegory
                }})
            console.log('Catchegory Omitted')
            console.log( req.user.omittedCatchegories )
            res.redirect('/catchPosts')
        }catch(err){
            console.log(err)
        }
    },
    // markIncomplete: async (req, res)=>{
    //     try{
    //         await CatchPost.findOneAndUpdate({_id:req.body.catchPostIdFromJSFile},{
    //             completed: false
    //         })
    //         console.log('Marked Incomplete')
    //         res.json('Marked Incomplete')
    //     }catch(err){
    //         console.log(err)
    //     }
    // },
    deleteCatchPost: async (req, res)=>{
        console.log(req.body.catchPostIdFromJSFile)
        try{
            await CatchPost.findOneAndDelete({ _id:req.body.catchPostIdFromJSFile })
            console.log('Deleted CatchPost')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    }
}    