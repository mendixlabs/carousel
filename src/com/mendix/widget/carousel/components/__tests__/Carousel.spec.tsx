import { ReactWrapper, ShallowWrapper, mount, shallow } from "enzyme";
import * as React from "react";

import { Carousel, CarouselProps } from "../Carousel";
import { CarouselItem } from "../CarouselItem";

describe("Carousel component", () => {
    const staticImages = [
        { imageUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" },
        { imageUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" }
    ];
    describe("shallow", () => {
        let shallowWrapper: ShallowWrapper<CarouselProps, {}>;
        beforeEach(() => {
            shallowWrapper = shallow(<Carousel images={staticImages} interval={3000} />);
        });

        it("should be a 'div' with class 'carousel' that has one child 'div' with class 'carousel-inner'",
            () => {
                expect(shallowWrapper.type()).toBe("div");
                expect(shallowWrapper.hasClass("carousel")).toBe(true);
                expect(shallowWrapper.children().length).toBe(1);
                expect(shallowWrapper.childAt(0).hasClass("carousel-inner")).toBe(true);
            }
        );

        it("carousel-inner should have the same number of children as the number of images",
            () => {
                const children = shallowWrapper.find(".carousel-inner").children();
                expect(children.length).toEqual(staticImages.length);
            }
        );

        it("first carousel image should be active on initial render", () => {
            const carouselInner = shallowWrapper.find(".carousel-inner");
            expect(carouselInner.childAt(0).prop("active")).toBe(true);
        });

        it("should have only one active child", () => {
            const children = shallowWrapper.find(".carousel-inner").children();
            const activeChildren = children.filterWhere((c: any) => c.prop("active") === true);
            expect(activeChildren.length).toBe(1);
        });
    });

    describe("FullDOM", () => {
        let fullDOMWrapper: ReactWrapper<CarouselProps, {}>;
        beforeEach(() => {
            spyOn(Carousel.prototype, "componentDidMount");
            fullDOMWrapper = mount(<Carousel images={staticImages} interval={3000} />);
        });

        it("allows us to set props", () => {
            expect(fullDOMWrapper.props().interval).toBe(3000);
            fullDOMWrapper.setProps({ images: staticImages, interval: 5000 });
            expect(fullDOMWrapper.props().interval).toBe(5000);
        });

        it("calls componentDidMount", () => {
            expect(Carousel.prototype.componentDidMount).toHaveBeenCalledTimes(1);
        });

        it("sets active image based on the active index defined in the state", () => {
            expect(fullDOMWrapper.state().activeImageIndex).toBe(0);
            expect(fullDOMWrapper.find(".carousel-inner").childAt(0).find(".active").length).toBe(1);
            fullDOMWrapper.setState({ activeImageIndex: 1 });
            expect(fullDOMWrapper.find(".carousel-inner").childAt(1).find(".active").length).toBe(1);
        });

        it("carouselItems function behaves correctly", () => {
            const carousel = fullDOMWrapper.instance() as Carousel;
            const carouselItems = carousel.carouselItems(staticImages, 0);
            expect(carouselItems instanceof Array).toBe(true);
            expect(carouselItems.length).toBe(staticImages.length);
            carouselItems.forEach (item => expect(mount(item).type()).toBe(CarouselItem));
        });

        it("moveToNextImage function behaves correctly", () => {
            const carousel = fullDOMWrapper.instance() as Carousel;
            expect(fullDOMWrapper.state().activeImageIndex).toBe(0);
            expect(fullDOMWrapper.find(".carousel-inner").childAt(0).find(".active").length).toBe(1);
            carousel.moveToNextImage();
            expect(fullDOMWrapper.state().activeImageIndex).toBe(1);
            expect(fullDOMWrapper.find(".carousel-inner").childAt(1).find(".active").length).toBe(1);
        });
    });
});
