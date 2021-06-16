console.log('CreateCatch.js connected')

const createCatchBtn = document.querySelector('#create-catch')
const newCatchegory = document.querySelector('#new-catchegory')
const catchTitle = document.querySelector('.catch-title')
const catchContent = document.querySelector('.catch-content')

// createCatchBtn.addEventListener('click', addNewCatchegory)

async function addNewCatchegory(){
    // if (!newCatchegory.value || !catchContent.value || !catchTitle.value) return
    // else{
    //     try{
    //         const response = await fetch ('../../catchPosts/createCatchegory', {
    //             method: 'put',
    //             headers: {'Content-Type': 'application/json'},
    //             body: JSON.stringify({
    //                 'createCatchegory': newCatchegory.value
    //             })
    //         })
    //         const data = await response.json()
    //         console.log('data: ' + data)
    //     }catch(err){
    //         console.log(err)
    //     }
    // }
}