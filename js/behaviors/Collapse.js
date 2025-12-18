import { NAMESPACE } from '../config';
import { CLASS_IS_COLLAPSING, CLASS_COLLAPSE, CLASS_SHOW } from '../css-class';

const ANIMATION_OPTIONS = {
	duration: 350,
	easing: 'ease',
};

export class Collapse {
	constructor(toggleSelector = `[data-${NAMESPACE}-toggle='collapse']`) {
		this._toggleEls = document.querySelectorAll(toggleSelector);
		this._animationOptions = ANIMATION_OPTIONS;

		if (!this._toggleEls || this._toggleEls.length === 0) return;

		let i = this._toggleEls.length;

		while (i--) {
			this._init(this._toggleEls[i]);
		}
	}

	_init(toggleEl) {
		const targetSelector = toggleEl.dataset[NAMESPACE + 'Target'];
		const targetEls = document.querySelectorAll(targetSelector);

		if (!targetEls || targetEls.length === 0) {
			console.info(`Target element is missing. [Collapse] cannot be initialized.`);
			return;
		}

		const closeTargetSelector = toggleEl.dataset[NAMESPACE + 'CloseTarget'];
		const closeTargetEls = document.querySelectorAll(closeTargetSelector);

		toggleEl.addEventListener('click', this._toggle.bind(this, toggleEl, targetEls, closeTargetEls));
	}

	// handler methods
	_toggle(toggleEl, targetEls, closeTargetEls) {
		this._setExpanded(toggleEl, targetEls, closeTargetEls);
	}

	_setExpanded(toggleEl, targets, closeTargets, state = null) {
		const isExpanded = state !== null ? state : toggleEl.ariaExpanded === 'true';

		if (closeTargets && closeTargets.length > 0) {
			closeTargets.forEach((el) => {
				if (el.classList.contains(CLASS_SHOW)) {
					const id = el.id;
					const toggleEl = document.querySelector(`[aria-controls=${id}]`);
					el.classList.remove(CLASS_COLLAPSE, CLASS_SHOW);
					el.classList.add(CLASS_IS_COLLAPSING);
					toggleEl.disabled = true;

					const from = el.scrollHeight;
					const to = 0;

					const animation = el.animate([{ height: `${from}px` }, { height: `${to}px` }], this._animationOptions);
					animation.finished
						.catch(() => {}) // falls cancel() -> finished rejected
						.then(() => {
							el.classList.remove(CLASS_IS_COLLAPSING);
							el.classList.add(CLASS_COLLAPSE);
							toggleEl.ariaExpanded = false;
							toggleEl.disabled = false;
						});
				}
			});
		}

		targets.forEach((el) => {
			el.classList.remove(CLASS_COLLAPSE, CLASS_SHOW);
			el.classList.add(CLASS_IS_COLLAPSING);
			toggleEl.disabled = true;

			const from = isExpanded ? el.scrollHeight : 0;
			const to = isExpanded ? 0 : el.scrollHeight;

			const animation = el.animate([{ height: `${from}px` }, { height: `${to}px` }], this._animationOptions);

			animation.finished
				.catch(() => {}) // falls cancel() -> finished rejected
				.then(() => {
					el.classList.remove(CLASS_IS_COLLAPSING);

					if (isExpanded) {
						el.classList.add(CLASS_COLLAPSE);
					} else {
						el.classList.add(CLASS_COLLAPSE, CLASS_SHOW);
					}

					toggleEl.ariaExpanded = !isExpanded;
					toggleEl.disabled = false;
				});
		});
	}
}
