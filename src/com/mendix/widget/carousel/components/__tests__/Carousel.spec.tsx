import { shallow } from "enzyme";
import * as React from "react";

import { Carousel, CarouselProps } from "../Carousel";

describe("Carousel component", () => {
    const staticImages = [
        { imageUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" },
        { imageUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" }
    ];
    const render = (props: CarouselProps) => shallow(<Carousel {...props} />);

    it("should render carousel structure", () => {
        const output = render({ images: staticImages });
        expect(output).toMatchStructure(
            <div className="carousel">
                <div className="carousel-inner" />
            </div>
        );
    });

    it("should render carousel with 2 children", () => {
        const wrapper = render({ images: staticImages });
        expect(wrapper.find(".carousel-inner").children().length).toEqual(staticImages.length);
    });

    it("should render carousel with class carousel", () => {
        const output = render({ images: staticImages });
        expect(output).toHaveClass("carousel");
    });

    it("should render carousel child to have class carousel-inner", () => {
        const output = render({ images: staticImages });
        expect(output.children()).toHaveClass("carousel-inner");
    });

    xit("should render carousel with only first child active", () => {
        const wrapper = render({ images: staticImages });
        expect(wrapper.find(".active").length).toEqual(1);
    });
});
