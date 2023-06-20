import { readable, get, writable } from 'svelte/store';
import LocalStore from './../../modules/stores/webstore.mjs';
import { BackedEnum, isInt, isPlainObject } from '../../modules/utils/utils.mjs';


const MOVIE_SETTINGS = ['movies', '/api/1/movies.json'];
const TV_SETTINGS = ['tv', '/api/1/tv.json'];


const API_PATH = '/api/1';



/**
 * Enum for media type
 */
export class MediaType extends BackedEnum
{


    static ALL = new MediaType("all");
    static MOVIE = new MediaType("movie");
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
 * Data is Ready ?
 */
export const ready = writable(false, set =>
{

    let timer;
    const listener = () =>
    {

        let value = LocalStore.hasItem(MOVIE_SETTINGS[0]) && LocalStore.hasItem(TV_SETTINGS[0]);
        if (value)
        {
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
            }, 20);
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


export const movies = readable([], (set) =>
{

    const { key, path } = MediaType.Movie;

    if (!LocalStore.hasItem(key))
    {
        fetch(path)
            .then(resp => resp.json()).then(value =>
            {
                set(LocalStore.setItem(key, value));
                current.set(value[Math.floor(Math.random() * value.length)]);
            });
    }
    else
    {
        set(LocalStore.getItem(key));
    }


});


export const tv = readable([], (set) =>
{

    const { key, path } = MediaType.TV;

    if (!LocalStore.hasItem(key))
    {
        fetch(path)
            .then(resp => resp.json()).then(value =>
            {
                set(LocalStore.setItem(key, value));
            });
    }
    else
    {
        set(LocalStore.getItem(key));
    }
});




export const current = LocalStore.hook('current');
export const found = LocalStore.hook('found', []);


export function isFound(item)
{
    item = getItem(item);
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

export function getEntry(id)
{
    if (!get(ready))
    {
        return null;
    }

    if (isPlainObject(id))
    {
        return item.id ? item : null;
    }

    return get(movies).find(item => item.id === id) ?? get(tv).find(item => item.id === id) ?? null;
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