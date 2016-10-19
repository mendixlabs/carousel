import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { Carousel, CarouselProps } from "./components/Carousel";

export class CarouselRenderer {
    private domNode: Element;

    render(props: CarouselProps, domNode: Element) {
        this.domNode = domNode;
        render(createElement(Carousel, props), domNode);
    }

    unmount() {
        unmountComponentAtNode(this.domNode);
    }
}