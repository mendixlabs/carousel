import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";

import { CarouselRenderer } from "./CarouselRenderer";

export interface StaticImage {
    imageUrl?: string;
}

export class Carousel extends WidgetBase {
    // Properties from Mendix modeler
    staticImages?: StaticImage[];

    // internal variables
    private renderer: CarouselRenderer;

    postCreate() {
        this.renderer = new CarouselRenderer();
    }

    update(object: mendix.lib.MxObject, callback: Function) {
        this.renderer.render({ images: this.staticImages }, this.domNode);

        callback();
    }

    uninitialize(): boolean {
        this.renderer.unmount();

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
} (Carousel)));
