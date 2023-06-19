
import path from 'node:path';
import fs, { writeFileSync } from 'node:fs';

import { isArray } from "../utils/utils.mjs";

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
    ]



};


// proxy overrides
const TMDB_API_SERVER = 'http://localhost:1337';
// const TMDB_IMAGES = 'http://localhost:1337';


const TMDB_FETCH_OPTIONS = {
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MWJkN2U3NDNlMDYwYWQzMGU2ODBlZjRiOGFmMjIyNSIsInN1YiI6IjY0ODA5OTExZDJiMjA5MDBjYTFjZWRiNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Q6FCh2KuPVfCg_YaSGwa2DqTA0wy0TKsMF9Rp1AUOOo'
    }
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
    return result;

};

const parseApiData = (data) =>
{

    const result = {
        id: data.id,
        original_title: data.original_title ?? data.original_name,
        title: data.title ?? data.name,
        'alt': [],
        poster: createImageUrls(data.poster_path, 'poster_path'),
        cover: createImageUrls(data.backdrop_path, 'backdrop_path'),
        overview: {
            en: data.overview,
        },
        videos: [],


    };

    for (let item of data.videos.results)
    {

        if (item.type === 'Trailer')
        {
            result.videos.push(item);
        }
    }

    for (let item of data.alternative_titles.titles ?? data.alternative_titles.results)
    {
        result.alt.push(item.title);
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
        const url = buildApiUrl('/3/discover/movie', { page });

        return await fetch(url, this.fetchApiParams).then(resp => resp.json());

    }



    static async discoverSeries(page = 1, with_origin_country = 'US|JP|KR|FR|CA')
    {

        const url = buildApiUrl('/3/discover/tv', { page, with_origin_country });

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
                //  'images',
            ].join(',')
        }), this.fetchApiParams).then(resp => resp.json());

    }





    static getPicture(endpoint, variant)
    {
        return TMDB_IMAGES + '/' + variant + endpoint;
    }
}












(async () =>
{


    const dest = 'public/api/1/movies.json', entries = [];


    for (let page = 1; page <= 3; page++)
    {
        const list = await TheMovieDatabase.discoverMovies(page);

        for (let item of list.results)
        {

            const data = parseApiData(await TheMovieDatabase.getMovieInfos(item.id)),
                frData = await TheMovieDatabase.getMovieInfos(item.id, 'fr-FR');

            data.overview.fr = frData.overview;



            entries.push(data);

        }

    }

    writeFileSync(dest, JSON.stringify(entries));

})();


(async () =>
{


    const dest = 'public/api/1/tv.json', entries = [];


    for (let page = 1; page <= 3; page++)
    {
        const list = await TheMovieDatabase.discoverSeries(page);

        for (let item of list.results)
        {

            const data = parseApiData(await TheMovieDatabase.getSeriesInfos(item.id)),
                frData = await TheMovieDatabase.getSeriesInfos(item.id, 'fr-FR');

            data.overview.fr = frData.overview;



            entries.push(data);

        }

    }

    writeFileSync(dest, JSON.stringify(entries));

})();
