const symbols = [
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "!",
    "*"
];

const board = document.getElementById("board");
const movesDisplay = document.getElementById("moves");
const timeDisplay = document.getElementById("time");
const pairsDisplay = document.getElementById("pairs");
const winScreen = document.getElementById("winScreen");
const result = document.getElementById("result");

let firstCard = null;
let secondCard = null;

let lockBoard = false;

let moves = 0;
let pairs = 0;

let seconds = 0;

let timer = null;

let gameStarted = false;


/* Shuffle Cards */

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const randomIndex =
            Math.floor(Math.random() * (i + 1));

        [array[i], array[randomIndex]] =
            [array[randomIndex], array[i]];
    }

    return array;
}


/* Format Timer */

function formatTime(seconds) {

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        seconds % 60;

    return String(minutes).padStart(2, "0")
        + ":"
        + String(remainingSeconds).padStart(2, "0");
}


/* Start Timer */

function startTimer() {

    if (gameStarted) {
        return;
    }

    gameStarted = true;

    timer = setInterval(function () {

        seconds++;

        timeDisplay.textContent =
            formatTime(seconds);

    }, 1000);
}


/* Create New Game */

function newGame() {

    clearInterval(timer);

    timer = null;
    gameStarted = false;

    firstCard = null;
    secondCard = null;

    lockBoard = false;

    moves = 0;
    pairs = 0;
    seconds = 0;

    movesDisplay.textContent = "0";
    timeDisplay.textContent = "00:00";
    pairsDisplay.textContent = "0 / 8";

    winScreen.classList.remove("show");


    /* Create two copies of each symbol */

    const cards = shuffle([
        ...symbols,
        ...symbols
    ]);


    board.innerHTML = "";


    /* Create Cards */

    cards.forEach(function (symbol) {

        const card =
            document.createElement("div");

        card.classList.add("card");

        card.dataset.symbol = symbol;


        card.innerHTML = `
            <div class="card-inner">
                <div class="card-back"></div>
                <div class="card-front">${symbol}</div>
            </div>
        `;


        card.addEventListener(
            "click",
            function () {

                flipCard(card);

            }
        );


        board.appendChild(card);

    });
}


/* Flip Card */

function flipCard(card) {

    /* Prevent invalid clicks */

    if (lockBoard) {
        return;
    }

    if (card === firstCard) {
        return;
    }

    if (card.classList.contains("matched")) {
        return;
    }


    /* Start timer */

    startTimer();


    /* Flip card */

    card.classList.add("flipped");


    /* First card */

    if (!firstCard) {

        firstCard = card;

        return;
    }


    /* Second card */

    secondCard = card;

    moves++;

    movesDisplay.textContent = moves;

    lockBoard = true;


    /* Check for match */

    if (
        firstCard.dataset.symbol ===
        secondCard.dataset.symbol
    ) {

        /* Matching pair */

        firstCard.classList.add("matched");

        secondCard.classList.add("matched");

        pairs++;

        pairsDisplay.textContent =
            pairs + " / 8";


        firstCard = null;
        secondCard = null;

        lockBoard = false;


        /* Check if game is complete */

        if (pairs === 8) {

            finishGame();

        }

    }

    else {

        /* Cards don't match */

        setTimeout(function () {

            firstCard.classList.remove(
                "flipped"
            );

            secondCard.classList.remove(
                "flipped"
            );


            firstCard = null;

            secondCard = null;

            lockBoard = false;

        }, 800);
    }
}


/* Finish Game */

function finishGame() {

    clearInterval(timer);

    gameStarted = false;


    result.textContent =
        "You matched all 8 pairs in "
        + moves
        + " moves and "
        + formatTime(seconds)
        + ".";


    setTimeout(function () {

        winScreen.classList.add("show");

    }, 500);
}


/* Start Game */

newGame();