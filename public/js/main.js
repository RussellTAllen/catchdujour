console.log('public main.js loaded...')

const deleteBtn = document.querySelectorAll('.del')
const likeBtn = document.querySelectorAll('.like')

Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteCatchPost)
})

Array.from(likeBtn).forEach((el)=>{
    el.addEventListener('click', likeCatchPost)
})

// Array.from(catchPostItem).forEach((el)=>{
//     el.addEventListener('click', markComplete)
// })

// Array.from(catchPostComplete).forEach((el)=>{
//     el.addEventListener('click', markIncomplete)
// })

async function deleteCatchPost(){
    const catchPostId = this.parentNode.dataset.id
    try{
        const response = await fetch('catchPosts/deleteCatchPost', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'catchPostIdFromJSFile': catchPostId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}


// Replacing with method-override
// async function likeCatchPost(){
//     console.log('mainjs says this is: '+this.parentNode.dataset.id)
//     const catchPostId = this.parentNode.dataset.id
//     try{
//         const response = await fetch('catchPosts/likeCatchPost', {
//             method: 'put',
//             headers: {'Content-type': 'application/json'},
//             body: JSON.stringify({
//                 'catchPostId': catchPostId
//             })
//         })
//         const data = await response.json()
//         console.log(data)
//         location.reload()
//     }catch(err){
//         console.log(err)
//     }
// }


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

