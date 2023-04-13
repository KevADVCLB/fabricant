import {gsap} from 'gsap'
import {ScrollSmoother} from 'gsap/dist/ScrollSmoother.js';
import {ScrollTrigger} from 'gsap/dist/ScrollTrigger.js';
import {SplitText} from 'gsap/dist/SplitText.js';
import {ScrollToPlugin} from 'gsap/dist/ScrollToPlugin.js';
import {browser} from '$app/environment';
import {DrawSVGPlugin} from "gsap/dist/DrawSVGPlugin";
import {Expo, Quint} from 'gsap';

if(browser) {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin, ScrollToPlugin);
}

export * from "gsap";
export {ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin, ScrollToPlugin, Expo, Quint}
