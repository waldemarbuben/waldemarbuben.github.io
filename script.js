{
(function(){try{if(/[?&]from=nav(&|$)/.test(location.search)){history.replaceState(null,'',location.pathname+location.hash);}}catch(e){}})();
}

{
document.addEventListener("DOMContentLoaded", () => {
    document.documentElement.style.scrollBehavior = "smooth";

    const imagesPool = [
        'plah1.webp',
        'plah2.webp',
        'plah3.webp',
    ];

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    const shuffledImages = shuffle([...imagesPool]);

    const validPosts = Array.from(document.querySelectorAll(".content .post")).filter(post => {
        const dateEl = post.querySelector(".date");
        return dateEl && dateEl.textContent.includes("1916");
    });

    const container = document.getElementById("buben-recent-posts");
    if (!container || validPosts.length === 0) return;

    validPosts.forEach((post, index) => {
        post.id = "buben-diary-true-post-" + index;
    });

    const recentPosts = validPosts.slice(-3).reverse();
    container.innerHTML = ""; 

    recentPosts.forEach((post, i) => {
        const dateElement = post.querySelector(".date");
        const paragraphElement = post.querySelector("p");

        const dateText = dateElement.textContent.trim();
        let bodyText = paragraphElement ? paragraphElement.textContent.trim() : "";
        
        if (bodyText.length > 60) {
            bodyText = bodyText.substring(0, 57) + "...";
        }

        const currentImgSrc = shuffledImages[i % shuffledImages.length];

        const link = document.createElement("a");
        link.href = "#" + post.id;
        link.className = "buben-ghost-link";
        
        link.innerHTML = `
            <div style="max-width: 70%; min-width: 0;">
                <span class="buben-link-date">${dateText}</span>
                <span class="buben-link-desc">${bodyText}</span>
            </div>
            <img src="${currentImgSrc}" alt="" style="
                position: absolute;
                right: 15px; 
                top: 50%;
                transform: translateY(-50%);
                width: 90px;  
                height: 90px;
                object-fit: contain;
                pointer-events: none; 
                mix-blend-mode: screen; 
                filter: sepia(40%) drop-shadow(0 0 12px #d4af37);
            " />
        `;

        container.appendChild(link);
    });
});
}

{
document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.style.scrollBehavior = "smooth";

    const flowerImages = [
        'flower3.webp',
        'flower4.webp',
        'flower5.webp',
        'flower7.webp',
        'flower8.webp',
        'flower12.webp',
        'flower13.webp',
    ];

    

    const MAX_FLOWERS = 3;
    const flowers = [];
    let rafId = null;
    let lastTime = 0;

    function tick(now) {
        const dt = Math.min((now - lastTime) / 16.667, 3) || 1;
        lastTime = now;

        for (let i = flowers.length - 1; i >= 0; i--) {
            if (!flowers[i].step(dt)) {
                flowers[i].el.remove();
                flowers.splice(i, 1);
            }
        }

        if (flowers.length > 0) {
            rafId = requestAnimationFrame(tick);
        } else {
            rafId = null;
        }
    }

    function ensureLoop() {
        if (rafId === null) {
            lastTime = performance.now();
            rafId = requestAnimationFrame(tick);
        }
    }

    function createFlower() {
        if (document.hidden || flowers.length >= MAX_FLOWERS) return;

        const el = document.createElement('img');
        el.src = flowerImages[Math.floor(Math.random() * flowerImages.length)];

        
        el.style.position = 'fixed';
        el.style.left = '0';
        el.style.top = '0';
        el.style.zIndex = '100';
        el.style.pointerEvents = 'none';
        el.style.userSelect = 'none';
        el.style.willChange = 'transform, opacity';
        el.style.transform = 'translate3d(0,0,0)';
        el.style.visibility = 'hidden';

        const size = 30 + Math.random() * 40;
        el.style.width = size + 'px';
        el.style.height = 'auto';
        el.style.opacity = (0.5 + Math.random() * 0.4).toString();

        el.className = 'falling-flower';

        if (el.complete) {
            el.style.visibility = 'visible';
        } else {
            el.onload = () => { el.style.visibility = 'visible'; };
        }

        document.body.appendChild(el);

        const state = {
            el,
            size,
            x: Math.random() * window.innerWidth,
            y: -size - 20,
            speedY: 1.5 + Math.random() * 2,
            swaySpeed: 0.02 + Math.random() * 0.03,
            swayAmp: 1 + Math.random() * 2,
            swayStep: Math.random() * 100,
            rot: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 1.2,
        };

       
        state.step = function (dt) {
            this.y += this.speedY * dt;
            this.swayStep += this.swaySpeed * dt;
            this.x += Math.sin(this.swayStep) * this.swayAmp * dt;
            this.rot += this.rotSpeed * dt;

          
            this.el.style.transform = `translate3d(${this.x.toFixed(1)}px, ${this.y.toFixed(1)}px, 0) rotate(${this.rot.toFixed(1)}deg)`;

           
            return this.y <= window.innerHeight + 40;
        };

        flowers.push(state);
        ensureLoop();
    }

    function spawnWave() {
        const count = 1;
        for (let i = 0; i < count; i++) {
            setTimeout(createFlower, Math.random() * 1500);
        }

        const isLongDelay = Math.random() > 0.5;
        const nextDelay = 30000 + Math.random() * 30000; 

        setTimeout(spawnWave, nextDelay);
    }

    setTimeout(spawnWave, 6000);
});
}

{
document.addEventListener("DOMContentLoaded", function() {
        const btnAgree = document.getElementById("btn-agree");
        const btnDisagree = document.getElementById("btn-disagree");
        const choiceBlock = document.getElementById("choice-block");
        const paintingsWrapper = document.getElementById("paintings-wrapper");
        
        const glitchOverlay = document.getElementById("glitch-overlay");
        const crashScreen = document.getElementById("crash-screen");
        const crashContent = document.getElementById("crash-content");
        const videoOverlay = document.getElementById("video-overlay");
        const videoPlayer = document.getElementById("rickroll-player");

        if (choiceBlock) choiceBlock.style.cssText += "; position: relative; z-index: 999999 !important; pointer-events: auto !important;";
        if (btnAgree) btnAgree.style.cssText += "; position: relative; z-index: 1000000 !important; pointer-events: auto !important;";
        if (btnDisagree) btnDisagree.style.cssText += "; position: relative; z-index: 1000000 !important; pointer-events: auto !important;";

        btnAgree.addEventListener("click", function() { window.location.href = "paintings.html?agreed=1"; });

        btnDisagree.addEventListener("click", function(e) {
            videoPlayer.muted = true;
            videoPlayer.play(); 
            videoPlayer.pause(); 
            videoPlayer.currentTime = 0;

            glitchOverlay.style.display = "block";
            
            let glitchInterval = setInterval(() => {
                document.body.style.transform = `translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) scale(${1 + Math.random() * 0.08})`;
                glitchOverlay.style.background = Math.random() > 0.5 ? '#ff0000' : '#00ffff';
                document.body.style.filter = Math.random() > 0.5 ? 'invert(1) hue-rotate(180deg) contrast(2)' : 'none';
            }, 40);

            setTimeout(() => {
                clearInterval(glitchInterval);
                document.body.style.filter = "none";
                document.body.style.transform = "none";
                glitchOverlay.style.display = "none";

                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

                if (isMobile) {
                    crashScreen.style.backgroundColor = "#000000";
                    crashScreen.style.color = "#ffffff";
                    
                    let secondsLeft = 5;
                    
                    function updateMobileScreen() {
                        crashContent.innerHTML = `
                            <div style="font-size: 50px; margin-bottom: 30px; text-align:center;"></div>
                            <h1 style="font-size: 22px; font-weight: 600; margin-bottom: 15px; color: #ff3b30; text-align:center;">КРИТИЧЕСКИЙ СБОЙ СИСТЕМЫ</h1>
                            <p style="font-size: 15px; color: #ccc; line-height: 1.5; text-align:center; margin-bottom: 40px;">
                                "Home" Would Like to Send You Critical Alerts<br>
                                Устройство переведено в режим экстренной очистки.
                            </p>
                            <div style="font-size: 14px; color: #ff9500; font-family: monospace; text-align:center; border: 1px dashed #ff9500; padding: 15px;">
                                ДО ПОЛНОГО УНИЧТОЖЕНИЯ ДАННЫХ: <span style="font-size: 20px; font-weight: bold; color: #ff3b30;">${secondsLeft} сек...</span>
                            </div>
                        `;
                    }
                    
                    updateMobileScreen();
                    crashScreen.style.display = "flex";

                    let mobileTimer = setInterval(() => {
                        secondsLeft--;
                        if (secondsLeft <= 0) {
                            clearInterval(mobileTimer);
                            startVideo();
                        } else {
                            updateMobileScreen();
                        }
                    }, 1000);

                } else {
                    crashScreen.style.backgroundColor = "#0078d7";
                    crashScreen.style.color = "#ffffff";
                    
                    let percent = 0;
                    
                    function updatePcScreen() {
                        crashContent.innerHTML = `
                            <div style="font-size: 120px; line-height: 1; margin-bottom: 30px; font-family: sans-serif;">:(</div>
                            <h1 style="font-size: 26px; font-weight: 300; margin-bottom: 25px; line-height: 1.4;">На вашем ПК возникла критическая проблема.</h1>
                            <h2 style="font-size: 26px; font-weight: 300; margin-bottom: 35px;">Выполнено: <span style="font-weight:bold;">${percent}%</span></h2>
                            <div style="display: flex; gap: 20px; align-items: center; font-size: 15px; opacity: 0.8; line-height: 1.5;">
                                <div style="width: 80px; height: 80px; background: white; color: #0078d7; display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 40px;">QR</div>
                                <div>
                                    Для получения дополнительных сведений об этой ошибке посетите сайт waldemarbuben.space<br><br>
                                    Код остановки: <span style="font-weight:bold;">MENTAL_CAL_DETECTION_FAILURE</span>
                                </div>
                            </div>
                        `;
                    }

                    updatePcScreen();
                    crashScreen.style.display = "flex";

                    let pcTimer = setInterval(() => {
                        percent += Math.floor(Math.random() * 15) + 5; 
                        if (percent >= 100) {
                            percent = 100;
                            updatePcScreen();
                            clearInterval(pcTimer);
                            setTimeout(startVideo, 600); 
                        } else {
                            updatePcScreen();
                        }
                    }, 400);
                }

                function startVideo() {
                    crashScreen.style.display = "none";
                    videoOverlay.style.display = "flex";
                    
                    videoPlayer.muted = false;
                    videoPlayer.volume = 1.0;
                    
                    let playPromise = videoPlayer.play();
                    
                    if (playPromise !== undefined) {
                        playPromise.catch(err => {
                            videoPlayer.muted = true;
                            videoPlayer.play();
                        });
                    }
                }

            }, 600);
        });

                videoPlayer.addEventListener("ended", function() {
            document.documentElement.innerHTML = `
                <html style="background:#000; height:100%; width:100%;">
                <head><title>SYSTEM CRITICAL ERROR</title></head>
                <body style="color:#222; font-family:monospace; text-align:center; padding-top:45vh; margin:0; background:#000; user-select:none;">
                    <div style="font-size: 16px; letter-spacing: 2px; color: #555;">ДОСТУП В ХРАМ НАВСЕГДА ЗАБЛОКИРОВАН</div>
                </body>
                </html>
            `;
            window.close();
        });
    });
}

{
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem('shrine_eternal_ban') === 'true') {
        sessionStorage.clear();
        document.documentElement.innerHTML = `
            <html style="background:#050201; height:100%; width:100%;">
            <head><title>ВЫ ИЗГНАНЫ НАВСЕГДА</title></head>
            <body style="color:#551a8b; font-family:Georgia, serif; text-align:center; padding-top:45vh; margin:0; background:#050201; user-select:none;">
                <div style="font-size: 13px; letter-spacing: 5px; color: #8b0000; text-shadow: 0 0 12px rgba(255,0,0,0.6); text-transform: uppercase; margin-bottom: 20px;">
                     ПРЕБЫВАНИЕ ПРЕСЕЧЕНО 
                </div> 
                <div style="font-size: 11px; letter-spacing: 2px; color: #caa148; font-style: italic;">
                    Вы покинули соборъ безъ подношенiя. Входъ закрытъ навѣчно.
                </div>
            </body>
            </html>
        `;
        return;
    }

    sessionStorage.setItem('shrine_session_active', 'true');

    if (localStorage.getItem('ritual_candle_lit') === 'true') {
        localStorage.setItem('ritual_candle_lit_permanently', 'true');
        localStorage.removeItem('ritual_candle_lit');
    }

    if (localStorage.getItem('ritual_candle_lit_permanently') === 'true') {
        const candleWrapper = document.getElementById('candle-behind-wall');
        if (candleWrapper) {
            candleWrapper.style.display = 'block';
        }
    }
});
}

{
document.addEventListener('click', function(event) {
  const button = event.target.closest('.audio-item[data-audio-src] .play-btn');
  if (!button) return;
  const item = button.closest('.audio-item[data-audio-src]');
  const source = item && item.dataset.audioSrc;
  if (!source) return;
  event.preventDefault();
  const audioUrl = 'audio.html?track=' + encodeURIComponent(source);
  const audioTab = window.open(audioUrl, '_blank');
  if (audioTab) audioTab.opener = null;
  if (!audioTab) {
    const notice = document.createElement('p');
    notice.textContent = 'Разрешите открытие новой вкладки для аудиотеки: ';
    const link = document.createElement('a');
    link.href = audioUrl; link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.textContent = 'Открыть аудиотеку'; notice.appendChild(link);
    notice.style.cssText = 'position:fixed;z-index:99999;bottom:16px;left:16px;padding:12px 16px;background:#211006;color:#ffe4a0;border:2px ridge #caa148;box-shadow:0 5px 20px #000';
    document.body.appendChild(notice);
  }
});
}

{
(function(){var l=document.getElementById('kn-legend');if(l){var t=l.textContent;l.textContent='';for(var k=0;k<t.length;k++){var c=document.createElement('span');c.textContent=t[k]===' '?'\u00a0':t[k];c.style.transform='translateY('+((k*7)%9-4)+'px) rotate('+((k*13)%15-7)+'deg)';l.appendChild(c)}}})();
}

{
(function(){
  document.querySelectorAll('.edge-shelf').forEach(function(shelf){
    var btn=shelf.querySelector('.shelf-toggle');
    function set(open){
      shelf.classList.toggle('is-open',open);
      btn.setAttribute('aria-expanded',open?'true':'false');
      btn.textContent=open?'Свернуть ▴':'Развернуть всѣ ▾';
    }
    btn.addEventListener('click',function(){
      var wasOpen=shelf.classList.contains('is-open');
      set(!wasOpen);
      if(wasOpen){ shelf.querySelector('.edge-shelf-scroll').scrollTop=0; }
    });
    shelf.querySelectorAll('.shelf-item').forEach(function(item){
      item.addEventListener('click',function(e){
        if(shelf.classList.contains('is-open')) return;   
        e.preventDefault();                                
        set(true);
        shelf.querySelectorAll('.shelf-item.is-picked').forEach(function(x){x.classList.remove('is-picked');});
        item.classList.add('is-picked');
        item.scrollIntoView({block:'center'});
      });
    });
  });
})();
}
