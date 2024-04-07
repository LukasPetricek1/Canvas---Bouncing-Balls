const table = document.querySelector("table")
const newGameButton = document.querySelector(".new-game")

function init(){ 
    let user_results = JSON.parse(localStorage.getItem("results"))
    if(!user_results){ 
        location.pathname = "/"
    }else{
      
      for(let index = 0; index < user_results.length; index ++){ 
        const tr = document.createElement("tr")
            const NO = document.createElement("td")
            NO.innerText = `#${index + 1}`

            const Limit = document.createElement("td")
            Limit.innerText = `${user_results[index].limit} s`

            const Time = document.createElement("td")
            Time.innerText = `${user_results[index].time} s`

            const Amount = document.createElement("td")
            Amount.innerText = user_results[index].amount

            const Destroyed = document.createElement("td")
            Destroyed.innerText = user_results[index].destroyed

            const Percentage = document.createElement("td")
            Percentage.innerText = `${user_results[index].percentage} %`

            const Date = document.createElement("td")
            Date.innerText = user_results[index].date

            const Remove = document.createElement("td")
            const RemoveIcon = document.createElement("i")
            RemoveIcon.style.opacity = "0"
            RemoveIcon.setAttribute("class", "fa-solid fa-xmark");
            Remove.appendChild(RemoveIcon)

            tr.onmouseenter = function(){ 
                this.style.color = "red"
                RemoveIcon.style.opacity = "1"
            }

            tr.onmouseleave = function () {
              this.style.color = "white";
              RemoveIcon.style.opacity = "0";
            };

            tr.onclick = function(){ 
                table.removeChild(this)
                user_results = user_results.filter(a => a.id !== user_results[index].id)
                localStorage.setItem("results" , JSON.stringify(user_results))
            }


            tr.appendChild(NO)
            tr.appendChild(Limit)
            tr.appendChild(Time)
            tr.appendChild(Amount)
            tr.appendChild(Destroyed)
            tr.appendChild(Percentage)
            tr.appendChild(Date)
            tr.appendChild(Remove)
        table.appendChild(tr)
      }
    }

    newGameButton.addEventListener("click" , () => {
        location.pathname = "/"
    })
}

document.addEventListener("DOMContentLoaded" , init)