import * as React from "ImageCarouselReact/lib/react";

import * as ReactBootstrap from "ImageCarouselReact/lib/react-bootstrap";

declare var mx: mx.mx;
declare var logger: mendix.logger;

import IImageCarouselReactWrapper from "./../ImageCarouselReact"; // Wrapper

interface IImageCarouselModelProps {
    widgetId?: string;
    dataSourceMicroflow?: string;
    captionAttr?: string;
    descriptionAttr?: string;
    controls?: boolean;
    indicators?: boolean;
    interval?: number;
    pauseOnHover?: boolean;
    slide?: boolean;
    imageClick?: string;
    width?: number;
    height?: number;
}

interface IImageCarouselState {
    data: Array<Object>;
}

// Custom props 
export interface IImageCarouselProps extends IImageCarouselModelProps {
    // helper props for MX / dojo   
    wrapper?: IImageCarouselReactWrapper;
    ref?: (component: React.Component<IImageCarouselProps, IImageCarouselState>) => React.Component<IImageCarouselProps, IImageCarouselState>;
}

export class ImageCarousel extends React.Component<IImageCarouselProps, IImageCarouselState> {
    public static defaultProps: IImageCarouselProps = {
        controls: true,
        height: 350,
        indicators: true,
        interval: 5000,
        pauseOnHover: true,
        slide: true,
        width: 500,
    };
    private carouselStyle = {
            height: this.props.height,
            width: this.props.width,
        };
    constructor(props: ImageCarousel) {
        super(props);
        // bind context
        this.getFileUrl = this.getFileUrl.bind(this);
        this.successCallback = this.successCallback.bind(this);
        this.mapCarouselData = this.mapCarouselData.bind(this);
        this.callMicroflow = this.callMicroflow.bind(this);
        this.getFileUrl = this.getFileUrl.bind(this);

        this.state = {
            data: [],
        };
    }

    public componentWillMount () {
        logger.debug(this.props.widgetId + " .componentWillMount");
        this.callMicroflow(this.props.dataSourceMicroflow, this.successCallback);
    }
    // call the microflow and returns data if any
    public callMicroflow(actionMF: string, successCallback?: Function, failureCallback?: Function): void{
        logger.debug(this.props.widgetId + ".callMicroflow");
        if (actionMF !== "") {
            mx.data.action({
                callback: successCallback,
                error: (error) => {
                    logger.error(this.props.widgetId + ": An error occurred while executing microflow: " + error);
                },
                params: {
                    actionname: actionMF,
                },
            });
      }
    }
    public successCallback(obj: Array<{}>) {
        logger.debug(this.props.widgetId + ": Microflow executed successfully");
        if (typeof obj !== "undefined" ) {
            this.setState({ data: obj });
        }
    }
    public mapCarouselData() {
        logger.debug(this.props.widgetId + ".mapCarouselDatagrunt");
        const props = this.props;
        const data = this.state.data;
        if (data.length > 0) {
        return data.map((itemObj: mendix.lib.MxObject) => {
            const caption: string = itemObj.get(props.captionAttr) as string;
            return (
                <ReactBootstrap.Carousel.Item
                    onClick={() => this.callMicroflow(props.imageClick)}
                    key={`${this.props.widgetId}_${caption}`}
                >
                    <img style={this.carouselStyle} alt={caption} src={this.getFileUrl(itemObj.getGuid())}/>
                    <ReactBootstrap.Carousel.Caption>
                        <h3>{caption}</h3>
                        <p>{itemObj.get(props.descriptionAttr)}</p>
                    </ReactBootstrap.Carousel.Caption>
                </ReactBootstrap.Carousel.Item>
            );
        });
        }
        return (
            <div>
                Loading ...
            </div>
        );
     }
    public getFileUrl (objectId: string) {
        logger.debug(this.props.widgetId + "getFileUrl");
        let url: string;
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
                {this.mapCarouselData()}
            </ReactBootstrap.Carousel>
            </div>
        );
     }
};

export default ImageCarousel;
