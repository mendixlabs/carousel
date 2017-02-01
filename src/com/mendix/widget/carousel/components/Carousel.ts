import { Component, DOM, MouseEventHandler, createElement } from "react";
import * as classNames from "classnames";

import { Alert } from "./Alert";
import { CarouselControl } from "./CarouselControl";
import { CarouselItem, ItemStatus } from "./CarouselItem";

import "../ui/Carousel.css";

interface Image {
    url: string;
    onClickMicroflow?: string;
    onClickForm?: string;
}

interface CarouselProps {
    contextGuid?: string;
    dataSource: DataSource;
    dataSourceMicroflow?: string;
    entityConstraint?: string;
    staticImages: Image[];
    imagesEntity?: string;
    onClickOptions?: ClickOptions;
    onClickMicroflow?: string;
    onClickForm?: string;
}

interface CarouselState {
    activeIndex: number;
    images?: Image[];
    alertMessage?: string;
    showControls?: boolean;
    position?: number;
    animate?: boolean;
}

interface CustomEvent extends Event {
    detail: {
        originPageX: number;
        originPageY: number;
        pageX: number;
        pageY: number;
    };
    target: HTMLElement;
}

type Direction = "right" | "left";
type DataSource = "static" | "XPath" | "microflow";
type ClickOptions = "doNothing" | "callMicroflow" | "showPage";

class Carousel extends Component<CarouselProps, CarouselState> {
    static defaultProps: CarouselProps = {
        dataSource: "static",
        staticImages: []
    };
    private moveToTheLeft: MouseEventHandler<HTMLDivElement>;
    private moveToTheRight: MouseEventHandler<HTMLDivElement>;
    private carouselWidth: number;
    private carouselItems: HTMLElement[];
    private allItemsAdded: boolean;

    constructor(props: CarouselProps) {
        super(props);

        this.carouselWidth = 0;
        this.carouselItems = [];
        this.allItemsAdded = false;
        this.moveToTheLeft = () => this.moveInDirection("left");
        this.moveToTheRight = () => this.moveInDirection("right");
        this.state = {
            activeIndex: 0,
            alertMessage: this.validateDataSourceProps(),
            animate: false,
            images: this.getCarouselImages(),
            position: 0,
            showControls: this.props.staticImages.length > 1
        };
    }

    render() {
        return DOM.div({ className: "widget-carousel-wrapper" },
            createElement(Alert, { message: this.state.alertMessage }),
            DOM.div({ className: "widget-carousel" },
                DOM.div(
                    {
                        className: classNames("widget-carousel-item-wrapper", { animate: this.state.animate }),
                        style: { transform: `translate3d(${this.state.position}%, 0px, 0px)` }
                    },
                    this.createCarouselItems(this.state.images, this.state.activeIndex || 0)
                ),
                this.createCarouselControls()
            )
        );
    }

    componentDidMount() {
        this.allItemsAdded = true;
        this.registerSwipeEvents();
    }

    private validateDataSourceProps(): string {
        const { contextGuid, dataSource, imagesEntity, staticImages } = this.props;
        if (dataSource === "static" && !staticImages.length) {
            return "At least one static image is required";
        }
        if (dataSource === "XPath" && !imagesEntity) {
            return "The images entity is required";
        }
        if (!contextGuid && this.requiresContext()) {
            return "Invalid XPath: requires a context object but no context is available";
        }
        if (dataSource === "microflow" && !this.props.dataSourceMicroflow) {
            return "A data source microflow is required";
        }

        return "";
    }

    private requiresContext(): boolean {
        const { dataSource, entityConstraint } = this.props;
        return dataSource === "XPath" && !!entityConstraint && entityConstraint.indexOf("[%CurrentObject%]") > -1;
    }

    private createCarouselItems(images: Image[] = [], activeIndex: number) {
        return images.map((image, index) => {
            const { position, status } = this.getItemStatus(index, activeIndex);
            return createElement(CarouselItem, {
                getItemNode: (node: HTMLElement) => this.addCarouselItem(node),
                key: index,
                onClick: () => this.executeAction(image.onClickMicroflow, image.onClickForm),
                position,
                status,
                url: image.url
            });
        });
    }

    private getItemStatus(index: number, activeIndex: number): { position: number, status: ItemStatus } {
        const maxPercentage = 100;
        return {
            position: (index - activeIndex) * maxPercentage,
            status: classNames({
                active: index === activeIndex,
                next: activeIndex < index,
                prev: activeIndex > index
            }) as ItemStatus
        };
    }

    private createCarouselControls() {
        if (!this.state.showControls) return null;

        const images = this.state.images || [];
        const directions: Direction[] = this.state.activeIndex === images.length - 1
            ? [ "left" ]
            : this.state.activeIndex === 0 ? [ "right" ] : [ "right", "left" ];

        return directions.map((direction, index) =>
            createElement(CarouselControl, {
                direction,
                key: index,
                onClick: direction === "right" ? this.moveToTheRight : this.moveToTheLeft
            })
        );
    }

    private getCarouselImages(): Image[] {
        if (this.props.dataSource === "static") {
            return this.props.staticImages;
        }
        if (this.props.dataSource === "XPath" && this.props.imagesEntity) {
            this.fetchImagesByXPath();
        } else if (this.props.dataSource === "microflow" && this.props.dataSourceMicroflow) {
            this.fetchImagesByMicroflow(this.props.dataSourceMicroflow);
        }

        return [];
    }

    private fetchImagesByXPath() {
        if (!this.props.contextGuid && this.requiresContext()) return;

        const constraint = this.props.entityConstraint
            ? this.props.entityConstraint.replace("[%CurrentObject%]", this.props.contextGuid || "")
            : "";

        window.mx.data.get({
            callback: (mxObjects: mendix.lib.MxObject[]) => this.setImagesFromMxObjects(mxObjects),
            error: (error) =>
                this.setState({ alertMessage: `An error occurred while retrieving items: ${error}` }),
            xpath: `//${this.props.imagesEntity}${constraint}`
        });
    }

    private fetchImagesByMicroflow(microflow: string) {
        if (microflow) {
            window.mx.ui.action(microflow, {
                callback: (mxObjects: mendix.lib.MxObject[]) => this.setImagesFromMxObjects(mxObjects),
                error: (error: Error) =>
                    this.setState({ alertMessage: `An error occurred while retrieving images: ${error.message}` }),
                params: {
                    guids: this.props.contextGuid ? [ this.props.contextGuid ] : []
                }
            });
        }
    }

    private setImagesFromMxObjects(mxObjects: mendix.lib.MxObject[]): void {
        const images: Image[] = mxObjects.map((mxObject) => ({
            onClickForm: this.props.onClickOptions === "showPage" ? this.props.onClickForm : undefined,
            onClickMicroflow: this.props.onClickOptions === "callMicroflow" ? this.props.onClickMicroflow : undefined,
            url: this.getFileUrl(mxObject.getGuid())
        }));

        if (images.length) this.setState({ images, showControls: !!images.length });
    }

    private getFileUrl(guid: string): string {
        return guid
            ? `file?target=window&guid=${guid}&csrfToken=${window.mx.session.getCSRFToken()}&time=${Date.now()}`
            : "";
    }

    private addCarouselItem(carouselItem: HTMLElement) {
        if (!this.allItemsAdded) {
            this.carouselItems.push(carouselItem);
        }
    }

    private moveInDirection(direction: Direction, swiping = false) {
        const { activeIndex } = this.state;
        const newActiveIndex = direction === "right" ? activeIndex + 1 : activeIndex - 1;

        this.setState({
            activeIndex: newActiveIndex,
            alertMessage: "",
            animate: true,
            position: swiping ? this.state.position : 0
        });
    }

    private registerSwipeEvents() {
        this.carouselItems.forEach((carouselItem: HTMLElement) => {
            carouselItem.addEventListener("swipeleft", (event: CustomEvent) => this.handleSwipe(event));
            carouselItem.addEventListener("swipeleftend", (event: CustomEvent) => this.handleSwipeEnd(event, "left"));
            carouselItem.addEventListener("swiperight", (event: CustomEvent) => this.handleSwipe(event));
            carouselItem.addEventListener("swiperightend", (event: CustomEvent) => this.handleSwipeEnd(event, "right"));
        });
    }

    private handleSwipe(event: CustomEvent) {
        const { parentElement } = event.target;
        this.carouselWidth = this.carouselWidth || (parentElement ? parentElement.offsetWidth : 0);
        const currentPercentage = this.calculateSwipePercentage(event, this.carouselWidth);
        if (!this.shouldSwipe(currentPercentage)) { return; }
        this.setState({
            activeIndex: this.state.activeIndex,
            animate: false,
            position: currentPercentage,
            showControls: false
        });
    }

     private handleSwipeEnd(event: CustomEvent, direction: Direction) {
         const swipeOutThreshold = 20;
         const currentPercentage = this.calculateSwipePercentage(event, this.carouselWidth);
         if (!this.shouldSwipe(currentPercentage)) { return; }
         this.carouselWidth = 0;
         const swipingOut = Math.abs(currentPercentage) > swipeOutThreshold;
         if (swipingOut) {
             this.moveInDirection(direction === "right" ? "left" : "right", true);
         }

         this.setState({
             activeIndex: this.state.activeIndex,
             animate: true,
             position: 0,
             showControls: !this.state.showControls && !!this.carouselItems.length
         });
    }

    private calculateSwipePercentage(event: CustomEvent, width: number): number {
        const maxPercentage = 100;
        const swipeOffset = event.detail.pageX - event.detail.originPageX;
        return maxPercentage / width * swipeOffset;
    }

    private shouldSwipe(percentage: number) {
        return percentage > 0
            ? this.state.activeIndex > 0
            : this.state.activeIndex < this.carouselItems.length - 1;
    }

    private executeAction(microflow?: string, form?: string) {
        if (microflow) {
            window.mx.ui.action(microflow, {
                error: (error: Error) =>
                    this.setState({ alertMessage: `An error occurred while executing action: ${error.message}` }),
                params: {
                    guids: this.props.contextGuid ? [ this.props.contextGuid ] : []
                }
            });
        } else if (form) {
            window.mx.ui.openForm(form, {
                error: (error: Error) =>
                    this.setState({ alertMessage: `An error occurred while opening form: ${error.message}` })
            });
        }
    }
}

export { Carousel, CarouselProps, ClickOptions, Image, DataSource };
