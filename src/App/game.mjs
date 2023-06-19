import { readable, get, writable } from 'svelte/store';
import LocalStore from './../../modules/stores/webstore';
import { isInt } from '../../modules/utils/utils.mjs';


const MOVIE_SETTINGS = ['movies', '/api/1/movies.json'];
const TV_SETTINGS = ['tv', '/api/1/tv.json'];


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

    if (!LocalStore.hasItem(MOVIE_SETTINGS[0]))
    {
        fetch(MOVIE_SETTINGS[1])
            .then(resp => resp.json()).then(value =>
            {
                set(LocalStore.setItem(MOVIE_SETTINGS[0], value));
                if (!current.get())
                {
                    current.set(value[Math.floor(Math.random() * value.length)]);
                }
            });
    }
    else
    {
        set(LocalStore.getItem(MOVIE_SETTINGS[0]));
    }


});


export const tv = readable([], (set) =>
{

    if (!LocalStore.hasItem(TV_SETTINGS[0]))
    {

        fetch(TV_SETTINGS[1])
            .then(resp => resp.json())
            .then(value =>
            {
                set(LocalStore.setItem(TV_SETTINGS[0], value));
            });

    }
    else
    {
        set(LocalStore.getItem(TV_SETTINGS[0]));
    }
});


export const current = LocalStore.hook('current');
export const found = LocalStore.hook('found', []);


export function isFound(item)
{
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