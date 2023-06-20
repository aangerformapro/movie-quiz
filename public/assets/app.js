/* Version: 1.0.0 - June 20, 2023 21:37:59 */
function noop$1() { }
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
let src_url_equal_anchor;
function src_url_equal(element_src, url) {
    if (!src_url_equal_anchor) {
        src_url_equal_anchor = document.createElement('a');
    }
    src_url_equal_anchor.href = url;
    return element_src === src_url_equal_anchor.href;
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function validate_store(store, name) {
    if (store != null && typeof store.subscribe !== 'function') {
        throw new Error(`'${name}' is not a store with a 'subscribe' method`);
    }
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop$1;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
    let value;
    subscribe(store, _ => value = _)();
    return value;
}
function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if ($$scope.dirty === undefined) {
            return lets;
        }
        if (typeof lets === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
    if (slot_changes) {
        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
        slot.p(slot_context, slot_changes);
    }
}
function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
        const dirty = [];
        const length = $$scope.ctx.length / 32;
        for (let i = 0; i < length; i++) {
            dirty[i] = -1;
        }
        return dirty;
    }
    return -1;
}
function exclude_internal_props(props) {
    const result = {};
    for (const k in props)
        if (k[0] !== '$')
            result[k] = props[k];
    return result;
}
function compute_rest_props(props, keys) {
    const rest = {};
    keys = new Set(keys);
    for (const k in props)
        if (!keys.has(k) && k[0] !== '$')
            rest[k] = props[k];
    return rest;
}
function set_store_value(store, ret, value) {
    store.set(value);
    return ret;
}
function action_destroyer(action_result) {
    return action_result && is_function(action_result.destroy) ? action_result.destroy : noop$1;
}
const contenteditable_truthy_values = ['', true, 1, 'true', 'contenteditable'];

const globals = (typeof window !== 'undefined'
    ? window
    : typeof globalThis !== 'undefined'
        ? globalThis
        : global);
function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
    return function (event) {
        event.preventDefault();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
/**
 * List of attributes that should always be set through the attr method,
 * because updating them through the property setter doesn't work reliably.
 * In the example of `width`/`height`, the problem is that the setter only
 * accepts numeric values, but the attribute can also be set to a string like `50%`.
 * If this list becomes too big, rethink this approach.
 */
const always_set_through_set_attribute = ['width', 'height'];
function set_attributes(node, attributes) {
    // @ts-ignore
    const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
    for (const key in attributes) {
        if (attributes[key] == null) {
            node.removeAttribute(key);
        }
        else if (key === 'style') {
            node.style.cssText = attributes[key];
        }
        else if (key === '__value') {
            node.value = node[key] = attributes[key];
        }
        else if (descriptors[key] && descriptors[key].set && always_set_through_set_attribute.indexOf(key) === -1) {
            node[key] = attributes[key];
        }
        else {
            attr(node, key, attributes[key]);
        }
    }
}
function children(element) {
    return Array.from(element.childNodes);
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, bubbles, cancelable, detail);
    return e;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs#run-time-svelte-onmount
 */
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
/**
 * Schedules a callback to run immediately before the component is unmounted.
 *
 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
 * only one that runs inside a server-side component.
 *
 * https://svelte.dev/docs#run-time-svelte-ondestroy
 */
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}
/**
 * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
 * Event dispatchers are functions that can take two arguments: `name` and `detail`.
 *
 * Component events created with `createEventDispatcher` create a
 * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
 * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
 * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
 * property and can contain any type of data.
 *
 * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
 */
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail, { cancelable = false } = {}) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail, { cancelable });
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
            return !event.defaultPrevented;
        }
        return true;
    };
}
/**
 * Associates an arbitrary `context` object with the current component and the specified `key`
 * and returns that object. The context is then available to children of the component
 * (including slotted content) with `getContext`.
 *
 * Like lifecycle functions, this must be called during component initialisation.
 *
 * https://svelte.dev/docs#run-time-svelte-setcontext
 */
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
    return context;
}
/**
 * Retrieves the context that belongs to the closest parent component with the specified `key`.
 * Must be called during component initialisation.
 *
 * https://svelte.dev/docs#run-time-svelte-getcontext
 */
function getContext(key) {
    return get_current_component().$$.context.get(key);
}

const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function tick() {
    schedule_update();
    return resolved_promise;
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();
let flushidx = 0; // Do *not* move this inside the flush() function
function flush() {
    // Do not reenter flush while dirty components are updated, as this can
    // result in an infinite loop. Instead, let the inner flush handle it.
    // Reentrancy is ok afterwards for bindings etc.
    if (flushidx !== 0) {
        return;
    }
    const saved_component = current_component;
    do {
        // first, call beforeUpdate functions
        // and update components
        try {
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update$1(component.$$);
            }
        }
        catch (e) {
            // reset dirty state to not end up in a deadlocked state and then rethrow
            dirty_components.length = 0;
            flushidx = 0;
            throw e;
        }
        set_current_component(null);
        dirty_components.length = 0;
        flushidx = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
}
function update$1($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
/**
 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
 */
function flush_render_callbacks(fns) {
    const filtered = [];
    const targets = [];
    render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
    targets.forEach((c) => c());
    render_callbacks = filtered;
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
    else if (callback) {
        callback();
    }
}

function get_spread_update(levels, updates) {
    const update = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
        const o = levels[i];
        const n = updates[i];
        if (n) {
            for (const key in o) {
                if (!(key in n))
                    to_null_out[key] = 1;
            }
            for (const key in n) {
                if (!accounted_for[key]) {
                    update[key] = n[key];
                    accounted_for[key] = 1;
                }
            }
            levels[i] = n;
        }
        else {
            for (const key in o) {
                accounted_for[key] = 1;
            }
        }
    }
    for (const key in to_null_out) {
        if (!(key in update))
            update[key] = undefined;
    }
    return update;
}
function get_spread_object(spread_props) {
    return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
            // if the component was destroyed immediately
            // it will update the `$$.on_destroy` reference to `null`.
            // the destructured on_destroy may still reference to the old array
            if (component.$$.on_destroy) {
                component.$$.on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        flush_render_callbacks($$.after_update);
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init$1(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: [],
        // state
        props,
        update: noop$1,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false,
        root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop$1;
    }
    $on(type, callback) {
        if (!is_function(callback)) {
            return noop$1;
        }
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.1' }, detail), { bubbles: true }));
}
function append_dev(target, node) {
    dispatch_dev('SvelteDOMInsert', { target, node });
    append(target, node);
}
function insert_dev(target, node, anchor) {
    dispatch_dev('SvelteDOMInsert', { target, node, anchor });
    insert(target, node, anchor);
}
function detach_dev(node) {
    dispatch_dev('SvelteDOMRemove', { node });
    detach(node);
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
    const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    if (has_stop_immediate_propagation)
        modifiers.push('stopImmediatePropagation');
    dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
        dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
        dispose();
    };
}
function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
        dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
    else
        dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
}
function set_data_dev(text, data) {
    data = '' + data;
    if (text.data === data)
        return;
    dispatch_dev('SvelteDOMSetData', { node: text, data });
    text.data = data;
}
function set_data_contenteditable_dev(text, data) {
    data = '' + data;
    if (text.wholeText === data)
        return;
    dispatch_dev('SvelteDOMSetData', { node: text, data });
    text.data = data;
}
function set_data_maybe_contenteditable_dev(text, data, attr_value) {
    if (~contenteditable_truthy_values.indexOf(attr_value)) {
        set_data_contenteditable_dev(text, data);
    }
    else {
        set_data_dev(text, data);
    }
}
function validate_each_argument(arg) {
    if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
        let msg = '{#each} only iterates over array-like objects.';
        if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
            msg += ' You can use a spread to convert this iterable into an array.';
        }
        throw new Error(msg);
    }
}
function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
        if (!~keys.indexOf(slot_key)) {
            console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
        }
    }
}
function construct_svelte_component_dev(component, props) {
    const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
    try {
        const instance = new component(props);
        if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
            throw new Error(error_message);
        }
        return instance;
    }
    catch (err) {
        const { message } = err;
        if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
            throw new Error(error_message);
        }
        else {
            throw err;
        }
    }
}
/**
 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
 */
class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
        if (!options || (!options.target && !options.$$inline)) {
            throw new Error("'target' is a required option");
        }
        super();
    }
    $destroy() {
        super.$destroy();
        this.$destroy = () => {
            console.warn('Component was already destroyed'); // eslint-disable-line no-console
        };
    }
    $capture_state() { }
    $inject_state() { }
}

/*
 * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
 *
 * https://github.com/reach/router/blob/master/LICENSE
 */

const isUndefined = value => typeof value === "undefined";

const isFunction$1 = value => typeof value === "function";

const isNumber$1 = value => typeof value === "number";

/**
 * Decides whether a given `event` should result in a navigation or not.
 * @param {object} event
 */
function shouldNavigate(event) {
	return (
		!event.defaultPrevented &&
		event.button === 0 &&
		!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
	);
}

function createCounter() {
	let i = 0;
	/**
	 * Returns an id and increments the internal state
	 * @returns {number}
	 */
	return () => i++;
}

/**
 * Create a globally unique id
 *
 * @returns {string} An id
 */
function createGlobalId() {
	return Math.random().toString(36).substring(2);
}

function findClosest$1(tagName, element) {
	while (element && element.tagName !== tagName) {
		// eslint-disable-next-line no-param-reassign
		element = element.parentNode;
	}
	return element;
}

const isSSR = typeof window === "undefined";

function addListener(target, type, handler) {
	target.addEventListener(type, handler);
	return () => target.removeEventListener(type, handler);
}

const createInlineStyle = (disableInlineStyles, style) =>
	disableInlineStyles ? {} : { style };
const createMarkerProps = disableInlineStyles => ({
	"aria-hidden": "true",
	...createInlineStyle(disableInlineStyles, "display:none;"),
});

const subscriber_queue = [];
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier} [start]
 */
function readable(value, start) {
    return {
        subscribe: writable(value, start).subscribe
    };
}
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=} start
 */
function writable(value, start = noop$1) {
    let stop;
    const subscribers = new Set();
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (const subscriber of subscribers) {
                    subscriber[1]();
                    subscriber_queue.push(subscriber, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop$1) {
        const subscriber = [run, invalidate];
        subscribers.add(subscriber);
        if (subscribers.size === 1) {
            stop = start(set) || noop$1;
        }
        run(value);
        return () => {
            subscribers.delete(subscriber);
            if (subscribers.size === 0 && stop) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}
function derived(stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single
        ? [stores]
        : stores;
    const auto = fn.length < 2;
    return readable(initial_value, (set) => {
        let started = false;
        const values = [];
        let pending = 0;
        let cleanup = noop$1;
        const sync = () => {
            if (pending) {
                return;
            }
            cleanup();
            const result = fn(single ? values[0] : values, set);
            if (auto) {
                set(result);
            }
            else {
                cleanup = is_function(result) ? result : noop$1;
            }
        };
        const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
            values[i] = value;
            pending &= ~(1 << i);
            if (started) {
                sync();
            }
        }, () => {
            pending |= (1 << i);
        }));
        started = true;
        sync();
        return function stop() {
            run_all(unsubscribers);
            cleanup();
            // We need to set this to false because callbacks can still happen despite having unsubscribed:
            // Callbacks might already be placed in the queue which doesn't know it should no longer
            // invoke this derived store.
            started = false;
        };
    });
}

/*
 * Adapted from https://github.com/EmilTholin/svelte-routing
 *
 * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
 */

const createKey = ctxName => `@@svnav-ctx__${ctxName}`;

// Use strings instead of objects, so different versions of
// svelte-navigator can potentially still work together
const LOCATION = createKey("LOCATION");
const ROUTER = createKey("ROUTER");
const ROUTE = createKey("ROUTE");
const ROUTE_PARAMS = createKey("ROUTE_PARAMS");
const FOCUS_ELEM = createKey("FOCUS_ELEM");

const paramRegex = /^:(.+)/;

const substr = (str, start, end) => str.substr(start, end);

/**
 * Check if `string` starts with `search`
 * @param {string} string
 * @param {string} search
 * @return {boolean}
 */
const startsWith = (string, search) =>
	substr(string, 0, search.length) === search;

/**
 * Check if `segment` is a root segment
 * @param {string} segment
 * @return {boolean}
 */
const isRootSegment = segment => segment === "";

/**
 * Check if `segment` is a dynamic segment
 * @param {string} segment
 * @return {boolean}
 */
const isDynamic = segment => paramRegex.test(segment);

/**
 * Check if `segment` is a splat
 * @param {string} segment
 * @return {boolean}
 */
const isSplat = segment => segment[0] === "*";

/**
 * Strip potention splat and splatname of the end of a path
 * @param {string} str
 * @return {string}
 */
const stripSplat = str => str.replace(/\*.*$/, "");

/**
 * Strip `str` of potential start and end `/`
 * @param {string} str
 * @return {string}
 */
const stripSlashes = str => str.replace(/(^\/+|\/+$)/g, "");

/**
 * Split up the URI into segments delimited by `/`
 * @param {string} uri
 * @return {string[]}
 */
function segmentize(uri, filterFalsy = false) {
	const segments = stripSlashes(uri).split("/");
	return filterFalsy ? segments.filter(Boolean) : segments;
}

/**
 * Add the query to the pathname if a query is given
 * @param {string} pathname
 * @param {string} [query]
 * @return {string}
 */
const addQuery = (pathname, query) =>
	pathname + (query ? `?${query}` : "");

/**
 * Normalizes a basepath
 *
 * @param {string} path
 * @returns {string}
 *
 * @example
 * normalizePath("base/path/") // -> "/base/path"
 */
const normalizePath = path => `/${stripSlashes(path)}`;

/**
 * Joins and normalizes multiple path fragments
 *
 * @param {...string} pathFragments
 * @returns {string}
 */
function join(...pathFragments) {
	const joinFragment = fragment => segmentize(fragment, true).join("/");
	const joinedSegments = pathFragments.map(joinFragment).join("/");
	return normalizePath(joinedSegments);
}

// We start from 1 here, so we can check if an origin id has been passed
// by using `originId || <fallback>`
const LINK_ID = 1;
const ROUTE_ID = 2;
const ROUTER_ID = 3;
const USE_FOCUS_ID = 4;
const USE_LOCATION_ID = 5;
const USE_MATCH_ID = 6;
const USE_NAVIGATE_ID = 7;
const USE_PARAMS_ID = 8;
const USE_RESOLVABLE_ID = 9;
const USE_RESOLVE_ID = 10;
const NAVIGATE_ID = 11;

const labels = {
	[LINK_ID]: "Link",
	[ROUTE_ID]: "Route",
	[ROUTER_ID]: "Router",
	[USE_FOCUS_ID]: "useFocus",
	[USE_LOCATION_ID]: "useLocation",
	[USE_MATCH_ID]: "useMatch",
	[USE_NAVIGATE_ID]: "useNavigate",
	[USE_PARAMS_ID]: "useParams",
	[USE_RESOLVABLE_ID]: "useResolvable",
	[USE_RESOLVE_ID]: "useResolve",
	[NAVIGATE_ID]: "navigate",
};

const createLabel = labelId => labels[labelId];

function createIdentifier(labelId, props) {
	let attr;
	if (labelId === ROUTE_ID) {
		attr = props.path ? `path="${props.path}"` : "default";
	} else if (labelId === LINK_ID) {
		attr = `to="${props.to}"`;
	} else if (labelId === ROUTER_ID) {
		attr = `basepath="${props.basepath || ""}"`;
	}
	return `<${createLabel(labelId)} ${attr || ""} />`;
}

function createMessage(labelId, message, props, originId) {
	const origin = props && createIdentifier(originId || labelId, props);
	const originMsg = origin ? `\n\nOccurred in: ${origin}` : "";
	const label = createLabel(labelId);
	const msg = isFunction$1(message) ? message(label) : message;
	return `<${label}> ${msg}${originMsg}`;
}

const createMessageHandler =
	handler =>
	(...args) =>
		handler(createMessage(...args));

const fail = createMessageHandler(message => {
	throw new Error(message);
});

// eslint-disable-next-line no-console
const warn = createMessageHandler(console.warn);

const SEGMENT_POINTS = 4;
const STATIC_POINTS = 3;
const DYNAMIC_POINTS = 2;
const SPLAT_PENALTY = 1;
const ROOT_POINTS = 1;

/**
 * Score a route depending on how its individual segments look
 * @param {object} route
 * @param {number} index
 * @return {object}
 */
function rankRoute(route, index) {
	const score = route.default
		? 0
		: segmentize(route.fullPath).reduce((acc, segment) => {
				let nextScore = acc;
				nextScore += SEGMENT_POINTS;

				if (isRootSegment(segment)) {
					nextScore += ROOT_POINTS;
				} else if (isDynamic(segment)) {
					nextScore += DYNAMIC_POINTS;
				} else if (isSplat(segment)) {
					nextScore -= SEGMENT_POINTS + SPLAT_PENALTY;
				} else {
					nextScore += STATIC_POINTS;
				}

				return nextScore;
		  }, 0);

	return { route, score, index };
}

/**
 * Give a score to all routes and sort them on that
 * @param {object[]} routes
 * @return {object[]}
 */
function rankRoutes(routes) {
	return (
		routes
			.map(rankRoute)
			// If two routes have the exact same score, we go by index instead
			.sort((a, b) => {
				if (a.score < b.score) {
					return 1;
				}
				if (a.score > b.score) {
					return -1;
				}
				return a.index - b.index;
			})
	);
}

/**
 * Ranks and picks the best route to match. Each segment gets the highest
 * amount of points, then the type of segment gets an additional amount of
 * points where
 *
 *  static > dynamic > splat > root
 *
 * This way we don't have to worry about the order of our routes, let the
 * computers do it.
 *
 * A route looks like this
 *
 *  { fullPath, default, value }
 *
 * And a returned match looks like:
 *
 *  { route, params, uri }
 *
 * @param {object[]} routes
 * @param {string} uri
 * @return {?object}
 */
function pick(routes, uri) {
	let bestMatch;
	let defaultMatch;

	const [uriPathname] = uri.split("?");
	const uriSegments = segmentize(uriPathname);
	const isRootUri = uriSegments[0] === "";
	const ranked = rankRoutes(routes);

	for (let i = 0, l = ranked.length; i < l; i++) {
		const { route } = ranked[i];
		let missed = false;
		const params = {};

		// eslint-disable-next-line no-shadow
		const createMatch = uri => ({ ...route, params, uri });

		if (route.default) {
			defaultMatch = createMatch(uri);
			continue;
		}

		const routeSegments = segmentize(route.fullPath);
		const max = Math.max(uriSegments.length, routeSegments.length);
		let index = 0;

		for (; index < max; index++) {
			const routeSegment = routeSegments[index];
			const uriSegment = uriSegments[index];

			if (!isUndefined(routeSegment) && isSplat(routeSegment)) {
				// Hit a splat, just grab the rest, and return a match
				// uri:   /files/documents/work
				// route: /files/* or /files/*splatname
				const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

				params[splatName] = uriSegments
					.slice(index)
					.map(decodeURIComponent)
					.join("/");
				break;
			}

			if (isUndefined(uriSegment)) {
				// URI is shorter than the route, no match
				// uri:   /users
				// route: /users/:userId
				missed = true;
				break;
			}

			const dynamicMatch = paramRegex.exec(routeSegment);

			if (dynamicMatch && !isRootUri) {
				const value = decodeURIComponent(uriSegment);
				params[dynamicMatch[1]] = value;
			} else if (routeSegment !== uriSegment) {
				// Current segments don't match, not dynamic, not splat, so no match
				// uri:   /users/123/settings
				// route: /users/:id/profile
				missed = true;
				break;
			}
		}

		if (!missed) {
			bestMatch = createMatch(join(...uriSegments.slice(0, index)));
			break;
		}
	}

	return bestMatch || defaultMatch || null;
}

/**
 * Check if the `route.fullPath` matches the `uri`.
 * @param {Object} route
 * @param {string} uri
 * @return {?object}
 */
function match(route, uri) {
	return pick([route], uri);
}

/**
 * Resolve URIs as though every path is a directory, no files. Relative URIs
 * in the browser can feel awkward because not only can you be "in a directory",
 * you can be "at a file", too. For example:
 *
 *  browserSpecResolve('foo', '/bar/') => /bar/foo
 *  browserSpecResolve('foo', '/bar') => /foo
 *
 * But on the command line of a file system, it's not as complicated. You can't
 * `cd` from a file, only directories. This way, links have to know less about
 * their current path. To go deeper you can do this:
 *
 *  <Link to="deeper"/>
 *  // instead of
 *  <Link to=`{${props.uri}/deeper}`/>
 *
 * Just like `cd`, if you want to go deeper from the command line, you do this:
 *
 *  cd deeper
 *  # not
 *  cd $(pwd)/deeper
 *
 * By treating every path as a directory, linking to relative paths should
 * require less contextual information and (fingers crossed) be more intuitive.
 * @param {string} to
 * @param {string} base
 * @return {string}
 */
function resolve(to, base) {
	// /foo/bar, /baz/qux => /foo/bar
	if (startsWith(to, "/")) {
		return to;
	}

	const [toPathname, toQuery] = to.split("?");
	const [basePathname] = base.split("?");
	const toSegments = segmentize(toPathname);
	const baseSegments = segmentize(basePathname);

	// ?a=b, /users?b=c => /users?a=b
	if (toSegments[0] === "") {
		return addQuery(basePathname, toQuery);
	}

	// profile, /users/789 => /users/789/profile
	if (!startsWith(toSegments[0], ".")) {
		const pathname = baseSegments.concat(toSegments).join("/");
		return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
	}

	// ./       , /users/123 => /users/123
	// ../      , /users/123 => /users
	// ../..    , /users/123 => /
	// ../../one, /a/b/c/d   => /a/b/one
	// .././one , /a/b/c/d   => /a/b/c/one
	const allSegments = baseSegments.concat(toSegments);
	const segments = [];

	allSegments.forEach(segment => {
		if (segment === "..") {
			segments.pop();
		} else if (segment !== ".") {
			segments.push(segment);
		}
	});

	return addQuery(`/${segments.join("/")}`, toQuery);
}

/**
 * Normalizes a location for consumption by `Route` children and the `Router`.
 * It removes the apps basepath from the pathname
 * and sets default values for `search` and `hash` properties.
 *
 * @param {Object} location The current global location supplied by the history component
 * @param {string} basepath The applications basepath (i.e. when serving from a subdirectory)
 *
 * @returns The normalized location
 */
function normalizeLocation(location, basepath) {
	const { pathname, hash = "", search = "", state } = location;
	const baseSegments = segmentize(basepath, true);
	const pathSegments = segmentize(pathname, true);
	while (baseSegments.length) {
		if (baseSegments[0] !== pathSegments[0]) {
			fail(
				ROUTER_ID,
				`Invalid state: All locations must begin with the basepath "${basepath}", found "${pathname}"`,
			);
		}
		baseSegments.shift();
		pathSegments.shift();
	}
	return {
		pathname: join(...pathSegments),
		hash,
		search,
		state,
	};
}

const normalizeUrlFragment = frag => (frag.length === 1 ? "" : frag);

/**
 * Creates a location object from an url.
 * It is used to create a location from the url prop used in SSR
 *
 * @param {string} url The url string (e.g. "/path/to/somewhere")
 * @returns {{ pathname: string; search: string; hash: string }} The location
 *
 * @example
 * ```js
 * const path = "/search?q=falafel#result-3";
 * const location = parsePath(path);
 * // -> {
 * //   pathname: "/search",
 * //   search: "?q=falafel",
 * //   hash: "#result-3",
 * // };
 * ```
 */
const parsePath = path => {
	const searchIndex = path.indexOf("?");
	const hashIndex = path.indexOf("#");
	const hasSearchIndex = searchIndex !== -1;
	const hasHashIndex = hashIndex !== -1;
	const hash = hasHashIndex
		? normalizeUrlFragment(substr(path, hashIndex))
		: "";
	const pathnameAndSearch = hasHashIndex ? substr(path, 0, hashIndex) : path;
	const search = hasSearchIndex
		? normalizeUrlFragment(substr(pathnameAndSearch, searchIndex))
		: "";
	const pathname =
		(hasSearchIndex
			? substr(pathnameAndSearch, 0, searchIndex)
			: pathnameAndSearch) || "/";
	return { pathname, search, hash };
};

/**
 * Joins a location object to one path string.
 *
 * @param {{ pathname: string; search: string; hash: string }} location The location object
 * @returns {string} A path, created from the location
 *
 * @example
 * ```js
 * const location = {
 *   pathname: "/search",
 *   search: "?q=falafel",
 *   hash: "#result-3",
 * };
 * const path = stringifyPath(location);
 * // -> "/search?q=falafel#result-3"
 * ```
 */
const stringifyPath = location => {
	const { pathname, search, hash } = location;
	return pathname + search + hash;
};

/**
 * Resolves a link relative to the parent Route and the Routers basepath.
 *
 * @param {string} path The given path, that will be resolved
 * @param {string} routeBase The current Routes base path
 * @param {string} appBase The basepath of the app. Used, when serving from a subdirectory
 * @returns {string} The resolved path
 *
 * @example
 * resolveLink("relative", "/routeBase", "/") // -> "/routeBase/relative"
 * resolveLink("/absolute", "/routeBase", "/") // -> "/absolute"
 * resolveLink("relative", "/routeBase", "/base") // -> "/base/routeBase/relative"
 * resolveLink("/absolute", "/routeBase", "/base") // -> "/base/absolute"
 */
function resolveLink(path, routeBase, appBase) {
	return join(appBase, resolve(path, routeBase));
}

/**
 * Get the uri for a Route, by matching it against the current location.
 *
 * @param {string} routePath The Routes resolved path
 * @param {string} pathname The current locations pathname
 */
function extractBaseUri(routePath, pathname) {
	const fullPath = normalizePath(stripSplat(routePath));
	const baseSegments = segmentize(fullPath, true);
	const pathSegments = segmentize(pathname, true).slice(0, baseSegments.length);
	const routeMatch = match({ fullPath }, join(...pathSegments));
	return routeMatch && routeMatch.uri;
}

/*
 * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
 *
 * https://github.com/reach/router/blob/master/LICENSE
 */


const POP = "POP";
const PUSH = "PUSH";
const REPLACE = "REPLACE";

function getLocation(source) {
	return {
		...source.location,
		pathname: encodeURI(decodeURI(source.location.pathname)),
		state: source.history.state,
		_key: (source.history.state && source.history.state._key) || "initial",
	};
}

function createHistory(source) {
	let listeners = [];
	let location = getLocation(source);
	let action = POP;

	const notifyListeners = (listenerFns = listeners) =>
		listenerFns.forEach(listener => listener({ location, action }));

	return {
		get location() {
			return location;
		},
		listen(listener) {
			listeners.push(listener);

			const popstateListener = () => {
				location = getLocation(source);
				action = POP;
				notifyListeners([listener]);
			};

			// Call listener when it is registered
			notifyListeners([listener]);

			const unlisten = addListener(source, "popstate", popstateListener);
			return () => {
				unlisten();
				listeners = listeners.filter(fn => fn !== listener);
			};
		},
		/**
		 * Navigate to a new absolute route.
		 *
		 * @param {string|number} to The path to navigate to.
		 *
		 * If `to` is a number we will navigate to the stack entry index + `to`
		 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
		 * @param {Object} options
		 * @param {*} [options.state] The state will be accessible through `location.state`
		 * @param {boolean} [options.replace=false] Replace the current entry in the history
		 * stack, instead of pushing on a new one
		 */
		navigate(to, options) {
			const { state = {}, replace = false } = options || {};
			action = replace ? REPLACE : PUSH;
			if (isNumber$1(to)) {
				if (options) {
					warn(
						NAVIGATE_ID,
						"Navigation options (state or replace) are not supported, " +
							"when passing a number as the first argument to navigate. " +
							"They are ignored.",
					);
				}
				action = POP;
				source.history.go(to);
			} else {
				const keyedState = { ...state, _key: createGlobalId() };
				// try...catch iOS Safari limits to 100 pushState calls
				try {
					source.history[replace ? "replaceState" : "pushState"](
						keyedState,
						"",
						to,
					);
				} catch (e) {
					source.location[replace ? "replace" : "assign"](to);
				}
			}

			location = getLocation(source);
			notifyListeners();
		},
	};
}

function createStackFrame(state, uri) {
	return { ...parsePath(uri), state };
}

// Stores history entries in memory for testing or other platforms like Native
function createMemorySource(initialPathname = "/") {
	let index = 0;
	let stack = [createStackFrame(null, initialPathname)];

	return {
		// This is just for testing...
		get entries() {
			return stack;
		},
		get location() {
			return stack[index];
		},
		addEventListener() {},
		removeEventListener() {},
		history: {
			get state() {
				return stack[index].state;
			},
			pushState(state, title, uri) {
				index++;
				// Throw away anything in the stack with an index greater than the current index.
				// This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
				// If we call `go(+n)` the stack entries with an index greater than the current index can
				// be reused.
				// However, if we navigate to a path, instead of a number, we want to create a new branch
				// of navigation.
				stack = stack.slice(0, index);
				stack.push(createStackFrame(state, uri));
			},
			replaceState(state, title, uri) {
				stack[index] = createStackFrame(state, uri);
			},
			go(to) {
				const newIndex = index + to;
				if (newIndex < 0 || newIndex > stack.length - 1) {
					return;
				}
				index = newIndex;
			},
		},
	};
}

// Global history uses window.history as the source if available,
// otherwise a memory history
const canUseDOM = !!(
	!isSSR &&
	window.document &&
	window.document.createElement
);
// Use memory history in iframes (for example in Svelte REPL)
const isEmbeddedPage = !isSSR && window.location.origin === "null";
const globalHistory = createHistory(
	canUseDOM && !isEmbeddedPage ? window : createMemorySource(),
);
const { navigate } = globalHistory;

// We need to keep the focus candidate in a separate file, so svelte does
// not update, when we mutate it.
// Also, we need a single global reference, because taking focus needs to
// work globally, even if we have multiple top level routers
// eslint-disable-next-line import/no-mutable-exports
let focusCandidate = null;

// eslint-disable-next-line import/no-mutable-exports
let initialNavigation = true;

/**
 * Check if RouterA is above RouterB in the document
 * @param {number} routerIdA The first Routers id
 * @param {number} routerIdB The second Routers id
 */
function isAbove(routerIdA, routerIdB) {
	const routerMarkers = document.querySelectorAll("[data-svnav-router]");
	for (let i = 0; i < routerMarkers.length; i++) {
		const node = routerMarkers[i];
		const currentId = Number(node.dataset.svnavRouter);
		if (currentId === routerIdA) return true;
		if (currentId === routerIdB) return false;
	}
	return false;
}

/**
 * Check if a Route candidate is the best choice to move focus to,
 * and store the best match.
 * @param {{
     level: number;
     routerId: number;
     route: {
       id: number;
       focusElement: import("svelte/store").Readable<Promise<Element>|null>;
     }
   }} item A Route candidate, that updated and is visible after a navigation
 */
function pushFocusCandidate(item) {
	if (
		// Best candidate if it's the only candidate...
		!focusCandidate ||
		// Route is nested deeper, than previous candidate
		// -> Route change was triggered in the deepest affected
		// Route, so that's were focus should move to
		item.level > focusCandidate.level ||
		// If the level is identical, we want to focus the first Route in the document,
		// so we pick the first Router lookin from page top to page bottom.
		(item.level === focusCandidate.level &&
			isAbove(item.routerId, focusCandidate.routerId))
	) {
		focusCandidate = item;
	}
}

/**
 * Reset the focus candidate.
 */
function clearFocusCandidate() {
	focusCandidate = null;
}

function initialNavigationOccurred() {
	initialNavigation = false;
}

/*
 * `focus` Adapted from https://github.com/oaf-project/oaf-side-effects/blob/master/src/index.ts
 *
 * https://github.com/oaf-project/oaf-side-effects/blob/master/LICENSE
 */
function focus(elem) {
	if (!elem) return false;
	const TABINDEX = "tabindex";
	try {
		if (!elem.hasAttribute(TABINDEX)) {
			elem.setAttribute(TABINDEX, "-1");
			let unlisten;
			// We remove tabindex after blur to avoid weird browser behavior
			// where a mouse click can activate elements with tabindex="-1".
			const blurListener = () => {
				elem.removeAttribute(TABINDEX);
				unlisten();
			};
			unlisten = addListener(elem, "blur", blurListener);
		}
		elem.focus();
		return document.activeElement === elem;
	} catch (e) {
		// Apparently trying to focus a disabled element in IE can throw.
		// See https://stackoverflow.com/a/1600194/2476884
		return false;
	}
}

function isEndMarker(elem, id) {
	return Number(elem.dataset.svnavRouteEnd) === id;
}

function isHeading(elem) {
	return /^H[1-6]$/i.test(elem.tagName);
}

function query(selector, parent = document) {
	return parent.querySelector(selector);
}

function queryHeading(id) {
	const marker = query(`[data-svnav-route-start="${id}"]`);
	let current = marker.nextElementSibling;
	while (!isEndMarker(current, id)) {
		if (isHeading(current)) {
			return current;
		}
		const heading = query("h1,h2,h3,h4,h5,h6", current);
		if (heading) {
			return heading;
		}
		current = current.nextElementSibling;
	}
	return null;
}

function handleFocus(route) {
	Promise.resolve(get_store_value(route.focusElement)).then(elem => {
		const focusElement = elem || queryHeading(route.id);
		if (!focusElement) {
			warn(
				ROUTER_ID,
				"Could not find an element to focus. " +
					"You should always render a header for accessibility reasons, " +
					'or set a custom focus element via the "useFocus" hook. ' +
					"If you don't want this Route or Router to manage focus, " +
					'pass "primary={false}" to it.',
				route,
				ROUTE_ID,
			);
		}
		const headingFocused = focus(focusElement);
		if (headingFocused) return;
		focus(document.documentElement);
	});
}

const createTriggerFocus =
	(a11yConfig, announcementText, location) =>
	(manageFocus, announceNavigation) =>
		// Wait until the dom is updated, so we can look for headings
		tick().then(() => {
			if (!focusCandidate || initialNavigation) {
				initialNavigationOccurred();
				return;
			}
			if (manageFocus) {
				handleFocus(focusCandidate.route);
			}
			if (a11yConfig.announcements && announceNavigation) {
				const { path, fullPath, meta, params, uri } = focusCandidate.route;
				const announcementMessage = a11yConfig.createAnnouncement(
					{ path, fullPath, meta, params, uri },
					get_store_value(location),
				);
				Promise.resolve(announcementMessage).then(message => {
					announcementText.set(message);
				});
			}
			clearFocusCandidate();
		});

const visuallyHiddenStyle =
	"position:fixed;" +
	"top:-1px;" +
	"left:0;" +
	"width:1px;" +
	"height:1px;" +
	"padding:0;" +
	"overflow:hidden;" +
	"clip:rect(0,0,0,0);" +
	"white-space:nowrap;" +
	"border:0;";

/* node_modules\svelte-navigator\src\Router.svelte generated by Svelte v3.59.1 */

const file$b = "node_modules\\svelte-navigator\\src\\Router.svelte";

// (204:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
function create_if_block$5(ctx) {
	let div;
	let t;

	let div_levels = [
		{ role: "status" },
		{ "aria-atomic": "true" },
		{ "aria-live": "polite" },
		{ "data-svnav-announcer": "" },
		createInlineStyle(/*shouldDisableInlineStyles*/ ctx[6], visuallyHiddenStyle)
	];

	let div_data = {};

	for (let i = 0; i < div_levels.length; i += 1) {
		div_data = assign(div_data, div_levels[i]);
	}

	const block = {
		c: function create() {
			div = element("div");
			t = text(/*$announcementText*/ ctx[0]);
			set_attributes(div, div_data);
			add_location(div, file$b, 204, 1, 6149);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*$announcementText*/ 1) set_data_maybe_contenteditable_dev(t, /*$announcementText*/ ctx[0], div_data['contenteditable']);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$5.name,
		type: "if",
		source: "(204:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}",
		ctx
	});

	return block;
}

function create_fragment$c(ctx) {
	let div;
	let t0;
	let t1;
	let if_block_anchor;
	let current;

	let div_levels = [
		createMarkerProps(/*shouldDisableInlineStyles*/ ctx[6]),
		{ "data-svnav-router": /*routerId*/ ctx[3] }
	];

	let div_data = {};

	for (let i = 0; i < div_levels.length; i += 1) {
		div_data = assign(div_data, div_levels[i]);
	}

	const default_slot_template = /*#slots*/ ctx[22].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], null);
	let if_block = /*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements && create_if_block$5(ctx);

	const block = {
		c: function create() {
			div = element("div");
			t0 = space();
			if (default_slot) default_slot.c();
			t1 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			set_attributes(div, div_data);
			add_location(div, file$b, 196, 0, 5982);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			insert_dev(target, t0, anchor);

			if (default_slot) {
				default_slot.m(target, anchor);
			}

			insert_dev(target, t1, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 2097152)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[21],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[21])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[21], dirty, null),
						null
					);
				}
			}

			if (/*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements) if_block.p(ctx, dirty);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (detaching) detach_dev(t0);
			if (default_slot) default_slot.d(detaching);
			if (detaching) detach_dev(t1);
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$c.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const createId$1 = createCounter();
const defaultBasepath = "/";

function instance$e($$self, $$props, $$invalidate) {
	let $location;
	let $activeRoute;
	let $prevLocation;
	let $routes;
	let $announcementText;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Router', slots, ['default']);
	let { basepath = defaultBasepath } = $$props;
	let { url = null } = $$props;
	let { history = globalHistory } = $$props;
	let { primary = true } = $$props;
	let { a11y = {} } = $$props;
	let { disableInlineStyles = false } = $$props;

	const a11yConfig = {
		createAnnouncement: route => `Navigated to ${route.uri}`,
		announcements: true,
		...a11y
	};

	// Remember the initial `basepath`, so we can fire a warning
	// when the user changes it later
	const initialBasepath = basepath;

	const normalizedBasepath = normalizePath(basepath);
	const locationContext = getContext(LOCATION);
	const routerContext = getContext(ROUTER);
	const isTopLevelRouter = !locationContext;
	const routerId = createId$1();
	const manageFocus = primary && !(routerContext && !routerContext.manageFocus);
	const announcementText = writable("");
	validate_store(announcementText, 'announcementText');
	component_subscribe($$self, announcementText, value => $$invalidate(0, $announcementText = value));

	const shouldDisableInlineStyles = routerContext
	? routerContext.disableInlineStyles
	: disableInlineStyles;

	const routes = writable([]);
	validate_store(routes, 'routes');
	component_subscribe($$self, routes, value => $$invalidate(20, $routes = value));
	const activeRoute = writable(null);
	validate_store(activeRoute, 'activeRoute');
	component_subscribe($$self, activeRoute, value => $$invalidate(18, $activeRoute = value));

	// Used in SSR to synchronously set that a Route is active.
	let hasActiveRoute = false;

	// Nesting level of router.
	// We will need this to identify sibling routers, when moving
	// focus on navigation, so we can focus the first possible router
	const level = isTopLevelRouter ? 0 : routerContext.level + 1;

	// If we're running an SSR we force the location to the `url` prop
	const getInitialLocation = () => normalizeLocation(isSSR ? parsePath(url) : history.location, normalizedBasepath);

	const location = isTopLevelRouter
	? writable(getInitialLocation())
	: locationContext;

	validate_store(location, 'location');
	component_subscribe($$self, location, value => $$invalidate(17, $location = value));
	const prevLocation = writable($location);
	validate_store(prevLocation, 'prevLocation');
	component_subscribe($$self, prevLocation, value => $$invalidate(19, $prevLocation = value));
	const triggerFocus = createTriggerFocus(a11yConfig, announcementText, location);
	const createRouteFilter = routeId => routeList => routeList.filter(routeItem => routeItem.id !== routeId);

	function registerRoute(route) {
		if (isSSR) {
			// In SSR we should set the activeRoute immediately if it is a match.
			// If there are more Routes being registered after a match is found,
			// we just skip them.
			if (hasActiveRoute) {
				return;
			}

			const matchingRoute = match(route, $location.pathname);

			if (matchingRoute) {
				hasActiveRoute = true;

				// Return the match in SSR mode, so the matched Route can use it immediatly.
				// Waiting for activeRoute to update does not work, because it updates
				// after the Route is initialized
				return matchingRoute; // eslint-disable-line consistent-return
			}
		} else {
			routes.update(prevRoutes => {
				// Remove an old version of the updated route,
				// before pushing the new version
				const nextRoutes = createRouteFilter(route.id)(prevRoutes);

				nextRoutes.push(route);
				return nextRoutes;
			});
		}
	}

	function unregisterRoute(routeId) {
		routes.update(createRouteFilter(routeId));
	}

	if (!isTopLevelRouter && basepath !== defaultBasepath) {
		warn(ROUTER_ID, 'Only top-level Routers can have a "basepath" prop. It is ignored.', { basepath });
	}

	if (isTopLevelRouter) {
		// The topmost Router in the tree is responsible for updating
		// the location store and supplying it through context.
		onMount(() => {
			const unlisten = history.listen(changedHistory => {
				const normalizedLocation = normalizeLocation(changedHistory.location, normalizedBasepath);
				prevLocation.set($location);
				location.set(normalizedLocation);
			});

			return unlisten;
		});

		setContext(LOCATION, location);
	}

	setContext(ROUTER, {
		activeRoute,
		registerRoute,
		unregisterRoute,
		manageFocus,
		level,
		id: routerId,
		history: isTopLevelRouter ? history : routerContext.history,
		basepath: isTopLevelRouter
		? normalizedBasepath
		: routerContext.basepath,
		disableInlineStyles: shouldDisableInlineStyles
	});

	const writable_props = ['basepath', 'url', 'history', 'primary', 'a11y', 'disableInlineStyles'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('basepath' in $$props) $$invalidate(11, basepath = $$props.basepath);
		if ('url' in $$props) $$invalidate(12, url = $$props.url);
		if ('history' in $$props) $$invalidate(13, history = $$props.history);
		if ('primary' in $$props) $$invalidate(14, primary = $$props.primary);
		if ('a11y' in $$props) $$invalidate(15, a11y = $$props.a11y);
		if ('disableInlineStyles' in $$props) $$invalidate(16, disableInlineStyles = $$props.disableInlineStyles);
		if ('$$scope' in $$props) $$invalidate(21, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		createCounter,
		createInlineStyle,
		createMarkerProps,
		createId: createId$1,
		getContext,
		setContext,
		onMount,
		writable,
		LOCATION,
		ROUTER,
		globalHistory,
		normalizePath,
		pick,
		match,
		normalizeLocation,
		parsePath,
		isSSR,
		warn,
		ROUTER_ID,
		pushFocusCandidate,
		visuallyHiddenStyle,
		createTriggerFocus,
		defaultBasepath,
		basepath,
		url,
		history,
		primary,
		a11y,
		disableInlineStyles,
		a11yConfig,
		initialBasepath,
		normalizedBasepath,
		locationContext,
		routerContext,
		isTopLevelRouter,
		routerId,
		manageFocus,
		announcementText,
		shouldDisableInlineStyles,
		routes,
		activeRoute,
		hasActiveRoute,
		level,
		getInitialLocation,
		location,
		prevLocation,
		triggerFocus,
		createRouteFilter,
		registerRoute,
		unregisterRoute,
		$location,
		$activeRoute,
		$prevLocation,
		$routes,
		$announcementText
	});

	$$self.$inject_state = $$props => {
		if ('basepath' in $$props) $$invalidate(11, basepath = $$props.basepath);
		if ('url' in $$props) $$invalidate(12, url = $$props.url);
		if ('history' in $$props) $$invalidate(13, history = $$props.history);
		if ('primary' in $$props) $$invalidate(14, primary = $$props.primary);
		if ('a11y' in $$props) $$invalidate(15, a11y = $$props.a11y);
		if ('disableInlineStyles' in $$props) $$invalidate(16, disableInlineStyles = $$props.disableInlineStyles);
		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*basepath*/ 2048) {
			if (basepath !== initialBasepath) {
				warn(ROUTER_ID, 'You cannot change the "basepath" prop. It is ignored.');
			}
		}

		if ($$self.$$.dirty[0] & /*$routes, $location*/ 1179648) {
			// This reactive statement will be run when the Router is created
			// when there are no Routes and then again the following tick, so it
			// will not find an active Route in SSR and in the browser it will only
			// pick an active Route after all Routes have been registered.
			{
				const bestMatch = pick($routes, $location.pathname);
				activeRoute.set(bestMatch);
			}
		}

		if ($$self.$$.dirty[0] & /*$location, $prevLocation*/ 655360) {
			// Manage focus and announce navigation to screen reader users
			{
				if (isTopLevelRouter) {
					const hasHash = !!$location.hash;

					// When a hash is present in the url, we skip focus management, because
					// focusing a different element will prevent in-page jumps (See #3)
					const shouldManageFocus = !hasHash && manageFocus;

					// We don't want to make an announcement, when the hash changes,
					// but the active route stays the same
					const announceNavigation = !hasHash || $location.pathname !== $prevLocation.pathname;

					triggerFocus(shouldManageFocus, announceNavigation);
				}
			}
		}

		if ($$self.$$.dirty[0] & /*$activeRoute*/ 262144) {
			// Queue matched Route, so top level Router can decide which Route to focus.
			// Non primary Routers should just be ignored
			if (manageFocus && $activeRoute && $activeRoute.primary) {
				pushFocusCandidate({ level, routerId, route: $activeRoute });
			}
		}
	};

	return [
		$announcementText,
		a11yConfig,
		isTopLevelRouter,
		routerId,
		manageFocus,
		announcementText,
		shouldDisableInlineStyles,
		routes,
		activeRoute,
		location,
		prevLocation,
		basepath,
		url,
		history,
		primary,
		a11y,
		disableInlineStyles,
		$location,
		$activeRoute,
		$prevLocation,
		$routes,
		$$scope,
		slots
	];
}

class Router extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init$1(
			this,
			options,
			instance$e,
			create_fragment$c,
			safe_not_equal,
			{
				basepath: 11,
				url: 12,
				history: 13,
				primary: 14,
				a11y: 15,
				disableInlineStyles: 16
			},
			null,
			[-1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Router",
			options,
			id: create_fragment$c.name
		});
	}

	get basepath() {
		return this.$$.ctx[11];
	}

	set basepath(basepath) {
		this.$$set({ basepath });
		flush();
	}

	get url() {
		return this.$$.ctx[12];
	}

	set url(url) {
		this.$$set({ url });
		flush();
	}

	get history() {
		return this.$$.ctx[13];
	}

	set history(history) {
		this.$$set({ history });
		flush();
	}

	get primary() {
		return this.$$.ctx[14];
	}

	set primary(primary) {
		this.$$set({ primary });
		flush();
	}

	get a11y() {
		return this.$$.ctx[15];
	}

	set a11y(a11y) {
		this.$$set({ a11y });
		flush();
	}

	get disableInlineStyles() {
		return this.$$.ctx[16];
	}

	set disableInlineStyles(disableInlineStyles) {
		this.$$set({ disableInlineStyles });
		flush();
	}
}

var Router$1 = Router;

/**
 * Check if a component or hook have been created outside of a
 * context providing component
 * @param {number} componentId
 * @param {*} props
 * @param {string?} ctxKey
 * @param {number?} ctxProviderId
 */
function usePreflightCheck(
	componentId,
	props,
	ctxKey = ROUTER,
	ctxProviderId = ROUTER_ID,
) {
	const ctx = getContext(ctxKey);
	if (!ctx) {
		fail(
			componentId,
			label =>
				`You cannot use ${label} outside of a ${createLabel(ctxProviderId)}.`,
			props,
		);
	}
}

const toReadonly = ctx => {
	const { subscribe } = getContext(ctx);
	return { subscribe };
};

/**
 * Access the current location via a readable store.
 * @returns {import("svelte/store").Readable<{
    pathname: string;
    search: string;
    hash: string;
    state: {};
  }>}
 *
 * @example
  ```html
  <script>
    import { useLocation } from "svelte-navigator";

    const location = useLocation();

    $: console.log($location);
    // {
    //   pathname: "/blog",
    //   search: "?id=123",
    //   hash: "#comments",
    //   state: {}
    // }
  </script>
  ```
 */
function useLocation() {
	usePreflightCheck(USE_LOCATION_ID);
	return toReadonly(LOCATION);
}

/**
 * @typedef {{
    path: string;
    fullPath: string;
    uri: string;
    params: {};
  }} RouteMatch
 */

/**
 * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
 */

/**
 * Access the history of top level Router.
 */
function useHistory() {
	const { history } = getContext(ROUTER);
	return history;
}

/**
 * Access the base of the parent Route.
 */
function useRouteBase() {
	const route = getContext(ROUTE);
	return route ? derived(route, _route => _route.base) : writable("/");
}

/**
 * Resolve a given link relative to the current `Route` and the `Router`s `basepath`.
 * It is used under the hood in `Link` and `useNavigate`.
 * You can use it to manually resolve links, when using the `link` or `links` actions.
 *
 * @returns {(path: string) => string}
 *
 * @example
  ```html
  <script>
    import { link, useResolve } from "svelte-navigator";

    const resolve = useResolve();
    // `resolvedLink` will be resolved relative to its parent Route
    // and the Routers `basepath`
    const resolvedLink = resolve("relativePath");
  </script>

  <a href={resolvedLink} use:link>Relative link</a>
  ```
 */
function useResolve() {
	usePreflightCheck(USE_RESOLVE_ID);
	const routeBase = useRouteBase();
	const { basepath: appBase } = getContext(ROUTER);
	/**
	 * Resolves the path relative to the current route and basepath.
	 *
	 * @param {string} path The path to resolve
	 * @returns {string} The resolved path
	 */
	const resolve = path => resolveLink(path, get_store_value(routeBase), appBase);
	return resolve;
}

/**
 * A hook, that returns a context-aware version of `navigate`.
 * It will automatically resolve the given link relative to the current Route.
 * It will also resolve a link against the `basepath` of the Router.
 *
 * @example
  ```html
  <!-- App.svelte -->
  <script>
    import { link, Route } from "svelte-navigator";
    import RouteComponent from "./RouteComponent.svelte";
  </script>

  <Router>
    <Route path="route1">
      <RouteComponent />
    </Route>
    <!-- ... -->
  </Router>

  <!-- RouteComponent.svelte -->
  <script>
    import { useNavigate } from "svelte-navigator";

    const navigate = useNavigate();
  </script>

  <button on:click="{() => navigate('relativePath')}">
    go to /route1/relativePath
  </button>
  <button on:click="{() => navigate('/absolutePath')}">
    go to /absolutePath
  </button>
  ```
  *
  * @example
  ```html
  <!-- App.svelte -->
  <script>
    import { link, Route } from "svelte-navigator";
    import RouteComponent from "./RouteComponent.svelte";
  </script>

  <Router basepath="/base">
    <Route path="route1">
      <RouteComponent />
    </Route>
    <!-- ... -->
  </Router>

  <!-- RouteComponent.svelte -->
  <script>
    import { useNavigate } from "svelte-navigator";

    const navigate = useNavigate();
  </script>

  <button on:click="{() => navigate('relativePath')}">
    go to /base/route1/relativePath
  </button>
  <button on:click="{() => navigate('/absolutePath')}">
    go to /base/absolutePath
  </button>
  ```
 */
function useNavigate() {
	usePreflightCheck(USE_NAVIGATE_ID);
	const resolve = useResolve();
	const { navigate } = useHistory();
	/**
	 * Navigate to a new route.
	 * Resolves the link relative to the current route and basepath.
	 *
	 * @param {string|number} to The path to navigate to.
	 *
	 * If `to` is a number we will navigate to the stack entry index + `to`
	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
	 * @param {Object} options
	 * @param {*} [options.state]
	 * @param {boolean} [options.replace=false]
	 */
	const navigateRelative = (to, options) => {
		// If to is a number, we navigate to the target stack entry via `history.go`.
		// Otherwise resolve the link
		const target = isNumber$1(to) ? to : resolve(to);
		return navigate(target, options);
	};
	return navigateRelative;
}

/* node_modules\svelte-navigator\src\Route.svelte generated by Svelte v3.59.1 */
const file$a = "node_modules\\svelte-navigator\\src\\Route.svelte";

const get_default_slot_changes = dirty => ({
	params: dirty & /*$params*/ 16,
	location: dirty & /*$location*/ 8
});

const get_default_slot_context = ctx => ({
	params: isSSR ? get_store_value(/*params*/ ctx[10]) : /*$params*/ ctx[4],
	location: /*$location*/ ctx[3],
	navigate: /*navigate*/ ctx[11]
});

// (98:0) {#if isActive}
function create_if_block$4(ctx) {
	let router;
	let current;

	router = new Router$1({
			props: {
				primary: /*primary*/ ctx[1],
				$$slots: { default: [create_default_slot$1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(router.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(router, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const router_changes = {};
			if (dirty & /*primary*/ 2) router_changes.primary = /*primary*/ ctx[1];

			if (dirty & /*$$scope, component, $location, $params, $$restProps*/ 528409) {
				router_changes.$$scope = { dirty, ctx };
			}

			router.$set(router_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(router.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(router.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(router, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$4.name,
		type: "if",
		source: "(98:0) {#if isActive}",
		ctx
	});

	return block;
}

// (114:2) {:else}
function create_else_block(ctx) {
	let current;
	const default_slot_template = /*#slots*/ ctx[18].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], get_default_slot_context);

	const block = {
		c: function create() {
			if (default_slot) default_slot.c();
		},
		m: function mount(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope, $params, $location*/ 524312)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[19],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, get_default_slot_changes),
						get_default_slot_context
					);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(114:2) {:else}",
		ctx
	});

	return block;
}

// (106:2) {#if component !== null}
function create_if_block_1$3(ctx) {
	let switch_instance;
	let switch_instance_anchor;
	let current;

	const switch_instance_spread_levels = [
		{ location: /*$location*/ ctx[3] },
		{ navigate: /*navigate*/ ctx[11] },
		isSSR ? get_store_value(/*params*/ ctx[10]) : /*$params*/ ctx[4],
		/*$$restProps*/ ctx[12]
	];

	var switch_value = /*component*/ ctx[0];

	function switch_props(ctx) {
		let switch_instance_props = {};

		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
		}

		return {
			props: switch_instance_props,
			$$inline: true
		};
	}

	if (switch_value) {
		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
	}

	const block = {
		c: function create() {
			if (switch_instance) create_component(switch_instance.$$.fragment);
			switch_instance_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (switch_instance) mount_component(switch_instance, target, anchor);
			insert_dev(target, switch_instance_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const switch_instance_changes = (dirty & /*$location, navigate, isSSR, get, params, $params, $$restProps*/ 7192)
			? get_spread_update(switch_instance_spread_levels, [
					dirty & /*$location*/ 8 && { location: /*$location*/ ctx[3] },
					dirty & /*navigate*/ 2048 && { navigate: /*navigate*/ ctx[11] },
					dirty & /*isSSR, get, params, $params*/ 1040 && get_spread_object(isSSR ? get_store_value(/*params*/ ctx[10]) : /*$params*/ ctx[4]),
					dirty & /*$$restProps*/ 4096 && get_spread_object(/*$$restProps*/ ctx[12])
				])
			: {};

			if (dirty & /*component*/ 1 && switch_value !== (switch_value = /*component*/ ctx[0])) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(switch_instance_anchor);
			if (switch_instance) destroy_component(switch_instance, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$3.name,
		type: "if",
		source: "(106:2) {#if component !== null}",
		ctx
	});

	return block;
}

// (99:1) <Router {primary}>
function create_default_slot$1(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block_1$3, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*component*/ ctx[0] !== null) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$1.name,
		type: "slot",
		source: "(99:1) <Router {primary}>",
		ctx
	});

	return block;
}

function create_fragment$b(ctx) {
	let div0;
	let t0;
	let t1;
	let div1;
	let current;

	let div0_levels = [
		createMarkerProps(/*disableInlineStyles*/ ctx[7]),
		{ "data-svnav-route-start": /*id*/ ctx[5] }
	];

	let div_data_1 = {};

	for (let i = 0; i < div0_levels.length; i += 1) {
		div_data_1 = assign(div_data_1, div0_levels[i]);
	}

	let if_block = /*isActive*/ ctx[2] && create_if_block$4(ctx);

	let div1_levels = [
		createMarkerProps(/*disableInlineStyles*/ ctx[7]),
		{ "data-svnav-route-end": /*id*/ ctx[5] }
	];

	let div_data = {};

	for (let i = 0; i < div1_levels.length; i += 1) {
		div_data = assign(div_data, div1_levels[i]);
	}

	const block = {
		c: function create() {
			div0 = element("div");
			t0 = space();
			if (if_block) if_block.c();
			t1 = space();
			div1 = element("div");
			set_attributes(div0, div_data_1);
			add_location(div0, file$a, 96, 0, 2664);
			set_attributes(div1, div_data);
			add_location(div1, file$a, 122, 0, 3340);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div0, anchor);
			insert_dev(target, t0, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, t1, anchor);
			insert_dev(target, div1, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*isActive*/ ctx[2]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*isActive*/ 4) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$4(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(t1.parentNode, t1);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div0);
			if (detaching) detach_dev(t0);
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(div1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$b.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const createId = createCounter();

function instance$d($$self, $$props, $$invalidate) {
	let isActive;
	const omit_props_names = ["path","component","meta","primary"];
	let $$restProps = compute_rest_props($$props, omit_props_names);
	let $activeRoute;
	let $location;
	let $parentBase;
	let $params;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Route', slots, ['default']);
	let { path = "" } = $$props;
	let { component = null } = $$props;
	let { meta = {} } = $$props;
	let { primary = true } = $$props;
	usePreflightCheck(ROUTE_ID, $$props);
	const id = createId();
	const { registerRoute, unregisterRoute, activeRoute, disableInlineStyles } = getContext(ROUTER);
	validate_store(activeRoute, 'activeRoute');
	component_subscribe($$self, activeRoute, value => $$invalidate(16, $activeRoute = value));
	const parentBase = useRouteBase();
	validate_store(parentBase, 'parentBase');
	component_subscribe($$self, parentBase, value => $$invalidate(17, $parentBase = value));
	const location = useLocation();
	validate_store(location, 'location');
	component_subscribe($$self, location, value => $$invalidate(3, $location = value));
	const focusElement = writable(null);

	// In SSR we cannot wait for $activeRoute to update,
	// so we use the match returned from `registerRoute` instead
	let ssrMatch;

	const route = writable();
	const params = writable({});
	validate_store(params, 'params');
	component_subscribe($$self, params, value => $$invalidate(4, $params = value));
	setContext(ROUTE, route);
	setContext(ROUTE_PARAMS, params);
	setContext(FOCUS_ELEM, focusElement);

	// We need to call useNavigate after the route is set,
	// so we can use the routes path for link resolution
	const navigate = useNavigate();

	// There is no need to unregister Routes in SSR since it will all be
	// thrown away anyway
	if (!isSSR) {
		onDestroy(() => unregisterRoute(id));
	}

	$$self.$$set = $$new_props => {
		$$invalidate(24, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		$$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
		if ('path' in $$new_props) $$invalidate(13, path = $$new_props.path);
		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
		if ('meta' in $$new_props) $$invalidate(14, meta = $$new_props.meta);
		if ('primary' in $$new_props) $$invalidate(1, primary = $$new_props.primary);
		if ('$$scope' in $$new_props) $$invalidate(19, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		createCounter,
		createMarkerProps,
		createId,
		getContext,
		onDestroy,
		setContext,
		writable,
		get: get_store_value,
		Router: Router$1,
		ROUTER,
		ROUTE,
		ROUTE_PARAMS,
		FOCUS_ELEM,
		useLocation,
		useNavigate,
		useRouteBase,
		usePreflightCheck,
		isSSR,
		extractBaseUri,
		join,
		ROUTE_ID,
		path,
		component,
		meta,
		primary,
		id,
		registerRoute,
		unregisterRoute,
		activeRoute,
		disableInlineStyles,
		parentBase,
		location,
		focusElement,
		ssrMatch,
		route,
		params,
		navigate,
		isActive,
		$activeRoute,
		$location,
		$parentBase,
		$params
	});

	$$self.$inject_state = $$new_props => {
		$$invalidate(24, $$props = assign(assign({}, $$props), $$new_props));
		if ('path' in $$props) $$invalidate(13, path = $$new_props.path);
		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
		if ('meta' in $$props) $$invalidate(14, meta = $$new_props.meta);
		if ('primary' in $$props) $$invalidate(1, primary = $$new_props.primary);
		if ('ssrMatch' in $$props) $$invalidate(15, ssrMatch = $$new_props.ssrMatch);
		if ('isActive' in $$props) $$invalidate(2, isActive = $$new_props.isActive);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*path, $parentBase, meta, $location, primary*/ 155658) {
			{
				// The route store will be re-computed whenever props, location or parentBase change
				const isDefault = path === "";

				const rawBase = join($parentBase, path);

				const updatedRoute = {
					id,
					path,
					meta,
					// If no path prop is given, this Route will act as the default Route
					// that is rendered if no other Route in the Router is a match
					default: isDefault,
					fullPath: isDefault ? "" : rawBase,
					base: isDefault
					? $parentBase
					: extractBaseUri(rawBase, $location.pathname),
					primary,
					focusElement
				};

				route.set(updatedRoute);

				// If we're in SSR mode and the Route matches,
				// `registerRoute` will return the match
				$$invalidate(15, ssrMatch = registerRoute(updatedRoute));
			}
		}

		if ($$self.$$.dirty & /*ssrMatch, $activeRoute*/ 98304) {
			$$invalidate(2, isActive = !!(ssrMatch || $activeRoute && $activeRoute.id === id));
		}

		if ($$self.$$.dirty & /*isActive, ssrMatch, $activeRoute*/ 98308) {
			if (isActive) {
				const { params: activeParams } = ssrMatch || $activeRoute;
				params.set(activeParams);
			}
		}
	};

	$$props = exclude_internal_props($$props);

	return [
		component,
		primary,
		isActive,
		$location,
		$params,
		id,
		activeRoute,
		disableInlineStyles,
		parentBase,
		location,
		params,
		navigate,
		$$restProps,
		path,
		meta,
		ssrMatch,
		$activeRoute,
		$parentBase,
		slots,
		$$scope
	];
}

class Route extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init$1(this, options, instance$d, create_fragment$b, safe_not_equal, {
			path: 13,
			component: 0,
			meta: 14,
			primary: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Route",
			options,
			id: create_fragment$b.name
		});
	}

	get path() {
		return this.$$.ctx[13];
	}

	set path(path) {
		this.$$set({ path });
		flush();
	}

	get component() {
		return this.$$.ctx[0];
	}

	set component(component) {
		this.$$set({ component });
		flush();
	}

	get meta() {
		return this.$$.ctx[14];
	}

	set meta(meta) {
		this.$$set({ meta });
		flush();
	}

	get primary() {
		return this.$$.ctx[1];
	}

	set primary(primary) {
		this.$$set({ primary });
		flush();
	}
}

var Route$1 = Route;

/* node_modules\svelte-navigator\src\Link.svelte generated by Svelte v3.59.1 */
const file$9 = "node_modules\\svelte-navigator\\src\\Link.svelte";

function create_fragment$a(ctx) {
	let a;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[13].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
	let a_levels = [{ href: /*href*/ ctx[0] }, /*ariaCurrent*/ ctx[2], /*props*/ ctx[1]];
	let a_data = {};

	for (let i = 0; i < a_levels.length; i += 1) {
		a_data = assign(a_data, a_levels[i]);
	}

	const block = {
		c: function create() {
			a = element("a");
			if (default_slot) default_slot.c();
			set_attributes(a, a_data);
			add_location(a, file$9, 65, 0, 1861);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, a, anchor);

			if (default_slot) {
				default_slot.m(a, null);
			}

			current = true;

			if (!mounted) {
				dispose = listen_dev(a, "click", /*onClick*/ ctx[4], false, false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[12],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
						null
					);
				}
			}

			set_attributes(a, a_data = get_spread_update(a_levels, [
				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
				dirty & /*ariaCurrent*/ 4 && /*ariaCurrent*/ ctx[2],
				dirty & /*props*/ 2 && /*props*/ ctx[1]
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(a);
			if (default_slot) default_slot.d(detaching);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$a.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$c($$self, $$props, $$invalidate) {
	let href;
	let isPartiallyCurrent;
	let isCurrent;
	let isExactCurrent;
	let ariaCurrent;
	let props;
	const omit_props_names = ["to","replace","state","getProps"];
	let $$restProps = compute_rest_props($$props, omit_props_names);
	let $location;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Link', slots, ['default']);
	let { to } = $$props;
	let { replace = false } = $$props;
	let { state = {} } = $$props;
	let { getProps = null } = $$props;
	usePreflightCheck(LINK_ID, $$props);
	const location = useLocation();
	validate_store(location, 'location');
	component_subscribe($$self, location, value => $$invalidate(11, $location = value));
	const dispatch = createEventDispatcher();
	const resolve = useResolve();
	const { navigate } = useHistory();

	function onClick(event) {
		dispatch("click", event);

		if (shouldNavigate(event)) {
			event.preventDefault();

			// Don't push another entry to the history stack when the user
			// clicks on a Link to the page they are currently on.
			const shouldReplace = isExactCurrent || replace;

			navigate(href, { state, replace: shouldReplace });
		}
	}

	$$self.$$.on_mount.push(function () {
		if (to === undefined && !('to' in $$props || $$self.$$.bound[$$self.$$.props['to']])) {
			console.warn("<Link> was created without expected prop 'to'");
		}
	});

	$$self.$$set = $$new_props => {
		$$invalidate(19, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		$$invalidate(18, $$restProps = compute_rest_props($$props, omit_props_names));
		if ('to' in $$new_props) $$invalidate(5, to = $$new_props.to);
		if ('replace' in $$new_props) $$invalidate(6, replace = $$new_props.replace);
		if ('state' in $$new_props) $$invalidate(7, state = $$new_props.state);
		if ('getProps' in $$new_props) $$invalidate(8, getProps = $$new_props.getProps);
		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		createEventDispatcher,
		useLocation,
		useResolve,
		useHistory,
		usePreflightCheck,
		shouldNavigate,
		isFunction: isFunction$1,
		startsWith,
		LINK_ID,
		parsePath,
		stringifyPath,
		to,
		replace,
		state,
		getProps,
		location,
		dispatch,
		resolve,
		navigate,
		onClick,
		href,
		isExactCurrent,
		isCurrent,
		isPartiallyCurrent,
		props,
		ariaCurrent,
		$location
	});

	$$self.$inject_state = $$new_props => {
		$$invalidate(19, $$props = assign(assign({}, $$props), $$new_props));
		if ('to' in $$props) $$invalidate(5, to = $$new_props.to);
		if ('replace' in $$props) $$invalidate(6, replace = $$new_props.replace);
		if ('state' in $$props) $$invalidate(7, state = $$new_props.state);
		if ('getProps' in $$props) $$invalidate(8, getProps = $$new_props.getProps);
		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
		if ('isExactCurrent' in $$props) isExactCurrent = $$new_props.isExactCurrent;
		if ('isCurrent' in $$props) $$invalidate(9, isCurrent = $$new_props.isCurrent);
		if ('isPartiallyCurrent' in $$props) $$invalidate(10, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*to, $location*/ 2080) {
			// We need to pass location here to force re-resolution of the link,
			// when the pathname changes. Otherwise we could end up with stale path params,
			// when for example an :id changes in the parent Routes path
			$$invalidate(0, href = resolve(to, $location));
		}

		if ($$self.$$.dirty & /*$location, href*/ 2049) {
			$$invalidate(10, isPartiallyCurrent = startsWith($location.pathname, href));
		}

		if ($$self.$$.dirty & /*href, $location*/ 2049) {
			$$invalidate(9, isCurrent = href === $location.pathname);
		}

		if ($$self.$$.dirty & /*href, $location*/ 2049) {
			isExactCurrent = parsePath(href) === stringifyPath($location);
		}

		if ($$self.$$.dirty & /*isCurrent*/ 512) {
			$$invalidate(2, ariaCurrent = isCurrent ? { "aria-current": "page" } : {});
		}

		$$invalidate(1, props = (() => {
			if (isFunction$1(getProps)) {
				const dynamicProps = getProps({
					location: $location,
					href,
					isPartiallyCurrent,
					isCurrent
				});

				return { ...$$restProps, ...dynamicProps };
			}

			return $$restProps;
		})());
	};

	$$props = exclude_internal_props($$props);

	return [
		href,
		props,
		ariaCurrent,
		location,
		onClick,
		to,
		replace,
		state,
		getProps,
		isCurrent,
		isPartiallyCurrent,
		$location,
		$$scope,
		slots
	];
}

class Link extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$c, create_fragment$a, safe_not_equal, { to: 5, replace: 6, state: 7, getProps: 8 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Link",
			options,
			id: create_fragment$a.name
		});
	}

	get to() {
		return this.$$.ctx[5];
	}

	set to(to) {
		this.$$set({ to });
		flush();
	}

	get replace() {
		return this.$$.ctx[6];
	}

	set replace(replace) {
		this.$$set({ replace });
		flush();
	}

	get state() {
		return this.$$.ctx[7];
	}

	set state(state) {
		this.$$set({ state });
		flush();
	}

	get getProps() {
		return this.$$.ctx[8];
	}

	set getProps(getProps) {
		this.$$set({ getProps });
		flush();
	}
}

var Link$1 = Link;

/*
 * Adapted from https://github.com/EmilTholin/svelte-routing
 *
 * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
 */


const createAction =
	getAnchor =>
	(node, navigate$1 = navigate) => {
		const handleClick = event => {
			const anchor = getAnchor(event);
			if (anchor && anchor.target === "" && shouldNavigate(event)) {
				event.preventDefault();
				const to = anchor.pathname + anchor.search + anchor.hash;
				navigate$1(to, { replace: anchor.hasAttribute("replace") });
			}
		};
		const unlisten = addListener(node, "click", handleClick);
		return { destroy: unlisten };
	};

// prettier-ignore
/**
 * An action to be added at a root element of your application to
 * capture all relative links and push them onto the history stack.
 *
 * Example:
 * ```html
 * <div use:links>
 *   <Router>
 *     <Route path="/" component={Home} />
 *     <Route path="/p/:projectId/:docId" component={ProjectScreen} />
 *     {#each projects as project}
 *       <a href="/p/{project.id}">{project.title}</a>
 *     {/each}
 *   </Router>
 * </div>
 * ```
 */
const links = /*#__PURE__*/createAction(event => { // eslint-disable-line spaced-comment
  const anchor = findClosest$1("A", event.target);
  if (
    anchor &&
    isFunction$1(anchor.hasAttribute) &&
    !anchor.hasAttribute("noroute")
  ) {
    return anchor;
  }
  return null;
});

/**
 * Toggle loading screen
 */
const loading$1 = writable(false);

/* global unsafeWindow, globalThis */



const IS_UNSAFE = typeof unsafeWindow !== 'undefined',
    noop = () => { },
    global$1 = IS_UNSAFE ? unsafeWindow : globalThis ?? window,
    { JSON, document: document$1 } = global$1,
    isPlainObject = (param) => param instanceof Object && Object.getPrototypeOf(param) === Object.prototype,
    isUndef = (param) => typeof param === 'undefined',
    isString = (param) => typeof param === 'string',
    isNumber = (param) => typeof param === 'number',
    isInt = (param) => Number.isInteger(param),
    isFloat = (param) => isNumber(param) && parseFloat(param) === param,
    isNumeric = (param) => isInt(param) || isFloat(param) || /^-?(?:[\d]+\.)?\d+$/.test(param),
    isBool = (param) => typeof param === 'boolean',
    isArray = (param) => Array.isArray(param),
    isNull = (param) => param === null,
    isCallable = (param) => typeof param === 'function',
    isFunction = isCallable;



function getClass(param)
{

    if (isFunction(param))
    {
        return param.name;
    }
    else if (param instanceof Object)
    {
        return Object.getPrototypeOf(param).constructor.name;
    }

}

function isEmpty(param)
{

    if (isUndef(param) || param === null)
    {
        return true;
    }
    if (isString(param) || isArray(param))
    {
        return param.length === 0;
    }
    if (isNumber(param))
    {
        return param === 0;
    }

    if (isPlainObject(param))
    {
        return Object.keys(param).length === 0;
    }
    return false;
}

function runAsync(callback, ...args)
{
    if (isFunction(callback))
    {
        setTimeout(callback, 0, ...args);
    }
}



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


function uuidv4()
{
    let uuid = "", i, random;
    for (i = 0; i < 32; i++)
    {
        random = Math.random() * 16 | 0;
        if (i == 8 || i == 12 || i == 16 || i == 20)
        {
            uuid += "-";
        }
        uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
}


function isElement$1(elem)
{
    return elem instanceof Object && isFunction(elem.querySelector);
}

function isHTML(param)
{
    return isString(param) && param.startsWith('<') && param.endsWith('>');
}



function isJSON(param)
{

    if (!isString(param))
    {
        return false;
    }

    return (
        isNumeric(param) ||
        ['true', 'false', 'null'].includes(param) ||
        ['{', '[', '"'].includes(param.slice(0, 1)) ||
        ['}', ']', '"'].includes(param.slice(-1))
    );

}


function decode(value)
{

    if (isUndef(value) || isNull(value))
    {
        return null;
    }
    if (isJSON(value))
    {
        return JSON.parse(value);
    }

    return value;
}


function encode(value)
{

    if (isFunction(value) || isUndef(value))
    {
        return value;
    }


    return isString(value) ? value : JSON.stringify(value);
}


function parseAttributes(obj, /** @type {string|undefined} */ name)
{

    let result = [];

    for (let key in obj)
    {
        const value = obj[key];

        if (isPlainObject(value))
        {
            result = result.concat(parseAttributes(value)).map(
                item => [[key, item[0]].join('-'), item[1]]
            );

            continue;
        }
        result.push([key, encode(value)]);
    }
    return result.map(item => name ? [[name, item[0]].join('-'), item[1]] : item);
}





function validateHtml(html)
{
    return isString(html) || isElement$1(html) || isArray(html);
}

const RESERVED_KEYS = [
    'data', 'dataset',
    'html', 'tag',
    'callback'
];


/**
 * Shorthand to create element effortlessly
 * if no params are given a <div></div> will be generated
 * 
 * @param {String} [tag] tag name / html / emmet
 * @param {Object} [params] params to inject into element
 * @param {String|HTMLElement|String[]|HTMLElement[]} [html] 
 * @returns 
 */
function createElement$1(
    tag = 'div',
    params = {},
    html = null
)
{

    if (isPlainObject(tag))
    {
        params = tag;
        tag = params.tag ?? 'div';
    }

    if (typeof tag !== 'string')
    {
        throw new TypeError('tag must be a String');
    }

    if (validateHtml(params))
    {
        html = params;
        params = {};
    }

    const elem = isHTML(tag) ? html2element(tag) : document$1.createElement(tag);

    let callback;

    if (!isElement$1(elem))
    {
        throw new TypeError("Invalid tag supplied " + tag);
    }

    if (isPlainObject(params))
    {
        const data = [];

        callback = params.callback;

        if (!validateHtml(html))
        {
            html = params.html;
        }

        if (isPlainObject(params.data))
        {
            data.push(...parseAttributes(params.data, 'data'));
        }

        if (isPlainObject(params.dataset))
        {
            data.push(...parseAttributes(params.dataset, 'data'));
        }


        data.forEach(item => elem.setAttribute(...item));


        if (isArray(params.class))
        {
            params.class = params.class.join(" ");
        }

        for (let attr in params)
        {
            if (RESERVED_KEYS.includes(attr))
            {
                continue;
            }

            let value = params[attr];

            if (isString(value))
            {
                let current = elem.getAttribute(attr) ?? '';
                if (current.length > 0)
                {
                    value = current + ' ' + value;
                }

                elem.setAttribute(attr, value);
            }
            else if (isPlainObject(value))
            {
                parseAttributes(value, attr).forEach(item => elem.setAttribute(...item));
            }
            else
            {
                elem[attr] = value;
            }
        }


    }

    if (validateHtml(html))
    {
        if (!isArray(html))
        {
            html = [html];
        }

        for (let child of html)
        {
            if (isElement$1(child))
            {
                elem.appendChild(child);
            }
            else
            {
                elem.innerHTML += child;
            }
        }
    }

    if (isFunction(callback))
    {
        callback(elem);
    }

    return elem;

}

/**
 * Creates an HTMLElement from html code
 * @param {string} html
 * @returns {HTMLElement|Array|undefined}
 */
function html2element(html)
{
    if (isString(html) && html.length > 0)
    {
        let template = createElement$1('template', html),
            content = template.content;
        if (content.childNodes.length === 0)
        {
            return;
        }
        else if (content.childNodes.length > 1)
        {
            return [...content.childNodes];
        }
        return content.childNodes[0];
    }
}


/**
 * PHP BackedEnum like Api
 * Accepts more types than (str|int)
 */
class BackedEnum
{


    /**
     * This is the first defined case
     * Overrirde this to set your own default case
     */
    static get default()
    {
        return this.cases()[0];
    }


    /**
     * Get the enum from the value
     */
    static tryFrom(value)
    {

        if (getClass(value) === getClass(this) && !isFunction(value))
        {
            return value;
        }

        return this.cases().find(x => x.value === value);
    }

    /**
     * Throws if enum does not exists
     */
    static from(value)
    {

        const result = this.tryFrom(value);

        if (isUndef(result))
        {
            throw new TypeError("Cannot find matching enum to: " + encode(value));
        }
        return result;
    }


    /**
     * 
     * @returns {BackedEnum[]}
     */
    static cases()
    {
        return this.keys.map(x => this[x]);
    }


    /**
     * Gets names from the enums
     * they must be camel cased or uppercased
     */
    static get keys()
    {
        return Object.keys(this).filter(name => name[0] === name[0].toUpperCase() && this[name] instanceof BackedEnum);
    }

    /**
     * Get the number of values
     * length is buggy on static classes
     */
    static get size()
    {
        return this.keys.length;
    }


    //------------------- Instance implementation -------------------


    /**
     * Get current enum name
     * Only works if enum instanciated correctly
     * and after the constructor has been called
     */
    get name()
    {
        return Object.keys(this.constructor).find(
            key => this.constructor[key] === this
        ) ?? '';
    }


    constructor(value)
    {

        if (Object.getPrototypeOf(this) === BackedEnum.prototype)
        {
            throw new Error('Cannot instantiate BackedEnum directly, it must be extended.');
        }

        if (isUndef(value) || isFunction(value))
        {
            throw new TypeError('value is not valid');
        }

        Object.defineProperty(this, "value", {
            writable: false, configurable: false, enumerable: true,
            value
        });


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

        target ??= global$1;

        if (isValidSelector(target))
        {
            target = document$1.querySelector(target);
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
        return instance$b.on(type, listener, options);
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
        return instance$b.one(type, listener, options);
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
        return instance$b.off(type, listener, capture);
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
        return instance$b.trigger(type, data);
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


const instance$b = new EventEmitter();

/**
 * @param {String|EventTarget} root 
 * @returns EventEmitter
 */
function emitter(root)
{
    return new EventEmitter(root);
}

instance$b.mixin(emitter);
emitter.mixin = instance$b.mixin.bind(instance$b);

/**
 * Load Resources observer
 */




function checkValid(el)
{
    if (!isElement$1(el) || !el.hasAttribute('src'))
    {

        throw new TypeError("invalid resource Element, no src attribute found");

    }
}

/**
 * Global Asset Loading Count
 */
const loading = writable(0);


function createResourceLoader(fn, triggerChange = false)
{
    if (!isFunction(fn))
    {
        throw new TypeError("fn is not a Function");
    }


    let count = 0;

    const waiting = writable(0);


    function increment(value = 1)
    {
        count += value;
        loading.update(val => val + value);
        waiting.update(val => val + value);
    }


    function decrement(value = 1)
    {
        increment(value * -1);
    }


    function onload(el)
    {

        checkValid(el);

        increment();

        let src = el.src;

        const observer = new MutationObserver(() =>
        {

            if (src !== el.src)
            {
                src = el.src;
                if (triggerChange)
                {
                    emitter(el).trigger("change");
                }
                increment();
            }
        });

        observer.observe(el, { attributeFilter: ['src'] });

        const listener = () =>
        {
            decrement();
            if (count === 0)
            {
                fn();
            }
        };


        emitter(el).on('load', listener);

        return {
            onDestroy()
            {
                observer.disconnect();
                emitter.off('load', listener);
                decrement();
            }
        };
    }

    return {
        waiting, onload,
    };

}

/**
 * Material Design Custom SVG Sprite
 */
const parser = document.createElement('div');
parser.innerHTML = `<svg width="0" height="0" style="display: none;" id="ng-sprite"></svg>`;

// generate the shadowroot
const sprite = document.querySelector('#ng-sprite') ?? parser.removeChild(parser.firstChild);

// all the icons that can be injected
const icons = {"ng-app-shortcut":{"symbol":"<symbol id=\"ng-app-shortcut\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M260-40q-24.75 0-42.375-17.625T200-100v-760q0-24.75 17.625-42.375T260-920h440q24.75 0 42.375 17.625T760-860v146h-60v-56H260v580h440v-56h60v146q0 24.75-17.625 42.375T700-40H260Zm0-90v30h440v-30H260Zm0-700h440v-30H260v30Zm0 0v-30 30Zm0 700v30-30Zm466-321H460v151h-60v-151q0-24.75 17.625-42.375T460-511h266l-82-81 42-42 153 153-153 153-42-42 82-81Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-app-shortcut\"></use></svg>"},"ng-arrow-drop-down":{"symbol":"<symbol id=\"ng-arrow-drop-down\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M480-360 280-559h400L480-360Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-arrow-drop-down\"></use></svg>"},"ng-arrow-selector-tool":{"symbol":"<symbol id=\"ng-arrow-selector-tool\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m300-347 109-153h218L300-757v410ZM560-84 412-401 240-160v-720l560 440H505l145 314-90 42ZM409-500Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-arrow-selector-tool\"></use></svg>"},"ng-backspace":{"symbol":"<symbol id=\"ng-backspace\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m448-326 112-112 112 112 43-43-113-111 111-111-43-43-110 112-112-112-43 43 113 111-113 111 43 43ZM120-480l169-239q13-18 31-29.5t40-11.5h420q24.75 0 42.375 17.625T840-700v440q0 24.75-17.625 42.375T780-200H360q-22 0-40-11.5T289-241L120-480Zm75 0 154 220h431v-440H349L195-480Zm585 0v-220 440-220Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-backspace\"></use></svg>"},"ng-bookmark-add":{"symbol":"<symbol id=\"ng-bookmark-add\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M200-120v-665q0-24 18-42t42-18h290v60H260v574l220-93 220 93v-334h60v425L480-240 200-120Zm60-665h290-290Zm440 180v-90h-90v-60h90v-90h60v90h90v60h-90v90h-60Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-bookmark-add\"></use></svg>"},"ng-bookmark-added":{"symbol":"<symbol id=\"ng-bookmark-added\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M716-605 610-711l42-43 64 64 148-149 43 43-191 191ZM200-120v-665q0-24 18-42t42-18h290v60H260v574l220-93 220 93v-334h60v425L480-240 200-120Zm60-665h290-290Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-bookmark-added\"></use></svg>"},"ng-bookmark-remove":{"symbol":"<symbol id=\"ng-bookmark-remove\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M850-695H610v-60h240v60ZM200-120v-665q0-24 18-42t42-18h290v60H260v574l220-93 220 93v-334h60v425L480-240 200-120Zm60-665h290-290Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-bookmark-remove\"></use></svg>"},"ng-bookmark":{"symbol":"<symbol id=\"ng-bookmark\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M200-120v-665q0-24 18-42t42-18h440q24 0 42 18t18 42v665L480-240 200-120Zm60-91 220-93 220 93v-574H260v574Zm0-574h440-440Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-bookmark\"></use></svg>"},"ng-bookmarks":{"symbol":"<symbol id=\"ng-bookmarks\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M120-40v-700q0-24 18-42t42-18h480q24 0 42.5 18t18.5 42v700L420-167 120-40Zm60-91 240-103 240 103v-609H180v609Zm600 1v-730H233v-60h547q24 0 42 18t18 42v730h-60ZM180-740h480-480Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-bookmarks\"></use></svg>"},"ng-cancel":{"symbol":"<symbol id=\"ng-cancel\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m330-288 150-150 150 150 42-42-150-150 150-150-42-42-150 150-150-150-42 42 150 150-150 150 42 42ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-cancel\"></use></svg>"},"ng-check-box-outline-blank":{"symbol":"<symbol id=\"ng-check-box-outline-blank\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-check-box-outline-blank\"></use></svg>"},"ng-check-box":{"symbol":"<symbol id=\"ng-check-box\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m419-321 289-289-43-43-246 246-119-119-43 43 162 162ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-check-box\"></use></svg>"},"ng-check-circle":{"symbol":"<symbol id=\"ng-check-circle\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m421-298 283-283-46-45-237 237-120-120-45 45 165 166Zm59 218q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-check-circle\"></use></svg>"},"ng-chevron-left":{"symbol":"<symbol id=\"ng-chevron-left\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M561-240 320-481l241-241 43 43-198 198 198 198-43 43Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-chevron-left\"></use></svg>"},"ng-chevron-right":{"symbol":"<symbol id=\"ng-chevron-right\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m375-240-43-43 198-198-198-198 43-43 241 241-241 241Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-chevron-right\"></use></svg>"},"ng-close":{"symbol":"<symbol id=\"ng-close\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-close\"></use></svg>"},"ng-disabled-by-default":{"symbol":"<symbol id=\"ng-disabled-by-default\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m336-294 144-144 144 144 42-42-144-144 144-144-42-42-144 144-144-144-42 42 144 144-144 144 42 42ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-disabled-by-default\"></use></svg>"},"ng-dock-to-bottom":{"symbol":"<symbol id=\"ng-dock-to-bottom\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M180-120q-24.75 0-42.375-17.625T120-180v-600q0-24.75 17.625-42.375T180-840h600q24.75 0 42.375 17.625T840-780v600q0 24.75-17.625 42.375T780-120H180Zm0-207v147h600v-147H180Zm0-60h600v-393H180v393Zm0 60v147-147Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-dock-to-bottom\"></use></svg>"},"ng-dock-to-left":{"symbol":"<symbol id=\"ng-dock-to-left\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M180-120q-24.75 0-42.375-17.625T120-180v-600q0-24.75 17.625-42.375T180-840h600q24.75 0 42.375 17.625T840-780v600q0 24.75-17.625 42.375T780-120H180Zm453-60h147v-600H633v600Zm-60 0v-600H180v600h393Zm60 0h147-147Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-dock-to-left\"></use></svg>"},"ng-dock-to-right":{"symbol":"<symbol id=\"ng-dock-to-right\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M180-120q-24.75 0-42.375-17.625T120-180v-600q0-24.75 17.625-42.375T180-840h600q24.75 0 42.375 17.625T840-780v600q0 24.75-17.625 42.375T780-120H180Zm147-60v-600H180v600h147Zm60 0h393v-600H387v600Zm-60 0H180h147Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-dock-to-right\"></use></svg>"},"ng-done":{"symbol":"<symbol id=\"ng-done\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-done\"></use></svg>"},"ng-drag-pan":{"symbol":"<symbol id=\"ng-drag-pan\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M480-80 317-243l44-44 89 89v-252H198l84 84-44 44L80-480l159-159 44 44-85 85h252v-252l-84 84-44-44 158-158 158 158-44 44-84-84v252h252l-84-84 44-44 158 158-158 158-44-44 84-84H510v252l89-89 44 44L480-80Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-drag-pan\"></use></svg>"},"ng-expand-circle-down":{"symbol":"<symbol id=\"ng-expand-circle-down\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m480-351 173-173-43-42-130 130-130-130-43 42 173 173Zm0 271q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-expand-circle-down\"></use></svg>"},"ng-expand-circle-up":{"symbol":"<symbol id=\"ng-expand-circle-up\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m350-394 130-130 130 130 43-42-173-173-173 173 43 42ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-155.5t85.5-127q54-54.5 127-86T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 83-31.5 156t-86 127q-54.5 54-127 85.5T480-80Zm0-60q141 0 240.5-99T820-480q0-141-99.5-240.5T480-820q-142 0-241 99.5T140-480q0 142 99 241t241 99Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-expand-circle-up\"></use></svg>"},"ng-expand-less":{"symbol":"<symbol id=\"ng-expand-less\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m283-345-43-43 240-240 240 239-43 43-197-197-197 198Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-expand-less\"></use></svg>"},"ng-expand-more":{"symbol":"<symbol id=\"ng-expand-more\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M480-345 240-585l43-43 197 198 197-197 43 43-240 239Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-expand-more\"></use></svg>"},"ng-fast-forward":{"symbol":"<symbol id=\"ng-fast-forward\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M104-240v-480l346 240-346 240Zm407 0v-480l346 240-346 240ZM164-480Zm407 0ZM164-355l181-125-181-125v250Zm407 0 181-125-181-125v250Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-fast-forward\"></use></svg>"},"ng-fast-rewind":{"symbol":"<symbol id=\"ng-fast-rewind\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M854-240 508-480l346-240v480Zm-402 0L106-480l346-240v480Zm-60-240Zm402 0ZM392-355v-250L211-480l181 125Zm402 0v-250L613-480l181 125Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-fast-rewind\"></use></svg>"},"ng-favorite-full":{"symbol":"<symbol id=\"ng-favorite-full\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M0 0h24v24H0V0z\" fill=\"none\"></path>\n<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-favorite-full\"></use></svg>"},"ng-favorite":{"symbol":"<symbol id=\"ng-favorite\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m480-121-41-37q-105.768-97.121-174.884-167.561Q195-396 154-451.5T96.5-552Q80-597 80-643q0-90.155 60.5-150.577Q201-854 290-854q57 0 105.5 27t84.5 78q42-54 89-79.5T670-854q89 0 149.5 60.423Q880-733.155 880-643q0 46-16.5 91T806-451.5Q765-396 695.884-325.561 626.768-255.121 521-158l-41 37Zm0-79q101.236-92.995 166.618-159.498Q712-426 750.5-476t54-89.135q15.5-39.136 15.5-77.72Q820-709 778-751.5T670.225-794q-51.524 0-95.375 31.5Q531-731 504-674h-49q-26-56-69.85-88-43.851-32-95.375-32Q224-794 182-751.5t-42 108.816Q140-604 155.5-564.5t54 90Q248-424 314-358t166 158Zm0-297Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-favorite\"></use></svg>"},"ng-filter-list":{"symbol":"<symbol id=\"ng-filter-list\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M400-240v-60h160v60H400ZM240-450v-60h480v60H240ZM120-660v-60h720v60H120Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-filter-list\"></use></svg>"},"ng-fingerprint":{"symbol":"<symbol id=\"ng-fingerprint\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M123-584q-4-2-4-6.5t2-8.5q62-86 157-133t203-47q108 0 203.5 46T843-601q3 5 2.5 8t-3.5 6q-3 3-7.5 3t-8.5-5q-59-82-150.5-126T481-759q-103 0-193 44.5T138-589q-4 5-7.5 6t-7.5-1ZM600-81q-103-26-169.5-103T364-371q0-47 34.5-79t82.5-32q48 0 82.5 32t34.5 79q0 38 29.5 64t68.5 26q38 0 66.5-26t28.5-64q0-123-91.5-206T481-660q-127 0-218.5 83T171-371q0 24 5.5 62.5T200-221q2 5 0 7.5t-5 4.5q-4 2-8.5 1t-6.5-6q-13-38-20.5-77.5T152-371q0-129 98-220.5T481-683q136 0 233.5 90T812-371q0 46-34 78t-82 32q-49 0-84-32t-35-78q0-39-28.5-65T481-462q-39 0-68 26t-29 65q0 104 63 173.5T604-100q6 2 7.5 5t.5 7q-1 5-4 7t-8 0ZM247-801q-5 2-7.5.5T235-805q-2-2-2-6t3-6q57-31 119.5-47T481-880q65 0 127.5 16T728-819q5 2 5.5 6t-1.5 7q-2 3-5.5 5t-8.5 0q-55-27-115-42.5T481-859q-62 0-121 14.5T247-801ZM381-92q-58-60-90.5-126T258-371q0-89 65.5-150T481-582q92 0 158.5 61T706-371q0 5-2.5 7.5T696-361q-5 0-8-2.5t-3-7.5q0-81-60.5-136T481-562q-83 0-142.5 55T279-371q0 85 29.5 145T396-106q4 4 3.5 7.5T396-92q-2 2-6.5 3.5T381-92Zm306-73q-88 0-152.5-58.5T470-371q0-5 2.5-8t7.5-3q5 0 7.5 3t2.5 8q0 81 59.5 133.5T687-185q8 0 19-1t24-3q5-1 8 1.5t4 5.5q1 4-.5 7t-6.5 4q-18 5-31.5 5.5t-16.5.5Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-fingerprint\"></use></svg>"},"ng-fullscreen-exit":{"symbol":"<symbol id=\"ng-fullscreen-exit\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M333-200v-133H200v-60h193v193h-60Zm234 0v-193h193v60H627v133h-60ZM200-567v-60h133v-133h60v193H200Zm367 0v-193h60v133h133v60H567Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-fullscreen-exit\"></use></svg>"},"ng-fullscreen":{"symbol":"<symbol id=\"ng-fullscreen\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M200-200v-193h60v133h133v60H200Zm0-367v-193h193v60H260v133h-60Zm367 367v-60h133v-133h60v193H567Zm133-367v-133H567v-60h193v193h-60Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-fullscreen\"></use></svg>"},"ng-heart-minus":{"symbol":"<symbol id=\"ng-heart-minus\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M440-497Zm0 376-99-91q-94-86-152.5-145.5T97-462q-33-45-45-83t-12-80q0-91 61-153t149-62q57 0 105.5 26.5T440-736q41-53 88-78.5T630-840q88 0 148.5 62T839-625q0 29-5.5 54.5T820-530h-64q8-17 15.5-44.5T779-625q0-64-43.5-109.5T630-780q-51 0-95 31t-71 88h-49q-26-56-70-87.5T250-780q-65 0-107.5 44T100-625q0 36 12.5 70t49 80Q198-429 265-364t175 164q32-29 60.5-54t56.5-49l6.5 6.5q6.5 6.5 14.5 14t14.5 14l6.5 6.5q-27 24-56 49t-62 55l-41 37Zm160-289v-60h320v60H600Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-heart-minus\"></use></svg>"},"ng-heart-plus":{"symbol":"<symbol id=\"ng-heart-plus\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M440-497Zm0 376-99-91q-87-80-144.5-137T104-452q-35-46-49.5-86.5T40-625q0-90 60.5-152.5T250-840q57 0 105.5 26.5T440-736q42-54 89-79t101-25q80.576 0 135.288 55Q820-730 832-652h-59q-9-55-46.5-91.5T630-780q-51 0-95 31t-71 88h-49q-26-56-70-87.5T250-780q-66 0-108 44.5T100-625q0 39 15.5 76t53.888 84.067q38.388 47.068 104.5 110Q340-292 440-200q32-29 60.5-54t56.5-49l6.632 6.474L578-282.5l14.368 14.026L599-262q-27 24-56 49t-62 55l-41 37Zm290-159v-130H600v-60h130v-130h60v130h130v60H790v130h-60Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-heart-plus\"></use></svg>"},"ng-help":{"symbol":"<symbol id=\"ng-help\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M484-247q16 0 27-11t11-27q0-16-11-27t-27-11q-16 0-27 11t-11 27q0 16 11 27t27 11Zm-35-146h59q0-26 6.5-47.5T555-490q31-26 44-51t13-55q0-53-34.5-85T486-713q-49 0-86.5 24.5T345-621l53 20q11-28 33-43.5t52-15.5q34 0 55 18.5t21 47.5q0 22-13 41.5T508-512q-30 26-44.5 51.5T449-393Zm31 313q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-help\"></use></svg>"},"ng-history-toggle-off":{"symbol":"<symbol id=\"ng-history-toggle-off\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M612-306 450-468v-202h60v178l144 144-42 42Zm-495-1q-15-34-24-70t-12-73h60q2 29 10 57.5t19 55.5l-53 30ZM81-510q3-38 12-74t25-70l52 30q-12 27-19.5 56t-9.5 58H81Zm173 363q-32-22-59.5-49T146-255l53-30q17 25 38.5 46.5T284-200l-30 53Zm-55-529-52-30q21-32 48-59t59-48l30 53q-25 17-46.5 38T199-676ZM450-81q-38-3-74-12t-70-25l30-52q27 12 56 19.5t58 9.5v60ZM336-790l-30-52q34-16 70-25t74-12v60q-29 2-58 9.5T336-790ZM510-81v-60q29-2 58-9.5t56-19.5l30 52q-34 16-70 25t-74 12Zm114-709q-27-12-56-19.5t-58-9.5v-60q38 3 74 11.5t70 25.5l-30 52Zm82 643-30-53q25-17 46-38t38-46l53 30q-21 32-48 59t-59 48Zm54-529q-17-25-38-46t-46-38l30-53q32 21 58.5 48t47.5 59l-52 30Zm59 166q-2-30-10-58.5T789-624l53-30q17 34 25.5 70t11.5 74h-60Zm23 204-52-30q12-27 19.5-56t9.5-58h60q-3 38-12 74t-25 70Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-history-toggle-off\"></use></svg>"},"ng-home":{"symbol":"<symbol id=\"ng-home\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M220-180h150v-250h220v250h150v-390L480-765 220-570v390Zm-60 60v-480l320-240 320 240v480H530v-250H430v250H160Zm320-353Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-home\"></use></svg>"},"ng-indeterminate-check-box":{"symbol":"<symbol id=\"ng-indeterminate-check-box\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M250-452h461v-60H250v60Zm-70 332q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-indeterminate-check-box\"></use></svg>"},"ng-info":{"symbol":"<symbol id=\"ng-info\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M453-280h60v-240h-60v240Zm26.982-314q14.018 0 23.518-9.2T513-626q0-14.45-9.482-24.225-9.483-9.775-23.5-9.775-14.018 0-23.518 9.775T447-626q0 13.6 9.482 22.8 9.483 9.2 23.5 9.2Zm.284 514q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80-397.681 80-480.5q0-82.819 31.5-155.659Q143-709 197.5-763t127.341-85.5Q397.681-880 480.5-880q82.819 0 155.659 31.5Q709-817 763-763t85.5 127Q880-563 880-480.266q0 82.734-31.5 155.5T763-197.684q-54 54.316-127 86Q563-80 480.266-80Zm.234-60Q622-140 721-239.5t99-241Q820-622 721.188-721 622.375-820 480-820q-141 0-240.5 98.812Q140-622.375 140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-info\"></use></svg>"},"ng-install-mobile":{"symbol":"<symbol id=\"ng-install-mobile\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M260-40q-24 0-42-18t-18-42v-760q0-24 18-42t42-18h320v60H260v30h320v60H260v580h440v-130h60v220q0 24-18 42t-42 18H260Zm0-90v30h440v-30H260Zm474-284L548-600l42-42 114 113v-301h60v301l114-113 42 42-186 186ZM260-830v-30 30Zm0 700v30-30Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-install-mobile\"></use></svg>"},"ng-live-tv":{"symbol":"<symbol id=\"ng-live-tv\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m383-350 267-170-267-170v340Zm-53 230v-80H140q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H630v80H330ZM140-260h680v-520H140v520Zm0 0v-520 520Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-live-tv\"></use></svg>"},"ng-login":{"symbol":"<symbol id=\"ng-login\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M489-120v-60h291v-600H489v-60h291q24 0 42 18t18 42v600q0 24-18 42t-42 18H489Zm-78-185-43-43 102-102H120v-60h348L366-612l43-43 176 176-174 174Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-login\"></use></svg>"},"ng-logout":{"symbol":"<symbol id=\"ng-logout\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h291v60H180v600h291v60H180Zm486-185-43-43 102-102H375v-60h348L621-612l43-43 176 176-174 174Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-logout\"></use></svg>"},"ng-menu-open":{"symbol":"<symbol id=\"ng-menu-open\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M120-240v-60h520v60H120Zm678-52L609-481l188-188 43 43-145 145 146 146-43 43ZM120-452v-60h400v60H120Zm0-208v-60h520v60H120Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-menu-open\"></use></svg>"},"ng-mic-off":{"symbol":"<symbol id=\"ng-mic-off\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m686-361-43-43q21-26 31-58.5t10-66.5h60q0 46-15 89t-43 79ZM461-586Zm97 97-53-52v-238q0-17.425-11.788-29.213Q481.425-820 464-820q-17.425 0-29.212 11.787Q423-796.425 423-779v155l-60-60v-95q0-42.083 29.441-71.542Q421.882-880 463.941-880t71.559 29.458Q565-821.083 565-779v250q0 8-1.5 20t-5.5 20ZM434-120v-136q-106-11-178-89t-72-184h60q0 91 64.5 153T464-314q38 0 73.11-12.337Q572.221-338.675 601-361l43 43q-31 26-69.014 41.568Q536.972-260.865 494-256v136h-60Zm397 65L36-850l38-38L869-93l-38 38Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-mic-off\"></use></svg>"},"ng-mic":{"symbol":"<symbol id=\"ng-mic\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M480-423q-43 0-72-30.917-29-30.916-29-75.083v-251q0-41.667 29.441-70.833Q437.882-880 479.941-880t71.559 29.167Q581-821.667 581-780v251q0 44.167-29 75.083Q523-423 480-423Zm0-228Zm-30 531v-136q-106-11-178-89t-72-184h60q0 91 64.288 153t155.5 62Q571-314 635.5-376 700-438 700-529h60q0 106-72 184t-178 89v136h-60Zm30-363q18 0 29.5-13.5T521-529v-251q0-17-11.788-28.5Q497.425-820 480-820q-17.425 0-29.212 11.5Q439-797 439-780v251q0 19 11.5 32.5T480-483Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-mic\"></use></svg>"},"ng-mouse":{"symbol":"<symbol id=\"ng-mouse\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M480-80q-118 0-199-81t-81-199v-260q0-118 81-199t199-81q118 0 199 81t81 199v260q0 118-81 199T480-80Zm30-540h190q0-81-53-144t-137-74v218Zm-250 0h190v-218q-84 11-137 74t-53 144Zm219.788 480Q571-140 635.5-204.35 700-268.7 700-360v-200H260v200q0 91.3 64.288 155.65Q388.576-140 479.788-140ZM480-560Zm30-60Zm-60 0Zm30 60Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-mouse\"></use></svg>"},"ng-movie-info":{"symbol":"<symbol id=\"ng-movie-info\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M140-120q-24 0-42-18t-18-42v-599q0-24 18-42.5t42-18.5h681q24.338 0 41.669 18.5Q880-803 880-779v599q0 24-17.331 42T821-120H140Zm0-60h105v-105H140v105Zm576 0h105v-105H716v105ZM450-294h60v-233h-60v233Zm-310-50h105v-105H140v105Zm576 0h105v-105H716v105ZM140-509h105v-105H140v105Zm576 0h105v-105H716v105ZM480.175-613q12.825 0 21.325-8.675 8.5-8.676 8.5-21.5 0-12.825-8.675-21.325-8.676-8.5-21.5-8.5-12.825 0-21.325 8.675-8.5 8.676-8.5 21.5 0 12.825 8.675 21.325 8.676 8.5 21.5 8.5ZM140-674h105v-105H140v105Zm576 0h105v-105H716v105ZM305-180h352v-599H305v599Zm0-599h352-352Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-movie-info\"></use></svg>"},"ng-movie":{"symbol":"<symbol id=\"ng-movie\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m140-800 74 152h130l-74-152h89l74 152h130l-74-152h89l74 152h130l-74-152h112q24 0 42 18t18 42v520q0 24-18 42t-42 18H140q-24 0-42-18t-18-42v-520q0-24 18-42t42-18Zm0 212v368h680v-368H140Zm0 0v368-368Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-movie\"></use></svg>"},"ng-no-sound":{"symbol":"<symbol id=\"ng-no-sound\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m611-323-43-43 114-113-114-113 43-43 113 114 113-114 43 43-114 113 114 113-43 43-113-114-113 114Zm-491-37v-240h160l200-200v640L280-360H120Zm300-288L307-540H180v120h127l113 109v-337ZM311-481Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-no-sound\"></use></svg>"},"ng-notifications-active":{"symbol":"<symbol id=\"ng-notifications-active\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M124-567q0-81 34-153.5T255-844l41 45q-53 43-82.5 103.5T184-567h-60Zm653 0q0-68-28-128.5T668-799l41-45q62 52 95 124t33 153h-60ZM160-200v-60h84v-306q0-84 49.5-149.5T424-798v-29q0-23 16.5-38t39.5-15q23 0 39.5 15t16.5 38v29q81 17 131 82.5T717-566v306h83v60H160Zm320-295Zm0 415q-32 0-56-23.5T400-160h160q0 33-23.5 56.5T480-80ZM304-260h353v-306q0-74-51-126t-125-52q-74 0-125.5 52T304-566v306Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-notifications-active\"></use></svg>"},"ng-notifications-off":{"symbol":"<symbol id=\"ng-notifications-off\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M160-200v-60h84v-315q0-29.598 8.5-58.299T276-688l45 45q-8 17-12.5 33.5T304-575v315h316L75-805l42-42 726 727-42 42-122-122H160Zm557-132-60-60v-174q0-75-50.5-126.5T482-744q-35 0-67 11.5T356-693l-43-43q27-26 54.5-40.5T424-798v-26.091q0-23.295 16.265-39.602Q456.529-880 479.765-880 503-880 519.5-863.693t16.5 39.602V-798q78 17 129.5 82T717-566v234Zm-255-86Zm18 338q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Zm27-463Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-notifications-off\"></use></svg>"},"ng-notifications":{"symbol":"<symbol id=\"ng-notifications\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M160-200v-60h84v-306q0-84 49.5-149.5T424-798v-29q0-23 16.5-38t39.5-15q23 0 39.5 15t16.5 38v29q81 17 131 82.5T717-566v306h83v60H160Zm320-295Zm0 415q-32 0-56-23.5T400-160h160q0 33-23.5 56.5T480-80ZM304-260h353v-306q0-74-51-126t-125-52q-74 0-125.5 52T304-566v306Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-notifications\"></use></svg>"},"ng-open-in-new":{"symbol":"<symbol id=\"ng-open-in-new\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h279v60H180v600h600v-279h60v279q0 24-18 42t-42 18H180Zm202-219-42-43 398-398H519v-60h321v321h-60v-218L382-339Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-open-in-new\"></use></svg>"},"ng-page-info":{"symbol":"<symbol id=\"ng-page-info\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M700-130q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm-.235-60Q733-190 756.5-213.265q23.5-23.264 23.5-56.5Q780-303 756.735-326.5q-23.264-23.5-56.5-23.5Q667-350 643.5-326.735q-23.5 23.264-23.5 56.5Q620-237 643.265-213.5q23.264 23.5 56.5 23.5ZM120-240v-60h360v60H120Zm140-310q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm-.235-60Q293-610 316.5-633.265q23.5-23.264 23.5-56.5Q340-723 316.735-746.5q-23.264-23.5-56.5-23.5Q227-770 203.5-746.735q-23.5 23.264-23.5 56.5Q180-657 203.265-633.5q23.264 23.5 56.5 23.5ZM480-660v-60h360v60H480Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-page-info\"></use></svg>"},"ng-password":{"symbol":"<symbol id=\"ng-password\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M80-200v-61h800v61H80Zm38-254-40-22 40-68H40v-45h78l-40-68 40-22 38 67 38-67 40 22-40 68h78v45h-78l40 68-40 22-38-67-38 67Zm324 0-40-24 40-68h-78v-45h78l-40-68 40-22 38 67 38-67 40 22-40 68h78v45h-78l40 68-40 24-38-67-38 67Zm324 0-40-24 40-68h-78v-45h78l-40-68 40-22 38 67 38-67 40 22-40 68h78v45h-78l40 68-40 24-38-67-38 67Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-password\"></use></svg>"},"ng-pause-circle":{"symbol":"<symbol id=\"ng-pause-circle\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M370-320h60v-320h-60v320Zm160 0h60v-320h-60v320ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-pause-circle\"></use></svg>"},"ng-pause":{"symbol":"<symbol id=\"ng-pause\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M0 0h24v24H0V0z\" fill=\"none\"></path>\n<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M6 19h4V5H6v14zm8-14v14h4V5h-4z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-pause\"></use></svg>"},"ng-play-arrow":{"symbol":"<symbol id=\"ng-play-arrow\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M0 0h24v24H0z\" fill=\"none\"></path>\n<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M8 5v14l11-7z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-play-arrow\"></use></svg>"},"ng-play-circle":{"symbol":"<symbol id=\"ng-play-circle\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m383-310 267-170-267-170v340Zm97 230q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-play-circle\"></use></svg>"},"ng-power-settings-new":{"symbol":"<symbol id=\"ng-power-settings-new\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M450-438v-406h60v406h-60Zm30 320q-74 0-139.5-28.5T226-224q-49-49-77.5-114.5T120-478q0-80 34-149.5T250-751l42 42q-53 43-82.5 102.5T180-478.022Q180-353 267.5-265.5 355-178 480-178q125.357 0 212.679-87.5Q780-353 780-478.022 780-547 750.5-607.5 721-668 670-709l43-42q60 51 93.5 122T840-478q0 74-28.5 139.5t-77 114.5q-48.5 49-114 77.5T480-118Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-power-settings-new\"></use></svg>"},"ng-radio-button-checked":{"symbol":"<symbol id=\"ng-radio-button-checked\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M480-294q78 0 132-54t54-132q0-78-54-132t-132-54q-78 0-132 54t-54 132q0 78 54 132t132 54Zm0 214q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-radio-button-checked\"></use></svg>"},"ng-radio-button-unchecked":{"symbol":"<symbol id=\"ng-radio-button-unchecked\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-radio-button-unchecked\"></use></svg>"},"ng-refresh":{"symbol":"<symbol id=\"ng-refresh\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M480-160q-133 0-226.5-93.5T160-480q0-133 93.5-226.5T480-800q85 0 149 34.5T740-671v-129h60v254H546v-60h168q-38-60-97-97t-137-37q-109 0-184.5 75.5T220-480q0 109 75.5 184.5T480-220q83 0 152-47.5T728-393h62q-29 105-115 169t-195 64Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-refresh\"></use></svg>"},"ng-search":{"symbol":"<symbol id=\"ng-search\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M796-121 533-384q-30 26-69.959 40.5T378-329q-108.162 0-183.081-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85 632-542 618-502q-14 40-42 75l264 262-44 44ZM377-389q81.25 0 138.125-57.5T572-585q0-81-56.875-138.5T377-781q-82.083 0-139.542 57.5Q180-666 180-585t57.458 138.5Q294.917-389 377-389Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-search\"></use></svg>"},"ng-select-check-box":{"symbol":"<symbol id=\"ng-select-check-box\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M180-120q-24.75 0-42.375-17.625T120-180v-600q0-24.75 17.625-42.375T180-840h600q14 0 25.5 6t18.5 14l-44 44v-4H180v600h600v-343l60-60v403q0 24.75-17.625 42.375T780-120H180Zm281-168L239-510l42-42 180 180 382-382 42 42-424 424Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-select-check-box\"></use></svg>"},"ng-settings":{"symbol":"<symbol id=\"ng-settings\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m388-80-20-126q-19-7-40-19t-37-25l-118 54-93-164 108-79q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521L80-600l93-164 118 54q16-13 37-25t40-18l20-127h184l20 126q19 7 40.5 18.5T669-710l118-54 93 164-108 77q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l108 78-93 164-118-54q-16 13-36.5 25.5T592-206L572-80H388Zm92-270q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Zm0-60q-29 0-49.5-20.5T410-480q0-29 20.5-49.5T480-550q29 0 49.5 20.5T550-480q0 29-20.5 49.5T480-410Zm0-70Zm-44 340h88l14-112q33-8 62.5-25t53.5-41l106 46 40-72-94-69q4-17 6.5-33.5T715-480q0-17-2-33.5t-7-33.5l94-69-40-72-106 46q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 7-63.5 24T306-642l-106-46-40 72 94 69q-4 17-6.5 33.5T245-480q0 17 2.5 33.5T254-413l-94 69 40 72 106-46q24 24 53.5 41t62.5 25l14 112Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-settings\"></use></svg>"},"ng-shelf-position":{"symbol":"<symbol id=\"ng-shelf-position\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M180-121q-24 0-42-18t-18-42v-599q0-24 18-42t42-18h640q24 0 42 18t18 42v599q0 24-18 42t-42 18H180Zm0-201v141h640v-141H180Zm490-60h150v-398H670v398Zm-490 0h150v-398H180v398Zm210 0h220v-398H390v398Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-shelf-position\"></use></svg>"},"ng-skip-next":{"symbol":"<symbol id=\"ng-skip-next\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M680-240v-480h60v480h-60Zm-460 0v-480l346 240-346 240Zm60-240Zm0 125 181-125-181-125v250Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-skip-next\"></use></svg>"},"ng-skip-previous":{"symbol":"<symbol id=\"ng-skip-previous\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M220-240v-480h60v480h-60Zm520 0L394-480l346-240v480Zm-60-240Zm0 125v-250L499-480l181 125Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-skip-previous\"></use></svg>"},"ng-sort":{"symbol":"<symbol id=\"ng-sort\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M120-240v-60h240v60H120Zm0-210v-60h480v60H120Zm0-210v-60h720v60H120Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-sort\"></use></svg>"},"ng-star":{"symbol":"<symbol id=\"ng-star\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m323-205 157-94 157 95-42-178 138-120-182-16-71-168-71 167-182 16 138 120-42 178ZM233-80l65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Zm247-355Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-star\"></use></svg>"},"ng-stop-circle":{"symbol":"<symbol id=\"ng-stop-circle\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M330-330h300v-300H330v300ZM480.266-80q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80-397.681 80-480.5q0-82.819 31.5-155.659Q143-709 197.5-763t127.341-85.5Q397.681-880 480.5-880q82.819 0 155.659 31.5Q709-817 763-763t85.5 127Q880-563 880-480.266q0 82.734-31.5 155.5T763-197.684q-54 54.316-127 86Q563-80 480.266-80Zm.234-60Q622-140 721-239.5t99-241Q820-622 721.188-721 622.375-820 480-820q-141 0-240.5 98.812Q140-622.375 140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-stop-circle\"></use></svg>"},"ng-stop":{"symbol":"<symbol id=\"ng-stop\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M0 0h24v24H0z\" fill=\"none\"></path>\n<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M6 6h12v12H6z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-stop\"></use></svg>"},"ng-thumb-down":{"symbol":"<symbol id=\"ng-thumb-down\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M242-840h444v512L408-40l-39-31q-6-5-9-14t-3-22v-10l45-211H103q-24 0-42-18t-18-42v-81.839Q43-477 41.5-484.5T43-499l126-290q8.878-21.25 29.595-36.125Q219.311-840 242-840Zm384 60H229L103-481v93h373l-53 249 203-214v-427Zm0 427v-427 427Zm60 25v-60h133v-392H686v-60h193v512H686Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-thumb-down\"></use></svg>"},"ng-thumb-up":{"symbol":"<symbol id=\"ng-thumb-up\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M716-120H272v-512l278-288 39 31q6 5 9 14t3 22v10l-45 211h299q24 0 42 18t18 42v81.839q0 7.161 1.5 14.661T915-461L789-171q-8.878 21.25-29.595 36.125Q738.689-120 716-120Zm-384-60h397l126-299v-93H482l53-249-203 214v427Zm0-427v427-427Zm-60-25v60H139v392h133v60H79v-512h193Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-thumb-up\"></use></svg>"},"ng-tips-and-updates":{"symbol":"<symbol id=\"ng-tips-and-updates\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m887-567-23-50-50-23 50-23 23-50 23 50 50 23-50 23-23 50ZM760-742l-35-74-74-35 74-35 35-74 35 74 74 35-74 35-35 74ZM360-80q-34 0-57.5-23.5T279-161h162q0 34-23.5 57.5T360-80ZM198-223v-60h324v60H198Zm5-121q-66-43-104.5-107.5T60-597q0-122 89-211t211-89q122 0 211 89t89 211q0 81-38 145.5T517-344H203Zm22-60h271q48-32 76-83t28-110q0-99-70.5-169.5T360-837q-99 0-169.5 70.5T120-597q0 59 28 110t77 83Zm135 0Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-tips-and-updates\"></use></svg>"},"ng-toggle-off":{"symbol":"<symbol id=\"ng-toggle-off\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M280-240q-100 0-170-70T40-480q0-100 70-170t170-70h400q100 0 170 70t70 170q0 100-70 170t-170 70H280Zm0-60h400q75 0 127.5-52.5T860-480q0-75-52.5-127.5T680-660H280q-75 0-127.5 52.5T100-480q0 75 52.5 127.5T280-300Zm-1.059-79Q321-379 350.5-408.441t29.5-71.5Q380-522 350.559-551.5t-71.5-29.5Q237-581 207.5-551.559t-29.5 71.5Q178-438 207.441-408.5t71.5 29.5ZM480-480Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-toggle-off\"></use></svg>"},"ng-toggle-on":{"symbol":"<symbol id=\"ng-toggle-on\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M280-240q-100 0-170-70T40-480q0-100 70-170t170-70h400q100 0 170 70t70 170q0 100-70 170t-170 70H280Zm0-60h400q75 0 127.5-52.5T860-480q0-75-52.5-127.5T680-660H280q-75 0-127.5 52.5T100-480q0 75 52.5 127.5T280-300Zm400.941-79Q723-379 752.5-408.441t29.5-71.5Q782-522 752.559-551.5t-71.5-29.5Q639-581 609.5-551.559t-29.5 71.5Q580-438 609.441-408.5t71.5 29.5ZM480-480Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-toggle-on\"></use></svg>"},"ng-toolbar":{"symbol":"<symbol id=\"ng-toolbar\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-513h600v-147H180v147Zm600 60H180v393h600v-393Zm-600-60v60-60Zm0 0v-147 147Zm0 60v393-393Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-toolbar\"></use></svg>"},"ng-touchpad-mouse":{"symbol":"<symbol id=\"ng-touchpad-mouse\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M659.798-140Q726-140 773-186.857T820-300v-70H500v70q0 66.286 46.798 113.143t113 46.857ZM500-430h130v-147q-54 11-90 51.5T500-430Zm190 0h130q-4-55-40-95.5T690-577v147ZM660-80q-92 0-156-64t-64-156v-120q0-92 64-156t156-64q92 0 156 64t64 156v120q0 92-64 156T660-80ZM140-220v-520 520Zm0 60q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h680q24 0 42 18t18 42v146q-12.825-16.72-27.912-30.36Q837-638 820-650v-90H140v520h251q5 15.836 11.5 30.918Q409-174 417-160H140Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-touchpad-mouse\"></use></svg>"},"ng-tune":{"symbol":"<symbol id=\"ng-tune\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M427-120v-225h60v83h353v60H487v82h-60Zm-307-82v-60h247v60H120Zm187-166v-82H120v-60h187v-84h60v226h-60Zm120-82v-60h413v60H427Zm166-165v-225h60v82h187v60H653v83h-60Zm-473-83v-60h413v60H120Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-tune\"></use></svg>"},"ng-volume-down":{"symbol":"<symbol id=\"ng-volume-down\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M200-360v-240h160l200-200v640L360-360H200Zm420 48v-337q54 17 87 64t33 105q0 59-33 105t-87 63ZM500-648 387-540H260v120h127l113 109v-337ZM378-480Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-volume-down\"></use></svg>"},"ng-volume-mute":{"symbol":"<symbol id=\"ng-volume-mute\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M280-360v-240h160l200-200v640L440-360H280Zm60-60h127l113 109v-337L467-540H340v120Zm119-60Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-volume-mute\"></use></svg>"},"ng-volume-off":{"symbol":"<symbol id=\"ng-volume-off\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M813-56 681-188q-28 20-60.5 34.5T553-131v-62q23-7 44.5-15.5T638-231L473-397v237L273-360H113v-240h156L49-820l43-43 764 763-43 44Zm-36-232-43-43q20-34 29.5-71.923T773-481q0-103.322-60-184.661T553-769v-62q124 28 202 125.5T833-481q0 51-14 100t-42 93ZM643-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T643-422ZM473-592 369-696l104-104v208Zm-60 286v-150l-84-84H173v120h126l114 114Zm-42-192Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-volume-off\"></use></svg>"},"ng-volume-up":{"symbol":"<symbol id=\"ng-volume-up\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M560-131v-62q97-28 158.5-107.5T780-481q0-101-61-181T560-769v-62q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm420 48v-337q55 17 87.5 64T660-480q0 57-33 104t-87 64ZM420-648 307-540H180v120h127l113 109v-337Zm-94 168Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-volume-up\"></use></svg>"},"ng-width-full":{"symbol":"<symbol id=\"ng-width-full\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M140-160q-24.75 0-42.375-17.625T80-220v-520q0-24.75 17.625-42.375T140-800h680q24.75 0 42.375 17.625T880-740v520q0 24.75-17.625 42.375T820-160H140Zm0-60h70v-520h-70v520Zm130 0h420v-520H270v520Zm480 0h70v-520h-70v520ZM270-740v520-520Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-width-full\"></use></svg>"}};
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
            loadSprite(this.id);
            parent.appendChild(generateSVG(this.template, size, color));
        }
    }
    prependTo(parent, size, color)
    {
        if (isElement(parent))
        {
            loadSprite(this.id);
            parent.insertBefore(generateSVG(this.template, size, color), parent.firstElementChild);
        }
    }
    insertBefore(sibling, size, color)
    {
        if (isElement(sibling))
        {
            loadSprite(this.id);
            sibling.parentElement?.insertBefore(generateSVG(this.template, size, color), sibling);
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


// generate xlinks
const ng_app_shortcut = new Xlink('ng-app-shortcut');
const ng_arrow_drop_down = new Xlink('ng-arrow-drop-down');
const ng_arrow_selector_tool = new Xlink('ng-arrow-selector-tool');
const ng_backspace = new Xlink('ng-backspace');
const ng_bookmark_add = new Xlink('ng-bookmark-add');
const ng_bookmark_added = new Xlink('ng-bookmark-added');
const ng_bookmark_remove = new Xlink('ng-bookmark-remove');
const ng_bookmark = new Xlink('ng-bookmark');
const ng_bookmarks = new Xlink('ng-bookmarks');
const ng_cancel = new Xlink('ng-cancel');
const ng_check_box_outline_blank = new Xlink('ng-check-box-outline-blank');
const ng_check_box = new Xlink('ng-check-box');
const ng_check_circle = new Xlink('ng-check-circle');
const ng_chevron_left = new Xlink('ng-chevron-left');
const ng_chevron_right = new Xlink('ng-chevron-right');
const ng_close = new Xlink('ng-close');
const ng_disabled_by_default = new Xlink('ng-disabled-by-default');
const ng_dock_to_bottom = new Xlink('ng-dock-to-bottom');
const ng_dock_to_left = new Xlink('ng-dock-to-left');
const ng_dock_to_right = new Xlink('ng-dock-to-right');
const ng_done = new Xlink('ng-done');
const ng_drag_pan = new Xlink('ng-drag-pan');
const ng_expand_circle_down = new Xlink('ng-expand-circle-down');
const ng_expand_circle_up = new Xlink('ng-expand-circle-up');
const ng_expand_less = new Xlink('ng-expand-less');
const ng_expand_more = new Xlink('ng-expand-more');
const ng_fast_forward = new Xlink('ng-fast-forward');
const ng_fast_rewind = new Xlink('ng-fast-rewind');
const ng_favorite_full = new Xlink('ng-favorite-full');
const ng_favorite = new Xlink('ng-favorite');
const ng_filter_list = new Xlink('ng-filter-list');
const ng_fingerprint = new Xlink('ng-fingerprint');
const ng_fullscreen_exit = new Xlink('ng-fullscreen-exit');
const ng_fullscreen = new Xlink('ng-fullscreen');
const ng_heart_minus = new Xlink('ng-heart-minus');
const ng_heart_plus = new Xlink('ng-heart-plus');
const ng_help = new Xlink('ng-help');
const ng_history_toggle_off = new Xlink('ng-history-toggle-off');
const ng_home = new Xlink('ng-home');
const ng_indeterminate_check_box = new Xlink('ng-indeterminate-check-box');
const ng_info = new Xlink('ng-info');
const ng_install_mobile = new Xlink('ng-install-mobile');
const ng_live_tv = new Xlink('ng-live-tv');
const ng_login = new Xlink('ng-login');
const ng_logout = new Xlink('ng-logout');
const ng_menu_open = new Xlink('ng-menu-open');
const ng_mic_off = new Xlink('ng-mic-off');
const ng_mic = new Xlink('ng-mic');
const ng_mouse = new Xlink('ng-mouse');
const ng_movie_info = new Xlink('ng-movie-info');
const ng_movie = new Xlink('ng-movie');
const ng_no_sound = new Xlink('ng-no-sound');
const ng_notifications_active = new Xlink('ng-notifications-active');
const ng_notifications_off = new Xlink('ng-notifications-off');
const ng_notifications = new Xlink('ng-notifications');
const ng_open_in_new = new Xlink('ng-open-in-new');
const ng_page_info = new Xlink('ng-page-info');
const ng_password = new Xlink('ng-password');
const ng_pause_circle = new Xlink('ng-pause-circle');
const ng_pause = new Xlink('ng-pause');
const ng_play_arrow = new Xlink('ng-play-arrow');
const ng_play_circle = new Xlink('ng-play-circle');
const ng_power_settings_new = new Xlink('ng-power-settings-new');
const ng_radio_button_checked = new Xlink('ng-radio-button-checked');
const ng_radio_button_unchecked = new Xlink('ng-radio-button-unchecked');
const ng_refresh = new Xlink('ng-refresh');
const ng_search = new Xlink('ng-search');
const ng_select_check_box = new Xlink('ng-select-check-box');
const ng_settings = new Xlink('ng-settings');
const ng_shelf_position = new Xlink('ng-shelf-position');
const ng_skip_next = new Xlink('ng-skip-next');
const ng_skip_previous = new Xlink('ng-skip-previous');
const ng_sort = new Xlink('ng-sort');
const ng_star = new Xlink('ng-star');
const ng_stop_circle = new Xlink('ng-stop-circle');
const ng_stop = new Xlink('ng-stop');
const ng_thumb_down = new Xlink('ng-thumb-down');
const ng_thumb_up = new Xlink('ng-thumb-up');
const ng_tips_and_updates = new Xlink('ng-tips-and-updates');
const ng_toggle_off = new Xlink('ng-toggle-off');
const ng_toggle_on = new Xlink('ng-toggle-on');
const ng_toolbar = new Xlink('ng-toolbar');
const ng_touchpad_mouse = new Xlink('ng-touchpad-mouse');
const ng_tune = new Xlink('ng-tune');
const ng_volume_down = new Xlink('ng-volume-down');
const ng_volume_mute = new Xlink('ng-volume-mute');
const ng_volume_off = new Xlink('ng-volume-off');
const ng_volume_up = new Xlink('ng-volume-up');
const ng_width_full = new Xlink('ng-width-full');

// creates naming map
const names = [    ['ng-app-shortcut', 'ng_app_shortcut'],
    ['ng-arrow-drop-down', 'ng_arrow_drop_down'],
    ['ng-arrow-selector-tool', 'ng_arrow_selector_tool'],
    ['ng-backspace', 'ng_backspace'],
    ['ng-bookmark-add', 'ng_bookmark_add'],
    ['ng-bookmark-added', 'ng_bookmark_added'],
    ['ng-bookmark-remove', 'ng_bookmark_remove'],
    ['ng-bookmark', 'ng_bookmark'],
    ['ng-bookmarks', 'ng_bookmarks'],
    ['ng-cancel', 'ng_cancel'],
    ['ng-check-box-outline-blank', 'ng_check_box_outline_blank'],
    ['ng-check-box', 'ng_check_box'],
    ['ng-check-circle', 'ng_check_circle'],
    ['ng-chevron-left', 'ng_chevron_left'],
    ['ng-chevron-right', 'ng_chevron_right'],
    ['ng-close', 'ng_close'],
    ['ng-disabled-by-default', 'ng_disabled_by_default'],
    ['ng-dock-to-bottom', 'ng_dock_to_bottom'],
    ['ng-dock-to-left', 'ng_dock_to_left'],
    ['ng-dock-to-right', 'ng_dock_to_right'],
    ['ng-done', 'ng_done'],
    ['ng-drag-pan', 'ng_drag_pan'],
    ['ng-expand-circle-down', 'ng_expand_circle_down'],
    ['ng-expand-circle-up', 'ng_expand_circle_up'],
    ['ng-expand-less', 'ng_expand_less'],
    ['ng-expand-more', 'ng_expand_more'],
    ['ng-fast-forward', 'ng_fast_forward'],
    ['ng-fast-rewind', 'ng_fast_rewind'],
    ['ng-favorite-full', 'ng_favorite_full'],
    ['ng-favorite', 'ng_favorite'],
    ['ng-filter-list', 'ng_filter_list'],
    ['ng-fingerprint', 'ng_fingerprint'],
    ['ng-fullscreen-exit', 'ng_fullscreen_exit'],
    ['ng-fullscreen', 'ng_fullscreen'],
    ['ng-heart-minus', 'ng_heart_minus'],
    ['ng-heart-plus', 'ng_heart_plus'],
    ['ng-help', 'ng_help'],
    ['ng-history-toggle-off', 'ng_history_toggle_off'],
    ['ng-home', 'ng_home'],
    ['ng-indeterminate-check-box', 'ng_indeterminate_check_box'],
    ['ng-info', 'ng_info'],
    ['ng-install-mobile', 'ng_install_mobile'],
    ['ng-live-tv', 'ng_live_tv'],
    ['ng-login', 'ng_login'],
    ['ng-logout', 'ng_logout'],
    ['ng-menu-open', 'ng_menu_open'],
    ['ng-mic-off', 'ng_mic_off'],
    ['ng-mic', 'ng_mic'],
    ['ng-mouse', 'ng_mouse'],
    ['ng-movie-info', 'ng_movie_info'],
    ['ng-movie', 'ng_movie'],
    ['ng-no-sound', 'ng_no_sound'],
    ['ng-notifications-active', 'ng_notifications_active'],
    ['ng-notifications-off', 'ng_notifications_off'],
    ['ng-notifications', 'ng_notifications'],
    ['ng-open-in-new', 'ng_open_in_new'],
    ['ng-page-info', 'ng_page_info'],
    ['ng-password', 'ng_password'],
    ['ng-pause-circle', 'ng_pause_circle'],
    ['ng-pause', 'ng_pause'],
    ['ng-play-arrow', 'ng_play_arrow'],
    ['ng-play-circle', 'ng_play_circle'],
    ['ng-power-settings-new', 'ng_power_settings_new'],
    ['ng-radio-button-checked', 'ng_radio_button_checked'],
    ['ng-radio-button-unchecked', 'ng_radio_button_unchecked'],
    ['ng-refresh', 'ng_refresh'],
    ['ng-search', 'ng_search'],
    ['ng-select-check-box', 'ng_select_check_box'],
    ['ng-settings', 'ng_settings'],
    ['ng-shelf-position', 'ng_shelf_position'],
    ['ng-skip-next', 'ng_skip_next'],
    ['ng-skip-previous', 'ng_skip_previous'],
    ['ng-sort', 'ng_sort'],
    ['ng-star', 'ng_star'],
    ['ng-stop-circle', 'ng_stop_circle'],
    ['ng-stop', 'ng_stop'],
    ['ng-thumb-down', 'ng_thumb_down'],
    ['ng-thumb-up', 'ng_thumb_up'],
    ['ng-tips-and-updates', 'ng_tips_and_updates'],
    ['ng-toggle-off', 'ng_toggle_off'],
    ['ng-toggle-on', 'ng_toggle_on'],
    ['ng-toolbar', 'ng_toolbar'],
    ['ng-touchpad-mouse', 'ng_touchpad_mouse'],
    ['ng-tune', 'ng_tune'],
    ['ng-volume-down', 'ng_volume_down'],
    ['ng-volume-mute', 'ng_volume_mute'],
    ['ng-volume-off', 'ng_volume_off'],
    ['ng-volume-up', 'ng_volume_up'],
    ['ng-width-full', 'ng_width_full'],
];

// generate default export
const svgs = {
    ng_app_shortcut,
    ng_arrow_drop_down,
    ng_arrow_selector_tool,
    ng_backspace,
    ng_bookmark_add,
    ng_bookmark_added,
    ng_bookmark_remove,
    ng_bookmark,
    ng_bookmarks,
    ng_cancel,
    ng_check_box_outline_blank,
    ng_check_box,
    ng_check_circle,
    ng_chevron_left,
    ng_chevron_right,
    ng_close,
    ng_disabled_by_default,
    ng_dock_to_bottom,
    ng_dock_to_left,
    ng_dock_to_right,
    ng_done,
    ng_drag_pan,
    ng_expand_circle_down,
    ng_expand_circle_up,
    ng_expand_less,
    ng_expand_more,
    ng_fast_forward,
    ng_fast_rewind,
    ng_favorite_full,
    ng_favorite,
    ng_filter_list,
    ng_fingerprint,
    ng_fullscreen_exit,
    ng_fullscreen,
    ng_heart_minus,
    ng_heart_plus,
    ng_help,
    ng_history_toggle_off,
    ng_home,
    ng_indeterminate_check_box,
    ng_info,
    ng_install_mobile,
    ng_live_tv,
    ng_login,
    ng_logout,
    ng_menu_open,
    ng_mic_off,
    ng_mic,
    ng_mouse,
    ng_movie_info,
    ng_movie,
    ng_no_sound,
    ng_notifications_active,
    ng_notifications_off,
    ng_notifications,
    ng_open_in_new,
    ng_page_info,
    ng_password,
    ng_pause_circle,
    ng_pause,
    ng_play_arrow,
    ng_play_circle,
    ng_power_settings_new,
    ng_radio_button_checked,
    ng_radio_button_unchecked,
    ng_refresh,
    ng_search,
    ng_select_check_box,
    ng_settings,
    ng_shelf_position,
    ng_skip_next,
    ng_skip_previous,
    ng_sort,
    ng_star,
    ng_stop_circle,
    ng_stop,
    ng_thumb_down,
    ng_thumb_up,
    ng_tips_and_updates,
    ng_toggle_off,
    ng_toggle_on,
    ng_toolbar,
    ng_touchpad_mouse,
    ng_tune,
    ng_volume_down,
    ng_volume_mute,
    ng_volume_off,
    ng_volume_up,
    ng_width_full,
};

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




function watch(elem)
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

function getListenersForEvent(listeners, type)
{
    return listeners.filter(item => item.type === type);
}


class EventManager
{

    #listeners;
    #useasync;

    get length()
    {
        return this.#listeners.length;
    }

    constructor(useasync = true)
    {
        this.#listeners = [];
        this.#useasync = useasync === true;
    }


    on(type, listener, once = false)
    {

        if (!isString(type))
        {
            throw new TypeError('Invalid event type, not a String.');
        }

        if (!isFunction(listener))
        {
            throw new TypeError('Invalid listener, not a function');
        }



        type.split(/\s+/).forEach(type =>
        {
            this.#listeners.push({
                type, listener, once: once === true,
            });
        });

        return this;
    }


    one(type, listener)
    {
        return this.on(type, listener, true);
    }


    off(type, listener)
    {

        if (!isString(type))
        {
            throw new TypeError('Invalid event type, not a String.');
        }

        type.split(/\s+/).forEach(type =>
        {

            this.#listeners = this.#listeners.filter(item =>
            {
                if (type === item.type)
                {
                    if (listener === item.listener || !listener)
                    {
                        return false;
                    }
                }
                return true;
            });
        });
        return this;
    }


    trigger(type, data = null, async = null)
    {

        let event;

        async ??= this.#useasync;

        if (type instanceof Event)
        {
            event = type;
            event.data ??= data;
            type = event.type;
        }

        if (!isString(type) && type instanceof Event === false)
        {
            throw new TypeError('Invalid event type, not a String|Event.');
        }


        const types = [];

        type.split(/\s+/).forEach(type =>
        {

            if (types.includes(type))
            {
                return;
            }

            types.push(type);

            for (let item of getListenersForEvent(this.#listeners, type))
            {

                if (item.type === type)
                {

                    if (async)
                    {
                        runAsync(item.listener, event ?? { type, data });

                    } else
                    {
                        item.listener(event ?? { type, data });
                    }

                    if (item.once)
                    {
                        this.off(type, item.listener);
                    }
                }
            }


        });

        return this;


    }


    mixin(binding)
    {

        if (binding instanceof Object)
        {
            ['on', 'off', 'one', 'trigger'].forEach(method =>
            {
                Object.defineProperty(binding, method, {
                    enumerable: false, configurable: true,
                    value: (...args) =>
                    {
                        this[method](...args);
                        return binding;
                    }
                });
            });

        }

        return this;
    }


    static mixin(binding, useasync = true)
    {
        return (new EventManager(useasync)).mixin(binding);
    }

    static on(type, listener, once = false)
    {

        return instance$a.on(type, listener, once);
    }

    static one(type, listener)
    {

        return instance$a.one(type, listener);
    }

    static off(type, listener)
    {

        return instance$a.off(type, listener);
    }

    static trigger(type, data = null, async = null)
    {

        return instance$a.trigger(type, data, async);
    }

}



const instance$a = new EventManager();

// import "./noscroll.css";

const { documentElement } = document;

class NoScroll
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
            this.#stylesheet = createElement$1('style', { type: 'text/css', id: 'no-scroll-component' });
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

/**
 * The base HTML Element
 */

class HtmlComponent
{

    #elem;
    get element()
    {
        return this.#elem;
    }

    attachTo(elem, append = true)
    {
        if (isElement$1(elem))
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
            element = createElement$1(element);
        }

        if (!isElement$1(element))
        {
            throw new TypeError("element is not an Element");
        }
        this.#elem = element;
        emitter(element).mixin(this);
    }

}

/**
 * @link https://m2.material.io/components/dialogs/web#using-dialogs
 * @link https://getmdl.io/components/index.html#dialog-section
 */



const dialogs = new Set();


function findClosest(target, ...parents)
{

    do
    {
        if (parents.some(p => p === target))
        {
            return true;
        }
    } while (target = target.parentElement);
    return false;
}


function createDialogBox({
    title, content, id, idTitle, idDesc,

} = {})
{

    title ??= '';
    content ??= '';
    id ??= 'dialog' + dialogs.size;
    idTitle ??= id + "Title";
    idDesc ??= id + "Desc";



    let dialog, form, cancel, ok, close, titleEl, contentEl,
        closeIcon = svgs.ng_close.generate(20),
        validIcon = svgs.ng_check_circle.generate(20),
        dismissIcon = svgs.ng_cancel.generate(20);


    dialog = createElement$1('dialog', {

        id,
        title,
        role: 'dialog',
        aria: {
            labelledby: idTitle,
            describedby: idDesc,
        },
        class: 'ng-dialog'

    }, [

        form = createElement$1('form', {
            id: id + 'Form',
            class: 'ng-dialog--form',
            method: 'dialog',

        }, [

            createElement$1('<div class="ng-dialog--heading"/>', [
                titleEl = createElement$1('h4', {
                    id: idTitle,
                }, title),
                close = createElement$1('<button type="button" title="Close" value="close"/>', {
                }, closeIcon),
            ]),
            contentEl = createElement$1('<div class="ng-dialog--contents"/>', {
                id: idDesc,
            }, content),
            createElement$1('<div class="ng-dialog--footer"/>', [

                cancel = createElement$1('<button value="close" title="Cancel" type="reset"/>', [
                    dismissIcon,
                ]),


                ok = createElement$1('<button value="ok" title="Ok" type="submit" />', [
                    validIcon,
                ]),

            ])

        ])

    ]);


    return {
        dialog,
        form,
        content: contentEl,
        title: titleEl,
        close, cancel, ok,

    };

}



class Position extends BackedEnum
{

    static TOP = new Position('pos-top');
    static LEFT = new Position("pos-left");
    static RIGHT = new Position("pos-right");
    static BOTTOM = new Position("pos-bottom");
    static CENTER = new Position("pos-center");
}


class Dialog extends HtmlComponent
{



    // ------------------ Variants ------------------

    static async prompt(message, defaultValue = null)
    {

        // .ng-dialog--form-input
        const dialog = new Dialog(
            createElement$1('div', {
                class: "ng-dialog--form-input",
            }, [
                createElement$1('label', { for: 'value' }, message ?? ''),
                createElement$1("input", {
                    type: 'text',
                    name: 'value',
                    value: '',
                    placeholder: ""
                })
            ])
        );

        return await dialog.showModal(false).then(value =>
        {

            if (false === value)
            {
                return defaultValue;
            }

            if (isEmpty(value.value))
            {
                return defaultValue;
            }

            return decode(value.value);

        });

    }


    static async alert(message = '')
    {

        const dialog = new Dialog(encode(message));

        dialog.canClose = dialog.canCancel = dialog.backdropCloses = false;

        return await dialog.showModal();
    }

    static async confirm(message = '')
    {

        const dialog = new Dialog(encode(message));

        dialog.canClose = dialog.backdropCloses = false;

        return await dialog.showModal();
    }





    // ------------------ Implementation ------------------
    #backdrop;


    set backdropCloses(flag)
    {
        this.#backdrop = flag === true;
    }


    get backdropCloses()
    {
        return this.#backdrop !== false;
    }


    set canCancel(flag)
    {
        this.elements.cancel.hidden = flag === true ? null : true;
    }
    get canCancel()
    {
        return this.elements.cancel.hidden === null;
    }


    set canClose(flag)
    {
        this.elements.close.hidden = flag === true ? null : true;
    }
    get canClose()
    {
        return this.elements.close.hidden === null;
    }


    set content(value)
    {

        if (isString(value))
        {
            value = [value];
        } else if (isElement$1(value))
        {
            value = [value];
        }

        if (isArray(value))
        {
            this.elements.content = '';
            value.forEach(html =>
            {
                if (isString(html))
                {
                    this.elements.content += html;
                } else if (isElement$1(value))
                {
                    this.elements.content.appendChild(html);
                }

            });
        }

    }

    get content()
    {
        return this.elements.content;
    }


    get returnValue()
    {
        return decode(this.element.returnValue || false);
    }


    get title()
    {
        return this.elements.title.innerHTML;
    }

    set title(value)
    {
        this.elements.title.innerHTML = encode(value);
    }

    #position;
    get position()
    {
        return this.#position;
    }

    set position(value)
    {
        if (value instanceof Position)
        {
            value = [value];
        }


        if (isArray(value))
        {
            value = value.filter(v => v instanceof Position);
            this.#position = value;
            this.element.classList.remove(...Position.cases().map(x => x.value));
            this.element.classList.add(...value.map(x => x.value));
        }
    }





    set returnValue(value)
    {
        this.element.returnValue = encode(value);
    }




    get open()
    {
        return this.element.open;
    }

    get formdata()
    {
        return new FormData(this.elements.form);
    }

    elements;




    show()
    {
        return new Promise(resolve =>
        {

            this.one('close', e =>
            {
                resolve(this.returnValue);
            });


            if (!this.open)
            {
                if (!this.isAttached)
                {
                    this.attachTo(document.body);
                }
            }

            this.element.show();

        });


    }
    showModal(backdropClose)
    {


        return new Promise(resolve =>
        {


            this.one('close', e => resolve(this.returnValue));


            if (!this.open)
            {
                if (!this.isAttached)
                {
                    this.attachTo(document.body);
                }

                if (backdropClose ??= this.backdropCloses)
                {

                    const listener = e =>
                    {

                        if (!findClosest(e.target, this.elements.form))
                        {
                            this.off('click', listener);
                            this.close(false);
                        }

                    };

                    this.on('click', listener);
                }


                NoScroll.enable().then(() =>
                {
                    this.element.showModal();
                    // focus into the first form element or the confirm button
                    setTimeout(() =>
                    {
                        (this.elements.form.querySelector("input") ?? this.elements.ok).focus();

                    }, 650);
                });
            }
        });

    }

    close(value)
    {



        if (!this.open)
        {
            return Promise.resolve(value);
        }

        return new Promise(resolve =>
        {
            const { element } = this;

            element.classList.add("closing");

            setTimeout(() =>
            {

                element.close(encode(value));
                element.classList.remove("closing");
                resolve(value);
            }, 550);

        });


    }


    constructor(content, title, id)
    {


        const elements = createDialogBox({ title, content, id });

        super(elements.dialog);

        this.elements = elements;
        dialogs.add(this);

        this.#position = [Position.CENTER];

        this.on('click', e =>
        {

            const { target } = e;

            if (findClosest(target, elements.close))
            {
                e.preventDefault();
                this.close(false);
            }

        }).on('submit', e =>
        {
            e.preventDefault();
            const data = Object.fromEntries(this.formdata.entries());
            this.close(isEmpty(data) ? true : data);
        }).on('reset', e =>
        {
            e.preventDefault();

            elements.form.reset();
            this.close(false);
        }).on('close', e =>
        {
            NoScroll.disable();
        }).on('open', console.dir);


    }


}

/* src\components\Header.svelte generated by Svelte v3.59.1 */
const file$8 = "src\\components\\Header.svelte";

function create_fragment$9(ctx) {
	let header;
	let div1;
	let a0;
	let img0;
	let img0_src_value;
	let t0;
	let img1;
	let img1_src_value;
	let t1;
	let input;
	let t2;
	let nav;
	let a1;
	let t3;
	let a1_class_value;
	let t4;
	let a2;
	let t5;
	let a2_class_value;
	let t6;
	let a3;
	let t7;
	let a3_class_value;
	let t8;
	let a4;
	let t9;
	let a4_class_value;
	let t10;
	let a5;
	let i;
	let t11;
	let span;
	let t13;
	let label;
	let div0;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			header = element("header");
			div1 = element("div");
			a0 = element("a");
			img0 = element("img");
			t0 = space();
			img1 = element("img");
			t1 = space();
			input = element("input");
			t2 = space();
			nav = element("nav");
			a1 = element("a");
			t3 = text("Accueil");
			t4 = space();
			a2 = element("a");
			t5 = text("Séries");
			t6 = space();
			a3 = element("a");
			t7 = text("Films");
			t8 = space();
			a4 = element("a");
			t9 = text("Tous les films et séries");
			t10 = space();
			a5 = element("a");
			i = element("i");
			t11 = space();
			span = element("span");
			span.textContent = "Comment Jouer";
			t13 = space();
			label = element("label");
			div0 = element("div");
			if (!src_url_equal(img0.src, img0_src_value = "./assets/pictures/m.webp")) attr_dev(img0, "src", img0_src_value);
			attr_dev(img0, "width", "32");
			attr_dev(img0, "height", "32");
			attr_dev(img0, "alt", "Movie Quiz Logo Mini");
			attr_dev(img0, "class", "d-md-none");
			add_location(img0, file$8, 67, 12, 1632);
			if (!src_url_equal(img1.src, img1_src_value = "./assets/pictures/moviequiz.webp")) attr_dev(img1, "src", img1_src_value);
			attr_dev(img1, "height", "32");
			attr_dev(img1, "width", "126");
			attr_dev(img1, "alt", "Movie Quiz Logo");
			attr_dev(img1, "class", "d-none d-md-inline-block");
			add_location(img1, file$8, 74, 12, 1843);
			attr_dev(a0, "class", "logo");
			attr_dev(a0, "href", "./");
			attr_dev(a0, "title", "Movie Quiz");
			add_location(a0, file$8, 66, 8, 1574);
			attr_dev(input, "type", "checkbox");
			attr_dev(input, "id", "burger-btn");
			attr_dev(input, "name", "burger-btn");
			attr_dev(input, "title", "Burger Button Checkbox");
			attr_dev(input, "class", "");
			add_location(input, file$8, 82, 8, 2082);
			attr_dev(a1, "class", a1_class_value = "nav-link" + (/*$loc*/ ctx[1].pathname.endsWith('/') ? ' active' : ''));
			attr_dev(a1, "href", "./");
			add_location(a1, file$8, 96, 12, 2527);
			attr_dev(a2, "href", "tv");

			attr_dev(a2, "class", a2_class_value = "nav-link" + (/*$loc*/ ctx[1].pathname.startsWith('/tv')
			? ' active'
			: ''));

			add_location(a2, file$8, 103, 12, 2728);
			attr_dev(a3, "href", "movies");

			attr_dev(a3, "class", a3_class_value = "nav-link" + (/*$loc*/ ctx[1].pathname.startsWith('/movies')
			? ' active'
			: ''));

			add_location(a3, file$8, 112, 12, 2972);
			attr_dev(a4, "href", "all");

			attr_dev(a4, "class", a4_class_value = "nav-link" + (/*$loc*/ ctx[1].pathname.startsWith('/all')
			? ' active'
			: ''));

			add_location(a4, file$8, 119, 12, 3193);
			attr_dev(nav, "class", "nav flex-column flex-lg-row justify-content-center");
			add_location(nav, file$8, 92, 8, 2397);
			attr_dev(i, "class", "ng-help");
			attr_dev(i, "size", "24");
			add_location(i, file$8, 136, 12, 3685);
			attr_dev(span, "class", "hide-on-mobile ms-1");
			add_location(span, file$8, 137, 12, 3729);
			attr_dev(a5, "class", "info-btn ms-auto my-2 d-flex align-items-center");
			attr_dev(a5, "href", "#");
			add_location(a5, file$8, 131, 8, 3523);
			attr_dev(div0, "class", "burger");
			add_location(div0, file$8, 141, 12, 3879);
			attr_dev(label, "for", "burger-btn");
			attr_dev(label, "class", "burger-btn ms-3 mobile-only");
			add_location(label, file$8, 140, 8, 3806);
			attr_dev(div1, "class", "nav-container w-100 d-flex align-items-center px-2 px-md-5");
			attr_dev(div1, "id", "top");
			add_location(div1, file$8, 62, 4, 1463);
			attr_dev(header, "class", "user-select-none");
			add_location(header, file$8, 61, 0, 1425);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, header, anchor);
			append_dev(header, div1);
			append_dev(div1, a0);
			append_dev(a0, img0);
			append_dev(a0, t0);
			append_dev(a0, img1);
			append_dev(div1, t1);
			append_dev(div1, input);
			/*input_binding*/ ctx[7](input);
			append_dev(div1, t2);
			append_dev(div1, nav);
			append_dev(nav, a1);
			append_dev(a1, t3);
			append_dev(nav, t4);
			append_dev(nav, a2);
			append_dev(a2, t5);
			append_dev(nav, t6);
			append_dev(nav, a3);
			append_dev(a3, t7);
			append_dev(nav, t8);
			append_dev(nav, a4);
			append_dev(a4, t9);
			append_dev(div1, t10);
			append_dev(div1, a5);
			append_dev(a5, i);
			append_dev(a5, t11);
			append_dev(a5, span);
			append_dev(div1, t13);
			append_dev(div1, label);
			append_dev(label, div0);

			if (!mounted) {
				dispose = [
					listen_dev(input, "change", /*handleBurgerChange*/ ctx[3], false, false, false, false),
					action_destroyer(links.call(null, a1)),
					action_destroyer(links.call(null, a2)),
					action_destroyer(links.call(null, a3)),
					action_destroyer(links.call(null, a4)),
					listen_dev(nav, "click", /*navClick*/ ctx[4], false, false, false, false),
					listen_dev(a5, "click", prevent_default(/*showModal*/ ctx[2]), false, true, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*$loc*/ 2 && a1_class_value !== (a1_class_value = "nav-link" + (/*$loc*/ ctx[1].pathname.endsWith('/') ? ' active' : ''))) {
				attr_dev(a1, "class", a1_class_value);
			}

			if (dirty & /*$loc*/ 2 && a2_class_value !== (a2_class_value = "nav-link" + (/*$loc*/ ctx[1].pathname.startsWith('/tv')
			? ' active'
			: ''))) {
				attr_dev(a2, "class", a2_class_value);
			}

			if (dirty & /*$loc*/ 2 && a3_class_value !== (a3_class_value = "nav-link" + (/*$loc*/ ctx[1].pathname.startsWith('/movies')
			? ' active'
			: ''))) {
				attr_dev(a3, "class", a3_class_value);
			}

			if (dirty & /*$loc*/ 2 && a4_class_value !== (a4_class_value = "nav-link" + (/*$loc*/ ctx[1].pathname.startsWith('/all')
			? ' active'
			: ''))) {
				attr_dev(a4, "class", a4_class_value);
			}
		},
		i: noop$1,
		o: noop$1,
		d: function destroy(detaching) {
			if (detaching) detach_dev(header);
			/*input_binding*/ ctx[7](null);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$9.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$9($$self, $$props, $$invalidate) {
	let $loc;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Header', slots, []);

	const regles = new Dialog(`<p class="text-center">Le joueur doit deviner les noms de films et de séries à partir d'images grisées<br>
                    en tappant le nom dans la zone dédiée.</p>`,
	`Comment Jouer`);

	regles.canCancel = false;
	regles.position = Position.TOP;

	function showModal() {
		regles.showModal();
	}

	let burger;

	function handleBurgerChange() {
		if (burger.checked) {
			NoScroll.enable();
		} else {
			NoScroll.disable();
		}
	}

	/**
 * Resize listener
 */
	const breakpoint = matchMedia("(max-width: 992px)");

	breakpoint.addEventListener("change", e => {
		if (!e.matches) {
			$$invalidate(0, burger.checked = false, burger);

			if (!regles?.open) {
				NoScroll.disable();
			}
		}
	});

	NoScroll.on("disabled", e => {
		if (burger.checked && breakpoint.matches) {
			NoScroll.enable();
		}
	});

	function navClick(e) {
		let a = e.target.closest("a");

		if (a && breakpoint.matches) {
			$$invalidate(0, burger.checked = false, burger);
		}
	}

	const loc = useLocation();
	validate_store(loc, 'loc');
	component_subscribe($$self, loc, value => $$invalidate(1, $loc = value));
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
	});

	function input_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			burger = $$value;
			$$invalidate(0, burger);
		});
	}

	$$self.$capture_state = () => ({
		links,
		useLocation,
		Dialog,
		Position,
		NoScroll,
		regles,
		showModal,
		burger,
		handleBurgerChange,
		breakpoint,
		navClick,
		loc,
		$loc
	});

	$$self.$inject_state = $$props => {
		if ('burger' in $$props) $$invalidate(0, burger = $$props.burger);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		burger,
		$loc,
		showModal,
		handleBurgerChange,
		navClick,
		loc,
		regles,
		input_binding
	];
}

class Header extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$9, create_fragment$9, safe_not_equal, { regles: 6 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Header",
			options,
			id: create_fragment$9.name
		});
	}

	get regles() {
		return this.$$.ctx[6];
	}

	set regles(value) {
		throw new Error("<Header>: Cannot set read-only property 'regles'");
	}
}

/* src\components\Footer.svelte generated by Svelte v3.59.1 */
const file$7 = "src\\components\\Footer.svelte";

function create_fragment$8(ctx) {
	let footer;
	let t0;
	let br;
	let t1;
	let a;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			footer = element("footer");
			t0 = text("Une réalisation © ACS Lons-le-Saunier - Mentions légales");
			br = element("br");
			t1 = space();
			a = element("a");
			a.textContent = "Crédits";
			add_location(br, file$7, 19, 65, 613);
			attr_dev(a, "href", "#credits");
			attr_dev(a, "title", "Crédits");
			add_location(a, file$7, 20, 4, 624);
			attr_dev(footer, "class", "text-center p-3 mt-3");
			add_location(footer, file$7, 18, 0, 510);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, footer, anchor);
			append_dev(footer, t0);
			append_dev(footer, br);
			append_dev(footer, t1);
			append_dev(footer, a);

			if (!mounted) {
				dispose = listen_dev(a, "click", prevent_default(/*handleClick*/ ctx[0]), false, true, false, false);
				mounted = true;
			}
		},
		p: noop$1,
		i: noop$1,
		o: noop$1,
		d: function destroy(detaching) {
			if (detaching) detach_dev(footer);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$8.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$8($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Footer', slots, []);

	const credits = new Dialog(`<p class="text-center">
            Jeu développé par <a href="https://aanger.netlify.app/" target="_blank">Aymeric Anger</a>, utilisant ces technologies:
        </p>`,
	`Crédits`);

	// credits.position = Position.BOTTOM;
	credits.canCancel = credits.canClose = credits.backdropCloses = false;

	function handleClick() {
		credits.showModal();
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ Dialog, credits, handleClick });
	return [handleClick, credits];
}

class Footer extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$8, create_fragment$8, safe_not_equal, { credits: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Footer",
			options,
			id: create_fragment$8.name
		});
	}

	get credits() {
		return this.$$.ctx[1];
	}

	set credits(value) {
		throw new Error("<Footer>: Cannot set read-only property 'credits'");
	}
}

/* src\components\Loader.svelte generated by Svelte v3.59.1 */

const file$6 = "src\\components\\Loader.svelte";

function create_fragment$7(ctx) {
	let div;
	let span0;
	let t0;
	let span1;
	let t1;
	let span2;
	let t2;
	let span3;

	const block = {
		c: function create() {
			div = element("div");
			span0 = element("span");
			t0 = space();
			span1 = element("span");
			t1 = space();
			span2 = element("span");
			t2 = space();
			span3 = element("span");
			add_location(span0, file$6, 1, 4, 23);
			add_location(span1, file$6, 2, 4, 36);
			add_location(span2, file$6, 3, 4, 49);
			add_location(span3, file$6, 4, 4, 62);
			attr_dev(div, "class", "fluo");
			add_location(div, file$6, 0, 0, 0);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, span0);
			append_dev(div, t0);
			append_dev(div, span1);
			append_dev(div, t1);
			append_dev(div, span2);
			append_dev(div, t2);
			append_dev(div, span3);
		},
		p: noop$1,
		i: noop$1,
		o: noop$1,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$7.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$7($$self, $$props) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Loader', slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Loader> was created with unknown prop '${key}'`);
	});

	return [];
}

class Loader extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$7, create_fragment$7, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Loader",
			options,
			id: create_fragment$7.name
		});
	}
}

function t(){return t=Object.assign?Object.assign.bind():function(t){for(var s=1;s<arguments.length;s++){var e=arguments[s];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);}return t},t.apply(this,arguments)}var s={strings:["These are the default values...","You know what you should do?","Use your own!","Have a great day!"],stringsElement:null,typeSpeed:0,startDelay:0,backSpeed:0,smartBackspace:!0,shuffle:!1,backDelay:700,fadeOut:!1,fadeOutClass:"typed-fade-out",fadeOutDelay:500,loop:!1,loopCount:Infinity,showCursor:!0,cursorChar:"|",autoInsertCss:!0,attr:null,bindInputFocusEvents:!1,contentType:"html",onBegin:function(t){},onComplete:function(t){},preStringTyped:function(t,s){},onStringTyped:function(t,s){},onLastStringBackspaced:function(t){},onTypingPaused:function(t,s){},onTypingResumed:function(t,s){},onReset:function(t){},onStop:function(t,s){},onStart:function(t,s){},onDestroy:function(t){}},e=new(/*#__PURE__*/function(){function e(){}var n=e.prototype;return n.load=function(e,n,i){if(e.el="string"==typeof i?document.querySelector(i):i,e.options=t({},s,n),e.isInput="input"===e.el.tagName.toLowerCase(),e.attr=e.options.attr,e.bindInputFocusEvents=e.options.bindInputFocusEvents,e.showCursor=!e.isInput&&e.options.showCursor,e.cursorChar=e.options.cursorChar,e.cursorBlinking=!0,e.elContent=e.attr?e.el.getAttribute(e.attr):e.el.textContent,e.contentType=e.options.contentType,e.typeSpeed=e.options.typeSpeed,e.startDelay=e.options.startDelay,e.backSpeed=e.options.backSpeed,e.smartBackspace=e.options.smartBackspace,e.backDelay=e.options.backDelay,e.fadeOut=e.options.fadeOut,e.fadeOutClass=e.options.fadeOutClass,e.fadeOutDelay=e.options.fadeOutDelay,e.isPaused=!1,e.strings=e.options.strings.map(function(t){return t.trim()}),e.stringsElement="string"==typeof e.options.stringsElement?document.querySelector(e.options.stringsElement):e.options.stringsElement,e.stringsElement){e.strings=[],e.stringsElement.style.cssText="clip: rect(0 0 0 0);clip-path:inset(50%);height:1px;overflow:hidden;position:absolute;white-space:nowrap;width:1px;";var r=Array.prototype.slice.apply(e.stringsElement.children),o=r.length;if(o)for(var a=0;a<o;a+=1)e.strings.push(r[a].innerHTML.trim());}for(var u in e.strPos=0,e.currentElContent=this.getCurrentElContent(e),e.currentElContent&&e.currentElContent.length>0&&(e.strPos=e.currentElContent.length-1,e.strings.unshift(e.currentElContent)),e.sequence=[],e.strings)e.sequence[u]=u;e.arrayPos=0,e.stopNum=0,e.loop=e.options.loop,e.loopCount=e.options.loopCount,e.curLoop=0,e.shuffle=e.options.shuffle,e.pause={status:!1,typewrite:!0,curString:"",curStrPos:0},e.typingComplete=!1,e.autoInsertCss=e.options.autoInsertCss,e.autoInsertCss&&(this.appendCursorAnimationCss(e),this.appendFadeOutAnimationCss(e));},n.getCurrentElContent=function(t){return t.attr?t.el.getAttribute(t.attr):t.isInput?t.el.value:"html"===t.contentType?t.el.innerHTML:t.el.textContent},n.appendCursorAnimationCss=function(t){var s="data-typed-js-cursor-css";if(t.showCursor&&!document.querySelector("["+s+"]")){var e=document.createElement("style");e.setAttribute(s,"true"),e.innerHTML="\n        .typed-cursor{\n          opacity: 1;\n        }\n        .typed-cursor.typed-cursor--blink{\n          animation: typedjsBlink 0.7s infinite;\n          -webkit-animation: typedjsBlink 0.7s infinite;\n                  animation: typedjsBlink 0.7s infinite;\n        }\n        @keyframes typedjsBlink{\n          50% { opacity: 0.0; }\n        }\n        @-webkit-keyframes typedjsBlink{\n          0% { opacity: 1; }\n          50% { opacity: 0.0; }\n          100% { opacity: 1; }\n        }\n      ",document.body.appendChild(e);}},n.appendFadeOutAnimationCss=function(t){var s="data-typed-fadeout-js-css";if(t.fadeOut&&!document.querySelector("["+s+"]")){var e=document.createElement("style");e.setAttribute(s,"true"),e.innerHTML="\n        .typed-fade-out{\n          opacity: 0;\n          transition: opacity .25s;\n        }\n        .typed-cursor.typed-cursor--blink.typed-fade-out{\n          -webkit-animation: 0;\n          animation: 0;\n        }\n      ",document.body.appendChild(e);}},e}()),n=new(/*#__PURE__*/function(){function t(){}var s=t.prototype;return s.typeHtmlChars=function(t,s,e){if("html"!==e.contentType)return s;var n=t.substring(s).charAt(0);if("<"===n||"&"===n){var i;for(i="<"===n?">":";";t.substring(s+1).charAt(0)!==i&&!(1+ ++s>t.length););s++;}return s},s.backSpaceHtmlChars=function(t,s,e){if("html"!==e.contentType)return s;var n=t.substring(s).charAt(0);if(">"===n||";"===n){var i;for(i=">"===n?"<":"&";t.substring(s-1).charAt(0)!==i&&!(--s<0););s--;}return s},t}()),i=/*#__PURE__*/function(){function t(t,s){e.load(this,s,t),this.begin();}var s=t.prototype;return s.toggle=function(){this.pause.status?this.start():this.stop();},s.stop=function(){this.typingComplete||this.pause.status||(this.toggleBlinking(!0),this.pause.status=!0,this.options.onStop(this.arrayPos,this));},s.start=function(){this.typingComplete||this.pause.status&&(this.pause.status=!1,this.pause.typewrite?this.typewrite(this.pause.curString,this.pause.curStrPos):this.backspace(this.pause.curString,this.pause.curStrPos),this.options.onStart(this.arrayPos,this));},s.destroy=function(){this.reset(!1),this.options.onDestroy(this);},s.reset=function(t){void 0===t&&(t=!0),clearInterval(this.timeout),this.replaceText(""),this.cursor&&this.cursor.parentNode&&(this.cursor.parentNode.removeChild(this.cursor),this.cursor=null),this.strPos=0,this.arrayPos=0,this.curLoop=0,t&&(this.insertCursor(),this.options.onReset(this),this.begin());},s.begin=function(){var t=this;this.options.onBegin(this),this.typingComplete=!1,this.shuffleStringsIfNeeded(this),this.insertCursor(),this.bindInputFocusEvents&&this.bindFocusEvents(),this.timeout=setTimeout(function(){0===t.strPos?t.typewrite(t.strings[t.sequence[t.arrayPos]],t.strPos):t.backspace(t.strings[t.sequence[t.arrayPos]],t.strPos);},this.startDelay);},s.typewrite=function(t,s){var e=this;this.fadeOut&&this.el.classList.contains(this.fadeOutClass)&&(this.el.classList.remove(this.fadeOutClass),this.cursor&&this.cursor.classList.remove(this.fadeOutClass));var i=this.humanizer(this.typeSpeed),r=1;!0!==this.pause.status?this.timeout=setTimeout(function(){s=n.typeHtmlChars(t,s,e);var i=0,o=t.substring(s);if("^"===o.charAt(0)&&/^\^\d+/.test(o)){var a=1;a+=(o=/\d+/.exec(o)[0]).length,i=parseInt(o),e.temporaryPause=!0,e.options.onTypingPaused(e.arrayPos,e),t=t.substring(0,s)+t.substring(s+a),e.toggleBlinking(!0);}if("`"===o.charAt(0)){for(;"`"!==t.substring(s+r).charAt(0)&&(r++,!(s+r>t.length)););var u=t.substring(0,s),p=t.substring(u.length+1,s+r),c=t.substring(s+r+1);t=u+p+c,r--;}e.timeout=setTimeout(function(){e.toggleBlinking(!1),s>=t.length?e.doneTyping(t,s):e.keepTyping(t,s,r),e.temporaryPause&&(e.temporaryPause=!1,e.options.onTypingResumed(e.arrayPos,e));},i);},i):this.setPauseStatus(t,s,!0);},s.keepTyping=function(t,s,e){0===s&&(this.toggleBlinking(!1),this.options.preStringTyped(this.arrayPos,this));var n=t.substring(0,s+=e);this.replaceText(n),this.typewrite(t,s);},s.doneTyping=function(t,s){var e=this;this.options.onStringTyped(this.arrayPos,this),this.toggleBlinking(!0),this.arrayPos===this.strings.length-1&&(this.complete(),!1===this.loop||this.curLoop===this.loopCount)||(this.timeout=setTimeout(function(){e.backspace(t,s);},this.backDelay));},s.backspace=function(t,s){var e=this;if(!0!==this.pause.status){if(this.fadeOut)return this.initFadeOut();this.toggleBlinking(!1);var i=this.humanizer(this.backSpeed);this.timeout=setTimeout(function(){s=n.backSpaceHtmlChars(t,s,e);var i=t.substring(0,s);if(e.replaceText(i),e.smartBackspace){var r=e.strings[e.arrayPos+1];e.stopNum=r&&i===r.substring(0,s)?s:0;}s>e.stopNum?(s--,e.backspace(t,s)):s<=e.stopNum&&(e.arrayPos++,e.arrayPos===e.strings.length?(e.arrayPos=0,e.options.onLastStringBackspaced(),e.shuffleStringsIfNeeded(),e.begin()):e.typewrite(e.strings[e.sequence[e.arrayPos]],s));},i);}else this.setPauseStatus(t,s,!1);},s.complete=function(){this.options.onComplete(this),this.loop?this.curLoop++:this.typingComplete=!0;},s.setPauseStatus=function(t,s,e){this.pause.typewrite=e,this.pause.curString=t,this.pause.curStrPos=s;},s.toggleBlinking=function(t){this.cursor&&(this.pause.status||this.cursorBlinking!==t&&(this.cursorBlinking=t,t?this.cursor.classList.add("typed-cursor--blink"):this.cursor.classList.remove("typed-cursor--blink")));},s.humanizer=function(t){return Math.round(Math.random()*t/2)+t},s.shuffleStringsIfNeeded=function(){this.shuffle&&(this.sequence=this.sequence.sort(function(){return Math.random()-.5}));},s.initFadeOut=function(){var t=this;return this.el.className+=" "+this.fadeOutClass,this.cursor&&(this.cursor.className+=" "+this.fadeOutClass),setTimeout(function(){t.arrayPos++,t.replaceText(""),t.strings.length>t.arrayPos?t.typewrite(t.strings[t.sequence[t.arrayPos]],0):(t.typewrite(t.strings[0],0),t.arrayPos=0);},this.fadeOutDelay)},s.replaceText=function(t){this.attr?this.el.setAttribute(this.attr,t):this.isInput?this.el.value=t:"html"===this.contentType?this.el.innerHTML=t:this.el.textContent=t;},s.bindFocusEvents=function(){var t=this;this.isInput&&(this.el.addEventListener("focus",function(s){t.stop();}),this.el.addEventListener("blur",function(s){t.el.value&&0!==t.el.value.length||t.start();}));},s.insertCursor=function(){this.showCursor&&(this.cursor||(this.cursor=document.createElement("span"),this.cursor.className="typed-cursor",this.cursor.setAttribute("aria-hidden",!0),this.cursor.innerHTML=this.cursorChar,this.el.parentNode&&this.el.parentNode.insertBefore(this.cursor,this.el.nextSibling)));},t}();

var messages = [
    "Reticulating splines...",
    "Generating witty dialog...",
    "Swapping time and space...",
    "Spinning violently around the y-axis...",
    "Tokenizing real life...",
    "Bending the spoon...",
    "Filtering morale...",
    "Don't think of purple hippos...",
    "We need a new fuse...",
    "Have a good day.",
    "Upgrading Windows, your PC will restart several times. Sit back and relax.",
    "640K ought to be enough for anybody",
    "The architects are still drafting",
    "The bits are breeding",
    "We're building the buildings as fast as we can",
    "Would you prefer chicken, steak, or tofu?",
    "(Pay no attention to the man behind the curtain)",
    "...and enjoy the elevator music...",
    "Please wait while the little elves draw your map",
    "Don't worry - a few bits tried to escape, but we caught them",
    "Would you like fries with that?",
    "Checking the gravitational constant in your locale...",
    "Go ahead -- hold your breath!",
    "...at least you're not on hold...",
    "Hum something loud while others stare",
    "You're not in Kansas any more",
    "The server is powered by a lemon and two electrodes.",
    "Please wait while a larger software vendor in Seattle takes over the world",
    "We're testing your patience",
    "As if you had any other choice",
    "Follow the white rabbit",
    "Why don't you order a sandwich?",
    "While the satellite moves into position",
    "keep calm and npm install",
    "The bits are flowing slowly today",
    "Dig on the 'X' for buried treasure... ARRR!",
    "It's still faster than you could draw it",
    "The last time I tried this the monkey didn't survive. Let's hope it works better this time.",
    "I should have had a V8 this morning.",
    "My other loading screen is much faster.",
    "Testing on Timmy... We're going to need another Timmy.",
    "Reconfoobling energymotron...",
    "(Insert quarter)",
    "Are we there yet?",
    "Have you lost weight?",
    "Just count to 10",
    "Why so serious?",
    "It's not you. It's me.",
    "Counting backwards from Infinity",
    "Don't panic...",
    "Embiggening Prototypes",
    "Do not run! We are your friends!",
    "Do you come here often?",
    "Warning: Don't set yourself on fire.",
    "We're making you a cookie.",
    "Creating time-loop inversion field",
    "Spinning the wheel of fortune...",
    "Loading the enchanted bunny...",
    "Computing chance of success",
    "I'm sorry Dave, I can't do that.",
    "Looking for exact change",
    "All your web browser are belong to us",
    "All I really need is a kilobit.",
    "I feel like im supposed to be loading something. . .",
    "What do you call 8 Hobbits? A Hobbyte.",
    "Should have used a compiled language...",
    "Is this Windows?",
    "Adjusting flux capacitor...",
    "Please wait until the sloth starts moving.",
    "Don't break your screen yet!",
    "I swear it's almost done.",
    "Let's take a mindfulness minute...",
    "Unicorns are at the end of this road, I promise.",
    "Listening for the sound of one hand clapping...",
    "Keeping all the 1's and removing all the 0's...",
    "Putting the icing on the cake. The cake is not a lie...",
    "Cleaning off the cobwebs...",
    "Making sure all the i's have dots...",
    "We need more dilithium crystals",
    "Where did all the internets go",
    "Connecting Neurotoxin Storage Tank...",
    "Granting wishes...",
    "Time flies when you’re having fun.",
    "Get some coffee and come back in ten minutes..",
    "Spinning the hamster…",
    "99 bottles of beer on the wall..",
    "Stay awhile and listen..",
    "Be careful not to step in the git-gui",
    "You edhall not pass! yet..",
    "Load it and they will come",
    "Convincing AI not to turn evil..",
    "There is no spoon. Because we are not done loading it",
    "Your left thumb points to the right and your right thumb points to the left.",
    "How did you get here?",
    "Wait, do you smell something burning?",
    "Computing the secret to life, the universe, and everything.",
    "When nothing is going right, go left!!...",
    "I love my job only when I'm on vacation...",
    "i'm not lazy, I'm just relaxed!!",
    "Never steal. The government hates competition....",
    "Why are they called apartments if they are all stuck together?",
    "Life is Short – Talk Fast!!!!",
    "Optimism – is a lack of information.....",
    "Save water and shower together",
    "Whenever I find the key to success, someone changes the lock.",
    "Sometimes I think war is God’s way of teaching us geography.",
    "I’ve got problem for your solution…..",
    "Where there’s a will, there’s a relative.",
    "User: the word computer professionals use when they mean !!idiot!!",
    "Adults are just kids with money.",
    "I think I am, therefore, I am. I think.",
    "A kiss is like a fight, with mouths.",
    "You don’t pay taxes—they take taxes.",
    "Coffee, Chocolate, Men. The richer the better!",
    "I am free of all prejudices. I hate everyone equally.",
    "git happens",
    "May the forks be with you",
    "A commit a day keeps the mobs away",
    "This is not a joke, it's a commit.",
    "Constructing additional pylons...",
    "Roping some seaturtles...",
    "Locating Jebediah Kerman...",
    "We are not liable for any broken screens as a result of waiting.",
    "Hello IT, have you tried turning it off and on again?",
    "If you type Google into Google you can break the internet",
    "Well, this is embarrassing.",
    "What is the airspeed velocity of an unladen swallow?",
    "Hello, IT... Have you tried forcing an unexpected reboot?",
    "They just toss us away like yesterday's jam.",
    "They're fairly regular, the beatings, yes. I'd say we're on a bi-weekly beating.",
    "The Elders of the Internet would never stand for it.",
    "Space is invisible mind dust, and stars are but wishes.",
    "Didn't know paint dried so quickly.",
    "Everything sounds the same",
    "I'm going to walk the dog",
    "I didn't choose the engineering life. The engineering life chose me.",
    "Dividing by zero...",
    "Spawn more Overlord!",
    "If I’m not back in five minutes, just wait longer.",
    "Some days, you just can’t get rid of a bug!",
    "We’re going to need a bigger boat.",
    "Chuck Norris never git push. The repo pulls before.",
    "Web developers do it with <style>",
    "I need to git pull --my-life-together",
    "Java developers never RIP. They just get Garbage Collected.",
    "Cracking military-grade encryption...",
    "Simulating traveling salesman...",
    "Proving P=NP...",
    "Entangling superstrings...",
    "Twiddling thumbs...",
    "Searching for plot device...",
    "Trying to sort in O(n)...",
    "Laughing at your pictures-i mean, loading...",
    "Sending data to NS-i mean, our servers.",
    "Looking for sense of humour, please hold on.",
    "Please wait while the intern refills his coffee.",
    "A different error message? Finally, some progress!",
    "Hold on while we wrap up our git together...sorry",
    "Please hold on as we reheat our coffee",
    "Kindly hold on as we convert this bug to a feature...",
    "Kindly hold on as our intern quits vim...",
    "Winter is coming...",
    "Installing dependencies",
    "Switching to the latest JS framework...",
    "Distracted by cat gifs",
    "Finding someone to hold my beer",
    "BRB, working on my side project",
    "@todo Insert witty loading message",
    "Let's hope it's worth the wait",
    "Aw, snap! Not..",
    "Ordering 1s and 0s...",
    "Updating dependencies...",
    "Whatever you do, don't look behind you...",
    "Please wait... Consulting the manual...",
    "It is dark. You're likely to be eaten by a grue.",
    "Loading funny message...",
    "It's 10:00pm. Do you know where your children are?",
    "Waiting Daenerys say all her titles...",
    "Feel free to spin in your chair",
    "What the what?",
    "format C: ...",
    "Forget you saw that password I just typed into the IM ...",
    "What's under there?",
    "Your computer has a virus, its name is Windows!",
    "Go ahead, hold your breath and do an ironman plank till loading complete",
    "Bored of slow loading spinner, buy more RAM!",
    "Help, I'm trapped in a loader!",
    "What is the difference btwn a hippo and a zippo? One is really heavy, the other is a little lighter",
    "Please wait, while we purge the Decepticons for you. Yes, You can thanks us later!",
    "Chuck Norris once urinated in a semi truck's gas tank as a joke....that truck is now known as Optimus Prime.",
    "Chuck Norris doesn’t wear a watch. HE decides what time it is.",
    "Mining some bitcoins...",
    "Downloading more RAM..",
    "Updating to Windows Vista...",
    "Deleting System32 folder",
    "Hiding all ;'s in your code",
    "Alt-F4 speeds things up.",
    "Initializing the initializer...",
    "When was the last time you dusted around here?",
    "Optimizing the optimizer...",
    "Last call for the data bus! All aboard!",
    "Running swag sticker detection...",
    "Never let a computer know you're in a hurry.",
    "A computer will do what you tell it to do, but that may be much different from what you had in mind.",
    "Some things man was never meant to know. For everything else, there's Google.",
    "Unix is user-friendly. It's just very selective about who its friends are.",
    "Shovelling coal into the server",
    "Pushing pixels...",
    "How about this weather, eh?",
    "Building a wall...",
    "Everything in this universe is either a potato or not a potato",
    "The severity of your issue is always lower than you expected.",
    "Updating Updater...",
    "Downloading Downloader...",
    "Debugging Debugger...",
    "Reading Terms and Conditions for you.",
    "Digested cookies being baked again.",
    "Live long and prosper.",
    "There is no cow level, but there's a goat one!",
    "Deleting all your hidden porn...",
    "Running with scissors...",
    "Definitely not a virus...",
    "You may call me Steve.",
    "You seem like a nice person...",
    "Coffee at my place, tommorow at 10A.M. - don't be late!",
    "Work, work...",
    "Patience! This is difficult, you know...",
    "Discovering new ways of making you wait...",
    "Your time is very important to us. Please wait while we ignore you...",
    "Time flies like an arrow; fruit flies like a banana",
    "Two men walked into a bar; the third ducked...",
    "Sooooo... Have you seen my vacation photos yet?",
    "Sorry we are busy catching em' all, we're done soon",
    "TODO: Insert elevator music",
    "Still faster than Windows update",
    "Composer hack: Waiting for reqs to be fetched is less frustrating if you add -vvv to your command.",
    "Please wait while the minions do their work",
    "Grabbing extra minions",
    "Doing the heavy lifting",
    "We're working very Hard .... Really",
    "Waking up the minions",
    "You are number 2843684714 in the queue",
    "Please wait while we serve other customers...",
    "Our premium plan is faster",
    "Feeding unicorns...",
    "Rupturing the subspace barrier",
    "Creating an anti-time reaction",
    "Converging tachyon pulses",
    "Bypassing control of the matter-antimatter integrator",
    "Adjusting the dilithium crystal converter assembly",
    "Reversing the shield polarity",
    "Disrupting warp fields with an inverse graviton burst",
    "Up, Up, Down, Down, Left, Right, Left, Right, B, A.",
    "Do you like my loading animation? I made it myself",
    "Whoah, look at it go!",
    "No, I'm awake. I was just resting my eyes.",
    "One mississippi, two mississippi...",
    "Don't panic... AHHHHH!",
    "Ensuring Gnomes are still short.",
    "Baking ice cream...",
];

/* src\components\MainLoader.svelte generated by Svelte v3.59.1 */
const file$5 = "src\\components\\MainLoader.svelte";

function create_fragment$6(ctx) {
	let div2;
	let div0;
	let img;
	let img_src_value;
	let t0;
	let loader;
	let t1;
	let div1;
	let span;
	let current;
	loader = new Loader({ $$inline: true });

	const block = {
		c: function create() {
			div2 = element("div");
			div0 = element("div");
			img = element("img");
			t0 = space();
			create_component(loader.$$.fragment);
			t1 = space();
			div1 = element("div");
			span = element("span");
			span.textContent = "Veuillez patienter, ça charge ...";
			if (!src_url_equal(img.src, img_src_value = "./assets/pictures/moviequiz.webp")) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "");
			add_location(img, file$5, 64, 8, 1743);
			attr_dev(div0, "class", "background");
			add_location(div0, file$5, 63, 4, 1709);
			attr_dev(span, "class", "typed");
			add_location(span, file$5, 68, 8, 1854);
			attr_dev(div1, "class", "");
			add_location(div1, file$5, 67, 4, 1830);
			attr_dev(div2, "class", "main-loader justify-content-evenly");
			add_location(div2, file$5, 62, 0, 1638);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div0);
			append_dev(div0, img);
			append_dev(div2, t0);
			mount_component(loader, div2, null);
			append_dev(div2, t1);
			append_dev(div2, div1);
			append_dev(div1, span);
			/*span_binding*/ ctx[5](span);
			/*div2_binding*/ ctx[6](div2);
			current = true;
		},
		p: noop$1,
		i: function intro(local) {
			if (current) return;
			transition_in(loader.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(loader.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			destroy_component(loader);
			/*span_binding*/ ctx[5](null);
			/*div2_binding*/ ctx[6](null);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$6.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$6($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('MainLoader', slots, []);
	let { phrase = [], loop = false, speed = 20 } = $$props;
	let toType, typed, unsub, elem;

	onMount(() => {
		if (!isArray(phrase)) {
			$$invalidate(2, phrase = [phrase]);
		}

		if (isEmpty(phrase)) {
			for (let i = 0; i < 4; i++) {
				phrase.push(messages[Math.floor(Math.random() * messages.length)]);
			}

			phrase.push(toType.innerText);
		}

		typed = new i(toType,
		{
				strings: phrase,
				typeSpeed: speed,
				backSpeed: Math.round(speed / 6),
				loop,
				loopCount: 5,
				onStringTyped() {
					if (pleaseStop) {
						typed.stop();

						setTimeout(
							() => {
								elem.classList.add("d-none");
							},
							200
						);
					}
				}
			});

		let pleaseStop = false;

		unsub = loading$1.subscribe(value => {
			if (false === (pleaseStop = !value)) {
				typed.start();
				elem.classList.remove("d-none");
			}
		});
	});

	onDestroy(() => {
		unsub();
		typed.onDestroy();
	});

	const writable_props = ['phrase', 'loop', 'speed'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MainLoader> was created with unknown prop '${key}'`);
	});

	function span_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			toType = $$value;
			$$invalidate(0, toType);
		});
	}

	function div2_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			elem = $$value;
			$$invalidate(1, elem);
		});
	}

	$$self.$$set = $$props => {
		if ('phrase' in $$props) $$invalidate(2, phrase = $$props.phrase);
		if ('loop' in $$props) $$invalidate(3, loop = $$props.loop);
		if ('speed' in $$props) $$invalidate(4, speed = $$props.speed);
	};

	$$self.$capture_state = () => ({
		Loader,
		onDestroy,
		onMount,
		Typed: i,
		isArray,
		isEmpty,
		loading: loading$1,
		messages,
		phrase,
		loop,
		speed,
		toType,
		typed,
		unsub,
		elem
	});

	$$self.$inject_state = $$props => {
		if ('phrase' in $$props) $$invalidate(2, phrase = $$props.phrase);
		if ('loop' in $$props) $$invalidate(3, loop = $$props.loop);
		if ('speed' in $$props) $$invalidate(4, speed = $$props.speed);
		if ('toType' in $$props) $$invalidate(0, toType = $$props.toType);
		if ('typed' in $$props) typed = $$props.typed;
		if ('unsub' in $$props) unsub = $$props.unsub;
		if ('elem' in $$props) $$invalidate(1, elem = $$props.elem);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [toType, elem, phrase, loop, speed, span_binding, div2_binding];
}

class MainLoader extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$6, create_fragment$6, safe_not_equal, { phrase: 2, loop: 3, speed: 4 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "MainLoader",
			options,
			id: create_fragment$6.name
		});
	}

	get phrase() {
		return this.$$.ctx[2];
	}

	set phrase(phrase) {
		this.$$set({ phrase });
		flush();
	}

	get loop() {
		return this.$$.ctx[3];
	}

	set loop(loop) {
		this.$$set({ loop });
		flush();
	}

	get speed() {
		return this.$$.ctx[4];
	}

	set speed(speed) {
		this.$$set({ speed });
		flush();
	}
}

/**
 * Private properties
 */
const
    SEP$1 = ':',
    _prefixes = new Map(),
    _hooks = new Map(),
    _queue = [];


class DataStoreType extends BackedEnum
{
    static SYNC = new DataStoreType('sync');
    static ASYNC = new DataStoreType('async');
}


function safeNotEqual(value, newValue)
{
    return value != value ? newValue == newValue : value !== newValue || ((value && typeof value === 'object') || typeof value === 'function');
}


function GetDataStoreHook(
    /** @type {DataStore} */ store,
    /** @type {string} */ name,
    /** @type {function} */ init = noop
)
{

    let $that;

    if ($that = _hooks.get(store).get(name))
    {
        return $that;
    }

    let stop, value = null;

    const
        subscribers = new Set(),
        safeSet = (value) =>
        {
            if (!isUndef(value) && !isNull(value))
            {
                set(value);
            }
        },
        set = (newValue) =>
        {
            if (safeNotEqual(value, newValue))
            {
                value = newValue;

                const canRun = !_queue.length;

                for (let sub of subscribers)
                {
                    sub[1]();
                    _queue.push([sub[0], value]);
                }

                if (canRun)
                {
                    store.setItem(name, value);

                    for (let item of _queue)
                    {
                        item[0](item[1]);
                    }
                    _queue.length = 0;
                }
            }

        },
        update = (fn) =>
        {
            if (isFunction(fn))
            {
                set(fn(value));
            }
        },
        subscribe = (subscriber, notifier = noop) =>
        {
            if (isFunction(subscriber))
            {
                const obj = [subscriber, notifier];

                subscribers.add(obj);

                if (subscribers.size === 1)
                {
                    stop = init(set) ?? noop;
                }

                subscriber(value);

                return () =>
                {
                    subscribers.delete(obj);
                    if (0 === subscribers.size && stop)
                    {
                        stop();
                        stop = null;
                    }
                };

            }

        },
        get = (defaultValue = null) =>
        {
            let value = store.getItem(name);


            if (null === value)
            {
                if (isFunction(defaultValue))
                {
                    defaultValue = defaultValue();

                    if (defaultValue instanceof Promise)
                    {
                        defaultValue.then(newValue => safeSet(newValue));
                    }
                    else 
                    {
                        safeSet(defaultValue);
                    }
                }


                return defaultValue;

            }


            return value;

        };

    $that = {
        subscribe, set, update, get
    };
    Object.defineProperty($that, 'length', { configurable: true, get: () => subscribers.size });
    _hooks.get(store).set(name, $that);
    return $that;
}




class DataStore
{

    get type()
    {
        return DataStoreType.SYNC;
    }

    constructor(prefix = '')
    {

        if (prefix && !prefix.endsWith(SEP$1))
        {
            prefix += SEP$1;
        }

        _prefixes.set(this, prefix);
        _hooks.set(this, new Map());
    }


    // ---------------- Helper Methods ----------------


    static get type()
    {
        return this.prototype.type;
    }

    key(/** @type {string} */name)
    {
        return _prefixes.get(this) + name;
    }



    // ---------------- Subscriptions ----------------

    subscribe(/** @type {string} */name, /** @type {function} */subscriber, /** @type {function} */ notifier = noop)
    {
        return this.hook(name).subscribe(subscriber, notifier);
    }


    // ---------------- Common Methods ----------------


    hasItem(/** @type {string} */name)
    {
        return this.getItem(name) !== null;
    }

    removeItem(name)
    {
        this.setItem(name, null);
    }

    setMany(items = {})
    {
        const result = new Map();
        for (let name in items)
        {
            const value = items[name];
            result.set(name, this.setItem(name, value));
        }

        return result;
    }

    getMany(keys = [], defaultValue = null)
    {
        return keys.map(key => [key, this.getItem(key, defaultValue)]);
    }


    hook(/** @type {string} */name, defaultValue = null)
    {
        return GetDataStoreHook(this, name, set =>
        {
            set(this.getItem(name, defaultValue));

        });
    }


    clear()
    {

        const keys = this.keys;

        for (let key of keys)
        {
            this.removeItem(key);
        }

        return keys;
    }



    // ---------------- Abstract Methods ----------------


    get keys()
    {
        throw new Error(getClass(this) + '.keys not implemented.');
    }



    getItem(/** @type {string} */name, defaultValue = null)
    {

        if (isFunction(defaultValue))
        {

            defaultValue = defaultValue();
            if (defaultValue instanceof Promise)
            {
                defaultValue.then(value => this.setItem(name, value));
            }
            else
            {
                this.setItem(name, defaultValue);
            }

        }

        return defaultValue;
    }

    setItem(/** @type {string} */name, value)
    {
        throw new Error(getClass(this) + '.setItem() not implemented.');
    }
}

const VENDOR_KEY = 'NGSOFT:UUID', SEP = ':';


function getDefaultPrefix()
{

    let prefix = '';


    if (!IS_UNSAFE)
    {
        return prefix;
    }

    if (null === (prefix = localStorage.getItem(VENDOR_KEY)))
    {
        localStorage.setItem(VENDOR_KEY, prefix = uuidv4() + SEP);
    }

    return prefix;
}




class WebStore extends DataStore
{


    #store;

    get store()
    {
        return this.#store;
    }


    constructor( /** @type {Storage} */   storage, prefix = getDefaultPrefix())
    {

        storage ??= localStorage;
        if (storage instanceof Storage === false)
        {
            throw new TypeError('storage not an instance of Storage');
        }
        super(prefix);
        this.#store = storage;
    }

    get keys()
    {

        const result = [], prefix = this.key(''), { store } = this;

        for (let i = 0; i < store.length; i++)
        {

            let key = store.key(i);
            if (key.startsWith(prefix))
            {
                result.push(key.slice(prefix.length));
            }

        }

        return result;
    }



    getItem(/** @type {string} */name, defaultValue = null)
    {

        let value = this.store.getItem(this.key(name));

        if (!isString(value))
        {
            return super.getItem(name, defaultValue);
        }

        return super.getItem(name, decode(value));
    }

    setItem(/** @type {string} */name, value)
    {

        if (value === null)
        {
            this.store.removeItem(this.key(name));
        }
        else
        {
            this.store.setItem(this.key(name), encode(value));
        }

        return value;
    }



    hook(/** @type {string} */name, defaultValue = null)
    {
        return GetDataStoreHook(this, name, set =>
        {

            const listener = e =>
            {

                if (e.storageArea === this.store)
                {
                    if (e.key === this.key(name))
                    {
                        set(decode(e.newValue));
                    }
                }
            };

            emitter.on('storage', listener);

            set(this.getItem(name, defaultValue));

            return () =>
            {
                emitter.off('storage', listener);
            };

        });

    }

}


const LocalStore = new WebStore(); new WebStore(sessionStorage);

const API_PATH = '/api/1', BUILD_DATE = 'June 20, 2023 21:37:59';



/**
 * Enum for media type
 */
class MediaType extends BackedEnum
{

    static ALL = new MediaType("all");
    static MOVIE = new MediaType("movies");
    static TV = new MediaType("tv");

    get path()
    {
        return API_PATH + '/' + this.value + '.json';
    }

    get key()
    {
        return this.value;
    }
}



/**
 * Version control api using (clears localstorage sync for code compatibility, but keep results found)
 * @link https://www.npmjs.com/package/rollup-plugin-version-injector
 */
(() =>
{
    if (LocalStore.getItem('BuildDate') !== BUILD_DATE)
    {
        LocalStore.removeItem(MediaType.MOVIE.value);
        LocalStore.removeItem(MediaType.TV.value);
        LocalStore.removeItem('current');
        LocalStore.setItem('BuildDate', BUILD_DATE);
        console.debug('Storage reset flowing base code update.');
    }

})();






/**
 * Data is Ready ?
 */
const ready = writable(false, set =>
{

    let timer;
    const listener = () =>
    {

        let value = !isEmpty(movies.get()) && !isEmpty(tv.get());

        if (value)
        {
            if (!current.get())
            {
                const list = getNotFound(movies.get());
                current.set(list[Math.floor(Math.random() * list.length)]);
            }
            set(value);
        }
        else
        {
            get_store_value(tv);
            get_store_value(movies);
            timer = setTimeout(() =>
            {
                listener();
                timer = null;
            }, 50);
        }

    };


    listener();

    return () =>
    {
        if (timer)
        {
            clearTimeout(timer);
        }
    };

});




const movies = LocalStore.hook(
    MediaType.MOVIE.key,
    () => fetch(MediaType.MOVIE.path).then(resp => resp.json())
);

const tv = LocalStore.hook(
    MediaType.TV.key,
    () => fetch(MediaType.TV.path).then(resp => resp.json())
);


const current = LocalStore.hook('current');
const found = LocalStore.hook('found', []);

/**
 * Merged series and movies
 */
const all = derived(
    [movies, tv],
    ([$movies, $tv]) => [...$movies, ...$tv]
);


function isFound(item)
{
    item = getEntry(item);
    return get_store_value(found).includes(item.id);
}


function getFound(items)
{
    return items.filter(item => isFound(item));
}


function getNotFound(items)
{
    return items.filter(item => !isFound(item));
}

/**
 * Get item using id
 */
function getEntry(id)
{

    if (isPlainObject(id))
    {
        return id.id ? id : null;
    }

    return get_store_value(all).find(item => item.id === id) ?? null;
}


function getYoutubeUrl(item)
{

    if (isInt(item))
    {
        item = getEntry(item);
    }
    if (item && item.videos && item.videos.length)
    {
        for (let entry of item.videos)
        {
            if (entry.site.toLowerCase() === 'youtube')
            {
                return new URL('https://www.youtube.com/watch?v=' + entry.key);
            }
        }
    }


    return null;
}

/* src\components\Heading.svelte generated by Svelte v3.59.1 */
const file$4 = "src\\components\\Heading.svelte";

// (18:0) {#if found || force}
function create_if_block$3(ctx) {
	let div1;
	let h3;
	let t1;
	let div0;
	let t2;
	let if_block0 = /*youtube*/ ctx[1] && create_if_block_2(ctx);
	let if_block1 = /*id*/ ctx[2] && create_if_block_1$2(ctx);

	const block = {
		c: function create() {
			div1 = element("div");
			h3 = element("h3");
			h3.textContent = `${/*title*/ ctx[3]}`;
			t1 = space();
			div0 = element("div");
			if (if_block0) if_block0.c();
			t2 = space();
			if (if_block1) if_block1.c();
			attr_dev(h3, "class", "heading-title text-uppercase mb-3");
			add_location(h3, file$4, 20, 8, 545);
			attr_dev(div0, "class", "d-flex flex-column flex-lg-row align-items-center");
			add_location(div0, file$4, 24, 8, 635);
			attr_dev(div1, "class", "heading p-lg-3");
			add_location(div1, file$4, 19, 4, 508);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, h3);
			append_dev(div1, t1);
			append_dev(div1, div0);
			if (if_block0) if_block0.m(div0, null);
			append_dev(div0, t2);
			if (if_block1) if_block1.m(div0, null);
		},
		p: function update(ctx, dirty) {
			if (/*youtube*/ ctx[1]) if_block0.p(ctx, dirty);
			if (/*id*/ ctx[2]) if_block1.p(ctx, dirty);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$3.name,
		type: "if",
		source: "(18:0) {#if found || force}",
		ctx
	});

	return block;
}

// (26:12) {#if youtube}
function create_if_block_2(ctx) {
	let a;
	let i;
	let t0;
	let span;

	const block = {
		c: function create() {
			a = element("a");
			i = element("i");
			t0 = space();
			span = element("span");
			span.textContent = "Voir la bande annonce";
			attr_dev(i, "class", "ng-play-arrow");
			attr_dev(i, "size", "32");
			add_location(i, file$4, 31, 20, 933);
			add_location(span, file$4, 32, 20, 991);
			attr_dev(a, "href", /*youtube*/ ctx[1]);
			attr_dev(a, "target", "_blank");
			attr_dev(a, "class", "button-play btn btn-light btn-lg col-12 col-lg-auto");
			add_location(a, file$4, 26, 16, 741);
		},
		m: function mount(target, anchor) {
			insert_dev(target, a, anchor);
			append_dev(a, i);
			append_dev(a, t0);
			append_dev(a, span);
		},
		p: noop$1,
		d: function destroy(detaching) {
			if (detaching) detach_dev(a);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(26:12) {#if youtube}",
		ctx
	});

	return block;
}

// (36:12) {#if id}
function create_if_block_1$2(ctx) {
	let a;
	let i;
	let t0;
	let span;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			a = element("a");
			i = element("i");
			t0 = space();
			span = element("span");
			span.textContent = "Plus d'infos";
			attr_dev(i, "class", "ng-info");
			attr_dev(i, "size", "32");
			add_location(i, file$4, 41, 20, 1320);
			add_location(span, file$4, 42, 20, 1372);
			attr_dev(a, "href", "/details/" + /*id*/ ctx[2]);
			attr_dev(a, "class", "button-infos btn btn-secondary btn-lg col-12 col-lg-auto ms-lg-3 my-3 my-lg-0");
			add_location(a, file$4, 36, 16, 1102);
		},
		m: function mount(target, anchor) {
			insert_dev(target, a, anchor);
			append_dev(a, i);
			append_dev(a, t0);
			append_dev(a, span);

			if (!mounted) {
				dispose = action_destroyer(links.call(null, a));
				mounted = true;
			}
		},
		p: noop$1,
		d: function destroy(detaching) {
			if (detaching) detach_dev(a);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$2.name,
		type: "if",
		source: "(36:12) {#if id}",
		ctx
	});

	return block;
}

function create_fragment$5(ctx) {
	let if_block_anchor;
	let if_block = (/*found*/ ctx[4] || /*force*/ ctx[0]) && create_if_block$3(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*found*/ ctx[4] || /*force*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$3(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop$1,
		o: noop$1,
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$5.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$5($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Heading', slots, []);
	let { item = {}, force = false } = $$props;

	if (!isPlainObject(item) || !item.title) {
		force = false;
	}

	let youtube = getYoutubeUrl(item), { id, title } = item, found = isFound(item);
	const writable_props = ['item', 'force'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Heading> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('item' in $$props) $$invalidate(5, item = $$props.item);
		if ('force' in $$props) $$invalidate(0, force = $$props.force);
	};

	$$self.$capture_state = () => ({
		links,
		getYoutubeUrl,
		isFound,
		isPlainObject,
		item,
		force,
		youtube,
		id,
		title,
		found
	});

	$$self.$inject_state = $$props => {
		if ('item' in $$props) $$invalidate(5, item = $$props.item);
		if ('force' in $$props) $$invalidate(0, force = $$props.force);
		if ('youtube' in $$props) $$invalidate(1, youtube = $$props.youtube);
		if ('id' in $$props) $$invalidate(2, id = $$props.id);
		if ('title' in $$props) $$invalidate(3, title = $$props.title);
		if ('found' in $$props) $$invalidate(4, found = $$props.found);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [force, youtube, id, title, found, item];
}

class Heading extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$5, create_fragment$5, safe_not_equal, { item: 5, force: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Heading",
			options,
			id: create_fragment$5.name
		});
	}

	get item() {
		return this.$$.ctx[5];
	}

	set item(item) {
		this.$$set({ item });
		flush();
	}

	get force() {
		return this.$$.ctx[0];
	}

	set force(force) {
		this.$$set({ force });
		flush();
	}
}

/* src\components\Cover.svelte generated by Svelte v3.59.1 */
const file$3 = "src\\components\\Cover.svelte";

function create_fragment$4(ctx) {
	let heading;
	let t0;
	let div2;
	let div1;
	let img;
	let img_src_value;
	let t1;
	let div0;
	let current;
	let mounted;
	let dispose;

	heading = new Heading({
			props: { force: "true", item: /*item*/ ctx[0] },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(heading.$$.fragment);
			t0 = space();
			div2 = element("div");
			div1 = element("div");
			img = element("img");
			t1 = space();
			div0 = element("div");
			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[0].cover.w1280)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "affiche du film");
			attr_dev(img, "class", "");
			add_location(img, file$3, 15, 8, 420);
			attr_dev(div0, "class", "blured");
			add_location(div0, file$3, 16, 8, 502);
			attr_dev(div1, "class", "background-picture position-relative");
			add_location(div1, file$3, 14, 4, 360);
			attr_dev(div2, "class", "cover");
			add_location(div2, file$3, 13, 0, 335);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(heading, target, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, div2, anchor);
			append_dev(div2, div1);
			append_dev(div1, img);
			append_dev(div1, t1);
			append_dev(div1, div0);
			current = true;

			if (!mounted) {
				dispose = action_destroyer(/*onload*/ ctx[1].call(null, img));
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			const heading_changes = {};
			if (dirty & /*item*/ 1) heading_changes.item = /*item*/ ctx[0];
			heading.$set(heading_changes);

			if (!current || dirty & /*item*/ 1 && !src_url_equal(img.src, img_src_value = /*item*/ ctx[0].cover.w1280)) {
				attr_dev(img, "src", img_src_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(heading.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(heading.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(heading, detaching);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(div2);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$4.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$4($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Cover', slots, []);
	let { item = {} } = $$props;
	const { onload } = createResourceLoader(noop$1);
	const writable_props = ['item'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Cover> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('item' in $$props) $$invalidate(0, item = $$props.item);
	};

	$$self.$capture_state = () => ({
		noop: noop$1,
		createResourceLoader,
		loading,
		Heading,
		item,
		onload
	});

	$$self.$inject_state = $$props => {
		if ('item' in $$props) $$invalidate(0, item = $$props.item);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [item, onload];
}

class Cover extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$4, create_fragment$4, safe_not_equal, { item: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Cover",
			options,
			id: create_fragment$4.name
		});
	}

	get item() {
		return this.$$.ctx[0];
	}

	set item(item) {
		this.$$set({ item });
		flush();
	}
}

/**
 * SSR Window 4.0.2
 * Better handling for window object in SSR environment
 * https://github.com/nolimits4web/ssr-window
 *
 * Copyright 2021, Vladimir Kharlampidi
 *
 * Licensed under MIT
 *
 * Released on: December 13, 2021
 */
/* eslint-disable no-param-reassign */
function isObject$1(obj) {
    return (obj !== null &&
        typeof obj === 'object' &&
        'constructor' in obj &&
        obj.constructor === Object);
}
function extend$1(target = {}, src = {}) {
    Object.keys(src).forEach((key) => {
        if (typeof target[key] === 'undefined')
            target[key] = src[key];
        else if (isObject$1(src[key]) &&
            isObject$1(target[key]) &&
            Object.keys(src[key]).length > 0) {
            extend$1(target[key], src[key]);
        }
    });
}

const ssrDocument = {
    body: {},
    addEventListener() { },
    removeEventListener() { },
    activeElement: {
        blur() { },
        nodeName: '',
    },
    querySelector() {
        return null;
    },
    querySelectorAll() {
        return [];
    },
    getElementById() {
        return null;
    },
    createEvent() {
        return {
            initEvent() { },
        };
    },
    createElement() {
        return {
            children: [],
            childNodes: [],
            style: {},
            setAttribute() { },
            getElementsByTagName() {
                return [];
            },
        };
    },
    createElementNS() {
        return {};
    },
    importNode() {
        return null;
    },
    location: {
        hash: '',
        host: '',
        hostname: '',
        href: '',
        origin: '',
        pathname: '',
        protocol: '',
        search: '',
    },
};
function getDocument() {
    const doc = typeof document !== 'undefined' ? document : {};
    extend$1(doc, ssrDocument);
    return doc;
}

const ssrWindow = {
    document: ssrDocument,
    navigator: {
        userAgent: '',
    },
    location: {
        hash: '',
        host: '',
        hostname: '',
        href: '',
        origin: '',
        pathname: '',
        protocol: '',
        search: '',
    },
    history: {
        replaceState() { },
        pushState() { },
        go() { },
        back() { },
    },
    CustomEvent: function CustomEvent() {
        return this;
    },
    addEventListener() { },
    removeEventListener() { },
    getComputedStyle() {
        return {
            getPropertyValue() {
                return '';
            },
        };
    },
    Image() { },
    Date() { },
    screen: {},
    setTimeout() { },
    clearTimeout() { },
    matchMedia() {
        return {};
    },
    requestAnimationFrame(callback) {
        if (typeof setTimeout === 'undefined') {
            callback();
            return null;
        }
        return setTimeout(callback, 0);
    },
    cancelAnimationFrame(id) {
        if (typeof setTimeout === 'undefined') {
            return;
        }
        clearTimeout(id);
    },
};
function getWindow() {
    const win = typeof window !== 'undefined' ? window : {};
    extend$1(win, ssrWindow);
    return win;
}

function deleteProps(obj) {
  const object = obj;
  Object.keys(object).forEach(key => {
    try {
      object[key] = null;
    } catch (e) {
      // no getter for object
    }
    try {
      delete object[key];
    } catch (e) {
      // something got wrong
    }
  });
}
function nextTick(callback, delay = 0) {
  return setTimeout(callback, delay);
}
function now() {
  return Date.now();
}
function getComputedStyle$1(el) {
  const window = getWindow();
  let style;
  if (window.getComputedStyle) {
    style = window.getComputedStyle(el, null);
  }
  if (!style && el.currentStyle) {
    style = el.currentStyle;
  }
  if (!style) {
    style = el.style;
  }
  return style;
}
function getTranslate(el, axis = 'x') {
  const window = getWindow();
  let matrix;
  let curTransform;
  let transformMatrix;
  const curStyle = getComputedStyle$1(el);
  if (window.WebKitCSSMatrix) {
    curTransform = curStyle.transform || curStyle.webkitTransform;
    if (curTransform.split(',').length > 6) {
      curTransform = curTransform.split(', ').map(a => a.replace(',', '.')).join(', ');
    }
    // Some old versions of Webkit choke when 'none' is passed; pass
    // empty string instead in this case
    transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
  } else {
    transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
    matrix = transformMatrix.toString().split(',');
  }
  if (axis === 'x') {
    // Latest Chrome and webkits Fix
    if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41;
    // Crazy IE10 Matrix
    else if (matrix.length === 16) curTransform = parseFloat(matrix[12]);
    // Normal Browsers
    else curTransform = parseFloat(matrix[4]);
  }
  if (axis === 'y') {
    // Latest Chrome and webkits Fix
    if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42;
    // Crazy IE10 Matrix
    else if (matrix.length === 16) curTransform = parseFloat(matrix[13]);
    // Normal Browsers
    else curTransform = parseFloat(matrix[5]);
  }
  return curTransform || 0;
}
function isObject(o) {
  return typeof o === 'object' && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === 'Object';
}
function isNode(node) {
  // eslint-disable-next-line
  if (typeof window !== 'undefined' && typeof window.HTMLElement !== 'undefined') {
    return node instanceof HTMLElement;
  }
  return node && (node.nodeType === 1 || node.nodeType === 11);
}
function extend(...args) {
  const to = Object(args[0]);
  const noExtend = ['__proto__', 'constructor', 'prototype'];
  for (let i = 1; i < args.length; i += 1) {
    const nextSource = args[i];
    if (nextSource !== undefined && nextSource !== null && !isNode(nextSource)) {
      const keysArray = Object.keys(Object(nextSource)).filter(key => noExtend.indexOf(key) < 0);
      for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
        const nextKey = keysArray[nextIndex];
        const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
        if (desc !== undefined && desc.enumerable) {
          if (isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend(to[nextKey], nextSource[nextKey]);
            }
          } else if (!isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
            to[nextKey] = {};
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend(to[nextKey], nextSource[nextKey]);
            }
          } else {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
  }
  return to;
}
function setCSSProperty(el, varName, varValue) {
  el.style.setProperty(varName, varValue);
}
function animateCSSModeScroll({
  swiper,
  targetPosition,
  side
}) {
  const window = getWindow();
  const startPosition = -swiper.translate;
  let startTime = null;
  let time;
  const duration = swiper.params.speed;
  swiper.wrapperEl.style.scrollSnapType = 'none';
  window.cancelAnimationFrame(swiper.cssModeFrameID);
  const dir = targetPosition > startPosition ? 'next' : 'prev';
  const isOutOfBound = (current, target) => {
    return dir === 'next' && current >= target || dir === 'prev' && current <= target;
  };
  const animate = () => {
    time = new Date().getTime();
    if (startTime === null) {
      startTime = time;
    }
    const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
    const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
    let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
    if (isOutOfBound(currentPosition, targetPosition)) {
      currentPosition = targetPosition;
    }
    swiper.wrapperEl.scrollTo({
      [side]: currentPosition
    });
    if (isOutOfBound(currentPosition, targetPosition)) {
      swiper.wrapperEl.style.overflow = 'hidden';
      swiper.wrapperEl.style.scrollSnapType = '';
      setTimeout(() => {
        swiper.wrapperEl.style.overflow = '';
        swiper.wrapperEl.scrollTo({
          [side]: currentPosition
        });
      });
      window.cancelAnimationFrame(swiper.cssModeFrameID);
      return;
    }
    swiper.cssModeFrameID = window.requestAnimationFrame(animate);
  };
  animate();
}
function elementChildren(element, selector = '') {
  return [...element.children].filter(el => el.matches(selector));
}
function createElement(tag, classes = []) {
  const el = document.createElement(tag);
  el.classList.add(...(Array.isArray(classes) ? classes : [classes]));
  return el;
}
function elementPrevAll(el, selector) {
  const prevEls = [];
  while (el.previousElementSibling) {
    const prev = el.previousElementSibling; // eslint-disable-line
    if (selector) {
      if (prev.matches(selector)) prevEls.push(prev);
    } else prevEls.push(prev);
    el = prev;
  }
  return prevEls;
}
function elementNextAll(el, selector) {
  const nextEls = [];
  while (el.nextElementSibling) {
    const next = el.nextElementSibling; // eslint-disable-line
    if (selector) {
      if (next.matches(selector)) nextEls.push(next);
    } else nextEls.push(next);
    el = next;
  }
  return nextEls;
}
function elementStyle(el, prop) {
  const window = getWindow();
  return window.getComputedStyle(el, null).getPropertyValue(prop);
}
function elementIndex(el) {
  let child = el;
  let i;
  if (child) {
    i = 0;
    // eslint-disable-next-line
    while ((child = child.previousSibling) !== null) {
      if (child.nodeType === 1) i += 1;
    }
    return i;
  }
  return undefined;
}
function elementParents(el, selector) {
  const parents = []; // eslint-disable-line
  let parent = el.parentElement; // eslint-disable-line
  while (parent) {
    if (selector) {
      if (parent.matches(selector)) parents.push(parent);
    } else {
      parents.push(parent);
    }
    parent = parent.parentElement;
  }
  return parents;
}
function elementTransitionEnd(el, callback) {
  function fireCallBack(e) {
    if (e.target !== el) return;
    callback.call(el, e);
    el.removeEventListener('transitionend', fireCallBack);
  }
  if (callback) {
    el.addEventListener('transitionend', fireCallBack);
  }
}
function elementOuterSize(el, size, includeMargins) {
  const window = getWindow();
  if (includeMargins) {
    return el[size === 'width' ? 'offsetWidth' : 'offsetHeight'] + parseFloat(window.getComputedStyle(el, null).getPropertyValue(size === 'width' ? 'margin-right' : 'margin-top')) + parseFloat(window.getComputedStyle(el, null).getPropertyValue(size === 'width' ? 'margin-left' : 'margin-bottom'));
  }
  return el.offsetWidth;
}

let support;
function calcSupport() {
  const window = getWindow();
  const document = getDocument();
  return {
    smoothScroll: document.documentElement && document.documentElement.style && 'scrollBehavior' in document.documentElement.style,
    touch: !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch)
  };
}
function getSupport() {
  if (!support) {
    support = calcSupport();
  }
  return support;
}

let deviceCached;
function calcDevice({
  userAgent
} = {}) {
  const support = getSupport();
  const window = getWindow();
  const platform = window.navigator.platform;
  const ua = userAgent || window.navigator.userAgent;
  const device = {
    ios: false,
    android: false
  };
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line
  let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
  const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
  const windows = platform === 'Win32';
  let macos = platform === 'MacIntel';

  // iPadOs 13 fix
  const iPadScreens = ['1024x1366', '1366x1024', '834x1194', '1194x834', '834x1112', '1112x834', '768x1024', '1024x768', '820x1180', '1180x820', '810x1080', '1080x810'];
  if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
    ipad = ua.match(/(Version)\/([\d.]+)/);
    if (!ipad) ipad = [0, 1, '13_0_0'];
    macos = false;
  }

  // Android
  if (android && !windows) {
    device.os = 'android';
    device.android = true;
  }
  if (ipad || iphone || ipod) {
    device.os = 'ios';
    device.ios = true;
  }

  // Export object
  return device;
}
function getDevice(overrides = {}) {
  if (!deviceCached) {
    deviceCached = calcDevice(overrides);
  }
  return deviceCached;
}

let browser;
function calcBrowser() {
  const window = getWindow();
  let needPerspectiveFix = false;
  function isSafari() {
    const ua = window.navigator.userAgent.toLowerCase();
    return ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0;
  }
  if (isSafari()) {
    const ua = String(window.navigator.userAgent);
    if (ua.includes('Version/')) {
      const [major, minor] = ua.split('Version/')[1].split(' ')[0].split('.').map(num => Number(num));
      needPerspectiveFix = major < 16 || major === 16 && minor < 2;
    }
  }
  return {
    isSafari: needPerspectiveFix || isSafari(),
    needPerspectiveFix,
    isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
  };
}
function getBrowser() {
  if (!browser) {
    browser = calcBrowser();
  }
  return browser;
}

function Resize({
  swiper,
  on,
  emit
}) {
  const window = getWindow();
  let observer = null;
  let animationFrame = null;
  const resizeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    emit('beforeResize');
    emit('resize');
  };
  const createObserver = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    observer = new ResizeObserver(entries => {
      animationFrame = window.requestAnimationFrame(() => {
        const {
          width,
          height
        } = swiper;
        let newWidth = width;
        let newHeight = height;
        entries.forEach(({
          contentBoxSize,
          contentRect,
          target
        }) => {
          if (target && target !== swiper.el) return;
          newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
          newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
        });
        if (newWidth !== width || newHeight !== height) {
          resizeHandler();
        }
      });
    });
    observer.observe(swiper.el);
  };
  const removeObserver = () => {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
    }
    if (observer && observer.unobserve && swiper.el) {
      observer.unobserve(swiper.el);
      observer = null;
    }
  };
  const orientationChangeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    emit('orientationchange');
  };
  on('init', () => {
    if (swiper.params.resizeObserver && typeof window.ResizeObserver !== 'undefined') {
      createObserver();
      return;
    }
    window.addEventListener('resize', resizeHandler);
    window.addEventListener('orientationchange', orientationChangeHandler);
  });
  on('destroy', () => {
    removeObserver();
    window.removeEventListener('resize', resizeHandler);
    window.removeEventListener('orientationchange', orientationChangeHandler);
  });
}

function Observer({
  swiper,
  extendParams,
  on,
  emit
}) {
  const observers = [];
  const window = getWindow();
  const attach = (target, options = {}) => {
    const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
    const observer = new ObserverFunc(mutations => {
      // The observerUpdate event should only be triggered
      // once despite the number of mutations.  Additional
      // triggers are redundant and are very costly
      if (swiper.__preventObserver__) return;
      if (mutations.length === 1) {
        emit('observerUpdate', mutations[0]);
        return;
      }
      const observerUpdate = function observerUpdate() {
        emit('observerUpdate', mutations[0]);
      };
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(observerUpdate);
      } else {
        window.setTimeout(observerUpdate, 0);
      }
    });
    observer.observe(target, {
      attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
      childList: typeof options.childList === 'undefined' ? true : options.childList,
      characterData: typeof options.characterData === 'undefined' ? true : options.characterData
    });
    observers.push(observer);
  };
  const init = () => {
    if (!swiper.params.observer) return;
    if (swiper.params.observeParents) {
      const containerParents = elementParents(swiper.el);
      for (let i = 0; i < containerParents.length; i += 1) {
        attach(containerParents[i]);
      }
    }
    // Observe container
    attach(swiper.el, {
      childList: swiper.params.observeSlideChildren
    });

    // Observe wrapper
    attach(swiper.wrapperEl, {
      attributes: false
    });
  };
  const destroy = () => {
    observers.forEach(observer => {
      observer.disconnect();
    });
    observers.splice(0, observers.length);
  };
  extendParams({
    observer: false,
    observeParents: false,
    observeSlideChildren: false
  });
  on('init', init);
  on('destroy', destroy);
}

/* eslint-disable no-underscore-dangle */

var eventsEmitter = {
  on(events, handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (typeof handler !== 'function') return self;
    const method = priority ? 'unshift' : 'push';
    events.split(' ').forEach(event => {
      if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
      self.eventsListeners[event][method](handler);
    });
    return self;
  },
  once(events, handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (typeof handler !== 'function') return self;
    function onceHandler(...args) {
      self.off(events, onceHandler);
      if (onceHandler.__emitterProxy) {
        delete onceHandler.__emitterProxy;
      }
      handler.apply(self, args);
    }
    onceHandler.__emitterProxy = handler;
    return self.on(events, onceHandler, priority);
  },
  onAny(handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (typeof handler !== 'function') return self;
    const method = priority ? 'unshift' : 'push';
    if (self.eventsAnyListeners.indexOf(handler) < 0) {
      self.eventsAnyListeners[method](handler);
    }
    return self;
  },
  offAny(handler) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (!self.eventsAnyListeners) return self;
    const index = self.eventsAnyListeners.indexOf(handler);
    if (index >= 0) {
      self.eventsAnyListeners.splice(index, 1);
    }
    return self;
  },
  off(events, handler) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (!self.eventsListeners) return self;
    events.split(' ').forEach(event => {
      if (typeof handler === 'undefined') {
        self.eventsListeners[event] = [];
      } else if (self.eventsListeners[event]) {
        self.eventsListeners[event].forEach((eventHandler, index) => {
          if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
            self.eventsListeners[event].splice(index, 1);
          }
        });
      }
    });
    return self;
  },
  emit(...args) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (!self.eventsListeners) return self;
    let events;
    let data;
    let context;
    if (typeof args[0] === 'string' || Array.isArray(args[0])) {
      events = args[0];
      data = args.slice(1, args.length);
      context = self;
    } else {
      events = args[0].events;
      data = args[0].data;
      context = args[0].context || self;
    }
    data.unshift(context);
    const eventsArray = Array.isArray(events) ? events : events.split(' ');
    eventsArray.forEach(event => {
      if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
        self.eventsAnyListeners.forEach(eventHandler => {
          eventHandler.apply(context, [event, ...data]);
        });
      }
      if (self.eventsListeners && self.eventsListeners[event]) {
        self.eventsListeners[event].forEach(eventHandler => {
          eventHandler.apply(context, data);
        });
      }
    });
    return self;
  }
};

function updateSize() {
  const swiper = this;
  let width;
  let height;
  const el = swiper.el;
  if (typeof swiper.params.width !== 'undefined' && swiper.params.width !== null) {
    width = swiper.params.width;
  } else {
    width = el.clientWidth;
  }
  if (typeof swiper.params.height !== 'undefined' && swiper.params.height !== null) {
    height = swiper.params.height;
  } else {
    height = el.clientHeight;
  }
  if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
    return;
  }

  // Subtract paddings
  width = width - parseInt(elementStyle(el, 'padding-left') || 0, 10) - parseInt(elementStyle(el, 'padding-right') || 0, 10);
  height = height - parseInt(elementStyle(el, 'padding-top') || 0, 10) - parseInt(elementStyle(el, 'padding-bottom') || 0, 10);
  if (Number.isNaN(width)) width = 0;
  if (Number.isNaN(height)) height = 0;
  Object.assign(swiper, {
    width,
    height,
    size: swiper.isHorizontal() ? width : height
  });
}

function updateSlides() {
  const swiper = this;
  function getDirectionLabel(property) {
    if (swiper.isHorizontal()) {
      return property;
    }
    // prettier-ignore
    return {
      'width': 'height',
      'margin-top': 'margin-left',
      'margin-bottom ': 'margin-right',
      'margin-left': 'margin-top',
      'margin-right': 'margin-bottom',
      'padding-left': 'padding-top',
      'padding-right': 'padding-bottom',
      'marginRight': 'marginBottom'
    }[property];
  }
  function getDirectionPropertyValue(node, label) {
    return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
  }
  const params = swiper.params;
  const {
    wrapperEl,
    slidesEl,
    size: swiperSize,
    rtlTranslate: rtl,
    wrongRTL
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
  const slides = elementChildren(slidesEl, `.${swiper.params.slideClass}, swiper-slide`);
  const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
  let snapGrid = [];
  const slidesGrid = [];
  const slidesSizesGrid = [];
  let offsetBefore = params.slidesOffsetBefore;
  if (typeof offsetBefore === 'function') {
    offsetBefore = params.slidesOffsetBefore.call(swiper);
  }
  let offsetAfter = params.slidesOffsetAfter;
  if (typeof offsetAfter === 'function') {
    offsetAfter = params.slidesOffsetAfter.call(swiper);
  }
  const previousSnapGridLength = swiper.snapGrid.length;
  const previousSlidesGridLength = swiper.slidesGrid.length;
  let spaceBetween = params.spaceBetween;
  let slidePosition = -offsetBefore;
  let prevSlideSize = 0;
  let index = 0;
  if (typeof swiperSize === 'undefined') {
    return;
  }
  if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
    spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * swiperSize;
  } else if (typeof spaceBetween === 'string') {
    spaceBetween = parseFloat(spaceBetween);
  }
  swiper.virtualSize = -spaceBetween;

  // reset margins
  slides.forEach(slideEl => {
    if (rtl) {
      slideEl.style.marginLeft = '';
    } else {
      slideEl.style.marginRight = '';
    }
    slideEl.style.marginBottom = '';
    slideEl.style.marginTop = '';
  });

  // reset cssMode offsets
  if (params.centeredSlides && params.cssMode) {
    setCSSProperty(wrapperEl, '--swiper-centered-offset-before', '');
    setCSSProperty(wrapperEl, '--swiper-centered-offset-after', '');
  }
  const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
  if (gridEnabled) {
    swiper.grid.initSlides(slidesLength);
  }

  // Calc slides
  let slideSize;
  const shouldResetSlideSize = params.slidesPerView === 'auto' && params.breakpoints && Object.keys(params.breakpoints).filter(key => {
    return typeof params.breakpoints[key].slidesPerView !== 'undefined';
  }).length > 0;
  for (let i = 0; i < slidesLength; i += 1) {
    slideSize = 0;
    let slide;
    if (slides[i]) slide = slides[i];
    if (gridEnabled) {
      swiper.grid.updateSlide(i, slide, slidesLength, getDirectionLabel);
    }
    if (slides[i] && elementStyle(slide, 'display') === 'none') continue; // eslint-disable-line

    if (params.slidesPerView === 'auto') {
      if (shouldResetSlideSize) {
        slides[i].style[getDirectionLabel('width')] = ``;
      }
      const slideStyles = getComputedStyle(slide);
      const currentTransform = slide.style.transform;
      const currentWebKitTransform = slide.style.webkitTransform;
      if (currentTransform) {
        slide.style.transform = 'none';
      }
      if (currentWebKitTransform) {
        slide.style.webkitTransform = 'none';
      }
      if (params.roundLengths) {
        slideSize = swiper.isHorizontal() ? elementOuterSize(slide, 'width', true) : elementOuterSize(slide, 'height', true);
      } else {
        // eslint-disable-next-line
        const width = getDirectionPropertyValue(slideStyles, 'width');
        const paddingLeft = getDirectionPropertyValue(slideStyles, 'padding-left');
        const paddingRight = getDirectionPropertyValue(slideStyles, 'padding-right');
        const marginLeft = getDirectionPropertyValue(slideStyles, 'margin-left');
        const marginRight = getDirectionPropertyValue(slideStyles, 'margin-right');
        const boxSizing = slideStyles.getPropertyValue('box-sizing');
        if (boxSizing && boxSizing === 'border-box') {
          slideSize = width + marginLeft + marginRight;
        } else {
          const {
            clientWidth,
            offsetWidth
          } = slide;
          slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
        }
      }
      if (currentTransform) {
        slide.style.transform = currentTransform;
      }
      if (currentWebKitTransform) {
        slide.style.webkitTransform = currentWebKitTransform;
      }
      if (params.roundLengths) slideSize = Math.floor(slideSize);
    } else {
      slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
      if (params.roundLengths) slideSize = Math.floor(slideSize);
      if (slides[i]) {
        slides[i].style[getDirectionLabel('width')] = `${slideSize}px`;
      }
    }
    if (slides[i]) {
      slides[i].swiperSlideSize = slideSize;
    }
    slidesSizesGrid.push(slideSize);
    if (params.centeredSlides) {
      slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
      if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
      if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
    } else {
      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
      if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
      slidePosition = slidePosition + slideSize + spaceBetween;
    }
    swiper.virtualSize += slideSize + spaceBetween;
    prevSlideSize = slideSize;
    index += 1;
  }
  swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
  if (rtl && wrongRTL && (params.effect === 'slide' || params.effect === 'coverflow')) {
    wrapperEl.style.width = `${swiper.virtualSize + spaceBetween}px`;
  }
  if (params.setWrapperSize) {
    wrapperEl.style[getDirectionLabel('width')] = `${swiper.virtualSize + spaceBetween}px`;
  }
  if (gridEnabled) {
    swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
  }

  // Remove last grid elements depending on width
  if (!params.centeredSlides) {
    const newSlidesGrid = [];
    for (let i = 0; i < snapGrid.length; i += 1) {
      let slidesGridItem = snapGrid[i];
      if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
      if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
        newSlidesGrid.push(slidesGridItem);
      }
    }
    snapGrid = newSlidesGrid;
    if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
      snapGrid.push(swiper.virtualSize - swiperSize);
    }
  }
  if (isVirtual && params.loop) {
    const size = slidesSizesGrid[0] + spaceBetween;
    if (params.slidesPerGroup > 1) {
      const groups = Math.ceil((swiper.virtual.slidesBefore + swiper.virtual.slidesAfter) / params.slidesPerGroup);
      const groupSize = size * params.slidesPerGroup;
      for (let i = 0; i < groups; i += 1) {
        snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
      }
    }
    for (let i = 0; i < swiper.virtual.slidesBefore + swiper.virtual.slidesAfter; i += 1) {
      if (params.slidesPerGroup === 1) {
        snapGrid.push(snapGrid[snapGrid.length - 1] + size);
      }
      slidesGrid.push(slidesGrid[slidesGrid.length - 1] + size);
      swiper.virtualSize += size;
    }
  }
  if (snapGrid.length === 0) snapGrid = [0];
  if (spaceBetween !== 0) {
    const key = swiper.isHorizontal() && rtl ? 'marginLeft' : getDirectionLabel('marginRight');
    slides.filter((_, slideIndex) => {
      if (!params.cssMode || params.loop) return true;
      if (slideIndex === slides.length - 1) {
        return false;
      }
      return true;
    }).forEach(slideEl => {
      slideEl.style[key] = `${spaceBetween}px`;
    });
  }
  if (params.centeredSlides && params.centeredSlidesBounds) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach(slideSizeValue => {
      allSlidesSize += slideSizeValue + (spaceBetween || 0);
    });
    allSlidesSize -= spaceBetween;
    const maxSnap = allSlidesSize - swiperSize;
    snapGrid = snapGrid.map(snap => {
      if (snap <= 0) return -offsetBefore;
      if (snap > maxSnap) return maxSnap + offsetAfter;
      return snap;
    });
  }
  if (params.centerInsufficientSlides) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach(slideSizeValue => {
      allSlidesSize += slideSizeValue + (spaceBetween || 0);
    });
    allSlidesSize -= spaceBetween;
    if (allSlidesSize < swiperSize) {
      const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
      snapGrid.forEach((snap, snapIndex) => {
        snapGrid[snapIndex] = snap - allSlidesOffset;
      });
      slidesGrid.forEach((snap, snapIndex) => {
        slidesGrid[snapIndex] = snap + allSlidesOffset;
      });
    }
  }
  Object.assign(swiper, {
    slides,
    snapGrid,
    slidesGrid,
    slidesSizesGrid
  });
  if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
    setCSSProperty(wrapperEl, '--swiper-centered-offset-before', `${-snapGrid[0]}px`);
    setCSSProperty(wrapperEl, '--swiper-centered-offset-after', `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
    const addToSnapGrid = -swiper.snapGrid[0];
    const addToSlidesGrid = -swiper.slidesGrid[0];
    swiper.snapGrid = swiper.snapGrid.map(v => v + addToSnapGrid);
    swiper.slidesGrid = swiper.slidesGrid.map(v => v + addToSlidesGrid);
  }
  if (slidesLength !== previousSlidesLength) {
    swiper.emit('slidesLengthChange');
  }
  if (snapGrid.length !== previousSnapGridLength) {
    if (swiper.params.watchOverflow) swiper.checkOverflow();
    swiper.emit('snapGridLengthChange');
  }
  if (slidesGrid.length !== previousSlidesGridLength) {
    swiper.emit('slidesGridLengthChange');
  }
  if (params.watchSlidesProgress) {
    swiper.updateSlidesOffset();
  }
  if (!isVirtual && !params.cssMode && (params.effect === 'slide' || params.effect === 'fade')) {
    const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
    const hasClassBackfaceClassAdded = swiper.el.classList.contains(backFaceHiddenClass);
    if (slidesLength <= params.maxBackfaceHiddenSlides) {
      if (!hasClassBackfaceClassAdded) swiper.el.classList.add(backFaceHiddenClass);
    } else if (hasClassBackfaceClassAdded) {
      swiper.el.classList.remove(backFaceHiddenClass);
    }
  }
}

function updateAutoHeight(speed) {
  const swiper = this;
  const activeSlides = [];
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
  let newHeight = 0;
  let i;
  if (typeof speed === 'number') {
    swiper.setTransition(speed);
  } else if (speed === true) {
    swiper.setTransition(swiper.params.speed);
  }
  const getSlideByIndex = index => {
    if (isVirtual) {
      return swiper.slides[swiper.getSlideIndexByData(index)];
    }
    return swiper.slides[index];
  };
  // Find slides currently in view
  if (swiper.params.slidesPerView !== 'auto' && swiper.params.slidesPerView > 1) {
    if (swiper.params.centeredSlides) {
      (swiper.visibleSlides || []).forEach(slide => {
        activeSlides.push(slide);
      });
    } else {
      for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
        const index = swiper.activeIndex + i;
        if (index > swiper.slides.length && !isVirtual) break;
        activeSlides.push(getSlideByIndex(index));
      }
    }
  } else {
    activeSlides.push(getSlideByIndex(swiper.activeIndex));
  }

  // Find new height from highest slide in view
  for (i = 0; i < activeSlides.length; i += 1) {
    if (typeof activeSlides[i] !== 'undefined') {
      const height = activeSlides[i].offsetHeight;
      newHeight = height > newHeight ? height : newHeight;
    }
  }

  // Update Height
  if (newHeight || newHeight === 0) swiper.wrapperEl.style.height = `${newHeight}px`;
}

function updateSlidesOffset() {
  const swiper = this;
  const slides = swiper.slides;
  // eslint-disable-next-line
  const minusOffset = swiper.isElement ? swiper.isHorizontal() ? swiper.wrapperEl.offsetLeft : swiper.wrapperEl.offsetTop : 0;
  for (let i = 0; i < slides.length; i += 1) {
    slides[i].swiperSlideOffset = (swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop) - minusOffset - swiper.cssOverflowAdjustment();
  }
}

function updateSlidesProgress(translate = this && this.translate || 0) {
  const swiper = this;
  const params = swiper.params;
  const {
    slides,
    rtlTranslate: rtl,
    snapGrid
  } = swiper;
  if (slides.length === 0) return;
  if (typeof slides[0].swiperSlideOffset === 'undefined') swiper.updateSlidesOffset();
  let offsetCenter = -translate;
  if (rtl) offsetCenter = translate;

  // Visible Slides
  slides.forEach(slideEl => {
    slideEl.classList.remove(params.slideVisibleClass);
  });
  swiper.visibleSlidesIndexes = [];
  swiper.visibleSlides = [];
  let spaceBetween = params.spaceBetween;
  if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
    spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * swiper.size;
  } else if (typeof spaceBetween === 'string') {
    spaceBetween = parseFloat(spaceBetween);
  }
  for (let i = 0; i < slides.length; i += 1) {
    const slide = slides[i];
    let slideOffset = slide.swiperSlideOffset;
    if (params.cssMode && params.centeredSlides) {
      slideOffset -= slides[0].swiperSlideOffset;
    }
    const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + spaceBetween);
    const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + spaceBetween);
    const slideBefore = -(offsetCenter - slideOffset);
    const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
    const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
    if (isVisible) {
      swiper.visibleSlides.push(slide);
      swiper.visibleSlidesIndexes.push(i);
      slides[i].classList.add(params.slideVisibleClass);
    }
    slide.progress = rtl ? -slideProgress : slideProgress;
    slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
  }
}

function updateProgress(translate) {
  const swiper = this;
  if (typeof translate === 'undefined') {
    const multiplier = swiper.rtlTranslate ? -1 : 1;
    // eslint-disable-next-line
    translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
  }
  const params = swiper.params;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  let {
    progress,
    isBeginning,
    isEnd,
    progressLoop
  } = swiper;
  const wasBeginning = isBeginning;
  const wasEnd = isEnd;
  if (translatesDiff === 0) {
    progress = 0;
    isBeginning = true;
    isEnd = true;
  } else {
    progress = (translate - swiper.minTranslate()) / translatesDiff;
    const isBeginningRounded = Math.abs(translate - swiper.minTranslate()) < 1;
    const isEndRounded = Math.abs(translate - swiper.maxTranslate()) < 1;
    isBeginning = isBeginningRounded || progress <= 0;
    isEnd = isEndRounded || progress >= 1;
    if (isBeginningRounded) progress = 0;
    if (isEndRounded) progress = 1;
  }
  if (params.loop) {
    const firstSlideIndex = swiper.getSlideIndexByData(0);
    const lastSlideIndex = swiper.getSlideIndexByData(swiper.slides.length - 1);
    const firstSlideTranslate = swiper.slidesGrid[firstSlideIndex];
    const lastSlideTranslate = swiper.slidesGrid[lastSlideIndex];
    const translateMax = swiper.slidesGrid[swiper.slidesGrid.length - 1];
    const translateAbs = Math.abs(translate);
    if (translateAbs >= firstSlideTranslate) {
      progressLoop = (translateAbs - firstSlideTranslate) / translateMax;
    } else {
      progressLoop = (translateAbs + translateMax - lastSlideTranslate) / translateMax;
    }
    if (progressLoop > 1) progressLoop -= 1;
  }
  Object.assign(swiper, {
    progress,
    progressLoop,
    isBeginning,
    isEnd
  });
  if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);
  if (isBeginning && !wasBeginning) {
    swiper.emit('reachBeginning toEdge');
  }
  if (isEnd && !wasEnd) {
    swiper.emit('reachEnd toEdge');
  }
  if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
    swiper.emit('fromEdge');
  }
  swiper.emit('progress', progress);
}

function updateSlidesClasses() {
  const swiper = this;
  const {
    slides,
    params,
    slidesEl,
    activeIndex
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  const getFilteredSlide = selector => {
    return elementChildren(slidesEl, `.${params.slideClass}${selector}, swiper-slide${selector}`)[0];
  };
  slides.forEach(slideEl => {
    slideEl.classList.remove(params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
  });
  let activeSlide;
  if (isVirtual) {
    if (params.loop) {
      let slideIndex = activeIndex - swiper.virtual.slidesBefore;
      if (slideIndex < 0) slideIndex = swiper.virtual.slides.length + slideIndex;
      if (slideIndex >= swiper.virtual.slides.length) slideIndex -= swiper.virtual.slides.length;
      activeSlide = getFilteredSlide(`[data-swiper-slide-index="${slideIndex}"]`);
    } else {
      activeSlide = getFilteredSlide(`[data-swiper-slide-index="${activeIndex}"]`);
    }
  } else {
    activeSlide = slides[activeIndex];
  }
  if (activeSlide) {
    // Active classes
    activeSlide.classList.add(params.slideActiveClass);

    // Next Slide
    let nextSlide = elementNextAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
    if (params.loop && !nextSlide) {
      nextSlide = slides[0];
    }
    if (nextSlide) {
      nextSlide.classList.add(params.slideNextClass);
    }
    // Prev Slide
    let prevSlide = elementPrevAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
    if (params.loop && !prevSlide === 0) {
      prevSlide = slides[slides.length - 1];
    }
    if (prevSlide) {
      prevSlide.classList.add(params.slidePrevClass);
    }
  }
  swiper.emitSlidesClasses();
}

const processLazyPreloader = (swiper, imageEl) => {
  if (!swiper || swiper.destroyed || !swiper.params) return;
  const slideSelector = () => swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
  const slideEl = imageEl.closest(slideSelector());
  if (slideEl) {
    const lazyEl = slideEl.querySelector(`.${swiper.params.lazyPreloaderClass}`);
    if (lazyEl) lazyEl.remove();
  }
};
const unlazy = (swiper, index) => {
  if (!swiper.slides[index]) return;
  const imageEl = swiper.slides[index].querySelector('[loading="lazy"]');
  if (imageEl) imageEl.removeAttribute('loading');
};
const preload = swiper => {
  if (!swiper || swiper.destroyed || !swiper.params) return;
  let amount = swiper.params.lazyPreloadPrevNext;
  const len = swiper.slides.length;
  if (!len || !amount || amount < 0) return;
  amount = Math.min(amount, len);
  const slidesPerView = swiper.params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : Math.ceil(swiper.params.slidesPerView);
  const activeIndex = swiper.activeIndex;
  if (swiper.params.grid && swiper.params.grid.rows > 1) {
    const activeColumn = activeIndex;
    const preloadColumns = [activeColumn - amount];
    preloadColumns.push(...Array.from({
      length: amount
    }).map((_, i) => {
      return activeColumn + slidesPerView + i;
    }));
    swiper.slides.forEach((slideEl, i) => {
      if (preloadColumns.includes(slideEl.column)) unlazy(swiper, i);
    });
    return;
  }
  const slideIndexLastInView = activeIndex + slidesPerView - 1;
  if (swiper.params.rewind || swiper.params.loop) {
    for (let i = activeIndex - amount; i <= slideIndexLastInView + amount; i += 1) {
      const realIndex = (i % len + len) % len;
      if (realIndex < activeIndex || realIndex > slideIndexLastInView) unlazy(swiper, realIndex);
    }
  } else {
    for (let i = Math.max(activeIndex - amount, 0); i <= Math.min(slideIndexLastInView + amount, len - 1); i += 1) {
      if (i !== activeIndex && (i > slideIndexLastInView || i < activeIndex)) {
        unlazy(swiper, i);
      }
    }
  }
};

function getActiveIndexByTranslate(swiper) {
  const {
    slidesGrid,
    params
  } = swiper;
  const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  let activeIndex;
  for (let i = 0; i < slidesGrid.length; i += 1) {
    if (typeof slidesGrid[i + 1] !== 'undefined') {
      if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
        activeIndex = i;
      } else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) {
        activeIndex = i + 1;
      }
    } else if (translate >= slidesGrid[i]) {
      activeIndex = i;
    }
  }
  // Normalize slideIndex
  if (params.normalizeSlideIndex) {
    if (activeIndex < 0 || typeof activeIndex === 'undefined') activeIndex = 0;
  }
  return activeIndex;
}
function updateActiveIndex(newActiveIndex) {
  const swiper = this;
  const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  const {
    snapGrid,
    params,
    activeIndex: previousIndex,
    realIndex: previousRealIndex,
    snapIndex: previousSnapIndex
  } = swiper;
  let activeIndex = newActiveIndex;
  let snapIndex;
  const getVirtualRealIndex = aIndex => {
    let realIndex = aIndex - swiper.virtual.slidesBefore;
    if (realIndex < 0) {
      realIndex = swiper.virtual.slides.length + realIndex;
    }
    if (realIndex >= swiper.virtual.slides.length) {
      realIndex -= swiper.virtual.slides.length;
    }
    return realIndex;
  };
  if (typeof activeIndex === 'undefined') {
    activeIndex = getActiveIndexByTranslate(swiper);
  }
  if (snapGrid.indexOf(translate) >= 0) {
    snapIndex = snapGrid.indexOf(translate);
  } else {
    const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
    snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
  }
  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
  if (activeIndex === previousIndex) {
    if (snapIndex !== previousSnapIndex) {
      swiper.snapIndex = snapIndex;
      swiper.emit('snapIndexChange');
    }
    if (swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
      swiper.realIndex = getVirtualRealIndex(activeIndex);
    }
    return;
  }
  // Get real index
  let realIndex;
  if (swiper.virtual && params.virtual.enabled && params.loop) {
    realIndex = getVirtualRealIndex(activeIndex);
  } else if (swiper.slides[activeIndex]) {
    realIndex = parseInt(swiper.slides[activeIndex].getAttribute('data-swiper-slide-index') || activeIndex, 10);
  } else {
    realIndex = activeIndex;
  }
  Object.assign(swiper, {
    previousSnapIndex,
    snapIndex,
    previousRealIndex,
    realIndex,
    previousIndex,
    activeIndex
  });
  if (swiper.initialized) {
    preload(swiper);
  }
  swiper.emit('activeIndexChange');
  swiper.emit('snapIndexChange');
  if (previousRealIndex !== realIndex) {
    swiper.emit('realIndexChange');
  }
  if (swiper.initialized || swiper.params.runCallbacksOnInit) {
    swiper.emit('slideChange');
  }
}

function updateClickedSlide(e) {
  const swiper = this;
  const params = swiper.params;
  const slide = e.closest(`.${params.slideClass}, swiper-slide`);
  let slideFound = false;
  let slideIndex;
  if (slide) {
    for (let i = 0; i < swiper.slides.length; i += 1) {
      if (swiper.slides[i] === slide) {
        slideFound = true;
        slideIndex = i;
        break;
      }
    }
  }
  if (slide && slideFound) {
    swiper.clickedSlide = slide;
    if (swiper.virtual && swiper.params.virtual.enabled) {
      swiper.clickedIndex = parseInt(slide.getAttribute('data-swiper-slide-index'), 10);
    } else {
      swiper.clickedIndex = slideIndex;
    }
  } else {
    swiper.clickedSlide = undefined;
    swiper.clickedIndex = undefined;
    return;
  }
  if (params.slideToClickedSlide && swiper.clickedIndex !== undefined && swiper.clickedIndex !== swiper.activeIndex) {
    swiper.slideToClickedSlide();
  }
}

var update = {
  updateSize,
  updateSlides,
  updateAutoHeight,
  updateSlidesOffset,
  updateSlidesProgress,
  updateProgress,
  updateSlidesClasses,
  updateActiveIndex,
  updateClickedSlide
};

function getSwiperTranslate(axis = this.isHorizontal() ? 'x' : 'y') {
  const swiper = this;
  const {
    params,
    rtlTranslate: rtl,
    translate,
    wrapperEl
  } = swiper;
  if (params.virtualTranslate) {
    return rtl ? -translate : translate;
  }
  if (params.cssMode) {
    return translate;
  }
  let currentTranslate = getTranslate(wrapperEl, axis);
  currentTranslate += swiper.cssOverflowAdjustment();
  if (rtl) currentTranslate = -currentTranslate;
  return currentTranslate || 0;
}

function setTranslate(translate, byController) {
  const swiper = this;
  const {
    rtlTranslate: rtl,
    params,
    wrapperEl,
    progress
  } = swiper;
  let x = 0;
  let y = 0;
  const z = 0;
  if (swiper.isHorizontal()) {
    x = rtl ? -translate : translate;
  } else {
    y = translate;
  }
  if (params.roundLengths) {
    x = Math.floor(x);
    y = Math.floor(y);
  }
  swiper.previousTranslate = swiper.translate;
  swiper.translate = swiper.isHorizontal() ? x : y;
  if (params.cssMode) {
    wrapperEl[swiper.isHorizontal() ? 'scrollLeft' : 'scrollTop'] = swiper.isHorizontal() ? -x : -y;
  } else if (!params.virtualTranslate) {
    if (swiper.isHorizontal()) {
      x -= swiper.cssOverflowAdjustment();
    } else {
      y -= swiper.cssOverflowAdjustment();
    }
    wrapperEl.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
  }

  // Check if we need to update progress
  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (translate - swiper.minTranslate()) / translatesDiff;
  }
  if (newProgress !== progress) {
    swiper.updateProgress(translate);
  }
  swiper.emit('setTranslate', swiper.translate, byController);
}

function minTranslate() {
  return -this.snapGrid[0];
}

function maxTranslate() {
  return -this.snapGrid[this.snapGrid.length - 1];
}

function translateTo(translate = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
  const swiper = this;
  const {
    params,
    wrapperEl
  } = swiper;
  if (swiper.animating && params.preventInteractionOnTransition) {
    return false;
  }
  const minTranslate = swiper.minTranslate();
  const maxTranslate = swiper.maxTranslate();
  let newTranslate;
  if (translateBounds && translate > minTranslate) newTranslate = minTranslate;else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate;else newTranslate = translate;

  // Update progress
  swiper.updateProgress(newTranslate);
  if (params.cssMode) {
    const isH = swiper.isHorizontal();
    if (speed === 0) {
      wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -newTranslate;
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: -newTranslate,
          side: isH ? 'left' : 'top'
        });
        return true;
      }
      wrapperEl.scrollTo({
        [isH ? 'left' : 'top']: -newTranslate,
        behavior: 'smooth'
      });
    }
    return true;
  }
  if (speed === 0) {
    swiper.setTransition(0);
    swiper.setTranslate(newTranslate);
    if (runCallbacks) {
      swiper.emit('beforeTransitionStart', speed, internal);
      swiper.emit('transitionEnd');
    }
  } else {
    swiper.setTransition(speed);
    swiper.setTranslate(newTranslate);
    if (runCallbacks) {
      swiper.emit('beforeTransitionStart', speed, internal);
      swiper.emit('transitionStart');
    }
    if (!swiper.animating) {
      swiper.animating = true;
      if (!swiper.onTranslateToWrapperTransitionEnd) {
        swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
          if (!swiper || swiper.destroyed) return;
          if (e.target !== this) return;
          swiper.wrapperEl.removeEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
          swiper.onTranslateToWrapperTransitionEnd = null;
          delete swiper.onTranslateToWrapperTransitionEnd;
          if (runCallbacks) {
            swiper.emit('transitionEnd');
          }
        };
      }
      swiper.wrapperEl.addEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
    }
  }
  return true;
}

var translate = {
  getTranslate: getSwiperTranslate,
  setTranslate,
  minTranslate,
  maxTranslate,
  translateTo
};

function setTransition(duration, byController) {
  const swiper = this;
  if (!swiper.params.cssMode) {
    swiper.wrapperEl.style.transitionDuration = `${duration}ms`;
  }
  swiper.emit('setTransition', duration, byController);
}

function transitionEmit({
  swiper,
  runCallbacks,
  direction,
  step
}) {
  const {
    activeIndex,
    previousIndex
  } = swiper;
  let dir = direction;
  if (!dir) {
    if (activeIndex > previousIndex) dir = 'next';else if (activeIndex < previousIndex) dir = 'prev';else dir = 'reset';
  }
  swiper.emit(`transition${step}`);
  if (runCallbacks && activeIndex !== previousIndex) {
    if (dir === 'reset') {
      swiper.emit(`slideResetTransition${step}`);
      return;
    }
    swiper.emit(`slideChangeTransition${step}`);
    if (dir === 'next') {
      swiper.emit(`slideNextTransition${step}`);
    } else {
      swiper.emit(`slidePrevTransition${step}`);
    }
  }
}

function transitionStart(runCallbacks = true, direction) {
  const swiper = this;
  const {
    params
  } = swiper;
  if (params.cssMode) return;
  if (params.autoHeight) {
    swiper.updateAutoHeight();
  }
  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: 'Start'
  });
}

function transitionEnd(runCallbacks = true, direction) {
  const swiper = this;
  const {
    params
  } = swiper;
  swiper.animating = false;
  if (params.cssMode) return;
  swiper.setTransition(0);
  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: 'End'
  });
}

var transition = {
  setTransition,
  transitionStart,
  transitionEnd
};

function slideTo(index = 0, speed = this.params.speed, runCallbacks = true, internal, initial) {
  if (typeof index === 'string') {
    index = parseInt(index, 10);
  }
  const swiper = this;
  let slideIndex = index;
  if (slideIndex < 0) slideIndex = 0;
  const {
    params,
    snapGrid,
    slidesGrid,
    previousIndex,
    activeIndex,
    rtlTranslate: rtl,
    wrapperEl,
    enabled
  } = swiper;
  if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) {
    return false;
  }
  const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
  let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
  const translate = -snapGrid[snapIndex];
  // Normalize slideIndex
  if (params.normalizeSlideIndex) {
    for (let i = 0; i < slidesGrid.length; i += 1) {
      const normalizedTranslate = -Math.floor(translate * 100);
      const normalizedGrid = Math.floor(slidesGrid[i] * 100);
      const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);
      if (typeof slidesGrid[i + 1] !== 'undefined') {
        if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
          slideIndex = i;
        } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
          slideIndex = i + 1;
        }
      } else if (normalizedTranslate >= normalizedGrid) {
        slideIndex = i;
      }
    }
  }
  // Directions locks
  if (swiper.initialized && slideIndex !== activeIndex) {
    if (!swiper.allowSlideNext && (rtl ? translate > swiper.translate && translate > swiper.minTranslate() : translate < swiper.translate && translate < swiper.minTranslate())) {
      return false;
    }
    if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) {
      if ((activeIndex || 0) !== slideIndex) {
        return false;
      }
    }
  }
  if (slideIndex !== (previousIndex || 0) && runCallbacks) {
    swiper.emit('beforeSlideChangeStart');
  }

  // Update progress
  swiper.updateProgress(translate);
  let direction;
  if (slideIndex > activeIndex) direction = 'next';else if (slideIndex < activeIndex) direction = 'prev';else direction = 'reset';

  // Update Index
  if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
    swiper.updateActiveIndex(slideIndex);
    // Update Height
    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }
    swiper.updateSlidesClasses();
    if (params.effect !== 'slide') {
      swiper.setTranslate(translate);
    }
    if (direction !== 'reset') {
      swiper.transitionStart(runCallbacks, direction);
      swiper.transitionEnd(runCallbacks, direction);
    }
    return false;
  }
  if (params.cssMode) {
    const isH = swiper.isHorizontal();
    const t = rtl ? translate : -translate;
    if (speed === 0) {
      const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
      if (isVirtual) {
        swiper.wrapperEl.style.scrollSnapType = 'none';
        swiper._immediateVirtual = true;
      }
      if (isVirtual && !swiper._cssModeVirtualInitialSet && swiper.params.initialSlide > 0) {
        swiper._cssModeVirtualInitialSet = true;
        requestAnimationFrame(() => {
          wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = t;
        });
      } else {
        wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = t;
      }
      if (isVirtual) {
        requestAnimationFrame(() => {
          swiper.wrapperEl.style.scrollSnapType = '';
          swiper._immediateVirtual = false;
        });
      }
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: t,
          side: isH ? 'left' : 'top'
        });
        return true;
      }
      wrapperEl.scrollTo({
        [isH ? 'left' : 'top']: t,
        behavior: 'smooth'
      });
    }
    return true;
  }
  swiper.setTransition(speed);
  swiper.setTranslate(translate);
  swiper.updateActiveIndex(slideIndex);
  swiper.updateSlidesClasses();
  swiper.emit('beforeTransitionStart', speed, internal);
  swiper.transitionStart(runCallbacks, direction);
  if (speed === 0) {
    swiper.transitionEnd(runCallbacks, direction);
  } else if (!swiper.animating) {
    swiper.animating = true;
    if (!swiper.onSlideToWrapperTransitionEnd) {
      swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
        if (!swiper || swiper.destroyed) return;
        if (e.target !== this) return;
        swiper.wrapperEl.removeEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
        swiper.onSlideToWrapperTransitionEnd = null;
        delete swiper.onSlideToWrapperTransitionEnd;
        swiper.transitionEnd(runCallbacks, direction);
      };
    }
    swiper.wrapperEl.addEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
  }
  return true;
}

function slideToLoop(index = 0, speed = this.params.speed, runCallbacks = true, internal) {
  if (typeof index === 'string') {
    const indexAsNumber = parseInt(index, 10);
    index = indexAsNumber;
  }
  const swiper = this;
  let newIndex = index;
  if (swiper.params.loop) {
    if (swiper.virtual && swiper.params.virtual.enabled) {
      // eslint-disable-next-line
      newIndex = newIndex + swiper.virtual.slidesBefore;
    } else {
      newIndex = swiper.getSlideIndexByData(newIndex);
    }
  }
  return swiper.slideTo(newIndex, speed, runCallbacks, internal);
}

/* eslint no-unused-vars: "off" */
function slideNext(speed = this.params.speed, runCallbacks = true, internal) {
  const swiper = this;
  const {
    enabled,
    params,
    animating
  } = swiper;
  if (!enabled) return swiper;
  let perGroup = params.slidesPerGroup;
  if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
    perGroup = Math.max(swiper.slidesPerViewDynamic('current', true), 1);
  }
  const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  if (params.loop) {
    if (animating && !isVirtual && params.loopPreventsSliding) return false;
    swiper.loopFix({
      direction: 'next'
    });
    // eslint-disable-next-line
    swiper._clientLeft = swiper.wrapperEl.clientLeft;
  }
  if (params.rewind && swiper.isEnd) {
    return swiper.slideTo(0, speed, runCallbacks, internal);
  }
  return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
}

/* eslint no-unused-vars: "off" */
function slidePrev(speed = this.params.speed, runCallbacks = true, internal) {
  const swiper = this;
  const {
    params,
    snapGrid,
    slidesGrid,
    rtlTranslate,
    enabled,
    animating
  } = swiper;
  if (!enabled) return swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  if (params.loop) {
    if (animating && !isVirtual && params.loopPreventsSliding) return false;
    swiper.loopFix({
      direction: 'prev'
    });
    // eslint-disable-next-line
    swiper._clientLeft = swiper.wrapperEl.clientLeft;
  }
  const translate = rtlTranslate ? swiper.translate : -swiper.translate;
  function normalize(val) {
    if (val < 0) return -Math.floor(Math.abs(val));
    return Math.floor(val);
  }
  const normalizedTranslate = normalize(translate);
  const normalizedSnapGrid = snapGrid.map(val => normalize(val));
  let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
  if (typeof prevSnap === 'undefined' && params.cssMode) {
    let prevSnapIndex;
    snapGrid.forEach((snap, snapIndex) => {
      if (normalizedTranslate >= snap) {
        // prevSnap = snap;
        prevSnapIndex = snapIndex;
      }
    });
    if (typeof prevSnapIndex !== 'undefined') {
      prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
    }
  }
  let prevIndex = 0;
  if (typeof prevSnap !== 'undefined') {
    prevIndex = slidesGrid.indexOf(prevSnap);
    if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
    if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
      prevIndex = prevIndex - swiper.slidesPerViewDynamic('previous', true) + 1;
      prevIndex = Math.max(prevIndex, 0);
    }
  }
  if (params.rewind && swiper.isBeginning) {
    const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
    return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
  }
  return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
}

/* eslint no-unused-vars: "off" */
function slideReset(speed = this.params.speed, runCallbacks = true, internal) {
  const swiper = this;
  return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
}

/* eslint no-unused-vars: "off" */
function slideToClosest(speed = this.params.speed, runCallbacks = true, internal, threshold = 0.5) {
  const swiper = this;
  let index = swiper.activeIndex;
  const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
  const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
  const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  if (translate >= swiper.snapGrid[snapIndex]) {
    // The current translate is on or after the current snap index, so the choice
    // is between the current index and the one after it.
    const currentSnap = swiper.snapGrid[snapIndex];
    const nextSnap = swiper.snapGrid[snapIndex + 1];
    if (translate - currentSnap > (nextSnap - currentSnap) * threshold) {
      index += swiper.params.slidesPerGroup;
    }
  } else {
    // The current translate is before the current snap index, so the choice
    // is between the current index and the one before it.
    const prevSnap = swiper.snapGrid[snapIndex - 1];
    const currentSnap = swiper.snapGrid[snapIndex];
    if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) {
      index -= swiper.params.slidesPerGroup;
    }
  }
  index = Math.max(index, 0);
  index = Math.min(index, swiper.slidesGrid.length - 1);
  return swiper.slideTo(index, speed, runCallbacks, internal);
}

function slideToClickedSlide() {
  const swiper = this;
  const {
    params,
    slidesEl
  } = swiper;
  const slidesPerView = params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : params.slidesPerView;
  let slideToIndex = swiper.clickedIndex;
  let realIndex;
  const slideSelector = swiper.isElement ? `swiper-slide` : `.${params.slideClass}`;
  if (params.loop) {
    if (swiper.animating) return;
    realIndex = parseInt(swiper.clickedSlide.getAttribute('data-swiper-slide-index'), 10);
    if (params.centeredSlides) {
      if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
        swiper.loopFix();
        slideToIndex = swiper.getSlideIndex(elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
        nextTick(() => {
          swiper.slideTo(slideToIndex);
        });
      } else {
        swiper.slideTo(slideToIndex);
      }
    } else if (slideToIndex > swiper.slides.length - slidesPerView) {
      swiper.loopFix();
      slideToIndex = swiper.getSlideIndex(elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
      nextTick(() => {
        swiper.slideTo(slideToIndex);
      });
    } else {
      swiper.slideTo(slideToIndex);
    }
  } else {
    swiper.slideTo(slideToIndex);
  }
}

var slide = {
  slideTo,
  slideToLoop,
  slideNext,
  slidePrev,
  slideReset,
  slideToClosest,
  slideToClickedSlide
};

function loopCreate(slideRealIndex) {
  const swiper = this;
  const {
    params,
    slidesEl
  } = swiper;
  if (!params.loop || swiper.virtual && swiper.params.virtual.enabled) return;
  const slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
  slides.forEach((el, index) => {
    el.setAttribute('data-swiper-slide-index', index);
  });
  swiper.loopFix({
    slideRealIndex,
    direction: params.centeredSlides ? undefined : 'next'
  });
}

function loopFix({
  slideRealIndex,
  slideTo = true,
  direction,
  setTranslate,
  activeSlideIndex,
  byController,
  byMousewheel
} = {}) {
  const swiper = this;
  if (!swiper.params.loop) return;
  swiper.emit('beforeLoopFix');
  const {
    slides,
    allowSlidePrev,
    allowSlideNext,
    slidesEl,
    params
  } = swiper;
  swiper.allowSlidePrev = true;
  swiper.allowSlideNext = true;
  if (swiper.virtual && params.virtual.enabled) {
    if (slideTo) {
      if (!params.centeredSlides && swiper.snapIndex === 0) {
        swiper.slideTo(swiper.virtual.slides.length, 0, false, true);
      } else if (params.centeredSlides && swiper.snapIndex < params.slidesPerView) {
        swiper.slideTo(swiper.virtual.slides.length + swiper.snapIndex, 0, false, true);
      } else if (swiper.snapIndex === swiper.snapGrid.length - 1) {
        swiper.slideTo(swiper.virtual.slidesBefore, 0, false, true);
      }
    }
    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;
    swiper.emit('loopFix');
    return;
  }
  const slidesPerView = params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10));
  let loopedSlides = params.loopedSlides || slidesPerView;
  if (loopedSlides % params.slidesPerGroup !== 0) {
    loopedSlides += params.slidesPerGroup - loopedSlides % params.slidesPerGroup;
  }
  swiper.loopedSlides = loopedSlides;
  const prependSlidesIndexes = [];
  const appendSlidesIndexes = [];
  let activeIndex = swiper.activeIndex;
  if (typeof activeSlideIndex === 'undefined') {
    activeSlideIndex = swiper.getSlideIndex(swiper.slides.filter(el => el.classList.contains(params.slideActiveClass))[0]);
  } else {
    activeIndex = activeSlideIndex;
  }
  const isNext = direction === 'next' || !direction;
  const isPrev = direction === 'prev' || !direction;
  let slidesPrepended = 0;
  let slidesAppended = 0;
  // prepend last slides before start
  if (activeSlideIndex < loopedSlides) {
    slidesPrepended = Math.max(loopedSlides - activeSlideIndex, params.slidesPerGroup);
    for (let i = 0; i < loopedSlides - activeSlideIndex; i += 1) {
      const index = i - Math.floor(i / slides.length) * slides.length;
      prependSlidesIndexes.push(slides.length - index - 1);
    }
  } else if (activeSlideIndex /* + slidesPerView */ > swiper.slides.length - loopedSlides * 2) {
    slidesAppended = Math.max(activeSlideIndex - (swiper.slides.length - loopedSlides * 2), params.slidesPerGroup);
    for (let i = 0; i < slidesAppended; i += 1) {
      const index = i - Math.floor(i / slides.length) * slides.length;
      appendSlidesIndexes.push(index);
    }
  }
  if (isPrev) {
    prependSlidesIndexes.forEach(index => {
      swiper.slides[index].swiperLoopMoveDOM = true;
      slidesEl.prepend(swiper.slides[index]);
      swiper.slides[index].swiperLoopMoveDOM = false;
    });
  }
  if (isNext) {
    appendSlidesIndexes.forEach(index => {
      swiper.slides[index].swiperLoopMoveDOM = true;
      slidesEl.append(swiper.slides[index]);
      swiper.slides[index].swiperLoopMoveDOM = false;
    });
  }
  swiper.recalcSlides();
  if (params.slidesPerView === 'auto') {
    swiper.updateSlides();
  }
  if (params.watchSlidesProgress) {
    swiper.updateSlidesOffset();
  }
  if (slideTo) {
    if (prependSlidesIndexes.length > 0 && isPrev) {
      if (typeof slideRealIndex === 'undefined') {
        const currentSlideTranslate = swiper.slidesGrid[activeIndex];
        const newSlideTranslate = swiper.slidesGrid[activeIndex + slidesPrepended];
        const diff = newSlideTranslate - currentSlideTranslate;
        if (byMousewheel) {
          swiper.setTranslate(swiper.translate - diff);
        } else {
          swiper.slideTo(activeIndex + slidesPrepended, 0, false, true);
          if (setTranslate) {
            swiper.touches[swiper.isHorizontal() ? 'startX' : 'startY'] += diff;
          }
        }
      } else {
        if (setTranslate) {
          swiper.slideToLoop(slideRealIndex, 0, false, true);
        }
      }
    } else if (appendSlidesIndexes.length > 0 && isNext) {
      if (typeof slideRealIndex === 'undefined') {
        const currentSlideTranslate = swiper.slidesGrid[activeIndex];
        const newSlideTranslate = swiper.slidesGrid[activeIndex - slidesAppended];
        const diff = newSlideTranslate - currentSlideTranslate;
        if (byMousewheel) {
          swiper.setTranslate(swiper.translate - diff);
        } else {
          swiper.slideTo(activeIndex - slidesAppended, 0, false, true);
          if (setTranslate) {
            swiper.touches[swiper.isHorizontal() ? 'startX' : 'startY'] += diff;
          }
        }
      } else {
        swiper.slideToLoop(slideRealIndex, 0, false, true);
      }
    }
  }
  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  if (swiper.controller && swiper.controller.control && !byController) {
    const loopParams = {
      slideRealIndex,
      slideTo: false,
      direction,
      setTranslate,
      activeSlideIndex,
      byController: true
    };
    if (Array.isArray(swiper.controller.control)) {
      swiper.controller.control.forEach(c => {
        if (!c.destroyed && c.params.loop) c.loopFix(loopParams);
      });
    } else if (swiper.controller.control instanceof swiper.constructor && swiper.controller.control.params.loop) {
      swiper.controller.control.loopFix(loopParams);
    }
  }
  swiper.emit('loopFix');
}

function loopDestroy() {
  const swiper = this;
  const {
    params,
    slidesEl
  } = swiper;
  if (!params.loop || swiper.virtual && swiper.params.virtual.enabled) return;
  swiper.recalcSlides();
  const newSlidesOrder = [];
  swiper.slides.forEach(slideEl => {
    const index = typeof slideEl.swiperSlideIndex === 'undefined' ? slideEl.getAttribute('data-swiper-slide-index') * 1 : slideEl.swiperSlideIndex;
    newSlidesOrder[index] = slideEl;
  });
  swiper.slides.forEach(slideEl => {
    slideEl.removeAttribute('data-swiper-slide-index');
  });
  newSlidesOrder.forEach(slideEl => {
    slidesEl.append(slideEl);
  });
  swiper.recalcSlides();
  swiper.slideTo(swiper.realIndex, 0);
}

var loop = {
  loopCreate,
  loopFix,
  loopDestroy
};

function setGrabCursor(moving) {
  const swiper = this;
  if (!swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
  const el = swiper.params.touchEventsTarget === 'container' ? swiper.el : swiper.wrapperEl;
  if (swiper.isElement) {
    swiper.__preventObserver__ = true;
  }
  el.style.cursor = 'move';
  el.style.cursor = moving ? 'grabbing' : 'grab';
  if (swiper.isElement) {
    requestAnimationFrame(() => {
      swiper.__preventObserver__ = false;
    });
  }
}

function unsetGrabCursor() {
  const swiper = this;
  if (swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
    return;
  }
  if (swiper.isElement) {
    swiper.__preventObserver__ = true;
  }
  swiper[swiper.params.touchEventsTarget === 'container' ? 'el' : 'wrapperEl'].style.cursor = '';
  if (swiper.isElement) {
    requestAnimationFrame(() => {
      swiper.__preventObserver__ = false;
    });
  }
}

var grabCursor = {
  setGrabCursor,
  unsetGrabCursor
};

// Modified from https://stackoverflow.com/questions/54520554/custom-element-getrootnode-closest-function-crossing-multiple-parent-shadowd
function closestElement(selector, base = this) {
  function __closestFrom(el) {
    if (!el || el === getDocument() || el === getWindow()) return null;
    if (el.assignedSlot) el = el.assignedSlot;
    const found = el.closest(selector);
    if (!found && !el.getRootNode) {
      return null;
    }
    return found || __closestFrom(el.getRootNode().host);
  }
  return __closestFrom(base);
}
function onTouchStart(event) {
  const swiper = this;
  const document = getDocument();
  const window = getWindow();
  const data = swiper.touchEventsData;
  data.evCache.push(event);
  const {
    params,
    touches,
    enabled
  } = swiper;
  if (!enabled) return;
  if (!params.simulateTouch && event.pointerType === 'mouse') return;
  if (swiper.animating && params.preventInteractionOnTransition) {
    return;
  }
  if (!swiper.animating && params.cssMode && params.loop) {
    swiper.loopFix();
  }
  let e = event;
  if (e.originalEvent) e = e.originalEvent;
  let targetEl = e.target;
  if (params.touchEventsTarget === 'wrapper') {
    if (!swiper.wrapperEl.contains(targetEl)) return;
  }
  if ('which' in e && e.which === 3) return;
  if ('button' in e && e.button > 0) return;
  if (data.isTouched && data.isMoved) return;

  // change target el for shadow root component
  const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== '';
  // eslint-disable-next-line
  const eventPath = event.composedPath ? event.composedPath() : event.path;
  if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) {
    targetEl = eventPath[0];
  }
  const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
  const isTargetShadow = !!(e.target && e.target.shadowRoot);

  // use closestElement for shadow root element to get the actual closest for nested shadow root element
  if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, targetEl) : targetEl.closest(noSwipingSelector))) {
    swiper.allowClick = true;
    return;
  }
  if (params.swipeHandler) {
    if (!targetEl.closest(params.swipeHandler)) return;
  }
  touches.currentX = e.pageX;
  touches.currentY = e.pageY;
  const startX = touches.currentX;
  const startY = touches.currentY;

  // Do NOT start if iOS edge swipe is detected. Otherwise iOS app cannot swipe-to-go-back anymore

  const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
  const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
  if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) {
    if (edgeSwipeDetection === 'prevent') {
      event.preventDefault();
    } else {
      return;
    }
  }
  Object.assign(data, {
    isTouched: true,
    isMoved: false,
    allowTouchCallbacks: true,
    isScrolling: undefined,
    startMoving: undefined
  });
  touches.startX = startX;
  touches.startY = startY;
  data.touchStartTime = now();
  swiper.allowClick = true;
  swiper.updateSize();
  swiper.swipeDirection = undefined;
  if (params.threshold > 0) data.allowThresholdMove = false;
  let preventDefault = true;
  if (targetEl.matches(data.focusableElements)) {
    preventDefault = false;
    if (targetEl.nodeName === 'SELECT') {
      data.isTouched = false;
    }
  }
  if (document.activeElement && document.activeElement.matches(data.focusableElements) && document.activeElement !== targetEl) {
    document.activeElement.blur();
  }
  const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
  if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !targetEl.isContentEditable) {
    e.preventDefault();
  }
  if (params.freeMode && params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) {
    swiper.freeMode.onTouchStart();
  }
  swiper.emit('touchStart', e);
}

function onTouchMove(event) {
  const document = getDocument();
  const swiper = this;
  const data = swiper.touchEventsData;
  const {
    params,
    touches,
    rtlTranslate: rtl,
    enabled
  } = swiper;
  if (!enabled) return;
  if (!params.simulateTouch && event.pointerType === 'mouse') return;
  let e = event;
  if (e.originalEvent) e = e.originalEvent;
  if (!data.isTouched) {
    if (data.startMoving && data.isScrolling) {
      swiper.emit('touchMoveOpposite', e);
    }
    return;
  }
  const pointerIndex = data.evCache.findIndex(cachedEv => cachedEv.pointerId === e.pointerId);
  if (pointerIndex >= 0) data.evCache[pointerIndex] = e;
  const targetTouch = data.evCache.length > 1 ? data.evCache[0] : e;
  const pageX = targetTouch.pageX;
  const pageY = targetTouch.pageY;
  if (e.preventedByNestedSwiper) {
    touches.startX = pageX;
    touches.startY = pageY;
    return;
  }
  if (!swiper.allowTouchMove) {
    if (!e.target.matches(data.focusableElements)) {
      swiper.allowClick = false;
    }
    if (data.isTouched) {
      Object.assign(touches, {
        startX: pageX,
        startY: pageY,
        prevX: swiper.touches.currentX,
        prevY: swiper.touches.currentY,
        currentX: pageX,
        currentY: pageY
      });
      data.touchStartTime = now();
    }
    return;
  }
  if (params.touchReleaseOnEdges && !params.loop) {
    if (swiper.isVertical()) {
      // Vertical
      if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
        data.isTouched = false;
        data.isMoved = false;
        return;
      }
    } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) {
      return;
    }
  }
  if (document.activeElement) {
    if (e.target === document.activeElement && e.target.matches(data.focusableElements)) {
      data.isMoved = true;
      swiper.allowClick = false;
      return;
    }
  }
  if (data.allowTouchCallbacks) {
    swiper.emit('touchMove', e);
  }
  if (e.targetTouches && e.targetTouches.length > 1) return;
  touches.currentX = pageX;
  touches.currentY = pageY;
  const diffX = touches.currentX - touches.startX;
  const diffY = touches.currentY - touches.startY;
  if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
  if (typeof data.isScrolling === 'undefined') {
    let touchAngle;
    if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
      data.isScrolling = false;
    } else {
      // eslint-disable-next-line
      if (diffX * diffX + diffY * diffY >= 25) {
        touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
        data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
      }
    }
  }
  if (data.isScrolling) {
    swiper.emit('touchMoveOpposite', e);
  }
  if (typeof data.startMoving === 'undefined') {
    if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
      data.startMoving = true;
    }
  }
  if (data.isScrolling || swiper.zoom && swiper.params.zoom && swiper.params.zoom.enabled && data.evCache.length > 1) {
    data.isTouched = false;
    return;
  }
  if (!data.startMoving) {
    return;
  }
  swiper.allowClick = false;
  if (!params.cssMode && e.cancelable) {
    e.preventDefault();
  }
  if (params.touchMoveStopPropagation && !params.nested) {
    e.stopPropagation();
  }
  let diff = swiper.isHorizontal() ? diffX : diffY;
  let touchesDiff = swiper.isHorizontal() ? touches.currentX - touches.previousX : touches.currentY - touches.previousY;
  if (params.oneWayMovement) {
    diff = Math.abs(diff) * (rtl ? 1 : -1);
    touchesDiff = Math.abs(touchesDiff) * (rtl ? 1 : -1);
  }
  touches.diff = diff;
  diff *= params.touchRatio;
  if (rtl) {
    diff = -diff;
    touchesDiff = -touchesDiff;
  }
  const prevTouchesDirection = swiper.touchesDirection;
  swiper.swipeDirection = diff > 0 ? 'prev' : 'next';
  swiper.touchesDirection = touchesDiff > 0 ? 'prev' : 'next';
  const isLoop = swiper.params.loop && !params.cssMode;
  if (!data.isMoved) {
    if (isLoop) {
      swiper.loopFix({
        direction: swiper.swipeDirection
      });
    }
    data.startTranslate = swiper.getTranslate();
    swiper.setTransition(0);
    if (swiper.animating) {
      const evt = new window.CustomEvent('transitionend', {
        bubbles: true,
        cancelable: true
      });
      swiper.wrapperEl.dispatchEvent(evt);
    }
    data.allowMomentumBounce = false;
    // Grab Cursor
    if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
      swiper.setGrabCursor(true);
    }
    swiper.emit('sliderFirstMove', e);
  }
  let loopFixed;
  if (data.isMoved && prevTouchesDirection !== swiper.touchesDirection && isLoop && Math.abs(diff) >= 1) {
    // need another loop fix
    swiper.loopFix({
      direction: swiper.swipeDirection,
      setTranslate: true
    });
    loopFixed = true;
  }
  swiper.emit('sliderMove', e);
  data.isMoved = true;
  data.currentTranslate = diff + data.startTranslate;
  let disableParentSwiper = true;
  let resistanceRatio = params.resistanceRatio;
  if (params.touchReleaseOnEdges) {
    resistanceRatio = 0;
  }
  if (diff > 0) {
    if (isLoop && !loopFixed && data.currentTranslate > (params.centeredSlides ? swiper.minTranslate() - swiper.size / 2 : swiper.minTranslate())) {
      swiper.loopFix({
        direction: 'prev',
        setTranslate: true,
        activeSlideIndex: 0
      });
    }
    if (data.currentTranslate > swiper.minTranslate()) {
      disableParentSwiper = false;
      if (params.resistance) {
        data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
      }
    }
  } else if (diff < 0) {
    if (isLoop && !loopFixed && data.currentTranslate < (params.centeredSlides ? swiper.maxTranslate() + swiper.size / 2 : swiper.maxTranslate())) {
      swiper.loopFix({
        direction: 'next',
        setTranslate: true,
        activeSlideIndex: swiper.slides.length - (params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10)))
      });
    }
    if (data.currentTranslate < swiper.maxTranslate()) {
      disableParentSwiper = false;
      if (params.resistance) {
        data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
      }
    }
  }
  if (disableParentSwiper) {
    e.preventedByNestedSwiper = true;
  }

  // Directions locks
  if (!swiper.allowSlideNext && swiper.swipeDirection === 'next' && data.currentTranslate < data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }
  if (!swiper.allowSlidePrev && swiper.swipeDirection === 'prev' && data.currentTranslate > data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }
  if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
    data.currentTranslate = data.startTranslate;
  }

  // Threshold
  if (params.threshold > 0) {
    if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
      if (!data.allowThresholdMove) {
        data.allowThresholdMove = true;
        touches.startX = touches.currentX;
        touches.startY = touches.currentY;
        data.currentTranslate = data.startTranslate;
        touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
        return;
      }
    } else {
      data.currentTranslate = data.startTranslate;
      return;
    }
  }
  if (!params.followFinger || params.cssMode) return;

  // Update active index in free mode
  if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  if (params.freeMode && params.freeMode.enabled && swiper.freeMode) {
    swiper.freeMode.onTouchMove();
  }
  // Update progress
  swiper.updateProgress(data.currentTranslate);
  // Update translate
  swiper.setTranslate(data.currentTranslate);
}

function onTouchEnd(event) {
  const swiper = this;
  const data = swiper.touchEventsData;
  const pointerIndex = data.evCache.findIndex(cachedEv => cachedEv.pointerId === event.pointerId);
  if (pointerIndex >= 0) {
    data.evCache.splice(pointerIndex, 1);
  }
  if (['pointercancel', 'pointerout', 'pointerleave'].includes(event.type)) {
    const proceed = event.type === 'pointercancel' && (swiper.browser.isSafari || swiper.browser.isWebView);
    if (!proceed) {
      return;
    }
  }
  const {
    params,
    touches,
    rtlTranslate: rtl,
    slidesGrid,
    enabled
  } = swiper;
  if (!enabled) return;
  if (!params.simulateTouch && event.pointerType === 'mouse') return;
  let e = event;
  if (e.originalEvent) e = e.originalEvent;
  if (data.allowTouchCallbacks) {
    swiper.emit('touchEnd', e);
  }
  data.allowTouchCallbacks = false;
  if (!data.isTouched) {
    if (data.isMoved && params.grabCursor) {
      swiper.setGrabCursor(false);
    }
    data.isMoved = false;
    data.startMoving = false;
    return;
  }
  // Return Grab Cursor
  if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
    swiper.setGrabCursor(false);
  }

  // Time diff
  const touchEndTime = now();
  const timeDiff = touchEndTime - data.touchStartTime;

  // Tap, doubleTap, Click
  if (swiper.allowClick) {
    const pathTree = e.path || e.composedPath && e.composedPath();
    swiper.updateClickedSlide(pathTree && pathTree[0] || e.target);
    swiper.emit('tap click', e);
    if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
      swiper.emit('doubleTap doubleClick', e);
    }
  }
  data.lastClickTime = now();
  nextTick(() => {
    if (!swiper.destroyed) swiper.allowClick = true;
  });
  if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 || data.currentTranslate === data.startTranslate) {
    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;
    return;
  }
  data.isTouched = false;
  data.isMoved = false;
  data.startMoving = false;
  let currentPos;
  if (params.followFinger) {
    currentPos = rtl ? swiper.translate : -swiper.translate;
  } else {
    currentPos = -data.currentTranslate;
  }
  if (params.cssMode) {
    return;
  }
  if (params.freeMode && params.freeMode.enabled) {
    swiper.freeMode.onTouchEnd({
      currentPos
    });
    return;
  }

  // Find current slide
  let stopIndex = 0;
  let groupSize = swiper.slidesSizesGrid[0];
  for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
    const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
    if (typeof slidesGrid[i + increment] !== 'undefined') {
      if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
        stopIndex = i;
        groupSize = slidesGrid[i + increment] - slidesGrid[i];
      }
    } else if (currentPos >= slidesGrid[i]) {
      stopIndex = i;
      groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
    }
  }
  let rewindFirstIndex = null;
  let rewindLastIndex = null;
  if (params.rewind) {
    if (swiper.isBeginning) {
      rewindLastIndex = params.virtual && params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
    } else if (swiper.isEnd) {
      rewindFirstIndex = 0;
    }
  }
  // Find current slide size
  const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
  const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
  if (timeDiff > params.longSwipesMs) {
    // Long touches
    if (!params.longSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    if (swiper.swipeDirection === 'next') {
      if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment);else swiper.slideTo(stopIndex);
    }
    if (swiper.swipeDirection === 'prev') {
      if (ratio > 1 - params.longSwipesRatio) {
        swiper.slideTo(stopIndex + increment);
      } else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) {
        swiper.slideTo(rewindLastIndex);
      } else {
        swiper.slideTo(stopIndex);
      }
    }
  } else {
    // Short swipes
    if (!params.shortSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
    if (!isNavButtonTarget) {
      if (swiper.swipeDirection === 'next') {
        swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
      }
      if (swiper.swipeDirection === 'prev') {
        swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
      }
    } else if (e.target === swiper.navigation.nextEl) {
      swiper.slideTo(stopIndex + increment);
    } else {
      swiper.slideTo(stopIndex);
    }
  }
}

function onResize() {
  const swiper = this;
  const {
    params,
    el
  } = swiper;
  if (el && el.offsetWidth === 0) return;

  // Breakpoints
  if (params.breakpoints) {
    swiper.setBreakpoint();
  }

  // Save locks
  const {
    allowSlideNext,
    allowSlidePrev,
    snapGrid
  } = swiper;
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;

  // Disable locks on resize
  swiper.allowSlideNext = true;
  swiper.allowSlidePrev = true;
  swiper.updateSize();
  swiper.updateSlides();
  swiper.updateSlidesClasses();
  const isVirtualLoop = isVirtual && params.loop;
  if ((params.slidesPerView === 'auto' || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides && !isVirtualLoop) {
    swiper.slideTo(swiper.slides.length - 1, 0, false, true);
  } else {
    if (swiper.params.loop && !isVirtual) {
      swiper.slideToLoop(swiper.realIndex, 0, false, true);
    } else {
      swiper.slideTo(swiper.activeIndex, 0, false, true);
    }
  }
  if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
    clearTimeout(swiper.autoplay.resizeTimeout);
    swiper.autoplay.resizeTimeout = setTimeout(() => {
      if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
        swiper.autoplay.resume();
      }
    }, 500);
  }
  // Return locks after resize
  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
    swiper.checkOverflow();
  }
}

function onClick(e) {
  const swiper = this;
  if (!swiper.enabled) return;
  if (!swiper.allowClick) {
    if (swiper.params.preventClicks) e.preventDefault();
    if (swiper.params.preventClicksPropagation && swiper.animating) {
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
}

function onScroll() {
  const swiper = this;
  const {
    wrapperEl,
    rtlTranslate,
    enabled
  } = swiper;
  if (!enabled) return;
  swiper.previousTranslate = swiper.translate;
  if (swiper.isHorizontal()) {
    swiper.translate = -wrapperEl.scrollLeft;
  } else {
    swiper.translate = -wrapperEl.scrollTop;
  }
  // eslint-disable-next-line
  if (swiper.translate === 0) swiper.translate = 0;
  swiper.updateActiveIndex();
  swiper.updateSlidesClasses();
  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
  }
  if (newProgress !== swiper.progress) {
    swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
  }
  swiper.emit('setTranslate', swiper.translate, false);
}

function onLoad(e) {
  const swiper = this;
  processLazyPreloader(swiper, e.target);
  if (swiper.params.cssMode || swiper.params.slidesPerView !== 'auto' && !swiper.params.autoHeight) {
    return;
  }
  swiper.update();
}

let dummyEventAttached = false;
function dummyEventListener() {}
const events = (swiper, method) => {
  const document = getDocument();
  const {
    params,
    el,
    wrapperEl,
    device
  } = swiper;
  const capture = !!params.nested;
  const domMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';
  const swiperMethod = method;

  // Touch Events
  el[domMethod]('pointerdown', swiper.onTouchStart, {
    passive: false
  });
  document[domMethod]('pointermove', swiper.onTouchMove, {
    passive: false,
    capture
  });
  document[domMethod]('pointerup', swiper.onTouchEnd, {
    passive: true
  });
  document[domMethod]('pointercancel', swiper.onTouchEnd, {
    passive: true
  });
  document[domMethod]('pointerout', swiper.onTouchEnd, {
    passive: true
  });
  document[domMethod]('pointerleave', swiper.onTouchEnd, {
    passive: true
  });

  // Prevent Links Clicks
  if (params.preventClicks || params.preventClicksPropagation) {
    el[domMethod]('click', swiper.onClick, true);
  }
  if (params.cssMode) {
    wrapperEl[domMethod]('scroll', swiper.onScroll);
  }

  // Resize handler
  if (params.updateOnWindowResize) {
    swiper[swiperMethod](device.ios || device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate', onResize, true);
  } else {
    swiper[swiperMethod]('observerUpdate', onResize, true);
  }

  // Images loader
  el[domMethod]('load', swiper.onLoad, {
    capture: true
  });
};
function attachEvents() {
  const swiper = this;
  const document = getDocument();
  const {
    params
  } = swiper;
  swiper.onTouchStart = onTouchStart.bind(swiper);
  swiper.onTouchMove = onTouchMove.bind(swiper);
  swiper.onTouchEnd = onTouchEnd.bind(swiper);
  if (params.cssMode) {
    swiper.onScroll = onScroll.bind(swiper);
  }
  swiper.onClick = onClick.bind(swiper);
  swiper.onLoad = onLoad.bind(swiper);
  if (!dummyEventAttached) {
    document.addEventListener('touchstart', dummyEventListener);
    dummyEventAttached = true;
  }
  events(swiper, 'on');
}
function detachEvents() {
  const swiper = this;
  events(swiper, 'off');
}
var events$1 = {
  attachEvents,
  detachEvents
};

const isGridEnabled = (swiper, params) => {
  return swiper.grid && params.grid && params.grid.rows > 1;
};
function setBreakpoint() {
  const swiper = this;
  const {
    realIndex,
    initialized,
    params,
    el
  } = swiper;
  const breakpoints = params.breakpoints;
  if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return;

  // Get breakpoint for window width and update parameters
  const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
  if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
  const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : undefined;
  const breakpointParams = breakpointOnlyParams || swiper.originalParams;
  const wasMultiRow = isGridEnabled(swiper, params);
  const isMultiRow = isGridEnabled(swiper, breakpointParams);
  const wasEnabled = params.enabled;
  if (wasMultiRow && !isMultiRow) {
    el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
    swiper.emitContainerClasses();
  } else if (!wasMultiRow && isMultiRow) {
    el.classList.add(`${params.containerModifierClass}grid`);
    if (breakpointParams.grid.fill && breakpointParams.grid.fill === 'column' || !breakpointParams.grid.fill && params.grid.fill === 'column') {
      el.classList.add(`${params.containerModifierClass}grid-column`);
    }
    swiper.emitContainerClasses();
  }

  // Toggle navigation, pagination, scrollbar
  ['navigation', 'pagination', 'scrollbar'].forEach(prop => {
    if (typeof breakpointParams[prop] === 'undefined') return;
    const wasModuleEnabled = params[prop] && params[prop].enabled;
    const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
    if (wasModuleEnabled && !isModuleEnabled) {
      swiper[prop].disable();
    }
    if (!wasModuleEnabled && isModuleEnabled) {
      swiper[prop].enable();
    }
  });
  const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
  const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
  if (directionChanged && initialized) {
    swiper.changeDirection();
  }
  extend(swiper.params, breakpointParams);
  const isEnabled = swiper.params.enabled;
  Object.assign(swiper, {
    allowTouchMove: swiper.params.allowTouchMove,
    allowSlideNext: swiper.params.allowSlideNext,
    allowSlidePrev: swiper.params.allowSlidePrev
  });
  if (wasEnabled && !isEnabled) {
    swiper.disable();
  } else if (!wasEnabled && isEnabled) {
    swiper.enable();
  }
  swiper.currentBreakpoint = breakpoint;
  swiper.emit('_beforeBreakpoint', breakpointParams);
  if (needsReLoop && initialized) {
    swiper.loopDestroy();
    swiper.loopCreate(realIndex);
    swiper.updateSlides();
  }
  swiper.emit('breakpoint', breakpointParams);
}

function getBreakpoint(breakpoints, base = 'window', containerEl) {
  if (!breakpoints || base === 'container' && !containerEl) return undefined;
  let breakpoint = false;
  const window = getWindow();
  const currentHeight = base === 'window' ? window.innerHeight : containerEl.clientHeight;
  const points = Object.keys(breakpoints).map(point => {
    if (typeof point === 'string' && point.indexOf('@') === 0) {
      const minRatio = parseFloat(point.substr(1));
      const value = currentHeight * minRatio;
      return {
        value,
        point
      };
    }
    return {
      value: point,
      point
    };
  });
  points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
  for (let i = 0; i < points.length; i += 1) {
    const {
      point,
      value
    } = points[i];
    if (base === 'window') {
      if (window.matchMedia(`(min-width: ${value}px)`).matches) {
        breakpoint = point;
      }
    } else if (value <= containerEl.clientWidth) {
      breakpoint = point;
    }
  }
  return breakpoint || 'max';
}

var breakpoints = {
  setBreakpoint,
  getBreakpoint
};

function prepareClasses(entries, prefix) {
  const resultClasses = [];
  entries.forEach(item => {
    if (typeof item === 'object') {
      Object.keys(item).forEach(classNames => {
        if (item[classNames]) {
          resultClasses.push(prefix + classNames);
        }
      });
    } else if (typeof item === 'string') {
      resultClasses.push(prefix + item);
    }
  });
  return resultClasses;
}
function addClasses() {
  const swiper = this;
  const {
    classNames,
    params,
    rtl,
    el,
    device
  } = swiper;
  // prettier-ignore
  const suffixes = prepareClasses(['initialized', params.direction, {
    'free-mode': swiper.params.freeMode && params.freeMode.enabled
  }, {
    'autoheight': params.autoHeight
  }, {
    'rtl': rtl
  }, {
    'grid': params.grid && params.grid.rows > 1
  }, {
    'grid-column': params.grid && params.grid.rows > 1 && params.grid.fill === 'column'
  }, {
    'android': device.android
  }, {
    'ios': device.ios
  }, {
    'css-mode': params.cssMode
  }, {
    'centered': params.cssMode && params.centeredSlides
  }, {
    'watch-progress': params.watchSlidesProgress
  }], params.containerModifierClass);
  classNames.push(...suffixes);
  el.classList.add(...classNames);
  swiper.emitContainerClasses();
}

function removeClasses() {
  const swiper = this;
  const {
    el,
    classNames
  } = swiper;
  el.classList.remove(...classNames);
  swiper.emitContainerClasses();
}

var classes = {
  addClasses,
  removeClasses
};

function checkOverflow() {
  const swiper = this;
  const {
    isLocked: wasLocked,
    params
  } = swiper;
  const {
    slidesOffsetBefore
  } = params;
  if (slidesOffsetBefore) {
    const lastSlideIndex = swiper.slides.length - 1;
    const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
    swiper.isLocked = swiper.size > lastSlideRightEdge;
  } else {
    swiper.isLocked = swiper.snapGrid.length === 1;
  }
  if (params.allowSlideNext === true) {
    swiper.allowSlideNext = !swiper.isLocked;
  }
  if (params.allowSlidePrev === true) {
    swiper.allowSlidePrev = !swiper.isLocked;
  }
  if (wasLocked && wasLocked !== swiper.isLocked) {
    swiper.isEnd = false;
  }
  if (wasLocked !== swiper.isLocked) {
    swiper.emit(swiper.isLocked ? 'lock' : 'unlock');
  }
}
var checkOverflow$1 = {
  checkOverflow
};

var defaults = {
  init: true,
  direction: 'horizontal',
  oneWayMovement: false,
  touchEventsTarget: 'wrapper',
  initialSlide: 0,
  speed: 300,
  cssMode: false,
  updateOnWindowResize: true,
  resizeObserver: true,
  nested: false,
  createElements: false,
  enabled: true,
  focusableElements: 'input, select, option, textarea, button, video, label',
  // Overrides
  width: null,
  height: null,
  //
  preventInteractionOnTransition: false,
  // ssr
  userAgent: null,
  url: null,
  // To support iOS's swipe-to-go-back gesture (when being used in-app).
  edgeSwipeDetection: false,
  edgeSwipeThreshold: 20,
  // Autoheight
  autoHeight: false,
  // Set wrapper width
  setWrapperSize: false,
  // Virtual Translate
  virtualTranslate: false,
  // Effects
  effect: 'slide',
  // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'

  // Breakpoints
  breakpoints: undefined,
  breakpointsBase: 'window',
  // Slides grid
  spaceBetween: 0,
  slidesPerView: 1,
  slidesPerGroup: 1,
  slidesPerGroupSkip: 0,
  slidesPerGroupAuto: false,
  centeredSlides: false,
  centeredSlidesBounds: false,
  slidesOffsetBefore: 0,
  // in px
  slidesOffsetAfter: 0,
  // in px
  normalizeSlideIndex: true,
  centerInsufficientSlides: false,
  // Disable swiper and hide navigation when container not overflow
  watchOverflow: true,
  // Round length
  roundLengths: false,
  // Touches
  touchRatio: 1,
  touchAngle: 45,
  simulateTouch: true,
  shortSwipes: true,
  longSwipes: true,
  longSwipesRatio: 0.5,
  longSwipesMs: 300,
  followFinger: true,
  allowTouchMove: true,
  threshold: 5,
  touchMoveStopPropagation: false,
  touchStartPreventDefault: true,
  touchStartForcePreventDefault: false,
  touchReleaseOnEdges: false,
  // Unique Navigation Elements
  uniqueNavElements: true,
  // Resistance
  resistance: true,
  resistanceRatio: 0.85,
  // Progress
  watchSlidesProgress: false,
  // Cursor
  grabCursor: false,
  // Clicks
  preventClicks: true,
  preventClicksPropagation: true,
  slideToClickedSlide: false,
  // loop
  loop: false,
  loopedSlides: null,
  loopPreventsSliding: true,
  // rewind
  rewind: false,
  // Swiping/no swiping
  allowSlidePrev: true,
  allowSlideNext: true,
  swipeHandler: null,
  // '.swipe-handler',
  noSwiping: true,
  noSwipingClass: 'swiper-no-swiping',
  noSwipingSelector: null,
  // Passive Listeners
  passiveListeners: true,
  maxBackfaceHiddenSlides: 10,
  // NS
  containerModifierClass: 'swiper-',
  // NEW
  slideClass: 'swiper-slide',
  slideActiveClass: 'swiper-slide-active',
  slideVisibleClass: 'swiper-slide-visible',
  slideNextClass: 'swiper-slide-next',
  slidePrevClass: 'swiper-slide-prev',
  wrapperClass: 'swiper-wrapper',
  lazyPreloaderClass: 'swiper-lazy-preloader',
  lazyPreloadPrevNext: 0,
  // Callbacks
  runCallbacksOnInit: true,
  // Internals
  _emitClasses: false
};

function moduleExtendParams(params, allModulesParams) {
  return function extendParams(obj = {}) {
    const moduleParamName = Object.keys(obj)[0];
    const moduleParams = obj[moduleParamName];
    if (typeof moduleParams !== 'object' || moduleParams === null) {
      extend(allModulesParams, obj);
      return;
    }
    if (['navigation', 'pagination', 'scrollbar'].indexOf(moduleParamName) >= 0 && params[moduleParamName] === true) {
      params[moduleParamName] = {
        auto: true
      };
    }
    if (!(moduleParamName in params && 'enabled' in moduleParams)) {
      extend(allModulesParams, obj);
      return;
    }
    if (params[moduleParamName] === true) {
      params[moduleParamName] = {
        enabled: true
      };
    }
    if (typeof params[moduleParamName] === 'object' && !('enabled' in params[moduleParamName])) {
      params[moduleParamName].enabled = true;
    }
    if (!params[moduleParamName]) params[moduleParamName] = {
      enabled: false
    };
    extend(allModulesParams, obj);
  };
}

/* eslint no-param-reassign: "off" */
const prototypes = {
  eventsEmitter,
  update,
  translate,
  transition,
  slide,
  loop,
  grabCursor,
  events: events$1,
  breakpoints,
  checkOverflow: checkOverflow$1,
  classes
};
const extendedDefaults = {};
class Swiper {
  constructor(...args) {
    let el;
    let params;
    if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === 'Object') {
      params = args[0];
    } else {
      [el, params] = args;
    }
    if (!params) params = {};
    params = extend({}, params);
    if (el && !params.el) params.el = el;
    const document = getDocument();
    if (params.el && typeof params.el === 'string' && document.querySelectorAll(params.el).length > 1) {
      const swipers = [];
      document.querySelectorAll(params.el).forEach(containerEl => {
        const newParams = extend({}, params, {
          el: containerEl
        });
        swipers.push(new Swiper(newParams));
      });
      // eslint-disable-next-line no-constructor-return
      return swipers;
    }

    // Swiper Instance
    const swiper = this;
    swiper.__swiper__ = true;
    swiper.support = getSupport();
    swiper.device = getDevice({
      userAgent: params.userAgent
    });
    swiper.browser = getBrowser();
    swiper.eventsListeners = {};
    swiper.eventsAnyListeners = [];
    swiper.modules = [...swiper.__modules__];
    if (params.modules && Array.isArray(params.modules)) {
      swiper.modules.push(...params.modules);
    }
    const allModulesParams = {};
    swiper.modules.forEach(mod => {
      mod({
        params,
        swiper,
        extendParams: moduleExtendParams(params, allModulesParams),
        on: swiper.on.bind(swiper),
        once: swiper.once.bind(swiper),
        off: swiper.off.bind(swiper),
        emit: swiper.emit.bind(swiper)
      });
    });

    // Extend defaults with modules params
    const swiperParams = extend({}, defaults, allModulesParams);

    // Extend defaults with passed params
    swiper.params = extend({}, swiperParams, extendedDefaults, params);
    swiper.originalParams = extend({}, swiper.params);
    swiper.passedParams = extend({}, params);

    // add event listeners
    if (swiper.params && swiper.params.on) {
      Object.keys(swiper.params.on).forEach(eventName => {
        swiper.on(eventName, swiper.params.on[eventName]);
      });
    }
    if (swiper.params && swiper.params.onAny) {
      swiper.onAny(swiper.params.onAny);
    }

    // Extend Swiper
    Object.assign(swiper, {
      enabled: swiper.params.enabled,
      el,
      // Classes
      classNames: [],
      // Slides
      slides: [],
      slidesGrid: [],
      snapGrid: [],
      slidesSizesGrid: [],
      // isDirection
      isHorizontal() {
        return swiper.params.direction === 'horizontal';
      },
      isVertical() {
        return swiper.params.direction === 'vertical';
      },
      // Indexes
      activeIndex: 0,
      realIndex: 0,
      //
      isBeginning: true,
      isEnd: false,
      // Props
      translate: 0,
      previousTranslate: 0,
      progress: 0,
      velocity: 0,
      animating: false,
      cssOverflowAdjustment() {
        // Returns 0 unless `translate` is > 2**23
        // Should be subtracted from css values to prevent overflow
        return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
      },
      // Locks
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev,
      // Touch Events
      touchEventsData: {
        isTouched: undefined,
        isMoved: undefined,
        allowTouchCallbacks: undefined,
        touchStartTime: undefined,
        isScrolling: undefined,
        currentTranslate: undefined,
        startTranslate: undefined,
        allowThresholdMove: undefined,
        // Form elements to match
        focusableElements: swiper.params.focusableElements,
        // Last click time
        lastClickTime: 0,
        clickTimeout: undefined,
        // Velocities
        velocities: [],
        allowMomentumBounce: undefined,
        startMoving: undefined,
        evCache: []
      },
      // Clicks
      allowClick: true,
      // Touches
      allowTouchMove: swiper.params.allowTouchMove,
      touches: {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        diff: 0
      },
      // Images
      imagesToLoad: [],
      imagesLoaded: 0
    });
    swiper.emit('_swiper');

    // Init
    if (swiper.params.init) {
      swiper.init();
    }

    // Return app instance
    // eslint-disable-next-line no-constructor-return
    return swiper;
  }
  getSlideIndex(slideEl) {
    const {
      slidesEl,
      params
    } = this;
    const slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
    const firstSlideIndex = elementIndex(slides[0]);
    return elementIndex(slideEl) - firstSlideIndex;
  }
  getSlideIndexByData(index) {
    return this.getSlideIndex(this.slides.filter(slideEl => slideEl.getAttribute('data-swiper-slide-index') * 1 === index)[0]);
  }
  recalcSlides() {
    const swiper = this;
    const {
      slidesEl,
      params
    } = swiper;
    swiper.slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
  }
  enable() {
    const swiper = this;
    if (swiper.enabled) return;
    swiper.enabled = true;
    if (swiper.params.grabCursor) {
      swiper.setGrabCursor();
    }
    swiper.emit('enable');
  }
  disable() {
    const swiper = this;
    if (!swiper.enabled) return;
    swiper.enabled = false;
    if (swiper.params.grabCursor) {
      swiper.unsetGrabCursor();
    }
    swiper.emit('disable');
  }
  setProgress(progress, speed) {
    const swiper = this;
    progress = Math.min(Math.max(progress, 0), 1);
    const min = swiper.minTranslate();
    const max = swiper.maxTranslate();
    const current = (max - min) * progress + min;
    swiper.translateTo(current, typeof speed === 'undefined' ? 0 : speed);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  emitContainerClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el) return;
    const cls = swiper.el.className.split(' ').filter(className => {
      return className.indexOf('swiper') === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
    });
    swiper.emit('_containerClasses', cls.join(' '));
  }
  getSlideClasses(slideEl) {
    const swiper = this;
    if (swiper.destroyed) return '';
    return slideEl.className.split(' ').filter(className => {
      return className.indexOf('swiper-slide') === 0 || className.indexOf(swiper.params.slideClass) === 0;
    }).join(' ');
  }
  emitSlidesClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el) return;
    const updates = [];
    swiper.slides.forEach(slideEl => {
      const classNames = swiper.getSlideClasses(slideEl);
      updates.push({
        slideEl,
        classNames
      });
      swiper.emit('_slideClass', slideEl, classNames);
    });
    swiper.emit('_slideClasses', updates);
  }
  slidesPerViewDynamic(view = 'current', exact = false) {
    const swiper = this;
    const {
      params,
      slides,
      slidesGrid,
      slidesSizesGrid,
      size: swiperSize,
      activeIndex
    } = swiper;
    let spv = 1;
    if (params.centeredSlides) {
      let slideSize = slides[activeIndex] ? slides[activeIndex].swiperSlideSize : 0;
      let breakLoop;
      for (let i = activeIndex + 1; i < slides.length; i += 1) {
        if (slides[i] && !breakLoop) {
          slideSize += slides[i].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize) breakLoop = true;
        }
      }
      for (let i = activeIndex - 1; i >= 0; i -= 1) {
        if (slides[i] && !breakLoop) {
          slideSize += slides[i].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize) breakLoop = true;
        }
      }
    } else {
      // eslint-disable-next-line
      if (view === 'current') {
        for (let i = activeIndex + 1; i < slides.length; i += 1) {
          const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      } else {
        // previous
        for (let i = activeIndex - 1; i >= 0; i -= 1) {
          const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      }
    }
    return spv;
  }
  update() {
    const swiper = this;
    if (!swiper || swiper.destroyed) return;
    const {
      snapGrid,
      params
    } = swiper;
    // Breakpoints
    if (params.breakpoints) {
      swiper.setBreakpoint();
    }
    [...swiper.el.querySelectorAll('[loading="lazy"]')].forEach(imageEl => {
      if (imageEl.complete) {
        processLazyPreloader(swiper, imageEl);
      }
    });
    swiper.updateSize();
    swiper.updateSlides();
    swiper.updateProgress();
    swiper.updateSlidesClasses();
    function setTranslate() {
      const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
      const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
      swiper.setTranslate(newTranslate);
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    let translated;
    if (params.freeMode && params.freeMode.enabled && !params.cssMode) {
      setTranslate();
      if (params.autoHeight) {
        swiper.updateAutoHeight();
      }
    } else {
      if ((params.slidesPerView === 'auto' || params.slidesPerView > 1) && swiper.isEnd && !params.centeredSlides) {
        const slides = swiper.virtual && params.virtual.enabled ? swiper.virtual.slides : swiper.slides;
        translated = swiper.slideTo(slides.length - 1, 0, false, true);
      } else {
        translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
      }
      if (!translated) {
        setTranslate();
      }
    }
    if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }
    swiper.emit('update');
  }
  changeDirection(newDirection, needUpdate = true) {
    const swiper = this;
    const currentDirection = swiper.params.direction;
    if (!newDirection) {
      // eslint-disable-next-line
      newDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
    }
    if (newDirection === currentDirection || newDirection !== 'horizontal' && newDirection !== 'vertical') {
      return swiper;
    }
    swiper.el.classList.remove(`${swiper.params.containerModifierClass}${currentDirection}`);
    swiper.el.classList.add(`${swiper.params.containerModifierClass}${newDirection}`);
    swiper.emitContainerClasses();
    swiper.params.direction = newDirection;
    swiper.slides.forEach(slideEl => {
      if (newDirection === 'vertical') {
        slideEl.style.width = '';
      } else {
        slideEl.style.height = '';
      }
    });
    swiper.emit('changeDirection');
    if (needUpdate) swiper.update();
    return swiper;
  }
  changeLanguageDirection(direction) {
    const swiper = this;
    if (swiper.rtl && direction === 'rtl' || !swiper.rtl && direction === 'ltr') return;
    swiper.rtl = direction === 'rtl';
    swiper.rtlTranslate = swiper.params.direction === 'horizontal' && swiper.rtl;
    if (swiper.rtl) {
      swiper.el.classList.add(`${swiper.params.containerModifierClass}rtl`);
      swiper.el.dir = 'rtl';
    } else {
      swiper.el.classList.remove(`${swiper.params.containerModifierClass}rtl`);
      swiper.el.dir = 'ltr';
    }
    swiper.update();
  }
  mount(element) {
    const swiper = this;
    if (swiper.mounted) return true;

    // Find el
    let el = element || swiper.params.el;
    if (typeof el === 'string') {
      el = document.querySelector(el);
    }
    if (!el) {
      return false;
    }
    el.swiper = swiper;
    if (el.shadowEl) {
      swiper.isElement = true;
    }
    const getWrapperSelector = () => {
      return `.${(swiper.params.wrapperClass || '').trim().split(' ').join('.')}`;
    };
    const getWrapper = () => {
      if (el && el.shadowRoot && el.shadowRoot.querySelector) {
        const res = el.shadowRoot.querySelector(getWrapperSelector());
        // Children needs to return slot items
        return res;
      }
      return elementChildren(el, getWrapperSelector())[0];
    };
    // Find Wrapper
    let wrapperEl = getWrapper();
    if (!wrapperEl && swiper.params.createElements) {
      wrapperEl = createElement('div', swiper.params.wrapperClass);
      el.append(wrapperEl);
      elementChildren(el, `.${swiper.params.slideClass}`).forEach(slideEl => {
        wrapperEl.append(slideEl);
      });
    }
    Object.assign(swiper, {
      el,
      wrapperEl,
      slidesEl: swiper.isElement ? el : wrapperEl,
      mounted: true,
      // RTL
      rtl: el.dir.toLowerCase() === 'rtl' || elementStyle(el, 'direction') === 'rtl',
      rtlTranslate: swiper.params.direction === 'horizontal' && (el.dir.toLowerCase() === 'rtl' || elementStyle(el, 'direction') === 'rtl'),
      wrongRTL: elementStyle(wrapperEl, 'display') === '-webkit-box'
    });
    return true;
  }
  init(el) {
    const swiper = this;
    if (swiper.initialized) return swiper;
    const mounted = swiper.mount(el);
    if (mounted === false) return swiper;
    swiper.emit('beforeInit');

    // Set breakpoint
    if (swiper.params.breakpoints) {
      swiper.setBreakpoint();
    }

    // Add Classes
    swiper.addClasses();

    // Update size
    swiper.updateSize();

    // Update slides
    swiper.updateSlides();
    if (swiper.params.watchOverflow) {
      swiper.checkOverflow();
    }

    // Set Grab Cursor
    if (swiper.params.grabCursor && swiper.enabled) {
      swiper.setGrabCursor();
    }

    // Slide To Initial Slide
    if (swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
      swiper.slideTo(swiper.params.initialSlide + swiper.virtual.slidesBefore, 0, swiper.params.runCallbacksOnInit, false, true);
    } else {
      swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
    }

    // Create loop
    if (swiper.params.loop) {
      swiper.loopCreate();
    }

    // Attach events
    swiper.attachEvents();
    [...swiper.el.querySelectorAll('[loading="lazy"]')].forEach(imageEl => {
      if (imageEl.complete) {
        processLazyPreloader(swiper, imageEl);
      } else {
        imageEl.addEventListener('load', e => {
          processLazyPreloader(swiper, e.target);
        });
      }
    });
    preload(swiper);

    // Init Flag
    swiper.initialized = true;
    preload(swiper);

    // Emit
    swiper.emit('init');
    swiper.emit('afterInit');
    return swiper;
  }
  destroy(deleteInstance = true, cleanStyles = true) {
    const swiper = this;
    const {
      params,
      el,
      wrapperEl,
      slides
    } = swiper;
    if (typeof swiper.params === 'undefined' || swiper.destroyed) {
      return null;
    }
    swiper.emit('beforeDestroy');

    // Init Flag
    swiper.initialized = false;

    // Detach events
    swiper.detachEvents();

    // Destroy loop
    if (params.loop) {
      swiper.loopDestroy();
    }

    // Cleanup styles
    if (cleanStyles) {
      swiper.removeClasses();
      el.removeAttribute('style');
      wrapperEl.removeAttribute('style');
      if (slides && slides.length) {
        slides.forEach(slideEl => {
          slideEl.classList.remove(params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
          slideEl.removeAttribute('style');
          slideEl.removeAttribute('data-swiper-slide-index');
        });
      }
    }
    swiper.emit('destroy');

    // Detach emitter events
    Object.keys(swiper.eventsListeners).forEach(eventName => {
      swiper.off(eventName);
    });
    if (deleteInstance !== false) {
      swiper.el.swiper = null;
      deleteProps(swiper);
    }
    swiper.destroyed = true;
    return null;
  }
  static extendDefaults(newDefaults) {
    extend(extendedDefaults, newDefaults);
  }
  static get extendedDefaults() {
    return extendedDefaults;
  }
  static get defaults() {
    return defaults;
  }
  static installModule(mod) {
    if (!Swiper.prototype.__modules__) Swiper.prototype.__modules__ = [];
    const modules = Swiper.prototype.__modules__;
    if (typeof mod === 'function' && modules.indexOf(mod) < 0) {
      modules.push(mod);
    }
  }
  static use(module) {
    if (Array.isArray(module)) {
      module.forEach(m => Swiper.installModule(m));
      return Swiper;
    }
    Swiper.installModule(module);
    return Swiper;
  }
}
Object.keys(prototypes).forEach(prototypeGroup => {
  Object.keys(prototypes[prototypeGroup]).forEach(protoMethod => {
    Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
  });
});
Swiper.use([Resize, Observer]);

/* eslint-disable consistent-return */
function Mousewheel({
  swiper,
  extendParams,
  on,
  emit
}) {
  const window = getWindow();
  extendParams({
    mousewheel: {
      enabled: false,
      releaseOnEdges: false,
      invert: false,
      forceToAxis: false,
      sensitivity: 1,
      eventsTarget: 'container',
      thresholdDelta: null,
      thresholdTime: null,
      noMousewheelClass: 'swiper-no-mousewheel'
    }
  });
  swiper.mousewheel = {
    enabled: false
  };
  let timeout;
  let lastScrollTime = now();
  let lastEventBeforeSnap;
  const recentWheelEvents = [];
  function normalize(e) {
    // Reasonable defaults
    const PIXEL_STEP = 10;
    const LINE_HEIGHT = 40;
    const PAGE_HEIGHT = 800;
    let sX = 0;
    let sY = 0; // spinX, spinY
    let pX = 0;
    let pY = 0; // pixelX, pixelY

    // Legacy
    if ('detail' in e) {
      sY = e.detail;
    }
    if ('wheelDelta' in e) {
      sY = -e.wheelDelta / 120;
    }
    if ('wheelDeltaY' in e) {
      sY = -e.wheelDeltaY / 120;
    }
    if ('wheelDeltaX' in e) {
      sX = -e.wheelDeltaX / 120;
    }

    // side scrolling on FF with DOMMouseScroll
    if ('axis' in e && e.axis === e.HORIZONTAL_AXIS) {
      sX = sY;
      sY = 0;
    }
    pX = sX * PIXEL_STEP;
    pY = sY * PIXEL_STEP;
    if ('deltaY' in e) {
      pY = e.deltaY;
    }
    if ('deltaX' in e) {
      pX = e.deltaX;
    }
    if (e.shiftKey && !pX) {
      // if user scrolls with shift he wants horizontal scroll
      pX = pY;
      pY = 0;
    }
    if ((pX || pY) && e.deltaMode) {
      if (e.deltaMode === 1) {
        // delta in LINE units
        pX *= LINE_HEIGHT;
        pY *= LINE_HEIGHT;
      } else {
        // delta in PAGE units
        pX *= PAGE_HEIGHT;
        pY *= PAGE_HEIGHT;
      }
    }

    // Fall-back if spin cannot be determined
    if (pX && !sX) {
      sX = pX < 1 ? -1 : 1;
    }
    if (pY && !sY) {
      sY = pY < 1 ? -1 : 1;
    }
    return {
      spinX: sX,
      spinY: sY,
      pixelX: pX,
      pixelY: pY
    };
  }
  function handleMouseEnter() {
    if (!swiper.enabled) return;
    swiper.mouseEntered = true;
  }
  function handleMouseLeave() {
    if (!swiper.enabled) return;
    swiper.mouseEntered = false;
  }
  function animateSlider(newEvent) {
    if (swiper.params.mousewheel.thresholdDelta && newEvent.delta < swiper.params.mousewheel.thresholdDelta) {
      // Prevent if delta of wheel scroll delta is below configured threshold
      return false;
    }
    if (swiper.params.mousewheel.thresholdTime && now() - lastScrollTime < swiper.params.mousewheel.thresholdTime) {
      // Prevent if time between scrolls is below configured threshold
      return false;
    }

    // If the movement is NOT big enough and
    // if the last time the user scrolled was too close to the current one (avoid continuously triggering the slider):
    //   Don't go any further (avoid insignificant scroll movement).
    if (newEvent.delta >= 6 && now() - lastScrollTime < 60) {
      // Return false as a default
      return true;
    }
    // If user is scrolling towards the end:
    //   If the slider hasn't hit the latest slide or
    //   if the slider is a loop and
    //   if the slider isn't moving right now:
    //     Go to next slide and
    //     emit a scroll event.
    // Else (the user is scrolling towards the beginning) and
    // if the slider hasn't hit the first slide or
    // if the slider is a loop and
    // if the slider isn't moving right now:
    //   Go to prev slide and
    //   emit a scroll event.
    if (newEvent.direction < 0) {
      if ((!swiper.isEnd || swiper.params.loop) && !swiper.animating) {
        swiper.slideNext();
        emit('scroll', newEvent.raw);
      }
    } else if ((!swiper.isBeginning || swiper.params.loop) && !swiper.animating) {
      swiper.slidePrev();
      emit('scroll', newEvent.raw);
    }
    // If you got here is because an animation has been triggered so store the current time
    lastScrollTime = new window.Date().getTime();
    // Return false as a default
    return false;
  }
  function releaseScroll(newEvent) {
    const params = swiper.params.mousewheel;
    if (newEvent.direction < 0) {
      if (swiper.isEnd && !swiper.params.loop && params.releaseOnEdges) {
        // Return true to animate scroll on edges
        return true;
      }
    } else if (swiper.isBeginning && !swiper.params.loop && params.releaseOnEdges) {
      // Return true to animate scroll on edges
      return true;
    }
    return false;
  }
  function handle(event) {
    let e = event;
    let disableParentSwiper = true;
    if (!swiper.enabled) return;

    // Ignore event if the target or its parents have the swiper-no-mousewheel class
    if (event.target.closest(`.${swiper.params.mousewheel.noMousewheelClass}`)) return;
    const params = swiper.params.mousewheel;
    if (swiper.params.cssMode) {
      e.preventDefault();
    }
    let targetEl = swiper.el;
    if (swiper.params.mousewheel.eventsTarget !== 'container') {
      targetEl = document.querySelector(swiper.params.mousewheel.eventsTarget);
    }
    const targetElContainsTarget = targetEl && targetEl.contains(e.target);
    if (!swiper.mouseEntered && !targetElContainsTarget && !params.releaseOnEdges) return true;
    if (e.originalEvent) e = e.originalEvent; // jquery fix
    let delta = 0;
    const rtlFactor = swiper.rtlTranslate ? -1 : 1;
    const data = normalize(e);
    if (params.forceToAxis) {
      if (swiper.isHorizontal()) {
        if (Math.abs(data.pixelX) > Math.abs(data.pixelY)) delta = -data.pixelX * rtlFactor;else return true;
      } else if (Math.abs(data.pixelY) > Math.abs(data.pixelX)) delta = -data.pixelY;else return true;
    } else {
      delta = Math.abs(data.pixelX) > Math.abs(data.pixelY) ? -data.pixelX * rtlFactor : -data.pixelY;
    }
    if (delta === 0) return true;
    if (params.invert) delta = -delta;

    // Get the scroll positions
    let positions = swiper.getTranslate() + delta * params.sensitivity;
    if (positions >= swiper.minTranslate()) positions = swiper.minTranslate();
    if (positions <= swiper.maxTranslate()) positions = swiper.maxTranslate();

    // When loop is true:
    //     the disableParentSwiper will be true.
    // When loop is false:
    //     if the scroll positions is not on edge,
    //     then the disableParentSwiper will be true.
    //     if the scroll on edge positions,
    //     then the disableParentSwiper will be false.
    disableParentSwiper = swiper.params.loop ? true : !(positions === swiper.minTranslate() || positions === swiper.maxTranslate());
    if (disableParentSwiper && swiper.params.nested) e.stopPropagation();
    if (!swiper.params.freeMode || !swiper.params.freeMode.enabled) {
      // Register the new event in a variable which stores the relevant data
      const newEvent = {
        time: now(),
        delta: Math.abs(delta),
        direction: Math.sign(delta),
        raw: event
      };

      // Keep the most recent events
      if (recentWheelEvents.length >= 2) {
        recentWheelEvents.shift(); // only store the last N events
      }

      const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
      recentWheelEvents.push(newEvent);

      // If there is at least one previous recorded event:
      //   If direction has changed or
      //   if the scroll is quicker than the previous one:
      //     Animate the slider.
      // Else (this is the first time the wheel is moved):
      //     Animate the slider.
      if (prevEvent) {
        if (newEvent.direction !== prevEvent.direction || newEvent.delta > prevEvent.delta || newEvent.time > prevEvent.time + 150) {
          animateSlider(newEvent);
        }
      } else {
        animateSlider(newEvent);
      }

      // If it's time to release the scroll:
      //   Return now so you don't hit the preventDefault.
      if (releaseScroll(newEvent)) {
        return true;
      }
    } else {
      // Freemode or scrollContainer:

      // If we recently snapped after a momentum scroll, then ignore wheel events
      // to give time for the deceleration to finish. Stop ignoring after 500 msecs
      // or if it's a new scroll (larger delta or inverse sign as last event before
      // an end-of-momentum snap).
      const newEvent = {
        time: now(),
        delta: Math.abs(delta),
        direction: Math.sign(delta)
      };
      const ignoreWheelEvents = lastEventBeforeSnap && newEvent.time < lastEventBeforeSnap.time + 500 && newEvent.delta <= lastEventBeforeSnap.delta && newEvent.direction === lastEventBeforeSnap.direction;
      if (!ignoreWheelEvents) {
        lastEventBeforeSnap = undefined;
        let position = swiper.getTranslate() + delta * params.sensitivity;
        const wasBeginning = swiper.isBeginning;
        const wasEnd = swiper.isEnd;
        if (position >= swiper.minTranslate()) position = swiper.minTranslate();
        if (position <= swiper.maxTranslate()) position = swiper.maxTranslate();
        swiper.setTransition(0);
        swiper.setTranslate(position);
        swiper.updateProgress();
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
        if (!wasBeginning && swiper.isBeginning || !wasEnd && swiper.isEnd) {
          swiper.updateSlidesClasses();
        }
        if (swiper.params.loop) {
          swiper.loopFix({
            direction: newEvent.direction < 0 ? 'next' : 'prev',
            byMousewheel: true
          });
        }
        if (swiper.params.freeMode.sticky) {
          // When wheel scrolling starts with sticky (aka snap) enabled, then detect
          // the end of a momentum scroll by storing recent (N=15?) wheel events.
          // 1. do all N events have decreasing or same (absolute value) delta?
          // 2. did all N events arrive in the last M (M=500?) msecs?
          // 3. does the earliest event have an (absolute value) delta that's
          //    at least P (P=1?) larger than the most recent event's delta?
          // 4. does the latest event have a delta that's smaller than Q (Q=6?) pixels?
          // If 1-4 are "yes" then we're near the end of a momentum scroll deceleration.
          // Snap immediately and ignore remaining wheel events in this scroll.
          // See comment above for "remaining wheel events in this scroll" determination.
          // If 1-4 aren't satisfied, then wait to snap until 500ms after the last event.
          clearTimeout(timeout);
          timeout = undefined;
          if (recentWheelEvents.length >= 15) {
            recentWheelEvents.shift(); // only store the last N events
          }

          const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
          const firstEvent = recentWheelEvents[0];
          recentWheelEvents.push(newEvent);
          if (prevEvent && (newEvent.delta > prevEvent.delta || newEvent.direction !== prevEvent.direction)) {
            // Increasing or reverse-sign delta means the user started scrolling again. Clear the wheel event log.
            recentWheelEvents.splice(0);
          } else if (recentWheelEvents.length >= 15 && newEvent.time - firstEvent.time < 500 && firstEvent.delta - newEvent.delta >= 1 && newEvent.delta <= 6) {
            // We're at the end of the deceleration of a momentum scroll, so there's no need
            // to wait for more events. Snap ASAP on the next tick.
            // Also, because there's some remaining momentum we'll bias the snap in the
            // direction of the ongoing scroll because it's better UX for the scroll to snap
            // in the same direction as the scroll instead of reversing to snap.  Therefore,
            // if it's already scrolled more than 20% in the current direction, keep going.
            const snapToThreshold = delta > 0 ? 0.8 : 0.2;
            lastEventBeforeSnap = newEvent;
            recentWheelEvents.splice(0);
            timeout = nextTick(() => {
              swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
            }, 0); // no delay; move on next tick
          }

          if (!timeout) {
            // if we get here, then we haven't detected the end of a momentum scroll, so
            // we'll consider a scroll "complete" when there haven't been any wheel events
            // for 500ms.
            timeout = nextTick(() => {
              const snapToThreshold = 0.5;
              lastEventBeforeSnap = newEvent;
              recentWheelEvents.splice(0);
              swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
            }, 500);
          }
        }

        // Emit event
        if (!ignoreWheelEvents) emit('scroll', e);

        // Stop autoplay
        if (swiper.params.autoplay && swiper.params.autoplayDisableOnInteraction) swiper.autoplay.stop();
        // Return page scroll on edge positions
        if (position === swiper.minTranslate() || position === swiper.maxTranslate()) return true;
      }
    }
    if (e.preventDefault) e.preventDefault();else e.returnValue = false;
    return false;
  }
  function events(method) {
    let targetEl = swiper.el;
    if (swiper.params.mousewheel.eventsTarget !== 'container') {
      targetEl = document.querySelector(swiper.params.mousewheel.eventsTarget);
    }
    targetEl[method]('mouseenter', handleMouseEnter);
    targetEl[method]('mouseleave', handleMouseLeave);
    targetEl[method]('wheel', handle);
  }
  function enable() {
    if (swiper.params.cssMode) {
      swiper.wrapperEl.removeEventListener('wheel', handle);
      return true;
    }
    if (swiper.mousewheel.enabled) return false;
    events('addEventListener');
    swiper.mousewheel.enabled = true;
    return true;
  }
  function disable() {
    if (swiper.params.cssMode) {
      swiper.wrapperEl.addEventListener(event, handle);
      return true;
    }
    if (!swiper.mousewheel.enabled) return false;
    events('removeEventListener');
    swiper.mousewheel.enabled = false;
    return true;
  }
  on('init', () => {
    if (!swiper.params.mousewheel.enabled && swiper.params.cssMode) {
      disable();
    }
    if (swiper.params.mousewheel.enabled) enable();
  });
  on('destroy', () => {
    if (swiper.params.cssMode) {
      enable();
    }
    if (swiper.mousewheel.enabled) disable();
  });
  Object.assign(swiper.mousewheel, {
    enable,
    disable
  });
}

function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
  if (swiper.params.createElements) {
    Object.keys(checkProps).forEach(key => {
      if (!params[key] && params.auto === true) {
        let element = elementChildren(swiper.el, `.${checkProps[key]}`)[0];
        if (!element) {
          element = createElement('div', checkProps[key]);
          element.className = checkProps[key];
          swiper.el.append(element);
        }
        params[key] = element;
        originalParams[key] = element;
      }
    });
  }
  return params;
}

function Navigation({
  swiper,
  extendParams,
  on,
  emit
}) {
  extendParams({
    navigation: {
      nextEl: null,
      prevEl: null,
      hideOnClick: false,
      disabledClass: 'swiper-button-disabled',
      hiddenClass: 'swiper-button-hidden',
      lockClass: 'swiper-button-lock',
      navigationDisabledClass: 'swiper-navigation-disabled'
    }
  });
  swiper.navigation = {
    nextEl: null,
    prevEl: null
  };
  const makeElementsArray = el => {
    if (!Array.isArray(el)) el = [el].filter(e => !!e);
    return el;
  };
  function getEl(el) {
    let res;
    if (el && typeof el === 'string' && swiper.isElement) {
      res = swiper.el.shadowRoot.querySelector(el);
      if (res) return res;
    }
    if (el) {
      if (typeof el === 'string') res = [...document.querySelectorAll(el)];
      if (swiper.params.uniqueNavElements && typeof el === 'string' && res.length > 1 && swiper.el.querySelectorAll(el).length === 1) {
        res = swiper.el.querySelector(el);
      }
    }
    if (el && !res) return el;
    // if (Array.isArray(res) && res.length === 1) res = res[0];
    return res;
  }
  function toggleEl(el, disabled) {
    const params = swiper.params.navigation;
    el = makeElementsArray(el);
    el.forEach(subEl => {
      if (subEl) {
        subEl.classList[disabled ? 'add' : 'remove'](...params.disabledClass.split(' '));
        if (subEl.tagName === 'BUTTON') subEl.disabled = disabled;
        if (swiper.params.watchOverflow && swiper.enabled) {
          subEl.classList[swiper.isLocked ? 'add' : 'remove'](params.lockClass);
        }
      }
    });
  }
  function update() {
    // Update Navigation Buttons
    const {
      nextEl,
      prevEl
    } = swiper.navigation;
    if (swiper.params.loop) {
      toggleEl(prevEl, false);
      toggleEl(nextEl, false);
      return;
    }
    toggleEl(prevEl, swiper.isBeginning && !swiper.params.rewind);
    toggleEl(nextEl, swiper.isEnd && !swiper.params.rewind);
  }
  function onPrevClick(e) {
    e.preventDefault();
    if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
    swiper.slidePrev();
    emit('navigationPrev');
  }
  function onNextClick(e) {
    e.preventDefault();
    if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
    swiper.slideNext();
    emit('navigationNext');
  }
  function init() {
    const params = swiper.params.navigation;
    swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
      nextEl: 'swiper-button-next',
      prevEl: 'swiper-button-prev'
    });
    if (!(params.nextEl || params.prevEl)) return;
    let nextEl = getEl(params.nextEl);
    let prevEl = getEl(params.prevEl);
    Object.assign(swiper.navigation, {
      nextEl,
      prevEl
    });
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    const initButton = (el, dir) => {
      if (el) {
        el.addEventListener('click', dir === 'next' ? onNextClick : onPrevClick);
      }
      if (!swiper.enabled && el) {
        el.classList.add(...params.lockClass.split(' '));
      }
    };
    nextEl.forEach(el => initButton(el, 'next'));
    prevEl.forEach(el => initButton(el, 'prev'));
  }
  function destroy() {
    let {
      nextEl,
      prevEl
    } = swiper.navigation;
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    const destroyButton = (el, dir) => {
      el.removeEventListener('click', dir === 'next' ? onNextClick : onPrevClick);
      el.classList.remove(...swiper.params.navigation.disabledClass.split(' '));
    };
    nextEl.forEach(el => destroyButton(el, 'next'));
    prevEl.forEach(el => destroyButton(el, 'prev'));
  }
  on('init', () => {
    if (swiper.params.navigation.enabled === false) {
      // eslint-disable-next-line
      disable();
    } else {
      init();
      update();
    }
  });
  on('toEdge fromEdge lock unlock', () => {
    update();
  });
  on('destroy', () => {
    destroy();
  });
  on('enable disable', () => {
    let {
      nextEl,
      prevEl
    } = swiper.navigation;
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    [...nextEl, ...prevEl].filter(el => !!el).forEach(el => el.classList[swiper.enabled ? 'remove' : 'add'](swiper.params.navigation.lockClass));
  });
  on('click', (_s, e) => {
    let {
      nextEl,
      prevEl
    } = swiper.navigation;
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    const targetEl = e.target;
    if (swiper.params.navigation.hideOnClick && !prevEl.includes(targetEl) && !nextEl.includes(targetEl)) {
      if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
      let isHidden;
      if (nextEl.length) {
        isHidden = nextEl[0].classList.contains(swiper.params.navigation.hiddenClass);
      } else if (prevEl.length) {
        isHidden = prevEl[0].classList.contains(swiper.params.navigation.hiddenClass);
      }
      if (isHidden === true) {
        emit('navigationShow');
      } else {
        emit('navigationHide');
      }
      [...nextEl, ...prevEl].filter(el => !!el).forEach(el => el.classList.toggle(swiper.params.navigation.hiddenClass));
    }
  });
  const enable = () => {
    swiper.el.classList.remove(...swiper.params.navigation.navigationDisabledClass.split(' '));
    init();
    update();
  };
  const disable = () => {
    swiper.el.classList.add(...swiper.params.navigation.navigationDisabledClass.split(' '));
    destroy();
  };
  Object.assign(swiper.navigation, {
    enable,
    disable,
    update,
    init,
    destroy
  });
}

function freeMode({
  swiper,
  extendParams,
  emit,
  once
}) {
  extendParams({
    freeMode: {
      enabled: false,
      momentum: true,
      momentumRatio: 1,
      momentumBounce: true,
      momentumBounceRatio: 1,
      momentumVelocityRatio: 1,
      sticky: false,
      minimumVelocity: 0.02
    }
  });
  function onTouchStart() {
    if (swiper.params.cssMode) return;
    const translate = swiper.getTranslate();
    swiper.setTranslate(translate);
    swiper.setTransition(0);
    swiper.touchEventsData.velocities.length = 0;
    swiper.freeMode.onTouchEnd({
      currentPos: swiper.rtl ? swiper.translate : -swiper.translate
    });
  }
  function onTouchMove() {
    if (swiper.params.cssMode) return;
    const {
      touchEventsData: data,
      touches
    } = swiper;
    // Velocity
    if (data.velocities.length === 0) {
      data.velocities.push({
        position: touches[swiper.isHorizontal() ? 'startX' : 'startY'],
        time: data.touchStartTime
      });
    }
    data.velocities.push({
      position: touches[swiper.isHorizontal() ? 'currentX' : 'currentY'],
      time: now()
    });
  }
  function onTouchEnd({
    currentPos
  }) {
    if (swiper.params.cssMode) return;
    const {
      params,
      wrapperEl,
      rtlTranslate: rtl,
      snapGrid,
      touchEventsData: data
    } = swiper;
    // Time diff
    const touchEndTime = now();
    const timeDiff = touchEndTime - data.touchStartTime;
    if (currentPos < -swiper.minTranslate()) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    if (currentPos > -swiper.maxTranslate()) {
      if (swiper.slides.length < snapGrid.length) {
        swiper.slideTo(snapGrid.length - 1);
      } else {
        swiper.slideTo(swiper.slides.length - 1);
      }
      return;
    }
    if (params.freeMode.momentum) {
      if (data.velocities.length > 1) {
        const lastMoveEvent = data.velocities.pop();
        const velocityEvent = data.velocities.pop();
        const distance = lastMoveEvent.position - velocityEvent.position;
        const time = lastMoveEvent.time - velocityEvent.time;
        swiper.velocity = distance / time;
        swiper.velocity /= 2;
        if (Math.abs(swiper.velocity) < params.freeMode.minimumVelocity) {
          swiper.velocity = 0;
        }
        // this implies that the user stopped moving a finger then released.
        // There would be no events with distance zero, so the last event is stale.
        if (time > 150 || now() - lastMoveEvent.time > 300) {
          swiper.velocity = 0;
        }
      } else {
        swiper.velocity = 0;
      }
      swiper.velocity *= params.freeMode.momentumVelocityRatio;
      data.velocities.length = 0;
      let momentumDuration = 1000 * params.freeMode.momentumRatio;
      const momentumDistance = swiper.velocity * momentumDuration;
      let newPosition = swiper.translate + momentumDistance;
      if (rtl) newPosition = -newPosition;
      let doBounce = false;
      let afterBouncePosition;
      const bounceAmount = Math.abs(swiper.velocity) * 20 * params.freeMode.momentumBounceRatio;
      let needsLoopFix;
      if (newPosition < swiper.maxTranslate()) {
        if (params.freeMode.momentumBounce) {
          if (newPosition + swiper.maxTranslate() < -bounceAmount) {
            newPosition = swiper.maxTranslate() - bounceAmount;
          }
          afterBouncePosition = swiper.maxTranslate();
          doBounce = true;
          data.allowMomentumBounce = true;
        } else {
          newPosition = swiper.maxTranslate();
        }
        if (params.loop && params.centeredSlides) needsLoopFix = true;
      } else if (newPosition > swiper.minTranslate()) {
        if (params.freeMode.momentumBounce) {
          if (newPosition - swiper.minTranslate() > bounceAmount) {
            newPosition = swiper.minTranslate() + bounceAmount;
          }
          afterBouncePosition = swiper.minTranslate();
          doBounce = true;
          data.allowMomentumBounce = true;
        } else {
          newPosition = swiper.minTranslate();
        }
        if (params.loop && params.centeredSlides) needsLoopFix = true;
      } else if (params.freeMode.sticky) {
        let nextSlide;
        for (let j = 0; j < snapGrid.length; j += 1) {
          if (snapGrid[j] > -newPosition) {
            nextSlide = j;
            break;
          }
        }
        if (Math.abs(snapGrid[nextSlide] - newPosition) < Math.abs(snapGrid[nextSlide - 1] - newPosition) || swiper.swipeDirection === 'next') {
          newPosition = snapGrid[nextSlide];
        } else {
          newPosition = snapGrid[nextSlide - 1];
        }
        newPosition = -newPosition;
      }
      if (needsLoopFix) {
        once('transitionEnd', () => {
          swiper.loopFix();
        });
      }
      // Fix duration
      if (swiper.velocity !== 0) {
        if (rtl) {
          momentumDuration = Math.abs((-newPosition - swiper.translate) / swiper.velocity);
        } else {
          momentumDuration = Math.abs((newPosition - swiper.translate) / swiper.velocity);
        }
        if (params.freeMode.sticky) {
          // If freeMode.sticky is active and the user ends a swipe with a slow-velocity
          // event, then durations can be 20+ seconds to slide one (or zero!) slides.
          // It's easy to see this when simulating touch with mouse events. To fix this,
          // limit single-slide swipes to the default slide duration. This also has the
          // nice side effect of matching slide speed if the user stopped moving before
          // lifting finger or mouse vs. moving slowly before lifting the finger/mouse.
          // For faster swipes, also apply limits (albeit higher ones).
          const moveDistance = Math.abs((rtl ? -newPosition : newPosition) - swiper.translate);
          const currentSlideSize = swiper.slidesSizesGrid[swiper.activeIndex];
          if (moveDistance < currentSlideSize) {
            momentumDuration = params.speed;
          } else if (moveDistance < 2 * currentSlideSize) {
            momentumDuration = params.speed * 1.5;
          } else {
            momentumDuration = params.speed * 2.5;
          }
        }
      } else if (params.freeMode.sticky) {
        swiper.slideToClosest();
        return;
      }
      if (params.freeMode.momentumBounce && doBounce) {
        swiper.updateProgress(afterBouncePosition);
        swiper.setTransition(momentumDuration);
        swiper.setTranslate(newPosition);
        swiper.transitionStart(true, swiper.swipeDirection);
        swiper.animating = true;
        elementTransitionEnd(wrapperEl, () => {
          if (!swiper || swiper.destroyed || !data.allowMomentumBounce) return;
          emit('momentumBounce');
          swiper.setTransition(params.speed);
          setTimeout(() => {
            swiper.setTranslate(afterBouncePosition);
            elementTransitionEnd(wrapperEl, () => {
              if (!swiper || swiper.destroyed) return;
              swiper.transitionEnd();
            });
          }, 0);
        });
      } else if (swiper.velocity) {
        emit('_freeModeNoMomentumRelease');
        swiper.updateProgress(newPosition);
        swiper.setTransition(momentumDuration);
        swiper.setTranslate(newPosition);
        swiper.transitionStart(true, swiper.swipeDirection);
        if (!swiper.animating) {
          swiper.animating = true;
          elementTransitionEnd(wrapperEl, () => {
            if (!swiper || swiper.destroyed) return;
            swiper.transitionEnd();
          });
        }
      } else {
        swiper.updateProgress(newPosition);
      }
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    } else if (params.freeMode.sticky) {
      swiper.slideToClosest();
      return;
    } else if (params.freeMode) {
      emit('_freeModeNoMomentumRelease');
    }
    if (!params.freeMode.momentum || timeDiff >= params.longSwipesMs) {
      swiper.updateProgress();
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
  }
  Object.assign(swiper, {
    freeMode: {
      onTouchStart,
      onTouchMove,
      onTouchEnd
    }
  });
}

/**
 * Hook for swiper automount
 */



const DEFAULT_OPTIONS = {
    modules: [Navigation, freeMode, Mousewheel],
    // grabCursor: true,
    slidesPerView: "auto",
    freeMode: {
        enabled: true,
        sticky: true,
    },
    mousewheel: {
        releaseOnEdges: false,
    },
};





function initiateSwiper(el)
{

    const instance = new Swiper(el, {
        navigation: {
            nextEl: el.nextElementSibling
        },
        ...DEFAULT_OPTIONS
    });


    instance.on('touchMove', () => el.classList.add('moving'));
    instance.on('touchEnd', () => el.classList.remove('moving'));


    return {
        destroy()
        {
            instance.destroy();
        }
    };
}

/* src\components\sliders\Movies.svelte generated by Svelte v3.59.1 */
const file$2 = "src\\components\\sliders\\Movies.svelte";

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i];
	return child_ctx;
}

function get_each_context_1$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i];
	return child_ctx;
}

// (18:0) {#if notfound.length}
function create_if_block_1$1(ctx) {
	let div4;
	let h3;
	let t1;
	let div3;
	let div1;
	let div0;
	let t2;
	let div2;
	let i;
	let mounted;
	let dispose;
	let each_value_1 = /*notfound*/ ctx[1];
	validate_each_argument(each_value_1);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
	}

	const block = {
		c: function create() {
			div4 = element("div");
			h3 = element("h3");
			h3.textContent = "Les Films - A trouver";
			t1 = space();
			div3 = element("div");
			div1 = element("div");
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t2 = space();
			div2 = element("div");
			i = element("i");
			attr_dev(h3, "class", "my-3");
			add_location(h3, file$2, 19, 8, 571);
			attr_dev(div0, "class", "swiper-wrapper d-flex");
			add_location(div0, file$2, 23, 16, 770);
			attr_dev(div1, "class", "swiper overflow-x-scroll");
			add_location(div1, file$2, 22, 12, 703);
			attr_dev(i, "class", "ng-chevron-right");
			attr_dev(i, "size", "32");
			add_location(i, file$2, 42, 16, 1626);
			attr_dev(div2, "class", "chevron-next");
			add_location(div2, file$2, 41, 12, 1582);
			attr_dev(div3, "class", "d-flex align-items-center justify-content-between");
			add_location(div3, file$2, 21, 8, 626);
			attr_dev(div4, "class", "section mx-auto mb-3 px-lg-3");
			add_location(div4, file$2, 18, 4, 519);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div4, anchor);
			append_dev(div4, h3);
			append_dev(div4, t1);
			append_dev(div4, div3);
			append_dev(div3, div1);
			append_dev(div1, div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div0, null);
				}
			}

			append_dev(div3, t2);
			append_dev(div3, div2);
			append_dev(div2, i);

			if (!mounted) {
				dispose = action_destroyer(initiateSwiper.call(null, div1));
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*notfound*/ 2) {
				each_value_1 = /*notfound*/ ctx[1];
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div0, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div4);
			destroy_each(each_blocks, detaching);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$1.name,
		type: "if",
		source: "(18:0) {#if notfound.length}",
		ctx
	});

	return block;
}

// (25:20) {#each notfound as item}
function create_each_block_1$1(ctx) {
	let div1;
	let div0;
	let a;
	let img;
	let img_src_value;
	let a_href_value;
	let t;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			a = element("a");
			img = element("img");
			t = space();
			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[4].cover.w780)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "Film à deviner");
			add_location(img, file$2, 29, 36, 1166);
			attr_dev(a, "href", a_href_value = "/movies/" + /*item*/ ctx[4].id);
			add_location(a, file$2, 28, 32, 1090);
			attr_dev(div0, "class", "poster flat m-2 not-found");
			add_location(div0, file$2, 26, 28, 933);
			attr_dev(div1, "class", "swiper-slide");
			add_location(div1, file$2, 25, 24, 877);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			append_dev(div0, a);
			append_dev(a, img);
			append_dev(div1, t);

			if (!mounted) {
				dispose = [
					action_destroyer(/*onload*/ ctx[2].call(null, img)),
					action_destroyer(links.call(null, a))
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*notfound*/ 2 && !src_url_equal(img.src, img_src_value = /*item*/ ctx[4].cover.w780)) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*notfound*/ 2 && a_href_value !== (a_href_value = "/movies/" + /*item*/ ctx[4].id)) {
				attr_dev(a, "href", a_href_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$1.name,
		type: "each",
		source: "(25:20) {#each notfound as item}",
		ctx
	});

	return block;
}

// (48:0) {#if found.length}
function create_if_block$2(ctx) {
	let div4;
	let h3;
	let t1;
	let div3;
	let div1;
	let div0;
	let t2;
	let div2;
	let i;
	let mounted;
	let dispose;
	let each_value = /*found*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div4 = element("div");
			h3 = element("h3");
			h3.textContent = "Les Films - Trouvés";
			t1 = space();
			div3 = element("div");
			div1 = element("div");
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t2 = space();
			div2 = element("div");
			i = element("i");
			attr_dev(h3, "class", "my-3 px-0");
			add_location(h3, file$2, 49, 8, 1799);
			attr_dev(div0, "class", "swiper-wrapper d-flex");
			add_location(div0, file$2, 52, 16, 1999);
			attr_dev(div1, "class", "swiper overflow-x-scroll");
			add_location(div1, file$2, 51, 12, 1932);
			attr_dev(i, "class", "ng-chevron-right");
			attr_dev(i, "size", "32");
			add_location(i, file$2, 71, 16, 2816);
			attr_dev(div2, "class", "chevron-next");
			add_location(div2, file$2, 70, 12, 2772);
			attr_dev(div3, "class", "d-flex align-items-center justify-content-between");
			add_location(div3, file$2, 50, 8, 1855);
			attr_dev(div4, "class", "section mx-auto mb-3 px-lg-3");
			add_location(div4, file$2, 48, 4, 1747);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div4, anchor);
			append_dev(div4, h3);
			append_dev(div4, t1);
			append_dev(div4, div3);
			append_dev(div3, div1);
			append_dev(div1, div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div0, null);
				}
			}

			append_dev(div3, t2);
			append_dev(div3, div2);
			append_dev(div2, i);

			if (!mounted) {
				dispose = action_destroyer(initiateSwiper.call(null, div1));
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*found*/ 1) {
				each_value = /*found*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div0, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div4);
			destroy_each(each_blocks, detaching);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$2.name,
		type: "if",
		source: "(48:0) {#if found.length}",
		ctx
	});

	return block;
}

// (54:20) {#each found as item}
function create_each_block$1(ctx) {
	let div2;
	let div1;
	let div0;
	let t0_value = /*item*/ ctx[4].title + "";
	let t0;
	let t1;
	let a;
	let img;
	let img_src_value;
	let a_href_value;
	let t2;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div2 = element("div");
			div1 = element("div");
			div0 = element("div");
			t0 = text(t0_value);
			t1 = space();
			a = element("a");
			img = element("img");
			t2 = space();
			attr_dev(div0, "class", "title");
			add_location(div0, file$2, 56, 32, 2217);
			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[4].poster.w342)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "Poster du film");
			add_location(img, file$2, 58, 36, 2355);
			attr_dev(a, "href", a_href_value = "/details/" + /*item*/ ctx[4].id);
			add_location(a, file$2, 57, 32, 2288);
			attr_dev(div1, "class", "poster m-2");
			add_location(div1, file$2, 55, 28, 2159);
			attr_dev(div2, "class", "swiper-slide");
			add_location(div2, file$2, 54, 24, 2103);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div1);
			append_dev(div1, div0);
			append_dev(div0, t0);
			append_dev(div1, t1);
			append_dev(div1, a);
			append_dev(a, img);
			append_dev(div2, t2);

			if (!mounted) {
				dispose = action_destroyer(/*onload*/ ctx[2].call(null, img));
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*found*/ 1 && t0_value !== (t0_value = /*item*/ ctx[4].title + "")) set_data_dev(t0, t0_value);

			if (dirty & /*found*/ 1 && !src_url_equal(img.src, img_src_value = /*item*/ ctx[4].poster.w342)) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*found*/ 1 && a_href_value !== (a_href_value = "/details/" + /*item*/ ctx[4].id)) {
				attr_dev(a, "href", a_href_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$1.name,
		type: "each",
		source: "(54:20) {#each found as item}",
		ctx
	});

	return block;
}

function create_fragment$3(ctx) {
	let t;
	let if_block1_anchor;
	let if_block0 = /*notfound*/ ctx[1].length && create_if_block_1$1(ctx);
	let if_block1 = /*found*/ ctx[0].length && create_if_block$2(ctx);

	const block = {
		c: function create() {
			if (if_block0) if_block0.c();
			t = space();
			if (if_block1) if_block1.c();
			if_block1_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block0) if_block0.m(target, anchor);
			insert_dev(target, t, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert_dev(target, if_block1_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*notfound*/ ctx[1].length) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_1$1(ctx);
					if_block0.c();
					if_block0.m(t.parentNode, t);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*found*/ ctx[0].length) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block$2(ctx);
					if_block1.c();
					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},
		i: noop$1,
		o: noop$1,
		d: function destroy(detaching) {
			if (if_block0) if_block0.d(detaching);
			if (detaching) detach_dev(t);
			if (if_block1) if_block1.d(detaching);
			if (detaching) detach_dev(if_block1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$3.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$3($$self, $$props, $$invalidate) {
	let $movies;
	validate_store(movies, 'movies');
	component_subscribe($$self, movies, $$value => $$invalidate(3, $movies = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Movies', slots, []);
	let found = [], notfound = [];
	const { onload } = createResourceLoader(noop$1);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Movies> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		links,
		movies,
		getFound,
		getNotFound,
		createResourceLoader,
		loading,
		swiper: initiateSwiper,
		noop: noop$1,
		found,
		notfound,
		onload,
		$movies
	});

	$$self.$inject_state = $$props => {
		if ('found' in $$props) $$invalidate(0, found = $$props.found);
		if ('notfound' in $$props) $$invalidate(1, notfound = $$props.notfound);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$movies*/ 8) {
			$$invalidate(0, found = getFound($movies));
		}

		if ($$self.$$.dirty & /*$movies*/ 8) {
			$$invalidate(1, notfound = getNotFound($movies));
		}
	};

	return [found, notfound, onload, $movies];
}

class Movies extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$3, create_fragment$3, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Movies",
			options,
			id: create_fragment$3.name
		});
	}
}

/* src\components\sliders\Series.svelte generated by Svelte v3.59.1 */
const file$1 = "src\\components\\sliders\\Series.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i];
	return child_ctx;
}

// (17:0) {#if notfound.length}
function create_if_block_1(ctx) {
	let div4;
	let h3;
	let t1;
	let div3;
	let div1;
	let div0;
	let t2;
	let div2;
	let i;
	let mounted;
	let dispose;
	let each_value_1 = /*notfound*/ ctx[1];
	validate_each_argument(each_value_1);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	const block = {
		c: function create() {
			div4 = element("div");
			h3 = element("h3");
			h3.textContent = "Les Séries - A trouver";
			t1 = space();
			div3 = element("div");
			div1 = element("div");
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t2 = space();
			div2 = element("div");
			i = element("i");
			attr_dev(h3, "class", "my-3");
			add_location(h3, file$1, 18, 8, 539);
			attr_dev(div0, "class", "swiper-wrapper d-flex");
			add_location(div0, file$1, 22, 16, 735);
			attr_dev(div1, "class", "swiper overflow-x-scroll");
			add_location(div1, file$1, 21, 12, 669);
			attr_dev(i, "class", "ng-chevron-right");
			attr_dev(i, "size", "32");
			add_location(i, file$1, 41, 16, 1569);
			attr_dev(div2, "class", "chevron-next");
			add_location(div2, file$1, 40, 12, 1526);
			attr_dev(div3, "class", "d-flex align-items-center justify-content-between");
			add_location(div3, file$1, 20, 8, 593);
			attr_dev(div4, "class", "section mx-auto mb-3 px-lg-3");
			add_location(div4, file$1, 17, 4, 488);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div4, anchor);
			append_dev(div4, h3);
			append_dev(div4, t1);
			append_dev(div4, div3);
			append_dev(div3, div1);
			append_dev(div1, div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div0, null);
				}
			}

			append_dev(div3, t2);
			append_dev(div3, div2);
			append_dev(div2, i);

			if (!mounted) {
				dispose = action_destroyer(initiateSwiper.call(null, div1));
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*notfound*/ 2) {
				each_value_1 = /*notfound*/ ctx[1];
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div0, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div4);
			destroy_each(each_blocks, detaching);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(17:0) {#if notfound.length}",
		ctx
	});

	return block;
}

// (24:20) {#each notfound as item}
function create_each_block_1(ctx) {
	let div1;
	let div0;
	let a;
	let img;
	let img_src_value;
	let a_href_value;
	let t;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			a = element("a");
			img = element("img");
			t = space();
			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[4].cover.w780)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "Série à deviner");
			add_location(img, file$1, 28, 36, 1121);
			attr_dev(a, "href", a_href_value = "/tv/" + /*item*/ ctx[4].id);
			add_location(a, file$1, 27, 32, 1050);
			attr_dev(div0, "class", "poster flat m-2 not-found");
			add_location(div0, file$1, 25, 28, 895);
			attr_dev(div1, "class", "swiper-slide");
			add_location(div1, file$1, 24, 24, 840);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			append_dev(div0, a);
			append_dev(a, img);
			append_dev(div1, t);

			if (!mounted) {
				dispose = [
					action_destroyer(/*onload*/ ctx[2].call(null, img)),
					action_destroyer(links.call(null, a))
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*notfound*/ 2 && !src_url_equal(img.src, img_src_value = /*item*/ ctx[4].cover.w780)) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*notfound*/ 2 && a_href_value !== (a_href_value = "/tv/" + /*item*/ ctx[4].id)) {
				attr_dev(a, "href", a_href_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1.name,
		type: "each",
		source: "(24:20) {#each notfound as item}",
		ctx
	});

	return block;
}

// (47:0) {#if found.length}
function create_if_block$1(ctx) {
	let div4;
	let h3;
	let t1;
	let div3;
	let div1;
	let div0;
	let t2;
	let div2;
	let i;
	let mounted;
	let dispose;
	let each_value = /*found*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div4 = element("div");
			h3 = element("h3");
			h3.textContent = "Les Séries - Trouvées";
			t1 = space();
			div3 = element("div");
			div1 = element("div");
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t2 = space();
			div2 = element("div");
			i = element("i");
			attr_dev(h3, "class", "my-3 px-0");
			add_location(h3, file$1, 48, 8, 1735);
			attr_dev(div0, "class", "swiper-wrapper d-flex");
			add_location(div0, file$1, 51, 16, 1934);
			attr_dev(div1, "class", "swiper overflow-x-scroll");
			add_location(div1, file$1, 50, 12, 1868);
			attr_dev(i, "class", "ng-chevron-right");
			attr_dev(i, "size", "32");
			add_location(i, file$1, 70, 16, 2736);
			attr_dev(div2, "class", "chevron-next");
			add_location(div2, file$1, 69, 12, 2693);
			attr_dev(div3, "class", "d-flex align-items-center justify-content-between");
			add_location(div3, file$1, 49, 8, 1792);
			attr_dev(div4, "class", "section mx-auto mb-3 px-lg-3");
			add_location(div4, file$1, 47, 4, 1684);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div4, anchor);
			append_dev(div4, h3);
			append_dev(div4, t1);
			append_dev(div4, div3);
			append_dev(div3, div1);
			append_dev(div1, div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div0, null);
				}
			}

			append_dev(div3, t2);
			append_dev(div3, div2);
			append_dev(div2, i);

			if (!mounted) {
				dispose = action_destroyer(initiateSwiper.call(null, div1));
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*found*/ 1) {
				each_value = /*found*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div0, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div4);
			destroy_each(each_blocks, detaching);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(47:0) {#if found.length}",
		ctx
	});

	return block;
}

// (53:20) {#each found as item}
function create_each_block(ctx) {
	let div2;
	let div1;
	let div0;
	let t0_value = /*item*/ ctx[4].title + "";
	let t0;
	let t1;
	let a;
	let img;
	let img_src_value;
	let a_href_value;
	let t2;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div2 = element("div");
			div1 = element("div");
			div0 = element("div");
			t0 = text(t0_value);
			t1 = space();
			a = element("a");
			img = element("img");
			t2 = space();
			attr_dev(div0, "class", "title");
			add_location(div0, file$1, 55, 32, 2148);
			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[4].poster.w342)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "Poster de la série");
			add_location(img, file$1, 57, 36, 2284);
			attr_dev(a, "href", a_href_value = "/details/" + /*item*/ ctx[4].id);
			add_location(a, file$1, 56, 32, 2218);
			attr_dev(div1, "class", "poster m-2");
			add_location(div1, file$1, 54, 28, 2091);
			attr_dev(div2, "class", "swiper-slide");
			add_location(div2, file$1, 53, 24, 2036);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div1);
			append_dev(div1, div0);
			append_dev(div0, t0);
			append_dev(div1, t1);
			append_dev(div1, a);
			append_dev(a, img);
			append_dev(div2, t2);

			if (!mounted) {
				dispose = action_destroyer(/*onload*/ ctx[2].call(null, img));
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*found*/ 1 && t0_value !== (t0_value = /*item*/ ctx[4].title + "")) set_data_dev(t0, t0_value);

			if (dirty & /*found*/ 1 && !src_url_equal(img.src, img_src_value = /*item*/ ctx[4].poster.w342)) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*found*/ 1 && a_href_value !== (a_href_value = "/details/" + /*item*/ ctx[4].id)) {
				attr_dev(a, "href", a_href_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(53:20) {#each found as item}",
		ctx
	});

	return block;
}

function create_fragment$2(ctx) {
	let t;
	let if_block1_anchor;
	let if_block0 = /*notfound*/ ctx[1].length && create_if_block_1(ctx);
	let if_block1 = /*found*/ ctx[0].length && create_if_block$1(ctx);

	const block = {
		c: function create() {
			if (if_block0) if_block0.c();
			t = space();
			if (if_block1) if_block1.c();
			if_block1_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block0) if_block0.m(target, anchor);
			insert_dev(target, t, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert_dev(target, if_block1_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*notfound*/ ctx[1].length) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_1(ctx);
					if_block0.c();
					if_block0.m(t.parentNode, t);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*found*/ ctx[0].length) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block$1(ctx);
					if_block1.c();
					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},
		i: noop$1,
		o: noop$1,
		d: function destroy(detaching) {
			if (if_block0) if_block0.d(detaching);
			if (detaching) detach_dev(t);
			if (if_block1) if_block1.d(detaching);
			if (detaching) detach_dev(if_block1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$2.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$2($$self, $$props, $$invalidate) {
	let $tv;
	validate_store(tv, 'tv');
	component_subscribe($$self, tv, $$value => $$invalidate(3, $tv = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Series', slots, []);
	let found = [], notfound = [];
	const { onload } = createResourceLoader(noop$1);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Series> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		links,
		tv,
		getFound,
		getNotFound,
		createResourceLoader,
		loading,
		swiper: initiateSwiper,
		noop: noop$1,
		found,
		notfound,
		onload,
		$tv
	});

	$$self.$inject_state = $$props => {
		if ('found' in $$props) $$invalidate(0, found = $$props.found);
		if ('notfound' in $$props) $$invalidate(1, notfound = $$props.notfound);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$tv*/ 8) {
			$$invalidate(0, found = getFound($tv));
		}

		if ($$self.$$.dirty & /*$tv*/ 8) {
			$$invalidate(1, notfound = getNotFound($tv));
		}
	};

	return [found, notfound, onload, $tv];
}

class Series extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$2, create_fragment$2, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Series",
			options,
			id: create_fragment$2.name
		});
	}
}

/* src\pages\Home.svelte generated by Svelte v3.59.1 */

// (11:0) {#if $ready}
function create_if_block(ctx) {
	let cover;
	let t0;
	let movies;
	let t1;
	let series;
	let current;

	cover = new Cover({
			props: { item: /*$current*/ ctx[1] },
			$$inline: true
		});

	movies = new Movies({ $$inline: true });
	series = new Series({ $$inline: true });

	const block = {
		c: function create() {
			create_component(cover.$$.fragment);
			t0 = space();
			create_component(movies.$$.fragment);
			t1 = space();
			create_component(series.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(cover, target, anchor);
			insert_dev(target, t0, anchor);
			mount_component(movies, target, anchor);
			insert_dev(target, t1, anchor);
			mount_component(series, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const cover_changes = {};
			if (dirty & /*$current*/ 2) cover_changes.item = /*$current*/ ctx[1];
			cover.$set(cover_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(cover.$$.fragment, local);
			transition_in(movies.$$.fragment, local);
			transition_in(series.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(cover.$$.fragment, local);
			transition_out(movies.$$.fragment, local);
			transition_out(series.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(cover, detaching);
			if (detaching) detach_dev(t0);
			destroy_component(movies, detaching);
			if (detaching) detach_dev(t1);
			destroy_component(series, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(11:0) {#if $ready}",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*$ready*/ ctx[0] && create_if_block(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*$ready*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$ready*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$1($$self, $$props, $$invalidate) {
	let $ready;
	let $current;
	validate_store(ready, 'ready');
	component_subscribe($$self, ready, $$value => $$invalidate(0, $ready = $$value));
	validate_store(current, 'current');
	component_subscribe($$self, current, $$value => $$invalidate(1, $current = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Home', slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		onMount,
		current,
		ready,
		Cover,
		Movies,
		Series,
		$ready,
		$current
	});

	return [$ready, $current];
}

class Home extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$1, create_fragment$1, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Home",
			options,
			id: create_fragment$1.name
		});
	}
}

/* src\App.svelte generated by Svelte v3.59.1 */

const { console: console_1 } = globals;

const file = "src\\App.svelte";

// (24:8) <Route path="/">
function create_default_slot_5(ctx) {
	let home;
	let current;
	home = new Home({ $$inline: true });

	const block = {
		c: function create() {
			create_component(home.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(home, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(home.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(home.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(home, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_5.name,
		type: "slot",
		source: "(24:8) <Route path=\\\"/\\\">",
		ctx
	});

	return block;
}

// (27:8) <Route path="tv/*">
function create_default_slot_4(ctx) {
	let h1;

	const block = {
		c: function create() {
			h1 = element("h1");
			h1.textContent = "Séries";
			add_location(h1, file, 27, 12, 872);
		},
		m: function mount(target, anchor) {
			insert_dev(target, h1, anchor);
		},
		p: noop$1,
		d: function destroy(detaching) {
			if (detaching) detach_dev(h1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_4.name,
		type: "slot",
		source: "(27:8) <Route path=\\\"tv/*\\\">",
		ctx
	});

	return block;
}

// (30:8) <Route path="movies/*">
function create_default_slot_3(ctx) {
	let h1;

	const block = {
		c: function create() {
			h1 = element("h1");
			h1.textContent = "Movies";
			add_location(h1, file, 30, 12, 952);
		},
		m: function mount(target, anchor) {
			insert_dev(target, h1, anchor);
		},
		p: noop$1,
		d: function destroy(detaching) {
			if (detaching) detach_dev(h1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_3.name,
		type: "slot",
		source: "(30:8) <Route path=\\\"movies/*\\\">",
		ctx
	});

	return block;
}

// (33:8) <Route path="all/*">
function create_default_slot_2(ctx) {
	let h1;

	const block = {
		c: function create() {
			h1 = element("h1");
			h1.textContent = "All";
			add_location(h1, file, 33, 12, 1029);
		},
		m: function mount(target, anchor) {
			insert_dev(target, h1, anchor);
		},
		p: noop$1,
		d: function destroy(detaching) {
			if (detaching) detach_dev(h1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2.name,
		type: "slot",
		source: "(33:8) <Route path=\\\"all/*\\\">",
		ctx
	});

	return block;
}

// (37:8) <Route path="details/:id">
function create_default_slot_1(ctx) {
	let h1;

	const block = {
		c: function create() {
			h1 = element("h1");
			h1.textContent = "Details";
			add_location(h1, file, 37, 12, 1111);
		},
		m: function mount(target, anchor) {
			insert_dev(target, h1, anchor);
		},
		p: noop$1,
		d: function destroy(detaching) {
			if (detaching) detach_dev(h1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(37:8) <Route path=\\\"details/:id\\\">",
		ctx
	});

	return block;
}

// (21:0) <Router>
function create_default_slot(ctx) {
	let header;
	let t0;
	let main;
	let route0;
	let t1;
	let route1;
	let t2;
	let route2;
	let t3;
	let route3;
	let t4;
	let route4;
	let t5;
	let mainloader;
	let t6;
	let footer;
	let current;
	header = new Header({ $$inline: true });

	route0 = new Route$1({
			props: {
				path: "/",
				$$slots: { default: [create_default_slot_5] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	route1 = new Route$1({
			props: {
				path: "tv/*",
				$$slots: { default: [create_default_slot_4] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	route2 = new Route$1({
			props: {
				path: "movies/*",
				$$slots: { default: [create_default_slot_3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	route3 = new Route$1({
			props: {
				path: "all/*",
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	route4 = new Route$1({
			props: {
				path: "details/:id",
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	mainloader = new MainLoader({ $$inline: true });
	footer = new Footer({ $$inline: true });

	const block = {
		c: function create() {
			create_component(header.$$.fragment);
			t0 = space();
			main = element("main");
			create_component(route0.$$.fragment);
			t1 = space();
			create_component(route1.$$.fragment);
			t2 = space();
			create_component(route2.$$.fragment);
			t3 = space();
			create_component(route3.$$.fragment);
			t4 = space();
			create_component(route4.$$.fragment);
			t5 = space();
			create_component(mainloader.$$.fragment);
			t6 = space();
			create_component(footer.$$.fragment);
			attr_dev(main, "id", "app");
			add_location(main, file, 22, 4, 748);
		},
		m: function mount(target, anchor) {
			mount_component(header, target, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, main, anchor);
			mount_component(route0, main, null);
			append_dev(main, t1);
			mount_component(route1, main, null);
			append_dev(main, t2);
			mount_component(route2, main, null);
			append_dev(main, t3);
			mount_component(route3, main, null);
			append_dev(main, t4);
			mount_component(route4, main, null);
			insert_dev(target, t5, anchor);
			mount_component(mainloader, target, anchor);
			insert_dev(target, t6, anchor);
			mount_component(footer, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const route0_changes = {};

			if (dirty & /*$$scope*/ 16) {
				route0_changes.$$scope = { dirty, ctx };
			}

			route0.$set(route0_changes);
			const route1_changes = {};

			if (dirty & /*$$scope*/ 16) {
				route1_changes.$$scope = { dirty, ctx };
			}

			route1.$set(route1_changes);
			const route2_changes = {};

			if (dirty & /*$$scope*/ 16) {
				route2_changes.$$scope = { dirty, ctx };
			}

			route2.$set(route2_changes);
			const route3_changes = {};

			if (dirty & /*$$scope*/ 16) {
				route3_changes.$$scope = { dirty, ctx };
			}

			route3.$set(route3_changes);
			const route4_changes = {};

			if (dirty & /*$$scope*/ 16) {
				route4_changes.$$scope = { dirty, ctx };
			}

			route4.$set(route4_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(header.$$.fragment, local);
			transition_in(route0.$$.fragment, local);
			transition_in(route1.$$.fragment, local);
			transition_in(route2.$$.fragment, local);
			transition_in(route3.$$.fragment, local);
			transition_in(route4.$$.fragment, local);
			transition_in(mainloader.$$.fragment, local);
			transition_in(footer.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(header.$$.fragment, local);
			transition_out(route0.$$.fragment, local);
			transition_out(route1.$$.fragment, local);
			transition_out(route2.$$.fragment, local);
			transition_out(route3.$$.fragment, local);
			transition_out(route4.$$.fragment, local);
			transition_out(mainloader.$$.fragment, local);
			transition_out(footer.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(header, detaching);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(main);
			destroy_component(route0);
			destroy_component(route1);
			destroy_component(route2);
			destroy_component(route3);
			destroy_component(route4);
			if (detaching) detach_dev(t5);
			destroy_component(mainloader, detaching);
			if (detaching) detach_dev(t6);
			destroy_component(footer, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(21:0) <Router>",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let router;
	let current;

	router = new Router$1({
			props: {
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(router.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(router, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const router_changes = {};

			if (dirty & /*$$scope*/ 16) {
				router_changes.$$scope = { dirty, ctx };
			}

			router.$set(router_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(router.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(router.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(router, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props, $$invalidate) {
	let $current;
	let $rload;
	let $ready;
	let $loading;
	validate_store(current, 'current');
	component_subscribe($$self, current, $$value => $$invalidate(0, $current = $$value));
	validate_store(loading, 'rload');
	component_subscribe($$self, loading, $$value => $$invalidate(1, $rload = $$value));
	validate_store(ready, 'ready');
	component_subscribe($$self, ready, $$value => $$invalidate(2, $ready = $$value));
	validate_store(loading$1, 'loading');
	component_subscribe($$self, loading$1, $$value => $$invalidate(3, $loading = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('App', slots, []);
	watch();
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		Router: Router$1,
		Route: Route$1,
		Link: Link$1,
		loading: loading$1,
		rload: loading,
		Header,
		Footer,
		MainLoader,
		Home,
		ready,
		current,
		watchIcons: watch,
		$current,
		$rload,
		$ready,
		$loading
	});

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$ready, $rload*/ 6) {
			// magic loading screen
			set_store_value(loading$1, $loading = !$ready || $rload > 0, $loading);
		}

		if ($$self.$$.dirty & /*$current*/ 1) {
			console.debug("current", $current);
		}
	};

	return [$current, $rload, $ready];
}

class App extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "App",
			options,
			id: create_fragment.name
		});
	}
}

const app = new App({
    target: document.body,
    props: {
        // url: ''
    }
});

export { app as default };
//# sourceMappingURL=app.js.map
