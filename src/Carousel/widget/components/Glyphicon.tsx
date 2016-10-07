/**
 * Original code can be found at:
 * https://github.com/react-bootstrap/react-bootstrap/blob/master/src/Glyphicon.js
 * 
 * This code is under the MIT license found here:
 * https://github.com/react-bootstrap/react-bootstrap/blob/master/LICENSE
 */
import classNames = require("Carousel/lib/classnames");
import * as React from "Carousel/lib/react";

import { IBootstrapProps, prefix } from "../utils/bootstrapUtils";

export interface IGlyphiconProps extends React.Props<Glyphicon> {
  /**
   * An icon name. See e.g. http://getbootstrap.com/components/#glyphicons
   */
  glyph?: string;
  className?: string;
  bsProps?: IBootstrapProps;
  elementProps?: {};
};

class Glyphicon extends React.Component<IGlyphiconProps, {}> {
  public static defaultProps: IGlyphiconProps = {
    bsProps: {
      bsClass: "glyphicon",
    },
  };
  private loggerNode: string = "Glyphicon";

  public render() {
    logger.debug(this.loggerNode + " .render");
    const { glyph } = this.props;
    const props = this.props;
    let classes: any = {};
    classes[props.bsProps.bsClass] = true;
    classes[prefix(props.bsProps, glyph)] = true;

    return (
      <span className={classNames(props.className, classes)} />
    );
  }
}

export default Glyphicon;
