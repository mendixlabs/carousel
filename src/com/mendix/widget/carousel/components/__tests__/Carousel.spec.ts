import { ShallowWrapper, shallow } from "enzyme";
import { DOM, createElement } from "react";

import { Alert } from "../Alert";
import { Carousel, CarouselProps, Image } from "../Carousel";
import { CarouselControl } from "../CarouselControl";
import { CarouselItem } from "../CarouselItem";

import { image, lorem, random } from "faker";
import { mockMendix } from "tests/mocks/Mendix";

describe("Carousel", () => {
    let images: Image[];
    let carousel: ShallowWrapper<CarouselProps, any>;
    let carouselWrapper: ShallowWrapper<CarouselProps, any>;
    const defaultMx = window.mx;
    const contextGuid = random.uuid();
    const createCarousel = (onClickMicroflow?: string, onClickForm?: string) => {
        images = [ {
            onClickForm,
            onClickMicroflow,
            url: image.imageUrl()
        } ];
        return shallow(createElement(Carousel, { images, contextGuid }));
    };

    beforeAll(() => {
        window.mx = mockMendix;
    });

    it("renders the structure correctly", () => {
        carousel = shallow(createElement(Carousel));

        expect(carousel).toBeElement(
            DOM.div({ className: "widget-carousel-wrapper" },
                createElement(Alert),
                DOM.div({ className: "widget-carousel" },
                    DOM.div({
                        className: "widget-carousel-item-wrapper",
                        style: { transform: "translate3d(0%, 0px, 0px)" }
                    })
                )
            )
        );
    });

    describe("with no images", () => {
        beforeEach(() => carousel = shallow(createElement(Carousel)) );

        it("renders no carousel items", () => {
            const carouselItems = carousel.find(CarouselItem);

            expect(carouselItems.length).toBe(0);
        });

        it("renders no navigation controls", () => {
            expect(carousel.find(CarouselControl).length).toBe(0);
        });
    });

    describe("with one image", () => {
        beforeEach(() => {
            images = [ { url: image.imageUrl() } ];
            carousel = shallow(createElement(Carousel, { images }));
        });

        it("renders one carousel item", () => {
            const carouselItem = carousel.find(CarouselItem);

            expect(carouselItem.length).toBe(1);
            expect(carouselItem.props().status).toContain("active");
            expect(carouselItem.props().url).toBe(images[0].url);
        });

        it("renders navigation controls", () => {
            const carouselControls = carousel.find(CarouselControl);

            expect(carouselControls.length).toBe(2);
            expect(carouselControls.at(0).props().direction).toBe("left");
            expect(carouselControls.at(1).props().direction).toBe("right");
        });
    });

    describe("with multiple images", () => {
        beforeEach(() => {
            images = [
                { url: image.imageUrl() },
                { url: image.imageUrl(800, 600) }
            ];
            carousel = shallow(createElement(Carousel, { images }));
            carouselWrapper = carousel.find(".widget-carousel-item-wrapper") as ShallowWrapper<CarouselProps, any>;
        });

        it("renders all carousel items", () => {
            const carouselItems = carouselWrapper.find(CarouselItem);

            expect(carouselItems.length).toBe(2);

            expect(carouselItems.at(0).props().status).toContain("active");
            expect(carouselItems.at(0).props().url).toBe(images[0].url);

            expect(carouselItems.at(1).props().status).not.toContain("active");
            expect(carouselItems.at(1).props().url).toBe(images[1].url);
        });

        it("renders the first carousel item active", () => {
            const firstCarouselItem = carouselWrapper.find(CarouselItem).first();

            expect(firstCarouselItem.prop("status")).toContain("active");
        });

        it("renders only one active carousel item", () => {
            const activeItems = carouselWrapper.find(CarouselItem).filterWhere((c) => {
                return c.props().status.indexOf("active") !== -1;
            });

            expect(activeItems.length).toBe(1);
        });

        it("renders navigation controls", () => {
            const carouselControls = carousel.find(CarouselControl);

            expect(carouselControls.length).toBe(2);
            expect(carouselControls.at(0).props().direction).toBe("left");
            expect(carouselControls.at(1).props().direction).toBe("right");
        });
    });

    describe("with navigation controls", () => {
        it("moves to the next image when the right control is clicked", () => {
            const carouselControls = carousel.find(CarouselControl);
            const rightControl = carouselControls.at(1);

            rightControl.simulate("click");

            const carouselItems = carousel.find(CarouselItem);
            expect(carousel.state().activeIndex).toBe(1);
            expect(carouselItems.at(0).props().status).not.toBe("active");
            expect(carouselItems.at(1).props().status).toBe("active");
        });

        it("moves to the first image when the right control of last image is clicked", () => {
            carousel.setState({ activeIndex: 1 });
            const carouselControls = carousel.find(CarouselControl);
            const rightControl = carouselControls.at(1);

            rightControl.simulate("click");

            const carouselItems = carousel.find(CarouselItem);
            expect(carousel.state().activeIndex).toBe(0);
            expect(carouselItems.at(0).props().status).toBe("active");
            expect(carouselItems.at(1).props().status).not.toBe("active");
        });

        it("moves to the previous image when the left control is clicked", () => {
            carousel.setState({ activeIndex: 1 });
            const carouselControls = carousel.find(CarouselControl);
            const leftControl = carouselControls.at(0);

            leftControl.simulate("click");

            const carouselItems = carousel.find(CarouselItem);
            expect(carousel.state().activeIndex).toBe(0);
            expect(carouselItems.at(0).props().status).toBe("active");
            expect(carouselItems.at(1).props().status).not.toBe("active");
        });

        it("moves to the last image when the left control on first image is clicked", () => {
            const carouselControls = carousel.find(CarouselControl);
            const leftControl = carouselControls.at(0);

            leftControl.simulate("click");

            const carouselItems = carousel.find(CarouselItem);
            expect(carousel.state().activeIndex).toBe(1);
            expect(carouselItems.at(0).props().status).not.toBe("active");
            expect(carouselItems.at(1).props().status).toBe("active");
        });

        describe("on a mobile device", () => {
            const swipeEventMock = (direction: "right" | "left") => new CustomEvent(`swipe${direction}`, {
                detail: {
                    originPageX: direction === "right" ? 12 : 23,
                    originPageY: direction === "right" ? 23 : 12,
                    pageX: 10,
                    pageY: 12
                }
            });

            const carouselItemWrapper = document.createElement("div");
            const carouselItem1Mock = document.createElement("div"); // a mock of the carouselItem node returned by ref
            const carouselItem2Mock = document.createElement("div");
            carouselItemWrapper.appendChild(carouselItem1Mock);
            carouselItemWrapper.appendChild(carouselItem2Mock);

            it("registers swipe events on carousel items", () => {
                const carouselInstance = carousel.instance() as any;
                carouselInstance.carouselItems = [ carouselItem1Mock ];
                spyOn(carouselItem1Mock, "addEventListener").and.callThrough();
                spyOn(carouselInstance, "registerSwipeEvents").and.callThrough();

                carouselInstance.componentDidMount();

                expect(carouselInstance.registerSwipeEvents).toHaveBeenCalled();
                expect(carouselItem1Mock.addEventListener).toHaveBeenCalledTimes(4);
            });

            it("moves to the next carousel item when swiped to the left", () => {
                const carouselInstance = carousel.instance() as any;
                carouselInstance.carouselItems = [ carouselItem1Mock, carouselItem2Mock ];

                carouselInstance.componentDidMount();
                carouselItem1Mock.dispatchEvent(swipeEventMock("left"));
                expect(carousel.state("position")).not.toBe(0);
                // expect(carouselInstance.swipingRight).toBe(false);
            });
        });
    });

    describe("with click action", () => {
        it("executes the specified microflow when a carousel item is clicked", () => {
            spyOn(window.mx.ui, "action").and.callThrough();
            carousel = createCarousel(lorem.word());

            carousel.find(CarouselItem).simulate("click");

            expect(window.mx.ui.action).toHaveBeenCalledWith(images[0].onClickMicroflow, {
                error: jasmine.any(Function),
                params: {
                    guids: [ contextGuid ]
                }
            });
        });

        it("shows an error when a carousel item is clicked with an invalid microflow", () => {
            const actionErrorMessage = "An error occurred while executing action: mx.ui.action error mock";
            spyOn(window.mx.ui, "action").and.callFake((actionname: string, action: { error: (e: Error) => void}) => {
                action.error(new Error("mx.ui.action error mock"));
            });
            carousel = createCarousel(lorem.word());

            carousel.find(CarouselItem).simulate("click");

            expect(carousel.state().alertMessage).toBe(actionErrorMessage);
            const alert = carousel.find(Alert);
            expect(alert.props().message).toBe(carousel.state().alertMessage);
        });

        it("opens the specified page when a carousel item is clicked", () => {
            spyOn(window.mx.ui, "openForm").and.callThrough();
            carousel = createCarousel(undefined, lorem.word());
            const carouselItem = carousel.find(CarouselItem);

            carouselItem.simulate("click");

            expect(window.mx.ui.openForm).toHaveBeenCalledWith(images[0].onClickForm, { error: jasmine.any(Function) });
        });

        it("shows an error when a carousel item is clicked with an invalid form", () => {
            const openFormErrorMessage = "An error occurred while opening form: mx.ui.openForm error mock";

            spyOn(window.mx.ui, "openForm").and.callFake((path: string, args: { error: (e: Error) => void}) => {
                args.error(new Error("mx.ui.openForm error mock"));
            });
            carousel = createCarousel(undefined, lorem.word());

            carousel.find(CarouselItem).simulate("click");

            expect(carousel.state().alertMessage).toBe(openFormErrorMessage);
            const alert = carousel.find(Alert);
            expect(alert.props().message).toBe(carousel.state().alertMessage);
        });

        it("executes the microflow with both microflow and form specified, on carousel item is clicked", () => {
            spyOn(window.mx.ui, "action").and.callThrough();
            spyOn(window.mx.ui, "openForm").and.callThrough();
            carousel = createCarousel(lorem.word(), lorem.word());

            carousel.find(CarouselItem).simulate("click");

            expect(window.mx.ui.action).toHaveBeenCalled();
            expect(window.mx.ui.openForm).not.toHaveBeenCalled();
        });
    });

    describe("without click action", () => {
        it("does not open a page when a carousel item is clicked", () => {
            spyOn(window.mx.ui, "openForm").and.callThrough();
            carousel = createCarousel();

            carousel.find(CarouselItem).simulate("click");

            expect(window.mx.ui.openForm).not.toHaveBeenCalled();
        });

        it("does not respond when a carousel item is clicked", () => {
            spyOn(window.mx.ui, "action").and.callThrough();
            carousel = createCarousel();

            carousel.find(CarouselItem).simulate("click");

            expect(window.mx.ui.action).not.toHaveBeenCalled();
        });
    });

    afterAll(() => window.mx = defaultMx);
});
