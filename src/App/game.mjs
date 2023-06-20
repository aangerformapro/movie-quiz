import { derived, get, writable, readable } from 'svelte/store';
import LocalStore from './../../modules/stores/webstore.mjs';
import { BackedEnum, isArray, isEmpty, isInt, isPlainObject } from '../../modules/utils/utils.mjs';


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
        LocalStore.removeItem(MediaType.MOVIE.key);
        LocalStore.removeItem(MediaType.TV.key);
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

    let timer, fetchingMovies, fetchingSeries;
    const listener = () =>
    {


        let value = true;



        if (!isArray(get(movies)))
        {
            value = false;
            if (!fetchingMovies)
            {
                console.debug("fetching movies");
                fetchingMovies = true;
                fetch(MediaType.MOVIE.path)
                    .then(resp => resp.json())

                    .then(data =>
                    {
                        fetchingMovies = false;
                        movies.set(data);
                    });
            }
        }

        if (!isArray(get(tv)))
        {

            value = false;
            if (!fetchingSeries)
            {
                console.debug("fetching series");
                fetchingSeries = true;
                fetch(MediaType.TV.path)
                    .then(resp => resp.json())
                    .then(data =>
                    {
                        fetchingSeries = false;
                        tv.set(data);
                    });
            }
        }


        if (value)
        {
            if (!get(current))
            {
                const list = getNotFound(get(all));
                current.set(list[Math.floor(Math.random() * list.length)]);
            }
            set(value);
        }
        else
        {
            timer = setTimeout(() =>
            {
                listener();
                timer = null;
            }, 100);
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




export const movies = LocalStore.hook(MediaType.MOVIE.key);

export const tv = LocalStore.hook(MediaType.TV.key);


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

