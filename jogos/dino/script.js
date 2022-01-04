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

const { debug } = kaboom({
    background: [0, 255, 255],
})

const pointsToFinsh = {
    level1: 50
}

const pause = {}

loadSprite("bean", "sprites/pac.png")
loadSprite("tree-top-image", "sprites/tree_top.png")
loadSprite("lava-bottom-image", "sprites/lava_bottom.png")
loadSprite("lava-left-image", "sprites/lava_left.png")
loadSprite("vucao", "sprites/vucao.png")

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


/*ON GAME ------------------------------------------------------------ */
scene("game", () => {

    add([
        sprite("vucao"),
        pos(0, 0),
        z(-500)
    ])

    /*Configurações do personagem */
    gravity(2400);

    const bean = add([
        sprite("bean"),
        pos(150, 40),
        area(),
        body(),
        z(10000),
        "player"
    ])

    const moveForce = 400
    const jumpForce = 800

    fullscreen(!isFullscreen())

    

    // .jump() when "space" key is pressed
    onKeyPress("up", () => {
        if (bean.isGrounded()) {
            bean.jump(jumpForce);
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

    timer(3, () => {
        debug.log("ola mundo")
    })

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
        wait(rand(1, 2), () => {
            if(score < pointsToFinsh.level1){
                spawnTreeSide()
            }
        });
    }

    spawnTreeSide()



    /*Configuração da lava bottona--------------------------------------- */
    add([
        sprite("lava-bottom-image"),
        pos(0, height() - 48), ,
        area(),
        solid(),
        z(1000),
        "lava-bottom",
    ])


    /*lava left----------------------*/
    add([
        sprite("lava-left-image"),
        pos(0, 0),
        area(),
        z(1000),
        "lava-left",
    ])

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

    bean.onCollide("lava-bottom", () => {
        addKaboom(bean.pos);
        shake();
        go("lose"); // go to "lose" scene here
    });

    bean.onCollide("lava-left", () => {
        addKaboom(bean.pos);
        shake();
        go("lose"); // go to "lose" scene here
    });

    /*Start scoore */
    bean.onCollide("plataforms", () => {
        if(!score) {
            addKaboom(plataformStart.pos);
            destroy(plataformStart)
            loop(1, () => {
                if(score < pointsToFinsh.level1) scoreCount()
            })
        }
    })

    /*Wim vlidation ------------------------ */
    bean.onCollide("finshPlataform", () => {
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
