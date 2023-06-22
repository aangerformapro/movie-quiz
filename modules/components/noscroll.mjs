import EventManager from "../utils/event-manager.mjs";
import { createElement } from "../utils/utils.mjs";

import "./noscroll.css";

const { documentElement } = document;

export default class NoScroll
{


    static #scrollTop = 0;
    static #stylesheet;

    static get enabled()
    {
        return documentElement.classList.contains('noscroll');
    }

    static #getStylesheet()
    {

        if (!this.#stylesheet)
        {
            this.#stylesheet = createElement('style', { type: 'text/css', id: 'no-scroll-component' });
            document.getElementsByTagName('head')[0].appendChild(this.#stylesheet);

        }
        return this.#stylesheet;
    }


    static async enable(savePosition = true)
    {

        if (this.enabled)
        {
            return true;
        }

        let pos = Math.max(0, documentElement.scrollTop);
        this.#scrollTop = pos;
        if (savePosition)
        {
            this.#getStylesheet().innerHTML = `html.noscroll{top:-${pos}px;}`;
        }
        documentElement.classList.add('noscroll');
        this.trigger('enabled');
        return true;
    }




    static async disable(savePosition = true)
    {

        if (!this.enabled)
        {
            return true;
        }
        documentElement.classList.remove('noscroll');
        if (this.#scrollTop > 0 && savePosition)
        {
            documentElement.classList.add('scrollback');
            documentElement.scrollTo(0, this.#scrollTop);
            documentElement.classList.remove('scrollback');
        }
        this.trigger('disabled');
        return true;
    }

}


EventManager.mixin(NoScroll);