import * as React from "ImageCarouselReact/lib/react";

import * as ReactBootstrap from "ImageCarouselReact/lib/react-bootstrap";

import {Idata} from "./../ImageCarouselReact";

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

interface ImageCarouselModelProps  {
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
    openPage?: string;
    location?: string;
    pauseOnHover?: boolean;
    slide?: boolean;
    imageClickMicroflow?: string;
    imageClickObjectMicroflow?: string;
    width?: number;
    height?: number;

}

interface ImageCarouselState {
    hasData?: boolean;
    loading?: boolean;
    itemsProps?: ItemProps[];
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
        // this.setPropsFromObjects = this.setPropsFromObjects.bind(this);
        this.loaded = false;
        this.state = {
            hasData: false,
            itemsProps: [],
            loading : true,
        };
    }
    public componentWillMount () {
        logger.debug(this.props.widgetId + " .componentWillMount");
        this.checkConfig();
    }
    private checkConfig() {
        // TODO implement config checks.
    }
    public componentWillUpdate () {
        // logger.debug(this.props.widgetId + " .componentWillUpdate");
        //  this.getCarouselData();
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
        const itemProps = this.getPropsFromData();
        if (this.props.data.length > 0) {
            return (
                <div style={this.carouselStyle} className="{this.props.widgetId}">
                    <ReactBootstrap.Carousel {...carouselProps} >
                        {itemProps.map((prop) => this.getCarouselItem(prop))}
                    </ReactBootstrap.Carousel>
                </div>
            );
        } else if (this.state.loading) {
            return (
                <div style={this.carouselStyle} className="{this.props.widgetId}">
                    Loading ...
                </div>
            );
        } else {
            return <div className="{this.props.widgetId}"/>;
        }
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
     * execute click event. 
     * TODO add origin for close event on MF
     */
    private clickMicroflow(name: string, guid?: string) {
        let params = {
                actionname: name,
                applyto: "none",
                guids: [""],
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
            params: params,
        });
    }
    /**
     * Show a page, add context if any.
     */
    private showPage(showPageProps: IShowpageProps) {
        let context: mendix.lib.MxContext = null;
        if (showPageProps.guid) {
            context = new mendix.lib.MxContext();
            context.setTrackId(showPageProps.guid);
            context.setTrackEntity(this.props.imageEntity); // TODO should handle context entity?
        }
        mx.ui.openForm(showPageProps.pageName, {
            context: context,
            location: showPageProps.location,
        });
    }

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

    /*
     * Formats and Returns the object url
     
    private getFileUrl (objectId: string) {
        logger.debug(this.props.widgetId + ".getFileUrl");
        let url: string;
        if (objectId) {
            url = "file?target=window&guid=" + objectId + "&csrfToken=" +
                    mx.session.getCSRFToken() + "&time=" + Date.now();
        }
        return url;
    } */

    /*
     * Get the data for the carousel, depending ot the sour tyep
     
    private getCarouselData() {
        logger.debug(this.props.widgetId + ".getCarouselData");
        if (this.props.imageSource === "xpath" ) {
            this.getDataFromXpath();
        } else if (this.props.imageSource === "microflow"  ) {
             this.getDataFromMircroflow();
        } else if (this.props.imageSource === "static"  ) {
            this.getDataFromStatic();
        } else {
            logger.error(this.props.widgetId + ".getCarouselData unknow image source " + this.props.imageSource);
        }
    }
    /*
     * retreive the carousel data based on data geth with xpath contraint if any.
     * Could us [%CurrentObject%]
    
    private getDataFromXpath () {
        logger.debug(this.props.widgetId + ".getDataFromXpath");
        if (this.props.requiresContext && this.props.contextId === "") {
            // case there is not context ID the xpath will fail, so it should always show no images.
            logger.debug(this.props.widgetId + ".getDataFromXpath empty context");
            this.setPropsFromObjects([]);
        } else {
            const contraint = this.props.entityConstraint.replace("[%CurrentObject%]", this.props.contextId);
            const xpathString = "//" + this.props.imageEntity + contraint;
            mx.data.get({
                callback: this.setPropsFromObjects,
                error: (error) => {
                    logger.error(this.props.widgetId + ": An error occurred while retrieveing items: " + error);
                },
                xpath : xpathString,
            });
        }
    }
    /*
     * retreive the data based on the MF
    
    private getDataFromMircroflow() {
        logger.debug(this.props.widgetId + ".getDataFromMircroflow");
        if (this.props.requiresContext && this.props.contextId === "") {
            // case there is not context ID the xpath will fail, so it should always show no images.
            logger.debug(this.props.widgetId + ".getDataFromMircroflow, empy context");
            this.setPropsFromObjects([]);
        } else {
            let params = {
                actionname: this.props.dataSourceMicroflow,
                applyto: "none",
                guids: [""],
            };
            if (this.props.requiresContext) {
                params.applyto = "selection";
                params.guids = [this.props.contextId];
            }
            mx.data.action({
                callback: this.setPropsFromObjects,
                error: (error) => {
                    logger.error(this.props.widgetId + ": An error occurred while executing microflow: " + error);
                },
                params: {
                    actionname: this.props.dataSourceMicroflow,
                },
            });
        }
    }
   
    /*
     * transforms mendix object into item properties ans set new state
    
    private setPropsFromObjects(objs: Array<mendix.lib.MxObject>): void {
        logger.debug(this.props.widgetId + ".getCarouselItemsFromObject");
        let  onClickProps: IOnclickProps;
        let itemPropList: ItemProps[] = [];
        itemPropList = objs.map((itemObj) => {
            const props = this.props;
            onClickProps = {
                clickMF: this.props.imageClickMicroflow,
                guid: itemObj.getGuid(),
                location: this.props.location,
                page: this.props.openPage,
            };
            const caption = itemObj.get(props.captionAttr) as string;
            let itemProps: ItemProps = {
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
        this.setState({
            hasData: itemPropList.length > 0 ? true : false,
            itemsProps: itemPropList,
            loading: false,
        });
    }
    /*
     * iterate over modeler setting of the static images for props and set state
     
    private getDataFromStatic() {
        logger.debug(this.props.widgetId + ".getPropsFromObjects");
        let itemPropList: ItemProps[] = [];
        itemPropList = this.props.imgcollection.map((itemObj, index) => {
            let onClickProps = {
                clickMF: itemObj.imgClick,
                location: itemObj.location,
                page: itemObj.OpenPage,
            };
            const caption = itemObj.imgCaption;
            let itemProp: ItemProps = {
                alt: caption,
                caption,
                description: itemObj.imgdescription,
                imgStyle: this.carouselItemStyle,
                key: index,
                onClick: this.onItemClick.bind(this, onClickProps),
                src: itemObj.picture,
            };
            return itemProp;
        });
        this.setState({
            hasData: itemPropList.length > 0 ? true : false,
            itemsProps: itemPropList,
            loading: false,
        });
    } */
};

export default ImageCarousel;
