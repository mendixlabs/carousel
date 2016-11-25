import * as classNames from "classnames";
import { DOM } from "react";

export interface CarouselControlProps {
    direction: "right" | "left";
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const CarouselControl = (props: CarouselControlProps) =>
    DOM.div({ className: classNames("widget-carousel-control", props.direction), onClick: props.onClick },
        DOM.span({ className: classNames("glyphicon", "glyphicon-chevron-" + props.direction) })
    );
