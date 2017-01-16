import { DOM, MouseEvent, StatelessComponent } from "react";
import * as classNames from "classnames";

export interface CarouselItemProps {
    url: string;
    active: boolean;
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export const CarouselItem: StatelessComponent<CarouselItemProps> = (props) =>
    DOM.div({ className: classNames("widget-carousel-item", { active: props.active }), onClick: props.onClick },
        DOM.img({ alt: "Carousel image", src: props.url })
    );
