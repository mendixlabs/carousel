import { CarouselItem } from "./CarouselItem";
import { DOM, createElement } from "react";

import { CarouselControl } from "./CarouselControl";

export interface Image {
    url: string;
}

export interface CarouselProps {
    images?: Image[];
}

const carouselItems = (images: Image[] = []) =>
    images.map((image, index) => createElement(CarouselItem, {
        active: index === 0,
        key: index,
        url: image.url
    }));

export const Carousel = (props: CarouselProps) =>
    DOM.div({ className: "carousel" },
        DOM.div({ className: "carousel-inner" },
            carouselItems(props.images)
        ),
        createElement(CarouselControl, { direction: "left" }),
        createElement(CarouselControl, { direction: "right" })
    );
