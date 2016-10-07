/**
 * Original code can be found at:
 * https://github.com/react-bootstrap/react-bootstrap/blob/master/src/CarouselCaption.js
 * 
 * This code is under the MIT license found here:
 * https://github.com/react-bootstrap/react-bootstrap/blob/master/LICENSE
 */

import classNames = require("Carousel/lib/classnames");
import * as React from "Carousel/lib/react";

import { IBootstrapProps, prefix } from "../utils/bootstrapUtils";

interface ICaptionProps extends React.Props<CarouselCaption> {
  componentClass?: string;
  className?: string;
  bsProps?: IBootstrapProps;
  elementProps?: {};
};

class CarouselCaption extends React.Component<ICaptionProps, {}> {
  public static defaultProps: ICaptionProps = {
    bsProps: {
      bsClass: "carousel-caption",
    },
    componentClass: "div",
  };
  private loggerNode: string = "CarouselCaption";

  public render() {
    logger.debug(this.loggerNode + " .render");
    const { className, bsProps, componentClass: Component } = this.props;
    const classes = prefix(bsProps);
    const children = {children: this.props.children};

    return (
      <Component
        {...children}
        className={classNames(className, classes)}
      />
    );
  }
}

export default CarouselCaption;
