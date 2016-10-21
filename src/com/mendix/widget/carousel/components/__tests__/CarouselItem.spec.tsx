import { ReactWrapper, ShallowWrapper, mount, shallow } from "enzyme";
import * as React from "react";

import { CarouselItem, CarouselItemProps } from "../CarouselItem";

describe("CarouselItem component", () => {
    const imageUrl = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    let shallowWrapper: ShallowWrapper<CarouselItemProps, {}>;

    beforeEach(() => {
        shallowWrapper = shallow(<CarouselItem imageUrl={imageUrl} active={true} />);
    });

    it("should be a div with classes item & active, with an img element as the only child", () => {
        expect(shallowWrapper.equals(
            <div className="item active">
                <img src={ imageUrl } alt="item" />
            </div>
        )).toBe(true);
    });

    describe("FullDOM", () => {
        let fullDOMWrapper: ReactWrapper<CarouselItemProps, {}>;

        beforeEach(() => {
            fullDOMWrapper = mount(<CarouselItem imageUrl={imageUrl} active={true} />);
        });

        it("should let props be set", () => {
            expect(fullDOMWrapper.props().imageUrl).toBe(imageUrl);
            expect(fullDOMWrapper.props().active).toBe(true);
            fullDOMWrapper.setProps({ active: false, imageUrl: "test.jpg" });
            expect(fullDOMWrapper.props().imageUrl).toBe("test.jpg");
            expect(fullDOMWrapper.props().active).toBe(false);
        });
    });
});
