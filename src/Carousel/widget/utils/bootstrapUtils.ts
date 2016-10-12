
export interface IObject extends Object {
  [key: string]: any;
}

export function prefix(bootstrapClass: string, variant?: string) {
  if (bootstrapClass === null) {
    throw new Error("A `bootstrapClass` prop is required for this component");
  }
  return bootstrapClass + (variant ? `-${variant}` : "");
}
