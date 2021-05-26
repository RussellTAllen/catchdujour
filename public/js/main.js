console.log('client-side main.js is connected')

const deleteBtn = document.querySelectorAll('.del')
const editBtn = document.querySelectorAll('.edit')
const deleteCommentBtn = document.querySelectorAll('.del-comment')
const likeBtn = document.querySelectorAll('.likes')

Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteCatchPost)
})

Array.from(editBtn).forEach((el)=>{
    el.addEventListener('click', editCatchPost)
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

async function editCatchPost(req, res){
    const catchPostId = this.parentNode.dataset.id
    const postContent = this.parentNode.querySelector('.catch-post-content')
    const edit = this.parentNode.querySelector('.edit')

    edit.classList.add('selected')

    const editInput = document.createElement('textarea')
    editInput.setAttribute('class', 'edit-catch-post')
    // editInput.setAttribute('onchange', 'autoGrow(this)')
    editInput.innerText = postContent.textContent
    editInput.style.height = '100px'
    editInput.style.height = (editInput.scrollHeight, 200)+'px'
    editInput.style.resize= 'none'
    editInput.setAttribute('overflow', 'hidden')
    editInput.setAttribute('min-height', '50px')
    editInput.setAttribute('max-height', '200px')

    postContent.replaceWith(editInput)

    window.addEventListener('keypress', confirmEdit)
    edit.removeEventListener('click', editCatchPost)
    edit.addEventListener('click', confirmEdit)
    
    function confirmEdit(e){
        let eventKey = e.key
        if (e.key == undefined) eventKey = 'Enter'
        if (eventKey === 'Enter' && !e.shiftKey){
            console.log('Confirming edit...')


            editInput.replaceWith(postContent)
            edit.classList.remove('selected')
            edit.addEventListener('click', editCatchPost)
        }
    }
}


// function autoGrow(element) {
//     element.style.height = "5px";
//     element.style.height = (element.scrollHeight)+"px";
// }

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
    const catchPostId = this.parentNode.dataset.id
    console.log('catchpostID: '+catchPostId)
    try{
      const response = await fetch('catchPosts/likeCatchPost', {
        method: 'put',
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

