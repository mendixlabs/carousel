
import { SIZE_MAP } from "./StyleConfig";

export interface IObject extends Object {
  [key: string]: any;
}

export interface IBootstrapProps extends IObject {
  bsClass?: string;
  bsSize?: string;
  bsStyle?: string;
  bsRole?: string;
}

function isBsProp(propName: string) {
  return (
    propName === "bsClass" ||
    propName === "bsSize" ||
    propName === "bsStyle" ||
    propName === "bsRole"
  );
}

function getBsProps(props: IBootstrapProps) {
  return {
    bsClass: props.bsClass,
    bsRole: props.bsRole,
    bsSize: props.bsSize,
    bsStyle: props.bsStyle,
  };
}

// function curry(fn: Function) {
//   return (...args: Array<any>) => {
//     let last = args[args.length - 1];
//     if (typeof last === "function") {
//       return fn(...args);
//     }
//     return (Component: __React.Component<{}, {}>) => fn(...args, Component);
//   };
// }

export function prefix(props: IBootstrapProps, variant?: string) {
  if (props.bsClass === null) {
    throw new Error("A `bsClass` prop is required for this component");
  }
  return props.bsClass + (variant ? `-${variant}` : "");
}

export function getClassSet(props: IBootstrapProps) {
  const classes: IObject = {
    [prefix(props)]: true,
  };

  if (props.bsSize) {
    const bsSize = SIZE_MAP[props.bsSize] || props.bsSize;
    classes[prefix(props, bsSize)] = true;
  }

  if (props.bsStyle) {
    classes[prefix(props, props.bsStyle)] = true;
  }

  return classes;
}

export function splitBsPropsAndOmit(props: IBootstrapProps, omittedPropNames: Array<string>) {
  const isOmittedProp: IObject = {};
  omittedPropNames.forEach((propName: string) => { isOmittedProp[propName] = true; });

  const elementProps: IObject = {};
  Object.entries(props).forEach(([propName, propValue]) => {
    if (!isBsProp(propName) && !isOmittedProp[propName]) {
      elementProps[propName] = propValue;
    }
  });

  return [getBsProps(props), elementProps];
}
