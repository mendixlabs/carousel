declare module ImageCarouselReact {
    
	export interface IProps{  
        dataSourceMicroflow?: string;
        captionAttr?: string;
        descriptionAttr?: string;
        controls?: boolean;
        indicators?: boolean;
        interval?: number;
        pauseOnHover?: boolean;
        slide?: boolean;
        imageClick?: string;
        width?: number;
        height?: number;
    }

}