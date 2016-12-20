import { Component, DOM, MouseEventHandler, createElement } from "react";

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
}

interface CustomEvent extends Event {
    type: string;
    detail: {
        originPageX: number;
        originPageY: number;
        pageX: number;
        pageY: number;
    };
    target: HTMLElement;
}

export class Carousel extends Component<CarouselProps, CarouselState> {
    static defaultProps: CarouselProps = { images: [] };
    private moveToTheLeft: MouseEventHandler<HTMLDivElement>;
    private moveToTheRight: MouseEventHandler<HTMLDivElement>;
    private carouselWidth: number;
    private carouselItems: HTMLElement[];
    private itemsAdded: boolean;

    constructor(props: CarouselProps) {
        super(props);

        this.carouselWidth = 0;
        this.itemsAdded = false;
        this.carouselItems = [];
        this.moveToTheLeft = () => this.moveInDirection("left");
        this.moveToTheRight = () => this.moveInDirection("right");
        this.state = {
            activeIndex: 0,
            position: 0,
            showControls: this.props.images.length > 0
        };
    }

    render() {
        return DOM.div({ className: "widget-carousel-wrapper" },
            createElement(Alert, { message: this.state.alertMessage }),
            DOM.div({ className: "widget-carousel" },
                DOM.div(
                    {
                        className: "widget-carousel-item-wrapper",
                        style: { transform: `translate3d(${this.state.position}%, 0px, 0px)` }
                    },
                    this.createCarouselItems(this.props.images, this.state.activeIndex || 0)
                ),
                this.createCarouselControls()
            )
        );
    }

    componentDidMount() {
        this.itemsAdded = true;
        this.registerSwipeEvents();
    }

    private createCarouselItems(images: Image[], activeIndex: number) {
        return images.map((image, index) => {
            const { position, status } = this.getItemStatus(index, activeIndex);
            return createElement(CarouselItem, {
                getRef: (ref: HTMLElement) => this.addCarouselItem(ref),
                key: index,
                onClick: () => this.executeAction(image.onClickMicroflow, image.onClickForm),
                position,
                status,
                url: image.url
            });
        });
    }

    private getItemStatus(index: number, activeIndex: number): { position?: number, status: ItemStatus } {
        const nextPosition = 100;
        const prevPosition = -100;
        if (index === activeIndex) {
            return { status: "active" };
        }
        if (index === this.props.images.length - 1 && activeIndex === 0) {
            return { status: "prev", position: prevPosition };
        }
        if (activeIndex === this.props.images.length - 1 && index === 0) {
            return { status: "next", position: nextPosition };
        }
        if (activeIndex < index) {
            return { status: "next" };
        } else {
            return { status: "prev" };
        }
    }

    private createCarouselControls() {
        if (!this.state.showControls) return null;

        return [
            createElement(CarouselControl, {
                direction: "left",
                key: 0,
                onClick: this.moveToTheLeft
            }),
            createElement(CarouselControl, {
                direction: "right",
                key: 1,
                onClick: this.moveToTheRight
            })
        ];
    }

    private addCarouselItem(carouselItem: HTMLElement) {
        if (!this.itemsAdded) {
            this.carouselItems.push(carouselItem);
        }
    }

    private moveInDirection(direction: "right" | "left") {
        const { activeIndex } = this.state;
        const firstIndex = 0;
        const newActiveIndex = direction === "right"
            ? activeIndex < this.props.images.length - 1 ? activeIndex + 1 : firstIndex
            : activeIndex === firstIndex ? this.props.images.length - 1 : activeIndex - 1;

        this.setState({ activeIndex: newActiveIndex, alertMessage: "", position: 0 });
    }

    private registerSwipeEvents() {
        this.carouselItems.forEach((carouselItem: HTMLElement) => {
            carouselItem.addEventListener("swipeleft", (event: CustomEvent) => {
                    this.handleSwipe(event);
            });
            carouselItem.addEventListener("swipeleftend", (event: CustomEvent) => {
                this.handleSwipeEnd(event, "left");
            });
            carouselItem.addEventListener("swiperight", (event: CustomEvent) => {
                this.handleSwipe(event);
            });
            carouselItem.addEventListener("swiperightend", (event: CustomEvent) => {
                this.handleSwipeEnd(event, "right");
            });
        });
    }

    private handleSwipe(event: CustomEvent) {
        const maxPercentage = 100;
        if (this.state.showControls) {
            this.setState({ activeIndex: this.state.activeIndex, showControls: false });
        }
        const { parentElement } = event.target;
        this.carouselWidth = this.carouselWidth || (parentElement ? parentElement.offsetWidth : 0);

        const swipeOffset = event.detail.pageX - event.detail.originPageX;
        const currentPercentage = Math.floor((maxPercentage / this.carouselWidth) * swipeOffset);
        this.setState({ activeIndex: this.state.activeIndex, position: currentPercentage });
    }

     private handleSwipeEnd(event: CustomEvent, direction: "right" | "left") {
         const maxPercentage = 100;
         const swipeOutThreshold = 20;
         const swipeOffset = event.detail.pageX - event.detail.originPageX;
         const currentPercentage = (maxPercentage / this.carouselWidth) * swipeOffset;
         this.carouselWidth = 0;
         if (Math.abs(currentPercentage) > swipeOutThreshold) {
             this.moveInDirection(direction === "right" ? "left" : "right");
         }

         this.setState({
             activeIndex: this.state.activeIndex,
             position: 0,
             showControls: !this.state.showControls && !!this.carouselItems.length
         });
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
