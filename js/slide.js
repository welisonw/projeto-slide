
import debounce from "./debounce.js";

export class Slide {
   constructor(wrapper, slide) {
      this.wrapper = document.querySelector(wrapper);
      this.slide =  document.querySelector(slide);
      this.distance = {
         finalPosition: 0,
         startX: 0,
         movement: 0,
      };
      this.activeClass = 'active';
   };

   transition(active) {
      this.slide.style.transition = active ? 'transform .3s' : '';
   };

   moveSlide(distX) {
      this.distance.movePosition = distX;
      this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
   };

   updatePosition(clientX) {
      this.distance.movement = (this.distance.startX - clientX) * 1.6;

      return this.distance.finalPosition - this.distance.movement;
   };

   onMove(event) {
      // Posição do mouse ou do dedo
      const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;

      // atualizar quanto slide foi movido
      const finalPosition = this.updatePosition(pointerPosition);
      this.moveSlide(finalPosition);
   };
   
   onStart(event) {
      let movetype;

      // verificação DESKTOP ou MOBILE
      if (event.type === 'mousedown') {
         event.preventDefault();
         this.distance.startX = event.clientX;
         movetype = 'mousemove';
         
      } else {
         this.distance.startX = event.changedTouches[0].clientX;
         movetype = 'touchmove';
      };
      
      this.wrapper.addEventListener(movetype, this.onMove);

      this.transition(false);

   };

   slideIndexNav(index) {
      const last = this.slidesArray.length - 1;

      this.index = {
         prev: index ? index - 1 : undefined,
         actual: index,
         next: index ===  last ? undefined : index + 1,
      };
   };

   activeNextSlide() {
      if (this.index.next !== undefined) {
         this.changeSlide(this.index.next);
      };
   };

   activePrevSlide() {
      if (this.index.prev !== undefined) {
         this.changeSlide(this.index.prev);
      };
   };

   
   // Mudar o slide 
   changeSlideOnEnd() {
      if (this.distance.movement > 120 && this.index.next !== undefined) {
         this.activeNextSlide();
      } else if (this.distance.movement < -120 && this.index.prev !== undefined) {
         this.activePrevSlide();
      } else {
         this.changeSlide(this.index.actual);
      };
   };
   
   onEnd(event) {
      // Tipo de movimento para remover o touchmove ou mousemove
      const movetype = (event.type === 'mouseup') ? 'mousemove' : 'touchmove'

      this.wrapper.removeEventListener(movetype, this.onMove);

      this.distance.finalPosition = this.distance.movePosition;

      this.transition(true);

      this.changeSlideOnEnd();
   };
   
   // Para adicionar cada evento do slide
   addSlideEvents() {
      this.wrapper.addEventListener('mousedown', this.onStart);
      this.wrapper.addEventListener('touchstart', this.onStart);
      this.wrapper.addEventListener('mouseup', this.onEnd);
      this.wrapper.addEventListener('touchend', this.onEnd);
   };
   
  

   // Calcula para colocar o slide exatamente no centro da tela
   slidePosition(slide) {
      const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;

      return -(slide.offsetLeft - margin);
   };

   // Configuração de cada slide
   slidesConfig() {
      this.slidesArray = [...this.slide.children].map((element) => {
         const positionSlide = this.slidePosition(element);

         return {
            positionSlide,
            element,
         };
      });
   };
   

   // Muda o slide de acordo com o index que for passado
   changeSlide(index) {
      const activeSlide = this.slidesArray[index];

      this.moveSlide(activeSlide.positionSlide);
      this.slideIndexNav(index);

      this.distance.finalPosition = activeSlide.positionSlide;

      this.changeActiveClass();
   };


   changeActiveClass() {
      this.slidesArray.forEach((item) => {
         item.element.classList.remove(this.activeClass);
      })
      this.slidesArray[this.index.actual].element.classList.add(this.activeClass)
   };
  

   // Função para quando ocorre resize 
   onResize() {
      setTimeout(() => {
         this.slidesConfig();
         this.changeSlide(this.index.actual);
      }, 1000);
   };

   addResizeEvent() {
      window.addEventListener('resize', this.onResize);
   };




    // bind this aos callbacks para fazer referência ao objeto da classe
    bindEvents() {
      this.onStart = this.onStart.bind(this);
      this.onMove = this.onMove.bind(this);
      this.onEnd = this.onEnd.bind(this);
      this.onResize = debounce(this.onResize.bind(this), 200);
      this.activeNextSlide = this.activeNextSlide.bind(this);
      this.activePrevSlide = this.activePrevSlide.bind(this);
   };

   init() {
      this.transition(true);
      this.bindEvents();
      this.addSlideEvents();
      this.slidesConfig();
      this.addResizeEvent();
      this.changeSlide(0)

      return this;
   };
};



export class SlideNav extends Slide {
   addArrow(prev, next) {
      this.prevElement = document.querySelector(prev);
      this.nextElement = document.querySelector(next);
      this.addArrowEvent();
   };

   addArrowEvent() {
      this.prevElement.addEventListener('click', this.activePrevSlide);
      this.nextElement.addEventListener('click', this.activeNextSlide);
   };

};
