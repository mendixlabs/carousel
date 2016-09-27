declare var logger: mendix.logger;

import classNames = require("ImageCarouselReact/lib/classnames");
import * as React from "ImageCarouselReact/lib/react";

import { IBootstrapProps, getClassSet } from "../utils/bootstrapUtils";

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
    const { className, bsProps } = this.props;
    const classes = getClassSet(bsProps);
    const props = Object.assign({}, {children: this.props.children}, this.props.elementProps);

    return (
      <div
        {...props}
        className={classNames(className, classes)}
      />
    );
  }
}

export default CarouselCaption;
