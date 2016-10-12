// TODO: This module should be ElementChildren, and should use named exports.

import * as React from "Carousel/lib/react";

/**
 * Iterates through children that are typically specified as `props.children`,
 * but only maps over children that are "valid components".
 *
 * The mapFunction provided index will be normalised to the components mapped,
 * so an invalid component would not increase the index.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func.
 * @param {*} context Context for func.
 * @return {object} Object containing the ordered map of results.
 */
function map(children: React.ReactChildren, func: Function, context?: React.Component<{}, {}>) {
    let index = 0;

    return React.Children.map(children, child => {
        if (!React.isValidElement(child)) {
            return child;
        }

        return func.call(context, child, index++);
    });
}

/**
 * Iterates through children that are "valid components".
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child with the index reflecting the position relative to "valid components".
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func.
 * @param {*} context Context for context.
 */
function forEach(children: React.ReactChildren, func: Function, context?: React.Component<{}, {}>) {
    let index = 0;

    React.Children.forEach(children, child => {
        if (!React.isValidElement(child)) {
            return;
        }

        func.call(context, child, index++);
    });
}

/**
 * Count the number of "valid components" in the Children container.
 *
 * @param {?*} children Children tree container.
 * @returns {number}
 */
function count(children: React.ReactChildren) {
    let result = 0;

    React.Children.forEach(children, child => {
        if (!React.isValidElement(child)) {
            return;
        }

        ++result;
    });

    return result;
}

/**
 * Finds children that are typically specified as `props.children`,
 * but only iterates over children that are "valid components".
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child with the index reflecting the position relative to "valid components".
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func.
 * @param {*} context Context for func.
 * @returns {array} of children that meet the func return statement
 */
function filter(children: React.ReactChildren, func: Function, context: React.Component<{}, {}>) {
    let index = 0;
    let result: Array<React.ReactChild> = [];

    React.Children.forEach(children, child => {
        if (!React.isValidElement(child)) {
            return;
        }

        if (func.call(context, child, index++)) {
            result.push(child);
        }
    });

    return result;
}

function find(children: React.ReactChildren, func: Function, context?: React.Component<{}, {}>) {
    let index = 0;
    let result: React.ReactChild = undefined;

    React.Children.forEach(children, child => {
        if (result) {
            return;
        }
        if (!React.isValidElement(child)) {
            return;
        }

        if (func.call(context, child, index++)) {
            result = child;
        }
    });

    return result;
}

function every(children: React.ReactChildren, func: Function, context: React.Component<{}, {}>) {
    let index = 0;
    let result = true;

    React.Children.forEach(children, child => {
        if (!result) {
            return;
        }
        if (!React.isValidElement(child)) {
            return;
        }

        if (!func.call(context, child, index++)) {
            result = false;
        }
    });

    return result;
}

function some(children: React.ReactChildren, func: Function, context: React.Component<{}, {}>) {
    let index = 0;
    let result = false;

    React.Children.forEach(children, child => {
        if (result) {
            return;
        }
        if (!React.isValidElement(child)) {
            return;
        }

        if (func.call(context, child, index++)) {
            result = true;
        }
    });

    return result;
}

function toArray(children: React.ReactChildren) {
    const result: Array<React.ReactElement<any> | string | number> = [];

    React.Children.forEach(children, child => {
        if (!React.isValidElement(child)) {
            return;
        }

        result.push(child);
    });

    return result;
}

export default {
    map,
    forEach,
    count,
    find,
    filter,
    every,
    some,
    toArray,
};
