
import * as React from "Carousel/lib/react";

import ImageCarouselModelProps, { HeightUnits, OnClickEvent,
    PageLocation, WidthUnits } from "./../../Carousel.d";
import { Data } from "./../Carousel";

import Carousel, { CarouselProps } from "./Carousel";
import CarouselCaption from "./CarouselCaption";
import { CarouselItem, CarouselItemProps } from "./CarouselItem";

interface ShowPageProps {
    pageName?: string;
    onClickEvent?: OnClickEvent;
    pageLocation?: PageLocation;
    context?: string;
    guid?: string;
}

interface OnClickProps {
    guid?: string;
    page?: string;
    microflow?: string;
    pageLocation?: PageLocation;
    onClickEvent?: OnClickEvent;
}

interface ItemProps extends CarouselItemProps {
    key: string | number;
    imgStyle: Object;
    alt: string;
    src: string;
    caption: string;
    description: string;
}

/**
 * All properties of Image Carousel, 
 * Including all props from the modeler, and props from react.
 */
export interface ImageCarouselProps extends ImageCarouselModelProps {
    contextId?: string;
    data?: Data[];
    isLoading?: boolean;
    requiresContext?: boolean;
    widgetId?: string;
}

export class ImageCarousel extends React.Component<ImageCarouselProps, {}> {
    public static defaultProps: ImageCarouselProps = {
        height: 350, // Default Height of both the Carousel and image in pixels
        interval: 5000, // in milliseconds
        width: 500, // Default width of both the Carousel and image in pixels
    };
    /**
     * Height and width to be passed to the carousel Component/ the container for the items/images
     */
    private carouselStyle = {
        height: this.getValueFromUnits(this.props.height, this.props.heightUnits),
        width: this.getValueFromUnits(this.props.width, this.props.widthUnits),
    };
    /**
     * Height and width to be passed to the carousel items/images
     */
    private carouselItemStyle = {
        height: this.getValueFromUnits(this.props.height, this.props.heightUnits, true),
        width: this.getValueFromUnits(this.props.width, this.props.widthUnits, true),
    };
    private loaded: boolean;
    constructor(props: ImageCarouselProps) {
        super(props);
        this.onItemClick = this.onItemClick.bind(this);
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
                        " Image Source is set to MicroFlow and No Microflow specified in Tab 'Source - Microflow' ");
        }
        if (this.props.imageSource === "static" && this.props.staticImageCollection.length < 1) {
            mx.ui.error("Error in Configuration of Widget " + this.props.widgetId +
                        " Image Source is set to Static and No Images specified in Tab 'Source - Static'");
        }
        if (this.props.imageSource === "xpath" && !this.props.imageEntity) {
             mx.ui.error("Error in Configuration of Widget " + this.props.widgetId +
                        " Image 'Source' is set to XPath and there is no 'Entity' selected");
        }
        if (this.props.onClickEvent === "callMicroflow" && !this.props.callMicroflow) {
            mx.ui.error("Error in Configuration of Widget " + this.props.widgetId +
                        " 'On Click' call a microFlow is set and there is no 'Call Microflow' Selected");
        }
        if (this.props.onClickEvent === "openPage" && !this.props.pageForm) {
            mx.ui.error("Error in Configuration of Widget " + this.props.widgetId +
                        " 'On Click' Show a page is set and there is no 'Page' Selected");
        }
        // TODO check for configurations on static images for OnClick and Open Page
        // TODO show error when non context version has a constraint with CurrentObject
    }
    /**
     * React Component method that renders the interface once the component has mounted
     */
    public render() {
        logger.debug(this.props.widgetId + ".render");
        const carouselProps: CarouselProps = {
            interval: this.props.interval,
        };
        const itemProps = this.props.imageSource === "static" ?
            this.getPropsFromStatic() : this.getPropsFromData();
        const classes = this.props.widgetId + " mx-image-carousel";
        if (itemProps.length > 0) {
            // Has images
            return (
                <div style={this.carouselStyle} className={classes}>
                    <Carousel {...carouselProps} >
                        {itemProps.map((prop) => this.getCarouselItem(prop))}
                    </Carousel>
                </div>
            );
        } else if (this.props.isLoading) {
            // Images loading 
            return (
                <div style={this.carouselStyle} className={classes + " image-carousel-loading"}>
                    Loading ...
                </div>
            );
        } else {
            // Has no images
            return (<div className={classes + "image-carousel-no-data"}> </div>);
        }
    }
    /**
     * Processes the heights and width values depending on type of units
     * TODO this will work but fail when the to types are not equal anymore.
     */
    private getValueFromUnits(value: number, type: WidthUnits | HeightUnits, isInner?: boolean): number|string {
        if (type === "auto") {
            return "";
        }
        if (isInner && type === "percent" ) {
            return "100%";
        }
        if (type === "percent") {
            return value + "%";
        }
        return value;
    }
    /**
     * Creates a Carousel item based on the properties passed
     */
    private getCarouselItem(itemProps: ItemProps) {
        logger.debug(this.props.widgetId + ".getCarouselItem");
        return (
            <CarouselItem onClick={itemProps.onClick} key={itemProps.key}>
                <img style={this.carouselItemStyle} alt={itemProps.alt} src={itemProps.src} />
                <CarouselCaption> <h3>{itemProps.caption}</h3> <p>{itemProps.description}</p> </CarouselCaption>
            </CarouselItem>
        );
    }
    /**
     * Handles the onclick for carousel items
     */
    private onItemClick(onClickProps: OnClickProps) {
        logger.debug(this.props.widgetId + ".onItemClick");
        if (onClickProps.onClickEvent === "callMicroflow" && onClickProps.microflow) {
            this.executeMicroflow(onClickProps.microflow, onClickProps.guid);
        } else if (onClickProps.onClickEvent === "openPage" && onClickProps.page) {
            this.showPage({
                guid: onClickProps.guid,
                pageLocation: onClickProps.pageLocation,
                pageName: onClickProps.page,
            });
        } else {
            logger.debug(this.props.widgetId + ".onItemClick ignored");
        }
    }
    private executeMicroflow(name: string, guid?: string) {
        mx.ui.action(name, {
            callback: () => logger.debug(this.props.widgetId + ".clickMicroflow callback success"),
            error: error => {
                logger.error(this.props.widgetId + ": An error occurred while executing microflow: ", error);
                mx.ui.error("Error occurred during handling the microflow " + name);
            },
            params: {
                applyto: guid ? "selection" : "none",
                guids: guid ? [ guid ] : undefined,
            },
        });
    }
    private showPage(showPageProps: ShowPageProps) {
        let context: mendix.lib.MxContext = null;
        if (showPageProps.guid) {
            context = new mendix.lib.MxContext();
            context.setTrackId(showPageProps.guid);
            context.setTrackEntity(this.props.imageEntity);
        }
        mx.ui.openForm(showPageProps.pageName, {
            context,
            location: showPageProps.pageLocation,
        });
    }
    /**
     * Creates an array of properties that we be used to create the Carousel items
     */
    private getPropsFromData(): ItemProps[] {
        logger.debug(this.props.widgetId + ".getCarouselItemsFromObject");
        return this.props.data.map((item, index) => {
            const clickObject: OnClickProps = {
                    guid: item.guid,
                    microflow: this.props.callMicroflow,
                    onClickEvent: this.props.onClickEvent,
                    page: this.props.pageForm,
                    pageLocation: this.props.pageLocation,
                };
            return {
                alt: item.caption,
                caption: item.caption,
                description: item.description,
                imgStyle: this.carouselItemStyle,
                key: item.guid,
                onClick: () => this.onItemClick(clickObject),
                src: this.getFileUrl(item.guid),
            };
        });
    }
    /**
     * Returns a image url from the object Id.
     */
    private getFileUrl(objectId: string): string {
        logger.debug(this.props.widgetId + ".getFileUrl");
        return "file?target=window&guid=" + objectId + "&csrfToken=" +
                    mx.session.getCSRFToken() + "&time=" + Date.now();
    }
    /**
     * Creates an array of properties that we be used to create the Carousel items
     */
    private getPropsFromStatic(): ItemProps[] {
        logger.debug(this.props.widgetId + ".getCarouselItemsFromObject");
        return this.props.staticImageCollection.map((item, index) => {
            const clickObject: OnClickProps = {
                    guid: this.props.contextId,
                    microflow: item.callMicroflow,
                    onClickEvent: item.onClickEvent,
                    page: item.pageForm,
                    pageLocation: item.pageLocation,
                };
            return {
                alt: item.caption,
                caption: item.caption,
                description: item.description,
                imgStyle: this.carouselItemStyle,
                key: index,
                onClick: () => this.onItemClick(clickObject),
                src: item.pictureUrl,
            };
        });
    }
}

export default ImageCarousel;
