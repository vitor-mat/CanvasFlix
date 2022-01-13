/*
-----SUMÁRIO----------
1 - PRÉGAME
2 - ON GAME
3 - CONFIGURAÇÕES DO PERSONAGEM
4 - CONFIGURAÇÃO DA lava bottonA
5 - ENYME 1
6 - ENYME 2
7 - SCORE
8 - LOSE VALIDATION
*/

let altura = window. screen. height - 140;
let largura = window. screen. width;

const k = kaboom({
    background: [0, 255, 255],
    width: largura,
    height: 750
})

document.querySelector("#canvas-container").appendChild(k.canvas)

const pointsToFinsh = {
    level1: 10
}

const charcaterDetails = {
    idle: "idleRight",
    jump: "jumpRight",
    crouched: "crouchedRight"
}


loadSpriteAtlas("sprites/ninja_sprite.png", {
    "bean": {
        x: 0,
        y: 0,
        width: 264,
        height: 180,
        sliceX: 6,
        sliceY: 3,
        anims: {
            idleRight: { from: 0, to: 1, loop: true },
            idleLeft: { from: 2, to: 3, loop: true },
            jumpRight: { from: 0, to: 0, loop: false},
            jumpLeft: { from: 2, to: 2, loop: false},
            runRight: { from: 4, to: 9, loop: true},
            runLeft: { from: 10, to: 15, loop: true},
            crouchedRight: { from: 1, to: 1, loop: false},
            crouchedLeft: { from: 3, to: 3, loop: true},
        },
    },
})

loadSpriteAtlas("sprites/lava_sprite.png",{
    "lava":{
        x: 0,
        y: 0,
        width: 150,
        height: 50,
        sliceX: 3,
        anims: {
            side: { from: 1, to: 1, loop: true },
            bottom: { from: 1, to: 1, loop: false},
            diagonal: { from: 2, to: 2, loop: false},
        },
    }
})

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



let lavabottom = "-"

function makeLavaBottom(){
    let maxSprites = (largura/50).toFixed(0)
    for(let i = 0; i < maxSprites; i++){
        lavabottom += "-"
    }
}

makeLavaBottom()

/*ON GAME ------------------------------------------------------------ */
scene("game", () => {

    addLevel([
        "=                 ",
        "=                 ",
        "=                 ",
        "=                 ",
        "=                 ",
        "=                 ",
        "=                 ",
        "=                 ",
        "=                 ",
        "=                 ",
        "=                 ",
        "=                 ",
        "=                 ",
        "=                 ",
        `*${lavabottom}`,
    ], {
        // define the size of each block
        width: 50,
        height: 50,
        // define what each symbol means, by a function returning a component list (what will be passed to add())
        "=": () => [
            sprite("lava", { frame: 1}),
            z(1000),
        ],
        "-": () => [
            sprite("lava", { frame: 0}),
            z(1000),
        ],
        "*": () => [
            sprite("lava", { frame: 2}),
            z(1000),
            "lava"
        ]
    })

    const temportisador = setInterval(() => {
        if(!isFullscreen()){
            k.debug.paused = true
            pauseElement.opacity = 1
            pauseBackground.opacity = 1

        }else{
            pauseElement.opacity = 0
            pauseBackground.opacity = 0
        }
    }, 1000)

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

    const bean = add([
        sprite("bean"),
        pos(150, 40),
        area(),
        body(),
        z(1001)
    ])

    bean.play(charcaterDetails.idle)

    const moveForce = 400
    const jumpForce = 800
    

    // .jump() when "space" key is pressed
    onKeyPress("up", () => {
        if (bean.isGrounded() && !k.debug.paused) {
            bean.jump(jumpForce);
            bean.play(charcaterDetails.jump)
        }
    })

    onKeyPress("down", () => {
        if (bean.isGrounded() && !k.debug.paused) {
            bean.play(charcaterDetails.crouched)
        }
    })


    onKeyDown("left", () => {
        if(!k.debug.paused){bean.move(-moveForce, 0)
        charcaterDetails.idle = "idleLeft"
        charcaterDetails.jump = "jumpLeft"
        charcaterDetails.crouched = "crouchedLeft"
        bean.play("runLeft")}
    })

    onKeyDown("right", () => {
        if(!k.debug.paused){bean.move(moveForce, 0)
        charcaterDetails.idle = "idleRight"
        charcaterDetails.jump = "jumpRight"
        charcaterDetails.crouched = "crouchedRight"
        bean.play("runRight")}
    })

    onKeyRelease(["up", "right", "left", "down"], () => {
        if(!k.debug.paused) bean.play(charcaterDetails.idle)
    })
    
    bean.action(() => {
        bean.pushOutAll()
    })

    /*Plataforma de inicio------------------ */
    const plataformStart = add([
        rect(150, 20),
        pos(100, height() - 300),
        outline(4),
        area(),
        solid(),
        color(79, 79, 79),
        "plataform-start",
    ])

    bean.onCollide("plataform-start", () => {
        if(!bean.isGrounded()){
            bean.play(charcaterDetails.idle)
        }
    })

    /* ENYME 1 --------------------------------------------------- */

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


    function spawnTreeSide() {
        const plataforms = add([
            rect(48, rand(24, 64)),
            area(),
            solid(),
            outline(4),
            pos(width(), height() - 48),
            origin("botleft"),
            color(79, 79, 79),
            move(LEFT, 150),
            "plataforms", // add a tag here
        ]);


        bean.onCollide("plataforms", () => {
            if(!bean.isGrounded()){
                bean.play(charcaterDetails.idle)
            }
        })

        wait(rand(1, 2), () => {
            if(score < pointsToFinsh.level1){
                spawnTreeSide()
            }
        });

        onUpdate(() => {
            if(plataforms.pos.x < 0){
                destroy(plataforms)
            }
        })
    }

    spawnTreeSide()


    onUpdate(() => {

        if(bean.pos.y > height()  || bean.pos.x < 50){
            go("lose")
        }
    })


    /*SCORE --------------------------------------------------- */

    let finshPlataform, finshPlataformText

    const scoreCount = () => {
        score++
        scoreLabel.text = score


        if(score == pointsToFinsh.level1){
            finshPlataform = add([
                rect(200, 40),
                pos(width(), height()-100),
                outline(4),
                area(),
                solid(),
                color(0, 250, 154),
                "finshPlataform",
            ])
            finshPlataformText = add([
                text("Chegada",{
                    size: 24
                }),
                color(255, 255, 255),
                pos(width()+10, height()-200),
                outline(1),
            ])
            onUpdate(() => {
                finshPlataform.moveTo(width()-150, height()-100, 120)
                finshPlataformText.moveTo(width()-150, height()-200, 120)
            })
        }

    }


    bean.onCollide("plataforms", () => {
        if(!score) {
            if(bean.isGrounded()) bean.play("idle")
            addKaboom(plataformStart.pos);
            destroy(plataformStart)
            scoreCount()
            loop(1, () => scoreCount())
        }
    })

    /*Wim vlidation ------------------------ */
        onUpdate(() => {
            if(bean.pos.x > width()-150 && score == pointsToFinsh.level1){
                go("win")
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
        text("Click here to restart the game", {
            size: "32"
        }),
        pos(center().x, center().y + 60),
        origin("center"),
    ])
    
    validation = true;
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

document.addEventListener('click', (e) => {
    handleStart(e)
})