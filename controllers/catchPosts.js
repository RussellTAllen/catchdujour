const User = require('../models/User')
const CatchPost = require('../models/CatchPost')
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
            const catchPost = await CatchPost.findById({ _id: req.params.id })
            res.render('catchPost.ejs', {
                catchPost: catchPost, 
                user: user
            })
        }catch(err){
            console.log(err)
        }
    },
    getProfile: async (req,res)=>{
        try{
            const catchPosts = await CatchPost.find({ userId: req.user.id }).sort({ _id: -1 })
            res.render('catchPosts.ejs', {
                catchPosts: catchPosts, 
                user: req.user,
            })
        }catch(err){
            console.log(err)
        }
    },
    getCatchPostsByUserId: async (req,res)=>{
        try{
            const catchPosts = await CatchPost.find({ userId: req.params.id }).sort({ _id: -1 })
            res.render('catchPosts.ejs', {
                catchPosts: catchPosts, 
                user: req.user,
            })
        }catch(err){
            console.log(err)
        }
    },
    getCatchPostToEdit: async (req, res)=>{
        try{
            const catchPost = await CatchPost.find({ _id: req.body.catchPostId })
            res.json('Editing post...', {
                catchPost: catchPost
            })
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
            res.redirect('/catchPosts')
        }catch(err){
            console.log(err)
        }
    },
    likeCatchPost: async (req, res) => {
        try{
            // Works method-override/mongoose, but refreshes to top of page
            // const post = await CatchPost.findOneAndUpdate(
            //     { _id: req.params.id },
            //     { 
            //     $inc: { likes: 1 },
            //     }
            // );
            // res.redirect('/')

            // Using client-side main.js to update each like as it's added
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
        console.log(req.body.catchPostId)
        try{
            await CatchPost.findOneAndDelete({ _id:req.body.catchPostId })
            console.log('Deleted CatchPost')
            res.json('Deleted It')
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