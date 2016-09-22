import * as React from "ImageCarouselReact/lib/react";

import * as ReactBootstrap from "ImageCarouselReact/lib/react-bootstrap";

declare var mx: mx.mx;
declare var logger: mendix.logger;

import IImageCarouselReactWrapper from "./../ImageCarouselReact"; // Wrapper

export interface IStaticImages {
    imgCaption?: string;
    imgdescription?: string;
    picture?: string;
}

interface IImageCarouselModelProps  {
    imgcollection?: Array<IStaticImages>;
    widgetId?: string;
    imageEntity?: string;
    entityConstraint?: string;
    dataSourceMicroflow?: string;
    captionAttr?: string;
    descriptionAttr?: string;
    controls?: boolean;
    indicators?: boolean;
    interval?: number;
    openPage?: string;
    pauseOnHover?: boolean;
    slide?: boolean;
    imageClick?: string;
    width?: number;
    height?: number;

}

interface IImageCarouselState {
    data: Array<mendix.lib.MxObject>;
    dataStatic: Array<IStaticImages>;
}

// Custom props 
export interface IImageCarouselProps extends IImageCarouselModelProps, React.Props<ImageCarousel> {
    // helper props for MX / dojo   
    wrapper?: IImageCarouselReactWrapper;
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
    constructor(props: IImageCarouselProps) {
        super(props);
        // bind context
        this.getFileUrl = this.getFileUrl.bind(this);
        this.successCallback = this.successCallback.bind(this);
        this.mapCarouselData = this.mapCarouselData.bind(this);
        this.callMicroflow = this.callMicroflow.bind(this);
        this.getFileUrl = this.getFileUrl.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
        this.getCarouselData = this.getCarouselData.bind(this);
        this.generateRandom = this.generateRandom.bind(this);

        this.state = {
            data : [],
            dataStatic: [],
        };
    }

    public componentWillMount () {
        logger.debug(this.props.widgetId + " .componentWillMount");
        this.getCarouselData();
    }
    // call the microflow and returns data if any
    public callMicroflow(actionMF?: string, constraint?: string, successCallback?: Function, failureCallback?: Function): void{
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
        }else if (constraint !== "") {
            const xpathString = "//" + this.props.imageEntity + this.props.entityConstraint;
            mx.data.get({
                callback: successCallback,
                error: (error) => {
                    logger.error(this.props.widgetId + ": An error occurred while retrieveing items: " + error);
                },
                xpath : xpathString ,
            });

        }
    }
    public successCallback(obj: Array<mendix.lib.MxObject>) {
        logger.debug(this.props.widgetId + ": Microflow executed successfully");
        if (typeof obj !== "undefined" ) {
            this.setState({ data: obj, dataStatic: [] });
        }
    }
    public mapCarouselData() {
        logger.debug(this.props.widgetId + ".mapCarouselDatagrunt");
        const staticImageData = this.state.dataStatic;
        const data = this.state.data;
        if (staticImageData.length > 0) {
                return staticImageData.map((itemObj) => {
                    const caption = itemObj.imgCaption;
                    const key = this.generateRandom();
                    const url = itemObj.picture;
                    const desc = itemObj.imgdescription;
                    return (
                        <ReactBootstrap.Carousel.Item
                            onClick={this.onItemClick}
                            key={key}
                        >
                            <img style={this.carouselStyle} alt={caption} src={url}/>
                            <ReactBootstrap.Carousel.Caption>
                                <h3>{caption}</h3>
                                <p>{desc}</p>
                            </ReactBootstrap.Carousel.Caption>
                        </ReactBootstrap.Carousel.Item>
                    );
                });
        }else if (data.length > 0) {
                return data.map((itemObj) => {
                    const props = this.props;
                    const caption = itemObj.get(props.captionAttr) as string;
                    const key = itemObj.getGuid();
                    const url = this.getFileUrl(itemObj.getGuid());
                    return (
                        <ReactBootstrap.Carousel.Item
                            onClick={this.onItemClick}
                            key={key}
                        >
                            <img style={this.carouselStyle} alt={caption} src={url}/>
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
        const carouselProps = {
              controls : this.props.controls,
              indicators: this.props.indicators,
              interval: this.props.interval,
              pauseOnHover: this.props.pauseOnHover,
              slide: this.props.slide,
        };
        return (
            <div style={this.carouselStyle}>
            <ReactBootstrap.Carousel {...carouselProps} >
                {this.mapCarouselData()}
            </ReactBootstrap.Carousel>
            </div>
        );
     }
    private onItemClick() {
        if (this.props.imageClick) {
            this.callMicroflow(this.props.imageClick);
        }
        if (this.props.openPage) {
            mx.ui.openForm(this.props.openPage, {
                callback: () => {
                    logger.debug(this.props.widgetId + "Page opened Successfully");
                }
            });
         }
    }
    private getCarouselData() {
        if (this.props.entityConstraint) {
            this.callMicroflow("", this.props.entityConstraint, this.successCallback);
        }else if (this.props.dataSourceMicroflow) {
            this.callMicroflow(this.props.dataSourceMicroflow, "", this.successCallback);
        }else if (this.props.imgcollection){
            logger.debug(this.props.widgetId + "Objects found");
            if (this.props.imgcollection.length > 0) {
            this.setState({ data: [], dataStatic: this.props.imgcollection });
        }

     }
    }
       private generateRandom(): number {
        return Math.floor(Math.random() * 10000);
    }
};

export default ImageCarousel;
