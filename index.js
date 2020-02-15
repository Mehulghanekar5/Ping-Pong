var ball = document.querySelector('.ball ');
var startSpeed = 2;
var topValue = 20;
var topOperation = "+";
var leftValue = 100;
var leftOperation = "+";
var id;

function startGame() {
    id = setInterval(() => {
        ball.style.top = topValue + "px";
        ball.style.left = leftValue + "px";
        topValue = eval(topValue + topOperation + startSpeed)
        leftValue = eval(leftValue + leftOperation + startSpeed)
        if (topValue > 656) {
            topOperation = "-"
        } else if (topValue < 24) {
            topOperation = "+"
        }
        if (leftValue > 880) {
            leftOperation = "-"
        } else if (leftValue < 0) {
            leftOperation = "+"
        }
    }, 5);
}

function moveLeft() {
    var topRod = document.querySelector('.rod');
    console.log('moving left');
}

function moveRight() {
    console.log('moving right');
}


var gameBox = document.querySelector('.gameBox');
document.addEventListener('keypress', function (e) {
    if (e.code == "Space") {
        console.log(id)
        if(id != null){
            clearInterval(id);
            id = null;
        }else{
            startGame();
        }
    }
    
    if (e.code == "KeyA") {
        moveLeft();
    }
    
    if (e.code == "KeyD") {
        moveRight();
    }
})

