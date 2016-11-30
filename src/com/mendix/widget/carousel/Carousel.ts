import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";

import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { Carousel, Image } from "./components/Carousel";

class CarouselDojo extends WidgetBase {
    // Properties from Mendix modeler
    staticImages?: Image[];

    private contextObject: mendix.lib.MxObject;

    update(contextObject: mendix.lib.MxObject, callback: Function) {
        this.contextObject = contextObject;

        render(createElement(Carousel, {
            contextForm: this.mxform,
            contextGuid: contextObject ? contextObject.getGuid() : null,
            images: this.staticImages
        }), this.domNode);

        callback();
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
    let result: any = {};
    for (let property in Source.prototype) {
        if (property !== "constructor" && Source.prototype.hasOwnProperty(property)) {
            result[property] = Source.prototype[property];
        }
    }
    return result;
}(CarouselDojo));
