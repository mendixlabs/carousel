/// <reference path="dojo/dojo.d.ts" />
/// <reference path="dojo/dijit.d.ts" />

/// <reference path="react/react.d.ts" />
/// <reference path="react/react-dom.d.ts" />
/// <reference path="index.d.ts" />

declare module "ImageCarouselReact/lib/react-dom" {
	export =  __React.__DOM;
}
declare module "ImageCarouselReact/lib/react" {
	export = __React;
}
declare module "ImageCarouselReact/lib/react.min" {
	export = __React;
}
declare module "ImageCarouselReact/lib/react-bootstrap" {
	export = ReactBootstrap;
}

// Declaration of mendix global variables
declare var mx: mx.mx;
declare var logger: mendix.logger;


