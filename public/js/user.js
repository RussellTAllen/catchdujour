console.log('client-side user.js is connected')

// DOM Variables
const deleteBtn = document.querySelectorAll('.del')
const editBtn = document.querySelectorAll('.edit')
const editCommentBtn = document.querySelectorAll('.edit-comment')
const deleteCommentBtn = document.querySelectorAll('.del-comment')
const likeBtn = document.querySelectorAll('.likes')
const follow = document.querySelector('#follow')
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

followedBtn.addEventListener('click', toggleFollowedDropdown)


// FUNCTIONS
// function unfollowRuss(){
//     console.log("REALLY?!?!")
//     if (targetUser.userName === 'RussellCatch'){
//         let c1 = confirm('Are you sure you want to do that?')
//         if (c1 === true) {
//             let c2 = confirm("You know I'm the guy that created this site, right?")
//         }else return

//         if (c2 === true){
//             let c3 = confirm("And you still don't want to hear from me?")
//         }else return

//         if (c3 === true){
//             alert("Okay, well, that makes me sad, but your wish is granted.")
//         }
//     }
// }


function toggleFollowedDropdown(){
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
    
    const catchPostId = this.parentNode.parentNode.dataset.id
    const oldPostCatchegories = this.parentNode.parentNode.querySelector('.post-catchegories').innerText.slice(14).split(', ')
    const newPostCatchegories = []

    try{
        await updateCatchegoryCount(oldPostCatchegories, newPostCatchegories)
        const response = await fetch('../catchPosts/deleteCatchPost', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'catchPostId': catchPostId,
            })
        })
        const data = await response.json()
        console.log('data: '+ data)
    }catch(err){
        console.log(err)
    }
}

async function updateCatchegoryCount(oldPostCatchegories, newPostCatchegories){
    try{
        const response = await fetch('../../catchPosts/updateCatchegoryCount', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'newPostCatchegories': newPostCatchegories,
                'oldPostCatchegories': oldPostCatchegories
            })
        })
        const data = await response.json()
        console.log('data: '+data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

// Could refactor using contenteditable - or just wait to refactor with React
function editCatchPost(){
    // DOM variables
    const catchPostId = this.parentNode.parentNode.dataset.id
    const postTitle = this.parentNode.parentNode.querySelector('.catch-title')
    const postContent = this.parentNode.parentNode.querySelector('.catch-post-content')
    const editContent = this.parentNode.parentNode.querySelector('.edit-post-content')
    const postCatchegories = this.parentNode.parentNode.querySelector('.post-catchegories')
    const editPostCatchegories = this.parentNode.parentNode.querySelector('.edit-post-catchegories')
    const edit = this.parentNode.querySelector('.edit')

    edit.classList.add('selected')
    edit.innerText = "Submit Edit"

    console.log('user.js says content contains: '+editContent.textContent.includes('\r\n'))
    // Turn title into editable input
    const editTitle = document.createElement('input')
    editTitle.setAttribute('maxlength', '60')
    editTitle.setAttribute('required', 'true')
    editTitle.classList.add('edit-catch-title')
    editTitle.value = postTitle.querySelector('a').innerText
    postTitle.replaceWith(editTitle)
    
    // Turn post content into editable input
    ///////////// Old way
    // const editInput = document.createElement('textarea')
    // editInput.classList.add('edit-catch-post')
    // editInput.innerText = postContent.textContent
    // postContent.replaceWith(editInput)
    //
    // New way
    postContent.classList.add('hidden')
    editContent.classList.remove('hidden')

    // Turn post catchegories into editable input
    editPostCatchegories.classList.remove('hidden')
    postCatchegories.classList.add('hidden')

    // Handle event listeners
    // window.addEventListener('keypress', confirmEdit)
    edit.removeEventListener('click', editCatchPost)
    edit.addEventListener('click', confirmEdit)
    
    async function confirmEdit(e){
        // let eventKey = e.key
        // if (e.key == undefined) eventKey = 'Enter'
        // if (eventKey === 'Enter' && !e.shiftKey){
            const catchContent = this.parentNode.parentNode.querySelector('.edit-post-content')
            const catchTitle = this.parentNode.parentNode.querySelector('.edit-catch-title')
            const oldPostCatchegories = catchContent.parentNode.querySelector('.post-catchegories').innerText.slice(14).split(', ')
            let postCatchegoriesChildren = editPostCatchegories.children

            console.log('length: ' +catchContent.value.length)

            if (catchContent.value.length === 0 || catchTitle.value.length === 0){
                alert('Catch title and content must not be blank')
                return
            }
            
            let newPostCatchegories = []
            for (let i = 0, len = postCatchegoriesChildren.length; i < len; i++){
                editPostCatchegories.getElementsByTagName('input').item(i).checked === true
                if (editPostCatchegories.getElementsByTagName('input').item(i).checked === true){
                    newPostCatchegories.push(editPostCatchegories.getElementsByTagName('input').item(i).value)
                }
            }
            
            
            // Send PUT request to controller
            try{
                await updateCatchegoryCount(oldPostCatchegories, newPostCatchegories)
                const response = await fetch ('../../catchPosts/editCatchPost', {
                    method: 'put',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        'catchPostId': catchPostId,
                        'catchTitleElement': catchTitle,
                        'catchTitle': catchTitle.value,
                        'catchContent': editContent.value,
                        'catchegories': newPostCatchegories,
                        'oldPostCatchegories': oldPostCatchegories,
                        'newPostCatchegories': newPostCatchegories
                    })
                })
                const data = await response.json()
                console.log('data: ' + data)
            }catch(err){
                console.log(err)
            }
        // }
    }
}

function editComment(){
    // DOM variables
    const catchPostId = this.parentNode.parentNode.dataset.id
    const commentId = this.parentNode.dataset.id
    const commentText = this.parentNode.querySelector('.comment-text')
    const edit = this.parentNode.querySelector('.edit-comment')
    const editCommentText = this.parentNode.querySelector('.edit-comment-text')

    console.log('editComment function: ',catchPostId, commentId)
    
    commentText.classList.add('hidden')
    edit.classList.add('selected')
    edit.innerText = "Confirm Edit"
    editCommentText.classList.remove('hidden')

    // Handle event listeners
    // window.addEventListener('keypress', confirmCommentEdit)
    edit.removeEventListener('click', editComment)
    edit.addEventListener('click', confirmCommentEdit)

    async function confirmCommentEdit(e){
        edit.classList.remove('selected')
        // Send PUT request to controller
        try{
            const response = await fetch ('../../catchPosts/editComment', {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    'catchPostId': catchPostId,
                    'commentId': commentId,
                    'catchComment': editCommentText.value
                })
            })
            const data = await response.json()
            console.log(data)
            location.reload()
        }catch(err){
            console.log(err)
        }
    }
}

// Function to auto-grow textarea element based on text within...
// function autoGrow(element) {
//     element.style.height = "5px";
//     element.style.height = (element.scrollHeight)+"px";
// }

async function deleteComment(){
    const c = confirm('You are about to delete this comment, would you like to continue?')
    if (c === false) return
    
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
    const catchPostId = this.parentNode.parentNode.dataset.id
    console.log('catchpostID: '+catchPostId)
    try{
        const response = await fetch('../../catchPosts/likeCatchPost', {
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
    const userId = document.body.dataset.user
    const omitCatchegory = this.value
    console.log('omit this catchegory: '+omitCatchegory)
    console.log('for this user: '+userId)

    try{
        const response = await fetch('../users/omitCatchegory', {
            method: 'put',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                'userId': userId,
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
    const userId = document.body.dataset.user
    const allowCatchegory = this.value
    console.log('allow this catchegory: '+allowCatchegory)

    try{
        const response = await fetch('../users/allowCatchegory', {
            method: 'put',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                'userId': userId,
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
