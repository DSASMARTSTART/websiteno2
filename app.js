const locale = document.documentElement.lang || 'it';
const messages = {
  it:{open:'Apri menu',close:'Chiudi menu',found:'Domande trovate: {count}'},
  en:{open:'Open menu',close:'Close menu',found:'Questions found: {count}'},
  sr:{open:'Отвори мени',close:'Затвори мени',found:'Број пронађених питања: {count}'},
  es:{open:'Abrir menú',close:'Cerrar menú',found:'Preguntas encontradas: {count}'}
};
const ui = messages[locale] || messages.it;
const languageSelect = document.querySelector('#language-select');
const pageRoutes = {home:'/',about:'/chi-siamo/',faq:'/faq/'};
languageSelect.addEventListener('change', () => {
  const selected = languageSelect.value;
  const prefix = selected === 'it' ? '' : `/${selected}`;
  window.location.assign(prefix + (pageRoutes[document.body.dataset.page] || '/'));
});
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', ui.open);
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? ui.close : ui.open);
  navigation.classList.toggle('is-open', open);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) closeMenu();
});
const desktop = matchMedia('(min-width: 1051px)');
desktop.addEventListener('change', () => { if (desktop.matches) closeMenu(); });
const search = document.querySelector('#faq-search');
if (search) {
  const items = [...document.querySelectorAll('.faq-item')];
  const groups = [...document.querySelectorAll('.faq-group')];
  const clear = document.querySelector('#clear-search');
  const cyrillic = {а:'a',б:'b',в:'v',г:'g',д:'d',ђ:'dj',е:'e',ж:'z',з:'z',и:'i',ј:'j',к:'k',л:'l',љ:'lj',м:'m',н:'n',њ:'nj',о:'o',п:'p',р:'r',с:'s',т:'t',ћ:'c',у:'u',ф:'f',х:'h',ц:'c',ч:'c',џ:'dz',ш:'s'};
  const normalize = (value) => value.toLocaleLowerCase(locale).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[а-яђјљњћџ]/g, char => cyrillic[char] || char).replace(/đ/g,'dj');
  const originalOpen = new Map(items.map(item => [item, item.open]));
  const searchable = new Map(items.map(item => [item, normalize(item.textContent)]));
  function filterQuestions() {
    const query = normalize(search.value.trim());
    let found = 0;
    items.forEach(item => {
      const matches = !query || searchable.get(item).includes(query);
      item.hidden = !matches;
      item.open = query ? matches : originalOpen.get(item);
      if (matches) found++;
    });
    groups.forEach(group => { group.hidden = ![...group.querySelectorAll('.faq-item')].some(item => !item.hidden); });
    clear.hidden = !query;
    document.querySelector('#no-results').hidden = found !== 0;
    document.querySelector('#faq-status').textContent = ui.found.replace('{count}', String(found));
  }
  search.addEventListener('input', filterQuestions);
  clear.addEventListener('click', () => { search.value = ''; filterQuestions(); search.focus(); });
}
