'use strict';
// ───────── SITREP – padėties pranešimas (trumpasis taktinis formatas) ─────────
// Bendras failas ETC ir March giduose (laikyti identišką). Raktas – TCFG.pre + 'sitrep'.
// Priklauso nuo tools.js: TCFG, LS, esc, chip, stepper, row, plural, toast, copyText, shareText, readMode, toMGRS, MC, NL; core.js: mode, render.
const SR = (() => {
  const KEY = TCFG.pre + 'sitrep';
  const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const p2 = n => String(n).padStart(2, '0');
  // DTG: DDHHMM + zona (L – vietinis, Z – Zulu) + mėnuo + metai, pvz. „112045L OCT 26“
  function dtg(ts, z) {
    const d = new Date(ts);
    const D = z ? d.getUTCDate() : d.getDate(), H = z ? d.getUTCHours() : d.getHours(), M = z ? d.getUTCMinutes() : d.getMinutes();
    const mo = z ? d.getUTCMonth() : d.getMonth(), y = z ? d.getUTCFullYear() : d.getFullYear();
    return p2(D) + p2(H) + p2(M) + (z ? 'Z' : 'L') + ' ' + MON[mo] + ' ' + String(y).slice(2);
  }
  const EN = [['N', 'Kontakto nėra'], ['S', 'Priešas stebimas'], ['K', 'Ugnies kontaktas'], ['P', 'Kontaktas nutrūko']];
  const ACT = [['stebime', 'Stebime / saugome'], ['pagalba', 'Teikiame pagalbą sužeistiesiems'], ['laukiame', 'Laukiame evakuacijos'], ['evakuojame', 'Evakuojame'], ['judame', 'Judame'], ['pasiruose', 'Pasiruošę užduočiai']];
  const LG = [['saud', 'Šaudmenys'], ['vand', 'Vanduo'], ['med', 'Medicinos priemonės'], ['kuras', 'Kuras'], ['elektra', 'Baterijos, elektra'], ['maist', 'Maistas']];
  const LGS = [['Ž', 'žalia – pakanka'], ['G', 'geltona – mažėja'], ['R', 'raudona – kritiškai mažai'], ['J', 'juoda – nėra']];
  const LGC = { 'Ž': 'z', G: 'g', R: 'r', J: 'j' }; // CSS klasės
  const COM = [['V', 'Veikia'], ['T', 'Su trikdžiais'], ['N', 'Ryšio nėra (tik atsarginis)']];
  const REQ = [['medevac', 'MEDEVAC'], ['papild', 'Papildymas (šaudmenys, vanduo, med. priemonės)'], ['pastipr', 'Pastiprinimas'], ['ugnis', 'Ugnies parama'], ['transp', 'Transportas'], ['nera', 'Nėra']];
  const TITLES = ['Data ir laikas (DTG)', 'Šaukinys / padalinys', 'Vieta', 'Priešas', 'Sava padėtis ir veikla', 'Asmenys ir nuostoliai', 'Logistika', 'Ryšys', 'Vado vertinimas ir planas', 'Prašymai'];
  const def = () => ({ at: 0, zulu: false, cs: '', loc: '', en: '', enTxt: '', act: [], actTxt: '', ok: 0, wia: 0, kia: 0, mia: 0, perTxt: '', lg: {}, lgTxt: '', com: '', comTxt: '', assess: '', req: [], reqTxt: '' });
  const n99 = v => Math.max(0, Math.min(999, parseInt(v, 10) || 0));
  function get() {
    const raw = LS.get(KEY, {}), s = Object.assign(def(), raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {});
    ['cs', 'loc', 'en', 'enTxt', 'actTxt', 'perTxt', 'lgTxt', 'com', 'comTxt', 'assess', 'reqTxt'].forEach(k => { if (typeof s[k] !== 'string') s[k] = ''; });
    ['act', 'req'].forEach(k => { s[k] = Array.isArray(s[k]) ? s[k].filter(x => typeof x === 'string') : []; });
    ['ok', 'wia', 'kia', 'mia'].forEach(k => { s[k] = n99(s[k]); });
    s.at = +s.at > 0 ? +s.at : 0; s.zulu = !!s.zulu;
    const lg = s.lg && typeof s.lg === 'object' ? s.lg : {}; s.lg = {};
    LG.forEach(([k]) => { if (LGS.some(x => x[0] === lg[k])) s.lg[k] = lg[k]; });
    return s;
  }
  const save = s => LS.set(KEY, s);
  const nm = (L, k) => (L.find(x => x[0] === k) || [k, k])[1];
  const join = (a, t) => [a, (t || '').trim()].filter(Boolean).join(' – ');
  function lines(s) {
    const per = s.ok || s.wia || s.kia || s.mia ? `kovingi ${s.ok}, sužeisti ${s.wia}, žuvę ${s.kia}, dingę ${s.mia}` : '';
    const lg = LG.filter(([k]) => s.lg[k]).map(([k, t]) => t + ' ' + s.lg[k]).join(', ');
    return [
      s.at ? dtg(s.at, s.zulu) : '',
      s.cs.trim(),
      s.loc.trim().toUpperCase().replace(/\s+/g, ' '),
      join(s.en ? nm(EN, s.en) : '', s.enTxt),
      join(ACT.filter(([k]) => s.act.indexOf(k) >= 0).map(x => x[1].toLowerCase()).join(', '), s.actTxt),
      join(per, s.perTxt),
      join(lg, s.lgTxt),
      join(s.com ? nm(COM, s.com) : '', s.comTxt),
      s.assess.trim(),
      join(REQ.filter(([k]) => s.req.indexOf(k) >= 0).map(x => x[0] === 'medevac' ? 'MEDEVAC (žr. 9-Line)' : x[1].toLowerCase()).join(', '), s.reqTxt)
    ];
  }
  const text = s => 'SITREP' + (s.at ? ' ' + dtg(s.at, s.zulu) : '') + '\n' + lines(s).map((x, i) => (i + 1) + '. ' + (x || '—')).join('\n');
  function status() {
    const L = lines(get()), n = L.filter(Boolean).length;
    return n ? `Užpildyta ${n}/10 eilučių` : '';
  }
  function card(n, s, body, hint) {
    const v = lines(s)[n - 1], req = n <= 3;
    return `<section class="nl${v ? ' ok' : ''}${req ? ' req' : ''}"><div class="nlh"><span class="nn">${n}</span><b>${esc(TITLES[n - 1])}</b>${req ? '<small class="rq">būtina</small>' : ''}</div>${hint ? '<p class="muted">' + hint + '</p>' : ''}${body}</section>`;
  }
  const ta = (k, v, ph, lb, rows) => `<textarea class="inp" data-sr="${k}" rows="${rows || 2}" placeholder="${esc(ph)}" aria-label="${esc(lb)}">${esc(v)}</textarea>`;
  const inp = (k, v, ph, lb, extra) => `<input class="inp" data-sr="${k}" value="${esc(v)}" placeholder="${esc(ph)}" autocomplete="off" aria-label="${esc(lb)}"${extra || ''}>`;
  // Sužeistieji – užpildytos MIST kortelės (su evakuacijos kategorijomis), 10s triažo skaičiavimas
  function others() {
    const tst = LS.get(TCFG.pre + 'tst', null);
    let pts = []; try { pts = MC.state().pts.filter(MC.used); } catch (e) {}
    const ev = { u: 0, p: 0, r: 0 }; pts.forEach(c => { if (ev[c.evac] != null) ev[c.evac]++; });
    const t = tst && tst.n && typeof tst.n === 'object' ? tst.n : null;
    const tTot = t ? ['p1', 'p2', 'p3', 'nb'].reduce((a, k) => a + n99(t[k]), 0) : 0;
    // Mascal lenta (ETC gide; March gide rakto nėra – niekas nesikeičia): T1–T4 – sužeisti, X – žuvę
    const msr = LS.get(TCFG.pre + 'mascal', null), mc = msr && Array.isArray(msr.c) ? msr.c.filter(x => x && typeof x.k === 'string') : [];
    const ms = { T1: 0, T2: 0, T3: 0, T4: 0, X: 0 }; mc.forEach(x => { if (ms[x.k] != null) ms[x.k]++; });
    const msW = ms.T1 + ms.T2 + ms.T3 + ms.T4;
    return { mist: pts.length, ev, t, tTot, ms, msW, msTot: msW + ms.X };
  }
  const msTxt = ms => `Mascal: T1 ${ms.T1} · T2 ${ms.T2} · T3 ${ms.T3} · T4 ${ms.T4} · mirę ${ms.X}`;
  const evTxt = ev => [ev.u ? ev.u + ' neatidėliotina (A)' : '', ev.p ? ev.p + ' skubi (C)' : '', ev.r ? ev.r + ' įprastinė (D)' : ''].filter(Boolean).join(', ');
  function view() {
    const s = get(), learn = mode === 'learn', o = others();
    let h = '<h1>SITREP – padėties pranešimas</h1>';
    if (learn) h += '<p class="muted">SITREP – trumpas pranešimas vadui: kur esate, kas vyksta, kokia jūsų būklė ir ko reikia. Formatas priklauso nuo vieneto SOP – čia bendrasis trumpasis taktinis formatas (pagal JAV ir NATO praktiką). Perduokite trumpai, tik tai, kas pasikeitė ar svarbu; atviru kanalu – be slaptos informacijos.</p>';
    h += card(1, s, `<div class="srt"><button class="btn sm pri" data-act="sr-now">⏱ ${s.at ? 'Atnaujinti' : 'Dabar'}</button><span class="srdtg">${s.at ? esc(dtg(s.at, s.zulu)) : '—'}</span></div><div class="seg2" role="group" aria-label="Laiko zona">${chip('sr-zulu', '0', !s.zulu, 'Vietinis (L)')}${chip('sr-zulu', '1', s.zulu, 'Zulu (Z, UTC)')}</div>`, 'Pranešimo laikas – DDHHMM, zona, mėnuo, metai.');
    h += card(2, s, inp('cs', s.cs, 'pvz. Vilkas 2', 'Šaukinys ar padalinys'));
    h += card(3, s, inp('loc', s.loc, 'pvz. 35U LA 1234 5678', 'Vieta (MGRS)', ' autocapitalize="characters" spellcheck="false"') + '<button class="btn sm" data-act="sr-gps">📍 Mano vieta (GPS → MGRS)</button>', 'MGRS koordinatė arba orientyras pagal SOP.');
    h += card(4, s, '<div class="opts">' + EN.map(([k, t]) => chip('sr-en', k, s.en === k, t)).join('') + '</div>' + ta('enTxt', s.enTxt, 'Dydis, veikla, vieta, uniforma, laikas, įranga (SALUTE)', 'Priešo patikslinimas'));
    h += card(5, s, '<div class="opts">' + ACT.map(([k, t]) => chip('sr-act', k, s.act.indexOf(k) >= 0, t)).join('') + '</div>' + ta('actTxt', s.actTxt, 'Patikslinimas, pvz. pozicija, judėjimo kryptis', 'Savos padėties patikslinimas'));
    let fill = '';
    if (o.mist || o.tTot || o.msTot) fill = '<p class="muted">' + [o.mist ? 'MIST kortelėse: ' + plural(o.mist, ['sužeistasis', 'sužeistieji', 'sužeistųjų']) + (evTxt(o.ev) ? ' (evakuacija: ' + evTxt(o.ev) + ')' : '') : '', o.tTot ? `10s triažas: P1 ${n99(o.t.p1)} · P2 ${n99(o.t.p2)} · P3 ${n99(o.t.p3)} · nekvėpuoja ${n99(o.t.nb)}` : '', o.msTot ? msTxt(o.ms) : ''].filter(Boolean).join(' · ') + '</p><button class="btn sm" data-act="sr-fill">Užpildyti iš pacientų (MIST / 10s triažo' + (o.msTot ? ' / Mascal' : '') + ')</button>';
    h += card(6, s, stepper('sr-n', 'ok', s.ok, 'Kovingi', 'gali tęsti užduotį') + stepper('sr-n', 'wia', s.wia, 'Sužeisti', 'WIA') + stepper('sr-n', 'kia', s.kia, 'Žuvę', 'KIA') + stepper('sr-n', 'mia', s.mia, 'Dingę be žinios', 'MIA') + fill + ta('perTxt', s.perTxt, 'Patikslinimas, pvz. 2 skubūs (A), 1 įprastinis (D)', 'Asmenų patikslinimas'));
    h += card(7, s, LG.map(([k, t]) => `<div class="lgr"><span>${esc(t)}</span><div class="lgs" role="group" aria-label="${esc(t)}">` + LGS.map(([c, d]) => `<button class="lg-${LGC[c]}${s.lg[k] === c ? ' on' : ''}" data-act="sr-lg" data-k="${k}" data-c="${c}" aria-pressed="${s.lg[k] === c}" aria-label="${esc(t)}: ${esc(d)}">${c}</button>`).join('') + '</div></div>').join('') + ta('lgTxt', s.lgTxt, 'Patikslinimas, pvz. trūksta turniketų, 2 l vandens', 'Logistikos patikslinimas'), 'Ž – pakanka, G – mažėja, R – kritiškai mažai, J – nėra. Ribos – pagal SOP.');
    h += card(8, s, '<div class="opts">' + COM.map(([k, t]) => chip('sr-com', k, s.com === k, t)).join('') + '</div>' + inp('comTxt', s.comTxt, 'Patikslinimas, pvz. atsarginis kanalas', 'Ryšio patikslinimas'));
    h += card(9, s, ta('assess', s.assess, 'Kas svarbiausia vadui, ką darysite toliau', 'Vado vertinimas ir planas', 3));
    h += card(10, s, '<div class="opts">' + REQ.map(([k, t]) => chip('sr-req', k, s.req.indexOf(k) >= 0, t)).join('') + '</div>' + inp('reqTxt', s.reqTxt, 'Patikslinimas, pvz. 6 turniketai, 1 neštuvai', 'Prašymų patikslinimas') + (s.req.indexOf('medevac') >= 0 ? row('#/9line', '9-Line MEDEVAC prašymas', NL.status()) : ''));
    h += `<section class="outp"><div class="nlh"><b>Perduoti</b></div><pre id="sr-out">${esc(text(s))}</pre>` +
      '<div class="acts"><button class="btn pri" data-act="sr-read">Skaityti per radiją</button><button class="btn" data-act="sr-copy">Kopijuoti</button><button class="btn" data-act="sr-share">Bendrinti</button><button class="btn" data-act="sr-clear">Išvalyti</button></div></section>';
    h += row('#/9line', '9-Line MEDEVAC', NL.status()) + row('#/mist', 'MIST kortelė', MC.status());
    return h;
  }
  function act(el) {
    const s = get(), d = el.dataset, k = d.k;
    switch (d.act) {
      case 'sr-now': s.at = Date.now(); break;
      case 'sr-zulu': s.zulu = k === '1'; break;
      case 'sr-en': s.en = s.en === k ? '' : k; break;
      case 'sr-com': s.com = s.com === k ? '' : k; break;
      case 'sr-act': { const i = s.act.indexOf(k); if (i >= 0) s.act.splice(i, 1); else s.act.push(k); break; }
      case 'sr-req': { if (k === 'nera') s.req = s.req.indexOf('nera') >= 0 ? [] : ['nera']; else { s.req = s.req.filter(x => x !== 'nera'); const i = s.req.indexOf(k); if (i >= 0) s.req.splice(i, 1); else s.req.push(k); } break; }
      case 'sr-n': if (!['ok', 'wia', 'kia', 'mia'].includes(k)) return; s[k] = n99(s[k] + (+d.d)); break;
      case 'sr-lg': if (!LG.some(x => x[0] === k)) return; s.lg[k] = s.lg[k] === d.c ? undefined : d.c; if (!s.lg[k]) delete s.lg[k]; break;
      case 'sr-fill': {
        const o = others(), tw = o.t ? n99(o.t.p1) + n99(o.t.p2) + n99(o.t.p3) : 0;
        s.wia = Math.max(o.mist, tw, o.msW, s.wia); if (o.ms.X) s.kia = Math.max(o.ms.X, s.kia);
        const et = evTxt(o.ev); if (et && s.perTxt.indexOf('Evakuacija:') < 0) s.perTxt = [s.perTxt.trim(), 'Evakuacija: ' + et].filter(Boolean).join('; ');
        if (o.tTot) { const add = `10s triažas: P1 ${n99(o.t.p1)}, P2 ${n99(o.t.p2)}, P3 ${n99(o.t.p3)}, nekvėpuoja ${n99(o.t.nb)}`; if (s.perTxt.indexOf('10s triažas:') < 0 && s.perTxt.indexOf('TST:') < 0) s.perTxt = [s.perTxt.trim(), add].filter(Boolean).join('; '); }
        if (o.msTot && s.perTxt.indexOf('Mascal:') < 0) s.perTxt = [s.perTxt.trim(), msTxt(o.ms).replace(/ · /g, ', ')].filter(Boolean).join('; ');
        toast('Įrašyta – patikrinkite skaičius'); break;
      }
      case 'sr-copy': return copyText(text(s));
      case 'sr-share': return shareText('SITREP', text(s));
      case 'sr-read': return readMode('SITREP', lines(s).map((x, i) => `<span class="rn">${i + 1}</span>${esc(x || '—')}<small>${esc(TITLES[i])}</small>`));
      case 'sr-clear': if (!confirm('Išvalyti visą SITREP?')) return; LS.set(KEY, def()); render(); return;
      case 'sr-gps': return gps();
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
    const s = get(), k = t.dataset.sr; if (!(k in def()) || typeof def()[k] !== 'string') return;
    s[k] = t.value; save(s);
    const o = document.getElementById('sr-out'); if (o) o.textContent = text(s);
    const sec = t.closest('section.nl'); if (sec) { const n = [...document.querySelectorAll('section.nl')].indexOf(sec); sec.classList.toggle('ok', !!lines(s)[n]); }
  }
  return { view, act, onInput, status, lines, text, dtg };
})();
