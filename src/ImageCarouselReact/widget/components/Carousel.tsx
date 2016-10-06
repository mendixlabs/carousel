/**
 * Original code can be found at:
 * https://github.com/react-bootstrap/react-bootstrap/blob/master/src/Carousel.js
 * 
 * This code is under the MIT license found here:
 * https://github.com/react-bootstrap/react-bootstrap/blob/master/LICENSE
 */
import { prefix } from "../utils/bootstrapUtils";
import ValidComponentChildren from "../utils/ValidComponentChildren";
import Glyphicon from "./Glyphicon";
import classNames = require("ImageCarouselReact/lib/classnames");
import * as React from "ImageCarouselReact/lib/react";

export interface ICarouselProps extends React.Props<Carousel> {
    slide?: boolean;
    showIndicators?: boolean;
    /**
     * In milliseconds
     */
    interval?: number;
    showControls?: boolean;
    pauseOnHover?: boolean;
    wrap?: boolean;
    onSlide?: Function;
    onSlideEnd?: Function;
    activeIndex?: number;
    defaultActiveIndex?: number;
    direction?: Direction;
    prevIcon?: JSX.Element;
    nextIcon?: JSX.Element;
    className?: string;
    bootstrapClass?: string;
    elementProps?: {};
};
export type Direction = "prev" | "next";

export interface ICarouselState {
    activeIndex?: number;
    previousActiveIndex?: number;
    direction?: Direction;
}

export interface ICarouselEvent<T> extends React.MouseEvent<T> {
    direction: Direction;
}

class Carousel extends React.Component<ICarouselProps, ICarouselState> {
    public static defaultProps: ICarouselProps = {
        bootstrapClass: "carousel",
        interval: 5000,
        nextIcon: <Glyphicon glyph="chevron-right" />,
        pauseOnHover: true,
        prevIcon: <Glyphicon glyph="chevron-left" />,
        showControls: true,
        showIndicators: true,
        slide: true,
        wrap: true,
    };
    private timeout: number;
    private isPaused: boolean;
    private loggerNode: string;
    constructor(props: ICarouselProps, context: Carousel) {
        super(props, context);
        this.loggerNode = "Carousel";
        logger.debug(this.loggerNode + " .constructor");
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
    }

    public componentWillReceiveProps(nextProps: ICarouselProps) {
        logger.debug(this.loggerNode + " .componentWillReceiveProps");
        const activeIndex = this.getActiveIndex();
        if (nextProps.activeIndex != null && nextProps.activeIndex !== activeIndex) {
            clearTimeout(this.timeout);

            this.setState({
                direction: nextProps.direction != null ?
                    nextProps.direction : this.getDirection(activeIndex, nextProps.activeIndex),
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
    }

    public render() {
        logger.debug(this.loggerNode + " .render");
        const props = this.props;
        const { showIndicators, showControls, wrap, prevIcon} = props;
        const { nextIcon, className, children, bootstrapClass } = props;
        const activeIndex = this.getActiveIndex();
        let classes: any = {slide: this.props.slide};
        classes[bootstrapClass] = true;

        const indicators = showIndicators &&
                this.renderIndicators(children as React.ReactChildren, activeIndex, bootstrapClass);
        const controls = showControls &&
                this.renderControls(wrap, children as React.ReactChildren,
                    activeIndex, prevIcon, nextIcon, bootstrapClass);

        return (
            <div
                {...props.elementProps}
                className={classNames(className, classes)}
                onMouseOver={this.handleMouseOver}
                onMouseOut={this.handleMouseOut}
            >
                {indicators}
                <div className={prefix(bootstrapClass, "inner")}>
                    {this.getValidComponentChildren()}
                </div>
                {controls}
            </div>
        );
    }

    private renderIndicators(children: React.ReactChildren, activeIndex: number, bootstrapClass: string) {
        logger.debug(this.loggerNode + " .renderIndicators");
        let indicators: Array<JSX.Element> = [];
        const style = {
            marginRight: "5px",
        };
        ValidComponentChildren.forEach(children, (child: React.ReactChild, index: number) => {
            indicators.push(
                <li
                    key={index}
                    className={index === activeIndex ? "active" : null} // TODO: investigate empty string
                    style={style}
                    onClick={(e: ICarouselEvent<HTMLLIElement>) => this.slide(index, e)}
                />
            );
        });

        return (
            <ol className={prefix(bootstrapClass, "indicators")}>
                {indicators}
            </ol>
        );
    }
    private renderControls(
        wrap: boolean, children: React.ReactChildren, activeIndex: number,
        prevIcon: JSX.Element, nextIcon: JSX.Element, bootstrapClass: string
    ) {
        logger.debug(this.loggerNode + " .renderControls");
        const controlClassName = prefix(bootstrapClass, "control");
        const count = ValidComponentChildren.count(children);

        return [
            ((wrap && count > 1) || activeIndex !== 0) && (
                <div
                    key="prev"
                    className={classNames(controlClassName, "left")}
                    onClick={this.handlePrev}
                >
                    {prevIcon}
                </div>
            ),

            ((wrap && count > 1) || activeIndex !== count - 1) && (
                <div
                    key="next"
                    className={classNames(controlClassName, "right")}
                    onClick={this.handleNext}
                >
                    {nextIcon}
                </div>
            ),
        ];
    }
    private getValidComponentChildren() {
        logger.debug(this.loggerNode + " .getValidComponentChildren");
        const { slide, children } = this.props;
        const { previousActiveIndex, direction } = this.state;
        const activeIndex = this.getActiveIndex();

        return ValidComponentChildren.map((children as React.ReactChildren),
            (child: (React.ReactChild), index: number) => {
                const active = index === activeIndex;
                const previousActive = index === previousActiveIndex;
                return (
                    React.cloneElement(child as React.ReactElement<any>, {
                        active,
                        animateIn: active && previousActiveIndex != null && slide,
                        animateOut: slide && previousActive,
                        index,
                        direction,
                        onAnimateOutEnd: previousActive ?
                            this.handleItemAnimateOutEnd : null,
                        slide,
                    })
                );
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
    private handlePrev(e: ICarouselEvent<HTMLDivElement>) {
        logger.debug(this.loggerNode + " .handlePrev");
        let index = this.getActiveIndex() - 1;

        if (index < 0) {
            if (!this.props.wrap) {
                return;
            }
            index = ValidComponentChildren.count(this.props.children as React.ReactChildren) - 1;
        }

        this.slide(index, e, "prev");
    }
    private handleNext(e: ICarouselEvent<HTMLDivElement>) {
        logger.debug(this.loggerNode + " .handleNext");
        let index = this.getActiveIndex() + 1;
        const count = ValidComponentChildren.count(this.props.children as React.ReactChildren);

        if (index > count - 1) {
            if (!this.props.wrap) {
                return;
            }
            index = 0;
        }

        this.slide(index, e, "next");
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
    private getDirection(prevIndex: number, index: number) {
        logger.debug(this.loggerNode + " .getDirection");
        if (prevIndex === index) {
            return null;
        }
        const direction: Direction = prevIndex > index ? "prev" : "next";
        return direction;
    }
    private slide(index: number, e: ICarouselEvent<HTMLElement>, direction?: Direction) {
        logger.debug(this.loggerNode + " .slide");

        const previousActiveIndex = this.getActiveIndex();
        direction = direction || this.getDirection(previousActiveIndex, index);

        const { onSlide } = this.props;

        if (onSlide) {
            e.persist();
            e.direction = direction;
            onSlide(e);
        }
        if (this.props.activeIndex == null && index !== previousActiveIndex) {
            if (this.state.previousActiveIndex === null || !this.props.slide) {
                this.setState({
                    activeIndex: index,
                    previousActiveIndex,
                    direction,
                });
            }
        }
    }
    private waitForNext() {
        logger.debug(this.loggerNode + " .waitForNext");
        const { interval, activeIndex: activeIndexProp } = this.props;

        if (!this.isPaused && interval && activeIndexProp == null) {
            this.timeout = setTimeout(this.handleNext, interval);
        }
    }

    private pause() {
        logger.debug(this.loggerNode + " .pause");
        this.isPaused = true;
        clearTimeout(this.timeout);
    }

    private play() {
        logger.debug(this.loggerNode + " .play");
        this.isPaused = false;
        this.waitForNext();
    }
}

export default Carousel;
