import * as dojoDeclare from "dojo/_base/declare";
// tslint:disable-next-line : no-unused-variable
import * as React from "Carousel/lib/react";
import * as _WidgetBase from  "mxui/widget/_WidgetBase";
import ReactDOM = require("Carousel/lib/react-dom");

import { ImageCarousel, ImageCarouselProps } from "./components/ImageCarousel";
/**
 * Implementation of Dojo wrapper for react components
 */

export interface Data {
    caption?: string;
    description?: string;
    guid?: string;
    onClick?: {
        clickMicroflow?: string,
        contextGuid?: string,
        onClickEvent: string,
        page?: string,
        pageLocation?: string,
    };
    url: string;
}

export class CarouselWrapper extends _WidgetBase {
    // Require context will be overwritten with "NoContext" version of the widget.
    private requiresContext: boolean;
    // Parameters configured in the Modeler
    private imageEntity: string;
    private imageSource: "xpath" | "microflow" | "static";
    private entityConstraint: string;
    private dataSourceMicroflow: string;
    private captionAttr: string;
    private descriptionAttr: string;
    private interval: number;
    private staticImageCollection: any[];
    private onClickEvent: "none" | "openPage" | "callMicroflow";
    private callMicroflow: string;
    private pageForm: string;
    private pageLocation: "content" | "popup" | "modal";
    private width?: number;
    private widthUnits: "auto" | "pixels" | "percent";
    private height?: number;
    private heightUnits: "auto" | "pixels" | "percent";
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
            staticImageCollection: this.staticImageCollection,
            width: this.width,
            widthUnits: this.widthUnits,
        };
    }
    public postCreate() {
        logger.debug(this.id + ".postCreate");
        this.updateRendering();
    }
    /**
     * called when context is changed or initialized. 
     *
     */
    public update(object: mendix.lib.MxObject, callback: Function): void {
        logger.debug(this.id + ".update");
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
        logger.debug(this.id + ".uninitialize");
        ReactDOM.unmountComponentAtNode(this.domNode);
    }
    /**
     *  called to render the interface 
     */
    private updateRendering(callback?: Function) {
        logger.debug(this.id + ".updateRendering");
        let props = this.createProps();
        props.widgetId = this.id;
        ReactDOM.render(
            React.createElement(ImageCarousel, props)
            , this.domNode
        );
        if (callback) {
            callback();
        }
    }
    /**
     * Determines which data source was specific and calls the respective method to get the Data 
     */
    private updateData(callback: Function): void {
        logger.debug(this.id + ".getCarouselData");
        if (this.imageSource === "xpath" && this.imageEntity) {
            this.fetchDataFromXpath(callback);
        } else if (this.imageSource === "microflow" && this.dataSourceMicroflow) {
            this.fetchDataFromMicroflow(callback);
        } else if (this.imageSource === "static"  ) {
            this.fetchDataFromStatic();
            callback();
        } else {
            logger.error(this.id + ".getCarouselData unknown image source or error in widget configuration" +
                         this.imageSource);
            callback();
        }
    }
    private fetchDataFromXpath(callback: Function): void {
        logger.debug(this.id  + ".getDataFromXpath");
        const isMissingContext = (this.requiresContext && !this.contextObject) ||
                                 (!this.requiresContext && this.entityConstraint.indexOf("[%CurrentObject%]") > -1 );
        if (!isMissingContext) {
            // case there is not context ID the xpath will fail, so it should always show no images.
            // or in case no context is required, but the constraint contains CurrentObject. 
            // That will also show an error in the config check.
            const guid = this.contextObject ? this.contextObject.getGuid() : "";
            const constraint = this.entityConstraint.replace("[%CurrentObject%]", guid);
            const xpathString = "//" + this.imageEntity + constraint;
            mx.data.get({
                callback: this.setDataFromObjects.bind(this, callback), // is this callback right?
                error: (error) => logger.error(this.id + ": An error occurred while retrieving items: " + error),
                xpath : xpathString,
            });
        } else {
            logger.debug(this.id  + ".getDataFromXpath empty context");
            this.setDataFromObjects(callback, []);
        }
    }
    private fetchDataFromMicroflow(callback: Function): void {
        logger.debug(this.id  + ".fetchDataFromMicroflow");
        if (this.requiresContext && !this.contextObject) {
            // case there is not context ID the xpath will fail, so it should always show no images.
            logger.debug(this.id  + ".fetchDataFromMicroflow, empty context");
            this.setDataFromObjects(callback, []);
        } else {
            mx.data.action({
                callback: this.setDataFromObjects.bind(this, callback),
                error: (error) => logger.error(this.id  + ": An error occurred while executing microflow: " + error),
                params: {actionname: this.dataSourceMicroflow,
                         applyto: this.requiresContext ? "selection" : "none",
                         guids: this.requiresContext ? [this.contextObject.getGuid()] : [],
                        },
            });
        }
    }
    /**
     * transforms mendix object into item properties and set new state
     */
    private setDataFromObjects(callback: Function, objects: mendix.lib.MxObject[]): void {
        logger.debug(this.id + ".getCarouselItemsFromObject");
        this.data = objects.map((itemObj): Data => ({
                caption: this.captionAttr ? itemObj.get(this.captionAttr) as string : "",
                description: this.descriptionAttr ? itemObj.get(this.descriptionAttr) as string : "",
                onClick: {
                    clickMicroflow: this.callMicroflow,
                    contextGuid: itemObj.getGuid(),
                    onClickEvent: this.onClickEvent,
                    page: this.pageForm,
                    pageLocation: this.pageLocation,
                },
                url: this.getFileUrl(itemObj.getGuid()),
        }));
        callback();
    }
    /**
     * Returns a image url from the object Id.
     */
    private getFileUrl(objectId: string): string {
        logger.debug(this.id + ".getFileUrl");
        return "file?target=window&guid=" + objectId + "&csrfToken=" +
                    mx.session.getCSRFToken() + "&time=" + Date.now();
    }
    /**
     * iterate over modeler setting of the static images for props and set state
     */
    private fetchDataFromStatic(): void {
        logger.debug(this.id  + ".getPropsFromObjects");
        this.data = this.staticImageCollection.map((itemObject, index): Data => ({
                caption: itemObject.imgCaption,
                description: itemObject.imgDescription,
                onClick: {
                    clickMicroflow: itemObject.callMicroflow,
                    contextGuid: this.contextObject ? this.contextObject.getGuid() : "",
                    onClickEvent: itemObject.onClickEvent,
                    page: itemObject.openPage,
                    pageLocation: itemObject.pageSettings,
                },
                url: itemObject.pictureUrl,
        }));
    }
    private resetSubscriptions(): void {
        // only run when widget is using context.
        if (this.requiresContext && this.contextObject) {
            logger.debug(this.id + "._resetSubscriptions");
            // When a mendix object exists create subscription
            this.subscribe({
                callback: (guid: string) => {
                    logger.debug(this.id + "._resetSubscriptions object subscription update MxId " + guid);
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

// Declare widget's prototype the Dojo way
// Thanks to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/dojo/README.md
// tslint:disable : only-arrow-functions
const DojoCarousel = dojoDeclare(
    "Carousel.widget.Carousel", [ _WidgetBase ], (function (Source: any) {
    let result: any = {};
    // dojo.declare.constructor is called to construct the widget instance.
    // Implement to initialize non-primitive properties.
    result.constructor = function() {
        logger.debug( this.id + ".constructor dojo");
        // default, will be set by NoContext Version, if not set, it should be true
        if (typeof this.requiresContext  === "undefined") {
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
