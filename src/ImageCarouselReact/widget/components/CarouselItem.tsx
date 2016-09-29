declare var logger: mendix.logger;

import classNames = require("ImageCarouselReact/lib/classnames");

import * as React from "ImageCarouselReact/lib/react";
import ReactDOM = require("ImageCarouselReact/lib/react-dom");

import { IObject } from "../utils/bootstrapUtils";
import TransitionEvents from "../utils/TransitionEvents";

import { Direction } from "./Carousel";

// TODO: This should use a timeout instead of TransitionEvents, or else just
// not wait until transition end to trigger continuing animations.

export interface ICarouselItemProps extends React.Props<CarouselItem> {
  active?: boolean;
  animateIn?: boolean;
  animateOut?: boolean;
  direction?: Direction;
  onAnimateOutEnd?: Function;
  index?: number;
  className?: string;
  onClick?: React.EventHandler<React.MouseEvent<HTMLElement>>;
  slide?: boolean;
};

interface ICarouselItemState {
  direction: ItemDirection;
}

type ItemDirection = "right" | "left";

export class CarouselItem extends React.Component<ICarouselItemProps, ICarouselItemState> {
  public static defaultProps: ICarouselItemProps = {
    active: false,
    animateIn: false,
    animateOut: false,
    slide: true,
  };
  private isUnmounted: boolean;
  private loggerNode: string;
  constructor(props: ICarouselItemProps, context: CarouselItem) {
    super(props, context);
    this.loggerNode = "CarouselItem";
    logger.debug(this.loggerNode + " .constructor");
    // bind context
    this.handleAnimateOutEnd = this.handleAnimateOutEnd.bind(this);

    this.state = {
      direction: null,
    };

    this.isUnmounted = false;
  }

  public componentWillReceiveProps(nextProps: ICarouselItemProps) {
    logger.debug(this.loggerNode + " .componentWillReceiveProps");
    if (this.props.active !== nextProps.active) {
      this.setState({ direction: null });
    }
  }

  public shouldComponentUpdate(nextProps: ICarouselItemProps) {
    return this.props.slide || nextProps !== this.props;
  }

  public componentDidUpdate(prevProps: ICarouselItemProps) {
    logger.debug(this.loggerNode + " .componentDidUpdate");
    const { active } = this.props;
    const prevActive = prevProps.active;
    // Call or register slide end handler for previously active item
    if (!active && prevActive) {
      if (this.props.slide) {
        TransitionEvents.addEndEventListener(
          ReactDOM.findDOMNode(this), this.handleAnimateOutEnd
        );
      } else {
        this.handleAnimateOutEnd();
      }
    }
    // animate transition
    if (active !== prevActive && this.props.slide) {
      setTimeout(() => this.startAnimation(), 20);
    }
  }

  public componentWillUnmount() {
    logger.debug(this.loggerNode + " .componentWillUnmount");
    this.isUnmounted = true;
  }

  public render() {
    logger.debug(this.loggerNode + " .render");
    const { direction, active, animateIn, animateOut, className } = this.props;
    const props = {
      children: this.props.children,
      onClick: this.props.onClick,
    };

    const classes: IObject = {
      active: active && !animateIn || animateOut,
      item: true,
    };
    if (direction && active && animateIn) {
      classes[direction] = true;
    }
    if (this.state.direction && (animateIn || animateOut)) {
      classes[this.state.direction] = true;
    }

    return (
      <div
        {...props}
        className={classNames(className, classes)}
        />
    );
  }
  /**
   * EventHandler: Called when animation/transition ends
   * 
   * @private
   * @returns
   * 
   * @memberOf CarouselItem
   */
  private handleAnimateOutEnd() {
    logger.debug(this.loggerNode + " .handleAnimateOutEnd");
    if (this.isUnmounted) {
      return;
    }

    if (this.props.onAnimateOutEnd) {
      this.props.onAnimateOutEnd(this.props.index);
    }
  }
  /**
   * Triggers the slide animation in the specified direction 
   * 
   * @private
   * @returns
   * 
   * @memberOf CarouselItem
   */
  private startAnimation() {
    logger.debug(this.loggerNode + " .startAnimation");
    if (this.isUnmounted) {
      return;
    }

    this.setState({
      direction: this.props.direction === "prev" ? "right" : "left",
    });
  }
}

export default CarouselItem;
