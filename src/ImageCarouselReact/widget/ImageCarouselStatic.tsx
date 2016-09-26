/*
 ImageCarouselStatic
 ========================
 
 @file      : ImageCarouselStatic.js
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
// TODO Add comments to functions just like ImageCarouselReact.tsx

import * as dojoDeclare from "dojo/_base/declare";
// tslint:disable-next-line : no-unused-variable
import * as React from "ImageCarouselReact/lib/react";
import * as _WidgetBase from  "mxui/widget/_WidgetBase";

import ReactDOM = require("ImageCarouselReact/lib/react-dom");

import IStaticImages from "./components/ImageCarousel";
import ImageCarousel from "./components/ImageCarousel";
/**
 * Implementation of Dojo wrapper for react components
 */
export class ImageCarouselStaticWrapper extends _WidgetBase {
    // Parameters configured in the Modeler
    private imgcollection: Array<IStaticImages>;
    private controls: boolean;
    private indicators: boolean;
    private interval: number;
    private pauseOnHover: boolean;
    private openPage: string;
    private slide: boolean;
    private imageClick: string;
    private width: number;
    private height: number;
    private location: string;
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
    public createProps() {
            return {
                controls: this.controls,
                height: this.height,
                imageClick: this.imageClick,
                imgcollection: this.imgcollection,
                indicators: this.indicators,
                interval: this.interval,
                location: this.location,
                openPage: this.openPage,
                pauseOnHover: this.pauseOnHover,
                slide: this.slide,
                width: this.width,
        };
     }
    // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
    public postCreate() {
        logger.debug(this.id + ".postCreate !");
        ReactDOM.render(
            <ImageCarousel
                widgetId={this.id} {...this.createProps()}
            />, this.domNode
        );
    }
}

// Declare widget's prototype the Dojo way
// Thanks to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/dojo/README.md
// tslint:disable : only-arrow-functions
let dojoImageCarouselReact = dojoDeclare(
    "ImageCarouselReact.widget.ImageCarouselStatic", [_WidgetBase], (function(Source: any) {
    let result: any = {};
    // dojo.declare.constructor is called to construct the widget instance.
    // Implement to initialize non-primitive properties.
    result.constructor = function() {
        logger.debug( this.id + ".constructor dojo");
    };
    for (let i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
} (ImageCarouselStaticWrapper)));

export default ImageCarouselStaticWrapper;
