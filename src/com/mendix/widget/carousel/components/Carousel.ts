import { Component, DOM, createElement } from "react";

import { CarouselItem } from "./CarouselItem";

interface Image {
    imageUrl?: string;
}

export interface CarouselProps {
    images?: Image[];
    interval?: number; // In milliseconds
}

interface CarouselState {
    activeImageIndex: number;
}

const carouselItems = (images: Image[]) => {
    return images.map((image, index) => createElement(CarouselItem, {
        active: index === 0 ? true : false,
        imageUrl: image.imageUrl,
        key: index
    }));
};

export class Carousel extends Component<CarouselProps, CarouselState> {
    static defaultProps: CarouselProps = {
        interval: 5000
    };
    constructor(props: CarouselProps) {
        super(props);
        this.state = { activeImageIndex: 0 };
    }
    render() {
        return (DOM.div({ className: "carousel" },
            DOM.div({  className: "carousel-inner" },
                carouselItems(this.props.images)
            )
        ));
    }
}
