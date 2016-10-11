
import * as React from "Carousel/lib/react";

import ImageCarouselModelProps, { HeightUnits, OnClickEvent,
    PageLocation, StaticImageCollection, WidthUnits } from "./../../Carousel.d";
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
    private errorMessage: string = "";
    constructor(props: ImageCarouselProps) {
        super(props);
        this.onItemClick = this.onItemClick.bind(this);
        this.validate = this.validate.bind(this);
        this.loaded = false;
        this.state = {
            hasData: false,
            itemsProps: [],
        };
    }
    public componentWillMount() {
        this.checkConfig();
    }
    /**
     * Validate the widget configurations from the modeler
     */
    private checkConfig() {
        if (this.props.imageSource === "microflow" && !this.props.dataSourceMicroflow) {
            this.errorMessage += " \n Image Source is set to MicroFlow " +
                                 " and No Microflow specified in Tab 'Source - Microflow' ";
        }
        if (this.props.imageSource === "static" && this.props.staticImageCollection.length < 1) {
            this.errorMessage += " \n Image Source is set to Static and No Images specified in Tab 'Source - Static'";
        }
        if (this.props.imageSource === "xpath" && !this.props.imageEntity) {
            this.errorMessage += " \n Image 'Source' is set to XPath and there is no 'Entity' selected";
        }
        if (!this.props.requiresContext && this.props.entityConstraint.indexOf("[%CurrentObject%]") > -1) {
            this.errorMessage += " \n Unexpected constraint to CurrentObject in Tab 'Source - XPath'";
        }
        if (this.props.onClickEvent === "callMicroflow" && !this.props.callMicroflow) {
            this.errorMessage += " \n 'On Click' call a microFlow is set" +
                                 " and there is no 'Call Microflow' Selected in Tab Events";
        }
        if (this.props.onClickEvent === "openPage" && !this.props.pageForm) {
            this.errorMessage += "\n 'On Click' Show a page is set and there is no 'Page' Selected in Tab 'Events'";
        }
        this.props.staticImageCollection.forEach(this.validate);
        if (this.errorMessage) {
            mx.ui.error("Error in Configuration of Widget " + this.props.widgetId + this.errorMessage);
        }
    }
    public validate(element: StaticImageCollection, index: number) {
            if (element.onClickEvent === "callMicroflow" && !element.callMicroflow) {
                    this.errorMessage += " \n Item " + (index + 1) + " 'On Click' call a microFlow is set " +
                                        "and there is no 'Call Microflow' Selected";
            }
            if (element.onClickEvent === "openPage" && !element.pageForm) {
                   this.errorMessage += " \n Item " + (index + 1) + " 'On Click' Show a page is set " +
                                        "and there is no 'Page' Selected";
           }
    }
    /**
     * React Component method that renders the interface once the component has mounted
     */
    public render() {
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
        if (onClickProps.onClickEvent === "callMicroflow" && onClickProps.microflow) {
            this.executeMicroflow(onClickProps.microflow, onClickProps.guid);
        } else if (onClickProps.onClickEvent === "openPage" && onClickProps.page) {
            this.showPage({
                guid: onClickProps.guid,
                pageLocation: onClickProps.pageLocation,
                pageName: onClickProps.page,
            });
        }
    }
    private executeMicroflow(name: string, guid?: string) {
        mx.ui.action(name, {
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
        return "file?target=window&guid=" + objectId + "&csrfToken=" +
                    mx.session.getCSRFToken() + "&time=" + Date.now();
    }
    /**
     * Creates an array of properties that we be used to create the Carousel items
     */
    private getPropsFromStatic(): ItemProps[] {
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
