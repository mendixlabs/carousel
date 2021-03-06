import { MouseEvent, SFC, createElement } from "react";
import * as classNames from "classnames";

export interface CarouselItemProps {
    url: string;
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;
    status: ItemStatus;
    position: number;
    getItemNode?: (ref: HTMLElement | null) => void;
}

export type ItemStatus = "active" | "next" | "prev";

export const CarouselItem: SFC<CarouselItemProps> = (props) =>
    createElement("div",
        {
            className: classNames("widget-carousel-item", props.status),
            onClick: props.onClick,
            ref: node => { if (props.getItemNode) { props.getItemNode(node); } },
            style: { transform: `translate3d(${props.position}%, 0px, 0px)` }
        },
        createElement("img", { className: "widget-carousel-image", alt: "Carousel image", src: props.url })
    );

CarouselItem.defaultProps = {
    position: 0
};

CarouselItem.displayName = "CarouselItem";
