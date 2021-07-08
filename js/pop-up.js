function initializePopUp(func){

    document.querySelector('i[name=close-pop-up]').onclick = function(){
        document.getElementById('overlay').classList.remove('overlay')
        document.querySelector("#overlay").innerHTML = null
    }

    document.getElementById('overlay').onkeydown = function(evt){
        if (evt.key == 'Escape') {
            document.getElementById('overlay').classList.remove('overlay')
            document.querySelector("#overlay").innerHTML = null  
         }
    }

    }

export async function showPopUp(view, func){
    document.getElementById('overlay').classList.add('overlay')
    document.querySelector("#overlay").innerHTML = view
    // document.querySelector('#content').style.overflow = 'hidden'

    initializePopUp(func)

}

export function hidePopUp(){
    document.getElementById('overlay').classList.remove('overlay')
    document.querySelector("#overlay").innerHTML = null
}