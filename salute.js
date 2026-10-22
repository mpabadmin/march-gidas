'use strict';
// ───────── SALUTE – priešo stebėjimo pranešimas (tik March gide) ─────────
// S – dydis, A – veikla, L – vieta, U – dalinys / uniforma, T – laikas, E – įranga. Siunčiamas pastebėjus priešą ar jo veiklą.
// Raktas – TCFG.pre + 'salute'. Priklauso nuo tools.js: TCFG, LS, esc, chip, stepper, row, toast, copyText, shareText, readMode, toMGRS;
// sitrep.js: SR.dtg; contrep.js: CR.status; core.js: mode, render.
const SU = (() => {
  const KEY = TCFG.pre + 'salute';
  const ACT = [['juda', 'Juda'], ['stebi', 'Stebi'], ['isitv', 'Įsitvirtina'], ['saudo', 'Šaudo'], ['puola', 'Puola'], ['atsitr', 'Atsitraukia'], ['stovi', 'Stovi / ilsisi']];
  const UNI = [['kamuf', 'Kamufliažas'], ['zenkl', 'Skiriamieji ženklai'], ['civil', 'Civiliniai drabužiai'], ['nezin', 'Nenustatyta']];
  const EQ = [['saut', 'Šautuvai'], ['kulk', 'Kulkosvaidžiai'], ['pt', 'Prieštankiniai ginklai'], ['techn', 'Šarvuota technika'], ['auto', 'Automobiliai'], ['dronai', 'Dronai'], ['netiesiog', 'Artilerija / minosvaidžiai']];
  const L6 = [['S', 'Dydis', 'Size'], ['A', 'Veikla', 'Activity'], ['L', 'Vieta', 'Location'], ['U', 'Dalinys / uniforma', 'Unit / Uniform'], ['T', 'Laikas', 'Time'], ['E', 'Įranga', 'Equipment']];
  const def = () => ({ cnt: 0, veh: 0, sizeTxt: '', act: [], actTxt: '', eloc: '', brg: '', rng: '', loc: '', uni: [], uniTxt: '', at: 0, zulu: false, eq: [], eqTxt: '' });
  const STR = ['sizeTxt', 'actTxt', 'eloc', 'brg', 'rng', 'loc', 'uniTxt', 'eqTxt'];
  const n99 = v => Math.max(0, Math.min(999, parseInt(v, 10) || 0));
  function get() {
    const raw = LS.get(KEY, {}), s = Object.assign(def(), raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {});
    STR.forEach(k => { if (typeof s[k] !== 'string') s[k] = ''; });
    ['act', 'uni', 'eq'].forEach(k => { s[k] = Array.isArray(s[k]) ? s[k].filter(x => typeof x === 'string') : []; });
    ['cnt', 'veh'].forEach(k => { s[k] = n99(s[k]); });
    s.at = +s.at > 0 ? +s.at : 0; s.zulu = !!s.zulu;
    return s;
  }
  const save = s => LS.set(KEY, s);
  const pick = (L, a) => L.filter(([k]) => a.indexOf(k) >= 0).map(x => x[1].toLowerCase()).join(', ');
  const join = (a, t) => [a, (t || '').trim()].filter(Boolean).join(' – ');
  const grid = v => v.trim().toUpperCase().replace(/\s+/g, ' ');
  function lines(s) {
    const size = [s.cnt ? 'apie ' + s.cnt + ' asm.' : '', s.veh ? s.veh + ' techn. vnt.' : ''].filter(Boolean).join(', ');
    const brg = s.brg.trim(), rng = s.rng.trim();
    const pol = [brg ? 'azimutas ' + brg + '°' : '', rng ? rng + ' m' : ''].filter(Boolean).join(', ');
    const own = grid(s.loc);
    return [
      join(size, s.sizeTxt),
      join(pick(ACT, s.act), s.actTxt),
      [grid(s.eloc), pol ? pol + (own ? ' nuo ' + own : '') : ''].filter(Boolean).join('; '),
      join(pick(UNI, s.uni), s.uniTxt),
      s.at ? SR.dtg(s.at, s.zulu) : '',
      join(pick(EQ, s.eq), s.eqTxt)
    ];
  }
  const text = s => 'SALUTE' + '\n' + lines(s).map((x, i) => L6[i][0] + ' – ' + (x || '—')).join('\n');
  function status() {
    const n = lines(get()).filter(Boolean).length;
    return n ? `Užpildyta ${n}/6 eilučių` : '';
  }
  function card(i, s, body, hint) {
    const v = lines(s)[i], [l, t, en] = L6[i];
    return `<section class="nl${v ? ' ok' : ''}"><div class="nlh"><span class="nn">${l}</span><b>${esc(t)}</b><small class="muted">${en}</small></div>${hint ? '<p class="muted">' + hint + '</p>' : ''}${body}</section>`;
  }
  const ta = (k, v, ph, lb) => `<textarea class="inp" data-su="${k}" rows="2" placeholder="${esc(ph)}" aria-label="${esc(lb)}">${esc(v)}</textarea>`;
  const inp = (k, v, ph, lb, extra) => `<input class="inp" data-su="${k}" value="${esc(v)}" placeholder="${esc(ph)}" autocomplete="off" aria-label="${esc(lb)}"${extra || ''}>`;
  const opts = (act, L, a) => '<div class="opts">' + L.map(([k, t]) => chip(act, k, a.indexOf(k) >= 0, t)).join('') + '</div>';
  function view() {
    const s = get(), learn = mode === 'learn';
    let h = '<h1>SALUTE – priešo stebėjimo pranešimas</h1>';
    if (learn) h += '<p class="muted">SALUTE – trumpas pranešimas apie pastebėtą priešą: kiek jų (S), ką daro (A), kur yra (L), koks dalinys ar uniforma (U), kada pastebėta (T) ir kokia įranga (E). Praneškite tik tai, ką matėte patys; spėjimus pažymėkite. Jei priešas jau šaudo į jus – pirmiausia CONTREP. Formatas – pagal JAV ir NATO šalių praktiką; detalės – pagal vieneto SOP.</p>';
    h += card(0, s, stepper('su-n', 'cnt', s.cnt, 'Asmenų', 'apytiksliai') + stepper('su-n', 'veh', s.veh, 'Technikos vienetų', 'transporto priemonės') + inp('sizeTxt', s.sizeTxt, 'pvz. skyrius, 2 grupės', 'Dydžio patikslinimas'));
    h += card(1, s, opts('su-act', ACT, s.act) + inp('actTxt', s.actTxt, 'Kryptis, greitis, pvz. juda į pietus keliu', 'Veiklos patikslinimas'));
    h += card(2, s, inp('eloc', s.eloc, 'pvz. 35U LA 1290 5710', 'Priešo vieta (MGRS)', ' autocapitalize="characters" spellcheck="false"') +
      '<div class="crr">' + inp('brg', s.brg, 'Azimutas °', 'Azimutas laipsniais', ' inputmode="numeric"') + inp('rng', s.rng, 'Atstumas, m', 'Atstumas metrais', ' inputmode="numeric"') + '</div>' +
      inp('loc', s.loc, 'Sava vieta (MGRS), jei nurodomas azimutas', 'Sava vieta (MGRS)', ' autocapitalize="characters" spellcheck="false"') + '<button class="btn sm" data-act="su-gps">📍 Mano vieta (GPS → MGRS)</button>', 'Priešo MGRS koordinatė arba azimutas ir atstumas nuo jūsų vietos.');
    h += card(3, s, opts('su-uni', UNI, s.uni) + ta('uniTxt', s.uniTxt, 'Ženklai, spalvos, šalmai, dalinio požymiai', 'Dalinio ar uniformos patikslinimas'));
    h += card(4, s, `<div class="srt"><button class="btn sm pri" data-act="su-now">⏱ ${s.at ? 'Atnaujinti' : 'Dabar'}</button><span class="srdtg">${s.at ? esc(SR.dtg(s.at, s.zulu)) : '—'}</span></div><div class="seg2" role="group" aria-label="Laiko zona">${chip('su-zulu', '0', !s.zulu, 'Vietinis (L)')}${chip('su-zulu', '1', s.zulu, 'Zulu (Z, UTC)')}</div>`, 'Kada pastebėta (ne kada siunčiate) – DDHHMM, zona, mėnuo, metai.');
    h += card(5, s, opts('su-eq', EQ, s.eq) + ta('eqTxt', s.eqTxt, 'Ginklų ir technikos tipai, kiekiai', 'Įrangos patikslinimas'));
    h += `<section class="outp"><div class="nlh"><b>Perduoti</b></div><pre id="su-out">${esc(text(s))}</pre>` +
      '<div class="acts"><button class="btn pri" data-act="su-read">Skaityti per radiją</button><button class="btn" data-act="su-copy">Kopijuoti</button><button class="btn" data-act="su-share">Bendrinti</button><button class="btn" data-act="su-clear">Išvalyti</button></div></section>';
    h += row('#/contrep', 'CONTREP – kontakto pranešimas', CR.status()) + row('#/sitrep', 'SITREP – padėties pranešimas', SR.status());
    return h;
  }
  function act(el) {
    const s = get(), d = el.dataset, k = d.k;
    const tog = (L, a) => { if (!L.some(x => x[0] === k)) return false; const i = a.indexOf(k); if (i >= 0) a.splice(i, 1); else a.push(k); return true; };
    switch (d.act) {
      case 'su-now': s.at = Date.now(); break;
      case 'su-zulu': s.zulu = k === '1'; break;
      case 'su-act': if (!tog(ACT, s.act)) return; break;
      case 'su-uni': if (!tog(UNI, s.uni)) return; break;
      case 'su-eq': if (!tog(EQ, s.eq)) return; break;
      case 'su-n': if (!['cnt', 'veh'].includes(k)) return; s[k] = n99(s[k] + (+d.d)); break;
      case 'su-copy': return copyText(text(s));
      case 'su-share': return shareText('SALUTE', text(s));
      case 'su-read': return readMode('SALUTE', lines(s).map((x, i) => `<span class="rn">${L6[i][0]}</span>${esc(x || '—')}<small>${esc(L6[i][1])}</small>`));
      case 'su-clear': if (!confirm('Išvalyti visą SALUTE?')) return; LS.set(KEY, def()); render(); return;
      case 'su-gps': return gps();
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
    const s = get(), k = t.dataset.su; if (STR.indexOf(k) < 0) return;
    s[k] = t.value; save(s);
    const o = document.getElementById('su-out'); if (o) o.textContent = text(s);
    const sec = t.closest('section.nl'); if (sec) { const n = [...document.querySelectorAll('section.nl')].indexOf(sec); sec.classList.toggle('ok', !!lines(s)[n]); }
  }
  return { view, act, onInput, status, lines, text };
})();
