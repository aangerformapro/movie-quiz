import { readable, get, writable } from 'svelte/store';
import LocalStore from './../../modules/stores/webstore';


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
                    current.set(value[0]);
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
