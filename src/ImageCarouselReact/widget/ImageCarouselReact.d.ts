declare module ImageCarouselReact {
    
	export interface IProps{  
    DataMicroflow?: string;
    captionAttr?: string;
    descriptionAttr?: string;
    imageattr?: string;
    jumpLocation?: string;
    delay?: string;
    duration?: string;
    imageClick?: string;
    width?: number;
    height?: number;
    border?: number;
    borderColor?: string;
    arrowBack?: string;
    arrowFwd?: string;
    }
    export interface IState{
        context: {
            captionAtt: string;
        };
        progressEntity: {
            progressMessageAtt: string;
            progressPercentAtt: number
        }
    }

}