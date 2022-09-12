import { VALID } from "./valid.js";
console.log
let NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
console.log(VALID[Math.floor(Math.random() * VALID.length)])
let rightGuessString = VALID[Math.floor(Math.random() * VALID.length)];
let timeout;
console.log(rightGuessString)

toastr.options = {
    "positionClass": "toast-top-right",
    "newestOnTop": true,
    "showDuration": 200,
    "hideDuration": 200,
    "timeOut": 0,
    "extendedTimeOut": 0,
}

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target
    if (!target.classList.contains("keyboard-button") && !target.classList.contains("keyboard-button-special") ) {
        return
    }
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
    } 

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

document.addEventListener("keyup", (e) => {

    if (guessesRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") {
        checkGuess()
        return
    }

    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})

function initBoard() {
    let board = document.getElementById("game-board");
    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"
        for (let j = 0; j < rightGuessString.length; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }
        board.appendChild(row)
    }
}


function insertLetter (pressedKey) {
    if (nextLetter === rightGuessString.length) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName("letter-row")[NUMBER_OF_GUESSES - guessesRemaining]
    let box = row.children[nextLetter]
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1
}

function deleteLetter () {
    let row = document.getElementsByClassName("letter-row")[NUMBER_OF_GUESSES - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1
}


async function checkGuess () {
    let row = document.getElementsByClassName("letter-row")[NUMBER_OF_GUESSES - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString)

    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != rightGuessString.length) {
        toastr.clear()
        toastr.error("Not enough letters!")
        return
    }

    if (!VALID.includes(guessString)) {
        toastr.clear()
        toastr.error("Word not in list!")
        return
    }

    
    for (let i = 0; i < rightGuessString.length; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letter = currentGuess[i]
        
        let letterPosition = rightGuess.indexOf(currentGuess[i])
        if (letterPosition === -1) {
            letterColor = 'grey'
        } else {
            if (currentGuess[i] === rightGuess[i]) {
                letterColor = 'green'
            } else {
                letterColor = 'yellow'
            }

            rightGuess[letterPosition] = "#"
        }

        let delay = 200 * i
        setTimeout(()=> {
            box.style.backgroundColor = letterColor
            //shadeKeyBoard(letter, letterColor)
        }, delay)
        
    }

    if (guessString === rightGuessString) {
        
        let word_list = document.getElementById("left");
        console.log(rightGuessString);
        if (rightGuessString == "tag"){
            word_list.innerHTML += `<p class='list'>&lt${rightGuessString}&gt<br></p>`;
        }
        else if (rightGuessString == "prom") {
            word_list.innerHTML += `<p class='list'>${rightGuessString}?<br></p>`;
                
        } else {
            word_list.innerHTML += `<p class='list'>${rightGuessString}<br></p>`;
        }
        toastr.clear()
        if (rightGuessString == "prom") {
            promposal()
            
        } else {
            toastr.success()
            var element = document.getElementById("toast-container");
            element.parentNode.removeChild(element);
            toastr.options = {
                "timeOut": 1500,
                "extendedTimeOut": 1500,
                "positionClass": "toast-center-center",
                "showDuration": 100,
                "hideDuration": 100,
            }
            toastr.success("You guessed right!")
            guessesRemaining = 0
            resetBoard();
        }
    } 
    else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;
        if (guessesRemaining === 0) {    
            let word_list = document.getElementById("left");
            console.log(rightGuessString);
            if (rightGuessString == "tag"){
                word_list.innerHTML += `<p class='list'>&lt${rightGuessString}&gt<br></p>`;
                
            }
            else if (rightGuessString == "prom") {
                word_list.innerHTML += `<p class='list'>${rightGuessString}?<br></p>`;
                
            } else {
                word_list.innerHTML += `<p class='list'>${rightGuessString}<br></p>`;
            }
            toastr.clear()
            if (rightGuessString == "prom") {
                promposal()
                
            }
            else {
                toastr.success()
                var element = document.getElementById("toast-container");
                element.parentNode.removeChild(element);
                toastr.options = {
                    "timeOut": 1750,
                    "extendedTimeOut": 1750,
                    "positionClass": "toast-center-center",
                    "showDuration": 100,
                    "hideDuration": 100,
                }
                toastr.error(`You&#39;ve run out of guesses!<br>The right word was: "${rightGuessString}"`)
            }
            resetBoard();
        }
    }
}


const syncWait = ms => {
    const end = Date.now() + ms
    while (Date.now() < end) continue
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function promposal() {
    toastr.options = {
        "tapToDismiss": false,
        "timeOut": 0,
        "positionClass": "toast-center-center",
        "showDuration": 100,
        "hideDuration": 100,
        "extendedTimeOut": 0,
    }
    
    toastr.success(
        '<div id="promposal"><div class="prom-message">Read the word list on the left :)</div><div class="prom-buttons"><button type="button" id="pbutton" class="yes-prom, yes">YES!!</button><button type="button" id="pbutton" class="no-prom, no">no :(</button></div></div>')
    let ids = document.getElementsByClassName("yes")
    ids[0].addEventListener("click", () => {
        var element = document.getElementById("toast-container");
        element.parentNode.removeChild(element);
        profit()
    });
    ids = document.getElementsByClassName("no")
    ids[0].addEventListener("click", () => {
        var element = document.getElementById("toast-container");
        element.parentNode.removeChild(element);
        areYouSure()
    });
}

function areYouSure() {
    toastr.options = {
        "tapToDismiss": false,
        "timeOut": 0,
        "positionClass": "toast-center-center",
        "showDuration": 100,
        "extendedTimeOut": 0,
        "hideDuration": 100,
    }
    toastr.success(
        '<div id="promposal"><div class="prom-message">are you sureee &gt_&lt</div><div class="prom-buttons"><button type="button" id="pbutton" class="yes-prom, yes">jk ehe</button><button type="button" id="pbutton" class="no-prom, sad">yep</button></div></div>')
    let ids = document.getElementsByClassName("yes")
    ids[0].addEventListener("click", () => {
        var element = document.getElementById("toast-container");
        element.parentNode.removeChild(element);
        profit()
    });
    ids = document.getElementsByClassName("sad")
    ids[0].addEventListener("click", () => {
        var element = document.getElementById("toast-container");
        element.parentNode.removeChild(element);
        sad()
    });
}

function profit() {
    cum()
    toastr.clear()
    sleep(500);
    toastr.options = {
        "tapToDismiss": false,
        "timeOut": 0,
        "positionClass": "toast-center-center",
        "showDuration": 100,
        "hideDuration": 100,
        "extendedTimeOut": 0,
    }
    toastr.success(
        '<div id="promposal"><div class="prom-message">YAYYY &#127881&#127881&#127881</div>')
}

function sad() {
    toastr.clear()
    toastr.options = {
        "timeOut": 0,
        "extendedTimeOut": 0,
        "positionClass": "toast-center-center",
        "showDuration": 100,
        "hideDuration": 100,
    }
    toastr.error(
        '<div id="promposal"><div class="prom-message">oki :((</div>')
}

async function resetBoard() {
    await sleep(2000);
    guessesRemaining = NUMBER_OF_GUESSES;
    currentGuess = [];
    nextLetter = 0;
    rightGuessString = VALID[Math.floor(Math.random() * VALID.length)];
    console.log(rightGuessString);
    document.getElementById("game-board").innerHTML = "";

    toastr.options = {
        "containerId": "toast-container",
        "positionClass": "toast-top-right",
        "newestOnTop": true,
        "showDuration": 200,
        "hideDuration": 200,
        "timeOut": 1200,
    }
    initBoard();
}

/*
$((function () {
    $('#showtoast').click((function () {
        var shortCutFunction = $("#toastTypeGroup input:radio:checked").val();
        var msg = $('#message').val();
        var title = $('#title').val() || '';
        var $toast = toastr[shortCutFunction](msg, title);
        if ($toast.find('.yes-prom').length) {
            $toast.delegate('.yes-prom', 'click', cum());
        }
        if ($toast.find('.surpriseBtn').length) {
            $toast.delegate('.yes-prom', 'click', areYouSure());
        }
    })());
})());
*/
initBoard();

