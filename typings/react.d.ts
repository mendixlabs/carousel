import { ClassAttributes, DOMAttributes, DOMElement, ReactNode } from "react";
// tslint:disable callable-types
declare module "react" {
    // Allow children to be null
    interface DOMFactory<P extends DOMAttributes<T>, T extends Element> {
        (props?: P & ClassAttributes<T>, ...children: Array<ReactNode|null>): DOMElement<P, T>;
    }
}
