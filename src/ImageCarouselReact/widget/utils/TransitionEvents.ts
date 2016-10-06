/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This file contains a modified version of:
 * https://github.com/facebook/react/blob/v0.12.0/src/addons/transitions/ReactTransitionEvents.js
 *
 * This source code is licensed under the BSD-style license found here:
 * https://github.com/facebook/react/blob/v0.12.0/LICENSE
 * An additional grant of patent rights can be found here:
 * https://github.com/facebook/react/blob/v0.12.0/PATENTS
 */
const canUseDOM = !!(
  typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  );

/**
 * EVENT_NAME_MAP is used to determine which event fired when a
 * transition/animation ends, based on the style property used to
 * define that event.
 */
const EVENT_NAME_MAP: any = {
  animationend: {
    MozAnimation: "mozAnimationEnd",
    OAnimation: "oAnimationEnd",
    WebkitAnimation: "webkitAnimationEnd",
    animation: "animationend",
    msAnimation: "MSAnimationEnd",
  },
  transitionend: {
    MozTransition: "mozTransitionEnd",
    OTransition: "oTransitionEnd",
    WebkitTransition: "webkitTransitionEnd",
    msTransition: "MSTransitionEnd",
    transition: "transitionend",
  },
};

let endEvents: Array<string> = [];

function detectEvents() {
  let testEl = document.createElement("div");
  let style = testEl.style;

  // On some platforms, in particular some releases of Android 4.x,
  // the un-prefixed "animation" and "transition" properties are defined on the
  // style object but the events that fire will still be prefixed, so we need
  // to check if the un-prefixed events are useable, and if not remove them
  // from the map
  if (!("AnimationEvent" in window)) {
    delete EVENT_NAME_MAP.animationend.animation;
  }

  if (!("TransitionEvent" in window)) {
    delete EVENT_NAME_MAP.transitionend.transition;
  }

  // tslint:disable-next-line : forin
  for (let baseEventName in EVENT_NAME_MAP) {
    let baseEvents = EVENT_NAME_MAP[baseEventName];
    for (let styleName in baseEvents) {
      if (styleName in style) {
        endEvents.push(baseEvents[styleName]);
        break;
      }
    }
  }
}

if (canUseDOM) {
  detectEvents();
}

// We use the raw {add|remove}EventListener() call because EventListener
// does not know how to remove event listeners and we really should
// clean up. Also, these events are not triggered in older browsers
// so we should be A-OK here.

function addEventListener(node: EventTarget, eventName: string, eventListener: EventListener) {
  node.addEventListener(eventName, eventListener, false);
}

function removeEventListener(node: EventTarget, eventName: string, eventListener: EventListener) {
  node.removeEventListener(eventName, eventListener, false);
}

const ReactTransitionEvents = {
  addEndEventListener(node: EventTarget, eventListener: EventListener) {
    if (endEvents.length === 0) {
      // If CSS transitions are not supported, trigger an "end animation"
      // event immediately.
      window.setTimeout(eventListener, 0);
      return;
    }
    endEvents.forEach(endEvent => {
      addEventListener(node, endEvent, eventListener);
    });
  },

  removeEndEventListener(node: EventTarget, eventListener: EventListener) {
    if (endEvents.length === 0) {
      return;
    }
    endEvents.forEach(endEvent => {
      removeEventListener(node, endEvent, eventListener);
    });
  },
};

export default ReactTransitionEvents;
