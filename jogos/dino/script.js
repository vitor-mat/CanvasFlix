function elements(){
    const canvas = document.querySelector("#myCanvas")
    const ctx = canvas.getContext("2d");

    return{
        canvas,
        ctx
    }
}

function creacteCharacter(y){
    
    const { ctx } = elements();
    
    const height = 15;
    const width = 10; 
    const x = 0;

    ctx.fillStyle = "red";
    ctx.fillRect(x, y, width, height)
}

function moveCharacter(){
    update(120)
}

function update(y = 140){
    interval = setInterval(creacteCharacter(y), 20);
}

(function startGame(){
    update()
})()

document.addEventListener("click", moveCharacter)