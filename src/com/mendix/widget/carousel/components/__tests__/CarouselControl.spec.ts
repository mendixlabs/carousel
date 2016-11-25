import { ShallowWrapper, shallow } from "enzyme";
import { DOM, createElement } from "react";

import { CarouselControl, CarouselControlProps } from "../CarouselControl";

describe("CarouselControl", () => {

    let carouselControl: ShallowWrapper<CarouselControlProps, any>;
    let clickCount = 0;
    let onClick = () => clickCount++;

    beforeEach(() => {
        carouselControl = shallow(createElement(CarouselControl, { direction: "right", onClick }));
    });

    it("renders the structure correctly", () => {
        expect(carouselControl).toBeElement(
            DOM.div({ className: "widget-carousel-control right", onClick },
                DOM.span({ className: "glyphicon glyphicon-chevron-right" })
            ));
    });

    it("renders with the carousel-control css class", () => {
        expect(carouselControl.hasClass("widget-carousel-control")).toBe(true);
    });

    describe("that navigates to the", () => {
        beforeEach(() => {
            carouselControl = shallow(createElement(CarouselControl, { direction: "right", onClick }));
        });

        it("renders the right css class", () => {
            expect(carouselControl.hasClass("right")).toBe(true);
        });

        it("renders the correct glyphicon", () => {
            expect(carouselControl.find(".glyphicon.glyphicon-chevron-right").length).toBe(1);
        });
    });

    describe("that navigates to the left", () => {
        beforeEach(() => {
            clickCount = 0;
            carouselControl = shallow(createElement(CarouselControl, { direction: "left", onClick }));
        });

        it("renders the left css class", () => {
            expect(carouselControl.hasClass("left")).toBe(true);
        });

        it("renders the correct glyphicon", () => {
            expect(carouselControl.find(".glyphicon.glyphicon-chevron-left").length).toBe(1);
        });
    });

    it("responds to a single click", () => {
        expect(clickCount).toBe(0);

        carouselControl.simulate("click");

        expect(clickCount).toBe(1);
    });
});
