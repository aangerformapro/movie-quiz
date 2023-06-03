import EventManager from "./event-manager.mjs";
import { BackedEnum, isArray, isElement, isValidSelector } from "./utils.mjs";



// initial scroll
const scrollPos = {
    x: scrollX,
    y: scrollY,
};

let scrollingIntoView = false;
/**
 * Enum Direction
 * @link https://www.sohamkamani.com/javascript/enums/
 */
export class Direction extends BackedEnum
{
    static Top = new Direction("top");
    static Bottom = new Direction("bottom");
    static Left = new Direction("left");
    static Right = new Direction("right");

}


export class ScrollDelta
{


    get x()
    {
        return this.#x;
    }

    get y()
    {
        return this.#y;
    }

    get direction()
    {

        if (this.#x > 0)
        {
            return Direction.Right;
        }

        if (this.#x < 0)
        {
            return Direction.Left;
        }

        if (this.#y > 0)
        {
            return Direction.Bottom;
        }

        if (this.#y < 0)
        {
            return Direction.Top;
        }

        return null;
    }

    #x = 0;
    #y = 0;
    listener;

    #attached = false;

    constructor()
    {


        EventManager.mixin(this);

        this.listener = () =>
        {
            if (scrollingIntoView)
            {
                return;
            }

            let
                x = scrollX,
                y = scrollY,
                initialDirection = this.direction;

            if (x === scrollPos.x && y === scrollPos.y)
            {
                return;
            }

            [this.#x, this.#y] = [
                x - scrollPos.x,
                y - scrollPos.y
            ];

            [scrollPos.x, scrollPos.y] = [x, y];


            let data = {
                x: this.x,
                y: this.y,
                direction: this.direction
            };


            this.trigger('update', data);

            if (data.direction !== initialDirection)
            {
                this.trigger('change', data);
            }

        };

        this.attach();
    }

    attach()
    {
        if (!this.#attached)
        {
            addEventListener('scroll', this.listener);
            this.#attached = true;
        }

    }

    detach()
    {

        if (this.#attached)
        {
            removeEventListener('scroll', this.listener);

            this.#attached = false;
        }
    }

}


export class ScrollSnap
{



    static of(target)
    {
        return new ScrollSnap(target);
    }


    #currentTarget;
    #targets;
    #observer;
    #started = false;

    get currentTarget()
    {
        return this.#currentTarget;
    }

    get observer()
    {
        return this.#observer;
    }
    get started()
    {
        return this.#started;
    }

    get targets()
    {
        return this.#targets;
    }


    /**
     * @param {String|NodeList|HTMLElement|Array} targets 
     */
    constructor(targets, threshold = 0.3)
    {


        if (isValidSelector(targets))
        {
            targets = document.querySelectorAll(targets);
        }

        if (isElement(targets))
        {
            targets = [targets];
        } else if (targets instanceof NodeList)
        {
            targets = [...targets];
        }

        if (!isArray(targets))
        {
            throw new TypeError('invalid target');
        }

        EventManager.mixin(this);

        this.#targets = targets;

        if (targets.length > 0)
        {


            this.#observer = new IntersectionObserver(entries =>
            {

                for (let i = 0; i < entries.length; i++)
                {

                    if (scrollingIntoView)
                    {
                        return;
                    }

                    let item = entries[i];
                    if (item.isIntersecting)
                    {
                        scrollIntoView(this.#currentTarget = item.target)
                            .then(view =>
                            {
                                this.trigger('change', { view });
                            });

                        break;
                    }
                }
            }, {
                threshold
            });

            this.start();
        }
    }

    start()
    {
        if (!this.#started)
        {
            this.#targets.forEach(elem => this.#observer.observe(elem));
            this.#started = true;
        }

    }

    stop()
    {
        if (this.#started)
        {
            this.#observer.disconnect();
            this.#started = false;
        }

    }


}




export function scrollIntoView(view, delay = 750)
{

    return new Promise((resolve, reject) =>
    {
        if (view instanceof Element && !scrollingIntoView)
        {

            scrollingIntoView = true;

            setTimeout(() =>
            {
                scrollingIntoView = false;
                resolve(view);
            }, delay);

            scrollTo({
                top: view.offsetTop,
                left: view.offsetLeft,
                behavior: 'smooth'
            });

        }
        else
        {
            reject(new Error('Cannot scroll into view.'));
        }
    });


}

export default scrollIntoView;

