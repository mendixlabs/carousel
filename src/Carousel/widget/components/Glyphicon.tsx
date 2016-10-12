/**
 * Original code can be found at:
 * https://github.com/react-bootstrap/react-bootstrap/blob/master/src/Glyphicon.js
 * 
 * This code is under the MIT license found here:
 * https://github.com/react-bootstrap/react-bootstrap/blob/master/LICENSE
 */
import classNames = require("Carousel/lib/classnames");
import * as React from "Carousel/lib/react";

import { prefix } from "../utils/bootstrapUtils";

export interface GlyphiconProps extends React.Props<Glyphicon> {
    /**
     * An icon name. See e.g. http://getbootstrap.com/components/#glyphicons
     */
    glyph?: string;
    className?: string;
    bootstrapClass?: string;
    elementProps?: {};
}

class Glyphicon extends React.Component<GlyphiconProps, {}> {
    public static defaultProps: GlyphiconProps = {
        bootstrapClass: "glyphicon",
    };

    public render() {
        const { glyph } = this.props;
        const props = this.props;
        let classes = {
            [props.bootstrapClass]: true,
            [prefix(props.bootstrapClass, glyph)]: true,
        };

        return (
            <span className={classNames(props.className, classes)} />
        );
    }
}

export default Glyphicon;
