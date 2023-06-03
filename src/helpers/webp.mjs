import dataset from "./dataset.mjs";
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


export const WEBP_SUPPORTED = await checkWebpSupport().then(x =>
{
    dataset(document.documentElement, 'webp', x);
    return x;
});

export default checkWebpSupport;






