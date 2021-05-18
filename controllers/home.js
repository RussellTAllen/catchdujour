const CatchPost = require('../models/CatchPost')
const User = require('../models/User')

module.exports = {
    // getIndex: (req,res)=>{
    //     res.render('index.ejs')
    // }
    getIndex: async (req,res)=>{
        if (!req.user) req.user = 'guest'
        
        try{
            const catchPosts = await CatchPost.find().sort({ _id: -1 })
            await User.findOneAndUpdate({ _id: req.user._id },
                { preferredSort: 'new' })
            res.render('index.ejs', {
                catchPosts: catchPosts, 
                user: req.user,
            })
        }catch(err){
            console.log(err)
        }
    },
    getIndexByMostLiked: async (req,res)=>{
        if (!req.user) req.user = 'guest'

        console.log('getMostLiked User: '+req.user)
        
        try{
            const catchPosts = await CatchPost.find().sort({ likes: -1 })
            await User.findOneAndUpdate({ _id: req.user._id },
                { preferredSort: 'mostLiked'})
            res.render('index.ejs', {
                catchPosts: catchPosts, 
                user: req.user,
            })
        }catch(err){
            console.log(err)
        }
    },
    getIndexByMostCommented: async (req,res)=>{
        if (!req.user) req.user = 'guest'
        
        try{
            // const catchPosts = await CatchPost.aggregate([
            //     { $project: { 'comments': 1, 'comment_count': { $size: '$comments' }} },
            //     { $sort: { 'comment_count': -1 }}])
            const catchPosts = await CatchPost.find().sort({ commentsLength: -1 })
            await User.findOneAndUpdate({ _id: req.user._id },
                    { preferredSort: 'mostCommented' })
            res.render('index.ejs', {
                catchPosts: catchPosts, 
                user: req.user,
            })
        }catch(err){
            console.log(err)
        }
    },
}