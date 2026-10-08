'use strict';
const E = window.ETC || {};
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
let mode = LS.get('mg-rezimas', 'field');
let tmEdit = null, installEv = null, IDX = null;

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const br = s => esc(s).replace(/\n/g, '<br>');
const fmt = x => String(x >= 100 ? Math.round(x) : x >= 1 ? Math.round(x * 10) / 10 : Math.round(x * 100) / 100).replace('.', ',');
// Lygiai: CLS – kovos gelbėtojas; CMC – kovos medikas; CPP – kovos paramedikas / gydytojas
const isAdv = g => /^(CMC|CPP)/.test(g || '');
const tikCLS = () => LS.get('mg-tikcls', false);
const ok = g => !(tikCLS() && isAdv(g));
const tag = g => isAdv(g) ? `<span class="tag ${g === 'CPP' ? 'red' : 'amb'}" title="${g === 'CPP' ? 'Kovos paramedikas / gydytojas' : 'Kovos medikas'}">${esc(g)}</span>` : '';
const row = (href, title, small, extra) => `<a class="row" href="${href}"><div>${esc(title)}${small ? '<small>' + esc(small) + '</small>' : ''}</div>${extra || ''}<span class="ar">›</span></a>`;
const notFound = () => '<h1>Nerasta</h1><p class="muted">Šio puslapio nėra. Grįžkite į pradžią.</p>';
const hm = ts => { const d = new Date(ts); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
const strip = h => String(h || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
// Lietuviškos daugiskaitos formos: lt(12, ['vaistas', 'vaistai', 'vaistų']) → '12 vaistų'
const lt = (n, f) => n + ' ' + ((n % 10 === 1 && n % 100 !== 11) ? f[0] : (n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20)) ? f[1] : f[2]);

function norm(s) {
  s = String(s || ''); let o = '';
  for (let i = 0; i < s.length; i++) {
    const n = s[i].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    o += n.length === 1 ? n : (n[0] || ' ');
  }
  return o;
}

function hl(orig, toks) {
  const n = norm(orig), r = [];
  toks.forEach(t => { let p = n.indexOf(t); while (p >= 0 && t) { r.push([p, p + t.length]); p = n.indexOf(t, p + t.length); } });
  if (!r.length) return esc(orig);
  r.sort((a, b) => a[0] - b[0]);
  const m = [];
  r.forEach(x => { const l = m[m.length - 1]; if (l && x[0] <= l[1]) l[1] = Math.max(l[1], x[1]); else m.push(x.slice()); });
  let o = '', last = 0;
  m.forEach(([a, b]) => { o += esc(orig.slice(last, a)) + '<mark>' + esc(orig.slice(a, b)) + '</mark>'; last = b; });
  return o + esc(orig.slice(last));
}

function snippet(text, toks) {
  const n = norm(text); let p = -1;
  toks.forEach(t => { const q = n.indexOf(t); if (q >= 0 && (p < 0 || q < p)) p = q; });
  if (p < 0) return '';
  let a = Math.max(0, p - 30); if (a > 0) { const sp = text.indexOf(' ', a); if (sp >= 0 && sp < p) a = sp + 1; }
  const b = Math.min(text.length, p + 110);
  return (a > 0 ? '…' : '') + hl(text.slice(a, b), toks) + (b < text.length ? '…' : '');
}

function calc(c, w) {
  let lo = (c.per != null ? c.per : c.min) * w, hi = c.max != null ? c.max * w : null;
  if (c.maxDose) { lo = Math.min(lo, c.maxDose); if (hi != null) hi = Math.min(hi, c.maxDose); }
  const u = c.u || 'mg';
  let s = hi != null ? fmt(lo) + '–' + fmt(hi) + ' ' + u : fmt(lo) + ' ' + u;
  if (c.conc) s += ' = ' + (hi != null ? fmt(lo / c.conc) + '–' + fmt(hi / c.conc) : fmt(lo / c.conc)) + ' ml';
  if (c.maxDose) s += ' (maks. ' + fmt(c.maxDose) + ' ' + u + ')';
  return s;
}

function listRoute(id) {
  for (const f of E.fazes || []) { const i = (f.lists || []).indexOf(id); if (i >= 0) return '#/f/' + f.id + (i ? '?t=' + i : ''); }
  return '#/s/' + id;
}

const ckAll = () => LS.get('mg-ck', {});
function ckToggle(id, i) {
  const all = ckAll(), a = all[id] || [], p = a.indexOf(i);
  if (p >= 0) a.splice(p, 1); else a.push(i);
  all[id] = a; LS.set('mg-ck', all);
}

function renderList(id) {
  const L = (E.sarasai || {})[id];
  if (!L) return '<p class="muted">Sąrašas nerastas.</p>';
  const done = ckAll()[id] || [];
  let n = 0, tot = 0, h = '';
  (L.items || []).forEach((it, i) => {
    if (it.h) { h += '<h3 class="clh">' + esc(it.h) + '</h3>'; return; }
    if (!ok(it.g)) return;
    tot++;
    const on = done.indexOf(i) >= 0; if (on) n++;
    const sub = (it.s || []).length ? '<ul>' + it.s.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '';
    const info = mode === 'learn' && it.i ? '<div class="muted">' + it.i + '</div>' : '';
    const T = it.tm ? LS.get('mg-laikai', {}) : null;
    const links = (it.tm ? `<button class="sk tmk" data-act="tm-mark" data-k="${it.tm}">⏱ ${T[it.tm] ? hm(T[it.tm]) : 'Dabar'}</button>` : '') + (it.sk ? `<a class="sk" href="#/igudis/${it.sk}" data-act="go" data-r="#/igudis/${it.sk}" aria-label="Įgūdis ${it.sk}">#${it.sk}</a>` : '') +
      (it.r ? `<a class="sk" href="${esc(it.r)}" data-act="go" data-r="${esc(it.r)}">${/9line/.test(it.r) ? '9-Line' : /mist/.test(it.r) ? 'MIST' : 'Dozė'}</a>` : '');
    h += `<div class="ck${on ? ' on' : ''}${it.k ? ' key' : ''}" data-act="ck" data-l="${esc(id)}" data-i="${i}" role="checkbox" aria-checked="${on}" tabindex="0"><span class="bx">✓</span><div class="t"><span class="tt">${esc(it.t)}</span> ${tag(it.g)}${sub}${info}</div>${links ? '<div class="lk">' + links + '</div>' : ''}</div>`;
  });
  const pct = tot ? Math.round(n / tot * 100) : 0;
  return `<div class="cl"><div class="muted cnt">${n} / ${tot}</div><div class="prog"><i style="width:${pct}%"></i></div>${h}</div>`;
}

function updCount(box) {
  const all = box.querySelectorAll('.ck').length, n = box.querySelectorAll('.ck.on').length;
  box.querySelector('.cnt').textContent = n + ' / ' + all;
  box.querySelector('.prog i').style.width = (all ? Math.round(n / all * 100) : 0) + '%';
}

// ───────── Laikai: sužeidimas (TXA ≤ 3 val.), turniketas (konversija ≤ 2 val., > 6 val. nenuimti) ─────────
const tmDur = m => m < 1 ? 'ką tik' : m < 60 ? m + ' min' : Math.floor(m / 60) + ' val. ' + String(m % 60).padStart(2, '0') + ' min';
const tmAgo = (ts, now) => { const m = Math.max(0, Math.floor((now - ts) / 60000)); return m < 1 ? 'ką tik' : 'prieš ' + tmDur(m); };
function timersHtml() {
  const T = LS.get('mg-laikai', {}), now = Date.now();
  const card = (k, lb, val, sub, cls) => `<button class="tmc ${cls || ''}" data-act="tm" data-k="${k}" aria-label="${lb}: ${T[k] ? 'keisti laiką' : 'pažymėti laiką'}"><span class="muted">${lb}</span><b>${val}</b>${sub ? '<small>' + sub + '</small>' : ''}</button>`;
  const txa = T.trauma ? T.trauma + 3 * 3600e3 : 0, conv = T.turn ? T.turn + 2 * 3600e3 : 0, six = T.turn ? T.turn + 6 * 3600e3 : 0;
  let h = '<div class="tmrow">';
  h += card('trauma', 'Sužeidimas', T.trauma ? hm(T.trauma) : 'Žymėti', T.trauma ? tmAgo(T.trauma, now) : 'spauskite, kai sužeista', '');
  h += card('turn', 'Turniketas', T.turn ? hm(T.turn) : 'Žymėti',
    T.turn ? tmAgo(T.turn, now) + '<br>' + (now > six ? 'praėjo 6 val. – nenuimti, palikti iki ligoninės' : now > conv ? 'praėjo 2 val. – konversija tik CMC nurodymu' : 'konversija iki ' + hm(conv)) : 'pirmojo uždėjimo laikas',
    T.turn ? (now > conv ? 'bad' : 'warn') : '');
  const left = txa ? Math.ceil((txa - now) / 60000) : 0;
  h += `<div class="tmc ${txa ? (now > txa ? 'bad' : left <= 60 ? 'warn' : '') : 'dim'}"><span class="muted">TXA iki</span><b>${txa ? (now > txa ? 'Praėjo' : hm(txa)) : '—'}</b><small>${txa ? (now > txa ? 'po 3 val. neskirti' : 'liko ' + tmDur(left)) : 'pažymėkite sužeidimą'}</small></div>`;
  h += '</div>';
  if (tmEdit) h += `<div class="card tme"><b>${tmEdit === 'trauma' ? 'Sužeidimo laikas' : 'Pirmojo turniketo uždėjimo laikas'}</b>` + tmQuick(tmEdit) +
    (tmEdit === 'turn' ? '<p class="muted">Keičiant ar perkeliant turniketą laiko nekeiskite – 2 ir 6 val. ribos skaičiuojamos nuo pirmojo uždėjimo.</p>' : '') +
    `<div class="tmb"><input type="time" id="tm-in" aria-label="Kitas laikas"><button class="btn" data-act="tm-set">Nustatyti</button><button class="btn" data-act="tm-clr">Išvalyti</button><button class="btn" data-act="tm-x">Uždaryti</button></div></div>`;
  return h;
}
// Greitas laiko pasirinkimas: dabar arba prieš 5–30 min
const tmQuick = k => `<div class="tmq" role="group" aria-label="Kada?">${[0, 5, 10, 15, 30].map(m => `<button class="btn${m ? '' : ' pri sm'}" data-act="tm-q" data-k="${k}" data-m="${m}">${m ? '−' + m + ' min' : 'Dabar'}</button>`).join('')}</div>`;
// Kompaktiška laikų juosta fazių puslapiuose ir mokymosi pradžioje (rodoma, kai bent vienas laikas pažymėtas)
function timersMini() {
  const T = LS.get('mg-laikai', {}), now = Date.now();
  if (!T.trauma && !T.turn) return '';
  const a = [];
  if (T.trauma) { const txa = T.trauma + 3 * 3600e3; a.push(`<span>Sužeista <b>${hm(T.trauma)}</b></span>`); if (ok('CMC')) a.push(`<span class="${now > txa ? 'x' : txa - now <= 3600e3 ? 'w' : ''}">TXA ${now > txa ? '<b>praėjo</b>' : 'iki <b>' + hm(txa) + '</b>'}</span>`); }
  if (T.turn) { const conv = T.turn + 2 * 3600e3; a.push(`<span class="${now > conv ? 'x' : 'w'}">Turniketas <b>${hm(T.turn)}</b> · ${tmAgo(T.turn, now)}</span>`); }
  return `<a class="tmini" href="#/" aria-label="Laikai – atidaryti pradžios ekrane">${a.join('')}</a>`;
}
function updTimers() {
  const el = document.getElementById('tm'); if (el) el.innerHTML = timersHtml();
  document.querySelectorAll('.tmini-box').forEach(b => { b.innerHTML = timersMini(); });
}
function setTm(ts, k) {
  const T = LS.get('mg-laikai', {}); k = k || tmEdit;
  if (ts) T[k] = ts; else delete T[k];
  LS.set('mg-laikai', T); tmEdit = null; updTimers();
}

function disclaimer() {
  if (LS.get('mg-ok', false)) return '';
  return '<div class="warn"><b>Atminties priemonė.</b> Skirta TCCC CLS / CMC kursą baigusiems šauliams gelbėtojams. Nepakeičia mokymų, vieneto SOP ir mediko nurodymų. Vaistai – tik pagal kompetenciją.<div style="margin-top:8px"><button class="btn" data-act="ok">Supratau</button></div></div>';
}

function videoHtml(v) {
  const u = v.url || '', m = u.match(/(?:youtu\.be\/|[?&]v=|shorts\/|embed\/)([\w-]{11})/);
  const cap = '<div class="vcap"><b>' + esc(v.title || 'Vaizdo įrašas') + '</b>' + (v.ch || v.note ? '<small>' + esc([v.ch, v.note].filter(Boolean).join(' · ')) + '</small>' : '') + '</div>';
  if (m) return `<div class="vbox"><div class="video vthumb" role="button" tabindex="0" data-act="yt" data-id="${m[1]}" aria-label="Paleisti: ${esc(v.title || 'video')}" style="background-image:url('https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg')"><span class="play">▶</span></div>${cap}<a class="muted" href="https://www.youtube.com/watch?v=${m[1]}" target="_blank" rel="noopener">Atidaryti YouTube ↗</a></div>`;
  if (/\.(mp4|webm)(\?|$)/i.test(u)) return `<div class="vbox"><div class="video vthumb vmp4" role="button" tabindex="0" data-act="mp4" data-src="${esc(u)}" aria-label="Paleisti: ${esc(v.title || 'video')}"><span class="vt">${esc(v.title || 'Vaizdo įrašas')}</span><span class="play">▶</span></div>${cap}${v.page ? `<a class="muted" href="${esc(v.page)}" target="_blank" rel="noopener">Atidaryti tccc.org.ua ↗</a>` : ''}</div>`;
  return `<a class="row" href="${esc(u)}" target="_blank" rel="noopener">${esc(v.title || u)}<span class="ar">↗</span></a>`;
}

// Paieška: žodžio pradžios atitikmuo, lietuviškos galūnės nukerpamos (akis → aki*, radijas → radij*)
const ENDS = ['iams', 'iems', 'ais', 'ams', 'oms', 'ems', 'ies', 'iai', 'iui', 'iu', 'as', 'is', 'ys', 'us', 'os', 'es', 'ai', 'ei', 'ui', 'a', 'e', 'i', 'o', 'u', 'y', 's'];
function stem(t) {
  if (t.length < 4 || /\d/.test(t)) return t;
  for (const e of ENDS) if (t.endsWith(e) && t.length - e.length >= 3) return t.slice(0, -e.length);
  return t;
}
const words = s => ' ' + norm(s).replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
const qToks = q => words(q).trim().split(' ').filter(Boolean).map(stem);

function buildIdx() {
  const I = [];
  const add = (kind, title, sub, text, r) => I.push({ kind, title, sub: sub || '', text: text || '', r, w: words(title + ' ' + (sub || '') + ' ' + (text || '')), wt: words(title), ws: words(sub || '') });
  const J = a => a.filter(Boolean).join(' · ');
  (E.vaistai || []).filter(v => ok(v.lygis)).forEach(v => add('Vaistai', v.name, v.klase,
    J([v.ind, v.kontra, (v.dozes || []).map(d => d.k + ' ' + d.d + ' ' + (d.p || '')).join(' · '), v.pakuote, (v.pastabos || []).join(' · '), (v.ispejimai || []).join(' · ')]),
    '#/vaistas/' + v.id));
  (E.igudziai || []).filter(s => ok(s.lygis)).forEach(s => add('Įgūdžiai', s.pav, '#' + s.id + ' · ' + (s.lygis || '') + ' · ' + (s.fazes || []).join(', '),
    J([s.aprasas, (s.esme || []).join(' · '), (s.zingsniai || []).join(' · '), (s.klaidos || []).join(' · '), (s.tccc || []).join(' · '), (s.video || []).map(v => v.title).join(' · ')]), '#/igudis/' + s.id));
  (E.temos || []).forEach(t => add('Mokymosi temos', t.pav, t.sub, '', '#/tema/' + t.id));
  Object.keys(E.sarasai || {}).forEach(id => {
    const L = E.sarasai[id], r = listRoute(id);
    (L.items || []).forEach(it => { if (!it.h && ok(it.g)) add('Kontroliniai sąrašai', L.title, it.t, J([(it.s || []).join(' · '), strip(it.i)]), r); });
  });
  Object.keys(E.puslapiai || {}).forEach(id => { const p = E.puslapiai[id]; add('Mokymosi temos', p.title, p.sub, strip(p.html), '#/p/' + id); });
  add('Įrankiai', '9 eilučių MEDEVAC prašymas', '9-Line forma su kodais', 'medevac evakuacija koordinatės skubumas urgent priority routine radijas', '#/9line');
  add('Įrankiai', 'MIST perdavimas', 'Mechanizmas, sužalojimai, požymiai, gydymas', 'mist perdavimas handover sužeistasis', '#/mist');
  return I;
}

function results(q) {
  const toks = qToks(q);
  if (!toks.length) return '<p class="muted">Ieškokite vaisto, įgūdžio ar veiksmo. Lietuviškos raidės nebūtinos.</p>';
  IDX = IDX || buildIdx();
  const hit = (w, t) => w.indexOf(' ' + t) >= 0;
  const hits = IDX.filter(e => toks.every(t => hit(e.w, t))).map(e => {
    let sc = 0;
    toks.forEach(t => { if (hit(e.wt, t)) sc += 10; if (e.wt.indexOf(' ' + t + ' ') >= 0) sc += 4; if (e.wt.indexOf(' ' + t) === 0) sc += 5; if (hit(e.ws, t)) sc += 3; });
    if (e.kind === 'Vaistai' && toks.some(t => hit(e.wt, t))) sc += 3;
    if (e.kind === 'Įrankiai') sc += 2;
    return { e, sc };
  }).sort((a, b) => b.sc - a.sc);
  if (!hits.length) return '<p class="muted">Nieko nerasta. Pabandykite trumpesnį žodį.</p>';
  const rowH = (e, kind) => {
    const inHead = toks.every(t => hit(e.wt, t) || hit(e.ws, t));
    const sn = inHead ? '' : snippet(e.text, toks);
    return `<a class="row" href="${e.r}"><div>${hl(e.title, toks)}<small>${kind ? esc(e.kind) + (e.sub ? ' · ' : '') : ''}${e.sub ? hl(e.sub, toks) : ''}</small>${sn ? '<span class="sn">' + sn + '</span>' : ''}</div><span class="ar">›</span></a>`;
  };
  // Geriausi atitikmenys (pavadinime) – pirmiausia, nepriklausomai nuo grupės
  const seen = {}, top = hits.filter(x => x.sc >= 10 && !seen[x.e.r + x.e.title] && (seen[x.e.r + x.e.title] = 1)).slice(0, 6), rest = hits.filter(x => top.indexOf(x) < 0);
  const groups = [];
  rest.forEach(x => { let g = groups.find(y => y.k === x.e.kind); if (!g) groups.push(g = { k: x.e.kind, a: [] }); g.a.push(x); });
  return (top.length ? '<h2>Geriausi atitikmenys</h2>' + top.map(({ e }) => rowH(e, true)).join('') : '') +
    groups.map(g => `<h2>${g.k}${top.length ? ' – dar ' : ' · '}${g.a.length}</h2>` + g.a.slice(0, 20).map(({ e }) => rowH(e, false)).join('')).join('');
}
