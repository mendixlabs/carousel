import { CarouselItem } from "./CarouselItem";
import { Component, DOM, createElement } from "react";

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
                createElement(CarouselControl, { direction: "left" }),
                createElement(CarouselControl, { direction: "right" })
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
}
