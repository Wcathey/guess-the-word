window.addEventListener('DOMContentLoaded', (e) => {
    let strikes = 0;
    let score = 0;

    let foundLetters = [];
    let keys = [];
    let currentWord;
    let currentLetter;
    let alphabet = ['A','B', 'C','D', 'E', 'F', 'G', 'H',
        'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        //grab the container that we will put our spaces in depending on length of the word
        const letterSpaces = document.getElementById('letter-container');
        //grab the keyboard that we will load each letter into
        const keyBoard = document.getElementById('keyboard');
        //grab the button that generates a new word to listen for event on click
        const newGame = document.getElementById('new-word');
        //grab the element that will change from winner or game-over on loss
        const endGamePrompt = document.getElementById('end-game-prompt');
        //grab the retry button which is hidden on start
        const retry = document.getElementById('retry');

// fetch a word from api, return the word or an error if it cant be found
async function fetchWord() {

    const url = "https://random-word-api.herokuapp.com/word"
     try {
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        return json;

     } catch (error) {
        console.log(error.message);
     }


}
//returns a new word on each call after waiing for the fetch function to finish
async function loadWord() {
    let getWord = await fetchWord();
    let word = getWord.join('');

    return word.toUpperCase();
}

// create empty spaces that change in length depending on length of the word
const createLetterSpaces = (word) => {



    for(let i = 0; i < word.length; i++) {

        let space = document.createElement('div');
        space.setAttribute('class', 'letter-spaces')
        space.setAttribute('id', i);
        letterSpaces.appendChild(space);
    }
}
// create the keyboard and push all the elements of the keys into an array
const createKeyBoard = () => {

    alphabet.forEach((letter) => {
        const key = document.createElement('div');
        key.setAttribute('class', 'keys');
        key.innerText = letter;
        keyBoard.appendChild(key);
        keys.push(key);
    })


}

async function startGame() {
    let word = await loadWord();
    currentWord = word.split('')
    createLetterSpaces(currentWord)


}

const checkStrikes = () => {
    if(strikes === 5) {
        gameOver()
    }
}

const compareLetter = (letter) => {
    while(letter !== currentLetter) {

    if(!currentWord.includes(letter)) {
        document.getElementById(`strike-${strikes}`).style.color = 'red';
        strikes = strikes + 1;
        checkStrikes();
    }

    else {
        for(let i = 0; i < currentWord.length; i++) {
            let char = currentWord[i];
            if(letter === char) {
                let currentSpace = document.getElementById(i);
                currentSpace.innerText = letter;
                foundLetters.push(currentSpace.innerText);
            }
        }
        if(foundLetters.length === currentWord.length) {
            endGamePrompt.innerText = 'Winner';
            endGamePrompt.style.color = 'yellow';
            score += 1;
            document.getElementById('score').innerText = score;

        }
    }
    currentLetter = letter;
}

}

const gameOver = () => {
    endGamePrompt.innerText = 'Game Over'
    endGamePrompt.style.color = 'yellow'

    retry.style.display = 'grid'
    score = 0;
    document.getElementById('score').innerText = score;
}

const resetGame = () => {
    endGamePrompt.innerText = '';

    for(let i = 0; i < strikes; i++) {
        
        document.getElementById(`strike-${i}`).style.color = 'rgb(122, 118, 118)'
    }

    for(let j = 0; j < currentWord.length; j ++) {
        document.getElementById(j).innerText = '';
    }
    keys.forEach((key) => {
        key.style.background = "white";
    })
    strikes = 0;
    foundLetters = [];

}

createKeyBoard();
startGame();

//loop through each keyboard letter and listen for click event
//when letter is click run a function that compares that letter to the letter in word
keys.forEach((key) => {
    key.addEventListener('click', (e) => {
        key.style.background = 'yellow';
        compareLetter(e.target.innerText)

    })
})

retry.addEventListener('click', (e) => {
    retry.style.display = 'none';
    resetGame()
});

newGame.addEventListener('click', (e) => {
    resetGame();
    letterSpaces.replaceChildren();
    startGame();
})
})
