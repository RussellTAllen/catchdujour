console.log('client-side profile.js is connected')

const followedByBtn = document.querySelector('#followed-by-btn')
const followedByContent = document.querySelector('.followed-by-content')

followedByBtn.addEventListener('click', toggleDropdown)

function toggleDropdown(){
    console.log('toggling...')
    followedByContent.classList.toggle('hidden')

    window.addEventListener('click', (e) =>{
        if (!e.target.matches('#followed-by-btn')){
            followedByContent.classList.add('hidden')
        }
    })
}