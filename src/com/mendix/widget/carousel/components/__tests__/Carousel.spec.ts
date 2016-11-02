import { ShallowWrapper, shallow } from "enzyme";
import { DOM, createElement } from "react";

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

        expect(carousel).toBeElement(
            DOM.div({ className: "carousel" },
                DOM.div({ className: "carousel-inner" },
                    createElement(CarouselItem, { active: true, url: images[0].url })
                ),
                createElement(CarouselControl, { direction: "left" }),
                createElement(CarouselControl, { direction: "right" })
            ));
    });

    describe("with no images", () => {

        beforeEach(() => carousel = shallow(createElement(Carousel)) );

        it("renders no carousel items", () => {
            const carouselItems = carousel.find(".carousel-inner").children();

            expect(carouselItems.length).toBe(0);
        });
    });

    describe("with one image", () => {

        beforeEach(() => {
            images = [ { url: "https://www.google.com/images/nav_logo242.png" } ];
            carousel = shallow(createElement(Carousel, { images }));
        });

        it("renders one carousel item", () => {
            const carouselItems = carousel.find(".carousel-inner").children();

            expect(carouselItems.length).toBe(1);

            const carouselItem = carouselItems.first();

            expect(carouselItem.type()).toEqual(CarouselItem);
            expect(carouselItem.props().active).toBe(true);
            expect(carouselItem.props().url).toBe(images[0].url);
        });
    });

    describe("with multiple images", () => {

        beforeEach(() => {
            images = [
                { url: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" },
                { url: "https://www.google.com/images/nav_logo242.png" }
            ];
            carousel = shallow(createElement(Carousel, { images }));
            carouselWrapper = carousel.find(".carousel-inner");
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
    });
});
