var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "ImageCarouselReact/lib/react", "ImageCarouselReact/lib/react-bootstrap"], function (require, exports, React, ReactBootstrap) {
    "use strict";
    var ImageCarousel = (function (_super) {
        __extends(ImageCarousel, _super);
        function ImageCarousel(props) {
            _super.call(this, props);
            this.carouselStyle = {
                height: this.height,
                width: this.width,
            };
            this.getFileUrl = this.getFileUrl.bind(this);
            this.successCallback = this.successCallback.bind(this);
        }
        ImageCarousel.prototype.componentWillUnmount = function () {
            logger.debug(this.props.widgetId + " .componentWillUnmount");
            this.callMicroflow(this.props.dataSourceMicroflow, this.successCallback);
        };
        ImageCarousel.prototype.callMicroflow = function (actionMF, successCallback, failureCallback) {
            var _this = this;
            logger.debug(this.id + ".callMicroflow");
            if (actionMF !== "") {
                mx.data.action({
                    callback: successCallback,
                    error: function (error) {
                        logger.error(_this.id + ": An error occurred while executing microflow: " + error);
                    },
                    params: {
                        actionname: actionMF,
                    },
                });
            }
        };
        ImageCarousel.prototype.successCallback = function (obj) {
            logger.debug(this.id + ": Microflow executed successfully");
            this.data = obj;
            this.mapCarouselData(this.data);
        };
        ImageCarousel.prototype.mapCarouselData = function (data) {
            var _this = this;
            return data.data.map(function (itemObj) {
                var caption = itemObj.get(_this.captionAttr);
                return (_this.CarouselItems = (React.createElement(ReactBootstrap.Carousel.Item, {onClick: function () { return _this.callMicroflow(_this.imageClick); }, key: _this.id + "_" + caption}, React.createElement("img", {style: _this.carouselStyle, alt: caption, src: _this.getFileUrl(itemObj.getGuid())}), React.createElement(ReactBootstrap.Carousel.Caption, null, React.createElement("h3", null, caption), React.createElement("p", null, itemObj.get(_this.descriptionAttr))))));
            });
        };
        ImageCarousel.prototype.getFileUrl = function (objectId) {
            logger.debug(this.id + "getFileUrl");
            var url;
            if (objectId) {
                url = "file?target=window&guid=" + objectId + "&csrfToken=" + mx.session.getCSRFToken() + "&time=" + Date.now();
            }
            logger.debug(url);
            return url;
        };
        ImageCarousel.prototype.render = function () {
            var _this = this;
            logger.debug(this.props.widgetId + ".render");
            return (React.createElement("div", {style: this.carouselStyle}, React.createElement(ReactBootstrap.Carousel, {controls: this.props.controls, indicators: this.props.indicators, interval: this.props.interval, pauseOnHover: this.props.pauseOnHover, slide: this.props.slide}, this.CarouselItems, React.createElement(ReactBootstrap.Carousel.Item, {onClick: function () { return _this.callMicroflow(_this.imageClick); }, key: this.id + "_" + caption}, React.createElement("img", {style: this.carouselStyle, alt: caption, src: "http://fullhdpictures.com/most-beautiful-landscape-wallpapers.html/city-landscape-wallpapers"}), React.createElement(ReactBootstrap.Carousel.Caption, null, React.createElement("h3", null, "Helo"), React.createElement("p", null, "Now"))))));
        };
        ImageCarousel.defaultProps = {
            controls: true,
            height: 350,
            indicators: true,
            interval: 5000,
            pauseOnHover: true,
            slide: true,
        };
        return ImageCarousel;
    }(React.Component));
    exports.ImageCarousel = ImageCarousel;
    ;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ImageCarousel;
});
//# sourceMappingURL=ImageCarousel.js.map