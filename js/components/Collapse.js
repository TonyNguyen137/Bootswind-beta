import { toArray, select } from '../utils';

const TOGGLE_TEXT = {
  expanded: 'weniger anzeigen',
  collapsed: 'mehr anzeigen',
};

export class Collapse {
  constructor(selector = '.collapseRootEl') {
    this._rootEls = toArray(selector);

    if (!this._rootEls) return;

    let i = this._rootEls.length;

    while (i--) {
      this._init(this._rootEls[i]);
    }
  }

  _init(rootEl) {
    rootEl.togglerEl = select('.btn--toggler', rootEl);
    rootEl.collapseEl = select('.collapseEl', rootEl);
    rootEl.labelEl = select('.text-label', rootEl);

    rootEl.togglerEl.addEventListener('click', (e) => this._handleClick(e, rootEl));
    rootEl.collapseEl.addEventListener('transitionend', this._handleTransitionEnd.bind(this));
  }

  /* == Event handler == */

  _handleClick(e, rootEl) {
    const { togglerEl, collapseEl, labelEl } = rootEl;
    const isExpanded = togglerEl.ariaExpanded === 'true';
    togglerEl.ariaExpanded = !isExpanded;
    collapseEl.ariaHidden = isExpanded;
    labelEl.textContent = TOGGLE_TEXT[isExpanded ? 'collapsed' : 'expanded'];

    const action = isExpanded ? this._collapse : this._expand;
    action.call(this, collapseEl);
  }

  _expand(element) {
    this._prepareTransition(element, false);
    element.style.height = `${element.scrollHeight}px`;
  }

  _collapse(element) {
    element.style.height = `${element.scrollHeight}px`;
    this._prepareTransition(element, true);
    element.style.height = '';
  }

  _prepareTransition(element, isCollapse) {
    element.classList.remove('collapse', 'show');

    if (isCollapse) {
      element.offsetHeight; // Force reflow
    }

    element.classList.add('collapsing');
  }

  _handleTransitionEnd(e) {
    const toggleableAreaEl = e.currentTarget;
    const isExpanded = toggleableAreaEl.ariaHidden === 'false';

    toggleableAreaEl.classList.remove('collapsing');
    toggleableAreaEl.classList.add(isExpanded ? 'show' : 'collapse');
    if (isExpanded) toggleableAreaEl.style.height = null;
  }
}
