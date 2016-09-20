

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
import * as mxLang from "mendix/lang";

import * as React from "ImageCarouselReact/lib/react";
import ReactDOM = require("ImageCarouselReact/lib/react-dom");
import { Carousel, CarouselProps } from "react-bootstrap/src/Carousel";

import ReactBootstrap = require("ImageCarouselReact/lib/react-bootstrap");

import {ImageCarouselReact, IImageCarouselReactState, IImageCarouselReactProps} from "./components/ImageCarousel";

export class ImageCarouselReactWrapper extends _WidgetBase {
    // Parameters configured in the Modeler
    private DataMicroflow: string;
    private captionAttr: string;
    private descriptionAttr: string;
    private imageattr: string;
    private jumpLocation: string;
    private delay: string;
    private duration: string;
    private imageClick: string;
    private width: number;
    private height: number;
    private border: number;
    private borderColor: string;
    private arrowBack: string;
    private arrowFwd: string;

    // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
    private contextObj: mendix.lib.MxObject;
    private handles: number[];
    private ImageCarouselReactComponent: React.Component<IImageCarouselReactProps, IImageCarouselReactState>;
    private data: Array<{}>;

    // The TypeScript Contructor, not the dojo consctuctor, move contructor work into widget prototype at bottom of the page. 
    constructor(args?: Object, elem?: HTMLElement) {
        // Do not add any default value here... it wil not run in dojo!     
        super() ;
        return new dojoImageCarouselReact(args, elem);
    }
    public createProps() {
        return { // TODO group properties on function like button.

        };
    }
    // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
    public postCreate() {
        logger.debug(this.id + ".postCreate !");
        this.formSave = this.formSave.bind(this);
        this.formValidate = this.formValidate.bind(this);
        this.getFileUrl = this.getFileUrl.bind(this);
        this.successCallback = this.successCallback.bind(this);
        this.callMicroflow(this.DataMicroflow, this.successCallback);

        this.contextObj = null;
    }
    // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
    public update(obj: mendix.lib.MxObject, callback?: Function) {
        logger.debug(this.id + ".update");
        this.contextObj = obj;

        this.updateStore(callback);
        this._resetSubscriptions();
    }
    // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
    public uninitialize() {
        logger.debug(this.id + ".uninitialize");
        // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        ReactDOM.unmountComponentAtNode(this.domNode);
        this._unsubscribe();
    }
    public successCallback(obj: mendix.lib.MxObject) {
        logger.debug(this.id + ": Microflow executed successfully");
        this.data = obj;
        logger.debug(obj);
         // const test = ReactBootstrap;
        const Carousel = ReactBootstrap.Carousel;
        const props: CarouselProps = {
            slide: true,
        };

        const carouselStyle = {
            height: this.height,
            width: this.width,
        };
        const item = () => {
            return this.data.map((item: mendix.lib.MxObject) => {
                const caption = item.get(this.captionAttr);
                return (
                    <Carousel.Item key={`${this.id}_${caption}`}>
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
            <Carousel {... props} >
                {item()}
            </Carousel>
            );

        ReactDOM.render(<div style={carouselStyle}>{carouselInstance}</div>, this.domNode);
    }
    // call the microflow and remove progress on finishing
    public callMicroflow(actionMF: string, successCallback?: Function, failureCallback?: Function) {
        logger.debug(this.id + ".callMicroflow");
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
    public getFileUrl (objectId: string) {
        logger.debug(this.id + "getFileUrl");
        let url: String;
        if (objectId) {
            url =  "file?target=window&guid=" + objectId + "&csrfToken=" + mx.session.getCSRFToken() + "&time=" + Date.now();
        }
        logger.debug(url);
        return url;
    }
    public mxUpdateProgressObject() {
        logger.debug(this.id + ".updateProgress");
        mx.data.get({
            callback: (objs: mendix.lib.MxObject[]) => {
                if (objs && objs.length > 0) {
                    let obj = objs[0];
                    // let msg = String(obj.get(this.progressMessageAtt));
                    // let percent = Number(obj.get(this.progressPercentAtt));
                    this.ImageCarouselReactComponent.setState({
                        progressEntity: {
                            // progressMessageAtt: msg,
                            // progressPercentAtt: percent,
                        },
                    });
                }
            },
            error: (e) => {
                console.error(this.id + ".updateProgress: XAS error retreiving progress object", e);
            },
            // guids: [this.progressObj.getGuid()],
            noCache: true,
        });
    }
    public formSave(callback?: Function) {
        this.mxform.save(callback, (error) => {
            if (!(error instanceof mendix.lib.ValidationError)) {
                mx.onError(error);
            }
        });
    }
    public formValidate(callback?: Function) {
        this.mxform.validate.bind(this.mxform);
        this.mxform.validate(callback);
    }

    // Set store value, could trigger a rerender the interface.
    private updateStore (callback?: Function) {
        logger.debug(this.id + ".updateRendering");
        // The callback, coming from update, needs to be executed, to let the page know it finished rendering
        mxLang.nullExec(callback);
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
        logger.debug(this.id + "._resetSubscriptions");
        // Release handles on previous object, if any.
        this._unsubscribe();
        // When a mendix object exists create subscribtions.
        // if (this.contextObj && this.captionAtt) {
        //     let attrHandle = mx.data.subscribe({
        //         attr: this.captionAtt,
        //         callback: (guid, attr, attrValue) => {
        //             logger.debug(this.id + "._resetSubscriptions attribute '" + attr + "' subscription update MxId " + guid);
        //             this.updateStore();
        //         },
        //         guid: this.contextObj.getGuid(),
        //     });
        //     let objectHandle = mx.data.subscribe({
        //         callback: (guid) => {
        //             logger.debug(this.id + "._resetSubscriptions object subscription update MxId " + guid);
        //             this.updateStore();
        //         },
        //         guid: this.contextObj.getGuid(),
        //     });
        //     this.handles = [attrHandle, objectHandle];
        // }
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
