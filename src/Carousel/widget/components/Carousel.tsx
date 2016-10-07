/**
 * Original code can be found at:
 * https://github.com/react-bootstrap/react-bootstrap/blob/master/src/Carousel.js
 * 
 * This code is under the MIT license found here:
 * https://github.com/react-bootstrap/react-bootstrap/blob/master/LICENSE
 */
import { IBootstrapProps, prefix } from "../utils/bootstrapUtils";
import ValidComponentChildren from "../utils/ValidComponentChildren";
import Glyphicon from "./Glyphicon";
import classNames = require("Carousel/lib/classnames");
import * as React from "Carousel/lib/react"; // Gets children that are React components

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
    slide?: boolean; // TODO: Animate
    /**
     * Little dots at the bottom of each slide
     *
     * @type {boolean}
     * @memberOf ICarouselProps
     */
    showIndicators?: boolean;
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
    showControls?: boolean;
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
     * If this callback takes two or more arguments, the second argument will
     * be a persisted event object with `direction` set to the direction of the
     * transition.
     * First argument is the target index i.e Index of the item that triggered it
     */
    onSlide?: Function;
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

export interface ICarouselEvent<T> extends React.MouseEvent<T> {
    direction: Direction;
}

class Carousel extends React.Component<ICarouselProps, ICarouselState> {
    public static defaultProps: ICarouselProps = {
        bsProps: {
            bsClass: "carousel",
        },
        interval: 5000,
        nextIcon: <Glyphicon glyph="chevron-right" />,
        pauseOnHover: true,
        prevIcon: <Glyphicon glyph="chevron-left" />,
        showControls: true,
        showIndicators: true,
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
        // if index changes, store the previous index and update the swipe direction and prev index
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
        this.isUnmounted = true; // TODO: Clear out isUnmounted
    }

    public render() {
        logger.debug(this.loggerNode + " .render");
        const props = this.props;
        const { showIndicators, showControls, wrap, prevIcon, nextIcon, className, children, bsProps } = props;
        const activeIndex = this.getActiveIndex();
        let classes: any = {slide: this.props.slide};
        classes[props.bsProps.bsClass] = true;

        const indicators = showIndicators &&
                this.renderIndicators(children as React.ReactChildren, activeIndex, bsProps);
        const controls = showControls &&
                this.renderControls(wrap, children as React.ReactChildren,
                    activeIndex, prevIcon, nextIcon, bsProps);

        return (
            <div
                {...props.elementProps}
                className={classNames(className, classes)}
                onMouseOver={this.handleMouseOver}
                onMouseOut={this.handleMouseOut}
            >
                {indicators}
                <div className={prefix(bsProps, "inner")}>
                    {this.getValidComponentChildren()}
                </div>
                {controls}
            </div>
        );
    }
    /**
     * Returns those dots at the bottom that represent the different carousel images
     *
     * @private
     * @param {React.ReactChildren} children
     * @param {number} activeIndex
     * @param {IBootstrapProps} bsProps
     * @returns
     *
     * @memberOf Carousel
     */
    private renderIndicators(children: React.ReactChildren, activeIndex: number, bsProps: IBootstrapProps) {
        logger.debug(this.loggerNode + " .renderIndicators");
        let indicators: Array<JSX.Element> = [];
        const style = {
            marginRight: "5px", // adds spacing between indicators
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
            <ol className={prefix(bsProps, "indicators")}>
                {indicators}
            </ol>
        );
    }
    /**
     * Renders the navigation controls (Arrow Left / Arrow Right)
     *
     * @param wrap this is the cool wrapper?
     * @param {React.ReactChildren} children
     * @param {number} activeIndex
     * @param prevIcon
     * @param {JSX.Element} nextIcon
     * @param {IBootstrapProps} bsProps
     *
     */
    private renderControls(
        wrap: boolean, children: React.ReactChildren, activeIndex: number,
        prevIcon: JSX.Element, nextIcon: JSX.Element, bsProps: IBootstrapProps
    ) {
        logger.debug(this.loggerNode + " .renderControls");
        const controlClassName = prefix(bsProps, "control");
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
    /**
     * Gets only the children that are actual components and clones them with the required props
     *
     * @private
     * @returns
     *
     * @memberOf Carousel
     */
    private getValidComponentChildren() {
        logger.debug(this.loggerNode + " .getValidComponentChildren");
        const { slide, children } = this.props;
        const { previousActiveIndex, direction } = this.state;
        const activeIndex = this.getActiveIndex();
        /**
         * Returns component children, they should ideally be of type CarouselItem
         */
        return ValidComponentChildren.map((children as React.ReactChildren),
            (child: (React.ReactChild), index: number) => {
                const active = index === activeIndex; // check if item is currently active
                const previousActive = index === previousActiveIndex; // check if item was previously active
                // TODO: Add documentation
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
    /**
     * EventHandler: Used to handle pauseOnHover feature
     * Pauses slide
     *
     * @private
     *
     * @memberOf Carousel
     */
    private handleMouseOver() {
        logger.debug(this.loggerNode + " .handleMouseOver");
        if (this.props.pauseOnHover) {
            this.pause();
        }
    }
    /**
     * EventHandler: Used to handle pauseOnHover feature.
     * Re-plays slide if paused
     *
     * @private
     *
     * @memberOf Carousel
     */
    private handleMouseOut() {
        logger.debug(this.loggerNode + " .handleMouseOut");
        if (this.isPaused) {
            this.play();
        }
    }
    /**
     * EventHandler: Called on manual back navigation
     *
     * @private
     * @param {ICarouselEvent} e
     * @returns
     *
     * @memberOf Carousel
     */
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
    /**
     * EventHandler: Called on manual forward navigation
     *
     * @private
     * @param {ICarouselEvent} e
     * @returns
     *
     * @memberOf Carousel
     */
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
    /**
     * EventHandler: Called when item has completed sliding out
     * Resets direction and previousActiveIndex state and schedules next transition
     * Also calls custom onSlideEnd event if any.
     *
     * @private
     *
     * @memberOf Carousel
     */
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
    /**
     * Returns the currenct active index
     *
     * @private
     * @returns
     *
     * @memberOf Carousel
     */
    private getActiveIndex() {
        logger.debug(this.loggerNode + " .getActiveIndex");
        const activeIndexProp = this.props.activeIndex;
        return activeIndexProp != null ? activeIndexProp : this.state.activeIndex;
    }
    /**
     * Returns direction in which the carousel is swiping based on the indexes
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
        const direction: Direction = prevIndex > index ? "prev" : "next";
        return direction;
    }
    /**
     * EventHandler: Called when carousel transitions.
     * It calls the onSlide prop and passes in the current index & event object with transition direction added
     *
     * @private
     * @param {number} index
     * @param {*} e
     * @param {Direction} [direction]
     * @returns
     *
     * @memberOf Carousel
     */
    private slide(index: number, e: ICarouselEvent<HTMLElement>, direction?: Direction) {
        logger.debug(this.loggerNode + " .slide");

        const previousActiveIndex = this.getActiveIndex();
        direction = direction || this.getDirection(previousActiveIndex, index);

        const { onSlide } = this.props;

        if (onSlide) {
            // React SyntheticEvents are pooled, so we need to remove this event
            // from the pool to add a custom property. To avoid unnecessarily
            // removing objects from the pool, only do this when the listener
            // actually wants the event.
            e.persist();
            e.direction = direction;
            onSlide(e);
        }
        // TODO: documentation
        if (this.props.activeIndex == null && index !== previousActiveIndex) {
            if (this.state.previousActiveIndex === null || !this.props.slide) {
                // If currently animating don't activate the new index.
                // TODO: look into queueing this canceled call and
                // animating after the current animation has ended.
                this.setState({
                    activeIndex: index,
                    previousActiveIndex,
                    direction,
                });
            }
        }
    }
    /**
     * Schedules next transition
     *
     * @private
     *
     * @memberOf Carousel
     */
    private waitForNext() {
        logger.debug(this.loggerNode + " .waitForNext");
        const { interval, activeIndex: activeIndexProp } = this.props;

        if (!this.isPaused && interval && activeIndexProp == null) {
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
}

// export default bsClass('carousel', Carousel);
export default Carousel;
