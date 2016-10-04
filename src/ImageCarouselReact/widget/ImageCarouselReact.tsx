import * as dojoDeclare from "dojo/_base/declare";
// tslint:disable-next-line : no-unused-variable
import * as React from "ImageCarouselReact/lib/react";
import * as _WidgetBase from  "mxui/widget/_WidgetBase";
import ReactDOM = require("ImageCarouselReact/lib/react-dom");

import { ImageCarousel, ImageCarouselProps } from "./components/ImageCarousel";
/**
 * Implementation of Dojo wrapper for react components
 */

export interface IData {
    caption?: string;
    description?: string;
    /**
     * guid of the image of image is originating from a object (not static)
     */
    guid?: string;
    onClick?: {
        clickMicroflow?: string,
        /**
         * guid of the image or of the context, in case of MF context it is the context guid
         */
        guid?: string,
        onClickEvent: string,
        page?: string,
    };
    url: string;
}

export class ImageCarouselReactWrapper extends _WidgetBase {
    // Require context will be overwritten with "NoContext" version of the widget.
    private requiresContext: boolean;
    // Parameters configured in the Modeler
    private imageEntity: string;
    private imageSource: "xpath" | "microflow" | "static";
    private entityConstraint: string;
    private dataSourceMicroflow: string;
    private captionAttr: string;
    private descriptionAttr: string;
    private controls: boolean;
    private indicators: boolean;
    private interval: number;
    private pauseOnHover: boolean;
    private openPage: string;
    private slide: boolean;
    private imageClickMicroflow: string;
    private staticImageCollection: any[];
    private width: number;
    private height: number;
    private widthUnits: "auto" | "pixels" | "percent" | "viewPort";
    private heightUnits: "auto" | "pixels" | "percent" | "viewPort";
    private onClickEvent: "non" | "microflow" | "content" | "popup" | "modal";
    // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
    private contextObject: mendix.lib.MxObject;
    private handles: number[];
    private data: IData[];
    private isLoading: boolean;
    constructor(args?: Object, elem?: HTMLElement) {
        // Do not add any default value here... it wil not run in dojo!     
        super() ;
        return new dojoImageCarouselReact(args, elem);
    }
    public createProps(): ImageCarouselProps {
        return {
            captionAttr: this.captionAttr,
            contextId: this.contextObject ? this.contextObject.getGuid() : "",
            controls: this.controls,
            data: this.data,
            dataSourceMicroflow: this.dataSourceMicroflow,
            descriptionAttr: this.descriptionAttr,
            entityConstraint: this.entityConstraint,
            height: this.height,
            heightUnits: this.heightUnits,
            imageClickMicroflow: this.imageClickMicroflow,
            imageEntity: this.imageEntity,
            imageSource: this.imageSource,
            indicators: this.indicators,
            interval: this.interval,
            isLoading: this.isLoading,
            onClickEvent: this.onClickEvent,
            openPage: this.openPage,
            pauseOnHover: this.pauseOnHover,
            requiresContext: this.requiresContext,
            slide: this.slide,
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
    public update(object: mendix.lib.MxObject, callback?: Function) {
        logger.debug(this.id + ".update");
        this.contextObject = object;
        this.updateData(() => {
            this.isLoading = false;
            this.updateRendering(callback);
        });
        this._resetSubscriptions();
    }
    /**
     * called when the widget is destroyed.
     * will need to unmount react components
     */
    public uninitialize() {
        logger.debug(this.id + ".uninitialize");
        this._unsubscribe();
        ReactDOM.unmountComponentAtNode(this.domNode);
    }
    /**
     *  called to render the interface 
     */
    private updateRendering(callback?: Function) {
        logger.debug(this.id + ".updateRendering");
        ReactDOM.render(
            <ImageCarousel
                widgetId={this.id} {...this.createProps() }
            />, this.domNode, () => {
                // The ReactDOM.render calls back the optional updateRendering callback.
                if (callback) {
                    callback();
                }
            }
        );
    }
    /**
     * Determines which data source was specific and calls the respective method to get the Data 
     */
    private updateData(callback: Function) {
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

    /**
     * retrieve the carousel data based on data got with xpath constraint if any.
     * Could us [%CurrentObject%]
     */
    private fetchDataFromXpath(callback: Function) {
        logger.debug(this.id  + ".fetchDataFromXpath");
        if ((this.requiresContext && !this.contextObject) ||
                (!this.requiresContext && this.entityConstraint.indexOf("[%CurrentObject%]") > -1 )) {
            // case there is not context ID the xpath will fail, so it should always show no images.
            // or in case no conext is required, but the contraint contains CurrentObject. 
            // That will also show an error in the config check.
            logger.debug(this.id  + ".fetchDataFromXpath empty context");
            this.setDataFromObjects([]);
            callback();
        } else {
            const guid = this.contextObject ? this.contextObject.getGuid() : "";
            const constraint = this.entityConstraint.replace("[%CurrentObject%]", guid);
            const xpathString = "//" + this.imageEntity + constraint;
            mx.data.get({
                callback: this.setDataFromObjects.bind(this, callback),
                error: (error) => {
                    logger.error(this.id + ": An error occurred while retrieving items: " + error);
                },
                xpath : xpathString,
            });
        }
    }
    private fetchDataFromMicroflow(callback: Function) {
        logger.debug(this.id  + ".fetchDataFromMicroflow");
        if (this.requiresContext && !this.contextObject) {
            // case there is not context ID the xpath will fail, so it should always show no images.
            logger.debug(this.id  + ".getDataFromMicroflow, empty context");
            this.setDataFromObjects([]);
            callback();
        } else {
            let params: {
                    actionname: string,
                    applyto?: string,
                    guids?: string[],
                } = {
                    actionname: this.dataSourceMicroflow,
                    applyto: "none",
            };
            if (this.requiresContext) {
                params.applyto = "selection";
                params.guids = [this.contextObject.getGuid()];
            }
            mx.data.action({
                callback: this.setDataFromObjects.bind(this, callback),
                error: (error) => {
                    logger.error(this.id  + ": An error occurred while executing microflow: " + error);
                },
                params,
            });
        }
    }
    /**
     * transforms mendix object into item properties and set new state
     */
    private setDataFromObjects(objects: mendix.lib.MxObject[]): void {
        logger.debug(this.id + ".getCarouselItemsFromObject");
        this.data = objects.map((itemObj) => {
            let data: IData;
            return data = {
                caption: this.captionAttr ? itemObj.get(this.captionAttr) as string : "",
                description: this.descriptionAttr ? itemObj.get(this.descriptionAttr) as string : "",
                onClick: {
                    clickMicroflow: this.imageClickMicroflow,
                    guid: itemObj.getGuid(),
                    onClickEvent: this.onClickEvent,
                    page: this.openPage,
                },
                url: this.getFileUrl(itemObj.getGuid()),
            };
        });
    }
    /**
     * Returns a file url from the object Id.
     */
    private getFileUrl(objectId: string) {
        logger.debug(this.id + ".getFileUrl");
        let url: string;
        if (objectId) {
            url = "file?target=window&guid=" + objectId + "&csrfToken=" +
                    mx.session.getCSRFToken() + "&time=" + Date.now();
        }
        return url;
    }
    /**
     * iterate over modeler setting of the static images for props and set state
     */
    private fetchDataFromStatic() {
        logger.debug(this.id  + ".getPropsFromObjects");
        this.data = this.staticImageCollection.map((itemObject, index): IData => {
            return {
                caption: itemObject.imgCaption,
                description: itemObject.imgDescription,
                onClick: {
                    clickMicroflow: itemObject.imageClickMicroflow,
                    guid: this.contextObject ? this.contextObject.getGuid() : "",
                    onClickEvent: itemObject.onClickEvent,
                    page: itemObject.openPage,
                },
                url: itemObject.picture,
            };
        });
    }

    // Remove subscriptions
    private _unsubscribe () {
        if (this.handles) {
            for (let handle of this.handles) {
                mx.data.unsubscribe(handle);
            }
            this.handles = [];
        }
    }
    // Reset subscriptions.
    private _resetSubscriptions () {
        // only run when widget is using context.
        if (this.requiresContext) {
            logger.debug(this.id + "._resetSubscriptions");
            // Release handles on previous object, if any.
            this._unsubscribe();
            // When a mendix object exists create subscription
            if (this.contextObject) {
                let objectHandle = mx.data.subscribe({
                    callback: (guid) => {
                        logger.debug(this.id + "._resetSubscriptions object subscription update MxId " + guid);
                        this.updateData(() => {
                            this.isLoading = false;
                            this.updateRendering();
                        });
                    },
                    guid: this.contextObject.getGuid(),
                });
                this.handles = [objectHandle];
            }
        }
    }
}

// Declare widget's prototype the Dojo way
// Thanks to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/dojo/README.md
// tslint:disable : only-arrow-functions
let dojoImageCarouselReact = dojoDeclare(
    "ImageCarouselReact.widget.ImageCarouselReact", [_WidgetBase], (function (Source: any) {
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
} (ImageCarouselReactWrapper)));

export default ImageCarouselReactWrapper;
