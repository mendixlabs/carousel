dojo.require("ImageCarouselReact.widget.ImageCarouselReact");
define(["dojo/_base/declare"], function (declare) {
    "use strict";
    return declare("ImageCarouselReact.widget.ImageCarouselReactNoContext", [ImageCarouselReact.widget.ImageCarouselReact], {
        requiresContext: false
    });
});
