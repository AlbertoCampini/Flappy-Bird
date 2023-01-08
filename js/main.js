const pipe_bottom = document.getElementById("pipe-bottom")
const pipe_top = document.getElementById("pipe-top")
const bird = document.getElementById("bird")
const bg = document.getElementById("bg")
const base = document.getElementById("base")
let flag_fly = false
let count = 10
let gravity = 0.5
let score = 0

let velocity = 2

createNewPipe()

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}


function createNewPipe(){
    let pipe_top = document.createElement("div")
    pipe_top.classList.add("pipe-top","obs")
    pipe_top.setAttribute("style","height:"+parseInt(getRandomArbitrary(20,60))+"%");
    let pipe_bottom = document.createElement("div")
    pipe_bottom.classList.add("pipe-bottom","obs")
    pipe_bottom.setAttribute("style","top:"+ ( 20 + parseInt(pipe_top.style.height.replace("%","")))+"%; height:"+ (80 - parseInt(pipe_top.style.height.replace("%","")))+"%");
    bg.append(pipe_top)
    bg.append(pipe_bottom)
}

function movePipe(){
    document.querySelectorAll('.obs').forEach( (pipe)=>{
        pipe.style.left = parseInt(window.getComputedStyle(pipe).getPropertyValue("left")) - velocity+"px"
    })
}

function elementsOverlap(el1, el2) {
    const domRect1 = el1.getBoundingClientRect();
    const domRect2 = el2.getBoundingClientRect();

    return !(
        domRect1.top > domRect2.bottom ||
        domRect1.right < domRect2.left ||
        domRect1.bottom < domRect2.top ||
        domRect1.left > domRect2.right
    );
}

function checkCollision(){
    let res = false
    document.querySelectorAll('.obs').forEach( (pipe)=>{
        if (!res){
            res = elementsOverlap(pipe,bird)

        }
    })
    if (!res){
        res = elementsOverlap(base,bird)
    }
    return res
}

function calcScore(){
    document.getElementById("score").innerHTML = score
}



function removePipe(){
    document.querySelectorAll('.obs').forEach( (pipe)=>{
        if(parseInt(pipe.style.left.replace("px","")) < -100){
            pipe.remove();
            score = score + 0.5
        }
    })
}

setInterval( ()=>{
    movePipe()
    removePipe()
    if (checkCollision())
        window.location.reload()
    calcScore()

},10)

setInterval(()=>{
    createNewPipe()
}, 2000)

setInterval(() => {
    let pipe_top_top = parseInt(window.getComputedStyle(pipe_top).getPropertyValue("bottom"));
    let pipe_left = parseInt(window.getComputedStyle(pipe_top).getPropertyValue("left"));
    let pipe_bottom_top = parseInt(window.getComputedStyle(pipe_bottom).getPropertyValue("top"));
    let pipe_right = parseInt(window.getComputedStyle(pipe_bottom).getPropertyValue("right"));

    let x = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
    let x_left = parseInt(window.getComputedStyle(bird).getPropertyValue("left"));
    let x_right = parseInt(window.getComputedStyle(bird).getPropertyValue("right"));

    if(x_left >= pipe_left && x_right <=pipe_right && (x <= pipe_top_top || x >= pipe_bottom_top)){
        console.log(x, pipe_top_top, pipe_bottom_top)
        gravity = 20
        window.location.reload();
    }


    if(!flag_fly){
        bird.style.top=(x + gravity)+"px";
        if(gravity < 3) {
            gravity += 0.2 * gravity
        }
        if(gravity > 2){
            bird.classList.remove("bird_jump")
            bird.classList.add("bird_fall")
        }
        count = 10
    }else{
        bird.style.top = (x - count) + "px";
        count --
        if (count === 0)
            flag_fly = false
    }

}, 10);

function jump(){
    count = 10
    gravity = 0.1
    bird.classList.remove("bird_fall")
    bird.classList.add("bird_jump")
    flag_fly = true
}

document.addEventListener('click', event =>{
        jump();
})