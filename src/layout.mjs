
import Dialog, { Position } from "./components/dialog.mjs";





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



let regles;

document.querySelector('.info-btn').addEventListener("click", e =>
{
    e.preventDefault();

    regles ??= new Dialog(
        `Le joueur doit deviner les noms de films et de séries à partir d'images grisées<br>en tappant le nom dans la zone dédiée.`,
        `Comment Jouer`
    );


    regles.canCancel = false;
    regles.position = Position.TOP;
    regles.showModal();
});





