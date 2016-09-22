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
define(["require", "exports", "dojo/_base/declare", "mxui/widget/_WidgetBase", "ImageCarouselReact/lib/react", "ImageCarouselReact/lib/react-dom", "./components/ImageCarousel"], function (require, exports, dojoDeclare, _WidgetBase, React, ReactDOM, ImageCarousel_1) {
    "use strict";
    var ImageCarouselStaticWrapper = (function (_super) {
        __extends(ImageCarouselStaticWrapper, _super);
        function ImageCarouselStaticWrapper(args, elem) {
            _super.call(this);
            return new dojoImageCarouselReact(args, elem);
        }
        ImageCarouselStaticWrapper.prototype.createProps = function () {
            return {
                controls: this.controls,
                height: this.height,
                imageClick: this.imageClick,
                imgcollection: this.imgcollection,
                indicators: this.indicators,
                interval: this.interval,
                openPage: this.openPage,
                pauseOnHover: this.pauseOnHover,
                slide: this.slide,
                width: this.width,
            };
        };
        ImageCarouselStaticWrapper.prototype.postCreate = function () {
            logger.debug(this.id + ".postCreate !");
            ReactDOM.render(React.createElement(ImageCarousel_1.default, __assign({widgetId: this.id}, this.createProps())), this.domNode);
        };
        return ImageCarouselStaticWrapper;
    }(_WidgetBase));
    exports.ImageCarouselStaticWrapper = ImageCarouselStaticWrapper;
    var dojoImageCarouselReact = dojoDeclare("ImageCarouselReact.widget.ImageCarouselStatic", [_WidgetBase], (function (Source) {
        var result = {};
        result.constructor = function () {
            logger.debug(this.id + ".constructor dojo");
        };
        for (var i in Source.prototype) {
            if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
                result[i] = Source.prototype[i];
            }
        }
        return result;
    }(ImageCarouselStaticWrapper)));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ImageCarouselStaticWrapper;
});
