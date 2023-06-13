
/**
 * A simple router to route Static pages
 * Only route html pages
 */


const routes = new Map();


export class Route
{
    name = '';
    path = '';
    params = {};
    search = {};
    listeners = new Set();

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