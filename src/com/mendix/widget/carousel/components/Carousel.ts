import { CarouselItem } from "./CarouselItem";
import { Component, DOM, createElement } from "react";

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
                createElement(CarouselControl, { direction: "left", onClick: () => this.moveInDirection("left") }),
                createElement(CarouselControl, { direction: "right", onClick: () => this.moveInDirection("right") })
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

    private moveInDirection(direction: Direction) {
        const { activeIndex } = this.state;
        const imageCount = this.props.images.length;
        if (direction === "right") {
            this.setState({
                activeIndex: activeIndex < imageCount - 1 ? activeIndex + 1 : 0
            });
        } else {
            this.setState({
                activeIndex: activeIndex === 0 ? imageCount - 1 : activeIndex - 1
            });
        }
    }
}
