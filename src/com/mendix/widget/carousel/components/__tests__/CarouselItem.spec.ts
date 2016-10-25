import { ShallowWrapper, shallow } from "enzyme";
import { DOM, createElement } from "react";

import { CarouselItem, CarouselItemProps } from "../CarouselItem";

describe("CarouselItem component", () => {
    const url = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    let wrapper: ShallowWrapper<CarouselItemProps, any>;
    beforeEach(() => wrapper = shallow(createElement(CarouselItem, { url, active: true })));

    it("should render CarouselItem active", () => {
        expect(wrapper).toBeElement(
            DOM.div({ className: "item active" }, DOM.img({ alt: "item", src: url }))
        );
    });

    it("should render CarouselItem inactive", () => {
        wrapper = shallow(createElement(CarouselItem, { url, active: false }));
        expect(wrapper).toBeElement(
            DOM.div({ className: "item" }, DOM.img({ alt: "item", src: url }))
        );
    });
});
