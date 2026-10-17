'use strict';
// ───────── Paciento ekranas (HUB), sužeistojo juosta ir dažniausi sąrašai (LU) – bendras kodas (ETC ir March) ─────────
// Paciento ekranas (#/pacientas): sužeistųjų skirtukai, antraštė su svoriu, laikai ir skiltys Apžvalga / Kortelė / Vaistai / Eiga / Perduoti.
// Juosta virš apatinės navigacijos rodo dabartinį sužeistąjį visuose ekranuose; bakstelėjus – apatinis langas su santrauka ir greitais veiksmais.
// Duomenys – tie patys MC / VZ / PT / REM (tools.js); svoris – paciento raktas (TCFG.pt 'svoris').
// Programėlės skirtumai – TCFG.hub (tools.js pradžioje): sąrašų maršrutai ir numatytieji, vaistai, greiti veiksmai, perdavimo nuorodos, laikmačiai.
//
// ── API (stabili; March prievadas naudoja tą pačią) ──
// Reikia globalių: E, LS, mode, app, render, route (app.js), esc, hm, row, notFound, listRow, listRoute, drugById, doseShort, W_LIST, timersHtml (core.js / views.js),
//   TCFG, MC, PT, REM, toast, plural, tcfgRows (tools.js); nebūtini: VZ, OP.
// TCFG.hub = {                                  visi laukai nebūtini (numatytieji – HCFG žemiau)
//   listDefaults: ['id', …]                     dažnų sąrašų užpildas, kai mažai naudojimo (top 3)
//   listOf(p, q) → 'id' | ''                    kurį sąrašą atidaro maršrutas (p – kelio dalys, q – parametrai)
//   listSkip(id) → bool                         sąrašai, kurie jau matomi pradžioje (nekartojami)
//   drugs: ['vaisto id', …], drugOk(v), drugTag(v) → html   skiltis „Vaistai“: dažniausi vaistai su dozėmis pagal paciento svorį
//   noBar: ['maršrutas', …]                     kur juosta nerodoma
//   quick: [[k, užrašas, pagrindinis?], …]      greiti veiksmai paciento apžvalgoje; sheetQuick – apatiniame lange
//                                               k: vit | vz | tq | mk | apz | kortele | vaistai | eiga | perduoti | (savas raktas iš go)
//   go: { k: '#/maršrutas' }                    papildomi / pakeisti greitų veiksmų adresai
//   handoff() → [[href, pavadinimas, paantraštė], …]   skiltis „Perduoti“: papildomos nuorodos
//   weight: false                               svorio mygtukas nerodomas (March – dozės nepriklauso nuo svorio)
//   timers() → html                             laikų blokas paciento ekrane (#tm; numatyta – timersHtml())
//   nav: 'CSS selektorius'                      apatinės navigacijos „Pacientas“ nuoroda (ženkliukui)
//   tabs: [[k, užrašas], …]                     paciento ekrano skiltys (numatyta: apz, kortele, vaistai, eiga, perduoti)
//   sections: { k(x, H) → html }                pakeisti / pridėti skilčių turinį; overview(x, H) → html – pakeičia „Apžvalgos“ turinį
// }  x – dabartinis sužeistasis { p, c (MIST kortelė), la (laikai), vz, tqT, txa, txaT, has, n, tot, id };
//    H – pagalbininkai { quick(sheet), sTable(c), iBox(c), tBox(x), head(x, big), rem(x) }.
// HUB: view(q), bar(maršrutas) → html, act(el) („hb-*“), after(), nav(), tick(), isOpen(), close(), tab().
//   #/pacientas?sh=vit|rx|tq|time&d=vaistas – atidarius iškart atveriamas MIST kortelės langas (priminimų „Atidaryti“); after() parametrus pašalina.
// LU: onRoute(p, q), hit(id), top() → ['id', …] (≤ 3), used().
// Saugykla: TCFG.pre + 'sarasu-naud' (naudojimas), 'svoris' (paciento raktas TCFG.pt), sessionStorage TCFG.pre + 'hub-tab'.

const HCFG = () => Object.assign({
  listDefaults: [], listOf: p => p[0] === 's' ? p[1] : '', listSkip: () => false, // kuris sąrašas atidarytas; kurie jau rodomi pradžioje
  drugs: [], drugOk: () => true, drugTag: () => '', // dažniausi vaistai paciento skiltyje „Vaistai“
  noBar: ['pacientas', 'mist', 'skenuoti', 'qr-priimti'], // kur juosta nerodoma
  quick: [['vit', '+ Požymiai', 1], ['vz', '+ Vaistas', 1], ['tq', '+ Turniketas', 1], ['mk', '+ Žymė schemoje']],
  sheetQuick: [['vit', '+ Požymiai', 1], ['vz', '+ Vaistas', 1], ['tq', '+ Turniketas', 1], ['kortele', 'Kortelė'], ['eiga', 'Eiga'], ['perduoti', 'Perduoti']],
  go: {}, handoff: () => [], timers: () => typeof timersHtml === 'function' ? timersHtml() : '', nav: '#nav a[data-s="pacientas"]', weight: true,
  tabs: null, sections: {}, overview: null
}, (typeof TCFG !== 'undefined' && TCFG.hub) || {});

const LU = (() => {
  const K = TCFG.pre + 'sarasu-naud', N = 3;
  const L = () => E.sarasai || {};
  const has = id => typeof id === 'string' && Object.prototype.hasOwnProperty.call(L(), id); // ne „constructor“ ir pan.
  // pradžioje jau rodomi (pvz. Escape planai, vaidmenų pirminės apžiūros) – jų nekartojame
  const shown = id => !!HCFG().listSkip(id);
  const data = () => { const s = LS.get(K, {}); return s && typeof s === 'object' && !Array.isArray(s) ? s : {}; };
  function hit(id) {
    if (!has(id) || shown(id)) return;
    const s = data(), o = s[id] && typeof s[id] === 'object' ? s[id] : {};
    s[id] = { n: (+o.n || 0) + 1, t: Date.now() }; LS.set(K, s);
  }
  function top() {
    const s = data();
    const ids = Object.keys(s).filter(id => has(id) && !shown(id) && s[id] && +s[id].n > 0)
      .sort((a, b) => (+s[b].n - +s[a].n) || (+s[b].t - +s[a].t)).slice(0, N);
    HCFG().listDefaults.forEach(id => { if (ids.length < N && ids.indexOf(id) < 0 && has(id)) ids.push(id); });
    return ids;
  }
  function onRoute(p, q) { const id = HCFG().listOf(p, q || {}); if (id) hit(id); }
  const used = () => Object.keys(data()).length > 0;
  return { hit, top, onRoute, used };
})();

const HUB = (() => {
  const TABS0 = [['apz', 'Apžvalga'], ['kortele', 'Kortelė'], ['vaistai', 'Vaistai'], ['eiga', 'Eiga'], ['perduoti', 'Perduoti']];
  const TABS = { some: f => tabsNow().some(f), map: f => tabsNow().map(f) };
  const tabsNow = () => HCFG().tabs || TABS0;
  const TK = TCFG.pre + 'hub-tab', WK = TCFG.pre + 'svoris';
  const GO = () => Object.assign({ vit: '#/pacientas?t=kortele&f=s', vz: typeof VZ !== 'undefined' ? '#/pacientas?t=vaistai' : '#/vaistai', tq: '#/pacientas?t=kortele&f=tq', mk: '#/pacientas?t=kortele&f=i',
    apz: '#/pacientas?t=apz', kortele: '#/pacientas?t=kortele', vaistai: '#/pacientas?t=vaistai', eiga: '#/pacientas?t=eiga', perduoti: '#/pacientas?t=perduoti' }, HCFG().go);
  const FOCUS = { s: '#mcS', tq: '#mcI', i: '#mcI', c: '#mcT' };
  let wOther = false;
  let sheet = false, wOpen = false, focus = null, fDone = false, memTab = 'apz', pend = null;
  const ss = {
    get() { try { return sessionStorage.getItem(TK) || memTab; } catch (e) { return memTab; } },
    set(v) { memTab = v; try { sessionStorage.setItem(TK, v); } catch (e) {} }
  };
  const tab = () => { const t = ss.get(); return TABS.some(x => x[0] === t) ? t : 'apz'; };
  const wSet = () => { const w = +LS.get(WK, 0); return w > 0 ? w : 0; };
  const dur = ms => { const m = Math.max(0, Math.floor(ms / 60000)); return Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0'); };
  const ago = ms => { const m = Math.max(0, Math.floor(ms / 60000)); return m < 1 ? 'ką tik' : 'prieš ' + (m < 60 ? m + ' min' : Math.floor(m / 60) + ' val. ' + String(m % 60).padStart(2, '0') + ' min'); };
  const wOn = () => HCFG().weight !== false;
  const txaOk = () => typeof ok !== 'function' || ok('CMC'); // March „tik CLS“ – TXA (CMC) nerodomas
  const CHEV = '<svg class="hbch" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>';
  const CATC = { T1: 'msT1', T2: 'msT2', T3: 'msT3', T4: 'msT4', X: 'msX' };
  const ptTabs = () => PT.bar().replace(/<a class="ptf"[^>]*>[^<]*<\/a>/, '');

  // Dabartinis sužeistasis ir jo būsena
  function cur() {
    try { PT.sync(); } catch (e) { return null; }
    const L = PT.list(), p = L.pts[L.cur]; if (!p) return null;
    const c = p.card, la = Object.assign({}, LS.get(TCFG.laikai, {}) || {}), vz = typeof VZ !== 'undefined' ? VZ.get().e : [];
    if (!+la.trauma && MC.trTs) { const t = MC.trTs(c); if (t) la.trauma = t; } // traumos laikas – ir iš kortelės
    const tqT = +la.turn || PT.hmTs(c.tqT) || 0;
    const te = vz.filter(e => e.v === 'txa').pop(), txa = !!(te || (c.tx || []).indexOf('txa') >= 0 || c.txaT);
    const txaT = te ? +te.t : PT.hmTs(c.txaT) || 0;
    const has = !!(String(c.id || '').trim() || String(c.name || '').trim() || (c.mech || []).length || (c.mk || []).length || (c.vit || []).length || (c.tx || []).length ||
      (c.rows || []).length || Object.keys(c.tq || {}).length || c.t0 || la.trauma || la.turn || vz.length || wSet());
    return { L, p, c, la, vz, tqT, txa, txaT, has, n: L.cur + 1, tot: L.pts.length, id: String(c.id || '').trim() };
  }
  const chip = x => x.p.cat ? `<span class="ptc ${CATC[x.p.cat] || ''}">${x.p.cat === 'X' ? '✝' : esc(x.p.cat)}</span>` : '';
  function txaTxt(x) {
    if (x.txa) return { t: 'TXA ✓' + (x.txaT ? ' ' + hm(x.txaT) : ''), c: 'hbok' };
    const dl = x.la.trauma && txaOk() ? x.la.trauma + 3 * 3600e3 : 0; if (!dl) return null;
    return Date.now() > dl ? { t: 'TXA – 3 val. praėjo', c: 'hbbad' } : { t: 'TXA iki ' + hm(dl), c: '' };
  }

  // ── juosta ──
  function barInner(x) {
    const w = wOn() ? wSet() : 0, sub = [w ? w + ' kg' : '', x.tot > 1 ? 'sužeistasis ' + x.n + ' iš ' + x.tot : '', x.has ? '' : 'kortelė tuščia'].filter(Boolean).join(' · ');
    const tx = txaTxt(x), r = [];
    if (x.tqT) r.push(`<b class="hbq">TQ ${dur(Date.now() - x.tqT)}</b>`);
    if (tx) r.push(`<small class="${tx.c}">${esc(tx.t)}</small>`);
    return chip(x) + `<span class="hbm"><b>#${x.n} ${esc(x.id || 'Sužeistasis')}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</span>` + (r.length ? `<span class="hbr">${r.join('')}</span>` : '') + CHEV;
  }
  const barLabel = x => 'Sužeistasis ' + x.n + (x.id ? ' – ' + x.id : '') + (x.tqT ? ', turniketas ' + dur(Date.now() - x.tqT) : '') + '. Atverti santrauką';
  function bar(r) {
    queueMicrotask(a11y);
    if (HCFG().noBar.indexOf(r) >= 0) { sheet = false; return ''; }
    const x = cur(); if (!x) return '';
    if (mode === 'learn' && !x.has && x.tot < 2) return '';
    return `<button class="hbar" data-act="hb-open" aria-haspopup="dialog" aria-expanded="${sheet}" aria-label="${esc(barLabel(x))}">${barInner(x)}</button>` + (sheet ? sheetHtml(x) : '');
  }

  // ── bendros dalys ──
  function head(x, big) {
    const c = x.c, title = x.id || 'Sužeistasis ' + x.n, w = wSet();
    const sx = c.sex === 'V' ? 'vyras' : c.sex === 'M' ? 'moteris' : '';
    const when = x.la.trauma ? 'trauma ' + hm(x.la.trauma) : c.t0 ? 'trauma ' + c.t0 : '';
    const sub = [String(c.name || '').trim(), sx, (c.mech || []).join(', ').toLowerCase(), when].filter(Boolean).join(' · ');
    let h = `<div class="hbhd"><div class="hbn">${big ? `<h1>${esc(title)}</h1>` : `<b>${esc(title)}</b>`}${sub ? `<small>${esc(sub)}</small>` : ''}</div>` +
      (wOn() ? `<button class="btn hbw${w ? '' : ' unset'}" data-act="hb-w" aria-expanded="${wOpen}" aria-label="Paciento svoris${w ? ' ' + w + ' kg' : ' nenurodytas'} – keisti">${w ? w + ' kg' : 'Svoris ?'}</button>` : '') + '</div>';
    if (wOpen && wOn()) h += '<div class="chips hbwc" role="group" aria-label="Svoris, kg">' + W_LIST.map(v => `<button class="${v === w ? 'on' : ''}" data-act="hb-wset" data-w="${v}" aria-pressed="${v === w}">${v}</button>`).join('') +
      (w && W_LIST.indexOf(w) < 0 ? `<button class="on" data-act="hb-wother" aria-pressed="true">${w}</button>` : '<button data-act="hb-wother">Kitas…</button>') + '</div>' +
      (wOther ? '<div class="wother"><input class="inp" id="hb-win" inputmode="decimal" placeholder="kg" aria-label="Svoris, kg" autocomplete="off"><button class="btn pri" data-act="hb-wok">Gerai</button></div>' : '') +
      (w ? '' : '<p class="muted mt0">Kol nenurodyta, dozės skaičiuojamos 80 kg.</p>');
    return h;
  }
  // Apatiniame lange – laikų santrauka; bakstelėjus – tas pats laiko (ar vaisto) langas kaip paciento ekrane
  function tmCards(x) {
    const now = Date.now(), tx = txaTxt(x);
    const card = (cls, lb, v, s, a) => `<button class="hbtm ${cls}" data-act="hb-sh" ${a} aria-label="${esc(lb + ': ' + v + (s ? ', ' + s : ''))} – keisti"><small>${lb}</small><b>${esc(v)}</b>${s ? `<small>${esc(s)}</small>` : ''}</button>`;
    return '<div class="hbtms">' +
      card('', 'Trauma', x.la.trauma ? hm(x.la.trauma) : '—', x.la.trauma ? ago(now - x.la.trauma) : 'nustatyti', 'data-sh="time" data-f="trauma"') +
      card(x.tqT ? 'amb' : '', 'Turniketas', x.tqT ? dur(now - x.tqT) : '—', x.tqT ? 'nuo ' + hm(x.tqT) : 'neuždėtas', 'data-sh="time" data-f="turn"') +
      (x.txa || tx ? card(x.txa ? 'grn' : tx && tx.c === 'hbbad' ? 'red' : '', 'TXA', x.txa ? 'Suleista' : tx.t.replace(/^TXA\s*[–-]?\s*/, ''), x.txa && x.txaT ? hm(x.txaT) : '', 'data-sh="rx" data-d="txa"') : '') + '</div>';
  }
  function vitLine(v) {
    const ab = (k, val) => MC.abn(k, val) ? `<b class="ab">${esc(val)}</b>` : `<b>${esc(val)}</b>`, a = [];
    if (v.av) a.push('AVPU ' + ab('av', v.av)); if (v.rr) a.push('KD ' + ab('rr', v.rr)); if (v.spo2) a.push('SpO₂ ' + (MC.abn('spo2', v.spo2) ? `<b class="ab">${esc(v.spo2)} %</b>` : `<b>${esc(v.spo2)} %</b>`));
    if (v.hr) a.push('pulsas ' + ab('hr', v.hr)); if (v.bp) a.push('AKS ' + ab('bp', v.bp)); if (v.pain !== '' && v.pain != null) a.push('skausmas ' + ab('pain', v.pain));
    if (v.gcs) a.push('GKS ' + ab('gcs', v.gcs));
    return a.join(' · ');
  }
  function remRow(it) {
    return `<button class="hbrem rem-${it.lvl}" data-act="rem-go" data-k="${esc(it.pid)}" data-r="${esc(it.go)}"><b>${esc(it.title)}</b><small>${esc(it.sub)}</small></button>`;
  }
  function quick(sh) {
    const b = ([k, lb, pri]) => `<button class="hbqa${pri ? ' pri' : ''}" data-act="hb-go" data-k="${esc(k)}">${esc(lb)}</button>`;
    return '<div class="hbqg">' + (sh ? HCFG().sheetQuick : HCFG().quick).map(b).join('') + '</div>';
  }

  // ── apatinis langas (bakstelėjus juostą) ──
  function sheetHtml(x) {
    const last = (x.c.vit || []).slice(-1)[0];
    let its = []; try { its = REM.items().sort((a, b) => (b.pid === x.p.pid) - (a.pid === x.p.pid)); } catch (e) {} // visi priminimai: pirmiausia šio sužeistojo
    return '<div class="hbbg" data-act="hb-close" aria-hidden="true"></div>' +
      `<section class="hbs" role="dialog" aria-modal="true" aria-label="Sužeistasis ${x.n}" tabindex="-1">` +
      '<div class="hbsh"><b>Sužeistasis</b><button class="x" data-act="hb-close" aria-label="Uždaryti">×</button></div>' +
      ptTabs() + head(x, false) + tmCards(x) + its.map(remRow).join('') +
      (last ? `<div class="hbvit"><small>Paskutiniai požymiai${last.ts ? ' · ' + esc(last.ts) : ''}</small><div>${vitLine(last)}</div></div>` : '') +
      quick(true) + '<a class="btn pri hbfile" href="#/pacientas">Atidaryti paciento failą ›</a></section>';
  }

  // ── paciento ekrano skiltys ──
  function sTable(c) {
    const V = (c.vit || []).slice(-3);
    if (!V.length) return '<section class="card hbsec"><div class="hbsech"><b>S – būklė</b></div><p class="muted mt0">Matavimų dar nėra.</p><button class="btn sm" data-act="hb-go" data-k="vit">+ Požymiai</button></section>';
    const R = [['av', 'AVPU'], ['rr', 'KD'], ['spo2', 'SpO₂'], ['hr', 'Pulsas'], ['bp', 'AKS'], ['pain', 'Skausmas'], ['gcs', 'GKS']].filter(([k]) => V.some(v => v[k] !== '' && v[k] != null));
    return `<section class="card hbsec"><div class="hbsech"><b>S – būklė</b><small>${plural((c.vit || []).length, ['matavimas', 'matavimai', 'matavimų'])}</small></div><div class="vtw"><table class="hbtab"><thead><tr><th scope="col">Laikas</th>` +
      V.map(v => `<th scope="col">${esc(v.ts || '—')}</th>`).join('') + '</tr></thead><tbody>' +
      R.map(([k, lb]) => `<tr><th scope="row">${lb}</th>` + V.map(v => `<td class="${MC.abn(k, v[k]) ? 'ab' : ''}">${esc(v[k] == null ? '' : v[k])}${k === 'spo2' && v[k] ? ' %' : ''}</td>`).join('') + '</tr>').join('') + '</tbody></table></div></section>';
  }
  function iBox(c) {
    const t = MC.injText(c);
    return `<section class="card hbsec"><div class="hbsech"><b>I – sužalojimai</b><button class="lnk" data-act="hb-go" data-k="kortele">Kortelė ›</button></div>` +
      (t ? '<ul class="hbul">' + t.split('; ').map(s => `<li>${esc(s)}</li>`).join('') + '</ul>' : '<p class="muted mt0">Žymių ir turniketų dar nėra.</p>') + '</section>';
  }
  function tBox(x) {
    const ev = [];
    if (typeof VZ !== 'undefined') x.vz.forEach(e => ev.push([+e.t, VZ.desc(e)]));
    (x.c.rows || []).forEach(r => { if (/^vz:/.test(String(r.src || ''))) return; const t = [r.name, r.dose, r.route].map(v => String(v || '').trim()).filter(Boolean).join(' '); if (t) ev.push([PT.hmTs(r.time) || 0, t, r.time]); });
    ev.sort((a, b) => a[0] - b[0]);
    const T = MC.txText ? MC.txText(x.c) : ''; // be C lentelės – ji jau išvardyta aukščiau
    return `<section class="card hbsec"><div class="hbsech"><b>T – suleista ir pagalba</b>${wOn() ? `<small>${wSet() ? 'dozės pagal ' + wSet() + ' kg' : 'svoris nenurodytas'}</small>` : ''}</div>` +
      (ev.length ? '<div class="ptev">' + ev.map(([t, s, raw]) => `<div><b>${t ? hm(t) : esc(raw || '—')}</b><span>${esc(s)}</span></div>`).join('') + '</div>' : '<p class="muted mt0">Vaistų dar nepažymėta.</p>') +
      (T ? `<p class="hbtx"><small>Pagalba:</small> ${esc(T)}</p>` : '') + '<button class="btn sm" data-act="hb-go" data-k="vz">+ Vaistas</button></section>';
  }
  const SEC = {
    apz(x) {
      let h = '';
      try { h += REM.banners(x.p.pid); } catch (e) {}
      if (!x.has) h += '<p class="muted">Kortelė dar tuščia: pažymėkite laikus, požymius, žymes schemoje ar suleistus vaistus.</p>';
      const ov = HCFG().overview;
      return h + (typeof ov === 'function' ? ov(x, H) : quick(false) + sTable(x.c) + iBox(x.c) + tBox(x));
    },
    kortele() { return MC.view({ embed: true }).replace(/<a class="row" href="#\/pacientas">[\s\S]*?<\/a>/, ''); },
    vaistai() {
      const C = HCFG(), w = LS.get(WK, 80) || 80, D = C.drugs.map(drugById).filter(v => v && C.drugOk(v));
      return (typeof VZ !== 'undefined' ? VZ.view({ embed: true }) : '') + (D.length ? `<h2>Dažniausi vaistai · ${w} kg${wSet() ? '' : ' (numatytas)'}</h2>` +
        D.map(v => row('#/vaistas/' + v.id, v.name, doseShort(v, w), C.drugTag(v))).join('') : '') +
        row('#/vaistai', 'Visi vaistai', plural((E.vaistai || []).length, ['vaistas', 'vaistai', 'vaistų']) + ' pagal paskirtį');
    },
    eiga(x) {
      const ev = PT.events(x.p.pid);
      return (ev.length ? '<div class="ptev">' + ev.map(([t, s]) => `<div><b>${hm(t)}</b><span>${esc(s)}</span></div>`).join('') + '</div>'
        : '<p class="muted">Įvykių dar nėra: pažymėkite laikus, požymius, suleistus vaistus.</p>') +
        (mode === 'learn' ? '<p class="muted">Eiga sudaroma automatiškai iš laikų, MIST kortelės (požymiai, turniketai, C lentelė), vaistų žymėjimo ir kraujo transfuzijos įrašų.</p>' : '');
    },
    perduoti() {
      return MC.outView() + // MIST (LT / EN), šis / visi, priedai (vaistai, nudegimai, kraujas), kortelė, QR – vienas blokas
        tcfgRows(HCFG().handoff()) +
        (typeof OP !== 'undefined' ? '<button class="btn dng" data-act="op-wipe" style="width:100%;margin-top:14px">Ištrinti visų sužeistųjų duomenis</button>' : '');
    }
  };
  const H = { quick, sTable, iBox, tBox, head, rem: x => { try { return REM.banners(x.p.pid); } catch (e) { return ''; } } };
  function view(q) {
    q = q || {};
    if (q.t && TABS.some(t => t[0] === q.t)) ss.set(q.t);
    if (q.f && FOCUS[q.f] && !fDone) focus = q.f; // tik vieną kartą po perėjimo (after() pašalina &f= iš adreso)
    if (q.sh && !fDone) pend = { sh: q.sh, d: q.d || '', f: q.fl || '' };
    sheet = false;
    const x = cur(); if (!x) return notFound();
    const t = tab();
    let h = ptTabs() + head(x, true);
    if (mode === 'learn') h += '<p class="muted">Viskas apie pasirinktą sužeistąjį vienoje vietoje. Juosta ekrano apačioje rodo jį ir kituose puslapiuose.</p>';
    h += '<div id="tm">' + HCFG().timers() + '</div>';
    h += '<div class="seg2 hbt" role="tablist" aria-label="Paciento skiltys">' + TABS.map(([k, l]) => `<button role="tab" id="hbt-${k}" aria-controls="hbpane" aria-selected="${k === t}" tabindex="${k === t ? 0 : -1}" class="${k === t ? 'on' : ''}" data-act="hb-tab" data-k="${k}">${l}</button>`).join('') + '</div>';
    const own = HCFG().sections || {}, fn = typeof own[t] === 'function' ? own[t] : SEC[t];
    return h + `<div class="hbpane" id="hbpane" role="tabpanel" aria-labelledby="hbt-${t}">` + (fn ? fn(x, H) : '') + '</div>';
  }
  const strip = h => { const i = h.indexOf('?'); if (i < 0) return h; const q = h.slice(i + 1).split('&').filter(kv => kv && !/^(f|sh|d|fl)=/.test(kv)); return h.slice(0, i) + (q.length ? '?' + q.join('&') : ''); };
  function after() {
    a11y();
    if (/[?&](f|sh|d|fl)=/.test(location.hash)) { fDone = true; try { history.replaceState(history.state, '', strip(location.hash)); } catch (e) {} }
    if (pend && typeof MC !== 'undefined' && MC.sheet && route().p[0] === 'pacientas') { const p = pend; pend = null; MC.sheet(p.sh, { drug: p.d, field: p.f }); return; }
    pend = null;
    if (!focus) return;
    const el = app.querySelector(FOCUS[focus]); focus = null;
    if (el) el.scrollIntoView({ block: 'center' });
  }
  // Atvertas langas – modalinis: kas už jo, neaktyvu (inert); fokusas lange. Kviečiama po kiekvieno piešimo (bar() suplanuoja).
  function a11y() {
    const s = sheet ? app.querySelector('.hbs') : null;
    document.querySelectorAll('body > header, #nav, #glback').forEach(e => { if (s) e.setAttribute('inert', ''); else e.removeAttribute('inert'); });
    if (!s) return;
    Array.from(app.children).forEach(c => { if (!c.classList.contains('hbs') && !c.classList.contains('hbbg')) c.setAttribute('inert', ''); });
    if (!s.contains(document.activeElement)) s.focus({ preventScroll: true });
  }
  // Uždaryti langą: jei atidarant buvo įrašyta istorijos būsena – atgal (Android „Atgal“ irgi uždaro), kitaip – iškart
  function closeSheet(viaPop) {
    if (!sheet) return;
    if (!viaPop && history.state && history.state.hb) { try { history.back(); return; } catch (e) {} }
    sheet = false; keep();
    const b = app.querySelector('.hbar'); if (b) b.focus({ preventScroll: true });
  }
  addEventListener('popstate', e => { if (sheet && !(e.state && e.state.hb)) closeSheet(true); });
  function go(h) { sheet = false; fDone = false; if (location.hash === h) { render(); scrollTo(0, 0); after(); } else location.hash = h; }
  const keep = () => { const y = scrollY; render(); scrollTo(0, y); after(); };
  function act(el) {
    const d = el.dataset;
    switch (d.act) {
      case 'hb-open': if (sheet) return; sheet = true; try { history.pushState(Object.assign({}, history.state, { hb: 1 }), ''); } catch (e) {} keep(); return;
      case 'hb-close': closeSheet(false); return;
      case 'hb-tab': { if (!TABS.some(t => t[0] === d.k)) return; ss.set(d.k); wOpen = false; focus = null;
        try { history.replaceState(history.state, '', '#/pacientas?t=' + d.k); } catch (e) {} // adresas atitinka skiltį (atgal / perkrovimas)
        const y = scrollY; render(); scrollTo(0, y); return; }
      case 'hb-w': wOpen = !wOpen; wOther = false; keep(); return;
      case 'hb-wother': wOther = !wOther; keep(); if (wOther) { const i = document.getElementById('hb-win'); if (i) i.focus(); } return;
      case 'hb-wok': { const i = document.getElementById('hb-win'), v = i ? parseFloat(String(i.value).replace(',', '.')) : NaN; if (!(v >= 3 && v <= 250)) { toast('Svoris: 3–250 kg'); if (i) i.focus(); return; } const w = Math.round(v); LS.set(WK, w); wOpen = false; wOther = false; toast('Svoris ' + w + ' kg – šiam pacientui'); keep(); return; }
      case 'hb-sh': { // laikų plytelės: laiko klaviatūra (trauma / turniketas) arba TXA vaisto langas
        if (!MC.sheet) return; const rep = !!(sheet && history.state && history.state.hb); sheet = false; keep();
        MC.sheet(d.sh, { replace: rep, field: d.f || '', drug: d.d || '' }); return;
      }
      case 'hb-wset': { const w = +d.w; if (!(w > 0)) return; LS.set(WK, w); wOpen = false; toast('Svoris ' + w + ' kg – šiam pacientui'); keep(); return; }
      case 'hb-go': {
        // požymiai, vaistas, turniketas, žymė – iškart MIST kortelės apatinis langas (be perėjimo)
        const sk = { vit: 'vit', vz: 'rx', rx: 'rx', tq: 'tq', mk: 'mk' }[d.k];
        if (sk && typeof MC !== 'undefined' && MC.sheet) { const rep = !!(sheet && history.state && history.state.hb); sheet = false; keep(); MC.sheet(sk, { replace: rep }); return; }
        const h = GO()[d.k]; if (!h) return;
        if (d.k === 'tq') { const T = LS.get(TCFG.laikai, {}) || {}, x = cur(); if (x && !x.tqT) { T.turn = Date.now(); LS.set(TCFG.laikai, T); toast('Turniketas ' + hm(T.turn) + ' – pažymėkite galūnę kortelėje'); } }
        if (d.k === 'vit' || d.k === 'tq' || d.k === 'mk') focus = { vit: 's', tq: 'tq', mk: 'i' }[d.k];
        return go(h);
      }
    }
  }
  // Apatinės navigacijos „Pacientas“ ženkliukas: sužeistųjų skaičius (kai > 1) arba taškas, kai yra priminimų
  function nav() {
    const a = document.querySelector(HCFG().nav); if (!a) return;
    let n = 0, due = 0; try { n = PT.list().pts.length; due = REM.items().length; } catch (e) {}
    const b = a.querySelector('.nbdg'); if (!b) return;
    b.textContent = n > 1 ? String(n) : ''; b.classList.toggle('dot', n < 2 && due > 0); b.classList.toggle('due', due > 0);
    a.setAttribute('aria-label', 'Pacientas' + (n > 1 ? ', ' + plural(n, ['sužeistasis', 'sužeistieji', 'sužeistųjų']) : '') + (due ? ', yra priminimų' : ''));
  }
  function tick() {
    nav();
    if (sheet) return;
    const b = app.querySelector('.hbar'); if (!b) return;
    const x = cur(); if (!x) return;
    b.innerHTML = barInner(x); b.setAttribute('aria-label', barLabel(x));
  }
  return { view, bar, act, after, nav, tick, isOpen: () => sheet, close: () => { sheet = false; fDone = false; }, esc: () => closeSheet(false), tab };
})();
