'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const imgTargets = document.querySelectorAll('img[data-src]');

const dotContainer = document.querySelector('.dots');

const slides = document.querySelectorAll('.slide');
const slideBtnLeft = document.querySelector('.slider__btn--left');
const slideBtnRight = document.querySelector('.slider__btn--right');

const allSections = document.querySelectorAll('.section');

const openModal = function (e) {
	e.preventDefault();
	modal.classList.remove('hidden');
	overlay.classList.remove('hidden');
};

const closeModal = function () {
	modal.classList.add('hidden');
	overlay.classList.add('hidden');
};

const smoothScroll = function (e) {
	e.preventDefault();

	section1.scrollIntoView({ behavior: 'smooth' });
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
		closeModal();
	}
});

btnScrollTo.addEventListener('click', smoothScroll);

document.querySelector('.nav__links').addEventListener('click', function (e) {
	e.preventDefault();
	const element = e.target;
	if (element.classList.contains('nav__link')) {
		const href = element.getAttribute('href');
		document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
	}
});

tabsContainer.addEventListener('click', function (e) {
	e.preventDefault();
	const element = e.target.closest('.operations__tab');

	if (!element) return;

	tabs.forEach(e => e.classList.remove('operations__tab--active'));
	tabsContent.forEach(e => e.classList.remove('operations__content--active'));

	element.classList.add('operations__tab--active');
	document
		.querySelector(`.operations__content--${element.dataset.tab}`)
		.classList.add('operations__content--active');
});

function handleHover(e) {
	if (e.target.classList.contains('nav__link')) {
		const link = e.target;
		const siblings = link.closest('.nav').querySelectorAll('.nav__link');
		const logo = link.closest('.nav').querySelector('img');
		siblings.forEach(e => {
			if (e !== link) e.style.opacity = this;
		});
		logo.style.opacity = this;
	}
}

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

const stickyNav = function (entries) {
	const [entry] = entries;
	if (!entry.isIntersecting) {
		nav.classList.add('sticky');
	} else {
		nav.classList.remove('sticky');
	}
};

const headerObserver = new IntersectionObserver(stickyNav, {
	root: null,
	threshold: 0,
	rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Revealing sections
const revealSection = function (entries, observer) {
	const [entry] = entries;
	if (entry.isIntersecting) {
		entry.target.classList.remove('section--hidden');
	}
};

const sectionObserver = new IntersectionObserver(revealSection, {
	root: null,
	threshold: 0.15,
});

allSections.forEach(s => {
	sectionObserver.observe(s);
	s.classList.add('section--hidden');
});

const loadImg = function (entries, observer) {
	const [entry] = entries;
	if (entry.isIntersecting) {
		const img = entry.target;
		img.src = img.dataset.src;g
		img.addEventListener('load', e => {
			e.preventDefault();
			img.classList.remove('lazy-img');
		});
	}
};

const imgObserver = new IntersectionObserver(loadImg, {
	root: null,
	threshold: 0.15,
});

imgTargets.forEach(img => imgObserver.observe(img));

let currentSlide = 0;
slides.forEach((s, i) => (s.style.transform = `translateX(${i * 100}%)`));

function goToSlide(slide) {
	slides.forEach(
		(s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
	);
}

function createDots() {
	slides.forEach((_, i) => {
		dotContainer.insertAdjacentHTML(
			'beforeEnd',
			`<button class="dots__dot" data-slide=${i}></button>`
		);
	});
}

function activateDot(slide) {
	document
		.querySelectorAll('.dots__dot')
		.forEach(d => d.classList.remove('dots__dot--active'));
	document
		.querySelector(`.dots__dot[data-slide="${slide}"]`)
		.classList.add('dots__dot--active');
}

createDots();
goToSlide(0);
activateDot(0);

function nextSlide(e) {
	e.preventDefault();
	if (currentSlide < slides.length - 1) {
		currentSlide++;
	} else {
		currentSlide = 0;
	}
	goToSlide(currentSlide);
	activateDot(currentSlide);
}

function prevSlide(e) {
	e.preventDefault();
	if (currentSlide !== 0) {
		currentSlide--;
	} else {
		currentSlide = slides.length - 1;
	}
	goToSlide(currentSlide);
	activateDot(currentSlide);
}

slideBtnRight.addEventListener('click', nextSlide);
slideBtnLeft.addEventListener('click', prevSlide);
document.addEventListener('keydown', function (e) {
	if (e.key === 'ArrowLeft') {
		prevSlide(e);
	} else if (e.key === 'ArrowRight') {
		nextSlide(e);
	}
});

dotContainer.addEventListener('click', function (e) {
	const dot = e.target;
	if (dot.classList.contains('dots__dot')) {
		const { slide } = dot.dataset;
		goToSlide(slide);
		activateDot(slide);
	}
});
