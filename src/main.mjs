import App from "./App.svelte";


import Dialog, { Position } from "../modules/components/dialog.mjs";
import NoScroll from "../modules/components/noscroll.mjs";
import emitter from "../modules/helpers/emitter.mjs";



function initiateSwiper(el)
{

    let navigation = false, next = el.nextElementSibling;

    if (next)
    {
        navigation = {
            nextEl: next
        };
    }
    return new Swiper(el, {
        navigation,
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


}


// const swipers = [...document.querySelectorAll('.swiper')].map(initiateSwiper);

/**
 * Event listeners 
 */

let regles;


emitter('.info-btn').on('click', e =>
{
    e.preventDefault();

    if (!regles)
    {
        regles = new Dialog(
            `Le joueur doit deviner les noms de films et de séries à partir d'images grisées<br>en tappant le nom dans la zone dédiée.`,
            `Comment Jouer`
        );


        regles.canCancel = false;
        regles.position = Position.TOP;
    }


    regles.showModal();
});

/**
 * Burger button checkbox listener
 */
const burger = document.getElementById('burger-btn');


emitter(burger).on('change', e =>
{

    if (burger.checked)
    {

        NoScroll.enable();
    }
    else
    {
        NoScroll.disable();
    }

});

/**
 * Resize listener
 */
const breakpoint = matchMedia('(max-width: 992px)');

breakpoint.addEventListener('change', e =>
{

    if (!e.matches)
    {
        burger.checked = false;

        if (!(regles?.open))
        {
            NoScroll.disable();
        }

    }
});


NoScroll.on('disabled', e =>
{
    if (burger.checked && breakpoint.matches)
    {
        NoScroll.enable();
    }

});


/**
 * Handles [data-route]
 */

emitter(document.body).on("click", e =>
{
    let target = e.target.closest('[href][data-route]');

    if (target)
    {
        e.preventDefault();
        history.pushState(target.href, '', target.href);
    }
});





const app = new App({
    target: document.querySelector('main'),
    // props: {
    // 	name: 'world'
    // }
});

export default app;


console.debug(app);