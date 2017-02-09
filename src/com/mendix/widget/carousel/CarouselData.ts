import { Image } from "./components/Carousel";

interface CarouselDataOptions {
    contextObject?: mendix.lib.MxObject;
    dataSource: DataSource;
    dataSourceMicroflow: string;
    entityConstraint: string;
    imagesEntity: string;
    urlAttribute: string;
    onClickOptions: ClickOptions;
    onClickMicroflow: string;
    onClickForm: string;
    staticImages: Image[];
}

type DataSource = "static" | "XPath" | "microflow";
type ClickOptions = "doNothing" | "callMicroflow" | "showPage";

class CarouselData {
    private options: CarouselDataOptions;
    private callback: (alert?: string, images?: Image[]) => void;

    constructor(options: CarouselDataOptions, callback: (alert?: string, images?: Image[]) => void) {
        this.callback = callback;
        this.options = options;
    }

    validateAndFetch() {
        let alert = "";
        if (this.options.dataSource === "static" && !this.options.staticImages.length) {
            alert = "At least one static image is required";
        }
        if (this.options.dataSource === "XPath" && !this.options.imagesEntity) {
            alert = "The images entity is required";
        }
        if (this.options.dataSource === "microflow" && !this.options.dataSourceMicroflow) {
            alert = "A data source microflow is required";
        }

        if (alert) {
            this.callback(alert);
        } else {
            this.fetchData();
        }
    }

    setContext(contextObject: mendix.lib.MxObject): CarouselData {
        this.options.contextObject = contextObject;

        return this;
    }

    private fetchData() {
        if (this.options.dataSource === "static") {
            this.callback(undefined, this.options.staticImages);
        }
        if (this.options.dataSource === "XPath" && this.options.imagesEntity) {
            this.fetchImagesByXPath(this.options.contextObject ? this.options.contextObject.getGuid() : "");
        } else if (this.options.dataSource === "microflow" && this.options.dataSourceMicroflow) {
            this.fetchImagesByMicroflow(this.options.dataSourceMicroflow);
        }
    }

    private fetchImagesByXPath(contextGuid: string) {
        const { entityConstraint } = this.options;
        const requiresContext = entityConstraint && entityConstraint.indexOf("[%CurrentObject%]") > -1;
        if (!contextGuid && requiresContext) {
            this.callback(undefined, []);
            return;
        }

        const constraint = entityConstraint ? entityConstraint.replace("[%CurrentObject%]", contextGuid) : "";
        window.mx.data.get({
            callback: (mxObjects: mendix.lib.MxObject[]) => this.setImagesFromMxObjects(mxObjects),
            error: (error) =>
                this.callback(`An error occurred while retrieving items: ${error}`),
            xpath: `//${this.options.imagesEntity}${constraint}`
        });
    }

    private fetchImagesByMicroflow(microflow: string) {
        if (microflow) {
            window.mx.ui.action(microflow, {
                callback: (mxObjects: mendix.lib.MxObject[]) => this.setImagesFromMxObjects(mxObjects),
                error: (error: Error) =>
                    this.callback(`An error occurred while retrieving images: ${error.message}`),
                params: {
                    guids: this.options.contextObject ? [ this.options.contextObject.getGuid() ] : []
                }
            });
        }
    }

    private setImagesFromMxObjects(mxObjects: mendix.lib.MxObject[]): void {
        const { onClickOptions, onClickForm, onClickMicroflow } = this.options;
        const images = mxObjects.map((mxObject) => ({
            onClickForm: onClickOptions === "showPage" ? onClickForm : undefined,
            onClickMicroflow: onClickOptions === "callMicroflow" ? onClickMicroflow : undefined,
            url: this.options.urlAttribute
                ? mxObject.get(this.options.urlAttribute) as string
                : this.getFileUrl(mxObject.getGuid())
        }));

        this.callback(undefined, images);
    }

    private getFileUrl(guid: string): string {
        return guid
            ? `file?target=window&guid=${guid}&csrfToken=${window.mx.session.getCSRFToken()}&time=${Date.now()}`
            : "";
    }
}

export { CarouselData, CarouselDataOptions, ClickOptions, DataSource };
