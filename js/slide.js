
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


   // Calcula para colocar o slide exatamente no centro da tela
   slidePosition(slide) {
      const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;

      return -(slide.offsetLeft - margin);
   };


   slideIndexNav(index) {
      const last = this.slidesArray.length - 1;

      this.index = {
         previus: index ? index - 1 : undefined,
         current: index,
         next: index ===  last ? undefined : index + 1,
      };
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

      console.log(this.slidesArray);
   };
   

   // Muda o slide de acordo com o index que for passado
   changeSlide(index) {
      const activeSlide = this.slidesArray[index];

      this.moveSlide(activeSlide.positionSlide);
      this.slideIndexNav(index);

      this.distance.finalPosition = activeSlide.positionSlide;
   }

   init() {
      this.bindEvents();
      this.addSlideEvents();
      this.slidesConfig();

      return this;
   }
};
