console.log('client-side catchPosts.js is connected')

const followBtn = document.querySelector('#follow')
// const unfollowBtn = document.querySelector('#unfollow')

followBtn.addEventListener('click', followUser)
// unfollowBtn.addEventListener('click', unfollowUser)

function followUser(){
    console.log('following user...')    
}

// function unfollowUser(){
//     console.log('unfollowing user...')
// }
