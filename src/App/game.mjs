import { derived, get, writable, readable } from 'svelte/store';
import { WebStore } from './../../modules/stores/webstore.mjs';
import { BackedEnum, isArray, isInt, isPlainObject, removeAccent } from '../../modules/utils/utils.mjs';




export const
    BASE = document.querySelector('base').getAttribute('href').slice(0, -1),
    API_PATH = BASE + '/api/1',
    BUILD_DATE = '[VI]{date}[/VI]',
    LocalStore = new WebStore(localStorage, 'MovieQuiz'),
    SessionStore = new WebStore(sessionStorage, 'MovieQuiz');



/**
 * Enum for media type
 */
export class MediaType extends BackedEnum
{

    static ALL = new MediaType("all");
    static MOVIE = new MediaType("movies");
    static TV = new MediaType("tv");





    get route()
    {
        return '/' + this.value;
    }

    get path()
    {
        return API_PATH + '/' + this.value + '.json';
    }

    get key()
    {
        return this.value;
    }

    get hook()
    {
        return MediaTypeMap.get(this);
    }

    get list()
    {
        return get(this.hook);
    }

    get found()
    {
        return getFound(this.list);
    }

    get notFound()
    {
        return getNotFound(this.list);
    }

}

export const NOPIC = './assets/pictures/nopic.webp';


export const todisplay = LocalStore.hook('todisplay', 20);






/**
 * Version control api using (clears localstorage sync for code compatibility, but keep results found)
 * @link https://www.npmjs.com/package/rollup-plugin-version-injector
 */
(() =>
{
    if (LocalStore.getItem('BuildDate') !== BUILD_DATE)
    {
        // DB
        LocalStore.removeItem(MediaType.MOVIE.key);
        LocalStore.removeItem(MediaType.TV.key);
        LocalStore.removeItem('current');

        // Session hooks
        SessionStore.removeItem('started');
        SessionStore.removeItem('streak');


        // sync
        LocalStore.setItem('BuildDate', BUILD_DATE);
        console.debug('Storage reset folowing base code update.');
    }

})();



/**
 * Session is new?
 * Used to play intro
 */
export const SessionStarted = SessionStore.hook("started", false);

/**
 * Winning streak
 */
export const WinningStreak = SessionStore.hook('streak', 0);

WinningStreak.increment = function ()
{
    this.update(n => n + 1);
};

WinningStreak.decrement = function ()
{
    this.update(n => n - 1);
};

WinningStreak.clear = function ()
{
    this.set(0);
};


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
                current.set(getRandom(getNotFound(get(all)), 1)[0]);
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

movies.notFound = derived([movies, found], ([$movies, $found]) =>
{
    return $movies.filter(item => !$found.includes(item.id));
});


movies.found = derived([movies, found], ([$movies, $found]) =>
{
    return $movies.filter(item => $found.includes(item.id));
});


tv.notFound = derived([tv, found], ([$tv, $found]) =>
{
    return $tv.filter(item => !$found.includes(item.id));
});


tv.found = derived([tv, found], ([$tv, $found]) =>
{
    return $tv.filter(item => $found.includes(item.id));
});

/**
 * A map of the mediatypes hooks
 */

const MediaTypeMap = new Map([
    [MediaType.ALL, all],
    [MediaType.MOVIE, movies],
    [MediaType.TV, tv]
]);


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

export const notify = writable(Notification.NONE, set => set(Notification.NONE));


export function isFound(item)
{
    item = getEntry(item);
    return get(found).includes(item.id);
}


export function setFound(item)
{
    found.update(value =>
    {
        item = isInt(item) ? item : item.id;
        if (!value.includes(item))
        {
            value.push(item);
        }
        return value;
    });
}

/**
 * Last Found / current if not
 */
export function getLastFound()
{
    return getEntry(get(found).slice(-1)[0]) ?? getRandom(get(all), 1)[0];
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
    if (!howMuch || !list.length || list.length < howMuch)
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

    const result = ["we are anonymous"];
    item = getEntry(item);

    if (item && item.alt)
    {
        result.push(item.title, item.original_title, ...item.alt);
    }

    return result.map(str => removeAccent(str.toLowerCase()));
}



function getYoutubeId(item)
{

    item = getEntry(item);

    if (item && item.videos && item.videos.length)
    {
        for (let entry of item.videos)
        {
            if (entry.site.toLowerCase() === 'youtube')
            {
                return entry.key;
            }
        }
    }


    return null;
}




export function getYoutubeUrl(item)
{
    let vid = getYoutubeId(item);
    return vid ? new URL('https://www.youtube.com/watch?v=' + vid) : null;
}

/**
 * @link https://support.google.com/youtube/answer/171780?hl=en#zippy=%2Cmake-an-embedded-video-play-automatically%2Cadd-captions-to-an-embedded-video%2Cturn-on-privacy-enhanced-mode
 */
export function getEmbedHtml(item)
{

    let vid = getYoutubeId(item);
    if (vid)
    {
        // 960x540
        return `<iframe width="960" height="540" src="https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&cc_load_policy=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    }

    return null;
}

export const validResults = derived(current, $current => getAvailableTitles($current));