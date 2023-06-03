import { Progress } from "./components/loader.mjs";
import { createElement } from "./helpers/utils.mjs";
import { WEBP_SUPPORTED } from "./helpers/webp.mjs";
import { dataset } from './helpers/dataset';


const
    { body } = document,
    progress = createElement('<div class="progress w-512px mx-auto mt-5rem" data-complete="Yay!!!" ><div class="progress-bar"></div></div>'),
    line = createElement('div', {
        class: 'progress-line grow',
    }),
    g = document.querySelector('.loader-g'),
    loader = new Progress(),
    style = createElement('style');


loader
    .one('start', e =>
    {

        body.appendChild(style);
        body.appendChild(progress);

        body.appendChild(line);
    })
    .on('change', e =>
    {
        let { percentage } = e.data;

        // progress.dataset.percent = percentage;
        style.innerHTML = `:root{--progress: ${percentage};}`;
        // body.style = `--progress: ${percentage}`;

        g.dataset.percent =
            progress.firstElementChild.innerHTML =
            percentage;


        //progress.textContent = progress.style.width = percentage + '%';

    })
    .on('complete', e =>
    {
        //progress.textContent = 'Chargement fini.';
        // clearInterval(inter);
        // progress.classList.add("complete");

        loader.reset();

    });





let inter = setInterval(() =>
{
    //console.debug(loader, loader.current);
    loader.current += Math.floor(Math.random() * 7);
}, 200);

