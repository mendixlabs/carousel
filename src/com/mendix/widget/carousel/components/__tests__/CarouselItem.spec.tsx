import { shallow } from "enzyme";
import * as React from "react";

import { CarouselItem, CarouselItemProps } from "../CarouselItem";

describe("CarouselItem component", () => {
    const imageUrl = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    const render = (props: CarouselItemProps) => shallow(React.createElement(CarouselItem, props));

    it("should render CarouselItem active", () => {
        const output = render({ imageUrl, active: true });
        expect(output).toBeElement(
            <div className="item active">
                <img src={ imageUrl } alt="item"/>
            </div>
        );
    });

    it("should render CarouselItem inactive", () => {
        const output = render({ imageUrl, active: false });
        expect(output).toBeElement(
            <div className="item">
                <img src={ imageUrl } alt="item" />
            </div>
        );
    });
});
