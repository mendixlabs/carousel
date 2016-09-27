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
define(["require", "exports", "ImageCarouselReact/lib/classnames", "ImageCarouselReact/lib/react", "../utils/bootstrapUtils"], function (require, exports, classNames, React, bootstrapUtils_1) {
    "use strict";
    ;
    var Glyphicon = (function (_super) {
        __extends(Glyphicon, _super);
        function Glyphicon() {
            _super.apply(this, arguments);
            this.loggerNode = "Glyphicon";
        }
        Glyphicon.prototype.render = function () {
            logger.debug(this.loggerNode + " .render");
            var glyph = this.props.glyph;
            var props = this.props;
            var classes = Object.assign({}, bootstrapUtils_1.getClassSet(props.bsProps), (_a = {}, _a[bootstrapUtils_1.prefix(props.bsProps, glyph)] = true, _a));
            return (React.createElement("span", __assign({}, props.elementProps, {className: classNames(props.className, classes)})));
            var _a;
        };
        Glyphicon.defaultProps = {
            bsProps: {
                bsClass: "glyphicon",
            },
        };
        return Glyphicon;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Glyphicon;
});
