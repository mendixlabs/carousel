/*
 ImageCarouselReact
 ========================
 
 @file      : ImageCarouselReact.js
 @version   : 1.0.0
 @author    : Akileng Isaac
 @date      : Tue, 20 Sept 2016
 @copyright : Flock of Birds 
 @license   : Apache License V2.0
 
 Documentation
 ========================
  ImageCarousel Widget displays an image carousel based on URLS 
  stored in the domain model built with React-TypeScript . 
 */

import * as dojoDeclare from "dojo/_base/declare";
// tslint:disable-next-line : no-unused-variable
import * as React from "ImageCarouselReact/lib/react";
import * as _WidgetBase from  "mxui/widget/_WidgetBase";

import ReactDOM = require("ImageCarouselReact/lib/react-dom");

import { ImageCarousel, ImageCarouselProps } from "./components/ImageCarousel";
/**
 * Implementation of Dojo wrapper for react components
 */

export interface Idata {
    caption?: string;
    description?: string;
    /**
     * guid of the image of image is originating from a object (not static)
     */
    guid?: string;
    onClick?: {
        clickMicroflow?: string,
        /**
         * guid of the image or of the context, in case of MF context it is the contex guid
         */
        guid?: string,
        onClickEvent: string,
        page?: string,
    };
    url: string;
}

export class ImageCarouselReactWrapper extends _WidgetBase {
    // Require context will be overwritten wot "NoContext" version of the widget.
    private requiresContext: boolean;
    // Parameters configured in the Modeler
    private imageEntity: string;
    private imageSource: string;
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
    private imageClickObjectMicroflow: string;
    private staticImageCollection: any[];
    private width: number;
    private height: number;
    private onClickEvent: "non" | "microflowContext" | "microflowImage" | "content" | "popup" | "modal";
    // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
    private contextObj: mendix.lib.MxObject;
    private handles: number[];
    private data: Idata[];
    /**
     * The TypeScript Contructor, not the dojo consctuctor,
     * move contructor work into widget prototype at bottom of the page. 
     */
    constructor(args?: Object, elem?: HTMLElement) {
        // Do not add any default value here... it wil not run in dojo!     
        super() ;
        return new dojoImageCarouselReact(args, elem);
    }
    /**
     * Create properities for react component based on modeler configurations
     */
    public createProps(): ImageCarouselProps {
        let contextId = this.contextObj ? this.contextObj.getGuid() : "";
        return {
            captionAttr: this.captionAttr,
            contextId,
            controls: this.controls,
            data: this.data,
            dataSourceMicroflow: this.dataSourceMicroflow,
            descriptionAttr: this.descriptionAttr,
            entityConstraint: this.entityConstraint,
            height: this.height,
            imageClickMicroflow: this.imageClickMicroflow,
            imageClickObjectMicroflow: this.imageClickObjectMicroflow,
            imageEntity: this.imageEntity,
            imageSource: this.imageSource,
            indicators: this.indicators,
            interval: this.interval,
            openPage: this.openPage,
            // openPageModal: this.location, // TODO add to interface later
            pauseOnHover: this.pauseOnHover,
            requiresContext: this.requiresContext,
            slide: this.slide,
            width: this.width,
        };
    }
    /**
     * dijit._WidgetBase.postCreate is called after constructing the widget.
     * React widget component, passing in all the props
     */
    public postCreate() {
        logger.debug(this.id + ".postCreate");
        this.updateRendering();
    }
    /**
     * mxui.widget._WidgetBase.update is called when context is changed or initialized. 
     *
     */
    public update(obj: mendix.lib.MxObject, callback?: Function) {
        logger.debug(this.id + ".update");
        this.contextObj = obj;
        this.updateData(() => {
            this.updateRendering(callback);
        });
        this._resetSubscriptions();
    }
    /**
     * mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed.
     * will need to unmount react components
     */
    public uninitialize() {
        logger.debug(this.id + ".uninitialize");
        // Clean up listeners, helper objects, etc. 
        // There is no need to remove listeners added with this.connect 
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
            />, this.domNode
        );
        if (callback) {
            callback(); // TODO check if its possible to do the callback by React Dom Rendering
        }
    }
    /**
     * Determines which data source was specific and calls the respective method to get the Data 
     */
    private updateData(callback: Function) {
        logger.debug(this.id + ".getCarouselData");
        if (this.imageSource === "xpath" ) {
            this.getDataFromXpath(callback);
        } else if (this.imageSource === "microflow"  ) {
             this.getDataFromMircroflow(callback);
        } else if (this.imageSource === "static"  ) {
            this.getDataFromStatic(callback);
        } else {
            logger.error(this.id + ".getCarouselData unknow image source " + this.imageSource);
        }
    }

    /**
     * retreive the carousel data based on data geth with xpath contraint if any.
     * Could us [%CurrentObject%]
     */
    private getDataFromXpath (callback: Function) {
        logger.debug(this.id  + ".getDataFromXpath");
        if (this.requiresContext && !this.contextObj) {
            // case there is not context ID the xpath will fail, so it should always show no images.
            logger.debug(this.id  + ".getDataFromXpath empty context");
            this.setDataFromObjects(callback, []);
        } else {
            // TODO throw error when non context version has a contraint with CurrentObject
            const guid = this.contextObj ? this.contextObj.getGuid() : "";
            const contraint = this.entityConstraint.replace("[%CurrentObject%]", guid);
            const xpathString = "//" + this.imageEntity + contraint;
            mx.data.get({
                callback: this.setDataFromObjects.bind(this, callback),
                error: (error) => {
                    logger.error(this.id + ": An error occurred while retrieveing items: " + error);
                },
                xpath : xpathString,
            });
        }
    }
    /**
     * retreive the data based on the MF
     */
    private getDataFromMircroflow(callback: Function) {
        logger.debug(this.id  + ".getDataFromMircroflow");
        if (this.requiresContext && !this.contextObj) {
            // case there is not context ID the xpath will fail, so it should always show no images.
            logger.debug(this.id  + ".getDataFromMircroflow, empy context");
            this.setDataFromObjects(callback, []);
        } else {
                    actionname: string,
                    applyto?: string,
                    guids?: string[],
                } = {
                    actionname: this.dataSourceMicroflow,
                    applyto: "none",
            };
            if (this.requiresContext) {
                params.applyto = "selection";
                params.guids = [this.contextObj.getGuid()];
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
    private setDataFromObjects(callback: Function, objs: mendix.lib.MxObject[]): void {
        logger.debug(this.id + ".getCarouselItemsFromObject");
        this.data = objs.map((itemObj) => {
            let data: Idata;
            data = {
                caption: this.captionAttr ? itemObj.get(this.captionAttr) as string : "",
                description: this.descriptionAttr ? itemObj.get(this.descriptionAttr) as string : "",
                onClick: {
                    clickMicroflow: this.imageClickMicroflow,
                    guid: itemObj.getGuid(),
                    onClickEvent: this.onClickEvent, // TODO Use location for click event
                    page: this.openPage,
                },
                url: this.getFileUrl(itemObj.getGuid()),
            };
            return data;
        });
        callback();
    }
    /**
     * Formats and Returns the object url
     */
    private getFileUrl (objectId: string) {
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
    private getDataFromStatic(callback: Function) {
        logger.debug(this.id  + ".getPropsFromObjects");
        this.data = this.staticImageCollection.map((itemObj, index) => {
            let data: Idata;
            data = {
                caption: itemObj.imgCaption,
                description: itemObj.imgDescription,
                onClick: {
                    clickMicroflow: itemObj.imageClickMicroflow,
                    guid: this.contextObj ? this.contextObj.getGuid() : "",
                    onClickEvent: itemObj.onClickEvent,
                    page: itemObj.openPage,
                },
                url: itemObj.picture,
            };
            return data;
        });
        callback();
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
            // When a mendix object exists create subscribtions.
            if (this.contextObj) {
                let objectHandle = mx.data.subscribe({
                    callback: (guid) => {
                        logger.debug(this.id + "._resetSubscriptions object subscription update MxId " + guid);
                        this.updateData(() => {
                            this.updateRendering();
                        });
                    },
                    guid: this.contextObj.getGuid(),
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
    };
    for (let i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
} (ImageCarouselReactWrapper)));

export default ImageCarouselReactWrapper;
