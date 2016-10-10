
import * as React from "Carousel/lib/react";

import ImageCarouselModelProps, { HeightUnits, ImageSource, OnClickEvent, PageLocation,
    StaticImageCollection, WidthUnits } from "./../../Carousel";
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
export interface StaticImageCollectionWithEnums extends StaticImageCollection {
        onClickEventEnum?: OnClickEvent;
        pageLocationEnum?: PageLocation;
}
export interface ImageCarouselProps extends ImageCarouselModelProps {
    contextId?: string;
    data?: Data[];
    isLoading?: boolean;
    requiresContext?: boolean;
    widgetId?: string;
    imageSourceEnum?: ImageSource;
    onClickEventEnum?: OnClickEvent;
    pageLocationEnum?: PageLocation;
    widthUnitsEnum?: WidthUnits;
    heightUnitsEnum?: HeightUnits;
    staticImageCollection?: StaticImageCollectionWithEnums[];
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
        height: this.getValueFromUnits(this.props.height, this.props.heightUnitsEnum),
        width: this.getValueFromUnits(this.props.width, this.props.widthUnitsEnum),
    };
    /**
     * Height and width to be passed to the carousel items/images
     */
    private carouselItemStyle = {
        height: this.getValueFromUnits(this.props.height, this.props.heightUnitsEnum, true),
        width: this.getValueFromUnits(this.props.width, this.props.widthUnitsEnum, true),
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
        if (this.props.imageSourceEnum === ImageSource.microflow && !this.props.dataSourceMicroflow) {
            mx.ui.error("Error in Configuration of Widget " + this.props.widgetId +
                        " \n Image Source is set to MicroFlow and No Microflow specified in Tab 'Source - Microflow' ");
        }
        if (this.props.imageSourceEnum === ImageSource.static && this.props.staticImageCollection.length < 1) {
            mx.ui.error("Error in Configuration of Widget " + this.props.widgetId +
                        " \n Image Source is set to Static and No Images specified in Tab 'Source - Static'");
        }
        if (this.props.imageSourceEnum === ImageSource.xpath && !this.props.imageEntity) {
             mx.ui.error("Error in Configuration of Widget " + this.props.widgetId +
                        " \n Image 'Source' is set to XPath and there is no 'Entity' selected");
        }
        if (!this.props.requiresContext && this.props.entityConstraint.indexOf("[%CurrentObject%]") > -1) {
            mx.ui.error("Error in Configuration of Widget " + this.props.widgetId +
                        " \n Unexpected constraint to CurrentObject in Tab 'Source - XPath'");
        }
        if (this.props.onClickEventEnum === OnClickEvent.callMicroflow && !this.props.callMicroflow) {
            mx.ui.error("Error in Configuration of Widget " + this.props.widgetId +
                        " \n 'On Click' call a microFlow is set and there is no 'Call Microflow' Selected");
        }
        if (this.props.onClickEventEnum === OnClickEvent.openPage && !this.props.pageForm) {
            mx.ui.error("Error in Configuration of Widget " + this.props.widgetId +
                        " \n 'On Click' Show a page is set and there is no 'Page' Selected");
        }
        if (this.props.staticImageCollection.length > 1) {
            this.props.staticImageCollection.forEach(this.validate);
            mx.ui.error("Error in Configuration of Widget " + this.props.widgetId + this.errorMessage);
        }
    }
    public validate(element: StaticImageCollectionWithEnums, index: number, array: StaticImageCollectionWithEnums[]) {
            if (element.onClickEvent === OnClickEvent[OnClickEvent.callMicroflow] && !element.callMicroflow) {
                    this.errorMessage = this.errorMessage +
                                        " \n Item " + (index + 1) + " 'On Click' call a microFlow is set " +
                                        "and there is no 'Call Microflow' Selected";
            }
            if (element.onClickEvent === OnClickEvent[OnClickEvent.openPage] && !element.pageForm) {
                   this.errorMessage = this.errorMessage +
                                       " \n Item " + (index + 1) + " 'On Click' Show a page is set " +
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
        const itemProps = this.props.imageSourceEnum === ImageSource.static ?
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
        if (type === WidthUnits.auto || type === HeightUnits.auto) {
            return "";
        }
        if (isInner && (type === WidthUnits.percent || type === HeightUnits.percent)) {
            return "100%";
        }
        if (type === WidthUnits.percent || type === HeightUnits.percent) {
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
        if (onClickProps.onClickEvent === OnClickEvent.callMicroflow && onClickProps.microflow) {
            this.executeMicroflow(onClickProps.microflow, onClickProps.guid);
        } else if (onClickProps.onClickEvent === OnClickEvent.openPage && onClickProps.page) {
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
            location: PageLocation[showPageProps.pageLocation],
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
                    onClickEvent: this.props.onClickEventEnum,
                    page: this.props.pageForm,
                    pageLocation: this.props.pageLocationEnum,
                };
            return {
                alt: item.caption,
                caption: item.caption,
                description: item.description,
                imgStyle: this.carouselItemStyle,
                key: item.guid,
                onClick: this.onItemClick.bind(this, clickObject),
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
                    onClickEvent: item.onClickEventEnum,
                    page: item.pageForm,
                    pageLocation: item.pageLocationEnum,
                };
            return {
                alt: item.caption,
                caption: item.caption,
                description: item.description,
                imgStyle: this.carouselItemStyle,
                key: index,
                onClick: this.onItemClick.bind(this, clickObject),
                src: item.pictureUrl,
            };
        });
    }
}

export default ImageCarousel;
