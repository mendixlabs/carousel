import { ShallowWrapper, shallow } from "enzyme";
import { DOM, createElement } from "react";

import { CarouselItem, CarouselItemProps } from "../CarouselItem";

describe("CarouselItem", () => {
    const url = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    let wrapper: ShallowWrapper<CarouselItemProps, any>;
    beforeEach(() => wrapper = shallow(createElement(CarouselItem, { url, active: true })));

    it("should be active", () => {
        expect(wrapper).toBeElement(
            DOM.div({ className: "item active" }, DOM.img({ alt: "Carousel image", src: url }))
        );
    });

    it("should be inactive", () => {
        wrapper = shallow(createElement(CarouselItem, { url, active: false }));
        expect(wrapper).toBeElement(
            DOM.div({ className: "item" }, DOM.img({ alt: "Carousel image", src: url }))
        );
    });
});
