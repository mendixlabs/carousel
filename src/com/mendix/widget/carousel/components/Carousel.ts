import { CarouselItem } from "./CarouselItem";
import { Component, DOM, MouseEventHandler, createElement } from "react";

import { CarouselControl } from "./CarouselControl";

import "../ui/Carousel.css";

export interface Image {
    url: string;
}

export interface CarouselProps {
    images?: Image[];
}

interface CarouselState {
    activeIndex: number;
}

type Direction = "right" | "left";

export class Carousel extends Component<CarouselProps, CarouselState> {
    static defaultProps: CarouselProps = { images: [] };

    constructor(props: CarouselProps) {
        super(props);

        this.state = { activeIndex: 0 };
    }

    render() {
        return DOM.div({ className: "widget-carousel" },
            DOM.div({ className: "widget-carousel-inner" },
                this.getCarouselItems(this.props.images, this.state.activeIndex)
            ),
            this.props.images.length > 0 ? this.getCarouselControls() : null
        );
    }

    static createCarouselItem(url: string, active: boolean, key: number) {
        return createElement(CarouselItem, { active, key, url });
    }

    static createCarouselControl(direction: Direction, key: number, onClick: MouseEventHandler<any>) {
        return createElement(CarouselControl, { direction, key, onClick });
    }

    private getCarouselItems(images: Image[], activeIndex: number) {
        return images.map((image, index) =>
            Carousel.createCarouselItem(image.url, index === activeIndex, index));
    }

    private getCarouselControls() {
        return [
            Carousel.createCarouselControl("left", 0, () => this.moveInDirection("left")),
            Carousel.createCarouselControl("right", 1, () => this.moveInDirection("right"))
        ];
    }

    private moveInDirection(direction: Direction) {
        let { activeIndex } = this.state;
        let imageCount = this.props.images.length;
        if (direction === "right") {
            this.setActiveIndex(activeIndex < --imageCount ? ++activeIndex : 0);
        } else {
            this.setActiveIndex(activeIndex === 0 ? --imageCount : --activeIndex);
        }
    }

    private setActiveIndex(activeIndex: number) {
        this.setState({ activeIndex });
    }
}
