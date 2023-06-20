/**
 * Hook for swiper automount
 */
import Swiper, { Navigation, FreeMode, Mousewheel } from "swiper";



const DEFAULT_OPTIONS = {
    modules: [Navigation, FreeMode, Mousewheel],
    // grabCursor: true,
    slidesPerView: "auto",
    freeMode: {
        enabled: true,
        sticky: true,
    },
    mousewheel: {
        releaseOnEdges: false,
    },
};





export default function initiateSwiper(el)
{

    const instance = new Swiper(el, {
        navigation: {
            nextEl: el.nextElementSibling
        },
        ...DEFAULT_OPTIONS
    });


    instance.on('touchMove', () => el.classList.add('moving'));
    instance.on('touchEnd', () => el.classList.remove('moving'));


    return {
        destroy()
        {
            instance.destroy();
        }
    };
}

