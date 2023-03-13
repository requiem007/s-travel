// slider

const swiper = new Swiper(".image__slider", {
    // Optional parameters
    direction: "horizontal",
    slidesPerView: 1,
    loop: true,

    // Navigation arrows
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    grabCursor: true,
    autoHeight: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    speed: 1500,
    effect: "fade",
});

// modal

const booking = document.querySelectorAll(".booking");
const body = document.querySelector("body");
const popup = document.querySelector(".popup");
const btnCloseModal = document.querySelector(".close__popup");
const popupContent = document.querySelector(".popup__content");
const lockPadding = document.querySelectorAll(".lock-padding");
const popupBody = document.querySelector(".popup__body");

let unlock = true;
const timeout = 400;

if (booking.length > 0) {
    booking.forEach((book) =>
        book.addEventListener("click", function () {
            const currentPopup = document.getElementById("popup");
            popupOpen(currentPopup);
        })
    );
}

const popupCloseIcon = document.querySelectorAll(".close");
if (popupCloseIcon.length > 0) {
    popupCloseIcon.forEach((closeIcon) =>
        closeIcon.addEventListener("click", function () {
            popupClose(closeIcon.closest(".popup"));
        })
    );
}

function popupOpen(currentPopup) {
    if (currentPopup && unlock) {
        const popupActive = document.querySelector(".popup.open");
        popupActive ? popupClose(popupActive, false) : bodyLock();

        currentPopup.classList.add("open");
        currentPopup.addEventListener("click", function (e) {
            if (!e.target.closest(".popup__content")) {
                popupClose(e.target.closest(".popup"));
            }
        });
    }
}

function popupClose(popupActive, doUnlock = true) {
    if (unlock) {
        popupActive.classList.remove("open");
        form.reset();
        popupBody.classList.remove("sending");
        if (doUnlock) {
            bodyUnlock();
        }
    }
}

function bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";

    body.style.paddingRight = lockPaddingValue;
    body.classList.add("lock");

    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

function bodyUnlock() {
    setTimeout(function () {
        body.style.paddingRight = "0px";
        body.classList.remove("lock");
    }, timeout);

    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        const popupActive = document.querySelector(".popup.open");
        popupClose(popupActive);
    }
});

// form

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form");
    form.addEventListener("submit", formSend);

    async function formSend(e) {
        e.preventDefault();

        let error = formValidate(form);

        let formData = new FormData(form);

        if (error === 0) {
            popupBody.classList.add("sending");
            let response = await fetch("sendmail.php", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                let result = await response.json();
                console.log(result.message);
                form.reset();
                popupBody.classList.remove("sending");
            } else {
                console.log("mistake");
                popupBody.classList.remove("sending");
            }
        } else {
        }
    }

    function formValidate(form) {
        let error = 0;
        let formRequired = document.querySelectorAll("._req");

        formRequired.forEach((input) => {
            formRemoveError(input);
            console.log(input);

            if (input.classList.contains("_email")) {
                if (isValidEmail(input)) {
                    formAddError(input);
                    error++;
                }
            } else {
                if (input.value === "") {
                    formAddError(input);
                    error++;
                }
            }
        });
        return error;
    }

    function formAddError(input) {
        input.parentElement.classList.add("_error");
        input.classList.add("_error");
    }
    function formRemoveError(input) {
        input.parentElement.classList.remove("_error");
        input.classList.remove("_error");
    }

    // email validate
    function isValidEmail(input) {
        return !/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(input.value);
    }
});

// burger

const burgerIcon = document.querySelector(".icon-menu");
const menuBody = document.querySelector(".header__list");

if (burgerIcon) {
    burgerIcon.addEventListener("click", function (e) {
        document.body.classList.toggle("lock");
        burgerIcon.classList.toggle("menu-open");
        menuBody.classList.toggle("menu-open");
    });
}
//плавная прокрутка по клику

const menuLinks = document.querySelectorAll(".header__link[data-goto]"); //собрал в массив все ссылки с дата-атрибутов data-goto
console.log(menuLinks);
if (menuLinks.length > 0) {
    menuLinks.forEach((menuLink) => {
        menuLink.addEventListener("click", onMenuLinkClick);
    });
}
function onMenuLinkClick(e) {
    const menuLink = e.target;
    if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
        const gotoBlock = document.querySelector(menuLink.dataset.goto);
        if (burgerIcon.classList.contains("menu-open")) {
            document.body.classList.remove("lock");
            burgerIcon.classList.remove("menu-open");
            menuBody.classList.remove("menu-open");
        }

        gotoBlock.scrollIntoView({ behavior: "smooth" });
        e.preventDefault();
    }
}
