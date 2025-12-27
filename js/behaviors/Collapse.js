import { NAMESPACE } from '../config';
import {
	CLASS_IS_COLLAPSING,
	CLASS_COLLAPSE,
	CLASS_SHOW,
	CLASS_COLLAPSE_HORIZONTAL,
} from '../css-class';

const ANIMATION_OPTIONS = {
	duration: 350,
	easing: 'ease',
};

export class Collapse {
	constructor(toggleSelector = `[data-${NAMESPACE}-toggle='collapse']`) {
		this._toggleEls = document.querySelectorAll(toggleSelector);
		this._animationOptions = ANIMATION_OPTIONS;

		/**
		 * Internal store (WeakMap):
		 */

		this._store = new WeakMap();

		if (!this._toggleEls || this._toggleEls.length === 0) return;

		let i = this._toggleEls.length;

		while (i--) {
			this._init(this._toggleEls[i]);
		}
	}

	_init(mainToggleEl) {
		const targetSelector = mainToggleEl.dataset[NAMESPACE + 'Target'];
		const targetEls = document.querySelectorAll(targetSelector);

		if (!targetEls || targetEls.length === 0) {
			console.info(`Target element is missing. [Collapse] cannot be initialized.`);
			return;
		}

		const closeTargetId = mainToggleEl.dataset[NAMESPACE + 'Closetarget'];
		const closeTargetToggleEl = closeTargetId && this._findToggleByTarget(closeTargetId);

		const closeBtnSelector = mainToggleEl.dataset[NAMESPACE + 'Close'];
		const closeBtnEls = [];

		targetEls.forEach((targetEl) => {
			const closeBtnEl = targetEl.querySelector(closeBtnSelector);

			if (closeBtnEl) {
				closeBtnEls.push(closeBtnEl);
			}
		});

		/**
		 * `mainToggleEl` is used as the WeakMap key to access its stored data.
		 * Internal methods receive the `mainToggleEl` to access its store entry.
		 */

		this._store.set(mainToggleEl, {
			isAnimating: false,
			targetSelector,
			targetEls: Array.from(targetEls),
			closeTargetToggleEl,
		});

		mainToggleEl.addEventListener('click', this._toggle.bind(this, mainToggleEl, null));

		closeBtnEls.forEach((closeBtnEl) => {
			closeBtnEl.addEventListener('click', this._toggle.bind(this, mainToggleEl, true));
		});

		// closeBtnEl?.addEventListener?.('click', this._collapse(this, mainToggleEl));
	}

	// handler methods

	/**
	 * Toggles the collapse state.
	 * If `expanded` is provided (true/false), it forces the target state.
	 * If omitted, the next state is derived from the current `aria-expanded` value.
	 */

	_toggle(mainToggleEl, expanded) {
		const { closeTargetToggleEl, isAnimating } = this._store.get(mainToggleEl);
		const isExpanded = expanded ?? mainToggleEl.ariaExpanded === 'true';

		if (isAnimating) return;

		if (closeTargetToggleEl && closeTargetToggleEl.ariaExpanded === 'true') {
			console.log('in if');

			const { targetEls: collapseEls } = this._store.get(closeTargetToggleEl);

			closeTargetToggleEl.click();

			const animation = collapseEls?.[0]?.getAnimations()?.[0] || [];

			if (animation.length === 0) return;

			animation.finished.then(() => {
				this._animateTo(!isExpanded, mainToggleEl);
			});
		} else {
			console.log('in else');

			this._animateTo(!isExpanded, mainToggleEl);
		}

		this._syncToggles(mainToggleEl);
	}

	// helper methods

	/**
	 * Animates the collapse target(s) to the desired state.
	 * `expanded` is the target state: `true` expands/opens, `false` collapses/closes.
	 *
	 * @param {boolean} expanded - Target state (true = collapse/hide, false = expand/show).
	 * @param {HTMLElement} mainToggleEl - The clicked toggle element.
	 * @returns {void}
	 */

	_animateTo(expanded, mainToggleEl) {
		const data = this._store.get(mainToggleEl);
		const { closeTargetToggleEl } = data;
		const targetStore = closeTargetToggleEl ? this._store.get(closeTargetToggleEl) : null;

		targetStore && (targetStore.isAnimating = true);

		this._forEachSharedTarget(mainToggleEl, (toggleEl, isExpanded, store) => {
			store.isAnimating = true;
		});

		data.targetEls.forEach((el) => {
			el.classList.remove(CLASS_COLLAPSE, CLASS_SHOW);

			const isHorizontal = el.classList.contains(CLASS_COLLAPSE_HORIZONTAL);
			const scrollProperty = isHorizontal ? 'scrollWidth' : 'scrollHeight';
			const sizeProperty = isHorizontal ? 'width' : 'height';

			const from = expanded ? 0 : el[scrollProperty];
			const to = expanded ? el[scrollProperty] : 0;

			el.classList.add(CLASS_IS_COLLAPSING);

			const animation = el.animate(
				[{ [sizeProperty]: `${from}px` }, { [sizeProperty]: `${to}px` }],
				this._animationOptions
			);

			animation.finished
				.then(() => {
					el.classList.remove(CLASS_IS_COLLAPSING);

					if (expanded) {
						el.classList.add(CLASS_COLLAPSE, CLASS_SHOW);
					} else {
						el.classList.add(CLASS_COLLAPSE);
					}

					this._forEachSharedTarget(mainToggleEl, (toggleEl, isExpanded, store) => {
						store.isAnimating = false;
					});

					targetStore && (targetStore.isAnimating = false);
				})
				.catch(() => {});
		});
	}

	/**
	 * Sync `aria-expanded` across all toggles that share at least one target
	 * with `mainToggleEl`.
	 * @param {HTMLElement} mainToggleEl - The clicked toggle element.
	 * @returns {void}
	 */

	_syncToggles(mainToggleEl) {
		this._forEachSharedTarget(mainToggleEl, (toggleEl, isExpanded) => {
			toggleEl.ariaExpanded = String(!isExpanded);
		});
	}

	/**
	 * Iterates over all registered toggle elements and invokes `callback` for each
	 * toggle that shares at least one target element with `mainToggleEl`
	 * (including `mainToggleEl` itself).
	 *
	 * Note: `callback` is also invoked for `mainToggleEl`, because it always shares
	 * its own targets.
	 *
	 * @param {HTMLElement} mainToggleEl - The clicked toggle element.
	 * @param {(toggleEl: HTMLElement, mainExpanded: boolean, store: Object) => void} callback
	 * Callback invoked for each related target.
	 * @returns {void}
	 */

	_forEachSharedTarget(mainToggleEl, callback) {
		const mainExpanded = mainToggleEl.ariaExpanded === 'true';

		const mainStore = this._store.get(mainToggleEl);
		if (!mainStore || !mainStore.targetEls) return;

		const mainTargetEls = mainStore.targetEls;

		let i = this._toggleEls.length;

		while (i--) {
			const toggleEl = this._toggleEls[i];
			const store = this._store.get(toggleEl);

			if (!store || !store.targetEls) continue;

			const targetEls = store.targetEls;

			const hasSharedTarget = targetEls.some((el) => mainTargetEls.includes(el));

			if (hasSharedTarget) {
				callback(toggleEl, mainExpanded, store);
			}
		}
	}

	_findToggleByTarget(targetId) {
		let i = this._toggleEls.length;

		while (i--) {
			const toggleEl = this._toggleEls[i];
			const id = toggleEl.getAttribute('aria-controls');
			if (id === targetId) return toggleEl;
		}
		return null;
	}
}
