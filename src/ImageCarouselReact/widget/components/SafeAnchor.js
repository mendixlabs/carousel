var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports", "ImageCarouselReact/lib/react"], function (require, exports, React) {
    "use strict";
    ;
    var SafeAnchor = (function (_super) {
        __extends(SafeAnchor, _super);
        function SafeAnchor(props, context) {
            _super.call(this, props, context);
            this.loggerNode = "SafeAnchor";
            logger.debug(this.loggerNode + " .constructor");
            this.handleClick = this.handleClick.bind(this);
        }
        SafeAnchor.prototype.render = function () {
            logger.debug(this.loggerNode + " .render");
            var _a = this.props, Component = _a.componentClass, disabled = _a.disabled;
            var props = {
                children: this.props.children ? this.props.children : null,
                className: this.props.className ? this.props.className : null,
                href: this.props.href ? this.props.href : null,
                onClick: this.props.onClick ? this.props.onClick : null,
                role: this.props.role ? this.props.role : null,
                style: this.props.style ? this.props.style : null,
            };
            if (this.isTrivialHref(props.href)) {
                props.role = props.role || "button";
                props.href = props.href || "";
            }
            if (disabled) {
                props.tabIndex = -1;
                props.style = Object.assign({}, props.style, { pointerEvents: "none" });
            }
            return (React.createElement(Component, __assign({}, props, {onClick: this.handleClick})));
        };
        SafeAnchor.prototype.handleClick = function (event) {
            logger.debug(this.loggerNode + " .handleClick");
            var _a = this.props, disabled = _a.disabled, href = _a.href, onClick = _a.onClick;
            if (disabled || this.isTrivialHref(href)) {
                event.preventDefault();
            }
            if (disabled) {
                event.stopPropagation();
                return;
            }
            if (onClick) {
                onClick(event);
            }
        };
        SafeAnchor.prototype.isTrivialHref = function (href) {
            logger.debug(this.loggerNode + " .isTrivialHref");
            return !href || href.trim() === "#";
        };
        SafeAnchor.defaultProps = {
            componentClass: "a",
            href: null,
            role: null,
        };
        return SafeAnchor;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SafeAnchor;
});
