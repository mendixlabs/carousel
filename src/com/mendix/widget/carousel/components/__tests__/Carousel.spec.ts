import { ShallowWrapper, shallow } from "enzyme";
import { createElement } from "react";

import { Carousel, CarouselProps, Image } from "../Carousel";
import { CarouselControl } from "../CarouselControl";
import { CarouselItem } from "../CarouselItem";

describe("Carousel", () => {
    let images: Image[];
    let carousel: ShallowWrapper<CarouselProps, any>;
    let carouselWrapper: ShallowWrapper<CarouselProps, any>;

    it("renders the structure correctly", () => {
        images = [ { url: "https://www.google.com/images/nav_logo242.png" } ];
        carousel = shallow(createElement(Carousel, { images }));

        expect(carousel.hasClass("mx-carousel")).toBe(true);

        const carouselChildren = carousel.children();

        expect(carouselChildren.length).toBe(3);
        expect(carouselChildren.first().hasClass("mx-carousel-item-wrapper")).toBe(true);

        carouselWrapper = carouselChildren.first();

        expect(carouselWrapper.children().length).toBe(1);
        expect(carouselWrapper.children().first().type()).toBe(CarouselItem);

        expect(carousel.find(CarouselControl).length).toBe(2);
    });

    describe("with no images", () => {

        beforeEach(() => carousel = shallow(createElement(Carousel)) );

        it("renders no carousel items", () => {
            const carouselItems = carousel.find(CarouselItem);

            expect(carouselItems.length).toBe(0);
        });

        it("renders no carousel controls", () => {
            expect(carousel.find(CarouselControl).length).toBe(0);
        });
    });

    describe("with one image", () => {

        beforeEach(() => {
            images = [ { url: "https://www.google.com/images/nav_logo242.png" } ];
            carousel = shallow(createElement(Carousel, { images }));
        });

        it("renders one carousel item", () => {
            const carouselItems = carousel.find(CarouselItem);

            expect(carouselItems.length).toBe(1);

            const carouselItem = carouselItems.first();

            expect(carouselItem.props().active).toBe(true);
            expect(carouselItem.props().url).toBe(images[0].url);
        });

        it("renders carousel controls", () => {
            const carouselControls = carousel.find(CarouselControl);

            expect(carouselControls.length).toBe(2);

            carouselControls.forEach((carouselControl: any, index: number) => {
                if (index === 0) {
                    expect(carouselControl.props().direction).toBe("left");
                } else {
                    expect(carouselControl.props().direction).toBe("right");
                }
            });
        });
    });

    describe("with multiple images", () => {

        beforeEach(() => {
            images = [
                { url: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" },
                { url: "https://www.google.com/images/nav_logo242.png" }
            ];
            carousel = shallow(createElement(Carousel, { images }));
            carouselWrapper = carousel.find(".mx-carousel-item-wrapper");
        });

        it("renders all carousel items", () => {
            const carouselItems = carouselWrapper.children();

            expect(carouselItems.length).toBe(2);

            carouselItems.forEach((carouselItem: any, index: number) => {
                expect(carouselItem.type()).toEqual(CarouselItem);

                if (index === 0) {
                    expect(carouselItem.props().active).toBe(true);
                } else {
                    expect(carouselItem.props().active).toBe(false);
                }

                expect(carouselItem.props().url).toBe(images[index].url);
            });
        });

        it("renders the first carousel item active", () => {
            const firstCarouselItem = carouselWrapper.children().first();

            expect(firstCarouselItem.type()).toEqual(CarouselItem);
            expect(firstCarouselItem.prop("active")).toBe(true);
        });

        it("renders only one active carousel item", () => {
            const activeItems = carouselWrapper.children().filterWhere(c => c.prop("active"));

            expect(activeItems.type()).toEqual(CarouselItem);
            expect(activeItems.length).toBe(1);
        });

        it("renders carousel controls", () => {
            const carouselControls = carousel.find(CarouselControl);

            expect(carouselControls.length).toBe(2);

            carouselControls.forEach((carouselControl: any, index: number) => {
                if (index === 0) {
                    expect(carouselControl.props().direction).toBe("left");
                } else {
                    expect(carouselControl.props().direction).toBe("right");
                }
            });
        });

        it("switches to the next image when the right control is clicked", () => {
            const carouselControls = carousel.find(CarouselControl);
            const rightControl = carouselControls.at(1);

            expect(rightControl.props().direction).toBe("right");
            expect(carousel.state().activeIndex).toBe(0);

            rightControl.simulate("click");

            expect(carousel.state().activeIndex).toBe(1);

            rightControl.simulate("click");

            expect(carousel.state().activeIndex).toBe(0);
            // TODO: Test incomplete - not checking if carousel items are updated. Failed to successfully test
        });

        it("switches to the previous image when the left control is clicked", () => {
            const carouselControls = carousel.find(CarouselControl);
            const leftControl = carouselControls.at(0);

            expect(leftControl.props().direction).toBe("left");
            expect(carousel.state().activeIndex).toBe(0);

            leftControl.simulate("click");

            expect(carousel.state().activeIndex).toBe(1);

            leftControl.simulate("click");

            expect(carousel.state().activeIndex).toBe(0);
            // TODO: Test incomplete - not checking if carousel items are updated. Failed to successfully test
        });
    });
});
