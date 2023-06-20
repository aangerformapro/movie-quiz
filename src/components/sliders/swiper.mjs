import Swiper from "swiper";



function initiateSwiper(el)
{

    return new Swiper(el, {
        navigation: {
            nextEl: el.nextElementSibling
        },
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

