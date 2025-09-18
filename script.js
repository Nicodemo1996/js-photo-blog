document.addEventListener('DOMContentLoaded', () => {
  const apiURL = 'https://lanciweb.github.io/demo/api/pictures/';
  const gallery = document.getElementById('gallery');
  const overlay = document.getElementById('overlay');
  const overlayImg = document.getElementById('overlayImg');
  const overlayCaption = document.getElementById('overlayCaption');
  const closeBtn = document.getElementById('closeBtn');

  function hideOverlay() {
    overlay.classList.add('hidden');
    overlayImg.src = '';
    overlayCaption.textContent = '';
  }
  function showOverlay() {
    overlay.classList.remove('hidden');
  }

  closeBtn.addEventListener('click', hideOverlay);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hideOverlay(); });
  overlay.addEventListener('click', e => { if (e.target === overlay) hideOverlay(); });

  gallery.addEventListener('click', e => {
    const img = e.target.closest('img.photo');
    if (!img) return;
    overlayImg.src = img.dataset.full || img.src;
    overlayImg.alt = img.alt || '';
    overlayCaption.textContent = img.dataset.title || img.alt || '';
    showOverlay();
  });

  fetch(apiURL)
    .then(r => {
      if (!r.ok) throw new Error('Errore API');
      return r.json();
    })
    .then(data => renderGallery(data))
    .catch(err => {
      console.warn('Errore API, uso dati di fallback.', err);
      renderGallery([
        { url: 'https://picsum.photos/seed/1/800/600', title: 'Sample 1', date: '2022-07-10' },
        { url: 'https://picsum.photos/seed/2/800/600', title: 'Sample 2', date: '2021-03-12' },
        { url: 'https://picsum.photos/seed/3/800/600', title: 'Sample 3', date: '2020-05-30' }
      ]);
    });

  function renderGallery(items) {
    gallery.innerHTML = '';
    items.forEach(item => {
      const article = document.createElement('article');
      article.className = 'card';
      const safeTitle = escapeHtml(item.title || '');
      article.innerHTML = `
        <div class="pin"><img src="img/pin.svg" alt="Pin decorativo"></div>
        <img class="photo" src="${item.url}" data-full="${item.url}" 
             alt="${safeTitle}" data-title="${safeTitle}">
        <div class="meta">
          <h2 class="photo-title">${safeTitle}</h2>
          <time datetime="${item.date || ''}">${item.date || ''}</time>
        </div>
      `;
      gallery.appendChild(article);
    });
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, s => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]
    ));
  }
});
