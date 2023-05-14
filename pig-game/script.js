'use strict';

const hiddenClass = 'hidden';
const playerActiveClass = 'player--active';
const playerWinnerClass = 'player--winner';

const player0Element = document.querySelector('.player--0');
const player1Element = document.querySelector('.player--1');
const current0Element = document.getElementById('current--0');
const current1Element = document.getElementById('current--1');
const score0Element = document.getElementById('score--0');
const score1Element = document.getElementById('score--1');
const diceElement = document.querySelector('.dice');
const rollBtnElement = document.querySelector('.btn--roll');
const newRollBtnElement = document.querySelector('.btn--new');
const holdBtnElement = document.querySelector('.btn--hold');

const scoresToGameOver = 100;
let scores = [0, 0];
let currentScore = 0;
let activePlayer = 0;
let gameOver = false;

function switchPlayer() {
	document.getElementById(`current--${activePlayer}`).textContent = 0;
	currentScore = 0;
	activePlayer = activePlayer === 0 ? 1 : 0;
	player0Element.classList.toggle(playerActiveClass);
	player1Element.classList.toggle(playerActiveClass);
}

function rollButtonClick(e) {
	if (!gameOver) {
		e.preventDefault();

		const dice = Math.trunc(Math.random() * 6) + 1;

		diceElement.classList.remove(hiddenClass);
		diceElement.src = `dice-${dice}.png`;

		if (dice !== 1) {
			currentScore += dice;
			document.getElementById(`current--${activePlayer}`).textContent =
				currentScore;
		} else {
			switchPlayer();
		}
	}
}

function holdButtonClick(e) {
	if (!gameOver) {
		scores[activePlayer] += currentScore;
		document.getElementById(`score--${activePlayer}`).textContent =
			scores[activePlayer];

		if (scores[activePlayer] >= scoresToGameOver) {
			gameOver = true;
			document
				.querySelector(`.player--${activePlayer}`)
				.classList.add(playerWinnerClass);
			document
				.querySelector(`.player--${activePlayer}`)
				.classList.remove(playerActiveClass);
		} else {
			switchPlayer();
		}
	}
}

function newRollButtonClick(e) {
	e.preventDefault();

	document.querySelector(`.player--${activePlayer}`).classList.remove(playerWinnerClass);
	document.querySelector(`.player--0`).classList.add(playerActiveClass);

	gameOver = false;
	activePlayer = 0;
	scores = [0, 0];
	current0Element.textContent = 0;
	current1Element.textContent = 0;
	score0Element.textContent = 0;
	score1Element.textContent = 0;
}

rollBtnElement.addEventListener('click', rollButtonClick);
holdBtnElement.addEventListener('click', holdButtonClick);
newRollBtnElement.addEventListener('click', newRollButtonClick);
