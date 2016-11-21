import { CarouselControl } from "./CarouselControl";
import { CarouselItem } from "./CarouselItem";
import { Component, DOM, createElement } from "react";

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
            DOM.div({ className: "widget-carousel-item-wrapper" },
                this.getCarouselItems(this.props.images, this.state.activeIndex)
            ),
            this.props.images.length > 0 ? this.getCarouselControls() : null
        );
    }

    private getCarouselItems(images: Image[], activeIndex: number) {
        return images.map((image, index) =>
            createElement(CarouselItem, {
                active: index === activeIndex,
                key: index,
                url: image.url
            }));
    }

    private getCarouselControls() {
        return [
            createElement(CarouselControl, {
                direction: "left",
                key: 0,
                onClick: () => this.moveInDirection("left")
            }),
            createElement(CarouselControl, {
                direction: "right",
                key: 1,
                onClick: () => this.moveInDirection("right")
            })
        ];
    }

    private moveInDirection(direction: Direction) {
        let { activeIndex } = this.state;
        let imageCount = this.props.images.length;
        const firstIndex = 0;
        if (direction === "right") {
            this.setState({ activeIndex : activeIndex < --imageCount ? ++activeIndex : firstIndex });
        } else {
            this.setState({ activeIndex: activeIndex === firstIndex ? --imageCount : --activeIndex });
        }
    }
}
