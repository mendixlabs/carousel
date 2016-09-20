var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "ImageCarouselReact/lib/react"], function (require, exports, React) {
    "use strict";
    var ImageCarouselReact = (function (_super) {
        __extends(ImageCarouselReact, _super);
        function ImageCarouselReact(props) {
            _super.call(this, props);
            this.progressInterval = 100;
            this.hasCancelButton = false;
            this.state = {
                context: {},
            };
        }
        ImageCarouselReact.prototype.componentWillUnmount = function () {
            logger.debug(this.props.widgetId + " .componentWillUnmount");
        };
        ImageCarouselReact.prototype.render = function () {
            logger.debug(this.props.widgetId + ".render");
            return (React.createElement("div", null));
        };
        ImageCarouselReact.prototype.callMicroflow = function (callback) {
            logger.debug(this.props.widgetId + ".callMicroflow");
        };
        ImageCarouselReact.prototype.updateProgress = function () {
            logger.debug(this.props.widgetId + ".updateProgress");
        };
        ImageCarouselReact.defaultProps = {
            widgetId: "undefined",
        };
        return ImageCarouselReact;
    }(React.Component));
    exports.ImageCarouselReact = ImageCarouselReact;
    ;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ImageCarouselReact;
});
