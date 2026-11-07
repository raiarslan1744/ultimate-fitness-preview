(function () {
  const selectors = '.header .brand,.header nav a,.header-cta,.hero video,.hero .eyebrow,.hero h1,.hero-content p,.hero-actions a,.hero-bottom,.ticker,.intro .number,.intro h2,.intro-copy p,.intro .underlink,.section-heading .number,.section-heading h2,.section-heading p,.card,.note,.space-image,.space-copy .number,.space-copy h2,.space-copy p,.space-copy .underlink,.final .number,.final h2,.final p,.final-actions a,footer > *';
  const targets = Array.from(document.querySelectorAll(selectors));
  const colors=['#a8d8ff','#d6a7ff','#c7f332','#ffac85','#f9a6ca','#7ee4cb','#ffe784','#93acff'];
  const names=['LAYOUT','TYPE','DESIGN','MEDIA','STYLE','DETAIL','FORM','BUILD'];
  const replay=document.createElement('button'); replay.className='replay-build'; replay.textContent='↻ REPLAY BUILD'; document.body.appendChild(replay);
  let active=false;
  function start(){
    if(active)return; active=true; window.scrollTo(0,0);
    targets.forEach(el=>{el.classList.remove('swarm-built');el.classList.add('swarm-pending')});
    const layer=document.createElement('div');layer.className='editor-layer';layer.setAttribute('aria-hidden','true');document.body.appendChild(layer);
    const controls=document.createElement('div');controls.className='swarm-controls';controls.innerHTML='<span>✳ BUILDING THE EXPERIENCE</span><button type="button">SKIP BUILD ↗</button>';document.body.appendChild(controls);
    const cursors=colors.map((color,i)=>{const el=document.createElement('div');el.className='editor-cursor';el.style.setProperty('--color',color);el.innerHTML='<svg viewBox="0 0 20 24"><path d="M2 1v17l5-4 3 8 4-2-3-7h7z"/></svg><span>'+names[i]+'</span>';layer.appendChild(el);return el});
    let timers=[], frame, stopped=false, counter=0;
    const later=(fn,ms)=>{const id=setTimeout(()=>{if(!stopped)fn()},ms);timers.push(id)};
    function build(el){
      if(!el.classList.contains('swarm-pending'))return;
      el.classList.remove('swarm-pending');el.classList.add('swarm-building');
      const rect=el.getBoundingClientRect(); if(rect.width<1||rect.height<1){el.classList.remove('swarm-building');return}
      const i=counter++%cursors.length,cursor=cursors[i],box=document.createElement('div');box.className='editor-selection';box.style.setProperty('--color',colors[i]);
      box.style.cssText+=`;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px`;
      box.innerHTML='<i></i><i></i><i></i><i></i><small>'+Math.round(rect.width)+' × '+Math.round(rect.height)+'</small>';layer.appendChild(box);
      cursor.style.transform=`translate(${Math.max(0,rect.left)}px,${Math.max(0,rect.top)}px)`;
      later(()=>{box.classList.add('drawing');cursor.style.transform=`translate(${Math.min(innerWidth-25,rect.right)}px,${Math.min(innerHeight-25,rect.bottom)}px)`},300);
      later(()=>{el.classList.remove('swarm-building');el.classList.add('swarm-writing');box.classList.add('typing')},900);
      later(()=>{el.classList.remove('swarm-writing');box.remove()},2300);
    }
    const observer=new IntersectionObserver(entries=>{entries.filter(e=>e.isIntersecting).forEach((entry,i)=>{observer.unobserve(entry.target);later(()=>build(entry.target),i*160)})},{threshold:.08}); targets.forEach(el=>observer.observe(el));
    function finish(){if(stopped)return;stopped=true;active=false;cancelAnimationFrame(frame);observer.disconnect();timers.forEach(clearTimeout);targets.forEach(el=>el.classList.remove('swarm-pending','swarm-building','swarm-writing'));layer.remove();controls.remove();document.removeEventListener('keydown',onKey)}
    const onKey=e=>{if(e.key==='Escape')finish()};document.addEventListener('keydown',onKey);controls.querySelector('button').onclick=finish;
    const begin=performance.now(),duration=16000;
    function tour(now){if(stopped)return;const progress=Math.min(1,(now-begin)/duration);const max=document.documentElement.scrollHeight-innerHeight;window.scrollTo(0,max*Math.max(0,(progress-.08)/.92));if(progress<1)frame=requestAnimationFrame(tour);else later(finish,2500)}
    frame=requestAnimationFrame(tour);
  }
  replay.addEventListener('click',start); start();
})();

