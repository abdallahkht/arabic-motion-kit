const catalog=await fetch('catalog.json?v=2').then(response=>response.json());
const dialog=document.querySelector('#demo'),player=document.querySelector('#demo-video');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const copy=document.querySelector('#copy'),pause=document.querySelector('#pause');
let active;
const observer=new IntersectionObserver(entries=>{
  for(const {target, isIntersecting} of entries){
    if(isIntersecting && !dialog.open && !reduced)target.play().catch(()=>{});
    else target.pause();
  }
});
function openClip(item){
  active=item;
  document.querySelectorAll('.card video').forEach(v=>v.pause());
  document.querySelector('#demo-title').textContent=item.name;
  document.querySelector('#demo-prompt').textContent=item.prompt||item.description;
  document.querySelector('#copy-status').textContent='';
  copy.hidden=!item.prompt;
  player.src='media/'+item.id+'.mp4?v=2';
  if(!dialog.open)dialog.showModal();
  player.play().catch(()=>{});pause.textContent='Pause';
}
for(const item of catalog){
  const card=document.createElement('article');card.className='card';
  const button=document.createElement('button');button.className='video-button';button.setAttribute('aria-label','Play '+item.name);
  const v=document.createElement('video');v.src='media/'+item.id+'.mp4?v=2';v.poster='media/'+item.id+'.jpg?v=2';v.muted=true;v.loop=true;v.playsInline=true;v.preload='metadata';
  const heading=document.createElement('h3');heading.textContent=item.name;
  const subtitle=document.createElement('p');subtitle.dir='auto';subtitle.textContent=item.subtitle;
  button.append(v);button.onclick=()=>openClip(item);card.append(button,heading,subtitle);
  document.querySelector(item.kind==='creator'?'#creator-card':'#grid').append(card);observer.observe(v);
}
document.querySelector('#close').onclick=()=>dialog.close();
dialog.onclose=()=>{player.pause();if(!reduced)document.querySelectorAll('.card video').forEach(v=>{const r=v.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)v.play().catch(()=>{});});};
pause.onclick=()=>{if(player.paused){player.play().catch(()=>{});pause.textContent='Pause';}else{player.pause();pause.textContent='Play';}};
copy.onclick=async()=>{try{await navigator.clipboard.writeText(active.prompt);document.querySelector('#copy-status').textContent='Copied';}catch{document.querySelector('#copy-status').textContent='Select the prompt above to copy it.';}};
const requested=catalog.find(item=>item.id===new URLSearchParams(location.search).get('clip'));
if(requested)openClip(requested);
