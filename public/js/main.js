console.log('client-side main.js is connected')

const deleteBtn = document.querySelectorAll('.del')
const deleteCommentBtn = document.querySelectorAll('.del-comment')
const likeBtn = document.querySelectorAll('.likes')

Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteCatchPost)
})

Array.from(deleteCommentBtn).forEach((el)=>{
    el.addEventListener('click', deleteComment)
})

Array.from(likeBtn).forEach((el)=>{
    el.addEventListener('click', likeCatchPost)
})

async function deleteCatchPost(){
    const c = confirm('You are about to delete this post, would you like to continue?')
    if (c === false) return
    
    const catchPostId = this.parentNode.dataset.id
    try{
        const response = await fetch('catchPosts/deleteCatchPost', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'catchPostId': catchPostId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function deleteComment(){
    // const c = confirm('You are about to delete this comment, would you like to continue?')
    // if (c === false) return
    
    const catchPostId = this.parentNode.parentNode.dataset.id
    const commentId = this.parentNode.dataset.id
    console.log('catchPostId: '+catchPostId)
    console.log('comment id: '+commentId)
    try{
        const response = await fetch('../../catchPosts/deleteComment', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'catchPostId': catchPostId,
                'commentId': commentId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function likeCatchPost(){
    const postId = this.parentNode.dataset.id
    console.log('postID: '+postId)
    try{
      const response = await fetch('catchPosts/likeCatchPost', {
        method: 'put',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
          'postId': postId
        })
      })
      const data = await response.json()
      console.log(data)
      location.reload()
    }catch(err){
      console.log(err)
    }
  }

// async function markComplete(){
//     const catchPostId = this.parentNode.dataset.id
//     try{
//         const response = await fetch('catchPosts/markComplete', {
//             method: 'put',
//             headers: {'Content-type': 'application/json'},
//             body: JSON.stringify({
//                 'catchPostIdFromJSFile': catchPostId
//             })
//         })
//         const data = await response.json()
//         console.log(data)
//         location.reload()
//     }catch(err){
//         console.log(err)
//     }
// }

// async function markIncomplete(){
//     const catchPostId = this.parentNode.dataset.id
//     try{
//         const response = await fetch('catchPosts/markIncomplete', {
//             method: 'put',
//             headers: {'Content-type': 'application/json'},
//             body: JSON.stringify({
//                 'catchPostIdFromJSFile': catchPostId
//             })
//         })
//         const data = await response.json()
//         console.log(data)
//         location.reload()
//     }catch(err){
//         console.log(err)
//     }
// }

