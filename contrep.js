'use strict';
// ───────── CONTREP – kontakto pranešimas (tik March gide) ─────────
// Siunčiamas iškart po susidūrimo su priešu. Formatas priklauso nuo vieneto SOP – čia bendrasis (NATO šalių praktika):
// laikas, priešo vieta, sava vieta, priešas (kiekis ir tipas), priešo veiksmai, savi veiksmai, savi nuostoliai.
// Raktas – TCFG.pre + 'contrep'. Priklauso nuo tools.js: TCFG, LS, esc, chip, stepper, row, plural, toast, copyText, shareText,
// readMode, toMGRS, MC, NL; sitrep.js: SR.dtg; core.js: mode, render.
const CR = (() => {
  const KEY = TCFG.pre + 'contrep';
  const DIR = [['priekyje', 'Priekyje'], ['kaireje', 'Kairėje'], ['desineje', 'Dešinėje'], ['gale', 'Gale'], ['virsuje', 'Virš mūsų (oru)']];
  const TYP = [['pest', 'Pėstininkai'], ['tech', 'Šarvuota technika'], ['dronas', 'Dronas'], ['snaip', 'Snaiperis'], ['netiesiog', 'Artilerija / minosvaidžiai'], ['ssu', 'SSU / mina'], ['nezin', 'Nenustatyta']];
  const EACT = [['saudo', 'Šaudo į mus'], ['juda', 'Juda'], ['stebi', 'Stebi / laikosi pozicijos'], ['atsitr', 'Atsitraukia'], ['puola', 'Puola']];
  const OACT = [['atsako', 'Atsakome ugnimi'], ['prieglaud', 'Užėmėme priedangą'], ['manevr', 'Manevruojame'], ['atsitr', 'Atsitraukiame'], ['stebime', 'Stebime'], ['ugnis', 'Prašome ugnies paramos']];
  const TITLES = ['Kontakto laikas (DTG)', 'Priešo vieta', 'Sava vieta', 'Priešas – kiekis ir tipas', 'Priešo veiksmai', 'Savi veiksmai ir ketinimai', 'Savi nuostoliai'];
  const def = () => ({ at: 0, zulu: false, dir: '', brg: '', rng: '', eloc: '', loc: '', cnt: 0, typ: [], enTxt: '', eact: [], eactTxt: '', oact: [], oactTxt: '', wia: 0, kia: 0, casTxt: '' });
  const STR = ['dir', 'brg', 'rng', 'eloc', 'loc', 'enTxt', 'eactTxt', 'oactTxt', 'casTxt'];
  const n99 = v => Math.max(0, Math.min(999, parseInt(v, 10) || 0));
  function get() {
    const raw = LS.get(KEY, {}), s = Object.assign(def(), raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {});
    STR.forEach(k => { if (typeof s[k] !== 'string') s[k] = ''; });
    ['typ', 'eact', 'oact'].forEach(k => { s[k] = Array.isArray(s[k]) ? s[k].filter(x => typeof x === 'string') : []; });
    ['cnt', 'wia', 'kia'].forEach(k => { s[k] = n99(s[k]); });
    s.at = +s.at > 0 ? +s.at : 0; s.zulu = !!s.zulu;
    if (!DIR.some(x => x[0] === s.dir)) s.dir = '';
    return s;
  }
  const save = s => LS.set(KEY, s);
  const nm = (L, k) => (L.find(x => x[0] === k) || [k, k])[1];
  const pick = (L, a) => L.filter(([k]) => a.indexOf(k) >= 0).map(x => x[1].toLowerCase()).join(', ');
  const join = (a, t) => [a, (t || '').trim()].filter(Boolean).join(' – ');
  const grid = v => v.trim().toUpperCase().replace(/\s+/g, ' ');
  function lines(s) {
    const brg = s.brg.trim(), rng = s.rng.trim();
    const pol = [s.dir ? nm(DIR, s.dir).toLowerCase() : '', brg ? 'azimutas ' + brg + '°' : '', rng ? rng + ' m' : ''].filter(Boolean).join(', ');
    const en = [s.cnt ? 'apie ' + s.cnt : '', pick(TYP, s.typ)].filter(Boolean).join(' ');
    const cas = s.wia || s.kia ? `sužeisti ${s.wia}, žuvę ${s.kia}` : '';
    return [
      s.at ? SR.dtg(s.at, s.zulu) : '',
      [grid(s.eloc), pol].filter(Boolean).join('; '),
      grid(s.loc),
      join(en, s.enTxt),
      join(pick(EACT, s.eact), s.eactTxt),
      join(pick(OACT, s.oact), s.oactTxt),
      join(cas, s.casTxt)
    ];
  }
  const text = s => 'CONTREP' + (s.at ? ' ' + SR.dtg(s.at, s.zulu) : '') + '\n' + lines(s).map((x, i) => (i + 1) + '. ' + (x || '—')).join('\n');
  // Pirminis pranešimas – tik kryptis, kol užimama priedanga ir atsakoma ugnimi
  const alertTxt = s => 'KONTAKTAS' + (s.dir ? ' ' + nm(DIR, s.dir).toUpperCase() : '') + ', LAUKITE';
  function status() {
    const n = lines(get()).filter(Boolean).length;
    return n ? `Užpildyta ${n}/7 eilučių` : 'Kontakto su priešu pranešimas';
  }
  function card(n, s, body, hint) {
    const v = lines(s)[n - 1], req = n === 1 || n === 2 || n === 4;
    return `<section class="nl${v ? ' ok' : ''}${req ? ' req' : ''}"><div class="nlh"><span class="nn">${n}</span><b>${esc(TITLES[n - 1])}</b>${req ? '<small class="rq">būtina</small>' : ''}</div>${hint ? '<p class="muted">' + hint + '</p>' : ''}${body}</section>`;
  }
  const ta = (k, v, ph, lb, rows) => `<textarea class="inp" data-cr="${k}" rows="${rows || 2}" placeholder="${esc(ph)}" aria-label="${esc(lb)}">${esc(v)}</textarea>`;
  const inp = (k, v, ph, lb, extra) => `<input class="inp" data-cr="${k}" value="${esc(v)}" placeholder="${esc(ph)}" autocomplete="off" aria-label="${esc(lb)}"${extra || ''}>`;
  const mist = () => { try { return MC.state().pts.filter(MC.used).length; } catch (e) { return 0; } };
  function view() {
    const s = get(), learn = mode === 'learn', nm2 = mist();
    let h = '<h1>CONTREP – kontakto pranešimas</h1>';
    if (learn) h += '<p class="muted">CONTREP siunčiamas iškart po susidūrimo su priešu. Pirmiausia – priedanga ir ugnies pranašumas; vadui iškart trumpai: „Kontaktas, laukite“ (su kryptimi). Kai įmanoma – pilnas pranešimas: kada, kur priešas, kur esate, kiek ir kas, ką priešas daro, ką darote jūs ir ar yra sužeistųjų. Formatas priklauso nuo vieneto SOP – čia bendrasis formatas (pagal NATO šalių praktiką). Sužeistiesiems – MIST ir 9-Line, vėliau – SITREP. Priešą tik stebite, bet kontakto nėra – SALUTE.</p>';
    h += `<section class="nl req"><div class="nlh"><b>Pirminis pranešimas</b></div><p class="muted">Kryptis nuo savęs (pagal judėjimo kryptį).</p><div class="opts">` + DIR.map(([k, t]) => chip('cr-dir', k, s.dir === k, t)).join('') +
      `</div><p class="srdtg" id="cr-alert">${esc(alertTxt(s))}</p><button class="btn pri" data-act="cr-alert">⏱ Kontaktas dabar</button></section>`;
    h += card(1, s, `<div class="srt"><button class="btn sm pri" data-act="cr-now">⏱ ${s.at ? 'Atnaujinti' : 'Dabar'}</button><span class="srdtg">${s.at ? esc(SR.dtg(s.at, s.zulu)) : '—'}</span></div><div class="seg2" role="group" aria-label="Laiko zona">${chip('cr-zulu', '0', !s.zulu, 'Vietinis (L)')}${chip('cr-zulu', '1', s.zulu, 'Zulu (Z, UTC)')}</div>`, 'Kada užmegztas kontaktas – DDHHMM, zona, mėnuo, metai.');
    h += card(2, s, inp('eloc', s.eloc, 'pvz. 35U LA 1290 5710', 'Priešo vieta (MGRS)', ' autocapitalize="characters" spellcheck="false"') +
      '<div class="crr">' + inp('brg', s.brg, 'Azimutas °', 'Azimutas laipsniais', ' inputmode="numeric"') + inp('rng', s.rng, 'Atstumas, m', 'Atstumas metrais', ' inputmode="numeric"') + '</div>', 'MGRS koordinatė arba azimutas ir atstumas nuo jūsų. Kryptis – iš pirminio pranešimo.');
    h += card(3, s, inp('loc', s.loc, 'pvz. 35U LA 1234 5678', 'Sava vieta (MGRS)', ' autocapitalize="characters" spellcheck="false"') + '<button class="btn sm" data-act="cr-gps">📍 Mano vieta (GPS → MGRS)</button>');
    h += card(4, s, stepper('cr-n', 'cnt', s.cnt, 'Kiek priešų', 'apytiksliai; 0 – nežinoma') + '<div class="opts">' + TYP.map(([k, t]) => chip('cr-typ', k, s.typ.indexOf(k) >= 0, t)).join('') + '</div>' + ta('enTxt', s.enTxt, 'Ginkluotė, technika, uniforma, dalinys', 'Priešo patikslinimas'));
    h += card(5, s, '<div class="opts">' + EACT.map(([k, t]) => chip('cr-eact', k, s.eact.indexOf(k) >= 0, t)).join('') + '</div>' + inp('eactTxt', s.eactTxt, 'Patikslinimas, pvz. juda į šiaurę', 'Priešo veiksmų patikslinimas'));
    h += card(6, s, '<div class="opts">' + OACT.map(([k, t]) => chip('cr-oact', k, s.oact.indexOf(k) >= 0, t)).join('') + '</div>' + ta('oactTxt', s.oactTxt, 'Ką darysite toliau, ko reikia', 'Savų veiksmų patikslinimas'));
    h += card(7, s, stepper('cr-n', 'wia', s.wia, 'Sužeisti', 'WIA') + stepper('cr-n', 'kia', s.kia, 'Žuvę', 'KIA') +
      (nm2 ? `<p class="muted">MIST kortelėse: ${plural(nm2, ['sužeistasis', 'sužeistieji', 'sužeistųjų'])}</p><button class="btn sm" data-act="cr-fill">Įrašyti iš MIST</button>` : '') +
      inp('casTxt', s.casTxt, 'Patikslinimas, pvz. 1 skubus, reikia MEDEVAC', 'Nuostolių patikslinimas') +
      (s.wia || s.kia ? row('#/9line', '9-Line MEDEVAC prašymas', NL.status()) + row('#/mist', 'MIST kortelė', MC.status()) : ''), 'Jei sužeistųjų nėra – palikite tuščią.');
    h += `<section class="outp"><div class="nlh"><b>Perduoti</b></div><pre id="cr-out">${esc(text(s))}</pre>` +
      '<div class="acts"><button class="btn pri" data-act="cr-read">Skaityti per radiją</button><button class="btn" data-act="cr-copy">Kopijuoti</button><button class="btn" data-act="cr-share">Bendrinti</button><button class="btn" data-act="cr-clear">Išvalyti</button></div></section>';
    h += row('#/salute', 'SALUTE – priešo stebėjimo pranešimas', SU.status()) + row('#/sitrep', 'SITREP – padėties pranešimas', SR.status()) + row('#/9line', '9-Line MEDEVAC', NL.status());
    return h;
  }
  function act(el) {
    const s = get(), d = el.dataset, k = d.k;
    const tog = (a, v) => { const i = a.indexOf(v); if (i >= 0) a.splice(i, 1); else a.push(v); };
    switch (d.act) {
      case 'cr-now': s.at = Date.now(); break;
      case 'cr-alert': s.at = Date.now(); save(s); render(); return readMode('Kontaktas', [`<span class="rn">!</span>${esc(alertTxt(s))}<small>Pirminis pranešimas</small>`]);
      case 'cr-zulu': s.zulu = k === '1'; break;
      case 'cr-dir': if (!DIR.some(x => x[0] === k)) return; s.dir = s.dir === k ? '' : k; break;
      case 'cr-typ': if (!TYP.some(x => x[0] === k)) return; tog(s.typ, k); break;
      case 'cr-eact': if (!EACT.some(x => x[0] === k)) return; tog(s.eact, k); break;
      case 'cr-oact': if (!OACT.some(x => x[0] === k)) return; tog(s.oact, k); break;
      case 'cr-n': if (!['cnt', 'wia', 'kia'].includes(k)) return; s[k] = n99(s[k] + (+d.d)); break;
      case 'cr-fill': s.wia = Math.max(s.wia, mist()); toast('Įrašyta – patikrinkite skaičių'); break;
      case 'cr-copy': return copyText(text(s));
      case 'cr-share': return shareText('CONTREP', text(s));
      case 'cr-read': return readMode('CONTREP', lines(s).map((x, i) => `<span class="rn">${i + 1}</span>${esc(x || '—')}<small>${esc(TITLES[i])}</small>`));
      case 'cr-clear': if (!confirm('Išvalyti visą CONTREP?')) return; LS.set(KEY, def()); render(); return;
      case 'cr-gps': return gps();
      default: return;
    }
    save(s); const y = scrollY; render(); scrollTo(0, y);
  }
  function gps() {
    if (!navigator.geolocation) return toast('Šis įrenginys vietos nustatymo nepalaiko');
    toast('Nustatoma vieta…');
    navigator.geolocation.getCurrentPosition(pos => {
      const m = toMGRS(pos.coords.latitude, pos.coords.longitude, 4);
      if (!m) return toast('Šiai vietovei MGRS netaikomas');
      const s = get(); s.loc = m; save(s); render();
      toast('Vieta nustatyta, tikslumas ±' + Math.round(pos.coords.accuracy) + ' m');
    }, err => toast(err.code === 1 ? 'Vietos nustatymas neleidžiamas – leiskite naršyklės nustatymuose' : 'Nepavyko nustatyti vietos'), { enableHighAccuracy: true, timeout: 20000, maximumAge: 30000 });
  }
  function onInput(t) {
    const s = get(), k = t.dataset.cr; if (STR.indexOf(k) < 0) return;
    s[k] = t.value; save(s);
    const o = document.getElementById('cr-out'); if (o) o.textContent = text(s);
    const sec = t.closest('section.nl'); if (sec) { const n = [...document.querySelectorAll('section.nl')].indexOf(sec) - 1; if (n >= 0) sec.classList.toggle('ok', !!lines(s)[n]); }
  }
  return { view, act, onInput, status, lines, text };
})();
