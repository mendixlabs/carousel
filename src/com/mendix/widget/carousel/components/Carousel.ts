import { DOM, createElement } from "react";

import { CarouselItem } from "./CarouselItem";

interface Image {
    imageUrl?: string;
}

export interface CarouselProps {
    images?: Image[];
}

const carouselItems = (images: Image[]) => {
    return images.map((image, index) => createElement(CarouselItem, {
        active: index === 0,
        imageUrl: image.imageUrl,
        key: index
    }));
};

export const Carousel = (props: CarouselProps) => {
    return (DOM.div({ className: "carousel" },
        DOM.div({  className: "carousel-inner" },
            carouselItems(props.images)
        )
    ));
};
