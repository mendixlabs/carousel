import { CarouselItem } from "./CarouselItem";
import { DOM, createElement } from "react";

interface Image {
    url?: string;
}

export interface CarouselProps {
    images?: Image[];
}

const carouselItems = (images: Image[]) => (
    images.map((image, index) => createElement(CarouselItem, {
        active: index === 0,
        key: index,
        url: image.url
    })
));

export const Carousel = (props: CarouselProps) => (
    DOM.div({ className: "carousel" },
        DOM.div({ className: "carousel-inner" },
            carouselItems(props.images)
        )
    )
);
