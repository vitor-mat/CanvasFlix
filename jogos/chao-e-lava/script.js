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

var altura = window. screen. height;
var largura = window. screen. width;

const { debug } = kaboom({
    background: [0, 255, 255],
    width: largura,
    height: 750
})

const pointsToFinsh = {
    level1: 50
}

const pause = {}


loadSpriteAtlas("sprites/ninja/right/stand/ninja_stand.png", {
    "bean": {
        x: 0,
        y: 0,
        width: 88,
        height: 60,
        sliceX: 2,
        anims: {
            idle: { from: 0, to: 1, loop: true },
            jump: { from: 0, to: 0, loop: false}
        },
    },
})
loadSprite("tree-top-image", "sprites/tree_top.png")
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
            area(),
            z(1000),
            "lava"
        ],
        "-": () => [
            sprite("lava", { frame: 0}),
            area(),
            z(1000),
            "lava"
        ],
        "*": () => [
            sprite("lava", { frame: 2}),
            area(),
            z(1000),
            "lava"
        ]
    })


    /*Configurações do personagem */
    gravity(2400);

    const bean = add([
        sprite("bean"),
        pos(150, 40),
        area(),
        body(),
        z(10000)
    ])

    bean.play("idle")

    const moveForce = 400
    const jumpForce = 800
    

    // .jump() when "space" key is pressed
    onKeyPress("up", () => {
        if (bean.isGrounded()) {
            bean.jump(jumpForce);
            bean.play("jump")
        }
    })

    onKeyDown("left", () => {
        bean.move(-moveForce, 0)
    })

    onKeyDown("right", () => {
        bean.move(moveForce, 0)
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
            bean.play("idle")
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
        add([
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
                bean.play("idle")
            }
        })

        wait(rand(1, 2), () => {
            if(score < pointsToFinsh.level1){
                spawnTreeSide()
            }
        });
    }

    spawnTreeSide()





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

    /*LOSE VALIDATION--------------------------------------- */

    bean.onCollide("lava", () => {
        addKaboom(bean.pos);
        destroy(bean)
        go("lose")
    })


    /*Start scoore */
    bean.onCollide("plataforms", () => {
        if(!score) {
            if(bean.isGrounded()) bean.play("idle")
            addKaboom(plataformStart.pos);
            destroy(plataformStart)
            loop(1, () => {
                if(score < pointsToFinsh.level1) scoreCount()
            })
        }
    })

    /*Wim vlidation ------------------------ */
    bean.onCollide("finshPlataform", () => {
        bean.play("idle")
        wait(1, () => {
            go("win")
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
