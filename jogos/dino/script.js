function elements(){
    const character = document.querySelector("#character")
    const block = document.querySelector("#block")
    
    return{
        character,
        block
    }
}


function jump(){

    const { character } = elements();

    if(character.className === ""){
        character.classList.add("animate");
        setTimeout(() => character.classList.remove("animate"), 600)

    }
}

document.getElementById("game").addEventListener("click", jump)