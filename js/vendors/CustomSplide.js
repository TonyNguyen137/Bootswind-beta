import { toArray, getRandomNumber } from "../utils";
import Splide from "@splidejs/splide";

export class CustomSplide {
  constructor() {
    this._rootEls = toArray(".splide");

    if (!this._rootEls) return;

    let i = this._rootEls.length;

    while (i--) {
      this._initRootEl(this._rootEls[i]);
    }
  }

  _initRootEl(rootEl) {
    const config = JSON.parse(rootEl.dataset.configuration ?? "{}");

    let splide = new Splide(rootEl, {
      type: "fade",
      autoplay: true,
      interval: 3000,
      perPage: 1,
      gap: 0,
      rewind: true,
      speed: 500,
      role: "group",
      pagination: true,
      mediaQuery: "min",
      ...config,
    });

    splide.on("overflow", function (isOverflow) {
      isOverflow && splide.go(0);

      console.log(isOverflow);

      splide.options = {
        pagination: isOverflow,
        arrows: isOverflow,
        drag: isOverflow,
        clones: isOverflow ? undefined : 0, // Toggle clones
      };
    });

    splide.mount();
  }
}
