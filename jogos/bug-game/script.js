let altura = window.screen.height - 140;
let largura = window.screen.width;

let backgroundColor = [0, 255, 255]

const k = kaboom({
    background: backgroundColor,
    width: largura,
    height: 650
})

function mobileAlert(){
    if(largura < 800){
        alert("Estamos na versão beta, os jogos não estão prontos para dispositivos mobiles")
    }
}
mobileAlert()

document.querySelector("#canvas-container").appendChild(k.canvas)

const pointsToFinsh = {
    level1: 50
}

const charcaterDetails = {
    idle: "idleRight",
    jump: "jumpRight",
    crouched: "crouchedRight"
}

loadSpriteAtlas("sprites/bug_rock_sprite.png", {
    "bugRock": {
        x: 0,
        y: 0,
        width: 350,
        height: 140,
        sliceX: 5,
        sliceY: 2,
        anims: {
            idleRight: { from: 0, to: 1, loop: true },
            idleLeft: { from: 5, to: 6, loop: true },
            jumpRight: { from: 4, to: 4, loop: false },
            jumpLeft: { from: 9, to: 9, loop: false },
            runRight: { from: 1, to: 3, loop: true },
            runLeft: { from: 6, to: 8, loop: true },
            crouchedRight: { from: 1, to: 1, loop: false },
            crouchedLeft: { from: 6, to: 6, loop: true },
        },
    },
})

loadSprite("groundSprite", "sprites/ground.png")
loadSprite("exitDoor", "sprites/exit_door_sprite.png")

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

function makegroundBottom() {
    let maxSprites = (largura / 50).toFixed(0)
    for (let i = 0; i < maxSprites; i++) {
        groundBottom += "-"
    }
}

makegroundBottom()

let groundWall = "- "

function makegroundWall() {
    let maxSprites = (largura / 50).toFixed(0)
    for (let i = 0; i < maxSprites; i++) {
        groundWall += " "
    }
    groundWall += "-"
}

makegroundWall()

function makeLevelHight() {

}

const arr = [
    `-                                                                                                                  `,
    `-                                                                                                                  `,
    `-                                                                                                                  `,
    `-                                                                                                                  `,
    `-                                                                                                                  `,
    `-                                                                                                                  `,
    `-                                                                                                                  `,
    `                                                                                                                   `,
    `                                                                                                                   `,
    `-                                                                                                                  `,
    `-                                                                                                                             #`,
    `-                                                                                                                  `,
    `${groundBottom}    ++++             --------------------------*                ---------------|  -------------------`,
]

/*ON GAME ------------------------------------------------------------ */
scene("game", () => {

    addLevel(arr, {
        // define the size of each block
        width: 50,
        height: 50,
        // define what each symbol means, by a function returning a component list (what will be passed to add())
        "-": () => [
            sprite("groundSprite", { frame: 0 }),
            area(),
            solid(),
            z(1000),
            "ground"
        ],
        "+": () => [
            sprite("groundSprite", { frame: 0 }),
            area(),
            solid(),
            z(1000),
            opacity(0),
            "ground"
        ],
        "*": () => [
            rect(400, 400),
            color(30, 144, 255),
            outline(4),
            pos(0, -150)
        ],
        "|": () => [
            rect(40, 1000),
            area(),
            solid(),
            color(30, 144, 255),
            outline(4),
            pos(0, -950)
        ],
        "#": () => [
            sprite("exitDoor"),
            z(1000),
            "exitDoor"
        ]
    })

    const pauseElement = add([
        text("paused"),
        pos(center()),
        origin("center"),
        opacity(0),
        z(1002),
        fixed()
    ])
    const pauseBackground = add([
        rect(width(), height()),
        pos(center()),
        origin("center"),
        opacity(0),
        z(1001),
        fixed(),
        color(255,255,255)
    ])

    /*Configurações do personagem */
    gravity(2400);

    const bugRock = add([
        sprite("bugRock", {
            animSpeed: 2
        }),
        pos(150, 55),
        area(),
        body(),
        z(1000),
        "player"
    ])

    bugRock.play(charcaterDetails.idle)

    const moveForce = 1200
    const jumpForce = 800


    // .jump() when "space" key is pressed
    onKeyPress("up", () => {
        if (bugRock.isGrounded() && !k.debug.paused) {
            bugRock.jump(jumpForce);
            bugRock.play(charcaterDetails.jump)
        }
    })

    onKeyPress("down", () => {
        if (bugRock.isGrounded() && !k.debug.paused) {
            bugRock.play(charcaterDetails.crouched)
        }
    })


    onKeyDown("left", () => {
        if (!k.debug.paused) bugRock.move(-moveForce, 0)
    })

    onKeyDown("right", () => {
        if (!k.debug.paused) bugRock.move(moveForce, 0)
    })

    onKeyRelease(["up", "right", "left", "down"], () => {
        if(isKeyPressed("right") || isKeyDown("right")){
            bugRock.play("runRight")
        }else if(isKeyPressed("left") || isKeyDown("left")){
            bugRock.play("runLeft")
        }else{
            bugRock.play(charcaterDetails.idle)
        }
    })

    onKeyPress("left", () => {
        if (!k.debug.paused) {
            charcaterDetails.idle = "idleLeft"
            charcaterDetails.jump = "jumpLeft"
            charcaterDetails.crouched = "crouchedLeft"
            bugRock.play("runLeft")
        }
    })

    onKeyPress("right", () => {
        if (!k.debug.paused) {
            charcaterDetails.idle = "idleRight"
            charcaterDetails.jump = "jumpRight"
            charcaterDetails.crouched = "crouchedRight"
            bugRock.play("runRight")
        }
    })

    bugRock.action(() => {
        bugRock.pushOutAll()
    })


    let score = 60;
    const scoreLabel = add([
        text(score),
        pos(150, 24),
        area(),
        fixed(),
        "scoreTag"
    ])

    let levelInfo = add([
        text("Level 1", {
            size: width() * 0.03
        }),
        pos(center().x, 70),
        origin("center"),
        z(1000),
        area(),
        color(255, 255, 255),
        fixed(),
        "resume",
    ])

    onUpdate(() => {

        if (bugRock.pos.x < 0) {
            bugRock.pos.x = 7000
            return;
        }

        if (bugRock.pos.x < center().x + 60) {
            camPos(center().x + 60, center().y)
            return;
        }
        camPos(bugRock.pos.x, center().y)
    })

    /* ENYME 1 --------------------------------------------------- */


    /*SCORE --------------------------------------------------- */

    const scoreCount = () => {
        score--
        scoreLabel.text = score
        if (score == 10) {
            go("lose")
        }
    }


    /*Start scoore */
    loop(1, () => {

        if(bugRock.isGrounded() || score < 60) scoreCount()

        if (!isFullscreen() && score < 60) {
            k.debug.paused = true
            pauseElement.opacity = 1
            pauseBackground.opacity = 1
        }

        if (isFullscreen() && pauseElement.opacity == 1) {
            pauseElement.opacity = 0
            pauseBackground.opacity = 0
        }

        if (bugRock.pos.x < 6320 && bugRock.pos.x > 6000) {
            go("win")
        }

        if (bugRock.pos.y > height()) {
            go("lose")
            return;
        }
    })

})

scene("win", () => {

    add([
        text("Voce ganhou o jogo!", {
            size: width() * 0.04
        }),
        pos(center()),
        origin("center")
    ])


    add([
        text("Obrigado por salvar o bugRock", {
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
        fixed()
    ])

    add([
        text("Click here to restart the game", {
            size: "32"
        }),
        pos(center().x, center().y + 60),
        origin("center"),
        fixed()
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
    if(e.key == "Enter" || e.key == " ") handleStart(e)
})