import { Utils } from '../utils';
import { Tabber } from '../modules';

// Breakpoints defined in CSS custom properties (see :root).
// Used to determine responsive behavior (e.g., when to expand the navbar based on navbar[data-expand={bp}]).
const style = getComputedStyle(document.documentElement);

const BREAKPOINTS = {
  sm: style.getPropertyValue('--bp-sm'),
  md: style.getPropertyValue('--bp-md'),
  lg: style.getPropertyValue('--bp-lg'),
  xl: style.getPropertyValue('--bp-xl'),
  xxl: style.getPropertyValue('--bp-xxl'),
};

/**
 * Interface-like definition for Navbar modules.
 *
 * Modules can optionally implement the following lifecycle hooks:
 * - onOpen():   Called when the offcanvas menu is opened.
 * - onClose():  Called when the menu is closed.
 * - onExpand(): Called when the expand media query breakpoint is true.

 * These methods are optional. The system checks if they exist before calling them.
 */
const MODULE_INTERFACE = {
  onOpen: 'function',
  onClose: 'function',
  onExpand: 'function',
};

export class Navbar {
  constructor(rootEl = '.navbar', options = {}) {
    this._rootEl = typeof rootEl === 'string' ? Utils.select(rootEl) : rootEl;

    if (!this._rootEl) return;

    this._openBtnEl = this._rootEl.querySelector('.navbar__btn-open');
    this._closeBtnEl = this._rootEl.querySelector('.navbar__btn-close');
    this._containerEl = this._rootEl.querySelector('.navbar__container');
    this._offcanvasEl = this._rootEl.querySelector('.navbar__offcanvas');
    this._isTransitioning = false;
    this._isExpanded = false;
    this._isPositionFixed = this._rootEl.dataset.fixed === 'true';
    this._breakpointName = this._rootEl.dataset.expand || null;
    this._breakpointValue = BREAKPOINTS[this._breakpointName] || null;
    this._expandMediaQuery = this._breakpointName ? window.matchMedia(`(min-width: ${this._breakpointValue})`) : null;

    this._boundHandleDocumentClick = this._handleDocumentClick.bind(this);
    this._boundHandleKeydown = this._handleKeydown.bind(this);
    this._modules = [Tabber, ...(options?.modules || [])];
    this._moduleInstances = this._modules.map(
      (Mod) =>
        new Mod({
          rootEl: this._rootEl,
          offcanvasEl: this._offcanvasEl,
          containerEl: this._containerEl,
          isPositionFixed: this._isPositionFixed,
          openBtnEl: this._openBtnEl,
          closeBtnEl: this._closeBtnEl,
        })
    );

    this._initEventListener();
  }

  _initEventListener() {
    this._openBtnEl.addEventListener('click', this._handleOpenOffcanvas.bind(this));
    this._closeBtnEl.addEventListener('click', this._handleCloseOffcanvas.bind(this));
    this._offcanvasEl.addEventListener('transitionend', this._handleTransitionEnd.bind(this));

    // Listen for changes
    this._expandMediaQuery && this._expandMediaQuery.addEventListener('change', this._handleExpandMedia.bind(this));
  }

  /* == Event handler == */
  _handleExpandMedia(e) {
    if (e.matches) {
      this._onExpand(false);
    }
  }

  _handleDocumentClick(e) {
    const clickedInside = e.target.closest('.navbar__offcanvas') === this._offcanvasEl;

    if (!this._isExpanded || this._isTransitioning || clickedInside) return;
    this._handleCloseOffcanvas();
  }

  _handleKeydown(e) {
    if (!this._isExpanded || this._isTransitioning) return;

    if (e.key === 'Escape') {
      this._handleCloseOffcanvas();
    }
  }

  _handleOpenOffcanvas(e) {
    this._toggleOffcanvas(true);
  }

  _handleCloseOffcanvas(e) {
    this._toggleOffcanvas(false);
  }

  _handleTransitionEnd(e) {
    this._toggleOffcanvasClasses(this._isExpanded);
    this._isTransitioning = false;
  }
  /* ==================== */

  /* == helper methods == */

  _setExpandedState(isExpanded) {
    this._openBtnEl.ariaExpanded = isExpanded;
    this._isExpanded = isExpanded;
  }
  _setTransitionClass() {
    this._offcanvasEl.classList.add('showing');
  }

  _toggleOffcanvasClasses(isExpanded) {
    this._offcanvasEl.classList.remove('showing');
    const method = isExpanded ? 'add' : 'remove';
    this._offcanvasEl.classList[method]('show');
  }

  _toggleOffcanvas(isOpen) {
    this._setExpandedState(isOpen);
    this._setTransitionClass();
    this._isTransitioning = true;

    const ariaAttributes = isOpen ? { 'aria-modal': 'true', role: 'dialog' } : { 'aria-modal': null, role: null };
    this._updateAriaAttributes(ariaAttributes);

    // Focus management
    const focusTarget = isOpen ? this._offcanvasEl : this._openBtnEl;
    focusTarget.focus();

    this._manageEventListeners(isOpen);

    const lifecycleMethod = isOpen ? 'onOpen' : 'onClose';
    this._callModuleLifecycleMethod(lifecycleMethod);
  }

  _onExpand(state) {
    this._setExpandedState(state);
    const ariaAttributes = { 'aria-modal': null, role: null };
    this._updateAriaAttributes(ariaAttributes);
    this._toggleOffcanvasClasses(state);
    this._manageEventListeners(state);
    this._callModuleLifecycleMethod('onExpand');
  }

  _updateAriaAttributes(attributes) {
    Object.entries(attributes).forEach(([attr, value]) => {
      if (value) {
        this._offcanvasEl.setAttribute(attr, value);
      } else {
        this._offcanvasEl.removeAttribute(attr);
      }
    });
  }

  _manageEventListeners(isOpen) {
    const method = isOpen ? 'addEventListener' : 'removeEventListener';
    document[method]('click', this._boundHandleDocumentClick);
    document[method]('keydown', this._boundHandleKeydown);
  }

  _callModuleLifecycleMethod(methodName) {
    this._moduleInstances.forEach((Modul) => Modul[methodName]?.());
  }
}
