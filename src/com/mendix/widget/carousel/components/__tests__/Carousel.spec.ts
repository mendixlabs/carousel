import { ReactWrapper, ShallowWrapper, mount, shallow } from "enzyme";
import { DOM, createElement } from "react";

import { Carousel, CarouselProps, Image } from "../Carousel";
import { CarouselItem } from "../CarouselItem";

describe("Carousel", () => {
    const images: Image[] = [
        { url: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" },
        { url: "https://www.google.com/images/nav_logo242.png" }
    ];
    let output: ShallowWrapper<CarouselProps, any>;
    let carouselWrapper: ShallowWrapper<CarouselProps, any>;

    beforeEach(() => {
        output = shallow(createElement(Carousel, { images }));
        carouselWrapper = output.find("div.carousel-inner");
    });

    it("renders a div of class carousel with a div child of class carousel-inner", () => {
        const structure = DOM.div({ className: "carousel" },
            DOM.div({ className: "carousel-inner" }));

        expect(output).toMatchStructure(structure);
    });

    it("renders a wrapper with the same number of children as the images", () => {
        let children = carouselWrapper.children();

        expect(children.length).toEqual(images.length);
    });

    it("renders a wrapper with one child", () => {
        output = shallow(createElement(Carousel, {
                images: [ { url: "https://www.google.com/images/nav_logo242.png" } ]
            }
        ));

        const children = output.find("div.carousel-inner").children();

        expect(children.length).toEqual(1);
    });

    it("renders a wrapper with no children", () => {
        output = shallow(createElement(Carousel));

        const children = output.find("div.carousel-inner").children();

        expect(children.length).toBe(0);
    });

    it("renders a wrapper with the first child active", () => {
        const firstChild = carouselWrapper.children().first();

        expect(firstChild.prop("active")).toBe(true);
    });

    it("renders a wrapper with only one active child", () => {
        const activeChildren = carouselWrapper.children().filterWhere(c => c.prop("active"));

        expect(activeChildren.length).toBe(1);
    });

    describe("full component", () => {
        let fullOutput: ReactWrapper<CarouselProps, any>;
        let fullWrapper: ReactWrapper<CarouselProps, any>;

        beforeEach(() => {
            fullOutput = mount(createElement(Carousel, { images }));
            fullWrapper = fullOutput.find("div.carousel-inner");
        });

        it("renders a wrapper with children of type CarouselItem", () => {
            const children = fullWrapper.children();

            children.forEach((child: any) => {

                expect(child.type()).toEqual(CarouselItem);
            });
        });

        it("renders CarouselItems properly", () => {
            const renderedImages = fullOutput.find("div.carousel-inner img");

            expect(renderedImages.length).toBe(2);

            let index = 0;
            renderedImages.forEach((child: any) => {
                const imageUrl = child.prop("src");

                expect(imageUrl).toBe(images[index++].url);
            });
        });
    });
});
