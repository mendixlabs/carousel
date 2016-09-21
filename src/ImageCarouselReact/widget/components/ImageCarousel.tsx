import * as React from "ImageCarouselReact/lib/react";


import ReactBootstrap = require("ImageCarouselReact/lib/react-bootstrap");

declare var mx: mx.mx;
declare var logger: mendix.logger;

import IImageCarouselReactWrapper from "./../ImageCarouselReact"; // Wrapper

interface IImageCarouselModelProps {
    widgetId: string;
    dataSourceMicroflow: string;
    captionAttr?: string;
    descriptionAttr?: string;
    imageattr?: string;
    controls?: boolean;
    indicators?: boolean;
    interval?: number;
    pauseOnHover?: boolean;
    slide?: boolean;
    imageClick?: string;
    width?: number;
    height?: number;
}

// Custom props 
export interface IImageCarouselProps extends IImageCarouselModelProps {
    // helper props for MX / dojo   
    wrapper? : IImageCarouselReactWrapper;
    ref?: (component: React.Component<IImageCarouselProps>) => React.Component<IImageCarouselProps>;
}

export class ImageCarousel extends React.Component<IImageCarouselProps> {
    public static defaultProps: IImageCarouselProps = {
        controls: true,
        height: 350,
        indicators: true,
        interval: 5000,
        pauseOnHover: true,
        slide: true,
    };
    private data: Array<{}>;
    private carouselStyle = {
            height: this.height,
            width: this.width,
        };
    private CarouselItems: Object;
    constructor(props: ImageCarousel) {
        super(props);
        this.getFileUrl = this.getFileUrl.bind(this);
        this.successCallback = this.successCallback.bind(this);
    }

    public componentWillUnmount () {
        logger.debug(this.props.widgetId + " .componentWillUnmount");
        this.callMicroflow(this.props.dataSourceMicroflow, this.successCallback);
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
    public successCallback(obj: Array<{}>) {
        logger.debug(this.id + ": Microflow executed successfully");
        this.data = obj;
        this.mapCarouselData(this.data);
    }
    public mapCarouselData(data: Array<{}>){
          return data.data.map((itemObj: mendix.lib.MxObject) => {
                const caption = itemObj.get(this.captionAttr);
                return (
                this.CarouselItems = (
                    <ReactBootstrap.Carousel.Item
                        onClick={() => this.callMicroflow(this.imageClick)}
                        key={`${this.id}_${caption}`}
                    >
                        <img style={this.carouselStyle} alt={caption} src={this.getFileUrl(itemObj.getGuid())}/>
                        <ReactBootstrap.Carousel.Caption>
                            <h3>{caption}</h3>
                            <p>{itemObj.get(this.descriptionAttr)}</p>
                        </ReactBootstrap.Carousel.Caption>
                    </ReactBootstrap.Carousel.Item>
                    )
                );
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
    public render() {
        logger.debug(this.props.widgetId + ".render");
        return (
            <div style={this.carouselStyle}>
            <ReactBootstrap.Carousel
                controls={this.props.controls}
                indicators={this.props.indicators}
                interval={this.props.interval}
                pauseOnHover={this.props.pauseOnHover}
                slide={this.props.slide}
            >
                {this.CarouselItems}
                <ReactBootstrap.Carousel.Item
                        onClick={() => this.callMicroflow(this.imageClick)}
                        key={`${this.id}_${caption}`}
                    >
                        <img style={this.carouselStyle} alt={caption} src="http://fullhdpictures.com/most-beautiful-landscape-wallpapers.html/city-landscape-wallpapers"/>
                        <ReactBootstrap.Carousel.Caption>
                            <h3>Helo</h3>
                            <p>Now</p>
                        </ReactBootstrap.Carousel.Caption>
                    </ReactBootstrap.Carousel.Item>
            </ReactBootstrap.Carousel>
            </div>
        );
     }
};

export default ImageCarousel;
