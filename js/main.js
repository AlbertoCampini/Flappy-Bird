const menu = document.getElementById("menu")
const play = document.getElementById("resume")
const bird = document.getElementById("bird")
const bg = document.getElementById("bg")
const base = document.getElementById("base")

let flag_fly = false
let count = 10
let gravity = 0.5
let score = 0
let lose
let end_game = false

let velocity = 2

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

createNewPipe()

let game = setInterval( ()=>{
    fly()
    movePipe()
    removePipe()
    if (checkCollision()){
        clearInterval(game);
        clearInterval(new_pipe);
        bird.classList.add("bird_fall")
        base.classList.add("paused")
        end_game = true
        lose = setInterval(loseAnimation,10)
        setTimeout(manageMenu,1500)
    }
    calcScore()

},10)

let new_pipe = setInterval(()=>{
    createNewPipe()
}, 2000)

function manageMenu(){
    menu.classList.remove("d-none")
    document.getElementById("score").innerHTML = ""
    document.getElementById("menu_score").innerHTML = score
    clearInterval(lose);

}

function createNewPipe(){
    let pipe_top = document.createElement("div")
    pipe_top.classList.add("pipe-top","obs")
    pipe_top.setAttribute("style","height:"+parseInt(getRandomArbitrary(20,60))+"%");
    let pipe_bottom = document.createElement("div")
    pipe_bottom.classList.add("pipe-bottom","obs")
    pipe_bottom.setAttribute("style","top:"+ ( 25 + parseInt(pipe_top.style.height.replace("%","")))+"%; height:"+ (75 - parseInt(pipe_top.style.height.replace("%","")))+"%");
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
        domRect1.top > domRect2.bottom  - 10||
        domRect1.right < domRect2.left + 10 ||
        domRect1.bottom < domRect2.top  + 10||
        domRect1.left > domRect2.right - 10
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





function loseAnimation(){
        let position = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
            bird.style.top = (position + 5)+"px";


}

function fly(){
    let position = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
    if(!flag_fly){
        bird.style.top= (position + gravity)+"px";
        if(gravity < 3) {
            gravity += 0.2 * gravity
        }
        if(gravity > 2){
            bird.classList.remove("bird_jump")
            bird.classList.add("bird_fall")
        }
        count = 10
    }else{
        bird.style.top = (position - count) + "px";
        count --
        if (count === 0)
            flag_fly = false
    }
}


function jump(){
    count = 10
    gravity = 0.1
    bird.classList.remove("bird_fall")
    bird.classList.add("bird_jump")
    flag_fly = true
}

document.addEventListener('click', () =>{
    if(!end_game)
        jump();
})
play.addEventListener('click', () =>{
    window.location.reload()
})