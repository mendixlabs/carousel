import { DOM } from "react";

interface CarouselItemProps {
    imageUrl: string;
    active?: boolean;
}

export const CarouselItem = (props: CarouselItemProps) => {
    return (
        DOM.div({ className: props.active ? "item active" : "item" },
            DOM.img({ alt: "item", height: 300, src: props.imageUrl, width: 900 })
        )
    );
};
