

const burger = document.querySelector(".burger-btn");


burger.addEventListener("click", () =>
{

    //  burger.classList.toggle('open');
});




const swiper = new Swiper('.swiper', {
    // loop: true,
    // autoHeight: true,
    grabCursor: true,
    slidesPerView: 2,
    // autoplay: {
    //     delay: 2000,
    //     // reverseDirection: true,
    //     disableOnInteraction: false,
    //     pauseOnMouseEnter: true
    // },
    parallax: true,
    freeMode: {
        enabled: true,
        // sticky: true,
    },
    breakpoints: {
        480: {
            slidesPerView: 2
        },
        768: {
            slidesPerView: 3
        },

        992: {
            slidesPerView: 4
        },

        992: {
            slidesPerView: 5
        },
        1200: {
            slidesPerView: 6
        }

    },


});
