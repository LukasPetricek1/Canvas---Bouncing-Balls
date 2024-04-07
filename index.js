const form = document.querySelector("form")

function startGame(e){
    e.preventDefault()
    
    const radius = document.getElementById("ball-radius").value
    const speed = document.getElementById("speed").value
    const ballAmount = document.getElementById("ball-amount").value
    const timeLimit = document.getElementById("time-limit").value

    const object = {
        radius, 
        speed,
        ammount : ballAmount,
        limit : timeLimit
    }

    localStorage.setItem("user-preference" , JSON.stringify(object))
    location.pathname = "/game.html"
}

form.addEventListener("submit" , startGame)