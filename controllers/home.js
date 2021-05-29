const CatchPost = require('../models/CatchPost')
const User = require('../models/User')
const Catchegories = require('../models/Catchegory')


module.exports = {
    // getIndex: (req,res)=>{
    //     res.render('index.ejs')
    // }
    getIndex: async (req,res)=>{
        if (!req.user) req.user = { userName: 'guest' }
        try{
            let user = await User.findById(req.user._id)
            if (!user) user = { userName: 'guest' }
            const catchPosts = await CatchPost.find().sort({ _id: -1 })
            const catchegories = await Catchegories.find()
            
            catchegories.sort((a,b) => b.count - a.count)
            console.log(catchegories)
            await User.findOneAndUpdate({ _id: req.user._id },
                { preferredSort: 'new' })
            res.render('index.ejs', {
                catchPosts: catchPosts, 
                user: user,
                following: user.following,
                catchegories: catchegories
            })
        }catch(err){
            console.log(err)
        }
    },
    getIndexByMostLiked: async (req,res)=>{
        if (!req.user) req.user = 'guest'
        
        try{
            let user = await User.findById(req.user._id)
            if (!user) user = { userName: 'guest' }
            const catchPosts = await CatchPost.find().sort({ likes: -1 })
            const catchegories = await Catchegories.find()
            await User.findOneAndUpdate({ _id: req.user._id },
                { preferredSort: 'mostLiked'})
            res.render('index.ejs', {
                catchPosts: catchPosts, 
                user: req.user,
                following: user.following,
                catchegories: catchegories
            })
        }catch(err){
            console.log(err)
        }
    },
    getIndexByMostCommented: async (req,res)=>{
        if (!req.user) req.user = 'guest'
        
        try{
            let user = await User.findById(req.user._id)
            if (!user) user = { userName: 'guest' }
            const catchPosts = await CatchPost.find().sort({ commentsLength: -1 })
            const catchegories = await Catchegories.find()
            await User.findOneAndUpdate({ _id: req.user._id },
                    { preferredSort: 'mostCommented' })
            res.render('index.ejs', {
                catchPosts: catchPosts, 
                user: req.user,
                following: user.following,
                catchegories: catchegories
            })
        }catch(err){
            console.log(err)
        }
    },
}