'use strict';

function generateNumber() {
	let number = Math.trunc(Math.random() * 20 + 1);
	console.log(`Random number is ${number}`);
	return number;
}

let gameOver = false;
let number = generateNumber();
let score = 20;
let highscore = 0;

const guessElement = document.querySelector('.guess');
const messageElement = document.querySelector('.message');
const numberElement = document.querySelector('.number');
const scoreElement = document.querySelector('.score');
const hightscoreElement = document.querySelector('.highscore');

const bodyStyle = document.querySelector('body').style;

function foundCorrectNumber(guess) {
	numberElement.textContent = guess;
	messageElement.textContent = '🎉 Correct number!';
	bodyStyle.backgroundColor = '#60b347';
	numberElement.style.width = '30rem';
	highscore += score;
	hightscoreElement.textContent = highscore;
	gameOver = true;
}

function stopGame() {
	scoreElement.textContent = 0;
	messageElement.textContent = '💥 You lost the game';
	bodyStyle.backgroundColor = '#b82d23';
	gameOver = true;
}

function typedInWrongNumber(guess) {
	guess > number
		? (messageElement.textContent = '📈 Too high!')
		: (messageElement.textContent = '📉 Too low!');
	scoreElement.textContent = --score;
}

function resetNumberElement() {
	numberElement.textContent = '?';
	numberElement.style.width = '15rem';
}

function resetScore() {
	score = 20;
	scoreElement.textContent = score;
}

function resetOtherElements() {
	bodyStyle.backgroundColor = '#222';
	messageElement.textContent = 'Start guessing...';
}

function resetGame() {
	gameOver = false;
	number = generateNumber();
	resetNumberElement();
	resetScore();
	resetOtherElements();
}

function checkButtonClick(e) {
	e.preventDefault();

	if (gameOver) {
		return;
	}

	const guess = Number(guessElement.value);

	if (!guess) {
		messageElement.textContent = '🚫 Not a number!';
		return;
	}

	if (number === guess) {
		foundCorrectNumber(guess);
	} else {
		if (score > 1) {
			typedInWrongNumber(guess);
		} else {
			stopGame();
		}
	}
}

function againButtonClick(e) {
	e.preventDefault();
	resetGame();
}

const btnCheck = document.querySelector('.check');
const btnAgain = document.querySelector('.again');

btnCheck.addEventListener('click', checkButtonClick);
btnAgain.addEventListener('click', againButtonClick);
