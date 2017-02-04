(function() {
    'use strict';

    const HangmanMod = function() {

        let letterDisplay = document.querySelector('#word');
        let guessForm = document.querySelector('.guess-button');
        let playerGuess = document.querySelector('#letter');
        let choosenLetter = '';
        let choosenLetters = [];
        let usedLetters = document.querySelector('h3 span');
        let turnsDisplay = document.querySelector('#wrong h3 span');
        let turnCounter = document.querySelector('#lives');
        let playerInput = document.querySelector('#letter');
        let turnContainer = document.querySelector('.end-game p');
        let scaler = document.querySelector('.end-game');
        let audio = new Audio ('./audio/fail-trombone-01.wav');


        let correctGuess = null;
        let currentWord = '';
        let entryArray = [];
        let compareArrays = [];
        let turns = 0;


    /* AJAX REQUEST */
    function getWords() { // requesting the word data
        let http = new XMLHttpRequest();

        http.onreadystatechange = function() {
            if (http.readyState === 4 & http.status === 200) {
            // console.log(http.response);

            const wordData = JSON.parse(http.response);
            getInput();
            chooseWord(wordData);
            }
        };

        http.open('GET', './data/words.json', true);
        http.send();
    }

    function chooseWord(wordData) {
        let randomGen = Math.floor(Math.random() * 100);
        currentWord = wordData[randomGen].content.toLowerCase();

        if (Object.keys(currentWord).length > 3) {
        }
        displayWord(currentWord);
    }

    function displayWord(currentWord) { // display the current word

        entryArray = currentWord.split('');
        compareArrays = currentWord.split('');
        console.log(entryArray);
        letterDisplay.innerHTML = '';
        for (let i = 0; i < entryArray.length; i++) {
            let item = document.createElement('span');
            item.innerHTML = entryArray[i];
            item.classList.add('letters-hidden');
            letterDisplay.appendChild(item);
        }
    }

    function getInput() { // get user input
        guessForm.addEventListener('click', () => {
            event.preventDefault();
            choosenLetter = playerInput.value.toLowerCase();

            let letterChecker = choosenLetters.indexOf(choosenLetter);
            if (letterChecker < 0) {
                choosenLetters.push(choosenLetter);
            }
            if (letterChecker >= 0) {
                alert('You have already picked that letter!');
            }

            playerInput.value = '';

            usedLetters.textContent = choosenLetters;
            checkLetters(choosenLetter);
        });
    }

    function checkLetters(choosenLetter) { // check letters
        let checker = entryArray.indexOf(choosenLetter);
        if (checker < 0) {
            correctGuess = false;
            turns += 1;
        }
        if (checker >= 0) {
            correctGuess = true;
            turns += 0;
        }
        updateWord();
        turnsTracker();
        winning();
    }

    function updateWord() { // update with each guess
        for (let i = 0; i < entryArray.length; i++) {
            if (entryArray[i] === choosenLetter) {
                let item = document.querySelectorAll('.letters-hidden')[i];
                item.classList.add('show-letter');
            }
        }
    }

    function turnsTracker() { // turns section & game over display
        turnCounter.textContent = turns;
        if (turns === 6) {
            letterDisplay.classList.add('guess-show');
            scaler.classList.add('scale');
            turnContainer.textContent = 'G A M E   O V E R! :(';
            audio.play();
            letterDisplay.textContent = currentWord;
            setTimeout(function() {
                location.reload();
            }, 3000);
        }
    }


    function winning() { // winning display
        compareArrays = compareArrays.filter(val => !choosenLetters.includes(val));
        if (compareArrays.length === 0) {
            scaler.classList.add('scale');
            turnContainer.textContent = 'Y O U  W I N! :)';
            letterDisplay.textContent = currentWord;
            setTimeout(function() {
                location.reload();
            }, 3000);
        }
    }

    return { // return get words
        getWords: getWords
    };


};

    const hangmanApp = HangmanMod();
    hangmanApp.getWords('words');

})();
