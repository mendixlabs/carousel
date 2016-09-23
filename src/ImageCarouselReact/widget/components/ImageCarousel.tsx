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
    imgClick?: string;
    OpenPage?: string;
    location?: string;
}
interface IShowpageProps {
    pageName?: string;
    location?: string;
    context?: mendix.lib.MxContext;
    callback?: Function;
}
interface IExecutionProps{
    actionMF?: string;
    constraint?: string;
    successCallback?: Function;
}
interface IOnclickProps{
    page?: string;
    clickMF?: string;
    location?: string;
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
    location?: string;
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
    private executeAction(executionProps: IExecutionProps): void {
        logger.debug(this.props.widgetId + ".executeAction");
        if (executionProps.actionMF !== "") {
            mx.data.action({
                callback: executionProps.successCallback,
                error: (error) => {
                    logger.error(this.props.widgetId + ": An error occurred while executing microflow: " + error);
                },
                params: {
                    actionname: executionProps.actionMF,
                },
            });
        }else if (executionProps.constraint !== "") {
            const xpathString = "//" + this.props.imageEntity + executionProps.constraint;
            mx.data.get({
                callback: executionProps.successCallback,
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
        let  onClickProps: IOnclickProps;
        if (staticData.length > 0) {
            return staticData.map((itemObj) => {
                onClickProps = {
                    clickMF: itemObj.imgClick,
                    location: itemObj.location,
                    page: itemObj.OpenPage,
                };
                const caption = itemObj.imgCaption;
                itemProps = {
                    alt: caption,
                    caption,
                    description: itemObj.imgdescription,
                    imgStyle: this.carouselStyle,
                    key: this.generateRandom(),
                    onClick: this.onItemClick.bind(this, onClickProps),
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
    private onItemClick(onClickProps?: IOnclickProps) {
        logger.debug(this.props.widgetId + ".onItemClick");
        if (onClickProps.clickMF) {
            this.executeAction({actionMF: onClickProps.clickMF});
        }else if (onClickProps.page) {
            this.showPage({callback: this.callback, location: onClickProps.location, pageName: onClickProps.page});
        }else if (this.props.imageClick) {
            this.executeAction({actionMF: this.props.imageClick});
        } else if (this.props.openPage) {
            this.showPage({callback: this.callback, location: this.props.location, pageName: this.props.openPage});
        }
    }

    private showPage(showPageProps: IShowpageProps){
        mx.ui.openForm(showPageProps.pageName, {
            callback: showPageProps.callback,
            location: showPageProps.location,
        });
    }

    private callback() {
        logger.debug(this.props.widgetId + ": Page opened Successfully");
    }

    private getCarouselData() {
        logger.debug(this.props.widgetId + ".getCarouselData");
        let executionProps: IExecutionProps;
        if (this.props.entityConstraint || this.props.dataSourceMicroflow ) {
             executionProps = {
                actionMF: this.props.dataSourceMicroflow,
                constraint: this.props.entityConstraint,
                successCallback: this.successCallback,
             };
             this.executeAction(executionProps);
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
