// re-decare modules, as we moved react to the widget lib.
/// <reference path="../node_modules/mendix-client/mendix-client/mendix.d.ts" />
/// <reference path="../node_modules/mendix-client/mendix-client/mxui.d.ts" />
/// <reference path="../node_modules/mendix-client/mendix-client/mx.d.ts" />
declare module "Carousel/lib/react-dom" {
	export =  ReactDOM;
}

declare module "Carousel/lib/react" {
	export = React;
}
