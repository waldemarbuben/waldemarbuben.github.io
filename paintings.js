{
(function(){
  const consent = document.getElementById('painting-consent');
  const gallery = document.getElementById('painting-gallery');
  function openGallery(){
    consent.hidden = true;
    gallery.hidden = false;
    gallery.querySelectorAll('img[data-src]').forEach(function(img){ img.src = img.dataset.src; img.removeAttribute('data-src'); });
  }
  document.getElementById('painting-agree').addEventListener('click', openGallery);
  if (new URLSearchParams(window.location.search).get('agreed') === '1') openGallery();
})();
}

{
(function(){var l=document.getElementById('kn-legend');if(l){var t=l.textContent;l.textContent='';for(var k=0;k<t.length;k++){var c=document.createElement('span');c.textContent=t[k]===' '?'\u00a0':t[k];c.style.transform='translateY('+((k*7)%9-4)+'px) rotate('+((k*13)%15-7)+'deg)';l.appendChild(c)}}})();
}