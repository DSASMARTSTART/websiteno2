import { readFile, writeFile, mkdir } from 'node:fs/promises';
const languages = ['it', 'en', 'sr', 'es'];
const source = JSON.parse(await readFile('locales/it.json', 'utf8'));
const pages = [
  { name:'home', template:'home.html', route:'/' },
  { name:'about', template:'chi-siamo.html', route:'/chi-siamo/' },
  { name:'faq', template:'faq.html', route:'/faq/' }
];
const labels = {
  it:{ language:'Lingua del sito', names:['Italiano','English','Српски','Español'] },
  en:{ language:'Site language', names:['Italiano','English','Српски','Español'] },
  sr:{ language:'Језик сајта', names:['Italiano','English','Српски','Español'] },
  es:{ language:'Idioma del sitio', names:['Italiano','English','Српски','Español'] }
};
const entities = { amp:'&', quot:'"', apos:"'", lt:'<', gt:'>', nbsp:'\u00a0' };
const decode = value => value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (_, entity) => {
  if (entity.startsWith('#')) return String.fromCodePoint(entity[1].toLowerCase()==='x' ? parseInt(entity.slice(2),16) : parseInt(entity.slice(1),10));
  return entities[entity.toLowerCase()];
});
const escapeText = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const escapeAttribute = value => escapeText(value).replaceAll('"','&quot;');
function localeRoute(lang, route) { return (lang==='it' ? '' : `/${lang}`) + route; }
function selector(lang) {
  return `<div class="language-switch"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z"/></svg><select id="language-select" aria-label="${labels[lang].language}">${languages.map((code,i)=>`<option value="${code}" lang="${code}" title="${labels[lang].names[i]}"${code===lang?' selected':''}>${code.toUpperCase()}</option>`).join('')}</select></div>`;
}
let generated = 0;
for (const lang of languages) {
  const translations = JSON.parse(await readFile(`locales/${lang}.json`, 'utf8'));
  const missing = Object.keys(source).filter(key=>!Object.hasOwn(translations,key));
  if (missing.length) throw new Error(`${lang}: missing translation IDs ${missing.join(', ')}`);
  const dictionary = new Map(Object.entries(source).map(([id,text])=>[text,translations[id]]));
  const unknown = new Set();
  function translatedText(value) {
    const decoded = decode(value);
    const key = decoded.trim();
    if (!key) return value;
    if (dictionary.has(key)) {
      const whitespace = decoded.match(/^(\s*)(.*?)(\s*)$/s);
      return escapeText(whitespace[1] + dictionary.get(key) + whitespace[3]);
    }
    // HTML entities split the supplied SHAPE & COLOR sentence into two source entries.
    if (key.includes('&')) return decoded.split('&').map(part=>translatedText(escapeText(part))).join('&amp;');
    unknown.add(key);
    return value;
  }
  for (const page of pages) {
    let html = await readFile(`templates/${page.template}`, 'utf8');
    html = html.replace(/<!--[^]*?-->|<![^>]*>|<[^>]+>|[^<]+/g, token=> {
      if (!token.startsWith('<')) return translatedText(token);
      if (/^<html\b/i.test(token)) return token.replace(/lang="[^"]*"/, `lang="${lang}"`);
      if (/^<body\b/i.test(token)) return token.replace('>', ` data-page="${page.name}">`);
      return token.replace(/\b(href|aria-label|alt|placeholder|content)="([^"]*)"/g, (full,attr,value)=> {
        if (attr==='href' && pages.some(p=>p.route===value)) return `href="${localeRoute(lang,value)}"`;
        if (['aria-label','alt','placeholder'].includes(attr)) return `${attr}="${escapeAttribute(decode(translatedText(value)))}"`;
        if (attr==='content' && dictionary.has(decode(value).trim())) return `content="${escapeAttribute(dictionary.get(decode(value).trim()))}"`;
        return full;
      });
    });
    html = html.replace('</nav>', `</nav>${selector(lang)}`);
    html = html.replace('</head>', languages.map(code=>`<link rel="alternate" hreflang="${code}" href="${localeRoute(code,page.route)}">`).join('')+`<link rel="alternate" hreflang="x-default" href="${page.route}"></head>`);
    if (lang==='sr' && page.name==='home') {
      html = html.replace(/(<section class="container section two-columns parents"><div>[^]*?<h2>)[^]*?<\/h2>/,
        '$1Ваше дете има дислексију и учење <span class="blue">енглеског</span> делује као немогућ изазов?</h2>');
    }
    const file = localeRoute(lang,page.route).slice(1) + 'index.html';
    const dir = file.slice(0,file.lastIndexOf('/'));
    if (dir) await mkdir(dir,{recursive:true});
    await writeFile(file,html);
    generated++;
  }
  if (unknown.size) throw new Error(`${lang}: unrecognised source strings: ${JSON.stringify([...unknown])}`);
}
console.log(`Generated ${generated} complete pages; Italian remains the root language.`);
