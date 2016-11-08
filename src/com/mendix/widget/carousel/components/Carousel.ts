import "../ui/Carousel.css";
import { CarouselItem } from "./CarouselItem";
import { DOM, createElement } from "react";

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
    DOM.div({ className: "mx-carousel" },
        DOM.div({ className: "mx-carousel-item-wrapper" },
            carouselItems(props.images)
        )
    );
