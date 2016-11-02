import { CarouselItem } from "./CarouselItem";
import { Component, DOM, MouseEventHandler, createElement } from "react";

import "../ui/Carousel.css";
import { CarouselControl } from "./CarouselControl";

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
    constructor(props: CarouselProps) {
        super(props);

        this.state = {
            activeIndex: 0
        };
    }

    render() {
        return (
            DOM.div({ className: "carousel" },
                DOM.div({ className: "carousel-inner" },
                    this.createCarouselItems(this.props.images, this.state.activeIndex)
                ),
                this.props.images.length > 0 ? this.getCarouselControls() : null
            )
        );
    }

    private createCarouselItems(images: Image[] = [], activeIndex: number) {
        return images.map((image, index) => createElement(CarouselItem, {
            active: index === activeIndex,
            key: index,
            url: image.url
        }));
    }

    private createCarouselControl(direction: Direction, key: number, onClick: MouseEventHandler<HTMLDivElement>) {
        return createElement(CarouselControl, { direction, key, onClick });
    }

    private getCarouselControls() {
        return [
            this.createCarouselControl("left", 0, () => this.moveInDirection("left")),
            this.createCarouselControl("right", 1, () => this.moveInDirection("right"))
        ];
    }

    private moveInDirection(direction: Direction) {
        const { activeIndex } = this.state;
        const imageCount = this.props.images.length;
        direction === "right"
            ? this.setActiveIndex(activeIndex < imageCount - 1 ? activeIndex + 1 : 0)
            : this.setActiveIndex(activeIndex === 0 ? imageCount - 1 : activeIndex - 1);
    }

    private setActiveIndex(activeIndex: number) {
        this.setState({ activeIndex });
    }
}
