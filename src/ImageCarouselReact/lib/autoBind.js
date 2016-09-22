define(["require", "exports"], function (require, exports) {
    "use strict";
    var wontBind = [
        'constructor',
        'render',
        'componentWillMount',
        'componentDidMount',
        'componentWillReceiveProps',
        'shouldComponentUpdate',
        'componentWillUpdate',
        'componentDidUpdate',
        'componentWillUnmount'
    ];
    var toBind = [];
    function autoBind(context) {
        if (context === undefined) {
            console.error('Autobind error: No context provided.');
            return;
        }
        var objPrototype = Object.getPrototypeOf(context);
        if (arguments.length > 1) {
            toBind = Array.prototype.slice.call(arguments, 1);
        }
        else {
            toBind = Object.getOwnPropertyNames(objPrototype);
        }
        toBind.forEach(function (method) {
            var descriptor = Object.getOwnPropertyDescriptor(objPrototype, method);
            if (descriptor === undefined) {
                console.warn("Autobind: \"" + method + "\" method not found in class.");
                return;
            }
            if (wontBind.indexOf(method) !== -1 || typeof descriptor.value !== 'function') {
                return;
            }
            Object.defineProperty(objPrototype, method, boundMethod(objPrototype, method, descriptor));
        });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = autoBind;
    function boundMethod(objPrototype, method, descriptor) {
        var fn = descriptor.value;
        return {
            configurable: true,
            get: function () {
                if (this === objPrototype || this.hasOwnProperty(method)) {
                    return fn;
                }
                var boundFn = fn.bind(this);
                Object.defineProperty(this, method, {
                    value: boundFn,
                    configurable: true,
                    writable: true,
                });
                return boundFn;
            }
        };
    }
});
