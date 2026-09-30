// Pair the article's existing character descriptions with their pictures.
const charactersSection = document.querySelector('#mwfw');
const originalGallery = charactersSection?.querySelector('.thumb.tmulti');
const collageLink = document.querySelector('img[src="assets/image-6.png"]')?.closest('a');

if (charactersSection && originalGallery && collageLink) {
  const images = new Map(
    [...originalGallery.querySelectorAll('.tsingle')].map(item => [
      item.querySelector('img')?.getAttribute('src'),
      item.querySelector('a.mw-file-description')
    ])
  );

  function portrait(link, note, crop = '') {
    const figure = document.createElement('figure');
    figure.className = `character-portrait${crop ? ` character-portrait--${crop}` : ''}`;
    figure.append(link);
    const caption = document.createElement('figcaption');
    caption.textContent = note;
    figure.append(caption);
    return figure;
  }

  function collagePortrait(name, position) {
    const link = collageLink.cloneNode(true);
    link.removeAttribute('id');
    const image = link.querySelector('img');
    image.removeAttribute('id');
    image.alt = `${name} in the Italian brainrot character collage`;
    // Each crop opens the same full collage. Use buttons for the repeated
    // destinations so keyboard users do not encounter three identical links.
    if (position !== 'top-left') {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mw-file-description';
      button.append(image);
      return portrait(button, `Shown in the collage (${position.replace('-', ' ')})`, position);
    }
    return portrait(link, `Shown in the collage (${position.replace('-', ' ')})`, position);
  }

  const galleryEntries = [
    { name: 'Tralalero Tralala', dl: '#mwiA', pictures: [collagePortrait('Tralalero Tralala', 'top-left')] },
    { name: 'Tung Tung Tung Sahur', dl: '#mwmw', extra: ['#mwoA', '#mwoQ'], pictures: [collagePortrait('Tung Tung Tung Sahur', 'top-right')] },
    { name: 'Bombardiro Crocodilo', dl: '#mwyQ', pictures: [collagePortrait('Bombardiro Crocodilo', 'bottom-right')] },
    { name: 'Trippi Troppi', dl: '#mw5g', extra: ['#trippi-related'], pictures: [
      portrait(images.get('assets/image-10.png'), 'Cat and shrimp version'),
      portrait(images.get('assets/image-11.webp'), 'Fish and bear version')
    ] },
    { name: 'Ballerina Cappuccina', dl: '#mw9w', pictures: [portrait(images.get('assets/image-13.png'), 'Ballerina Cappuccina')] },
    { name: 'Chimpanzini Bananini', dl: '#mwARM', pictures: [portrait(images.get('assets/image-9.webp'), 'Chimpanzini Bananini')] },
    { name: 'Lirili Larila', dl: '#mwAR0', pictures: [portrait(images.get('assets/image-12.webp'), 'Lirili Larila')] }
  ];

  const guide = document.createElement('div');
  guide.className = 'character-guide';
  guide.setAttribute('aria-label', 'Italian brainrot characters and pictures');

  galleryEntries.forEach(({ name, dl, extra = [], pictures }) => {
    const card = document.createElement('div');
    card.className = 'character-card';
    const media = document.createElement('div');
    media.className = 'character-card-media';
    pictures.forEach(picture => media.append(picture));
    const details = document.createElement('div');
    details.className = 'character-card-details';
    details.append(charactersSection.querySelector(dl));
    extra.forEach(selector => details.append(charactersSection.querySelector(selector)));
    card.append(media, details);
    guide.append(card);
  });

  const more = document.createElement('div');
  more.className = 'character-extras';
  more.innerHTML = '<h3>More pictured characters</h3>';
  const extraPictures = document.createElement('div');
  extraPictures.className = 'character-extras-grid';
  extraPictures.append(
    portrait(images.get('assets/image-7.webp'), 'Bombombini Gusini'),
    portrait(images.get('assets/image-8.webp'), 'Cappuccino Assassino')
  );
  more.append(extraPictures);

  originalGallery.remove();
  const intro = charactersSection.querySelector('#mwgw');
  intro.after(guide, more);
}
