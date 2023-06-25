import TheMovieDatabase, { TMDB_CONFIGURATION, TMDB_IMAGES } from "./tmdb.mjs";
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from "path";

import { isArray, isEmpty } from "../utils/utils.mjs";



const ids = new Set;

const __DIR__ = path.dirname(fileURLToPath(import.meta.url));

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



(async () =>
{


    const dest = path.join(__DIR__, 'movies.json'), entries = [];


    for (let page = 1; page <= 6; page++)
    {
        const list = await TheMovieDatabase.discoverMovies(page);

        for (let item of list.results)
        {

            if (ids.has(item.id))
            {

                console.debug('doublon: ', item.title);
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

    fs.writeFileSync(dest, JSON.stringify(entries));

})();


(async () =>
{


    const dest = path.join(__DIR__, 'tv.json'), entries = [];


    for (let page = 1; page <= 6; page++)
    {
        const list = await TheMovieDatabase.discoverSeries(page);

        for (let item of list.results)
        {

            if (ids.has(item.id))
            {

                console.debug('doublon: ', item.title);
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


    fs.writeFileSync(dest, JSON.stringify(entries));

})();
