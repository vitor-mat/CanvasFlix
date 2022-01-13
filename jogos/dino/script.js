let altura = window. screen. height - 140;
let largura = window. screen. width;

const funcao = () => console.log(altura)
funcao()

const { canvas } = kaboom({
    background: [0, 255, 255],
    width: largura,
    height: 650
})

document.querySelector("#canvas-container").appendChild(canvas)

const pointsToFinsh = {
    level1: 50
}

const charcaterDetails = {
    idle: "idleRight",
    jump: "jumpRight",
    crouched: "crouchedRight"
}


loadSpriteAtlas("sprites/dino_sprite.png", {
    "dino": {
        x: 0,
        y: 0,
        width: 360,
        height: 144,
        sliceX: 5,
        sliceY: 2,
        anims: {
            idleRight: { from: 0, to: 1, loop: true },
            idleLeft: { from: 5, to: 6, loop: true },
            jumpRight: { from: 4, to: 4, loop: false},
            jumpLeft: { from: 9, to: 9, loop: false},
            runRight: { from: 1, to: 3, loop: true},
            runLeft: { from: 6, to: 8, loop: true},
            crouchedRight: { from: 1, to: 1, loop: false},
            crouchedLeft: { from: 6, to: 6, loop: true},
        },
    },
})

loadSpriteAtlas("sprites/meteor_sprite.png",{
    "meteorSprite":{
        x: 0,
        y: 0,
        width: 80,
        height: 50,
        sliceX: 2,
        anims:{
            idle:{from: 0, to: 1, loop: true}
        }
    }
})

loadSprite("groundSprite", "sprites/ground.png")

let validation = true

/*PRÉ GAME--------------------------------------------- */
scene("menu", () => {
    add([
        text("Click here to start the game", {
            size: 24
        }),
        pos(center()),
        origin("center")
    ])
})



let groundBottom = "---"

function makegroundBottom(){
    let maxSprites = (largura/50).toFixed(0)
    for(let i = 0; i < maxSprites; i++){
        groundBottom += "-"
    }
}

makegroundBottom()

let groundWall = "- "

function makegroundWall(){
    let maxSprites = (largura/50).toFixed(0)
    for(let i = 0; i < maxSprites; i++){
        groundWall += " "
    }
    groundWall += "-"
}

makegroundWall()

function makeLevelHight(){

}

const arr = [
    `${groundWall}`,
    `${groundWall}`,
    `${groundWall}`,
    `${groundWall}`,
    `${groundWall}`,
    `${groundWall}`,
    `${groundWall}`,
    `${groundWall}`,
    `${groundWall}`,
    `${groundWall}`,
    `${groundWall}`,
    `${groundWall}`,
    `${groundBottom}`,
]

/*ON GAME ------------------------------------------------------------ */
scene("game", () => {

    addLevel(arr, {
        // define the size of each block
        width: 50,
        height: 50,
        // define what each symbol means, by a function returning a component list (what will be passed to add())
        "-": () => [
            sprite("groundSprite", { frame: 0}),
            area(),
            solid(),
            z(1000),
            "ground"
        ]
    })

    camPos(center().x+60, center().y)

    /*Configurações do personagem */
    gravity(2400);

    const dino = add([
        sprite("dino"),
        pos(150, 55),
        area(),
        body(),
        z(10000),
        "player"
    ])

    dino.play(charcaterDetails.idle)

    const moveForce = 400
    const jumpForce = 800
    

    // .jump() when "space" key is pressed
    onKeyPress("up", () => {
        if (dino.isGrounded()) {
            dino.jump(jumpForce);
            dino.play(charcaterDetails.jump)
        }
    })

    onKeyPress("down", () => {
        if (dino.isGrounded()) {
            dino.play(charcaterDetails.crouched)
        }
    })


    onKeyDown("left", () => {
        dino.move(-moveForce, 0)
    })

    onKeyDown("right", () => {
       dino.move(moveForce, 0)
    })


    onKeyPress("left", () => {
        charcaterDetails.idle = "idleLeft"
        charcaterDetails.jump = "jumpLeft"
        charcaterDetails.crouched = "crouchedLeft"
        dino.play("runLeft")
    })

    onKeyPress("right", () => {
        charcaterDetails.idle = "idleRight"
        charcaterDetails.jump = "jumpRight"
        charcaterDetails.crouched = "crouchedRight"
        dino.play("runRight")
    })

    onKeyRelease(["up", "right", "left", "down"], () => {
        dino.play(charcaterDetails.idle)
    })
    
    dino.action(() => {
        dino.pushOutAll()
    })

    /* ENYME 1 --------------------------------------------------- */

function meteorGenerator(){
    const meteor = add([
        sprite("meteorSprite", {anim: "idle"}),
        pos(rand(0, largura), 50),
        area(),
        solid(),
        move(DOWN, 500),
        color(250,128,114),
        "meteor",
    ])

    const meteorGuided = add([
        sprite("meteorSprite", {anim: "idle"}),
        pos(dino.pos.x, 50),
        area(),
        solid(),
        move(DOWN, 500),
        color(250,128,114),
        "meteor",
    ])

    meteor.onCollide("ground", () => {
        destroy(meteor)
    })
    
    meteorGuided.onCollide("ground", () => {
        destroy(meteorGuided)
    })

    meteor.onCollide("player", () => {
        addKaboom(dino.pos)
        destroy(dino)
        go("lose")
    })

    meteorGuided.onCollide("player", () => {
        addKaboom(dino.pos)
        destroy(dino)
        go("lose")
    })

    wait(rand(.1, .5), () => {
        meteorGenerator()
    })
}

    let score = 0;
    const scoreLabel = add([
        text(score),
        pos(50, 24),
        area(),
        "scoreTag"
    ])

    let levelInfo = add([
        text("Level 1 - Alcance 50 pontos",{
            size: width()*0.03
        }),
        pos(center().x, 70),
        origin("center"),
        z(1000),
        area(),
        color(255, 255, 255),
        "resume",
    ])

    /*SCORE --------------------------------------------------- */

    const scoreCount = () => {
        score++
        scoreLabel.text = score
        if(score == 50){
            go("win")
        }
    }


    /*Start scoore */
    dino.onCollide("ground", () => {
        if(!score) {
            if(dino.isGrounded()) dino.play("idle")
            loop(1, () => {
                if(score < pointsToFinsh.level1) scoreCount()
            })
        }
    })

})

scene("win", () => {
    add([
        text("Voce ganhou o jogo!",{
            size: width()*0.04
        }),
        pos(center()),
        origin("center")
    ])

    
    add([
        text("Obrigado por salvar o Dino", {
            size: "32"
        }),
        pos(center().x, center().y + 60),
        origin("center"),
    ])

})

scene("lose", () => {
    add([
        text("Game Over"),
        pos(center()),
        origin("center"),
    ])

    add([
        text("Click here to restart the game", {
            size: "32"
        }),
        pos(center().x, center().y + 60),
        origin("center"),
    ])

    validation = true;
})

/*SHOW MENU----------------------------------------------- */

go("menu")

/*RUN GAME------------------------------------------------------------ */

document.addEventListener('click', (e) => {
    if (validation) {
        go("game")
        validation = false
    }
})
