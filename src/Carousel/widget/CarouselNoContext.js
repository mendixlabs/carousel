dojo.require("Carousel.widget.Carousel");
define(["dojo/_base/declare"], function (declare) {
    "use strict";
    return declare("Carousel.widget.CarouselNoContext", [Carousel.widget.Carousel], {
        requiresContext: false
    });
});
