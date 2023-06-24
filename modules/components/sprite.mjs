
/**
 * Material Design Custom SVG Sprite
 */
const parser = document.createElement('div');
parser.innerHTML = `<svg width="0" height="0" style="display: none;" id="ng-sprite"></svg>`;

// generate the shadowroot
const sprite = document.querySelector('#ng-sprite') ?? parser.removeChild(parser.firstChild);

// all the icons that can be injected
const icons = {"ng-cancel":{"symbol":"<symbol id=\"ng-cancel\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m330-288 150-150 150 150 42-42-150-150 150-150-42-42-150 150-150-150-42 42 150 150-150 150 42 42ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-cancel\"></use></svg>"},"ng-check-circle":{"symbol":"<symbol id=\"ng-check-circle\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m421-298 283-283-46-45-237 237-120-120-45 45 165 166Zm59 218q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-check-circle\"></use></svg>"},"ng-chevron-right":{"symbol":"<symbol id=\"ng-chevron-right\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m375-240-43-43 198-198-198-198 43-43 241 241-241 241Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-chevron-right\"></use></svg>"},"ng-close":{"symbol":"<symbol id=\"ng-close\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-close\"></use></svg>"},"ng-done":{"symbol":"<symbol id=\"ng-done\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-done\"></use></svg>"},"ng-emoji-events":{"symbol":"<symbol id=\"ng-emoji-events\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M450-180v-148q-54-11-96-46.5T296-463q-74-8-125-60t-51-125v-44q0-24.75 17.625-42.375T180-752h104v-28q0-24.75 17.625-42.375T344-840h272q24.75 0 42.375 17.625T676-780v28h104q24.75 0 42.375 17.625T840-692v44q0 73-51 125t-125 60q-16 53-58 88.5T510-328v148h122q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T632-120H328q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T328-180h122ZM284-526v-166H180v44q0 45 29.5 78.5T284-526Zm196.235 141Q537-385 576.5-424.958 616-464.917 616-522v-258H344v258q0 57.083 39.735 97.042Q423.471-385 480.235-385ZM676-526q45-10 74.5-43.5T780-648v-44H676v166Zm-196-57Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-emoji-events\"></use></svg>"},"ng-help":{"symbol":"<symbol id=\"ng-help\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M484-247q16 0 27-11t11-27q0-16-11-27t-27-11q-16 0-27 11t-11 27q0 16 11 27t27 11Zm-35-146h59q0-26 6.5-47.5T555-490q31-26 44-51t13-55q0-53-34.5-85T486-713q-49 0-86.5 24.5T345-621l53 20q11-28 33-43.5t52-15.5q34 0 55 18.5t21 47.5q0 22-13 41.5T508-512q-30 26-44.5 51.5T449-393Zm31 313q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-help\"></use></svg>"},"ng-info":{"symbol":"<symbol id=\"ng-info\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M453-280h60v-240h-60v240Zm26.982-314q14.018 0 23.518-9.2T513-626q0-14.45-9.482-24.225-9.483-9.775-23.5-9.775-14.018 0-23.518 9.775T447-626q0 13.6 9.482 22.8 9.483 9.2 23.5 9.2Zm.284 514q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80-397.681 80-480.5q0-82.819 31.5-155.659Q143-709 197.5-763t127.341-85.5Q397.681-880 480.5-880q82.819 0 155.659 31.5Q709-817 763-763t85.5 127Q880-563 880-480.266q0 82.734-31.5 155.5T763-197.684q-54 54.316-127 86Q563-80 480.266-80Zm.234-60Q622-140 721-239.5t99-241Q820-622 721.188-721 622.375-820 480-820q-141 0-240.5 98.812Q140-622.375 140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-info\"></use></svg>"},"ng-play-arrow":{"symbol":"<symbol id=\"ng-play-arrow\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M0 0h24v24H0z\" fill=\"none\"></path>\n<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M8 5v14l11-7z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-play-arrow\"></use></svg>"},"ng-volume-off":{"symbol":"<symbol id=\"ng-volume-off\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M0 0h24v24H0z\" fill=\"none\"></path>\n<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-volume-off\"></use></svg>"},"ng-volume-up":{"symbol":"<symbol id=\"ng-volume-up\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M0 0h24v24H0z\" fill=\"none\"></path>\n<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-volume-up\"></use></svg>"}};
// inject the root element once
let init = sprite.parentElement !== null;

// generate xlink that can be used on the fly
function generateSVG(code, size, color)
{
    parser.innerHTML = code;
    const elem = parser.removeChild(parser.firstChild);
    if(size){
        elem.setAttribute('width', '' + size);
        elem.setAttribute('height', '' + size);
    }
    if(color) {
        elem.setAttribute('fill', color);
    }
    return elem;
}


function isElement(elem)
{
    return !!(elem instanceof Object && elem.querySelector);
}

function loadSprite(id)
{
    if (id && icons[id] && icons[id].symbol)
    {

        if (!init)
        {
            // inject shadowroot
            document.documentElement.appendChild(sprite);
        }

        if(!sprite.querySelector('#' + id)){
            // inject symbol
            sprite.innerHTML += icons[id].symbol;
        }

        delete icons[id].symbol;
    }
}



// Easy to inject icon class
class Xlink
{

    get id()
    {
        return this._id;
    }

    get template()
    {
        return icons[this.id].xlink;
    }


    appendTo(parent, size, color)
    {
        if (isElement(parent))
        {
            parent.appendChild(this.generate(size, color));
        }
    }
    prependTo(parent, size, color)
    {
        if (isElement(parent))
        {
            parent.insertBefore(this.generate(size, color), parent.firstElementChild);
        }
    }
    insertBefore(sibling, size, color)
    {
        if (isElement(sibling))
        {
            sibling.parentElement?.insertBefore(this.generate(size, color), sibling);
        }
    }

    generate(size, color)
    {
        loadSprite(this.id);
        return generateSVG(this.template, size, color);
    }

    constructor(id)
    {
        this._id = id;
    }

}

//render sprite (for ssr)
export function render(){
    return sprite.outerHTML;
}



export function loadAll(){
    for(let id of Object.keys(icons)){
        loadSprite(id);
    }
}


// generate xlinks
export const ng_cancel = new Xlink('ng-cancel');
export const ng_check_circle = new Xlink('ng-check-circle');
export const ng_chevron_right = new Xlink('ng-chevron-right');
export const ng_close = new Xlink('ng-close');
export const ng_done = new Xlink('ng-done');
export const ng_emoji_events = new Xlink('ng-emoji-events');
export const ng_help = new Xlink('ng-help');
export const ng_info = new Xlink('ng-info');
export const ng_play_arrow = new Xlink('ng-play-arrow');
export const ng_volume_off = new Xlink('ng-volume-off');
export const ng_volume_up = new Xlink('ng-volume-up');

// creates naming map
const names = [    ['ng-cancel', 'ng_cancel'],
    ['ng-check-circle', 'ng_check_circle'],
    ['ng-chevron-right', 'ng_chevron_right'],
    ['ng-close', 'ng_close'],
    ['ng-done', 'ng_done'],
    ['ng-emoji-events', 'ng_emoji_events'],
    ['ng-help', 'ng_help'],
    ['ng-info', 'ng_info'],
    ['ng-play-arrow', 'ng_play_arrow'],
    ['ng-volume-off', 'ng_volume_off'],
    ['ng-volume-up', 'ng_volume_up'],
];

// generate default export
export const svgs = {
    ng_cancel,
    ng_check_circle,
    ng_chevron_right,
    ng_close,
    ng_done,
    ng_emoji_events,
    ng_help,
    ng_info,
    ng_play_arrow,
    ng_volume_off,
    ng_volume_up,
};
export default svgs;

//watch dom for icons to add
const
    selector = 'i[class^="ng-"]',
    nodes = new Set(),
    watcher = (elem) =>
    {
        return () =>
        {
            for (let target of [...elem.querySelectorAll(selector)])
            {

                if (nodes.has(target))
                {
                    continue;
                }
                nodes.add(target);

                // creates the icon and remove the node
                const
                    id = target.className.split(' ')[0],
                    [, name] = names.find(item => item[0] === id) ?? ['', ''];


                if (name && svgs[name])
                {
                    let size = target.getAttribute("size"), color = target.getAttribute("color");

                    svgs[name].insertBefore(target, size, color);
                }

                target.parentElement?.removeChild(target);
            }
        };
    };






export function watch(elem)
{
    elem ??= document.body;
    const
        fn = watcher(elem),
        observer = new MutationObserver(fn);

    fn();
    observer.observe(elem, {
        attributes: true, childList: true, subtree: true
    });
    return () =>
    {
        observer.disconnect();
    };
}


export const unwatch = watch();

