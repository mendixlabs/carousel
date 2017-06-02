import { Component, createElement } from "react";

import { Carousel, Image } from "./components/Carousel";
import CarouselContainer, { CarouselContainerProps } from "./components/CarouselContainer";
import { Alert } from "./components/Alert";

import * as css from "./ui/Carousel.scss";
// tslint:disable-next-line
const image = require("base64-image-loader!./img/Preview.jpg");

declare function require(url: string): string;

// tslint:disable class-name
export class preview extends Component<CarouselContainerProps, {}> {
    componentWillMount() {
        this.addPreviewStyle("widget-carousel");
    }

    render() {
        const validationAlert = CarouselContainer.validateProps(this.props);
        if (validationAlert) {
            return createElement(Alert, { message: validationAlert });
        }

        return createElement(Carousel, {
            alertMessage: validationAlert,
            images: this.getImages(this.props)
        });
    }

    private getImages(props: CarouselContainerProps): Image[] {
        if (props.dataSource === "static") {
            return props.staticImages;
        }

        return [ { url: image } ];
    }

    private addPreviewStyle(styleId: string) {
        // This workaround is to load style in the preview temporary till mendix has a better solution
        const iFrame = document.getElementsByClassName("t-page-editor-iframe")[0] as HTMLIFrameElement;
        const iFrameDoc = iFrame.contentDocument;
        if (!iFrameDoc.getElementById(styleId)) {
            const styleTarget = iFrameDoc.head || iFrameDoc.getElementsByTagName("head")[0];
            const styleElement = document.createElement("style");
            styleElement.setAttribute("type", "text/css");
            styleElement.setAttribute("id", styleId);
            styleElement.appendChild(document.createTextNode(css));
            styleTarget.appendChild(styleElement);
        }
    }
}
