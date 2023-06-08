
import "./components/dialog.mjs";
const burger = document.querySelector(".burger-btn");


burger.addEventListener("click", () =>
{

    //  burger.classList.toggle('open');
});




const swiper = new Swiper('.swiper', {

    grabCursor: true,
    slidesPerView: "auto",
    freeMode: {
        enabled: true,
        sticky: true,
    },
    mousewheel: {
        releaseOnEdges: false,
    },
});
