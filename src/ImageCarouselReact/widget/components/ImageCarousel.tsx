import * as React from "ImageCarouselReact/lib/react";

declare var mx: mx.mx;
declare var logger: mendix.logger;
import * as mxLang from "mendix/lang";



import ImageCarouselReactWrapper from "./../ImageCarouselReact"; // Wrapper
interface IImageCarouselReactModelProps { // Would be great if model props can be generated from widget.xml, including documentation.
    widgetId: string;
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
// Custom props 
export interface IImageCarouselReactProps extends IImageCarouselReactModelProps {
    // helper props for MX / dojo   
    wrapper?: ImageCarouselReactWrapper;
    ref?: (component: React.Component<IImageCarouselReactProps, IImageCarouselReactModelState>) => React.Component<IImageCarouselReactProps, IImageCarouselReactModelState>;
    // formValidate?: Function;
    // formSave?: Function;
    // mxcontext?: any; // TODO Future not context aware? mxCallMicrfolowWithContext() 
    // mxUpdateProgressObject?: Function;
    // mxCreateProgressObject?: Function;
}
// Props that are derived from model
interface IImageCarouselReactModelState {
    context?: {
        guid?: string;
        captionAtt?: string;
    };
    progressEntity?: {
        guid?: string;
        isLoaded?: boolean;
        progressMessageAtt?: string;
        progressPercentAtt?: number
    };
}

// intarnal state
export interface IImageCarouselReactState extends IImageCarouselReactModelState {
    isCanceling?: boolean;
    isRunning?: boolean;
    progressMessage?: string;
    enabled?: boolean;
    // progress:
}

export class ImageCarouselReact extends React.Component<IImageCarouselReactProps, IImageCarouselReactState> {
    public static defaultProps: IImageCarouselReactProps = {
        widgetId: "undefined",
    };
    private updatehandler: number;
    private progressInterval: number = 100;
    private hasCancelButton: boolean = false;
    constructor(props: IImageCarouselReactProps) {
        super(props);
        // set initial state
        this.state = {
            context: {},
        };
        // this.onButonClick = this.onButonClick.bind(this);
        // this.onCancelClick = this.onCancelClick.bind(this);
    }
    public componentWillUnmount () {
        logger.debug(this.props.widgetId + " .componentWillUnmount");
    }
    public render() {
        logger.debug(this.props.widgetId + ".render");
        return (
            <div></div>
                // <Button
                //     caption={this.state.context.captionAtt}
                //     title={this.props.title}
                //     iconUrl={this.props.icon}
                //     renderType={this.props.buttonStyle.toLowerCase()}
                //     onClick={this.onButonClick}
                //     enabled={!this.state.isRunning && this.state.enabled}
                // />
                // <ProgressBar
                //     message={!this.state.isCanceling ?
                //         this.props.progressMessage +  this.state.progressEntity.progressMessageAtt:
                //         this.props.cancelingCaption}
                //     progress={this.getProgress()}
                //     visable={this.state.isRunning}>
                //         {this.getCancelButton()}
                // </ProgressBar>
        );
     }
    // call the microflow and remove progress on finishing
    private callMicroflow(callback: Function) {
        logger.debug(this.props.widgetId + ".callMicroflow");
        // // if (this.props.wrapper.progressObj) {
        // mx.data.action({
        //     async: this.props.async,
        //     callback: () => {
        //         clearInterval(this.updatehandler);
        //         this.setState({isRunning: false});
        //         if (this.props.blocking) {
        //             mx.ui.hideUnderlay();
        //         }
        //         callback();
        //     },
        //     context: this.props.wrapper.mxcontext,
        //     error: (e) => {
        //         clearInterval(this.updatehandler);
        //         this.setState({isRunning: false});
        //         if (this.props.blocking) {
        //             mx.ui.hideUnderlay();
        //         }
        //         console.error(this.props.widgetId + ".callMicroflow : XAS error executing microflow " + this.props.onClickMicroflow + " : " + e);
        //         mx.ui.error(e.message);
        //         callback();
        //     },
        //     params: {
        //         actionname: this.props.onClickMicroflow,
        //         applyto: "selection",
        //         guids: [this.props.wrapper.progressObj.getGuid()],
        //     },
        // });
    }
    // update the progress messages and bar. 
    private updateProgress() {
        logger.debug(this.props.widgetId + ".updateProgress");
    }
};

export default ImageCarouselReact;
