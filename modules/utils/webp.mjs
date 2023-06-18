import ElementFinder from "../components/elementfinder.mjs";
import dataset from "./dataset.mjs";
import emitter from "./emitter.mjs";
import { isBool } from "./utils.mjs";

let cache;

/**
 * @link https://stackoverflow.com/questions/5573096/detecting-webp-support
 */
export function checkWebpSupport()
{
    return new Promise(res =>
    {

        if (isBool(cache))
        {
            return resolve(cache);
        }

        const webP = new Image();
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        webP.onload = webP.onerror = () =>
        {
            res(cache = webP.height === 2);
        };

    });
};

export default checkWebpSupport;


export function autoLoadAlternatives(extension = '.png')
{
    if (!extension.startsWith("."))
    {
        extension = '.' + extension;
    }


    ElementFinder('img[src$=".webp"]', img =>
    {
        emitter(img).on('load', () =>
        {
            img.classList.remove('img-loading');
        }).one('error', () =>
        {

            img.classList.add('img-loading');

            if (img.dataset.src)
            {
                img.src = img.dataset.src;
            } else
            {
                img.src = img.src.replace(/\.webp$/, extension);
            }

        });
    });
}












