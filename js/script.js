
import Slide from "./slide.js";

const slide = new Slide('.slide-wrapper', '.slide');
slide.init();

console.log(slide);

slide.changeSlide(4)
slide.activePrevSlide()