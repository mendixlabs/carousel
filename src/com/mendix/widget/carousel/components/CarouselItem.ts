import { DOM } from "react";

export interface CarouselItemProps {
    url: string;
    active: boolean;
}

export const CarouselItem = (props: CarouselItemProps) => (
    DOM.div({ className: "item" + (props.active ? " active" : "") },
        DOM.img({ alt: "Carousel image", src: props.url })
    )
);
