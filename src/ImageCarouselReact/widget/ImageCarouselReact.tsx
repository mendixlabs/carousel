

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
  ImageCarousel Widget displays an image carousel based on URLS stored in the domain model built with React-TypeScript . 
 */

declare var mx: mx.mx;
declare var logger: mendix.logger;

import * as dojoDeclare from "dojo/_base/declare";
import * as _WidgetBase from  "mxui/widget/_WidgetBase";

import * as React from "ImageCarouselReact/lib/react";
import ReactDOM = require("ImageCarouselReact/lib/react-dom");
import { Carousel, CarouselProps } from "react-bootstrap/src/Carousel";


import ReactBootstrap = require("ImageCarouselReact/lib/react-bootstrap");

export class ImageCarouselReactWrapper extends _WidgetBase {
    // Parameters configured in the Modeler
    private DataSourceMicroflow: string;
    private captionAttr: string;
    private descriptionAttr: string;
    private imageattr: string;
    private controls: boolean;
    private indicators: boolean;
    private Interval: number;
    private pauseOnHover: boolean;
    private slide: boolean;
    private imageClick: string;
    private width: number;
    private height: number;
    // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
    private data: Array<{}>;

    // The TypeScript Contructor, not the dojo consctuctor, move contructor work into widget prototype at bottom of the page. 
    constructor(args?: Object, elem?: HTMLElement) {
        // Do not add any default value here... it wil not run in dojo!     
        super() ;
        return new dojoImageCarouselReact(args, elem);
    }
    // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
    public postCreate() {
        logger.debug(this.id + ".postCreate !");
        this.getFileUrl = this.getFileUrl.bind(this);
        this.successCallback = this.successCallback.bind(this);
        this.callMicroflow(this.DataSourceMicroflow, this.successCallback);
    }
    // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
    public uninitialize() {
        logger.debug(this.id + ".uninitialize");
        // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        ReactDOM.unmountComponentAtNode(this.domNode);
    }
    public successCallback(obj: Array<{}>) {
        logger.debug(this.id + ": Microflow executed successfully");
        this.data = obj;
        logger.debug(obj);
         // const test = ReactBootstrap;
        const Carousel = ReactBootstrap.Carousel;
        const Carouselprops: CarouselProps = {
            controls: this.controls,
            indicators: this.indicators,
            interval: this.Interval,
            pauseOnHover: this.pauseOnHover,
            slide: this.slide,
        };

        const carouselStyle = {
            height: this.height,
            width: this.width,
        };
        const item = () => {
            return this.data.map((item: mendix.lib.MxObject) => {
                const caption = item.get(this.captionAttr);
                return (
                    <Carousel.Item onClick={() => this.callMicroflow(this.imageClick)} key={`${this.id}_${caption}`}>
                        <img style={carouselStyle} alt={caption} src={this.getFileUrl(item.getGuid())}/>
                        <Carousel.Caption>
                            <h3>{caption}</h3>
                            <p>{item.get(this.descriptionAttr)}</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                );
            });
        };

        const carouselInstance = (
            <Carousel {...Carouselprops} >
                {item()}
            </Carousel>
            );

        ReactDOM.render(<div style={carouselStyle}>{carouselInstance}</div>, this.domNode);
    }
    // call the microflow and returns data if any
    public callMicroflow(actionMF: string, successCallback?: Function, failureCallback?: Function): void{
        logger.debug(this.id + ".callMicroflow");
        if (actionMF !== "") {
        mx.data.action({
            callback: successCallback,
            error: (error) => {
                logger.error(this.id + ": An error occurred while executing microflow: " + error);
            },
            params: {
                actionname: actionMF,
            },
        });
      }
    }
    public getFileUrl (objectId: string) {
        logger.debug(this.id + "getFileUrl");
        let url: String;
        if (objectId) {
            url =  "file?target=window&guid=" + objectId + "&csrfToken=" + mx.session.getCSRFToken() + "&time=" + Date.now();
        }
        logger.debug(url);
        return url;
    }
}

// Declare widget's prototype the Dojo way
// Thanks to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/dojo/README.md
let dojoImageCarouselReact = dojoDeclare("ImageCarouselReact.widget.ImageCarouselReact", [_WidgetBase], (function(Source: any) {
    let result: any = {};
    // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
    result.constructor = function() {
        logger.debug( this.id + ".constructor dojo");
    };
    for (let i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
} (ImageCarouselReactWrapper)));

export default ImageCarouselReactWrapper;
