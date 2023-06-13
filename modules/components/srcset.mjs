import { BackedEnum } from "../utils/utils.mjs";


export default class ImageType extends BackedEnum
{

    static BACKDROP = new ImageType({
        w300: '300w',
        w780: '780w',
    });
    static POSTER = new ImageType({
        w154: '154w',
        w300: '300w'
    });


    getSrcset(endpoint, prefix = '//image.tmdb.org/t/p/')
    {
        return Object.keys(this.value).map(k => prefix + k + endpoint + ' ' + this.value[k])
            .join(', ');
    }

    getUrl(endpoint, prefix = '//image.tmdb.org/t/p/')
    {
        const k = Object.keys(this.value)[1];
        return prefix + k + endpoint;
    }
}


