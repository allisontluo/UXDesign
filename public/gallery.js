// Open article and homepage pictures without leaving this website.
const clickablePictures = [...document.querySelectorAll('a.mw-file-description:has(img), button.mw-file-description:has(img)')]
  .filter(link => {
    const image = link.querySelector('img');
    return image.dataset.fullSrc || /assets\/home-image-[5-9]\./.test(image.getAttribute('src') || '');
  });
// Several character cards show different crops of the same original collage.
// Keep every crop clickable, but list that full picture only once in the viewer.
const seenPictures = new Set();
const pictureLinks = clickablePictures.filter(link => {
  const image = link.querySelector('img');
  const source = image.dataset.fullSrc || image.getAttribute('src');
  if (seenPictures.has(source)) return false;
  seenPictures.add(source);
  return true;
});

if (pictureLinks.length) {
  const viewer = document.createElement('dialog');
  viewer.className = 'picture-viewer';
  viewer.setAttribute('aria-label', 'Picture viewer');
  viewer.innerHTML = `
    <div class="picture-viewer-inner">
      <div class="picture-viewer-toolbar">
        <span class="picture-viewer-count" aria-live="polite"></span>
        <button class="picture-viewer-close" type="button" aria-label="Close picture viewer">Close ×</button>
      </div>
      <figure>
        <img class="picture-viewer-image" alt="">
        <figcaption class="picture-viewer-caption"></figcaption>
      </figure>
      <div class="picture-viewer-controls">
        <button class="picture-viewer-prev" type="button" aria-label="Previous picture">← Previous</button>
        <span>Use ← and → to browse; Esc to close</span>
        <button class="picture-viewer-next" type="button" aria-label="Next picture">Next →</button>
      </div>
    </div>`;
  document.body.append(viewer);

  const image = viewer.querySelector('.picture-viewer-image');
  const caption = viewer.querySelector('.picture-viewer-caption');
  const count = viewer.querySelector('.picture-viewer-count');
  let current = 0;
  let opener = null;

  function showPicture(index) {
    current = (index + pictureLinks.length) % pictureLinks.length;
    const link = pictureLinks[current];
    const thumbnail = link.querySelector('img');
    const source = thumbnail.dataset.fullSrc || thumbnail.getAttribute('src');
    image.src = new URL(source, document.baseURI).href;
    image.alt = thumbnail.alt;
    caption.textContent = link.closest('figure')?.querySelector('figcaption')?.textContent.trim() || thumbnail.alt;
    count.textContent = `Picture ${current + 1} of ${pictureLinks.length}`;
  }

  clickablePictures.forEach(link => {
    const image = link.querySelector('img');
    const source = image.dataset.fullSrc || image.getAttribute('src');
    const index = pictureLinks.findIndex(picture => {
      const pictureImage = picture.querySelector('img');
      return (pictureImage.dataset.fullSrc || pictureImage.getAttribute('src')) === source;
    });
    link.setAttribute('aria-label', `View larger picture: ${image.alt || 'image'}`);
    link.addEventListener('click', event => {
      event.preventDefault();
      opener = link;
      showPicture(index);
      viewer.showModal();
      viewer.querySelector('.picture-viewer-close').focus();
    });
  });

  viewer.querySelector('.picture-viewer-prev').addEventListener('click', () => showPicture(current - 1));
  viewer.querySelector('.picture-viewer-next').addEventListener('click', () => showPicture(current + 1));
  viewer.querySelector('.picture-viewer-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('close', () => opener?.focus());
  viewer.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPicture(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showPicture(current + 1); }
  });
}
