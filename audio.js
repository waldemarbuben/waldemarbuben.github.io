{
(function(){const stations={literature:{audio:document.getElementById('radio-literature-audio'),state:document.getElementById('radio-literature-state')},music:{audio:document.getElementById('radio-music-audio'),state:document.getElementById('radio-music-state')}};function update(k,on){stations[k].state.textContent=on?'ЭФИРЪ ПРИНЯТЪ':'ПРИЁМЪ ОЖИДАЕТЪ';const b=document.querySelector('[data-radio="'+k+'"]');if(b)b.textContent=on?'Ⅱ ПАУЗА':'▶ СЛУШАТЬ'}document.querySelectorAll('[data-radio]').forEach(b=>b.addEventListener('click',async()=>{const k=b.dataset.radio,c=stations[k];if(!c.audio.paused){c.audio.pause();update(k,false);return}Object.keys(stations).forEach(o=>{if(o!==k){stations[o].audio.pause();update(o,false)}});try{await c.audio.play();update(k,true)}catch(e){c.state.textContent='ПОТОКЪ НЕДОСТУПЕНЪ'}}));Object.keys(stations).forEach(k=>{const a=stations[k].audio,v=document.querySelector('[data-radio-volume="'+k+'"]');a.volume=v?Number(v.value):.8;if(v)v.addEventListener('input',()=>a.volume=Number(v.value));a.addEventListener('playing',()=>update(k,true));a.addEventListener('pause',()=>update(k,false));a.addEventListener('error',()=>stations[k].state.textContent='НЕТЪ СИГНАЛА')})})();
}

{
(function(){
  const player = document.getElementById('audio-player');
  const title = document.getElementById('now-playing-title');
  const status = document.getElementById('player-status');
  const playSelected = document.getElementById('play-selected');
  const buttons = Array.from(document.querySelectorAll('.audio-select-btn'));

  let selected = null;
  const byId = id => document.getElementById(id);
  const ipPlay=byId('ip-play'), ipProgress=byId('ip-progress'), ipCurrent=byId('ip-current'),
        ipDuration=byId('ip-duration'), ipVolume=byId('ip-volume'), ipMute=byId('ip-mute'),
        ipSpeed=byId('ip-speed'), ipLamp=byId('ip-lamp'), ipState=byId('ip-state'),
        ipTrack=byId('ip-track-name');
  const fmt = value => { if(!Number.isFinite(value)) return '0:00'; const n=Math.floor(value); return Math.floor(n/60)+':'+String(n%60).padStart(2,'0'); };
  function syncPlayer(){
    ipPlay.textContent=player.paused?'▶':'Ⅱ';
    ipPlay.setAttribute('aria-label',player.paused?'Воспроизвести':'Пауза');
    ipCurrent.textContent=fmt(player.currentTime); ipDuration.textContent=fmt(player.duration);
    ipProgress.value=player.duration?Math.round(player.currentTime/player.duration*1000):0;
    ipProgress.style.background=`linear-gradient(90deg,#fff7b8 0%,#f7b25a ${ipProgress.value/20}%,#e8782a ${ipProgress.value/10}%,#0e0830 ${ipProgress.value/10}%,#0e0830 100%)`;
    ipLamp.textContent=player.paused?'ОЖИДАЕТ':'ВРАЩАЕТСЯ';
    ipState.textContent=player.paused?'ОСТАНОВЛЕНЪ':'ВОСПРОИЗВЕДЕНIЕ';
    ipTrack.textContent=selected?labelFor(selected).toLocaleUpperCase('ru-RU'):'НЕ ВЫБРАНА';
  }
  ipPlay.addEventListener('click',()=>{if(!selected){status.textContent='Сначала выберите запись из каталога.';return;} if(player.paused) player.play().catch(()=>{}); else player.pause();});
  byId('ip-back').addEventListener('click',()=>{player.currentTime=Math.max(0,player.currentTime-15);});
  byId('ip-forward').addEventListener('click',()=>{player.currentTime=Math.min(player.duration||Infinity,player.currentTime+15);});
  ipProgress.addEventListener('input',()=>{if(player.duration) player.currentTime=(Number(ipProgress.value)/1000)*player.duration;});
  ipVolume.addEventListener('input',()=>{player.volume=Number(ipVolume.value);player.muted=false;ipMute.textContent='◖))';});
  player.volume=.8;
  ipMute.addEventListener('click',()=>{player.muted=!player.muted;ipMute.textContent=player.muted?'×))':'◖))';});
  ipSpeed.addEventListener('click',()=>{const speeds=[1,1.25,1.5,2,.75];const next=speeds[(speeds.indexOf(player.playbackRate)+1)%speeds.length];player.playbackRate=next;ipSpeed.textContent=next+'×';});
  ['timeupdate','loadedmetadata','durationchange','play','pause','ended','volumechange','ratechange'].forEach(e=>player.addEventListener(e,syncPlayer));


  function labelFor(src) {
    const button = buttons.find(function(item){ return item.dataset.track === src; });
    return button ? button.closest('.track-card').querySelector('.track-copy strong').textContent : src;
  }

  function markSelected(src) {
    document.querySelectorAll('.track-card').forEach(function(card){
      card.classList.toggle('selected', card.dataset.trackCard === src);
    });
    buttons.forEach(function(button){
      button.textContent = button.dataset.track === src ? 'Выбрано' : 'Заиграть';
    });
  }

  function selectTrack(src, autoplay, automatic) {
    const button = buttons.find(function(item){ return item.dataset.track === src; });
    if (!button) {
      status.textContent = 'Эта запись не найдена в каталоге.';
      return;
    }

    selected = src;
    title.textContent = labelFor(src);
    ipTrack.textContent = labelFor(src).toLocaleUpperCase('ru-RU');
    markSelected(src);
    syncPlayer();

    if (player.dataset.loadedTrack !== src) {
      player.pause();
      player.removeAttribute('src');
      player.src = src;
      player.dataset.loadedTrack = src;
      player.load();
    }

    if (automatic) {
      status.textContent = 'Предыдущая запись завершена. Начинается следующая...: ' + labelFor(src) + '.';
    } else if (autoplay) {
      status.textContent = 'Запись выбрана...';
    } else {
      status.textContent = 'Запись выбрана. Нажмите «Заиграть выбранное» или кнопку плеера.';
    }

    if (autoplay) {
      const promise = player.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function(){
          status.textContent = automatic
            ? 'Браузер остановил автоматический переход. Нажмите «Заиграть выбранное», чтобы продолжить.'
            : 'Запись выбрана. Для начала воспроизведения нажмите «Заиграть выбранное».';
        });
      }
    }
  }

  buttons.forEach(function(button){
    button.addEventListener('click', function(){ selectTrack(button.dataset.track, true, false); });
  });

  playSelected.addEventListener('click', function(){
    if (!selected) {
      status.textContent = 'Выберите запись из списка.';
      return;
    }
    if (player.dataset.loadedTrack !== selected) selectTrack(selected, false, false);
    const promise = player.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function(){
        status.textContent = 'Браузер остановил запуск. Нажмите кнопку воспроизведения в самом плеере.';
      });
    }
  });

  player.addEventListener('play', function(){
    if (selected) status.textContent = 'Сейчас звучит: ' + labelFor(selected) + '.';
  });

  player.addEventListener('pause', function(){
    if (selected && player.currentTime > 0 && !player.ended) {
      status.textContent = 'Пауза: ' + labelFor(selected) + '.';
    }
  });

  player.addEventListener('ended', function(){
    const currentIndex = buttons.findIndex(function(button){ return button.dataset.track === selected; });
    const nextButton = currentIndex >= 0 ? buttons[currentIndex + 1] : null;

    if (nextButton) {
      selectTrack(nextButton.dataset.track, true, true);
    } else {
      status.textContent = 'Последняя запись завершена. Вы заного послушаете весь музыкальный архив. Люблю Вас - наверное...';
    }
  });

  syncPlayer();
  const requested = new URLSearchParams(window.location.search).get('track');
  if (requested) selectTrack(requested, true, false);
})();
}

{
(function(){var l=document.getElementById('kn-legend');if(l){var t=l.textContent;l.textContent='';for(var k=0;k<t.length;k++){var c=document.createElement('span');c.textContent=t[k]===' '?'\u00a0':t[k];c.style.transform='translateY('+((k*7)%9-4)+'px) rotate('+((k*13)%15-7)+'deg)';l.appendChild(c)}}})();
}