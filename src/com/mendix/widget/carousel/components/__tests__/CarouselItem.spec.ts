import { ShallowWrapper, shallow } from "enzyme";
import { createElement } from "react";

import { CarouselItem, CarouselItemProps } from "../CarouselItem";

describe("CarouselItem", () => {
    const url = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    let output: ShallowWrapper<CarouselItemProps, any>;

    beforeEach(() => output = shallow(createElement(CarouselItem, { url, active: true })));

    it("should be a div with one img child", () => {
        expect(output.type()).toBe("div");
        expect(output.children().length).toBe(1);
        expect(output.children().first().type()).toBe("img");
    });

    it("should be active as set in the props", () => {
        expect(output.hasClass("active")).toBe(true);
    });

    it("should be inactive as set in the props", () => {
        output = shallow(createElement(CarouselItem, { url, active: false }));

        expect(output.hasClass("active")).toBe(false);
    });

    it("should have an image with the specified url", () => {
        let imageUrl = output.children().first().prop("src");

        expect(imageUrl).toBe(url);
    });
});
