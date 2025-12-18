import { toArray } from '../utils';

const BLOCK_NAME = '.accordion';

export class Accordion {
	constructor() {
		this._blockEls = toArray(BLOCK_NAME);

		if (!this._blockEls || this._blockEls.length === 0) return;

		let i = this._blockEls.length;

		while (i--) {
			this._init(this._blockEls[i]);
		}
	}

	_init(blockEl) {
		blockEl._itemEls = toArray(`${BLOCK_NAME}__item`, blockEl);
		blockEl._isTransitioning = false;
		blockEl._currentActiveItem = blockEl.querySelector('[aria-expanded=true]') || null;
		blockEl.addEventListener('click', this._handleClick.bind(this));
		blockEl.addEventListener('transitionend', this._handleTransitionEnd.bind(this));
	}

	/* == Event Handler == */
	_handleClick(e) {
		const togglerEl = e.target.closest(`${BLOCK_NAME}__toggler`);
		const rootEl = e.currentTarget;

		if (!togglerEl || rootEl._isTransitioning) return;

		const isSameToggler = rootEl._currentActiveItem === togglerEl;
		const isExpanded = togglerEl.ariaExpanded === 'true';

		rootEl._isTransitioning = true;

		if (isSameToggler) {
			// Collapse current
			this._toggleAccordionItem(togglerEl, false);
			rootEl._currentActiveItem = null;
		} else {
			// expand new
			this._toggleAccordionItem(togglerEl, !isExpanded);

			// Collapse previous if exists
			if (rootEl._currentActiveItem) {
				this._toggleAccordionItem(rootEl._currentActiveItem, false);
			}

			// Update reference to the currently expanded toggler
			rootEl._currentActiveItem = togglerEl;
		}
	}

	_handleTransitionEnd(e) {
		if (e.propertyName !== 'height') return;

		const collapseEl = e.target;
		collapseEl.classList.remove('collapsing');

		if (collapseEl.style.height) {
			collapseEl.classList.add('show');
		} else {
			collapseEl.classList.add('collapse');
		}
		collapseEl.style.height = '';

		e.currentTarget._isTransitioning = false;
	}

	/* == helper methods == */

	_toggleAccordionItem(togglerEl, expand) {
		const itemEl = togglerEl.closest(`${BLOCK_NAME}__item`);
		const collapseEl = itemEl.querySelector(`${BLOCK_NAME}__collapse`);

		togglerEl.ariaExpanded = expand;

		if (expand) {
			// Opening
			this._prepareCollapseTransition(collapseEl, 'collapse');
			this._setCollapseHeight(collapseEl);
		} else {
			// Closing
			this._setCollapseHeight(collapseEl);

			// Force reflow
			collapseEl.offsetHeight;

			this._prepareCollapseTransition(collapseEl, 'show');

			collapseEl.style.height = '';
		}
	}

	_prepareCollapseTransition(el, classToRemove) {
		el.classList.remove(classToRemove);
		el.classList.add('collapsing');
	}

	_setCollapseHeight(el) {
		el.style.height = `${el.scrollHeight}px`;
	}
}
