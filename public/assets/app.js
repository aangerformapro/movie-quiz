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

// Track which nodes are claimed during hydration. Unclaimed nodes can then be removed from the DOM
// at the end of hydration without touching the remaining nodes.
let is_hydrating = false;
function start_hydrating() {
    is_hydrating = true;
}
function end_hydrating() {
    is_hydrating = false;
}
function upper_bound(low, high, key, value) {
    // Return first index of value larger than input value in the range [low, high)
    while (low < high) {
        const mid = low + ((high - low) >> 1);
        if (key(mid) <= value) {
            low = mid + 1;
        }
        else {
            high = mid;
        }
    }
    return low;
}
function init_hydrate(target) {
    if (target.hydrate_init)
        return;
    target.hydrate_init = true;
    // We know that all children have claim_order values since the unclaimed have been detached if target is not <head>
    let children = target.childNodes;
    // If target is <head>, there may be children without claim_order
    if (target.nodeName === 'HEAD') {
        const myChildren = [];
        for (let i = 0; i < children.length; i++) {
            const node = children[i];
            if (node.claim_order !== undefined) {
                myChildren.push(node);
            }
        }
        children = myChildren;
    }
    /*
    * Reorder claimed children optimally.
    * We can reorder claimed children optimally by finding the longest subsequence of
    * nodes that are already claimed in order and only moving the rest. The longest
    * subsequence of nodes that are claimed in order can be found by
    * computing the longest increasing subsequence of .claim_order values.
    *
    * This algorithm is optimal in generating the least amount of reorder operations
    * possible.
    *
    * Proof:
    * We know that, given a set of reordering operations, the nodes that do not move
    * always form an increasing subsequence, since they do not move among each other
    * meaning that they must be already ordered among each other. Thus, the maximal
    * set of nodes that do not move form a longest increasing subsequence.
    */
    // Compute longest increasing subsequence
    // m: subsequence length j => index k of smallest value that ends an increasing subsequence of length j
    const m = new Int32Array(children.length + 1);
    // Predecessor indices + 1
    const p = new Int32Array(children.length);
    m[0] = -1;
    let longest = 0;
    for (let i = 0; i < children.length; i++) {
        const current = children[i].claim_order;
        // Find the largest subsequence length such that it ends in a value less than our current value
        // upper_bound returns first greater value, so we subtract one
        // with fast path for when we are on the current longest subsequence
        const seqLen = ((longest > 0 && children[m[longest]].claim_order <= current) ? longest + 1 : upper_bound(1, longest, idx => children[m[idx]].claim_order, current)) - 1;
        p[i] = m[seqLen] + 1;
        const newLen = seqLen + 1;
        // We can guarantee that current is the smallest value. Otherwise, we would have generated a longer sequence.
        m[newLen] = i;
        longest = Math.max(newLen, longest);
    }
    // The longest increasing subsequence of nodes (initially reversed)
    const lis = [];
    // The rest of the nodes, nodes that will be moved
    const toMove = [];
    let last = children.length - 1;
    for (let cur = m[longest] + 1; cur != 0; cur = p[cur - 1]) {
        lis.push(children[cur - 1]);
        for (; last >= cur; last--) {
            toMove.push(children[last]);
        }
        last--;
    }
    for (; last >= 0; last--) {
        toMove.push(children[last]);
    }
    lis.reverse();
    // We sort the nodes being moved to guarantee that their insertion order matches the claim order
    toMove.sort((a, b) => a.claim_order - b.claim_order);
    // Finally, we move the nodes
    for (let i = 0, j = 0; i < toMove.length; i++) {
        while (j < lis.length && toMove[i].claim_order >= lis[j].claim_order) {
            j++;
        }
        const anchor = j < lis.length ? lis[j] : null;
        target.insertBefore(toMove[i], anchor);
    }
}
function append_hydration(target, node) {
    if (is_hydrating) {
        init_hydrate(target);
        if ((target.actual_end_child === undefined) || ((target.actual_end_child !== null) && (target.actual_end_child.parentNode !== target))) {
            target.actual_end_child = target.firstChild;
        }
        // Skip nodes of undefined ordering
        while ((target.actual_end_child !== null) && (target.actual_end_child.claim_order === undefined)) {
            target.actual_end_child = target.actual_end_child.nextSibling;
        }
        if (node !== target.actual_end_child) {
            // We only insert if the ordering of this node should be modified or the parent node is not target
            if (node.claim_order !== undefined || node.parentNode !== target) {
                target.insertBefore(node, target.actual_end_child);
            }
        }
        else {
            target.actual_end_child = node.nextSibling;
        }
    }
    else if (node.parentNode !== target || node.nextSibling !== null) {
        target.appendChild(node);
    }
}
function insert_hydration(target, node, anchor) {
    if (is_hydrating && !anchor) {
        append_hydration(target, node);
    }
    else if (node.parentNode !== target || node.nextSibling != anchor) {
        target.insertBefore(node, anchor || null);
    }
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
function svg_element(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
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
function init_claim_info(nodes) {
    if (nodes.claim_info === undefined) {
        nodes.claim_info = { last_index: 0, total_claimed: 0 };
    }
}
function claim_node(nodes, predicate, processNode, createNode, dontUpdateLastIndex = false) {
    // Try to find nodes in an order such that we lengthen the longest increasing subsequence
    init_claim_info(nodes);
    const resultNode = (() => {
        // We first try to find an element after the previous one
        for (let i = nodes.claim_info.last_index; i < nodes.length; i++) {
            const node = nodes[i];
            if (predicate(node)) {
                const replacement = processNode(node);
                if (replacement === undefined) {
                    nodes.splice(i, 1);
                }
                else {
                    nodes[i] = replacement;
                }
                if (!dontUpdateLastIndex) {
                    nodes.claim_info.last_index = i;
                }
                return node;
            }
        }
        // Otherwise, we try to find one before
        // We iterate in reverse so that we don't go too far back
        for (let i = nodes.claim_info.last_index - 1; i >= 0; i--) {
            const node = nodes[i];
            if (predicate(node)) {
                const replacement = processNode(node);
                if (replacement === undefined) {
                    nodes.splice(i, 1);
                }
                else {
                    nodes[i] = replacement;
                }
                if (!dontUpdateLastIndex) {
                    nodes.claim_info.last_index = i;
                }
                else if (replacement === undefined) {
                    // Since we spliced before the last_index, we decrease it
                    nodes.claim_info.last_index--;
                }
                return node;
            }
        }
        // If we can't find any matching node, we create a new one
        return createNode();
    })();
    resultNode.claim_order = nodes.claim_info.total_claimed;
    nodes.claim_info.total_claimed += 1;
    return resultNode;
}
function claim_element_base(nodes, name, attributes, create_element) {
    return claim_node(nodes, (node) => node.nodeName === name, (node) => {
        const remove = [];
        for (let j = 0; j < node.attributes.length; j++) {
            const attribute = node.attributes[j];
            if (!attributes[attribute.name]) {
                remove.push(attribute.name);
            }
        }
        remove.forEach(v => node.removeAttribute(v));
        return undefined;
    }, () => create_element(name));
}
function claim_element(nodes, name, attributes) {
    return claim_element_base(nodes, name, attributes, element);
}
function claim_svg_element(nodes, name, attributes) {
    return claim_element_base(nodes, name, attributes, svg_element);
}
function claim_text(nodes, data) {
    return claim_node(nodes, (node) => node.nodeType === 3, (node) => {
        const dataStr = '' + data;
        if (node.data.startsWith(dataStr)) {
            if (node.data.length !== dataStr.length) {
                return node.splitText(dataStr.length);
            }
        }
        else {
            node.data = dataStr;
        }
    }, () => text(data), true // Text nodes should not update last index since it is likely not worth it to eliminate an increasing subsequence of actual elements
    );
}
function claim_space(nodes) {
    return claim_text(nodes, ' ');
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
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
 * Schedules a callback to run immediately before the component is updated after any state change.
 *
 * The first time the callback runs will be before the initial `onMount`
 *
 * https://svelte.dev/docs#run-time-svelte-beforeupdate
 */
function beforeUpdate(fn) {
    get_current_component().$$.before_update.push(fn);
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
function claim_component(block, parent_nodes) {
    block && block.l(parent_nodes);
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
            start_hydrating();
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
        end_hydrating();
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
function append_hydration_dev(target, node) {
    dispatch_dev('SvelteDOMInsert', { target, node });
    append_hydration(target, node);
}
function insert_hydration_dev(target, node, anchor) {
    dispatch_dev('SvelteDOMInsert', { target, node, anchor });
    insert_hydration(target, node, anchor);
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
function prop_dev(node, property, value) {
    node[property] = value;
    dispatch_dev('SvelteDOMSetProperty', { node, property, value });
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

const file$i = "node_modules\\svelte-navigator\\src\\Router.svelte";

// (204:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
function create_if_block$h(ctx) {
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
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", {
				role: true,
				"aria-atomic": true,
				"aria-live": true,
				"data-svnav-announcer": true
			});

			var div_nodes = children(div);
			t = claim_text(div_nodes, /*$announcementText*/ ctx[0]);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(div, div_data);
			add_location(div, file$i, 204, 1, 6149);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div, anchor);
			append_hydration_dev(div, t);
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
		id: create_if_block$h.name,
		type: "if",
		source: "(204:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}",
		ctx
	});

	return block;
}

function create_fragment$n(ctx) {
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
	let if_block = /*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements && create_if_block$h(ctx);

	const block = {
		c: function create() {
			div = element("div");
			t0 = space();
			if (default_slot) default_slot.c();
			t1 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { "data-svnav-router": true });
			children(div).forEach(detach_dev);
			t0 = claim_space(nodes);
			if (default_slot) default_slot.l(nodes);
			t1 = claim_space(nodes);
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
			this.h();
		},
		h: function hydrate() {
			set_attributes(div, div_data);
			add_location(div, file$i, 196, 0, 5982);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div, anchor);
			insert_hydration_dev(target, t0, anchor);

			if (default_slot) {
				default_slot.m(target, anchor);
			}

			insert_hydration_dev(target, t1, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_hydration_dev(target, if_block_anchor, anchor);
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
		id: create_fragment$n.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const createId$1 = createCounter();
const defaultBasepath = "/";

function instance$p($$self, $$props, $$invalidate) {
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
			instance$p,
			create_fragment$n,
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
			id: create_fragment$n.name
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

/**
 * Access the parent Routes matched params and wildcards
 * @returns {import("svelte/store").Readable<{
     [param: string]: any;
   }>} A readable store containing the matched parameters and wildcards
 *
 * @example
  ```html
  <!--
    Somewhere inside <Route path="user/:id/*splat" />
    with a current url of "/myApp/user/123/pauls-profile"
  -->
  <script>
    import { useParams } from "svelte-navigator";

    const params = useParams();

    $: console.log($params); // -> { id: "123", splat: "pauls-profile" }
  </script>

  <h3>Welcome user {$params.id}! bleep bloop...</h3>
  ```
 */
function useParams() {
	usePreflightCheck(USE_PARAMS_ID, null, ROUTE, ROUTE_ID);
	return toReadonly(ROUTE_PARAMS);
}

/* node_modules\svelte-navigator\src\Route.svelte generated by Svelte v3.59.1 */
const file$h = "node_modules\\svelte-navigator\\src\\Route.svelte";

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
function create_if_block$g(ctx) {
	let router;
	let current;

	router = new Router$1({
			props: {
				primary: /*primary*/ ctx[1],
				$$slots: { default: [create_default_slot$4] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(router.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(router.$$.fragment, nodes);
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
		id: create_if_block$g.name,
		type: "if",
		source: "(98:0) {#if isActive}",
		ctx
	});

	return block;
}

// (114:2) {:else}
function create_else_block$4(ctx) {
	let current;
	const default_slot_template = /*#slots*/ ctx[18].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], get_default_slot_context);

	const block = {
		c: function create() {
			if (default_slot) default_slot.c();
		},
		l: function claim(nodes) {
			if (default_slot) default_slot.l(nodes);
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
		id: create_else_block$4.name,
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
		l: function claim(nodes) {
			if (switch_instance) claim_component(switch_instance.$$.fragment, nodes);
			switch_instance_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (switch_instance) mount_component(switch_instance, target, anchor);
			insert_hydration_dev(target, switch_instance_anchor, anchor);
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
function create_default_slot$4(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block_1$3, create_else_block$4];
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
		l: function claim(nodes) {
			if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_hydration_dev(target, if_block_anchor, anchor);
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
		id: create_default_slot$4.name,
		type: "slot",
		source: "(99:1) <Router {primary}>",
		ctx
	});

	return block;
}

function create_fragment$m(ctx) {
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

	let if_block = /*isActive*/ ctx[2] && create_if_block$g(ctx);

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
			this.h();
		},
		l: function claim(nodes) {
			div0 = claim_element(nodes, "DIV", { "data-svnav-route-start": true });
			children(div0).forEach(detach_dev);
			t0 = claim_space(nodes);
			if (if_block) if_block.l(nodes);
			t1 = claim_space(nodes);
			div1 = claim_element(nodes, "DIV", { "data-svnav-route-end": true });
			children(div1).forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(div0, div_data_1);
			add_location(div0, file$h, 96, 0, 2664);
			set_attributes(div1, div_data);
			add_location(div1, file$h, 122, 0, 3340);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div0, anchor);
			insert_hydration_dev(target, t0, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_hydration_dev(target, t1, anchor);
			insert_hydration_dev(target, div1, anchor);
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
					if_block = create_if_block$g(ctx);
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
		id: create_fragment$m.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const createId = createCounter();

function instance$o($$self, $$props, $$invalidate) {
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

		init$1(this, options, instance$o, create_fragment$m, safe_not_equal, {
			path: 13,
			component: 0,
			meta: 14,
			primary: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Route",
			options,
			id: create_fragment$m.name
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

/* global unsafeWindow, globalThis */



const IS_UNSAFE = typeof unsafeWindow !== 'undefined',
    IS_TOUCH = typeof ontouchstart !== 'undefined',
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
        try
        {
            return JSON.parse(value);
        } catch (error)
        {
            // fallback for invalid json data
            return value;
        }

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
 * Resolves an URL
 * 
 * @param {URL|String} url 
 * @returns {URL|undefined}
 */
function getUrl(url)
{
    if (isString(url))
    {
        const a = getUrl.a ??= createElement$1("a");
        getUrl.a.href = url;
        url = new URL(a.href);
    }


    if (url instanceof URL)
    {
        return url;
    }

}

function removeAccent(str)
{
    let accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g, // C, c
    ], noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];


    for (var i = 0; i < accent.length; i++)
    {
        str = str.replace(accent[i], noaccent[i]);
    }

    return str;
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

/**
 * LocalStorage Stubs for SSR
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Storage/key
 */


if (typeof Storage === "undefined")
{


    const Data = new Map();

    class Storage
    {
        get length()
        {
            return Data.size;
        }

        key(index)
        {
            return [...Data.keys()][index] ?? null;

        }

        clear()
        {
            Data.clear();
        }

        getItem(keyName)
        {
            return Data.get(keyName) ?? null;
        }
        setItem(keyName, keyValue)
        {
            Data.set(String(keyName), String(keyValue));
        }

        getItem(keyName)
        {
            return Data.get(keyName) ?? null;
        }

        removeItem(keyName)
        {
            Data.delete(keyName);
        }
    }

    globalThis.Storage ??= Storage;
    globalThis.localStorage ??= new Storage();
    globalThis.sessionStorage ??= new Storage();

    globalThis.addEventListener ??= () => { };
    globalThis.removeEventListener ??= () => { };
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


            addEventListener('storage', listener);

            set(this.getItem(name, defaultValue));

            return () =>
            {
                removeEventListener('storage', listener);

            };

        });

    }

}


new WebStore(); new WebStore(sessionStorage);

const
    API_PATH = '/api/1',
    BUILD_DATE = '[VI]{date}[/VI]',
    LocalStore$1 = new WebStore(localStorage, 'MovieQuiz'),
    SessionStore = new WebStore(sessionStorage, 'MovieQuiz');



/**
 * Enum for media type
 */
class MediaType extends BackedEnum
{

    static ALL = new MediaType("all");
    static MOVIE = new MediaType("movies");
    static TV = new MediaType("tv");





    get route()
    {
        return '/' + this.value;
    }

    get path()
    {
        return API_PATH + '/' + this.value + '.json';
    }

    get key()
    {
        return this.value;
    }

    get hook()
    {
        return MediaTypeMap.get(this);
    }

    get list()
    {
        return get_store_value(this.hook);
    }

    get found()
    {
        return getFound(this.list);
    }

    get notFound()
    {
        return getNotFound(this.list);
    }

}

const NOPIC = './assets/pictures/nopic.webp';


LocalStore$1.hook('todisplay', 20);






/**
 * Version control api using (clears localstorage sync for code compatibility, but keep results found)
 * @link https://www.npmjs.com/package/rollup-plugin-version-injector
 */
(() =>
{
    if (LocalStore$1.getItem('BuildDate') !== BUILD_DATE)
    {
        // DB
        LocalStore$1.removeItem(MediaType.MOVIE.key);
        LocalStore$1.removeItem(MediaType.TV.key);
        LocalStore$1.removeItem('current');

        // Session hooks
        SessionStore.removeItem('started');
        SessionStore.removeItem('streak');


        // sync
        LocalStore$1.setItem('BuildDate', BUILD_DATE);
        console.debug('Storage reset folowing base code update.');
    }

})();



/**
 * Session is new?
 * Used to play intro
 */
const SessionStarted = SessionStore.hook("started", false);

/**
 * Winning streak
 */
const WinningStreak = SessionStore.hook('streak', 0);

WinningStreak.increment = function ()
{
    this.update(n => n + 1);
};

WinningStreak.decrement = function ()
{
    this.update(n => n - 1);
};

WinningStreak.clear = function ()
{
    this.set(0);
};


/**
 * Data is Ready ?
 */
const ready = writable(false, set =>
{

    let timer, fetchingMovies, fetchingSeries;
    const listener = () =>
    {
        let value = true;
        if (!isArray(get_store_value(movies)))
        {
            value = false;
            if (!fetchingMovies)
            {
                fetchingMovies = true;
                fetch(MediaType.MOVIE.path)
                    .then(resp => resp.json())

                    .then(data =>
                    {
                        fetchingMovies = false;
                        movies.set(data);
                    });
            }
        }
        if (!isArray(get_store_value(tv)))
        {
            value = false;
            if (!fetchingSeries)
            {
                fetchingSeries = true;
                fetch(MediaType.TV.path)
                    .then(resp => resp.json())
                    .then(data =>
                    {
                        fetchingSeries = false;
                        tv.set(data);
                    });
            }
        }
        if (value)
        {
            if (!get_store_value(current))
            {
                current.set(getRandom(getNotFound(get_store_value(all)), 1)[0]);
            }
            set(value);
        }
        else
        {
            timer = setTimeout(() =>
            {
                listener();
                timer = null;
            }, 100);
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


/**
 * LocalStore data hooks
 */

const movies = LocalStore$1.hook(MediaType.MOVIE.key);
const tv = LocalStore$1.hook(MediaType.TV.key);
// export const current = LocalStore.hook('current');

const current = writable(null);
const found = LocalStore$1.hook('found', []);

/**
 * Merged series and movies
 */
const all = derived(
    [movies, tv],
    ([$movies, $tv]) => [...$movies, ...$tv]
);

movies.notFound = derived([movies, found], ([$movies, $found]) =>
{
    return $movies.filter(item => !$found.includes(item.id));
});


movies.found = derived([movies, found], ([$movies, $found]) =>
{
    return $movies.filter(item => $found.includes(item.id));
});


tv.notFound = derived([tv, found], ([$tv, $found]) =>
{
    return $tv.filter(item => !$found.includes(item.id));
});


tv.found = derived([tv, found], ([$tv, $found]) =>
{
    return $tv.filter(item => $found.includes(item.id));
});

/**
 * A map of the mediatypes hooks
 */

const MediaTypeMap = new Map([
    [MediaType.ALL, all],
    [MediaType.MOVIE, movies],
    [MediaType.TV, tv]
]);


/**
 * Notification control
 */

class Notification
{
    static NONE = new Notification(0);
    static SUCCESS = new Notification(1);
    static FAILURE = new Notification(2);

    display()
    {
        notify.set(this);
    }
}

const notify = writable(Notification.NONE, set => set(Notification.NONE));


function isFound(item)
{
    item = getEntry(item);
    return get_store_value(found).includes(item.id);
}


function setFound(item)
{
    found.update(value =>
    {
        item = isInt(item) ? item : item.id;
        if (!value.includes(item))
        {
            value.push(item);
        }
        return value;
    });
}

/**
 * Last Found / current if not
 */
function getLastFound()
{
    return getEntry(get_store_value(found).slice(-1)[0]) ?? getRandom(get_store_value(all), 1)[0];
}

function getFound(items)
{
    return items.filter(item => isFound(item));
}


function getNotFound(items)
{
    return items.filter(item => !isFound(item));
}


function getRandom(list, howMuch)
{
    if (!howMuch || !list.length || list.length < howMuch)
    {
        return list;
    }
    // do not destroy the original
    const result = [], copy = [...list];

    while (result.length < howMuch)
    {
        let index = Math.floor(Math.random() * copy.length);
        result.push(copy[index]);
        copy.splice(index, 1);
    }
    return result;
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



function getAvailableTitles(item)
{

    const result = ["we are anonymous"];
    item = getEntry(item);

    if (item && item.alt)
    {
        result.push(item.title, item.original_title, ...item.alt);
    }

    return result.map(str => removeAccent(str.toLowerCase()));
}



function getYoutubeId(item)
{

    item = getEntry(item);

    if (item && item.videos && item.videos.length)
    {
        for (let entry of item.videos)
        {
            if (entry.site.toLowerCase() === 'youtube')
            {
                return entry.key;
            }
        }
    }


    return null;
}




function getYoutubeUrl(item)
{
    let vid = getYoutubeId(item);
    return vid ? new URL('https://www.youtube.com/watch?v=' + vid) : null;
}

/**
 * @link https://support.google.com/youtube/answer/171780?hl=en#zippy=%2Cmake-an-embedded-video-play-automatically%2Cadd-captions-to-an-embedded-video%2Cturn-on-privacy-enhanced-mode
 */
function getEmbedHtml(item)
{

    let vid = getYoutubeId(item);
    if (vid)
    {
        // 960x540
        return `<iframe width="960" height="540" src="https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&cc_load_policy=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    }

    return null;
}

const validResults = derived(current, $current => getAvailableTitles($current));

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
        return instance$n.on(type, listener, options);
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
        return instance$n.one(type, listener, options);
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
        return instance$n.off(type, listener, capture);
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
        return instance$n.trigger(type, data);
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


const instance$n = new EventEmitter();

/**
 * @param {String|EventTarget} root 
 * @returns EventEmitter
 */
function emitter(root)
{
    return new EventEmitter(root);
}

instance$n.mixin(emitter);
emitter.mixin = instance$n.mixin.bind(instance$n);

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
const loading$1 = writable(0);


function createResourceLoader(fn = noop$1, triggerChange = false)
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
        loading$1.update(val => val + value);
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
const icons = {"ng-bootstrap":{"symbol":"<symbol id=\"ng-bootstrap\" xmlns=\"\" viewBox=\"0 0 128 128\">\n\n<defs><linearGradient id=\"bootstrap-original-wordmark-a\" x1=\"76.079\" x2=\"523.48\" y1=\"10.798\" y2=\"365.95\" gradientTransform=\"translate(1.11 2.051) scale(.24566)\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#9013fe\" offset=\"0\"></stop><stop stop-color=\"#6610f2\" offset=\"1\"></stop></linearGradient><linearGradient id=\"bootstrap-original-wordmark-b\" x1=\"193.51\" x2=\"293.51\" y1=\"109.74\" y2=\"278.87\" gradientTransform=\"translate(0 52)\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#fff\" offset=\"0\"></stop><stop stop-color=\"#f1e5fc\" offset=\"1\"></stop></linearGradient><filter id=\"bootstrap-original-wordmark-c\" x=\"161.9\" y=\"135.46\" width=\"197\" height=\"249\" color-interpolation-filters=\"sRGB\" filterUnits=\"userSpaceOnUse\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feColorMatrix in=\"SourceAlpha\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\"></feColorMatrix><feOffset dy=\"4\"></feOffset><feGaussianBlur stdDeviation=\"8\"></feGaussianBlur><feColorMatrix values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0\"></feColorMatrix><feBlend in2=\"BackgroundImageFix\" result=\"effect1_dropShadow\"></feBlend><feBlend in=\"SourceGraphic\" in2=\"effect1_dropShadow\" result=\"shape\"></feBlend></filter></defs>\n<path d=\"M14.985 15.15c-.237-6.815 5.072-13.099 12.249-13.099h73.54c7.177 0 12.486 6.284 12.249 13.099-.228 6.546.068 15.026 2.202 21.94 2.141 6.936 5.751 11.319 11.664 11.883v6.387c-5.913.563-9.523 4.947-11.664 11.883-2.134 6.914-2.43 15.394-2.202 21.94.237 6.815-5.072 13.098-12.249 13.098h-73.54c-7.177 0-12.486-6.284-12.249-13.098.228-6.546-.068-15.026-2.203-21.94-2.14-6.935-5.76-11.319-11.673-11.883v-6.387c5.913-.563 9.533-4.947 11.673-11.883 2.135-6.914 2.43-15.394 2.203-21.94z\" fill=\"url(#bootstrap-original-wordmark-a)\"></path>\n<path transform=\"translate(1.494 -10.359) scale(.24566)\" d=\"M267.1 364.46c47.297 0 75.798-23.158 75.798-61.355 0-28.873-20.336-49.776-50.532-53.085v-1.203c22.185-3.609 39.594-24.211 39.594-47.219 0-32.783-25.882-54.138-65.322-54.138h-88.74v217zm-54.692-189.48h45.911c24.958 0 39.131 11.128 39.131 31.279 0 21.505-16.484 33.535-46.372 33.535h-38.67zm0 161.96v-71.431h45.602c32.661 0 49.608 12.03 49.608 35.49 0 23.459-16.484 35.941-47.605 35.941z\" fill=\"url(#bootstrap-original-wordmark-b)\" filter=\"url(#bootstrap-original-wordmark-c)\" stroke=\"#fff\"></path>\n<text x=\"9.073\" y=\"121.431\" fill=\"#7952b3\" font-family=\"'Segoe UI'\" font-size=\"25.333\" style=\"font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal;line-height:1.25\"><tspan x=\"9.073\" y=\"121.431\" style=\"font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal\">Bootstrap</tspan></text>\n\n\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-bootstrap\"></use></svg>"},"ng-cancel":{"symbol":"<symbol id=\"ng-cancel\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m330-288 150-150 150 150 42-42-150-150 150-150-42-42-150 150-150-150-42 42 150 150-150 150 42 42ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-cancel\"></use></svg>"},"ng-check-circle":{"symbol":"<symbol id=\"ng-check-circle\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m421-298 283-283-46-45-237 237-120-120-45 45 165 166Zm59 218q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-check-circle\"></use></svg>"},"ng-chevron-right":{"symbol":"<symbol id=\"ng-chevron-right\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m375-240-43-43 198-198-198-198 43-43 241 241-241 241Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-chevron-right\"></use></svg>"},"ng-close":{"symbol":"<symbol id=\"ng-close\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-close\"></use></svg>"},"ng-devicon":{"symbol":"<symbol id=\"ng-devicon\" xmlns=\"\" viewBox=\"0 0 128 128\">\n\n<path d=\"M12.118 26.77l9.01 77.084 43.328 22.049V26.77z\" fill=\"#558d6c\"></path>\n<path d=\"M64.456 26.77v99.133l.044.044 43.346-22.058 8.947-77.119z\" fill=\"#5aa579\"></path>\n<path d=\"M24.45 39.265l5.749 57.717 34.257 16.541V39.265z\" fill=\"#60be86\"></path>\n<path d=\"M64.456 39.265v74.258l.044.045 34.274-16.613 5.688-57.69z\" fill=\"#65d693\"></path>\n<path d=\"M101.414 68.3L72.552 54.593l-1.62-.797-.993 2.019-5.483 11.166v13.185l8.105-16.01 19.047 8.475-20.455 9.182-.771.416v9.635l2.046-1 29.04-13.894a1.772 1.771 0 00.814-1.772V70.08a1.772 1.771 0 00-.868-1.78z\" fill=\"#5aa579\"></path>\n<path d=\"M57.369 81.131l-19.304-8.5 20.641-9.183 1.56-.62v-9.705l-3.013 1.275-30.057 13.894a2.002 2.001 0 00-1.134 1.77v5.11a1.967 1.966 0 001.098 1.77l29.624 13.744 1.772.797 1.071-2.001 4.829-9.316V66.981z\" fill=\"#558d6c\"></path>\n<path d=\"M33.527 1.842c-1.05 0-2.071.11-3.064.33a16.06 16.06 0 00-2.807.889c-.878.363-1.686.786-2.422 1.273-.725.478-1.356.979-1.89 1.504-.525.516-.935 1.042-1.23 1.576-.297.525-.446 1.017-.446 1.475 0 .726.411 1.09 1.232 1.09.44 0 .822-.107 1.147-.317.325-.21.625-.482.902-.816.287-.334.573-.71.86-1.131.296-.42.633-.84 1.015-1.26a6.558 6.558 0 011.233-.875 9.67 9.67 0 011.59-.715c.572-.2 1.17-.358 1.79-.472a9.68 9.68 0 011.876-.188c.668 0 1.251.11 1.748.33.496.22.901.525 1.216.916.325.392.564.856.717 1.391.162.535.244 1.116.244 1.746 0 .745-.139 1.539-.416 2.379-.267.84-.65 1.68-1.146 2.52a15.238 15.238 0 01-1.776 2.421 15.492 15.492 0 01-2.29 2.106 13.64 13.64 0 01-2.68 1.56 9.82 9.82 0 01-2.979.788c.42-.573.85-1.193 1.29-1.862.448-.678.882-1.365 1.302-2.062.43-.697.84-1.389 1.232-2.076.401-.698.77-1.348 1.104-1.95.344-.601.644-1.146.902-1.632l.645-1.174c.162-.277.291-.568.387-.873.095-.306.142-.598.142-.875 0-.344-.09-.639-.271-.887-.182-.248-.489-.373-.918-.373-.096 0-.233.024-.414.072a2.121 2.121 0 00-.631.272c-.23.143-.483.343-.76.601-.267.258-.54.602-.816 1.031l-5.887 11.702c-.153.22-.276.459-.371.716a2.296 2.296 0 00-.145.803c0 .353.11.648.33.887.22.248.52.373.903.373 1.757 0 3.39-.21 4.898-.631 1.518-.42 2.897-.987 4.139-1.703a15.9 15.9 0 003.308-2.492 15.943 15.943 0 002.422-2.994 13.48 13.48 0 001.488-3.21c.344-1.088.516-2.127.516-3.12a8.48 8.48 0 00-.443-2.78 5.885 5.885 0 00-1.332-2.234c-.592-.64-1.341-1.141-2.248-1.504-.907-.363-1.973-.545-3.196-.545zm34.075 6.303c-.335 0-.625.061-.873.185-.24.124-.44.282-.602.473a2.07 2.07 0 00-.373.644c-.076.23-.113.455-.113.674.028.306.161.553.4.744.239.182.654.274 1.246.274.315 0 .587-.063.817-.188.229-.124.415-.275.558-.457.143-.19.248-.397.315-.617.076-.22.115-.42.115-.601 0-.325-.11-.591-.33-.801-.22-.22-.607-.33-1.16-.33zm-20.524 3.94c-.754 0-1.466.108-2.135.327a7.805 7.805 0 00-1.818.875 8.29 8.29 0 00-1.504 1.26c-.44.468-.812.95-1.117 1.447-.306.497-.54.992-.703 1.489a4.287 4.287 0 00-.242 1.347c0 .535.08 1.045.242 1.532.162.487.397.916.703 1.289.315.372.692.669 1.13.888.45.22.961.33 1.534.33.668 0 1.346-.092 2.033-.273.688-.172 1.347-.39 1.977-.658a17.58 17.58 0 001.804-.873c.503-.285.948-.555 1.34-.81.018.375.082.713.194 1.009.143.353.33.65.558.889.23.238.495.414.801.529.306.124.627.187.961.187.687 0 1.346-.215 1.977-.644.64-.43 1.274-1.06 1.904-1.89.43.267.777.453 1.045.558.267.105.545.156.832.156.869 0 1.66-.151 2.377-.457.104-.046.21-.097.314-.148.004.828.225 1.44.66 1.837.45.392 1.059.588 1.832.588a4.4 4.4 0 001.62-.316 8.741 8.741 0 001.59-.83c.412-.273.817-.575 1.212-.904.026.092.056.183.09.273.134.353.33.664.588.932.258.257.573.462.945.615.382.153.816.23 1.303.23.64 0 1.29-.1 1.95-.3a12.062 12.062 0 001.904-.73 14.43 14.43 0 001.732-.976c.231-.154.445-.301.652-.447.052.306.145.58.28.82.22.392.487.711.802.96.325.238.663.41 1.016.515.353.105.664.158.932.158a7.06 7.06 0 001.99-.273 7.111 7.111 0 001.748-.73 7.118 7.118 0 001.474-1.131c.44-.44.833-.927 1.176-1.461.239.172.472.296.701.373.24.076.483.113.73.113.364 0 .726-.1 1.089-.3a6.355 6.355 0 001.047-.731l.017-.016c-.163.353-.32.697-.463 1.02-.21.477-.382.897-.515 1.26-.134.362-.2.624-.2.786 0 .306.095.564.286.774.19.21.455.316.789.316.324 0 .59-.106.8-.316.22-.2.417-.452.588-.758.172-.315.334-.65.487-1.004.162-.363.34-.7.531-1.015.306-.468.658-.998 1.059-1.59.4-.592.84-1.15 1.318-1.676a8.047 8.047 0 011.533-1.348c.554-.363 1.135-.543 1.746-.543.163 0 .283.052.36.157a.519.519 0 01.129.359c0 .162-.064.371-.188.629s-.282.554-.473.889c-.181.324-.382.672-.601 1.044-.22.363-.429.732-.63 1.104-.19.372-.358.735-.501 1.088a3.38 3.38 0 00-.229.974l-.029.215v.186c0 .506.115.903.344 1.19.239.276.611.415 1.117.415.172 0 .358-.02.559-.058a6.04 6.04 0 00.687-.172c.726-.21 1.356-.433 1.89-.672a16.08 16.08 0 001.518-.79c.478-.286.942-.59 1.391-.915.458-.325.96-.683 1.504-1.074.4-.315.692-.655.873-1.018.19-.363.287-.692.287-.988a.753.753 0 00-.144-.473.422.422 0 00-.372-.185.614.614 0 00-.214.043.758.758 0 00-.23.142c-.278.258-.626.55-1.046.875-.41.315-.865.635-1.361.96-.497.314-1.016.615-1.56.902a12.72 12.72 0 01-1.577.716.95.95 0 01-.314.157c-.086.01-.162.015-.229.015-.105 0-.183-.028-.23-.086a.304.304 0 01-.07-.2.81.81 0 01.185-.53c.095-.172.224-.387.387-.645.172-.267.358-.56.558-.875.2-.315.401-.648.602-1.002.21-.363.396-.73.558-1.103.172-.373.311-.745.416-1.117a3.95 3.95 0 00.157-1.075c0-.582-.172-.991-.516-1.23-.334-.248-.754-.373-1.26-.373-.448 0-.925.071-1.431.215a9.38 9.38 0 00-1.461.558 7.76 7.76 0 00-1.29.76c-.39.277-.692.55-.902.816a2.009 2.009 0 00.2-.859c0-.325-.09-.568-.272-.73a.87.87 0 00-.615-.258c-.277 0-.56.1-.846.3-.286.201-.526.506-.717.917-.067.147-.146.313-.23.488a.326.326 0 00-.14.084 30.3 30.3 0 01-.473.531 18.06 18.06 0 01-1.348 1.332c-.258.23-.516.434-.774.615-.257.182-.51.33-.757.444-.24.114-.46.172-.66.172a1.11 1.11 0 01-.4-.07.806.806 0 01-.331-.245c.153-.4.267-.783.344-1.146.076-.373.115-.702.115-.989 0-.553-.119-1.016-.357-1.388a2.775 2.775 0 00-.875-.916 3.569 3.569 0 00-1.16-.489 5.13 5.13 0 00-1.16-.142c-.841 0-1.604.139-2.292.416a6.48 6.48 0 00-1.834 1.074c-.534.44-.997.94-1.388 1.504a10.736 10.736 0 00-.96 1.69 9.664 9.664 0 00-.47 1.304c-.065.042-.104.069-.174.113-.363.23-.77.473-1.219.73-.448.259-.915.498-1.402.718-.477.22-.96.4-1.447.543a4.882 4.882 0 01-1.375.215c-.401 0-.72-.095-.96-.286-.228-.19-.343-.455-.343-.789 0-.229.057-.505.172-.83.124-.324.286-.658.486-1.002.21-.353.444-.697.701-1.031.258-.344.522-.65.79-.918.276-.267.548-.482.816-.644.277-.172.524-.258.744-.258.191 0 .31.063.357.187.048.115.073.258.073.43 0 .153-.004.314-.014.486v.373c0 .143.023.244.07.301.058.057.182.086.373.086.354 0 .65-.106.889-.316.239-.21.433-.472.586-.788.153-.315.263-.648.33-1.001.067-.363.1-.693.1-.989a1.37 1.37 0 00-.13-.617.91.91 0 00-.327-.4 1.284 1.284 0 00-.489-.229 2.29 2.29 0 00-.586-.072c-.62 0-1.236.133-1.847.4a8.384 8.384 0 00-1.748 1.06c-.554.44-1.07.941-1.547 1.505a13.464 13.464 0 00-1.246 1.718 9.629 9.629 0 00-.744 1.495c-.05.046-.094.091-.145.138-.248.239-.514.478-.8.717-.287.23-.58.434-.876.615-.296.182-.59.33-.886.444a2.238 2.238 0 01-.832.172c-.24 0-.425-.037-.56-.114-.123-.086-.185-.258-.185-.515 0-.24.043-.503.13-.79.095-.286.205-.576.33-.872a17.6 17.6 0 01.413-.86 54.916 54.916 0 00.631-1.303l.201-.43.243-.488c.086-.171.196-.38.33-.628a.685.685 0 00.086-.258 2.42 2.42 0 00.043-.258c0-.363-.133-.66-.4-.889a1.323 1.323 0 00-.932-.357c-.22 0-.435.057-.645.172-.21.114-.396.305-.559.572l-.486 1.002c-.134.267-.262.531-.387.789-.114.258-.196.448-.244.572-.133.334-.295.688-.486 1.06-.164.313-.32.64-.47.981a8.955 8.955 0 01-.991.524 6.753 6.753 0 01-1.103.357 4.597 4.597 0 01-1.061.129c-.325 0-.562-.1-.715-.3.353-.602.677-1.118.973-1.548.305-.439.57-.836.789-1.19.22-.362.391-.71.515-1.044.134-.334.2-.702.2-1.104 0-.353-.08-.654-.242-.902-.163-.258-.441-.387-.833-.387-.229 0-.452.115-.671.344-.22.22-.445.516-.674.889-.22.363-.449.778-.688 1.246-.229.458-.472.927-.73 1.404-.248.478-.516.944-.803 1.403a7.276 7.276 0 01-.887 1.175 7.968 7.968 0 01-1.004 1.145c-.305.277-.581.416-.83.416-.057 0-.11-.033-.158-.1a1.055 1.055 0 01-.113-.258 3.773 3.773 0 01-.072-.316 1.762 1.762 0 01-.03-.271c0-.43.058-.903.172-1.418.124-.526.274-1.06.446-1.604.171-.544.351-1.084.542-1.619.201-.544.373-1.046.516-1.504a.6.6 0 00.059-.271.63.63 0 00-.102-.344 1.001 1.001 0 00-.258-.274 1.128 1.128 0 00-.357-.172 1.032 1.032 0 00-.373-.07c-.277 0-.564.09-.86.272-.286.172-.523.458-.714.859-.105.315-.249.74-.43 1.275-.172.535-.35 1.116-.531 1.747a24.169 24.169 0 00-.457 1.873c-.217.129-.462.27-.76.433-.373.21-.792.435-1.26.674-.468.23-.95.444-1.447.645-.487.2-.984.366-1.49.5a5.793 5.793 0 01-1.403.187c-.41 0-.74-.078-.988-.23a.957.957 0 01-.445-.659c1.298-.477 2.379-.95 3.238-1.418.869-.477 1.56-.94 2.076-1.388.516-.459.878-.909 1.088-1.348.21-.44.316-.859.316-1.26 0-.678-.196-1.208-.587-1.59-.392-.381-.983-.572-1.776-.572zm-.773 1.96h.129c.038 0 .08.006.129.016a.54.54 0 01.3.156.44.44 0 01.143.344c0 .172-.082.378-.244.617-.163.23-.457.477-.887.744a13.24 13.24 0 00-.502.33c-.23.162-.501.343-.816.543-.315.2-.655.411-1.018.631-.353.22-.697.416-1.031.588.057-.182.139-.407.244-.674.115-.267.254-.544.416-.83.162-.296.342-.593.543-.889a4.63 4.63 0 01.703-.787 3.46 3.46 0 01.873-.574 2.431 2.431 0 011.018-.215zm37.482.574c.296 0 .53.058.701.172.172.105.301.242.387.414.096.172.153.364.172.574a3.868 3.868 0 01-.242 2.033 4.63 4.63 0 01-.774 1.29 4.275 4.275 0 01-1.117.916c-.41.229-.836.344-1.275.344-.287 0-.516-.062-.688-.186a1.316 1.316 0 01-.4-.459 2.174 2.174 0 01-.172-.602 4.682 4.682 0 01-.043-.601c0-.487.094-.96.285-1.418.191-.468.445-.883.76-1.246a3.895 3.895 0 011.103-.887c.42-.23.854-.344 1.303-.344z\" fill=\"#60be86\" font-family=\"Damion\" font-size=\"29.333\"></path>\n\n\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-devicon\"></use></svg>"},"ng-done":{"symbol":"<symbol id=\"ng-done\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-done\"></use></svg>"},"ng-emoji-events":{"symbol":"<symbol id=\"ng-emoji-events\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M450-180v-148q-54-11-96-46.5T296-463q-74-8-125-60t-51-125v-44q0-24.75 17.625-42.375T180-752h104v-28q0-24.75 17.625-42.375T344-840h272q24.75 0 42.375 17.625T676-780v28h104q24.75 0 42.375 17.625T840-692v44q0 73-51 125t-125 60q-16 53-58 88.5T510-328v148h122q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T632-120H328q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T328-180h122ZM284-526v-166H180v44q0 45 29.5 78.5T284-526Zm196.235 141Q537-385 576.5-424.958 616-464.917 616-522v-258H344v258q0 57.083 39.735 97.042Q423.471-385 480.235-385ZM676-526q45-10 74.5-43.5T780-648v-44H676v166Zm-196-57Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-emoji-events\"></use></svg>"},"ng-gfonts":{"symbol":"<symbol id=\"ng-gfonts\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" d=\"M0 0h16v16H0z\"></path>\n<path xmlns=\"http://www.w3.org/2000/svg\" fill=\"#F29900\" d=\"M13.5 2H8L1 13h5.5z\"></path>\n<path xmlns=\"http://www.w3.org/2000/svg\" fill=\"#1A73E8\" d=\"M8 2h5v11H8z\"></path>\n<circle xmlns=\"http://www.w3.org/2000/svg\" fill=\"#EA4335\" cx=\"3.25\" cy=\"4.25\" r=\"2.25\"></circle>\n<path xmlns=\"http://www.w3.org/2000/svg\" fill=\"#0D652D\" d=\"M13.33 10L13 13c-1.66 0-3-1.34-3-3s1.34-3 3-3l.33 3z\"></path>\n<path xmlns=\"http://www.w3.org/2000/svg\" fill=\"#174EA6\" d=\"M10.5 4.5A2.5 2.5 0 0113 2l.45 2.5L13 7a2.5 2.5 0 01-2.5-2.5z\"></path>\n<path xmlns=\"http://www.w3.org/2000/svg\" fill=\"#1A73E8\" d=\"M13 2a2.5 2.5 0 010 5\"></path>\n<path xmlns=\"http://www.w3.org/2000/svg\" fill=\"#34A853\" d=\"M13 7c1.66 0 3 1.34 3 3s-1.34 3-3 3\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-gfonts\"></use></svg>"},"ng-github-revert":{"symbol":"<symbol id=\"ng-github-revert\" xmlns=\"\" viewBox=\"0 0 128 128\">\n\n<g fill=\"#E7E9E9\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M64 1.512c-23.493 0-42.545 19.047-42.545 42.545 0 18.797 12.19 34.745 29.095 40.37 2.126.394 2.907-.923 2.907-2.047 0-1.014-.04-4.366-.058-7.92-11.837 2.573-14.334-5.02-14.334-5.02-1.935-4.918-4.724-6.226-4.724-6.226-3.86-2.64.29-2.586.29-2.586 4.273.3 6.523 4.385 6.523 4.385 3.794 6.504 9.953 4.623 12.38 3.536.383-2.75 1.485-4.628 2.702-5.69-9.45-1.075-19.384-4.724-19.384-21.026 0-4.645 1.662-8.44 4.384-11.42-.442-1.072-1.898-5.4.412-11.26 0 0 3.572-1.142 11.7 4.363 3.395-.943 7.035-1.416 10.65-1.432 3.616.017 7.258.49 10.658 1.432 8.12-5.504 11.688-4.362 11.688-4.362 2.316 5.86.86 10.187.418 11.26 2.728 2.978 4.378 6.774 4.378 11.42 0 16.34-9.953 19.938-19.427 20.99 1.526 1.32 2.886 3.91 2.886 7.88 0 5.692-.048 10.273-.048 11.674 0 1.13.766 2.458 2.922 2.04 16.896-5.632 29.07-21.574 29.07-40.365C106.545 20.56 87.497 1.512 64 1.512z\"></path><path d=\"M37.57 62.596c-.095.212-.428.275-.73.13-.31-.14-.482-.427-.382-.64.09-.216.424-.277.733-.132.31.14.486.43.38.642zM39.293 64.52c-.203.187-.6.1-.87-.198-.278-.297-.33-.694-.124-.884.208-.188.593-.1.87.197.28.3.335.693.123.884zm1.677 2.448c-.26.182-.687.012-.95-.367-.262-.377-.262-.83.005-1.013.264-.182.684-.018.95.357.262.385.262.84-.005 1.024zm2.298 2.368c-.233.257-.73.188-1.093-.163-.372-.343-.475-.83-.242-1.087.237-.257.736-.185 1.102.163.37.342.482.83.233 1.086zm3.172 1.374c-.104.334-.582.485-1.064.344-.482-.146-.796-.536-.7-.872.1-.336.582-.493 1.067-.342.48.144.795.53.696.87zm3.48.255c.013.35-.396.642-.902.648-.508.012-.92-.272-.926-.618 0-.354.4-.642.908-.65.506-.01.92.272.92.62zm3.24-.551c.06.342-.29.694-.793.787-.494.092-.95-.12-1.014-.46-.06-.35.297-.7.79-.792.503-.088.953.118 1.017.466zm0 0\"></path></g>\n<path d=\"M24.855 108.302h-10.7a.5.5 0 00-.5.5v5.232a.5.5 0 00.5.5h4.173v6.5s-.937.32-3.53.32c-3.056 0-7.327-1.116-7.327-10.508 0-9.393 4.448-10.63 8.624-10.63 3.614 0 5.17.636 6.162.943.31.094.6-.216.6-.492l1.193-5.055a.468.468 0 00-.192-.39c-.403-.288-2.857-1.66-9.058-1.66-7.144 0-14.472 3.038-14.472 17.65 0 14.61 8.39 16.787 15.46 16.787 5.854 0 9.405-2.502 9.405-2.502.146-.08.162-.285.162-.38v-16.316a.5.5 0 00-.5-.5zM79.506 94.81H73.48a.5.5 0 00-.498.503l.002 11.644h-9.392V95.313a.5.5 0 00-.497-.503H57.07a.5.5 0 00-.498.503v31.53c0 .277.224.503.498.503h6.025a.5.5 0 00.497-.504v-13.486h9.392l-.016 13.486c0 .278.224.504.5.504h6.038a.5.5 0 00.497-.504v-31.53a.497.497 0 00-.497-.502zm-47.166.717c-2.144 0-3.884 1.753-3.884 3.923 0 2.167 1.74 3.925 3.884 3.925 2.146 0 3.885-1.758 3.885-3.925 0-2.17-1.74-3.923-3.885-3.923zm2.956 9.608H29.29c-.276 0-.522.284-.522.56v20.852c0 .613.382.795.876.795h5.41c.595 0 .74-.292.74-.805v-20.899a.5.5 0 00-.498-.502zm67.606.047h-5.98a.5.5 0 00-.496.504v15.46s-1.52 1.11-3.675 1.11-2.727-.977-2.727-3.088v-13.482a.5.5 0 00-.497-.504h-6.068a.502.502 0 00-.498.504v14.502c0 6.27 3.495 7.804 8.302 7.804 3.944 0 7.124-2.18 7.124-2.18s.15 1.15.22 1.285c.07.136.247.273.44.273l3.86-.017a.502.502 0 00.5-.504l-.003-21.166a.504.504 0 00-.5-.502zm16.342-.708c-3.396 0-5.706 1.515-5.706 1.515V95.312a.5.5 0 00-.497-.503H107a.5.5 0 00-.5.503v31.53a.5.5 0 00.5.503h4.192c.19 0 .332-.097.437-.268.103-.17.254-1.454.254-1.454s2.47 2.34 7.148 2.34c5.49 0 8.64-2.784 8.64-12.502s-5.03-10.988-8.428-10.988zm-2.36 17.764c-2.073-.063-3.48-1.004-3.48-1.004v-9.985s1.388-.85 3.09-1.004c2.153-.193 4.228.458 4.228 5.594 0 5.417-.935 6.486-3.837 6.398zm-63.689-.118c-.263 0-.937.107-1.63.107-2.22 0-2.973-1.032-2.973-2.368v-8.866h4.52a.5.5 0 00.5-.504v-4.856a.5.5 0 00-.5-.502h-4.52l-.007-5.97c0-.227-.116-.34-.378-.34h-6.16c-.238 0-.367.106-.367.335v6.17s-3.087.745-3.295.805a.5.5 0 00-.36.48v3.877a.5.5 0 00.497.503h3.158v9.328c0 6.93 4.86 7.61 8.14 7.61 1.497 0 3.29-.48 3.586-.59.18-.067.283-.252.283-.453l.004-4.265a.51.51 0 00-.5-.502z\" fill=\"#EFF1F0\"></path>\n\n\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-github-revert\"></use></svg>"},"ng-github":{"symbol":"<symbol id=\"ng-github\" xmlns=\"\" viewBox=\"0 0 128 128\">\n\n<g fill=\"#181616\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M64 1.512c-23.493 0-42.545 19.047-42.545 42.545 0 18.797 12.19 34.745 29.095 40.37 2.126.394 2.907-.923 2.907-2.047 0-1.014-.04-4.366-.058-7.92-11.837 2.573-14.334-5.02-14.334-5.02-1.935-4.918-4.724-6.226-4.724-6.226-3.86-2.64.29-2.586.29-2.586 4.273.3 6.523 4.385 6.523 4.385 3.794 6.504 9.953 4.623 12.38 3.536.383-2.75 1.485-4.628 2.702-5.69-9.45-1.075-19.384-4.724-19.384-21.026 0-4.645 1.662-8.44 4.384-11.42-.442-1.072-1.898-5.4.412-11.26 0 0 3.572-1.142 11.7 4.363 3.395-.943 7.035-1.416 10.65-1.432 3.616.017 7.258.49 10.658 1.432 8.12-5.504 11.688-4.362 11.688-4.362 2.316 5.86.86 10.187.418 11.26 2.728 2.978 4.378 6.774 4.378 11.42 0 16.34-9.953 19.938-19.427 20.99 1.526 1.32 2.886 3.91 2.886 7.88 0 5.692-.048 10.273-.048 11.674 0 1.13.766 2.458 2.922 2.04 16.896-5.632 29.07-21.574 29.07-40.365C106.545 20.56 87.497 1.512 64 1.512z\"></path><path d=\"M37.57 62.596c-.095.212-.428.275-.73.13-.31-.14-.482-.427-.382-.64.09-.216.424-.277.733-.132.31.14.486.43.38.642zM39.293 64.52c-.203.187-.6.1-.87-.198-.278-.297-.33-.694-.124-.884.208-.188.593-.1.87.197.28.3.335.693.123.884zm1.677 2.448c-.26.182-.687.012-.95-.367-.262-.377-.262-.83.005-1.013.264-.182.684-.018.95.357.262.385.262.84-.005 1.024zm2.298 2.368c-.233.257-.73.188-1.093-.163-.372-.343-.475-.83-.242-1.087.237-.257.736-.185 1.102.163.37.342.482.83.233 1.086zm3.172 1.374c-.104.334-.582.485-1.064.344-.482-.146-.796-.536-.7-.872.1-.336.582-.493 1.067-.342.48.144.795.53.696.87zm3.48.255c.013.35-.396.642-.902.648-.508.012-.92-.272-.926-.618 0-.354.4-.642.908-.65.506-.01.92.272.92.62zm3.24-.551c.06.342-.29.694-.793.787-.494.092-.95-.12-1.014-.46-.06-.35.297-.7.79-.792.503-.088.953.118 1.017.466zm0 0\"></path></g>\n<path d=\"M24.855 108.302h-10.7a.5.5 0 00-.5.5v5.232a.5.5 0 00.5.5h4.173v6.5s-.937.32-3.53.32c-3.056 0-7.327-1.116-7.327-10.508 0-9.393 4.448-10.63 8.624-10.63 3.614 0 5.17.636 6.162.943.31.094.6-.216.6-.492l1.193-5.055a.468.468 0 00-.192-.39c-.403-.288-2.857-1.66-9.058-1.66-7.144 0-14.472 3.038-14.472 17.65 0 14.61 8.39 16.787 15.46 16.787 5.854 0 9.405-2.502 9.405-2.502.146-.08.162-.285.162-.38v-16.316a.5.5 0 00-.5-.5zM79.506 94.81H73.48a.5.5 0 00-.498.503l.002 11.644h-9.392V95.313a.5.5 0 00-.497-.503H57.07a.5.5 0 00-.498.503v31.53c0 .277.224.503.498.503h6.025a.5.5 0 00.497-.504v-13.486h9.392l-.016 13.486c0 .278.224.504.5.504h6.038a.5.5 0 00.497-.504v-31.53a.497.497 0 00-.497-.502zm-47.166.717c-2.144 0-3.884 1.753-3.884 3.923 0 2.167 1.74 3.925 3.884 3.925 2.146 0 3.885-1.758 3.885-3.925 0-2.17-1.74-3.923-3.885-3.923zm2.956 9.608H29.29c-.276 0-.522.284-.522.56v20.852c0 .613.382.795.876.795h5.41c.595 0 .74-.292.74-.805v-20.899a.5.5 0 00-.498-.502zm67.606.047h-5.98a.5.5 0 00-.496.504v15.46s-1.52 1.11-3.675 1.11-2.727-.977-2.727-3.088v-13.482a.5.5 0 00-.497-.504h-6.068a.502.502 0 00-.498.504v14.502c0 6.27 3.495 7.804 8.302 7.804 3.944 0 7.124-2.18 7.124-2.18s.15 1.15.22 1.285c.07.136.247.273.44.273l3.86-.017a.502.502 0 00.5-.504l-.003-21.166a.504.504 0 00-.5-.502zm16.342-.708c-3.396 0-5.706 1.515-5.706 1.515V95.312a.5.5 0 00-.497-.503H107a.5.5 0 00-.5.503v31.53a.5.5 0 00.5.503h4.192c.19 0 .332-.097.437-.268.103-.17.254-1.454.254-1.454s2.47 2.34 7.148 2.34c5.49 0 8.64-2.784 8.64-12.502s-5.03-10.988-8.428-10.988zm-2.36 17.764c-2.073-.063-3.48-1.004-3.48-1.004v-9.985s1.388-.85 3.09-1.004c2.153-.193 4.228.458 4.228 5.594 0 5.417-.935 6.486-3.837 6.398zm-63.689-.118c-.263 0-.937.107-1.63.107-2.22 0-2.973-1.032-2.973-2.368v-8.866h4.52a.5.5 0 00.5-.504v-4.856a.5.5 0 00-.5-.502h-4.52l-.007-5.97c0-.227-.116-.34-.378-.34h-6.16c-.238 0-.367.106-.367.335v6.17s-3.087.745-3.295.805a.5.5 0 00-.36.48v3.877a.5.5 0 00.497.503h3.158v9.328c0 6.93 4.86 7.61 8.14 7.61 1.497 0 3.29-.48 3.586-.59.18-.067.283-.252.283-.453l.004-4.265a.51.51 0 00-.5-.502z\" fill=\"#100E0F\"></path>\n\n\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-github\"></use></svg>"},"ng-help":{"symbol":"<symbol id=\"ng-help\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M484-247q16 0 27-11t11-27q0-16-11-27t-27-11q-16 0-27 11t-11 27q0 16 11 27t27 11Zm-35-146h59q0-26 6.5-47.5T555-490q31-26 44-51t13-55q0-53-34.5-85T486-713q-49 0-86.5 24.5T345-621l53 20q11-28 33-43.5t52-15.5q34 0 55 18.5t21 47.5q0 22-13 41.5T508-512q-30 26-44.5 51.5T449-393Zm31 313q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-help\"></use></svg>"},"ng-info":{"symbol":"<symbol id=\"ng-info\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M453-280h60v-240h-60v240Zm26.982-314q14.018 0 23.518-9.2T513-626q0-14.45-9.482-24.225-9.483-9.775-23.5-9.775-14.018 0-23.518 9.775T447-626q0 13.6 9.482 22.8 9.483 9.2 23.5 9.2Zm.284 514q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80-397.681 80-480.5q0-82.819 31.5-155.659Q143-709 197.5-763t127.341-85.5Q397.681-880 480.5-880q82.819 0 155.659 31.5Q709-817 763-763t85.5 127Q880-563 880-480.266q0 82.734-31.5 155.5T763-197.684q-54 54.316-127 86Q563-80 480.266-80Zm.234-60Q622-140 721-239.5t99-241Q820-622 721.188-721 622.375-820 480-820q-141 0-240.5 98.812Q140-622.375 140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-info\"></use></svg>"},"ng-node":{"symbol":"<symbol id=\"ng-node\" xmlns=\"\" viewBox=\"0 0 128 128\">\n\n<path fill=\"#83CD29\" d=\"M114.325 80.749c-.29 0-.578-.076-.832-.224l-2.65-1.568c-.396-.221-.203-.3-.072-.345.528-.184.635-.227 1.198-.545.059-.033.136-.021.197.015l2.035 1.209a.261.261 0 00.246 0l7.937-4.581a.248.248 0 00.122-.215v-9.16a.256.256 0 00-.123-.219l-7.934-4.577a.254.254 0 00-.245 0l-7.933 4.578a.259.259 0 00-.125.218v9.16c0 .088.049.171.125.212l2.174 1.257c1.18.589 1.903-.105 1.903-.803v-9.045c0-.127.103-.228.23-.228h1.007c.125 0 .229.101.229.228v9.045c0 1.574-.857 2.477-2.35 2.477-.459 0-.82 0-1.828-.496l-2.081-1.198a1.676 1.676 0 01-.832-1.448v-9.16c0-.595.317-1.15.832-1.446l7.937-4.587a1.743 1.743 0 011.667 0l7.937 4.587c.514.297.833.852.833 1.446v9.16a1.68 1.68 0 01-.833 1.448l-7.937 4.582a1.651 1.651 0 01-.834.223m2.453-6.311c-3.475 0-4.202-1.595-4.202-2.932a.23.23 0 01.23-.229h1.026a.23.23 0 01.228.194c.154 1.045.617 1.572 2.718 1.572 1.671 0 2.383-.378 2.383-1.266 0-.512-.202-.891-2.8-1.146-2.172-.215-3.515-.694-3.515-2.433 0-1.601 1.35-2.557 3.612-2.557 2.543 0 3.801.883 3.96 2.777a.235.235 0 01-.06.176.236.236 0 01-.168.073h-1.031a.228.228 0 01-.223-.179c-.248-1.1-.848-1.451-2.479-1.451-1.825 0-2.037.637-2.037 1.112 0 .577.25.745 2.715 1.071 2.439.323 3.598.779 3.598 2.494.001 1.733-1.441 2.724-3.955 2.724\"></path>\n<path fill=\"#404137\" d=\"M97.982 68.43c.313-.183.506-.517.506-.88v-2.354c0-.362-.192-.696-.506-.879l-8.364-4.856a1.017 1.017 0 00-1.019-.002l-8.416 4.859a1.018 1.018 0 00-.508.88v9.716c0 .365.196.703.514.884l8.363 4.765c.308.177.686.178.997.006l5.058-2.812a.508.508 0 00.006-.885l-8.468-4.86a.507.507 0 01-.256-.44v-3.046c0-.182.097-.349.254-.439l2.637-1.52a.505.505 0 01.507 0l2.637 1.52a.507.507 0 01.255.439v2.396a.507.507 0 00.764.44l5.039-2.932\"></path>\n<path fill=\"#83CD29\" d=\"M88.984 67.974a.2.2 0 01.195 0l1.615.933c.06.035.097.1.097.169v1.865c0 .07-.037.134-.097.169l-1.615.932a.194.194 0 01-.195 0l-1.614-.932a.194.194 0 01-.098-.169v-1.865c0-.069.037-.134.098-.169l1.614-.933\"></path>\n<path fill=\"#404137\" d=\"M67.083 71.854c0 .09-.048.174-.127.22l-2.89 1.666a.251.251 0 01-.254 0l-2.89-1.666a.255.255 0 01-.127-.22v-3.338c0-.09.049-.175.127-.221l2.89-1.668a.248.248 0 01.255 0l2.891 1.668a.258.258 0 01.126.221v3.338zm.781-24.716a.511.511 0 00-.756.444v12.915a.359.359 0 01-.177.308.359.359 0 01-.356 0l-2.108-1.215a1.017 1.017 0 00-1.015 0l-8.418 4.858a1.018 1.018 0 00-.509.881v9.719c0 .363.194.698.508.881l8.418 4.861c.314.182.702.182 1.017 0l8.42-4.861a1.02 1.02 0 00.508-.881V50.821c0-.368-.2-.708-.521-.888l-5.011-2.795\"></path>\n<path fill=\"#83CD29\" d=\"M38.238 59.407a1.014 1.014 0 011.016 0l8.418 4.857c.314.182.508.518.508.881v9.722c0 .363-.194.699-.508.881l-8.417 4.861a1.02 1.02 0 01-1.017 0l-8.415-4.861a1.02 1.02 0 01-.508-.881v-9.723c0-.362.194-.698.508-.88l8.415-4.857\"></path>\n<path fill=\"#404137\" d=\"M22.93 65.064c0-.366-.192-.702-.508-.883l-8.415-4.843a.99.99 0 00-.464-.133h-.087a.993.993 0 00-.464.133l-8.416 4.843a1.02 1.02 0 00-.509.883l.018 13.04c0 .182.095.351.254.439a.487.487 0 00.505 0l5-2.864c.316-.188.509-.519.509-.882v-6.092c0-.364.192-.699.507-.881l2.13-1.226a.994.994 0 01.508-.137c.174 0 .352.044.507.137l2.128 1.226c.315.182.509.517.509.881v6.092c0 .363.195.696.509.882l5 2.864a.508.508 0 00.76-.439l.019-13.04\"></path>\n\n\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-node\"></use></svg>"},"ng-play-arrow":{"symbol":"<symbol id=\"ng-play-arrow\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M0 0h24v24H0z\" fill=\"none\"></path>\n<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M8 5v14l11-7z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-play-arrow\"></use></svg>"},"ng-sass":{"symbol":"<symbol id=\"ng-sass\" xmlns=\"\" viewBox=\"0 0 128 128\">\n\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#CB6699\" d=\"M1.219 56.156c0 .703.207 1.167.323 1.618.756 2.933 2.381 5.45 4.309 7.746 2.746 3.272 6.109 5.906 9.554 8.383 2.988 2.148 6.037 4.248 9.037 6.38.515.366 1.002.787 1.561 1.236-.481.26-.881.489-1.297.7-3.959 2.008-7.768 4.259-11.279 6.986-2.116 1.644-4.162 3.391-5.607 5.674-2.325 3.672-3.148 7.584-1.415 11.761.506 1.22 1.278 2.274 2.367 3.053.353.252.749.502 1.162.6 1.058.249 2.136.412 3.207.609l3.033-.002c3.354-.299 6.407-1.448 9.166-3.352 4.312-2.976 7.217-6.966 8.466-12.087.908-3.722.945-7.448-.125-11.153a11.696 11.696 0 00-.354-1.014c-.13-.333-.283-.657-.463-1.072l6.876-3.954.103.088c-.125.409-.258.817-.371 1.23-.817 2.984-1.36 6.02-1.165 9.117.208 3.3 1.129 6.389 3.061 9.146 1.562 2.23 5.284 2.313 6.944.075.589-.795 1.16-1.626 1.589-2.513 1.121-2.315 2.159-4.671 3.23-7.011l.187-.428c-.077 1.108-.167 2.081-.208 3.055-.064 1.521.025 3.033.545 4.48.445 1.238 1.202 2.163 2.62 2.326.97.111 1.743-.333 2.456-.896a10.384 10.384 0 002.691-3.199c1.901-3.491 3.853-6.961 5.576-10.54 1.864-3.871 3.494-7.855 5.225-11.792l.286-.698c.409 1.607.694 3.181 1.219 4.671.61 1.729 1.365 3.417 2.187 5.058.389.775.344 1.278-.195 1.928-2.256 2.72-4.473 5.473-6.692 8.223-.491.607-.98 1.225-1.389 1.888a3.701 3.701 0 00-.48 1.364 1.737 1.737 0 001.383 1.971 9.661 9.661 0 002.708.193c3.097-.228 5.909-1.315 8.395-3.157 3.221-2.386 4.255-5.642 3.475-9.501-.211-1.047-.584-2.065-.947-3.074-.163-.455-.174-.774.123-1.198 2.575-3.677 4.775-7.578 6.821-11.569.081-.157.164-.314.306-.482.663 3.45 1.661 6.775 3.449 9.792-.912.879-1.815 1.676-2.632 2.554-1.799 1.934-3.359 4.034-4.173 6.595-.35 1.104-.619 2.226-.463 3.405.242 1.831 1.742 3.021 3.543 2.604 3.854-.892 7.181-2.708 9.612-5.925 1.636-2.166 1.785-4.582 1.1-7.113-.188-.688-.411-1.365-.651-2.154.951-.295 1.878-.649 2.837-.868 4.979-1.136 9.904-.938 14.702.86 2.801 1.05 5.064 2.807 6.406 5.571 1.639 3.379.733 6.585-2.452 8.721-.297.199-.637.356-.883.605a.869.869 0 00-.205.67c.021.123.346.277.533.275 1.047-.008 1.896-.557 2.711-1.121 2.042-1.413 3.532-3.314 3.853-5.817l.063-.188-.077-1.63c-.031-.094.023-.187.016-.258-.434-3.645-2.381-6.472-5.213-8.688-3.28-2.565-7.153-3.621-11.249-3.788a25.401 25.401 0 00-9.765 1.503c-.897.325-1.786.71-2.688 1.073-.121-.219-.251-.429-.358-.646-.926-1.896-2.048-3.708-2.296-5.882-.176-1.544-.392-3.086-.025-4.613.353-1.469.813-2.913 1.246-4.362.223-.746.066-1.164-.646-1.5a2.854 2.854 0 00-.786-.258c-1.75-.254-3.476-.109-5.171.384-.6.175-1.036.511-1.169 1.175-.076.381-.231.746-.339 1.122-.443 1.563-.757 3.156-1.473 4.645-1.794 3.735-3.842 7.329-5.938 10.897-.227.385-.466.763-.752 1.23-.736-1.54-1.521-2.922-1.759-4.542-.269-1.832-.481-3.661-.025-5.479.339-1.356.782-2.687 1.19-4.025.193-.636.104-.97-.472-1.305-.291-.169-.62-.319-.948-.368a11.643 11.643 0 00-5.354.438c-.543.176-.828.527-.994 1.087-.488 1.652-.904 3.344-1.589 4.915-2.774 6.36-5.628 12.687-8.479 19.013-.595 1.321-1.292 2.596-1.963 3.882-.17.326-.418.613-.63.919-.17-.201-.236-.339-.235-.477.005-.813-.092-1.65.063-2.436a172.189 172.189 0 011.578-7.099c.47-1.946 1.017-3.874 1.538-5.807.175-.647.178-1.252-.287-1.796-.781-.911-2.413-1.111-3.381-.409l-.428.242.083-.69c.204-1.479.245-2.953-.161-4.41-.506-1.816-1.802-2.861-3.686-2.803-.878.027-1.8.177-2.613.497-3.419 1.34-6.048 3.713-8.286 6.568a2.592 2.592 0 01-.757.654c-2.893 1.604-5.795 3.188-8.696 4.778l-3.229 1.769c-.866-.826-1.653-1.683-2.546-2.41-2.727-2.224-5.498-4.393-8.244-6.592-2.434-1.949-4.792-3.979-6.596-6.56-1.342-1.92-2.207-4.021-2.29-6.395-.105-3.025.753-5.789 2.293-8.362 1.97-3.292 4.657-5.934 7.611-8.327 3.125-2.53 6.505-4.678 10.008-6.639 4.901-2.743 9.942-5.171 15.347-6.774 5.542-1.644 11.165-2.585 16.965-1.929 2.28.258 4.494.78 6.527 1.895 1.557.853 2.834 1.97 3.428 3.716.586 1.718.568 3.459.162 5.204-.825 3.534-2.76 6.447-5.195 9.05-3.994 4.267-8.866 7.172-14.351 9.091a39.478 39.478 0 01-9.765 2.083c-2.729.229-5.401-.013-7.985-.962-1.711-.629-3.201-1.591-4.399-2.987-.214-.25-.488-.521-.887-.287-.391.23-.46.602-.329.979.219.626.421 1.278.762 1.838.857 1.405 2.107 2.424 3.483 3.298 2.643 1.681 5.597 2.246 8.66 2.377 4.648.201 9.183-.493 13.654-1.74 6.383-1.78 11.933-4.924 16.384-9.884 3.706-4.13 6.353-8.791 6.92-14.419.277-2.747-.018-5.438-1.304-7.944-1.395-2.715-3.613-4.734-6.265-6.125C68.756 18.179 64.588 17 60.286 17h-4.31c-5.21 0-10.247 1.493-15.143 3.274-3.706 1.349-7.34 2.941-10.868 4.703-7.683 3.839-14.838 8.468-20.715 14.833-2.928 3.171-5.407 6.67-6.833 10.79a40.494 40.494 0 00-1.111 3.746m27.839 36.013c-.333 4.459-2.354 8.074-5.657 11.002-1.858 1.646-3.989 2.818-6.471 3.23-.9.149-1.821.185-2.694-.188-1.245-.532-1.524-1.637-1.548-2.814-.037-1.876.62-3.572 1.521-5.186 1.176-2.104 2.9-3.708 4.741-5.206 2.9-2.361 6.046-4.359 9.268-6.245l.243-.1c.498 1.84.735 3.657.597 5.507zM54.303 70.98c-.235 1.424-.529 2.849-.945 4.229-1.438 4.777-3.285 9.406-5.282 13.973-.369.845-.906 1.616-1.373 2.417a1.689 1.689 0 01-.283.334c-.578.571-1.126.541-1.418-.206-.34-.868-.549-1.797-.729-2.716-.121-.617-.092-1.265-.13-1.897.039-4.494 1.41-8.578 3.736-12.38.959-1.568 2.003-3.062 3.598-4.054a6.27 6.27 0 011.595-.706c.85-.239 1.372.154 1.231 1.006zm17.164 21.868l6.169-7.203c.257 2.675-4.29 8.015-6.169 7.203zm19.703-4.847c-.436.25-.911.43-1.358.661-.409.212-.544-.002-.556-.354a2.385 2.385 0 01.093-.721c.833-2.938 2.366-5.446 4.647-7.486l.16-.082c1.085 3.035-.169 6.368-2.986 7.982z\"></path>\n\n\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-sass\"></use></svg>"},"ng-svelte":{"symbol":"<symbol id=\"ng-svelte\" xmlns=\"\" viewBox=\"0 0 128 128\">\n\n<path d=\"M119.838 16.936C105.553-.076 77.336-5.118 56.942 5.696l-35.829 19c-4.847 2.529-9.006 5.871-12.212 9.814-3.206 3.943-5.387 8.399-6.404 13.083a30.64 30.64 0 00-.688 6.396c.022 5.831 1.74 11.571 5.007 16.73-3.063 3.872-5.154 8.22-6.146 12.782a30.483 30.483 0 00.415 14.412c1.29 4.733 3.702 9.204 7.096 13.152 14.284 17.011 42.564 22.053 62.895 11.24l35.792-19.001c4.844-2.532 8.998-5.878 12.196-9.825 3.197-3.947 5.367-8.407 6.37-13.093.46-2.107.691-4.244.688-6.386-.009-5.82-1.705-11.551-4.945-16.709 3.062-3.869 5.153-8.213 6.147-12.771.444-2.109.67-4.245.676-6.386.002-7.595-2.852-15-8.162-21.178v-.02z\" fill=\"#FF3E00\"></path>\n<path d=\"M53.44 112.667a34.23 34.23 0 01-7.16.76c-4.595.001-9.122-.925-13.193-2.7-4.07-1.774-7.563-4.343-10.179-7.487-3.194-3.716-4.91-8.171-4.907-12.74a18.83 18.83 0 01.4-3.833 18.55 18.55 0 01.865-2.782l.676-1.708 1.827 1.156c4.243 2.591 8.984 4.564 14.02 5.834l1.328.333-.125 1.104v.573c-.003 1.381.514 2.73 1.477 3.854.778.958 1.826 1.744 3.052 2.288a9.936 9.936 0 003.983.837 9.923 9.923 0 002.153-.229 8.745 8.745 0 002.204-.802l35.79-19.094c1.073-.566 1.957-1.349 2.568-2.276.61-.927.928-1.968.924-3.026-.01-1.381-.54-2.725-1.515-3.844-.79-.946-1.844-1.718-3.071-2.252a9.997 9.997 0 00-3.977-.81 9.917 9.917 0 00-2.153.23 8.344 8.344 0 00-2.19.801l-13.645 7.25a29.314 29.314 0 01-7.273 2.656c-2.34.502-4.745.758-7.161.76-4.594 0-9.119-.926-13.189-2.698-4.07-1.772-7.564-4.338-10.183-7.478-3.19-3.718-4.906-8.172-4.907-12.74.002-1.285.136-2.567.4-3.833.613-2.816 1.921-5.495 3.844-7.867 1.922-2.373 4.416-4.387 7.323-5.914L67.274 18c2.248-1.19 4.7-2.09 7.273-2.667 2.34-.499 4.745-.75 7.16-.75 4.605-.01 9.144.91 13.228 2.681 4.084 1.77 7.59 4.34 10.219 7.486 3.171 3.727 4.865 8.184 4.845 12.75a18.939 18.939 0 01-.401 3.844 18.529 18.529 0 01-.864 2.781l-.676 1.708-1.827-1.114c-4.24-2.595-8.982-4.568-14.02-5.834l-1.328-.343.125-1.105v-.572c0-1.385-.516-2.735-1.477-3.865-.789-.945-1.84-1.716-3.066-2.25a9.992 9.992 0 00-3.97-.813 9.887 9.887 0 00-2.127.271 8.2 8.2 0 00-2.203.802L42.337 50a7.071 7.071 0 00-2.209 1.79 5.713 5.713 0 00-1.158 2.377 6.057 6.057 0 00-.163 1.104c-.001 1.378.515 2.722 1.477 3.844.788.945 1.84 1.717 3.065 2.25a9.98 9.98 0 003.97.812 9.918 9.918 0 002.153-.23 8.35 8.35 0 002.204-.801l13.67-7.292a29.125 29.125 0 017.273-2.656 34.305 34.305 0 017.16-.76c4.596 0 9.123.925 13.195 2.697 4.072 1.772 7.569 4.339 10.19 7.48 3.19 3.717 4.906 8.171 4.907 12.74.003 1.299-.135 2.596-.413 3.874-.609 2.817-1.917 5.497-3.839 7.87-1.923 2.372-4.418 4.385-7.328 5.911L60.726 110a29.233 29.233 0 01-7.285 2.667z\" fill=\"#fff\"></path>\n\n\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-svelte\"></use></svg>"},"ng-swiper":{"symbol":"<symbol id=\"ng-swiper\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 129 129\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M97.5869496,9.51093626 C115.83804,20.7848256 128,40.9721238 128,64 C128,99.346224 99.346224,128 64,128 C56.2920179,128 48.9022945,126.637372 42.0606106,124.137797 L41.3296807,123.865645 L42.5199148,123.48344 L44.0499006,122.981598 L44.8047554,122.729449 L44.8047554,122.729449 L45.5528525,122.476476 L47.0287766,121.968044 L48.477679,121.456268 L49.8995657,120.941118 L51.2944429,120.422561 L51.9817549,120.161995 L53.3361292,119.638268 C54.7663971,119.077773 56.1505947,118.511327 57.4887554,117.938757 L58.4837445,117.508179 L59.7032082,116.966702 C60.2391997,116.725238 60.7672019,116.482694 61.2872173,116.239057 L62.0612505,115.87278 L63.1998411,115.320271 L63.7590314,115.042615 L63.7590314,115.042615 L64.3114862,114.76402 L65.3961918,114.203997 C74.5017145,109.427674 80.6883363,104.239002 83.9729034,98.5499653 C90.9321253,86.4962393 84.8542511,73.6150855 67.4065187,60.4830885 L65.9866432,59.4185495 L65.1241488,58.7570907 L64.2867532,58.1006716 L63.4743719,57.4492672 L62.6869203,56.8028527 L62.3025167,56.4815088 L62.3025167,56.4815088 L61.9243138,56.161403 L61.1864678,55.5248932 L60.6492814,55.0507377 L60.6492814,55.0507377 L60.1259396,54.5793364 L59.4496246,53.9550673 L58.7977741,53.3356509 L58.1703034,52.7210621 L57.865684,52.4155703 L57.865684,52.4155703 L57.5671278,52.1112761 L56.9881629,51.5062679 C50.0910281,44.1742986 48.550875,37.8976624 51.6821025,32.4742173 C53.275799,29.713854 56.0387768,26.999998 59.9662039,24.3569485 L60.4430842,24.040124 L61.1940488,23.5569049 C61.5336196,23.3425039 61.8809347,23.1285905 62.2359916,22.9151777 L62.7743828,22.5954356 L63.603739,22.1172522 L64.4592124,21.6408141 L65.1179529,21.2846511 L65.1179529,21.2846511 L65.7913778,20.9295026 L66.7121153,20.4575739 C67.4124544,20.1043216 68.1348104,19.7526404 68.8791706,19.4025938 L69.6308651,19.0530944 L70.6559388,18.5888147 L71.1782513,18.3574212 L72.2424237,17.8961475 L72.7842819,17.6662758 L73.887538,17.2080833 L74.4489343,16.9797709 L75.5912592,16.5247346 L76.1721862,16.2980192 L77.353565,15.8462143 L78.5609715,15.3966054 L79.174433,15.1726349 L80.4208685,14.7263826 L81.6933149,14.2824097 L82.9917658,13.8407497 L83.6507409,13.6207974 L84.9881859,13.1826691 L86.3516187,12.7469371 L87.7410327,12.3136347 L89.1564212,11.8827954 L90.5977776,11.4544525 L92.4359804,10.9225852 L94.3147346,10.394736 L96.6227494,9.76671243 L97.5869496,9.51093626 Z M64,0 C71.7830114,0 79.2415381,1.38928435 86.1411179,3.93339103 L86.8782091,4.21038217 L86.4108627,4.35186467 L84.1313124,5.0545346 L83.3848908,5.2905768 L81.9121853,5.76541455 L80.4663248,6.24395126 L79.0473024,6.72622031 L77.6551115,7.21225509 L76.2897456,7.70208898 L75.6171199,7.94844102 L73.9648828,8.56854028 L72.3545311,9.19471909 L71.0963985,9.70008321 L70.4773795,9.95425044 L69.2594321,10.4655761 C56.8123589,15.7699668 48.6548341,21.7176 44.7538993,28.4742173 C37.9453585,40.2669559 44.1208291,52.9796592 61.5702618,66.1081375 L62.9900625,67.1727537 L63.8522936,67.8346365 L64.6892575,68.491774 L65.09829,68.8185721 L65.8975078,69.468645 L66.4804703,69.9531308 L66.4804703,69.9531308 L67.0493707,70.4349994 L67.7860906,71.0734406 L68.1451248,71.3909334 L68.8445933,72.0224812 C69.2263095,72.3720718 69.5965761,72.7195512 69.9554568,73.0649416 L70.4852463,73.5814631 L71.248012,74.3504059 L71.9726186,75.1123909 C78.8402712,82.495364 80.3081527,88.8974997 77.0447002,94.5499653 C74.933031,98.2074836 70.9013706,101.807999 64.958951,105.303275 L64.4134675,105.620736 L63.5293583,106.121564 L62.6189315,106.620891 C62.1058295,106.897871 61.5805462,107.174142 61.0430864,107.449677 L60.227765,107.862426 L59.2252746,108.356245 L58.1964941,108.848418 L57.1414295,109.338914 L56.6040425,109.583523 L55.5095633,110.071443 L54.3888152,110.557607 L53.2418044,111.041982 L52.6584524,111.283488 L51.4720589,111.76512 L50.869019,112.005238 L50.869019,112.005238 L50.259418,112.244884 L49.0205357,112.722748 L47.755418,113.19868 L46.4640712,113.672647 L45.1465013,114.144619 L43.8027143,114.614564 L43.1209914,114.848766 L41.7378904,115.315609 L41.0365138,115.548243 L39.6141124,116.011914 L38.1655184,116.47343 L36.3179518,117.047246 L34.4294807,117.617582 L32.8892605,118.071305 L30.739698,118.689489 C12.3072163,107.455464 0,87.1649844 0,64 C0,28.653776 28.653776,0 64,0 Z\" transform=\"translate(.335 .835)\" fill=\"#0080FF\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-swiper\"></use></svg>"},"ng-tmdb":{"symbol":"<symbol id=\"ng-tmdb\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 190.24 81.52\"><defs xmlns=\"http://www.w3.org/2000/svg\"><style>.cls-1{fill:url(#linear-gradient);}</style><linearGradient id=\"linear-gradient\" y1=\"40.76\" x2=\"190.24\" y2=\"40.76\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#90cea1\"></stop><stop offset=\"0.56\" stop-color=\"#3cbec9\"></stop><stop offset=\"1\" stop-color=\"#00b3e5\"></stop></linearGradient></defs>\n<title xmlns=\"http://www.w3.org/2000/svg\">Asset 2</title>\n<g xmlns=\"http://www.w3.org/2000/svg\" id=\"Layer_2\" data-name=\"Layer 2\"><g id=\"Layer_1-2\" data-name=\"Layer 1\"><path class=\"cls-1\" d=\"M105.67,36.06h66.9A17.67,17.67,0,0,0,190.24,18.4h0A17.67,17.67,0,0,0,172.57.73h-66.9A17.67,17.67,0,0,0,88,18.4h0A17.67,17.67,0,0,0,105.67,36.06Zm-88,45h76.9A17.67,17.67,0,0,0,112.24,63.4h0A17.67,17.67,0,0,0,94.57,45.73H17.67A17.67,17.67,0,0,0,0,63.4H0A17.67,17.67,0,0,0,17.67,81.06ZM10.41,35.42h7.8V6.92h10.1V0H.31v6.9h10.1Zm28.1,0h7.8V8.25h.1l9,27.15h6l9.3-27.15h.1V35.4h7.8V0H66.76l-8.2,23.1h-.1L50.31,0H38.51ZM152.43,55.67a15.07,15.07,0,0,0-4.52-5.52,18.57,18.57,0,0,0-6.68-3.08,33.54,33.54,0,0,0-8.07-1h-11.7v35.4h12.75a24.58,24.58,0,0,0,7.55-1.15A19.34,19.34,0,0,0,148.11,77a16.27,16.27,0,0,0,4.37-5.5,16.91,16.91,0,0,0,1.63-7.58A18.5,18.5,0,0,0,152.43,55.67ZM145,68.6A8.8,8.8,0,0,1,142.36,72a10.7,10.7,0,0,1-4,1.82,21.57,21.57,0,0,1-5,.55h-4.05v-21h4.6a17,17,0,0,1,4.67.63,11.66,11.66,0,0,1,3.88,1.87A9.14,9.14,0,0,1,145,59a9.87,9.87,0,0,1,1,4.52A11.89,11.89,0,0,1,145,68.6Zm44.63-.13a8,8,0,0,0-1.58-2.62A8.38,8.38,0,0,0,185.63,64a10.31,10.31,0,0,0-3.17-1v-.1a9.22,9.22,0,0,0,4.42-2.82,7.43,7.43,0,0,0,1.68-5,8.42,8.42,0,0,0-1.15-4.65,8.09,8.09,0,0,0-3-2.72,12.56,12.56,0,0,0-4.18-1.3,32.84,32.84,0,0,0-4.62-.33h-13.2v35.4h14.5a22.41,22.41,0,0,0,4.72-.5,13.53,13.53,0,0,0,4.28-1.65,9.42,9.42,0,0,0,3.1-3,8.52,8.52,0,0,0,1.2-4.68A9.39,9.39,0,0,0,189.66,68.47ZM170.21,52.72h5.3a10,10,0,0,1,1.85.18,6.18,6.18,0,0,1,1.7.57,3.39,3.39,0,0,1,1.22,1.13,3.22,3.22,0,0,1,.48,1.82,3.63,3.63,0,0,1-.43,1.8,3.4,3.4,0,0,1-1.12,1.2,4.92,4.92,0,0,1-1.58.65,7.51,7.51,0,0,1-1.77.2h-5.65Zm11.72,20a3.9,3.9,0,0,1-1.22,1.3,4.64,4.64,0,0,1-1.68.7,8.18,8.18,0,0,1-1.82.2h-7v-8h5.9a15.35,15.35,0,0,1,2,.15,8.47,8.47,0,0,1,2.05.55,4,4,0,0,1,1.57,1.18,3.11,3.11,0,0,1,.63,2A3.71,3.71,0,0,1,181.93,72.72Z\"></path></g></g>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-tmdb\"></use></svg>"},"ng-volume-off":{"symbol":"<symbol id=\"ng-volume-off\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M0 0h24v24H0z\" fill=\"none\"></path>\n<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-volume-off\"></use></svg>"},"ng-volume-up":{"symbol":"<symbol id=\"ng-volume-up\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M0 0h24v24H0z\" fill=\"none\"></path>\n<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z\"></path>\n</symbol>","xlink":"<svg fill=\"currentColor\" class=\"ng-svg-icon\"><use xlink:href=\"#ng-volume-up\"></use></svg>"}};
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


// generate xlinks
const ng_bootstrap = new Xlink('ng-bootstrap');
const ng_cancel = new Xlink('ng-cancel');
const ng_check_circle = new Xlink('ng-check-circle');
const ng_chevron_right = new Xlink('ng-chevron-right');
const ng_close = new Xlink('ng-close');
const ng_devicon = new Xlink('ng-devicon');
const ng_done = new Xlink('ng-done');
const ng_emoji_events = new Xlink('ng-emoji-events');
const ng_gfonts = new Xlink('ng-gfonts');
const ng_github_revert = new Xlink('ng-github-revert');
const ng_github = new Xlink('ng-github');
const ng_help = new Xlink('ng-help');
const ng_info = new Xlink('ng-info');
const ng_node = new Xlink('ng-node');
const ng_play_arrow = new Xlink('ng-play-arrow');
const ng_sass = new Xlink('ng-sass');
const ng_svelte = new Xlink('ng-svelte');
const ng_swiper = new Xlink('ng-swiper');
const ng_tmdb = new Xlink('ng-tmdb');
const ng_volume_off = new Xlink('ng-volume-off');
const ng_volume_up = new Xlink('ng-volume-up');

// creates naming map
const names = [    ['ng-bootstrap', 'ng_bootstrap'],
    ['ng-cancel', 'ng_cancel'],
    ['ng-check-circle', 'ng_check_circle'],
    ['ng-chevron-right', 'ng_chevron_right'],
    ['ng-close', 'ng_close'],
    ['ng-devicon', 'ng_devicon'],
    ['ng-done', 'ng_done'],
    ['ng-emoji-events', 'ng_emoji_events'],
    ['ng-gfonts', 'ng_gfonts'],
    ['ng-github-revert', 'ng_github_revert'],
    ['ng-github', 'ng_github'],
    ['ng-help', 'ng_help'],
    ['ng-info', 'ng_info'],
    ['ng-node', 'ng_node'],
    ['ng-play-arrow', 'ng_play_arrow'],
    ['ng-sass', 'ng_sass'],
    ['ng-svelte', 'ng_svelte'],
    ['ng-swiper', 'ng_swiper'],
    ['ng-tmdb', 'ng_tmdb'],
    ['ng-volume-off', 'ng_volume_off'],
    ['ng-volume-up', 'ng_volume_up'],
];

// generate default export
const svgs = {
    ng_bootstrap,
    ng_cancel,
    ng_check_circle,
    ng_chevron_right,
    ng_close,
    ng_devicon,
    ng_done,
    ng_emoji_events,
    ng_gfonts,
    ng_github_revert,
    ng_github,
    ng_help,
    ng_info,
    ng_node,
    ng_play_arrow,
    ng_sass,
    ng_svelte,
    ng_swiper,
    ng_tmdb,
    ng_volume_off,
    ng_volume_up,
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


watch();

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

        return instance$m.on(type, listener, once);
    }

    static one(type, listener)
    {

        return instance$m.one(type, listener);
    }

    static off(type, listener)
    {

        return instance$m.off(type, listener);
    }

    static trigger(type, data = null, async = null)
    {

        return instance$m.trigger(type, data, async);
    }

}



const instance$m = new EventManager();

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
            this.elements.content.innerHTML = '';
            value.forEach(html =>
            {
                if (isString(html))
                {
                    this.elements.content.innerHTML += html;
                } else if (isElement$1(html))
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
        });


    }


    destroy()
    {
        dialogs.delete(this);
        this.element.remove();
    }


}


/**
 * Binding for svelte
 */
function createDialog({ backdropCloses,
    canCancel,
    canClose, position } = {})
{



    const dialog = new Dialog();
    dialog.backdropCloses = backdropCloses ?? true;
    dialog.canCancel = canCancel ?? true;
    dialog.canClose = canClose ?? true;
    if (position instanceof Position)
    {
        dialog.position = position;
    }


    const oncreateDialog = (el) =>
    {

        if (el.hasAttribute('title'))
        {
            dialog.title = el.getAttribute("title");
        }
        dialog.content = el;

        return {
            onDestroy()
            {
                dialog.destroy();
            }
        };
    };



    return {
        dialog,
        oncreateDialog,
    };



}

/* src\components\Heading.svelte generated by Svelte v3.59.1 */
const file$g = "src\\components\\Heading.svelte";

// (38:0) {#if found || force}
function create_if_block$f(ctx) {
	let div1;
	let h3;
	let t0;
	let t1;
	let div0;
	let t2;
	let if_block0 = /*youtube*/ ctx[3] && create_if_block_2$1(ctx);
	let if_block1 = /*id*/ ctx[4] && /*more*/ ctx[1] && create_if_block_1$2(ctx);

	const block = {
		c: function create() {
			div1 = element("div");
			h3 = element("h3");
			t0 = text(/*title*/ ctx[5]);
			t1 = space();
			div0 = element("div");
			if (if_block0) if_block0.c();
			t2 = space();
			if (if_block1) if_block1.c();
			this.h();
		},
		l: function claim(nodes) {
			div1 = claim_element(nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			h3 = claim_element(div1_nodes, "H3", { class: true });
			var h3_nodes = children(h3);
			t0 = claim_text(h3_nodes, /*title*/ ctx[5]);
			h3_nodes.forEach(detach_dev);
			t1 = claim_space(div1_nodes);
			div0 = claim_element(div1_nodes, "DIV", { class: true });
			var div0_nodes = children(div0);
			if (if_block0) if_block0.l(div0_nodes);
			t2 = claim_space(div0_nodes);
			if (if_block1) if_block1.l(div0_nodes);
			div0_nodes.forEach(detach_dev);
			div1_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(h3, "class", "heading-title text-uppercase mb-3");
			add_location(h3, file$g, 40, 8, 1153);
			attr_dev(div0, "class", "d-flex flex-column flex-lg-row align-items-center");
			add_location(div0, file$g, 44, 8, 1243);
			attr_dev(div1, "class", "heading p-5 p-lg-0");
			add_location(div1, file$g, 39, 4, 1112);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div1, anchor);
			append_hydration_dev(div1, h3);
			append_hydration_dev(h3, t0);
			append_hydration_dev(div1, t1);
			append_hydration_dev(div1, div0);
			if (if_block0) if_block0.m(div0, null);
			append_hydration_dev(div0, t2);
			if (if_block1) if_block1.m(div0, null);
		},
		p: function update(ctx, dirty) {
			if (/*youtube*/ ctx[3]) if_block0.p(ctx, dirty);

			if (/*id*/ ctx[4] && /*more*/ ctx[1]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_1$2(ctx);
					if_block1.c();
					if_block1.m(div0, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$f.name,
		type: "if",
		source: "(38:0) {#if found || force}",
		ctx
	});

	return block;
}

// (46:12) {#if youtube}
function create_if_block_2$1(ctx) {
	let a;
	let i;
	let t0;
	let span;
	let t1;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			a = element("a");
			i = element("i");
			t0 = space();
			span = element("span");
			t1 = text("Voir la bande annonce");
			this.h();
		},
		l: function claim(nodes) {
			a = claim_element(nodes, "A", { href: true, target: true, class: true });
			var a_nodes = children(a);
			i = claim_element(a_nodes, "I", { class: true, size: true });
			children(i).forEach(detach_dev);
			t0 = claim_space(a_nodes);
			span = claim_element(a_nodes, "SPAN", {});
			var span_nodes = children(span);
			t1 = claim_text(span_nodes, "Voir la bande annonce");
			span_nodes.forEach(detach_dev);
			a_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(i, "class", "ng-play-arrow");
			attr_dev(i, "size", "32");
			add_location(i, file$g, 52, 20, 1583);
			add_location(span, file$g, 53, 20, 1641);
			attr_dev(a, "href", /*youtube*/ ctx[3]);
			attr_dev(a, "target", "_blank");
			attr_dev(a, "class", "button-play btn btn-light btn-lg col-12 col-lg-auto");
			add_location(a, file$g, 46, 16, 1349);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, a, anchor);
			append_hydration_dev(a, i);
			append_hydration_dev(a, t0);
			append_hydration_dev(a, span);
			append_hydration_dev(span, t1);

			if (!mounted) {
				dispose = listen_dev(a, "click", /*makeDialog*/ ctx[2], false, false, false, false);
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
		id: create_if_block_2$1.name,
		type: "if",
		source: "(46:12) {#if youtube}",
		ctx
	});

	return block;
}

// (57:12) {#if id && more}
function create_if_block_1$2(ctx) {
	let a;
	let i;
	let t0;
	let span;
	let t1;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			a = element("a");
			i = element("i");
			t0 = space();
			span = element("span");
			t1 = text("Plus d'infos");
			this.h();
		},
		l: function claim(nodes) {
			a = claim_element(nodes, "A", { href: true, class: true });
			var a_nodes = children(a);
			i = claim_element(a_nodes, "I", { class: true, size: true });
			children(i).forEach(detach_dev);
			t0 = claim_space(a_nodes);
			span = claim_element(a_nodes, "SPAN", {});
			var span_nodes = children(span);
			t1 = claim_text(span_nodes, "Plus d'infos");
			span_nodes.forEach(detach_dev);
			a_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(i, "class", "ng-info");
			attr_dev(i, "size", "32");
			add_location(i, file$g, 62, 20, 1978);
			add_location(span, file$g, 63, 20, 2030);
			attr_dev(a, "href", "/details/" + /*id*/ ctx[4]);
			attr_dev(a, "class", "button-infos btn btn-secondary btn-lg col-12 col-lg-auto ms-lg-3 my-3 my-lg-0");
			add_location(a, file$g, 57, 16, 1760);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, a, anchor);
			append_hydration_dev(a, i);
			append_hydration_dev(a, t0);
			append_hydration_dev(a, span);
			append_hydration_dev(span, t1);

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
		source: "(57:12) {#if id && more}",
		ctx
	});

	return block;
}

function create_fragment$l(ctx) {
	let if_block_anchor;
	let if_block = (/*found*/ ctx[6] || /*force*/ ctx[0]) && create_if_block$f(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_hydration_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*found*/ ctx[6] || /*force*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$f(ctx);
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
		id: create_fragment$l.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$l($$self, $$props, $$invalidate) {
	let $current;
	validate_store(current, 'current');
	component_subscribe($$self, current, $$value => $$invalidate(8, $current = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Heading', slots, []);
	let { force = false, more = true } = $$props;
	let dialog;

	if (!isPlainObject($current) || !$current.title) {
		force = false;
	}

	function makeDialog(e) {
		if (!IS_TOUCH) {
			e.preventDefault();
			dialog ??= new Dialog(embed, $current.title, "youtube-video");
			dialog.position = Position.TOP;
			dialog.elements.ok.hidden = true;
			dialog.canCancel = false;
			dialog.showModal(false).then(() => dialog.element.remove());
		}
	}

	let youtube = getYoutubeUrl($current),
		embed = getEmbedHtml($current),
		{ id, title } = $current,
		found = isFound($current);

	const writable_props = ['force', 'more'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Heading> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('force' in $$props) $$invalidate(0, force = $$props.force);
		if ('more' in $$props) $$invalidate(1, more = $$props.more);
	};

	$$self.$capture_state = () => ({
		links,
		current,
		getEmbedHtml,
		getYoutubeUrl,
		isFound,
		IS_TOUCH,
		isPlainObject,
		Dialog,
		Position,
		force,
		more,
		dialog,
		makeDialog,
		youtube,
		embed,
		id,
		title,
		found,
		$current
	});

	$$self.$inject_state = $$props => {
		if ('force' in $$props) $$invalidate(0, force = $$props.force);
		if ('more' in $$props) $$invalidate(1, more = $$props.more);
		if ('dialog' in $$props) dialog = $$props.dialog;
		if ('youtube' in $$props) $$invalidate(3, youtube = $$props.youtube);
		if ('embed' in $$props) embed = $$props.embed;
		if ('id' in $$props) $$invalidate(4, id = $$props.id);
		if ('title' in $$props) $$invalidate(5, title = $$props.title);
		if ('found' in $$props) $$invalidate(6, found = $$props.found);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [force, more, makeDialog, youtube, id, title, found];
}

class Heading extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$l, create_fragment$l, safe_not_equal, { force: 0, more: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Heading",
			options,
			id: create_fragment$l.name
		});
	}

	get force() {
		return this.$$.ctx[0];
	}

	set force(force) {
		this.$$set({ force });
		flush();
	}

	get more() {
		return this.$$.ctx[1];
	}

	set more(more) {
		this.$$set({ more });
		flush();
	}
}

/* src\components\Cover.svelte generated by Svelte v3.59.1 */
const file$f = "src\\components\\Cover.svelte";

function create_fragment$k(ctx) {
	let div2;
	let div1;
	let img;
	let img_src_value;
	let t0;
	let div0;
	let t1;
	let heading;
	let t2;
	let current;
	let mounted;
	let dispose;

	heading = new Heading({
			props: {
				more: /*more*/ ctx[0],
				force: /*force*/ ctx[1]
			},
			$$inline: true
		});

	const default_slot_template = /*#slots*/ ctx[5].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

	const block = {
		c: function create() {
			div2 = element("div");
			div1 = element("div");
			img = element("img");
			t0 = space();
			div0 = element("div");
			t1 = space();
			create_component(heading.$$.fragment);
			t2 = space();
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			div2 = claim_element(nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			div1 = claim_element(div2_nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			img = claim_element(div1_nodes, "IMG", { src: true, alt: true, class: true });
			t0 = claim_space(div1_nodes);
			div0 = claim_element(div1_nodes, "DIV", { class: true });
			children(div0).forEach(detach_dev);
			div1_nodes.forEach(detach_dev);
			t1 = claim_space(div2_nodes);
			claim_component(heading.$$.fragment, div2_nodes);
			t2 = claim_space(div2_nodes);
			if (default_slot) default_slot.l(div2_nodes);
			div2_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			if (!src_url_equal(img.src, img_src_value = /*$current*/ ctx[2].cover.w1280)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "affiche du film");
			attr_dev(img, "class", "");
			add_location(img, file$f, 15, 8, 446);
			attr_dev(div0, "class", "blured");
			add_location(div0, file$f, 21, 8, 593);
			attr_dev(div1, "class", "background-picture position-relative");
			add_location(div1, file$f, 14, 4, 386);
			attr_dev(div2, "class", "cover");
			add_location(div2, file$f, 13, 0, 361);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div2, anchor);
			append_hydration_dev(div2, div1);
			append_hydration_dev(div1, img);
			append_hydration_dev(div1, t0);
			append_hydration_dev(div1, div0);
			append_hydration_dev(div2, t1);
			mount_component(heading, div2, null);
			append_hydration_dev(div2, t2);

			if (default_slot) {
				default_slot.m(div2, null);
			}

			current = true;

			if (!mounted) {
				dispose = action_destroyer(/*onload*/ ctx[3].call(null, img));
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (!current || dirty & /*$current*/ 4 && !src_url_equal(img.src, img_src_value = /*$current*/ ctx[2].cover.w1280)) {
				attr_dev(img, "src", img_src_value);
			}

			const heading_changes = {};
			if (dirty & /*more*/ 1) heading_changes.more = /*more*/ ctx[0];
			if (dirty & /*force*/ 2) heading_changes.force = /*force*/ ctx[1];
			heading.$set(heading_changes);

			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[4],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
						null
					);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(heading.$$.fragment, local);
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(heading.$$.fragment, local);
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			destroy_component(heading);
			if (default_slot) default_slot.d(detaching);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$k.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$k($$self, $$props, $$invalidate) {
	let $current;
	validate_store(current, 'current');
	component_subscribe($$self, current, $$value => $$invalidate(2, $current = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Cover', slots, ['default']);
	let { more = true, force = false } = $$props;
	const { onload } = createResourceLoader(noop$1);
	const writable_props = ['more', 'force'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Cover> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('more' in $$props) $$invalidate(0, more = $$props.more);
		if ('force' in $$props) $$invalidate(1, force = $$props.force);
		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		noop: noop$1,
		createResourceLoader,
		Heading,
		current,
		more,
		force,
		onload,
		$current
	});

	$$self.$inject_state = $$props => {
		if ('more' in $$props) $$invalidate(0, more = $$props.more);
		if ('force' in $$props) $$invalidate(1, force = $$props.force);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [more, force, $current, onload, $$scope, slots];
}

class Cover extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$k, create_fragment$k, safe_not_equal, { more: 0, force: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Cover",
			options,
			id: create_fragment$k.name
		});
	}

	get more() {
		return this.$$.ctx[0];
	}

	set more(more) {
		this.$$set({ more });
		flush();
	}

	get force() {
		return this.$$.ctx[1];
	}

	set force(force) {
		this.$$set({ force });
		flush();
	}
}

var stringSimilarity = {};

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.stringSimilarity = void 0;
	/* global exports, Map */
	/**
	 * Calculate similarity between two strings
	 * @param {string} str1 First string to match
	 * @param {string} str2 Second string to match
	 * @param {number} [substringLength=2] Optional. Length of substring to be used in calculating similarity. Default 2.
	 * @param {boolean} [caseSensitive=false] Optional. Whether you want to consider case in string matching. Default false;
	 * @returns Number between 0 and 1, with 0 being a low match score.
	 */
	var stringSimilarity = function (str1, str2, substringLength, caseSensitive) {
	    if (substringLength === void 0) { substringLength = 2; }
	    if (caseSensitive === void 0) { caseSensitive = false; }
	    if (!caseSensitive) {
	        str1 = str1.toLowerCase();
	        str2 = str2.toLowerCase();
	    }
	    if (str1.length < substringLength || str2.length < substringLength)
	        return 0;
	    var map = new Map();
	    for (var i = 0; i < str1.length - (substringLength - 1); i++) {
	        var substr1 = str1.substr(i, substringLength);
	        map.set(substr1, map.has(substr1) ? map.get(substr1) + 1 : 1);
	    }
	    var match = 0;
	    for (var j = 0; j < str2.length - (substringLength - 1); j++) {
	        var substr2 = str2.substr(j, substringLength);
	        var count = map.has(substr2) ? map.get(substr2) : 0;
	        if (count > 0) {
	            map.set(substr2, count - 1);
	            match++;
	        }
	    }
	    return (match * 2) / (str1.length + str2.length - ((substringLength - 1) * 2));
	};
	exports.stringSimilarity = stringSimilarity;
	exports.default = exports.stringSimilarity;
	
} (stringSimilarity));

/**
 * Toggle loading screen
 */
const loading = derived([ready, loading$1], ([$ready, $rload]) =>
{
    return !$ready || $rload > 0;
});

const loaderDisplayed = writable(true);

const PATH = '/assets/sound/', EXT = '.ogg',
    LocalStore = new WebStore(localStorage, 'MovieQuiz');

const players = new Map();


/**
 * Hook to mute sound
 */

const muted = LocalStore.hook('soundMuted', false);

const playIntro = writable(false);


function playAudio(el)
{

    return new Promise((resolve, reject) =>
    {
        if (isElement$1(el))
        {
            el.currentTime = 0;

            setTimeout(() =>
            {
                resolve(el);
            }, (el.duration * 1000) + 200);

            if (el.paused && !el.muted)
            {
                // chrome 2018 forbade autoplay and throws error
                try
                {
                    el.play();
                } catch (err)
                {
                    console.warn(err);
                }
            }
            else
            {
                resolve(el);
            }

        } else
        {
            reject(new TypeError("not an element"));
        }


    });

}




class SoundTrack extends BackedEnum
{

    /**
     * Intro sound
     */
    static INTRO = new SoundTrack('intro');

    /**
     * Victory Sounds
     */
    static SUCCESS = new SoundTrack('success');
    static VICTORY = new SoundTrack("victory");


    /**
     * Errors Sounds
     */
    static ERROR = new SoundTrack('error');
    static NASTY = new SoundTrack("nasty");
    static WRONG = new SoundTrack("wrong");


    static get errorSound()
    {

        const
            choises = ['error', 'nasty', 'wrong'],
            key = Math.floor(Math.random() * choises.length);
        return this.from(choises[key]);
    }

    static get victorySound()
    {
        const streak = get_store_value(WinningStreak);
        if (streak && streak % 10 === 0)
        {
            return this.VICTORY;
        }
        return this.SUCCESS;
    }




    get url()
    {
        return getUrl(PATH + this.value + EXT);
    }


    set player(el)
    {
        players.set(this, el);
        muted.subscribe(value =>
        {
            el.muted = value ? value : null;
        });

    }

    get player()
    {
        return players.get(this);
    }


    play()
    {
        return playAudio(this.player);
    }


    pause()
    {
        this.player?.pause();
    }


    destroy()
    {
        this.pause();
        players.delete(this);
    }
}

/* src\components\GameForm.svelte generated by Svelte v3.59.1 */
const file$e = "src\\components\\GameForm.svelte";

// (77:0) {#if $validResults.length}
function create_if_block$e(ctx) {
	let form;
	let div3;
	let label;
	let t0;
	let t1;
	let div2;
	let div0;
	let input_1;
	let t2;
	let span0;
	let t3;
	let t4;
	let span1;
	let t5;
	let div1;
	let button;
	let i;
	let button_disabled_value;
	let t6;
	let span2;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			form = element("form");
			div3 = element("div");
			label = element("label");
			t0 = text("Votre Proposition:");
			t1 = space();
			div2 = element("div");
			div0 = element("div");
			input_1 = element("input");
			t2 = space();
			span0 = element("span");
			t3 = text("Entrez un nom de film ou de série");
			t4 = space();
			span1 = element("span");
			t5 = space();
			div1 = element("div");
			button = element("button");
			i = element("i");
			t6 = space();
			span2 = element("span");
			this.h();
		},
		l: function claim(nodes) {
			form = claim_element(nodes, "FORM", {
				method: true,
				id: true,
				name: true,
				class: true
			});

			var form_nodes = children(form);
			div3 = claim_element(form_nodes, "DIV", { class: true });
			var div3_nodes = children(div3);
			label = claim_element(div3_nodes, "LABEL", { for: true });
			var label_nodes = children(label);
			t0 = claim_text(label_nodes, "Votre Proposition:");
			label_nodes.forEach(detach_dev);
			t1 = claim_space(div3_nodes);
			div2 = claim_element(div3_nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			div0 = claim_element(div2_nodes, "DIV", { class: true });
			var div0_nodes = children(div0);

			input_1 = claim_element(div0_nodes, "INPUT", {
				type: true,
				name: true,
				id: true,
				placeholder: true,
				class: true,
				autocomplete: true
			});

			t2 = claim_space(div0_nodes);
			span0 = claim_element(div0_nodes, "SPAN", { class: true });
			var span0_nodes = children(span0);
			t3 = claim_text(span0_nodes, "Entrez un nom de film ou de série");
			span0_nodes.forEach(detach_dev);
			t4 = claim_space(div0_nodes);
			span1 = claim_element(div0_nodes, "SPAN", { class: true });
			children(span1).forEach(detach_dev);
			div0_nodes.forEach(detach_dev);
			t5 = claim_space(div2_nodes);
			div1 = claim_element(div2_nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			button = claim_element(div1_nodes, "BUTTON", { type: true, title: true, class: true });
			var button_nodes = children(button);
			i = claim_element(button_nodes, "I", { class: true, size: true });
			children(i).forEach(detach_dev);
			button_nodes.forEach(detach_dev);
			t6 = claim_space(div1_nodes);
			span2 = claim_element(div1_nodes, "SPAN", { class: true });
			children(span2).forEach(detach_dev);
			div1_nodes.forEach(detach_dev);
			div2_nodes.forEach(detach_dev);
			div3_nodes.forEach(detach_dev);
			form_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(label, "for", "user-input col-lg-5");
			add_location(label, file$e, 86, 12, 2335);
			attr_dev(input_1, "type", "text");
			attr_dev(input_1, "name", "user-input");
			attr_dev(input_1, "id", "user-input");
			attr_dev(input_1, "placeholder", "Entrez un nom de film ou de série");
			attr_dev(input_1, "class", "");
			attr_dev(input_1, "autocomplete", "off");
			input_1.required = true;
			add_location(input_1, file$e, 89, 20, 2520);
			attr_dev(span0, "class", "input--placeholder");
			add_location(span0, file$e, 101, 20, 3005);
			attr_dev(span1, "class", "input--bar");
			add_location(span1, file$e, 104, 20, 3148);
			attr_dev(div0, "class", "input--group input-text");
			add_location(div0, file$e, 88, 16, 2461);
			attr_dev(i, "class", "ng-done");
			attr_dev(i, "size", "20");
			add_location(i, file$e, 113, 24, 3496);
			attr_dev(button, "type", "submit");
			attr_dev(button, "title", "Valider");
			button.disabled = button_disabled_value = !/*value*/ ctx[0].length;
			attr_dev(button, "class", "");
			add_location(button, file$e, 107, 20, 3276);
			attr_dev(span2, "class", "input--bar");
			add_location(span2, file$e, 115, 20, 3580);
			attr_dev(div1, "class", "input--group btn-submit");
			add_location(div1, file$e, 106, 16, 3217);
			attr_dev(div2, "class", "input--mix col-lg-7");
			add_location(div2, file$e, 87, 12, 2410);
			attr_dev(div3, "class", "form--input");
			add_location(div3, file$e, 85, 8, 2296);
			attr_dev(form, "method", "post");
			attr_dev(form, "id", "input-movie-title");
			attr_dev(form, "name", "input-movie-title");
			attr_dev(form, "class", "");
			form.noValidate = true;
			add_location(form, file$e, 77, 4, 2098);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, form, anchor);
			append_hydration_dev(form, div3);
			append_hydration_dev(div3, label);
			append_hydration_dev(label, t0);
			append_hydration_dev(div3, t1);
			append_hydration_dev(div3, div2);
			append_hydration_dev(div2, div0);
			append_hydration_dev(div0, input_1);
			set_input_value(input_1, /*value*/ ctx[0]);
			/*input_1_binding*/ ctx[6](input_1);
			append_hydration_dev(div0, t2);
			append_hydration_dev(div0, span0);
			append_hydration_dev(span0, t3);
			append_hydration_dev(div0, t4);
			append_hydration_dev(div0, span1);
			append_hydration_dev(div2, t5);
			append_hydration_dev(div2, div1);
			append_hydration_dev(div1, button);
			append_hydration_dev(button, i);
			append_hydration_dev(div1, t6);
			append_hydration_dev(div1, span2);

			if (!mounted) {
				dispose = [
					listen_dev(input_1, "input", /*input_1_input_handler*/ ctx[5]),
					listen_dev(input_1, "input", /*handleInput*/ ctx[3], false, false, false, false),
					listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[4]), false, true, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*value*/ 1 && input_1.value !== /*value*/ ctx[0]) {
				set_input_value(input_1, /*value*/ ctx[0]);
			}

			if (dirty & /*value*/ 1 && button_disabled_value !== (button_disabled_value = !/*value*/ ctx[0].length)) {
				prop_dev(button, "disabled", button_disabled_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(form);
			/*input_1_binding*/ ctx[6](null);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$e.name,
		type: "if",
		source: "(77:0) {#if $validResults.length}",
		ctx
	});

	return block;
}

function create_fragment$j(ctx) {
	let if_block_anchor;
	let if_block = /*$validResults*/ ctx[2].length && create_if_block$e(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_hydration_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*$validResults*/ ctx[2].length) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$e(ctx);
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
		id: create_fragment$j.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$j($$self, $$props, $$invalidate) {
	let $current;
	let $validResults;
	let $notify;
	validate_store(current, 'current');
	component_subscribe($$self, current, $$value => $$invalidate(8, $current = $$value));
	validate_store(validResults, 'validResults');
	component_subscribe($$self, validResults, $$value => $$invalidate(2, $validResults = $$value));
	validate_store(notify, 'notify');
	component_subscribe($$self, notify, $$value => $$invalidate(9, $notify = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('GameForm', slots, []);
	let value = "", normalized = "", input;
	const navigate = useNavigate();

	function handleInput() {
		normalized = removeAccent(value.toLowerCase());

		if ($notify !== Notification.NONE) {
			set_store_value(notify, $notify = Notification.NONE, $notify);
		}
	}

	function handleSubmit() {
		if ($validResults.map(valid => stringSimilarity.stringSimilarity(valid, normalized)).some(result => result > 0.82)) {
			Notification.SUCCESS.display();
			WinningStreak.increment();

			SoundTrack.victorySound.play().then(() => {
				Notification.NONE.display();
				setFound($current);
				navigate("/", { replace: true });
			});
		} else {
			setTimeout(
				() => {
					Notification.NONE.display();
				},
				3000
			);

			WinningStreak.clear();
			Notification.FAILURE.display();
			SoundTrack.errorSound.play();
		}

		$$invalidate(0, value = normalized = "");
	}

	onDestroy(validResults.subscribe(noop$1, () => {
		Notification.NONE.display();
		$$invalidate(0, value = normalized = "");
	}));

	onDestroy(loaderDisplayed.subscribe(value => {
		if (!value && input) {
			setTimeout(
				() => {
					input.focus();
				},
				500
			);
		}
	}));

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GameForm> was created with unknown prop '${key}'`);
	});

	function input_1_input_handler() {
		value = this.value;
		$$invalidate(0, value);
	}

	function input_1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			input = $$value;
			$$invalidate(1, input);
		});
	}

	$$self.$capture_state = () => ({
		onDestroy,
		Notification,
		WinningStreak,
		current,
		notify,
		setFound,
		validResults,
		stringSimilarity: stringSimilarity.stringSimilarity,
		removeAccent,
		noop: noop$1,
		loaderDisplayed,
		SoundTrack,
		useNavigate,
		value,
		normalized,
		input,
		navigate,
		handleInput,
		handleSubmit,
		$current,
		$validResults,
		$notify
	});

	$$self.$inject_state = $$props => {
		if ('value' in $$props) $$invalidate(0, value = $$props.value);
		if ('normalized' in $$props) normalized = $$props.normalized;
		if ('input' in $$props) $$invalidate(1, input = $$props.input);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		value,
		input,
		$validResults,
		handleInput,
		handleSubmit,
		input_1_input_handler,
		input_1_binding
	];
}

class GameForm extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$j, create_fragment$j, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "GameForm",
			options,
			id: create_fragment$j.name
		});
	}
}

/* src\components\Notify.svelte generated by Svelte v3.59.1 */
const file$d = "src\\components\\Notify.svelte";

// (8:47) 
function create_if_block_1$1(ctx) {
	let div;
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text("mauvaise réponse");
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			t = claim_text(div_nodes, "mauvaise réponse");
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div, "class", "notification");
			add_location(div, file$d, 8, 8, 314);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div, anchor);
			append_hydration_dev(div, t);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$1.name,
		type: "if",
		source: "(8:47) ",
		ctx
	});

	return block;
}

// (6:4) {#if $notify === Notification.SUCCESS}
function create_if_block$d(ctx) {
	let div;
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text("bonne réponse");
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			t = claim_text(div_nodes, "bonne réponse");
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div, "class", "notification");
			add_location(div, file$d, 6, 8, 210);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div, anchor);
			append_hydration_dev(div, t);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$d.name,
		type: "if",
		source: "(6:4) {#if $notify === Notification.SUCCESS}",
		ctx
	});

	return block;
}

function create_fragment$i(ctx) {
	let div;

	function select_block_type(ctx, dirty) {
		if (/*$notify*/ ctx[0] === Notification.SUCCESS) return create_if_block$d;
		if (/*$notify*/ ctx[0] === Notification.FAILURE) return create_if_block_1$1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type && current_block_type(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			if (if_block) if_block.l(div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div, "class", "notify-area position-absolute top-0 start-0 end-0 bottom-0");
			add_location(div, file$d, 4, 0, 84);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
		},
		p: function update(ctx, [dirty]) {
			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
				if (if_block) if_block.d(1);
				if_block = current_block_type && current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div, null);
				}
			}
		},
		i: noop$1,
		o: noop$1,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);

			if (if_block) {
				if_block.d();
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$i.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$i($$self, $$props, $$invalidate) {
	let $notify;
	validate_store(notify, 'notify');
	component_subscribe($$self, notify, $$value => $$invalidate(0, $notify = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Notify', slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Notify> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ notify, Notification, $notify });
	return [$notify];
}

class Notify extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$i, create_fragment$i, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Notify",
			options,
			id: create_fragment$i.name
		});
	}
}

/* src\pages\NotFound.svelte generated by Svelte v3.59.1 */
const file$c = "src\\pages\\NotFound.svelte";

function create_fragment$h(ctx) {
	let div2;
	let div0;
	let t0;
	let t1;
	let div1;
	let small;
	let t2;

	const block = {
		c: function create() {
			div2 = element("div");
			div0 = element("div");
			t0 = text("OOPS");
			t1 = space();
			div1 = element("div");
			small = element("small");
			t2 = text("That's a 404!");
			this.h();
		},
		l: function claim(nodes) {
			div2 = claim_element(nodes, "DIV", { class: true, id: true });
			var div2_nodes = children(div2);
			div0 = claim_element(div2_nodes, "DIV", { class: true });
			var div0_nodes = children(div0);
			t0 = claim_text(div0_nodes, "OOPS");
			div0_nodes.forEach(detach_dev);
			t1 = claim_space(div2_nodes);
			div1 = claim_element(div2_nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			small = claim_element(div1_nodes, "SMALL", { class: true });
			var small_nodes = children(small);
			t2 = claim_text(small_nodes, "That's a 404!");
			small_nodes.forEach(detach_dev);
			div1_nodes.forEach(detach_dev);
			div2_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div0, "class", "error-message svelte-1ckddih");
			add_location(div0, file$c, 13, 4, 342);
			attr_dev(small, "class", "svelte-1ckddih");
			add_location(small, file$c, 14, 31, 411);
			attr_dev(div1, "class", "error-message svelte-1ckddih");
			add_location(div1, file$c, 14, 4, 384);
			attr_dev(div2, "class", "position-fixed top-0 left-0 w-100 h-100 d-flex justify-content-center align-items-center flex-column user-select-none svelte-1ckddih");
			attr_dev(div2, "id", "page-not-found");
			add_location(div2, file$c, 9, 0, 177);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div2, anchor);
			append_hydration_dev(div2, div0);
			append_hydration_dev(div0, t0);
			append_hydration_dev(div2, t1);
			append_hydration_dev(div2, div1);
			append_hydration_dev(div1, small);
			append_hydration_dev(small, t2);
		},
		p: noop$1,
		i: noop$1,
		o: noop$1,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$h.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$h($$self, $$props, $$invalidate) {
	let $loaderDisplayed;
	validate_store(loaderDisplayed, 'loaderDisplayed');
	component_subscribe($$self, loaderDisplayed, $$value => $$invalidate(0, $loaderDisplayed = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('NotFound', slots, []);

	onMount(() => {
		set_store_value(loaderDisplayed, $loaderDisplayed = false, $loaderDisplayed);
	});

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NotFound> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		onMount,
		loaderDisplayed,
		$loaderDisplayed
	});

	return [];
}

class NotFound extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$h, create_fragment$h, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "NotFound",
			options,
			id: create_fragment$h.name
		});
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

/* src\components\slides\Poster.svelte generated by Svelte v3.59.1 */
const file$b = "src\\components\\slides\\Poster.svelte";

// (15:4) {#if title}
function create_if_block$c(ctx) {
	let div;
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text(/*title*/ ctx[3]);
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			t = claim_text(div_nodes, /*title*/ ctx[3]);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div, "class", "title");
			add_location(div, file$b, 14, 15, 358);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div, anchor);
			append_hydration_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*title*/ 8) set_data_dev(t, /*title*/ ctx[3]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$c.name,
		type: "if",
		source: "(15:4) {#if title}",
		ctx
	});

	return block;
}

function create_fragment$g(ctx) {
	let div;
	let t;
	let a;
	let img;
	let img_src_value;
	let div_class_value;
	let mounted;
	let dispose;
	let if_block = /*title*/ ctx[3] && create_if_block$c(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			t = space();
			a = element("a");
			img = element("img");
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			if (if_block) if_block.l(div_nodes);
			t = claim_space(div_nodes);
			a = claim_element(div_nodes, "A", { href: true });
			var a_nodes = children(a);
			img = claim_element(a_nodes, "IMG", { src: true, alt: true });
			a_nodes.forEach(detach_dev);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			if (!src_url_equal(img.src, img_src_value = /*cover*/ ctx[1] ?? NOPIC)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "Poster Media");
			add_location(img, file$b, 16, 8, 429);
			attr_dev(a, "href", /*href*/ ctx[0]);
			add_location(a, file$b, 15, 4, 400);
			attr_dev(div, "class", div_class_value = "poster flat m-2 " + /*found*/ ctx[2]);
			add_location(div, file$b, 13, 0, 305);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
			append_hydration_dev(div, t);
			append_hydration_dev(div, a);
			append_hydration_dev(a, img);

			if (!mounted) {
				dispose = [
					action_destroyer(/*onload*/ ctx[4].call(null, img)),
					action_destroyer(links.call(null, a))
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (/*title*/ ctx[3]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$c(ctx);
					if_block.c();
					if_block.m(div, t);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*cover*/ 2 && !src_url_equal(img.src, img_src_value = /*cover*/ ctx[1] ?? NOPIC)) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*href*/ 1) {
				attr_dev(a, "href", /*href*/ ctx[0]);
			}

			if (dirty & /*found*/ 4 && div_class_value !== (div_class_value = "poster flat m-2 " + /*found*/ ctx[2])) {
				attr_dev(div, "class", div_class_value);
			}
		},
		i: noop$1,
		o: noop$1,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$g.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$g($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Poster', slots, []);
	let { href = "", cover, found = "", title = "" } = $$props;
	const { onload } = createResourceLoader();

	$$self.$$.on_mount.push(function () {
		if (cover === undefined && !('cover' in $$props || $$self.$$.bound[$$self.$$.props['cover']])) {
			console.warn("<Poster> was created without expected prop 'cover'");
		}
	});

	const writable_props = ['href', 'cover', 'found', 'title'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Poster> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('href' in $$props) $$invalidate(0, href = $$props.href);
		if ('cover' in $$props) $$invalidate(1, cover = $$props.cover);
		if ('found' in $$props) $$invalidate(2, found = $$props.found);
		if ('title' in $$props) $$invalidate(3, title = $$props.title);
	};

	$$self.$capture_state = () => ({
		links,
		NOPIC,
		createResourceLoader,
		href,
		cover,
		found,
		title,
		onload
	});

	$$self.$inject_state = $$props => {
		if ('href' in $$props) $$invalidate(0, href = $$props.href);
		if ('cover' in $$props) $$invalidate(1, cover = $$props.cover);
		if ('found' in $$props) $$invalidate(2, found = $$props.found);
		if ('title' in $$props) $$invalidate(3, title = $$props.title);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [href, cover, found, title, onload];
}

class Poster extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$g, create_fragment$g, safe_not_equal, { href: 0, cover: 1, found: 2, title: 3 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Poster",
			options,
			id: create_fragment$g.name
		});
	}

	get href() {
		return this.$$.ctx[0];
	}

	set href(href) {
		this.$$set({ href });
		flush();
	}

	get cover() {
		return this.$$.ctx[1];
	}

	set cover(cover) {
		this.$$set({ cover });
		flush();
	}

	get found() {
		return this.$$.ctx[2];
	}

	set found(found) {
		this.$$set({ found });
		flush();
	}

	get title() {
		return this.$$.ctx[3];
	}

	set title(title) {
		this.$$set({ title });
		flush();
	}
}

/* src\components\slides\SeriesNotFound.svelte generated by Svelte v3.59.1 */
const file$a = "src\\components\\slides\\SeriesNotFound.svelte";

function get_each_context$5(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	return child_ctx;
}

// (23:0) {#if items.length}
function create_if_block$b(ctx) {
	let div4;
	let h3;
	let t0;
	let small;
	let t1;
	let t2_value = /*$notFound*/ ctx[0].length + "";
	let t2;
	let t3;
	let t4;
	let div3;
	let div1;
	let div0;
	let t5;
	let div2;
	let i;
	let current;
	let mounted;
	let dispose;
	let each_value = /*items*/ ctx[2];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			div4 = element("div");
			h3 = element("h3");
			t0 = text("Les Séries - A trouver ");
			small = element("small");
			t1 = text("[");
			t2 = text(t2_value);
			t3 = text("]");
			t4 = space();
			div3 = element("div");
			div1 = element("div");
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t5 = space();
			div2 = element("div");
			i = element("i");
			this.h();
		},
		l: function claim(nodes) {
			div4 = claim_element(nodes, "DIV", { class: true });
			var div4_nodes = children(div4);
			h3 = claim_element(div4_nodes, "H3", { class: true });
			var h3_nodes = children(h3);
			t0 = claim_text(h3_nodes, "Les Séries - A trouver ");
			small = claim_element(h3_nodes, "SMALL", { class: true });
			var small_nodes = children(small);
			t1 = claim_text(small_nodes, "[");
			t2 = claim_text(small_nodes, t2_value);
			t3 = claim_text(small_nodes, "]");
			small_nodes.forEach(detach_dev);
			h3_nodes.forEach(detach_dev);
			t4 = claim_space(div4_nodes);
			div3 = claim_element(div4_nodes, "DIV", { class: true });
			var div3_nodes = children(div3);
			div1 = claim_element(div3_nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			div0 = claim_element(div1_nodes, "DIV", { class: true });
			var div0_nodes = children(div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(div0_nodes);
			}

			div0_nodes.forEach(detach_dev);
			div1_nodes.forEach(detach_dev);
			t5 = claim_space(div3_nodes);
			div2 = claim_element(div3_nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			i = claim_element(div2_nodes, "I", { class: true, size: true });
			children(i).forEach(detach_dev);
			div2_nodes.forEach(detach_dev);
			div3_nodes.forEach(detach_dev);
			div4_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(small, "class", "ms-3 fw-light fs-5");
			add_location(small, file$a, 25, 35, 757);
			attr_dev(h3, "class", "my-3 d-flex justify-content-center");
			add_location(h3, file$a, 24, 8, 674);
			attr_dev(div0, "class", "swiper-wrapper d-flex");
			add_location(div0, file$a, 32, 16, 1015);
			attr_dev(div1, "class", "swiper overflow-x-scroll");
			add_location(div1, file$a, 31, 12, 949);
			attr_dev(i, "class", "ng-chevron-right");
			attr_dev(i, "size", "32");
			add_location(i, file$a, 45, 16, 1530);
			attr_dev(div2, "class", "chevron-next");
			add_location(div2, file$a, 44, 12, 1487);
			attr_dev(div3, "class", "d-flex align-items-center justify-content-between");
			add_location(div3, file$a, 30, 8, 873);
			attr_dev(div4, "class", "section mx-auto mb-3 px-3 user-select-none");
			add_location(div4, file$a, 23, 4, 609);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div4, anchor);
			append_hydration_dev(div4, h3);
			append_hydration_dev(h3, t0);
			append_hydration_dev(h3, small);
			append_hydration_dev(small, t1);
			append_hydration_dev(small, t2);
			append_hydration_dev(small, t3);
			append_hydration_dev(div4, t4);
			append_hydration_dev(div4, div3);
			append_hydration_dev(div3, div1);
			append_hydration_dev(div1, div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div0, null);
				}
			}

			append_hydration_dev(div3, t5);
			append_hydration_dev(div3, div2);
			append_hydration_dev(div2, i);
			current = true;

			if (!mounted) {
				dispose = action_destroyer(initiateSwiper.call(null, div1));
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if ((!current || dirty & /*$notFound*/ 1) && t2_value !== (t2_value = /*$notFound*/ ctx[0].length + "")) set_data_dev(t2, t2_value);

			if (dirty & /*route, items*/ 6) {
				each_value = /*items*/ ctx[2];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$5(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$5(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div0, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
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
		id: create_if_block$b.name,
		type: "if",
		source: "(23:0) {#if items.length}",
		ctx
	});

	return block;
}

// (34:20) {#each items as item}
function create_each_block$5(ctx) {
	let div;
	let poster;
	let t;
	let current;

	poster = new Poster({
			props: {
				href: "" + (/*route*/ ctx[1] + "/" + /*item*/ ctx[6].id),
				cover: /*item*/ ctx[6].cover.w780,
				found: "not-found"
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			create_component(poster.$$.fragment);
			t = space();
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			claim_component(poster.$$.fragment, div_nodes);
			t = claim_space(div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div, "class", "swiper-slide");
			add_location(div, file$a, 34, 24, 1117);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div, anchor);
			mount_component(poster, div, null);
			append_hydration_dev(div, t);
			current = true;
		},
		p: function update(ctx, dirty) {
			const poster_changes = {};
			if (dirty & /*route, items*/ 6) poster_changes.href = "" + (/*route*/ ctx[1] + "/" + /*item*/ ctx[6].id);
			if (dirty & /*items*/ 4) poster_changes.cover = /*item*/ ctx[6].cover.w780;
			poster.$set(poster_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(poster.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(poster.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(poster);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$5.name,
		type: "each",
		source: "(34:20) {#each items as item}",
		ctx
	});

	return block;
}

function create_fragment$f(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*items*/ ctx[2].length && create_if_block$b(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_hydration_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*items*/ ctx[2].length) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*items*/ 4) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$b(ctx);
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
		id: create_fragment$f.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$f($$self, $$props, $$invalidate) {
	let $location;
	let $notFound;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('SeriesNotFound', slots, []);
	let route, items;
	const location = useLocation(), notFound = tv.notFound;
	validate_store(location, 'location');
	component_subscribe($$self, location, value => $$invalidate(5, $location = value));
	validate_store(notFound, 'notFound');
	component_subscribe($$self, notFound, value => $$invalidate(0, $notFound = value));

	onMount(() => {
		$$invalidate(1, route = $location.pathname.indexOf(MediaType.ALL.route) > -1
		? MediaType.ALL.route
		: MediaType.TV.route);
	});

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SeriesNotFound> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		useLocation,
		swiper: initiateSwiper,
		MediaType,
		getRandom,
		tv,
		onMount,
		Poster,
		route,
		items,
		location,
		notFound,
		$location,
		$notFound
	});

	$$self.$inject_state = $$props => {
		if ('route' in $$props) $$invalidate(1, route = $$props.route);
		if ('items' in $$props) $$invalidate(2, items = $$props.items);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$notFound*/ 1) {
			$$invalidate(2, items = getRandom($notFound, 20));
		}
	};

	return [$notFound, route, items, location, notFound];
}

class SeriesNotFound extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$f, create_fragment$f, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "SeriesNotFound",
			options,
			id: create_fragment$f.name
		});
	}
}

/* src\components\slides\SeriesFound.svelte generated by Svelte v3.59.1 */
const file$9 = "src\\components\\slides\\SeriesFound.svelte";

function get_each_context$4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[3] = list[i];
	return child_ctx;
}

// (10:0) {#if items.length}
function create_if_block$a(ctx) {
	let div4;
	let h3;
	let t0;
	let small;
	let t1;
	let t2_value = /*items*/ ctx[0].length + "";
	let t2;
	let t3;
	let t4;
	let div3;
	let div1;
	let div0;
	let t5;
	let div2;
	let i;
	let current;
	let mounted;
	let dispose;
	let each_value = /*items*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			div4 = element("div");
			h3 = element("h3");
			t0 = text("Les Séries - Trouvées ");
			small = element("small");
			t1 = text("[");
			t2 = text(t2_value);
			t3 = text("]");
			t4 = space();
			div3 = element("div");
			div1 = element("div");
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t5 = space();
			div2 = element("div");
			i = element("i");
			this.h();
		},
		l: function claim(nodes) {
			div4 = claim_element(nodes, "DIV", { class: true });
			var div4_nodes = children(div4);
			h3 = claim_element(div4_nodes, "H3", { class: true });
			var h3_nodes = children(h3);
			t0 = claim_text(h3_nodes, "Les Séries - Trouvées ");
			small = claim_element(h3_nodes, "SMALL", { class: true });
			var small_nodes = children(small);
			t1 = claim_text(small_nodes, "[");
			t2 = claim_text(small_nodes, t2_value);
			t3 = claim_text(small_nodes, "]");
			small_nodes.forEach(detach_dev);
			h3_nodes.forEach(detach_dev);
			t4 = claim_space(div4_nodes);
			div3 = claim_element(div4_nodes, "DIV", { class: true });
			var div3_nodes = children(div3);
			div1 = claim_element(div3_nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			div0 = claim_element(div1_nodes, "DIV", { class: true });
			var div0_nodes = children(div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(div0_nodes);
			}

			div0_nodes.forEach(detach_dev);
			div1_nodes.forEach(detach_dev);
			t5 = claim_space(div3_nodes);
			div2 = claim_element(div3_nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			i = claim_element(div2_nodes, "I", { class: true, size: true });
			children(i).forEach(detach_dev);
			div2_nodes.forEach(detach_dev);
			div3_nodes.forEach(detach_dev);
			div4_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(small, "class", "ms-3 fw-light fs-5");
			add_location(small, file$9, 12, 34, 390);
			attr_dev(h3, "class", "my-3 d-flex justify-content-center");
			add_location(h3, file$9, 11, 8, 308);
			attr_dev(div0, "class", "swiper-wrapper d-flex");
			add_location(div0, file$9, 19, 16, 644);
			attr_dev(div1, "class", "swiper overflow-x-scroll");
			add_location(div1, file$9, 18, 12, 578);
			attr_dev(i, "class", "ng-chevron-right");
			attr_dev(i, "size", "32");
			add_location(i, file$9, 32, 16, 1162);
			attr_dev(div2, "class", "chevron-next");
			add_location(div2, file$9, 31, 12, 1119);
			attr_dev(div3, "class", "d-flex align-items-center justify-content-between");
			add_location(div3, file$9, 17, 8, 502);
			attr_dev(div4, "class", "section mx-auto mb-3 px-3 user-select-none");
			add_location(div4, file$9, 10, 4, 243);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div4, anchor);
			append_hydration_dev(div4, h3);
			append_hydration_dev(h3, t0);
			append_hydration_dev(h3, small);
			append_hydration_dev(small, t1);
			append_hydration_dev(small, t2);
			append_hydration_dev(small, t3);
			append_hydration_dev(div4, t4);
			append_hydration_dev(div4, div3);
			append_hydration_dev(div3, div1);
			append_hydration_dev(div1, div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div0, null);
				}
			}

			append_hydration_dev(div3, t5);
			append_hydration_dev(div3, div2);
			append_hydration_dev(div2, i);
			current = true;

			if (!mounted) {
				dispose = action_destroyer(initiateSwiper.call(null, div1));
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if ((!current || dirty & /*items*/ 1) && t2_value !== (t2_value = /*items*/ ctx[0].length + "")) set_data_dev(t2, t2_value);

			if (dirty & /*items*/ 1) {
				each_value = /*items*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$4(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$4(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div0, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
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
		id: create_if_block$a.name,
		type: "if",
		source: "(10:0) {#if items.length}",
		ctx
	});

	return block;
}

// (21:20) {#each items as item}
function create_each_block$4(ctx) {
	let div;
	let poster;
	let t;
	let current;

	poster = new Poster({
			props: {
				href: "/details/" + /*item*/ ctx[3].id,
				cover: /*item*/ ctx[3].poster.w342,
				title: /*item*/ ctx[3].title
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			create_component(poster.$$.fragment);
			t = space();
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			claim_component(poster.$$.fragment, div_nodes);
			t = claim_space(div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div, "class", "swiper-slide");
			add_location(div, file$9, 21, 24, 746);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div, anchor);
			mount_component(poster, div, null);
			append_hydration_dev(div, t);
			current = true;
		},
		p: function update(ctx, dirty) {
			const poster_changes = {};
			if (dirty & /*items*/ 1) poster_changes.href = "/details/" + /*item*/ ctx[3].id;
			if (dirty & /*items*/ 1) poster_changes.cover = /*item*/ ctx[3].poster.w342;
			if (dirty & /*items*/ 1) poster_changes.title = /*item*/ ctx[3].title;
			poster.$set(poster_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(poster.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(poster.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(poster);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$4.name,
		type: "each",
		source: "(21:20) {#each items as item}",
		ctx
	});

	return block;
}

function create_fragment$e(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*items*/ ctx[0].length && create_if_block$a(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_hydration_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*items*/ ctx[0].length) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*items*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$a(ctx);
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
		id: create_fragment$e.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$e($$self, $$props, $$invalidate) {
	let $found;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('SeriesFound', slots, []);
	let items;
	const found = tv.found;
	validate_store(found, 'found');
	component_subscribe($$self, found, value => $$invalidate(2, $found = value));
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SeriesFound> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ swiper: initiateSwiper, tv, Poster, items, found, $found });

	$$self.$inject_state = $$props => {
		if ('items' in $$props) $$invalidate(0, items = $$props.items);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$found*/ 4) {
			$$invalidate(0, items = $found);
		}
	};

	return [items, found, $found];
}

class SeriesFound extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$e, create_fragment$e, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "SeriesFound",
			options,
			id: create_fragment$e.name
		});
	}
}

/* src\pages\TV.svelte generated by Svelte v3.59.1 */

// (23:0) {:else}
function create_else_block$3(ctx) {
	let notfound;
	let current;
	notfound = new NotFound({ $$inline: true });

	const block = {
		c: function create() {
			create_component(notfound.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(notfound.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(notfound, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(notfound.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(notfound.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(notfound, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$3.name,
		type: "else",
		source: "(23:0) {:else}",
		ctx
	});

	return block;
}

// (16:0) {#if $current}
function create_if_block$9(ctx) {
	let cover;
	let t0;
	let gameform;
	let t1;
	let seriesnotfound;
	let t2;
	let seriesfound;
	let current;

	cover = new Cover({
			props: {
				$$slots: { default: [create_default_slot$3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	gameform = new GameForm({ $$inline: true });
	seriesnotfound = new SeriesNotFound({ $$inline: true });
	seriesfound = new SeriesFound({ $$inline: true });

	const block = {
		c: function create() {
			create_component(cover.$$.fragment);
			t0 = space();
			create_component(gameform.$$.fragment);
			t1 = space();
			create_component(seriesnotfound.$$.fragment);
			t2 = space();
			create_component(seriesfound.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(cover.$$.fragment, nodes);
			t0 = claim_space(nodes);
			claim_component(gameform.$$.fragment, nodes);
			t1 = claim_space(nodes);
			claim_component(seriesnotfound.$$.fragment, nodes);
			t2 = claim_space(nodes);
			claim_component(seriesfound.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(cover, target, anchor);
			insert_hydration_dev(target, t0, anchor);
			mount_component(gameform, target, anchor);
			insert_hydration_dev(target, t1, anchor);
			mount_component(seriesnotfound, target, anchor);
			insert_hydration_dev(target, t2, anchor);
			mount_component(seriesfound, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(cover.$$.fragment, local);
			transition_in(gameform.$$.fragment, local);
			transition_in(seriesnotfound.$$.fragment, local);
			transition_in(seriesfound.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(cover.$$.fragment, local);
			transition_out(gameform.$$.fragment, local);
			transition_out(seriesnotfound.$$.fragment, local);
			transition_out(seriesfound.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(cover, detaching);
			if (detaching) detach_dev(t0);
			destroy_component(gameform, detaching);
			if (detaching) detach_dev(t1);
			destroy_component(seriesnotfound, detaching);
			if (detaching) detach_dev(t2);
			destroy_component(seriesfound, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$9.name,
		type: "if",
		source: "(16:0) {#if $current}",
		ctx
	});

	return block;
}

// (17:4) <Cover>
function create_default_slot$3(ctx) {
	let notify;
	let current;
	notify = new Notify({ $$inline: true });

	const block = {
		c: function create() {
			create_component(notify.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(notify.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(notify, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(notify.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(notify.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(notify, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$3.name,
		type: "slot",
		source: "(17:4) <Cover>",
		ctx
	});

	return block;
}

function create_fragment$d(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block$9, create_else_block$3];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*$current*/ ctx[0]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_hydration_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index !== previous_block_index) {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
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
		id: create_fragment$d.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$d($$self, $$props, $$invalidate) {
	let $params;
	let $current;
	validate_store(current, 'current');
	component_subscribe($$self, current, $$value => $$invalidate(0, $current = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('TV', slots, []);
	const params = useParams();
	validate_store(params, 'params');
	component_subscribe($$self, params, value => $$invalidate(2, $params = value));
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TV> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		useParams,
		current,
		getEntry,
		decode,
		Cover,
		GameForm,
		Notify,
		NotFound,
		SeriesNotFound,
		SeriesFound,
		params,
		$params,
		$current
	});

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$params*/ 4) {
			set_store_value(current, $current = getEntry(decode($params.id)), $current);
		}
	};

	return [$current, params, $params];
}

class TV extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$d, create_fragment$d, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "TV",
			options,
			id: create_fragment$d.name
		});
	}
}

/* src\components\slides\MoviesNotFound.svelte generated by Svelte v3.59.1 */
const file$8 = "src\\components\\slides\\MoviesNotFound.svelte";

function get_each_context$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	return child_ctx;
}

// (24:0) {#if items.length}
function create_if_block$8(ctx) {
	let div4;
	let h3;
	let t0;
	let small;
	let t1;
	let t2_value = /*$notFound*/ ctx[0].length + "";
	let t2;
	let t3;
	let t4;
	let div3;
	let div1;
	let div0;
	let t5;
	let div2;
	let i;
	let current;
	let mounted;
	let dispose;
	let each_value = /*items*/ ctx[2];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			div4 = element("div");
			h3 = element("h3");
			t0 = text("Les Films - A trouver ");
			small = element("small");
			t1 = text("[");
			t2 = text(t2_value);
			t3 = text("]");
			t4 = space();
			div3 = element("div");
			div1 = element("div");
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t5 = space();
			div2 = element("div");
			i = element("i");
			this.h();
		},
		l: function claim(nodes) {
			div4 = claim_element(nodes, "DIV", { class: true });
			var div4_nodes = children(div4);
			h3 = claim_element(div4_nodes, "H3", { class: true });
			var h3_nodes = children(h3);
			t0 = claim_text(h3_nodes, "Les Films - A trouver ");
			small = claim_element(h3_nodes, "SMALL", { class: true });
			var small_nodes = children(small);
			t1 = claim_text(small_nodes, "[");
			t2 = claim_text(small_nodes, t2_value);
			t3 = claim_text(small_nodes, "]");
			small_nodes.forEach(detach_dev);
			h3_nodes.forEach(detach_dev);
			t4 = claim_space(div4_nodes);
			div3 = claim_element(div4_nodes, "DIV", { class: true });
			var div3_nodes = children(div3);
			div1 = claim_element(div3_nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			div0 = claim_element(div1_nodes, "DIV", { class: true });
			var div0_nodes = children(div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(div0_nodes);
			}

			div0_nodes.forEach(detach_dev);
			div1_nodes.forEach(detach_dev);
			t5 = claim_space(div3_nodes);
			div2 = claim_element(div3_nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			i = claim_element(div2_nodes, "I", { class: true, size: true });
			children(i).forEach(detach_dev);
			div2_nodes.forEach(detach_dev);
			div3_nodes.forEach(detach_dev);
			div4_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(small, "class", "ms-3 fw-light fs-5");
			add_location(small, file$8, 26, 34, 811);
			attr_dev(h3, "class", "my-3 d-flex justify-content-center");
			add_location(h3, file$8, 25, 8, 729);
			attr_dev(div0, "class", "swiper-wrapper d-flex");
			add_location(div0, file$8, 33, 16, 1069);
			attr_dev(div1, "class", "swiper overflow-x-scroll");
			add_location(div1, file$8, 32, 12, 1003);
			attr_dev(i, "class", "ng-chevron-right");
			attr_dev(i, "size", "32");
			add_location(i, file$8, 46, 16, 1584);
			attr_dev(div2, "class", "chevron-next");
			add_location(div2, file$8, 45, 12, 1541);
			attr_dev(div3, "class", "d-flex align-items-center justify-content-between");
			add_location(div3, file$8, 31, 8, 927);
			attr_dev(div4, "class", "section mx-auto mb-3 px-3 user-select-none");
			add_location(div4, file$8, 24, 4, 664);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div4, anchor);
			append_hydration_dev(div4, h3);
			append_hydration_dev(h3, t0);
			append_hydration_dev(h3, small);
			append_hydration_dev(small, t1);
			append_hydration_dev(small, t2);
			append_hydration_dev(small, t3);
			append_hydration_dev(div4, t4);
			append_hydration_dev(div4, div3);
			append_hydration_dev(div3, div1);
			append_hydration_dev(div1, div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div0, null);
				}
			}

			append_hydration_dev(div3, t5);
			append_hydration_dev(div3, div2);
			append_hydration_dev(div2, i);
			current = true;

			if (!mounted) {
				dispose = action_destroyer(initiateSwiper.call(null, div1));
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if ((!current || dirty & /*$notFound*/ 1) && t2_value !== (t2_value = /*$notFound*/ ctx[0].length + "")) set_data_dev(t2, t2_value);

			if (dirty & /*route, items*/ 6) {
				each_value = /*items*/ ctx[2];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$3(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$3(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div0, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
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
		id: create_if_block$8.name,
		type: "if",
		source: "(24:0) {#if items.length}",
		ctx
	});

	return block;
}

// (35:20) {#each items as item}
function create_each_block$3(ctx) {
	let div;
	let poster;
	let t;
	let current;

	poster = new Poster({
			props: {
				href: "" + (/*route*/ ctx[1] + "/" + /*item*/ ctx[6].id),
				cover: /*item*/ ctx[6].cover.w780,
				found: "not-found"
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			create_component(poster.$$.fragment);
			t = space();
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			claim_component(poster.$$.fragment, div_nodes);
			t = claim_space(div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div, "class", "swiper-slide");
			add_location(div, file$8, 35, 24, 1171);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div, anchor);
			mount_component(poster, div, null);
			append_hydration_dev(div, t);
			current = true;
		},
		p: function update(ctx, dirty) {
			const poster_changes = {};
			if (dirty & /*route, items*/ 6) poster_changes.href = "" + (/*route*/ ctx[1] + "/" + /*item*/ ctx[6].id);
			if (dirty & /*items*/ 4) poster_changes.cover = /*item*/ ctx[6].cover.w780;
			poster.$set(poster_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(poster.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(poster.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(poster);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$3.name,
		type: "each",
		source: "(35:20) {#each items as item}",
		ctx
	});

	return block;
}

function create_fragment$c(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*items*/ ctx[2].length && create_if_block$8(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_hydration_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*items*/ ctx[2].length) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*items*/ 4) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$8(ctx);
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
		id: create_fragment$c.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$c($$self, $$props, $$invalidate) {
	let $location;
	let $notFound;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('MoviesNotFound', slots, []);
	let route, items;
	const location = useLocation(), notFound = movies.notFound;
	validate_store(location, 'location');
	component_subscribe($$self, location, value => $$invalidate(5, $location = value));
	validate_store(notFound, 'notFound');
	component_subscribe($$self, notFound, value => $$invalidate(0, $notFound = value));

	onMount(() => {
		$$invalidate(1, route = $location.pathname.indexOf(MediaType.ALL.route) > -1
		? MediaType.ALL.route
		: MediaType.MOVIE.route);
	});

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MoviesNotFound> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		useLocation,
		swiper: initiateSwiper,
		MediaType,
		getRandom,
		movies,
		onMount,
		Poster,
		route,
		items,
		location,
		notFound,
		$location,
		$notFound
	});

	$$self.$inject_state = $$props => {
		if ('route' in $$props) $$invalidate(1, route = $$props.route);
		if ('items' in $$props) $$invalidate(2, items = $$props.items);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$notFound*/ 1) {
			// $: items = getRandom($notFound, 20);
			$$invalidate(2, items = getRandom($notFound, 20));
		}
	};

	return [$notFound, route, items, location, notFound];
}

class MoviesNotFound extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$c, create_fragment$c, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "MoviesNotFound",
			options,
			id: create_fragment$c.name
		});
	}
}

/* src\components\slides\MoviesFound.svelte generated by Svelte v3.59.1 */
const file$7 = "src\\components\\slides\\MoviesFound.svelte";

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[3] = list[i];
	return child_ctx;
}

// (10:0) {#if items.length}
function create_if_block$7(ctx) {
	let div4;
	let h3;
	let t0;
	let small;
	let t1;
	let t2_value = /*items*/ ctx[0].length + "";
	let t2;
	let t3;
	let t4;
	let div3;
	let div1;
	let div0;
	let t5;
	let div2;
	let i;
	let current;
	let mounted;
	let dispose;
	let each_value = /*items*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			div4 = element("div");
			h3 = element("h3");
			t0 = text("Les Films - Trouvés\n            ");
			small = element("small");
			t1 = text("[");
			t2 = text(t2_value);
			t3 = text("]");
			t4 = space();
			div3 = element("div");
			div1 = element("div");
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t5 = space();
			div2 = element("div");
			i = element("i");
			this.h();
		},
		l: function claim(nodes) {
			div4 = claim_element(nodes, "DIV", { class: true });
			var div4_nodes = children(div4);
			h3 = claim_element(div4_nodes, "H3", { class: true });
			var h3_nodes = children(h3);
			t0 = claim_text(h3_nodes, "Les Films - Trouvés\n            ");
			small = claim_element(h3_nodes, "SMALL", { class: true });
			var small_nodes = children(small);
			t1 = claim_text(small_nodes, "[");
			t2 = claim_text(small_nodes, t2_value);
			t3 = claim_text(small_nodes, "]");
			small_nodes.forEach(detach_dev);
			h3_nodes.forEach(detach_dev);
			t4 = claim_space(div4_nodes);
			div3 = claim_element(div4_nodes, "DIV", { class: true });
			var div3_nodes = children(div3);
			div1 = claim_element(div3_nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			div0 = claim_element(div1_nodes, "DIV", { class: true });
			var div0_nodes = children(div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(div0_nodes);
			}

			div0_nodes.forEach(detach_dev);
			div1_nodes.forEach(detach_dev);
			t5 = claim_space(div3_nodes);
			div2 = claim_element(div3_nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			i = claim_element(div2_nodes, "I", { class: true, size: true });
			children(i).forEach(detach_dev);
			div2_nodes.forEach(detach_dev);
			div3_nodes.forEach(detach_dev);
			div4_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(small, "class", "ms-3 fw-light fs-5");
			add_location(small, file$7, 13, 12, 408);
			attr_dev(h3, "class", "my-3 d-flex justify-content-center");
			add_location(h3, file$7, 11, 8, 316);
			attr_dev(div0, "class", "swiper-wrapper d-flex");
			add_location(div0, file$7, 18, 16, 632);
			attr_dev(div1, "class", "swiper overflow-x-scroll");
			add_location(div1, file$7, 17, 12, 566);
			attr_dev(i, "class", "ng-chevron-right");
			attr_dev(i, "size", "32");
			add_location(i, file$7, 31, 16, 1150);
			attr_dev(div2, "class", "chevron-next");
			add_location(div2, file$7, 30, 12, 1107);
			attr_dev(div3, "class", "d-flex align-items-center justify-content-between");
			add_location(div3, file$7, 16, 8, 490);
			attr_dev(div4, "class", "section mx-auto mb-3 px-3 user-select-none");
			add_location(div4, file$7, 10, 4, 251);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div4, anchor);
			append_hydration_dev(div4, h3);
			append_hydration_dev(h3, t0);
			append_hydration_dev(h3, small);
			append_hydration_dev(small, t1);
			append_hydration_dev(small, t2);
			append_hydration_dev(small, t3);
			append_hydration_dev(div4, t4);
			append_hydration_dev(div4, div3);
			append_hydration_dev(div3, div1);
			append_hydration_dev(div1, div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div0, null);
				}
			}

			append_hydration_dev(div3, t5);
			append_hydration_dev(div3, div2);
			append_hydration_dev(div2, i);
			current = true;

			if (!mounted) {
				dispose = action_destroyer(initiateSwiper.call(null, div1));
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if ((!current || dirty & /*items*/ 1) && t2_value !== (t2_value = /*items*/ ctx[0].length + "")) set_data_dev(t2, t2_value);

			if (dirty & /*items*/ 1) {
				each_value = /*items*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$2(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$2(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div0, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
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
		id: create_if_block$7.name,
		type: "if",
		source: "(10:0) {#if items.length}",
		ctx
	});

	return block;
}

// (20:20) {#each items as item}
function create_each_block$2(ctx) {
	let div;
	let poster;
	let t;
	let current;

	poster = new Poster({
			props: {
				href: "/details/" + /*item*/ ctx[3].id,
				cover: /*item*/ ctx[3].poster.w342,
				title: /*item*/ ctx[3].title
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			create_component(poster.$$.fragment);
			t = space();
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			claim_component(poster.$$.fragment, div_nodes);
			t = claim_space(div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div, "class", "swiper-slide");
			add_location(div, file$7, 20, 24, 734);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div, anchor);
			mount_component(poster, div, null);
			append_hydration_dev(div, t);
			current = true;
		},
		p: function update(ctx, dirty) {
			const poster_changes = {};
			if (dirty & /*items*/ 1) poster_changes.href = "/details/" + /*item*/ ctx[3].id;
			if (dirty & /*items*/ 1) poster_changes.cover = /*item*/ ctx[3].poster.w342;
			if (dirty & /*items*/ 1) poster_changes.title = /*item*/ ctx[3].title;
			poster.$set(poster_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(poster.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(poster.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(poster);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$2.name,
		type: "each",
		source: "(20:20) {#each items as item}",
		ctx
	});

	return block;
}

function create_fragment$b(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*items*/ ctx[0].length && create_if_block$7(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_hydration_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*items*/ ctx[0].length) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*items*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$7(ctx);
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
		id: create_fragment$b.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$b($$self, $$props, $$invalidate) {
	let $found;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('MoviesFound', slots, []);
	let items;
	const found = movies.found;
	validate_store(found, 'found');
	component_subscribe($$self, found, value => $$invalidate(2, $found = value));
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MoviesFound> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		swiper: initiateSwiper,
		movies,
		Poster,
		items,
		found,
		$found
	});

	$$self.$inject_state = $$props => {
		if ('items' in $$props) $$invalidate(0, items = $$props.items);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$found*/ 4) {
			$$invalidate(0, items = $found);
		}
	};

	return [items, found, $found];
}

class MoviesFound extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$b, create_fragment$b, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "MoviesFound",
			options,
			id: create_fragment$b.name
		});
	}
}

/* src\pages\Movie.svelte generated by Svelte v3.59.1 */

// (23:0) {:else}
function create_else_block$2(ctx) {
	let notfound;
	let current;
	notfound = new NotFound({ $$inline: true });

	const block = {
		c: function create() {
			create_component(notfound.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(notfound.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(notfound, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(notfound.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(notfound.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(notfound, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$2.name,
		type: "else",
		source: "(23:0) {:else}",
		ctx
	});

	return block;
}

// (16:0) {#if $current}
function create_if_block$6(ctx) {
	let cover;
	let t0;
	let gameform;
	let t1;
	let moviesnotfound;
	let t2;
	let moviesfound;
	let current;

	cover = new Cover({
			props: {
				$$slots: { default: [create_default_slot$2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	gameform = new GameForm({ $$inline: true });
	moviesnotfound = new MoviesNotFound({ $$inline: true });
	moviesfound = new MoviesFound({ $$inline: true });

	const block = {
		c: function create() {
			create_component(cover.$$.fragment);
			t0 = space();
			create_component(gameform.$$.fragment);
			t1 = space();
			create_component(moviesnotfound.$$.fragment);
			t2 = space();
			create_component(moviesfound.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(cover.$$.fragment, nodes);
			t0 = claim_space(nodes);
			claim_component(gameform.$$.fragment, nodes);
			t1 = claim_space(nodes);
			claim_component(moviesnotfound.$$.fragment, nodes);
			t2 = claim_space(nodes);
			claim_component(moviesfound.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(cover, target, anchor);
			insert_hydration_dev(target, t0, anchor);
			mount_component(gameform, target, anchor);
			insert_hydration_dev(target, t1, anchor);
			mount_component(moviesnotfound, target, anchor);
			insert_hydration_dev(target, t2, anchor);
			mount_component(moviesfound, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(cover.$$.fragment, local);
			transition_in(gameform.$$.fragment, local);
			transition_in(moviesnotfound.$$.fragment, local);
			transition_in(moviesfound.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(cover.$$.fragment, local);
			transition_out(gameform.$$.fragment, local);
			transition_out(moviesnotfound.$$.fragment, local);
			transition_out(moviesfound.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(cover, detaching);
			if (detaching) detach_dev(t0);
			destroy_component(gameform, detaching);
			if (detaching) detach_dev(t1);
			destroy_component(moviesnotfound, detaching);
			if (detaching) detach_dev(t2);
			destroy_component(moviesfound, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$6.name,
		type: "if",
		source: "(16:0) {#if $current}",
		ctx
	});

	return block;
}

// (17:4) <Cover>
function create_default_slot$2(ctx) {
	let notify;
	let current;
	notify = new Notify({ $$inline: true });

	const block = {
		c: function create() {
			create_component(notify.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(notify.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(notify, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(notify.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(notify.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(notify, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$2.name,
		type: "slot",
		source: "(17:4) <Cover>",
		ctx
	});

	return block;
}

function create_fragment$a(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block$6, create_else_block$2];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*$current*/ ctx[0]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_hydration_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index !== previous_block_index) {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
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
		id: create_fragment$a.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$a($$self, $$props, $$invalidate) {
	let $params;
	let $current;
	validate_store(current, 'current');
	component_subscribe($$self, current, $$value => $$invalidate(0, $current = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Movie', slots, []);
	const params = useParams();
	validate_store(params, 'params');
	component_subscribe($$self, params, value => $$invalidate(2, $params = value));
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Movie> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		useParams,
		decode,
		current,
		getEntry,
		Cover,
		GameForm,
		Notify,
		NotFound,
		MoviesNotFound,
		MoviesFound,
		params,
		$params,
		$current
	});

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$params*/ 4) {
			set_store_value(current, $current = getEntry(decode($params.id)), $current);
		}
	};

	return [$current, params, $params];
}

class Movie extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$a, create_fragment$a, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Movie",
			options,
			id: create_fragment$a.name
		});
	}
}

/* src\pages\Details.svelte generated by Svelte v3.59.1 */
const file$6 = "src\\pages\\Details.svelte";

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i];
	return child_ctx;
}

// (66:0) {:else}
function create_else_block$1(ctx) {
	let notfound;
	let current;
	notfound = new NotFound({ $$inline: true });

	const block = {
		c: function create() {
			create_component(notfound.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(notfound.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(notfound, target, anchor);
			current = true;
		},
		p: noop$1,
		i: function intro(local) {
			if (current) return;
			transition_in(notfound.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(notfound.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(notfound, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$1.name,
		type: "else",
		source: "(66:0) {:else}",
		ctx
	});

	return block;
}

// (25:0) {#if $current}
function create_if_block$5(ctx) {
	let cover;
	let t0;
	let div;
	let h4;
	let t1;
	let t2;
	let p;
	let t3_value = (/*$current*/ ctx[0].overview.fr || /*$current*/ ctx[0].overview.en) + "";
	let t3;
	let t4;
	let if_block_anchor;
	let current;
	cover = new Cover({ props: { more: false }, $$inline: true });
	let if_block = /*$current*/ ctx[0].cast.length && create_if_block_1(ctx);

	const block = {
		c: function create() {
			create_component(cover.$$.fragment);
			t0 = space();
			div = element("div");
			h4 = element("h4");
			t1 = text("Synopsis");
			t2 = space();
			p = element("p");
			t3 = text(t3_value);
			t4 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			this.h();
		},
		l: function claim(nodes) {
			claim_component(cover.$$.fragment, nodes);
			t0 = claim_space(nodes);
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			h4 = claim_element(div_nodes, "H4", { class: true });
			var h4_nodes = children(h4);
			t1 = claim_text(h4_nodes, "Synopsis");
			h4_nodes.forEach(detach_dev);
			t2 = claim_space(div_nodes);
			p = claim_element(div_nodes, "P", { class: true });
			var p_nodes = children(p);
			t3 = claim_text(p_nodes, t3_value);
			p_nodes.forEach(detach_dev);
			div_nodes.forEach(detach_dev);
			t4 = claim_space(nodes);
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
			this.h();
		},
		h: function hydrate() {
			attr_dev(h4, "class", "my-3");
			add_location(h4, file$6, 27, 8, 752);
			attr_dev(p, "class", "overview");
			add_location(p, file$6, 28, 8, 791);
			attr_dev(div, "class", "media-info d-flex flex-column");
			add_location(div, file$6, 26, 4, 700);
		},
		m: function mount(target, anchor) {
			mount_component(cover, target, anchor);
			insert_hydration_dev(target, t0, anchor);
			insert_hydration_dev(target, div, anchor);
			append_hydration_dev(div, h4);
			append_hydration_dev(h4, t1);
			append_hydration_dev(div, t2);
			append_hydration_dev(div, p);
			append_hydration_dev(p, t3);
			insert_hydration_dev(target, t4, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_hydration_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if ((!current || dirty & /*$current*/ 1) && t3_value !== (t3_value = (/*$current*/ ctx[0].overview.fr || /*$current*/ ctx[0].overview.en) + "")) set_data_dev(t3, t3_value);

			if (/*$current*/ ctx[0].cast.length) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(cover.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(cover.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(cover, detaching);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(div);
			if (detaching) detach_dev(t4);
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$5.name,
		type: "if",
		source: "(25:0) {#if $current}",
		ctx
	});

	return block;
}

// (31:4) {#if $current.cast.length}
function create_if_block_1(ctx) {
	let div4;
	let h3;
	let t0;
	let t1;
	let div3;
	let div1;
	let div0;
	let t2;
	let div2;
	let i;
	let mounted;
	let dispose;
	let each_value = /*$current*/ ctx[0].cast;
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div4 = element("div");
			h3 = element("h3");
			t0 = text("Les acteurs");
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
			this.h();
		},
		l: function claim(nodes) {
			div4 = claim_element(nodes, "DIV", { class: true });
			var div4_nodes = children(div4);
			h3 = claim_element(div4_nodes, "H3", { class: true });
			var h3_nodes = children(h3);
			t0 = claim_text(h3_nodes, "Les acteurs");
			h3_nodes.forEach(detach_dev);
			t1 = claim_space(div4_nodes);
			div3 = claim_element(div4_nodes, "DIV", { class: true });
			var div3_nodes = children(div3);
			div1 = claim_element(div3_nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			div0 = claim_element(div1_nodes, "DIV", { class: true });
			var div0_nodes = children(div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(div0_nodes);
			}

			div0_nodes.forEach(detach_dev);
			div1_nodes.forEach(detach_dev);
			t2 = claim_space(div3_nodes);
			div2 = claim_element(div3_nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			i = claim_element(div2_nodes, "I", { class: true, size: true });
			children(i).forEach(detach_dev);
			div2_nodes.forEach(detach_dev);
			div3_nodes.forEach(detach_dev);
			div4_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(h3, "class", "my-3");
			add_location(h3, file$6, 32, 12, 971);
			attr_dev(div0, "class", "swiper-wrapper d-flex");
			add_location(div0, file$6, 35, 20, 1167);
			attr_dev(div1, "class", "swiper overflow-x-scroll");
			add_location(div1, file$6, 34, 16, 1097);
			attr_dev(i, "class", "ng-chevron-right");
			attr_dev(i, "size", "32");
			add_location(i, file$6, 60, 20, 2381);
			attr_dev(div2, "class", "chevron-next");
			add_location(div2, file$6, 59, 16, 2334);
			attr_dev(div3, "class", "d-flex align-items-center justify-content-between");
			add_location(div3, file$6, 33, 12, 1017);
			attr_dev(div4, "class", "section actors mx-auto mb-3 px-3");
			add_location(div4, file$6, 31, 8, 912);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div4, anchor);
			append_hydration_dev(div4, h3);
			append_hydration_dev(h3, t0);
			append_hydration_dev(div4, t1);
			append_hydration_dev(div4, div3);
			append_hydration_dev(div3, div1);
			append_hydration_dev(div1, div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div0, null);
				}
			}

			append_hydration_dev(div3, t2);
			append_hydration_dev(div3, div2);
			append_hydration_dev(div2, i);

			if (!mounted) {
				dispose = action_destroyer(initiateSwiper.call(null, div1));
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$current*/ 1) {
				each_value = /*$current*/ ctx[0].cast;
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
		id: create_if_block_1.name,
		type: "if",
		source: "(31:4) {#if $current.cast.length}",
		ctx
	});

	return block;
}

// (38:28) {#if actor.picture.w185}
function create_if_block_2(ctx) {
	let div2;
	let div0;
	let img;
	let img_src_value;
	let img_alt_value;
	let t0;
	let div1;
	let strong;
	let t1_value = /*actor*/ ctx[4].name + "";
	let t1;
	let t2;
	let small;
	let t3_value = /*actor*/ ctx[4].character + "";
	let t3;
	let t4;

	const block = {
		c: function create() {
			div2 = element("div");
			div0 = element("div");
			img = element("img");
			t0 = space();
			div1 = element("div");
			strong = element("strong");
			t1 = text(t1_value);
			t2 = space();
			small = element("small");
			t3 = text(t3_value);
			t4 = space();
			this.h();
		},
		l: function claim(nodes) {
			div2 = claim_element(nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			div0 = claim_element(div2_nodes, "DIV", { class: true });
			var div0_nodes = children(div0);
			img = claim_element(div0_nodes, "IMG", { src: true, alt: true });
			div0_nodes.forEach(detach_dev);
			t0 = claim_space(div2_nodes);
			div1 = claim_element(div2_nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			strong = claim_element(div1_nodes, "STRONG", { class: true });
			var strong_nodes = children(strong);
			t1 = claim_text(strong_nodes, t1_value);
			strong_nodes.forEach(detach_dev);
			t2 = claim_space(div1_nodes);
			small = claim_element(div1_nodes, "SMALL", { class: true });
			var small_nodes = children(small);
			t3 = claim_text(small_nodes, t3_value);
			small_nodes.forEach(detach_dev);
			div1_nodes.forEach(detach_dev);
			t4 = claim_space(div2_nodes);
			div2_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			if (!src_url_equal(img.src, img_src_value = /*actor*/ ctx[4].picture.w185)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", img_alt_value = /*actor*/ ctx[4].name);
			add_location(img, file$6, 40, 40, 1476);
			attr_dev(div0, "class", "poster flat");
			add_location(div0, file$6, 39, 36, 1410);
			attr_dev(strong, "class", "actor-name");
			add_location(strong, file$6, 46, 40, 1812);
			attr_dev(small, "class", "role");
			add_location(small, file$6, 49, 40, 1987);
			attr_dev(div1, "class", "actor d-flex flex-column");
			add_location(div1, file$6, 45, 36, 1733);
			attr_dev(div2, "class", "swiper-slide m-2");
			add_location(div2, file$6, 38, 32, 1343);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div2, anchor);
			append_hydration_dev(div2, div0);
			append_hydration_dev(div0, img);
			append_hydration_dev(div2, t0);
			append_hydration_dev(div2, div1);
			append_hydration_dev(div1, strong);
			append_hydration_dev(strong, t1);
			append_hydration_dev(div1, t2);
			append_hydration_dev(div1, small);
			append_hydration_dev(small, t3);
			append_hydration_dev(div2, t4);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$current*/ 1 && !src_url_equal(img.src, img_src_value = /*actor*/ ctx[4].picture.w185)) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*$current*/ 1 && img_alt_value !== (img_alt_value = /*actor*/ ctx[4].name)) {
				attr_dev(img, "alt", img_alt_value);
			}

			if (dirty & /*$current*/ 1 && t1_value !== (t1_value = /*actor*/ ctx[4].name + "")) set_data_dev(t1, t1_value);
			if (dirty & /*$current*/ 1 && t3_value !== (t3_value = /*actor*/ ctx[4].character + "")) set_data_dev(t3, t3_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(38:28) {#if actor.picture.w185}",
		ctx
	});

	return block;
}

// (37:24) {#each $current.cast as actor}
function create_each_block$1(ctx) {
	let if_block_anchor;
	let if_block = /*actor*/ ctx[4].picture.w185 && create_if_block_2(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_hydration_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (/*actor*/ ctx[4].picture.w185) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_2(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$1.name,
		type: "each",
		source: "(37:24) {#each $current.cast as actor}",
		ctx
	});

	return block;
}

function create_fragment$9(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block$5, create_else_block$1];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*$current*/ ctx[0]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_hydration_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
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
		id: create_fragment$9.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$9($$self, $$props, $$invalidate) {
	let $current;
	let $params;
	validate_store(current, 'current');
	component_subscribe($$self, current, $$value => $$invalidate(0, $current = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Details', slots, []);
	const params = useParams();
	validate_store(params, 'params');
	component_subscribe($$self, params, value => $$invalidate(3, $params = value));
	let found;
	set_store_value(current, $current = getEntry(decode($params.id)), $current);

	onMount(() => {
		if ($current) {
			found = isFound($current);

			if (!found) {
				set_store_value(current, $current = null, $current);
			}
		}
	});

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Details> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		useParams,
		onMount,
		decode,
		getEntry,
		isFound,
		current,
		Cover,
		swiper: initiateSwiper,
		NotFound,
		params,
		found,
		$current,
		$params
	});

	$$self.$inject_state = $$props => {
		if ('found' in $$props) found = $$props.found;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [$current, params];
}

class Details extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$9, create_fragment$9, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Details",
			options,
			id: create_fragment$9.name
		});
	}
}

/* src\components\Header.svelte generated by Svelte v3.59.1 */
const file$5 = "src\\components\\Header.svelte";

function create_fragment$8(ctx) {
	let header;
	let div2;
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
	let t4;
	let a2;
	let t5;
	let t6;
	let a3;
	let t7;
	let t8;
	let a4;
	let t9;
	let t10;
	let a5;
	let i0;
	let t11;
	let span0;
	let t12;
	let t13;
	let div0;
	let i1;
	let t14;
	let span1;
	let t15;
	let t16;
	let label;
	let div1;
	let t17;
	let div3;
	let p;
	let t18;
	let br;
	let t19;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			header = element("header");
			div2 = element("div");
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
			i0 = element("i");
			t11 = space();
			span0 = element("span");
			t12 = text("Comment Jouer");
			t13 = space();
			div0 = element("div");
			i1 = element("i");
			t14 = space();
			span1 = element("span");
			t15 = text(/*$WinningStreak*/ ctx[1]);
			t16 = space();
			label = element("label");
			div1 = element("div");
			t17 = space();
			div3 = element("div");
			p = element("p");
			t18 = text("Le joueur doit deviner les noms de films et de séries à partir d'images\n        grisées");
			br = element("br");
			t19 = text("\n        en tapant le nom dans la zone dédiée.");
			this.h();
		},
		l: function claim(nodes) {
			header = claim_element(nodes, "HEADER", { class: true });
			var header_nodes = children(header);
			div2 = claim_element(header_nodes, "DIV", { class: true, id: true });
			var div2_nodes = children(div2);
			a0 = claim_element(div2_nodes, "A", { class: true, href: true, title: true });
			var a0_nodes = children(a0);

			img0 = claim_element(a0_nodes, "IMG", {
				src: true,
				width: true,
				height: true,
				alt: true,
				class: true
			});

			t0 = claim_space(a0_nodes);

			img1 = claim_element(a0_nodes, "IMG", {
				src: true,
				height: true,
				width: true,
				alt: true,
				class: true
			});

			a0_nodes.forEach(detach_dev);
			t1 = claim_space(div2_nodes);

			input = claim_element(div2_nodes, "INPUT", {
				type: true,
				id: true,
				name: true,
				title: true,
				class: true
			});

			t2 = claim_space(div2_nodes);
			nav = claim_element(div2_nodes, "NAV", { class: true });
			var nav_nodes = children(nav);
			a1 = claim_element(nav_nodes, "A", { class: true, href: true });
			var a1_nodes = children(a1);
			t3 = claim_text(a1_nodes, "Accueil");
			a1_nodes.forEach(detach_dev);
			t4 = claim_space(nav_nodes);
			a2 = claim_element(nav_nodes, "A", { href: true, class: true });
			var a2_nodes = children(a2);
			t5 = claim_text(a2_nodes, "Séries");
			a2_nodes.forEach(detach_dev);
			t6 = claim_space(nav_nodes);
			a3 = claim_element(nav_nodes, "A", { href: true, class: true });
			var a3_nodes = children(a3);
			t7 = claim_text(a3_nodes, "Films");
			a3_nodes.forEach(detach_dev);
			t8 = claim_space(nav_nodes);
			a4 = claim_element(nav_nodes, "A", { href: true, class: true });
			var a4_nodes = children(a4);
			t9 = claim_text(a4_nodes, "Tous les films et séries");
			a4_nodes.forEach(detach_dev);
			nav_nodes.forEach(detach_dev);
			t10 = claim_space(div2_nodes);
			a5 = claim_element(div2_nodes, "A", { class: true, href: true });
			var a5_nodes = children(a5);
			i0 = claim_element(a5_nodes, "I", { class: true, size: true });
			children(i0).forEach(detach_dev);
			t11 = claim_space(a5_nodes);
			span0 = claim_element(a5_nodes, "SPAN", { class: true });
			var span0_nodes = children(span0);
			t12 = claim_text(span0_nodes, "Comment Jouer");
			span0_nodes.forEach(detach_dev);
			a5_nodes.forEach(detach_dev);
			t13 = claim_space(div2_nodes);
			div0 = claim_element(div2_nodes, "DIV", { class: true, "aria-label": true });
			var div0_nodes = children(div0);
			i1 = claim_element(div0_nodes, "I", { class: true, size: true });
			children(i1).forEach(detach_dev);
			t14 = claim_space(div0_nodes);
			span1 = claim_element(div0_nodes, "SPAN", { class: true });
			var span1_nodes = children(span1);
			t15 = claim_text(span1_nodes, /*$WinningStreak*/ ctx[1]);
			span1_nodes.forEach(detach_dev);
			div0_nodes.forEach(detach_dev);
			t16 = claim_space(div2_nodes);
			label = claim_element(div2_nodes, "LABEL", { for: true, class: true });
			var label_nodes = children(label);
			div1 = claim_element(label_nodes, "DIV", { class: true });
			children(div1).forEach(detach_dev);
			label_nodes.forEach(detach_dev);
			div2_nodes.forEach(detach_dev);
			header_nodes.forEach(detach_dev);
			t17 = claim_space(nodes);
			div3 = claim_element(nodes, "DIV", { class: true, title: true });
			var div3_nodes = children(div3);
			p = claim_element(div3_nodes, "P", { class: true });
			var p_nodes = children(p);
			t18 = claim_text(p_nodes, "Le joueur doit deviner les noms de films et de séries à partir d'images\n        grisées");
			br = claim_element(p_nodes, "BR", {});
			t19 = claim_text(p_nodes, "\n        en tapant le nom dans la zone dédiée.");
			p_nodes.forEach(detach_dev);
			div3_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			if (!src_url_equal(img0.src, img0_src_value = "./assets/pictures/m.webp")) attr_dev(img0, "src", img0_src_value);
			attr_dev(img0, "width", "32");
			attr_dev(img0, "height", "32");
			attr_dev(img0, "alt", "Movie Quiz Logo Mini");
			attr_dev(img0, "class", "d-md-none");
			add_location(img0, file$5, 93, 12, 2229);
			if (!src_url_equal(img1.src, img1_src_value = "./assets/pictures/moviequiz.webp")) attr_dev(img1, "src", img1_src_value);
			attr_dev(img1, "height", "32");
			attr_dev(img1, "width", "126");
			attr_dev(img1, "alt", "Movie Quiz Logo");
			attr_dev(img1, "class", "d-none d-md-inline-block");
			add_location(img1, file$5, 101, 12, 2467);
			attr_dev(a0, "class", "logo");
			attr_dev(a0, "href", "/");
			attr_dev(a0, "title", "Movie Quiz");
			add_location(a0, file$5, 92, 8, 2172);
			attr_dev(input, "type", "checkbox");
			attr_dev(input, "id", "burger-btn");
			attr_dev(input, "name", "burger-btn");
			attr_dev(input, "title", "Burger Button Checkbox");
			attr_dev(input, "class", "");
			add_location(input, file$5, 110, 8, 2733);
			attr_dev(a1, "class", "nav-link");
			attr_dev(a1, "href", "/");
			add_location(a1, file$5, 124, 12, 3178);
			attr_dev(a2, "href", "tv");
			attr_dev(a2, "class", "nav-link");
			add_location(a2, file$5, 125, 12, 3254);
			attr_dev(a3, "href", "movies");
			attr_dev(a3, "class", "nav-link");
			add_location(a3, file$5, 126, 12, 3330);
			attr_dev(a4, "href", "all");
			attr_dev(a4, "class", "nav-link");
			add_location(a4, file$5, 127, 12, 3407);
			attr_dev(nav, "class", "nav flex-column flex-lg-row justify-content-center");
			add_location(nav, file$5, 120, 8, 3048);
			attr_dev(i0, "class", "ng-help");
			attr_dev(i0, "size", "24");
			add_location(i0, file$5, 138, 12, 3758);
			attr_dev(span0, "class", "hide-on-mobile ms-1");
			add_location(span0, file$5, 139, 12, 3802);
			attr_dev(a5, "class", "info-btn ms-auto my-2 d-flex align-items-center");
			attr_dev(a5, "href", "#");
			add_location(a5, file$5, 133, 8, 3596);
			attr_dev(i1, "class", "ng-emoji-events");
			attr_dev(i1, "size", "24");
			add_location(i1, file$5, 146, 12, 4025);
			attr_dev(span1, "class", "count ms-2");
			add_location(span1, file$5, 147, 12, 4077);
			attr_dev(div0, "class", "winning-streak m-2 hint--bottom hint--bounce hint--rounded svelte-4flq68");
			attr_dev(div0, "aria-label", "Winning Streak");
			add_location(div0, file$5, 142, 8, 3879);
			attr_dev(div1, "class", "burger");
			add_location(div1, file$5, 151, 12, 4223);
			attr_dev(label, "for", "burger-btn");
			attr_dev(label, "class", "burger-btn ms-3 mobile-only");
			add_location(label, file$5, 150, 8, 4150);
			attr_dev(div2, "class", "nav-container w-100 d-flex align-items-center px-2 px-md-5");
			attr_dev(div2, "id", "top");
			add_location(div2, file$5, 88, 4, 2061);
			attr_dev(header, "class", "user-select-none");
			add_location(header, file$5, 87, 0, 2023);
			add_location(br, file$5, 159, 15, 4469);
			attr_dev(p, "class", "text-center");
			add_location(p, file$5, 157, 4, 4350);
			attr_dev(div3, "class", "rules");
			attr_dev(div3, "title", "Comment Jouer");
			add_location(div3, file$5, 156, 0, 4285);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, header, anchor);
			append_hydration_dev(header, div2);
			append_hydration_dev(div2, a0);
			append_hydration_dev(a0, img0);
			append_hydration_dev(a0, t0);
			append_hydration_dev(a0, img1);
			append_hydration_dev(div2, t1);
			append_hydration_dev(div2, input);
			/*input_binding*/ ctx[9](input);
			append_hydration_dev(div2, t2);
			append_hydration_dev(div2, nav);
			append_hydration_dev(nav, a1);
			append_hydration_dev(a1, t3);
			append_hydration_dev(nav, t4);
			append_hydration_dev(nav, a2);
			append_hydration_dev(a2, t5);
			append_hydration_dev(nav, t6);
			append_hydration_dev(nav, a3);
			append_hydration_dev(a3, t7);
			append_hydration_dev(nav, t8);
			append_hydration_dev(nav, a4);
			append_hydration_dev(a4, t9);
			append_hydration_dev(div2, t10);
			append_hydration_dev(div2, a5);
			append_hydration_dev(a5, i0);
			append_hydration_dev(a5, t11);
			append_hydration_dev(a5, span0);
			append_hydration_dev(span0, t12);
			append_hydration_dev(div2, t13);
			append_hydration_dev(div2, div0);
			append_hydration_dev(div0, i1);
			append_hydration_dev(div0, t14);
			append_hydration_dev(div0, span1);
			append_hydration_dev(span1, t15);
			append_hydration_dev(div2, t16);
			append_hydration_dev(div2, label);
			append_hydration_dev(label, div1);
			insert_hydration_dev(target, t17, anchor);
			insert_hydration_dev(target, div3, anchor);
			append_hydration_dev(div3, p);
			append_hydration_dev(p, t18);
			append_hydration_dev(p, br);
			append_hydration_dev(p, t19);

			if (!mounted) {
				dispose = [
					action_destroyer(/*onload*/ ctx[2].call(null, img0)),
					action_destroyer(/*onload*/ ctx[2].call(null, img1)),
					listen_dev(input, "change", /*handleBurgerChange*/ ctx[5], false, false, false, false),
					action_destroyer(/*active*/ ctx[8].call(null, a1)),
					action_destroyer(links.call(null, a1)),
					action_destroyer(/*active*/ ctx[8].call(null, a2)),
					action_destroyer(links.call(null, a2)),
					action_destroyer(/*active*/ ctx[8].call(null, a3)),
					action_destroyer(links.call(null, a3)),
					action_destroyer(/*active*/ ctx[8].call(null, a4)),
					action_destroyer(links.call(null, a4)),
					listen_dev(nav, "click", /*navClick*/ ctx[6], false, false, false, false),
					listen_dev(a5, "click", prevent_default(/*showModal*/ ctx[4]), false, true, false, false),
					action_destroyer(/*oncreateDialog*/ ctx[3].call(null, div3))
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*$WinningStreak*/ 2) set_data_dev(t15, /*$WinningStreak*/ ctx[1]);
		},
		i: noop$1,
		o: noop$1,
		d: function destroy(detaching) {
			if (detaching) detach_dev(header);
			/*input_binding*/ ctx[9](null);
			if (detaching) detach_dev(t17);
			if (detaching) detach_dev(div3);
			mounted = false;
			run_all(dispose);
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
	let $loc;
	let $WinningStreak;
	validate_store(WinningStreak, 'WinningStreak');
	component_subscribe($$self, WinningStreak, $$value => $$invalidate(1, $WinningStreak = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Header', slots, []);
	const { onload } = createResourceLoader();
	const { oncreateDialog, dialog: regles } = createDialog({ canCancel: false, position: Position.TOP });

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
				NoScroll.disable(false);
			}
		}
	});

	NoScroll.on("disabled", e => {
		if (burger.checked && breakpoint.matches) {
			NoScroll.enable(false);
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
	component_subscribe($$self, loc, value => $$invalidate(10, $loc = value));
	const navLinks = new Set();

	function active(el) {
		navLinks.add(el);
		const href = el.getAttribute("href");

		if ($loc.pathname.slice(1).startsWith(href + "/") || $loc.pathname === href) {
			el.classList.add("active");
		} else {
			el.classList.remove("active");
		}
	}

	beforeUpdate(() => {
		navLinks.forEach(active);
	});

	onDestroy(() => {
		navLinks.clear();
	});

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
		createResourceLoader,
		Position,
		createDialog,
		NoScroll,
		beforeUpdate,
		onDestroy,
		WinningStreak,
		onload,
		oncreateDialog,
		regles,
		showModal,
		burger,
		handleBurgerChange,
		breakpoint,
		navClick,
		loc,
		navLinks,
		active,
		$loc,
		$WinningStreak
	});

	$$self.$inject_state = $$props => {
		if ('burger' in $$props) $$invalidate(0, burger = $$props.burger);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		burger,
		$WinningStreak,
		onload,
		oncreateDialog,
		showModal,
		handleBurgerChange,
		navClick,
		loc,
		active,
		input_binding
	];
}

class Header extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$8, create_fragment$8, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Header",
			options,
			id: create_fragment$8.name
		});
	}
}

/* src\components\Footer.svelte generated by Svelte v3.59.1 */
const file$4 = "src\\components\\Footer.svelte";

function create_fragment$7(ctx) {
	let footer;
	let t0;
	let br;
	let t1;
	let a0;
	let t2;
	let t3;
	let div1;
	let p;
	let t4;
	let a1;
	let t5;
	let t6;
	let t7;
	let div0;
	let a2;
	let i0;
	let t8;
	let a3;
	let i1;
	let t9;
	let a4;
	let i2;
	let t10;
	let a5;
	let i3;
	let t11;
	let a6;
	let i4;
	let t12;
	let a7;
	let t13;
	let t14;
	let a8;
	let i5;
	let t15;
	let a9;
	let i6;
	let t16;
	let a10;
	let i7;
	let t17;
	let a11;
	let i8;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			footer = element("footer");
			t0 = text("Une réalisation © ACS Lons-le-Saunier - Mentions légales");
			br = element("br");
			t1 = space();
			a0 = element("a");
			t2 = text("Crédits");
			t3 = space();
			div1 = element("div");
			p = element("p");
			t4 = text("Jeu développé par ");
			a1 = element("a");
			t5 = text("Aymeric Anger");
			t6 = text(", utilisant ces technologies:");
			t7 = space();
			div0 = element("div");
			a2 = element("a");
			i0 = element("i");
			t8 = space();
			a3 = element("a");
			i1 = element("i");
			t9 = space();
			a4 = element("a");
			i2 = element("i");
			t10 = space();
			a5 = element("a");
			i3 = element("i");
			t11 = space();
			a6 = element("a");
			i4 = element("i");
			t12 = space();
			a7 = element("a");
			t13 = text("Typed.js");
			t14 = space();
			a8 = element("a");
			i5 = element("i");
			t15 = space();
			a9 = element("a");
			i6 = element("i");
			t16 = space();
			a10 = element("a");
			i7 = element("i");
			t17 = space();
			a11 = element("a");
			i8 = element("i");
			this.h();
		},
		l: function claim(nodes) {
			footer = claim_element(nodes, "FOOTER", { class: true });
			var footer_nodes = children(footer);
			t0 = claim_text(footer_nodes, "Une réalisation © ACS Lons-le-Saunier - Mentions légales");
			br = claim_element(footer_nodes, "BR", {});
			t1 = claim_space(footer_nodes);
			a0 = claim_element(footer_nodes, "A", { href: true, title: true });
			var a0_nodes = children(a0);
			t2 = claim_text(a0_nodes, "Crédits");
			a0_nodes.forEach(detach_dev);
			footer_nodes.forEach(detach_dev);
			t3 = claim_space(nodes);
			div1 = claim_element(nodes, "DIV", { class: true, title: true });
			var div1_nodes = children(div1);
			p = claim_element(div1_nodes, "P", { class: true });
			var p_nodes = children(p);
			t4 = claim_text(p_nodes, "Jeu développé par ");
			a1 = claim_element(p_nodes, "A", { href: true, target: true });
			var a1_nodes = children(a1);
			t5 = claim_text(a1_nodes, "Aymeric Anger");
			a1_nodes.forEach(detach_dev);
			t6 = claim_text(p_nodes, ", utilisant ces technologies:");
			p_nodes.forEach(detach_dev);
			t7 = claim_space(div1_nodes);
			div0 = claim_element(div1_nodes, "DIV", { class: true });
			var div0_nodes = children(div0);

			a2 = claim_element(div0_nodes, "A", {
				href: true,
				target: true,
				rel: true,
				class: true,
				"aria-label": true
			});

			var a2_nodes = children(a2);
			i0 = claim_element(a2_nodes, "I", { class: true, size: true });
			children(i0).forEach(detach_dev);
			a2_nodes.forEach(detach_dev);
			t8 = claim_space(div0_nodes);

			a3 = claim_element(div0_nodes, "A", {
				href: true,
				target: true,
				rel: true,
				class: true,
				"aria-label": true
			});

			var a3_nodes = children(a3);
			i1 = claim_element(a3_nodes, "I", { class: true, size: true });
			children(i1).forEach(detach_dev);
			a3_nodes.forEach(detach_dev);
			t9 = claim_space(div0_nodes);

			a4 = claim_element(div0_nodes, "A", {
				href: true,
				target: true,
				rel: true,
				class: true,
				"aria-label": true
			});

			var a4_nodes = children(a4);
			i2 = claim_element(a4_nodes, "I", { class: true, size: true });
			children(i2).forEach(detach_dev);
			a4_nodes.forEach(detach_dev);
			t10 = claim_space(div0_nodes);

			a5 = claim_element(div0_nodes, "A", {
				href: true,
				target: true,
				rel: true,
				class: true,
				"aria-label": true
			});

			var a5_nodes = children(a5);
			i3 = claim_element(a5_nodes, "I", { class: true, size: true });
			children(i3).forEach(detach_dev);
			a5_nodes.forEach(detach_dev);
			t11 = claim_space(div0_nodes);

			a6 = claim_element(div0_nodes, "A", {
				href: true,
				target: true,
				rel: true,
				class: true,
				"aria-label": true
			});

			var a6_nodes = children(a6);
			i4 = claim_element(a6_nodes, "I", { class: true, size: true });
			children(i4).forEach(detach_dev);
			a6_nodes.forEach(detach_dev);
			t12 = claim_space(div0_nodes);

			a7 = claim_element(div0_nodes, "A", {
				href: true,
				target: true,
				rel: true,
				class: true,
				"aria-label": true
			});

			var a7_nodes = children(a7);
			t13 = claim_text(a7_nodes, "Typed.js");
			a7_nodes.forEach(detach_dev);
			t14 = claim_space(div0_nodes);

			a8 = claim_element(div0_nodes, "A", {
				href: true,
				target: true,
				rel: true,
				class: true,
				"aria-label": true
			});

			var a8_nodes = children(a8);
			i5 = claim_element(a8_nodes, "I", { class: true, size: true });
			children(i5).forEach(detach_dev);
			a8_nodes.forEach(detach_dev);
			t15 = claim_space(div0_nodes);

			a9 = claim_element(div0_nodes, "A", {
				href: true,
				target: true,
				rel: true,
				class: true,
				"aria-label": true
			});

			var a9_nodes = children(a9);
			i6 = claim_element(a9_nodes, "I", { class: true, size: true });
			children(i6).forEach(detach_dev);
			a9_nodes.forEach(detach_dev);
			t16 = claim_space(div0_nodes);

			a10 = claim_element(div0_nodes, "A", {
				href: true,
				target: true,
				rel: true,
				class: true,
				"aria-label": true
			});

			var a10_nodes = children(a10);
			i7 = claim_element(a10_nodes, "I", { class: true, size: true });
			children(i7).forEach(detach_dev);
			a10_nodes.forEach(detach_dev);
			t17 = claim_space(div0_nodes);

			a11 = claim_element(div0_nodes, "A", {
				href: true,
				target: true,
				rel: true,
				class: true,
				"aria-label": true
			});

			var a11_nodes = children(a11);
			i8 = claim_element(a11_nodes, "I", { class: true, size: true });
			children(i8).forEach(detach_dev);
			a11_nodes.forEach(detach_dev);
			div0_nodes.forEach(detach_dev);
			div1_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			add_location(br, file$4, 15, 65, 403);
			attr_dev(a0, "href", "#credits");
			attr_dev(a0, "title", "Crédits");
			add_location(a0, file$4, 16, 4, 414);
			attr_dev(footer, "class", "text-center p-3 mt-3");
			add_location(footer, file$4, 14, 0, 300);
			attr_dev(a1, "href", "https://aanger.netlify.app/");
			attr_dev(a1, "target", "_blank");
			add_location(a1, file$4, 23, 26, 644);
			attr_dev(p, "class", "m-0 p-0");
			add_location(p, file$4, 22, 4, 598);
			attr_dev(i0, "class", "ng-tmdb");
			attr_dev(i0, "size", "48");
			add_location(i0, file$4, 35, 12, 1083);
			attr_dev(a2, "href", "https://www.themoviedb.org/");
			attr_dev(a2, "target", "_blank");
			attr_dev(a2, "rel", "noopener noreferrer");
			attr_dev(a2, "class", "hint--top hint--bounce hint--rounded svelte-16891jd");
			attr_dev(a2, "aria-label", "The Movie Database");
			add_location(a2, file$4, 28, 8, 844);
			attr_dev(i1, "class", "ng-node");
			attr_dev(i1, "size", "96");
			add_location(i1, file$4, 45, 12, 1356);
			attr_dev(a3, "href", "https://nodejs.org/");
			attr_dev(a3, "target", "_blank");
			attr_dev(a3, "rel", "noopener noreferrer");
			attr_dev(a3, "class", "hint--top hint--bounce hint--rounded svelte-16891jd");
			attr_dev(a3, "aria-label", "NodeJS");
			add_location(a3, file$4, 38, 8, 1137);
			attr_dev(i2, "class", "ng-svelte");
			attr_dev(i2, "size", "48");
			add_location(i2, file$4, 55, 12, 1629);
			attr_dev(a4, "href", "https://svelte.dev/");
			attr_dev(a4, "target", "_blank");
			attr_dev(a4, "rel", "noopener noreferrer");
			attr_dev(a4, "class", "hint--top hint--bounce hint--rounded svelte-16891jd");
			attr_dev(a4, "aria-label", "Svelte");
			add_location(a4, file$4, 48, 8, 1410);
			attr_dev(i3, "class", "ng-sass");
			attr_dev(i3, "size", "48");
			add_location(i3, file$4, 65, 12, 1905);
			attr_dev(a5, "href", "https://sass-lang.com/");
			attr_dev(a5, "target", "_blank");
			attr_dev(a5, "rel", "noopener noreferrer");
			attr_dev(a5, "class", "hint--top hint--bounce hint--rounded svelte-16891jd");
			attr_dev(a5, "aria-label", "ScSS");
			add_location(a5, file$4, 58, 8, 1685);
			attr_dev(i4, "class", "ng-bootstrap");
			attr_dev(i4, "size", "48");
			add_location(i4, file$4, 75, 12, 2187);
			attr_dev(a6, "href", "https://getbootstrap.com/");
			attr_dev(a6, "target", "_blank");
			attr_dev(a6, "rel", "noopener noreferrer");
			attr_dev(a6, "class", "hint--top hint--bounce hint--rounded svelte-16891jd");
			attr_dev(a6, "aria-label", "Bootstrap");
			add_location(a6, file$4, 68, 8, 1959);
			attr_dev(a7, "href", "https://mattboldt.com/demos/typed-js/");
			attr_dev(a7, "target", "_blank");
			attr_dev(a7, "rel", "noopener noreferrer");
			attr_dev(a7, "class", "typedjs-icon hint--top hint--bounce hint--rounded svelte-16891jd");
			attr_dev(a7, "aria-label", "Typed.js");
			add_location(a7, file$4, 78, 8, 2246);
			attr_dev(i5, "class", "ng-swiper");
			attr_dev(i5, "size", "48");
			add_location(i5, file$4, 94, 12, 2749);
			attr_dev(a8, "href", "https://swiperjs.com/");
			attr_dev(a8, "target", "_blank");
			attr_dev(a8, "rel", "noopener noreferrer");
			attr_dev(a8, "class", "hint--top hint--bounce hint--rounded svelte-16891jd");
			attr_dev(a8, "aria-label", "Swiper");
			add_location(a8, file$4, 87, 8, 2528);
			attr_dev(i6, "class", "ng-gfonts");
			attr_dev(i6, "size", "48");
			add_location(i6, file$4, 103, 12, 3083);
			attr_dev(a9, "href", "https://fonts.google.com/icons?icon.set=Material+Symbols");
			attr_dev(a9, "target", "_blank");
			attr_dev(a9, "rel", "noopener noreferrer");
			attr_dev(a9, "class", "hint--top hint--bounce hint--rounded svelte-16891jd");
			attr_dev(a9, "aria-label", "Google Fonts + Material Icons");
			add_location(a9, file$4, 96, 8, 2804);
			attr_dev(i7, "class", "ng-devicon");
			attr_dev(i7, "size", "48");
			add_location(i7, file$4, 112, 12, 3360);
			attr_dev(a10, "href", "https://devicon.dev/");
			attr_dev(a10, "target", "_blank");
			attr_dev(a10, "rel", "noopener noreferrer");
			attr_dev(a10, "class", "hint--top hint--bounce hint--rounded svelte-16891jd");
			attr_dev(a10, "aria-label", "DevIcons");
			add_location(a10, file$4, 105, 8, 3138);
			attr_dev(i8, "class", "ng-github-revert");
			attr_dev(i8, "size", "48");
			add_location(i8, file$4, 122, 12, 3661);
			attr_dev(a11, "href", "https://github.com/aangerformapro/movie-quiz");
			attr_dev(a11, "target", "_blank");
			attr_dev(a11, "rel", "noopener noreferrer");
			attr_dev(a11, "class", "hint--top hint--bounce hint--rounded svelte-16891jd");
			attr_dev(a11, "aria-label", "Github");
			add_location(a11, file$4, 115, 8, 3417);
			attr_dev(div0, "class", "icons d-flex align-items-center flex-wrap svelte-16891jd");
			add_location(div0, file$4, 27, 4, 780);
			attr_dev(div1, "class", "dialog-contents mb-3");
			attr_dev(div1, "title", "Crédits");
			add_location(div1, file$4, 21, 0, 524);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, footer, anchor);
			append_hydration_dev(footer, t0);
			append_hydration_dev(footer, br);
			append_hydration_dev(footer, t1);
			append_hydration_dev(footer, a0);
			append_hydration_dev(a0, t2);
			insert_hydration_dev(target, t3, anchor);
			insert_hydration_dev(target, div1, anchor);
			append_hydration_dev(div1, p);
			append_hydration_dev(p, t4);
			append_hydration_dev(p, a1);
			append_hydration_dev(a1, t5);
			append_hydration_dev(p, t6);
			append_hydration_dev(div1, t7);
			append_hydration_dev(div1, div0);
			append_hydration_dev(div0, a2);
			append_hydration_dev(a2, i0);
			append_hydration_dev(div0, t8);
			append_hydration_dev(div0, a3);
			append_hydration_dev(a3, i1);
			append_hydration_dev(div0, t9);
			append_hydration_dev(div0, a4);
			append_hydration_dev(a4, i2);
			append_hydration_dev(div0, t10);
			append_hydration_dev(div0, a5);
			append_hydration_dev(a5, i3);
			append_hydration_dev(div0, t11);
			append_hydration_dev(div0, a6);
			append_hydration_dev(a6, i4);
			append_hydration_dev(div0, t12);
			append_hydration_dev(div0, a7);
			append_hydration_dev(a7, t13);
			append_hydration_dev(div0, t14);
			append_hydration_dev(div0, a8);
			append_hydration_dev(a8, i5);
			append_hydration_dev(div0, t15);
			append_hydration_dev(div0, a9);
			append_hydration_dev(a9, i6);
			append_hydration_dev(div0, t16);
			append_hydration_dev(div0, a10);
			append_hydration_dev(a10, i7);
			append_hydration_dev(div0, t17);
			append_hydration_dev(div0, a11);
			append_hydration_dev(a11, i8);

			if (!mounted) {
				dispose = [
					listen_dev(a0, "click", prevent_default(/*handleClick*/ ctx[1]), false, true, false, false),
					action_destroyer(/*oncreateDialog*/ ctx[0].call(null, div1))
				];

				mounted = true;
			}
		},
		p: noop$1,
		i: noop$1,
		o: noop$1,
		d: function destroy(detaching) {
			if (detaching) detach_dev(footer);
			if (detaching) detach_dev(t3);
			if (detaching) detach_dev(div1);
			mounted = false;
			run_all(dispose);
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

function instance$7($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Footer', slots, []);

	const { dialog, oncreateDialog } = createDialog({
		canCancel: false,
		canClose: false,
		backdropClose: false
	});

	function handleClick() {
		dialog.showModal();
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		createDialog,
		dialog,
		oncreateDialog,
		handleClick
	});

	return [oncreateDialog, handleClick];
}

class Footer extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$7, create_fragment$7, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Footer",
			options,
			id: create_fragment$7.name
		});
	}
}

function t(){return t=Object.assign?Object.assign.bind():function(t){for(var s=1;s<arguments.length;s++){var e=arguments[s];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);}return t},t.apply(this,arguments)}var s={strings:["These are the default values...","You know what you should do?","Use your own!","Have a great day!"],stringsElement:null,typeSpeed:0,startDelay:0,backSpeed:0,smartBackspace:!0,shuffle:!1,backDelay:700,fadeOut:!1,fadeOutClass:"typed-fade-out",fadeOutDelay:500,loop:!1,loopCount:Infinity,showCursor:!0,cursorChar:"|",autoInsertCss:!0,attr:null,bindInputFocusEvents:!1,contentType:"html",onBegin:function(t){},onComplete:function(t){},preStringTyped:function(t,s){},onStringTyped:function(t,s){},onLastStringBackspaced:function(t){},onTypingPaused:function(t,s){},onTypingResumed:function(t,s){},onReset:function(t){},onStop:function(t,s){},onStart:function(t,s){},onDestroy:function(t){}},e=new(/*#__PURE__*/function(){function e(){}var n=e.prototype;return n.load=function(e,n,i){if(e.el="string"==typeof i?document.querySelector(i):i,e.options=t({},s,n),e.isInput="input"===e.el.tagName.toLowerCase(),e.attr=e.options.attr,e.bindInputFocusEvents=e.options.bindInputFocusEvents,e.showCursor=!e.isInput&&e.options.showCursor,e.cursorChar=e.options.cursorChar,e.cursorBlinking=!0,e.elContent=e.attr?e.el.getAttribute(e.attr):e.el.textContent,e.contentType=e.options.contentType,e.typeSpeed=e.options.typeSpeed,e.startDelay=e.options.startDelay,e.backSpeed=e.options.backSpeed,e.smartBackspace=e.options.smartBackspace,e.backDelay=e.options.backDelay,e.fadeOut=e.options.fadeOut,e.fadeOutClass=e.options.fadeOutClass,e.fadeOutDelay=e.options.fadeOutDelay,e.isPaused=!1,e.strings=e.options.strings.map(function(t){return t.trim()}),e.stringsElement="string"==typeof e.options.stringsElement?document.querySelector(e.options.stringsElement):e.options.stringsElement,e.stringsElement){e.strings=[],e.stringsElement.style.cssText="clip: rect(0 0 0 0);clip-path:inset(50%);height:1px;overflow:hidden;position:absolute;white-space:nowrap;width:1px;";var r=Array.prototype.slice.apply(e.stringsElement.children),o=r.length;if(o)for(var a=0;a<o;a+=1)e.strings.push(r[a].innerHTML.trim());}for(var u in e.strPos=0,e.currentElContent=this.getCurrentElContent(e),e.currentElContent&&e.currentElContent.length>0&&(e.strPos=e.currentElContent.length-1,e.strings.unshift(e.currentElContent)),e.sequence=[],e.strings)e.sequence[u]=u;e.arrayPos=0,e.stopNum=0,e.loop=e.options.loop,e.loopCount=e.options.loopCount,e.curLoop=0,e.shuffle=e.options.shuffle,e.pause={status:!1,typewrite:!0,curString:"",curStrPos:0},e.typingComplete=!1,e.autoInsertCss=e.options.autoInsertCss,e.autoInsertCss&&(this.appendCursorAnimationCss(e),this.appendFadeOutAnimationCss(e));},n.getCurrentElContent=function(t){return t.attr?t.el.getAttribute(t.attr):t.isInput?t.el.value:"html"===t.contentType?t.el.innerHTML:t.el.textContent},n.appendCursorAnimationCss=function(t){var s="data-typed-js-cursor-css";if(t.showCursor&&!document.querySelector("["+s+"]")){var e=document.createElement("style");e.setAttribute(s,"true"),e.innerHTML="\n        .typed-cursor{\n          opacity: 1;\n        }\n        .typed-cursor.typed-cursor--blink{\n          animation: typedjsBlink 0.7s infinite;\n          -webkit-animation: typedjsBlink 0.7s infinite;\n                  animation: typedjsBlink 0.7s infinite;\n        }\n        @keyframes typedjsBlink{\n          50% { opacity: 0.0; }\n        }\n        @-webkit-keyframes typedjsBlink{\n          0% { opacity: 1; }\n          50% { opacity: 0.0; }\n          100% { opacity: 1; }\n        }\n      ",document.body.appendChild(e);}},n.appendFadeOutAnimationCss=function(t){var s="data-typed-fadeout-js-css";if(t.fadeOut&&!document.querySelector("["+s+"]")){var e=document.createElement("style");e.setAttribute(s,"true"),e.innerHTML="\n        .typed-fade-out{\n          opacity: 0;\n          transition: opacity .25s;\n        }\n        .typed-cursor.typed-cursor--blink.typed-fade-out{\n          -webkit-animation: 0;\n          animation: 0;\n        }\n      ",document.body.appendChild(e);}},e}()),n=new(/*#__PURE__*/function(){function t(){}var s=t.prototype;return s.typeHtmlChars=function(t,s,e){if("html"!==e.contentType)return s;var n=t.substring(s).charAt(0);if("<"===n||"&"===n){var i;for(i="<"===n?">":";";t.substring(s+1).charAt(0)!==i&&!(1+ ++s>t.length););s++;}return s},s.backSpaceHtmlChars=function(t,s,e){if("html"!==e.contentType)return s;var n=t.substring(s).charAt(0);if(">"===n||";"===n){var i;for(i=">"===n?"<":"&";t.substring(s-1).charAt(0)!==i&&!(--s<0););s--;}return s},t}()),i=/*#__PURE__*/function(){function t(t,s){e.load(this,s,t),this.begin();}var s=t.prototype;return s.toggle=function(){this.pause.status?this.start():this.stop();},s.stop=function(){this.typingComplete||this.pause.status||(this.toggleBlinking(!0),this.pause.status=!0,this.options.onStop(this.arrayPos,this));},s.start=function(){this.typingComplete||this.pause.status&&(this.pause.status=!1,this.pause.typewrite?this.typewrite(this.pause.curString,this.pause.curStrPos):this.backspace(this.pause.curString,this.pause.curStrPos),this.options.onStart(this.arrayPos,this));},s.destroy=function(){this.reset(!1),this.options.onDestroy(this);},s.reset=function(t){void 0===t&&(t=!0),clearInterval(this.timeout),this.replaceText(""),this.cursor&&this.cursor.parentNode&&(this.cursor.parentNode.removeChild(this.cursor),this.cursor=null),this.strPos=0,this.arrayPos=0,this.curLoop=0,t&&(this.insertCursor(),this.options.onReset(this),this.begin());},s.begin=function(){var t=this;this.options.onBegin(this),this.typingComplete=!1,this.shuffleStringsIfNeeded(this),this.insertCursor(),this.bindInputFocusEvents&&this.bindFocusEvents(),this.timeout=setTimeout(function(){0===t.strPos?t.typewrite(t.strings[t.sequence[t.arrayPos]],t.strPos):t.backspace(t.strings[t.sequence[t.arrayPos]],t.strPos);},this.startDelay);},s.typewrite=function(t,s){var e=this;this.fadeOut&&this.el.classList.contains(this.fadeOutClass)&&(this.el.classList.remove(this.fadeOutClass),this.cursor&&this.cursor.classList.remove(this.fadeOutClass));var i=this.humanizer(this.typeSpeed),r=1;!0!==this.pause.status?this.timeout=setTimeout(function(){s=n.typeHtmlChars(t,s,e);var i=0,o=t.substring(s);if("^"===o.charAt(0)&&/^\^\d+/.test(o)){var a=1;a+=(o=/\d+/.exec(o)[0]).length,i=parseInt(o),e.temporaryPause=!0,e.options.onTypingPaused(e.arrayPos,e),t=t.substring(0,s)+t.substring(s+a),e.toggleBlinking(!0);}if("`"===o.charAt(0)){for(;"`"!==t.substring(s+r).charAt(0)&&(r++,!(s+r>t.length)););var u=t.substring(0,s),p=t.substring(u.length+1,s+r),c=t.substring(s+r+1);t=u+p+c,r--;}e.timeout=setTimeout(function(){e.toggleBlinking(!1),s>=t.length?e.doneTyping(t,s):e.keepTyping(t,s,r),e.temporaryPause&&(e.temporaryPause=!1,e.options.onTypingResumed(e.arrayPos,e));},i);},i):this.setPauseStatus(t,s,!0);},s.keepTyping=function(t,s,e){0===s&&(this.toggleBlinking(!1),this.options.preStringTyped(this.arrayPos,this));var n=t.substring(0,s+=e);this.replaceText(n),this.typewrite(t,s);},s.doneTyping=function(t,s){var e=this;this.options.onStringTyped(this.arrayPos,this),this.toggleBlinking(!0),this.arrayPos===this.strings.length-1&&(this.complete(),!1===this.loop||this.curLoop===this.loopCount)||(this.timeout=setTimeout(function(){e.backspace(t,s);},this.backDelay));},s.backspace=function(t,s){var e=this;if(!0!==this.pause.status){if(this.fadeOut)return this.initFadeOut();this.toggleBlinking(!1);var i=this.humanizer(this.backSpeed);this.timeout=setTimeout(function(){s=n.backSpaceHtmlChars(t,s,e);var i=t.substring(0,s);if(e.replaceText(i),e.smartBackspace){var r=e.strings[e.arrayPos+1];e.stopNum=r&&i===r.substring(0,s)?s:0;}s>e.stopNum?(s--,e.backspace(t,s)):s<=e.stopNum&&(e.arrayPos++,e.arrayPos===e.strings.length?(e.arrayPos=0,e.options.onLastStringBackspaced(),e.shuffleStringsIfNeeded(),e.begin()):e.typewrite(e.strings[e.sequence[e.arrayPos]],s));},i);}else this.setPauseStatus(t,s,!1);},s.complete=function(){this.options.onComplete(this),this.loop?this.curLoop++:this.typingComplete=!0;},s.setPauseStatus=function(t,s,e){this.pause.typewrite=e,this.pause.curString=t,this.pause.curStrPos=s;},s.toggleBlinking=function(t){this.cursor&&(this.pause.status||this.cursorBlinking!==t&&(this.cursorBlinking=t,t?this.cursor.classList.add("typed-cursor--blink"):this.cursor.classList.remove("typed-cursor--blink")));},s.humanizer=function(t){return Math.round(Math.random()*t/2)+t},s.shuffleStringsIfNeeded=function(){this.shuffle&&(this.sequence=this.sequence.sort(function(){return Math.random()-.5}));},s.initFadeOut=function(){var t=this;return this.el.className+=" "+this.fadeOutClass,this.cursor&&(this.cursor.className+=" "+this.fadeOutClass),setTimeout(function(){t.arrayPos++,t.replaceText(""),t.strings.length>t.arrayPos?t.typewrite(t.strings[t.sequence[t.arrayPos]],0):(t.typewrite(t.strings[0],0),t.arrayPos=0);},this.fadeOutDelay)},s.replaceText=function(t){this.attr?this.el.setAttribute(this.attr,t):this.isInput?this.el.value=t:"html"===this.contentType?this.el.innerHTML=t:this.el.textContent=t;},s.bindFocusEvents=function(){var t=this;this.isInput&&(this.el.addEventListener("focus",function(s){t.stop();}),this.el.addEventListener("blur",function(s){t.el.value&&0!==t.el.value.length||t.start();}));},s.insertCursor=function(){this.showCursor&&(this.cursor||(this.cursor=document.createElement("span"),this.cursor.className="typed-cursor",this.cursor.setAttribute("aria-hidden",!0),this.cursor.innerHTML=this.cursorChar,this.el.parentNode&&this.el.parentNode.insertBefore(this.cursor,this.el.nextSibling)));},t}();

/**
 * ChatGpt translation
 */
const fr = [
    "Réticulation des splines...",
    "Génération de dialogues spirituels...",
    "Échange de temps et d'espace...",
    "Rotation violente autour de l'axe des y...",
    "Tokenisation de la vie réelle...",
    "Courbure de la cuillère...",
    "Filtrage du moral...",
    "Ne pensez pas à des hippopotames violets...",
    "Nous avons besoin d'un nouveau fusible...",
    "Bonne journée.",
    "Mise à niveau de Windows, votre PC redémarrera plusieurs fois. Installez-vous et détendez-vous.",
    "640K devrait suffire à tout le monde",
    "Les architectes sont toujours en train de concevoir",
    "Les bits se reproduisent",
    "Nous construisons les bâtiments aussi vite que possible",
    "Préférez-vous du poulet, du steak ou du tofu ?",
    "(Ne faites pas attention à l'homme derrière le rideau)",
    "...et appréciez la musique d'ascenseur...",
    "Veuillez patienter pendant que les petits lutins dessinent votre carte",
    "Ne vous inquiétez pas - quelques bits ont tenté de s'échapper, mais nous les avons attrapés",
    "Souhaitez-vous des frites avec ça ?",
    "Vérification de la constante gravitationnelle dans votre région...",
    "Allez-y, retenez votre souffle !",
    "...au moins vous n'êtes pas en attente...",
    "Hummez quelque chose fort pendant que les autres vous regardent",
    "Vous n'êtes plus au Kansas",
    "Le serveur est alimenté par un citron et deux électrodes.",
    "Veuillez patienter pendant qu'un plus grand fournisseur de logiciels à Seattle prend le contrôle du monde",
    "Nous testons votre patience",
    "Comme si vous aviez d'autres choix",
    "Suivez le lapin blanc",
    "Pourquoi ne pas commander un sandwich ?",
    "Pendant que le satellite se met en position",
    "Restez calme et exécutez npm install",
    "Aujourd'hui, les bits circulent lentement",
    "Creusez sur le 'X' pour trouver un trésor enfoui... ARRR !",
    "C'est encore plus rapide que vous ne pourriez le dessiner",
    "La dernière fois que j'ai essayé ça, le singe n'a pas survécu. Espérons que ça fonctionne mieux cette fois-ci.",
    "J'aurais dû boire un V8 ce matin.",
    "Mon autre écran de chargement est beaucoup plus rapide.",
    "Test sur Timmy... Nous aurons besoin d'un autre Timmy.",
    "Réconfoober le générateur d'énergie...",
    "(Insérer un quart)",
    "Sommes-nous déjà arrivés ?",
    "As-tu perdu du poids ?",
    "Compte simplement jusqu'à 10",
    "Pourquoi si sérieux ?",
    "Ce n'est pas toi. C'est moi.",
    "Compter à rebours depuis l'infini",
    "Ne panique pas...",
    "Embiger les prototypes",
    "Ne courez pas ! Nous sommes vos amis !",
    "Viens-tu souvent ici ?",
    "Avertissement : Ne vous enflammez pas.",
    "Nous te préparons un cookie.",
    "Création du champ d'inversion de boucle temporelle",
    "Faire tourner la roue de la fortune...",
    "Chargement du lapin enchanté...",
    "Calcul de la probabilité de réussite",
    "Je suis désolé Dave, je ne peux pas faire ça.",
    "Recherche de la monnaie exacte",
    "Tous vos navigateurs Web nous appartiennent",
    "Tout ce dont j'ai vraiment besoin, c'est un kilobit.",
    "J'ai l'impression que je suis censé charger quelque chose...",
    "Comment appelle-t-on 8 Hobbits ? Un Hobbyte.",
    "J'aurais dû utiliser un langage compilé...",
    "Est-ce Windows ?",
    "Ajustement du condensateur de flux...",
    "Veuillez attendre que le paresseux commence à bouger.",
    "Ne cassez pas votre écran tout de suite !",
    "Je jure que c'est presque terminé.",
    "Faisons une minute de pleine conscience...",
    "Les licornes se trouvent au bout de cette route, je vous le promets.",
    "À l'écoute du son d'une seule main qui applaudit...",
    "En gardant tous les 1 et en supprimant tous les 0...",
    "Mettre le glaçage sur le gâteau. Le gâteau n'est pas un mensonge...",
    "Nettoyage des toiles d'araignée...",
    "S'assurer que tous les i ont des points...",
    "Nous avons besoin de plus de cristaux de dilithium",
    "Où sont passés tous les internets ?",
    "Connexion au réservoir de stockage de neurotoxines...",
    "Accorder des vœux...",
    "Le temps passe quand on s'amuse.",
    "Prenez un café et revenez dans dix minutes...",
    "Entraînement du hamster...",
    "99 bouteilles de bière sur le mur...",
    "Restez un moment et écoutez...",
    "Faites attention de ne pas marcher sur l'interface graphique de git",
    "Tu ne passeras pas encore...",
    "Chargez-le et ils viendront",
    "Convaincre l'IA de ne pas devenir maléfique...",
    "Il n'y a pas de cuillère. Parce que nous n'avons pas fini de le charger",
    "Votre pouce gauche pointe vers la droite et votre pouce droit pointe vers la gauche.",
    "Comment es-tu arrivé ici ?",
    "Attends, est-ce que tu sens quelque chose brûler ?",
    "Calcul du secret de la vie, de l'univers et de tout.",
    "Quand rien ne va bien, va à gauche !!...",
    "J'adore mon travail seulement quand je suis en vacances...",
    "Je ne suis pas paresseux, je suis juste détendu !!",
    "Ne volez jamais. Le gouvernement déteste la concurrence....",
    "Pourquoi les appartements s'appellent-ils ainsi s'ils sont tous collés ensemble ?",
    "La vie est courte - Parle vite !!!!",
    "L'optimisme est un manque d'information.....",
    "Économisez l'eau et douchez ensemble",
    "Chaque fois que je trouve la clé du succès, quelqu'un change la serrure.",
    "Parfois, je pense que la guerre est la façon dont Dieu nous enseigne la géographie.",
    "J'ai un problème pour votre solution.....",
    "Là où il y a une volonté, il y a un parenté.",
    "Utilisateur : le mot que les professionnels de l'informatique utilisent quand ils veulent dire !!idiot!!",
    "Les adultes ne sont que des enfants avec de l'argent.",
    "Je pense donc je suis. Je pense.",
    "Un baiser, c'est comme un combat, avec des bouches.",
    "Tu ne paies pas d'impôts, on te les prend.",
    "Café, chocolat, hommes. Plus ils sont riches, mieux c'est !",
    "Je suis libre de tous préjugés. Je déteste tout le monde également.",
    "git arrive",
    "Que les forks soient avec toi",
    "Un commit par jour éloigne les foules.",
    "Ceci n'est pas une blague, c'est un commit.",
    "Construction de pylônes supplémentaires...",
    "Lancer des cordes pour des tortues de mer...",
    "Localisation de Jebediah Kerman...",
    "Nous ne sommes pas responsables des écrans cassés résultant de l'attente.",
    "Allô l'assistance informatique, avez-vous essayé de l'éteindre et de le rallumer ?",
    "Si vous tapez Google dans Google, vous pouvez casser Internet",
    "Eh bien, c'est embarrassant.",
    "Quelle est la vitesse de vol d'une hirondelle non chargée ?",
    "Allô, assistance informatique... Avez-vous essayé de forcer un redémarrage inattendu ?",
    "Ils nous jettent simplement comme de la confiture d'hier.",
    "Ils sont assez réguliers, les passages à tabac, oui. Je dirais qu'ils ont lieu toutes les deux semaines.",
    "Les Anciens d'Internet ne l'accepteraient jamais.",
    "L'espace est une poussière mentale invisible, et les étoiles ne sont que des souhaits.",
    "Je ne savais pas que la peinture séchait si rapidement.",
    "Tout se ressemble",
    "Je vais promener le chien",
    "Je n'ai pas choisi la vie d'ingénieur. La vie d'ingénieur m'a choisie.",
    "Division par zéro...",
    "Faire apparaître plus de seigneurs suprêmes !",
    "Si je ne suis pas de retour dans cinq minutes, attends simplement plus longtemps.",
    "Certains jours, on ne peut tout simplement pas se débarrasser d'un bogue !",
    "Nous allons avoir besoin d'un plus grand bateau.",
    "Chuck Norris ne pousse jamais git. Le dépôt se met en pull avant.",
    "Les développeurs Web le font avec <style>",
    "J'ai besoin de faire git pull --ma-vie-ensemble",
    "Les développeurs Java ne R.I.P jamais. Ils se font simplement collecter par les ordures.",
    "Cassage de cryptage de qualité militaire...",
    "Simulation du voyageur de commerce...",
    "Démonstration que P = NP...",
    "Enchevêtrement de supercordes...",
    "Tournicotage des pouces...",
    "Recherche d'un élément de l'intrigue...",
    "Essayer de trier en O(n)...",
    "Rire de vos photos - enfin, en chargement...",
    "Envoi de données à NS - enfin, à nos serveurs.",
    "Recherche d'un sens de l'humour, veuillez patienter.",
    "Veuillez patienter pendant que l'interne remplit sa tasse de café.",
    "Un message d'erreur différent ? Enfin, un peu de progrès !",
    "Attendez un instant pendant que nous concluons notre git ensemble... désolé",
    "Veuillez patienter pendant que nous réchauffons notre café.",
    "Veuillez patienter pendant que nous transformons ce bogue en une fonctionnalité...",
    "Veuillez patienter pendant que notre interne quitte vim...",
    "L'hiver arrive...",
    "Installation des dépendances",
    "Passage au dernier framework JS...",
    "Distracted par des gifs de chat",
    "En train de chercher quelqu'un pour tenir ma bière",
    "BRB, en train de travailler sur mon projet personnel",
    "@todo Insérer un message de chargement amusant",
    "Espérons que ça en vaut la peine d'attendre",
    "Oh, zut ! Pas ça...",
    "Commande de 1 et de 0...",
    "Mise à jour des dépendances...",
    "Quoi que vous fassiez, ne regardez pas derrière vous...",
    "Veuillez patienter... Consultation du manuel...",
    "Il fait noir. Vous risquez d'être mangé par une grue.",
    "Chargement du message amusant...",
    "Il est 22h. Savez-vous où sont vos enfants ?",
    "En attente que Daenerys prononce tous ses titres...",
    "N'hésitez pas à tourner sur votre chaise",
    "Qu'est-ce que c'est que ça ?",
    "format C: ...",
    "Oubliez que vous avez vu ce mot de passe que je viens de taper dans le chat...",
    "Qu'est-ce qu'il y a en dessous ?",
    "Votre ordinateur à un virus, son nom est Windows!",
    "Allez-y, retenez votre souffle et faites une planche d'ironman jusqu'à la fin du chargement",
    "Marre du spinner de chargement lent, achetez plus de RAM !",
    "Au secours, je suis piégé dans un chargeur !",
    "Quelle est la différence entre un hippopotame et un briquet ? L'un est très lourd, l'autre est un peu plus léger",
    "Veuillez patienter pendant que nous purgions les Decepticons pour vous. Oui, vous pourrez nous remercier plus tard !",
    "Chuck Norris a un jour uriné dans le réservoir d'essence d'un camion semi-remorque pour plaisanter... ce camion est maintenant connu sous le nom d'Optimus Prime.",
    "Chuck Norris ne porte pas de montre. C'EST lui qui décide de l'heure qu'il est.",
    "Minage de bitcoins en cours...",
    "Téléchargement de plus de RAM...",
    "Mise à jour vers Windows Vista...",
    "Suppression du dossier System32",
    "Cacher tous les ; dans votre code",
    "Alt-F4 accélère les choses.",
    "Initialisation de l'initialiseur...",
    "Quand avez-vous fait le ménage pour la dernière fois ici ?",
    "Optimisation de l'optimiseur...",
    "Dernier appel pour le bus de données ! Tout le monde à bord !",
    "Détection des autocollants swag en cours...",
    "Ne laissez jamais un ordinateur savoir que vous êtes pressé.",
    "Un ordinateur fera ce que vous lui dites de faire, mais cela peut être très différent de ce que vous aviez en tête.",
    "Il y a des choses que l'homme n'était pas censé connaître. Pour tout le reste, il y a Google.",
    "Unix est convivial pour l'utilisateur. Il est simplement très sélectif quant à ses amis.",
    "Entrain de charger du charbon dans le serveur",
    "Pousser des pixels...",
    "Et le temps qu'il fait, hein ?",
    "Construction d'un mur...",
    "Tout dans cet univers est soit une pomme de terre, soit pas une pomme de terre",
    "La gravité de votre problème est toujours inférieure à ce que vous attendiez.",
    "Mise à jour de l'outil de mise à jour...",
    "Téléchargement du téléchargeur...",
    "Débogage du débogueur...",
    "Lecture des conditions générales pour vous.",
    "Cookies digérés en cours de cuisson.",
    "Vivez longtemps et prospérez.",
    "Il n'y a pas de niveau de vache, mais il y a un niveau de chèvre !",
    "Suppression de tous vos contenus pornographiques cachés...",
    "En train de courir avec des ciseaux...",
    "Certainement pas un virus...",
    "Vous pouvez m'appeler Steve.",
    "Vous avez l'air d'une personne sympathique...",
    "Café chez moi, demain à 10h - ne soyez pas en retard !",
    "Travail, travail...",
    "Patience ! C'est difficile, vous savez...",
    "Découverte de nouvelles façons de vous faire patienter...",
    "Votre temps est très important pour nous. Veuillez patienter pendant que nous vous ignorons...",
    "Le temps file comme une flèche ; les mouches à fruits aiment les bananes",
    "Deux hommes sont entrés dans un bar ; le troisième a plongé...",
    "Alors... As-tu déjà vu mes photos de vacances ?",
    "Désolé, nous sommes occupés à tous les attraper, nous avons bientôt fini",
    "TODO : Insérer de la musique d'ascenseur",
    "Encore plus rapide que la mise à jour de Windows",
    "Astuce pour Composer : Attendre que les dépendances soient téléchargées est moins frustrant si vous ajoutez -vvv à votre commande.",
    "Veuillez patienter pendant que les minions font leur travail",
    "Recrutement de minions supplémentaires",
    "Faire le gros du travail",
    "Nous travaillons très dur.... Vraiment",
    "Réveil des minions",
    "Vous êtes le numéro 2843684714 dans la file d'attente",
    "Veuillez patienter pendant que nous servons d'autres clients...",
    "Notre plan premium est plus rapide",
    "Nourrissage des licornes...",
    "Rupture de la barrière du sous-espace",
    "Création d'une réaction anti-temps",
    "Convergence des impulsions de tachyons",
    "Contournement du contrôle de l'intégrateur matière-antimatière",
    "Ajustement de l'ensemble convertisseur de cristaux de dilithium",
    "Inversion de la polarité du bouclier",
    "Perturbation des champs de distorsion avec une rafale de gravitons inversés",
    "Haut, Haut, Bas, Bas, Gauche, Droite, Gauche, Droite, B, A.",
    "Aimes-tu mon animation de chargement ? Je l'ai faite moi-même",
    "Whoah, regarde ça aller !",
    "Non, je suis réveillé. Je me reposais juste les yeux.",
    "Un mississippi, deux mississippi...",
    "Ne paniquez pas... AHHHHH !",
    "Vérification que les Gnomes sont toujours petits.",
    "Cuisson de la crème glacée...",
    "Merci ChatGpt pour la traduction de cet écran de chargement.",
];

/* src\components\MainLoader.svelte generated by Svelte v3.59.1 */
const file$3 = "src\\components\\MainLoader.svelte";

function create_fragment$6(ctx) {
	let div3;
	let div0;
	let img;
	let img_src_value;
	let t0;
	let div1;
	let span0;
	let t1;
	let span1;
	let t2;
	let span2;
	let t3;
	let span3;
	let t4;
	let svg;
	let path;
	let t5;
	let div2;
	let span4;
	let t6;
	let div3_hidden_value;

	const block = {
		c: function create() {
			div3 = element("div");
			div0 = element("div");
			img = element("img");
			t0 = space();
			div1 = element("div");
			span0 = element("span");
			t1 = space();
			span1 = element("span");
			t2 = space();
			span2 = element("span");
			t3 = space();
			span3 = element("span");
			t4 = space();
			svg = svg_element("svg");
			path = svg_element("path");
			t5 = space();
			div2 = element("div");
			span4 = element("span");
			t6 = text("Veuillez patienter, ça charge ...");
			this.h();
		},
		l: function claim(nodes) {
			div3 = claim_element(nodes, "DIV", { class: true });
			var div3_nodes = children(div3);
			div0 = claim_element(div3_nodes, "DIV", { class: true });
			var div0_nodes = children(div0);
			img = claim_element(div0_nodes, "IMG", { src: true, alt: true });
			div0_nodes.forEach(detach_dev);
			t0 = claim_space(div3_nodes);
			div1 = claim_element(div3_nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			span0 = claim_element(div1_nodes, "SPAN", { class: true });
			children(span0).forEach(detach_dev);
			t1 = claim_space(div1_nodes);
			span1 = claim_element(div1_nodes, "SPAN", { class: true });
			children(span1).forEach(detach_dev);
			t2 = claim_space(div1_nodes);
			span2 = claim_element(div1_nodes, "SPAN", { class: true });
			children(span2).forEach(detach_dev);
			t3 = claim_space(div1_nodes);
			span3 = claim_element(div1_nodes, "SPAN", { class: true });
			children(span3).forEach(detach_dev);
			t4 = claim_space(div1_nodes);

			svg = claim_svg_element(div1_nodes, "svg", {
				version: true,
				xmlns: true,
				"xmlns:xlink": true,
				x: true,
				y: true,
				viewBox: true,
				fill: true,
				width: true,
				height: true,
				"enable-background": true,
				"xml:space": true
			});

			var svg_nodes = children(svg);
			path = claim_svg_element(svg_nodes, "path", { d: true });
			children(path).forEach(detach_dev);
			svg_nodes.forEach(detach_dev);
			div1_nodes.forEach(detach_dev);
			t5 = claim_space(div3_nodes);
			div2 = claim_element(div3_nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			span4 = claim_element(div2_nodes, "SPAN", { class: true });
			var span4_nodes = children(span4);
			t6 = claim_text(span4_nodes, "Veuillez patienter, ça charge ...");
			span4_nodes.forEach(detach_dev);
			div2_nodes.forEach(detach_dev);
			div3_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			if (!src_url_equal(img.src, img_src_value = "./assets/pictures/moviequiz.webp")) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "");
			add_location(img, file$3, 73, 8, 2125);
			attr_dev(div0, "class", "background");
			add_location(div0, file$3, 72, 4, 2091);
			attr_dev(span0, "class", "fluo-color");
			add_location(span0, file$3, 76, 8, 2224);
			attr_dev(span1, "class", "fluo-color");
			add_location(span1, file$3, 77, 8, 2261);
			attr_dev(span2, "class", "fluo-color");
			add_location(span2, file$3, 78, 8, 2298);
			attr_dev(span3, "class", "fluo-color");
			add_location(span3, file$3, 79, 8, 2335);
			attr_dev(path, "d", "M500,10C229.8,10,10,229.8,10,500c0,270.2,219.8,490,490,490c270.2,0,490-219.8,490-490C990,229.8,770.2,10,500,10z M500,943.3C255.5,943.3,56.7,744.5,56.7,500S255.5,56.7,500,56.7c244.4,0,443.3,198.9,443.3,443.3S744.5,943.3,500,943.3z M500,434.1c-36.4,0-65.9,29.5-65.9,65.9c0,36.4,29.5,65.9,65.9,65.9c36.4,0,65.9-29.5,65.9-65.9C565.9,463.6,536.4,434.1,500,434.1z M500,325.5c58.2,0,105.5-47.3,105.5-105.5c0-58.2-47.3-105.5-105.5-105.5c-58.2,0-105.5,47.3-105.5,105.5C394.5,278.2,441.8,325.5,500,325.5z M500,161.2c32.5,0,58.8,26.4,58.8,58.9c0,32.5-26.4,58.8-58.8,58.8c-32.5,0-58.9-26.4-58.9-58.8C441.1,187.5,467.5,161.2,500,161.2z M336.7,627.8c-58.2,0-105.5,47.3-105.5,105.5c0,58.2,47.3,105.5,105.5,105.5s105.5-47.3,105.5-105.5C442.2,675.1,394.9,627.8,336.7,627.8z M336.7,792.2c-32.5,0-58.8-26.4-58.8-58.8c0-32.5,26.4-58.9,58.8-58.9s58.8,26.4,58.8,58.9C395.5,765.8,369.1,792.2,336.7,792.2z M663.3,627.8c-58.2,0-105.5,47.3-105.5,105.5c0,58.2,47.3,105.5,105.5,105.5c58.2,0,105.5-47.3,105.5-105.5C768.8,675.1,721.5,627.8,663.3,627.8z M663.3,792.2c-32.5,0-58.9-26.4-58.9-58.8c0-32.5,26.4-58.9,58.9-58.9c32.5,0,58.8,26.4,58.8,58.9C722.2,765.8,695.8,792.2,663.3,792.2z M780,324.5c-58.2,0-105.5,47.3-105.5,105.5c0,58.2,47.3,105.5,105.5,105.5c58.2,0,105.5-47.3,105.5-105.5C885.5,371.9,838.2,324.5,780,324.5z M780,488.8c-32.5,0-58.8-26.4-58.8-58.8c0-32.5,26.4-58.9,58.8-58.9c32.5,0,58.8,26.4,58.8,58.9C838.8,462.5,812.5,488.8,780,488.8z M325.5,430c0-58.2-47.3-105.5-105.5-105.5c-58.2,0-105.5,47.3-105.5,105.5S161.8,535.5,220,535.5C278.2,535.5,325.5,488.2,325.5,430z M220,488.8c-32.5,0-58.9-26.4-58.9-58.8c0-32.5,26.4-58.8,58.9-58.8s58.8,26.4,58.8,58.9C278.8,462.5,252.5,488.8,220,488.8z");
			add_location(path, file$3, 93, 12, 2778);
			attr_dev(svg, "version", "1.1");
			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
			attr_dev(svg, "x", "0px");
			attr_dev(svg, "y", "0px");
			attr_dev(svg, "viewBox", "0 0 1000 1000");
			attr_dev(svg, "fill", "currentColor");
			attr_dev(svg, "width", "24");
			attr_dev(svg, "height", "24");
			attr_dev(svg, "enable-background", "new 0 0 1000 1000");
			attr_dev(svg, "xml:space", "preserve");
			add_location(svg, file$3, 80, 8, 2372);
			attr_dev(div1, "class", "fluo");
			add_location(div1, file$3, 75, 4, 2196);
			attr_dev(span4, "class", "typed");
			add_location(span4, file$3, 99, 8, 4560);
			attr_dev(div2, "class", "load-message");
			add_location(div2, file$3, 98, 4, 4524);
			attr_dev(div3, "class", "main-loader justify-content-evenly");
			div3.hidden = div3_hidden_value = !/*$loaderDisplayed*/ ctx[1];
			add_location(div3, file$3, 71, 0, 2010);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div3, anchor);
			append_hydration_dev(div3, div0);
			append_hydration_dev(div0, img);
			append_hydration_dev(div3, t0);
			append_hydration_dev(div3, div1);
			append_hydration_dev(div1, span0);
			append_hydration_dev(div1, t1);
			append_hydration_dev(div1, span1);
			append_hydration_dev(div1, t2);
			append_hydration_dev(div1, span2);
			append_hydration_dev(div1, t3);
			append_hydration_dev(div1, span3);
			append_hydration_dev(div1, t4);
			append_hydration_dev(div1, svg);
			append_hydration_dev(svg, path);
			append_hydration_dev(div3, t5);
			append_hydration_dev(div3, div2);
			append_hydration_dev(div2, span4);
			append_hydration_dev(span4, t6);
			/*span4_binding*/ ctx[5](span4);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*$loaderDisplayed*/ 2 && div3_hidden_value !== (div3_hidden_value = !/*$loaderDisplayed*/ ctx[1])) {
				prop_dev(div3, "hidden", div3_hidden_value);
			}
		},
		i: noop$1,
		o: noop$1,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div3);
			/*span4_binding*/ ctx[5](null);
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
	let $loaderDisplayed;
	validate_store(loaderDisplayed, 'loaderDisplayed');
	component_subscribe($$self, loaderDisplayed, $$value => $$invalidate(1, $loaderDisplayed = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('MainLoader', slots, []);
	let { phrase = [], loop = false, speed = 20 } = $$props;
	let toType, typed, unsub, pleaseStop;

	onMount(() => {
		if (!isArray(phrase)) {
			$$invalidate(2, phrase = [phrase]);
		}

		if (isEmpty(phrase)) {
			for (let i = 0; i < 15; i++) {
				phrase.push(fr[Math.floor(Math.random() * fr.length)]);
			}

			phrase.push(toType.innerText);
		}

		const stop = () => {
			if (pleaseStop) {
				if (!typed.typingComplete) {
					typed.stop();
				}

				setTimeout(
					() => {
						NoScroll.disable(false).then(() => {
							set_store_value(loaderDisplayed, $loaderDisplayed = pleaseStop = false, $loaderDisplayed);
							scrollTo(0, 0);
						});
					},
					1200
				);
			}
		};

		typed = new i(toType,
		{
				strings: phrase,
				typeSpeed: speed,
				backSpeed: Math.round(speed / 6),
				loop,
				loopCount: 5,
				onStringTyped: stop,
				onComplete: stop
			});

		unsub = loading.subscribe(value => {
			if (false === (pleaseStop = !value)) {
				set_store_value(loaderDisplayed, $loaderDisplayed = true, $loaderDisplayed);
				NoScroll.enable(false);
				typed.start();
			} else if (typed.typingComplete) {
				stop();
			}
		});
	});

	onDestroy(() => {
		unsub();
		typed.destroy();
	});

	const writable_props = ['phrase', 'loop', 'speed'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MainLoader> was created with unknown prop '${key}'`);
	});

	function span4_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			toType = $$value;
			$$invalidate(0, toType);
		});
	}

	$$self.$$set = $$props => {
		if ('phrase' in $$props) $$invalidate(2, phrase = $$props.phrase);
		if ('loop' in $$props) $$invalidate(3, loop = $$props.loop);
		if ('speed' in $$props) $$invalidate(4, speed = $$props.speed);
	};

	$$self.$capture_state = () => ({
		onDestroy,
		onMount,
		Typed: i,
		isArray,
		isEmpty,
		loading,
		loaderDisplayed,
		messages: fr,
		NoScroll,
		phrase,
		loop,
		speed,
		toType,
		typed,
		unsub,
		pleaseStop,
		$loaderDisplayed
	});

	$$self.$inject_state = $$props => {
		if ('phrase' in $$props) $$invalidate(2, phrase = $$props.phrase);
		if ('loop' in $$props) $$invalidate(3, loop = $$props.loop);
		if ('speed' in $$props) $$invalidate(4, speed = $$props.speed);
		if ('toType' in $$props) $$invalidate(0, toType = $$props.toType);
		if ('typed' in $$props) typed = $$props.typed;
		if ('unsub' in $$props) unsub = $$props.unsub;
		if ('pleaseStop' in $$props) pleaseStop = $$props.pleaseStop;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [toType, $loaderDisplayed, phrase, loop, speed, span4_binding];
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

/* src\pages\Home.svelte generated by Svelte v3.59.1 */

// (12:0) {#if $current}
function create_if_block$4(ctx) {
	let cover;
	let t0;
	let moviesnotfound;
	let t1;
	let seriesnotfound;
	let t2;
	let moviesfound;
	let t3;
	let seriesfound;
	let current;
	cover = new Cover({ $$inline: true });
	moviesnotfound = new MoviesNotFound({ $$inline: true });
	seriesnotfound = new SeriesNotFound({ $$inline: true });
	moviesfound = new MoviesFound({ $$inline: true });
	seriesfound = new SeriesFound({ $$inline: true });

	const block = {
		c: function create() {
			create_component(cover.$$.fragment);
			t0 = space();
			create_component(moviesnotfound.$$.fragment);
			t1 = space();
			create_component(seriesnotfound.$$.fragment);
			t2 = space();
			create_component(moviesfound.$$.fragment);
			t3 = space();
			create_component(seriesfound.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(cover.$$.fragment, nodes);
			t0 = claim_space(nodes);
			claim_component(moviesnotfound.$$.fragment, nodes);
			t1 = claim_space(nodes);
			claim_component(seriesnotfound.$$.fragment, nodes);
			t2 = claim_space(nodes);
			claim_component(moviesfound.$$.fragment, nodes);
			t3 = claim_space(nodes);
			claim_component(seriesfound.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(cover, target, anchor);
			insert_hydration_dev(target, t0, anchor);
			mount_component(moviesnotfound, target, anchor);
			insert_hydration_dev(target, t1, anchor);
			mount_component(seriesnotfound, target, anchor);
			insert_hydration_dev(target, t2, anchor);
			mount_component(moviesfound, target, anchor);
			insert_hydration_dev(target, t3, anchor);
			mount_component(seriesfound, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(cover.$$.fragment, local);
			transition_in(moviesnotfound.$$.fragment, local);
			transition_in(seriesnotfound.$$.fragment, local);
			transition_in(moviesfound.$$.fragment, local);
			transition_in(seriesfound.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(cover.$$.fragment, local);
			transition_out(moviesnotfound.$$.fragment, local);
			transition_out(seriesnotfound.$$.fragment, local);
			transition_out(moviesfound.$$.fragment, local);
			transition_out(seriesfound.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(cover, detaching);
			if (detaching) detach_dev(t0);
			destroy_component(moviesnotfound, detaching);
			if (detaching) detach_dev(t1);
			destroy_component(seriesnotfound, detaching);
			if (detaching) detach_dev(t2);
			destroy_component(moviesfound, detaching);
			if (detaching) detach_dev(t3);
			destroy_component(seriesfound, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$4.name,
		type: "if",
		source: "(12:0) {#if $current}",
		ctx
	});

	return block;
}

function create_fragment$5(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*$current*/ ctx[0] && create_if_block$4(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_hydration_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*$current*/ ctx[0]) {
				if (if_block) {
					if (dirty & /*$current*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$4(ctx);
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
		id: create_fragment$5.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$5($$self, $$props, $$invalidate) {
	let $current;
	validate_store(current, 'current');
	component_subscribe($$self, current, $$value => $$invalidate(0, $current = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Home', slots, []);
	set_store_value(current, $current = getLastFound(), $current);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		MoviesNotFound,
		current,
		getLastFound,
		Cover,
		MoviesFound,
		SeriesNotFound,
		SeriesFound,
		$current
	});

	return [$current];
}

class Home extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$5, create_fragment$5, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Home",
			options,
			id: create_fragment$5.name
		});
	}
}

function ElementFinder(
    /** @type {string} */ selector,
    /** @type {function} */ fn,
    once = false,
    /** @type {HTMLElement|undefined} */ root
)
{


    if (!isValidSelector(selector))
    {
        throw new TypeError("Invalid selector");
    }

    if (!isFunction(fn))
    {
        throw new TypeError('fn is not a Function');
    }

    root ??= document$1.body;

    if (!isElement$1(root))
    {
        throw new TypeError('root is not an Element');
    }



    const
        matches = new Set(),
        controller = new AbortController(),
        signal = controller.signal,
        watcher = () =>
        {

            if (signal.aborted)
            {
                return;
            }

            for (let target of [...root.querySelectorAll(selector)])
            {
                if (signal.aborted)
                {
                    return;
                }

                // aborted inside the loop
                if (matches.has(target))
                {
                    continue;
                }
                matches.add(target);

                // non blocking
                runAsync(fn, target);
                if (once)
                {
                    controller.abort();
                    return;
                }
            }
        };


    signal.onabort = () =>
    {
        if (typeof observer !== 'undefined')
        {
            observer.disconnect();
        }
    };


    const observer = new MutationObserver(watcher);

    // we make an initial instant scan
    watcher();
    if (!signal.aborted)
    {
        // we use all mutations to trigger a scan
        observer.observe(root, {
            attributes: true, childList: true, subtree: true
        });
    }

    return () =>
    {
        if (!signal.aborted)
        {
            controller.abort();
        }
    };

}

ElementFinder.findOne = (selector, fn, root) =>
{
    return ElementFinder(selector, fn, true, root);
};

function autoLoadAlternatives(extension = '.png')
{
    if (!extension.startsWith("."))
    {
        extension = '.' + extension;
    }


    ElementFinder('img[src$=".webp"]', img =>
    {
        emitter(img).on('load', () =>
        {
            img.classList.remove('img-loading');
        }).one('error', () =>
        {

            img.classList.add('img-loading');

            if (img.dataset.src)
            {
                img.src = img.dataset.src;
            } else
            {
                img.src = img.src.replace(/\.webp$/, extension);
            }

        });
    });
}

/* src\components\RouteRedirect.svelte generated by Svelte v3.59.1 */

// (36:0) {#if error}
function create_if_block$3(ctx) {
	let notfound;
	let current;
	notfound = new NotFound({ $$inline: true });

	const block = {
		c: function create() {
			create_component(notfound.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(notfound.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(notfound, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(notfound.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(notfound.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(notfound, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$3.name,
		type: "if",
		source: "(36:0) {#if error}",
		ctx
	});

	return block;
}

function create_fragment$4(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*error*/ ctx[0] && create_if_block$3(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_hydration_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*error*/ ctx[0]) {
				if (if_block) {
					if (dirty & /*error*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$3(ctx);
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
		id: create_fragment$4.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$4($$self, $$props, $$invalidate) {
	let $loc;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('RouteRedirect', slots, []);
	const loc = useLocation(), navigate = useNavigate();
	validate_store(loc, 'loc');
	component_subscribe($$self, loc, value => $$invalidate(2, $loc = value));
	let error = false;

	function redirect() {
		const mediatype = MediaType.cases().find(item => item.route === $loc.pathname);

		if (mediatype instanceof MediaType) {
			const id = String(getRandom(mediatype.notFound, 1)[0]?.id ?? "");

			if (!isEmpty(id)) {
				return navigate(id, { replace: true });
			}
		}

		$$invalidate(0, error = true);
	}

	onMount(() => {
		redirect();
	});

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RouteRedirect> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		onMount,
		useLocation,
		useNavigate,
		MediaType,
		getRandom,
		isEmpty,
		NotFound,
		loc,
		navigate,
		error,
		redirect,
		$loc
	});

	$$self.$inject_state = $$props => {
		if ('error' in $$props) $$invalidate(0, error = $$props.error);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [error, loc];
}

class RouteRedirect extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$4, create_fragment$4, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "RouteRedirect",
			options,
			id: create_fragment$4.name
		});
	}
}

/* src\pages\All.svelte generated by Svelte v3.59.1 */

// (26:0) {:else}
function create_else_block(ctx) {
	let notfound;
	let current;
	notfound = new NotFound({ $$inline: true });

	const block = {
		c: function create() {
			create_component(notfound.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(notfound.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(notfound, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(notfound.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(notfound.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(notfound, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(26:0) {:else}",
		ctx
	});

	return block;
}

// (17:0) {#if $current}
function create_if_block$2(ctx) {
	let cover;
	let t0;
	let gameform;
	let t1;
	let moviesnotfound;
	let t2;
	let seriesnotfound;
	let t3;
	let moviesfound;
	let t4;
	let seriesfound;
	let current;

	cover = new Cover({
			props: {
				$$slots: { default: [create_default_slot$1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	gameform = new GameForm({ $$inline: true });
	moviesnotfound = new MoviesNotFound({ $$inline: true });
	seriesnotfound = new SeriesNotFound({ $$inline: true });
	moviesfound = new MoviesFound({ $$inline: true });
	seriesfound = new SeriesFound({ $$inline: true });

	const block = {
		c: function create() {
			create_component(cover.$$.fragment);
			t0 = space();
			create_component(gameform.$$.fragment);
			t1 = space();
			create_component(moviesnotfound.$$.fragment);
			t2 = space();
			create_component(seriesnotfound.$$.fragment);
			t3 = space();
			create_component(moviesfound.$$.fragment);
			t4 = space();
			create_component(seriesfound.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(cover.$$.fragment, nodes);
			t0 = claim_space(nodes);
			claim_component(gameform.$$.fragment, nodes);
			t1 = claim_space(nodes);
			claim_component(moviesnotfound.$$.fragment, nodes);
			t2 = claim_space(nodes);
			claim_component(seriesnotfound.$$.fragment, nodes);
			t3 = claim_space(nodes);
			claim_component(moviesfound.$$.fragment, nodes);
			t4 = claim_space(nodes);
			claim_component(seriesfound.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(cover, target, anchor);
			insert_hydration_dev(target, t0, anchor);
			mount_component(gameform, target, anchor);
			insert_hydration_dev(target, t1, anchor);
			mount_component(moviesnotfound, target, anchor);
			insert_hydration_dev(target, t2, anchor);
			mount_component(seriesnotfound, target, anchor);
			insert_hydration_dev(target, t3, anchor);
			mount_component(moviesfound, target, anchor);
			insert_hydration_dev(target, t4, anchor);
			mount_component(seriesfound, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(cover.$$.fragment, local);
			transition_in(gameform.$$.fragment, local);
			transition_in(moviesnotfound.$$.fragment, local);
			transition_in(seriesnotfound.$$.fragment, local);
			transition_in(moviesfound.$$.fragment, local);
			transition_in(seriesfound.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(cover.$$.fragment, local);
			transition_out(gameform.$$.fragment, local);
			transition_out(moviesnotfound.$$.fragment, local);
			transition_out(seriesnotfound.$$.fragment, local);
			transition_out(moviesfound.$$.fragment, local);
			transition_out(seriesfound.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(cover, detaching);
			if (detaching) detach_dev(t0);
			destroy_component(gameform, detaching);
			if (detaching) detach_dev(t1);
			destroy_component(moviesnotfound, detaching);
			if (detaching) detach_dev(t2);
			destroy_component(seriesnotfound, detaching);
			if (detaching) detach_dev(t3);
			destroy_component(moviesfound, detaching);
			if (detaching) detach_dev(t4);
			destroy_component(seriesfound, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$2.name,
		type: "if",
		source: "(17:0) {#if $current}",
		ctx
	});

	return block;
}

// (18:4) <Cover>
function create_default_slot$1(ctx) {
	let notify;
	let current;
	notify = new Notify({ $$inline: true });

	const block = {
		c: function create() {
			create_component(notify.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(notify.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(notify, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(notify.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(notify.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(notify, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$1.name,
		type: "slot",
		source: "(18:4) <Cover>",
		ctx
	});

	return block;
}

function create_fragment$3(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block$2, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*$current*/ ctx[0]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_hydration_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index !== previous_block_index) {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
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
		id: create_fragment$3.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$3($$self, $$props, $$invalidate) {
	let $params;
	let $current;
	validate_store(current, 'current');
	component_subscribe($$self, current, $$value => $$invalidate(0, $current = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('All', slots, []);
	const params = useParams();
	validate_store(params, 'params');
	component_subscribe($$self, params, value => $$invalidate(2, $params = value));
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<All> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		useParams,
		current,
		getEntry,
		decode,
		Cover,
		GameForm,
		Notify,
		NotFound,
		MoviesNotFound,
		SeriesNotFound,
		MoviesFound,
		SeriesFound,
		params,
		$params,
		$current
	});

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$params*/ 4) {
			set_store_value(current, $current = getEntry(decode($params.id)), $current);
		}
	};

	return [$current, params, $params];
}

class All extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$3, create_fragment$3, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "All",
			options,
			id: create_fragment$3.name
		});
	}
}

/* src\components\Player.svelte generated by Svelte v3.59.1 */
const file$2 = "src\\components\\Player.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[7] = list[i];
	child_ctx[8] = list;
	child_ctx[9] = i;
	return child_ctx;
}

// (28:4) {#each SoundTrack.cases() as item}
function create_each_block(ctx) {
	let audio;
	let audio_src_value;
	let audio_id_value;
	let each_value = /*each_value*/ ctx[8];
	let item_index = /*item_index*/ ctx[9];
	let current;
	const default_slot_template = /*#slots*/ ctx[3].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);
	const assign_audio = () => /*audio_binding*/ ctx[4](audio, each_value, item_index);
	const unassign_audio = () => /*audio_binding*/ ctx[4](null, each_value, item_index);

	const block = {
		c: function create() {
			audio = element("audio");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			audio = claim_element(nodes, "AUDIO", { src: true, id: true });
			var audio_nodes = children(audio);
			if (default_slot) default_slot.l(audio_nodes);
			audio_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			if (!src_url_equal(audio.src, audio_src_value = /*item*/ ctx[7].url)) attr_dev(audio, "src", audio_src_value);
			attr_dev(audio, "id", audio_id_value = "player-for-" + /*item*/ ctx[7].value);
			add_location(audio, file$2, 28, 8, 715);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, audio, anchor);

			if (default_slot) {
				default_slot.m(audio, null);
			}

			assign_audio();
			current = true;
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[2],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
						null
					);
				}
			}

			if (!current || dirty & /*SoundTrack*/ 0 && !src_url_equal(audio.src, audio_src_value = /*item*/ ctx[7].url)) {
				attr_dev(audio, "src", audio_src_value);
			}

			if (!current || dirty & /*SoundTrack*/ 0 && audio_id_value !== (audio_id_value = "player-for-" + /*item*/ ctx[7].value)) {
				attr_dev(audio, "id", audio_id_value);
			}

			if (each_value !== /*each_value*/ ctx[8] || item_index !== /*item_index*/ ctx[9]) {
				unassign_audio();
				each_value = /*each_value*/ ctx[8];
				item_index = /*item_index*/ ctx[9];
				assign_audio();
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
			if (detaching) detach_dev(audio);
			if (default_slot) default_slot.d(detaching);
			unassign_audio();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(28:4) {#each SoundTrack.cases() as item}",
		ctx
	});

	return block;
}

function create_fragment$2(ctx) {
	let div0;
	let t0;
	let div4;
	let div3;
	let div1;
	let i0;
	let t1;
	let div2;
	let i1;
	let current;
	let mounted;
	let dispose;
	let each_value = SoundTrack.cases();
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t0 = space();
			div4 = element("div");
			div3 = element("div");
			div1 = element("div");
			i0 = element("i");
			t1 = space();
			div2 = element("div");
			i1 = element("i");
			this.h();
		},
		l: function claim(nodes) {
			div0 = claim_element(nodes, "DIV", { class: true });
			var div0_nodes = children(div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(div0_nodes);
			}

			div0_nodes.forEach(detach_dev);
			t0 = claim_space(nodes);
			div4 = claim_element(nodes, "DIV", { class: true });
			var div4_nodes = children(div4);
			div3 = claim_element(div4_nodes, "DIV", { class: true, "data-muted": true });
			var div3_nodes = children(div3);
			div1 = claim_element(div3_nodes, "DIV", { class: true, "data-muted": true });
			var div1_nodes = children(div1);
			i0 = claim_element(div1_nodes, "I", { class: true, size: true });
			children(i0).forEach(detach_dev);
			div1_nodes.forEach(detach_dev);
			t1 = claim_space(div3_nodes);
			div2 = claim_element(div3_nodes, "DIV", { class: true, "data-muted": true });
			var div2_nodes = children(div2);
			i1 = claim_element(div2_nodes, "I", { class: true, size: true });
			children(i1).forEach(detach_dev);
			div2_nodes.forEach(detach_dev);
			div3_nodes.forEach(detach_dev);
			div4_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div0, "class", "audio-player");
			add_location(div0, file$2, 26, 0, 641);
			attr_dev(i0, "class", "ng-volume-up");
			attr_dev(i0, "size", "28");
			add_location(i0, file$2, 45, 12, 1117);
			attr_dev(div1, "class", "mute-icon");
			attr_dev(div1, "data-muted", "false");
			add_location(div1, file$2, 44, 8, 1062);
			attr_dev(i1, "class", "ng-volume-off");
			attr_dev(i1, "size", "28");
			add_location(i1, file$2, 48, 12, 1231);
			attr_dev(div2, "class", "mute-icon");
			attr_dev(div2, "data-muted", "true");
			add_location(div2, file$2, 47, 8, 1177);
			attr_dev(div3, "class", "mute-sound");
			attr_dev(div3, "data-muted", /*$muted*/ ctx[0]);
			add_location(div3, file$2, 38, 4, 926);
			attr_dev(div4, "class", "sound-controls");
			add_location(div4, file$2, 37, 0, 893);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div0, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div0, null);
				}
			}

			insert_hydration_dev(target, t0, anchor);
			insert_hydration_dev(target, div4, anchor);
			append_hydration_dev(div4, div3);
			append_hydration_dev(div3, div1);
			append_hydration_dev(div1, i0);
			append_hydration_dev(div3, t1);
			append_hydration_dev(div3, div2);
			append_hydration_dev(div2, i1);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(div3, "click", /*handleClick*/ ctx[1], false, false, false, false),
					listen_dev(div3, "keyup", /*handleClick*/ ctx[1], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*SoundTrack, $$scope*/ 4) {
				each_value = SoundTrack.cases();
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div0, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if (!current || dirty & /*$muted*/ 1) {
				attr_dev(div3, "data-muted", /*$muted*/ ctx[0]);
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div0);
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(div4);
			mounted = false;
			run_all(dispose);
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

const sounds = new Set();

function instance$2($$self, $$props, $$invalidate) {
	let $SessionStarted;
	let $playIntro;
	let $muted;
	validate_store(SessionStarted, 'SessionStarted');
	component_subscribe($$self, SessionStarted, $$value => $$invalidate(5, $SessionStarted = $$value));
	validate_store(playIntro, 'playIntro');
	component_subscribe($$self, playIntro, $$value => $$invalidate(6, $playIntro = $$value));
	validate_store(muted, 'muted');
	component_subscribe($$self, muted, $$value => $$invalidate(0, $muted = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Player', slots, ['default']);

	function handleClick() {
		set_store_value(muted, $muted = !$muted, $muted);
	}

	onDestroy(loaderDisplayed.subscribe(value => {
		if (false === value && !$SessionStarted) {
			set_store_value(playIntro, $playIntro = set_store_value(SessionStarted, $SessionStarted = true, $SessionStarted), $playIntro);
		}
	}));

	onDestroy(() => {
		sounds.clear();
	});

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Player> was created with unknown prop '${key}'`);
	});

	function audio_binding($$value, each_value, item_index) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			each_value[item_index].player = $$value;
		});
	}

	$$self.$$set = $$props => {
		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		onDestroy,
		onMount,
		SoundTrack,
		muted,
		playIntro,
		loaderDisplayed,
		SessionStarted,
		sounds,
		handleClick,
		$SessionStarted,
		$playIntro,
		$muted
	});

	return [$muted, handleClick, $$scope, slots, audio_binding];
}

class Player extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$2, create_fragment$2, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Player",
			options,
			id: create_fragment$2.name
		});
	}
}

/* src\components\Intro.svelte generated by Svelte v3.59.1 */

const { console: console_1 } = globals;
const file$1 = "src\\components\\Intro.svelte";

// (19:0) {#if $playIntro || force}
function create_if_block$1(ctx) {
	let div1;
	let div0;
	let img;
	let img_src_value;
	let div1_class_value;

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			img = element("img");
			this.h();
		},
		l: function claim(nodes) {
			div1 = claim_element(nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			div0 = claim_element(div1_nodes, "DIV", { class: true });
			var div0_nodes = children(div0);
			img = claim_element(div0_nodes, "IMG", { src: true, alt: true, class: true });
			div0_nodes.forEach(detach_dev);
			div1_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			if (!src_url_equal(img.src, img_src_value = "./assets/pictures/moviequiz.webp")) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "MovieQuiz");
			attr_dev(img, "class", "svelte-yet5by");
			add_location(img, file$1, 21, 12, 611);
			attr_dev(div0, "class", "logo-big svelte-yet5by");
			add_location(div0, file$1, 20, 8, 575);
			attr_dev(div1, "class", div1_class_value = "intro " + (/*animated*/ ctx[1] ? 'intro-animated' : '') + " svelte-yet5by");
			add_location(div1, file$1, 19, 4, 511);
		},
		m: function mount(target, anchor) {
			insert_hydration_dev(target, div1, anchor);
			append_hydration_dev(div1, div0);
			append_hydration_dev(div0, img);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*animated*/ 2 && div1_class_value !== (div1_class_value = "intro " + (/*animated*/ ctx[1] ? 'intro-animated' : '') + " svelte-yet5by")) {
				attr_dev(div1, "class", div1_class_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(19:0) {#if $playIntro || force}",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let if_block_anchor;
	let if_block = (/*$playIntro*/ ctx[2] || /*force*/ ctx[0]) && create_if_block$1(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_hydration_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*$playIntro*/ ctx[2] || /*force*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$1(ctx);
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
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$1($$self, $$props, $$invalidate) {
	let $playIntro;
	validate_store(playIntro, 'playIntro');
	component_subscribe($$self, playIntro, $$value => $$invalidate(2, $playIntro = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Intro', slots, []);
	let { force = false, animated = true } = $$props;

	onDestroy(playIntro.subscribe(value => {
		if (value === true) {
			setTimeout(
				() => {
					set_store_value(playIntro, $playIntro = false, $playIntro);
				},
				4200
			);

			SoundTrack.INTRO.play().catch(console.warn);
		}
	}));

	const writable_props = ['force', 'animated'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Intro> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('force' in $$props) $$invalidate(0, force = $$props.force);
		if ('animated' in $$props) $$invalidate(1, animated = $$props.animated);
	};

	$$self.$capture_state = () => ({
		onDestroy,
		SoundTrack,
		playIntro,
		force,
		animated,
		$playIntro
	});

	$$self.$inject_state = $$props => {
		if ('force' in $$props) $$invalidate(0, force = $$props.force);
		if ('animated' in $$props) $$invalidate(1, animated = $$props.animated);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [force, animated, $playIntro];
}

class Intro extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$1, create_fragment$1, safe_not_equal, { force: 0, animated: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Intro",
			options,
			id: create_fragment$1.name
		});
	}

	get force() {
		return this.$$.ctx[0];
	}

	set force(force) {
		this.$$set({ force });
		flush();
	}

	get animated() {
		return this.$$.ctx[1];
	}

	set animated(animated) {
		this.$$set({ animated });
		flush();
	}
}

/* src\App.svelte generated by Svelte v3.59.1 */
const file = "src\\App.svelte";

// (24:0) {#if $ready}
function create_if_block(ctx) {
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
			claim_component(router.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(router, target, anchor);
			current = true;
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
		id: create_if_block.name,
		type: "if",
		source: "(24:0) {#if $ready}",
		ctx
	});

	return block;
}

// (26:8) <Route path="intro">
function create_default_slot_10(ctx) {
	let intro;
	let current;

	intro = new Intro({
			props: { force: true, animated: false },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(intro.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(intro.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(intro, target, anchor);
			current = true;
		},
		p: noop$1,
		i: function intro$1(local) {
			if (current) return;
			transition_in(intro.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(intro.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(intro, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_10.name,
		type: "slot",
		source: "(26:8) <Route path=\\\"intro\\\">",
		ctx
	});

	return block;
}

// (31:12) <Route path="/">
function create_default_slot_9(ctx) {
	let home;
	let current;
	home = new Home({ $$inline: true });

	const block = {
		c: function create() {
			create_component(home.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(home.$$.fragment, nodes);
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
		id: create_default_slot_9.name,
		type: "slot",
		source: "(31:12) <Route path=\\\"/\\\">",
		ctx
	});

	return block;
}

// (35:12) <Route path="tv/:id">
function create_default_slot_8(ctx) {
	let tv;
	let current;
	tv = new TV({ $$inline: true });

	const block = {
		c: function create() {
			create_component(tv.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(tv.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(tv, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(tv.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(tv.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(tv, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_8.name,
		type: "slot",
		source: "(35:12) <Route path=\\\"tv/:id\\\">",
		ctx
	});

	return block;
}

// (39:12) <Route path="tv">
function create_default_slot_7(ctx) {
	let routeredirect;
	let current;
	routeredirect = new RouteRedirect({ $$inline: true });

	const block = {
		c: function create() {
			create_component(routeredirect.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(routeredirect.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(routeredirect, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(routeredirect.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(routeredirect.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(routeredirect, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_7.name,
		type: "slot",
		source: "(39:12) <Route path=\\\"tv\\\">",
		ctx
	});

	return block;
}

// (43:12) <Route path="movies/:id">
function create_default_slot_6(ctx) {
	let movie;
	let current;
	movie = new Movie({ $$inline: true });

	const block = {
		c: function create() {
			create_component(movie.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(movie.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(movie, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(movie.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(movie.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(movie, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_6.name,
		type: "slot",
		source: "(43:12) <Route path=\\\"movies/:id\\\">",
		ctx
	});

	return block;
}

// (46:12) <Route path="movies">
function create_default_slot_5(ctx) {
	let routeredirect;
	let current;
	routeredirect = new RouteRedirect({ $$inline: true });

	const block = {
		c: function create() {
			create_component(routeredirect.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(routeredirect.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(routeredirect, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(routeredirect.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(routeredirect.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(routeredirect, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_5.name,
		type: "slot",
		source: "(46:12) <Route path=\\\"movies\\\">",
		ctx
	});

	return block;
}

// (50:12) <Route path="all/:id">
function create_default_slot_4(ctx) {
	let all;
	let current;
	all = new All({ $$inline: true });

	const block = {
		c: function create() {
			create_component(all.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(all.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(all, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(all.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(all.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(all, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_4.name,
		type: "slot",
		source: "(50:12) <Route path=\\\"all/:id\\\">",
		ctx
	});

	return block;
}

// (53:12) <Route path="all">
function create_default_slot_3(ctx) {
	let routeredirect;
	let current;
	routeredirect = new RouteRedirect({ $$inline: true });

	const block = {
		c: function create() {
			create_component(routeredirect.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(routeredirect.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(routeredirect, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(routeredirect.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(routeredirect.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(routeredirect, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_3.name,
		type: "slot",
		source: "(53:12) <Route path=\\\"all\\\">",
		ctx
	});

	return block;
}

// (56:12) <Route path="details/:id">
function create_default_slot_2(ctx) {
	let details;
	let current;
	details = new Details({ $$inline: true });

	const block = {
		c: function create() {
			create_component(details.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(details.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(details, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(details.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(details.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(details, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2.name,
		type: "slot",
		source: "(56:12) <Route path=\\\"details/:id\\\">",
		ctx
	});

	return block;
}

// (60:12) <Route path="*">
function create_default_slot_1(ctx) {
	let notfound;
	let current;
	notfound = new NotFound({ $$inline: true });

	const block = {
		c: function create() {
			create_component(notfound.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(notfound.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(notfound, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(notfound.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(notfound.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(notfound, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(60:12) <Route path=\\\"*\\\">",
		ctx
	});

	return block;
}

// (25:4) <Router>
function create_default_slot(ctx) {
	let route0;
	let t0;
	let header;
	let t1;
	let main;
	let route1;
	let t2;
	let route2;
	let t3;
	let route3;
	let t4;
	let route4;
	let t5;
	let route5;
	let t6;
	let route6;
	let t7;
	let route7;
	let t8;
	let route8;
	let t9;
	let route9;
	let t10;
	let player;
	let t11;
	let intro;
	let t12;
	let footer;
	let current;

	route0 = new Route$1({
			props: {
				path: "intro",
				$$slots: { default: [create_default_slot_10] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	header = new Header({ $$inline: true });

	route1 = new Route$1({
			props: {
				path: "/",
				$$slots: { default: [create_default_slot_9] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	route2 = new Route$1({
			props: {
				path: "tv/:id",
				$$slots: { default: [create_default_slot_8] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	route3 = new Route$1({
			props: {
				path: "tv",
				$$slots: { default: [create_default_slot_7] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	route4 = new Route$1({
			props: {
				path: "movies/:id",
				$$slots: { default: [create_default_slot_6] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	route5 = new Route$1({
			props: {
				path: "movies",
				$$slots: { default: [create_default_slot_5] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	route6 = new Route$1({
			props: {
				path: "all/:id",
				$$slots: { default: [create_default_slot_4] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	route7 = new Route$1({
			props: {
				path: "all",
				$$slots: { default: [create_default_slot_3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	route8 = new Route$1({
			props: {
				path: "details/:id",
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	route9 = new Route$1({
			props: {
				path: "*",
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	player = new Player({ $$inline: true });
	intro = new Intro({ $$inline: true });
	footer = new Footer({ $$inline: true });

	const block = {
		c: function create() {
			create_component(route0.$$.fragment);
			t0 = space();
			create_component(header.$$.fragment);
			t1 = space();
			main = element("main");
			create_component(route1.$$.fragment);
			t2 = space();
			create_component(route2.$$.fragment);
			t3 = space();
			create_component(route3.$$.fragment);
			t4 = space();
			create_component(route4.$$.fragment);
			t5 = space();
			create_component(route5.$$.fragment);
			t6 = space();
			create_component(route6.$$.fragment);
			t7 = space();
			create_component(route7.$$.fragment);
			t8 = space();
			create_component(route8.$$.fragment);
			t9 = space();
			create_component(route9.$$.fragment);
			t10 = space();
			create_component(player.$$.fragment);
			t11 = space();
			create_component(intro.$$.fragment);
			t12 = space();
			create_component(footer.$$.fragment);
			this.h();
		},
		l: function claim(nodes) {
			claim_component(route0.$$.fragment, nodes);
			t0 = claim_space(nodes);
			claim_component(header.$$.fragment, nodes);
			t1 = claim_space(nodes);
			main = claim_element(nodes, "MAIN", { id: true });
			var main_nodes = children(main);
			claim_component(route1.$$.fragment, main_nodes);
			t2 = claim_space(main_nodes);
			claim_component(route2.$$.fragment, main_nodes);
			t3 = claim_space(main_nodes);
			claim_component(route3.$$.fragment, main_nodes);
			t4 = claim_space(main_nodes);
			claim_component(route4.$$.fragment, main_nodes);
			t5 = claim_space(main_nodes);
			claim_component(route5.$$.fragment, main_nodes);
			t6 = claim_space(main_nodes);
			claim_component(route6.$$.fragment, main_nodes);
			t7 = claim_space(main_nodes);
			claim_component(route7.$$.fragment, main_nodes);
			t8 = claim_space(main_nodes);
			claim_component(route8.$$.fragment, main_nodes);
			t9 = claim_space(main_nodes);
			claim_component(route9.$$.fragment, main_nodes);
			main_nodes.forEach(detach_dev);
			t10 = claim_space(nodes);
			claim_component(player.$$.fragment, nodes);
			t11 = claim_space(nodes);
			claim_component(intro.$$.fragment, nodes);
			t12 = claim_space(nodes);
			claim_component(footer.$$.fragment, nodes);
			this.h();
		},
		h: function hydrate() {
			attr_dev(main, "id", "app");
			add_location(main, file, 29, 8, 1098);
		},
		m: function mount(target, anchor) {
			mount_component(route0, target, anchor);
			insert_hydration_dev(target, t0, anchor);
			mount_component(header, target, anchor);
			insert_hydration_dev(target, t1, anchor);
			insert_hydration_dev(target, main, anchor);
			mount_component(route1, main, null);
			append_hydration_dev(main, t2);
			mount_component(route2, main, null);
			append_hydration_dev(main, t3);
			mount_component(route3, main, null);
			append_hydration_dev(main, t4);
			mount_component(route4, main, null);
			append_hydration_dev(main, t5);
			mount_component(route5, main, null);
			append_hydration_dev(main, t6);
			mount_component(route6, main, null);
			append_hydration_dev(main, t7);
			mount_component(route7, main, null);
			append_hydration_dev(main, t8);
			mount_component(route8, main, null);
			append_hydration_dev(main, t9);
			mount_component(route9, main, null);
			insert_hydration_dev(target, t10, anchor);
			mount_component(player, target, anchor);
			insert_hydration_dev(target, t11, anchor);
			mount_component(intro, target, anchor);
			insert_hydration_dev(target, t12, anchor);
			mount_component(footer, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const route0_changes = {};

			if (dirty & /*$$scope*/ 2) {
				route0_changes.$$scope = { dirty, ctx };
			}

			route0.$set(route0_changes);
			const route1_changes = {};

			if (dirty & /*$$scope*/ 2) {
				route1_changes.$$scope = { dirty, ctx };
			}

			route1.$set(route1_changes);
			const route2_changes = {};

			if (dirty & /*$$scope*/ 2) {
				route2_changes.$$scope = { dirty, ctx };
			}

			route2.$set(route2_changes);
			const route3_changes = {};

			if (dirty & /*$$scope*/ 2) {
				route3_changes.$$scope = { dirty, ctx };
			}

			route3.$set(route3_changes);
			const route4_changes = {};

			if (dirty & /*$$scope*/ 2) {
				route4_changes.$$scope = { dirty, ctx };
			}

			route4.$set(route4_changes);
			const route5_changes = {};

			if (dirty & /*$$scope*/ 2) {
				route5_changes.$$scope = { dirty, ctx };
			}

			route5.$set(route5_changes);
			const route6_changes = {};

			if (dirty & /*$$scope*/ 2) {
				route6_changes.$$scope = { dirty, ctx };
			}

			route6.$set(route6_changes);
			const route7_changes = {};

			if (dirty & /*$$scope*/ 2) {
				route7_changes.$$scope = { dirty, ctx };
			}

			route7.$set(route7_changes);
			const route8_changes = {};

			if (dirty & /*$$scope*/ 2) {
				route8_changes.$$scope = { dirty, ctx };
			}

			route8.$set(route8_changes);
			const route9_changes = {};

			if (dirty & /*$$scope*/ 2) {
				route9_changes.$$scope = { dirty, ctx };
			}

			route9.$set(route9_changes);
		},
		i: function intro$1(local) {
			if (current) return;
			transition_in(route0.$$.fragment, local);
			transition_in(header.$$.fragment, local);
			transition_in(route1.$$.fragment, local);
			transition_in(route2.$$.fragment, local);
			transition_in(route3.$$.fragment, local);
			transition_in(route4.$$.fragment, local);
			transition_in(route5.$$.fragment, local);
			transition_in(route6.$$.fragment, local);
			transition_in(route7.$$.fragment, local);
			transition_in(route8.$$.fragment, local);
			transition_in(route9.$$.fragment, local);
			transition_in(player.$$.fragment, local);
			transition_in(intro.$$.fragment, local);
			transition_in(footer.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(route0.$$.fragment, local);
			transition_out(header.$$.fragment, local);
			transition_out(route1.$$.fragment, local);
			transition_out(route2.$$.fragment, local);
			transition_out(route3.$$.fragment, local);
			transition_out(route4.$$.fragment, local);
			transition_out(route5.$$.fragment, local);
			transition_out(route6.$$.fragment, local);
			transition_out(route7.$$.fragment, local);
			transition_out(route8.$$.fragment, local);
			transition_out(route9.$$.fragment, local);
			transition_out(player.$$.fragment, local);
			transition_out(intro.$$.fragment, local);
			transition_out(footer.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(route0, detaching);
			if (detaching) detach_dev(t0);
			destroy_component(header, detaching);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(main);
			destroy_component(route1);
			destroy_component(route2);
			destroy_component(route3);
			destroy_component(route4);
			destroy_component(route5);
			destroy_component(route6);
			destroy_component(route7);
			destroy_component(route8);
			destroy_component(route9);
			if (detaching) detach_dev(t10);
			destroy_component(player, detaching);
			if (detaching) detach_dev(t11);
			destroy_component(intro, detaching);
			if (detaching) detach_dev(t12);
			destroy_component(footer, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(25:4) <Router>",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let t;
	let mainloader;
	let current;
	let if_block = /*$ready*/ ctx[0] && create_if_block(ctx);
	mainloader = new MainLoader({ $$inline: true });

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			t = space();
			create_component(mainloader.$$.fragment);
		},
		l: function claim(nodes) {
			if (if_block) if_block.l(nodes);
			t = claim_space(nodes);
			claim_component(mainloader.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_hydration_dev(target, t, anchor);
			mount_component(mainloader, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*$ready*/ ctx[0]) {
				if (if_block) {
					if (dirty & /*$ready*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(t.parentNode, t);
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
			transition_in(mainloader.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			transition_out(mainloader.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(t);
			destroy_component(mainloader, detaching);
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
	let $ready;
	validate_store(ready, 'ready');
	component_subscribe($$self, ready, $$value => $$invalidate(0, $ready = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('App', slots, []);
	autoLoadAlternatives();
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		TV,
		Movie,
		NotFound,
		Details,
		Router: Router$1,
		Route: Route$1,
		Header,
		Footer,
		MainLoader,
		Home,
		ready,
		autoLoadAlternatives,
		RouteRedirect,
		All,
		Player,
		Intro,
		$ready
	});

	return [$ready];
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
