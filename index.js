const BODY = document.body
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

// Vytvoreni pole pro zobrazeni bodu
const scoreBoard = document.createElement("div")
scoreBoard.setAttribute("class" , "score-board")
BODY.appendChild(scoreBoard)

// Vytvoreni pole pro zobrazeni zbyvajiciho casu
const countDownBoard = document.createElement("div")
countDownBoard.setAttribute("class" , "countdown")
BODY.appendChild(countDownBoard)

const radius = 20
const speed = 3
let circles = [];
let animation;
let ammount = 10
let limit = 200;
let body = 0

const total = { 
    body : 0,
    procenta : 0
}

const wind = { 
    width : window.outerWidth,
    height : window.outerHeight
}

scoreBoard.innerText = body
countDownBoard.innerText = limit

/**
 * TODO:
 * Vytvořit finální scénu, jak bude vypadat stránka, až uživatel skončí.
 * Vytvoření vstupního dialogu, ve kterém si bude možné zvolit:
 * - radius
 * - rychlost
 * - barvu
 * - pozadí
 * - možnost stínu
 * - velikost canvasu, buď vlastní, nebo přes celou obrazovku
 * Umožnit zastavení animace skrz tlačítko a když myší najedu na danou kuliičku
 * Umožnit posouvat s kuličkama
 */

const canvas_data = { 
    final_image : "",
    url : ""
}

function end(){ 
    
}


function init(){ 
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth

    const x = setInterval(() => {
        limit -= 1
        countDownBoard.innerText = limit

        if(limit <= 0 || circles.length === 0){ 
            total.body = body
            total.procenta = ((body / ammount) * 100).toFixed(2)

            const dataURL = canvas.toDataURL("png")
            const backgroundImage = new Image()
            backgroundImage.src = dataURL
            backgroundImage.setAttribute("class" , "final-image")
            canvas_data.final_image = backgroundImage
            canvas_data.url = dataURL

            circles = []

            clearInterval(x)
            window.cancelAnimationFrame(animation)
            BODY.removeChild(canvas)
            end()
        }
    }, 1000)

    create_circles(ammount);
    animation = window.requestAnimationFrame(loop)
}

document.addEventListener("DOMContentLoaded" , init)

window.onresize = function(){ 

    canvas.width = this.innerWidth
    canvas.height = this.innerHeight


    if(limit > 0){
        create_circles(ammount - body)
    }

}

/*
    Drawing section
*/

let drawAble = false
let start
let object = { 
    startX : 0, 
    startY : 0, 
    x : 0,
    y : 0
}

window.onmousedown = function(e){ 
    object.startX = e.clientX
    object.startY = e.clientY

    drawAble = true
    ctx.strokeStyle = "white"
    ctx.lineWidth = 5
    ctx.lineJoin = "round"
    ctx.lineCap = "round"
}

window.onmousemove = function(e){ 
    object.x = e.clientX
    object.y = e.clientY

    let { startX , startY } = object
    if(drawAble){
        ctx.beginPath()
        ctx.moveTo(startX, startY);

        object.startX = object.x;
        object.startY = object.y;

        ctx.lineTo(object.x, object.y)
        ctx.stroke()
        ctx.closePath()

        circles.forEach((circle) => {
            if (
                Math.abs(object.x - circle.x) < radius &&
                Math.abs(object.y - circle.y) < radius
            ) {
                circles = circles.filter((a) => a != circle)
                body += 1
                scoreBoard.innerText = body
                drawAble = false
            }
        });
    }
}

window.onmouseup = function(e){ 
    drawAble = false
}

function randomColor(limit, alpha=1){ 
    const red = Math.floor(Math.random() * limit),
          green = Math.floor(Math.random() * limit),
          blue = Math.floor(Math.random() * limit)
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}


class Circle{ 
    constructor(x,y, radius, speed){
        this.x = x
        this.y = y
        this.radius = radius
        this.dx = (Math.random() - 0.5) * speed * 10
        this.dy = (Math.random() - 0.5) * speed * 10
        this.color = randomColor(255)
    }

    draw(){
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        ctx.fill()
        ctx.closePath()
    }

    move(){
        if(this.x + this.radius >= canvas.width || this.x - this.radius <= 0){
            this.color = randomColor(255);
            this.dx *= -1
        }else if(this.x + this.radius > canvas.width){
            this.x = this.radius * 2
        }
        if(this.y + this.radius >= canvas.height || this.y - this.radius <= 0){
            this.color = randomColor(255);
            this.dy *= -1
        }
        this.draw()
        this.x += this.dx;
        this.y += this.dy;
    }
}

//Vytvoření 100 stejných objektů, které se budou nezávisle na sobě náhodně pohybovat
function create_circles(count){
    circles = []
    for(let i = 1; i <= count ; i ++){
        const x = Math.floor(Math.random() * (window.innerWidth - radius * 2)) + radius
            y = Math.floor(Math.random() * (window.innerHeight - radius * 2)) + radius
        // x,y,radius,speed
        const circle = new Circle(x, y , radius,Number(speed))
        circles.push(circle)
    }
}

/**
 Starší verze pro zobrazení countdown.
 Byly s tím problémy, když jsem se to snažil vykreslit do canvasu a také to bylo daleko náročnější na výkon procesoru.
 */
// function showCountDown({ padding, time }){
//     ctx.fillStyle = "rgb(255,255,255)"
//     ctx.font = "30px Arial"
//     ctx.textAlign = "end"
//     ctx.textBaseline = "top"
//     ctx.fillText(`Countdown: ${time}`, canvas.width - padding, padding, 200)
// }

//x, y, radius, speed
// const circle1 = new Circle(50,30,10,Number(speed))

// ukazuje dobu, ktera uplynula od prvotniho spusteni animace


function loop(time) {
    //let countdown = Math.round(limit - (time) / 1000)
    // cover the previous frame's drawing before the next one is drawn
    ctx.fillStyle = "rgba(0,0,0,0.25)"
    ctx.fillRect(0,0,canvas.width, canvas.height)
    // run necessary func
    for (let i = 0; i < circles.length; i++) {
        circles[i].move();
    }

    /**
     * Volání zastaré funkce
     */
    // showCountDown({
    //   padding: 10,
    //   time: countdown,
    // });
    

    // lets calls loop func itself over and over again
    //  and make animation smooth
    // if (countdown <= 0) {
    //     window.cancelAnimationFrame(animation);
    //     console.log(body)
    //     console.log(`${((body / ammount) * 100).toFixed(2)} %`);
    // }else{
        animation = window.requestAnimationFrame(loop);
    //}
}

 // finaly call the loop func once ot start
