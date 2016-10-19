import { DOM } from "react";

export interface CarouselProps {
    message: string;
}

export const Carousel = (props: CarouselProps) => (
    DOM.span({ className: "carousel"}, props.message)
);
