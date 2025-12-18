import { NAMESPACE } from '../config';
import { CLASS_HIDDEN } from '../css-class';

/**
 * ToggleDisplay (Progressive Enhancement).
 *
 * The target element is hidden using the `hidden` class *only when*
 * JavaScript is available. Without JavaScript, the target element stays visible
 * and the toggle button is not inserted, ensuring graceful degradation
 * and proper accessibility.
 *
 * In short:
 * - With JavaScript → toggle button + controlled hide/show behaviour → target element hidden
 * - Without JavaScript → target element visible, no button, no loss of information
 */

const DEFAULT_TOGGLE_TEXT = 'expand';
const INSERT_AFTER = 'append';
const INSERT_BEFORE = 'prepend';

export class ToggleDisplay {
	constructor(toggleSelector = `[data-${NAMESPACE}-toggle-container="display"]`) {
		this._toggleContainerEls = document.querySelectorAll(toggleSelector);

		if (!this._toggleContainerEls || this._toggleContainerEls.length === 0) return;

		let i = this._toggleContainerEls.length;

		while (i--) {
			this._init(this._toggleContainerEls[i]);
		}
	}

	_init(toggleContainerEl) {
		const targetSelector = toggleContainerEl.dataset[NAMESPACE + 'Target'];
		const targetEl = document.getElementById(targetSelector);

		if (!targetEl) {
			console.info(`Target element is missing. ToggleDisplay cannot be initialized.`);
			return;
		}

		// Hiding the targetEl is handled via JS so that it remains visible
		// when JavaScript is disabled (progressive enhancement).
		this._hideTargetEl(targetEl);

		// get the desired text content for the toggle Element
		const textContent = toggleContainerEl.dataset[NAMESPACE + 'TextContent'] || DEFAULT_TOGGLE_TEXT;

		const toggleEl = this._createToggleEl(targetSelector, targetEl, textContent);

		const insertPosition =
			toggleContainerEl.dataset[NAMESPACE + 'InsertPosition'] === INSERT_BEFORE ? INSERT_BEFORE : INSERT_AFTER;

		toggleContainerEl[insertPosition](toggleEl);
	}

	// handler methods
	_toggle(toggleEl, targetEl) {
		const isHidden = targetEl.classList.contains(CLASS_HIDDEN);
		targetEl.classList.toggle(CLASS_HIDDEN, !isHidden);
		toggleEl.ariaExpanded = isHidden;
	}

	// helper methods
	_createToggleEl(targetSelector, targetEl, textContent) {
		const toggleEl = document.createElement('button');

		toggleEl.textContent = textContent;

		this._setAriaAttributes(toggleEl, targetSelector);

		toggleEl.addEventListener('click', (e) => {
			this._toggle(toggleEl, targetEl);
		});

		return toggleEl;
	}

	_setAriaAttributes(toggleEl, targetSelector) {
		toggleEl.setAttribute('aria-expanded', false);
		toggleEl.setAttribute('aria-controls', targetSelector);
	}

	_hideTargetEl(targetEl) {
		targetEl.classList.add(CLASS_HIDDEN);
	}
}
