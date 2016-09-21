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
                height: this.props.height,
                width: this.props.width,
            };
            this.getFileUrl = this.getFileUrl.bind(this);
            this.successCallback = this.successCallback.bind(this);
            this.mapCarouselData = this.mapCarouselData.bind(this);
            this.callMicroflow = this.callMicroflow.bind(this);
            this.getFileUrl = this.getFileUrl.bind(this);
            this.state = {
                data: [],
            };
        }
        ImageCarousel.prototype.componentWillMount = function () {
            logger.debug(this.props.widgetId + " .componentWillMount");
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
            if (typeof obj !== "undefined") {
                this.setState({ data: obj });
            }
        };
        ImageCarousel.prototype.mapCarouselData = function () {
            var _this = this;
            logger.debug(this.props.widgetId + ".mapCarouselDatagrunt");
            var props = this.props;
            var data = this.state.data;
            if (data.length > 0) {
                return data.map(function (itemObj) {
                    var caption = itemObj.get(props.captionAttr);
                    return (React.createElement(ReactBootstrap.Carousel.Item, {onClick: function () { return _this.callMicroflow(props.imageClick); }, key: _this.id + "_" + caption}, React.createElement("img", {style: _this.carouselStyle, alt: caption, src: _this.getFileUrl(itemObj.getGuid())}), React.createElement(ReactBootstrap.Carousel.Caption, null, React.createElement("h3", null, caption), React.createElement("p", null, itemObj.get(props.descriptionAttr)))));
                });
            }
            return (React.createElement("div", null, "Loading ..."));
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
            logger.debug(this.props.widgetId + ".render");
            return (React.createElement("div", {style: this.carouselStyle}, React.createElement(ReactBootstrap.Carousel, {controls: this.props.controls, indicators: this.props.indicators, interval: this.props.interval, pauseOnHover: this.props.pauseOnHover, slide: this.props.slide}, this.mapCarouselData())));
        };
        ImageCarousel.defaultProps = {
            controls: true,
            height: 350,
            indicators: true,
            interval: 5000,
            pauseOnHover: true,
            slide: true,
            width: 500,
        };
        return ImageCarousel;
    }(React.Component));
    exports.ImageCarousel = ImageCarousel;
    ;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ImageCarousel;
});
//# sourceMappingURL=ImageCarousel.js.map