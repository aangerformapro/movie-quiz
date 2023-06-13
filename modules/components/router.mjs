



const routes = new Map();


export class Route
{
    name = '';
    path = '';
    params = {};
    search = {};






}


export default class Router
{


    get routes()
    {
        return routes.get(this);
    }


    get(path, fn)
    {

    }


    urlFor(/** @param {string} */name, params = {})
    {

    }




}