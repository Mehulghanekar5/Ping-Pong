//HTML Elements of GameBox
var gameBox = document.getElementsByClassName('gameBox')[0];
var rods = document.getElementsByClassName('rod');
var ball = document.getElementsByClassName('ball')[0];
var pause = document.getElementsByClassName('pause')[0];
var message = document.getElementsByClassName('message')[0];
var tapSound = document.querySelector('.tapSound');
var outSound = document.querySelector('.outSound');

//HTML Elements of DetailsBox
var controlBtn = document.querySelectorAll('.detailsBox .controlBtn button');
var playerNameH1 = document.querySelector('.detailsBox .playerName h1');

var fullScoreboard = document.querySelector('.detailsBox .scoreboard .fullScoreboard');
var fullScoreboardBody = document.querySelector('.detailsBox .scoreboard .fullScoreboard tbody');

var eachGameScoreboard = document.querySelector('.detailsBox .scoreboard .eachGameScoreboard');
var scoreboardRound = document.querySelector('.detailsBox .scoreboard .eachGameScoreboard h2');
var eachGameScoreboardP = document.querySelector('.detailsBox .scoreboard .eachGameScoreboard p');

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
var scoreSpeed = 5;

var gameState = "";
var gameID = null;
var roundID = null;
var messageIntervalID = null;
var out = false;
var scores = [];
var roundScore = 0;
var playerName = "";

//Setup new Game or Round
function setupNewGame() {
    //Clear Previous Round ID & Message ID
    clearTimeout(roundID);
    roundID = null;
    clearInterval(messageIntervalID);
    messageIntervalID = null;

    //Focus out from buttons & disable or change value of "New Game" button
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

    //Initial DetailsBox & Message
    eachGameScoreboardP.innerHTML = roundScore;
    scoreboardRound.innerHTML = "Round " + (scores.length + 1);
    message.innerHTML = "Press SPACE to Start Round " + (scores.length + 1) + ".";
    displayFullScoreboard();
}

//Start Interval for Round
function startGame() {
    gameID = setInterval(() => {
        //Ball Next Position
        ball.style.top = ballTop + "px";
        ball.style.left = ballLeft + "px";
        ballMovingSpeed = ballMovingSpeed + 0.0000625;
        ballTop = eval(ballTop + topOperation + ballMovingSpeed);
        ballLeft = eval(ballLeft + leftOperation + ballMovingSpeed);

        if (ballTop >= (gameBoxHeight - rodHeight - ballHeight)) {
            //If ball crosses or equal to bottom rod & Atleast some part of ball on rod then reverse Vertical direction else OUT.
            var ballPos = (ballLeft + (3 * ballWidth / 4));
            if (ballPos >= rods[0].offsetLeft && (ballLeft + (ballWidth / 4)) <= rods[0].offsetLeft + rodWidth) {
                topOperation = "-";
                scoreSpeed = getScoreSpeed(ballMovingSpeed);
                roundScore += scoreSpeed;
                eachGameScoreboardP.innerHTML = roundScore;
                tapSound.play();
            } else {
                gameOver();
            }
        } else if (ballTop <= rodHeight) {
            //If ball crosses or equal to top rod & Atleast some part of ball on rod then reverse Vertical direction else OUT.
            var ballPos = (ballLeft + (3 * ballWidth / 4));
            if (ballPos >= rods[0].offsetLeft && (ballLeft + (ballWidth / 4)) <= rods[0].offsetLeft + rodWidth) {
                topOperation = "+";
                scoreSpeed = getScoreSpeed(ballMovingSpeed);
                roundScore += scoreSpeed;
                eachGameScoreboardP.innerHTML = roundScore;
                tapSound.play();
            } else {
                gameOver();
            }
        }

        //Reverse Horizontal Directions
        if (ballLeft >= (gameBoxWidth - ballWidth)) {
            leftOperation = "-";
        } else if (ballLeft <= 0) {
            leftOperation = "+";
        }
    }, 5);
}

//Round Finished
function gameOver() {
    //clear Interval ID of Finished Round
    outSound.play();
    clearInterval(gameID);
    gameID = null;
    out = true;
    gameState = "over";

    ballTop = eval(ballTop + topOperation + 5);
    ball.style.top = ballTop + "px";
    ball.style.left = ballLeft + "px";
    ball.style.background = "#a90200";

    //update Scores
    scores[scores.length] = roundScore;
    updateFullScoreboard();
    enableButtons();

    //If Last Round is finished then return else Setup Next Round.
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
            messageIntervalID = null;
        }
        message.innerHTML = "Score : " + roundScore + ".</br>Next Round Starting in " + i + ".";
        i = i - 1;
    }, 1000)

    roundID = setTimeout(() => {
        setupNewGame();
    }, 10000)
}

//Reset Game
function resetGame() {
    disableButtons();
    //clear All Intervals & Timeouts
    clearInterval(gameID);
    clearTimeout(roundID);
    clearInterval(messageIntervalID);
    gameID = null;
    roundID = null;
    messageIntervalID = null;

    //Update Varibles to Initial Values
    controlBtn[0].blur();
    controlBtn[1].blur();
    controlBtn[0].innerHTML = "New Game";
    scores = [];
    resetFullScoreboard();
    gameState = "";
    out = false;
    roundScore = 0;
    scoreSpeed = 5;

    //Update HTML Elements to Initial Values
    message.innerHTML = "Click on New Game to Start.";
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

//Disable both buttons
function disableButtons() {
    controlBtn[0].disabled = true;
    controlBtn[1].disabled = true;
    controlBtn[0].style.cursor = "not-allowed";
    controlBtn[1].style.cursor = "not-allowed";
}

//Enable both buttons
function enableButtons() {
    controlBtn[0].disabled = false;
    controlBtn[1].disabled = false;
    controlBtn[0].style.cursor = "pointer";
    controlBtn[1].style.cursor = "pointer";
}

//Show Full Scoreboard & Hide Round Score
function displayFullScoreboard() {
    fullScoreboard.style.display = "flex";
    eachGameScoreboard.style.display = "none";
}

//Hide Full Scoreboard & Show Round Score
function hideFullScoreboard() {
    fullScoreboard.style.display = "none";
    eachGameScoreboard.style.display = "flex";
}

//Update Full Scoreboard
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

//Reset Full Scoreboard
function resetFullScoreboard() {
    //Remove All Rows from Full Scoreboard
    var fullScoreboardRows = document.querySelectorAll('.detailsBox .scoreboard .fullScoreboard tbody tr');
    for (var i = 0; i < fullScoreboardRows.length; i++) {
        fullScoreboardRows[i].remove();
    }
}

//Calculate Total Score After last rounds
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

//Get Score Update Speed based on ball moving speed
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

//Move Left on Key A
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

//Move Right on Key D
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

//Space, A & D keyPress Event Handlers
document.addEventListener('keydown', function(e) {
    //Handle Space Press only when New Game is Started
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
    //Handle A & D only when game is in Running State
    if (gameState == "running") {
        if (e.code == "KeyA" || e.keyCode == "37") {
            moveLeft();
            return;
        }
        if (e.code == "KeyD" || e.keyCode == "39") {
            moveRight();
            return;
        }
    }
})