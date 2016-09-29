declare var logger: mendix.logger;

import classNames = require("ImageCarouselReact/lib/classnames");
import * as React from "ImageCarouselReact/lib/react";

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
    const { className, bsProps } = this.props;
    const classes = prefix(bsProps);
    const children = {children: this.props.children};

    return (
      <div
        {...children}
        className={classNames(className, classes)}
      />
    );
  }
}

export default CarouselCaption;
