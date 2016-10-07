// re-decare modules, as we moved react to the widget lib.
declare module "Carousel/lib/react-dom"
{
	export =  ReactDOM;
}

declare module "Carousel/lib/react"
{
	export = React;
}
