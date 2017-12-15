import defaultPage from "./pages/default.page";

describe("Carousel", () => {

    beforeAll(() => {
        defaultPage.open();
    });

    it("should disable the left arrow when showing the first item", () => {
        defaultPage.carousel.waitForVisible();
        expect (defaultPage.leftArrowExist as boolean).toBe(false);
    });

    it("should enable the left arrow when it navigates from first item", () => {
        defaultPage.carousel.waitForVisible();
        defaultPage.carouselRightArrow.waitForVisible();
        defaultPage.carouselRightArrow.click();

        defaultPage.carouselLeftArrow.waitForVisible();
        expect (defaultPage.leftArrowExist as boolean).toBe(true);
    });

    it("should disable the right arrow when it navigates to the last image", () => {
        defaultPage.carousel.waitForVisible();
        defaultPage.carouselRightArrow.waitForVisible();
        defaultPage.carouselRightArrow.click();
        defaultPage.carouselRightArrow.waitForVisible();
        defaultPage.carouselRightArrow.click();
        defaultPage.carouselRightArrow.waitForVisible();
        defaultPage.carouselRightArrow.click();

        expect (defaultPage.rightArrowExist as boolean).toBe(false);
    });
});
