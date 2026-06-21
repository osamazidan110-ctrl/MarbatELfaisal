
document.addEventListener('DOMContentLoaded', function(){
  const nav = document.querySelector('.main-nav');
  const toggle = document.querySelector('.menu-toggle');
  if(toggle && nav){
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  const slider = document.querySelector('[data-slider]');
  if(slider){
    const slides = Array.from(slider.querySelectorAll('.hero-slide'));
    const dots = slider.querySelector('.slider-dots');
    let current = 0;
    let timer;
    const delay = 5200;

    function setSlide(index){
      slides[current].classList.remove('active');
      dots?.children[current]?.classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots?.children[current]?.classList.add('active');
    }

    if(dots){
      dots.innerHTML = '';
      slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'بنر رقم ' + (i + 1));
        b.addEventListener('click', () => { setSlide(i); restart(); });
        dots.appendChild(b);
      });
      dots.children[0]?.classList.add('active');
    }

    function start(){ timer = setInterval(() => setSlide(current + 1), delay); }
    function restart(){ clearInterval(timer); start(); }
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', start);
    start();
  }

  const topBtn = document.querySelector('.back-to-top');
  if(topBtn){
    const show = () => topBtn.classList.toggle('show', window.scrollY > 450);
    show();
    window.addEventListener('scroll', show, {passive:true});
    topBtn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
  }
});
