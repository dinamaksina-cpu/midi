
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
    initMotionSystem();
    initHorizontal();
    if(!reduce){qa('[data-tilt]').forEach(card=>{const img=q('img',card);if(!img)return;card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;gsap.to(img,{x:px*14,y:py*14,duration:.5,ease:'power3.out'});});card.addEventListener('mouseleave',()=>gsap.to(img,{x:0,y:0,duration:.7,ease:'power3.out'}));});}
  }

  function initMotionSystem(){
    document.body.classList.add('motion-enhanced');
    const surfaces=[...qa('section'),q('footer')].filter(Boolean);
    surfaces.forEach(surface=>{
      surface.classList.add('motion-section');
      if(!Array.from(surface.children).some(el=>el.classList.contains('motion-glow'))){
        const glow=document.createElement('span'), divider=document.createElement('span');
        glow.className='motion-glow';divider.className='motion-divider';glow.setAttribute('aria-hidden','true');divider.setAttribute('aria-hidden','true');
        surface.prepend(divider);surface.prepend(glow);
      }
    });

    const reactTargets=qa('.service-block, .proc-item, .why-cell, .values-grid > div, .work-copy, .contact-form .field');
    reactTargets.forEach(el=>{
      el.classList.add('motion-react');
      if(!Array.from(el.children).some(child=>child.classList.contains('motion-sheen'))){
        const sheen=document.createElement('span');sheen.className='motion-sheen';sheen.setAttribute('aria-hidden','true');el.prepend(sheen);
      }
    });

    if(reduce || !window.ScrollTrigger){surfaces.forEach(el=>el.classList.add('is-active'));return;}

    surfaces.forEach(surface=>{
      ScrollTrigger.create({trigger:surface,start:'top 68%',end:'bottom 32%',onEnter:()=>surface.classList.add('is-active'),onEnterBack:()=>surface.classList.add('is-active'),onLeave:()=>surface.classList.remove('is-active'),onLeaveBack:()=>surface.classList.remove('is-active')});
    });

    const cascades=[
      ['.process-list','.proc-item'],['.why-grid','.why-cell'],['.values-grid','div'],
      ['.service-tags','span'],['.check-options','label'],['.contact-form','.field'],['.foot-cols','.foot-col']
    ];
    cascades.forEach(([groupSelector,itemSelector])=>qa(groupSelector).forEach(group=>{
      const items=qa(itemSelector,group);if(!items.length)return;
      gsap.fromTo(items,{opacity:0,y:28},{opacity:1,y:0,duration:.82,stagger:.075,ease:'power3.out',scrollTrigger:{trigger:group,start:'top 88%',once:true}});
    }));

    qa('.head-row .head-note, .about-columns > *, .contact-side, .form-submit').forEach((el,i)=>{
      gsap.fromTo(el,{opacity:0,x:i%2?18:-18},{opacity:1,x:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}});
    });

    const parallaxTargets=[...new Set(qa('.work-list .work-visual, .portfolio-image-visual, .live-preview, .project-browser-card, .case-media, .case-visual'))];
    parallaxTargets.forEach(el=>{
      el.classList.add('motion-image-shell');
      gsap.fromTo(el,{yPercent:-2.4},{yPercent:2.4,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:1.15}});
    });

    const finePointer=matchMedia('(hover:hover) and (pointer:fine)').matches;
    if(finePointer){
      surfaces.forEach(surface=>surface.addEventListener('mousemove',e=>{
        const r=surface.getBoundingClientRect();
        surface.style.setProperty('--motion-x',(((e.clientX-r.left)/r.width)*100).toFixed(1)+'%');
        surface.style.setProperty('--motion-y',(((e.clientY-r.top)/r.height)*100).toFixed(1)+'%');
      },{passive:true}));
      reactTargets.forEach(el=>{
        el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--pointer-x',(((e.clientX-r.left)/r.width)*100).toFixed(1)+'%');el.style.setProperty('--pointer-y',(((e.clientY-r.top)/r.height)*100).toFixed(1)+'%');},{passive:true});
        el.addEventListener('mouseenter',()=>cursor?.classList.add('grow'));el.addEventListener('mouseleave',()=>cursor?.classList.remove('grow'));
      });
    }

    const navLinks=qa('.nav-links a');
    const setSectionNav=href=>navLinks.forEach(link=>link.classList.toggle('section-active',Boolean(href)&&link.getAttribute('href')===href));
    const sectionNavMap=[['#workPin','/work/'],['#services','/services/'],['#studio','/about/'],['#process','/about/']];
    sectionNavMap.forEach(([selector,href])=>{const section=q(selector);if(!section)return;ScrollTrigger.create({trigger:section,start:'top 52%',end:'bottom 48%',onEnter:()=>setSectionNav(href),onEnterBack:()=>setSectionNav(href)});});
    const hero=q('.hero');if(hero)ScrollTrigger.create({trigger:hero,start:'top top',end:'bottom 52%',onEnter:()=>setSectionNav(null),onEnterBack:()=>setSectionNav(null)});
  }

  let workTrigger;
  function initHorizontal(){
    const track=q('#workTrack'), pin=q('#workPin'); if(!track||!pin||reduce||!window.ScrollTrigger) return;
    const progress=q('#workProgressBar');
    if(workTrigger){workTrigger.kill();workTrigger=null;gsap.set(track,{clearProps:'transform'});} if(innerWidth<=760){if(progress)gsap.set(progress,{scaleX:0});return;}
    const distance=Math.max(0,track.scrollWidth-innerWidth+100); if(!distance) return;
    const stops=Math.max(1,qa('.home-project',track).length-1);
    const tween=gsap.to(track,{x:-distance,ease:'none',scrollTrigger:{trigger:pin,start:'top top',end:()=>'+='+(distance+innerHeight*.35),scrub:1,pin:true,invalidateOnRefresh:true,snap:{snapTo:1/stops,duration:{min:.18,max:.55},delay:.08,ease:'power2.inOut'},onUpdate:self=>{if(progress)gsap.set(progress,{scaleX:self.progress});}}}); workTrigger=tween.scrollTrigger;
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

  qa('a[data-transition]').forEach(a=>a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||a.target==='_blank'||reduce)return;const href=a.getAttribute('href');if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('http'))return;const wipe=q('#navWipe');if(!wipe)return;e.preventDefault();document.body.classList.add('is-leaving');gsap.timeline({onComplete:()=>location.href=href}).set(wipe,{transformOrigin:'bottom'}).to(wipe,{scaleY:1,duration:.55,ease:'power4.inOut'});}));
})();
