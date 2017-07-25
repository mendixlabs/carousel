import { SFC, createElement } from "react";

export const Alert: SFC<{ message?: string }> = ({ message }) =>
    message
        ? createElement("div", { className: "alert alert-danger widget-carousel-alert" }, message)
        : null;

Alert.displayName = "Alert";
