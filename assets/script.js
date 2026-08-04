
const btn=document.querySelector('.menu-btn');
const links=document.querySelector('.nav-links');
if(btn){btn.addEventListener('click',()=>links.classList.toggle('open'))}
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')})
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

const pg=document.createElement("div");pg.className="progress-line";document.body.appendChild(pg);window.addEventListener("scroll",()=>{const h=document.documentElement.scrollHeight-window.innerHeight;pg.style.width=(h?window.scrollY/h*100:0)+"%";document.querySelector(".nav")?.classList.toggle("scrolled",window.scrollY>24)});document.querySelectorAll("[data-lang-switch]").forEach(b=>b.onclick=()=>{document.body.classList.toggle("zh",b.dataset.langSwitch==="zh");document.querySelectorAll("[data-lang-switch]").forEach(x=>x.classList.toggle("active",x===b));localStorage.setItem("ccwu-lang",b.dataset.langSwitch)});if(localStorage.getItem("ccwu-lang")==="zh"){document.body.classList.add("zh");document.querySelector('[data-lang-switch="zh"]')?.classList.add("active");document.querySelector('[data-lang-switch="en"]')?.classList.remove("active");}

// V3 cursor light
const glow=document.createElement('div'); glow.className='cursor-glow'; document.body.appendChild(glow);
window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});

// Animated counters
const countObs=new IntersectionObserver(entries=>{
 entries.forEach(entry=>{
  if(!entry.isIntersecting || entry.target.dataset.done) return;
  entry.target.dataset.done='1';
  const target=Number(entry.target.dataset.count||0), suffix=entry.target.dataset.suffix||'';
  let start=0; const duration=1200, t0=performance.now();
  function tick(t){const p=Math.min(1,(t-t0)/duration); const eased=1-Math.pow(1-p,3);
    entry.target.textContent=Math.round(start+(target-start)*eased)+suffix;
    if(p<1)requestAnimationFrame(tick)}
  requestAnimationFrame(tick);
 })
},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>countObs.observe(el));

// Lightweight particle field
const canvas=document.querySelector('#particle-field');
if(canvas){
 const ctx=canvas.getContext('2d'); let w,h,dpr,pts=[];
 function resize(){dpr=Math.min(devicePixelRatio||1,2);w=canvas.clientWidth;h=canvas.clientHeight;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  pts=Array.from({length:Math.min(85,Math.floor(w/14))},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,r:Math.random()*1.5+.3}))}
 function draw(){ctx.clearRect(0,0,w,h);for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;
  ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(120,210,255,.55)';ctx.fill()}
  for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.hypot(dx,dy);if(d<105){ctx.strokeStyle=`rgba(80,150,255,${(1-d/105)*.13})`;ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke()}}
  requestAnimationFrame(draw)}
 addEventListener('resize',resize);resize();draw();
}

// Magnetic buttons
document.querySelectorAll('.magnetic').forEach(el=>{
 el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.08}px,${(e.clientY-r.top-r.height/2)*.08}px)`});
 el.addEventListener('pointerleave',()=>el.style.transform='');
});

// FINAL: active navigation state
const currentPage=(location.pathname.split('/').pop()||'index.html').toLowerCase();
document.querySelectorAll('.nav-links a').forEach(a=>{
  const href=(a.getAttribute('href')||'').toLowerCase();
  if(href===currentPage)a.setAttribute('aria-current','page');
});

// FINAL: subtle case parallax
document.querySelectorAll('.immersive-case').forEach(card=>{
  card.addEventListener('pointermove',e=>{
    const r=card.getBoundingClientRect();
    card.style.setProperty('--x',((e.clientX-r.left)/r.width*100)+'%');
    card.style.setProperty('--y',((e.clientY-r.top)/r.height*100)+'%');
  });
});

// FINAL: preserve language on links
document.querySelectorAll('a[href$=".html"]').forEach(a=>{
  a.addEventListener('click',()=>localStorage.setItem('ccwu-lang',document.body.classList.contains('zh')?'zh':'en'));
});
