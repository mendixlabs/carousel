import { DOM } from "react";

export interface CarouselItemProps {
    imageUrl: string;
    active?: boolean;
}

export const CarouselItem = (props: CarouselItemProps) => (
    DOM.div({ className: props.active ? "item active" : "item" },
        DOM.img({ alt: "item", src: props.imageUrl })
    )
);
