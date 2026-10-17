'use strict';
// ───────── March: paciento ekrano MARCH PAWS apžvalga ir vaistų skiltis (tik March gide; bendras paciento ekranas – pacientas.js) ─────────
// Kviečiama per TCFG.hub.overview / sections.vaistai (tools.js pradžioje). x – dabartinis sužeistasis (pacientas.js), H – jo pagalbininkai.
// Būsena kiekvienai raidei: „dėmesio“ (! – nukrypę požymiai ar nesustabdytas kraujavimas), „atlikta“ (✓ – kortelėje pažymėta pagalba
// arba sąraše pažymėtas punktas), kitaip „nežymėta“ (+ žymėti → TFC sąrašas). Kontroliniai sąrašai – dabartinio paciento (mg-ck, TCFG.pt).
const MPAWS = (() => {
  // [raidė, pavadinimas, sąrašas, tfc-paws dalies antraštės raidė]
  const R = [['M', 'Masyvus kraujavimas', 'tfc-m'], ['A', 'Kvėpavimo takai', 'tfc-a'], ['R', 'Kvėpavimas', 'tfc-r'], ['C', 'Kraujotaka', 'tfc-c'], ['H', 'Hipotermija, galva, akys', 'tfc-h'],
    ['P', 'Skausmas', 'tfc-paws', 'P'], ['A', 'Antibiotikai', 'tfc-paws', 'A'], ['W', 'Žaizdos', 'tfc-paws', 'W'], ['S', 'Įtvėrimas', 'tfc-paws', 'S']];
  const TXN = { tq: 'turniketas', tqj: 'jungties turniketas', dh: 'hemostatinis tvarstis', dp: 'spaudžiamasis tvarstis', dk: 'tvarstis', npa: 'NPA', igel: 'I-gel', cric: 'krikotiroidotomija', ak: 'kvėpavimo takai – kita',
    occl: 'okliuzinis tvarstis', dec: 'adatinė dekompresija', o2: 'O₂', ctube: 'krūtinės drenas', hypo: 'hipotermijos prevencija', eyeR: 'akies gaubtelis D', eyeL: 'akies gaubtelis K', dress: 'tvarstymas', spl: 'imobilizavimas' };
  // pažymėtų punktų skaičius sąraše (tfc-paws – tik vienos raidės dalyje), atsižvelgiant į „tik CLS“
  function ck(id, sec) {
    const L = (E.sarasai || {})[id]; if (!L) return 0;
    const d = (typeof ckAll === 'function' ? ckAll()[id] : null) || [];
    let on = !sec, n = 0;
    (L.items || []).forEach((it, i) => {
      if (it.h) { if (sec) on = String(it.h).trim().charAt(0) === sec; return; }
      if (on && ok(it.g) && d.indexOf(i) >= 0) n++;
    });
    return n;
  }
  const rowTxt = r => [r.name, r.dose, r.route, r.time].map(v => String(v || '').trim()).filter(Boolean).join(' ');
  function rows(c, g) { return (c.rows || []).filter(r => r && r.g === g && rowTxt(r)); }
  function evidence(x) {
    const c = x.c, tx = c.tx || [], has = k => tx.indexOf(k) >= 0, names = ks => ks.filter(has).map(k => TXN[k]);
    const v = (c.vit || []).slice(-1)[0] || {}, ab = k => v[k] !== '' && v[k] != null && MC.abn(k, v[k]);
    const tqs = Object.keys(c.tq || {}).filter(k => c.tq[k] && c.tq[k].on).map(k => 'turniketas ' + MC.tqName(k) + (c.tq[k].tm ? ' ' + c.tq[k].tm : ''));
    const bleed = (c.mk || []).some(m => m.t === 'K');
    const O = {};
    // M – masyvus kraujavimas; turniketo laikas pažymėtas, bet galūnė ne – dėmesio (→ turniketo langas)
    { const d = tqs.concat(names(['tqj', 'dh', 'dp'])), noLimb = +x.la.turn && !tqs.length && !has('tqj');
      O.M = { done: d.length > 0 && !noLimb, attn: (bleed && !d.length) || !!noLimb, href: noLimb ? '#/pacientas?sh=tq' : '',
        t: noLimb ? ['dėmesio: turniketas ' + hm(+x.la.turn) + ' – galūnė?'].concat(d).join(' · ') : d.length ? d.join(', ') : bleed ? 'kraujavimas pažymėtas schemoje – nesustabdytas?' : '' }; }
    // A – kvėpavimo takai
    { const d = names(['npa', 'igel', 'cric', 'ak']), u = v.av === 'P' || v.av === 'U'; O.A = { done: d.length > 0, attn: u && !d.length, t: [u ? 'AVPU ' + v.av : '', d.join(', ')].filter(Boolean).join(' · ') }; }
    // R – kvėpavimas
    { const d = names(['occl', 'dec', 'o2', 'ctube']); O.R = { done: d.length > 0, attn: ab('rr') || ab('spo2'), t: [v.rr ? 'KD ' + v.rr : '', v.spo2 ? 'SpO₂ ' + v.spo2 + ' %' : '', d.join(', ')].filter(Boolean).join(' · ') }; }
    // C – kraujotaka (TXA, skysčiai, kraujas)
    { const fl = rows(c, 'fl').concat(rows(c, 'bl')), txa = (c.rows || []).filter(r => /\btxa\b|tranek/i.test(String(r.name || ''))), d = fl.map(rowTxt).concat(txa.map(r => 'TXA' + (r.time ? ' ' + r.time : '')));
      O.C = { done: d.length > 0 || x.txa, attn: ab('hr') || ab('bp'), t: [v.hr ? 'pulsas ' + v.hr : '', v.bp ? 'AKS ' + v.bp : '', d.join(', ') || (x.txa ? 'TXA' : '')].filter(Boolean).join(' · ') }; }
    // H – hipotermija, galva, akys
    { const d = names(['hypo', 'eyeR', 'eyeL']); O.H = { done: d.length > 0, attn: false, t: d.join(', ') }; }
    // P, A, W, S
    { const d = rows(c, 'an').map(rowTxt); O.P = { done: d.length > 0, attn: false, t: d.join(', ') + (v.pain !== '' && v.pain != null ? (d.length ? ' · ' : '') + 'skausmas ' + v.pain + '/10' : '') }; }
    { const d = rows(c, 'ab').map(rowTxt); O.A2 = { done: d.length > 0, attn: false, t: d.join(', ') }; }
    { const d = names(['dress']), burn = (c.mk || []).some(m => m.t === 'N'); O.W = { done: d.length > 0, attn: false, t: [d.join(', '), burn ? 'nudegimas pažymėtas' : ''].filter(Boolean).join(' · ') }; }
    { const d = names(['spl']); O.S = { done: d.length > 0, attn: false, t: d.join(', ') }; }
    return O;
  }
  function status(x) {
    const ev = evidence(x);
    return R.map(([l, nm, id, sec], i) => {
      const e = ev[i === 6 ? 'A2' : l] || { done: false, attn: false, t: '' }, n = ck(id, sec);
      const st = e.attn ? 'attn' : e.done || n ? 'done' : 'none';
      const t = e.t || (n ? 'sąraše pažymėta: ' + n : '');
      return { l, nm, id, st, t, href: e.href || (typeof listRoute === 'function' ? listRoute(id) : '#/s/' + id) };
    });
  }
  const ICON = { done: '✓', attn: '!' };
  function section(x) {
    const S = status(x), dn = S.filter(s => s.st === 'done').length, at = S.filter(s => s.st === 'attn').length;
    return '<section class="card hbsec mpw" aria-label="MARCH PAWS apžvalga"><div class="hbsech"><b>MARCH PAWS</b><small>' + dn + ' / 9 atlikta' + (at ? ' · dėmesio: ' + at : '') + '</small></div>' +
      S.map(s => `<a class="mpr ${s.st}" href="${esc(s.href)}" aria-label="${esc(s.l + ' – ' + s.nm + ': ' + (s.st === 'done' ? 'atlikta' : s.st === 'attn' ? 'dėmesio' : 'dar nežymėta'))}">` +
        `<span class="mpl" aria-hidden="true">${s.l}</span><span class="mpt"><b>${esc(s.nm)}</b><small>${esc(s.t || 'dar nežymėta')}</small></span>` +
        (s.st === 'none' ? '<span class="mpa">+ žymėti</span>' : `<span class="mps" aria-hidden="true">${ICON[s.st]}</span>`) + '</a>').join('') +
      (mode === 'learn' ? '<p class="muted mt0">Būsena – iš MIST kortelės (pagalba, požymiai, C lentelė) ir TFC sąrašų žymėjimų. „!“ – nukrypę požymiai ar nesustabdytas kraujavimas.</p>' : '') + '</section>';
  }
  const overview = (x, H) => H.quick(false) + section(x) + H.tBox(x);
  // Skiltis „Vaistai“: suleista (C lentelė) ir dažniausi vaistai su dozėmis (March dozės nepriklauso nuo svorio), CLS / CMC žymos
  function drugs(x, H) {
    const C = TCFG.hub, w = +LS.get(TCFG.pre + 'svoris', 0) || 80;
    const D = (C.drugs || []).map(drugById).filter(v => v && C.drugOk(v));
    const cls = typeof tikCLS === 'function' && tikCLS();
    return H.tBox(x) + '<h2>Dažniausi vaistai</h2>' +
      `<p class="muted mt0">Rodoma: ${cls ? 'tik CLS (CMC vaistai paslėpti)' : 'CLS ir CMC'} – keičiama nustatymuose.</p>` +
      D.map(v => row('#/vaistas/' + v.id, v.name, doseShort(v, w), C.drugTag(v))).join('') +
      row('#/vaistai', 'Visi vaistai', plural((E.vaistai || []).filter(v => ok(v.lygis)).length, ['vaistas', 'vaistai', 'vaistų']) + ' pagal TCCC 2026');
  }
  return { overview, drugs, status, section };
})();

// „+ Vaistas“ (be vaistų žymėjimo): kortelės C lentelė – po perėjimo į paciento kortelę (&f=c) ją parodome.
// Adresą tikriname prieš HUB.after(), nes jis &f= pašalina (fokusas pritaikomas vieną kartą).
(() => {
  if (typeof HUB === 'undefined') return;
  const a0 = HUB.after;
  HUB.after = () => {
    const c = /[?&]f=c(&|$)/.test(location.hash);
    a0();
    if (!c) return;
    const el = app.querySelector('#mcT'); if (el) el.scrollIntoView({ block: 'start' });
  };
})();
