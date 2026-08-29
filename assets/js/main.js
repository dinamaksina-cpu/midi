
(function(){
  const q=(s,c=document)=>c.querySelector(s), qa=(s,c=document)=>Array.from(c.querySelectorAll(s));
  const progress=document.createElement('div');progress.id='pageProgress';document.body.appendChild(progress);
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const setVH=()=>document.documentElement.style.setProperty('--vh',(window.innerHeight*.01)+'px'); setVH(); window.addEventListener('resize',setVH,{passive:true});

  const menu=q('.mobile-menu'), menuBtn=q('.menu-btn'), menuClose=q('.menu-close');
  function setMenu(open){ if(!menu) return; menu.classList.toggle('open',open); document.body.style.overflow=open?'hidden':''; menuBtn?.setAttribute('aria-expanded',String(open)); }
  menuBtn?.addEventListener('click',()=>setMenu(true)); menuClose?.addEventListener('click',()=>setMenu(false)); qa('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));

  const cursor=q('#cursor');
  if(cursor && !reduce && matchMedia('(hover:hover)').matches){
    window.addEventListener('mousemove',e=>gsap.to(cursor,{x:e.clientX,y:e.clientY,duration:.45,ease:'power3.out'}));
    qa('a,button,[data-tilt]').forEach(el=>{el.addEventListener('mouseenter',()=>cursor.classList.add('grow'));el.addEventListener('mouseleave',()=>cursor.classList.remove('grow'));});
  }

  if(!reduce){ qa('.mag-btn').forEach(btn=>{btn.addEventListener('mousemove',e=>{const r=btn.getBoundingClientRect();gsap.to(btn,{x:(e.clientX-r.left-r.width/2)*.22,y:(e.clientY-r.top-r.height/2)*.35,duration:.35,ease:'power3.out'});});btn.addEventListener('mouseleave',()=>gsap.to(btn,{x:0,y:0,duration:.5,ease:'elastic.out(1,.4)'}));}); }

  function revealPage(){
    const pre=q('#preloader');
    if(!pre){document.body.classList.add('is-ready');return initAnimations();}
    const alreadySeen=sessionStorage.getItem('midiva_preloaded')==='1';
    const finish=()=>{pre.style.display='none';document.body.style.overflow='';sessionStorage.setItem('midiva_preloaded','1');document.body.classList.add('is-ready');initAnimations();};
    if(alreadySeen || reduce){finish();return;}
    document.body.style.overflow='hidden';
    const counter={v:0}; const tl=gsap.timeline({onComplete:finish});
    if(q('.pl-logo')) tl.to('.pl-logo',{opacity:1,y:0,duration:.45,ease:'power3.out'});
    if(q('#plCount')) tl.to(counter,{v:100,duration:.85,ease:'power2.inOut',onUpdate:()=>q('#plCount').textContent=String(Math.floor(counter.v)).padStart(2,'0')},'<');
    if(q('#plBar')) tl.to('#plBar',{width:'100%',duration:.85,ease:'power2.inOut'},'<').to(pre,{yPercent:-100,duration:.7,ease:'power4.inOut'},'+=.05');
    else tl.to(pre,{yPercent:-100,duration:.7,ease:'power4.inOut'});
    setTimeout(()=>{if(pre.style.display!=='none') finish();},3500);
  }
  window.addEventListener('load',revealPage,{once:true});

  function initAnimations(){
    if(typeof gsap==='undefined') return;
    if(window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    if(q('.hero h1 .line span') && !reduce){
      if(innerWidth>760){
        gsap.set('.hero h1 .line span',{y:'0%',x:-18,opacity:1,clipPath:'inset(0 100% 0 0)',filter:'blur(8px)'});
        gsap.to('.hero h1 .line span',{x:0,clipPath:'inset(0 0% 0 0)',filter:'blur(0px)',duration:.72,stagger:.2,ease:'power4.out',onStart:()=>q('#heroTitle')?.classList.add('hero-title-live')});
      }else{
        gsap.set('.hero h1 .line span',{y:'0%',x:-12,opacity:1,clipPath:'inset(0 100% 0 0)',filter:'blur(6px)'});
        gsap.to('.hero h1 .line span',{x:0,clipPath:'inset(0 0% 0 0)',filter:'blur(0px)',duration:.62,stagger:.16,ease:'power4.out',onStart:()=>q('#heroTitle')?.classList.add('hero-title-live')});
        if(q('.hero-disc-stage')) gsap.fromTo('.hero-disc-stage',{opacity:0,scale:.84},{opacity:1,scale:1,duration:1,delay:.42,ease:'power3.out'});
      }
      gsap.fromTo('.hero-top, .hero-copy, .hero-cta-group, .scroll-cue',{opacity:0,y:16},{opacity:1,y:0,duration:.9,stagger:.1,delay:.2,ease:'power3.out'});
    }
    if(q('#heroOrb') && !reduce){gsap.to('#heroOrb',{rotation:360,duration:36,repeat:-1,ease:'none',transformOrigin:'50% 50%'});}
    if(q('#heroOrbit') && !reduce){gsap.to('#heroOrbit',{rotation:360,duration:48,repeat:-1,ease:'none',transformOrigin:'50% 50%'});}
    const marquee=q('#marquee'); if(marquee && !reduce) gsap.to(marquee,{xPercent:-50,duration:26,repeat:-1,ease:'linear'});
    qa('.reveal-up').forEach(el=>{const inner=q('.inner',el);if(!inner)return;if(reduce){inner.style.transform='none';inner.style.opacity='1';return;}gsap.set(inner,{yPercent:100,opacity:0});gsap.to(inner,{yPercent:0,opacity:1,duration:1.05,ease:'power4.out',scrollTrigger:{trigger:el,start:'top 88%'}});});
    if(!reduce){
      qa('.case-meta > div, .case-copy-grid, .live-preview, .page-actions, .work-feature, .home-project, .service-block, .values-grid > div').forEach((el,i)=>{
        gsap.fromTo(el,{opacity:0,y:34},{opacity:1,y:0,duration:.9,ease:'power3.out',delay:Math.min(i*.015,.08),scrollTrigger:{trigger:el,start:'top 90%',once:true}});
      });
      qa('.live-preview').forEach(el=>{
        gsap.fromTo(el,{clipPath:'inset(8% 5% 8% 5%)',scale:.985},{clipPath:'inset(0% 0% 0% 0%)',scale:1,duration:1.1,ease:'power4.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}});
      });
    }
    if(!reduce){
      qa('.page-hero .eyebrow, .page-hero .lede, .case-sub, .breadcrumbs, .case-back').forEach((el,i)=>{
        gsap.fromTo(el,{opacity:0,y:18},{opacity:1,y:0,duration:.8,delay:.12+i*.045,ease:'power3.out'});
      });
      qa('.work-browser-visual img').forEach(img=>{
        gsap.fromTo(img,{yPercent:-2},{yPercent:2,ease:'none',scrollTrigger:{trigger:img.closest('.work-feature'),start:'top bottom',end:'bottom top',scrub:1}});
      });
      qa('.case-copy-grid h2, .work-copy h2, .service-block h2').forEach(el=>{
        gsap.fromTo(el,{opacity:.35,x:-18},{opacity:1,x:0,duration:.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}});
      });
    }
    initHorizontal();
    initMotionEnhancements();
    if(!reduce){qa('[data-tilt]').forEach(card=>{const img=q('img',card);if(!img)return;card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;gsap.to(img,{x:px*14,y:py*14,duration:.5,ease:'power3.out'});});card.addEventListener('mouseleave',()=>gsap.to(img,{x:0,y:0,duration:.7,ease:'power3.out'}));});}
  }


  let motionEnhancementsReady=false;
  function initMotionEnhancements(){
    if(motionEnhancementsReady || reduce || typeof gsap==='undefined' || !window.ScrollTrigger) return;
    motionEnhancementsReady=true;

    // 1 + 9: cascade cards, services, process, tags, forms and footer.
    const cascadeGroups=[
      '.home-project', '.serv-row', '.proc-item', '.why-cell', '.stat-row',
      '.stack-words > div', '.field', '.page-actions > *', '.foot-col', '.foot-brand',
      '.foot-bottom', '.work-feature', '.service-block', '.values-grid > div'
    ];
    cascadeGroups.forEach(sel=>{
      qa(sel).forEach((el,i)=>{
        el.classList.add('motion-ready');
        el.dataset.motionDelay=String((i%5)+1);
        ScrollTrigger.create({
          trigger:el,start:'top 92%',once:true,
          onEnter:()=>el.classList.add('motion-in')
        });
      });
    });

    // 2: restrained image parallax. Never runs on touch/mobile.
    if(innerWidth>760 && matchMedia('(hover:hover)').matches){
      qa('.home-project .desktop-shot, .home-project .portfolio-art, .work-browser-visual img, .case-study img').forEach(img=>{
        gsap.fromTo(img,{yPercent:-2.4},{yPercent:2.4,ease:'none',scrollTrigger:{trigger:img.closest('.home-project,.work-feature,.case-study')||img,start:'top bottom',end:'bottom top',scrub:.8}});
      });
    }

    // 3: active sections get a subtle gold transition line.
    qa('main section, body>section, .home-work-section, .home-final-cta').forEach(sec=>{
      sec.classList.add('motion-section');
      ScrollTrigger.create({trigger:sec,start:'top 62%',end:'bottom 38%',toggleClass:{targets:sec,className:'motion-active'}});
    });

    // 4: cursor-reactive surfaces use local CSS coordinates.
    if(matchMedia('(hover:hover)').matches){
      qa('.home-project-visual,.why-cell,.serv-row,.proc-item,.work-feature,.service-block').forEach(el=>{
        el.classList.add('cursor-reactive');
        el.addEventListener('pointermove',e=>{
          const r=el.getBoundingClientRect();
          el.style.setProperty('--rx',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
          el.style.setProperty('--ry',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
        });
      });
    }

    // 5: extend magnetic behaviour to CTA/link controls without changing their layout.
    if(matchMedia('(hover:hover)').matches){
      qa('.nav-cta,.hero-secondary').forEach(el=>{
        el.addEventListener('pointermove',e=>{
          const r=el.getBoundingClientRect();
          gsap.to(el,{x:(e.clientX-r.left-r.width/2)*.10,y:(e.clientY-r.top-r.height/2)*.16,duration:.32,ease:'power3.out',overwrite:true});
        });
        el.addEventListener('pointerleave',()=>gsap.to(el,{x:0,y:0,duration:.55,ease:'elastic.out(1,.45)',overwrite:true}));
      });
    }

    // 7: homepage section-aware nav + route-aware nav on internal pages.
    const navMap=[
      {sel:'#workPin,#work',href:'/work/'},
      {sel:'#services',href:'/services/'},
      {sel:'#studio',href:'/about/'},
      {sel:'#process',href:'/about/'}
    ];
    const navLinks=qa('.nav-links a');
    const setActive=href=>navLinks.forEach(a=>a.classList.toggle('motion-nav-active',a.getAttribute('href')===href));
    const path=location.pathname.replace(/\/+/g,'/');
    if(path!=='/' && path!=='/index.html'){
      const route=['/work/','/services/','/about/','/contact/'].find(h=>path.startsWith(h));
      if(route)setActive(route);
    }else{
      navMap.forEach(item=>qa(item.sel).forEach(sec=>ScrollTrigger.create({trigger:sec,start:'top 45%',end:'bottom 45%',onEnter:()=>setActive(item.href),onEnterBack:()=>setActive(item.href)})));
      ScrollTrigger.create({trigger:'.hero',start:'top top',end:'bottom 45%',onEnter:()=>setActive(''),onEnterBack:()=>setActive('')});
    }

    // 6 + 9: small ambient movement and a premium footer reveal.
    qa('footer .foot-col,footer .foot-brand').forEach((el,i)=>{
      gsap.fromTo(el,{y:24,opacity:0},{y:0,opacity:1,duration:.85,delay:i*.06,ease:'power3.out',scrollTrigger:{trigger:'footer',start:'top 88%',once:true}});
    });

    ScrollTrigger.refresh();
  }

  let workTrigger;
  function initHorizontal(){
    const track=q('#workTrack'), pin=q('#workPin'); if(!track||!pin||reduce||!window.ScrollTrigger) return;
    const progress=q('#workProgressBar');
    if(workTrigger){workTrigger.kill();workTrigger=null;gsap.set(track,{clearProps:'transform'});} if(innerWidth<=760){if(progress)gsap.set(progress,{scaleX:0});return;}
    const distance=Math.max(0,track.scrollWidth-innerWidth+100); if(!distance) return;
    const stops=Math.max(1,qa('.home-project',track).length-1);
    const tween=gsap.to(track,{x:-distance,ease:'none',scrollTrigger:{trigger:pin,start:'top top',end:()=>'+='+(distance+innerHeight*.35),scrub:1,pin:true,invalidateOnRefresh:true,snap:{snapTo:1/stops,duration:{min:.18,max:.55},delay:.08,ease:'power2.inOut'},onUpdate:self=>{
      if(progress)gsap.set(progress,{scaleX:self.progress});
      const head=q('.home-work-head',pin);
      if(head){
        const p=self.progress;
        const enter=Math.min(1,p/.06);
        const exit=p<.18?1:Math.max(0,1-(p-.18)/.16);
        const alpha=Math.min(enter,exit);
        gsap.set(head,{opacity:alpha,y:(1-alpha)*22});
        pin.classList.toggle('work-heading-live',alpha>.15);
      }
    }}}); workTrigger=tween.scrollTrigger;
  }
  let rt; window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{initHorizontal();window.ScrollTrigger?.refresh();},250);});

  qa('[data-serv]').forEach(row=>{row.setAttribute('tabindex','0');row.setAttribute('role','button');const toggle=()=>{const was=row.classList.contains('open');qa('[data-serv]').forEach(r=>r.classList.remove('open'));if(!was)row.classList.add('open');};row.addEventListener('click',toggle);row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});});

  const cookie=q('#cookieBar'); if(cookie){const choice=localStorage.getItem('midiva_cookie_choice');if(!choice)setTimeout(()=>cookie.classList.add('show'),1000);q('#cookieAccept')?.addEventListener('click',()=>{localStorage.setItem('midiva_cookie_choice','accepted');cookie.classList.remove('show');});q('#cookieDecline')?.addEventListener('click',()=>{localStorage.setItem('midiva_cookie_choice','declined');cookie.classList.remove('show');});}

  qa('[data-history-back]').forEach(btn=>btn.addEventListener('click',e=>{
    e.preventDefault();
    const fallback=btn.getAttribute('href')||'/work/';
    if(history.length>1) history.back(); else location.href=fallback;
  }));

  const updateProgress=()=>{
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    const ratio=Math.max(0,Math.min(1,scrollY/max));
    progress.style.transform='scaleX('+ratio+')';
  };
  updateProgress();window.addEventListener('scroll',updateProgress,{passive:true});window.addEventListener('resize',updateProgress,{passive:true});

  qa('a[data-transition]').forEach(a=>a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||a.target==='_blank'||reduce)return;const href=a.getAttribute('href');if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('http'))return;const wipe=q('#navWipe');if(!wipe)return;e.preventDefault();gsap.timeline({onComplete:()=>location.href=href}).set(wipe,{transformOrigin:'bottom'}).to(wipe,{scaleY:1,duration:.45,ease:'power4.inOut'});}));
})();
