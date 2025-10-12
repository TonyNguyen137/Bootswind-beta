/**
 * Liest eine JSON-ähnliche CSS-Custom-Property und parsed sie zu einem Objekt.
 * Erlaubt Werte wie: '--js-breakpoints: "{\"sm\":\"640px\"}"' oder "'{...}'".
 *
 * @param {Object} [config]
 * @param {string} [config.varName='--js-breakpoints'] - Name der CSS-Var.
 * @param {Element} [config.root=document.documentElement] - Wurzel für computed styles.
 * @param {string} [config.errorLog='--js-breakpoints custom property is missing.']
 * @param {string} [config.errorAdd='']
 * @param {boolean} [config.silent=false] - Keine console.error-Ausgaben.
 * @returns {Object|null} - Das geparste Objekt oder null bei Fehler.
 */
export function getCSSBreakpoints(config = {}) {
  const {
    varName = '--js-breakpoints',
    root = typeof document !== 'undefined' ? document.documentElement : undefined,
    errorLog = '--js-breakpoints custom property is missing.',
    errorAdd = 'Some components might not behave as expected',
    silent = false,
  } = config;

  const logError = (msg) => {
    if (!silent) console.error(msg);
  };

  console.log('varName', varName);

  // SSR/Tests abfangen
  if (!root || typeof window === 'undefined' || typeof getComputedStyle !== 'function') {
    logError(`${errorLog}${errorAdd} (No DOM available)`);
    return null;
  }
  const raw = getComputedStyle(root).getPropertyValue(varName).trim();

  if (raw === '') {
    logError(`${errorLog}${errorAdd}`);
    return null;
  }

  // Entferne ein Paar umschließender Quotes – egal ob '...' oder "..."
  const unwrapped = raw.replace(/^(['"])(.*)\1$/, '$2');

  // Parsen mit Fallback für das häufige Muster '"{...}"'
  const tryParse = (s) => {
    try {
      return JSON.parse(s);
    } catch {
      return undefined;
    }
  };
  let parsed = tryParse(unwrapped);

  if (!parsed || typeof parsed !== 'object') {
    logError(`Invalid ${varName} JSON. Got: ${String(parsed)}`);
    return null;
  }

  return parsed;
}

export function selectAll(selector, scope = document) {
  return scope.querySelectorAll(selector);
}

/**
 * Returns the next number in a range after the given index, wrapping around if necessary.
 * Inspired by GSAP's wrap() function.
 * @see {@link https://gsap.com/docs/v3/GSAP/UtilityMethods/wrap()/ GSAP wrap() Documentation}
 *
 * @param {number | Array} min - The minimum value of the range (inclusive) or an array of values to wrap within.
 * @param {number} max - The maximum value of the range (inclusive). If `min` is an array, this parameter is treated as the index.
 * @param {number} index -  The index or position in the range. If `min` is an array, this parameter is ignored.
 * @returns {number | * } -  If `min` is a number, returns a number within the range. If `min` is an array, returns an element from the array
 *
 * @example
 * Wrap around within a range of 1 to 3
 *
 * Utilities.wrap(1, 3, 0); // Returns 1
 * Utilities.wrap(1, 3, 1); // Returns 2
 * Utilities.wrap(1, 3, 2); // Returns 3
 * Utilities.wrap(1, 3, 3); // Returns 1
 *
 * @example
 * Wrap within an array
 *
 * const arr = ["a", "b", "c"];
 * Utilities.wrap(arr, 0); // Returns "a"
 * Utilities.wrap(arr, 1); // Returns "b"
 * Utilities.wrap(arr, 2); // Returns "c"
 * Utilities.wrap(arr, 3); // Returns "a" (wraps around)
 */

export function wrap(min, max, index) {
  // Handle array input
  if (Array.isArray(min)) {
    return this.wrapArray(min, max);
  }

  // Handle numeric range input
  return this.wrapRange(min, max, index);
}

/**
 * Returns the value from the array at the given index, wrapping around if the index exceeds the array length.
 *
 * @param {Array} arr - The array to retrieve the value from.
 * @param {number} index - The index to access, which wraps around if out of bounds.
 * @returns {*} - The value from the array at the wrapped index.
 */

export function wrapArray(arr, index) {
  const length = arr.length;
  return arr[((index % length) + length) % length];
}

/**
 * Wraps a value within a numeric range, ensuring it stays within bounds.
 * @param {number} min - The minimum value of the range (inclusive).
 * @param {number} max - The maximum value of the range (inclusive).
 * @param {number} value - The value to wrap.
 * @returns {number} - The wrapped value within the range.
 */
export function wrapRange(min, max, value) {
  const range = max - min + 1;
  return ((((value - min) % range) + range) % range) + min;
}

export function debounce(cb, delay = 1000) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}

export function setAttributesTo(element, attributes) {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

export function removeAttributesFrom(element, ...attributes) {
  attributes.forEach((attribute) => {
    element.removeAttribute(attribute);
  });
}

export function escapeHTML(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function forceReflow(el) {
  el.offsetHeight;
}
export function isIosDevice() {
  return (
    typeof window !== 'undefined' &&
    window.navigator &&
    window.navigator.platform &&
    (/iP(ad|hone|od)/.test(window.navigator.platform) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1))
  );
}
export function select(selector, scope = document) {
  return scope.querySelector(selector);
}

export function toArray(input, scope = document) {
  if (typeof input === 'string') {
    const elements = Array.from(scope.querySelectorAll(input));
    return elements.length ? elements : false;
  }

  return Array.from(input);
}

export function getRandomNumber(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function rangeWrapper(min, max) {
  return function (value) {
    return ((((value - min) % (max - min + 1)) + (max - min + 1)) % (max - min + 1)) + min;
  };
}

export function toggleTheme(selector = '.switch__input', options = { onTrue: 'dark' }) {
  let input = document.querySelector(selector);
  let theme = options.onTrue;

  input.addEventListener('change', (e) => {
    let isChecked = e.target.checked;

    if (isChecked) {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  });
}
