
import "./components/dialog.mjs";
import { close } from './components/sprite.mjs';
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



// close.attachTo(document.querySelector('dialog'));

// close.setAttributes({
//     style: 'height: 90vh;'
// });



let d = document.querySelector('dialog');


// dialogPolyfill.forceRegisterDialog(d);

// d.showModal();

// console.dir(d);

// d.onclick = e => console.dir(e);

// d.showModal();
// d.show();