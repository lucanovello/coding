const mainContent = document.getElementById('main-content');
const heroSlideshow = document.getElementById('hero-slideshow');
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

// Initializing slideshow timer ---------------
let heroSlideshowInt = setInterval(changeSlideForward, sliderTime);

// SLIDESHOW ---------------
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
  if (
    activeSlide.nextElementSibling === null ||
    activeDot.nextElementSibling === null
  ) {
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
  if (
    activeSlide.previousElementSibling === null ||
    activeDot.previousElementSibling === null
  ) {
    nextSlide = slides.lastElementChild;
    nextDot = sliderDots.lastElementChild;
  }
  changeSlide();
}

// set click events to arrows
sliderArrows.addEventListener('click', (event) => {
  event.preventDefault();
  if (event.target.localName == 'button') {
    event.target.id == 'slider-prev'
      ? changeSlidePrevious()
      : changeSlideForward();
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

// MOBILE NAV CHANGE COLOR WHEN IN VIEWPORT
const sections = [...document.querySelectorAll(`[data-type="section"]`)];

const observerOptions = {
  rootMargin: '-50% 0% -50% 0%',
  threshold: 0,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const currentEntry = document.querySelector(
      `[data-nav="${entry.target.dataset.observe}"]`
    );
    if (entry.isIntersecting) {
      currentEntry.classList.add('mobile-nav-active');
    } else {
      currentEntry.classList.remove('mobile-nav-active');
    }
  });
}, observerOptions);

sections.forEach((section) => observer.observe(section));

initSlider();
changeDots();
