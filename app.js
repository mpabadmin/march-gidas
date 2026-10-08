'use strict';
const app = document.getElementById('app');
const backBtn = document.getElementById('back');
const IMG_CACHE = 'march-img-1';
let depth = 0;
const dec = s => { try { return decodeURIComponent(s); } catch (e) { return s; } };
const newPt = () => '<button class="btn newpt" data-act="new-pt">Naujas sužeistasis – išvalyti žymėjimus ir laikus</button>';
const FB_PAGES = ['f', 's', 'vaistai', 'vaistas', 'igudis', 'tema', 'p', '9line', 'mist'];
const fbLink = () => '<button class="btn fbrow" data-act="fb">Pastebėjote klaidą ar turite pasiūlymą? Praneškite</button>';

// Visos vietinės iliustracijos (įgūdžiai + mokymosi puslapiai) – išsaugoti naudojimui be interneto
function allImgs() {
  const set = new Set();
  (E.igudziai || []).forEach(s => (s.vaizdai || []).forEach(v => v.src && set.add(v.src)));
  Object.keys(E.puslapiai || {}).forEach(k => { const m = String(E.puslapiai[k].html || '').match(/img\/tccc\/[^"'\s)]+\.webp/g); (m || []).forEach(x => set.add(x)); });
  return Array.from(set);
}

function route() {
  const raw = (location.hash || '#/').slice(1), qi = raw.indexOf('?'), q = {};
  const path = qi < 0 ? raw : raw.slice(0, qi);
  if (qi >= 0) raw.slice(qi + 1).split('&').forEach(kv => { const i = kv.indexOf('='); if (i > 0) q[kv.slice(0, i)] = dec(kv.slice(i + 1)); });
  return { p: path.split('/').filter(Boolean).map(dec), q };
}

function view(p, q) {
  switch (p[0]) {
    case undefined: return V.home();
    case 'f': return V.phase(p[1], +q.t || 0) + newPt();
    case 's': return V.list(p[1]) + newPt();
    case 'sarasai': return V.lists();
    case '9line': return NL.view();
    case 'mist': return MI.view();
    case 'vaistai': return V.drugs();
    case 'vaistas': return V.drug(p[1]);
    case 'igudziai': return V.skills(q);
    case 'igudis': return V.skill(p[1]);
    case 'temos': return V.topics();
    case 'tema': return V.topic(p[1]);
    case 'p': return V.page(p[1]);
    case 'paieska': return V.search(q.q || '');
    case 'nustatymai': return V.settings();
    case 'idiegimas': return V.install();
    default: return notFound();
  }
}

function render() {
  const { p, q } = route();
  document.body.className = mode;
  document.getElementById('mF').classList.toggle('on', mode === 'field');
  document.getElementById('mL').classList.toggle('on', mode === 'learn');
  document.getElementById('mF').setAttribute('aria-pressed', mode === 'field');
  document.getElementById('mL').setAttribute('aria-pressed', mode === 'learn');
  backBtn.style.visibility = p.length ? 'visible' : 'hidden';
  const sec = { f: 'home', s: 'home', sarasai: 'home', '9line': '9line', mist: 'mist', vaistai: 'vaistai', vaistas: 'vaistai', igudziai: 'igudziai', igudis: 'igudziai', temos: 'igudziai', tema: 'igudziai', p: 'igudziai' }[p[0]] || (p.length ? '' : 'home');
  document.querySelectorAll('#nav a').forEach(a => { const on = a.dataset.s === sec; a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  try { app.innerHTML = view(p, q) + (FB_PAGES.indexOf(p[0]) >= 0 ? fbLink() : ''); }
  catch (err) { console.error(err); app.innerHTML = '<h1>Klaida</h1><p class="muted">Nepavyko atidaryti puslapio. Grįžkite į pradžią arba praneškite apie klaidą.</p>' + fbLink(); }
  app.querySelectorAll('.tabs, .ptabs').forEach(sc => { const b = sc.querySelector('button.on'), add = sc.querySelector('.add'); if (b && sc.scrollWidth > sc.clientWidth) { const av = sc.clientWidth - (add ? add.offsetWidth + 12 : 0); sc.scrollLeft = Math.max(0, b.offsetLeft - (av - b.offsetWidth) / 2); } });
  const h1 = app.querySelector('h1');
  document.title = h1 && p.length ? (h1.dataset.title || (h1.childNodes[0] || h1).textContent.trim()) + ' · March gidas' : 'March gidas';
  if (p[0] === 'paieska') { const i = document.getElementById('qs'); if (i) { i.focus(); try { i.setSelectionRange(i.value.length, i.value.length); } catch (e) {} } }
}

function onNav(first) {
  const { p } = route(), s = history.state;
  depth = !p.length ? 0 : (s && s.d != null ? s.d : (first ? 0 : depth + 1));
  history.replaceState(Object.assign({}, s, { d: depth }), '');
  tmEdit = null;
  render();
  if (!first) scrollTo(0, 0);
}

function setMode(m) { if (m === mode) return; mode = m; LS.set('mg-rezimas', m); tmEdit = null; render(); }

addEventListener('hashchange', () => onNav(false));
backBtn.onclick = () => { if (depth > 0) history.back(); else location.replace('#/'); };
document.getElementById('mF').onclick = () => setMode('field');
document.getElementById('mL').onclick = () => setMode('learn');
document.getElementById('fbb').onclick = () => FB.open();
document.getElementById('srch').onclick = () => { if (route().p[0] !== 'paieska') location.hash = '#/paieska'; };

// Elementą parodyti virš apatinės navigacijos (scrollIntoView nepaiso fiksuotos juostos)
function showAboveNav(elm) {
  const nav = document.getElementById('nav'), r = elm.getBoundingClientRect(), top = nav ? nav.getBoundingClientRect().top : innerHeight;
  const hdr = document.querySelector('header'), hb = hdr ? hdr.getBoundingClientRect().bottom : 0;
  if (r.bottom > top - 8) scrollBy({ top: Math.min(r.bottom - top + 16, r.top - hb - 8), behavior: 'smooth' });
  const b = elm.querySelector('button'); if (b) b.focus({ preventScroll: true });
}

async function saveImgs(el) {
  if (!('caches' in window)) { toast('Ši naršyklė to nepalaiko'); return; }
  if (!navigator.onLine) { toast('Reikia interneto ryšio'); return; }
  const list = allImgs(), sm = el.querySelector('small');
  el.disabled = true;
  let n = 0, bad = 0;
  try {
    const c = await caches.open(IMG_CACHE);
    for (const u of list) {
      try {
        const req = new Request(u);
        if (!(await c.match(req))) { const r = await fetch(req); if (r.ok) await c.put(req, r); else bad++; }
      } catch (e) { bad++; }
      n++; if (sm) sm.textContent = 'Išsaugota ' + n + ' / ' + list.length;
    }
  } catch (e) { bad = list.length; }
  LS.set('mg-img', bad ? 0 : list.length);
  toast(bad ? 'Nepavyko išsaugoti ' + bad + ' vaizdų – bandykite dar kartą' : 'Iliustracijos išsaugotos');
  if (route().p[0] === 'nustatymai') render();
}

app.addEventListener('click', e => {
  const lnk = e.target.closest('a[href]');
  if (lnk && !lnk.dataset.act && app.contains(lnk)) return; // paprastos nuorodos (pvz., paaiškinime) – tik naršymas, be žymėjimo
  const el = e.target.closest('[data-act]');
  if (!el || !app.contains(el)) return;
  const d = el.dataset;
  if (d.act === 'ck') {
    if (e.target.closest('.lk')) return; // tarpas tarp nuorodų mygtukų – nežymėti
    try { if (String(getSelection()).trim()) return; } catch (x) {} // žymimas tekstas
  }
  if (/^nl-/.test(d.act)) { NL.act(el); return; }
  if (/^mi-/.test(d.act)) { MI.act(el); return; }
  switch (d.act) {
    case 'ck': {
      ckToggle(d.l, +d.i); el.classList.toggle('on'); el.setAttribute('aria-checked', el.classList.contains('on'));
      const box = el.closest('.cl'); updCount(box);
      const tb = document.querySelector('.tabs button.on'), all = box.querySelectorAll('.ck').length;
      if (tb) tb.classList.toggle('done', all > 0 && box.querySelectorAll('.ck.on').length === all);
      if (navigator.vibrate) navigator.vibrate(15); break;
    }
    case 'go': e.preventDefault(); if (location.hash !== d.r) { if (d.rep) location.replace(d.r); else location.hash = d.r; } break;
    case 'toc': { const t = document.getElementById(d.t); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); break; }
    case 'mp4': {
      const v = document.createElement('video');
      v.src = d.src; v.controls = true; v.autoplay = true; v.playsInline = true; v.preload = 'auto';
      el.classList.remove('vthumb', 'vmp4'); el.removeAttribute('data-act'); el.removeAttribute('role'); el.innerHTML = ''; el.appendChild(v);
      break;
    }
    case 'yt': {
      const f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + d.id + '?autoplay=1&rel=0';
      f.title = 'Vaizdo įrašas'; f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true;
      el.classList.remove('vthumb'); el.removeAttribute('style'); el.removeAttribute('data-act'); el.removeAttribute('role'); el.innerHTML = ''; el.appendChild(f);
      break;
    }
    case 'tm': {
      tmEdit = d.k; updTimers();
      const T = LS.get('mg-laikai', {}), inp = document.getElementById('tm-in'), box = document.querySelector('.tme');
      if (inp) inp.value = T[d.k] ? hm(T[d.k]) : nowHM();
      if (box) showAboveNav(box);
      break;
    }
    case 'tm-q': {
      const k = d.k, ts = Date.now() - (+d.m || 0) * 60000, lb = k === 'turn' ? 'Turniketas' : 'Sužeidimas';
      setTm(ts, k); app.querySelectorAll('.tmq-ck').forEach(x => x.remove());
      app.querySelectorAll('.tmk[data-k="' + k + '"]').forEach(x => { x.textContent = '⏱ ' + hm(ts); });
      toast(lb + ': ' + hm(ts)); if (navigator.vibrate) navigator.vibrate(30);
      break;
    }
    case 'tm-mark': {
      const T = LS.get('mg-laikai', {}), lb = d.k === 'turn' ? 'Turniketas' : 'Sužeidimas';
      if (T[d.k]) { toast(lb + ' jau pažymėtas ' + hm(T[d.k]) + ' · keisti – pradžios ekrane'); break; }
      const ck = el.closest('.ck'), open = ck && ck.nextElementSibling && ck.nextElementSibling.classList.contains('tmq-ck');
      app.querySelectorAll('.tmq-ck').forEach(x => x.remove());
      if (ck && !open) { ck.insertAdjacentHTML('afterend', `<div class="tmq-ck"><span class="muted">${d.k === 'turn' ? 'Kada uždėtas turniketas?' : 'Kada sužeista?'}</span>${tmQuick(d.k)}</div>`); showAboveNav(ck.nextElementSibling); }
      break;
    }
    case 'tm-set': {
      const v = (document.getElementById('tm-in') || {}).value;
      if (!v) { toast('Įveskite laiką'); break; }
      const [hh, mm] = v.split(':').map(Number), t = new Date();
      t.setHours(hh, mm, 0, 0);
      let y = false;
      if (t.getTime() > Date.now() + 5 * 60000) { t.setDate(t.getDate() - 1); y = true; }
      setTm(t.getTime()); toast(y ? 'Nustatyta vakar, ' + v : 'Nustatyta ' + v); break;
    }
    case 'tm-clr': setTm(null); break;
    case 'tm-x': tmEdit = null; updTimers(); break;
    case 'ok': LS.set('mg-ok', true); el.closest('.warn').remove(); break;
    case 'w': LS.set('mg-svoris', +d.w); render(); break;
    case 'rate': {
      const R = LS.get('mg-ivert', {}), v = +d.v;
      if (R[d.id] === v) delete R[d.id]; else R[d.id] = v;
      LS.set('mg-ivert', R); render(); break;
    }
    case 'new-pt': if (confirm('Naujas sužeistasis: išvalyti sąrašų žymėjimus ir laikus? (9-Line ir MIST lieka)')) { LS.set('mg-ck', {}); LS.set('mg-laikai', {}); render(); toast('Išvalyta'); } break;
    case 'tikcls': { LS.set('mg-tikcls', !tikCLS()); IDX = null; render(); const f = app.querySelector('[data-act=tikcls]'); if (f) f.focus(); toast(tikCLS() ? 'Rodomi tik CLS veiksmai' : 'Rodomi visi veiksmai'); break; }
    case 'reset-ivert': if (confirm('Ištrinti visus įsivertinimus?')) { LS.set('mg-ivert', {}); render(); } break;
    case 'fb': FB.open(); break;
    case 'fb-flush':
      if (!FB.configured()) { alert('Pranešimų priėmimas dar neįjungtas. Pranešimai bus išsiųsti automatiškai, kai jis veiks.'); break; }
      if (!navigator.onLine) { alert('Nėra interneto ryšio.'); break; }
      el.disabled = true; FB.flush().then(n => { alert(n ? 'Išsiųsta: ' + n + '.' : 'Išsiųsti nepavyko – bandysime vėliau.'); render(); }); break;
    case 'img-dl': saveImgs(el); break;
    case 'install': if (installEv) { installEv.prompt(); installEv.userChoice.finally(() => { installEv = null; render(); }); } break;
    case 'upd':
      if (!navigator.onLine) { alert('Atnaujinti galima tik su interneto ryšiu.'); break; }
      caches.keys().then(ks => Promise.all(ks.filter(k => k !== IMG_CACHE).map(k => caches.delete(k))))
        .then(() => navigator.serviceWorker ? navigator.serviceWorker.getRegistrations() : [])
        .then(rs => Promise.all((rs || []).map(r => r.update().catch(() => {}))))
        .finally(() => location.reload());
      break;
  }
});

app.addEventListener('keydown', e => {
  const t = e.target, a = t.dataset && t.dataset.act;
  if ((e.key === 'Enter' || e.key === ' ') && (a === 'ck' || a === 'tikcls' || a === 'yt' || a === 'mp4')) { e.preventDefault(); t.click(); }
});

app.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.nl) { NL.onInput(t); return; }
  if (t.dataset.mi || t.dataset.mif) { MI.onInput(t); return; }
  if (t.id !== 'q' && t.id !== 'qs') return;
  let res = document.getElementById('res');
  if (!res) { res = document.createElement('div'); res.id = 'res'; t.after(res); }
  const v = t.value, empty = !v.trim();
  res.innerHTML = results(v);
  if (t.id === 'q') {
    Array.from(app.children).forEach(c => { if (c !== t && c !== res) c.style.display = empty ? '' : 'none'; });
    res.style.display = empty ? 'none' : '';
  } else history.replaceState(history.state, '', '#/paieska' + (empty ? '' : '?q=' + encodeURIComponent(v)));
});

setInterval(() => { if (!tmEdit) updTimers(); }, 30000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && !tmEdit) updTimers(); });
addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEv = e; if (['nustatymai', 'idiegimas', undefined].indexOf(route().p[0]) >= 0) render(); });
if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));

onNav(true);
