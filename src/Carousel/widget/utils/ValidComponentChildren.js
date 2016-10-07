define(["require", "exports", "Carousel/lib/react"], function (require, exports, React) {
    "use strict";
    function map(children, func, context) {
        var index = 0;
        return React.Children.map(children, function (child) {
            if (!React.isValidElement(child)) {
                return child;
            }
            return func.call(context, child, index++);
        });
    }
    function forEach(children, func, context) {
        var index = 0;
        React.Children.forEach(children, function (child) {
            if (!React.isValidElement(child)) {
                return;
            }
            func.call(context, child, index++);
        });
    }
    function count(children) {
        var result = 0;
        React.Children.forEach(children, function (child) {
            if (!React.isValidElement(child)) {
                return;
            }
            ++result;
        });
        return result;
    }
    function filter(children, func, context) {
        var index = 0;
        var result = [];
        React.Children.forEach(children, function (child) {
            if (!React.isValidElement(child)) {
                return;
            }
            if (func.call(context, child, index++)) {
                result.push(child);
            }
        });
        return result;
    }
    function find(children, func, context) {
        var index = 0;
        var result = undefined;
        React.Children.forEach(children, function (child) {
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
    function every(children, func, context) {
        var index = 0;
        var result = true;
        React.Children.forEach(children, function (child) {
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
    function some(children, func, context) {
        var index = 0;
        var result = false;
        React.Children.forEach(children, function (child) {
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
    function toArray(children) {
        var result = [];
        React.Children.forEach(children, function (child) {
            if (!React.isValidElement(child)) {
                return;
            }
            result.push(child);
        });
        return result;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        map: map,
        forEach: forEach,
        count: count,
        find: find,
        filter: filter,
        every: every,
        some: some,
        toArray: toArray,
    };
});
