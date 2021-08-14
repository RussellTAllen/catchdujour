const User = require('../models/User')
const CatchPost = require('../models/CatchPost')
const Catchegory = require('../models/Catchegory')
const moment = require('moment-timezone')

module.exports = {
    getProfile: async (req,res) => {
        try{
            const user = await User.findById(req.user._id)
            const catchPosts = await CatchPost.find({ userId: req.user._id }).sort({ _id: -1 })
            let catchegories = await Catchegory.find()
            const availableCatchegories = catchegories
            if (!catchegories) catchegories = []
            catchegories = catchegories.filter(cat => !user.omittedCatchegories.some(omit => omit.includes(cat.catchegory)))
            catchegories.sort((a,b) => b.count - a.count)

            res.render('profile.ejs', {
                catchPosts: catchPosts, 
                user: req.user,
                targetUser: req.user,
                catchegories: catchegories,
                availableCatchegories: availableCatchegories,
                following: user.following,
                followedBy: user.followedBy,
                moment: moment
            })
        }catch(err){
            console.log(err)
        }
    },
    followUser: async (req, res) => {
        try{
            const followedUserId = String(Object.keys(req.body))
            const currentUser = await User.findById(req.user._id)
            const followedUser = await User.findById(followedUserId) 

            // Update logged in user's following property with followed user's info
            await User.findByIdAndUpdate(req.user._id, {
                $addToSet: { 
                    following:  { 
                        userId: followedUserId,
                        userName: followedUser.userName
                    }
                }
            })
            
            // Update followed user's followedBy property with logged in user's info
            await User.findByIdAndUpdate(followedUserId, {
                $addToSet: { 
                    followedBy: { 
                        userId: currentUser._id,
                        userName: currentUser.userName                    
                    }
                }
            })

            res.redirect(`/${followedUser.userName}`)
        }catch(err){
            console.log(err)
        }
    },
    unfollowUser: async (req, res) => {
        try{
            const followedUserId = String(Object.keys(req.body))
            const currentUser = await User.findById(req.user._id)
            const followedUser = await User.findById(followedUserId) 

            // Remove followed's user's info from logged in user's following property
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { 
                    following:  { 
                        userId: followedUserId,
                        userName: followedUser.userName
                    }
                }
            })
            
            // Remove user's info from followed user's followedBy property
            await User.findByIdAndUpdate(followedUserId, {
                $pull: { 
                    followedBy: { 
                        userId: currentUser._id,
                        userName: currentUser.userName                    
                    }
                }
            })

            res.redirect(`/catchPosts/${followedUser.userName}`)
        }catch(err){
            console.log(err)
        }
    },
    omitCatchegory: async (req, res)=>{
        try{
            await User.updateOne( { _id: req.body.userId },
                { $addToSet: { omittedCatchegories: req.body.omitCatchegory
                }})
            console.log('Catchegory Omitted')
            console.log( req.body.omitCatchegory )
            console.log( req.user.omittedCatchegories )
            res.json('Catchegory Omitted!')
        }catch(err){
            console.log(err)
        }
    },
    allowCatchegory: async (req, res)=>{
        try{
            await User.updateOne( { _id: req.body.userId },
                { $pull: { omittedCatchegories: req.body.allowCatchegory
                }})
            console.log('Catchegory Allowed')
            console.log( req.user.omittedCatchegories )
            res.json('Catchegory allowed!')
        }catch(err){
            console.log(err)
        }
    },
}