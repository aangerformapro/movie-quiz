


export const TMDB_CONFIGURATION = {
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

// const TMDB_API_SERVER = 'https://api.themoviedb.org';
export const TMDB_API_SERVER = 'http://localhost:1337';
export const TMDB_IMAGES = '//image.tmdb.org/t/p/';
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






