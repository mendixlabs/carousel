import { Component, DOM, MouseEventHandler, createElement } from "react";
import * as classNames from "classnames";

import { Alert } from "./Alert";
import { CarouselControl } from "./CarouselControl";
import { CarouselItem, ItemStatus } from "./CarouselItem";

import "../ui/Carousel.css";

export interface Image {
    url: string;
    onClickMicroflow?: string;
    onClickForm?: string;
}

export interface CarouselProps {
    images: Image[];
    contextGuid?: string;
}

interface CarouselState {
    activeIndex?: number;
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

export class Carousel extends Component<CarouselProps, CarouselState> {
    static defaultProps: CarouselProps = { images: [] };
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
            animate: false,
            position: 0,
            showControls: this.props.images.length > 1
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
                    this.createCarouselItems(this.props.images, this.state.activeIndex || 0)
                ),
                this.createCarouselControls()
            )
        );
    }

    componentDidMount() {
        this.allItemsAdded = true;
        this.registerSwipeEvents();
    }

    private createCarouselItems(images: Image[], activeIndex: number) {
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

        const directions: Direction[] = this.state.activeIndex === this.props.images.length - 1
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
        return Math.floor(maxPercentage / width * swipeOffset);
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
