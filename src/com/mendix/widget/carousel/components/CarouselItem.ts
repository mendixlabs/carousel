import * as classnames from "classnames";
import { DOM } from "react";

export interface CarouselItemProps {
    url: string;
    active: boolean;
}

export const CarouselItem = (props: CarouselItemProps) => (
    DOM.div({ className: classnames({ active: props.active, item: true }) },
        DOM.img({ alt: "Carousel image", src: props.url })
    )
);
