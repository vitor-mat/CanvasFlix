const data = [{
    id: "0",
    title: "lava-ground",
    card: "./imagens/cards/lava_ground.gif",
    capa: "./imagens/capas/lava-ground.jpg",
    resume: "Salte pela plataformas e sobreviva a esta jornada ardente.",
    play: true,
    link: "https://vitor-mat.github.io/CanvasFlix/jogos/lava-ground/"
},{
    id: "1",
    title: "Dino's Survival",
    card: "./imagens/cards/dino.gif",
    capa: "./imagens/capas/dino.gif",
    resume: "Salve o nosso dino da extinção",
    play: true,
    link: "https://vitor-mat.github.io/CanvasFlix/jogos/dino"
},{
    id: "2",
    title: "Bug Game",
    card: "./imagens/cards/bug_game.gif",
    capa: "./imagens/capas/bug_game.gif",
    resume: "Qro ver voc enca r ess......",
    play: true,
    link: "https://vitor-mat.github.io/CanvasFlix/jogos/bug-game"
},{
    id: "3",
    title: "Astro",
    card: "./imagens/cards/astro.gif",
    capa: "./imagens/capas/em_breve.gif",
    resume: "",
    play: false,
    link: "#"
},{
    id: "4",
    title: "Gravity",
    card: "./imagens/cards/gravity.gif",
    capa: "./imagens/capas/em_breve.gif",
    resume: "",
    play: false,
    link: "#"
},{
    id: "5",
    title: "Little fox",
    card: "./imagens/cards/little-fox.gif",
    capa: "./imagens/capas/em_breve.gif",
    resume: "",
    pay: false,
    link: "#"
},{
    id: "6",
    title: "Messengers",
    card: "./imagens/cards/messengers.gif",
    capa: "./imagens/capas/em_breve.gif",
    resume: "",
    play: false,
    link: "#"
},{
    id: "7",
    title: "Room",
    card: "./imagens/cards/room.gif",
    capa: "./imagens/capas/em_breve.gif",
    resume: "",
    play: false,
    link: "#"
},{
    id: "8",
    title: "Slime",
    card: "./imagens/cards/slime.gif",
    capa: "./imagens/capas/em_breve.gif",
    resume: "",
    play: false,
    link: "#"
},{
    id: "9",
    title: "Tower city",
    card: "./imagens/cards/tower_city.gif",
    capa: "./imagens/capas/em_breve.gif",
    resume: "",
    play: false,
    link: "#"
}]

function gerandoDivs(){

    const carouselGamesContainer = document.querySelector(".carousel-games-container")

    data.map(value => {

            const divItem = document.createElement("div")
            divItem.setAttribute("class", "item")

            const linkCap = document.createElement("a")
            linkCap.href = "#game-capa-highlight"

            const imgCard = document.createElement("img")
            imgCard.src = value.card
            imgCard.alt = value.id
            imgCard.setAttribute("class", "card-image-game")
            imgCard.id = 'element-'+value.id        

            linkCap.appendChild(imgCard)


            divItem.appendChild(linkCap)

        
            carouselGamesContainer.appendChild(divItem)
        
    })
}

gerandoDivs()

document.addEventListener("click", async (e) => {

    const capaElement = await document.querySelector("#capa-element")
    const resumeCapaTxt = await document.querySelector("#resume-capa-txt")
    const titleCapaTxt = await document.querySelector("#title-capa-txt")
    const btnPlay = await document.querySelector("#btn-play")
    const btnPlayLinkContainer = await document.querySelector("#btn-play-link-container")

    if(Number(e.target.alt) >= 0){
        capaElement.src = await data[Number(e.target.alt)].capa
        resumeCapaTxt.textContent = await data[Number(e.target.alt)].resume
        titleCapaTxt.textContent = await data[Number(e.target.alt)].title
        btnPlay.style = `opacity: ${data[Number(e.target.alt)].play ? '1' : '0'}`
        btnPlayLinkContainer.href = await data[Number(e.target.alt)].link
    }

})

