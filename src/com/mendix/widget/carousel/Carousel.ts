import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";

import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { Carousel, Image } from "./components/Carousel";
import { Alert } from "./components/Alert";
import { CarouselData, CarouselDataOptions, ClickOptions, DataSource } from "./CarouselData";

class CarouselDojo extends WidgetBase {
    // Properties from Mendix modeler
    staticImages: Image[];
    dataSource: DataSource;
    dataSourceMicroflow: string;
    imagesEntity: string;
    entityConstraint: string;
    onClickOptions: ClickOptions;
    onClickMicroflow: string;
    onClickForm: string;

    private contextObject: mendix.lib.MxObject;
    private dataHandler: CarouselData;

    postCreate() {
        const dataOptions: CarouselDataOptions = {
            dataSource: this.dataSource,
            dataSourceMicroflow: this.dataSourceMicroflow,
            entityConstraint: this.entityConstraint,
            imagesEntity: this.imagesEntity,
            onClickForm: this.onClickForm,
            onClickMicroflow: this.onClickMicroflow,
            onClickOptions: this.onClickOptions,
            staticImages: this.staticImages
        };
        this.dataHandler = new CarouselData(dataOptions, (alert, images) =>
            this.updateRendering(alert, images)
        );
    }

    update(contextObject: mendix.lib.MxObject, callback?: Function) {
        this.contextObject = contextObject;
        this.resetSubscriptions();
        this.dataHandler.setContext(contextObject).validateAndFetch();

        if (callback) callback();
    }

    uninitialize(): boolean {
        unmountComponentAtNode(this.domNode);

        return true;
    }

    private updateRendering(alert?: string, images: Image[] = []) {
        if (alert) {
            render(createElement(Alert as any, { message: alert }), this.domNode);
        } else {
            render(createElement(Carousel, {
                contextGuid: this.contextObject ? this.contextObject.getGuid() : undefined,
                images
            }), this.domNode);
        }
    }

    private resetSubscriptions() {
        this.unsubscribeAll();

        if (this.contextObject) {
            this.subscribe({
                callback: () => this.dataHandler.validateAndFetch(),
                guid: this.contextObject.getGuid()
            });
        }
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
