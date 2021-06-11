const CatchPost = require('../models/CatchPost')
const User = require('../models/User')
const Catchegory = require('../models/Catchegory')
const moment = require('moment-timezone')



module.exports = {
    // getIndex: (req,res)=>{
    //     res.render('index.ejs')
    // }
    getWelcome: async (req, res) => {
        try{
            const user = await User.findById(req.user._id)

            await User.findByIdAndUpdate('60c2e4a9f046b61bbc4861b7', {
                $addToSet: { 
                    followedBy: { 
                        userId: user._id,
                        userName: user.userName                    
                    }
                }
              })
            console.log('logged in user: '+user)
            res.render('welcome.ejs', {
                user: user
            })
        }catch(err){
            console.log(err)
        }
    },
    getIndex: async (req,res)=>{
        if (!req.user) req.user = { userName: 'guest', omittedCatchegories: ['nsfw'] }
        
        try{
            let user = await User.findById(req.user._id)
            if (!user) user = { userName: 'guest', omittedCatchegories: ['nsfw'] }
            let catchPosts = await CatchPost.find().sort({ _id: -1 })
            let catchegories = await Catchegory.find()
            if (!catchegories) catchegories = []
            catchegories = catchegories.filter(cat => !user.omittedCatchegories.some(omit => omit.includes(cat.catchegory)))
            catchegories.sort((a,b) => b.count - a.count)

            await User.findOneAndUpdate({ _id: req.user._id },
                { preferredSort: 'new' })
            res.render('index.ejs', {
                catchPosts: catchPosts, 
                user: user,
                following: user.following,
                catchegories: catchegories,
                targetUser: 'none',
                moment: moment
            })
        }catch(err){
            console.log(err)
        }
    },
    getIndexByMostLiked: async (req,res)=>{
        if (!req.user) req.user = { userName: 'guest', omittedCatchegories: ['nsfw'] }

        try{
            let user = await User.findById(req.user._id)
            if (!user) user = { userName: 'guest', omittedCatchegories: ['nsfw'] }
            const catchPosts = await CatchPost.find().sort({ likes: -1 })
            let catchegories = await Catchegory.find()
            catchegories = catchegories.filter(cat => !user.omittedCatchegories.some(omit => omit.includes(cat.catchegory)))

            await User.findOneAndUpdate({ _id: req.user._id },
                { preferredSort: 'mostLiked'})
            res.render('index.ejs', {
                catchPosts: catchPosts, 
                user: req.user,
                following: user.following,
                catchegories: catchegories,
                targetUser: 'none',
                moment: moment
            })
        }catch(err){
            console.log(err)
        }
    },
    getIndexByMostCommented: async (req,res)=>{
        if (!req.user) req.user = { userName: 'guest', omittedCatchegories: ['nsfw'] }
        
        try{
            let user = await User.findById(req.user._id)
            if (!user) user = { userName: 'guest', omittedCatchegories: ['nsfw'] }
            const catchPosts = await CatchPost.find().sort({ commentsLength: -1 })
            let catchegories = await Catchegory.find()
            catchegories = catchegories.filter(cat => !user.omittedCatchegories.some(omit => omit.includes(cat.catchegory)))

            await User.findOneAndUpdate({ _id: req.user._id },
                    { preferredSort: 'mostCommented' })
            res.render('index.ejs', {
                catchPosts: catchPosts, 
                user: req.user,
                following: user.following,
                catchegories: catchegories,
                targetUser: 'none',
                moment: moment
            })
        }catch(err){
            console.log(err)
        }
    },
}