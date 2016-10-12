import * as dojoDeclare from "dojo/_base/declare";
import * as _WidgetBase from "mxui/widget/_WidgetBase";

import { createElement } from "Carousel/lib/react";
import { render, unmountComponentAtNode } from "Carousel/lib/react-dom";

import { HeightUnits, ImageSource, OnClickEvent,
    PageLocation, StaticImageCollection, WidthUnits } from "../Carousel.d";
import { ImageCarousel, ImageCarouselProps } from "./components/ImageCarousel";

export interface Data {
    caption?: string;
    description?: string;
    guid?: string;
}

export class CarouselWrapper extends _WidgetBase {
    // Require context will be overwritten with "NoContext" version of the widget.
    private requiresContext: boolean;
    // Parameters configured in the Modeler
    private imageEntity: string;
    private imageSource: ImageSource;
    private entityConstraint: string;
    private dataSourceMicroflow: string;
    private captionAttr: string;
    private descriptionAttr: string;
    private interval: number;
    private staticImageCollection: StaticImageCollection[];
    private onClickEvent: OnClickEvent;
    private callMicroflow: string;
    private pageForm: string;
    private pageLocation: PageLocation;
    private width?: number;
    private widthUnits: WidthUnits;
    private height?: number;
    private heightUnits: HeightUnits;
    // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
    private contextObject: mendix.lib.MxObject;
    private data: Data[];
    private isLoading: boolean;

    constructor(args?: Object, elem?: HTMLElement) {
        // Do not add any default value here... it wil not run in dojo!     
        super() ;
        return new DojoCarousel(args, elem);
    }

    public createProps(): ImageCarouselProps {
        return {
            callMicroflow: this.callMicroflow,
            captionAttr: this.captionAttr,
            contextId: this.contextObject ? this.contextObject.getGuid() : "",
            data: this.data,
            dataSourceMicroflow: this.dataSourceMicroflow,
            descriptionAttr: this.descriptionAttr,
            entityConstraint: this.entityConstraint,
            height: this.height,
            heightUnits: this.heightUnits,
            imageEntity: this.imageEntity,
            imageSource: this.imageSource,
            interval: this.interval,
            isLoading: this.isLoading,
            onClickEvent: this.onClickEvent,
            pageForm: this.pageForm,
            pageLocation: this.pageLocation,
            requiresContext: this.requiresContext,
            staticImageCollection: this.staticImageCollection,
            width: this.width,
            widthUnits: this.widthUnits,
        };
    }
    public postCreate() {
        this.updateRendering();
    }
    /**
     * called when context is changed or initialized. 
     *
     */
    public update(object: mendix.lib.MxObject, callback: Function): void {
        this.contextObject = object;
        this.updateData(() => {
            this.isLoading = false;
            this.updateRendering(callback);
        });
        this.resetSubscriptions();
    }
    /**
     * called when the widget is destroyed.
     * will need to unmount react components
     */
    public uninitialize(): void {
        unmountComponentAtNode(this.domNode);
    }
    /**
     *  called to render the interface 
     */
    private updateRendering(callback?: Function) {
        let props = this.createProps();
        props.widgetId = this.id;
        render(
            createElement(ImageCarousel, props), this.domNode
        );
        if (callback) {
            callback();
        }
    }
    /**
     * Determines which data source was specific and calls the respective method to get the Data 
     */
    private updateData(callback: Function): void {
        if (this.imageSource === "xpath" && this.imageEntity) {
            this.fetchDataFromXpath((objects) => {
                this.setData(objects);
                callback();
            });
        } else if (this.imageSource === "microflow" && this.dataSourceMicroflow) {
            this.fetchDataFromMicroflow((objects) => {
                this.setData(objects);
                callback();
            });
        }
        callback();
    }
    private fetchDataFromXpath(callback: (objects: mendix.lib.MxObject[]) => void): void {
        const isMissingContext = (this.requiresContext && !this.contextObject) ||
                                 (!this.requiresContext && this.entityConstraint.indexOf("[%CurrentObject%]") > -1 );
        if (!isMissingContext) {
            const guid = this.contextObject ? this.contextObject.getGuid() : "";
            const constraint = this.entityConstraint.replace("[%CurrentObject%]", guid);
            const xpathString = "//" + this.imageEntity + constraint;
            mx.data.get({
                callback: callback.bind(this), // is this callback right?
                error: error => logger.error(this.id + ": An error occurred while retrieving items: " + error),
                xpath : xpathString,
            });
        } else {
            callback([]);
        }
    }
    private fetchDataFromMicroflow(callback: (objects: mendix.lib.MxObject[]) => void): void {
        if (this.requiresContext && !this.contextObject) {
            // case there is not context ID the xpath will fail, so it should always show no images.
            callback([]);
        } else {
            mx.data.action({
                callback: callback.bind(this),
                error: error => logger.error(this.id + ": An error occurred while executing microflow: " + error),
                params: {
                    actionname: this.dataSourceMicroflow,
                    applyto: this.requiresContext ? "selection" : "none",
                    guids: this.requiresContext ? [ this.contextObject.getGuid() ] : [],
                },
            });
        }
    }
    /**
     * Transforms mendix object into item properties and set new state
     */
    private setData(objects: mendix.lib.MxObject[]): void {
        this.data = objects.map((itemObj): Data => ({
            caption: this.captionAttr ? itemObj.get(this.captionAttr) as string : "",
            description: this.descriptionAttr ? itemObj.get(this.descriptionAttr) as string : "",
            guid: itemObj.getGuid(),
        }));
    }
    private resetSubscriptions(): void {
        // Only run when widget is using context.
        if (this.requiresContext && this.contextObject) {
            // When a mendix object exists create subscription
            this.subscribe({
                callback: guid => {
                    this.updateData(() => {
                        this.isLoading = false;
                        this.updateRendering();
                    });
                },
                guid: this.contextObject.getGuid(),
            });
        }
    }
}

// Declare widget prototype the Dojo way
// Thanks to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/dojo/README.md
// tslint:disable : only-arrow-functions
const DojoCarousel = dojoDeclare(
    "Carousel.widget.Carousel", [ _WidgetBase ], (function (Source: any) {
    let result: any = {};
    // dojo.declare.constructor is called to construct the widget instance.
    // Implement to initialize non-primitive properties.
    result.constructor = function() {
        // default, will be set by NoContext Version, if not set, it should be true
        if (typeof this.requiresContext === "undefined") {
            this.requiresContext = true;
        }
        this.data = [];
        this.isLoading = true;
    };
    for (let i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
} (CarouselWrapper)));

export default CarouselWrapper;
