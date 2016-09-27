
declare var logger: mendix.logger;

import classNames = require("ImageCarouselReact/lib/classnames");
import * as React from "ImageCarouselReact/lib/react";

import { IBootstrapProps, getClassSet, prefix } from "../utils/bootstrapUtils";
import ValidComponentChildren from "../utils/ValidComponentChildren"; // Gets children that are React components
import Glyphicon from "./Glyphicon";
import SafeAnchor from "./SafeAnchor";

// TODO: `slide` should be `animate`.

// TODO: Use uncontrollable.

export interface ICarouselProps extends React.Props<Carousel> {
    /**
     * Adds a CSS transition and animation effect when sliding from one item to the next.
     * Set to false if you do not want this effect
     * 
     * @type {boolean}
     * @memberOf ICarouselProps
     */
    slide?: boolean;
    /**
     * Little dots at the bottom of each slide
     * 
     * @type {boolean}
     * @memberOf ICarouselProps
     */
    indicators?: boolean;
    /**
     * Time between auto transitions
     * 
     * @type {number}
     * @memberOf ICarouselProps
     */
    interval?: number;
    /**
     * Show or hide navigation controls
     * 
     * @type {boolean}
     * @memberOf ICarouselProps
     */
    controls?: boolean;
    /**
     * Pauses the carousel from transitioning when the mouse pointer enters the carousel
     * 
     * @type {boolean}
     * @memberOf ICarouselProps
     */
    pauseOnHover?: boolean;
    /**
     * Specifies whether the carousel should go through all slides continuously, or stop at the last slide
     * 
     * @type {boolean}
     * @memberOf ICarouselProps
     */
    wrap?: boolean;
    /**
     * Callback fired when the active item changes.
     * 
     * First argument will is a persisted event object
     */
    onTransition?: Function;
    onSlideEnd?: Function;
    /**
     * Index of the current image being showed on the carousel
     * 
     * @type {number}
     * @memberOf ICarouselProps
     */
    activeIndex?: number;
    /**
     * Index of the image that should be shown first
     * 
     * @type {number}
     * @memberOf ICarouselProps
     */
    defaultActiveIndex?: number;
    /**
     * Direction in which the carousel should auto-transition
     * 
     * @type {Direction}
     * @memberOf ICarouselProps
     */
    direction?: Direction;
    /**
     * Icon for the "prev" navigation control
     * 
     * @type {JSX.Element}
     * @memberOf ICarouselProps
     */
    prevIcon?: JSX.Element;
    /**
     * Icon for the "next" navigation control
     * 
     * @type {JSX.Element}
     * @memberOf ICarouselProps
     */
    nextIcon?: JSX.Element;
    className?: string;
    /**
     * Contains Base properties eg. Base CSS class and prefix for the component
     * Use only when you want to specify a non-bootstrap properties
     * 
     * @type {string}
     * @memberOf ICarouselProps
     */
    bsProps?: IBootstrapProps;
    elementProps?: {};
};

export type Direction = "prev" | "next";

export interface ICarouselState {
    activeIndex?: number;
    previousActiveIndex?: number;
    direction?: Direction;
}

export interface ICarouselEvent extends React.MouseEvent {
    direction: Direction;
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

        this.select(index, e);
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

        this.select(index, e);
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
    /**
     * EventHandler: Called when carousel transitions.
     * It calls the onTransition prop and passes in the event object
     * 
     * @private
     * @param {number} index
     * @param {*} e
     * @param {Direction} [direction]
     * @returns
     * 
     * @memberOf Carousel
     */
    private select(index: number, e: React.MouseEvent) { // TODO: temporary any
        logger.debug(this.loggerNode + " .select");

        const previousActiveIndex = this.getActiveIndex();

        const { onTransition } = this.props;

        if (onTransition) {
            onTransition(e);
        }

        if (this.props.activeIndex == null && index !== previousActiveIndex) {
            if (this.state.previousActiveIndex === null) {
                // If currently animating don't activate the new index.
                // TODO: look into queueing this canceled call and
                // animating after the current animation has ended.
                this.setState({
                activeIndex: index,
                previousActiveIndex,
            });
            }
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
                    onClick={(e: ICarouselEvent) => this.select(index, e)}
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
    /**
     * Renders the navigation controls (Arrow Left / Arrow Right)
     * 
     * @private
     * @param {boolean} wrap
     * @param {React.ReactChildren} children
     * @param {number} activeIndex
     * @param {JSX.Element} prevIcon
     * @param {JSX.Element} nextIcon
     * @param {IBootstrapProps} bsProps
     * @returns
     * 
     * @memberOf Carousel
     */
    private renderControls(
        wrap: boolean, children: React.ReactChildren, activeIndex: number,
        prevIcon: JSX.Element, nextIcon: JSX.Element, bsProps: IBootstrapProps
    ) {
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