import { DOM } from "react";

export interface CarouselItemProps {
    url: string;
    active: boolean;
}

export const CarouselItem = (props: CarouselItemProps) => (
    DOM.div({ className: "item" + (props.active ? " active" : "") },
        DOM.img({ alt: "item", src: props.url })
    )
);
