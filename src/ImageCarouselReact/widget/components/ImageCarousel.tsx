import * as React from "ImageCarouselReact/lib/react";

import * as ReactBootstrap from "ImageCarouselReact/lib/react-bootstrap";

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
    context?: string;
    callback?: Function;
}
interface IExecutionProps {
    actionMF?: string;
    constraint?: string;
    successCallback?: Function;
}
interface IOnclickProps {
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
    contextId?: string;
}

export class ImageCarousel extends React.Component<ImageCarouselProps, ImageCarouselState> {
    public static defaultProps: ImageCarouselProps = {
        controls: true,
        height: 350, // Default Height of both the Carousel and image in pixels
        indicators: true,
        interval: 5000, // in milliseconds
        pauseOnHover: true,
        slide: true, // seems faulty. Consider removing it
        width: 500, // Default width of both the Carousel and image in pixels
    };
    private carouselStyle = {
        height: this.props.height,
        width: this.props.width,
    };
    private carouselItemStyle = {
        height: this.props.height,
        width: this.props.width,
    };
    private loaded: boolean;
    constructor(props: ImageCarouselProps) {
        super(props);
        // TODO Verify all binding manually to the functions
        this.onItemClick = this.onItemClick.bind(this);
        this.successCallback = this.successCallback.bind(this);
        this.callbackOpenPageSuccess = this.callbackOpenPageSuccess.bind(this);
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
    /**
     * Calls a data source microflow and returns data to the callback function
     * @params {IExecutionProps} executionProps - Expects microflow, constraint if any and a success Callback 
     */
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
            const contraint = executionProps.constraint.replace("[%CurrentObject%]", this.props.contextId);
            if (executionProps.constraint.indexOf("[%CurrentObject%]") !== -1 && this.props.contextId) {
                const xpathString = "//" + this.props.imageEntity + contraint;
                mx.data.get({
                    callback: executionProps.successCallback,
                    error: (error) => {
                        logger.error(this.props.widgetId + ": An error occurred while retrieveing items: " + error);
                    },
                    xpath : xpathString ,
                });
            }
        }
    }
    /**
     * Success callback to handle the results and update state
     */
    private successCallback(obj: Array<mendix.lib.MxObject>) {
        logger.debug(this.props.widgetId + ".successCallback");
        if (typeof obj !== "undefined" ) {
            this.loaded = true;
            this.setState({ data: obj, dataStatic: [] });
        }
    }
    /**
     * Creates and returns carosuel items from both data or Static data
     */
    private mapCarouselData(): JSX.Element[] {
        logger.debug(this.props.widgetId + ".mapCarouselData");
        const staticData = this.state.dataStatic;
        const data = this.state.data;
        let itemProps = Array<ItemProps>();
        if (staticData.length > 0) {
            itemProps = this.getPropsFromStatic();
        } else if (data.length > 0) {
            itemProps = this.getPropsFromObjects();
        }
        return itemProps.map((prop) => this.getCarouselItem(prop));
    }
    /**
     * Returns property Array of Static images
     */
    private getPropsFromStatic(): ItemProps[] {
        logger.debug(this.props.widgetId + ".getCarouselItemsFromStatic");
        const staticData = this.state.dataStatic;
        let  onClickProps: IOnclickProps;
        let itemProps: ItemProps;
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
                imgStyle: this.carouselItemStyle,
                key: this.generateRandom(),
                onClick: this.onItemClick.bind(this, onClickProps),
                src: itemObj.picture,
            };
            return itemProps;
        });

    }
    /**
     * Returns a Property Array of the dynamic objects, objects returned database by micrflow or constraint
     */
    private getPropsFromObjects(): ItemProps[] {
        logger.debug(this.props.widgetId + ".getCarouselItemsFromObject");
        const data = this.state.data;
        let  onClickProps: IOnclickProps;
        let itemProps: ItemProps;
        return data.map((itemObj) => {
            const props = this.props;
            onClickProps = {
                clickMF: this.props.imageClick,
                location: this.props.location,
                page: this.props.openPage,
            };
            const caption = itemObj.get(props.captionAttr) as string;
            itemProps = {
                alt: caption,
                caption,
                description: itemObj.get(props.descriptionAttr) as string,
                imgStyle: this.carouselItemStyle,
                key: itemObj.getGuid(),
                onClick: this.onItemClick.bind(this, onClickProps),
                src: this.getFileUrl(itemObj.getGuid()),
            };
            return itemProps;
        });
    }
    /**
     * Creates a Carousel item based on the properties passed
     */
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
    /**
     * Formats and Returns the object url
     */
    private getFileUrl (objectId: string) {
        logger.debug(this.props.widgetId + ".getFileUrl");
        let url: string;
        if (objectId) {
            url = "file?target=window&guid=" + objectId + "&csrfToken=" +
                    mx.session.getCSRFToken() + "&time=" + Date.now();
        }
        return url;
    }
    /**
     * Handles the onlick for carousel items
     */
    private onItemClick(onClickProps?: IOnclickProps) {
        logger.debug(this.props.widgetId + ".onItemClick");
        if (onClickProps.clickMF) {
            this.executeAction({actionMF: onClickProps.clickMF});
        }else if (onClickProps.page) {
            this.showPage({
                callback: this.callbackOpenPageSuccess,
                location: onClickProps.location,
                pageName: onClickProps.page,
            });
        }else if (this.props.imageClick) {
            this.executeAction({actionMF: this.props.imageClick});
        } else if (this.props.openPage) {
            this.showPage({
                callback: this.callbackOpenPageSuccess,
                location: this.props.location,
                pageName: this.props.openPage,
            });
        }
    }

    private showPage(showPageProps: IShowpageProps) {
        mx.ui.openForm(showPageProps.pageName, {
            callback: showPageProps.callback,
           // context:
            location: showPageProps.location,
        });
    }

    private callbackOpenPageSuccess() {
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
