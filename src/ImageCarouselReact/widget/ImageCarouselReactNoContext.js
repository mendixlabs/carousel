dojo.require("ImageCarouselReact.widget.ImageCarouselReact");
// why does require "ImageCarouselReact/widget/ImageCarouselReact" not working?
define(["dojo/_base/declare"], function (declare) {
    "use strict";
    return declare("ImageCarouselReact.widget.ImageCarouselReactNoContext", [ImageCarouselReact.widget.ImageCarouselReact], {
        requiresContext: false
    });
});