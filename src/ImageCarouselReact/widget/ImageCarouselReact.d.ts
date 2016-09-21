declare module ImageCarouselReact {
    
	export interface IProps{  
        DataSourceMicroflow: string;
        captionAttr?: string;
        descriptionAttr?: string;
        imageattr?: string;
        controls?: boolean;
        indicators?: boolean;
        Interval?: number;
        pauseOnHover?: boolean;
        slide?: boolean;
        imageClick?: string;
        width?: number;
        height?: number;
    }

}