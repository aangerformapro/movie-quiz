import { derived, get, writable, readable } from 'svelte/store';
import LocalStore from './../../modules/stores/webstore.mjs';
import { BackedEnum, isEmpty, isInt, isPlainObject } from '../../modules/utils/utils.mjs';


const API_PATH = '/api/1', BUILD_DATE = '[VI]{date}[/VI]';



/**
 * Enum for media type
 */
export class MediaType extends BackedEnum
{

    static ALL = new MediaType("all");
    static MOVIE = new MediaType("movies");
    static TV = new MediaType("tv");

    get path()
    {
        return API_PATH + '/' + this.value + '.json';
    }

    get key()
    {
        return this.value;
    }
}



/**
 * Version control api using (clears localstorage sync for code compatibility, but keep results found)
 * @link https://www.npmjs.com/package/rollup-plugin-version-injector
 */
(() =>
{
    if (LocalStore.getItem('BuildDate') !== BUILD_DATE)
    {
        LocalStore.removeItem(MediaType.MOVIE.value);
        LocalStore.removeItem(MediaType.TV.value);
        LocalStore.removeItem('current');
        LocalStore.setItem('BuildDate', BUILD_DATE);
        console.debug('Storage reset flowing base code update.');
    }

})();






/**
 * Data is Ready ?
 */
export const ready = writable(false, set =>
{

    let timer;
    const listener = () =>
    {

        let value = !isEmpty(movies.get()) && !isEmpty(tv.get());

        if (value)
        {
            if (!current.get())
            {
                const list = getNotFound(movies.get());
                current.set(list[Math.floor(Math.random() * list.length)]);
            }
            set(value);
        }
        else
        {
            get(tv);
            get(movies);
            timer = setTimeout(() =>
            {
                listener();
                timer = null;
            }, 50);
        }

    };


    listener();

    return () =>
    {
        if (timer)
        {
            clearTimeout(timer);
        }
    };

});




export const movies = LocalStore.hook(
    MediaType.MOVIE.key,
    () => fetch(MediaType.MOVIE.path).then(resp => resp.json())
);

export const tv = LocalStore.hook(
    MediaType.TV.key,
    () => fetch(MediaType.TV.path).then(resp => resp.json())
);


export const current = LocalStore.hook('current');
export const found = LocalStore.hook('found', []);

/**
 * Merged series and movies
 */
export const all = derived(
    [movies, tv],
    ([$movies, $tv]) => [...$movies, ...$tv]
);


export function isFound(item)
{
    item = getEntry(item);
    return get(found).includes(item.id);
}


export function setFound(item)
{
    found.update(value =>
    {
        value.push(
            isInt(item) ? item : item.id
        );

        return value;
    });
}


export function getFound(items)
{
    return items.filter(item => isFound(item));
}


export function getNotFound(items)
{
    return items.filter(item => !isFound(item));
}

/**
 * Get item using id
 */
export function getEntry(id)
{

    if (isPlainObject(id))
    {
        return id.id ? id : null;
    }

    return get(all).find(item => item.id === id) ?? null;
}


export function getYoutubeUrl(item)
{

    if (isInt(item))
    {
        item = getEntry(item);
    }
    if (item && item.videos && item.videos.length)
    {
        for (let entry of item.videos)
        {
            if (entry.site.toLowerCase() === 'youtube')
            {
                return new URL('https://www.youtube.com/watch?v=' + entry.key);
            }
        }
    }


    return null;
}

