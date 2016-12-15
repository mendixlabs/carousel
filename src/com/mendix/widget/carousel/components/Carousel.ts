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
}

export class Carousel extends Component<CarouselProps, CarouselState> {
    static defaultProps: CarouselProps = { images: [] };
    private carouselItemsNode: HTMLElement;
    private carouselNode: HTMLElement;
    private moveToTheLeft: MouseEventHandler<HTMLDivElement>;
    private moveToTheRight: MouseEventHandler<HTMLDivElement>;
    private carouselWidth: number;
    private items: HTMLElement[];

    constructor(props: CarouselProps) {
        super(props);

        this.items = [];
        this.carouselWidth = 0;
        this.moveToTheLeft = () => this.moveInDirection("left");
        this.moveToTheRight = () => this.moveInDirection("right");
        this.state = { activeIndex: 0 };
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
        this.items.map((carouselItem: HTMLElement) => {
            if (carouselItem) {
                if (!this.carouselWidth) {
                    this.carouselWidth = carouselItem.parentElement ? carouselItem.parentElement.offsetWidth : 0;
                    carouselItem.style.width = this.carouselWidth + "px";
                } else {
                    carouselItem.style.width = this.carouselWidth + "px";
                }
            }
        });
        this.carouselItemsNode.style.width = (this.items.length * this.carouselWidth) + "px";
        setTimeout(() => {
            this.carouselNode.style.height = this.items[0].offsetHeight + "px";
        }, 100);
    }

    private createCarouselItems(images: Image[], activeIndex: number) {
        return images.map((image, index) =>
            createElement(CarouselItem, {
                active: index === activeIndex,
                getRef: (ref: HTMLElement) => this.setCarouselItemPosition(ref),
                key: index,
                onClick: () => this.executeAction(image.onClickMicroflow, image.onClickForm),
                url: image.url
            }));
    }

    private createCarouselControls() {
        if (!this.props.images.length) return null;

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

    private setCarouselItemPosition(carouselItem: HTMLElement) {
        this.items.push(carouselItem);
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
