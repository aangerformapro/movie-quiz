function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "@charset \"UTF-8\";\n/* \n    Dialog Reset and management\n    @link https://www.amp-what.com/unicode/search/close \n    🗙 ☐ 🗹  ✔ \n*/\n.ng-dialog {\n  /*\n      Dialog Reset\n  */\n  border: 0;\n  outline: 0;\n  background: transparent;\n  position: static;\n  position: initial;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: auto;\n  height: auto;\n}\n.ng-dialog .card {\n  border-radius: 3px;\n  border: 0;\n  margin: auto;\n}\n.ng-dialog > form {\n  max-width: 75vmin;\n  max-height: 75vmin;\n  transition-duration: 0.4s;\n  transition-delay: 0.1s;\n  transform-origin: center center;\n}\n.ng-dialog > form input,\n.ng-dialog > form textarea {\n  -webkit-user-select: text;\n  -ms-user-select: text;\n  user-select: text;\n}\n.ng-dialog > form [type=submit],\n.ng-dialog > form [type=button],\n.ng-dialog > form [type=reset],\n.ng-dialog > form [role=button],\n.ng-dialog > form button {\n  padding: 0.25em 1em;\n  text-transform: capitalize;\n  border: 0;\n  outline: 0;\n  appearance: none;\n  border-radius: 0.25em;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.ng-dialog > form button + button {\n  margin-left: 2vmin;\n}\n.ng-dialog:not([open]), .ng-dialog.closing {\n  position: relative;\n  display: flex;\n  visibility: hidden;\n  opacity: 0;\n  z-index: -5;\n}\n.ng-dialog:not([open]) > form, .ng-dialog.closing > form {\n  transform: scale(0.3);\n  opacity: 0;\n}\n.ng-dialog:modal {\n  width: 100vw;\n  height: 100vh;\n  overflow-y: scroll;\n  overflow-x: hidden;\n  max-width: none;\n  max-width: initial;\n  max-height: none;\n  max-height: initial;\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n.ng-dialog:modal > form {\n  transform: scale(1.2);\n}\n.ng-dialog::backdrop {\n  background: rgba(14, 14, 14, 0.5);\n  filter: blur(3px);\n  box-shadow: 0 0 3px 3px rgba(14, 14, 14, 0.5);\n}";
styleInject(css_248z);

/* global unsafeWindow, globalThis */



const IS_UNSAFE = typeof unsafeWindow !== 'undefined',
    global = IS_UNSAFE ? unsafeWindow : globalThis ?? window,
    { JSON, document: document$1 } = global,
    isPlainObject = (param) => param instanceof Object && Object.getPrototypeOf(param) === Object.prototype,
    isString = (param) => typeof param === 'string',
    isBool = (param) => typeof param === 'boolean',
    isArray = (param) => Array.isArray(param),
    isCallable = (param) => typeof param === 'function',
    isFunction = isCallable;



function isValidSelector(selector)
{

    try
    {
        return isString(selector) && null === document$1.createElement('template').querySelector(selector);

    } catch (e)
    {
        return false;
    }

}

const
    isEventTarget = obj => obj instanceof Object && isFunction(obj.addEventListener) && isFunction(obj.dispatchEvent),
    ELEMENT_BINDING_KEY = '_emitter';




/**
 * EventEmitter v3
 */
class EventEmitter
{
    #target;
    get #listeners()
    {
        return this.#target[ELEMENT_BINDING_KEY];
    }
    set #listeners(data)
    {
        if (isArray(data))
        {
            this.#target[ELEMENT_BINDING_KEY] = data;
        }
    }
    constructor(target)
    {

        target ??= global;

        if (isValidSelector(target))
        {
            target = document.querySelector(target);
        }

        if (!isEventTarget(target))
        {
            throw new TypeError('target is not an event target');
        }

        this.#target = target;

        if (!target.hasOwnProperty(ELEMENT_BINDING_KEY))
        {
            Object.defineProperty(target, ELEMENT_BINDING_KEY, {
                enumerable: false, configurable: true, writable: true,
                value: []
            });
        }
    }

    /**
     * Adds an event listener
     * 
     * @param {String} type 
     * @param {Function} listener 
     * @param {Boolean|Object} [options] 
     * @returns EventEmitter
     */
    on(type, listener, options)
    {

        if (!isString(type))
        {
            throw new TypeError('type must be a String');
        }
        if (!isFunction(listener))
        {
            throw new TypeError('listener must be a Function');
        }

        options ??= {};

        let params = {
            once: false,
            capture: false,
        }, handler = listener;


        if (isBool(options))
        {
            params.capture = options;
        } else if (isPlainObject(options))
        {
            Object.assign(params, options);
        }

        if (params.once)
        {
            handler = e =>
            {
                this.off(e.type, listener, params.capture);
                listener.call(this.#target, e);
            };
        }

        this.#listeners = this.#listeners.concat(type.split(/\s+/).map(type =>
        {
            this.#target.addEventListener(type, handler, params);
            return {
                type,
                listener,
                capture: params.capture
            };
        }));

        return this;
    }
    /**
     * Adds an event listener to be trigerred once
     * 
     * @param {String} type 
     * @param {Function} listener 
     * @param {Boolean|Object} [options] 
     * @returns EventEmitter
     */

    one(type, listener, options)
    {

        let params = {
            once: true,
            capture: false
        };

        if (isBool(options))
        {
            params.capture = options;
        } else if (isPlainObject(options))
        {
            Object.assign(params, options);
        }

        return this.on(type, listener, options);

    }

    /**
     * Removes an event listener(s)
     * 
     * @param {String} type 
     * @param {Function} [listener] 
     * @param {Boolean} [capture] 
     * @returns EventEmitter
     */
    off(type, listener, capture)
    {

        if (!isString(type))
        {
            throw new TypeError('type must be a String');
        }
        if (!isFunction(listener))
        {
            capture = listener;
        }
        if (!isBool(capture))
        {
            capture = false;
        }

        const types = type.split(/\s+/);

        this.#listeners = this.#listeners.filter(item =>
        {
            if (types.includes(item.type) && capture === item.capture)
            {
                if (!isFunction(listener) || listener === item.listener)
                {
                    this.#target.removeEventListener(item.type, item.listener, item.capture);
                    return true;
                }
            }
            return true;
        });
        return this;
    }

    /**
     * Dispatches an event
     * 
     * @param {String|Event} type 
     * @param {Any} [data] 
     * @returns EventEmitter
     */
    trigger(type, data = null)
    {


        let event = type, init = {
            bubbles: this.#target.parentElement !== null,
            cancelable: true,
        };

        if (event instanceof Event)
        {
            event.data ??= data;
            this.#target.dispatchEvent(event);
            return this;
        }

        if (!isString(type))
        {
            throw new TypeError('type must be a String|Event');
        }

        type.split(/\s+/).forEach(type =>
        {
            event = new Event(type, init);
            event.data = data;
            this.#target.dispatchEvent(event);
        });

        return this;
    }

    /**
     * Adds a global event listener
     * 
     * @param {String} type 
     * @param {Function} listener 
     * @param {Boolean|Object} [options] 
     * @returns EventEmitter
     */
    static on(type, listener, options)
    {
        return instance.on(type, listener, options);
    }

    /**
     * Adds a global event listener to be triggered once
     * 
     * @param {String} type 
     * @param {Function} listener 
     * @param {Boolean|Object} [options] 
     * @returns EventEmitter
     */
    static one(type, listener, options)
    {
        return instance.one(type, listener, options);
    }
    /**
     * Removes a global event listener(s)
     * 
     * @param {String} type 
     * @param {Function} [listener] 
     * @param {Boolean} [capture] 
     * @returns EventEmitter
     */
    static off(type, listener, capture)
    {
        return instance.off(type, listener, capture);
    }
    /**
     * Dispatches a global event
     * 
     * @param {String|Event} type 
     * @param {Any} [data] 
     * @returns EventEmitter
     */
    static trigger(type, data = null)
    {
        return instance.trigger(type, data);
    }



    /**
     * Mixin this event emitter instance into an object
     * @param {Object} binding 
     * @returns Object
     */
    mixin(binding)
    {

        if (binding instanceof Object === false)
        {
            throw new TypeError('binding must be an Object');
        }
        ['on', 'one', 'off', 'trigger'].forEach(fn =>
        {
            if (!binding.hasOwnProperty(fn))
            {
                Object.defineProperty(binding, fn, {
                    enumerable: false, configurable: true,
                    value: (...args) =>
                    {
                        this[fn](...args);
                        return binding;
                    }
                });
            }
        });
        return binding;
    }

}


const instance = new EventEmitter();

/**
 * @param {String|EventTarget} root 
 * @returns EventEmitter
 */
function emitter(root)
{
    return new EventEmitter(root);
}

instance.mixin(emitter);
emitter.mixin = instance.mixin.bind(instance);

/**
 * Material Design Custom SVG Sprite
 */
const parser = document.createElement('div');
parser.innerHTML = `<svg width="0" height="0" style="display: none;">
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-thumb-up">
    <path d="M716-120H272v-512l278-288 39 31q6 5 9 14t3 22v10l-45 211h299q24 0 42 18t18 42v81.839q0 7.161 1.5 14.661T915-461L789-171q-8.878 21.25-29.595 36.125Q738.689-120 716-120Zm-384-60h397l126-299v-93H482l53-249-203 214v427Zm0-427v427-427Zm-60-25v60H139v392h133v60H79v-512h193Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-tips-and-updates">
    <path d="m887-567-23-50-50-23 50-23 23-50 23 50 50 23-50 23-23 50ZM760-742l-35-74-74-35 74-35 35-74 35 74 74 35-74 35-35 74ZM360-80q-34 0-57.5-23.5T279-161h162q0 34-23.5 57.5T360-80ZM198-223v-60h324v60H198Zm5-121q-66-43-104.5-107.5T60-597q0-122 89-211t211-89q122 0 211 89t89 211q0 81-38 145.5T517-344H203Zm22-60h271q48-32 76-83t28-110q0-99-70.5-169.5T360-837q-99 0-169.5 70.5T120-597q0 59 28 110t77 83Zm135 0Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-toggle-off">
    <path d="M280-240q-100 0-170-70T40-480q0-100 70-170t170-70h400q100 0 170 70t70 170q0 100-70 170t-170 70H280Zm0-60h400q75 0 127.5-52.5T860-480q0-75-52.5-127.5T680-660H280q-75 0-127.5 52.5T100-480q0 75 52.5 127.5T280-300Zm-1.059-79Q321-379 350.5-408.441t29.5-71.5Q380-522 350.559-551.5t-71.5-29.5Q237-581 207.5-551.559t-29.5 71.5Q178-438 207.441-408.5t71.5 29.5ZM480-480Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-toggle-on">
    <path d="M280-240q-100 0-170-70T40-480q0-100 70-170t170-70h400q100 0 170 70t70 170q0 100-70 170t-170 70H280Zm0-60h400q75 0 127.5-52.5T860-480q0-75-52.5-127.5T680-660H280q-75 0-127.5 52.5T100-480q0 75 52.5 127.5T280-300Zm400.941-79Q723-379 752.5-408.441t29.5-71.5Q782-522 752.559-551.5t-71.5-29.5Q639-581 609.5-551.559t-29.5 71.5Q580-438 609.441-408.5t71.5 29.5ZM480-480Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-toolbar">
    <path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-513h600v-147H180v147Zm600 60H180v393h600v-393Zm-600-60v60-60Zm0 0v-147 147Zm0 60v393-393Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-touchpad-mouse">
    <path d="M659.798-140Q726-140 773-186.857T820-300v-70H500v70q0 66.286 46.798 113.143t113 46.857ZM500-430h130v-147q-54 11-90 51.5T500-430Zm190 0h130q-4-55-40-95.5T690-577v147ZM660-80q-92 0-156-64t-64-156v-120q0-92 64-156t156-64q92 0 156 64t64 156v120q0 92-64 156T660-80ZM140-220v-520 520Zm0 60q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h680q24 0 42 18t18 42v146q-12.825-16.72-27.912-30.36Q837-638 820-650v-90H140v520h251q5 15.836 11.5 30.918Q409-174 417-160H140Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-tune">
    <path d="M427-120v-225h60v83h353v60H487v82h-60Zm-307-82v-60h247v60H120Zm187-166v-82H120v-60h187v-84h60v226h-60Zm120-82v-60h413v60H427Zm166-165v-225h60v82h187v60H653v83h-60Zm-473-83v-60h413v60H120Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-volume-down">
    <path d="M200-360v-240h160l200-200v640L360-360H200Zm420 48v-337q54 17 87 64t33 105q0 59-33 105t-87 63ZM500-648 387-540H260v120h127l113 109v-337ZM378-480Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-volume-mute">
    <path d="M280-360v-240h160l200-200v640L440-360H280Zm60-60h127l113 109v-337L467-540H340v120Zm119-60Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-volume-off">
    <path d="M813-56 681-188q-28 20-60.5 34.5T553-131v-62q23-7 44.5-15.5T638-231L473-397v237L273-360H113v-240h156L49-820l43-43 764 763-43 44Zm-36-232-43-43q20-34 29.5-71.923T773-481q0-103.322-60-184.661T553-769v-62q124 28 202 125.5T833-481q0 51-14 100t-42 93ZM643-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T643-422ZM473-592 369-696l104-104v208Zm-60 286v-150l-84-84H173v120h126l114 114Zm-42-192Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-volume-up">
    <path d="M560-131v-62q97-28 158.5-107.5T780-481q0-101-61-181T560-769v-62q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm420 48v-337q55 17 87.5 64T660-480q0 57-33 104t-87 64ZM420-648 307-540H180v120h127l113 109v-337Zm-94 168Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-width-full">
    <path d="M140-160q-24.75 0-42.375-17.625T80-220v-520q0-24.75 17.625-42.375T140-800h680q24.75 0 42.375 17.625T880-740v520q0 24.75-17.625 42.375T820-160H140Zm0-60h70v-520h-70v520Zm130 0h420v-520H270v520Zm480 0h70v-520h-70v520ZM270-740v520-520Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-app-shortcut">
    <path d="M260-40q-24.75 0-42.375-17.625T200-100v-760q0-24.75 17.625-42.375T260-920h440q24.75 0 42.375 17.625T760-860v146h-60v-56H260v580h440v-56h60v146q0 24.75-17.625 42.375T700-40H260Zm0-90v30h440v-30H260Zm0-700h440v-30H260v30Zm0 0v-30 30Zm0 700v30-30Zm466-321H460v151h-60v-151q0-24.75 17.625-42.375T460-511h266l-82-81 42-42 153 153-153 153-42-42 82-81Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-arrow-drop-down">
    <path d="M480-360 280-559h400L480-360Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-arrow-selector-tool">
    <path d="m300-347 109-153h218L300-757v410ZM560-84 412-401 240-160v-720l560 440H505l145 314-90 42ZM409-500Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-backspace">
    <path d="m448-326 112-112 112 112 43-43-113-111 111-111-43-43-110 112-112-112-43 43 113 111-113 111 43 43ZM120-480l169-239q13-18 31-29.5t40-11.5h420q24.75 0 42.375 17.625T840-700v440q0 24.75-17.625 42.375T780-200H360q-22 0-40-11.5T289-241L120-480Zm75 0 154 220h431v-440H349L195-480Zm585 0v-220 440-220Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-bookmark">
    <path d="M200-120v-665q0-24 18-42t42-18h440q24 0 42 18t18 42v665L480-240 200-120Zm60-91 220-93 220 93v-574H260v574Zm0-574h440-440Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-bookmark-add">
    <path d="M200-120v-665q0-24 18-42t42-18h290v60H260v574l220-93 220 93v-334h60v425L480-240 200-120Zm60-665h290-290Zm440 180v-90h-90v-60h90v-90h60v90h90v60h-90v90h-60Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-bookmark-added">
    <path d="M716-605 610-711l42-43 64 64 148-149 43 43-191 191ZM200-120v-665q0-24 18-42t42-18h290v60H260v574l220-93 220 93v-334h60v425L480-240 200-120Zm60-665h290-290Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-bookmark-remove">
    <path d="M850-695H610v-60h240v60ZM200-120v-665q0-24 18-42t42-18h290v60H260v574l220-93 220 93v-334h60v425L480-240 200-120Zm60-665h290-290Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-bookmarks">
    <path d="M120-40v-700q0-24 18-42t42-18h480q24 0 42.5 18t18.5 42v700L420-167 120-40Zm60-91 240-103 240 103v-609H180v609Zm600 1v-730H233v-60h547q24 0 42 18t18 42v730h-60ZM180-740h480-480Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-cancel">
    <path d="m330-288 150-150 150 150 42-42-150-150 150-150-42-42-150 150-150-150-42 42 150 150-150 150 42 42ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-check-box">
    <path d="m419-321 289-289-43-43-246 246-119-119-43 43 162 162ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-check-box-outline-blank">
    <path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-check-circle">
    <path d="m421-298 283-283-46-45-237 237-120-120-45 45 165 166Zm59 218q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-chevron-left">
    <path d="M561-240 320-481l241-241 43 43-198 198 198 198-43 43Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-chevron-right">
    <path d="m375-240-43-43 198-198-198-198 43-43 241 241-241 241Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-close">
    <path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-disabled-by-default">
    <path d="m336-294 144-144 144 144 42-42-144-144 144-144-42-42-144 144-144-144-42 42 144 144-144 144 42 42ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-dock-to-bottom">
    <path d="M180-120q-24.75 0-42.375-17.625T120-180v-600q0-24.75 17.625-42.375T180-840h600q24.75 0 42.375 17.625T840-780v600q0 24.75-17.625 42.375T780-120H180Zm0-207v147h600v-147H180Zm0-60h600v-393H180v393Zm0 60v147-147Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-dock-to-left">
    <path d="M180-120q-24.75 0-42.375-17.625T120-180v-600q0-24.75 17.625-42.375T180-840h600q24.75 0 42.375 17.625T840-780v600q0 24.75-17.625 42.375T780-120H180Zm453-60h147v-600H633v600Zm-60 0v-600H180v600h393Zm60 0h147-147Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-dock-to-right">
    <path d="M180-120q-24.75 0-42.375-17.625T120-180v-600q0-24.75 17.625-42.375T180-840h600q24.75 0 42.375 17.625T840-780v600q0 24.75-17.625 42.375T780-120H180Zm147-60v-600H180v600h147Zm60 0h393v-600H387v600Zm-60 0H180h147Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-drag-pan">
    <path d="M480-80 317-243l44-44 89 89v-252H198l84 84-44 44L80-480l159-159 44 44-85 85h252v-252l-84 84-44-44 158-158 158 158-44 44-84-84v252h252l-84-84 44-44 158 158-158 158-44-44 84-84H510v252l89-89 44 44L480-80Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-expand-less">
    <path d="m283-345-43-43 240-240 240 239-43 43-197-197-197 198Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-expand-more">
    <path d="M480-345 240-585l43-43 197 198 197-197 43 43-240 239Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-favorite">
    <path d="m480-121-41-37q-105.768-97.121-174.884-167.561Q195-396 154-451.5T96.5-552Q80-597 80-643q0-90.155 60.5-150.577Q201-854 290-854q57 0 105.5 27t84.5 78q42-54 89-79.5T670-854q89 0 149.5 60.423Q880-733.155 880-643q0 46-16.5 91T806-451.5Q765-396 695.884-325.561 626.768-255.121 521-158l-41 37Zm0-79q101.236-92.995 166.618-159.498Q712-426 750.5-476t54-89.135q15.5-39.136 15.5-77.72Q820-709 778-751.5T670.225-794q-51.524 0-95.375 31.5Q531-731 504-674h-49q-26-56-69.85-88-43.851-32-95.375-32Q224-794 182-751.5t-42 108.816Q140-604 155.5-564.5t54 90Q248-424 314-358t166 158Zm0-297Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-filter-list">
    <path d="M400-240v-60h160v60H400ZM240-450v-60h480v60H240ZM120-660v-60h720v60H120Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-fullscreen">
    <path d="M200-200v-193h60v133h133v60H200Zm0-367v-193h193v60H260v133h-60Zm367 367v-60h133v-133h60v193H567Zm133-367v-133H567v-60h193v193h-60Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-fullscreen-exit">
    <path d="M333-200v-133H200v-60h193v193h-60Zm234 0v-193h193v60H627v133h-60ZM200-567v-60h133v-133h60v193H200Zm367 0v-193h60v133h133v60H567Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-heart-minus">
    <path d="M440-497Zm0 376-99-91q-94-86-152.5-145.5T97-462q-33-45-45-83t-12-80q0-91 61-153t149-62q57 0 105.5 26.5T440-736q41-53 88-78.5T630-840q88 0 148.5 62T839-625q0 29-5.5 54.5T820-530h-64q8-17 15.5-44.5T779-625q0-64-43.5-109.5T630-780q-51 0-95 31t-71 88h-49q-26-56-70-87.5T250-780q-65 0-107.5 44T100-625q0 36 12.5 70t49 80Q198-429 265-364t175 164q32-29 60.5-54t56.5-49l6.5 6.5q6.5 6.5 14.5 14t14.5 14l6.5 6.5q-27 24-56 49t-62 55l-41 37Zm160-289v-60h320v60H600Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-heart-plus">
    <path d="M440-497Zm0 376-99-91q-87-80-144.5-137T104-452q-35-46-49.5-86.5T40-625q0-90 60.5-152.5T250-840q57 0 105.5 26.5T440-736q42-54 89-79t101-25q80.576 0 135.288 55Q820-730 832-652h-59q-9-55-46.5-91.5T630-780q-51 0-95 31t-71 88h-49q-26-56-70-87.5T250-780q-66 0-108 44.5T100-625q0 39 15.5 76t53.888 84.067q38.388 47.068 104.5 110Q340-292 440-200q32-29 60.5-54t56.5-49l6.632 6.474L578-282.5l14.368 14.026L599-262q-27 24-56 49t-62 55l-41 37Zm290-159v-130H600v-60h130v-130h60v130h130v60H790v130h-60Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-history-toggle-off">
    <path d="M612-306 450-468v-202h60v178l144 144-42 42Zm-495-1q-15-34-24-70t-12-73h60q2 29 10 57.5t19 55.5l-53 30ZM81-510q3-38 12-74t25-70l52 30q-12 27-19.5 56t-9.5 58H81Zm173 363q-32-22-59.5-49T146-255l53-30q17 25 38.5 46.5T284-200l-30 53Zm-55-529-52-30q21-32 48-59t59-48l30 53q-25 17-46.5 38T199-676ZM450-81q-38-3-74-12t-70-25l30-52q27 12 56 19.5t58 9.5v60ZM336-790l-30-52q34-16 70-25t74-12v60q-29 2-58 9.5T336-790ZM510-81v-60q29-2 58-9.5t56-19.5l30 52q-34 16-70 25t-74 12Zm114-709q-27-12-56-19.5t-58-9.5v-60q38 3 74 11.5t70 25.5l-30 52Zm82 643-30-53q25-17 46-38t38-46l53 30q-21 32-48 59t-59 48Zm54-529q-17-25-38-46t-46-38l30-53q32 21 58.5 48t47.5 59l-52 30Zm59 166q-2-30-10-58.5T789-624l53-30q17 34 25.5 70t11.5 74h-60Zm23 204-52-30q12-27 19.5-56t9.5-58h60q-3 38-12 74t-25 70Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-home">
    <path d="M220-180h150v-250h220v250h150v-390L480-765 220-570v390Zm-60 60v-480l320-240 320 240v480H530v-250H430v250H160Zm320-353Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-indeterminate-check-box">
    <path d="M250-452h461v-60H250v60Zm-70 332q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-install-mobile">
    <path d="M260-40q-24 0-42-18t-18-42v-760q0-24 18-42t42-18h320v60H260v30h320v60H260v580h440v-130h60v220q0 24-18 42t-42 18H260Zm0-90v30h440v-30H260Zm474-284L548-600l42-42 114 113v-301h60v301l114-113 42 42-186 186ZM260-830v-30 30Zm0 700v30-30Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-login">
    <path d="M489-120v-60h291v-600H489v-60h291q24 0 42 18t18 42v600q0 24-18 42t-42 18H489Zm-78-185-43-43 102-102H120v-60h348L366-612l43-43 176 176-174 174Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-logout">
    <path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h291v60H180v600h291v60H180Zm486-185-43-43 102-102H375v-60h348L621-612l43-43 176 176-174 174Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-mic">
    <path d="M480-423q-43 0-72-30.917-29-30.916-29-75.083v-251q0-41.667 29.441-70.833Q437.882-880 479.941-880t71.559 29.167Q581-821.667 581-780v251q0 44.167-29 75.083Q523-423 480-423Zm0-228Zm-30 531v-136q-106-11-178-89t-72-184h60q0 91 64.288 153t155.5 62Q571-314 635.5-376 700-438 700-529h60q0 106-72 184t-178 89v136h-60Zm30-363q18 0 29.5-13.5T521-529v-251q0-17-11.788-28.5Q497.425-820 480-820q-17.425 0-29.212 11.5Q439-797 439-780v251q0 19 11.5 32.5T480-483Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-mic-off">
    <path d="m686-361-43-43q21-26 31-58.5t10-66.5h60q0 46-15 89t-43 79ZM461-586Zm97 97-53-52v-238q0-17.425-11.788-29.213Q481.425-820 464-820q-17.425 0-29.212 11.787Q423-796.425 423-779v155l-60-60v-95q0-42.083 29.441-71.542Q421.882-880 463.941-880t71.559 29.458Q565-821.083 565-779v250q0 8-1.5 20t-5.5 20ZM434-120v-136q-106-11-178-89t-72-184h60q0 91 64.5 153T464-314q38 0 73.11-12.337Q572.221-338.675 601-361l43 43q-31 26-69.014 41.568Q536.972-260.865 494-256v136h-60Zm397 65L36-850l38-38L869-93l-38 38Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-mouse">
    <path d="M480-80q-118 0-199-81t-81-199v-260q0-118 81-199t199-81q118 0 199 81t81 199v260q0 118-81 199T480-80Zm30-540h190q0-81-53-144t-137-74v218Zm-250 0h190v-218q-84 11-137 74t-53 144Zm219.788 480Q571-140 635.5-204.35 700-268.7 700-360v-200H260v200q0 91.3 64.288 155.65Q388.576-140 479.788-140ZM480-560Zm30-60Zm-60 0Zm30 60Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-movie">
    <path d="m140-800 74 152h130l-74-152h89l74 152h130l-74-152h89l74 152h130l-74-152h112q24 0 42 18t18 42v520q0 24-18 42t-42 18H140q-24 0-42-18t-18-42v-520q0-24 18-42t42-18Zm0 212v368h680v-368H140Zm0 0v368-368Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-movie-info">
    <path d="M140-120q-24 0-42-18t-18-42v-599q0-24 18-42.5t42-18.5h681q24.338 0 41.669 18.5Q880-803 880-779v599q0 24-17.331 42T821-120H140Zm0-60h105v-105H140v105Zm576 0h105v-105H716v105ZM450-294h60v-233h-60v233Zm-310-50h105v-105H140v105Zm576 0h105v-105H716v105ZM140-509h105v-105H140v105Zm576 0h105v-105H716v105ZM480.175-613q12.825 0 21.325-8.675 8.5-8.676 8.5-21.5 0-12.825-8.675-21.325-8.676-8.5-21.5-8.5-12.825 0-21.325 8.675-8.5 8.676-8.5 21.5 0 12.825 8.675 21.325 8.676 8.5 21.5 8.5ZM140-674h105v-105H140v105Zm576 0h105v-105H716v105ZM305-180h352v-599H305v599Zm0-599h352-352Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-no-sound">
    <path d="m611-323-43-43 114-113-114-113 43-43 113 114 113-114 43 43-114 113 114 113-43 43-113-114-113 114Zm-491-37v-240h160l200-200v640L280-360H120Zm300-288L307-540H180v120h127l113 109v-337ZM311-481Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-notifications">
    <path d="M160-200v-60h84v-306q0-84 49.5-149.5T424-798v-29q0-23 16.5-38t39.5-15q23 0 39.5 15t16.5 38v29q81 17 131 82.5T717-566v306h83v60H160Zm320-295Zm0 415q-32 0-56-23.5T400-160h160q0 33-23.5 56.5T480-80ZM304-260h353v-306q0-74-51-126t-125-52q-74 0-125.5 52T304-566v306Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-notifications-active">
    <path d="M124-567q0-81 34-153.5T255-844l41 45q-53 43-82.5 103.5T184-567h-60Zm653 0q0-68-28-128.5T668-799l41-45q62 52 95 124t33 153h-60ZM160-200v-60h84v-306q0-84 49.5-149.5T424-798v-29q0-23 16.5-38t39.5-15q23 0 39.5 15t16.5 38v29q81 17 131 82.5T717-566v306h83v60H160Zm320-295Zm0 415q-32 0-56-23.5T400-160h160q0 33-23.5 56.5T480-80ZM304-260h353v-306q0-74-51-126t-125-52q-74 0-125.5 52T304-566v306Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-notifications-off">
    <path d="M160-200v-60h84v-315q0-29.598 8.5-58.299T276-688l45 45q-8 17-12.5 33.5T304-575v315h316L75-805l42-42 726 727-42 42-122-122H160Zm557-132-60-60v-174q0-75-50.5-126.5T482-744q-35 0-67 11.5T356-693l-43-43q27-26 54.5-40.5T424-798v-26.091q0-23.295 16.265-39.602Q456.529-880 479.765-880 503-880 519.5-863.693t16.5 39.602V-798q78 17 129.5 82T717-566v234Zm-255-86Zm18 338q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Zm27-463Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-page-info">
    <path d="M700-130q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm-.235-60Q733-190 756.5-213.265q23.5-23.264 23.5-56.5Q780-303 756.735-326.5q-23.264-23.5-56.5-23.5Q667-350 643.5-326.735q-23.5 23.264-23.5 56.5Q620-237 643.265-213.5q23.264 23.5 56.5 23.5ZM120-240v-60h360v60H120Zm140-310q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm-.235-60Q293-610 316.5-633.265q23.5-23.264 23.5-56.5Q340-723 316.735-746.5q-23.264-23.5-56.5-23.5Q227-770 203.5-746.735q-23.5 23.264-23.5 56.5Q180-657 203.265-633.5q23.264 23.5 56.5 23.5ZM480-660v-60h360v60H480Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-password">
    <path d="M80-200v-61h800v61H80Zm38-254-40-22 40-68H40v-45h78l-40-68 40-22 38 67 38-67 40 22-40 68h78v45h-78l40 68-40 22-38-67-38 67Zm324 0-40-24 40-68h-78v-45h78l-40-68 40-22 38 67 38-67 40 22-40 68h78v45h-78l40 68-40 24-38-67-38 67Zm324 0-40-24 40-68h-78v-45h78l-40-68 40-22 38 67 38-67 40 22-40 68h78v45h-78l40 68-40 24-38-67-38 67Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-power-settings-new">
    <path d="M450-438v-406h60v406h-60Zm30 320q-74 0-139.5-28.5T226-224q-49-49-77.5-114.5T120-478q0-80 34-149.5T250-751l42 42q-53 43-82.5 102.5T180-478.022Q180-353 267.5-265.5 355-178 480-178q125.357 0 212.679-87.5Q780-353 780-478.022 780-547 750.5-607.5 721-668 670-709l43-42q60 51 93.5 122T840-478q0 74-28.5 139.5t-77 114.5q-48.5 49-114 77.5T480-118Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-radio-button-checked">
    <path d="M480-294q78 0 132-54t54-132q0-78-54-132t-132-54q-78 0-132 54t-54 132q0 78 54 132t132 54Zm0 214q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-radio-button-unchecked">
    <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-refresh">
    <path d="M480-160q-133 0-226.5-93.5T160-480q0-133 93.5-226.5T480-800q85 0 149 34.5T740-671v-129h60v254H546v-60h168q-38-60-97-97t-137-37q-109 0-184.5 75.5T220-480q0 109 75.5 184.5T480-220q83 0 152-47.5T728-393h62q-29 105-115 169t-195 64Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-search">
    <path d="M796-121 533-384q-30 26-69.959 40.5T378-329q-108.162 0-183.081-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85 632-542 618-502q-14 40-42 75l264 262-44 44ZM377-389q81.25 0 138.125-57.5T572-585q0-81-56.875-138.5T377-781q-82.083 0-139.542 57.5Q180-666 180-585t57.458 138.5Q294.917-389 377-389Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-select-check-box">
    <path d="M180-120q-24.75 0-42.375-17.625T120-180v-600q0-24.75 17.625-42.375T180-840h600q14 0 25.5 6t18.5 14l-44 44v-4H180v600h600v-343l60-60v403q0 24.75-17.625 42.375T780-120H180Zm281-168L239-510l42-42 180 180 382-382 42 42-424 424Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-settings">
    <path d="m388-80-20-126q-19-7-40-19t-37-25l-118 54-93-164 108-79q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521L80-600l93-164 118 54q16-13 37-25t40-18l20-127h184l20 126q19 7 40.5 18.5T669-710l118-54 93 164-108 77q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l108 78-93 164-118-54q-16 13-36.5 25.5T592-206L572-80H388Zm92-270q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Zm0-60q-29 0-49.5-20.5T410-480q0-29 20.5-49.5T480-550q29 0 49.5 20.5T550-480q0 29-20.5 49.5T480-410Zm0-70Zm-44 340h88l14-112q33-8 62.5-25t53.5-41l106 46 40-72-94-69q4-17 6.5-33.5T715-480q0-17-2-33.5t-7-33.5l94-69-40-72-106 46q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 7-63.5 24T306-642l-106-46-40 72 94 69q-4 17-6.5 33.5T245-480q0 17 2.5 33.5T254-413l-94 69 40 72 106-46q24 24 53.5 41t62.5 25l14 112Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-shelf-position">
    <path d="M180-121q-24 0-42-18t-18-42v-599q0-24 18-42t42-18h640q24 0 42 18t18 42v599q0 24-18 42t-42 18H180Zm0-201v141h640v-141H180Zm490-60h150v-398H670v398Zm-490 0h150v-398H180v398Zm210 0h220v-398H390v398Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-sort">
    <path d="M120-240v-60h240v60H120Zm0-210v-60h480v60H120Zm0-210v-60h720v60H120Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-star">
    <path d="m323-205 157-94 157 95-42-178 138-120-182-16-71-168-71 167-182 16 138 120-42 178ZM233-80l65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Zm247-355Z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="ng-thumb-down">
    <path d="M242-840h444v512L408-40l-39-31q-6-5-9-14t-3-22v-10l45-211H103q-24 0-42-18t-18-42v-81.839Q43-477 41.5-484.5T43-499l126-290q8.878-21.25 29.595-36.125Q219.311-840 242-840Zm384 60H229L103-481v93h373l-53 249 203-214v-427Zm0 427v-427 427Zm60 25v-60h133v-392H686v-60h193v512H686Z"></path>
  </symbol>
</svg>`;

const sprite = parser.removeChild(parser.firstChild);
document.documentElement.appendChild(sprite);

const burger = document.querySelector(".burger-btn");



burger.addEventListener("click", () =>
{

    //  burger.classList.toggle('open');
});




new Swiper('.swiper', {

    grabCursor: true,
    slidesPerView: "auto",
    freeMode: {
        enabled: true,
        sticky: true,
    },
    mousewheel: {
        releaseOnEdges: false,
    },
});



// close.attachTo(document.querySelector('dialog'));

// close.setAttributes({
//     style: 'height: 90vh;'
// });



let d = document.querySelector('dialog');


d.show();


// dialogPolyfill.forceRegisterDialog(d);

// d.showModal();

// console.dir(d);

// d.onclick = e => console.dir(e);

// d.showModal();
// d.show();
//# sourceMappingURL=layout.js.map
