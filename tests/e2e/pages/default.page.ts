class HomePage {
    public get carousel() { return browser.element(".mx-name-carousel3"); }
    public get carouselLeftArrow() {
        return browser.element("#mxui_widget_ReactCustomWidgetWrapper_0 > div > div.widget-carousel-control.left");
    }
    public get lastImage() {
        // tslint:disable-next-line:max-line-length
        return browser.element("#mxui_widget_ReactCustomWidgetWrapper_0 > div > div.widget-carousel-item-wrapper.animate > div.widget-carousel-item.active > img");
    }
    public get carouselRightArrow() {
        return browser.element("#mxui_widget_ReactCustomWidgetWrapper_0 > div > div.widget-carousel-control.right");
    }
    public get leftArrowExist() {
        return browser.isExisting("#mxui_widget_ReactCustomWidgetWrapper_0 > div > div.widget-carousel-control.left");
    }
    public get rightArrowExist() {
        return browser.isExisting("#mxui_widget_ReactCustomWidgetWrapper_0 > div > div.widget-carousel-control.right");
    }
    public open(): void {
        browser.url("/p/differentArrows");
    }
}

const defaultPage = new HomePage();

export default defaultPage;
