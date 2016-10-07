// re-decare modules, as we moved react to the widget lib.
declare module "ImageCarouselReact/lib/react-dom" {
    export =  ReactDOM;
}

declare module "ImageCarouselReact/lib/react" {
    export = React;
}
