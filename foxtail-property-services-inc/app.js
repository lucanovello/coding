const body = document.getElementById('body');
const introScreen = document.getElementById('intro-screen');
const navContainer = document.getElementById('nav-container');
const logo = document.getElementById('logo');

const form = document.getElementById('form');
const contactSuccessMessage = document.getElementById('contact-success-message');

navScrollHandler();

window.addEventListener('scroll', navScrollHandler);
window.addEventListener('resize', navScrollHandler);

function navScrollHandler() {
    if (window.innerWidth > 750) {
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

// MOBILE NAV CHANGE COLOR WHEN IN VIEWPORT ------------------------------------------------------------------------------------
const sections = [...document.querySelectorAll(`[data-type="section"]`)];

const observerOptions = {
    rootMargin: '-45% 0% -45% 0%',
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

//  Contact form send to server and respond with success or error
form.addEventListener('submit', (e) => {
    // Prevent the form from being submitted
    e.preventDefault();
    // Get the form data
    const formData = new FormData(form);
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
            document.getElementById('form-name').value = '';
            document.getElementById('form-phone').value = '';
            document.getElementById('form-email').value = '';
            document.getElementById('form-subject').value = '';
            document.getElementById('form-message').value = '';
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
