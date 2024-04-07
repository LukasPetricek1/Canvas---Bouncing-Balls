const BODY = document.body
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const topNavigation = document.querySelector("nav")
const scoreBoard = document.querySelector(".score-board")
const countDownBoard = document.querySelector(".countdown")
const screenshotButton = document.querySelector("button")

function init({ radius, speed, ammount, limit}){

let total_time = limit

let circles = [];
let animation;
let body = 0
let play = true

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

class Circle {
  constructor(x, y, radius, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = (Math.random() - 0.5) * speed * 10;
    this.dy = (Math.random() - 0.5) * speed * 10;
    this.color = randomColor(255);
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  move() {
    if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
      this.color = randomColor(255);
      this.dx *= -1;
    } else if (this.x + this.radius > canvas.width) {
      this.x = this.radius * 2;
    }
    if (this.y + this.radius >= canvas.height || this.y - this.radius <= 0) {
      this.color = randomColor(255);
      this.dy *= -1;
    }
    this.draw();
    this.x += this.dx;
    this.y += this.dy;
  }
}

function getDate() {
  const date = new Date();
  const object = {
    year: date.getFullYear(),
    day: date.getDate(),
    month: date.getMonth() + 1,
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
  };
  return `${object.day}.${object.month}.${object.year}; ${object.hour}:${object.minute}:${object.second}`;
}


function end(){
    localStorage.removeItem("user-preference") 
    BODY.removeChild(canvas);
    BODY.removeChild(topNavigation)
    let current_results = JSON.parse(localStorage.getItem("results"))
    if(!current_results){ 
        current_results = []
    }
    const results = { 
        id: current_results.length + 1,
        amount : ammount,
        time : total_time - limit,
        limit: total_time,
        destroyed : total.body,
        percentage : total.procenta,
        date : getDate()
    }
    current_results.push(results)
    localStorage.setItem("results" , JSON.stringify(current_results))
    location.pathname = "/result.html"
}

const goBack = document.getElementById("goBack");
goBack.addEventListener("click" , () => {
    localStorage.clear()
    location.pathname = "/"
})



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

            circles = []

            clearInterval(x)
            window.cancelAnimationFrame(animation)
            end()
        }
    }, 1000)

    create_circles(ammount);
    animation = window.requestAnimationFrame(loop)

function createImage(){ 
    const dataURL = canvas.toDataURL("png");
    const image = new Image();
    image.src = dataURL;
    return image
}

let shotImage;
function  screenShot(){ 
    let shot = document.querySelector(".shot-background");
    if (shot) {
      BODY.removeChild(shot);
    }

    let image = createImage()

    play = false
    image.onload = function(){ 
        const shotBackground = document.createElement("section");
        shotBackground.setAttribute("class", "shot-background");

        const shotDialog = document.createElement("section");
        shotDialog.setAttribute("class", "shot-dialog");

        function shotExitFunc(){ 
            play = true
            BODY.removeChild(shotBackground)
        }

        function download(){ 
            play = true
            const link = document.createElement("a")
            link.href = image.src
            link.download = "bouncingBalls.png"
            link.click()
            shotExitFunc()
        }

        const shotReload = document.createElement("section")
        shotReload.setAttribute("class" , "shot-reload")
        const reload = document.createElement("i");
        reload.setAttribute("class", "fa-solid fa-rotate-right");
        reload.addEventListener("click" , () => { 
            image = createImage()
            shotImage.style.backgroundImage = `url(${image.src})`;
        })
        shotReload.appendChild(reload)

        shotImage = document.createElement("section");
        shotImage.setAttribute("class", "shot-image");
        shotImage.style.backgroundImage = `url(${image.src})`

        const shotBottomMenu = document.createElement("section");
        shotBottomMenu.setAttribute("class", "shot-bottom-menu");

        const shotDownload = document.createElement("div");

        const downloadIcon = document.createElement("i");
        downloadIcon.setAttribute("class", "fa-solid fa-download");
        const downloadText = document.createElement("h1");
        downloadText.innerText = "Download"

        shotDownload.appendChild(downloadIcon)
        shotDownload.appendChild(downloadText)

        shotDownload.addEventListener("click" , download)

        const shotExit = document.createElement("i");
        shotExit.setAttribute("class", "fa-solid fa-trash");
        shotExit.addEventListener("click", shotExitFunc)

        shotBottomMenu.appendChild(shotDownload);
        shotBottomMenu.appendChild(shotExit)

        BODY.appendChild(shotBackground);
        shotBackground.appendChild(shotDialog);

        shotDialog.appendChild(shotReload)
        shotDialog.appendChild(shotImage);
        shotDialog.appendChild(shotBottomMenu);
    }
}

screenshotButton.addEventListener("click" , screenShot)

window.onresize = function(){ 

    canvas.width = this.innerWidth
    canvas.height = this.innerHeight


    if(limit > 0){
        create_circles(ammount - body)
    }

}

let drawAble = false
let start
let object = { 
    startX : 0, 
    startY : 0, 
    x : 0,
    y : 0
}

window.onmousedown = function(e){ 
    if(play){
        object.startX = e.clientX
        object.startY = e.clientY

        drawAble = true
        ctx.strokeStyle = "white"
        ctx.lineWidth = 5
        ctx.lineJoin = "round"
        ctx.lineCap = "round"
    }
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

function create_circles(count){
    circles = []
    for(let i = 1; i <= count ; i ++){
        const x = Math.floor(Math.random() * (window.innerWidth - radius * 2)) + radius,
            y = Math.floor(Math.random() * (window.innerHeight - radius * 2)) + radius
        // x,y,radius,speed
        const circle = new Circle(x, y , radius,Number(speed))
        circles.push(circle)
    }
}

function loop(time) {

    ctx.fillStyle = "rgba(0,0,0,0.25)"
    ctx.fillRect(0,0,canvas.width, canvas.height)

    for (let i = 0; i < circles.length; i++) {
        circles[i].move();
    }
        animation = window.requestAnimationFrame(loop);
}
}

document.addEventListener("DOMContentLoaded", () => {
    let user_preference = JSON.parse(localStorage.getItem("user-preference"));
    
    for(let item in user_preference){ 
        user_preference[item] = Number(user_preference[item])
    }

    if(user_preference){
        init(user_preference)
    }else{ 
        location.pathname = "/"
    }
});