console.log('client-side catchPosts.js is connected')

const followBtn = document.querySelector('#follow')

followBtn.addEventListener('click', followUser)

function followUser(){
    console.log('following user...')
}

function unfollowUser(){
    console.log('unfollowing user...')
}
