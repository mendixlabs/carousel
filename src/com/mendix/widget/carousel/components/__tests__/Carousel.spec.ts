import { ShallowWrapper, shallow } from "enzyme";
import { DOM, createElement } from "react";

import { Carousel, CarouselProps, Image } from "../Carousel";

describe("Carousel", () => {
    const images: Image[] = [
        { url: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" },
        { url: "https://www.google.com/images/nav_logo242.png" }
    ];
    let wrapper: ShallowWrapper<CarouselProps, any>;
    beforeEach(() => wrapper = shallow(createElement(Carousel, { images })));

    it("should be a 'div' of class carousel with a 'div' child of class carousel-inner", () => {
        expect(wrapper).toMatchStructure(DOM.div({ className: "carousel" },
            DOM.div({ className: "carousel-inner" }))
        );
    });

    it("should have the number of children equal to the number of images", () => {
        expect(wrapper.find(".carousel-inner").children().length).toEqual(images.length);
    });

    it("should have the first image as active", () => {
        expect(wrapper.find(".carousel-inner").children().first().prop("active")).toBe(true);
    });

    it("should have only one active image", () => {
        const children = wrapper.find(".carousel-inner").children();

        expect(children.filterWhere(c => c.prop("active") === true).length).toBe(1);
    });
});
