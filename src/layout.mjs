
import Dialog, { Position } from "./components/dialog.mjs";
import NoScroll from "./components/noscroll.mjs";
import emitter from "./helpers/emitter.mjs";

const breakpoint = matchMedia('(max-width: 992px)');

const swipers = [...document.querySelectorAll('.swiper')].map(el =>
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



});





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





