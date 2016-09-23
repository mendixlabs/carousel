import * as React from "ImageCarouselReact/lib/react";

import * as ReactBootstrap from "ImageCarouselReact/lib/react-bootstrap";

declare var mx: mx.mx;
declare var logger: mendix.logger;

import autoBind from "../../lib/autoBind";
import ImageCarouselReactWrapper from "./../ImageCarouselReact"; // Wrapper

export interface IStaticImages {
    imgCaption?: string;
    imgdescription?: string;
    picture?: string;
}

interface ImageCarouselModelProps  {
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

interface ImageCarouselState {
    data: Array<mendix.lib.MxObject>;
    dataStatic: Array<IStaticImages>;
}

interface ItemProps extends ReactBootstrap.CarouselItemProps {
    key: string | number;
    imgStyle: Object;
    alt: string;
    src: string;
    caption: string;
    description: string;
}

// Custom props 
export interface ImageCarouselProps extends ImageCarouselModelProps, React.Props<ImageCarousel> {
    // helper props for MX / dojo   
    wrapper?: ImageCarouselReactWrapper;
}

export class ImageCarousel extends React.Component<ImageCarouselProps, ImageCarouselState> {
    public static defaultProps: ImageCarouselProps = {
        controls: true,
        height: 350,
        indicators: true,
        interval: 5000, // in milliseconds
        pauseOnHover: true,
        slide: true, // seems faulty. Consider removing it
        width: 500,
    };
    private carouselStyle = {
        height: this.props.height,
        width: this.props.width,
    };
    private loaded: boolean;
    constructor(props: ImageCarouselProps) {
        super(props);
        // bind context
        autoBind(this);
        this.loaded = false;
        this.state = {
            data : [],
            dataStatic: [],
        };
    }

    public componentWillMount () {
        logger.debug(this.props.widgetId + " .componentWillMount");
        this.getCarouselData();
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
        if (this.loaded || this.state.dataStatic.length > 0) {
            return (
                <div style={this.carouselStyle}>
                    <ReactBootstrap.Carousel {...carouselProps} >
                        {this.mapCarouselData()}
                    </ReactBootstrap.Carousel>
                </div>
            );
        } else {
            return (
                <div style={this.carouselStyle}>
                    Loading ...
                </div>
            );
        }
     }
    // call the microflow and returns data if any
    private callMicroflow(actionMF?: string, constraint?: string, successCallback?: Function, failureCallback?: Function): void {
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
    private successCallback(obj: Array<mendix.lib.MxObject>) {
        logger.debug(this.props.widgetId + ".successCallback");
        if (typeof obj !== "undefined" ) {
            this.loaded = true;
            this.setState({ data: obj, dataStatic: [] });
        }
    }
    private mapCarouselData() {
        logger.debug(this.props.widgetId + ".mapCarouselData");
        const staticData = this.state.dataStatic;
        const data = this.state.data;
        let itemProps: ItemProps;
        if (staticData.length > 0) {
            return staticData.map((itemObj) => {
                const caption = itemObj.imgCaption;
                itemProps = {
                    alt: caption,
                    caption,
                    description: itemObj.imgdescription,
                    imgStyle: this.carouselStyle,
                    key: this.generateRandom(),
                    onClick: this.onItemClick,
                    src: itemObj.picture,
                };
                return (this.getCarouselItem(itemProps));
            });
        } else if (data.length > 0) {
            return data.map((itemObj) => {
                const props = this.props;
                const caption = itemObj.get(props.captionAttr) as string;
                itemProps = {
                    alt: caption,
                    caption,
                    description: itemObj.get(props.descriptionAttr) as string,
                    imgStyle: this.carouselStyle,
                    key: itemObj.getGuid(),
                    onClick: this.onItemClick,
                    src: this.getFileUrl(itemObj.getGuid()),
                };
                return (this.getCarouselItem(itemProps));
            });
        }
    }
    private getCarouselItem (itemProps: ItemProps) {
        logger.debug(this.props.widgetId + ".getCarouselItem");
        return (
            <ReactBootstrap.Carousel.Item
                onClick={itemProps.onClick}
                key={itemProps.key}
            >
                <img style={itemProps.imgStyle} alt={itemProps.alt} src={itemProps.src}/>
                <ReactBootstrap.Carousel.Caption>
                    <h3>{itemProps.caption}</h3>
                    <p>{itemProps.description}</p>
                </ReactBootstrap.Carousel.Caption>
            </ReactBootstrap.Carousel.Item>
        );
    }
    private getFileUrl (objectId: string) {
        logger.debug(this.props.widgetId + ".getFileUrl");
        let url: string;
        if (objectId) {
            url =  "file?target=window&guid=" + objectId + "&csrfToken=" + mx.session.getCSRFToken() + "&time=" + Date.now();
        }
        return url;
    }
    private onItemClick() {
        logger.debug(this.props.widgetId + ".onItemClick");
        if (this.props.imageClick) {
            this.callMicroflow(this.props.imageClick);
        }
        if (this.props.openPage) {
            mx.ui.openForm(this.props.openPage, {
                callback: () => {
                    logger.debug(this.props.widgetId + ": Page opened Successfully");
                },
            });
         }
    }
    private getCarouselData() {
        logger.debug(this.props.widgetId + ".getCarouselData");
        if (this.props.entityConstraint) {
            this.callMicroflow("", this.props.entityConstraint, this.successCallback);
        } else if (this.props.dataSourceMicroflow) {
            this.callMicroflow(this.props.dataSourceMicroflow, "", this.successCallback);
        } else if (this.props.imgcollection) {
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
