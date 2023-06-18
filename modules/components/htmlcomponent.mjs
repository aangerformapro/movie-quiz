
import { isElement, createElement, isHTML, isValidSelector } from '../utils/utils.mjs';
import emitter from '../utils/emitter.mjs';


/**
 * The base HTML Element
 */

export default class HtmlComponent
{

    #elem;
    get element()
    {
        return this.#elem;
    }

    attachTo(elem, append = true)
    {
        if (isElement(elem))
        {

            if (append)
            {
                elem.appendChild(this.element);
            } else
            {
                elem.insertBefore(this.element, elem.firstElementChild);
            }
        }
    }

    detach()
    {
        if (!this.isAttached)
        {
            this.element.remove();
        }
    }

    get isAttached()
    {
        return this.element.closest('html') !== null;
    }

    constructor(element)
    {
        if (isValidSelector(element))
        {
            element = document.querySelector(element);
        }
        else if (isHTML(element))
        {
            element = createElement(element);
        }

        if (!isElement(element))
        {
            throw new TypeError("element is not an Element");
        }
        this.#elem = element;
        emitter(element).mixin(this);
    }

}
