import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";

import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { Carousel, Image } from "./components/Carousel";

class CarouselDojo extends WidgetBase {
    // Properties from Mendix modeler
    staticImages: Image[];

    update(contextObject: mendix.lib.MxObject, callback?: Function) {
        render(createElement(Carousel, {
            contextGuid: contextObject ? contextObject.getGuid() : undefined,
            images: this.staticImages
        }), this.domNode);

        if (callback) callback();
    }

    uninitialize(): boolean {
        unmountComponentAtNode(this.domNode);

        return true;
    }
}

// Declare widget prototype the Dojo way
// Thanks to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/dojo/README.md
// tslint:disable : only-arrow-functions
dojoDeclare("com.mendix.widget.carousel.Carousel", [ WidgetBase ], function(Source: any) {
    const result: any = {};
    for (const property in Source.prototype) {
        if (property !== "constructor" && Source.prototype.hasOwnProperty(property)) {
            result[property] = Source.prototype[property];
        }
    }
    return result;
}(CarouselDojo));
