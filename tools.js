'use strict';
// March gidas – įrankiai: 9 eilučių MEDEVAC prašymas (NL), MIST perdavimas (MI), MGRS koordinatės, kopijavimas, skaitymo režimas.

// ───────── WGS84 → MGRS (8 skaitmenų = 10 m tikslumas) ─────────
function toMGRS(lat, lon, digits) {
  digits = digits || 4;
  if (!(lat >= -80 && lat <= 84) || !(lon >= -180 && lon <= 180)) return null;
  let zone = Math.floor((lon + 180) / 6) + 1;
  if (lon === 180) zone = 60;
  if (lat >= 56 && lat < 64 && lon >= 3 && lon < 12) zone = 32;
  if (lat >= 72) { if (lon >= 0 && lon < 9) zone = 31; else if (lon >= 9 && lon < 21) zone = 33; else if (lon >= 21 && lon < 33) zone = 35; else if (lon >= 33 && lon < 42) zone = 37; }
  const a = 6378137, f = 1 / 298.257223563, k0 = 0.9996, e2 = f * (2 - f), ep2 = e2 / (1 - e2);
  const p = lat * Math.PI / 180, l = lon * Math.PI / 180, l0 = ((zone - 1) * 6 - 180 + 3) * Math.PI / 180;
  const sp = Math.sin(p), cp = Math.cos(p), tp = Math.tan(p);
  const N = a / Math.sqrt(1 - e2 * sp * sp), T = tp * tp, C = ep2 * cp * cp, A = cp * (l - l0);
  const M = a * ((1 - e2 / 4 - 3 * e2 * e2 / 64 - 5 * e2 ** 3 / 256) * p - (3 * e2 / 8 + 3 * e2 * e2 / 32 + 45 * e2 ** 3 / 1024) * Math.sin(2 * p) +
    (15 * e2 * e2 / 256 + 45 * e2 ** 3 / 1024) * Math.sin(4 * p) - (35 * e2 ** 3 / 3072) * Math.sin(6 * p));
  const E = k0 * N * (A + (1 - T + C) * A ** 3 / 6 + (5 - 18 * T + T * T + 72 * C - 58 * ep2) * A ** 5 / 120) + 500000;
  let Nn = k0 * (M + N * tp * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * A ** 4 / 24 + (61 - 58 * T + T * T + 600 * C - 330 * ep2) * A ** 6 / 720));
  if (lat < 0) Nn += 10000000;
  const band = 'CDEFGHJKLMNPQRSTUVWXX'[Math.floor((lat + 80) / 8)];
  const set = ((zone - 1) % 6) + 1;
  const col = ['ABCDEFGH', 'JKLMNPQR', 'STUVWXYZ'][(set - 1) % 3][Math.floor(E / 100000) - 1];
  let ri = Math.floor(Nn / 100000) % 20;
  if (set % 2 === 0) ri = (ri + 5) % 20;
  const rowL = 'ABCDEFGHJKLMNPQRSTUV'[ri];
  const q = 10 ** (5 - digits);
  const es = String(Math.floor((E % 100000) / q)).padStart(digits, '0'), ns = String(Math.floor((Nn % 100000) / q)).padStart(digits, '0');
  return zone + band + ' ' + col + rowL + ' ' + es + ' ' + ns;
}

// ───────── bendri pagalbininkai ─────────
function toast(t) {
  let el = document.getElementById('toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.textContent = t; el.className = 'show';
  clearTimeout(toast.tm); toast.tm = setTimeout(() => { el.className = ''; }, 2600);
}
function copyText(t) {
  const done = () => toast('Nukopijuota');
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t).then(done, () => fallback());
  fallback();
  function fallback() {
    const ta = document.createElement('textarea'); ta.value = t; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { toast('Nepavyko nukopijuoti'); }
    ta.remove();
  }
}
function shareText(title, t) {
  if (navigator.share) navigator.share({ title, text: t }).catch(() => {});
  else copyText(t);
}
function readMode(title, lines) {
  let el = document.getElementById('rd');
  if (!el) {
    el = document.createElement('div'); el.id = 'rd'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    el.addEventListener('click', e => { if (e.target.closest('[data-rd=x]')) closeRead(); });
    document.body.appendChild(el);
  }
  el.innerHTML = `<div class="rdp"><div class="rdh"><b>${esc(title)}</b><button class="ib" data-rd="x" aria-label="Uždaryti"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>` +
    lines.map(x => `<div class="rdl">${x}</div>`).join('') + '<p class="muted">Uždaryti – ✕ arba mygtukas „Atgal“.</p></div>';
  el.hidden = false; document.documentElement.classList.add('fbopen');
  try { history.pushState(Object.assign({}, history.state, { rd: 1 }), ''); } catch (e) {}
}
function closeRead() {
  const el = document.getElementById('rd'); if (!el || el.hidden) return;
  el.hidden = true; document.documentElement.classList.remove('fbopen');
  if (history.state && history.state.rd) history.back();
}
addEventListener('keydown', e => { if (e.key === 'Escape') closeRead(); });
addEventListener('popstate', () => { const el = document.getElementById('rd'); if (el && !el.hidden && !(history.state && history.state.rd)) { el.hidden = true; document.documentElement.classList.remove('fbopen'); } });
const chip = (act, k, on, lb, extra) => `<button class="${on ? 'on' : ''}" data-act="${act}" data-k="${esc(k)}"${extra || ''}>${lb}</button>`;
const stepper = (act, k, v, lb, sub) => `<div class="stp"><div><b>${lb}</b>${sub ? '<small>' + sub + '</small>' : ''}</div><button data-act="${act}" data-k="${k}" data-d="-1" aria-label="Mažiau: ${esc(lb)}">−</button><span class="sv">${v}</span><button data-act="${act}" data-k="${k}" data-d="1" aria-label="Daugiau: ${esc(lb)}">+</button></div>`;
const nowHM = () => hm(Date.now());

// ───────── 9 eilučių MEDEVAC ─────────
const NL = (() => {
  const KEY = 'mg-9line';
  const def = () => ({ peace: false, l1: '', freq: '', cs: '', sfx: '', p: { A: 0, B: 0, C: 0, D: 0, E: 0 }, eq: [], lit: 0, amb: 0, sec: '', wounds: '', mark: '', markTxt: '', nat: { A: 0, B: 0, C: 0, D: 0, E: 0 }, cbrn: [], terrain: '' });
  const get = () => {
    const raw = LS.get(KEY, {}), d = def(), s = Object.assign(d, raw && typeof raw === 'object' ? raw : {});
    ['l1', 'freq', 'cs', 'sfx', 'sec', 'wounds', 'mark', 'markTxt', 'terrain'].forEach(k => { if (typeof s[k] !== 'string') s[k] = s[k] == null ? '' : String(s[k]); });
    ['eq', 'cbrn'].forEach(k => { if (!Array.isArray(s[k])) s[k] = []; });
    s.lit = +s.lit || 0; s.amb = +s.amb || 0; s.peace = !!s.peace;
    s.p = Object.assign(def().p, s.p); s.nat = Object.assign(def().nat, s.nat); return s;
  };
  const save = s => LS.set(KEY, s);
  const PREC = [['A', 'Skubi', 'Urgent'], ['B', 'Skubi chirurginė', 'Urgent surgical'], ['C', 'Prioritetinė', 'Priority'], ['D', 'Įprastinė', 'Routine'], ['E', 'Patogumo', 'Convenience']];
  const EQ = [['A', 'Nereikia'], ['B', 'Gervė (hoist)'], ['C', 'Ištraukimo įranga'], ['D', 'Plaučių ventiliatorius']];
  const SEC = [['N', 'Priešo nėra'], ['P', 'Galimas priešas'], ['E', 'Priešas yra – artėti atsargiai'], ['X', 'Priešas yra – reikia ginkluotos palydos']];
  const MARK = [['A', 'Skydai'], ['B', 'Pirotechnika'], ['C', 'Dūmai'], ['D', 'Nežymima'], ['E', 'Kita']];
  const NAT = [['A', 'Savos ir sąjungininkų (koalicijos) pajėgos'], ['B', 'Savos šalies ir sąjungininkų civiliai'], ['C', 'Ne koalicijos kariai ar saugumo pajėgos'], ['D', 'Ne koalicijos civiliai'], ['E', 'Priešo kariai ar sulaikytieji']];
  const CBRN = [['N', 'Branduolinis'], ['B', 'Biologinis'], ['C', 'Cheminis'], ['R', 'Radiologinis (jei numato SOP)'], ['-', 'Nėra']];
  const counts = o => Object.keys(o).filter(k => o[k] > 0).map(k => k + o[k]).join(' BREAK ');
  const TITLES = ['Paėmimo vietos koordinatės', 'Dažnis, šaukinys, priesaga', 'Sužeistieji pagal skubumą', 'Specialioji įranga', 'Sužeistieji pagal tipą', 'Paėmimo vietos saugumas', 'Vietos žymėjimas', 'Pilietybė ir statusas', 'CBRN užterštumas'];

  function lines(s) {
    return [
      s.l1.trim().toUpperCase().replace(/\s+/g, ' '),
      [s.freq.trim(), s.cs.trim(), s.sfx.trim() ? 'priesaga ' + s.sfx.trim() : ''].filter(Boolean).join(', '),
      counts(s.p),
      s.eq.slice().sort().join(', '),
      [s.lit ? 'L' + s.lit : '', s.amb ? 'A' + s.amb : ''].filter(Boolean).join(' BREAK '),
      s.peace ? s.wounds.trim() : s.sec,
      s.mark ? s.mark + (s.markTxt.trim() ? ' – ' + s.markTxt.trim() : '') : '',
      counts(s.nat),
      s.peace ? s.terrain.trim() : (s.cbrn.indexOf('-') >= 0 ? 'Nėra' : s.cbrn.join(', '))
    ];
  }
  // Kodų reikšmės skaitymo režimui (mažu šriftu po kodu)
  const nm = (L, k) => (L.find(x => x[0] === k) || [k, k])[1];
  function meaning(s) {
    const cnt = (o, L) => Object.keys(o).filter(k => o[k] > 0).map(k => nm(L, k).toLowerCase() + ' ' + o[k]).join(', ');
    return [
      '', '', cnt(s.p, PREC.map(x => [x[0], x[1]])),
      s.eq.slice().sort().map(k => nm(EQ, k).toLowerCase()).join(', '),
      [s.lit ? 'neštuvuose ' + s.lit : '', s.amb ? 'vaikštantys ' + s.amb : ''].filter(Boolean).join(', '),
      s.peace ? '' : (s.sec ? nm(SEC, s.sec).toLowerCase() : ''),
      s.mark ? nm(MARK, s.mark).toLowerCase() : '',
      cnt(s.nat, NAT),
      s.peace ? '' : s.cbrn.filter(k => k !== '-').map(k => nm(CBRN, k).toLowerCase()).join(', ')
    ];
  }
  const titles = s => TITLES.map((t, i) => s.peace && i === 5 ? 'Sužalojimų skaičius ir tipas' : s.peace && i === 8 ? 'Vietovės aprašymas' : t);
  const text = s => '9-LINE MEDEVAC (' + nowHM() + ')\n' + lines(s).map((x, i) => (i + 1) + '. ' + (x || '—')).join('\n');
  function status() {
    const L = lines(get()), n = L.slice(0, 5).filter(Boolean).length, all = L.filter(Boolean).length;
    return all ? (n < 5 ? `Būtinos ${n}/5 · iš viso ${all}/9` : `Užpildyta ${all}/9 eilučių`) : 'Pildyti prašymą';
  }

  function card(n, s, body, hint) {
    const v = lines(s)[n - 1];
    return `<section class="nl${v ? ' ok' : ''}${n <= 5 ? ' req' : ''}"><div class="nlh"><span class="nn">${n}</span><b>${esc(titles(s)[n - 1])}</b>${n <= 5 ? '<small class="rq">būtina</small>' : ''}</div>${hint ? '<p class="muted">' + hint + '</p>' : ''}${body}</section>`;
  }

  function view() {
    const s = get(), L = lines(s), req = L.slice(0, 5).filter(Boolean).length;
    let h = '<h1>9 eilučių MEDEVAC prašymas</h1>';
    h += `<div class="seg2" role="group" aria-label="Situacija">${chip('nl-peace', '0', !s.peace, 'Karo metu')}${chip('nl-peace', '1', s.peace, 'Taikos metu')}</div>`;
    h += `<div class="nlprog"><div class="prog"><i style="width:${req * 20}%"></i></div><small class="muted">Būtinos 1–5 eilutės: ${req} / 5. Prieš kviesdami surinkite visą informaciją; kodus ir ryšio saugumą – pagal SOP.</small></div>`;
    h += card(1, s, `<input class="inp" data-nl="l1" value="${esc(s.l1)}" placeholder="pvz. 35U LA 1234 5678" autocomplete="off" autocapitalize="characters" spellcheck="false"><button class="btn sm" data-act="nl-gps">📍 Mano vieta (GPS → MGRS)</button>`, '8 skaitmenų tinklelio koordinatė (MGRS). GPS koordinates patikrinkite žemėlapyje.');
    h += card(2, s, `<div class="in3"><input class="inp" data-nl="freq" value="${esc(s.freq)}" placeholder="Dažnis" inputmode="decimal" autocomplete="off"><input class="inp" data-nl="cs" value="${esc(s.cs)}" placeholder="Šaukinys" autocomplete="off"><input class="inp" data-nl="sfx" value="${esc(s.sfx)}" placeholder="Priesaga" autocomplete="off"></div>`, 'Paėmimo vietos (ne retransliatoriaus) dažnis.');
    h += card(3, s, PREC.map(([k, lt, en]) => stepper('nl-p', k, s.p[k], k + ' – ' + lt, en)).join(''), 'Kiekvienai kategorijai – sužeistųjų skaičius. <a href="#/p/devynios">Kategorijų paaiškinimas</a>.');
    h += card(4, s, '<div class="opts">' + EQ.map(([k, t]) => chip('nl-eq', k, s.eq.indexOf(k) >= 0, k + ' – ' + t)).join('') + '</div>');
    h += card(5, s, stepper('nl-lit', 'lit', s.lit, 'L – neštuvuose', 'Litter') + stepper('nl-amb', 'amb', s.amb, 'A – vaikštantys', 'Ambulatory'));
    h += s.peace ? card(6, s, `<textarea class="inp" data-nl="wounds" rows="2" placeholder="pvz. 2 šautinės žaizdos, 1 lūžis">${esc(s.wounds)}</textarea>`)
      : card(6, s, '<div class="opts">' + SEC.map(([k, t]) => chip('nl-sec', k, s.sec === k, k + ' – ' + t)).join('') + '</div>');
    h += card(7, s, '<div class="opts">' + MARK.map(([k, t]) => chip('nl-mark', k, s.mark === k, k + ' – ' + t)).join('') + `</div><input class="inp" data-nl="markTxt" value="${esc(s.markTxt)}" placeholder="Patikslinimas, pvz. žali dūmai" autocomplete="off">`);
    h += card(8, s, NAT.map(([k, t]) => stepper('nl-nat', k, s.nat[k], k + ' – ' + t)).join(''), 'Koalicijos versija (JTS kortelėje – JAV / ne JAV). Vadovaukitės vieneto SOP.');
    h += s.peace ? card(9, s, `<textarea class="inp" data-nl="terrain" rows="2" placeholder="pvz. lygus laukas, šiaurėje elektros linija">${esc(s.terrain)}</textarea>`)
      : card(9, s, '<div class="opts">' + CBRN.map(([k, t]) => chip('nl-cbrn', k, s.cbrn.indexOf(k) >= 0, (k === '-' ? '' : k + ' – ') + t)).join('') + '</div>');
    h += `<section class="outp"><div class="nlh"><b>Perduoti</b></div><pre id="nl-out">${esc(text(s))}</pre>` +
      '<div class="acts"><button class="btn pri" data-act="nl-read">Skaityti per radiją</button><button class="btn" data-act="nl-copy">Kopijuoti</button><button class="btn" data-act="nl-share">Bendrinti</button><button class="btn" data-act="nl-clear">Išvalyti</button></div></section>';
    h += row('#/igudis/32', 'Kaip perduoti 9-Line ir MIST', 'Įgūdis #32') + row('#/mist', 'MIST perdavimas', MI.status());
    return h;
  }

  function act(el) {
    const s = get(), d = el.dataset, k = d.k;
    switch (d.act) {
      case 'nl-peace': s.peace = k === '1'; break;
      case 'nl-p': s.p[k] = Math.max(0, Math.min(99, (s.p[k] || 0) + (+d.d))); break;
      case 'nl-nat': s.nat[k] = Math.max(0, Math.min(99, (s.nat[k] || 0) + (+d.d))); break;
      case 'nl-lit': s.lit = Math.max(0, Math.min(99, s.lit + (+d.d))); break;
      case 'nl-amb': s.amb = Math.max(0, Math.min(99, s.amb + (+d.d))); break;
      case 'nl-eq': { if (k === 'A') s.eq = s.eq.indexOf('A') >= 0 ? [] : ['A']; else { s.eq = s.eq.filter(x => x !== 'A'); const i = s.eq.indexOf(k); if (i >= 0) s.eq.splice(i, 1); else s.eq.push(k); } break; }
      case 'nl-sec': s.sec = s.sec === k ? '' : k; break;
      case 'nl-mark': s.mark = s.mark === k ? '' : k; break;
      case 'nl-cbrn': { if (k === '-') s.cbrn = s.cbrn.indexOf('-') >= 0 ? [] : ['-']; else { s.cbrn = s.cbrn.filter(x => x !== '-'); const i = s.cbrn.indexOf(k); if (i >= 0) s.cbrn.splice(i, 1); else s.cbrn.push(k); } break; }
      case 'nl-copy': return copyText(text(s));
      case 'nl-share': return shareText('9-Line MEDEVAC', text(s));
      case 'nl-read': { const M = meaning(s); return readMode('9-Line MEDEVAC', lines(s).map((x, i) => `<span class="rn">${i + 1}</span>${esc(x || '—')}<small>${esc(titles(s)[i])}${M[i] ? ' · ' + esc(M[i]) : ''}</small>`)); }
      case 'nl-clear': if (!confirm('Išvalyti visą 9-Line prašymą?')) return; LS.set(KEY, def()); render(); return;
      case 'nl-gps': return gps();
      default: return;
    }
    save(s); render();
  }

  function gps() {
    if (!navigator.geolocation) return toast('Šis įrenginys vietos nustatymo nepalaiko');
    toast('Nustatoma vieta…');
    navigator.geolocation.getCurrentPosition(pos => {
      const m = toMGRS(pos.coords.latitude, pos.coords.longitude, 4);
      if (!m) return toast('Šiai vietovei MGRS netaikomas');
      const s = get(); s.l1 = m; save(s); render();
      toast('Vieta nustatyta, tikslumas ±' + Math.round(pos.coords.accuracy) + ' m');
    }, err => toast(err.code === 1 ? 'Vietos nustatymas neleidžiamas – leiskite naršyklės nustatymuose' : 'Nepavyko nustatyti vietos'), { enableHighAccuracy: true, timeout: 20000, maximumAge: 30000 });
  }

  function onInput(t) {
    const s = get(); s[t.dataset.nl] = t.value; save(s);
    const o = document.getElementById('nl-out'); if (o) o.textContent = text(s);
    const sec = t.closest('section.nl'); if (sec) { const n = [...document.querySelectorAll('section.nl')].indexOf(sec); sec.classList.toggle('ok', !!lines(s)[n]); }
  }
  return { view, act, onInput, status, lines, text };
})();

// ───────── MIST ─────────
const MI = (() => {
  const KEY = 'mg-mist';
  const MECH = ['Šautinis', 'Sprogimas / IED', 'Skeveldros', 'Mina', 'Kritimas', 'Transporto avarija', 'Nudegimas', 'Suspaudimas', 'Kita'];
  const INJ = ['Galva', 'Veidas', 'Akis', 'Kaklas', 'Krūtinė', 'Pilvas', 'Dubuo / tarpvietė', 'Nugara', 'Kairė ranka', 'Dešinė ranka', 'Kairė koja', 'Dešinė koja', 'Amputacija', 'Nudegimai'];
  const TX = [['Turniketas'], ['Tamponavimas'], ['Spaudžiamasis tvarstis'], ['Jungties turniketas', 'CMC'], ['Krūtinės lipdukas'], ['NDC'], ['NPA'], ['Šoninė padėtis'], ['Ambu maišas'], ['Krikotiroidotomija', 'CMC'],
    ['Dubens diržas', 'CMC'], ['IV / IO', 'CMC'], ['TXA', 'CMC'], ['Kraujas', 'CMC'], ['Kalcis', 'CMC'], ['Hipotermijos prevencija'], ['Akies skydelis'], ['CWMP'], ['Ketaminas', 'CMC'], ['Antibiotikas'], ['Įtvaras'], ['Nudegimų tvarsčiai']];
  const PREC = [['A', 'Skubi'], ['B', 'Skubi chir.'], ['C', 'Prioritetinė'], ['D', 'Įprastinė'], ['E', 'Patogumo']];
  const AVPU = [['A', 'Budrus'], ['V', 'Reaguoja į balsą'], ['P', 'Reaguoja į skausmą'], ['U', 'Nereaguoja']];
  const SITE = ['Radialinis', 'Miego', 'Nečiuopiamas'];
  const blank = (n, first) => { const T = first ? LS.get('mg-laikai', {}) : {}; return Object.assign(DEF(), { nr: String(n), t0: T.trauma ? hm(T.trauma) : '', tq: T.turn ? hm(T.turn) : '' }); };
  const DEF = () => ({ nr: '', cat: '', age: '', mech: [], mechTxt: '', t0: '', inj: [], injTxt: '', vit: [], f: { av: '', hr: '', hrs: '', rr: '', spo2: '', bp: '', pain: '' }, tx: [], txTxt: '', tq: '', txa: '', note: '' });
  const fix = p => { const d = DEF(), o = Object.assign(d, p && typeof p === 'object' ? p : {}); o.f = Object.assign(DEF().f, p && p.f); ['mech', 'inj', 'vit', 'tx'].forEach(k => { if (!Array.isArray(o[k])) o[k] = []; }); ['nr', 'cat', 'age', 'mechTxt', 't0', 'injTxt', 'txTxt', 'tq', 'txa', 'note'].forEach(k => { if (typeof o[k] !== 'string') o[k] = o[k] == null ? '' : String(o[k]); }); return o; };
  const get = () => { const s = LS.get(KEY, null); if (!s || !Array.isArray(s.pts)) return { cur: 0, seq: 0, pts: [] }; s.pts = s.pts.map(fix); s.cur = Math.max(0, Math.min(+s.cur || 0, s.pts.length - 1)); return s; };
  const save = s => LS.set(KEY, s);
  const cur = s => s.pts[Math.min(s.cur, s.pts.length - 1)];
  function status() { const n = get().pts.length; return n ? lt(n, ['sužeistasis', 'sužeistieji', 'sužeistųjų']) : 'Pridėti sužeistąjį'; }

  function vitLine(v) {
    return [v.ts, v.av ? 'AVPU ' + v.av : '', v.hr ? 'P ' + v.hr + (v.hrs ? ' (' + v.hrs.toLowerCase() + ')' : '') : (v.hrs === 'Nečiuopiamas' ? 'pulsas nečiuopiamas' : ''), v.rr ? 'KD ' + v.rr : '', v.spo2 ? 'SpO₂ ' + v.spo2 + ' %' : '', v.bp ? 'AKS ' + v.bp : '', v.pain !== '' && v.pain != null ? 'skausmas ' + v.pain + '/10' : '']
      .filter(Boolean).join(', ').replace(/^(\d\d:\d\d), /, '$1 – ');
  }
  const lc = a => a.map((x, i) => /[A-Z]{2,}/.test(x) ? x : x.toLowerCase()).join(', ').replace(/^./, c => c.toUpperCase());
  function text(p) {
    const cat = PREC.find(x => x[0] === p.cat);
    const tx = p.tx.map(t => t === 'Turniketas' && p.tq ? 'Turniketas ' + p.tq : t === 'TXA' && p.txa ? 'TXA ' + p.txa : t);
    return [
      'MIST – sužeistasis ' + (p.nr || '?') + (cat ? ' · ' + cat[0] + ' (' + cat[1].toLowerCase() + ')' : '') + (p.age ? ' · ' + p.age + ' m.' : ''),
      'M: ' + ([lc(p.mech), p.mechTxt.trim()].filter(Boolean).join('; ') || '—') + (p.t0 ? '; sužeista ' + p.t0 : ''),
      'I: ' + ([lc(p.inj), p.injTxt.trim()].filter(Boolean).join('; ') || '—'),
      'S: ' + (p.vit.length ? p.vit.slice().reverse().map(vitLine).join('\n   ') : '—'),
      'T: ' + ([lc(tx), p.txTxt.trim()].filter(Boolean).join('; ') || '—')
    ].join('\n') + (p.note.trim() ? '\nPastabos: ' + p.note.trim() : '');
  }

  function view() {
    const s = get();
    let h = '<h1>MIST perdavimas</h1>';
    h += '<div class="ptabs" role="tablist">' + s.pts.map((p, i) => `<button class="${i === s.cur ? 'on' : ''}" data-act="mi-sel" data-k="${i}" role="tab" aria-selected="${i === s.cur}">${esc(p.nr || i + 1)}${p.cat ? '<small>' + esc(p.cat) + '</small>' : ''}</button>`).join('') +
      '<button class="add" data-act="mi-add">＋ Sužeistasis</button></div>';
    if (!s.pts.length) return h + '<div class="card empty"><p>Dar nėra sužeistųjų.</p><p class="muted">Paspauskite „＋ Sužeistasis“. Sužeidimo ir turniketo laikai bus paimti iš pradžios ekrano laikmačių.</p><button class="btn pri" data-act="mi-add">＋ Pridėti sužeistąjį</button></div>' + row('#/igudis/34', 'Kaip perduoti sužeistąjį', 'Įgūdis #34');
    const p = cur(s), F = p.f;
    h += `<section class="nl"><div class="in2"><label>Nr. / šaukinys<input class="inp" data-mi="nr" value="${esc(p.nr)}" autocomplete="off"></label><label>Amžius<input class="inp" data-mi="age" value="${esc(p.age)}" inputmode="numeric" autocomplete="off" placeholder="nebūtina"></label></div>` +
      '<div class="lbl">Evakuacijos skubumas</div><div class="opts">' + PREC.map(([k, t]) => chip('mi-cat', k, p.cat === k, k + ' – ' + t)).join('') + '</div></section>';
    h += '<section class="nl"><div class="nlh"><span class="nn">M</span><b>Mechanizmas</b></div><div class="opts">' + MECH.map(m => chip('mi-mech', m, p.mech.indexOf(m) >= 0, m)).join('') + '</div>' +
      `<input class="inp" data-mi="mechTxt" value="${esc(p.mechTxt)}" placeholder="Patikslinimas" autocomplete="off"><div class="tline"><span>Sužeidimo laikas</span><input type="time" class="inp" data-mi="t0" value="${esc(p.t0)}"><button class="btn sm" data-act="mi-now" data-k="t0">Dabar</button></div></section>`;
    h += '<section class="nl"><div class="nlh"><span class="nn">I</span><b>Sužalojimai</b></div><div class="opts">' + INJ.map(m => chip('mi-inj', m, p.inj.indexOf(m) >= 0, m)).join('') + '</div>' +
      `<textarea class="inp" data-mi="injTxt" rows="2" placeholder="pvz. amputacija žemiau kairio kelio; šautinė žaizda dešinėje krūtinės pusėje">${esc(p.injTxt)}</textarea></section>`;
    h += '<section class="nl"><div class="nlh"><span class="nn">S</span><b>Simptomai ir rodikliai</b></div>' +
      '<div class="lbl">Sąmonė (AVPU)</div><div class="opts">' + AVPU.map(([k, t]) => chip('mi-av', k, F.av === k, `<b>${k}</b> ${t}`)).join('') + '</div>' +
      `<div class="vgrid"><label>Pulsas<input class="inp" data-mif="hr" value="${esc(F.hr)}" inputmode="numeric" placeholder="k./min"></label><label>Kvėp. dažnis<input class="inp" data-mif="rr" value="${esc(F.rr)}" inputmode="numeric" placeholder="k./min"></label><label>SpO₂<input class="inp" data-mif="spo2" value="${esc(F.spo2)}" inputmode="numeric" placeholder="%"></label><label>AKS<input class="inp" data-mif="bp" value="${esc(F.bp)}" inputmode="text" placeholder="90/60"></label><label>Skausmas<input class="inp" data-mif="pain" value="${esc(F.pain)}" inputmode="numeric" placeholder="0–10"></label></div>` +
      '<div class="lbl">Kur čiuopiamas pulsas</div><div class="opts">' + SITE.map(m => chip('mi-hrs', m, F.hrs === m, m)).join('') + '</div>' +
      '<button class="btn pri" data-act="mi-vit">Įrašyti rodiklius (su dabartiniu laiku)</button>' +
      (p.vit.length ? '<div class="vlist">' + p.vit.slice().reverse().map((v, i) => `<div class="vr"><span>${esc(vitLine(v))}</span><button class="x" data-act="mi-vdel" data-k="${p.vit.length - 1 - i}" aria-label="Ištrinti įrašą">×</button></div>`).join('') + '</div>' : '<p class="muted">Rodiklius kartokite kas 5–10 min ir po kiekvieno perkėlimo.</p>') + '</section>';
    h += '<section class="nl"><div class="nlh"><span class="nn">T</span><b>Gydymas</b></div><div class="opts">' + TX.filter(([, g]) => ok(g)).map(([m, g]) => chip('mi-tx', m, p.tx.indexOf(m) >= 0, m + (g ? ' <small>' + g + '</small>' : ''))).join('') + '</div>' +
      `<div class="tline"><span>Turniketo laikas</span><input type="time" class="inp" data-mi="tq" value="${esc(p.tq)}"><button class="btn sm" data-act="mi-now" data-k="tq">Dabar</button></div>` +
      (ok('CMC') ? `<div class="tline"><span>TXA laikas</span><input type="time" class="inp" data-mi="txa" value="${esc(p.txa)}"><button class="btn sm" data-act="mi-now" data-k="txa">Dabar</button></div>` : '') +
      `<textarea class="inp" data-mi="txTxt" rows="2" placeholder="Dozės ir laikai, pvz. ketaminas 50 mg IN 15:05; cefadroksilis 1 g 15:10">${esc(p.txTxt)}</textarea>` +
      `<textarea class="inp" data-mi="note" rows="2" placeholder="Pastabos: alergijos, kas tęstina, ginklas iškrautas…">${esc(p.note)}</textarea></section>`;
    h += `<section class="outp"><div class="nlh"><b>Perduoti</b></div><pre id="mi-out">${esc(text(p))}</pre>` +
      '<div class="acts"><button class="btn pri" data-act="mi-read">Skaityti</button><button class="btn" data-act="mi-copy">Kopijuoti</button><button class="btn" data-act="mi-share">Bendrinti</button></div>' +
      (s.pts.length > 1 ? '<div class="acts"><button class="btn" data-act="mi-copyall">Kopijuoti visus (' + s.pts.length + ')</button></div>' : '') +
      '<div class="acts"><button class="btn dng" data-act="mi-del">Ištrinti šį sužeistąjį</button></div></section>';
    h += row('#/igudis/34', 'Perdavimas ir perėmimas', 'Įgūdis #34') + row('#/9line', '9-Line MEDEVAC', NL.status());
    return h;
  }

  function toggle(a, k) { const i = a.indexOf(k); if (i >= 0) a.splice(i, 1); else a.push(k); }
  function act(el) {
    const s = get(), d = el.dataset, k = d.k;
    if (d.act === 'mi-add') { if (!s.pts.length) s.seq = 0; s.seq = Math.max(s.seq || 0, s.pts.length, ...s.pts.map(p => parseInt(p.nr, 10) || 0)) + 1; s.pts.push(blank(s.seq, !s.pts.length)); s.cur = s.pts.length - 1; save(s); render(); scrollTo(0, 0); return; }
    if (d.act === 'mi-sel') { s.cur = +k; save(s); render(); return; }
    const p = cur(s); if (!p) return;
    switch (d.act) {
      case 'mi-cat': p.cat = p.cat === k ? '' : k; break;
      case 'mi-mech': toggle(p.mech, k); break;
      case 'mi-inj': toggle(p.inj, k); break;
      case 'mi-tx': toggle(p.tx, k); if (k === 'Turniketas' && p.tx.indexOf(k) >= 0 && !p.tq) { const T = LS.get('mg-laikai', {}); if (T.turn) p.tq = hm(T.turn); } break;
      case 'mi-av': p.f.av = p.f.av === k ? '' : k; break;
      case 'mi-hrs': p.f.hrs = p.f.hrs === k ? '' : k; break;
      case 'mi-now': p[k] = nowHM(); break;
      case 'mi-vit': {
        const f = p.f;
        if (!f.av && !f.hr && !f.rr && !f.spo2 && !f.bp && f.pain === '' && !f.hrs) { toast('Įveskite bent vieną rodiklį'); return; }
        const num = (v, lo, hi) => v === '' || v == null || (/^\d{1,3}$/.test(String(v).trim()) && +v >= lo && +v <= hi);
        if (!num(f.hr, 0, 300)) { toast('Pulsas: skaičius 0–300'); return; }
        if (!num(f.rr, 0, 99)) { toast('Kvėpavimo dažnis: skaičius 0–99'); return; }
        if (!num(f.spo2, 0, 100)) { toast('SpO₂: skaičius 0–100'); return; }
        if (!num(f.pain, 0, 10)) { toast('Skausmas: skaičius 0–10'); return; }
        if (f.bp && !/^\d{2,3}\s*\/\s*\d{2,3}$|^\d{2,3}$/.test(String(f.bp).trim())) { toast('AKS: pvz. 90/60 arba tik sistolinis, pvz. 90'); return; }
        const tr = {}; Object.keys(f).forEach(k => { tr[k] = String(f[k] == null ? '' : f[k]).trim().replace(/\s*\/\s*/, '/'); }); p.vit.push(Object.assign({ ts: nowHM() }, tr)); p.f = { av: f.av, hr: '', hrs: '', rr: '', spo2: '', bp: '', pain: '' }; toast('Rodikliai įrašyti'); break;
      }
      case 'mi-vdel': p.vit.splice(+k, 1); break;
      case 'mi-copy': return copyText(text(p));
      case 'mi-share': return shareText('MIST', text(p));
      case 'mi-copyall': return copyText(s.pts.map(text).join('\n\n'));
      case 'mi-read': { const L = text(p).split('\n'); return readMode('MIST', L.map(x => esc(x))); }
      case 'mi-del': if (!confirm('Ištrinti sužeistąjį ' + (p.nr || '') + '?')) return; s.pts.splice(s.cur, 1); s.cur = Math.max(0, Math.min(s.cur, s.pts.length - 1)); break;
      default: return;
    }
    save(s); render();
  }
  function onInput(t) {
    const s = get(), p = cur(s); if (!p) return;
    if (t.dataset.mi) p[t.dataset.mi] = t.value; else if (t.dataset.mif) p.f[t.dataset.mif] = t.value;
    save(s);
    const o = document.getElementById('mi-out'); if (o) o.textContent = text(p);
    if (t.dataset.mi === 'nr') { const b = document.querySelector('.ptabs button.on'); if (b) b.firstChild.textContent = t.value || s.cur + 1; }
  }
  return { view, act, onInput, status, text };
})();
