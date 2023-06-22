
import path from 'node:path';
import fs, { writeFileSync } from 'node:fs';

import { isArray, isEmpty, isNull } from "../utils/utils.mjs";

// const TMDB_API_SERVER = 'https://api.themoviedb.org';
const TMDB_IMAGES = '//image.tmdb.org/t/p/';

const TMDB_CONFIGURATION = {
    backdrops: [
        "w300",
        "w780",
        "w1280",
        "original"
    ],

    posters: [
        "w92",
        "w154",
        "w185",
        "w342",
        "w500",
        "w780",
        "original"
    ],
    logos: [
        "w45",
        "w92",
        "w154",
        "w185",
        "w300",
        "w500",
        "original"
    ],

    backdrop_path: [
        "w300",
        "w780",
        "w1280",
        "original"
    ],
    poster_path: [
        "w92",
        "w154",
        "w185",
        "w342",
        "w500",
        "w780",
        "original"
    ],
    "profile_path": [
        "w45",
        "w185",
        "h632",
        "original"
    ],



};


// proxy overrides
const TMDB_API_SERVER = 'http://localhost:1337';
// const TMDB_IMAGES = 'http://localhost:1337';


const TMDB_FETCH_OPTIONS = {
    // no nedd for that, using a proxy
};



const buildApiUrl = (endpoint, params = {}) =>
{

    const url = new URL(TMDB_API_SERVER + endpoint);

    for (let key in params)
    {
        if (params[key])
        {
            url.searchParams.append(key, params[key]);
        }

    }
    return url;
};




const createImageUrls = (endpoints, key) =>
{


    const result = [];


    if (!key || !TMDB_CONFIGURATION[key])
    {
        throw new TypeError("invalid key");
    }

    if (!endpoints)
    {
        return result;
    }

    if (!isArray(endpoints))
    {
        endpoints = [endpoints];
    }

    for (let endpoint of endpoints)
    {
        let obj = {};


        for (let segment of TMDB_CONFIGURATION[key])
        {
            obj[segment] = TMDB_IMAGES + segment + endpoint;
        }

        result.push(obj);
    }
    return result.length === 1 ? result[0] : result;

};

const parseApiData = (data, item = {}) =>
{

    const result = {
        id: data.id,
        original_title: data.original_title ?? data.original_name,
        title: data.title ?? data.name,
        'alt': [],
        poster: createImageUrls(data.poster_path ?? item.poster_path, 'poster_path'),
        cover: createImageUrls(data.backdrop_path ?? item.backdrop_path, 'backdrop_path'),
        overview: {
            en: data.overview,
        },
        videos: [],
        cast: [],


    };

    if (data.credits)
    {
        for (let item of data.credits.cast)
        {
            result.cast.push({
                name: item.name,
                character: item.character,
                picture: createImageUrls(item.profile_path ?? null, 'profile_path'),
            });

        }
    }


    if (data.videos)
    {
        for (let item of data.videos.results)
        {

            if (item.type === 'Trailer')
            {
                result.videos.push(item);
            }
        }
    }

    if (data.alternative_titles)
    {
        for (let item of data.alternative_titles.titles ?? data.alternative_titles.results)
        {
            result.alt.push(item.title);
        }
    }

    return result;


};


export default class TheMovieDatabase
{


    static get server()
    {
        return TMDB_API_SERVER;
    }


    static get fetchApiParams()
    {
        return { ...TMDB_FETCH_OPTIONS };
    }




    static async discoverMovies(page = 1, with_origin_country = 'US|FR')
    {
        const url = buildApiUrl('/3/discover/movie', { page, sort_by: 'popularity.desc', with_origin_country });

        return await fetch(url, this.fetchApiParams).then(resp => resp.json());

    }


    static async movieList(page = 1)
    {
        const url = buildApiUrl('/3/movie/changes', { page });

        return await fetch(url, this.fetchApiParams).then(resp => resp.json());

    }


    static async discoverSeries(page = 1, with_origin_country = 'US|JP|CA')
    {

        const url = buildApiUrl('/3/discover/tv', { page, with_origin_country, sort_by: 'popularity.desc' });

        return await fetch(url, this.fetchApiParams).then(resp => resp.json());

    }

    static async tvList(page = 1)
    {
        const url = buildApiUrl('/3/tv/changes', { page });

        return await fetch(url, this.fetchApiParams).then(resp => resp.json());

    }




    static async getMovieInfos(id, language = null)
    {
        if (!id)
        {
            throw new TypeError("invalid movie id");
        }

        const endpoint = `/3/movie/${id}`;

        if (language)
        {
            return await fetch(buildApiUrl(endpoint, { language }), this.fetchApiParams).then(resp => resp.json());
        }


        return await fetch(buildApiUrl(endpoint, {
            append_to_response: [
                'alternative_titles',
                'videos',
                'credits'
                // 'images',
            ].join(',')
        }), this.fetchApiParams).then(resp => resp.json());

    }
    static async getSeriesInfos(id, language = null)
    {
        if (!id)
        {
            throw new TypeError("invalid tv id");
        }

        const endpoint = `/3/tv/${id}`;

        if (language)
        {
            return await fetch(buildApiUrl(endpoint, { language }), this.fetchApiParams).then(resp => resp.json());
        }


        return await fetch(buildApiUrl(endpoint, {
            append_to_response: [
                'alternative_titles',
                'videos',
                'credits'
                //  'images',
            ].join(',')
        }), this.fetchApiParams).then(resp => resp.json());

    }


    static async getImages(id, type = 'movie')
    {

        if (!id)
        {
            throw new TypeError("invalid tv id");
        }

        const endpoint = '/3/' + type + '/' + id + '/images';

        return await fetch(buildApiUrl(endpoint), this.fetchApiParams).then(resp => resp.json());
    }



    static getPicture(endpoint, variant)
    {
        return TMDB_IMAGES + '/' + variant + endpoint;
    }
}







const ids = new Set;





(async () =>
{


    const dest = 'public/api/1/movies.json', entries = [];


    for (let page = 1; page <= 5; page++)
    {
        const list = await TheMovieDatabase.discoverMovies(page);

        for (let item of list.results)
        {

            if (ids.has(item.id))
            {

                console.log('doublon: ', item.title);
                continue;
            }

            const data = parseApiData(await TheMovieDatabase.getMovieInfos(item.id), item),
                frData = await TheMovieDatabase.getMovieInfos(item.id, 'fr-FR');

            data.overview.fr = frData.overview;

            data.alt.unshift(data.title);
            data.title = frData.title ?? frData.name;


            if (!isEmpty(data.cover) && !isEmpty(data.poster))
            {
                entries.push(data);
                ids.add(data.id);
            }



        }

    }




    // console.debug(entries[0]);

    writeFileSync(dest, JSON.stringify(entries));

})();


(async () =>
{


    const dest = 'public/api/1/tv.json', entries = [];


    for (let page = 1; page <= 5; page++)
    {
        const list = await TheMovieDatabase.discoverSeries(page);

        for (let item of list.results)
        {

            if (ids.has(item.id))
            {

                console.log('doublon: ', item.title);
                continue;
            }

            const data = parseApiData(await TheMovieDatabase.getSeriesInfos(item.id), item),
                frData = await TheMovieDatabase.getSeriesInfos(item.id, 'fr-FR');

            data.overview.fr = frData.overview;

            data.alt.unshift(data.title);
            data.title = frData.title ?? frData.name;


            if (!isEmpty(data.cover) && !isEmpty(data.poster))
            {
                entries.push(data);
                ids.add(data.id);
            }

        }

    }


    writeFileSync(dest, JSON.stringify(entries));

})();
