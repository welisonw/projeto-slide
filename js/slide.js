
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

   onMove(event) {
      // atualizar quanto slide foi movido
      const finalPosition = this.updatePosition(event.clientX);
      this.moveSlide(finalPosition);
   };

   updatePosition(clientX) {
      this.distance.movement =(this.distance.startX - clientX) * 1.6;

      return this.distance.finalPosition - this.distance.movement;
   };
   
   onStart(event) {
      event.preventDefault();

      this.wrapper.addEventListener('mousemove', this.onMove);

      this.distance.startX = event.clientX;
   };

   onEnd() {
      this.wrapper.removeEventListener('mousemove', this.onMove);

      this.distance.finalPosition = this.distance.movePosition;
   }
   
   // Para adicionar cada evento do slide
   addSlideEvents() {
      this.wrapper.addEventListener('mousedown', this.onStart);
      this.wrapper.addEventListener('mouseup', this.onEnd);
   };
   
   // bind this ao callback para fazer referência ao objeto da classe
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
