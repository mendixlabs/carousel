
// WARNING do not make manual Changes to this file.
// widget.d.ts files is auto generated from the params in the widget.xml
// use > 'grunt xsltproc' or > 'grunt watch' to generate a new file

export default ModelProps;

export interface ModelProps {
    imageEntity?: string;
    imageSource?: ImageSource;
    entityConstraint?: string;
    dataSourceMicroflow?: string;
    staticImageCollection?: StaticImageCollection[];
    captionAttr?: string;
    descriptionAttr?: string;
    interval?: number;
    onClickEvent?: OnClickEvent;
    callMicroflow?: string;
    pageForm?: string;
    pageLocation?: PageLocation;
    width?: number;
    widthUnits?: WidthUnits;
    height?: number;
    heightUnits?: HeightUnits;
}

export interface StaticImageCollection {
    caption?: string;
    description?: string;
    pictureUrl?: string;
    onClickEvent?: StaticImageCollectionOnClickEvent;
    callMicroflow?: string;
    pageForm?: string;
    pageLocation?: StaticImageCollectionPageLocation;
}

export type ImageSource = "xpath" | "microflow" | "static";

export type OnClickEvent = "none" | "openPage" | "callMicroflow";

export type PageLocation = "content" | "popup" | "modal";

export type WidthUnits = "auto" | "pixels" | "percent";

export type HeightUnits = "auto" | "pixels" | "percent";

export type StaticImageCollectionOnClickEvent = "none" | "openPage" | "callMicroflow";

export type StaticImageCollectionPageLocation = "content" | "popup" | "modal";
