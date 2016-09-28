import * as React from "ImageCarouselReact/lib/react";

import * as ReactBootstrap from "ImageCarouselReact/lib/react-bootstrap";

import { Idata } from "./../ImageCarouselReact";

import Carousel from "./Carousel";
import CarouselCaption from "./CarouselCaption";
import CarouselItem from "./CarouselItem";

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
    onClickEvent?: string;
    location?: string;
    context?: string;
    guid?: string;
}
interface IExecutionProps {
    actionMF?: string;
    constraint?: string;
    successCallback?: Function;
}
// TODO rework props interfaces.
interface IOnclickProps {
    guid?: string;
    page?: string;
    clickMF?: string;
    location?: string;
    onClickEvent?: string;
}

interface ImageCarouselModelProps {
    imgcollection?: Array<IStaticImages>;
    widgetId?: string;
    imageEntity?: string;
    imageSource?: string;
    entityConstraint?: string;
    data?: Idata[];
    dataSourceMicroflow?: string;
    captionAttr?: string;
    descriptionAttr?: string;
    controls?: boolean;
    indicators?: boolean;
    interval?: number;
    onClickEvent?: string;
    openPage?: string;
    location?: string;
    pauseOnHover?: boolean;
    slide?: boolean;
    imageClickMicroflow?: string;
    imageClickObjectMicroflow?: string;
    width?: number;
    height?: number;
    isLoading?: boolean;

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
    requiresContext?: boolean;
}

export class ImageCarousel extends React.Component<ImageCarouselProps, {}> {
    public static defaultProps: ImageCarouselProps = {
        controls: true,
        height: 350, // Default Height of both the Carousel and image in pixels
        indicators: true,
        interval: 5000, // in milliseconds
        pauseOnHover: true,
        slide: true, // seems faulty. Consider removing it
        width: 500, // Default width of both the Carousel and image in pixels
    };
    /**
     * Height and width to be passed to the carousel Component/ the container for the items/images
     */
    private carouselStyle = {
        height: this.props.height,
        width: this.props.width,
    };
    /**
     * Height and width to be passed to the carousel items/images
     */
    private carouselItemStyle = {
        height: this.props.height,
        width: this.props.width,
    };
    private loaded: boolean;
    constructor(props: ImageCarouselProps) {
        super(props);
        // TODO Verify all binding manually to the functions
        this.onItemClick = this.onItemClick.bind(this);
        // this.setPropsFromObjects = this.setPropsFromObjects.bind(this);
        this.loaded = false;
        this.state = {
            hasData: false,
            itemsProps: [],
        };
    }
    public componentWillMount() {
        logger.debug(this.props.widgetId + " .componentWillMount");
        this.checkConfig();
    }
    /**
     * Validate the widget configurations from the modeler
     */
    private checkConfig() {
        if (this.props.imageSource === "microflow" && !this.props.dataSourceMicroflow) {
            mx.ui.error("Error in Configuration of Widget " + this.props.widgetId +
                        " Image Source is set to MicroFlow and No Micoflow specified in Tab 'Source - Microflow' ");
        }
        if (this.props.imageSource === "static" && !this.props.imgcollection) {
            mx.ui.error("Error in Configuration of Widget " + this.props.widgetId +
                        " Image Source is set to Static and No Images specified in Tab 'Source - Static'");
        }
        if (this.props.onClickEvent === "microflow" && !this.props.imageClickMicroflow) {
            mx.ui.error("Error in Configuration of Widget " + this.props.widgetId +
                        " 'On Click' call MicroFlow is set and there is no 'Call Microflow' Selected");
        }
        if (["content", "popup", "modal"].indexOf(this.props.onClickEvent) > -1 && !this.props.openPage) {
            mx.ui.error("Error in Configuration of Widget " + this.props.widgetId +
                        " 'On Click' Open Page, Popup Blocking or Popup is set and there is no 'Open Page' Selected");
        }
        if (this.props.imageSource === "xpath" && !this.props.imageEntity) {
             mx.ui.error("Error in Configuration of Widget " + this.props.widgetId +
                        " Image 'Source' is set to XPath and there is no 'Entity' selected");
        }
        // TODO check for configurations on static images for OnClick and Open Page
    }
    public componentWillUpdate() {
        // logger.debug(this.props.widgetId + " .componentWillUpdate");
        //  this.getCarouselData();
    }
    /**
     * React Component method that renders the interface once the component has mounted
     */
    public render() {
        logger.debug(this.props.widgetId + ".render");
        const carouselProps = {
            controls: this.props.controls,
            indicators: this.props.indicators,
            interval: this.props.interval,
            pauseOnHover: this.props.pauseOnHover,
            slide: this.props.slide,
        };
        const itemProps = this.getPropsFromData();
        if (this.props.data.length > 0) {
            // Returned when there is data/images
            const classes = this.props.widgetId + " image-carousel-react";
            return (
                <div style={this.carouselStyle} className={classes}>
                    <Carousel {...carouselProps} >
                        {itemProps.map((prop) => this.getCarouselItem(prop))}
                    </Carousel>
                </div>
            );
        } else if (this.props.isLoading) {
            // returned when its still loading
            const classes = this.props.widgetId + " image-carousel-loading";
            return (
                <div style={this.carouselStyle} className={classes}>
                    Loading ...
                </div>
            );
        } else {
            // returned when there is no data/images
            const classes = this.props.widgetId + " image-carousel-nodata";
            return (<div className={classes}> </div>);
        }
    }
    /**
     * Creates a Carousel item based on the properties passed
     */
    private getCarouselItem(itemProps: ItemProps) {
        logger.debug(this.props.widgetId + ".getCarouselItem");
        return (
            <CarouselItem
                onClick={itemProps.onClick}
                key={itemProps.key}
                >
                <img style={itemProps.imgStyle} alt={itemProps.alt} src={itemProps.src} />
                <CarouselCaption>
                    <h3>{itemProps.caption}</h3>
                    <p>{itemProps.description}</p>
                </CarouselCaption>
            </CarouselItem>
        );
    }
    /**
     * Handles the onlick for carousel items
     */
    private onItemClick(onClickProps?: IOnclickProps) {
        logger.debug(this.props.widgetId + ".onItemClick");
        if (onClickProps.onClickEvent === "microflow" && onClickProps.clickMF) {
            this.clickMicroflow(onClickProps.clickMF, onClickProps.guid);
        } else if (["content", "popup", "modal"].indexOf(onClickProps.onClickEvent) > -1 &&
            onClickProps.page) {
            this.showPage({
                guid: onClickProps.guid,
                location: onClickProps.onClickEvent,
                pageName: onClickProps.page,
            });
        } else {
            logger.debug(this.props.widgetId + ".onItemClick ignored");
        }
    }
    /**
     * Executes the Onclick event, call microflow . 
     * TODO add origin for close event on MF
     */
    private clickMicroflow(name: string, guid?: string) {
        let params: {
            actionname: string,
            applyto?: string,
            guids?: string[],
        } = {
                actionname: name,
                applyto: "none",
            };
        if (guid) {
            params.applyto = "selection";
            params.guids = [guid];
        }
        mx.data.action({
            callback: () => {
                logger.debug(this.props.widgetId + ".clickMicroflow callback success");
            },
            error: (error) => {
                logger.error(this.props.widgetId + ": An error occurred while executing microflow: " + error);
            },
            params,
        });
    }
    /**
     * Executes event show a page, adds context if any.
     */
    private showPage(showPageProps: IShowpageProps) {
        let context: mendix.lib.MxContext = null;
        if (showPageProps.guid) {
            context = new mendix.lib.MxContext();
            context.setTrackId(showPageProps.guid);
            context.setTrackEntity(this.props.imageEntity); // TODO should handle context entity?
        }
        mx.ui.openForm(showPageProps.pageName, {
            context,
            location: showPageProps.location,
        });
    }
    /**
     * Creates an array of properities that we be used to create the Carousel items
     */
    private getPropsFromData(): ItemProps[] {
        logger.debug(this.props.widgetId + ".getCarouselItemsFromObject");
        return this.props.data.map((item, index) => {
            // TODO check if we need to pass the onClick event, and on the click event check what to execute.
            return {
                alt: item.caption,
                caption: item.caption,
                description: item.description,
                imgStyle: this.carouselItemStyle,
                key: item.guid ? item.guid : index,
                onClick: this.onItemClick.bind(this, {
                    clickMF: item.onClick.clickMicroflow,
                    guid: item.onClick.guid,
                    onClickEvent: item.onClick.onClickEvent,
                    page: item.onClick.page,
                }),
                src: item.url,
            };
        });
    }
};

export default ImageCarousel;
