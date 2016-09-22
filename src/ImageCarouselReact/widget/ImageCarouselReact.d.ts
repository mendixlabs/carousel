declare module ImageCarouselReact {
    
	export interface IProps{
        imageEntity?: string,
        entityConstraint?: string,  
        dataSourceMicroflow?: string;
        captionAttr?: string;
        descriptionAttr?: string;
        controls?: boolean;
        indicators?: boolean;
        interval?: number;
        openPage?: string;
        pauseOnHover?: boolean;
        slide?: boolean;
        imageClick?: string;
        width?: number;
        height?: number;
    }

}