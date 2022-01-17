let altura = window. screen. height - 140;
let largura = window. screen. width;

const funcao = () => console.log(altura)
funcao()

const k = kaboom({
    background: [0, 255, 255],
    width: largura,
    height: 650
})

document.querySelector("#canvas-container").appendChild(k.canvas)

const counterToFinsh = {
    level1: 20
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

loadSprite("exit", "sprites/exit.png")

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

const arr = [
    `-                                                                                                                                         `,
    `-                                                                                                                                         `,
    `-                                                                                                                                         `,
    `-                                                                                                                                         `,
    `-                                                                                                                                         `,
    `-                                                                                                                                         `,
    `-                                                                                                                                         `,
    `-                                                                                                                                         `,
    `-                                                                                                                                         `,
    `-                                                                                                                                         `,
    `-                                                                                                                                         `,
    `-                                                                                                                                       # `,
    `------------   ----------------------   -----------   ---------------------   ------------------------------   -----------------------------`,
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
        ],
        "#": () => [
            sprite("exit"),
        ]
    })

    const pauseElement = add([
        text("paused"),
        pos(center()),
        origin("center"),
        opacity(0),
        z(1003),
        fixed()
    ])

    const pauseBackground = add([
        rect(width(), height()),
        pos(center()),
        origin("center"),
        opacity(0),
        z(1002),
        fixed(),
        color(255,255,255)
    ])

    /*Configurações do personagem */
    gravity(2400);

    const dino = add([
        sprite("dino"),
        pos(150, 55),
        area(),
        body(),
        z(1000),
        "player"
    ])


    onUpdate(() => {
        if(dino.pos.x < center().x+60){
            camPos(center().x+60, center().y)
        }else if(dino.pos.x > 6009){
            camPos(6009, center().y)
        }else{
            camPos(dino.pos.x, center().y)
        }

        if(dino.pos.y > height() && dino.pos.x > 6009){
            go("win")
        }else if(dino.pos.y > height() && dino.pos.x < 6009){
            go("lose")
        }
    })

    dino.play(charcaterDetails.idle)

    const moveForce = 400
    const jumpForce = 800
    

    // .jump() when "space" key is pressed
    onKeyDown("up", () => {
        if (dino.isGrounded() && !k.debug.paused) {
            dino.jump(jumpForce);
            dino.play(charcaterDetails.jump)
        }
    })

    onKeyPress("down", () => {
        if (dino.isGrounded() && !k.debug.paused) {
            dino.play(charcaterDetails.crouched)
        }
    })


    onKeyDown("left", () => {
        if(!k.debug.paused) dino.move(-moveForce, 0)
    })

    onKeyDown("right", () => {
       if(!k.debug.paused) dino.move(moveForce, 0)
    })


    onKeyPress("left", () => {
        if(!k.debug.paused){
            charcaterDetails.idle = "idleLeft"
            charcaterDetails.jump = "jumpLeft"
            charcaterDetails.crouched = "crouchedLeft"
            dino.play("runLeft")
        }
    })

    onKeyPress("right", () => {
        if(!k.debug.paused){
            charcaterDetails.idle = "idleRight"
            charcaterDetails.jump = "jumpRight"
            charcaterDetails.crouched = "crouchedRight"
            dino.play("runRight")
        }
    })

    onKeyRelease(["up", "right", "left", "down"], () => {
        if(isKeyPressed("right") || isKeyDown("right")){
            dino.play("runRight")
        }else if(isKeyPressed("left") || isKeyDown("left")){
            dino.play("runLeft")
        }else{
            dino.play(charcaterDetails.idle)
        }
    })
    
    dino.action(() => {
        dino.pushOutAll()
    })

    /* ENYME 1 --------------------------------------------------- */

function meteorGenerator(){
    const meteor = add([
        sprite("meteorSprite", {anim: "idle"}),
        pos(rand(dino.pos.x-(largura/2), dino.pos.x+(largura/2)), 50),
        area(),
        solid(),
        move(DOWN, 500),
        color(250,128,114),
        "meteor",
    ])

    meteor.onCollide("ground", () => {
        destroy(meteor)
    })

    meteor.onCollide("player", () => {
        addKaboom(dino.pos)
        destroy(dino)
        go("lose")
    })

    wait(rand(.5, .7), () => {
        meteorGenerator()
    })
}

function meteorGuidedGenerator(){

    const meteorGuided = add([
        sprite("meteorSprite", {anim: "idle"}),
        pos(dino.pos.x, 50),
        area(),
        solid(),
        move(DOWN, 500),
        color(250,128,114),
        "meteor",
    ])

    meteorGuided.onCollide("ground", () => {
        destroy(meteorGuided)
    })
    
    meteorGuided.onCollide("player", () => {
        addKaboom(dino.pos)
        destroy(dino)
        go("lose")
    })

        wait(.7, () => {
            meteorGuidedGenerator()
        })
}

    let counter = counterToFinsh.level1
    const counterLabel = add([
        text(counter),
        pos(50, 24),
        area(),
        "counterTag",
        fixed()
    ])

    let levelInfo = add([
        text("Level 1 - Corra e salve-se",{
            size: width()*0.03
        }),
        pos(center().x, 70),
        origin("center"),
        z(1000),
        fixed(),
        color(255, 255, 255),
        "resume",
    ])

    /*counter --------------------------------------------------- */

    const counterCount = () => {
        counter--
        counterLabel.text = counter
        if(counter == 0){
            go("lose")
        }
    }


    wait(1, () => {
        meteorGenerator()
        meteorGuidedGenerator()
        loop(1, () => {
            if(counter > 0) counterCount()
    
            if(!isFullscreen()){
                k.debug.paused = true
                pauseElement.opacity = 1
                pauseBackground.opacity = 1
            }else{
                pauseElement.opacity = 0
                pauseBackground.opacity = 0
            }
        })
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
const handleStart = (e) => {
    if (!isFullscreen()) {
        fullscreen(!isFullscreen())
        k.debug.paused = false;
    }
    if (validation) {
        go("game")
        validation = false
    }
}

k.canvas.addEventListener('click', (e) => {
    handleStart(e)
})

k.canvas.addEventListener('keydown', (e) => {
    if(e.key == " " || e.key == "Enter") handleStart(e)
})
