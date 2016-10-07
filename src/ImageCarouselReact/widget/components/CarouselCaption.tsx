/**
 * Original code can be found at:
 * https://github.com/react-bootstrap/react-bootstrap/blob/master/src/CarouselCaption.js
 * 
 * This code is under the MIT license found here:
 * https://github.com/react-bootstrap/react-bootstrap/blob/master/LICENSE
 */

import classNames = require("ImageCarouselReact/lib/classnames");
import * as React from "ImageCarouselReact/lib/react";

import { prefix } from "../utils/bootstrapUtils";

interface CaptionProps extends React.Props<CarouselCaption> {
    componentClass?: string;
    className?: string;
    bootstrapClass?: string;
    elementProps?: {};
}

class CarouselCaption extends React.Component<CaptionProps, {}> {
    public static defaultProps: CaptionProps = {
        bootstrapClass: "carousel-caption",
        componentClass: "div",
    };
    private loggerNode: string = "CarouselCaption";

    public render() {
        logger.debug(this.loggerNode + " .render");
        const { className, bootstrapClass, componentClass: Component } = this.props;
        const classes = prefix(bootstrapClass);
        const children = { children: this.props.children };

        return (
            <Component
                {...children}
                className={classNames(className, classes)}
                />
        );
    }
}

export default CarouselCaption;
