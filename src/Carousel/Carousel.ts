
// WARNING do not make manual Changes to this file.
// widget.d.ts files is auto generated from the params in the widget.xml
// use > 'grunt xsltproc' or > 'grunt watch' to generate a new file

export default ModelProps;

export interface ModelProps {
    imageEntity?: string;
    imageSource?: "xpath" | "microflow" | "static";
    entityConstraint?: string;
    dataSourceMicroflow?: string;
    staticImageCollection?: StaticImageCollection[];
    captionAttr?: string;
    descriptionAttr?: string;
    interval?: number;
    onClickEvent?: "none" | "openPage" | "callMicroflow";
    callMicroflow?: string;
    pageForm?: string;
    pageLocation?: "content" | "popup" | "modal";
    width?: number;
    widthUnits?: "auto" | "pixels" | "percent";
    height?: number;
    heightUnits?: "auto" | "pixels" | "percent";
}

export interface StaticImageCollection {
    caption?: string;
    description?: string;
    pictureUrl?: string;
    onClickEvent?: "none" | "openPage" | "callMicroflow";
    callMicroflow?: string;
    pageForm?: string;
    pageLocation?: "content" | "popup" | "modal";
}

export enum ImageSource {
    xpath,
    microflow,
    static
}

export enum OnClickEvent {
    none,
    openPage,
    callMicroflow
}

export enum PageLocation {
    content,
    popup,
    modal
}

export enum WidthUnits {
    auto,
    pixels,
    percent
}

export enum HeightUnits {
    auto,
    pixels,
    percent
}

export enum StaticImageCollectionOnClickEvent {
    none,
    openPage,
    callMicroflow
}

export enum StaticImageCollectionPageLocation {
    content,
    popup,
    modal
}
