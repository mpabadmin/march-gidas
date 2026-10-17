'use strict';
// Priedai – kodas vienodas ETC ir March giduose (skiriasi tik TCFG iš tools.js):
// EX – egzaminuotojo režimas kontroliniams sąrašams, FC – dozių kortelės (kartojimas su intervalais),
// OP – duomenų apsauga (sužeistųjų duomenų ištrynimas, automatinis išvalymas), GL – pirštinių režimas.

const mmss = ms => { const t = Math.max(0, Math.round(ms / 1000)); return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0'); };
const dtStr = ts => { const d = new Date(ts); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + ' ' + hm(ts); };
const keepY = () => { const y = scrollY; render(); scrollTo(0, y); };

// ───────── Egzaminuotojo režimas (EX): instruktorius žymi atliktus sąrašo punktus, laikmatis, kritiniai punktai, rezultatas ─────────
const EX = (() => {
  const KEY = TCFG.pre + 'egz';
  const obj = v => v && typeof v === 'object' && !Array.isArray(v) ? v : null;
  function st() {
    const s = obj(LS.get(KEY, null)) || {}, c = obj(s.cur);
    return { cur: c && typeof c.id === 'string' && +c.t0 ? { id: c.id, who: String(c.who || ''), t0: +c.t0, t1: +c.t1 || 0, m: obj(c.m) || {} } : null, hist: Array.isArray(s.hist) ? s.hist.filter(obj).slice(0, 50) : [] };
  }
  const save = s => LS.set(KEY, s);
  const lists = () => E.sarasai || {};
  const shown = it => !it.h && (typeof ok !== 'function' || ok(it.g));
  const items = id => ((lists()[id] || {}).items || []).map((it, i) => ({ it, i })).filter(x => shown(x.it));
  let timer = null;
  function clock() {
    clearInterval(timer);
    timer = setInterval(() => {
      const el = document.getElementById('ex-clock');
      if (!el) { clearInterval(timer); timer = null; return; }
      const c = st().cur; if (c && !c.t1) el.textContent = mmss(Date.now() - c.t0);
    }, 1000);
  }
  function result(c) {
    const I = items(c.id), done = I.filter(x => c.m[x.i] != null), miss = I.filter(x => c.m[x.i] == null);
    return { title: (lists()[c.id] || {}).title || c.id, I, done, miss, krit: miss.filter(x => x.it.k), dur: (c.t1 || Date.now()) - c.t0, pct: I.length ? Math.round(done.length / I.length * 100) : 0 };
  }
  function textOf(c) {
    const R = result(c);
    return ['VERTINIMAS – ' + R.title, c.who ? 'Vertinamasis: ' + c.who : '', dtStr(c.t0) + ' · trukmė ' + mmss(R.dur),
      'Atlikta: ' + R.done.length + ' / ' + R.I.length + ' (' + R.pct + ' %)',
      R.krit.length ? 'Kritiniai neatlikti: ' + R.krit.map(x => x.it.t).join('; ') : 'Kritiniai punktai – visi atlikti',
      R.miss.length ? 'Neatlikta: ' + R.miss.map(x => x.it.t).join('; ') : '',
      R.done.length ? 'Atlikta (min:s): ' + R.done.slice().sort((a, b) => c.m[a.i] - c.m[b.i]).map(x => mmss(c.m[x.i]) + ' ' + x.it.t).join('; ') : ''].filter(Boolean).join('\n');
  }
  const status = () => { const s = st(); return s.cur && !s.cur.t1 ? 'Vyksta: ' + ((lists()[s.cur.id] || {}).title || '') : s.hist.length ? 'Paskutinis: ' + s.hist[0].pct + ' % · ' + s.hist[0].title : 'Vertinimas su laiku ir kritiniais punktais'; };
  const entry = id => lists()[id] ? row('#/egzaminas/' + id, 'Egzaminuotojo režimas', 'Vertinti šį sąrašą su laiku') : '';
  const histRows = (H, all) => H.map(h => `<button class="row" data-act="ex-h" data-k="${esc(String(h.at))}"><div>${esc((all ? h.title + ' · ' : '') + (h.who || 'be vardo'))}<small>${esc(dtStr(h.at) + ' · ' + mmss(h.dur) + (h.krit && h.krit.length ? ' · kritinių neatlikta: ' + h.krit.length : ''))}</small></div><span class="tag ${h.pct >= 100 && !(h.krit || []).length ? 'grn' : (h.krit || []).length ? 'red' : 'amb'}">${h.pct} %</span></button>`).join('');
  function picker() {
    const s = st(), S = lists();
    let h = '<h1>Egzaminuotojo režimas</h1><p class="muted">Instruktorius pasirenka sąrašą, paleidžia laikmatį ir žymi, ką vertinamasis atliko. Kritiniai punktai pažymėti raudonai. Rezultatą galima nukopijuoti ar bendrinti.</p>';
    if (s.cur && !s.cur.t1 && S[s.cur.id]) h += row('#/egzaminas/' + s.cur.id, 'Tęsti: ' + S[s.cur.id].title, 'Vyksta ' + mmss(Date.now() - s.cur.t0));
    h += '<h2>Pasirinkite sąrašą</h2>' + Object.keys(S).map(id => { const I = items(id); if (!I.length) return ''; const k = I.filter(x => x.it.k).length; return row('#/egzaminas/' + id, S[id].title, plural(I.length, ['punktas', 'punktai', 'punktų']) + (k ? ' · kritinių ' + k : '')); }).join('');
    if (s.hist.length) h += '<h2>Ankstesni vertinimai</h2>' + histRows(s.hist.slice(0, 15), true);
    return h;
  }
  function view(id) {
    if (!id) return picker();
    const L = lists()[id]; if (!L) return notFound();
    const s = st(), c = s.cur, I = items(id), nk = I.filter(x => x.it.k).length;
    let h = `<h1>Vertinimas</h1><p class="muted">${esc(L.title)}</p>`;
    if (c && c.id !== id && !c.t1) {
      return h + `<div class="warn">Vyksta kito sąrašo vertinimas: <b>${esc((lists()[c.id] || {}).title || c.id)}</b> (${mmss(Date.now() - c.t0)}).<div class="acts"><button class="btn" data-act="go" data-r="#/egzaminas/${esc(c.id)}">Tęsti ten</button><button class="btn dng" data-act="ex-cancel">Nutraukti jį</button></div></div>`;
    }
    if (!c || c.id !== id) {
      h += `<div class="card"><label>Vertinamasis<input class="inp" id="ex-who" autocomplete="off" placeholder="Vardas ar šaukinys (nebūtina)"></label><p class="muted mt0">${plural(I.length, ['punktas', 'punktai', 'punktų'])}${nk ? ', iš jų kritinių – ' + nk : ''}. Laikmatis prasideda paspaudus „Pradėti“.</p><button class="btn pri" data-act="ex-start" data-k="${esc(id)}">Pradėti vertinimą</button></div>`;
      const H = s.hist.filter(x => x.id === id);
      if (H.length) h += '<h2>Ankstesni vertinimai</h2>' + histRows(H.slice(0, 10));
      return h;
    }
    if (!c.t1) { // vyksta
      const n = I.filter(x => c.m[x.i] != null).length;
      h += `<div class="exbar" role="timer"><span id="ex-clock">${mmss(Date.now() - c.t0)}</span><span class="exn">${c.who ? esc(c.who) + ' · ' : ''}<span id="ex-n">${n}</span> / ${I.length}</span><button class="btn sm" data-act="ex-end">Baigti</button></div>`;
      let body = '';
      (L.items || []).forEach((it, i) => {
        if (it.h) { body += '<h3>' + esc(it.h) + '</h3>'; return; }
        if (!shown(it)) return;
        const on = c.m[i] != null, sub = (it.s || []).length ? '<ul>' + it.s.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '';
        body += `<div class="ck exi${on ? ' on' : ''}${it.k ? ' key' : ''}" data-act="ex-ck" data-i="${i}" role="checkbox" aria-checked="${on}" tabindex="0"><span class="bx">✓</span><div class="t">${esc(it.t)}${it.k ? ' <span class="tag red">Kritinis</span>' : ''}${sub}</div><span class="ext">${on ? mmss(c.m[i]) : ''}</span></div>`;
      });
      h += '<div class="cl">' + body + '</div>';
      h += '<button class="btn pri" data-act="ex-end">Baigti ir rodyti rezultatą</button><div class="acts"><button class="btn dng" data-act="ex-cancel">Nutraukti be rezultato</button></div>';
      setTimeout(clock, 0);
      return h;
    }
    // rezultatas
    const R = result(c), li = (a, f) => '<ul class="exlst' + (f ? ' ' + f : '') + '">' + a.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
    h += `<div class="exres${R.krit.length ? ' bad' : ''}"><div class="muted">${esc(c.who || 'Vertinamasis nenurodytas')} · ${esc(dtStr(c.t0))}</div><div class="big">${R.done.length} / ${R.I.length} <small>(${R.pct} %)</small></div><div>Trukmė: <b>${mmss(R.dur)}</b></div></div>`;
    h += R.krit.length ? '<h2>Kritiniai – neatlikta</h2>' + li(R.krit.map(x => x.it.t), 'krit') : '<p><span class="tag grn">Kritiniai punktai – visi atlikti</span></p>';
    if (R.miss.length > R.krit.length) h += '<h2>Kiti neatlikti</h2>' + li(R.miss.filter(x => !x.it.k).map(x => x.it.t));
    if (R.done.length) h += '<h2>Atlikta (min:s nuo pradžios)</h2>' + li(R.done.slice().sort((a, b) => c.m[a.i] - c.m[b.i]).map(x => mmss(c.m[x.i]) + ' – ' + x.it.t));
    h += '<div class="acts"><button class="btn" data-act="ex-copy">Kopijuoti</button><button class="btn" data-act="ex-share">Bendrinti</button></div><button class="btn pri" data-act="ex-new" data-k="' + esc(id) + '">Naujas vertinimas</button>';
    return h;
  }
  function act(el) {
    const d = el.dataset, s = st();
    switch (d.act) {
      case 'ex-start': {
        if (!lists()[d.k]) return;
        const w = document.getElementById('ex-who');
        s.cur = { id: d.k, who: w ? w.value.trim().slice(0, 60) : '', t0: Date.now(), t1: 0, m: {} }; save(s); render(); scrollTo(0, 0); return;
      }
      case 'ex-ck': {
        const c = s.cur, i = +d.i; if (!c || c.t1) return;
        if (c.m[i] != null) delete c.m[i]; else c.m[i] = Date.now() - c.t0;
        save(s);
        const on = c.m[i] != null; el.classList.toggle('on', on); el.setAttribute('aria-checked', on);
        const t = el.querySelector('.ext'); if (t) t.textContent = on ? mmss(c.m[i]) : '';
        const nEl = document.getElementById('ex-n'); if (nEl) nEl.textContent = items(c.id).filter(x => c.m[x.i] != null).length;
        if (navigator.vibrate) navigator.vibrate(15);
        return;
      }
      case 'ex-end': {
        const c = s.cur; if (!c || c.t1) return;
        const I = items(c.id), krit = I.filter(x => x.it.k && c.m[x.i] == null).length, miss = I.filter(x => c.m[x.i] == null).length;
        if (miss && !confirm('Baigti vertinimą? Nepažymėta punktų: ' + miss + (krit ? ', iš jų kritinių: ' + krit : '') + '.')) return;
        c.t1 = Date.now();
        const R = result(c);
        s.hist.unshift({ id: c.id, title: R.title, who: c.who, at: c.t0, dur: R.dur, n: R.done.length, tot: R.I.length, pct: R.pct, krit: R.krit.map(x => x.it.t), text: textOf(c) });
        s.hist = s.hist.slice(0, 50); save(s); render(); scrollTo(0, 0); return;
      }
      case 'ex-cancel': if (!confirm('Nutraukti vertinimą? Rezultatas nebus išsaugotas.')) return; s.cur = null; save(s); render(); return;
      case 'ex-new': s.cur = null; save(s); render(); scrollTo(0, 0); return;
      case 'ex-copy': if (s.cur) copyText(textOf(s.cur)); return;
      case 'ex-share': if (s.cur) shareText('Vertinimas', textOf(s.cur)); return;
      case 'ex-h': {
        const h = s.hist.find(x => String(x.at) === d.k); if (!h) return;
        const t = String(h.text || '');
        return readMode('Vertinimas', t.split('\n').map(x => esc(x)), [['Kopijuoti', () => copyText(t)], ['Bendrinti', () => shareText('Vertinimas', t)]]);
      }
    }
  }
  return { view, act, status, entry };
})();

// ───────── Dozių kortelės (FC): kasdien 5 kortelės iš vaistų skilties, Leitnerio dėžutės (kartojimas su intervalais) ─────────
const FC = (() => {
  const KEY = TCFG.pre + 'fc', INT = [0, 1, 2, 4, 8, 16], PER = 5;
  const day = () => { const d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 864e5); };
  function st() {
    const o = LS.get(KEY, null), s = o && typeof o === 'object' && !Array.isArray(o) ? o : {};
    return { c: s.c && typeof s.c === 'object' && !Array.isArray(s.c) ? s.c : {}, d: +s.d || 0, n: +s.n || 0, y: +s.y || 0 };
  }
  const save = s => LS.set(KEY, s);
  const shownV = v => typeof ok !== 'function' || ok(v.kam != null ? v.kam : v.lygis);
  function cards() {
    const out = [];
    (E.vaistai || []).filter(shownV).forEach(v => {
      const add = (x, pre) => {
        if (!x || !String(x.d || '').trim() || !String(x.k || '').trim()) return;
        const k = (pre ? pre + ' · ' : '') + x.k;
        out.push({ id: v.id + '|' + k, v, k, d: String(x.d), p: String(x.p || '') });
      };
      (v.dozes || []).forEach(x => add(x));
      (v.stulpeliai || []).forEach(col => (col.dozes || []).forEach(x => add(x, col.pav)));
    });
    return out;
  }
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  let q = null, i = 0, open = false, got = 0, again = {};
  function build() {
    const s = st(), t = day(), all = cards();
    const due = shuffle(all.filter(c => s.c[c.id] && +s.c[c.id].d <= t)).sort((a, b) => (+s.c[a.id].b || 1) - (+s.c[b.id].b || 1));
    q = due.concat(shuffle(all.filter(c => !s.c[c.id]))).slice(0, PER); i = 0; open = false; got = 0; again = {};
  }
  function counts() {
    const s = st(), t = day(), all = cards();
    return { all: all.length, due: all.filter(c => s.c[c.id] && +s.c[c.id].d <= t).length, fresh: all.filter(c => !s.c[c.id]).length, learned: all.filter(c => s.c[c.id] && +s.c[c.id].b >= 3).length, today: s.d === t ? s.n : 0, tomorrow: all.filter(c => s.c[c.id] && +s.c[c.id].d === t + 1).length };
  }
  function status() {
    const C = counts();
    if (!C.all) return 'Kortelių nėra';
    if (C.today && !C.due) return 'Šiandien atlikta ✓ · išmokta ' + C.learned + ' / ' + C.all;
    return C.due ? 'Laukia kartoti: ' + C.due : 'Naujų kortelių: ' + C.fresh + ' · išmokta ' + C.learned + ' / ' + C.all;
  }
  function view() {
    if (!q) build();
    const C = counts();
    let h = '<h1>Dozių kortelės</h1>';
    if (mode === 'learn') h += '<p class="muted">Kasdien 5 kortelės iš vaistų skilties: vaistas ir kelias – prisiminkite dozę, tada atverskite. „Žinojau“ – kortelė grįš vis rečiau (po 1, 2, 4, 8, 16 d.), „Nežinojau“ – rytoj ir dar kartą šiandien. Dozės – tos pačios kaip skiltyje Vaistai.</p>';
    if (!C.all) return h + '<p class="muted">Vaistų skiltyje kortelių nėra.</p>';
    if (!q.length) return h + `<div class="exres"><div class="big">Viskas ✓</div><div class="muted">Šiandien kartoti nebėra. Išmokta ${C.learned} / ${C.all}.</div></div>` + row('#/vaistai', 'Vaistai', 'Visa skiltis');
    if (i >= q.length) {
      const u = q.length - Object.keys(again).length;
      return h + `<div class="exres"><div class="big">${got} / ${u}</div><div>Iš pirmo karto žinojote ${got} iš ${u}.</div><div class="muted">Rytoj kartoti: ${C.tomorrow} · išmokta ${C.learned} / ${C.all} kortelių</div></div>` +
        '<button class="btn pri" data-act="fc-more">Dar 5 kortelės</button>' + row('#/vaistai', 'Vaistai', 'Visa skiltis') +
        '<div class="acts"><button class="btn dng" data-act="fc-reset">Pradėti iš naujo (ištrinti pažangą)</button></div>';
    }
    const c = q[i];
    h += `<div class="muted">Kortelė ${i + 1} / ${q.length}${C.due ? ' · laukia kartoti ' + C.due : ''}</div>`;
    h += `<div class="fcard"><div class="fq">Kokia dozė?</div><div class="fn">${esc(c.v.name)}</div><div class="fk">${esc(c.k)}</div>` +
      (open ? `<div class="fa">${esc(c.d)}${c.p ? '<small>' + esc(c.p) + '</small>' : ''}</div>` : '') + '</div>';
    h += open ? '<div class="fbtns"><button class="btn no" data-act="fc-no">Nežinojau</button><button class="btn yes" data-act="fc-yes">Žinojau</button></div>' + row('#/vaistas/' + c.v.id, 'Atidaryti vaistą', c.v.klase || '')
      : '<button class="btn pri" data-act="fc-show">Rodyti atsakymą</button>';
    return h;
  }
  function act(el) {
    const d = el.dataset;
    switch (d.act) {
      case 'fc-show': open = true; render(); return;
      case 'fc-yes': case 'fc-no': {
        if (!q || !q[i]) return;
        const s = st(), t = day(), c = q[i], r = s.c[c.id] || { b: 0 }, yes = d.act === 'fc-yes';
        if (yes) { if (!again[c.id]) got++; const b = Math.min((+r.b || 0) + 1, 5); s.c[c.id] = { b, d: t + INT[b] }; }
        else { s.c[c.id] = { b: 1, d: t + 1 }; if (!again[c.id]) { again[c.id] = 1; q.push(c); } }
        if (s.d !== t) { s.d = t; s.n = 0; }
        s.n++; save(s); i++; open = false; render(); scrollTo(0, 0); return;
      }
      case 'fc-more': build(); render(); scrollTo(0, 0); return;
      case 'fc-reset': if (!confirm('Ištrinti dozių kortelių pažangą?')) return; LS.set(KEY, {}); build(); render(); return;
    }
  }
  return { view, act, status, cards };
})();

// ───────── Duomenų apsauga (OP): visų sužeistųjų duomenų ištrynimas, automatinis išvalymas po nenaudojimo ─────────
const OP = (() => {
  const KEYS = ['mist', 'mist-v1', 'pt', 'laikai', 'ck', 'ck-sig', 'vz', 'nb', 'wbb', '9line', 'gks', 'tst', 'mascal', 'sitrep', 'rem-n'].map(k => TCFG.pre + k);
  const CFG = TCFG.pre + 'opsec', AKT = TCFG.pre + 'akt', FLAG = TCFG.pre + 'wiped';
  const hours = () => +((LS.get(CFG, {}) || {}).h) || 0;
  const has = () => KEYS.some(k => { try { return localStorage.getItem(k) != null; } catch (e) { return false; } });
  function wipe(auto) {
    KEYS.forEach(k => { try { localStorage.removeItem(k); } catch (e) {} });
    try { sessionStorage.setItem(FLAG, auto ? 'auto' : '1'); } catch (e) {}
    LS.set(AKT, Date.now());
    if (location.hash && location.hash !== '#/') history.replaceState(null, '', location.pathname + location.search + '#/');
    location.reload(); // išvalo ir atmintyje likusią būseną (atšaukimo istoriją ir pan.)
  }
  function check() { const h = hours(), a = +LS.get(AKT, 0) || 0; if (h && a && Date.now() - a > h * 3600e3 && has()) { wipe(true); return true; } return false; }
  let last = 0;
  const touch = () => { const n = Date.now(); if (n - last > 60000) { last = n; LS.set(AKT, n); } };
  function init() {
    let f = null; try { f = sessionStorage.getItem(FLAG); sessionStorage.removeItem(FLAG); } catch (e) {}
    if (check()) return;
    touch();
    ['click', 'input', 'keydown'].forEach(ev => document.addEventListener(ev, touch, true));
    document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
    setInterval(check, 5 * 60000);
    if (f) setTimeout(() => toast(f === 'auto' ? 'Sužeistųjų duomenys ištrinti automatiškai (ilgai nenaudota)' : 'Visi sužeistųjų duomenys ištrinti'), 500);
  }
  function settings() {
    const h = hours();
    return '<h2>Duomenų apsauga</h2><p class="muted">Sužeistųjų duomenys laikomi tik šiame telefone. Vietoj vardų ir pavardžių rašykite šaukinį ar numerį.</p>' +
      '<button class="btn dng" data-act="op-wipe" style="width:100%">Ištrinti visų sužeistųjų duomenis</button>' +
      '<p class="muted">Automatiškai ištrinti, jei programėlė nenaudojama:</p><div class="seg2" role="group" aria-label="Automatinis ištrynimas">' +
      [[0, 'Išjungta'], [12, '12 val.'], [24, '24 val.'], [72, '3 d.']].map(([k, t]) => `<button class="${h === k ? 'on' : ''}" data-act="op-auto" data-k="${k}" aria-pressed="${h === k}">${t}</button>`).join('') + '</div>' +
      '<p class="muted">Ištrinama: MIST kortelės, paciento failas, laikai, sąrašų žymėjimai, 9-Line, TST' + (typeof MS !== 'undefined' ? ', Mascal' : '') + (typeof VZ !== 'undefined' ? ', vaistų žymėjimas, nudegimai, šviežias kraujas' : '') + (typeof SR !== 'undefined' ? ', SITREP' : '') + '. Lieka: nustatymai, įsivertinimai, vertinimai ir dozių kortelės.</p>';
  }
  function act(el) {
    const d = el.dataset;
    if (d.act === 'op-wipe') { if (!has()) { toast('Sužeistųjų duomenų nėra'); return; } if (confirm('Ištrinti VISŲ sužeistųjų duomenis šiame telefone? To atšaukti negalima.')) wipe(false); return; }
    if (d.act === 'op-auto') { const h = [0, 12, 24, 72].indexOf(+d.k) >= 0 ? +d.k : 0; LS.set(CFG, { h }); touch(); keepY(); toast(h ? 'Bus ištrinta po ' + (h >= 72 ? '3 d.' : h + ' val.') + ' nenaudojimo' : 'Automatinis ištrynimas išjungtas'); }
  }
  return { init, settings, act, wipe, check, has, keys: KEYS };
})();

// ───────── Pirštinių režimas (GL): didesni mygtukai ir tarpai, „Atgal“ mygtukas apačioje ─────────
const GL = (() => {
  const K = TCFG.pre + 'pirstines';
  const on = () => !!LS.get(K, false);
  let fab = null;
  function upd() {
    if (!fab) {
      fab = document.createElement('button'); fab.id = 'glback'; fab.className = 'ib'; fab.type = 'button'; fab.setAttribute('aria-label', 'Atgal');
      fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>';
      fab.onclick = () => { const b = document.getElementById('back'); if (b) b.click(); };
      document.body.appendChild(fab);
    }
    const h = location.hash; fab.hidden = !on() || !h || h === '#' || h === '#/';
  }
  function apply() { document.documentElement.classList.toggle('gl', on()); upd(); }
  const settingRow = () => `<div class="ck${on() ? ' on' : ''}" data-act="gl-tg" role="checkbox" aria-checked="${on()}" tabindex="0"><span class="bx">✓</span><div class="t">Pirštinių režimas<div class="muted">Didesni mygtukai ir tarpai, mygtukas „Atgal“ ekrano apačioje – darbui su pirštinėmis ir viena ranka.</div></div></div>`;
  function act(el) { if (el.dataset.act !== 'gl-tg') return; LS.set(K, !on()); apply(); keepY(); toast(on() ? 'Pirštinių režimas įjungtas' : 'Pirštinių režimas išjungtas'); }
  addEventListener('hashchange', upd);
  return { apply, settingRow, act, on };
})();
