const CatchPost = require('../models/CatchPost')
const User = require('../models/User')
const Catchegories = require('../models/Catchegory')


module.exports = {
    // getIndex: (req,res)=>{
    //     res.render('index.ejs')
    // }
    getIndex: async (req,res)=>{
        if (!req.user) req.user = 'guest'
        
        try{
            const catchPosts = await CatchPost.find().sort({ _id: -1 })
            const catchegories = await Catchegories.find()
            await User.findOneAndUpdate({ _id: req.user._id },
                { preferredSort: 'new' })
            res.render('index.ejs', {
                catchPosts: catchPosts, 
                user: req.user,
                catchegories: catchegories
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
            const catchegories = await Catchegories.find()
            await User.findOneAndUpdate({ _id: req.user._id },
                { preferredSort: 'mostLiked'})
            res.render('index.ejs', {
                catchPosts: catchPosts, 
                user: req.user,
                catchegories: catchegories
            })
        }catch(err){
            console.log(err)
        }
    },
    getIndexByMostCommented: async (req,res)=>{
        if (!req.user) req.user = 'guest'
        
        try{
            const catchPosts = await CatchPost.find().sort({ commentsLength: -1 })
            const catchegories = await Catchegories.find()
            await User.findOneAndUpdate({ _id: req.user._id },
                    { preferredSort: 'mostCommented' })
            res.render('index.ejs', {
                catchPosts: catchPosts, 
                user: req.user,
                catchegories: catchegories
            })
        }catch(err){
            console.log(err)
        }
    },
}