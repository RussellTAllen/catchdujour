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

    }
}