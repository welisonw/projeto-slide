
export default class Slide {
   constructor(wrapper, slide) {
      this.wrapper = document.querySelector(wrapper);
      this.slide =  document.querySelector(slide);
      this.distance = {
         finalPosition: 0,
         startX: 0,
         movement: 0,
      };
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

   };

   onEnd(event) {
      // Tipo de movimento para remover o touchmove ou mousemove
      const movetype = (event.type === 'mouseup') ? 'mousemove' : 'touchmove'

      this.wrapper.removeEventListener(movetype, this.onMove);

      this.distance.finalPosition = this.distance.movePosition;
   }
   
   // Para adicionar cada evento do slide
   addSlideEvents() {
      this.wrapper.addEventListener('mousedown', this.onStart);
      this.wrapper.addEventListener('touchstart', this.onStart);
      this.wrapper.addEventListener('mouseup', this.onEnd);
      this.wrapper.addEventListener('touchend', this.onEnd);
   };
   
   // bind this aos callbacks para fazer referência ao objeto da classe
   bindEvents() {
      this.onStart = this.onStart.bind(this);
      this.onMove = this.onMove.bind(this);
      this.onEnd = this.onEnd.bind(this);
   };
   

   init() {
      this.bindEvents();
      this.addSlideEvents();

      return this;
   }
};
