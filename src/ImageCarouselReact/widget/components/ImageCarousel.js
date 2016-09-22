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
define(["require", "exports", "ImageCarouselReact/lib/react", "ImageCarouselReact/lib/react-bootstrap", "../../lib/autoBind"], function (require, exports, React, ReactBootstrap, autoBind_1) {
    "use strict";
    var ImageCarousel = (function (_super) {
        __extends(ImageCarousel, _super);
        function ImageCarousel(props) {
            _super.call(this, props);
            this.carouselStyle = {
                height: this.props.height,
                width: this.props.width,
            };
            autoBind_1.default(this);
            this.loaded = false;
            this.state = {
                data: [],
                dataStatic: [],
            };
        }
        ImageCarousel.prototype.componentWillMount = function () {
            logger.debug(this.props.widgetId + " .componentWillMount");
            this.getCarouselData();
        };
        ImageCarousel.prototype.render = function () {
            logger.debug(this.props.widgetId + ".render");
            var carouselProps = {
                controls: this.props.controls,
                indicators: this.props.indicators,
                interval: this.props.interval,
                pauseOnHover: this.props.pauseOnHover,
                slide: this.props.slide,
            };
            if (this.loaded || this.state.dataStatic.length > 0) {
                return (React.createElement("div", {style: this.carouselStyle}, React.createElement(ReactBootstrap.Carousel, __assign({}, carouselProps), this.mapCarouselData())));
            }
            else {
                return (React.createElement("div", {className: "glyphicon glyphicon-refresh glyphicon-spin", style: this.carouselStyle}, "Loading ..."));
            }
        };
        ImageCarousel.prototype.callMicroflow = function (actionMF, constraint, successCallback, failureCallback) {
            var _this = this;
            logger.debug(this.props.widgetId + ".callMicroflow");
            if (actionMF !== "") {
                mx.data.action({
                    callback: successCallback,
                    error: function (error) {
                        logger.error(_this.props.widgetId + ": An error occurred while executing microflow: " + error);
                    },
                    params: {
                        actionname: actionMF,
                    },
                });
            }
            else if (constraint !== "") {
                var xpathString = "//" + this.props.imageEntity + this.props.entityConstraint;
                mx.data.get({
                    callback: successCallback,
                    error: function (error) {
                        logger.error(_this.props.widgetId + ": An error occurred while retrieveing items: " + error);
                    },
                    xpath: xpathString,
                });
            }
        };
        ImageCarousel.prototype.successCallback = function (obj) {
            logger.debug(this.props.widgetId + ": Microflow executed successfully");
            if (typeof obj !== "undefined") {
                this.loaded = true;
                this.setState({ data: obj, dataStatic: [] });
            }
        };
        ImageCarousel.prototype.mapCarouselData = function () {
            var _this = this;
            logger.debug(this.props.widgetId + ".mapCarouselDatagrunt");
            var staticData = this.state.dataStatic;
            var data = this.state.data;
            var itemProps;
            if (staticData.length > 0) {
                return staticData.map(function (itemObj) {
                    var caption = itemObj.imgCaption;
                    itemProps = {
                        alt: caption,
                        caption: caption,
                        description: itemObj.imgdescription,
                        imgStyle: _this.carouselStyle,
                        key: _this.generateRandom(),
                        onClick: _this.onItemClick,
                        src: itemObj.picture,
                    };
                    return (_this.getCarouselItem(itemProps));
                });
            }
            else if (data.length > 0) {
                return data.map(function (itemObj) {
                    var props = _this.props;
                    var caption = itemObj.get(props.captionAttr);
                    itemProps = {
                        alt: caption,
                        caption: caption,
                        description: itemObj.get(props.descriptionAttr),
                        imgStyle: _this.carouselStyle,
                        key: itemObj.getGuid(),
                        onClick: _this.onItemClick,
                        src: _this.getFileUrl(itemObj.getGuid()),
                    };
                    return (_this.getCarouselItem(itemProps));
                });
            }
        };
        ImageCarousel.prototype.getCarouselItem = function (itemProps) {
            return (React.createElement(ReactBootstrap.Carousel.Item, {onClick: itemProps.onClick, key: itemProps.key}, React.createElement("img", {style: itemProps.imgStyle, alt: itemProps.alt, src: itemProps.src}), React.createElement(ReactBootstrap.Carousel.Caption, null, React.createElement("h3", null, itemProps.caption), React.createElement("p", null, itemProps.description))));
        };
        ImageCarousel.prototype.getFileUrl = function (objectId) {
            logger.debug(this.props.widgetId + "getFileUrl");
            var url;
            if (objectId) {
                url = "file?target=window&guid=" + objectId + "&csrfToken=" + mx.session.getCSRFToken() + "&time=" + Date.now();
            }
            logger.debug(url);
            return url;
        };
        ImageCarousel.prototype.onItemClick = function () {
            var _this = this;
            logger.debug(this.props.widgetId + ".onItemClick");
            if (this.props.imageClick) {
                this.callMicroflow(this.props.imageClick);
            }
            if (this.props.openPage) {
                mx.ui.openForm(this.props.openPage, {
                    callback: function () {
                        logger.debug(_this.props.widgetId + "Page opened Successfully");
                    }
                });
            }
        };
        ImageCarousel.prototype.getCarouselData = function () {
            logger.debug(this.props.widgetId + ".getCarouselData");
            if (this.props.entityConstraint) {
                this.callMicroflow("", this.props.entityConstraint, this.successCallback);
            }
            else if (this.props.dataSourceMicroflow) {
                this.callMicroflow(this.props.dataSourceMicroflow, "", this.successCallback);
            }
            else if (this.props.imgcollection) {
                if (this.props.imgcollection.length > 0) {
                    this.setState({ data: [], dataStatic: this.props.imgcollection });
                }
            }
        };
        ImageCarousel.prototype.generateRandom = function () {
            return Math.floor(Math.random() * 10000);
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
