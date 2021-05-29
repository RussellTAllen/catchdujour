const User = require('../models/User')
const CatchPost = require('../models/CatchPost')
const Comment = require('../models/CatchPost')
const Catchegory = require('../models/Catchegory')



module.exports = {
    // getCatchPosts: async (req,res)=>{
    //     console.log(req.user)
    //     try{
    //         const catchPosts = await CatchPost.find()
    //         res.render('index.ejs', {
    //             catchPosts: catchPosts, 
    //             user: req.user.userName,
    //         })
    //     }catch(err){
    //         console.log(err)
    //     }
    // },
    getCatchPostById: async (req,res)=>{
        console.log('getting post by id: '+req.params.id)
        let user = req.user
        if (!user) user = { userName: 'guest' }

        try{
            let user = await User.findById(req.user._id)
            if (!user) user = { userName: 'guest' }
            const catchPost = await CatchPost.findById({ _id: req.params.id })
            res.render('catchPost.ejs', {
                catchPost: catchPost, 
                user: user,
                following: user.following
            })
        }catch(err){
            console.log(err)
        }
    },
    getProfile: async (req,res)=>{
        try{
            let user = await User.findById(req.user._id)
            const catchPosts = await CatchPost.find({ userId: req.user.id }).sort({ _id: -1 })
            res.render('catchPosts.ejs', {
                catchPosts: catchPosts, 
                user: req.user,
                targetUser: req.user,
                following: user.following,
                followedBy: user.followedBy
            })
        }catch(err){
            console.log(err)
        }
    },
    getCatchPostsByUserId: async (req,res)=>{
        if (!req.user) user = { userName: 'guest' }
        else user = req.user

        try{
            let user = await User.findById(req.user._id)
            let targetUser = await User.findById(req.params.id)
            if (!user) user = { userName: 'guest' }
            const catchPosts = await CatchPost.find({ userId: req.params.id }).sort({ _id: -1 })
            res.render('catchPosts.ejs', {
                catchPosts: catchPosts, 
                user: user,
                targetUser: targetUser,
                following: user.following,
                followedBy: user.followedBy
            })
        }catch(err){
            console.log(err)
        }
    },
    editCatchPost: async (req, res)=>{
        try{
            await CatchPost.findOneAndUpdate({ _id: req.body.catchPostId },{
                catchContent: req.body.catchContent,
                catchTitle: req.body.catchTitle
            })
        }catch(err){
            console.log(err)
        }
    },
    editComment: async (req, res)=>{
        try{
            const post = await CatchPost.findById(req.body.catchPostId)
            const comment = post.comments.filter(c => String(c._id) === req.body.commentId)
            comment[0].text = req.body.catchComment

            post.save()
        }catch(err){
            console.log(err)
        }
    },
    getCreateCatchPage: async (req, res)=>{
        try{
            res.render('createCatchPage.ejs',
                { user: req.user })
        }catch(err){
            console.log(err)
        }
    },
    createCatchPost: async (req, res)=>{
        try{
            await CatchPost.create({
                catchTitle: req.body.catchTitle,
                catchContent: req.body.catchContent, 
                catchegories: req.body.catchegories.toLowerCase().trim(),
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
            res.redirect('/')
        }catch(err){
            console.log(err)
        }
    },
    likeCatchPost: async (req, res) => {
        try{
            const post = await CatchPost.findOne({ _id: req.body.catchPostId })
            const likedBy = post.likedBy.map((user) => user._id);

            if (likedBy.includes(req.user._id)) {
                post.likes--
                post.likedBy = post.likedBy.filter((user) => !user._id.equals(req.user._id))
            } else {
                post.likes++;
                post.likedBy.push(req.user)
            }
            await post.save()
            res.json('Added a like!')
        }catch(err){
          console.log(err)
        }
    },
    addComment: async (req, res) => {
        try{
            await CatchPost.findOneAndUpdate({ _id: req.params.id }, {
                $push: {
                    comments: {
                        text: req.body.text,
                        user: req.user
                    }
                },
                $inc: { commentsLength: 1 }
            } )
            res.redirect(`/catchPosts/${req.params.id}/catchPost`)
        }
        catch(err){
            console.log(err)
        }
    },
    // Initialize Catchegory Collection
    initCatchegory: async (req, res)=>{
        console.log('Initializing catchegory...')
        try{
            await Catchegory.create({
                catchegories: ['art', 'food', 'politics', 'religion', 'rant', 'science', 'technology']
            })
            console.log('Catchegory has been initialized!')
            res.redirect('/catchPosts')
        }catch(err){
            console.log(err)
        }
    },
    // Add Catchegory to Collection
    createCatchegory: async (req, res)=>{
        console.log(req.body.createCatchegory)
        try{
            await Catchegory.updateOne({
                $push: { catchegories: req.body.createCatchegory.toLowerCase().trim() }
            })
            console.log('Catchegory has been created!')
            res.redirect('/catchProfile')
        }catch(err){
            console.log(err)
        }
    },
    omitCatchegory: async (req, res)=>{
        console.log(req.user._id, req.body.omitCatchegory)
        try{
            await User.updateOne( { _id: req.user._id },
                { $push: { omittedCatchegories: req.body.omitCatchegory
                }})
            console.log('Catchegory Omitted')
            console.log( req.user.omittedCatchegories )
            res.redirect('/catchPosts')
        }catch(err){
            console.log(err)
        }
    },
    deleteCatchPost: async (req, res)=>{
        console.log(req.body.catchPostId)
        try{
            await CatchPost.findOneAndDelete({ _id:req.body.catchPostId })
            console.log('Deleted CatchPost')
            res.json('Deleted Catchpost')
        }catch(err){
            console.log(err)
        }
    },
    deleteComment: async (req, res)=>{
        console.log('the postId with the comments: '+req.body.catchPostId)
        console.log('the comment id: '+req.body.commentId)
        try{
            await CatchPost.findOneAndUpdate({ _id: req.body.catchPostId },
                {
                    $pull: {"comments": { _id: req.body.commentId }}
                })
            console.log('Deleted Comment')
            res.json('Delete Comment')
        }catch(err){
            console.log(err)
        }
    }
}    