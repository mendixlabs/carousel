
// WARNING do not make manual Changes to this file...
// widget.d.ts files is auto generated from the params in the widget.xml
// use > 'grunt xsltproc' or > 'grunt watch' to generate a new file

interface ModelProps {
    imageEntity?: string;
    imageSource?: "xpath" | "microflow" | "static";
    entityConstraint?: string;
    dataSourceMicroflow?: string;
    staticImageCollection?: Array<{
    imgCaption?: string;
    imgDescription?: string;
    picture?: string;
    onClickEvent?: "non" | "microflow" | "content" | "popup" | "modal";
    imageClickMicroflow?: string;
    openPage?: string;
    }>;
    captionAttr?: string;
    descriptionAttr?: string;
    controls?: boolean;
    indicators?: boolean;
    interval?: number;
    pauseOnHover?: boolean;
    slide?: boolean;
    onClickEvent?: "non" | "microflow" | "content" | "popup" | "modal";
    imageClickMicroflow?: string;
    openPage?: string;
    width?: number;
    widthUnits?: "auto" | "pixels" | "percent" | "viewPort";
    height?: number;
    heightUnits?: "auto" | "pixels" | "percent" | "viewPort";
    
} 

export default ModelProps;
