import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";

import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { Image } from "./components/Carousel";
import CarouselContainer, { ClickOptions, DataSource } from "./components/CarouselContainer";

class Carousel extends WidgetBase {
    // Properties from Mendix modeler
    staticImages: Image[];
    dataSource: DataSource;
    dataSourceMicroflow: string;
    imagesEntity: string;
    entityConstraint: string;
    urlAttribute: string;
    onClickOptions: ClickOptions;
    onClickMicroflow: string;
    onClickForm: string;

    update(contextObject: mendix.lib.MxObject, callback?: () => void) {
        this.updateRendering(contextObject);

        if (callback) callback();
    }

    uninitialize(): boolean {
        unmountComponentAtNode(this.domNode);

        return true;
    }

    private updateRendering(contextObject: mendix.lib.MxObject) {
        render(createElement(CarouselContainer, {
            contextObject,
            dataSource: this.dataSource,
            dataSourceMicroflow: this.dataSourceMicroflow,
            entityConstraint: this.entityConstraint,
            imagesEntity: this.imagesEntity,
            onClickForm: this.onClickForm,
            onClickMicroflow: this.onClickMicroflow,
            onClickOptions: this.onClickOptions,
            staticImages: this.staticImages,
            urlAttribute: this.urlAttribute
        }), this.domNode);
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
}(Carousel));
