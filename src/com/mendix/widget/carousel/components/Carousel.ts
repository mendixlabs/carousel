import { Component, DOM, MouseEventHandler, createElement } from "react";

import { Alert } from "./Alert";
import { CarouselControl } from "./CarouselControl";
import { CarouselItem } from "./CarouselItem";

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
    private carouselItemsNode: HTMLElement;
    private carouselNode: HTMLElement;
    private moveToTheLeft: MouseEventHandler<HTMLDivElement>;
    private moveToTheRight: MouseEventHandler<HTMLDivElement>;
    private carouselWidth: number;
    private items: HTMLElement[];
    private swipeEvents: string[];
    private itemsAdded: boolean;

    constructor(props: CarouselProps) {
        super(props);

        this.items = [];
        this.itemsAdded = false;
        this.carouselWidth = 0;
        this.swipeEvents = [ "touchstart", "swiperight", "swipeleft", "swiperightend", "swipeleftend" ];
        this.moveToTheLeft = () => this.moveInDirection("left");
        this.moveToTheRight = () => this.moveInDirection("right");
        this.state = {
            activeIndex: 0,
            showControls: this.props.images.length > 0
        };
    }

    render() {
        return DOM.div({ className: "widget-carousel-wrapper" },
            createElement(Alert, { message: this.state.alertMessage }),
            DOM.div({ className: "widget-carousel", ref: (node: HTMLElement) => { this.carouselNode = node; } },
                DOM.div(
                    {
                        className: "widget-carousel-item-wrapper",
                        ref: (node: HTMLElement) => { this.carouselItemsNode = node; }
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
        return images.map((image, index) =>
            createElement(CarouselItem, {
                active: index === activeIndex,
                getRef: (ref: HTMLElement) => this.addCarouselItem(ref),
                key: index,
                onClick: () => this.executeAction(image.onClickMicroflow, image.onClickForm),
                url: image.url
            }));
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
            this.items.push(carouselItem);
        }
    }

    private moveInDirection(direction: "right" | "left") {
        const { activeIndex } = this.state;
        const firstIndex = 0;
        const newActiveIndex = direction === "right"
            ? activeIndex < this.props.images.length - 1 ? activeIndex + 1 : -firstIndex
            : activeIndex === firstIndex ? this.props.images.length - 1 : activeIndex - 1;

        const carouselItem = this.items[newActiveIndex];
        this.carouselItemsNode.style.transform = `translate3d(${-(newActiveIndex * this.carouselWidth)}px, 0px, 0px)`;
        this.carouselNode.style.height = carouselItem.offsetHeight + "px";

        this.setState({ activeIndex: newActiveIndex, alertMessage: "" });
    }

    private registerSwipeEvents() {
        if (this.items.length > 0) {
            this.items.forEach((carouselItem: HTMLElement) => {
                this.swipeEvents.forEach((eventName: string) => {
                    carouselItem.addEventListener(eventName, (event: MouseEvent | CustomEvent) => {
                        if (eventName === "swipeleft") {
                            this.handleSwipeLeft(event as CustomEvent);
                        }

                        if (eventName === "swipeleftend") {
                            this.handleSwipeLeftEnd(event as CustomEvent);
                        }
                    });
                });
            });
        }
    }

    private handleSwipeLeft(event: CustomEvent) {
        if (this.state.showControls) {
            this.setState({ activeIndex: this.state.activeIndex, showControls: false });
        }
        const currentItem = this.items[this.state.activeIndex || 0];
        let nextItem: HTMLElement;
        if (this.state.activeIndex + 1 === this.items.length) {
            nextItem = this.items[0];
        } else {
            nextItem = this.items[this.state.activeIndex + 1];
        }

        if (!this.carouselWidth) {
            this.carouselWidth = currentItem.parentElement ? currentItem.parentElement.offsetWidth : 0;
        }

        if (nextItem.className.indexOf("next") === -1) {
            nextItem.className = nextItem.className + " next";
        }

        const eventDetails = (event as CustomEvent).detail;
        const swipeOffset = eventDetails.pageX - eventDetails.originPageX;
        const currentPercentage = Math.floor((100 / this.carouselWidth) * swipeOffset);
        currentItem.style.transform = `translate3d(${currentPercentage}%, 0px, 0px)`;
        nextItem.style.transform = `translate3d(${100 + currentPercentage}%, 0px, 0px)`;
    }

    private handleSwipeLeftEnd(event: CustomEvent) {
        const eventDetails = (event as CustomEvent).detail;
        const swipeOffset = eventDetails.pageX - eventDetails.originPageX;
        const currentPercentage = (100 / this.carouselWidth) * swipeOffset;
        if (Math.abs(currentPercentage) > 20) {
            this.moveInDirection("right");
            let prevIndex = this.state.activeIndex === 0
                ? this.items.length - 1
                : this.state.activeIndex - 1;
            this.resetSwipeStyles([ this.state.activeIndex || 0, prevIndex ]);
        }

        const nextIndex = this.state.activeIndex + 1 === this.items.length
                ? 0
                : this.state.activeIndex + 1;
        this.resetSwipeStyles([ this.state.activeIndex || 0, nextIndex ]);

        if (!this.state.showControls) {
            this.setState({ activeIndex: this.state.activeIndex, showControls: true });
        }
        this.carouselWidth = 0;
    }

    private resetSwipeStyles(indexes: number[]) {
        indexes.forEach((index) => {
            this.items[index].removeAttribute("style");
        });
        this.carouselItemsNode.removeAttribute("style");
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
