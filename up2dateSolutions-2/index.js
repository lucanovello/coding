const body = document.getElementById('body');
const introScreen = document.getElementById('intro-screen');
const navContainer = document.querySelector('.nav-container');
const logo = document.getElementById('logo');
const partnersLogosContainer = document.getElementById('partners-logos-container');

const contactForm = document.getElementById('contact-form');
const contactSuccessMessage = document.getElementById('contact-success-message');

const heroSlideshow = document.getElementById('slideshow-container');
const slides = document.getElementById('slides');
const sliderDots = document.getElementById('slider-dots');
const sliderArrows = document.getElementById('slider-arrows');
const sliderTime = 8000;
let activeSlide;
let activeDot;
let nextSlide;
let nextDot;

let currentSlide;

let dragStartX;
let dragEndX;

// INIT PAGE ------------------------------------------------------------------------------------
// check scroll location on page load ---------------
navScrollHandler();
// Initializing slideshow timer ---------------
let heroSlideshowInt = setInterval(changeSlideForward, sliderTime);
// Initializing slideshow ---------------
initSlider();
// Initializing slideshow dots---------------
changeDots();

// intro screen ------------------
setTimeout(() => {
    introScreen.classList.add('fade-out');
}, 500);
setTimeout(() => {
    body.classList.remove('overflow-hidden');
}, 1000);
setTimeout(() => {
    introScreen.style.display = 'none';
}, 1500);

// LAZY LOADING EFFECT ------------------------------------------------------------------------------------
const fadeUpArr = document.querySelectorAll('.fade-up');
const fadeLeftArr = document.querySelectorAll('.fade-left');
const fadeRightArr = document.querySelectorAll('.fade-right');

let options = {
    rootMargin: '0px',
    threshold: 0.2,
};

let fadeUpObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('fade-up');
            fadeUpObserver.unobserve(entry.target);
        }
    });
}, options);

let fadeLeftObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('fade-left');
            fadeUpObserver.unobserve(entry.target);
        }
    });
}, options);

let fadeRightObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('fade-right');
            fadeUpObserver.unobserve(entry.target);
        }
    });
}, options);

fadeUpArr.forEach((fadeUp) => {
    fadeUpObserver.observe(fadeUp);
});
fadeLeftArr.forEach((fadeLeft) => {
    fadeLeftObserver.observe(fadeLeft);
});
fadeRightArr.forEach((fadeRight) => {
    fadeRightObserver.observe(fadeRight);
});

// EVENT HANDLERS ------------------------------------------------------------------------------------
// handles bg color of nav bar on scroll
window.addEventListener('scroll', navScrollHandler);
window.addEventListener('resize', navScrollHandler);

function navScrollHandler() {
    if (window.innerWidth > 640) {
        if (window.scrollY <= 100) {
            navContainer.classList.remove('nav-scrolling');
            logo.classList.remove('logo-scrolling');
        } else {
            navContainer.classList.add('nav-scrolling');
            logo.classList.add('logo-scrolling');
        }
    } else {
        navContainer.classList.remove('nav-scrolling');
        logo.classList.remove('logo-scrolling');
    }
}

// SLIDESHOW ------------------------------------------------------------------------------------
function initSlider() {
    // Creating slide ids and dots based on slide count
    const slideArr = [...slides.children];
    slideArr.forEach((slide) => {
        slide.id = `slide${slideArr.indexOf(slide) + 1}`;
        let newDot = document.createElement('button');
        newDot.classList.add('dot');
        newDot.id = `dot${slideArr.indexOf(slide) + 1}`;
        sliderDots.appendChild(newDot);
        // Setting initiale slide
        slides.firstElementChild.classList.add('slide-active');
        sliderDots.firstElementChild.classList.add('dot-active');
        activeSlide = document.getElementsByClassName('slide-active')[0];
        activeDot = document.getElementsByClassName('dot-active')[0];
        nextSlide = activeSlide.nextElementSibling;
        nextDot = activeDot.nextElementSibling;
    });
}

// change slides
function changeSlide() {
    activeSlide.classList.remove('slide-active');
    activeDot.classList.remove('dot-active');
    nextSlide.classList.add('slide-active');
    nextDot.classList.add('dot-active');
    heroSlideshowInt = setInterval(changeSlideForward, sliderTime);
}

// change slides forward
function changeSlideForward() {
    clearInterval(heroSlideshowInt);
    activeSlide = document.getElementsByClassName('slide-active')[0];
    activeDot = document.getElementsByClassName('dot-active')[0];
    nextSlide = activeSlide.nextElementSibling;
    nextDot = activeDot.nextElementSibling;
    if (activeSlide.nextElementSibling === null || activeDot.nextElementSibling === null) {
        nextSlide = slides.firstElementChild;
        nextDot = sliderDots.firstElementChild;
    }
    changeSlide();
}
// change slides previous
function changeSlidePrevious() {
    clearInterval(heroSlideshowInt);
    activeSlide = document.getElementsByClassName('slide-active')[0];
    activeDot = document.getElementsByClassName('dot-active')[0];
    nextSlide = activeSlide.previousElementSibling;
    nextDot = activeDot.previousElementSibling;
    if (activeSlide.previousElementSibling === null || activeDot.previousElementSibling === null) {
        nextSlide = slides.lastElementChild;
        nextDot = sliderDots.lastElementChild;
    }
    changeSlide();
}

// set click events to arrows
sliderArrows.addEventListener('click', (event) => {
    event.preventDefault();
    if (event.target.localName == 'button') {
        event.target.id == 'slider-prev' ? changeSlidePrevious() : changeSlideForward();
    }
});

// set click events to dots
function changeDots() {
    for (let i = 0; i < slides.childElementCount; i++) {
        sliderDots.children[i].addEventListener('click', function (event) {
            event.preventDefault();
            clearInterval(heroSlideshowInt);
            activeSlide = document.getElementsByClassName('slide-active')[0];
            activeDot = document.getElementsByClassName('dot-active')[0];
            nextSlide = slides.children.item(i);
            nextDot = sliderDots.children.item(i);
            activeSlide.classList.remove('slide-active');
            activeDot.classList.remove('dot-active');
            nextSlide.classList.add('slide-active');
            nextDot.classList.add('dot-active');
            heroSlideshowInt = setInterval(changeSlideForward, sliderTime);
        });
    }
}

// DRAG EVENTS FOR SLIDESHOW
//record mouse x position on clicks
slides.addEventListener('mousedown', (event) => {
    dragStartX = event.clientX;
    heroSlideshow.classList.add('grabbing');
    clearInterval(heroSlideshowInt);
});

slides.addEventListener('mouseup', (event) => {
    dragEndX = event.clientX;
    heroSlideshow.classList.remove('grabbing');
    slideshowDragChange(50);
});

// change slide depending on direction of drag
function slideshowDragChange(dragLimit) {
    let dragDifference = dragStartX - dragEndX;
    if (dragDifference < -dragLimit) {
        changeSlidePrevious();
    } else if (dragDifference > dragLimit) {
        changeSlideForward();
    }
    dragDifference = 0;
}

// TOUCH EVENTS FOR SLIDESHOW (mobile)
slides.addEventListener('touchstart', (event) => {
    dragStartX = event.changedTouches[0].clientX;
});
slides.addEventListener('touchend', (event) => {
    dragEndX = event.changedTouches[0].clientX;
    slideshowDragChange(20);
});

// MOBILE NAV CHANGE COLOR WHEN IN VIEWPORT ------------------------------------------------------------------------------------
const sections = [...document.querySelectorAll(`[data-type="section"]`)];

const observerOptions = {
    rootMargin: '-50% 0% -50% 0%',
    threshold: 0,
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const currentEntry = document.querySelector(`[data-nav="${entry.target.dataset.observe}"]`);
        if (entry.isIntersecting) {
            currentEntry.classList.add('mobile-nav-active');
        } else {
            currentEntry.classList.remove('mobile-nav-active');
        }
    });
}, observerOptions);

sections.forEach((section) => observer.observe(section));

//  Contact form send to server and respond with success or error
contactForm.addEventListener('submit', (e) => {
    // Prevent the form from being submitted
    e.preventDefault();

    // Get the form data
    const formData = new FormData(contactForm);

    // Send the form data to the server using an XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/sendmail.php');
    xhr.onload = function () {
        if (xhr.getResponseHeader('X-Contact-Form-Status') === 'success') {
            // Display a success message
            contactSuccessMessage.innerHTML =
                '<span>&#10003;</span> Thank you! Your message has been sent';
            contactSuccessMessage.classList = 'contact-success-message-show';
            setTimeout(() => {
                contactSuccessMessage.classList = 'contact-success-message-hide';
            }, 2000);
            document.querySelector('#contact-name').value = '';
            document.querySelector('#contact-phone').value = '';
            document.querySelector('#contact-company').value = '';
            document.querySelector('#contact-email').value = '';
            document.querySelector('#contact-subject').value = '';
            document.querySelector('#contact-message').value = '';
        } else {
            contactSuccessMessage.innerHTML =
                '<span>&#9447;</span> Sorry there was an error, please try again later';
            contactSuccessMessage.classList = 'contact-success-message-show';
            setTimeout(() => {
                contactSuccessMessage.classList = 'contact-success-message-hide';
            }, 2000);
        }
    };
    xhr.send(formData);
});
