import { CarouselItem } from "./CarouselItem";
import { Component, DOM, createElement } from "react";

import { CarouselControl } from "./CarouselControl";

export interface Image {
    url: string;
}

export interface CarouselProps {
    images?: Image[];
}

export class Carousel extends Component<CarouselProps, any> {
    render() {
        return (
            DOM.div({ className: "carousel" },
                DOM.div({ className: "carousel-inner" },
                    this.createCarouselItems(this.props.images)
                ),
                createElement(CarouselControl, { direction: "left" }),
                createElement(CarouselControl, { direction: "right" })
            )
        );
    }

    private createCarouselItems(images: Image[] = []) {
        return images.map((image, index) => createElement(CarouselItem, {
            active: index === 0,
            key: index,
            url: image.url
        }));
    }
}
