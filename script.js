const data = [{
    id: "0",
    title: "lava-ground",
    card: "./imagens/cards/lava_ground.gif",
    capa: "./imagens/capas/lava-ground.jpg",
},{
    id: "1",
    title: "Dino's Survival",
    card: "./imagens/cards/dino.gif",
    capa: "./imagens/capas/dino.gif"
},{
    id: "2",
    title: "Bug Game",
    card: "./imagens/cards/bug_game.gif",
    capa: "./imagens/capas/bug_game.gif"
},{
    id: "3",
    title: "Astro",
    card: "./imagens/cards/astro.gif",
    capa: "./imagens/capas/em_breve.gif"
},{
    id: "4",
    title: "Gravity",
    card: "./imagens/cards/gravity.gif",
    capa: "./imagens/capas/em_breve.gif"
},{
    id: "5",
    title: "Little fox",
    card: "./imagens/cards/little-fox.gif",
    capa: "./imagens/capas/em_breve.gif"
},{
    id: "6",
    title: "Messengers",
    card: "./imagens/cards/messengers.gif",
    capa: "./imagens/capas/em_breve.gif"
},{
    id: "7",
    title: "Room",
    card: "./imagens/cards/room.gif",
    capa: "./imagens/capas/em_breve.gif"
},{
    id: "8",
    title: "Slime",
    card: "./imagens/cards/slime.gif",
    capa: "./imagens/capas/em_breve.gif"
},{
    id: "9",
    title: "Tower city",
    card: "./imagens/cards/tower_city.gif",
    capa: "./imagens/capas/em_breve.gif"
}]

function gerandoDivs(){

    const carouselGamesContainer = document.querySelector(".carousel-games-container")

    data.map(value => {
            const divItem = document.createElement("div")
            divItem.setAttribute("class", "item")
        
            const imgCard = document.createElement("img")
            imgCard.src = value.card
            imgCard.setAttribute("class", "card-image-game")
        
            divItem.appendChild(imgCard)
        
            carouselGamesContainer.appendChild(divItem)
        
    })
}

gerandoDivs()