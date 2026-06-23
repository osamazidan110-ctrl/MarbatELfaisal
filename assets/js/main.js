
document.addEventListener('DOMContentLoaded', function(){
  const nav = document.querySelector('.bec-nav') || document.querySelector('.main-nav');
  const toggle = document.querySelector('.menu-toggle');
  if(toggle && nav){
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  const slider = document.querySelector('[data-bec-slider]');
  if(slider){
    const slides = Array.from(slider.querySelectorAll('.bec-slide'));
    const next = slider.querySelector('.slider-next');
    const prev = slider.querySelector('.slider-prev');
    const currentLabel = slider.querySelector('.current-slide');
    let current = 0;
    let timer;
    const delay = 5400;
    function setSlide(index){
      slides[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      if(currentLabel) currentLabel.textContent = String(current + 1).padStart(2,'0');
    }
    function start(){ timer = setInterval(() => setSlide(current + 1), delay); }
    function restart(){ clearInterval(timer); start(); }
    next?.addEventListener('click', () => { setSlide(current + 1); restart(); });
    prev?.addEventListener('click', () => { setSlide(current - 1); restart(); });
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', start);
    start();
  }

  const counters = document.querySelectorAll('[data-counter]');
  const counterObs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.counter || 0);
      let value = 0;
      const step = Math.max(1, Math.ceil(target / 45));
      const run = setInterval(()=>{
        value += step;
        if(value >= target){ value = target; clearInterval(run); }
        el.textContent = value;
      }, 28);
      counterObs.unobserve(el);
    });
  }, {threshold:.5});
  counters.forEach(c => counterObs.observe(c));

  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObs.unobserve(entry.target);
      }
    });
  }, {threshold:.15});
  reveals.forEach(el => revealObs.observe(el));

  const topBtn = document.querySelector('.back-to-top');
  if(topBtn){
    const show = () => topBtn.classList.toggle('show', window.scrollY > 480);
    show();
    window.addEventListener('scroll', show, {passive:true});
    topBtn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
  }
});


function handleStablingSubscription(event){
  event.preventDefault();
  const form = event.target;
  const msg = form.querySelector('#stablingFormMessage');
  const formData = new FormData(form);
  const addons = [];
  form.querySelectorAll('input[name="addons"]:checked').forEach(el => addons.push(el.value));
  const payload = {};
  formData.forEach((value, key) => {
    if(key !== 'addons') payload[key] = value;
  });
  payload.addons = addons;
  payload.submittedAt = new Date().toISOString();

  try{
    const existing = JSON.parse(localStorage.getItem('alfaisal_stabling_subscriptions') || '[]');
    existing.push(payload);
    localStorage.setItem('alfaisal_stabling_subscriptions', JSON.stringify(existing));
    if(msg){
      const isArabic = document.documentElement.lang === 'ar';
      msg.textContent = isArabic
        ? 'تم حفظ طلب الاشتراك محليًا بنجاح. يمكن ربطه لاحقًا بقاعدة البيانات.'
        : 'Subscription request saved locally successfully. It can be connected to the database later.';
      msg.className = 'form-status-message success';
    }
    form.reset();
  }catch(err){
    if(msg){
      const isArabic = document.documentElement.lang === 'ar';
      msg.textContent = isArabic
        ? 'حدث خطأ أثناء حفظ الطلب. يرجى المحاولة مرة أخرى.'
        : 'An error occurred while saving the request. Please try again.';
      msg.className = 'form-status-message error';
    }
  }
}

document.addEventListener('DOMContentLoaded', function(){
  const stablingForm = document.getElementById('stablingSubscriptionForm');
  if(stablingForm){
    stablingForm.addEventListener('submit', handleStablingSubscription);
  }
});
