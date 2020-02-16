//Elements
var gameBox = document.getElementsByClassName('gameBox')[0];
var rods = document.getElementsByClassName('rod');
var ball = document.getElementsByClassName('ball')[0];

//Variables
var gameBoxWidth = gameBox.clientWidth;
var gameBoxHeight = gameBox.clientHeight;
var rodWidth = rods[0].clientWidth;
var rodHeight = rods[0].clientHeight;
var movingSpeed = 20;
var gameState = "running";
var gameID = null;

function moveLeft() {
    console.log(rods[0].offsetLeft);
    console.log(rods[1].offsetLeft);
    var leftDistance = rods[0].offsetLeft;
    if(leftDistance == 0){
        return;
    }
    var value;
    if((leftDistance - movingSpeed) <= 0){
        value = 0;
    }else{
        value = leftDistance - movingSpeed;
    }
    rods[0].style.left = value + "px";    
    rods[1].style.left = value + "px";      
}

function moveRight() {
    console.log(rods[0].offsetLeft);
    console.log(rods[1].offsetLeft);
    var leftDistance = rods[0].offsetLeft;
    if(leftDistance + rodWidth == gameBoxWidth){
        return;
    }
    var value;
    if((leftDistance + rodWidth + movingSpeed) >= gameBoxWidth){
        value = gameBoxWidth - rodWidth;
    }else{
        value = leftDistance + movingSpeed;
    }
    rods[0].style.left = value + "px";    
    rods[1].style.left = value + "px";      
}

document.addEventListener('keypress', function(e){
    if(gameState == "running"){
        if(e.code == "KeyA"){
            console.log("KeyA");
            moveLeft();
            return;
        }
        if(e.code == "KeyD"){
            console.log("KeyD");
            moveRight();
            return;
        }
    }
})


/* ball = document.querySelector('.ball ');
var rod = document.querySelectorAll('.rod');
var gameState = "pause";
var startSpeed = 0.5;
var topValue = 20;
var topOperation = "+";
var leftValue = 100;
var leftOperation = "+";
var id = null;

function startGame() {
    id = setInterval(() => {
        ball.style.top = topValue + "px";
        ball.style.left = leftValue + "px";
        topValue = eval(topValue + topOperation + startSpeed)
        leftValue = eval(leftValue + leftOperation + startSpeed)
        if (topValue >= 656) {
            topOperation = "-"
        } else if (topValue <= 24) {
            topOperation = "+"
        }
        if (leftValue >= 880) {
            leftOperation = "-"
        } else if (leftValue <= 0) {
            leftOperation = "+"
        }
    }, 5);
}

function moveLeft() {
    var value = rod[0].offsetLeft - 20;
    rod[0].style.left = value + "px";
    rod[1].style.left = value + "px";
    console.log('moving left');
}

function moveRight() {
    var value = rod[0].offsetLeft + 20;
    rod[0].style.left = value + "px";
    rod[1].style.left = value + "px";
    console.log('moving right');
}


var gameBox = document.querySelector('.gameBox');
document.addEventListener('keypress', function (e) {
    if (e.code == "Space") {
        if (id != null) {
            clearInterval(id);
            gameState = "pause";
            id = null;
        } else {
            gameState = "running";
            startGame();
        }
    }

    if (gameState == "running") {
        if (e.code == "KeyA") {
            moveLeft();
        }

        if (e.code == "KeyD") {
            moveRight();
        }
    }

}) */

