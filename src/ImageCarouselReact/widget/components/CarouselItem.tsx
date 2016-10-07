/**
 * Original code can be found at:
 * https://github.com/react-bootstrap/react-bootstrap/blob/master/src/CarouselItem.js
 * 
 * This code is under the MIT license found here:
 * https://github.com/react-bootstrap/react-bootstrap/blob/master/LICENSE
 */
import classNames = require("ImageCarouselReact/lib/classnames");
import * as React from "ImageCarouselReact/lib/react";
import ReactDOM = require("ImageCarouselReact/lib/react-dom");

import { IObject } from "../utils/bootstrapUtils";
import { Direction } from "./Carousel";

export interface CarouselItemProps extends React.Props<CarouselItem> {
    active?: boolean;
    animateIn?: boolean;
    animateOut?: boolean;
    direction?: Direction;
    onAnimateOutEnd?: Function;
    index?: number;
    className?: string;
    onClick?: React.EventHandler<React.MouseEvent<HTMLElement>>;
    slide?: boolean;
}

interface CarouselItemState {
    direction: ItemDirection;
}

type ItemDirection = "right" | "left";

export class CarouselItem extends React.Component<CarouselItemProps, CarouselItemState> {
    public static defaultProps: CarouselItemProps = {
        active: false,
        animateIn: false,
        animateOut: false,
        slide: true,
    };
    private isUnmounted: boolean;
    private loggerNode: string;
    constructor(props: CarouselItemProps, context: CarouselItem) {
        super(props, context);
        this.loggerNode = "CarouselItem";
        logger.debug(this.loggerNode + " .constructor");

        this.handleAnimateOutEnd = this.handleAnimateOutEnd.bind(this);

        this.state = {
            direction: null,
        };

        this.isUnmounted = false;
    }
    public componentWillReceiveProps(nextProps: CarouselItemProps) {
        logger.debug(this.loggerNode + " .componentWillReceiveProps");
        if (this.props.active !== nextProps.active) {
            this.setState({ direction: null });
        }
    }

    public componentDidUpdate(prevProps: CarouselItemProps) {
        logger.debug(this.loggerNode + " .componentDidUpdate");
        const { active } = this.props;
        const prevActive = prevProps.active;
        if (!active && prevActive) {
            if (this.props.slide) {
                ReactDOM.findDOMNode(this).addEventListener("transitionend", this.handleAnimateOutEnd, false);
            } else {
                this.handleAnimateOutEnd();
            }
        }
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
            [direction]: direction && active && animateIn,
            [this.state.direction]: this.state.direction && (animateIn || animateOut),
        };

        return (
            <div
                {...props}
                className={classNames(className, classes)}
                />
        );
    }
    private handleAnimateOutEnd() {
        logger.debug(this.loggerNode + " .handleAnimateOutEnd");
        if (this.isUnmounted) {
            return;
        }

        if (this.props.onAnimateOutEnd) {
            this.props.onAnimateOutEnd(this.props.index);
        }
    }
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
