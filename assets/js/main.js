gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

function setVH(){document.documentElement.style.setProperty('--vh', (window.innerHeight*0.01)+'px');}
setVH(); window.addEventListener('resize', setVH);

/* ---------- custom cursor ---------- */
const cursor = $('#cursor');
if(cursor && !reduceMotion){
  window.addEventListener('mousemove', e=>{
    gsap.to(cursor,{x:e.clientX,y:e.clientY,duration:.5,ease:'power3.out'});
  });
  $$('a, button, [data-tilt]').forEach(el=>{
    el.addEventListener('mouseenter',()=>cursor.classList.add('grow'));
    el.addEventListener('mouseleave',()=>cursor.classList.remove('grow'));
  });
}

/* ---------- magnetic buttons ---------- */
if(!reduceMotion){
  $$('.mag-btn').forEach(btn=>{
    btn.addEventListener('mousemove', e=>{
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      gsap.to(btn,{x:x*0.28,y:y*0.5,duration:.4,ease:'power3.out'});
    });
    btn.addEventListener('mouseleave',()=>{gsap.to(btn,{x:0,y:0,duration:.5,ease:'elastic.out(1,0.4)'});});
  });
}

/* ---------- preloader (home page only) ---------- */
const preloader = $('#preloader');
if(preloader){
  document.body.style.overflow='hidden';
  window.addEventListener('load', ()=>{
    gsap.to('#plLogo', {opacity:1, y:0, duration:.9, ease:'power3.out'});
    const tl = gsap.timeline({delay:.2, onComplete:()=>{
      preloader.style.display='none';
      document.body.style.overflow='auto';
      playHero();
    }});
    const counter = {v:0};
    tl.to(counter,{v:100,duration:1.3,ease:'power2.inOut',onUpdate:()=>{
      const el = $('#plCount'); if(el) el.textContent = String(Math.floor(counter.v)).padStart(2,'0');
    }})
    .to('#plBar', {width:'100%', duration:1.3, ease:'power2.inOut'},'<')
    .to(preloader, {yPercent:-100, duration:.9, ease:'power4.inOut'}, '+=.1');
  });
} else {
  window.addEventListener('DOMContentLoaded', ()=>{
    gsap.fromTo('.page-enter', {opacity:0, y:18}, {opacity:1, y:0, duration:.9, stagger:.08, ease:'power3.out', delay:.1});
    if($('.hero h1 .line span')) playHero();
  });
}

/* ---------- hero reveal ---------- */
function playHero(){
  const heroLines = $$('.hero h1 .line span');
  if(heroLines.length){
    gsap.to(heroLines, {
      x:0,
      filter:'blur(0px)',
      duration:1.18,
      stagger:.11,
      ease:'power4.out'
    });
  }

  const streaks = $$('.hero-streaks i');
  if(streaks.length){
    gsap.to(streaks, {
      x:'175%',
      opacity:0,
      duration:1.35,
      stagger:.06,
      ease:'power3.out',
      delay:.04
    });
  }

  gsap.fromTo('.hero-top, .hero-copy, .hero-cta-group, .scroll-cue',
    {opacity:0,y:16},
    {opacity:1,y:0,duration:1,stagger:.12,delay:.34,ease:'power3.out'}
  );

  if(!reduceMotion && $('#heroOrb')){
    gsap.to('#heroOrb', {rotation:360, duration:13.5, repeat:-1, ease:'none'});
    gsap.to('#heroOrb', {scale:1.018, duration:2.8, yoyo:true, repeat:-1, ease:'sine.inOut'});
  }

  if(!reduceMotion && $('#heroOrbit')){
    gsap.to('#heroOrbit', {rotation:360, duration:24, repeat:-1, ease:'none'});
    $$('.orbit-word').forEach((word) => {
      gsap.to(word, {rotation:'-=360', duration:24, repeat:-1, ease:'none'});
    });
  }
}

/* ---------- marquee ---------- */
if(!reduceMotion && $('#marquee')){
  gsap.to('#marquee', {xPercent:-50, duration:26, repeat:-1, ease:'linear'});
}

/* ---------- reveal-up generic ---------- */
if($$('.reveal-up').length){
  gsap.set('.reveal-up .inner', {yPercent:100, opacity:0});
  $$('.reveal-up').forEach(el=>{
    const inner = $('.inner', el);
    gsap.to(inner, {
      yPercent:0, opacity:1, duration:1.1, ease:'power4.out',
      scrollTrigger:{trigger:el, start:'top 88%'}
    });
  });
}

/* ---------- horizontal scroll work section (home + /work/) ---------- */
let hTween = null;
function initHorizontal(){
  const track = $('#workTrack');
  const pin = $('#workPin');
  if(!track || !pin) return;

  if(window.innerWidth <= 760){
    gsap.set('.project-frame .veil', {scaleY:1});
    $$('.project-frame .veil').forEach(v=>{
      gsap.to(v, {
        scaleY:0, duration:1.1, ease:'power4.inOut',
        scrollTrigger:{trigger:v.closest('.project-card'), start:'top 82%'}
      });
    });
    $$('.project-card').forEach(card=>{
      gsap.fromTo(card, {opacity:0, y:40}, {
        opacity:1, y:0, duration:1, ease:'power3.out',
        scrollTrigger:{trigger:card, start:'top 88%'}
      });
    });
    return;
  }

  const distance = track.scrollWidth - window.innerWidth + 100;
  gsap.set('.project-frame .veil', {scaleY:1});

  hTween = gsap.to(track, {
    x: -distance,
    ease:'none',
    scrollTrigger:{
      trigger: pin,
      start:'top top',
      end: ()=> '+=' + (distance + window.innerHeight*0.4),
      scrub:1,
      pin:true,
      invalidateOnRefresh:true
    }
  });

  $$('.project-card').forEach(card=>{
    const veil = $('.veil', card);
    const img = $('img', card);
    gsap.to(veil, {
      scaleY:0, duration:1, ease:'power4.inOut',
      scrollTrigger:{
        trigger: card, containerAnimation: hTween,
        start:'left 78%', end:'left 45%', scrub:false, toggleActions:'play none none reverse'
      }
    });
    gsap.fromTo(img, {yPercent:-6}, {
      yPercent:6, ease:'none',
      scrollTrigger:{
        trigger: card, containerAnimation: hTween,
        start:'left right', end:'right left', scrub:true
      }
    });
  });
}
initHorizontal();
window.addEventListener('resize', ()=>{ ScrollTrigger.refresh(); });

/* ---------- services accordion ---------- */
$$('[data-serv]').forEach(row=>{
  row.addEventListener('click', ()=>{
    const wasOpen = row.classList.contains('open');
    $$('[data-serv]').forEach(r=>r.classList.remove('open'));
    if(!wasOpen) row.classList.add('open');
  });
});

/* ---------- tilt on project images ---------- */
if(!reduceMotion){
  $$('[data-tilt]').forEach(card=>{
    const img = $('img', card);
    if(!img) return;
    card.addEventListener('mousemove', e=>{
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width - 0.5;
      const py = (e.clientY - r.top)/r.height - 0.5;
      gsap.to(img, {x:px*18, y:py*18, duration:.6, ease:'power3.out'});
    });
    card.addEventListener('mouseleave', ()=>{gsap.to(img,{x:0,y:0,duration:.8,ease:'power3.out'});});
  });
}

/* ---------- cookie consent ---------- */
const cookieBar = $('#cookieBar');
if(cookieBar){
  window.addEventListener('load', ()=>{
    setTimeout(()=>{
      try{
        if(!localStorage.getItem('midiva_cookie_choice')) cookieBar.classList.add('show');
      }catch(e){ cookieBar.classList.add('show'); }
    }, 2200);
  });
  const accept = $('#cookieAccept'), decline = $('#cookieDecline');
  if(accept) accept.addEventListener('click', ()=>{
    try{ localStorage.setItem('midiva_cookie_choice','accepted'); }catch(e){}
    cookieBar.classList.remove('show');
  });
  if(decline) decline.addEventListener('click', ()=>{
    try{ localStorage.setItem('midiva_cookie_choice','declined'); }catch(e){}
    cookieBar.classList.remove('show');
  });
}

/* ---------- contact / enquiry form ---------- */
const enquiryForm = $('#enquiryForm');
if(enquiryForm){
  enquiryForm.addEventListener('submit', e=>{
    e.preventDefault();
    let ok = true;
    $$('[required]', enquiryForm).forEach(f=>{
      if(!f.value.trim()){ ok=false; f.style.borderBottomColor = '#B0442E'; }
      else { f.style.borderBottomColor = ''; }
    });
    if(!ok) return;
    const btn = $('button[type="submit"] span:last-child', enquiryForm);
    if(btn) btn.textContent = 'Enquiry Sent';
    enquiryForm.querySelectorAll('input,textarea').forEach(f=>f.disabled=true);
  });
}

/* ---------- mobile menu ---------- */
const menuBtn = $('#menuBtn');
const mobileMenu = $('#mobileMenu');
function closeMobileMenu(){
  if(!menuBtn || !mobileMenu) return;
  menuBtn.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}
if(menuBtn && mobileMenu){
  menuBtn.addEventListener('click', ()=>{
    const isOpen = mobileMenu.classList.toggle('open');
    menuBtn.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  $$('a', mobileMenu).forEach(a=>{
    a.addEventListener('click', closeMobileMenu);
  });
}

/* ---------- nav wipe transition (in-page anchors) ---------- */
const wipe = $('#navWipe');
$$('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const target = $(a.getAttribute('href'));
    if(!target) return;
    e.preventDefault();
    if(reduceMotion || !wipe){
      gsap.to(window, {duration:.6, scrollTo:{y:target, offsetY:0}, ease:'power2.inOut'});
      return;
    }
    gsap.timeline()
      .to(wipe, {scaleY:1, duration:.5, ease:'power4.inOut', transformOrigin:'bottom'})
      .call(()=>{ gsap.to(window, {duration:0, scrollTo:{y:target, offsetY:0}}); ScrollTrigger.refresh(); })
      .to(wipe, {scaleY:0, duration:.6, ease:'power4.inOut', transformOrigin:'top', delay:.05});
  });
});

/* cross-page navigation wipe */
if(wipe && !reduceMotion){
  $$('a[href]').forEach(a=>{
    const href = a.getAttribute('href');
    if(!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || a.target === '_blank') return;
    a.addEventListener('click', e=>{
      e.preventDefault();
      gsap.to(wipe, {scaleY:1, duration:.45, ease:'power4.inOut', transformOrigin:'bottom', onComplete:()=>{ window.location.href = href; }});
    });
  });
}

/* ---------- parallax ---------- */
if(!reduceMotion){
  if($('#heroOrb') && $('.hero')){
    gsap.to('#heroOrb', {
      y:120, ease:'none',
      scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:.6}
    });
  }
  if($('.case-img img') && $('.case-spot')){
    gsap.fromTo('.case-img img', {yPercent:-8}, {
      yPercent:8, ease:'none',
      scrollTrigger:{trigger:'.case-spot', start:'top bottom', end:'bottom top', scrub:.6}
    });
  }
  $$('.parallax-img').forEach(img=>{
    gsap.fromTo(img, {yPercent:-6}, {
      yPercent:6, ease:'none',
      scrollTrigger:{trigger:img, start:'top bottom', end:'bottom top', scrub:.6}
    });
  });
}

/* ---------- number count-up ---------- */
$$('.stat-row .n').forEach(el=>{
  const raw = el.textContent.trim();
  const num = parseInt(raw.replace(/\D/g,''),10);
  if(isNaN(num)) return;
  const suffix = raw.replace(/[0-9]/g,'');
  const counter = {v:0};
  ScrollTrigger.create({
    trigger: el, start:'top 90%', once:true,
    onEnter:()=>{
      gsap.to(counter, {v:num, duration:1.4, ease:'power2.out', onUpdate:()=>{
        el.textContent = Math.floor(counter.v) + suffix;
      }});
    }
  });
});
