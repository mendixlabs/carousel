
declare var logger: mendix.logger;

import classNames = require("ImageCarouselReact/lib/classnames");
import * as React from "ImageCarouselReact/lib/react";

import { IBootstrapProps, getClassSet, prefix } from "../utils/bootstrapUtils";
import ValidComponentChildren from "../utils/ValidComponentChildren";
import Glyphicon from "./Glyphicon";
import SafeAnchor from "./SafeAnchor";

// TODO: `slide` should be `animate`.

// TODO: Use uncontrollable.

export interface ICarouselProps extends React.Props<Carousel> {
  slide?: boolean;
  indicators?: boolean;
  interval?: number;
  controls?: boolean;
  pauseOnHover?: boolean;
  wrap?: boolean;
  /**
   * Callback fired when the active item changes.
   *
   * ```js
   * (eventKey: any) => any | (eventKey: any, event: Object) => any
   * ```
   *
   * If this callback takes two or more arguments, the second argument will
   * be a persisted event object with `direction` set to the direction of the
   * transition.
   */
  onSelect?: Function;
  onSlideEnd?: Function;
  activeIndex?: number;
  defaultActiveIndex?: number;
  direction?: Direction;
  prevIcon?: JSX.Element;
  nextIcon?: JSX.Element;
  className?: string;
  bsProps?: IBootstrapProps;
  elementProps?: {};
};

export type Direction = "prev" | "next";

export interface ICarouselState {
  activeIndex?: number;
  previousActiveIndex?: number;
  direction?: Direction;
}

class Carousel extends React.Component<ICarouselProps, ICarouselState> {
  public static defaultProps: ICarouselProps = {
    bsProps: {
      bsClass: "carousel",
    },
    controls: true,
    indicators: true,
    interval: 5000,
    nextIcon: <Glyphicon glyph="chevron-right" />,
    pauseOnHover: true,
    prevIcon: <Glyphicon glyph="chevron-left" />,
    slide: true,
    wrap: true,
  };
  private isUnmounted: boolean;
  private timeout: number;
  private isPaused: boolean;
  private loggerNode: string;
  constructor(props: ICarouselProps, context: Carousel) {
    super(props, context);
    this.loggerNode = "Carousel";
    logger.debug(this.loggerNode + " .constructor");
    // bind context
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleItemAnimateOutEnd = this.handleItemAnimateOutEnd.bind(this);

    const { defaultActiveIndex } = props;

    this.state = {
      activeIndex: defaultActiveIndex != null ? defaultActiveIndex : 0,
      direction: null,
      previousActiveIndex: null,
    };

    this.isUnmounted = false;
  }

  public componentWillReceiveProps(nextProps: ICarouselProps) {
    logger.debug(this.loggerNode + " .componentWillReceiveProps");
    const activeIndex = this.getActiveIndex();
    // if index changes, store the previous index and update the swipe direction
    if (nextProps.activeIndex != null && nextProps.activeIndex !== activeIndex) {
      clearTimeout(this.timeout);

      this.setState({
        direction: nextProps.direction != null ?
          nextProps.direction :
          this.getDirection(activeIndex, nextProps.activeIndex),
        previousActiveIndex: activeIndex,
      });
    }
  }

  public componentDidMount() {
    logger.debug(this.loggerNode + " .componentDidMount");
    this.waitForNext();
  }

  public componentWillUnmount() {
    logger.debug(this.loggerNode + " .componentWillUnmount");
    clearTimeout(this.timeout);
    this.isUnmounted = true;
  }

  public render() {
    logger.debug(this.loggerNode + " .render");
    const { indicators, controls, wrap, prevIcon, nextIcon, className, children, bsProps } = this.props;

    const props = this.props; // const should hold all properties without the ones above included
    const activeIndex = this.getActiveIndex();

    const classes = Object.assign({}, getClassSet(props.bsProps), props.slide);

    return (
      <div
        {...props.elementProps}
        className={classNames(className, classes)}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
      >
        {indicators && this.renderIndicators(children as React.ReactChildren, activeIndex, bsProps)}

        <div className={prefix(bsProps, "inner")}>
          {this.getValidComponentChildren()}
        </div>

        {controls && this.renderControls(
          wrap, children as React.ReactChildren, activeIndex, prevIcon, nextIcon, bsProps
        )}
      </div>
    );
  }
  private getValidComponentChildren() {
    logger.debug(this.loggerNode + " .getValidComponentChildren");
    const { slide, children } = this.props;
    const { previousActiveIndex, direction } = this.state;
    const activeIndex = this.getActiveIndex();

    return ValidComponentChildren.map((children as React.ReactChildren),
            (child: (React.ReactChild), index: number) => {
              const active = index === activeIndex;
              const previousActive = slide && index === previousActiveIndex;

              return React.cloneElement(child as React.ReactElement<any>, {
                active,
                animateIn: active && previousActiveIndex != null && slide,
                animateOut: previousActive,
                index,
                direction,
                onAnimateOutEnd: previousActive ?
                  this.handleItemAnimateOutEnd : null,
              });
            }
          );
  }

  private handleMouseOver() {
    logger.debug(this.loggerNode + " .handleMouseOver");
    if (this.props.pauseOnHover) {
      this.pause();
    }
  }

  private handleMouseOut() {
    logger.debug(this.loggerNode + " .handleMouseOut");
    if (this.isPaused) {
      this.play();
    }
  }

  private handlePrev(e: React.MouseEvent) {
    logger.debug(this.loggerNode + " .handlePrev");
    let index = this.getActiveIndex() - 1;

    if (index < 0) {
      if (!this.props.wrap) {
        return;
      }
      index = ValidComponentChildren.count(this.props.children as React.ReactChildren) - 1;
    }

    this.select(index, e, "prev");
  }

  private handleNext(e: React.MouseEvent) {
    logger.debug(this.loggerNode + " .handleNext");
    let index = this.getActiveIndex() + 1;
    const count = ValidComponentChildren.count(this.props.children as React.ReactChildren);

    if (index > count - 1) {
      if (!this.props.wrap) {
        return;
      }
      index = 0;
    }

    this.select(index, e, "next");
  }

  private handleItemAnimateOutEnd() {
    logger.debug(this.loggerNode + " .handleItemAnimateOutEnd");
    this.setState({
      direction: null,
      previousActiveIndex: null,
    }, () => {
      this.waitForNext();

      if (this.props.onSlideEnd) {
        this.props.onSlideEnd();
      }
    });
  }

  private getActiveIndex() {
    logger.debug(this.loggerNode + " .getActiveIndex");
    const activeIndexProp = this.props.activeIndex;
    return activeIndexProp != null ? activeIndexProp : this.state.activeIndex;
  }
  /**
   * Returns direction in which carousel will auto swipe
   * 
   * @private
   * @param {number} prevIndex
   * @param {number} index
   * @returns
   * 
   * @memberOf Carousel
   */
  private getDirection(prevIndex: number, index: number) {
    logger.debug(this.loggerNode + " .getDirection");
    if (prevIndex === index) {
      return null;
    }

    return prevIndex > index ? "prev" as Direction : "next" as Direction;
  }

  private select(index: number, e, direction?: Direction) {
    logger.debug(this.loggerNode + " .select");
    clearTimeout(this.timeout);

    // TODO: Is this necessary? Seems like the only risk is if the component
    // unmounts while handleItemAnimateOutEnd fires.
    if (this.isUnmounted) {
      return;
    }

    const previousActiveIndex = this.getActiveIndex();
    direction = direction || this.getDirection(previousActiveIndex, index);

    const { onSelect } = this.props;

    if (onSelect) {
      if (onSelect.length > 1) {
        // React SyntheticEvents are pooled, so we need to remove this event
        // from the pool to add a custom property. To avoid unnecessarily
        // removing objects from the pool, only do this when the listener
        // actually wants the event.
        if (e) {
          e.persist();
          e.direction = direction;
        } else {
          e = { direction };
        }

        onSelect(index, e);
      } else {
        onSelect(index);
      }
    }

    if (this.props.activeIndex == null && index !== previousActiveIndex) {
      if (this.state.previousActiveIndex != null) {
        // If currently animating don't activate the new index.
        // TODO: look into queueing this canceled call and
        // animating after the current animation has ended.
        return;
      }

      this.setState({
        activeIndex: index,
        previousActiveIndex,
        direction,
      });
    }
  }

  private waitForNext() {
    logger.debug(this.loggerNode + " .waitForNext");
    const { slide, interval, activeIndex: activeIndexProp } = this.props;

    if (!this.isPaused && slide && interval && activeIndexProp == null) {
      this.timeout = setTimeout(this.handleNext, interval);
    }
  }

  // This might be a public API.
  private pause() {
    logger.debug(this.loggerNode + " .pause");
    this.isPaused = true;
    clearTimeout(this.timeout);
  }

  // This might be a public API.
  private play() {
    logger.debug(this.loggerNode + " .play");
    this.isPaused = false;
    this.waitForNext();
  }

  private renderIndicators(children: React.ReactChildren, activeIndex: number, bsProps: IBootstrapProps) {
    logger.debug(this.loggerNode + " .renderIndicators");
    let indicators: Array<JSX.Element> = [];

    ValidComponentChildren.forEach(children, (child: React.ReactChild, index: number) => {
      indicators.push(
        <li
          key={index}
          className={index === activeIndex ? "active" : null}
          onClick={e => this.select(index, e)}
        />,

        // Force whitespace between indicator elements. Bootstrap requires
        // this for correct spacing of elements.
        " "
      );
    });

    return (
      <ol className={prefix(bsProps, "indicators")}>
        {indicators}
      </ol>
    );
  }

  private renderControls(wrap: boolean, children: React.ReactChildren, activeIndex: number, prevIcon: JSX.Element, nextIcon: JSX.Element, bsProps: IBootstrapProps) {
    logger.debug(this.loggerNode + " .renderControls");
    const controlClassName = prefix(bsProps, "control");
    const count = ValidComponentChildren.count(children);

    return [
      (wrap || activeIndex !== 0) && (
        <SafeAnchor
          key="prev"
          className={classNames(controlClassName, "left")}
          onClick={this.handlePrev}
        >
          {prevIcon}
        </SafeAnchor>
      ),

      (wrap || activeIndex !== count - 1) && (
        <SafeAnchor
          key="next"
          className={classNames(controlClassName, "right")}
          onClick={this.handleNext}
        >
          {nextIcon}
        </SafeAnchor>
      ),
    ];
  }
}

// export default bsClass('carousel', Carousel);
export default Carousel;
