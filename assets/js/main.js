document.addEventListener('DOMContentLoaded', function(){
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if(toggle && nav){
    toggle.addEventListener('click', ()=>nav.classList.toggle('open'));
  }

  const slider = document.querySelector('[data-slider]');
  if(slider){
    const slides = [...slider.querySelectorAll('.hero-slide')];
    const dotsWrap = slider.querySelector('.slider-dots') || document.querySelector('.slider-dots');
    let current = 0;
    let timer;
    const delay = 5200;

    function setActive(i){
      slides[current].classList.remove('active');
      if(dotsWrap && dotsWrap.children[current]) dotsWrap.children[current].classList.remove('active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('active');
      if(dotsWrap && dotsWrap.children[current]) dotsWrap.children[current].classList.add('active');
    }

    if(dotsWrap){
      dotsWrap.innerHTML = '';
      slides.forEach((_, i)=>{
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'بنر رقم ' + (i+1));
        b.addEventListener('click', ()=>{ setActive(i); restart(); });
        dotsWrap.appendChild(b);
      });
      dotsWrap.children[0]?.classList.add('active');
    }

    function start(){ timer = setInterval(()=>setActive(current+1), delay); }
    function restart(){ clearInterval(timer); start(); }
    slider.addEventListener('mouseenter', ()=>clearInterval(timer));
    slider.addEventListener('mouseleave', start);
    start();
  }
});
