'use strict';

// Data
const account1 = {
	owner: 'Jonas Schmedtmann',
	movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
	interestRate: 1.2, // %
	pin: 1111,

	movementsDates: [
		'2019-11-18T21:31:17.178Z',
		'2019-12-23T07:42:02.383Z',
		'2020-01-28T09:15:04.904Z',
		'2020-04-01T10:17:24.185Z',
		'2020-05-08T14:11:59.604Z',
		'2020-05-27T17:01:17.194Z',
		'2023-05-07T23:36:17.929Z',
		'2023-05-10T10:51:36.790Z',
	],
	currency: 'EUR',
	locale: 'pt-PT',
};

const account2 = {
	owner: 'Jessica Davis',
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,

	movementsDates: [
		'2019-11-01T13:15:33.035Z',
		'2019-11-30T09:48:16.867Z',
		'2019-12-25T06:04:23.907Z',
		'2020-01-25T14:18:46.235Z',
		'2020-02-05T16:33:06.386Z',
		'2020-04-10T14:43:26.374Z',
		'2020-06-25T18:49:59.371Z',
		'2020-07-26T12:01:20.894Z',
	],
	currency: 'USD',
	locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const currencies = new Map([
	['USD', 'United States dollar'],
	['EUR', 'Euro'],
	['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
let currentAccount, timerId;
let sorted = false;

const now = new Date();

function daysPassed(oldDate) {
	return Math.round(Math.abs(new Date() - oldDate) / (1000 * 60 * 60 * 24));
}

function formatCurrency(value, locale, currency) {
	return Intl.NumberFormat(locale, {
		style: 'currency',
		currency: currency,
	}).format(value);
}

function logout() {
	containerApp.style.opacity = 0;
	labelWelcome.textContent = 'Log in to get started';
	currentAccount = undefined;
	window.clearInterval(timerId);
}

function countDownTimer() {
	let time = 1 * 60;
	const timerId = setInterval(() => {
		const min = String(Math.trunc(time / 60)).padStart(2, 0);
		const sec = String(time % 60).padStart(2, 0);

		labelTimer.textContent = `${min}:${sec}`;
		if (time === 0) {
			logout();
		}
		time--;
	}, 1000);
	return timerId;
}

function resetTimer() {
	window.clearInterval(timerId);
	timerId = countDownTimer();
}

function displayMovements(sort = false) {
	containerMovements.innerHTML = '';
	const movements = sort
		? currentAccount.movements.slice().sort((a, b) => a - b)
		: currentAccount.movements;
	movements.forEach((v, i) => {
		const accountDate = new Date(currentAccount.movementsDates[i]);
		const days = daysPassed(accountDate);
		let date = '';
		if (days === 0) {
			date = 'TODAY';
		} else if (days === 1) {
			date = 'YESTERDAY';
		} else if (days <= 7) {
			date = `${days} DAYS AGO`;
		} else {
			date = Intl.DateTimeFormat(currentAccount.locale).format(
				accountDate
			);
		}

		const type = v > 0 ? 'deposit' : 'withdrawal';

		const html = `
			<div class="movements__row">
			<div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
			<div class="movements__date">${date}</div>
			<div class="movements__value">${formatCurrency(
				v,
				currentAccount.locale,
				currentAccount.currency
			)}</div>
			</div>
		`;

		containerMovements.insertAdjacentHTML('afterbegin', html);
	});
}

function calcDisplayBalance(account) {
	const incomes = account.movements
		.filter(v => v > 0)
		.reduce((acc, v) => acc + v);
	labelSumIn.textContent = formatCurrency(
		incomes,
		account.locale,
		account.currency
	);

	const out = account.movements
		.filter(v => v < 0)
		.reduce((acc, v) => acc + v);
	labelSumOut.textContent = formatCurrency(
		out,
		account.locale,
		account.currency
	);

	const interest = account.movements
		.filter(v => v > 0)
		.map(deposit => (deposit * account.interestRate) / 100)
		.filter((v, i) => v >= i)
		.reduce((acc, v) => acc + v);
	labelSumInterest.textContent = formatCurrency(
		interest,
		account.locale,
		account.currency
	);

	const balance = account.movements.reduce((acc, v) => acc + v, 0);
	labelBalance.textContent = formatCurrency(
		balance,
		account.locale,
		account.currency
	);
	account.balance = balance;
}

function createUsernames(accs) {
	accs.forEach(acc => {
		acc.username = acc.owner
			.toLowerCase()
			.split(' ')
			.map(name => name[0])
			.join('');
	});
}

createUsernames(accounts);

function displayFinancialInformation() {
	//Display movements
	displayMovements();

	//Display balance
	calcDisplayBalance(currentAccount);
}

function login() {
	currentAccount = accounts.find(
		acc =>
			acc.username === inputLoginUsername.value &&
			acc.pin === Number(inputLoginPin.value)
	);
	if (currentAccount) {
		//Print welcom message
		labelWelcome.textContent = `Welcome back, ${
			currentAccount.owner.split(' ')[0]
		}`;
		containerApp.style.opacity = 1;

		inputLoginUsername.value = inputLoginPin.value = '';

		const options = {
			hour: 'numeric',
			minute: 'numeric',
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			weekday: 'short',
		};

		labelDate.textContent = Intl.DateTimeFormat(
			currentAccount.locale,
			options
		).format(now);

		displayFinancialInformation();
		if (timerId) {
			window.clearInterval(timerId);
		}
		timerId = countDownTimer();
	}
}

function transferAmount(e) {
	e.preventDefault();
	const amount = Number(inputTransferAmount.value);
	const receiverAcc = accounts.find(
		acc => acc.username === inputTransferTo.value
	);
	console.log(`Transfer money ${amount} to ${receiverAcc.username}`);

	if (
		amount > 0 &&
		amount <= currentAccount.balance &&
		receiverAcc?.username !== currentAccount.username
	) {
		console.log('Transfering money...');
		setTimeout(() => {
			currentAccount.balance -= amount;
			receiverAcc.balance += amount;
			currentAccount.movements.push(-1 * amount);
			receiverAcc.movements.push(amount);
			const now = new Date().toISOString();
			currentAccount.movementsDates.push(now);
			receiverAcc.movementsDates.push(now);

			inputTransferAmount.value = inputTransferTo.value = '';

			displayFinancialInformation();
		}, 3000);
		resetTimer();
	}
	console.log('Transfering logic completed!');
}

function closeAccount(e) {
	e.preventDefault();

	if (
		inputCloseUsername.value === currentAccount.username &&
		Number(inputClosePin.value) === currentAccount.pin
	) {
		const index = accounts.findIndex(
			acc => acc.username === inputCloseUsername.value
		);
		accounts.splice(index, 1);

		logout();

		inputCloseUsername.value = '';
		inputClosePin.value = '';
	}
}

function requestLoan(e) {
	e.preventDefault();

	const amount = Math.floor(inputLoanAmount.value);

	if (amount > 0 && currentAccount.movements.some(v => v >= amount * 0.1)) {
		currentAccount.movements.push(amount);
		currentAccount.movementsDates.push(new Date().toISOString());
		inputLoanAmount.value = '';
		setTimeout(() => {
			displayFinancialInformation();
		}, 3000);
		resetTimer();
	}
}

function sort(e) {
	e.preventDefault();

	sorted = !sorted;
	displayMovements(sorted);
}

btnLogin.addEventListener('click', e => {
	e.preventDefault();

	login();
});

btnLogin.addEventListener('keydown', e => {
	if (e.key === 'Enter') {
		login();
	}
});

btnTransfer.addEventListener('click', transferAmount);
btnClose.addEventListener('click', closeAccount);
btnLoan.addEventListener('click', requestLoan);
btnSort.addEventListener('click', sort);
