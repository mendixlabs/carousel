// Note for the reviewer: this a subset for core-js
// The standard npm @types/core-js version does not work for structureMatcher.ts.

// Type definitions for core-js v0.9.7
// Project: https://github.com/zloirock/core-js/
// Definitions by: Ron Buckton <http://github.com/rbuckton>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/* *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

declare type PropertyKey = string | number | symbol;

// #############################################################################################
// ECMAScript 6: Symbols
// Modules: es6.symbol
// #############################################################################################

interface Symbol {
    toString(): string;
    [Symbol.toStringTag]: string;
}
interface SymbolConstructor {
    prototype: Symbol;
    (description?: string|number): symbol;
    for(key: string): symbol;
    keyFor(sym: symbol): string;
    hasInstance: symbol;
    isConcatSpreadable: symbol;
    iterator: symbol;
    match: symbol;
    replace: symbol;
    search: symbol;
    species: symbol;
    split: symbol;
    toPrimitive: symbol;
    toStringTag: symbol;
    unscopables: symbol;
    useSimple(): void;
    userSetter(): void;
}

declare var Symbol: SymbolConstructor;

interface Array<T> {
    [Symbol.iterator](): IterableIterator<T>;
}
interface IteratorResult<T> {
    done: boolean;
    value?: T;
}
interface Iterator<T> {
    next(value?: any): IteratorResult<T>;
    return?(value?: any): IteratorResult<T>;
    throw?(e?: any): IteratorResult<T>;
}
interface Iterable<T> {
    [Symbol.iterator](): Iterator<T>;
}
interface IterableIterator<T> extends Iterator<T> {
    [Symbol.iterator](): IterableIterator<T>;
}
declare module core {
    var Object: {
        keys(o: any): string[];
        assign(target: any, ...sources: any[]): any;        
    };    
    var Array: {
        from<T>(arrayLike: ArrayLike<T>): Array<T>;
        find<T>(array: ArrayLike<T>, predicate: (value: T, index: number, obj: Array<T>) => boolean, thisArg?: any): T;
    };
}
declare module "core-js/fn/array/find" {
    var find: typeof core.Array.find;
    export = find;
}
declare module "core-js/fn/array/from" {
    var from: typeof core.Array.from;
    export = from;
}
declare module "core-js/fn/object/assign" {
    var assign: typeof core.Object.assign;
    export = assign;
}
declare module "core-js/fn/object/keys" {
    var keys: typeof core.Object.keys;
    export = keys;
}
