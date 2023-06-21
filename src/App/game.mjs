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

export const NOPIC = './assets/pictures/nopic.webp';

export const settings = LocalStore.hook('settings', {
    notFoundToDisplay: 20,
});




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


/**
 * LocalStore data hooks
 */

export const movies = LocalStore.hook(MediaType.MOVIE.key);
export const tv = LocalStore.hook(MediaType.TV.key);
// export const current = LocalStore.hook('current');

export const current = writable(null);
export const found = LocalStore.hook('found', []);

/**
 * Merged series and movies
 */
export const all = derived(
    [movies, tv],
    ([$movies, $tv]) => [...$movies, ...$tv]
);


/**
 * Notification control
 */

export class Notification
{
    static NONE = new Notification(0);
    static SUCCESS = new Notification(1);
    static FAILURE = new Notification(2);

    display()
    {
        notify.set(this);
    }
}

export const notify = writable(Notification.NONE);


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

/**
 * Last Found / current if not
 */
export function getLastFound()
{
    let found = getFound(get(all));
    return found[found.length - 1] ?? get(current);
}

export function getFound(items)
{
    return items.filter(item => isFound(item));
}


export function getNotFound(items)
{
    return items.filter(item => !isFound(item));
}


export function getRandom(list, howMuch)
{
    if (!howMuch || list.length < howMuch)
    {
        return list;
    }
    // do not destroy the original
    const result = [], copy = [...list];

    while (result.length < howMuch)
    {
        let index = Math.floor(Math.random() * copy.length);
        result.push(copy[index]);
        copy.splice(index, 1);
    }
    return result;
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



export function getAvailableTitles(item)
{

    const result = [];
    item = getEntry(item);




    return result;
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

