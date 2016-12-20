import { DOM, MouseEvent, StatelessComponent } from "react";
import * as classNames from "classnames";

export interface CarouselItemProps {
    url: string;
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;
    status: ItemStatus;
    position?: number;
    getRef?: (ref: HTMLElement) => void;
}
export type ItemStatus = "active" | "prev" | "next";

export const CarouselItem: StatelessComponent<CarouselItemProps> = (props) =>
    DOM.div(
        {
            className: classNames("widget-carousel-item", props.status),
            onClick: props.onClick,
            ref: (node: HTMLElement) => { if (props.getRef) { props.getRef(node); } },
            style: props.position ? { transform: `translate3d(${props.position}%, 0px, 0px)` } : undefined
        },
        DOM.img({ alt: "Carousel image", src: props.url })
    );
