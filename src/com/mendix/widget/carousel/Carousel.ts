import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";

import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { Carousel } from "./components/Carousel";

export interface Image {
    imageUrl: string;
}

class CarouselDojo extends WidgetBase {
    // Properties from Mendix modeler
    staticImages?: Image[];
    interval: number;

    update(object: mendix.lib.MxObject, callback: Function) {
        render(createElement(Carousel, {
            images: this.staticImages,
            interval: this.interval
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
dojoDeclare("com.mendix.widget.carousel.Carousel", [ WidgetBase ], (function (Source: any) {
    let result: any = {};
    for (let i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
} (CarouselDojo)));
