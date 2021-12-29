function elements(){
    const canvas = document.querySelector("#myCanvas")
    const ctx = canvas.getContext("2d");

    return{
        canvas,
        ctx
    }
}

function creacteCharacter(){
    
    const { ctx, canvas } = elements();
    
    const height = 10
    const y = 150 - height;
    
    console.log(y)

    ctx.fillStyle = "red";
    ctx.fillRect(0, y, height, 15)

}

(function startGame(){
    creacteCharacter()
})()