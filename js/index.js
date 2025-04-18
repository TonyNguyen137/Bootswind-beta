import '../scss/style.scss';

import { NavbarOffcanvas } from './components';
// import { Backdrop, BodyScrollLocker, ScrollLocker } from './modules';
// import { Utils } from './utils';

const st = performance.now();
new NavbarOffcanvas();
const et = performance.now();
const delta = et - st;
console.log(`instantiation took ${delta} milliseconds`);
