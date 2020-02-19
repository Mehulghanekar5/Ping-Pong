//Elements
var gameBox = document.getElementsByClassName('gameBox')[0];
var rods = document.getElementsByClassName('rod');
var ball = document.getElementsByClassName('ball')[0];
var pause = document.getElementsByClassName('pause')[0];
var message = document.getElementsByClassName('message')[0];
var playerNameH1 = document.querySelector('.detailsBox .playerName h1');
var scoreboardRound = document.querySelector('.detailsBox .scoreboard .eachGameScoreboard h2');
var eachGameScoreboardP = document.querySelector('.detailsBox .scoreboard .eachGameScoreboard p');
var fullScoreboardBody = document.querySelector('.detailsBox .scoreboard .fullScoreboard tbody');
var controlBtn = document.querySelectorAll('.detailsBox .controlBtn button');

var eachGameScoreboard = document.querySelector('.detailsBox .scoreboard .eachGameScoreboard');
var fullScoreboard = document.querySelector('.detailsBox .scoreboard .fullScoreboard');

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
var gameState = "";
var gameID = null;
var roundID = null;
var messageIntervalID = null;
var out = false;
var scores = [];
var roundScore = 0;
var scoreSpeed = 5;
var playerName = "";

function startGame() {
    gameID = setInterval(() => {
        ball.style.top = ballTop + "px";
        ball.style.left = ballLeft + "px";
        ballMovingSpeed = ballMovingSpeed + 0.0000625;
        ballTop = eval(ballTop + topOperation + ballMovingSpeed);
        ballLeft = eval(ballLeft + leftOperation + ballMovingSpeed);

        if (ballTop >= (gameBoxHeight - rodHeight - ballHeight)) {
            var ballPos = (ballLeft + (3 * ballWidth / 4));
            if (ballPos >= rods[0].offsetLeft && (ballLeft + (ballWidth / 4)) <= rods[0].offsetLeft + rodWidth) {
                topOperation = "-";
                scoreSpeed = getScoreSpeed(ballMovingSpeed);
                roundScore += scoreSpeed;
                eachGameScoreboardP.innerHTML = roundScore;
            } else {
                gameOver();
            }
        } else if (ballTop <= rodHeight) {
            var ballPos = (ballLeft + (3 * ballWidth / 4));
            if (ballPos >= rods[0].offsetLeft && (ballLeft + (ballWidth / 4)) <= rods[0].offsetLeft + rodWidth) {
                topOperation = "+";
                scoreSpeed = getScoreSpeed(ballMovingSpeed);
                roundScore += scoreSpeed;
                eachGameScoreboardP.innerHTML = roundScore;
            } else {
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

function resetFullScoreboard() {
    var fullScoreboardRows = document.querySelectorAll('.detailsBox .scoreboard .fullScoreboard tbody tr');
    for (var i = 0; i < fullScoreboardRows.length; i++) {
        fullScoreboardRows[i].remove();
    }
}

function updateFullScoreboard() {
    //create textNodes
    var text1 = document.createTextNode("Round " + scores.length);
    var text2 = document.createTextNode(scores[scores.length - 1]);

    //create tds & append text Nodes
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    td1.appendChild(text1);
    td2.appendChild(text2);

    //create tr & appends tds
    var tr = document.createElement("tr");
    tr.appendChild(td1);
    tr.appendChild(td2);

    //append Row to full Scoreboard
    fullScoreboardBody.appendChild(tr);
}

function calculateTotalScore() {
    var sum = 0;
    for (var i = 0; i < scores.length; i++) {
        sum += scores[i];
    }
    message.innerHTML = "Total Score : " + sum + ".</br>Play again to beat this score.";
    //create textNodes
    var text1 = document.createTextNode("Total");
    var text2 = document.createTextNode(sum);

    //create tds & append text Nodes
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    td1.appendChild(text1);
    td2.appendChild(text2);

    //create tr & appends tds
    var tr = document.createElement("tr");
    tr.appendChild(td1);
    tr.appendChild(td2);

    //append Row to full Scoreboard
    fullScoreboardBody.appendChild(tr);
}

function displayFullScoreboard() {
    fullScoreboard.style.display = "flex";
    eachGameScoreboard.style.display = "none";
}

function hideFullScoreboard() {
    fullScoreboard.style.display = "none";
    eachGameScoreboard.style.display = "flex";
}

function disableButtons() {
    controlBtn[0].disabled = true;
    controlBtn[1].disabled = true;
    controlBtn[0].style.cursor = "not-allowed";
    controlBtn[1].style.cursor = "not-allowed";
}

function enableButtons() {
    controlBtn[0].disabled = false;
    controlBtn[1].disabled = false;
    controlBtn[0].style.cursor = "pointer";
    controlBtn[1].style.cursor = "pointer";
}

function getScoreSpeed(ballMovingSpeed) {
    if (ballMovingSpeed < 1.0) {
        return 5;
    } else if (ballMovingSpeed >= 1.0 && ballMovingSpeed < 1.5) {
        rodMovingSpeed = 22;
        return 7;
    } else {
        rodMovingSpeed = 25;
        return 9;
    }
}

function gameOver() {
    clearInterval(gameID);
    out = true;
    gameState = "over";
    ballTop = eval(ballTop + topOperation + 5);

    ball.style.top = ballTop + "px";
    ball.style.left = ballLeft + "px";
    ball.style.background = "#a90200";

    scores[scores.length] = roundScore;
    updateFullScoreboard();
    enableButtons();
    if (scores.length == 5) {
        displayFullScoreboard();
        calculateTotalScore();
        return;
    }
    let i = 9;
    message.innerHTML = "Score : " + roundScore + ".</br>Next Round Starting in " + i + ".";
    i = i - 1;
    messageIntervalID = setInterval(() => {
        if (i == 0) {
            clearInterval(messageIntervalID);
        }
        message.innerHTML = "Score : " + roundScore + ".</br>Next Round Starting in " + i + ".";
        i = i - 1;
    }, 1000)

    roundID = setTimeout(() => {
        setupNewGame();
    }, 10000)

}

function setupNewGame() {
    clearTimeout(roundID);
    roundID = null;
    clearInterval(messageIntervalID);
    messageIntervalID = null;
    controlBtn[0].blur();
    controlBtn[1].blur();
    controlBtn[0].disabled = true;
    controlBtn[0].style.cursor = "not-allowed";
    controlBtn[0].innerHTML = (scores.length == 4) ? "New Game" : "Next Round";

    if (scores.length == 5) {
        scores = [];
        resetFullScoreboard();
    }

    if (scores.length == 0) {
        var playerName = prompt("Please Enter Your Name - ");
        if (playerName != "" && playerName != null) {
            playerNameH1.innerHTML = playerName;
        } else {
            playerNameH1.innerHTML = 'Player 1';
        }
    }
    //game Initial Value
    rodMovingSpeed = 20;
    ballMovingSpeed = 0.5;
    gameState = "new";
    gameID = null;
    out = false;
    roundScore = 0;
    scoreSpeed = 5;

    //rod Initial Value
    var rodStartingPosition = Math.floor(Math.random() * (gameBoxWidth - rodWidth));
    rods[0].style.left = rodStartingPosition + "px";
    rods[1].style.left = rodStartingPosition + "px";
    rods[0].style.transform = "none";
    rods[1].style.transform = "none";

    //ball Initial Value
    var ballStartingPositionTop = gameBoxHeight - rodHeight - ballHeight;
    var ballStartingPositionLeft = rodStartingPosition + (rodWidth / 2) - (ballWidth / 2);
    ball.style.top = ballStartingPositionTop + "px";
    ball.style.left = ballStartingPositionLeft + "px";
    ball.style.transform = "none";
    ballTop = ballStartingPositionTop;
    topOperation = "-";
    ballLeft = ballStartingPositionLeft;
    leftOperation = "+";
    ball.style.background = "var(--ballColor)";

    eachGameScoreboardP.innerHTML = roundScore;
    scoreboardRound.innerHTML = "Round " + (scores.length + 1);
    message.innerHTML = "Press SPACE to Start Round " + (scores.length + 1) + ".";
    displayFullScoreboard();
}

function resetGame() {
    disableButtons();
    clearInterval(gameID);
    clearTimeout(roundID);
    clearInterval(messageIntervalID);
    gameID = null;
    roundID = null;
    messageIntervalID = null;
    controlBtn[0].blur();
    controlBtn[1].blur();
    scores = [];
    resetFullScoreboard();
    gameState = "";
    out = false;
    roundScore = 0;
    scoreSpeed = 5;

    message.innerHTML = "Click on New Game to Start.";
    controlBtn[0].innerHTML = "New Game";

    pause.style.display = "none";

    rods[0].style.left = "50%";
    rods[1].style.left = "50%";
    rods[0].style.transform = "translate(-50%)";
    rods[1].style.transform = "translate(-50%)";

    ball.style.top = "50%";
    ball.style.left = "50%";
    ball.style.transform = "translate(-50%, -50%)";
    ball.style.background = "var(--ballColor)";

    eachGameScoreboardP.innerHTML = "";
    scoreboardRound.innerHTML = "";
    playerNameH1.innerHTML = "";
    enableButtons();
}

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
    if (e.code == "Space" && !out && gameState != "") {
        if (gameID != null) {
            hideFullScoreboard();
            clearInterval(gameID);
            gameID = null;
            gameState = "pause";
            message.innerHTML = "Press SPACE to continue."
            pause.style.display = "block";
            controlBtn[1].disabled = false;
            controlBtn[1].style.cursor = "pointer";
        } else {
            hideFullScoreboard();
            gameState = "running";
            message.innerHTML = "";
            pause.style.display = "none";
            controlBtn[1].disabled = true;
            controlBtn[1].style.cursor = "not-allowed";
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

