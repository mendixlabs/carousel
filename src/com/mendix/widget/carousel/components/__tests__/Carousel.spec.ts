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

        expect(carousel.hasClass("carousel")).toBe(true);

        const carouselChildren = carousel.children();

        expect(carouselChildren.length).toBe(3);
        expect(carouselChildren.first().hasClass("carousel-inner")).toBe(true);

        carouselWrapper = carouselChildren.first();

        expect(carouselWrapper.children().length).toBe(1);
        expect(carouselWrapper.children().first().type()).toBe(CarouselItem);

        expect(carousel.childAt(1).type()).toBe(CarouselControl);
        expect(carousel.childAt(2).type()).toBe(CarouselControl);
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
