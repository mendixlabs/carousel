
export interface IObject extends Object {
  [key: string]: any;
}

export interface IBootstrapProps extends IObject {
  bsClass?: string;
  bsSize?: string;
  bsStyle?: string;
  bsRole?: string;
}

export function prefix(bootstrapClass: string, variant?: string) {
  if (bootstrapClass === null) {
    throw new Error("A `bsClass` prop is required for this component");
  }
  return bootstrapClass + (variant ? `-${variant}` : "");
}
