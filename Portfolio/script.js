/* =========================
   PRELOADER
========================= */

window.addEventListener("load", () => {

    const preloader = document.querySelector(".preloader");

    setTimeout(() => {
        preloader.classList.add("hide");
    }, 500);

});


/* =========================
   MOBILE MENU
========================= */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {

    navMenu.classList.toggle("open");

    const icon = menuToggle.querySelector("i");

    if (navMenu.classList.contains("open")) {

        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");

    } else {

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    }

});


/* Close menu when clicking a link */

document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("open");

        const icon = menuToggle.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});


/* =========================
   TYPING EFFECT
========================= */

const typingText = document.getElementById("typingText");

const words = [
    "modern websites.",
    "responsive interfaces.",
    "interactive experiences.",
    "clean frontend solutions."
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;


function typeEffect() {

    const currentWord = words[wordIndex];

    if (!deleting) {

        typingText.textContent =
            currentWord.substring(0, charIndex + 1);

        charIndex++;

        if (charIndex === currentWord.length) {

            deleting = true;

            setTimeout(typeEffect, 1600);

            return;
        }

    } else {

        typingText.textContent =
            currentWord.substring(0, charIndex - 1);

        charIndex--;

        if (charIndex === 0) {

            deleting = false;

            wordIndex =
                (wordIndex + 1) % words.length;

        }

    }

    setTimeout(
        typeEffect,
        deleting ? 45 : 80
    );

}

typeEffect();


/* =========================
   DARK / LIGHT THEME
========================= */

const themeToggle =
    document.getElementById("themeToggle");

const savedTheme =
    localStorage.getItem("portfolio-theme");


if (savedTheme === "light") {

    document.body.classList.add("light");

    themeToggle.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

}


themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light");

    const isLight =
        document.body.classList.contains("light");

    localStorage.setItem(
        "portfolio-theme",
        isLight ? "light" : "dark"
    );

    themeToggle.innerHTML = isLight

        ? '<i class="fa-solid fa-sun"></i>'

        : '<i class="fa-solid fa-moon"></i>';

});


/* =========================
   SCROLL REVEAL
========================= */

const revealElements =
    document.querySelectorAll(".reveal");


const observer =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    observer.unobserve(entry.target);

                }

            });

        },

        {
            threshold: 0.12
        }

    );


revealElements.forEach(element => {

    observer.observe(element);

});


/* =========================
   ACTIVE NAVIGATION
========================= */

const sections =
    document.querySelectorAll("section[id]");

const navLinks =
    document.querySelectorAll(".nav-link");


window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        const sectionHeight =
            section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {

            current = section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${current}`
        ) {

            link.classList.add("active");

        }

    });

});


/* =========================
   BACK TO TOP
========================= */

const backToTop =
    document.getElementById("backToTop");


window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        backToTop.classList.add("show");

    } else {

        backToTop.classList.remove("show");

    }

});


backToTop.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


/* =========================
   CONTACT FORM VALIDATION
========================= */

const contactForm =
    document.getElementById("contactForm");


contactForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const name =
        document.getElementById("name");

    const email =
        document.getElementById("email");

    const subject =
        document.getElementById("subject");

    const message =
        document.getElementById("message");


    const nameError =
        document.getElementById("nameError");

    const emailError =
        document.getElementById("emailError");

    const subjectError =
        document.getElementById("subjectError");

    const messageError =
        document.getElementById("messageError");

    const formSuccess =
        document.getElementById("formSuccess");


    /* Clear previous messages */

    nameError.textContent = "";
    emailError.textContent = "";
    subjectError.textContent = "";
    messageError.textContent = "";
    formSuccess.textContent = "";


    let valid = true;


    /* Name validation */

    if (name.value.trim() === "") {

        nameError.textContent =
            "Please enter your name.";

        valid = false;

    } else if (name.value.trim().length < 2) {

        nameError.textContent =
            "Name must contain at least 2 characters.";

        valid = false;

    }


    /* Email validation */

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (email.value.trim() === "") {

        emailError.textContent =
            "Please enter your email.";

        valid = false;

    } else if (!emailPattern.test(email.value.trim())) {

        emailError.textContent =
            "Please enter a valid email.";

        valid = false;

    }


    /* Subject */

    if (subject.value.trim() === "") {

        subjectError.textContent =
            "Please enter a subject.";

        valid = false;

    }


    /* Message */

    if (message.value.trim() === "") {

        messageError.textContent =
            "Please enter your message.";

        valid = false;

    } else if (message.value.trim().length < 10) {

        messageError.textContent =
            "Message should contain at least 10 characters.";

        valid = false;

    }


    /* Success */

    if (valid) {

        formSuccess.textContent =
            "✓ Message validated successfully!";

        contactForm.reset();

    }

});


/* =========================
   CURRENT YEAR
========================= */

document.getElementById("year").textContent =
    new Date().getFullYear();