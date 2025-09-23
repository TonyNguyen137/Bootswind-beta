import { Utils } from '../utils';

const ACTIVE_CLASS_NAME = 'play';
const ANIMATION_CLASS_NAME = 'moveArrowBody';

export class ArrowAnimation {
  constructor(selector = '.arrow-animation') {
    this._rootEls = typeof selector === 'string' ? Utils.toArray(selector) : null;

    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine) ').matches;

    if (!this._rootEls || !supportsHover) return;

    let i = this._rootEls.length;

    while (i--) {
      this._initRootEl(this._rootEls[i]);
    }
  }

  _initRootEl(rootEl) {
    rootEl.isAnimating = false;

    console.log('init');

    // rootEl.addEventListener('animationstart', this._handleAnimationStart);

    rootEl.addEventListener('animationend', this._handleAnimationEnd);

    rootEl.addEventListener('mouseenter', this._handleMouseEnter);
  }

  /* == Event handler == */

  _handleAnimationEnd(e) {
    const animationName = e.animationName;
    if (e.animationName !== ANIMATION_CLASS_NAME) return;

    let root = e.target.closest('.arrow-animation');

    if (root.matches(':hover')) {
      root.classList.remove(ACTIVE_CLASS_NAME);
      Utils.forceReflow(root);
      root.classList.add(ACTIVE_CLASS_NAME);
    } else {
      root.isAnimating = false;
      root.classList.remove(ACTIVE_CLASS_NAME);
    }
  }

  _handleMouseEnter(e) {
    console.log('enter');

    let root = e.target;
    if (root.isAnimating) return;
    root.classList.add(ACTIVE_CLASS_NAME);
    root.isAnimating = true;
  }
}
