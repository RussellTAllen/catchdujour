console.log('client-side catchPost.js is connected...')

const commentLikeBtn = document.querySelectorAll('.comment-like-btn')

Array.from(commentLikeBtn).forEach(el => {
    el.addEventListener('click', likeComment)
})


async function likeComment(){
    console.log('liking this comment! '+this.parentNode.parentNode.dataset.id)
    const commentId = this.parentNode.parentNode.dataset.id
    console.log('commentID: '+commentId)
    const catchPostId = this.parentNode.parentNode.parentNode.dataset.id

    try{
        const response = await fetch('/catchPosts/likeComment', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'catchPostId': catchPostId,
                'commentId': commentId
            })
        })
        const data = await response.json()
        console.log('data: ' + data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}