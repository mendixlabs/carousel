import { shallow } from "enzyme";
import * as React from "react";

import { Carousel, CarouselProps } from "../Carousel";

describe("Carousel component", () => {
    const staticImages = [
        { imageUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" },
        { imageUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" }
    ];
    const render = (props: CarouselProps) => shallow(<Carousel {...props} />);

    it("should render carousel structure", () => {
        const output = render({ images: staticImages, interval: 3000 });
        expect(output).toMatchStructure(
            <div className="carousel">
                <div className="carousel-inner" />
            </div>
        );
    });

    it("should render carousel with 2 children", () => {
        const wrapper = render({ images: staticImages, interval: 3000 });
        expect(wrapper.find(".carousel-inner").children().length).toEqual(staticImages.length);
    });

    it("should render carousel with the class 'carousel'", () => {
        const output = render({ images: staticImages, interval: 3000 });
        expect(output).toHaveClass("carousel");
    });

    it("should render carousel child to have class 'carousel-inner'", () => {
        const output = render({ images: staticImages, interval: 3000 });
        expect(output.children()).toHaveClass("carousel-inner");
    });

    it("first child should be active", () => {
        const wrapper = render({ images: staticImages, interval: 3000 });
        const children = wrapper.find(".carousel-inner").children();
        expect(children.first().prop("active")).toBe(true);
    });

    it("should have only one active child", () => {
        const wrapper = render({ images: staticImages, interval: 3000 });
        const children = wrapper.find(".carousel-inner").children();
        const activeChildren = children.filterWhere(c => c.prop("active") === true);
        expect(activeChildren.length).toBe(1);
    });
});
