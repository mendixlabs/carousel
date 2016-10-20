import { Component, DOM, createElement } from "react";

import { CarouselItem } from "./CarouselItem";

interface Image {
    imageUrl: string;
}

export interface CarouselProps {
    images: Image[];
    interval: number; // In milliseconds
}

interface CarouselState {
    activeImageIndex: number;
}

const carouselItems = (images: Image[], activeIndex: number) => {
    return images.map((image, index) => createElement(CarouselItem, {
        active: index === activeIndex ? true : false,
        imageUrl: image.imageUrl,
        key: index
    }));
};

export class Carousel extends Component<CarouselProps, CarouselState> {
    private timeout: number;

    constructor(props: CarouselProps) {
        super(props);
        this.state = { activeImageIndex: 0 };
        this.moveToNextImage = this.moveToNextImage.bind(this);
    }

    render() {
        return (DOM.div({ className: "carousel" },
            DOM.div({ className: "carousel-inner" },
                carouselItems(this.props.images, this.state.activeImageIndex)
            )
        ));
    }

    componentDidMount() {
        this.timeout = setTimeout(this.moveToNextImage, this.props.interval);
    }

    componentDidUpdate() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(this.moveToNextImage, this.props.interval);
    }

    moveToNextImage() {
        const numberOfImages = this.props.images.length;
        let activeImageIndex = this.state.activeImageIndex;
        this.setState({
            activeImageIndex: (activeImageIndex === numberOfImages - 1) ? 0 : ++activeImageIndex
        });
    }
}
