const User = require('../models/User')

module.exports = {
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

            res.redirect(`/catchPosts/${followedUserId}`)
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

            res.redirect(`/catchPosts/${followedUserId}`)
        }catch(err){
            console.log(err)
        }
    },
    omitCatchegory: async (req, res)=>{
        console.log('omitting from user controller')
        console.log(req.user._id, req.body.omitCatchegory)
        try{
            await User.updateOne( { _id: req.user._id },
                { $addToSet: { omittedCatchegories: req.body.omitCatchegory
                }})
            console.log('Catchegory Omitted')
            console.log( req.user.omittedCatchegories )
            res.redirect('/catchPosts')
        }catch(err){
            console.log(err)
        }
    },
}