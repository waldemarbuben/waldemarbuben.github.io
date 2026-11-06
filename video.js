{
(function(){   
  var YT='?autoplay=1&enablejsapi=1&rel=0&playsinline=1';   
  var CH=[   
    {id:'video-0', t:'Доксы и парадоксы времени. Лекция 7. Время неоплатоников - I. Плотин: жизнь Души', s:'Александр Дугин', yt:'https://www.youtube.com/embed/803SDpQzP90?si=xIXLYjrlx3c9PAFP'},   
    {id:'video-1', t:'Мое прение', s:'', yt:'https://www.youtube.com/embed/joKnt76mjsY'},     
    {id:'video-2', t:'Госпожа Тартола Валенсия', s:'', f:'IMG_0005.MP4'},     
    {id:'video-3', t:'Холодный Воздух', s:'Константин Ступин', f:'kstupa.mp4'},     
    {id:'video-4', t:'Прогулка', s:'', f:'eburg.MP4'},     
    {id:'video-5', t:'Волчьи Ягоды', s:'', f:'les.mp4'},     
    {id:'video-6', t:'Свою Возлюбленную стоит искать либо в сказке, либо во сне', s:'', yt:'https://www.youtube.com/embed/NvRgJGFErHE'},     
    {id:'video-7', t:'Камень', s:'Евгений Головин', f:'golovakamen.mp4'}, 
    {id:'video-8', t:'Nur nicht aus Liebe weinen', s:'Zarah Leander', f:'balabanov.MP4'},
    {id:'video-9', t:'Пурпурная субстанция обмана', s:'Евгений Головин', yt:'https://www.youtube.com/embed/fJUC6o2jLqM?si=QzdSKgI9ki3UBARZ'},
    {id:'video-10', t:'Доксы и парадоксы времени. № 8. Время неоплатоников - II. Ямвлих/Симпликий. Танец мгновений', s:'Александр Дугин', yt:'https://www.youtube.com/embed/DodEgbA3QLI?si=92ClRZYuMSmv-yIj'},
    {id:'video-11', t:'Томные Монологи о Любви', s:'Вальдемар Бубен', yt:'https://www.youtube.com/embed/XqAL-DvcjJw?si=snpyvh32pV-w9WzY'},
    {id:'video-12', t:'Падшая Женщина - А.Штернберг', s:'Читает: Вальдемар Бубен', yt:'https://www.youtube.com/embed/D1FC9-ROMjg?si=KPxp_bOsrYOMryCn'},
  ];
        
  var $=function(i){return document.getElementById(i);};
  var set=$('tv-set'); if(!set) return;
  var scr=$('tv-screen'),vid=$('tv-video'),fr=$('tv-frame'),cv=$('tv-noise'),osd=$('tv-osd'),lcd=$('tv-lcd'),lcdS=$('tv-lcd-s'),
      npT=$('tv-np-t'),npS=$('tv-np-s'),seek=$('tv-seek'),tm=$('tv-time'),bPlay=$('tv-play'),bMute=$('tv-mute'),bFs=$('tv-fs'),bPow=$('tv-power'),
      kChan=$('knob-chan'),kVol=$('knob-vol'),keys=[].slice.call(document.querySelectorAll('.tv-key')),minis=[].slice.call(document.querySelectorAll('.mini'));
  var on=false,ch=0,vol=.8,muted=false,paused=true,noiseT=null,osdT=null,ctx=null;

  
  function audio(){ try{ if(!ctx) ctx=new (window.AudioContext||window.webkitAudioContext)(); if(ctx.state==='suspended') ctx.resume(); }catch(e){ ctx=null; } return ctx; }
  function hiss(dur,gain){
    var a=audio(); if(!a) return;
    try{ var n=Math.floor(a.sampleRate*dur),b=a.createBuffer(1,n,a.sampleRate),d=b.getChannelData(0);
      for(var i=0;i<n;i++) d[i]=(Math.random()*2-1)*(1-i/n);
      var s=a.createBufferSource(),g=a.createGain(); s.buffer=b; g.gain.value=gain*vol; s.connect(g); g.connect(a.destination); s.start(); }catch(e){}
  }
  function click(){
    var a=audio(); if(!a) return;
    try{ var o=a.createOscillator(),g=a.createGain(); o.type='square'; o.frequency.value=140; g.gain.setValueAtTime(.12,a.currentTime); g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.07);
      o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime+.08); }catch(e){}
  }

 
  var cx=cv.getContext('2d'),img=cx.createImageData(cv.width,cv.height),raf=0;
  function frame(){
    var d=img.data; for(var i=0;i<d.length;i+=4){ var v=Math.random()*255|0; d[i]=d[i+1]=d[i+2]=v; d[i+3]=255; }
    cx.putImageData(img,0,0); raf=scr.classList.contains('noisy')?requestAnimationFrame(frame):0;
  }
  function noise(ms,after){
    scr.classList.add('noisy'); if(!raf) frame(); hiss(ms/1000,.22);
    clearTimeout(noiseT); noiseT=setTimeout(function(){ scr.classList.remove('noisy'); if(after) after(); },ms);
  }

  
  function two(n){ return (n<10?'0':'')+n; }
  function fmt(t){ if(!isFinite(t)) return '--:--'; t=Math.floor(t); return two(Math.floor(t/60))+':'+two(t%60); }
  function showOsd(){ osd.textContent='К-'+(ch+1); osd.classList.add('on'); clearTimeout(osdT); osdT=setTimeout(function(){ osd.classList.remove('on'); },2600); }
  function ytCmd(fn,args){ try{ fr.contentWindow.postMessage(JSON.stringify({event:'command',func:fn,args:args||[]}),'*'); }catch(e){} }
  function applyVol(){
    vid.volume=vol; vid.muted=muted||vol===0; if(CH[ch].yt) ytCmd(muted||vol===0?'mute':'unMute'),ytCmd('setVolume',[Math.round(vol*100)]);
    bMute.textContent=(muted||vol===0)?'🔇':'🔊'; kVol.style.transform='rotate('+(-135+vol*270)+'deg)'; kVol.setAttribute('aria-valuenow',Math.round(vol*100));
  }
  function updateInfo(){
    var c=CH[ch]; npT.textContent=on?c.t:'Телевизоръ выключенъ'; npS.textContent=on?(c.s||' '):' ';
    lcd.firstChild.nodeValue=on?'К-'+(ch+1):'-- --'; lcd.classList.toggle('dim',!on); lcdS.textContent=on?(c.yt?'ЭФИРЪ · YOUTUBE':'ЗАПИСЬ'):'ОЖИДАНІЕ';
    keys.forEach(function(k,i){ k.classList.toggle('on',on&&i===ch); k.setAttribute('aria-pressed',on&&i===ch?'true':'false'); });
    kChan.style.transform='rotate('+(-120+ch*40)+'deg)'; kChan.setAttribute('aria-valuenow',ch+1);
    set.classList.toggle('tv-on',on); set.classList.toggle('tv-playing',on&&!paused);
    bPow.textContent=on?'Выключить':'Включить';
    [bPlay,seek,bMute,bFs].forEach(function(b){ b.disabled=!on; });
    seek.disabled=!on||!!c.yt; bPlay.textContent=paused?'▶':'❚❚';
  }
  function stopMedia(){
    vid.pause(); vid.removeAttribute('src'); vid.load();
    fr.removeAttribute('src'); scr.classList.remove('show-video','show-frame');
    seek.value=0; seek.style.setProperty('--p','0%'); tm.textContent='--:-- / --:--';
  }
  function load(){
    var c=CH[ch]; stopMedia(); scr.classList.remove('standby');
    if(c.yt){ fr.src=c.yt+YT; scr.classList.add('show-frame'); paused=false; tm.textContent='ЭФИРЪ'; setTimeout(applyVol,1500); }
    else { vid.src=c.f; scr.classList.add('show-video'); applyVol();
      var p=vid.play(); paused=false; if(p&&p.catch) p.catch(function(){ paused=true; updateInfo(); }); }
    updateInfo();
  }
  function tune(i,quiet){
    i=(i+CH.length)%CH.length; if(i===ch&&on&&!quiet) return; ch=i; click();
    if(!on){ updateInfo(); return; }
    stopMedia(); scr.classList.remove('standby'); showOsd();
    noise(650,load); updateInfo();
  }
  function power(v){
    if(v===on) return; on=v; click();
    if(on){
      scr.classList.remove('off','cool'); scr.classList.add('warm'); showOsd();
      setTimeout(function(){ scr.classList.remove('warm'); },800);
      noise(800,load); updateInfo();
    } else {
      clearTimeout(noiseT); scr.classList.remove('noisy','warm','standby'); scr.classList.add('cool'); stopMedia(); paused=true; osd.classList.remove('on');
      setTimeout(function(){ scr.classList.add('off'); scr.classList.remove('cool'); },520); updateInfo();
    }
  }
  bPow.onclick=function(){ power(!on); };
  keys.forEach(function(k,i){ k.onclick=function(){ if(!on){ ch=i; power(true); } else tune(i); }; });
  $('tv-prev').onclick=function(){ tune(ch-1); }; $('tv-next').onclick=function(){ tune(ch+1); };

  
  vid.controls=false; vid.disablePictureInPicture=true;
  vid.addEventListener('timeupdate',function(){
    if(!vid.duration) return; var p=vid.currentTime/vid.duration*100; seek.value=p; seek.style.setProperty('--p',p+'%');
    tm.textContent=fmt(vid.currentTime)+' / '+fmt(vid.duration);
  });
  vid.addEventListener('loadedmetadata',function(){ tm.textContent='00:00 / '+fmt(vid.duration); });
  vid.addEventListener('play',function(){ paused=false; updateInfo(); });
  vid.addEventListener('pause',function(){ if(on&&!vid.ended){ paused=true; updateInfo(); } });
  vid.addEventListener('ended',function(){ tune(ch+1); });
  vid.addEventListener('error',function(){ if(on&&CH[ch].f&&vid.getAttribute('src')){ scr.classList.remove('show-video'); scr.classList.add('standby'); tm.textContent='НЕТ СИГНАЛА'; } });
  seek.addEventListener('input',function(){ if(vid.duration){ vid.currentTime=seek.value/100*vid.duration; seek.style.setProperty('--p',seek.value+'%'); } });
  bPlay.onclick=function(){
    if(!on) return; click();
    if(CH[ch].yt){ paused=!paused; ytCmd(paused?'pauseVideo':'playVideo'); updateInfo(); }
    else if(vid.paused) vid.play(); else vid.pause();
  };
  bMute.onclick=function(){ muted=!muted; applyVol(); click(); };
  bFs.onclick=function(){ var e=scr; (e.requestFullscreen||e.webkitRequestFullscreen||function(){}).call(e); };

  
  function knob(el,min,max,onAngle,onWheel,onClick){
    var drag=false,moved=false,sx=0,sy=0;
    function ang(e){ var r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
      var a=Math.atan2(e.clientY-cy,e.clientX-cx)*180/Math.PI+90; if(a>180)a-=360; return Math.max(min,Math.min(max,a)); }
    el.addEventListener('pointerdown',function(e){ drag=true; moved=false; sx=e.clientX; sy=e.clientY; el.classList.add('drag'); try{el.setPointerCapture(e.pointerId);}catch(x){} });
    el.addEventListener('pointermove',function(e){ if(!drag) return; if(Math.abs(e.clientX-sx)+Math.abs(e.clientY-sy)>5) moved=true; if(moved) onAngle(ang(e),true); });
    el.addEventListener('pointerup',function(e){ if(!drag) return; drag=false; el.classList.remove('drag'); if(moved) onAngle(ang(e),false); else if(onClick) onClick(); });
    el.addEventListener('wheel',function(e){ e.preventDefault(); onWheel(e.deltaY<0?1:-1); },{passive:false});
    el.addEventListener('keydown',function(e){ if(e.key==='ArrowRight'||e.key==='ArrowUp'){ e.preventDefault(); onWheel(1); } else if(e.key==='ArrowLeft'||e.key==='ArrowDown'){ e.preventDefault(); onWheel(-1); } });
  }
  knob(kChan,-120,120,function(a,live){ var i=Math.round((a+120)/40); if(!live||i!==ch){ if(!live||true){ if(i!==ch) { if(!on){ ch=i; updateInfo(); } else tune(i); } } } },
       function(d){ if(!on){ ch=(ch+d+CH.length)%CH.length; updateInfo(); } else tune(ch+d); },
       function(){ if(!on){ power(true); } else tune(ch+1); });
  knob(kVol,-135,135,function(a){ vol=(a+135)/270; muted=false; applyVol(); },function(d){ vol=Math.max(0,Math.min(1,vol+d*.1)); muted=false; applyVol(); click(); });

 
  var LV={b:[.6,.74,.88,1.04,1.2],c:[.9,1.05,1.25,1.45,1.7],s:[0,.1,.2,.5,1]}, idx={b:2,c:2,s:2};
  minis.forEach(function(m){ m.onclick=function(){ var k=m.dataset.k; idx[k]=(idx[k]+1)%5;
    scr.style.setProperty('--'+k,LV[k][idx[k]]); m.style.transform='rotate('+((idx[k]-2)*55)+'deg)'; click(); }; });

  
  function fromHash(){ var m=/^#video-(\d+)$/.exec(location.hash); if(!m) return; var n=+m[1]-1; if(n<0||n>=CH.length) return; ch=n; updateInfo(); }
  fromHash(); window.addEventListener('hashchange',fromHash);
  scr.classList.add('off'); applyVol(); updateInfo();
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&document.fullscreenElement) document.exitFullscreen(); });
})();
}

{
(function(){var l=document.getElementById('kn-legend');if(l){var t=l.textContent;l.textContent='';for(var k=0;k<t.length;k++){var c=document.createElement('span');c.textContent=t[k]===' '?'\u00a0':t[k];c.style.transform='translateY('+((k*7)%9-4)+'px) rotate('+((k*13)%15-7)+'deg)';l.appendChild(c)}}})();
}