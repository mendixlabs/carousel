import { DOM } from "react";

export const Alert = (props: { message?: string }) =>
    props.message
        ? DOM.div({ className: "alert alert-danger widget-carousel-alert" }, props.message)
        : null as any;
