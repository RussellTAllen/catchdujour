const User = require('../models/User')
const CatchPost = require('../models/CatchPost')
const Comment = require('../models/CatchPost')
const Catchegory = require('../models/Catchegory')
const moment = require('moment-timezone')



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
    getCatchPostById: async (req,res) => {
        if (!req.user) req.user = {}

        try{
            let user = await User.findById(req.user._id)
            if (!user) user = { userName: 'guest', omittedCatchegories: ['nsfw'] }
            const catchPost = await CatchPost.findById({ _id: req.params.id })
            let catchegories = await Catchegory.find()
            const availableCatchegories = catchegories
            if (!catchegories) catchegories = []
            catchegories = catchegories.filter(cat => !user.omittedCatchegories.some(omit => omit.includes(cat.catchegory)))
            catchegories.sort((a,b) => b.count - a.count)

            res.render('catchPost.ejs', {
                catchPost: catchPost,
                catchegories: catchegories,
                availableCatchegories: availableCatchegories,
                user: user,
                following: user.following,
                targetUser: { userName: catchPost.postedBy.userName },
                moment: moment
            })
        }catch(err){
            console.log(err)
        }
    },
    getProfile: async (req,res) => {
        try{
            const user = await User.findById(req.user._id)
            const catchPosts = await CatchPost.find({ userId: req.user.id }).sort({ _id: -1 })
            let catchegories = await Catchegory.find()
            const availableCatchegories = catchegories
            if (!catchegories) catchegories = []
            catchegories = catchegories.filter(cat => !user.omittedCatchegories.some(omit => omit.includes(cat.catchegory)))
            catchegories.sort((a,b) => b.count - a.count)

            res.render('catchPosts.ejs', {
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
    getCatchPostsByUserId: async (req,res) => {
        if (!req.user) req.user = {}

        try{
            let user = await User.findById(req.user._id)
            let targetUser = await User.findOne({ userName: req.params.userName })
            if (!user) user = { userName: 'guest', omittedCatchegories: ['nsfw'] }
            let catchegories = await Catchegory.find()
            const availableCatchegories = catchegories
            if (!catchegories) catchegories = []
            catchegories = catchegories.filter(cat => !user.omittedCatchegories.some(omit => omit.includes(cat.catchegory)))
            catchegories.sort((a,b) => b.count - a.count)
            const catchPosts = await CatchPost.find({ userId: targetUser._id }).sort({ _id: -1 })
            catchegories = catchegories.filter(cat => catchPosts.some(post => post.catchegories.includes(cat.catchegory)))
            res.render('catchPosts.ejs', {
                catchPosts: catchPosts, 
                user: user,
                targetUser: targetUser,
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
    editCatchPost: async (req, res) => {
        console.log('edit post controller says content: '+req.body.catchContent)

        try{
            await CatchPost.findOneAndUpdate({ _id: req.body.catchPostId },{
                catchContent: req.body.catchContent.trim(),
                catchTitle: req.body.catchTitle,
                catchegories: req.body.catchegories
            })
            res.json('Edit catch success!')
        }catch(err){
            console.log(err)
        }
    },
    editComment: async (req, res) => {
        try{
            const post = await CatchPost.findById(req.body.catchPostId)
            const comment = post.comments.filter(c => String(c._id) === req.body.commentId)
            comment[0].text = req.body.catchComment

            post.save()
            res.json('Edit comment success!')
        }catch(err){
            console.log(err)
        }
    },
    getCreateCatchPage: async (req, res) => {
        try{
            const catchegories = await Catchegory.find()
            catchegories.sort((a,b) => b.count - a.count)

            res.render('createCatchPage.ejs',
                { 
                user: req.user,
                catchegories: catchegories,
                targetUser: 'none',
                following: req.user.following        
                }
            )
        }catch(err){
            console.log(err)
        }
    },
    createCatchPost: async (req, res) => {
        try{
            if (!req.body.catchLink) req.body.catchLink = 'none'
            if (!req.body.catchegories) req.body.catchegories = []
            if (typeof req.body.catchegories === 'string') req.body.catchegories = [req.body.catchegories]
            if (req.body.createCatchegory) req.body.catchegories.push(req.body.createCatchegory.toLowerCase())

            await Catchegory.updateMany( { catchegory: req.body.catchegories },
                {
                $inc: { count: 1 }
                }
            )
            await CatchPost.create({
                catchTitle: req.body.catchTitle,
                catchContent: req.body.catchContent, 
                catchegories: req.body.catchegories,
                catchLink: req.body.catchLink,
                userId: req.user.id,
                postedBy: req.user,
                likes: 0,
                date: new Date(),
                moment: moment
            })
            await User.updateOne({ _id: req.user._id },
                { 
                $inc: { catchCount: 1 }
                }
            )
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
                        user: req.user,
                        date: new Date()
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
    initCatchegory: async (req, res) => {
        console.log('Initializing catchegory...')
        try{
            await Catchegory.create(
                {
                catchegory: 'art',
                count: 0
                }
            )
            console.log('Catchegory has been initialized!')
            res.redirect('/catchPosts')
        }catch(err){
            console.log(err)
        }
    },
    // Add Catchegory to Collection
    createCatchegory: async (req, res) => {
        console.log('creating catchegory: '+req.body.createCatchegory)
        try{
            const catchegories = await Catchegory.find()

            if (catchegories.every(cat => !cat.catchegory.includes(req.body.createCatchegory.toLowerCase().trim()))){
                await Catchegory.create({
                        catchegory: req.body.createCatchegory.toLowerCase().trim(), 
                        count: 1,
                })
                console.log('Catchegory has been created!')
                // res.redirect('/createCatchPage')
            }
        }catch(err){
            console.log(err)
        }
    },
    updateCatchegoryCount: async (req, res)=>{
        console.log('newPostCatchegories: '+req.body.newPostCatchegories)
        console.log('oldPostCatchegories: '+req.body.oldPostCatchegories)
        try{
            await Catchegory.updateMany({ catchegory: req.body.newPostCatchegories },
                {
                $inc: { count: 1 }
                }
            )
            await Catchegory.updateMany({ catchegory: req.body.oldPostCatchegories },
                {
                $inc: { count: -1 }
                }
            )
            res.json('Updated catchegory count')
        }catch(err){
            console.log(err)
        }
    },
    deleteCatchPost: async (req, res)=>{
        console.log(req.body.catchPostId)
        try{
            await CatchPost.findOneAndDelete({ _id:req.body.catchPostId })
            await User.updateOne({ _id: req.user._id },
                {
                $inc: { catchCount: -1 }
                }
            )
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
                    $pull: { comments: { _id: req.body.commentId }},
                    $inc: { commentsLength: -1 }
                })
            console.log('Deleted Comment')
            res.json('Delete Comment')
        }catch(err){
            console.log(err)
        }
    }
}    

console.log('catchposts.js')
console.log('date ' + new Date().toLocaleDateString(moment.tz.guess, { 
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }))
console.log('moment ' +moment.tz.guess())

// toLocaleString(undefined, { 
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit"
//     }))
