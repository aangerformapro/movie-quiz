import { Progress } from "./components/loader.mjs";
import { createElement } from "./helpers/utils.mjs";
import { WEBP_SUPPORTED } from "./helpers/webp.mjs";
import { dataset } from './helpers/dataset';


const
    progress = createElement('<div class="progress w-512px mx-auto mt-5rem" data-complete="Yay!!!" ><div class="progress-bar"></div></div>'),
    loader = new Progress();


loader
    .one('start', e => document.body.appendChild(progress))
    .on('change', e =>
    {
        let { percentage } = e.data;

        // progress.dataset.percent = percentage;

        progress.style = `--progress: ${percentage}`;

        progress.firstElementChild.innerHTML = percentage;


        //progress.textContent = progress.style.width = percentage + '%';

    })
    .on('complete', e =>
    {
        //progress.textContent = 'Chargement fini.';
        clearInterval(inter);
        progress.classList.add("complete");



    });





let inter = setInterval(() =>
{
    //console.debug(loader, loader.current);
    loader.current += 2.6;








}, 100);

