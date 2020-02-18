//Elements
var gameBox = document.getElementsByClassName('gameBox')[0];
var rods = document.getElementsByClassName('rod');
var ball = document.getElementsByClassName('ball')[0];
var pause = document.getElementsByClassName('pause')[0];

//Variables
var gameBoxWidth = gameBox.clientWidth;
var gameBoxHeight = gameBox.clientHeight;

var rodWidth = rods[0].clientWidth;
var rodHeight = rods[0].clientHeight;

var ballWidth = ball.clientWidth;
var ballHeight = ball.clientHeight;
var ballTop = 20;
var topOperation = "+";
var ballLeft = 100;
var leftOperation = "+";

var rodMovingSpeed = 20;
var ballMovingSpeed = 0.5;
var gameState = "pause";
var gameID = null;
var out = false;

function startGame() {
    gameID = setInterval(() => {
        ball.style.top = ballTop + "px";
        ball.style.left = ballLeft + "px";
        ballMovingSpeed = ballMovingSpeed + 0.0000625;
        ballTop = eval(ballTop + topOperation + ballMovingSpeed);
        ballLeft = eval(ballLeft + leftOperation + ballMovingSpeed);

        if (ballTop >= (gameBoxHeight - rodHeight - ballHeight)) {
            var ballPos = (ballLeft + (3 * ballWidth / 4));
            if(ballPos > rods[0].offsetLeft && (ballLeft + (ballWidth / 4)) < rods[0].offsetLeft + rodWidth){
                topOperation = "-";
            }else{
                gameOver();
            }
        } else if (ballTop <= rodHeight) {
            var ballPos = (ballLeft + (3 * ballWidth / 4));
            if(ballPos > rods[0].offsetLeft && (ballLeft + (ballWidth / 4)) < rods[0].offsetLeft + rodWidth){
                topOperation = "+";
            }else{
                gameOver();
            }
        }
        if (ballLeft >= (gameBoxWidth - ballWidth)) {
            leftOperation = "-";
        } else if (ballLeft <= 0) {
            leftOperation = "+";
        }
    }, 5);
}

function gameOver() {
    clearInterval(gameID);
    out = true;
    gameState = "pause";
    ballTop = eval(ballTop + topOperation + 5);
    ballLeft = eval(ballLeft + leftOperation + 5);

    ball.style.top = ballTop + "px";
    ball.style.left = ballLeft + "px";
    ball.style.background = "#a90200";
    setTimeout(() =>{
        setupNewGame();
    }, 10000)
}

function setupNewGame() {
    //game Initial Value
    rodMovingSpeed = 20;
    ballMovingSpeed = 0.5;
    gameState = "pause";
    gameID = null;
    out = false;

    //rod Initial Value
    var rodStartingPosition = Math.floor(Math.random() * (gameBoxWidth - rodWidth));
    rods[0].style.left = rodStartingPosition + "px";
    rods[1].style.left = rodStartingPosition + "px";

    //ball Initial Value
    var ballStartingPositionTop = gameBoxHeight - rodHeight - ballHeight;
    var ballStartingPositionLeft = rodStartingPosition + (rodWidth / 2) - (ballWidth / 2);
    ball.style.top = ballStartingPositionTop + "px";
    ball.style.left = ballStartingPositionLeft + "px";
    ballTop = ballStartingPositionTop;
    topOperation = "-";
    ballLeft = ballStartingPositionLeft;
    leftOperation = "+";
    ball.style.background = "var(--ballColor)";
}

setupNewGame();

function moveLeft() {
    var leftDistance = rods[0].offsetLeft;
    if (leftDistance == 0) {
        return;
    }
    var value;
    if ((leftDistance - rodMovingSpeed) <= 0) {
        value = 0;
    } else {
        value = leftDistance - rodMovingSpeed;
    }
    rods[0].style.left = value + "px";
    rods[1].style.left = value + "px";
}

function moveRight() {
    var leftDistance = rods[0].offsetLeft;
    if (leftDistance + rodWidth == gameBoxWidth) {
        return;
    }
    var value;
    if ((leftDistance + rodWidth + rodMovingSpeed) >= gameBoxWidth) {
        value = gameBoxWidth - rodWidth;
    } else {
        value = leftDistance + rodMovingSpeed;
    }
    rods[0].style.left = value + "px";
    rods[1].style.left = value + "px";
}

document.addEventListener('keypress', function (e) {
    if (e.code == "Space" && !out) {
        if (gameID != null) {
            clearInterval(gameID);
            gameID = null;
            gameState = "pause";
            pause.style.display = "block";
        } else {
            gameState = "running";
            pause.style.display = "none";
            startGame();
        }
    }
    if (gameState == "running") {
        if (e.code == "KeyA") {
            moveLeft();
            return;
        }
        if (e.code == "KeyD") {
            moveRight();
            return;
        }
    }
})

