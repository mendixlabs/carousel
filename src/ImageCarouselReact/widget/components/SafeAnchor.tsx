declare var logger: mendix.logger;

import * as React from "ImageCarouselReact/lib/react";

interface IProps extends React.Props<SafeAnchor> {
  href?: string;
  onClick?: Function;
  disabled?: boolean;
  role?: string;
  tabIndex?: number | string;
  componentClass?: string;
  style?: {};
  className?: string;
};

/**
 * There are situations due to browser quirks or Bootstrap CSS where
 * an anchor tag is needed, when semantically a button tag is the
 * better choice. SafeAnchor ensures that when an anchor is used like a
 * button its accessible. It also emulates input `disabled` behavior for
 * links, which is usually desirable for Buttons, NavItems, MenuItems, etc.
 */
class SafeAnchor extends React.Component<IProps, {}> {
  public static defaultProps: IProps = {
    componentClass: "a",
    href: null,
    role: null,
  };
  private loggerNode: string;
  constructor(props: IProps, context: SafeAnchor) {
    super(props, context);
    this.loggerNode = "SafeAnchor";
    logger.debug(this.loggerNode + " .constructor");

    this.handleClick = this.handleClick.bind(this);
  }

  public render() {
    logger.debug(this.loggerNode + " .render");
    const { componentClass: Component, disabled } = this.props;
    let props: IProps = {
      children: this.props.children ? this.props.children : null,
      className: this.props.className ? this.props.className : null,
      href: this.props.href ? this.props.href : null,
      onClick: this.props.onClick ? this.props.onClick : null,
      role: this.props.role ? this.props.role : null,
      style: this.props.style ? this.props.style : null,
    };

    if (this.isTrivialHref(props.href)) {
      props.role = props.role || "button";
      // we want to make sure there is a href attribute on the node
      // otherwise, the cursor incorrectly styled (except with role='button')
      props.href = props.href || "";
    }

    if (disabled) {
      props.tabIndex = -1;
      props.style = Object.assign({}, props.style, { pointerEvents: "none"});
    }

    return (
      <Component
        {...props}
        onClick={this.handleClick}
      />
    );
  }
  private handleClick(event: React.MouseEvent) {
    logger.debug(this.loggerNode + " .handleClick");
    const { disabled, href, onClick } = this.props;

    if (disabled || this.isTrivialHref(href)) {
      event.preventDefault();
    }

    if (disabled) {
      event.stopPropagation();
      return;
    }

    if (onClick) {
      onClick(event);
    }
  }
  private isTrivialHref(href: string) {
    logger.debug(this.loggerNode + " .isTrivialHref");
    return !href || href.trim() === "#";
  }
}

export default SafeAnchor;
