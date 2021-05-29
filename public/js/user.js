console.log('client-side user.js is connected')

// DOM Variables
const deleteBtn = document.querySelectorAll('.del')
const editBtn = document.querySelectorAll('.edit')
const editCommentBtn = document.querySelectorAll('.edit-comment')
const deleteCommentBtn = document.querySelectorAll('.del-comment')
const likeBtn = document.querySelectorAll('.likes')
const followedBtn = document.querySelector('#followed-btn')
const followedContent = document.querySelector('.followed-content')
const selectedCatchegory = document.querySelectorAll('.catchegory-selected')
const unselectedCatchegory = document.querySelectorAll('.catchegory-unselected')

// EVENT LISTENERS
Array.from(deleteBtn).forEach(el =>{
    el.addEventListener('click', deleteCatchPost)
})
Array.from(editBtn).forEach(el =>{
    el.addEventListener('click', editCatchPost)
})
Array.from(editCommentBtn).forEach(el =>{
    el.addEventListener('click', editComment)
})
Array.from(deleteCommentBtn).forEach(el =>{
    el.addEventListener('click', deleteComment)
})
Array.from(likeBtn).forEach(el =>{
    el.addEventListener('click', likeCatchPost)
})
Array.from(selectedCatchegory).forEach(el =>{
    el.addEventListener('change', unselectCatchegory)
})
Array.from(unselectedCatchegory).forEach(el =>{
    el.addEventListener('change', selectCatchegory)
})

followedBtn.addEventListener('click', toggleDropdown)


// FUNCTIONS
function toggleDropdown(){
    console.log('toggling...')
    followedContent.classList.toggle('hidden')

    window.addEventListener('click', (e) =>{
        if (!e.target.matches('#followed-btn')){
            followedContent.classList.add('hidden')
        }
    })
}

async function deleteCatchPost(){
    const c = confirm('You are about to delete this post, would you like to continue?')
    if (c === false) return
    
    const catchPostId = this.parentNode.dataset.id
    try{
        const response = await fetch('../catchPosts/deleteCatchPost', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'catchPostId': catchPostId
            })
        })
        const data = await response.json()
        console.log('data: '+ data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

// May want to refactor using contenteditable - or just wait to refactor with React
// function editCatchPost(req, res){  // ummm, don't need the req,res arguments here...
function editCatchPost(){
    // DOM variables
    const catchPostId = this.parentNode.dataset.id
    const postTitle = this.parentNode.querySelector('.catch-title')
    const postContent = this.parentNode.querySelector('.catch-post-content')
    const edit = this.parentNode.querySelector('.edit')

    edit.classList.add('selected')

    // Turn title into editable input
    const editTitle = document.createElement('input')
    editTitle.classList.add('edit-catch-title')
    editTitle.value = postTitle.innerText
    postTitle.replaceWith(editTitle)
    
    // Turn post content into editable input
    const editInput = document.createElement('textarea')
    editInput.classList.add('edit-catch-post')
    editInput.innerText = postContent.textContent
    // editInput.style.height = (editInput.scrollHeight, 200)+'px'
    // editInput.setAttribute('onchange', 'autoGrow(this)')
    postContent.replaceWith(editInput)

    // Handle event listeners
    window.addEventListener('keypress', confirmEdit)
    edit.removeEventListener('click', editCatchPost)
    edit.addEventListener('click', confirmEdit)
    
    async function confirmEdit(e){
        let eventKey = e.key
        if (e.key == undefined) eventKey = 'Enter'
        if (eventKey === 'Enter' && !e.shiftKey){
            const catchContent = document.querySelector('.edit-catch-post')
            const catchTitle = document.querySelector('.edit-catch-title')

            postTitle.innerText = catchTitle.value
            postContent.innerText = catchContent.value

            // Editing/refreshing DOM - a little hacky because it updates client-side before the DB
            editInput.replaceWith(postContent)
            editTitle.replaceWith(postTitle)
            edit.classList.remove('selected')
            edit.addEventListener('click', editCatchPost)

            // Send PUT request to controller
            try{
                const response = await fetch ('../../catchPosts/editCatchPost', {
                    method: 'put',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        'catchPostId': catchPostId,
                        'catchTitleElement': catchTitle,
                        'catchTitle': catchTitle.value,
                        'catchContent': catchContent.value
                    })
                })
            }catch(err){
                console.log(err)
                postTitle.replaceWith(editTitle)
                postContent.replaceWith(editInput)
                edit.classList.add('selected')
                edit.removeEventListener('click', editCatchPost)
            }
        }
    }
}

function editComment(){
    // DOM variables
    const catchPostId = this.parentNode.parentNode.dataset.id
    const commentId = this.parentNode.dataset.id
    const commentText = this.parentNode.querySelector('.comment-text')
    const edit = this.parentNode.querySelector('.edit-comment')

    console.log('editComment function: ',catchPostId, commentId)
    
    edit.classList.add('selected')

    // Turn comment into editable input field
    const editCommentText = document.createElement('textarea')
    editCommentText.classList.add('edit-catch-post')
    editCommentText.innerText = commentText.textContent
    commentText.replaceWith(editCommentText)


    // Handle event listeners
    window.addEventListener('keypress', confirmCommentEdit)
    edit.removeEventListener('click', editComment)
    edit.addEventListener('click', confirmCommentEdit)

    async function confirmCommentEdit(e){
        let eventKey = e.key
        if (e.key == undefined) eventKey = 'Enter'
        if (eventKey === 'Enter' && !e.shiftKey){
            const catchComment = document.querySelector('.edit-catch-post')

            commentText.innerText = catchComment.value

            // Editing/refreshing DOM - a little hacky because it updates client-side before the DB
            editCommentText.replaceWith(commentText)
            edit.classList.remove('selected')
            edit.addEventListener('click', editComment)

            // Send PUT request to controller
            try{
                const response = await fetch ('../../catchPosts/editComment', {
                    method: 'put',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        'catchPostId': catchPostId,
                        'commentId': commentId,
                        'catchComment': catchComment.value
                    })
                })
            }catch(err){
                console.log(err)
            }
        }
    }

}

// Function to auto-grow textarea element based on text within...
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

async function unselectCatchegory(){
    console.log('catchegories')
    // const user = this.parentNode.parentNode.dataset.id
    const user = document.body.dataset.user
    const omitCatchegory = this.value
    console.log('omit this catchegory: '+omitCatchegory)

    try{
        const response = await fetch('../users/omitCatchegory', {
            method: 'put',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                'user': user,
                'omitCatchegory': omitCatchegory
            })
        })
        const data = response.json()
        console.log('data: '+data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function selectCatchegory(){
    console.log('catchegories')
    const user = document.body.dataset.user
    const allowCatchegory = this.value
    console.log('allow this catchegory: '+allowCatchegory)

    try{
        const response = await fetch('../users/allowCatchegory', {
            method: 'put',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                'user': user,
                'allowCatchegory': allowCatchegory
            })
        })
        const data = response.json()
        console.log('data: '+data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}