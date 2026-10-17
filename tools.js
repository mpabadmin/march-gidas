'use strict';
// March gidas – įrankiai: 9 eilučių MEDEVAC prašymas (NL), vizuali MIST kortelė su keliais sužeistaisiais (MC),
// 10S triažas – Ten Second Triage (TS), SITREP padėties pranešimas (SR). NL, MC ir GK kodas toks pat kaip ETC gide – skiriasi tik TCFG.
// GKS skaičiuoklė (GK) March gide nerodoma (vietoje jos – SITREP), bet kodas paliktas, kad bendra dalis sutaptų su ETC gidu.

// ───────── Programėlės nustatymai (vienintelis NL / MC / GK kodo skirtumas tarp March ir ETC gido) ─────────
const TCFG = {
  pre: 'mg-',          // localStorage raktų prefiksas
  laikai: 'mg-laikai', // pradžios ekrano laikmačiai { trauma, turn }
  // nuorodos puslapių apačioje: [adresas, pavadinimas, paantraštė]
  nl: () => [['#/mist', 'MIST kortelė', MC.status()], ['#/p/devynios', '9-Line kodai ir skubumo kategorijos', 'Mokymosi medžiaga'], ['#/igudis/32', 'Kaip perduoti 9-Line ir MIST', 'Įgūdis #32'], ['#/sitrep', 'SITREP – padėties pranešimas', SR.status()]],
  mc: () => [['#/skenuoti', 'Nuskaityti popierinę kortelę', 'DD 1380 nuotrauka → MIST, be interneto'], ['#/pacientas', 'Pacientas', 'Apžvalga, vaistai, eiga, perdavimas'], ['#/qr-priimti', 'Priimti pacientą QR kodu', 'Nuskaityti kito telefono kodą'], ['#/9line', '9-Line MEDEVAC', NL.status()], [listRoute('tac-perdavimas'), 'Perdavimas priimančiai grandžiai', 'Kontrolinis sąrašas'], ['#/igudis/34', 'Perdavimas ir perėmimas', 'Įgūdis #34'], ['#/sitrep', 'SITREP – padėties pranešimas', SR.status()]],
  gk: () => [['#/mist', 'MIST kortelė', MC.status()], ['#/igudis/17', 'Šoko atpažinimas: pulsas ir sąmonė (AVPU)', 'Įgūdis #17'], ['#/igudis/22', 'Galvos smegenų trauma', 'Įgūdis #22']],
  occl: 'Krūtinės lipdukas (okliuzinis tvarstis)', // MIST gydymo lusto pavadinimas (TCCC CLS terminas)
  // MIST kortelės vaisto langas: greitosios dozės [būdas, kiekis, vienetai] – tik tikslios reikšmės iš vaistai.js teksto (testas tikrina)
  qd: { paracetamolis: [['PO', '1000', 'mg'], ['PO', '1300', 'mg']], meloksikamas: [['PO', '15', 'mg']], suzetriginas: [['PO', '100', 'mg'], ['PO', '50', 'mg']],
    ketaminas: [['IV', '25', 'mg'], ['IM', '100', 'mg'], ['IN', '50', 'mg']], esketaminas: [['IN', '14', 'mg'], ['IN', '28', 'mg']], cefadroksilis: [['PO', '1', 'g']], cefaleksinas: [['PO', '500', 'mg']],
    ceftriaksonas: [['IV', '2', 'g'], ['IM', '2', 'g']], txa: [['IV', '2', 'g']], kalcis: [['IV', '30', 'ml']], ondansetronas: [['ODT', '4', 'mg'], ['IV', '4', 'mg']], 'nacl-hipert': [['IV', '250', 'ml']],
    fentanilis: [['IV', '50', 'mcg'], ['IN', '100', 'mcg']], morfinas: [['IM', '10', 'mg']], naloksonas: [['IV', '0,4', 'mg'], ['IM', '0,4', 'mg'], ['IN', '0,4', 'mg']] },
  pt: ['laikai', 'ck', 'svoris'], // paciento failas: šie raktai priklauso dabartiniam pacientui (perjungiami kartu su MIST kortele); svoris – kiekvienam pacientui savas
  migrate: o => migrateOldMist(o), // senos MIST formos duomenys (žr. žemiau)
  // paciento ekranas, juosta ir dažniausi sąrašai (pacientas.js – bendras kodas); MARCH PAWS apžvalga ir vaistų skiltis – march-hub.js (MPAWS)
  hub: {
    listDefaults: ['tfc-m', 'tfc-evak', 'tac-perdavimas'],
    listOf: (p, q) => { if (p[0] === 's') return p[1] || ''; if (p[0] !== 'f') return ''; const f = (E.fazes || []).find(x => x.id === p[1]); return f ? (f.lists || [])[+q.t || 0] || '' : ''; },
    listSkip: () => false,
    weight: false, // March: dozės nepriklauso nuo svorio – svorio mygtukas paciento ekrane nerodomas
    drugs: ['paracetamolis', 'ketaminas', 'txa', 'cefadroksilis', 'ceftriaksonas', 'ondansetronas'],
    drugOk: v => ok(v.lygis), drugTag: v => isAdv(v.lygis) ? tag(v.lygis) : '<span class="tag grn">CLS</span>',
    noBar: ['pacientas', 'mist', 'skenuoti', 'qr-priimti', 'egzaminas', 'vertinimas'],
    quick: [['vit', '+ Požymiai', 1], ['rx', '+ Vaistas', 1], ['tq', '+ Turniketas', 1], ['mk', '+ Žymė schemoje'], ['nl', '9-Line'], ['sr', 'SITREP']],
    sheetQuick: [['vit', '+ Požymiai', 1], ['rx', '+ Vaistas', 1], ['tq', '+ Turniketas', 1], ['kortele', 'Kortelė'], ['nl', '9-Line'], ['perduoti', 'Perduoti']],
    go: { rx: '#/pacientas?t=kortele&f=c', vz: '#/pacientas?t=kortele&f=c', nl: '#/9line', sr: '#/sitrep' }, // be vaistų žymėjimo: vaistai – į kortelės C lentelę
    handoff: () => [['#/9line', '9-Line MEDEVAC', NL.status()], ['#/sitrep', 'SITREP – padėties pranešimas', SR.status()], [listRoute('tac-perdavimas'), 'Perdavimas priimančiai grandžiai', 'Kontrolinis sąrašas'],
      ['#/qr-priimti', 'Priimti pacientą QR kodu', 'Nuskaityti kito telefono kodą'], ['#/skenuoti', 'Nuskaityti popierinę kortelę', 'DD 1380 nuotrauka → MIST']],
    overview: (x, H) => typeof MPAWS !== 'undefined' ? MPAWS.overview(x, H) : H.quick(false) + H.sTable(x.c) + H.iBox(x.c) + H.tBox(x),
    sections: { vaistai: (x, H) => typeof MPAWS !== 'undefined' ? MPAWS.drugs(x, H) : H.tBox(x) }
  }
};

// ───────── Senos MIST formos (iki 2026-10, „MI“: keli sužeistieji, tekstiniai laukai) duomenų perkėlimas į MIST kortelę ─────────
// Kviečia MC, radęs ne naujo formato 'mg-mist' (originalas išsaugomas 'mg-mist-v1'). Perkeliama tai, kas atitinka vienareikšmiškai;
// kita – į tekstinius laukus. Grąžina { cur, pts } arba null (ne senas formatas).
function migrateOldMist(o) {
  if (!o || typeof o !== 'object' || Array.isArray(o) || o.v === 2 || !Array.isArray(o.pts)) return null;
  const S = v => v == null ? '' : String(v).trim();
  const arr = a => Array.isArray(a) ? a.map(S).filter(Boolean) : [];
  const HM = v => /^([01]\d|2[0-3]):[0-5]\d$/.test(S(v)) ? S(v) : '';
  const low = x => /[A-Z]{2,}/.test(x) ? x : x.toLowerCase();
  const MECH = { 'Šautinis': 'Šautinė žaizda', 'Skeveldros': 'Skeveldros', 'Sprogimas / IED': 'Sprogimas', 'Kritimas': 'Kritimas', 'Nudegimas': 'Nudegimas', 'Kita': 'Kita' };
  const TX = { 'Turniketas': 'tq', 'Tamponavimas': 'pack', 'Spaudžiamasis tvarstis': 'press', 'Krūtinės lipdukas': 'occl', 'NDC': 'dec', 'IV / IO': 'iv', 'TXA': 'txa',
    'Kraujas': 'blood', 'Kalcis': 'ca', 'Antibiotikas': 'ab', 'Įtvaras': 'spl', 'Hipotermijos prevencija': 'hypo' };
  const PREC = { A: 'skubi', B: 'skubi chir.', C: 'prioritetinė', D: 'įprastinė', E: 'patogumo' };
  const pick = (a, map) => { const y = [], n = []; a.forEach(x => { if (map[x]) { if (y.indexOf(map[x]) < 0) y.push(map[x]); } else n.push(low(x)); }); return [y, n]; };
  function card(p) {
    const [mech, mechX] = pick(arr(p.mech), MECH), [tx, txX] = pick(arr(p.tx), TX), cat = S(p.cat), age = S(p.age), f = p.f && typeof p.f === 'object' ? p.f : {};
    const vit = (Array.isArray(p.vit) ? p.vit : []).filter(v => v && typeof v === 'object').map(v => {
      const hr = S(v.hr), site = S(v.hrs).toLowerCase();
      return { ts: S(v.ts) || '?', av: /^[AVPU]$/.test(S(v.av)) ? S(v.av) : '', hr: hr ? hr + (site && site !== 'nečiuopiamas' ? ' (' + site + ')' : '') : site === 'nečiuopiamas' ? 'nečiuopiamas' : '',
        rr: S(v.rr), bp: S(v.bp), spo2: S(v.spo2), gcs: '', gcsD: '', pain: S(v.pain) };
    });
    const inj = arr(p.inj).map(low).join(', ').replace(/^./, c => c.toUpperCase());
    return {
      id: [S(p.nr), PREC[cat] ? cat + ' (' + PREC[cat] + ')' : '', age ? age + ' m.' : ''].filter(Boolean).join(' · '),
      sex: '', t0: HM(p.t0), mech, mechTxt: [mechX.join(', '), S(p.mechTxt)].filter(Boolean).join('; '),
      mk: [], injTxt: [inj, S(p.injTxt)].filter(Boolean).join('; '), vit,
      f: { t: '', av: /^[AVPU]$/.test(S(f.av)) ? S(f.av) : '', hr: S(f.hr), rr: S(f.rr), bp: S(f.bp), spo2: S(f.spo2), gcs: '', pain: S(f.pain) },
      tx, tqT: HM(p.tq), txaT: HM(p.txa), txTxt: [txX.join(', '), S(p.txTxt), S(p.note) ? 'Pastabos: ' + S(p.note) : ''].filter(Boolean).join('; ')
    };
  }
  const pts = o.pts.filter(p => p && typeof p === 'object' && !Array.isArray(p)).map(card);
  return { cur: Math.max(0, Math.min(parseInt(o.cur, 10) || 0, pts.length - 1)), pts };
}

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
// Pranešimas su veiksmu (pvz. „Atšaukti“), rodomas 6 s; fn kviečiama bakstelėjus mygtuką
function toastAct(t, lb, fn) {
  toast(t); const el = document.getElementById('toast'); if (!el) return;
  const b = document.createElement('button'); b.type = 'button'; b.className = 'tsa'; b.textContent = lb;
  b.addEventListener('click', () => { el.className = ''; clearTimeout(toast.tm); try { fn(); } catch (e) { console.error(e); } });
  el.appendChild(b); el.classList.add('act');
  clearTimeout(toast.tm); toast.tm = setTimeout(() => { el.className = ''; }, 6000);
}
// Skaitymo režimas per visą ekraną; btns – papildomi mygtukai apačioje: [[pavadinimas, funkcija], …]
function readMode(title, lines, btns) {
  let el = document.getElementById('rd');
  if (!el) {
    el = document.createElement('div'); el.id = 'rd'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-rd]'); if (!b) return;
      if (b.dataset.rd === 'x') closeRead(); else { const f = (el.rdBtns || [])[+b.dataset.rd]; if (f) f[1](); }
    });
    document.body.appendChild(el);
  }
  el.rdBtns = Array.isArray(btns) ? btns : [];
  el.setAttribute('aria-label', title);
  el.innerHTML = `<div class="rdp"><div class="rdh"><b>${esc(title)}</b><button class="ib" data-rd="x" aria-label="Uždaryti"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>` +
    lines.map(x => `<div class="rdl">${x}</div>`).join('') +
    (el.rdBtns.length ? '<div class="acts rdacts">' + el.rdBtns.map((b, i) => `<button class="btn" data-rd="${i}">${esc(b[0])}</button>`).join('') + '</div>' : '') +
    '<p class="muted">Uždaryti – ✕ arba mygtukas „Atgal“.</p></div>';
  el.hidden = false; document.documentElement.classList.add('fbopen');
  try { history.pushState(Object.assign({}, history.state, { rd: 1 }), ''); } catch (e) {}
  const x = el.querySelector('[data-rd=x]'); if (x) x.focus();
}
function closeRead() {
  const el = document.getElementById('rd'); if (!el || el.hidden) return;
  el.hidden = true; document.documentElement.classList.remove('fbopen');
  if (history.state && history.state.rd) history.back();
}
addEventListener('keydown', e => { if (e.key === 'Escape') closeRead(); });
addEventListener('popstate', () => { const el = document.getElementById('rd'); if (el && !el.hidden && !(history.state && history.state.rd)) { el.hidden = true; document.documentElement.classList.remove('fbopen'); } });
const chip = (act, k, on, lb, extra) => `<button class="${on ? 'on' : ''}" data-act="${act}" data-k="${esc(k)}" aria-pressed="${!!on}"${extra || ''}>${lb}</button>`;
const stepper = (act, k, v, lb, sub) => `<div class="stp"><div><b>${lb}</b>${sub ? '<small>' + sub + '</small>' : ''}</div><button data-act="${act}" data-k="${k}" data-d="-1" aria-label="Mažiau: ${esc(lb)}">−</button><span class="sv">${v}</span><button data-act="${act}" data-k="${k}" data-d="1" aria-label="Daugiau: ${esc(lb)}">+</button></div>`;
const nowHM = () => hm(Date.now());
// Lietuviškos daugiskaitos formos: plural(3, ['žymė', 'žymės', 'žymių']) → '3 žymės'
const plural = (n, f) => n + ' ' + (n % 10 === 1 && n % 100 !== 11 ? f[0] : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? f[1] : f[2]);
const HM_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
// Nuorodos įrankių puslapių apačioje (TCFG.nl / mc / gk): [adresas, pavadinimas, paantraštė]
const tcfgRows = a => (a || []).map(x => row(x[0], x[1], x[2])).join('');
// Perdavimo kalba (LT / EN) – 9-Line ir MIST tekstui, skaitymui ir kortelei; laisvai įvestas tekstas neverčiamas
const OUTLANG = TCFG.pre + 'kalba';
const outEn = () => LS.get(OUTLANG, 'lt') === 'en';
const langSeg = act => `<div class="seg2 lang" role="group" aria-label="Perdavimo kalba">${chip(act, 'lt', !outEn(), 'Lietuviškai')}${chip(act, 'en', outEn(), 'English (NATO)')}</div>` +
  (outEn() ? '<p class="muted mt0">Kodai ir pasirinkimai – angliškai; laisvai įvestą tekstą (patikslinimus) rašykite angliškai.</p>' : '');

// ───────── 9 eilučių MEDEVAC (turinys ir MGRS – vienodi ETC ir March giduose) ─────────
const NL = (() => {
  const KEY = TCFG.pre + '9line';
  const def = () => ({ peace: false, snd: '', l1: '', freq: '', cs: '', sfx: '', p: { A: 0, B: 0, C: 0, D: 0, E: 0 }, eq: [], lit: 0, amb: 0, sec: '', wounds: '', mark: '', markTxt: '', nat: { A: 0, B: 0, C: 0, D: 0, E: 0 }, cbrn: [], terrain: '' });
  const num99 = v => Math.max(0, Math.min(99, parseInt(v, 10) || 0));
  const get = () => {
    const raw = LS.get(KEY, {}), d = def(), s = Object.assign(d, raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {});
    ['snd', 'l1', 'freq', 'cs', 'sfx', 'sec', 'wounds', 'mark', 'markTxt', 'terrain'].forEach(k => { if (typeof s[k] !== 'string') s[k] = s[k] == null ? '' : String(s[k]); });
    ['eq', 'cbrn'].forEach(k => { s[k] = Array.isArray(s[k]) ? s[k].filter(x => typeof x === 'string') : []; });
    // 9 eilutė – LK kodai (A branduolinis, B biologinis, C cheminis); iki v30 – NATO C / B / R / N: N → A, R (LK formoje nėra) – atmetamas
    s.cbrn = s.cbrn.reduce((a, k) => { const v = k === 'N' ? 'A' : k; if (['A', 'B', 'C', '-'].indexOf(v) >= 0 && a.indexOf(v) < 0) a.push(v); return a; }, []);
    s.lit = num99(s.lit); s.amb = num99(s.amb); s.peace = !!s.peace;
    ['p', 'nat'].forEach(g => { const o = s[g] && typeof s[g] === 'object' ? s[g] : {}; s[g] = def()[g]; Object.keys(s[g]).forEach(k => { s[g][k] = num99(o[k]); }); });
    return s;
  };
  const save = s => LS.set(KEY, s);
  // 3 eilutė – LK pavadinimai (kuopos Q priedo priedėlis Nr. 2 „9-liner/MIST“); EN – NATO
  const PREC = [['A', 'Neatidėliotini', 'Urgent'], ['B', 'Neatidėliotini – chirurginiai', 'Urgent surgical'], ['C', 'Skubūs', 'Priority'], ['D', 'Įprastinė evakuacija', 'Routine'], ['E', 'Evakuojami pagal galimybes', 'Convenience']];
  // Lietuviškai – LK forma (kuopos Q priedo priedėlis Nr. 2 „9-liner/MIST (pagal LK)“); angliškai – NATO / JTS 9-Line
  const EQ = [['A', 'Nereikalinga'], ['B', 'Keltuvai'], ['C', 'Neštuvai'], ['D', 'Dirbtinė plaučių ventiliacija']];
  const SEC = [['N', 'Rajone priešo nėra'], ['P', 'Priešas gali būti rajone'], ['E', 'Priešas rajone'], ['X', 'Priešas rajone, reikalinga ginkluota palyda']];
  const MARK = [['A', 'Spalvotas ženklas'], ['B', 'Pirotechnika'], ['C', 'Dūmai'], ['D', 'Nėra'], ['E', 'Kita']];
  const NAT = [['A', 'LT karys'], ['B', 'LT civilis'], ['C', 'Ne LT karys'], ['D', 'Ne LT civilis'], ['E', 'Priešo karo belaisvis']];
  const CBRN = [['A', 'Branduolinis'], ['B', 'Biologinis'], ['C', 'Cheminis'], ['-', 'Nėra']];
  const CB_NATO = { A: 'N', B: 'B', C: 'C' }; // LK raidė → NATO raidė (angliškam tekstui)
  const counts = o => Object.keys(o).filter(k => o[k] > 0).map(k => k + o[k]).join(' BREAK ');
  const TITLES = ['Surinkimo vietos koordinatės', 'Surinkimo vietos dažnis, šaukinys, slaptažodis', 'Sužeistųjų skaičius pagal pirmenybę', 'Reikalinga speciali įranga', 'Sužeistųjų skaičius pagal tipą', 'Surinkimo vietos pavojaus laipsnis', 'Surinkimo vietos pažymėjimo būdas', 'Sužeistųjų tautybė ir statusas', 'MNG situacija ir vietovės užterštumas'];
  // pirmenybės terminai (LK formos išnaša)
  const PREC_FN = { A: 'reikia evakuoti 2 val. laikotarpyje', B: 'reikalingas chirurginis gydymas per 2 valandas', C: 'sužeistieji, kurių išgelbėjimui reikalinga evakuacija per 4 valandas' };
  const lc1 = t => /^[A-ZĄČĘĖĮŠŲŪŽ]{2}/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1); // „LT karys“ lieka, „Ne LT karys“ → „ne LT karys“
  const dtg = () => { const d = new Date(); return String(d.getDate()).padStart(2, '0') + nowHM().replace(':', ''); };
  // Anglų kalba (NATO / JTS 9-Line)
  const EQ_EN = { A: 'None', B: 'Hoist', C: 'Extraction equipment', D: 'Ventilator' };
  const SEC_EN = { N: 'No enemy troops in area', P: 'Possible enemy troops – approach with caution', E: 'Enemy troops in area – approach with caution', X: 'Enemy troops in area – armed escort required' };
  const MARK_EN = { A: 'Panels', B: 'Pyrotechnic signal', C: 'Smoke signal', D: 'None', E: 'Other' };
  const NAT_EN = { A: 'Coalition military', B: 'Coalition civilian', C: 'Non-coalition security forces', D: 'Non-coalition civilian', E: 'Enemy combatant / detainee' };
  const CBRN_EN = { C: 'Chemical', B: 'Biological', R: 'Radiological', N: 'Nuclear' };
  const PREC_EN = { A: 'Urgent', B: 'Urgent surgical', C: 'Priority', D: 'Routine', E: 'Convenience' };
  const TITLES_EN = ['Location of pickup site', 'Radio frequency, call sign and suffix', 'Number of patients by precedence', 'Special equipment required', 'Number of patients by type', 'Security at pickup site', 'Method of marking pickup site', 'Patient nationality and status', 'CBRN contamination'];

  function lines(s, en) {
    return [
      s.l1.trim().toUpperCase().replace(/\s+/g, ' '),
      [s.freq.trim(), s.cs.trim(), s.sfx.trim() ? (en ? 'suffix ' : 'slaptažodis ') + s.sfx.trim() : ''].filter(Boolean).join(', '),
      counts(s.p),
      s.eq.slice().sort().join(', '),
      [s.lit ? 'L' + s.lit : '', s.amb ? 'A' + s.amb : ''].filter(Boolean).join(' BREAK '),
      s.peace ? s.wounds.trim() : s.sec,
      s.mark ? s.mark + (s.markTxt.trim() ? ' – ' + s.markTxt.trim() : '') : '',
      counts(s.nat),
      s.peace ? s.terrain.trim() : (s.cbrn.indexOf('-') >= 0 ? (en ? 'None' : 'Nėra') : (en ? s.cbrn.map(k => CB_NATO[k] || k) : s.cbrn.slice().sort()).join(', '))
    ];
  }
  // Kodų reikšmės skaitymo režimui (mažu šriftu po kodu)
  const nm = (L, k) => (L.find(x => x[0] === k) || [k, k])[1];
  function meaning(s, en) {
    if (en) {
      const c2 = (o, M) => Object.keys(o).filter(k => o[k] > 0).map(k => (M[k] || k).toLowerCase() + ' ' + o[k]).join(', ');
      return ['', '', c2(s.p, PREC_EN), s.eq.slice().sort().map(k => EQ_EN[k] || k).join(', '),
        [s.lit ? 'litter ' + s.lit : '', s.amb ? 'ambulatory ' + s.amb : ''].filter(Boolean).join(', '),
        s.peace ? '' : (s.sec ? SEC_EN[s.sec] || s.sec : ''), s.mark ? MARK_EN[s.mark] || s.mark : '', c2(s.nat, NAT_EN),
        s.peace ? '' : s.cbrn.filter(k => k !== '-').map(k => CBRN_EN[CB_NATO[k]] || k).join(', ')];
    }
    const cnt = (o, L) => Object.keys(o).filter(k => o[k] > 0).map(k => lc1(nm(L, k)) + ' ' + o[k]).join(', ');
    return [
      '', '', cnt(s.p, PREC.map(x => [x[0], x[1]])),
      s.eq.slice().sort().map(k => lc1(nm(EQ, k))).join(', '),
      [s.lit ? 'gulintys (neštuvuose) ' + s.lit : '', s.amb ? 'sėdintys (ambulatoriniai) ' + s.amb : ''].filter(Boolean).join(', '),
      s.peace ? '' : (s.sec ? lc1(nm(SEC, s.sec)) : ''),
      s.mark ? lc1(nm(MARK, s.mark)) : '',
      cnt(s.nat, NAT),
      s.peace ? '' : s.cbrn.filter(k => k !== '-').sort().map(k => lc1(nm(CBRN, k))).join(', ')
    ];
  }
  const titles = (s, en) => (en ? TITLES_EN : TITLES).map((t, i) => s.peace && i === 5 ? (en ? 'Number and type of wound, injury or illness' : 'Sužalojimų skaičius ir tipas') : s.peace && i === 8 ? (en ? 'Terrain description' : 'Vietovės aprašymas') : t);
  // Antraštė – kaip LK formoje: DTG (DDHHMM) ir siunčiančio padalinio šaukinys
  const head = (s, en) => '9-LINE MEDEVAC · DTG ' + dtg() + (s.snd.trim() ? ' · ' + (en ? 'from ' : 'siunčia ') + s.snd.trim() : '');
  const text = (s, en) => head(s, en) + '\n' + lines(s, en).map((x, i) => (i + 1) + '. ' + (x || '—')).join('\n');
  function status() {
    const L = lines(get()), n = L.slice(0, 5).filter(Boolean).length, all = L.filter(Boolean).length;
    return all ? (n < 5 ? `Būtinos ${n}/5 · iš viso ${all}/9` : `Užpildyta ${all}/9 eilučių`) : 'Pildyti prašymą';
  }

  function card(n, s, body, hint) {
    const v = lines(s)[n - 1];
    return `<section class="nl${v ? ' ok' : ''}${n <= 5 ? ' req' : ''}" data-n="${n}"><div class="nlh"><span class="nn">${n}</span><b>${esc(titles(s)[n - 1])}</b>${n <= 5 ? '<small class="rq">būtina</small>' : ''}</div>${hint ? '<p class="muted">' + hint + '</p>' : ''}${body}</section>`;
  }

  // Skubumo kategorijų paaiškinimas (iš March gido „9 eilučių MEDEVAC prašymas ir MIST“, JTS CLS)
  const precHelp = () => '<details class="alt"><summary>Pirmenybės kategorijos (LK; NATO – Urgent … Convenience)</summary><div class="tw"><table><tr><th>Kategorija</th><th>Terminas</th><th>Pavyzdžiai</th></tr>' +
    '<tr><td><b>A – neatidėliotini</b> (Urgent)</td><td>&lt; 2 val. – gyvybei, galūnei ar regėjimui išsaugoti</td><td>Turniketai, sustabdytas kraujavimas, adatinė dekompresija, krikotiroidotomija</td></tr>' +
    '<tr><td><b>B – neatidėliotini – chirurginiai</b> (Urgent surgical)</td><td>&lt; 2 val. iki chirurginės pagalbos</td><td>Didelis vidinis kraujavimas, sunki galvos trauma, kompensuotas šokas</td></tr>' +
    '<tr><td><b>C – skubūs</b> (Priority)</td><td>&lt; 4 val. arba būklė gali pablogėti iki neatidėliotinos</td><td>Lūžis su išnykusiu distaliniu pulsu, II laipsnio nudegimai dideliame pilvo ar galūnių plote</td></tr>' +
    '<tr><td><b>D – įprastinė evakuacija</b> (Routine)</td><td>&lt; 24 val.</td><td>Nubrozdinimai, smulkūs lūžiai, nušalimai</td></tr>' +
    '<tr><td><b>E – evakuojami pagal galimybes</b> (Convenience)</td><td>Mediciniškai nebūtina</td><td>Administracinis perkėlimas</td></tr></table></div>' +
    '<p class="muted">LK formos išnaša: A – ' + PREC_FN.A + '; B – ' + PREC_FN.B + '; C – ' + PREC_FN.C + '.</p>' +
    '<p class="muted">MIST kortelės evakuacija → 3 eilutė: neatidėliotina – A (chirurginė – B), skubi – C, įprastinė – D.</p>' +
    '<p class="muted">Terminai priklauso nuo doktrinos ir SOP: LK ir JTS CLS (2020) nurodo &lt; 2 val. (A, B) ir &lt; 4 val. (C), kai kurios JAV ir NATO procedūros neatidėliotinai kategorijai numato 1 val. ar 90 min. Vadovaukitės savo vieneto SOP.</p></details>';
  // Iš sužeistųjų MIST kortelių: 3 eilutė – evakuacijos kategorija (neatidėliotina → A, skubi → C, įprastinė → D), 5 eilutė – transportavimo padėtis (gulint, pakeltomis kojomis, pusiau sėdint, ant šono → L; sėdint, gali eiti → A)
  function fromCards() {
    let pts = []; try { pts = MC.state().pts.filter(MC.used); } catch (e) { return null; }
    const p = { A: 0, B: 0, C: 0, D: 0, E: 0 }, EV = { u: 'A', p: 'C', r: 'D' }, LIT = ['gul', 'koj', 'pus', 'son'], AMB = ['sed', 'eina'];
    let lit = 0, amb = 0, noEv = 0, noPos = 0;
    pts.forEach(c => { if (EV[c.evac]) p[EV[c.evac]]++; else noEv++; if (LIT.indexOf(c.pos) >= 0) lit++; else if (AMB.indexOf(c.pos) >= 0) amb++; else noPos++; });
    return { n: pts.length, p, lit, amb, noEv, noPos };
  }
  const fillBtn = () => { const f = fromCards(); return f && f.n && (f.noEv < f.n || f.noPos < f.n) ? `<button class="btn sm nlfill" data-act="nl-fill">Užpildyti iš sužeistųjų kortelių (${f.n})</button>` : ''; };

  function view() {
    const s = get(), L = lines(s), req = L.slice(0, 5).filter(Boolean).length;
    let h = '<h1>9 eilučių MEDEVAC prašymas</h1>';
    if (mode === 'learn') h += '<p class="muted">9 eilučių prašymas (9-Line MEDEVAC) – standartinis radijo pranešimas evakuacijos priemonei iškviesti. Pirmų 5 eilučių pakanka priemonei išsiųsti; 6–9 eilutes galima perduoti jai jau judant.</p>';
    h += `<div class="seg2" role="group" aria-label="Situacija">${chip('nl-peace', '0', !s.peace, 'Karo metu')}${chip('nl-peace', '1', s.peace, 'Taikos metu')}</div>`;
    h += `<div class="nlprog"><div class="prog"><i style="width:${req * 20}%"></i></div><small class="muted">Būtinos 1–5 eilutės: ${req} / 5. Prieš kviesdami surinkite visą informaciją; kodus ir ryšio saugumą – pagal SOP.</small></div>`;
    h += `<section class="nl nlhd"><div class="nlh"><b>Padalinio siunčiančio 9liner šaukinys</b><small class="muted">pranešimo DTG – ${esc(dtg())}</small></div><input class="inp" data-nl="snd" value="${esc(s.snd)}" placeholder="pvz. Vilkas 1" autocomplete="off" aria-label="Padalinio siunčiančio 9liner šaukinys"></section>`;
    h += card(1, s, `<input class="inp" data-nl="l1" value="${esc(s.l1)}" placeholder="pvz. 35U LA 1234 5678" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Surinkimo vietos koordinatės (MGRS)"><button class="btn sm" data-act="nl-gps">📍 Mano vieta (GPS → MGRS)</button>`, '8 skaitmenų tinklelio koordinatė (MGRS). GPS koordinates patikrinkite žemėlapyje.');
    h += card(2, s, `<div class="in3"><input class="inp" data-nl="freq" value="${esc(s.freq)}" placeholder="Dažnis" inputmode="decimal" autocomplete="off" aria-label="Dažnis"><input class="inp" data-nl="cs" value="${esc(s.cs)}" placeholder="Šaukinys" autocomplete="off" aria-label="Šaukinys"><input class="inp" data-nl="sfx" value="${esc(s.sfx)}" placeholder="Slaptažodis" autocomplete="off" aria-label="Slaptažodis (NATO – suffix)"></div>`, 'Surinkimo vietos (ne retransliatoriaus) dažnis.');
    h += card(3, s, fillBtn() + PREC.map(([k, lt, en]) => stepper('nl-p', k, s.p[k], k + ' – ' + lt, en + (PREC_FN[k] ? ' · ' + PREC_FN[k] : ''))).join('') + precHelp(), 'Kiekvienai kategorijai – sužeistųjų skaičius.');
    h += card(4, s, '<div class="opts">' + EQ.map(([k, t]) => chip('nl-eq', k, s.eq.indexOf(k) >= 0, k + ' – ' + t)).join('') + '</div>');
    h += card(5, s, fillBtn() + stepper('nl-lit', 'lit', s.lit, 'L – gulintys (neštuvuose)', 'Litter') + stepper('nl-amb', 'amb', s.amb, 'A – sėdintys (ambulatoriniai)', 'Ambulatory'));
    h += s.peace ? card(6, s, `<textarea class="inp" data-nl="wounds" rows="2" placeholder="pvz. 2 šautinės žaizdos, 1 lūžis" aria-label="Sužalojimų skaičius ir tipas">${esc(s.wounds)}</textarea>`)
      : card(6, s, '<div class="opts">' + SEC.map(([k, t]) => chip('nl-sec', k, s.sec === k, k + ' – ' + t)).join('') + '</div>');
    h += card(7, s, '<div class="opts">' + MARK.map(([k, t]) => chip('nl-mark', k, s.mark === k, k + ' – ' + t)).join('') + `</div><input class="inp" data-nl="markTxt" value="${esc(s.markTxt)}" placeholder="Patikslinimas, pvz. žali dūmai" autocomplete="off" aria-label="Žymėjimo patikslinimas">`);
    h += card(8, s, NAT.map(([k, t]) => stepper('nl-nat', k, s.nat[k], k + ' – ' + t, NAT_EN[k])).join(''), 'LK forma; angliškame tekste – NATO (koalicijos) reikšmės. Vadovaukitės vieneto SOP.');
    h += s.peace ? card(9, s, `<textarea class="inp" data-nl="terrain" rows="2" placeholder="pvz. lygus laukas, šiaurėje elektros linija" aria-label="Vietovės aprašymas">${esc(s.terrain)}</textarea>`)
      : card(9, s, '<div class="opts">' + CBRN.map(([k, t]) => chip('nl-cbrn', k, s.cbrn.indexOf(k) >= 0, (k === '-' ? '' : k + ' – ') + t)).join('') + '</div>' +
        (mode === 'learn' ? '<p class="muted">LK formoje radiologinio užterštumo kodo nėra – jį patikslinkite žodžiu pagal SOP. Angliškame tekste raidės – NATO (N branduolinis, B biologinis, C cheminis).</p>' : ''));
    h += `<section class="outp"><div class="nlh"><b>Perduoti</b></div>${langSeg('nl-lang')}<pre id="nl-out">${esc(text(s, outEn()))}</pre>` +
      '<div class="acts"><button class="btn pri" data-act="nl-read">Skaityti per radiją</button><button class="btn" data-act="nl-copy">Kopijuoti</button><button class="btn" data-act="nl-share">Bendrinti</button><button class="btn" data-act="nl-clear">Išvalyti</button></div></section>';
    h += tcfgRows(TCFG.nl());
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
      case 'nl-lang': { LS.set(OUTLANG, k === 'en' ? 'en' : 'lt'); const y = scrollY; render(); scrollTo(0, y); return; }
      case 'nl-copy': return copyText(text(s, outEn()));
      case 'nl-share': return shareText('9-Line MEDEVAC', text(s, outEn()));
      case 'nl-read': { const en = outEn(), M = meaning(s, en), T = titles(s, en); return readMode(head(s, en), lines(s, en).map((x, i) => `<span class="rn">${i + 1}</span>${esc(x || '—')}<small>${esc(T[i])}${M[i] ? ' · ' + esc(M[i]) : ''}</small>`)); }
      case 'nl-clear': if (!confirm('Išvalyti visą 9-Line prašymą?')) return; LS.set(KEY, def()); render(); return;
      case 'nl-gps': return gps();
      case 'nl-fill': {
        const f = fromCards(); if (!f || !f.n) { toast('Sužeistųjų kortelėse duomenų nėra'); return; }
        if (f.noEv < f.n) s.p = f.p;
        if (f.noPos < f.n) { s.lit = f.lit; s.amb = f.amb; }
        const miss = [f.noEv ? 'be evakuacijos kategorijos: ' + f.noEv : '', f.noPos ? 'be padėties: ' + f.noPos : ''].filter(Boolean).join(', ');
        toast('Įrašyta iš ' + plural(f.n, ['kortelės', 'kortelių', 'kortelių']) + (miss ? ' (' + miss + ')' : '') + ' – patikrinkite; chirurginius pažymėkite B');
        break;
      }
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
    const o = document.getElementById('nl-out'); if (o) o.textContent = text(s, outEn());
    const sec = t.closest('section.nl'), n = sec ? +sec.dataset.n : 0; if (n) sec.classList.toggle('ok', !!lines(s)[n - 1]);
  }
  return { view, act, onInput, status, lines, text };
})();

// ───────── MIST kortelė – pagal LK „Nukentėjusiojo kortelę“ (DD 1380 lietuviškas variantas, Field Medical Card) ─────────
// Dalys kaip kortelėje: A (asmens duomenys), T (traumos laikas, pobūdis), M (mechanizmas), I (sužalojimai – sutartiniai ženklai, 4 turniketai),
// S (būklė, nusiskundimai), T (teikta pagalba: C, A, B, C lentelė, kita), evakuacija, transportavimo padėtis, pagalbos teikėjai.
// Keli sužeistieji – kiekvienam sava kortelė. Perdavimo tekstas – MIST (M, I, S, T), LT arba EN.
const MC = (() => {
  const KEY = TCFG.pre + 'mist';
  // ── kortelės sąrašai (LT, EN) ──
  const MECH = [['Šautinis', 'GSW', 'Gunshot wound'], ['Sprogimas', 'blast', 'Blast'], ['Nudegimas', 'burn', 'Burn'], ['Buka trauma', 'blunt', 'Blunt trauma'], ['Kita', 'other', 'Other']];
  const MECH_OLD = { 'Šautinė žaizda': ['Šautinis'], 'Skeveldros': ['Sprogimas', 'skeveldros'], 'Bukas sužalojimas': ['Buka trauma'], 'Kritimas': ['Buka trauma', 'kritimas'], 'Eismo įvykis': ['Buka trauma', 'eismo įvykis'] };
  const NAT = [['kov', 'kovinis sužeidimas', 'BI', 'battle injury'], ['nekov', 'nekovinis sužeidimas', 'NBI', 'non-battle injury'], ['liga', 'liga', 'D', 'disease'], ['stres', 'stresas', 'stress', 'stress']];
  // I – sutartiniai ženklai: [raktas, ženklas, LT, EN]
  const MK = [['L', '//', 'Lūžis', 'Fracture'], ['X', 'X', 'Nekiaurinis sužalojimas', 'Injury without perforation'], ['O', 'O', 'Kiaurinis sužalojimas', 'Injury with perforation'],
    ['K', 'Δ', 'Kraujavimas', 'Hemorrhage'], ['N', 'V', 'Nudegimo plotas', 'Burned area'], ['Z', '✕', 'Sužalojimas', 'Injury'], ['A', 'A', 'Amputacija', 'Amputation']]; // Z, A – ankstesnių versijų žymės
  const TOOLS = ['L', 'X', 'O', 'K', 'N'];
  const mkT = k => MK.find(x => x[0] === k) || MK[5];
  // 4 turniketų laukai: [raktas, LT, EN, vieta schemoje (priekis)]
  const TQ = [['ra', 'Dešinė ranka', 'R. Arm', [29, 82]], ['la', 'Kairė ranka', 'L. Arm', [91, 82]], ['rl', 'Dešinė koja', 'R. Leg', [48, 160]], ['ll', 'Kairė koja', 'L. Leg', [72, 160]]];
  // T – teikta pagalba: [raktas, LT, EN, eilutė, lygis (March „tik CLS“ slepia CMC / CPP, jei nepažymėta)]
  const TX = [['tq', 'galūnės', 'limb', 'tq'], ['tqj', 'jungties', 'junctional', 'tq'],
    ['dh', 'hemostatinis', 'hemostatic', 'dr'], ['dp', 'spaudžiamasis', 'pressure', 'dr'], ['dk', 'kita', 'other', 'dr'],
    ['npa', 'nazofar.', 'NPA', 'a'], ['igel', 'I-gel', 'I-gel', 'a', 'CMC'], ['cric', 'kriko.', 'CRIC', 'a', 'CMC'], ['ak', 'kita', 'other', 'a'],
    ['occl', 'okliuzinis tvarstis', 'chest seal', 'b'], ['dec', 'ad. dekompresija', 'needle decompression', 'b'], ['o2', 'O₂', 'O₂', 'b', 'CMC'], ['ctube', 'krūtinės drenas', 'chest tube', 'b', 'CPP'],
    ['dress', 'tvarstymas', 'wound dressing', 'o'], ['spl', 'imobilizavimas', 'splinting', 'o'], ['eyeR', 'D', 'R', 'eye'], ['eyeL', 'K', 'L', 'eye'],
    ['hypo', 'hipotermijos prevencija', 'hypothermia prevention', 'o2'], ['oth', 'kita', 'other', 'o2']];
  const txT = k => TX.find(x => x[0] === k);
  const txShown = (x, s) => !x[4] || typeof ok !== 'function' || ok(x[4]) || s.tx.indexOf(x[0]) >= 0;
  // C lentelė: [grupė, LT, EN, eilučių kortelėje]
  const ROWG = [['fl', 'Skysčiai', 'Fluids', 2], ['bl', 'Kraujo produktai', 'Blood product', 1], ['an', 'Analgetikai', 'Analgesic', 2], ['ab', 'Antibiotikai', 'Antibiotic', 1], ['ot', 'Kita (pvz., TXA)', 'Other (e.g., TXA)', 2]];
  const EVAC = [['u', 'Neatidėliotina', 'Urgent'], ['p', 'Skubi', 'Priority'], ['r', 'Įprastinė', 'Routine']];
  const EVL = { u: 'A/B', p: 'C', r: 'D' }; // 9-Line 3 eilutės kategorijos (LK)
  const POS = [['sed', 'Sėdint', 'Sitting'], ['gul', 'Gulint', 'Supine'], ['koj', 'Pakeltomis kojomis', 'Legs elevated'], ['pus', 'Pusiau sėdint', 'Semi-sitting'], ['son', 'Ant šono', 'Recovery position'], ['eina', 'Gali eiti', 'Walking']];
  const POS_SVG = {
    sed: '<circle cx="13" cy="4" r="2.6"/><path d="M11 8h4l1 7h5l1 7h-2.6l-1-4.6H13.4L11 13z"/><path d="M7 11v11h2.4v-6h4v-2.4H9.4V11z"/>',
    gul: '<circle cx="27" cy="15" r="2.8"/><path d="M3 14h20.5v3.2H3z"/><path d="M2 19.5h30v1.6H2z"/>',
    koj: '<circle cx="6" cy="16.5" r="2.8"/><path d="M9.5 15h9l10-6.5 1.6 2.4-10.4 7.4H9.5z"/><path d="M2 19.5h30v1.6H2z"/>',
    pus: '<circle cx="7" cy="7" r="2.8"/><path d="M5 11l3-1.4 6 6.4h15v3.4H12.4z"/><path d="M3 9l2-1 7 11h20v2H11z" opacity=".55"/>',
    son: '<circle cx="27" cy="13.5" r="2.8"/><path d="M4 13h20v3H4z"/><path d="M18 16l4 3.4h-3.2L15 16z"/><path d="M2 19.5h30v1.6H2z"/>',
    eina: '<circle cx="17" cy="3.4" r="2.6"/><path d="M14 7h6l1.2 8h-2.2l-.8 8.6h-1.6l-.6-7.2h-.1l-.6 7.2h-1.6l-.8-8.6H11.8z"/>'
  };
  const AVPU = [['A', 'budrus'], ['V', 'balsas'], ['P', 'skausmas'], ['U', 'nereaguoja']];
  const SEX = [['V', 'Vyras', 'male'], ['M', 'Moteris', 'female']];
  const VF = ['t', 'av', 'hr', 'rr', 'bp', 'spo2', 'gcs', 'pain'];
  const blankF = () => ({ t: '', av: '', hr: '', rr: '', bp: '', spo2: '', gcs: '', pain: '' });
  const def = () => ({ id: '', name: '', sex: '', dob: '', unit: '', country: '', allerg: '', dt: '', t0: '', nat: [], mech: [], mechTxt: '', mk: [], tq: {}, injTxt: '', vit: [], f: blankF(), sympt: '', tx: [], rows: [], txTxt: '', evac: '', pos: '', resp: ['', ''], tqT: '', txaT: '' });
  const str = v => v == null ? '' : String(v);
  const strs = a => Array.isArray(a) ? a.filter(x => typeof x === 'string') : [];
  const isTxa = n => /\btxa\b|tranek/i.test(String(n || ''));
  // Vienos kortelės tvarkymas: netikėti duomenys nelaužo; ankstesnių versijų laukai perkeliami į LK kortelės laukus
  function fix(raw) {
    const s = Object.assign(def(), raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {});
    ['id', 'name', 'sex', 'dob', 'unit', 'country', 'allerg', 'dt', 't0', 'mechTxt', 'injTxt', 'sympt', 'txTxt', 'evac', 'pos', 'tqT', 'txaT'].forEach(k => { s[k] = str(s[k]); });
    s.nat = strs(s.nat).filter(k => NAT.some(x => x[0] === k)); s.tx = strs(s.tx);
    // mechanizmas: senos reikšmės → LK kortelės
    const mt = [], mech = [];
    strs(s.mech).forEach(m => { const o = MECH_OLD[m]; const v = o ? o[0] : m; if (MECH.some(x => x[0] === v) && mech.indexOf(v) < 0) mech.push(v); if (o && o[1]) mt.push(o[1]); });
    s.mech = mech; if (mt.length) s.mechTxt = [mt.join(', '), s.mechTxt.trim()].filter(Boolean).join('; ');
    const f = s.f && typeof s.f === 'object' ? s.f : {}; s.f = blankF(); VF.forEach(k => { s.f[k] = str(f[k]); });
    s.vit = (Array.isArray(s.vit) ? s.vit : []).filter(v => v && typeof v === 'object').map(v => { const o = { ts: str(v.ts) }; VF.slice(1).concat('gcsD').forEach(k => { o[k] = str(v[k]); }); return o; });
    s.rows = (Array.isArray(s.rows) ? s.rows : []).filter(r => r && typeof r === 'object' && ROWG.some(g => g[0] === r.g)).map(r => ({ g: r.g, name: str(r.name), dose: str(r.dose), route: str(r.route), time: str(r.time), src: str(r.src) }));
    const tq = s.tq && typeof s.tq === 'object' && !Array.isArray(s.tq) ? s.tq : {}; s.tq = {};
    TQ.forEach(([k]) => { const q = tq[k]; if (q && typeof q === 'object' && q.on) s.tq[k] = { on: true, tm: str(q.tm) }; });
    s.resp = [0, 1].map(i => str((Array.isArray(s.resp) ? s.resp : [])[i]));
    // žymės; senos „T“ (turniketas schemoje) → turniketo laukas pagal galūnę
    s.mk = (Array.isArray(s.mk) ? s.mk : []).filter(m => m && (m.s === 'f' || m.s === 'b') && isFinite(m.x) && isFinite(m.y));
    const keep = [];
    s.mk.forEach(m => {
      if (m.t === 'T') { const o = region(m.s, +m.x, +m.y).o, k = o === 6 ? 'ra' : o === 7 ? 'la' : o === 8 ? 'rl' : o === 9 ? 'll' : ''; if (k) { if (!s.tq[k]) s.tq[k] = { on: true, tm: str(m.tm) }; } else if (s.tx.indexOf('tqj') < 0) s.tx.push('tqj'); return; }
      keep.push({ t: mkT(m.t)[0], s: m.s, x: +m.x, y: +m.y });
    });
    s.mk = keep;
    // senas gydymas → LK laukai ir C lentelė
    const mv = { pack: 'dh', press: 'dp', aw: 'ak' };
    const addRow = (g, name, time) => { if (!s.rows.some(r => r.g === g && r.name === name)) s.rows.push({ g, name, dose: '', route: '', time: time || '', src: '' }); };
    s.tx = s.tx.reduce((a, k) => {
      if (mv[k]) { if (a.indexOf(mv[k]) < 0) a.push(mv[k]); }
      else if (k === 'an') addRow('an', 'Analgezija'); else if (k === 'ab') addRow('ab', 'Antibiotikas'); else if (k === 'blood') addRow('bl', 'Kraujas');
      else if (k === 'ca') addRow('ot', 'Kalcis'); else if (k === 'iv') addRow('fl', 'IV / IO prieiga');
      else if (k === 'txa') { if (!s.rows.some(r => isTxa(r.name))) addRow('ot', 'TXA', s.txaT); a.push('txa'); }
      else if (txT(k) && a.indexOf(k) < 0) a.push(k);
      return a;
    }, []);
    if (!(raw && raw.tq) && s.tqT && !Object.keys(s.tq).length && s.tx.indexOf('tq') >= 0 && s.injTxt.indexOf('turniketas ' + s.tqT) < 0) s.injTxt = [s.injTxt.trim(), 'turniketas ' + s.tqT].filter(Boolean).join('; ');
    return derive(s);
  }
  // Išvestiniai laukai kitiems įrankiams (priminimai, įvykių eiga): turniketo ir TXA laikai
  function derive(s) {
    const tms = TQ.map(([k]) => s.tq[k]).filter(q => q && q.on);
    if (tms.length && s.tx.indexOf('tq') < 0) s.tx.push('tq');
    const t = tms.map(q => q.tm).filter(x => HM_RE.test(x)).sort()[0]; if (t) s.tqT = t; else if (tms.length) s.tqT = s.tqT || '';
    const tx = s.rows.find(r => isTxa(r.name));
    if (tx) { if (s.tx.indexOf('txa') < 0) s.tx.push('txa'); if (HM_RE.test(tx.time)) s.txaT = tx.time; }
    else s.tx = s.tx.filter(k => k !== 'txa');
    return s;
  }
  // Saugojimas: { v: 2, cur, pts: [kortelė, …] }. Ankstesnis vienos kortelės formatas perkeliamas; kiti seni formatai – TCFG.migrate
  const fresh = () => ({ v: 2, cur: 0, pts: [def()] });
  const cards = a => a.filter(p => p && typeof p === 'object' && !Array.isArray(p)).map(fix);
  function load() {
    const raw = LS.get(KEY, null);
    let st = null;
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      if (raw.v === 2 && Array.isArray(raw.pts)) st = { v: 2, cur: parseInt(raw.cur, 10) || 0, pts: cards(raw.pts) };
      else if (!('pts' in raw) && !('v' in raw)) { st = { v: 2, cur: 0, pts: [fix(raw)] }; LS.set(KEY, st); }
    }
    if (!st && raw != null) {
      if (LS.get(KEY + '-v1', null) == null) LS.set(KEY + '-v1', raw);
      let m = null;
      try { m = typeof TCFG.migrate === 'function' ? TCFG.migrate(raw) : null; } catch (e) { m = null; }
      st = m && Array.isArray(m.pts) ? { v: 2, cur: parseInt(m.cur, 10) || 0, pts: cards(m.pts) } : fresh();
      LS.set(KEY, st);
    }
    if (!st) st = fresh();
    if (!st.pts.length) st.pts.push(def());
    st.cur = Math.max(0, Math.min(st.cur, st.pts.length - 1));
    return st;
  }
  // Kortelė su pirmais duomenimis: šiandienos data, šalis LTU, dalinys ir 1-as teikėjas iš „Aš“ profilio (vieną kartą)
  function autoFill(s) {
    if (!s || s.auto) return;
    if (!(s.id.trim() || s.name.trim() || s.mech.length || s.nat.length || s.mk.length || s.vit.length || s.tx.length || s.rows.length || Object.keys(s.tq).length || s.t0)) return;
    const p = prof(), ps = profStr();
    if (!s.dt) s.dt = today(); if (!s.country) s.country = 'LTU';
    if (!s.unit && p.unit.trim()) s.unit = p.unit.trim();
    if (!s.resp[0] && ps) s.resp[0] = ps;
    s.auto = 1;
  }
  const save = st => { autoFill(st.pts[st.cur]); st.pts.forEach(derive); LS.set(KEY, st); };
  const curOf = st => st.pts[st.cur];
  const timers = () => LS.get(TCFG.laikai, {}) || {};
  // Traumos laikas – vienas šaltinis: laikmatis (TCFG.laikai.trauma) ⇄ kortelė (t0, dt), abiem kryptimis (hydrate – kviečia PT.sync).
  // Turniketo laikmatis (turn) – anksčiausias uždėtas galūnės turniketas; nuėmus – perskaičiuojamas arba išvalomas (tqSync).
  const ymd = ts => { const d = new Date(ts); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const tsDT = (dt, t) => {
    if (!HM_RE.test(t || '')) return 0;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dt || '')) { const x = new Date(dt + 'T' + t + ':00').getTime(); if (x && x < Date.now() + 5 * 60000) return x; }
    return typeof PT !== 'undefined' && PT.hmTs ? PT.hmTs(t) : 0;
  };
  const trTs = s => s && s.t0 ? tsDT(s.dt, s.t0) : 0;
  const laOf = s => { try { const v = typeof PT !== 'undefined' && s.pid ? PT.get(s.pid, 'laikai') : null; return v && typeof v === 'object' ? v : {}; } catch (e) { return {}; } };
  const trWhen = s => { if (s.t0) return [s.dt, s.t0]; const tr = +laOf(s).trauma; return tr ? [ymd(tr), hm(tr)] : [s.dt, '']; };
  function trSet(s, ts) { const T = timers(); if (ts) { T.trauma = ts; s.t0 = hm(ts); s.dt = ymd(ts); } else { delete T.trauma; s.t0 = ''; } LS.set(TCFG.laikai, T); }
  function trSync(s) { if (!s.t0) return; const x = tsDT(s.dt, s.t0); if (!x) return; const T = timers(); T.trauma = x; LS.set(TCFG.laikai, T); }
  function hydrate() {
    const st = load(), s = curOf(st), T = timers();
    if (!s.t0 && +T.trauma) { s.t0 = hm(+T.trauma); s.dt = ymd(+T.trauma); save(st); }
    else if (s.t0 && !+T.trauma) { const x = trTs(s); if (x) { T.trauma = x; LS.set(TCFG.laikai, T); } }
  }
  const used = s => !!(s && (String(s.id || '').trim() || String(s.name || '').trim() || (s.mech || []).length || (s.nat || []).length || (s.mk || []).length || (s.vit || []).length ||
    (s.tx || []).length || (s.rows || []).length || Object.keys(s.tq || {}).length || s.t0 || s.evac || s.pos));
  // Paciento raktai (TCFG.pt): kortelės išvalymui / sužeistojo ištrynimui su „Atšaukti“
  const PKEYS = () => (TCFG.pt || ['laikai']).map(k => TCFG.pre + k);
  const snapKeys = () => { const o = {}; PKEYS().forEach(k => { o[k] = LS.get(k, null); }); return o; };
  const restoreKeys = o => Object.keys(o).forEach(k => { if (o[k] == null) { try { localStorage.removeItem(k); } catch (e) {} } else LS.set(k, o[k]); });
  let tool = 'X', undo = [];
  const snap = s => { undo.push(JSON.stringify(s.mk)); if (undo.length > 30) undo.shift(); };

  // ── kūno siluetas: viewBox 0 0 120 250, centras x = 60; priekis – paciento dešinė ekrano kairėje ──
  const SHAPES = '<ellipse cx="60" cy="20" rx="12" ry="15"/><path d="M54 31h12l1.5 14h-15z"/>' +
    '<path d="M50 43.5C41 44 35.5 46.5 34 55L37.5 99C36.5 112 36.5 125 38 138L59 143H61L82 138C83.5 125 83.5 112 82.5 99L86 55C84.5 46.5 79 44 70 43.5Z"/>' +
    '<path d="M35 49C27 50.5 24.5 56 24 64L19.5 101L13.5 139H21.5L28 104L33.5 80Z"/><path d="M85 49C93 50.5 95.5 56 96 64L100.5 101L106.5 139H98.5L92 104L86.5 80Z"/>' +
    '<ellipse cx="17" cy="148" rx="5.5" ry="9.5"/><ellipse cx="103" cy="148" rx="5.5" ry="9.5"/>' +
    '<path d="M38 134L39.5 182L42.5 228H54L56 182L59.5 142Z"/><path d="M82 134L80.5 182L77.5 228H66L64 182L60.5 142Z"/>' +
    '<ellipse cx="47.5" cy="235" rx="7.5" ry="5"/><ellipse cx="72.5" cy="235" rx="7.5" ry="5"/>';
  // devynetų taisyklė kaip kortelėje: [x, y, tekstas]
  const NINES = { f: [[60, 15, '4,5%'], [60, 92, '18%'], [26, 104, '4,5%'], [94, 104, '4,5%'], [60, 138, '1%'], [47, 182, '9%'], [73, 182, '9%']],
    b: [[60, 15, '4,5%'], [60, 92, '18%'], [26, 104, '4,5%'], [94, 104, '4,5%'], [47, 182, '9%'], [73, 182, '9%']] };
  const RW = {
    lt: { hd: ['Galva, veidas', 'Galva, pakaušis'], nk: ['Kaklas', 'Sprandas'], s: ['dešinė', 'kairė'], S: ['Dešinė', 'Kairė'], bk: ', užpakalinė pusė', arm: ' ranka – ', ap: ['petys', 'žastas', 'dilbis', 'plaštaka'],
      tr: [['Krūtinė', 'Nugara'], ['Pilvas', 'Juosmuo'], ['Dubuo / kirkšnis', 'Sėdmenys']], mid: 'vidurio linija', sd: ' pusė', leg: ' koja – ', lp: ['šlaunis', 'blauzda', 'pėda'] },
    en: { hd: ['Head, face', 'Head, back'], nk: ['Neck', 'Back of neck'], s: ['right', 'left'], S: ['Right', 'Left'], bk: ', posterior', arm: ' arm – ', ap: ['shoulder', 'upper arm', 'forearm', 'hand'],
      tr: [['Chest', 'Back'], ['Abdomen', 'Lower back'], ['Pelvis / groin', 'Buttocks']], mid: 'midline', sd: ' side', leg: ' leg – ', lp: ['thigh', 'lower leg', 'foot'] }
  };
  function region(sd, x, y, en) {
    const W = en ? RW.en : RW.lt, dx = x - 60, ad = Math.abs(dx), back = sd === 'b', b = back ? 1 : 0;
    const right = (dx < 0) === !back, ri = right ? 0 : 1, bk = back ? W.bk : '';
    if (y < 35.5) return { o: 1, t: W.hd[b] };
    if (y < 45 && ad <= 8.5) return { o: 2, t: W.nk[b] };
    const th = y < 55 ? 26 : y < 99 ? 26 - (y - 55) / 44 * 3.5 : 22.5;
    if ((y < 58 && ad > 17) || (y < 140 && ad > th) || (y >= 140 && ad > 30)) {
      const part = W.ap[y < 58 ? 0 : y < 101 ? 1 : y < 138 ? 2 : 3];
      return { o: right ? 6 : 7, t: W.S[ri] + W.arm + part + bk };
    }
    if (y < 140) {
      const z = y < 90 ? 0 : y < 117 ? 1 : 2;
      return { o: 3 + z, t: W.tr[z][b] + ', ' + (ad <= 5 ? W.mid : W.s[ri] + W.sd) };
    }
    const part = W.lp[y < 182 ? 0 : y < 228 ? 1 : 2];
    return { o: right ? 8 : 9, t: W.S[ri] + W.leg + part + bk };
  }
  const mkName = (m, en) => (en ? mkT(m.t)[3] : mkT(m.t)[2]).toLowerCase();
  function sortedMk(s, en) {
    return s.mk.map((m, i) => ({ m, i, r: region(m.s, m.x, m.y, en) }))
      .sort((a, b) => a.r.o - b.r.o || (a.m.s === b.m.s ? 0 : a.m.s === 'f' ? -1 : 1) || a.m.y - b.m.y);
  }
  const tqList = (s, en) => TQ.filter(([k]) => s.tq[k] && s.tq[k].on).map(([k, lt, e]) => (en ? (k[0] === 'r' ? 'Right ' : 'Left ') + (k[1] === 'a' ? 'arm' : 'leg') + ' – tourniquet' : lt + ' – turniketas') + (s.tq[k].tm ? ' ' + s.tq[k].tm : ''));
  function injText(s, en) {
    const g = [];
    sortedMk(s, en).forEach(({ m, r }) => { const l = g[g.length - 1]; if (l && l.t === r.t) l.a.push(mkName(m, en)); else g.push({ t: r.t, a: [mkName(m, en)] }); });
    return [g.map(x => x.t + ': ' + x.a.join(', ')).join('; '), tqList(s, en).join('; '), s.injTxt.trim()].filter(Boolean).join('; ');
  }
  // ── požymiai: tikrinimas ir išdėstymas (LK kortelės eilė: sąmonė, KD, SpO₂, pulsas, AKS, skausmas) ──
  const sys = bp => parseInt(String(bp || '').split('/')[0], 10);
  const abn = (k, v) => {
    if (v === '' || v == null) return false;
    const n = k === 'bp' ? sys(v) : +v;
    switch (k) {
      case 'av': return v === 'P' || v === 'U';
      case 'hr': return n > 120 || n < 50;
      case 'rr': return n > 29 || n < 10;
      case 'bp': return n < 90;
      case 'spo2': return n < 92;
      case 'gcs': return /^\d+$/.test(v) ? n <= 8 : false;
      default: return false;
    }
  };
  const gcsEn = d => String(d || '').replace(/\bA(\S+) K(\S+) M(\S+)/, 'E$1 V$2 M$3').replace('GKS-P', 'GCS-P');
  function vitLine(v, en) {
    const L = en ? { av: 'AVPU', rr: 'RR', spo2: 'SpO₂', hr: 'HR', bp: 'BP', pain: 'pain', gcs: 'GCS', nt: ' (not totalled)' } : { av: 'AVPU', rr: 'KD', spo2: 'SpO₂', hr: 'pulsas', bp: 'AKS', pain: 'skausmas', gcs: 'GKS', nt: ' (suma neskaičiuojama)' };
    const gd = en ? gcsEn(v.gcsD) : v.gcsD;
    return [v.ts + ' –', v.av ? L.av + ' ' + v.av : '', v.rr ? L.rr + ' ' + v.rr : '', v.spo2 ? L.spo2 + ' ' + v.spo2 + ' %' : '', v.hr ? L.hr + ' ' + v.hr : '', v.bp ? L.bp + ' ' + v.bp : '',
      v.pain !== '' && v.pain != null ? L.pain + ' ' + v.pain + '/10' : '', v.gcs ? (v.gcs === 'NT' ? L.gcs + ' ' + (gd || 'NT') + L.nt : L.gcs + ' ' + v.gcs + (gd ? ' (' + gd + ')' : '')) : '']
      .filter(Boolean).join(', ').replace(' –,', ' –');
  }
  // ── T dalis tekstu ──
  const rowText = r => [r.name, r.dose, r.route, r.time].map(x => String(x || '').trim()).filter(Boolean).join(' ');
  function txParts(s, en, noRows) {
    const on = k => s.tx.indexOf(k) >= 0, nm = k => { const x = txT(k); return en ? x[2] : x[1]; }, out = [];
    const grp = (ids, lt, e) => { const a = ids.filter(on).map(nm); if (a.length) out.push((en ? e : lt) + ' (' + a.join(', ') + ')'); };
    grp(['tq', 'tqj'], 'turniketas', 'tourniquet'); grp(['dh', 'dp', 'dk'], 'tvarstis', 'dressing');
    const a = ['npa', 'igel', 'cric', 'ak'].filter(on).map(k => k === 'ak' ? (en ? 'airway – other' : 'kvėpavimo takai – kita') : nm(k)); if (a.length) out.push(a.join(', '));
    ['occl', 'dec', 'o2', 'ctube'].filter(on).forEach(k => out.push(nm(k)));
    if (!noRows) ROWG.forEach(([g, lt, e]) => { const r = s.rows.filter(x => x.g === g && rowText(x)); if (r.length) out.push((en ? e.replace(/ \(.*\)$/, '') : lt.replace(/ \(.*\)$/, '')).toLowerCase() + ': ' + r.map(rowText).join(', ')); });
    ['dress', 'spl'].filter(on).forEach(k => out.push(nm(k)));
    const eye = ['eyeR', 'eyeL'].filter(on).map(nm); if (eye.length) out.push((en ? 'eye shield ' : 'akies gaubtelis ') + eye.join(', '));
    ['hypo', 'oth'].filter(on).forEach(k => out.push(k === 'oth' ? (en ? 'other' : 'kita') : nm(k)));
    return out;
  }
  const ACR = /^(TXA|IV|IO|NPA|I-gel|O₂|CRIC)\b/;
  const lc = a => a.map((x, i) => i === 0 || ACR.test(x) ? x : x.charAt(0).toLowerCase() + x.slice(1)).join(', ');
  const sexName = (s, en) => (SEX.find(x => x[0] === s.sex) || ['', '', ''])[en ? 2 : 1].toLowerCase();
  // n / tot – sužeistojo numeris ir kiek iš viso (kai keli – antraštėje „MIST 2/3“)
  function parts(s, n, tot, en) {
    const hd = ['MIST' + (tot > 1 ? ' ' + n + '/' + tot : '') + (s.id.trim() ? ' – ' + s.id.trim() : ''), sexName(s, en)].filter(Boolean).join(' · ');
    const mech = s.mech.map(m => { const x = MECH.find(y => y[0] === m); return x ? (en ? x[2] : x[0]) : m; });
    const nat = s.nat.map(k => { const x = NAT.find(y => y[0] === k); return x ? (en ? x[3] : x[1]) : k; });
    const [wd, wt] = trWhen(s), when = [wd && wd !== today() ? wd : '', wt].filter(Boolean).join(' ');
    const M = [lc(mech), s.mechTxt.trim(), nat.join(', ')].filter(Boolean).join('; ') + (when ? (mech.length || s.mechTxt.trim() || nat.length ? '; ' : '') + (en ? 'time of injury ' : 'sužeista ') + when : '');
    const S = s.vit.slice().reverse().map(v => vitLine(v, en));
    if (s.sympt.trim()) S.push((en ? 'Symptoms: ' : 'Nusiskundimai: ') + s.sympt.trim());
    const T = [lc(txParts(s, en)), s.txTxt.trim()].filter(Boolean).join('; ');
    const ev = EVAC.find(x => x[0] === s.evac), ps = POS.find(x => x[0] === s.pos);
    const E2 = [ev ? (en ? ev[2] : ev[1] + ' (' + ev[2] + ')') : '', ps ? (en ? ps[2] : ps[1]).toLowerCase() : ''].filter(Boolean).join(', ');
    return { hd, M: M || '—', I: injText(s, en) || '—', S: S.length ? S : ['—'], T: T || '—', E: E2, A: s.allerg.trim() };
  }
  function text(s, n, tot, en) {
    const P = parts(s, n, tot, en);
    return [P.hd, 'M: ' + P.M, 'I: ' + P.I, 'S: ' + P.S.join('\n   '), 'T: ' + P.T, P.E ? (en ? 'Evacuation: ' : 'Evakuacija: ') + P.E : '', P.A ? (en ? 'Allergies: ' : 'Alergijos: ') + P.A : ''].filter(Boolean).join('\n');
  }
  const curText = (st, en) => text(curOf(st), st.cur + 1, st.pts.length, en);
  const allText = (st, en) => st.pts.map((p, i) => text(p, i + 1, st.pts.length, en)).join('\n\n');
  // Perdavimas: šis sužeistasis (su kitų įrankių priedais – PT.extras) arba visi
  let scope = 'one';
  const extra = en => { try { return typeof PT !== 'undefined' && PT.extras ? PT.extras(en) : ''; } catch (e) { return ''; } };
  const allOn = st => scope === 'all' && st.pts.length > 1;
  const outText = (st, en) => allOn(st) ? allText(st, en) : [curText(st, en), extra(en)].filter(Boolean).join('\n\n');
  function status() {
    const st = load(), n = st.pts.length;
    if (n > 1) {
      const mk = st.pts.reduce((a, p) => a + p.mk.length, 0), vit = st.pts.reduce((a, p) => a + p.vit.length, 0);
      return [plural(n, ['sužeistasis', 'sužeistieji', 'sužeistųjų']), mk ? plural(mk, ['žymė', 'žymės', 'žymių']) : vit ? plural(vit, ['matavimas', 'matavimai', 'matavimų']) : ''].filter(Boolean).join(' · ');
    }
    const s = st.pts[0], a = [];
    if (s.id.trim()) a.push(s.id.trim());
    if (s.mk.length) a.push(plural(s.mk.length, ['žymė', 'žymės', 'žymių']));
    if (s.vit.length) a.push(plural(s.vit.length, ['matavimas', 'matavimai', 'matavimų']));
    if (!a.length && (s.mech.length || s.tx.length || s.t0 || Object.keys(s.tq).length)) a.push('Pildoma');
    return a.length ? a.join(' · ') : 'Nukentėjusiojo kortelė';
  }

  // ── vaizdas: MIST kortelė pasirinkimais – spalvotos dalys M, I, S, T, E; visi LK kortelės klasifikatoriai ──
  // Retai pildomi laukai – „+“ mygtukai (atsiveria bakstelėjus); įvedimas – apatiniais langais (SH žemiau): požymiai, vaistai / skysčiai, sužalojimas, turniketas, laikas.
  // Sugeneruota kortelė (cardCanvas) – tiksliai LK „Nukentėjusiojo kortelės“ išdėstymo.
  const MKC = { L: ['#1D5FB4', '#fff'], X: ['#C2410C', '#fff'], O: ['#B42318', '#fff'], K: ['#9F1239', '#fff'], N: ['#F2B705', '#1B1B1B'], Z: ['#C2410C', '#fff'], A: ['#6B2A8C', '#fff'] };
  const badge = k => { const c = MKC[k] || MKC.X; return `<span class="mqg" style="--g:${c[0]};--gf:${c[1]}" aria-hidden="true">${esc(mkT(k)[1])}</span>`; };
  const TXL = { tq: 'Turniketas – galūnės', tqj: 'Turniketas – jungties', dh: 'Tvarstis hemostatinis', dp: 'Tvarstis spaudžiamasis', dk: 'Kitas tvarstis', npa: 'Nazofar. vamzdelis', igel: 'I-gel', cric: 'Kriko.', ak: 'Kita (A)',
    occl: TCFG.occl || 'Okliuzinis tvarstis', dec: 'Ad. dekompresija', o2: 'O₂', ctube: 'Krūtinės drenas', dress: 'Tvarstymas', spl: 'Imobilizavimas', eyeR: 'Akies gaubtelis D', eyeL: 'Akies gaubtelis K', hypo: 'Hipotermijos prevencija', oth: 'Kita' };
  const TSH = { L: 'Lūžis', X: 'Nekiaur.', O: 'Kiaurinis', K: 'Kraujav.', N: 'Nudeg.' }; // trumpi ženklų užrašai mygtukuose
  const lvTag = x => x[4] ? ` <small class="mqlv${x[4] === 'CPP' ? ' r' : ''}">${x[4]}</small>` : '';
  const ch = (act, k, on, lb, ex) => `<button class="mqc${on ? ' on' : ''}" data-act="${act}" data-k="${esc(k)}" aria-pressed="${!!on}"${ex || ''}>${lb}</button>`;
  const secH = (L, t, en) => `<div class="mcl"><span class="lt">${L}</span><b>${t}</b><small>${en}</small></div>`;
  const lab = t => `<div class="mqlab">${t}</div>`;
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const yday = () => { const d = new Date(Date.now() - 864e5); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const trunc = (v, n) => { v = String(v || ''); return v.length > n ? v.slice(0, n - 1) + '…' : v; };
  // „Aš“ – pagalbos teikėjo profilis (nustatymuose ir kortelėje): įrašomas į naujas korteles (1-as teikėjas, dalinys)
  const PK = TCFG.pre + 'as';
  const prof = () => { const p = LS.get(PK, {}); return p && typeof p === 'object' && !Array.isArray(p) ? { name: str(p.name), id: str(p.id), unit: str(p.unit) } : { name: '', id: '', unit: '' }; };
  const profStr = () => { const p = prof(); return [p.name.trim(), p.id.trim()].filter(Boolean).join(', '); };
  function profileView() {
    const p = prof();
    return '<div class="mqprof"><b>Aš – pagalbos teikėjas</b><p class="muted mt0">Įrašoma į naujas MIST korteles: pagalbos teikėjas ir dalinys.</p>' +
      `<div class="mqg2"><label class="mqf">Pavardė, vardas<input class="inp" data-mcas="name" value="${esc(p.name)}" autocomplete="off"></label><label class="mqf">ID<input class="inp" data-mcas="id" value="${esc(p.id)}" autocomplete="off"></label></div>` +
      `<label class="mqf">Dalinys<input class="inp" data-mcas="unit" value="${esc(p.unit)}" autocomplete="off" placeholder="pvz. 1040 kuopa"></label></div>`;
  }
  // Retai pildomi laukai
  const ALG = ['Nėra žinomų', 'Penicilinas', 'Cefalosporinai', 'NVNU', 'Lateksas'];
  const CTRY = ['LTU', 'LVA', 'EST', 'POL', 'DEU', 'USA', 'GBR'];
  const MTXT = ['mina', 'skeveldros', 'SSU', 'granata', 'artilerija', 'RPG', 'kritimas', 'eismo įvykis'];
  const SYM = ['Skausmas', 'Dusulys', 'Troškulys', 'Pykinimas', 'Šalta', 'Svaigsta galva'];
  const toks = v => String(v || '').split(/\s*[,;]\s*/).map(x => x.trim()).filter(Boolean);
  const hasTok = (v, t) => toks(v).some(x => x.toLowerCase() === t.toLowerCase());
  function togTok(v, t, solo) { // solo – vienintelė reikšmė (pvz. „Nėra žinomų“)
    if (solo && solo.indexOf(t) >= 0) return hasTok(v, t) ? '' : t;
    const a = toks(v).filter(x => !solo || solo.indexOf(x) < 0), i = a.findIndex(x => x.toLowerCase() === t.toLowerCase());
    if (i >= 0) a.splice(i, 1); else a.push(t);
    return a.join(', ');
  }
  const optChips = (k, list, on) => '<div class="mqrow">' + list.map(t => `<button class="mqc sm${on(t) ? ' on' : ''}" data-act="mc-optv" data-k="${k}" data-v="${esc(t)}" aria-pressed="${!!on(t)}">${esc(t)}</button>`).join('') + '</div>';
  const txt = (k, v, ph, ex) => `<input class="inp" data-mc="${k}" data-dict value="${esc(v)}" placeholder="${esc(ph)}" autocomplete="off"${ex || ''}>`;
  let openOpt = '';
  const OPTS = {
    allerg: { lb: 'Alergijos', v: s => s.allerg.trim(), ed: s => optChips('allerg', ALG, t => hasTok(s.allerg, t)) + txt('allerg', s.allerg, 'Kita – įrašykite arba padiktuokite', ' aria-label="Alergijos"') },
    dob: { lb: 'Gim. data', v: s => s.dob.trim(), ed: s => txt('dob', s.dob, 'MMMM-MM-DD', ' inputmode="numeric" aria-label="Gimimo data"').replace(' data-dict', '') },
    unit: { lb: 'Dalinys', v: s => s.unit.trim(), ed: s => txt('unit', s.unit, prof().unit || 'pvz. 1040 kuopa', ' aria-label="Dalinys"').replace(' data-dict', '') },
    country: { lb: 'Šalis', v: s => s.country.trim(), ed: s => optChips('country', CTRY, t => s.country === t) + txt('country', s.country, 'Kita šalis', ' aria-label="Šalis"').replace(' data-dict', '') },
    dt: { lb: 'Data', lb0: 'Kita data', v: s => s.dt && s.dt !== today() ? s.dt : '', ed: s => optChips('dt', ['Šiandien', 'Vakar'], t => (t === 'Šiandien' ? today() : yday()) === (s.dt || today())) +
      `<input type="date" class="inp mqdate" data-mc="dt" value="${esc(s.dt || today())}" aria-label="Traumos data">` },
    mechTxt: { lb: 'Patikslinimas', v: s => s.mechTxt.trim(), ed: s => optChips('mechTxt', MTXT, t => hasTok(s.mechTxt, t)) + txt('mechTxt', s.mechTxt, 'Kita – įrašykite arba padiktuokite', ' aria-label="Mechanizmo patikslinimas"') },
    injTxt: { lb: 'Patikslinimas', v: s => s.injTxt.trim(), ed: s => txt('injTxt', s.injTxt, 'Kiti sužalojimai – įrašykite arba padiktuokite', ' aria-label="Sužalojimų patikslinimas"') },
    sympt: { lb: 'Nusiskundimai', v: s => s.sympt.trim(), ed: s => optChips('sympt', SYM, t => hasTok(s.sympt, t)) + txt('sympt', s.sympt, 'Kita – įrašykite arba padiktuokite', ' aria-label="Nusiskundimai"') },
    txTxt: { lb: 'Pastabos', v: s => s.txTxt.trim(), ed: s => `<textarea class="inp" data-mc="txTxt" data-dict rows="3" aria-label="Pastabos" placeholder="Įrašykite arba padiktuokite">${esc(s.txTxt)}</textarea>` },
    resp1: { lb: 'Pagalbos teikėjas', v: s => s.resp[0].trim(), ed: s => `<input class="inp" data-mcp="0" data-dict value="${esc(s.resp[0])}" placeholder="Pavardė, vardas, ID" autocomplete="off" aria-label="1-as pagalbos teikėjas">` +
      (profStr() ? `<div class="mqrow"><button class="mqc sm" data-act="mc-me">Aš: ${esc(profStr())}</button></div>` : '') + profileView() },
    resp2: { lb: '2-as teikėjas', v: s => s.resp[1].trim(), ed: s => `<input class="inp" data-mcp="1" data-dict value="${esc(s.resp[1])}" placeholder="Pavardė, vardas, ID" autocomplete="off" aria-label="2-as pagalbos teikėjas">` }
  };
  const pill = (k, s) => { const o = OPTS[k], v = o.v(s), op = openOpt === k; return `<button class="mqo${v ? ' set' : ''}${op ? ' op' : ''}" data-act="mc-opt" data-k="${k}" aria-expanded="${op}">${v ? esc(o.lb) + ': <b>' + esc(trunc(v, 28)) + '</b>' : '+ ' + esc(o.lb0 || o.lb)}</button>`; };
  const pills = (keys, s) => '<div class="mqrow mqopts">' + keys.map(k => pill(k, s)).join('') + '</div>' +
    (keys.indexOf(openOpt) >= 0 ? `<div class="mqed" id="mqed"><div class="mqedh"><b>${esc(OPTS[openOpt].lb)}</b><button class="btn sm" data-act="mc-opt" data-k="">Gerai</button></div>${OPTS[openOpt].ed(s)}</div>` : '');
  function figure(s, sd) {
    const lab2 = sd === 'f' ? ['D', 'K'] : ['K', 'D'], nmF = sd === 'f' ? 'Priekis' : 'Nugara';
    const bands = sd === 'f' ? TQ.filter(([k]) => s.tq[k] && s.tq[k].on).map(([k, , , p]) => `<path class="mqtq" d="M${p[0] - 7} ${p[1] - 9}h14"/>`).join('') : '';
    const marks = s.mk.map((m, i) => { if (m.s !== sd) return ''; const c = MKC[m.t] || MKC.X, T = mkT(m.t), lb = T[2] + ' – ' + region(m.s, m.x, m.y).t;
      return `<g class="mk" data-act="mc-mdel" data-k="${i}" role="button" tabindex="0" aria-label="Pašalinti žymę: ${esc(lb)}" transform="translate(${m.x} ${m.y})"><circle class="hit" r="11"/><circle class="dot" r="8" fill="${c[0]}"/><text y="3.6" fill="${c[1]}">${esc(T[1])}</text></g>`; }).join('');
    return `<figure class="bfig"><svg viewBox="0 0 120 250" data-act="mc-body" data-s="${sd}" role="img" aria-label="Kūnas – ${nmF.toLowerCase()}. Bakstelėkite sužalojimo vietą.">` +
      `<g class="bo">${SHAPES}</g><g class="bf">${SHAPES}</g>` + (sd === 'b' ? '<path class="bsp" d="M60 47V130"/>' : '') +
      `<text class="blr" x="9" y="14">${lab2[0]}</text><text class="blr" x="111" y="14">${lab2[1]}</text>` + bands + marks + `</svg><figcaption>${nmF}</figcaption></figure>`;
  }
  function tabs(st) {
    const tabLabel = (i, id) => 'Sužeistasis ' + (i + 1) + (id ? ' – ' + id : '');
    return '<div class="ptabs" role="tablist" aria-label="Sužeistieji">' + st.pts.map((p, i) => {
      const id = p.id.trim(), on = i === st.cur;
      return `<button class="${on ? 'on' : ''}" data-act="mc-sel" data-k="${i}" role="tab" aria-selected="${on}" aria-label="${esc(tabLabel(i, id))}">${i + 1}${id ? '<small>' + esc(id) + '</small>' : ''}</button>`;
    }).join('') + '<button class="add" data-act="mc-add" aria-label="Pridėti sužeistąjį" title="Pridėti sužeistąjį">+</button></div>';
  }
  const rowTxt = r => [r.name, r.dose, r.route].map(x => String(x || '').trim()).filter(Boolean).join(' ');
  // Perdavimo mygtukai – kortelės viršuje (kompaktiški) ir apačioje (su MIST tekstu)
  const scopeSeg = tot => tot > 1 ? `<div class="seg2 mqscope" role="group" aria-label="Ką perduoti">${chip('mc-scope', 'one', scope !== 'all', 'Šį sužeistąjį')}${chip('mc-scope', 'all', scope === 'all', 'Visus (' + tot + ')')}</div>` : '';
  const expBar = tot => scopeSeg(tot) + '<div class="mqexp" role="group" aria-label="Perduoti ir eksportuoti"><button class="btn sm pri" data-act="mc-card">Kortelė (paveikslėlis)</button><button class="btn sm" data-act="mc-read">Skaityti</button><button class="btn sm" data-act="mc-copy">Kopijuoti</button>' +
    '<button class="btn sm" data-act="go" data-r="#/qr">QR kodu</button></div>';
  // March: CLS / CMC žymos ir „tik CLS“ (skysčiai ir kraujas – CMC); ETC – visada rodoma
  const lvOn = () => typeof tikCLS === 'function';
  const flOk = () => typeof ok !== 'function' || ok('CMC');
  const lvSm = l => l && l !== 'CLS' ? ` <small class="mqlv${l === 'CPP' ? ' r' : ''}">${esc(l)}</small>` : '';
  // o.embed – be antraštės ir skirtukų (paciento ekrano skiltis „Kortelė“)
  function view(o) {
    const emb = !!(o && o.embed);
    const st = load(), s = curOf(st), n = st.cur + 1, tot = st.pts.length, learn = mode === 'learn', T = timers();
    let h = emb ? '' : '<h1>MIST kortelė</h1>';
    if (learn && !emb) h += '<p class="muted">Pildoma pasirinkimais: M – mechanizmas, I – sužalojimai ir turniketai, S – būklė, T – teikta pagalba, E – evakuacija. Požymiai, vaistai, skysčiai, turniketai įvedami apatiniuose languose; retai pildomi laukai – „+“ mygtukais. Sugeneruota kortelė – LK „Nukentėjusiojo kortelės“ išdėstymo. Per radiją perduodamas tik ID / šaukinys.</p>';
    if (!emb) h += tabs(st);
    h += expBar(tot);
    h += `<article class="mc mq" aria-label="MIST kortelė – sužeistasis ${n}">`;
    h += `<div class="mch"><b>MIST</b><span>Nukentėjusiojo kortelė · ${esc(s.dt || today())}${tot > 1 ? ' · ' + n + ' / ' + tot : ''}</span></div>`;
    // A – asmuo
    h += '<div class="mqa">' +
      `<div class="mqg2"><label class="mqf">Pavardė, vardas<input class="inp" data-mc="name" value="${esc(s.name)}" autocomplete="off"></label><label class="mqf">ID / šaukinys<input class="inp mqid" data-mc="id" value="${esc(s.id)}" autocomplete="off" placeholder="pvz. Vilkas 2"></label></div>` +
      `<div class="mqrow"><span class="mqk">Lytis</span>${SEX.map(([k, lt]) => ch('mc-sex', k, s.sex === k, lt)).join('')}</div>` +
      pills(['allerg', 'dob', 'unit', 'country', 'dt'], s) + '</div>';
    // M – mechanizmas
    const tm = '<div class="mqrow"><span class="mqk">Trauma</span>' + (s.t0 ? ch('mc-time', 't0', true, esc(s.t0)) : '') +
      '<button class="mqc" data-act="mc-now" data-k="0">Dabar</button><button class="mqc" data-act="mc-now" data-k="10">−10 min</button><button class="mqc" data-act="mc-time" data-k="t0">Kitas…</button></div>';
    h += '<section class="mcs sM" id="mcM" aria-label="M – mechanizmas">' + secH('M', 'Mechanizmas', 'Mechanism') + tm +
      lab('Pobūdis') + '<div class="mqrow">' + NAT.map(([k, lt, ab]) => ch('mc-nat', k, s.nat.indexOf(k) >= 0, esc({ kov: 'Kovinis', nekov: 'Nekovinis', liga: 'Liga', stres: 'Stresas' }[k] || lt) + (ab !== 'stress' ? ' <small>' + ab + '</small>' : ''), ` aria-label="${esc(lt)}"`)).join('') + '</div>' +
      lab('Mechanizmas') + '<div class="mqrow">' + MECH.map(([k]) => ch('mc-mech', k, s.mech.indexOf(k) >= 0, esc(k))).join('') + '</div>' +
      pills(['mechTxt'], s) + '</section>';
    // I – sužalojimai
    const SM = sortedMk(s);
    h += '<section class="mcs sI" id="mcI" aria-label="I – sužalojimai">' + secH('I', 'Sužalojimai', 'Injuries') +
      '<div class="mqtools" role="radiogroup" aria-label="Sutartinis ženklas">' + TOOLS.map(k => { const x = mkT(k); return `<button class="${tool === k ? 'on' : ''}" data-act="mc-tool" data-k="${k}" role="radio" aria-checked="${tool === k}" aria-label="${esc(x[2])}">${badge(k)}<span>${esc(TSH[k] || x[2])}</span></button>`; }).join('') + '</div>' +
      `<div class="bfigs">${figure(s, 'f')}${figure(s, 'b')}</div>` +
      (SM.length ? '<ul class="mlist" aria-label="Žymės pagal kūno sritį">' + SM.map(({ m, i, r }) => `<li>${badge(m.t)}<div class="mt"><b>${esc(r.t)}</b> – ${esc(mkT(m.t)[2].toLowerCase())}</div><button class="x" data-act="mc-mdel" data-k="${i}" aria-label="Pašalinti: ${esc(mkT(m.t)[2] + ' – ' + r.t)}">×</button></li>`).join('') + '</ul>' +
        `<div class="mqrow"><button class="mqc sm" data-act="mc-undo"${undo.length ? '' : ' disabled'}>↶ Atšaukti</button><button class="mqc sm" data-act="mc-mclr">Išvalyti žymes</button></div>`
        : `<p class="muted mqhint">Pasirinkite ženklą ir bakstelėkite schemoje (bakstelėjus žymę – ji pašalinama). D – paciento dešinė.</p>${undo.length ? '<div class="mqrow"><button class="mqc sm" data-act="mc-undo">↶ Atšaukti</button></div>' : ''}`) +
      lab('Turniketai – bakstelėkite galūnę') + '<div class="mqtq4">' + TQ.map(([k, lt]) => { const q = s.tq[k]; return `<button class="mqc${q && q.on ? ' on tq' : ''}" data-act="mc-tqs" data-k="${k}" aria-pressed="${!!(q && q.on)}">${esc(lt)}${q && q.on ? ' · ' + esc(q.tm || '—') : ''}</button>`; }).join('') + '</div>' +
      '<div class="mqrow">' + ch('mc-tx', 'tqj', s.tx.indexOf('tqj') >= 0, 'Jungties turniketas') +
      (typeof NB !== 'undefined' ? `<a class="mqc" href="#/nudegimai">Nudegimų plotas${NB.total && +NB.total() ? ': ' + esc(String(NB.total()).replace('.', ',')) + ' %' : ''} ›</a>` : '') + '</div>' +
      pills(['injTxt'], s) + '</section>';
    // S – būklė
    const V = s.vit.map((v, i) => ({ v, i })).slice(-3), more = s.vit.length - V.length;
    const R = [['av', 'AVPU'], ['rr', 'KD'], ['spo2', 'SpO₂'], ['hr', 'Pulsas'], ['bp', 'AKS'], ['pain', 'Skausmas'], ['gcs', 'GKS']].filter(([k]) => k !== 'gcs' || V.some(({ v }) => v.gcs));
    h += '<section class="mcs sS" id="mcS" aria-label="S – būklė">' + secH('S', 'Būklė', 'Signs') +
      (V.length ? '<div class="vtw"><table class="vt"><thead><tr><th scope="col">Laikas</th>' + V.map(({ v }) => `<th scope="col">${esc(v.ts || '—')}</th>`).join('') + '</tr></thead><tbody>' +
        R.map(([k, lb]) => `<tr><th scope="row">${lb}</th>` + V.map(({ v }) => `<td class="${abn(k, v[k]) ? 'ab' : ''}">${esc(v[k] == null ? '' : v[k])}${k === 'spo2' && v[k] ? ' %' : ''}${k === 'gcs' && v.gcsD ? ' <small>' + esc(v.gcsD) + '</small>' : ''}</td>`).join('') + '</tr>').join('') +
        '<tr class="vdel"><th scope="row"><span class="vh">Ištrinti</span></th>' + V.map(({ v, i }) => `<td><button class="x" data-act="mc-vdel" data-k="${i}" aria-label="Ištrinti ${esc(v.ts)} matavimą">×</button></td>`).join('') + '</tr></tbody></table></div>' +
        (more > 0 ? `<p class="muted mqhint">Ir ${plural(more, ['ankstesnis matavimas', 'ankstesni matavimai', 'ankstesnių matavimų'])} – visi perduodami MIST tekste ir kortelėje.</p>` : '')
        : '<p class="muted mqhint">Matavimų dar nėra.</p>') +
      '<button class="btn pri mqbig" data-act="mc-vit">+ Matavimas</button>' + pills(['sympt'], s) + '</section>';
    // T – teikta pagalba
    const tch = keys => keys.map(k => txT(k)).filter(x => txShown(x, s)).map(x => ch('mc-tx', x[0], s.tx.indexOf(x[0]) >= 0, esc(TXL[x[0]] || x[1]) + lvTag(x))).join('');
    const rws = s.rows.map((r, i) => ({ r, i })).filter(x => rowTxt(x.r) || x.r.time).sort((a, b) => (a.r.time || '99') < (b.r.time || '99') ? -1 : (a.r.time || '99') > (b.r.time || '99') ? 1 : 0);
    const gName = g => { const x = ROWG.find(y => y[0] === g); return x ? x[1].replace(/ \(.*\)$/, '').toLowerCase() : g; };
    const vzN = typeof VZ !== 'undefined' ? VZ.get().e.filter(e => !e.x).length : 0;
    h += '<section class="mcs sT" id="mcT" aria-label="T – teikta pagalba">' + secH('T', 'Teikta pagalba', 'Treatment') +
      '<div class="mqtx">' +
      `<b class="mqtl r">„C“</b><div class="mqrow">${tch(['tq', 'tqj', 'dh', 'dp', 'dk'])}</div>` +
      `<b class="mqtl r">A</b><div class="mqrow">${tch(['npa', 'igel', 'cric', 'ak'])}</div>` +
      `<b class="mqtl r">B</b><div class="mqrow">${tch(['occl', 'dec', 'o2', 'ctube'])}</div>` +
      '<b class="mqtl r">C</b><div class="mqc-tbl">' +
      (rws.length ? '<div class="mqrows">' + rws.map(({ r, i }) => `<div class="mqrw"><b>${esc(r.time || '—')}</b><span>${esc(rowTxt(r) || '—')} <small>· ${esc(gName(r.g))}</small></span><button class="x" data-act="mc-rdel" data-k="${i}" aria-label="Pašalinti: ${esc(rowTxt(r))}">×</button></div>`).join('') + '</div>' : '<p class="muted mqhint">Vaistų, skysčių ir kraujo dar nėra.</p>') +
      (flOk() ? '<div class="mqg2"><button class="btn mqbig mqt" data-act="mc-rx" data-k="rx">+ Vaistas</button><button class="btn mqbig mqt" data-act="mc-rx" data-k="fl">+ Skystis / kraujas' + (lvOn() ? lvSm('CMC') : '') + '</button></div>' : '<button class="btn mqbig mqt" data-act="mc-rx" data-k="rx">+ Vaistas</button>') +
      (vzN ? `<button class="btn sm" data-act="mc-vz">Įrašyti iš vaistų žymėjimo (${vzN})</button>` : '') + '</div>' +
      `<b class="mqtl">Kita</b><div class="mqrow">${tch(['dress', 'spl', 'eyeR', 'eyeL', 'hypo', 'oth'])}</div>` +
      '</div>' + pills(['txTxt'], s) + '</section>';
    // E – evakuacija, padėtis, pagalbos teikėjai
    h += '<section class="mcs sE" id="mcE" aria-label="Evakuacija">' + secH('E', 'Evakuacija', 'Evacuation') +
      '<div class="mqev">' + EVAC.map(([k, lt, en]) => `<button class="ev${k}${s.evac === k ? ' on' : ''}" data-act="mc-ev" data-k="${k}" aria-pressed="${s.evac === k}" aria-label="${esc(lt)} – 9-Line ${EVL[k]}"><b>${esc(lt.toUpperCase())}</b><small>${en} · ${EVL[k]}</small></button>`).join('') + '</div>' +
      lab('Transportavimo padėtis') + '<div class="mqpos">' + POS.map(([k, lt]) => `<button class="${s.pos === k ? 'on' : ''}" data-act="mc-pos" data-k="${k}" aria-pressed="${s.pos === k}" aria-label="${lt}" title="${lt}"><svg viewBox="0 0 34 24" aria-hidden="true">${POS_SVG[k]}</svg></button>`).join('') + '</div>' +
      lab('Pagalbos teikėjai') + (!s.resp[0].trim() && profStr() && openOpt !== 'resp1' ? `<div class="mqrow"><button class="mqc" data-act="mc-me">+ Aš: ${esc(profStr())}</button></div>` : '') +
      pills(['resp1', 'resp2'], s) + '</section>';
    h += '</article>';
    if (emb) return h + mgmtInner(st); // paciento ekrane: perdavimo blokas – skiltyje „Perduoti“
    h += '<section class="outp mqout" id="mcOut">' + outInner(st) + '</section>';
    return h + mgmtInner(st) + tcfgRows(TCFG.mc());
  }
  // Perdavimo dalis (MIST tekstas, skaityti, kopijuoti, kortelės paveikslėlis) ir sužeistųjų tvarkymas
  function outInner(st) {
    const n = st.cur + 1, tot = st.pts.length, all = allOn(st);
    return `<div class="nlh"><b>Perduoti (MIST)</b>${tot > 1 ? `<small class="muted">${all ? 'visi sužeistieji (' + tot + ')' : 'sužeistasis ' + n + ' iš ' + tot}</small>` : ''}</div>${langSeg('mc-lang')}${scopeSeg(tot)}<pre id="mc-out">${esc(outText(st, outEn()))}</pre>` +
      '<div class="acts"><button class="btn pri" data-act="mc-read">Skaityti</button><button class="btn" data-act="mc-copy">Kopijuoti</button><button class="btn" data-act="mc-share">Bendrinti</button></div>' +
      '<div class="acts"><button class="btn" data-act="mc-card">Kortelė (paveikslėlis, spausdinti)</button><button class="btn" data-act="go" data-r="#/qr">Perduoti QR kodu</button></div>';
  }
  // Sužeistųjų tvarkymas: pridėti – matomas; išvalyti / ištrinti – „Daugiau…“ (su „Atšaukti“)
  function mgmtInner(st) {
    const n = st.cur + 1, tot = st.pts.length, z = typeof VZ !== 'undefined' ? ', vaistų įrašai' : '';
    return '<div class="acts"><button class="btn" data-act="mc-add">+ Kitas sužeistasis</button></div>' +
      `<details class="mqmore"><summary>Daugiau…</summary><div class="acts"><button class="btn dng" data-act="mc-new">Išvalyti šį sužeistąjį</button>` +
      (tot > 1 ? `<button class="btn dng" data-act="mc-pdel">Ištrinti sužeistąjį ${n}</button><button class="btn dng" data-act="mc-allclr">Išvalyti visas korteles</button>` : '') +
      `</div><p class="muted mt0">Išvalomi kortelė, laikai${z} ir sąrašų žymėjimai – iškart galima atšaukti.</p></details>`;
  }
  const outView = () => '<section class="outp">' + outInner(load()) + '</section>';

  // Bakstelėjimas ant schemos → viewBox koordinatės; tik ant silueto (arba šalia – pritraukiama)
  function bodyPoint(svg, e) {
    const ctm = svg.getScreenCTM(); if (!ctm) return null;
    let p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; p = p.matrixTransform(ctm.inverse());
    const shapes = svg.querySelectorAll('.bf > *');
    const inside = (x, y) => { const q = svg.createSVGPoint(); q.x = x; q.y = y; try { for (const sh of shapes) if (sh.isPointInFill(q)) return true; return false; } catch (err) { return true; } };
    if (!shapes.length || !shapes[0].isPointInFill || inside(p.x, p.y)) return { x: p.x, y: p.y };
    for (let r = 2; r <= 6; r += 2) for (let a = 0; a < 8; a++) { const x = p.x + r * Math.cos(a * Math.PI / 4), y = p.y + r * Math.sin(a * Math.PI / 4); if (inside(x, y)) return { x, y }; }
    return null;
  }
  // Nuimtas paskutinis galūnės turniketas – vėliava „turniketas – galūnės“ ir laikas taip pat (kad perdavimas ir priminimai neklaidintų)
  const tqGone = s => { if (TQ.some(([q]) => s.tq[q] && s.tq[q].on)) return; s.tx = s.tx.filter(x => x !== 'tq'); s.tqT = ''; };
  const tqDefault = () => { const T = timers(); return T.turn ? hm(T.turn) : nowHM(); };
  function act(el, e) {
    const st = load(), s = curOf(st), d = el.dataset, k = d.k, n = st.cur + 1, tot = st.pts.length;
    const toggle = (a, v) => { const i = a.indexOf(v); if (i >= 0) a.splice(i, 1); else a.push(v); };
    switch (d.act) {
      // ── sužeistieji ──
      case 'mc-sel': { const i = +k; if (!(i >= 0 && i < tot) || i === st.cur) return; st.cur = i; undo = []; openOpt = ''; save(st); render(); return; }
      case 'mc-add': {
        if (tot >= 30) { toast('Daugiausia 30 sužeistųjų'); return; }
        const prev = st.cur; st.pts.push(def()); st.cur = st.pts.length - 1; undo = []; openOpt = ''; save(st); render(); scrollTo(0, 0);
        if (typeof PT !== 'undefined' && PT.added) PT.added(prev); else toast('Pridėtas #' + st.pts.length); return;
      }
      case 'mc-pdel': {
        if (tot < 2) return;
        const keep = snapKeys(), card = JSON.parse(JSON.stringify(s)), at = st.cur;
        st.pts.splice(st.cur, 1); st.cur = Math.min(st.cur, st.pts.length - 1); undo = []; openOpt = ''; save(st); render(); scrollTo(0, 0);
        toastAct('Sužeistasis ' + n + ' ištrintas', 'Atšaukti', () => {
          const s2 = load(), i = Math.min(at, s2.pts.length); s2.pts.splice(i, 0, card); s2.cur = i; LS.set(KEY, s2);
          if (typeof PT !== 'undefined') PT.sync(); restoreKeys(keep); render(); toast('Atkurta');
        });
        return;
      }
      case 'mc-allclr': if (!confirm('Išvalyti visų ' + plural(tot, ['sužeistojo', 'sužeistųjų', 'sužeistųjų']) + ' korteles?')) return; undo = []; save(fresh()); render(); scrollTo(0, 0); toast('Visos kortelės išvalytos'); return;
      case 'mc-new': {
        const keep = snapKeys(), card = JSON.parse(JSON.stringify(s)), pid = s.pid;
        undo = []; openOpt = ''; st.pts[st.cur] = Object.assign(def(), pid ? { pid } : {});
        Object.keys(keep).forEach(x => { try { localStorage.removeItem(x); } catch (err) {} });
        save(st); render(); scrollTo(0, 0);
        toastAct('Sužeistasis ' + n + ' išvalytas', 'Atšaukti', () => {
          const s2 = load(), i = pid ? s2.pts.findIndex(p => p.pid === pid) : s2.cur; if (i < 0) return;
          s2.pts[i] = card; s2.cur = i; LS.set(KEY, s2); if (typeof PT !== 'undefined') PT.sync(); restoreKeys(keep); render(); toast('Atkurta');
        });
        return;
      }
      // ── kortelė ──
      case 'mc-sex': s.sex = s.sex === k ? '' : k; break;
      case 'mc-now': trSet(s, Date.now() - Math.max(0, +k || 0) * 60000); break;
      case 'mc-time': return shOpen('time', { field: 'trauma' });
      case 'mc-nat': toggle(s.nat, k); break;
      case 'mc-mech': toggle(s.mech, k); break;
      case 'mc-opt': { openOpt = openOpt === k ? '' : (OPTS[k] ? k : ''); const y = scrollY; save(st); render(); scrollTo(0, y); if (openOpt) { const ed = app.querySelector('#mqed'); if (ed && ed.scrollIntoView) ed.scrollIntoView({ block: 'nearest' }); } return; } // be automatinio fokuso – klaviatūra neuždengia „Gerai“
      case 'mc-optv': {
        const v = d.v || '';
        if (k === 'allerg') s.allerg = togTok(s.allerg, v, ['Nėra žinomų']);
        else if (k === 'country') s.country = s.country === v ? '' : v;
        else if (k === 'mechTxt') s.mechTxt = togTok(s.mechTxt, v);
        else if (k === 'sympt') s.sympt = togTok(s.sympt, v);
        else if (k === 'dt') { s.dt = v === 'Vakar' ? yday() : today(); trSync(s); }
        else return;
        break;
      }
      case 'mc-me': { const p = profStr(); if (!p) { openOpt = 'resp1'; break; } s.resp[0] = p; if (!s.unit.trim() && prof().unit.trim()) s.unit = prof().unit.trim(); if (openOpt === 'resp1') openOpt = ''; break; }
      case 'mc-tool': {
        tool = TOOLS.indexOf(k) >= 0 ? k : 'X';
        app.querySelectorAll('.mqtools button').forEach(b => { const on = b.dataset.k === tool; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
        return;
      }
      case 'mc-body': {
        if (!e || (!e.clientX && !e.clientY)) return;
        const p = bodyPoint(el, e);
        if (!p) { toast('Bakstelėkite ant kūno silueto'); return; }
        snap(s); s.mk.push({ t: tool, s: d.s === 'b' ? 'b' : 'f', x: Math.round(p.x * 10) / 10, y: Math.round(p.y * 10) / 10 });
        if (navigator.vibrate) navigator.vibrate(15);
        break;
      }
      case 'mc-mdel': { const i = +k; if (!(i >= 0 && i < s.mk.length)) return; snap(s); s.mk.splice(i, 1); break; }
      case 'mc-undo': { if (!undo.length) return; try { s.mk = JSON.parse(undo.pop()); } catch (err) { return; } break; }
      case 'mc-mclr': if (!s.mk.length) return; snap(s); s.mk = []; toast('Žymės išvalytos – galite atšaukti'); break;
      case 'mc-tqs': return shOpen('tq', { k });
      case 'mc-tq': { if (s.tq[k] && s.tq[k].on) { delete s.tq[k]; tqGone(s); tqSync(s, true); } else { s.tq[k] = { on: true, tm: tqDefault() }; tqSync(s); toast('Turniketas ' + s.tq[k].tm + ' – laiką galite pakeisti'); } break; }
      case 'mc-tx': { if (!txT(k)) return; toggle(s.tx, k); break; }
      case 'mc-rx': return shOpen('rx', { tab: k });
      case 'mc-rdel': {
        const i = +k, r = s.rows[i]; if (!r) return;
        const m = /^vz:(.+)$/.exec(String(r.src || '')); if (m && typeof VZ !== 'undefined' && VZ.remove) VZ.remove(m[1]);
        s.rows.splice(i, 1); toast('Pašalinta: ' + (rowTxt(r) || 'eilutė')); break;
      }
      case 'mc-vz': if (typeof VZ !== 'undefined') { VZ.toMist(); const y = scrollY; render(); scrollTo(0, y); } return;
      case 'mc-ev': s.evac = s.evac === k ? '' : k; break;
      case 'mc-pos': s.pos = s.pos === k ? '' : k; break;
      case 'mc-vit': return shOpen('vit');
      case 'mc-vdel': { const i = +k; if (!(i >= 0 && i < s.vit.length)) return; if (!confirm('Ištrinti ' + s.vit[i].ts + ' matavimą?')) return; s.vit.splice(i, 1); break; }
      // ── perdavimas ──
      case 'mc-lang': { LS.set(OUTLANG, k === 'en' ? 'en' : 'lt'); const y = scrollY; render(); scrollTo(0, y); return; }
      case 'mc-scope': { scope = k === 'all' ? 'all' : 'one'; const y = scrollY; render(); scrollTo(0, y); return; }
      case 'mc-card': return cardShow(s, n, tot);
      case 'mc-copy': return copyText(outText(st, outEn()));
      case 'mc-share': return shareText('MIST', outText(st, outEn()));
      case 'mc-copyall': return copyText(allText(st, outEn()));
      case 'mc-shareall': return shareText('MIST', allText(st, outEn()));
      case 'mc-read': {
        const en = outEn(), L = (c, l, t) => `<span class="rn ${c}">${l}</span>${esc(t)}`, all = allOn(st), txt = outText(st, en);
        const one = (p, i) => { const P = parts(p, i + 1, tot, en); return [L('rM', 'M', P.M), L('rI', 'I', P.I), L('rS', 'S', P.S.join('\n')), L('rT', 'T', P.T)].concat(P.E ? [L('rT', 'E', P.E)] : [], P.A ? [L('rT', 'A', (en ? 'Allergies: ' : 'Alergijos: ') + P.A)] : []); };
        const lines = all ? [].concat(...st.pts.map((p, i) => ['<b>' + esc(parts(p, i + 1, tot, en).hd) + '</b>'].concat(one(p, i))))
          : one(s, st.cur).concat(extra(en).split('\n').filter(x => x.trim()).map(x => esc(x)));
        return readMode(all ? 'MIST – visi sužeistieji (' + tot + ')' : parts(s, n, tot, en).hd, lines, [['Kopijuoti', () => copyText(txt)]]);
      }
      default: return;
    }
    const y = scrollY; save(st); render(); scrollTo(0, y);
  }

  function onInput(t) {
    const d = t.dataset;
    if (d.mcas) { const p = prof(); p[d.mcas] = t.value; LS.set(PK, p); return; }
    const st = load(), s = curOf(st);
    if (d.mc) { s[d.mc] = t.value; if (d.mc === 'dt') trSync(s); }
    else if (d.mcp != null) s.resp[+d.mcp] = t.value;
    else return;
    save(st);
    const o = document.getElementById('mc-out'); if (o) o.textContent = outText(load(), outEn());
    if (d.mc === 'id') { // skirtuko užrašas be perpiešimo
      const b = app.querySelector('.ptabs button.on'); if (!b) return;
      const v = t.value.trim(); let sm = b.querySelector('small');
      if (v) { if (!sm) { sm = document.createElement('small'); b.appendChild(sm); } sm.textContent = v; } else if (sm) sm.remove();
    }
  }

  // GKS skaičiuoklė → dabartinio sužeistojo S skiltis (naujas matavimas arba papildomas paskutinis to paties laiko)
  function addGcs(g) {
    const st = load(), s = curOf(st), last = s.vit[s.vit.length - 1];
    if (last && last.ts === g.ts && !last.gcs) { last.gcs = g.v; last.gcsD = g.d; }
    else s.vit.push({ ts: g.ts, av: '', hr: '', rr: '', bp: '', spo2: '', gcs: g.v, gcsD: g.d, pain: '' });
    save(st);
    return st.pts.length > 1 ? 'sužeistasis ' + (st.cur + 1) : '';
  }
  // Kiti įrankiai (vaistų žymėjimas, šviežias kraujas) → C lentelės eilutės ir pastabos dabartiniam sužeistajam
  function addRows(rows, note) {
    const st = load(), s = curOf(st);
    (rows || []).forEach(r => { if (!r || !ROWG.some(g => g[0] === r.g)) return; const x = { g: r.g, name: str(r.name), dose: str(r.dose), route: str(r.route), time: str(r.time), src: str(r.src) }; const o = x.src ? s.rows.find(y => y.src === x.src) : null; if (o) Object.assign(o, x); else s.rows.push(x); });
    if (note && s.txTxt.indexOf(note) < 0) s.txTxt = [s.txTxt.trim(), note].filter(Boolean).join('; ');
    save(st);
    return st.pts.length > 1 ? st.cur + 1 : 0;
  }
  // Kiti įrankiai (nušalimai) → I dalies patikslinimas (injTxt) dabartiniam sužeistajam; ta pati pastaba nekartojama
  function addInj(note) {
    const st = load(), s = curOf(st), n = str(note).trim();
    if (!n) return 0;
    if (s.injTxt.indexOf(n) < 0) s.injTxt = [s.injTxt.trim(), n].filter(Boolean).join('; ');
    save(st);
    return st.pts.length > 1 ? st.cur + 1 : 0;
  }
  const current = () => { const st = load(); return { n: st.cur + 1, tot: st.pts.length }; };
  const tqName = (k, en) => { const x = TQ.find(q => q[0] === k); return x ? (en ? x[2] : x[1].toLowerCase()) : k; };

  // ── apatiniai langai (SH): įvedimas pasirinkimais ir didele klaviatūra ──
  // vit – požymiai; rx – vaistai | skysčiai ir kraujas; mk – sužalojimas schemoje; tq – turniketas; time – laikas (HH:MM).
  // Langas – dialogas virš puslapio (#mcsh, už #app ribų): fonas neaktyvus (inert), Escape / × / fonas / „Atgal“ uždaro, fokusas grąžinamas.
  // Vaistai: ETC – per vaistų žymėjimą (VZ.add → C lentelės eilutė src 'vz:id', priminimai ir eiga veikia); March – tiesiai į C lentelę.
  const RT = ['IV', 'IO', 'IM', 'IN', 'PO', 'ODT'], UN = ['mg', 'mcg', 'g', 'ml'];
  // Ranka įvedamas vaistas / skystis: platesni vienetai ir būdai; C lentelės grupę pasirenka naudotojas (numatyta – Kita / Skysčiai)
  const RTM = RT.concat(['SC', 'kita']), UNM = UN.concat(['VV']);
  const MGRP = [['an', 'Analgetikai'], ['ab', 'Antibiotikai'], ['ot', 'Kita'], ['fl', 'Skysčiai'], ['bl', 'Kraujo produktai']];
  const known = nm => { nm = String(nm || '').trim().toLowerCase(); return nm ? (E.vaistai || []).find(v => [v.id, v.name, dn(v)].some(x => String(x || '').toLowerCase() === nm)) : null; };
  const BLP = ['Šviežias pilnas kraujas', 'Eritrocitų masė', 'Plazma'], FLP = ['Ringerio laktatas', 'NaCl 0,9 %', 'Hipertoninis NaCl'];
  const VFS = [['rr', 'KD', 'k./min', [8, 12, 16, 20, 24, 30]], ['spo2', 'SpO₂', '%', [88, 90, 92, 94, 96, 98]], ['hr', 'Pulsas', 'k./min', [50, 60, 80, 100, 120, 140, 'nečiuopiamas']],
    ['bp', 'AKS', 'mm Hg', null], ['pain', 'Skausmas', '0–10', null], ['gcs', 'GKS', '3–15', [15, 14, 13, 12, 9, 8, 6, 3]]];
  const BPQ = [[70, 80, 90, 100, 120, 140], [40, 50, 60, 70, 80, 90]];
  const ALGRX = { 'Penicilinas': /amoksi|penicil|ampicil|klav/i, 'Cefalosporinai': /cef/i, 'NVNU': /meloks|ibupro|diklof|ketorol|naprok|nvnu/i };
  const QDF = () => (typeof VZ !== 'undefined' && VZ.QD) || TCFG.qd || {};
  const okDrug = v => { const h = TCFG.hub || {}; if (typeof h.drugOk === 'function') { try { return !!h.drugOk(v); } catch (e) {} } return true; };
  const grpOf = v => v.id === 'nacl-hipert' ? 'fl' : v.grupe === 'skausmas' ? 'an' : v.grupe === 'antibiotikai' ? 'ab' : 'ot';
  const dn = v => v.id === 'txa' ? 'TXA' : String(v.name || v.id).replace(/ \(.*\)$/, '');
  const offTm = m => hm(Date.now() - m * 60000);
  const tsOf = t => (typeof PT !== 'undefined' && PT.hmTs ? PT.hmTs(t) : 0) || Date.now();
  let SH = null, shEl = null, shPrev = null, shInert = [], skipPop = false;
  function algHit(s, v) {
    const a = toks(s.allerg).filter(t => t !== 'Nėra žinomų'); if (!a.length || !v) return '';
    const nm = [v.name, v.id, v.klase].join(' ');
    return a.filter(t => ALGRX[t] ? ALGRX[t].test(nm) : (t.length > 3 && nm.toLowerCase().indexOf(t.toLowerCase()) >= 0)).join(', ');
  }
  function lastGiven(s, v) { // paskutinis to vaisto laikas (C lentelė ir vaistų žymėjimas)
    let t = '';
    s.rows.forEach(r => { if (r.name && (r.name === dn(v) || String(r.name).toLowerCase().indexOf(dn(v).toLowerCase()) === 0) && r.time && r.time > t) t = r.time; });
    if (typeof VZ !== 'undefined') VZ.get().e.forEach(e => { if (e.v === v.id) { const x = hm(e.t); if (x > t) t = x; } });
    return t;
  }
  // ── atidarymas / uždarymas ──
  // Lango būsena (SH) pagal rūšį; o.drug – iškart pasirinktas vaistas (priminimai, vaistų sąrašas); o.field – laikas: trauma | turn
  function mkSH(kind, o) {
    o = o || {};
    const s = curOf(load()), T = timers();
    const base = { kind, toff: 0, tcust: '', sub: null };
    if (kind === 'vit') SH = Object.assign(base, { v: { av: '', rr: '', spo2: '', hr: '', bpS: '', bpD: '', pain: '', gcs: '' }, fk: 'rr', bpd: 0, gcs: 0 });
    else if (kind === 'rx') {
      SH = Object.assign(base, { tab: o.tab === 'fl' && flOk() ? 'fl' : 'rx', drug: o.drug && (E.vaistai || []).some(v => v.id === o.drug) ? o.drug : '', dose: null, man: null, fl: { name: '', amt: '', r: 'IV' } });
      const q = SH.drug ? QDF()[SH.drug] || [] : []; if (q.length === 1) SH.dose = { i: 0, r: q[0][0], a: q[0][1], u: q[0][2] };
    } else if (kind === 'mk') SH = Object.assign(base, { t: TOOLS.indexOf(o.t) >= 0 ? o.t : tool, sd: o.sd === 'b' ? 'b' : 'f', pt: null, n: 0 });
    else if (kind === 'tq') {
      SH = Object.assign(base, { k: TQ.some(q => q[0] === o.k) ? o.k : '' });
      const q = SH.k && s.tq[SH.k]; if (q && q.on && q.tm) { SH.toff = 'c'; SH.tcust = q.tm; } else if (T.turn) { SH.toff = 'c'; SH.tcust = hm(T.turn); }
    } else if (kind === 'time') {
      const f = o.field === 'turn' ? 'turn' : 'trauma';
      SH = Object.assign(base, { field: f, buf: '', cur: f === 'turn' ? (+T.turn ? hm(+T.turn) : '') : s.t0 || (+T.trauma ? hm(+T.trauma) : '') });
    } else { SH = null; return false; }
    return true;
  }
  // Perjungti langą neuždarant (pvz. turniketo laikas → galūnės)
  const shSwap = (kind, o) => { if (mkSH(kind, o)) { SH.top = 1; shRender(true); } };
  function shOpen(kind, o) {
    o = o || {};
    if (!mkSH(kind, o)) return;
    if (!shEl) {
      shEl = document.createElement('div'); shEl.id = 'mcsh';
      shEl.addEventListener('click', e => { const el = e.target.closest('[data-sa]'); if (el && shEl.contains(el)) shAct(el, e); });
      shEl.addEventListener('input', e => {
        const t = e.target, k = SH && t.dataset ? t.dataset.si : ''; if (!k) return;
        if (k === 'note') SH.note = t.value;
        else if (k === 'mname' && SH.man) { SH.man.name = t.value; footUpd(); }
        else if (k === 'fname' && SH.fl) { SH.fl.name = t.value; footUpd(); }
      });
      document.body.appendChild(shEl);
    }
    shPrev = document.activeElement;
    try {
      if (o.replace && history.state && history.state.hb) history.replaceState(Object.assign({}, history.state, { hb: 0, mcs: 1 }), '');
      else history.pushState(Object.assign({}, history.state, { mcs: 1 }), '');
    } catch (e) {}
    shRender(true);
  }
  function inertOn() {
    [document.querySelector('body > header'), app, document.getElementById('nav'), document.getElementById('glback')].forEach(e => {
      if (e && !e.hasAttribute('inert')) { e.setAttribute('inert', ''); shInert.push(e); }
    });
  }
  function shClose(viaPop) {
    if (!SH) return;
    SH = null; if (shEl) shEl.innerHTML = '';
    document.documentElement.classList.remove('mqopen');
    shInert.forEach(e => e.removeAttribute('inert')); shInert = [];
    if (!viaPop && history.state && history.state.mcs) { skipPop = true; try { history.back(); } catch (e) { skipPop = false; } }
    const p = shPrev; shPrev = null;
    if (p && p.isConnected && p.focus) { try { p.focus({ preventScroll: true }); } catch (e) {} }
  }
  addEventListener('popstate', e => { if (skipPop) { skipPop = false; return; } if (SH && !(e.state && e.state.mcs)) shClose(true); });
  addEventListener('hashchange', () => { if (SH) shClose(true); });
  addEventListener('keydown', e => { if (SH && e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); if (SH.sub) { SH.sub = null; shRender(); } else shClose(false); } }, true);
  // Įrašyti į kortelę ir atnaujinti puslapį po langu
  function commit(fn, msg, keepOpen) {
    const st = load(), s = curOf(st); if (fn(s, st) === false) return false;
    save(st);
    if (!keepOpen) shClose(false);
    const y = scrollY; render(); scrollTo(0, y);
    if (keepOpen && SH) { inertOn(); shRender(); }
    if (msg) toast(msg);
    return true;
  }
  // ── piešimas ──
  const tmRow = (extra) => '<div class="mqrow mqtm">' + (extra || '') + [[0, 'Dabar ' + offTm(0)], [5, '−5 min'], [10, '−10 min']].map(([m, l]) => `<button class="mqc${SH.toff === m ? ' on' : ''}" data-sa="toff" data-v="${m}" aria-pressed="${SH.toff === m}">${l}</button>`).join('') +
    `<button class="mqc${SH.toff === 'c' ? ' on' : ''}" data-sa="tcust" aria-pressed="${SH.toff === 'c'}">${SH.toff === 'c' && SH.tcust ? esc(SH.tcust) : 'Kitas…'}</button></div>`;
  const noteIn = () => `<label class="mqf">Pastaba (nebūtina)<input class="inp" data-si="note" data-dict value="${esc(SH.note || '')}" placeholder="Įrašykite arba padiktuokite" autocomplete="off"></label>`;
  const shT = () => SH.toff === 'c' && HM_RE.test(SH.tcust || '') ? SH.tcust : offTm(+SH.toff || 0);
  const KP = (sa, dec) => '<div class="mqkp" role="group" aria-label="Skaičių klaviatūra">' + ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => `<button data-sa="${sa}" data-v="${d}">${d}</button>`).join('') +
    (dec ? `<button data-sa="${sa}" data-v=",">,</button>` : `<button data-sa="${sa}" data-v="del" aria-label="Ištrinti">⌫</button>`) + `<button data-sa="${sa}" data-v="0">0</button>` +
    (dec ? `<button data-sa="${sa}" data-v="del" aria-label="Ištrinti">⌫</button>` : `<button data-sa="${sa}" data-v="next" class="nx">Toliau ›</button>`) + '</div>';
  function shBody() {
    const st = load(), s = curOf(st), T = timers();
    if (SH.sub) return subBody(s);
    switch (SH.kind) {
      case 'vit': {
        const V = SH.v, f = VFS.find(x => x[0] === SH.fk) || VFS[0], P0 = s.vit[s.vit.length - 1] || null;
        const shown = k => k === 'bp' ? (V.bpS ? V.bpS + (V.bpD ? '/' + V.bpD : '/') : '—') : (V[k] !== '' ? V[k] : '—');
        const prev = k => { const x = P0 ? P0[k] : ''; return x === '' || x == null ? '' : String(x) + (k === 'spo2' ? ' %' : ''); };
        const VS = VFS.filter(([k]) => k !== 'gcs' || gcsOn()); // GKS – nebūtinas: rodomas paspaudus „+ GKS“
        let h = `<div class="mqrow mqtm"><b class="mqst">S – naujas matavimas</b></div>` + tmRow() +
          '<div class="mqavpu" role="radiogroup" aria-label="Sąmonė (AVPU)">' + AVPU.map(([k, t]) => `<button role="radio" aria-checked="${V.av === k}" class="${V.av === k ? 'on' : ''}" data-sa="av" data-v="${k}"><b>${k}</b><small>${t}</small>${P0 && P0.av === k ? '<small class="mqpv">anksčiau</small>' : ''}</button>`).join('') + '</div>' +
          `<div class="mqvf n${VS.length}" role="tablist" aria-label="Požymis">` + VS.map(([k, lb]) => `<button role="tab" aria-selected="${SH.fk === k}" class="${SH.fk === k ? 'on' : ''}${abn(k, k === 'bp' ? V.bpS : V[k]) ? ' ab' : ''}" data-sa="fk" data-v="${k}"><span>${lb}</span><b>${esc(shown(k))}</b>${prev(k) ? `<small class="mqpv">anksčiau ${esc(prev(k))}</small>` : ''}</button>`).join('') + '</div>' +
          (gcsOn() ? '' : '<div class="mqrow"><button class="mqc sm" data-sa="gcson">+ GKS <small>nebūtina</small></button></div>');
        if (f[0] === 'bp') {
          h += `<div class="mqdisp"><button class="mqbp${SH.bpd ? '' : ' cur'}" data-sa="bpd" data-v="0" aria-label="Sistolinis">${esc(V.bpS || '—')}</button><span>/</span><button class="mqbp${SH.bpd ? ' cur' : ''}" data-sa="bpd" data-v="1" aria-label="Diastolinis">${esc(V.bpD || '—')}</button><small>mm Hg · ${SH.bpd ? 'diastolinis' : 'sistolinis'}</small></div>` +
            '<div class="mqrow mqqv" aria-label="Greitos reikšmės">' + BPQ[SH.bpd].map(q => `<button class="mqc" data-sa="qv" data-v="${q}">${q}</button>`).join('') + (SH.bpd ? '<button class="mqc" data-sa="qv" data-v="-">Tik sistolinis</button>' : '') + '</div>' + KP('kp');
        } else if (f[0] === 'pain') {
          h += `<div class="mqdisp"><b class="cur">${esc(V.pain !== '' ? V.pain : '—')}</b><small>skausmas 0–10</small></div>` +
            '<div class="mqpain" role="radiogroup" aria-label="Skausmo skalė">' + Array.from({ length: 11 }, (_, i) => `<button role="radio" aria-checked="${V.pain === String(i)}" class="${V.pain === String(i) ? 'on' : ''}" data-sa="qv" data-v="${i}">${i}</button>`).join('') + '</div>' +
            '<div class="mqrow"><button class="mqc" data-sa="kp" data-v="next">Toliau ›</button></div>';
        } else {
          h += `<div class="mqdisp"><b class="cur${abn(f[0], V[f[0]]) ? ' ab' : ''}">${esc(V[f[0]] !== '' ? V[f[0]] : '—')}</b><small>${f[2]}${f[0] === 'gcs' ? ' · nebūtina' : ''}</small></div>` +
            '<div class="mqrow mqqv" aria-label="Greitos reikšmės">' + f[3].map(q => `<button class="mqc${String(V[f[0]]) === String(q) ? ' on' : ''}" data-sa="qv" data-v="${q}">${q === 'nečiuopiamas' ? 'Nečiuopiamas' : q}</button>`).join('') + '</div>' + KP('kp');
        }
        const any = V.av || VFS.some(([k]) => k === 'bp' ? V.bpS : V[k] !== '');
        return { title: 'Požymiai', h, foot: `<button class="btn pri mqsave" data-sa="save"${any ? '' : ' disabled'}>Įrašyti ${shT()} matavimą</button>` };
      }
      case 'rx': {
        if (SH.tab === 'fl' && !flOk()) SH.tab = 'rx';
        let h = '<div class="mqseg" role="tablist" aria-label="Kas">' + [['rx', 'Vaistai']].concat(flOk() ? [['fl', 'Skysčiai ir kraujas' + (lvOn() ? lvSm('CMC') : '')]] : []).map(([k, l]) => `<button role="tab" aria-selected="${SH.tab === k}" class="${SH.tab === k ? 'on' : ''}" data-sa="tab" data-v="${k}">${l}</button>`).join('') + '</div>';
        const alg = toks(s.allerg).filter(t => t !== 'Nėra žinomų');
        if (SH.tab === 'rx') {
          const D = (E.vaistai || []).filter(okDrug), G = (E.vaistuGrupes || []).concat([{ id: '', pav: 'Kita' }]);
          G.forEach(g => {
            const ds = D.filter(v => g.id ? v.grupe === g.id : !(E.vaistuGrupes || []).some(x => x.id === v.grupe)); if (!ds.length) return;
            h += `<div class="mqlab">${esc(g.pav)}</div><div class="mqrow">` + ds.map(v => { const lg = lastGiven(s, v), ah = algHit(s, v);
              return `<button class="mqc${SH.drug === v.id ? ' on' : ''}${ah ? ' warn' : ''}" data-sa="drug" data-v="${esc(v.id)}" aria-pressed="${SH.drug === v.id}">${esc(dn(v))}${lvOn() ? lvSm(v.lygis) : ''}${lg ? ` <small>✓ ${esc(lg)}</small>` : ''}${ah ? ' <small>alergija!</small>' : ''}</button>`; }).join('') + '</div>';
          });
          h += `<div class="mqrow"><button class="mqc${SH.man ? ' on' : ''}" data-sa="man" aria-pressed="${!!SH.man}">+ Kitas vaistas (įvesti ranka)</button></div>`;
          if (SH.man) { // ranka: pavadinimas (su pasiūlymais), dozė, būdas, C lentelės grupė, laikas, pastaba
            const M = SH.man, D = M.dose, ah = algHit(s, known(M.name) || { name: M.name, id: '', klase: '' });
            h += '<div class="mqpan" id="mqpan"><div class="mqph"><b>Kitas vaistas</b><small>įvedama ranka</small></div>' +
              `<label class="mqf">Pavadinimas<input class="inp" data-si="mname" data-dict list="mqdl" value="${esc(M.name)}" placeholder="pvz. Diazepamas" autocomplete="off"></label>` +
              '<datalist id="mqdl">' + (E.vaistai || []).map(x => `<option value="${esc(dn(x))}">`).join('') + '</datalist>' +
              (ah ? `<p class="mqwarn" role="alert">Pažymėta alergija: ${esc(ah)} – patikrinkite prieš skiriant.</p>` : '') +
              `<div class="mqlab">Dozė ir būdas</div><div class="mqrow"><button class="mqc${D ? ' on' : ''}" data-sa="mdose">${D ? esc([D.a, D.u, D.r].filter(Boolean).join(' ')) + ' ✎' : 'Įvesti dozę…'}</button></div>` +
              '<div class="mqlab">C lentelėje</div><div class="mqrow">' + MGRP.map(([k, l]) => `<button class="mqc sm${M.g === k ? ' on' : ''}" data-sa="mgrp" data-v="${k}" aria-pressed="${M.g === k}">${l}</button>`).join('') + '</div>' +
              '<div class="mqlab">Laikas</div>' + tmRow() + noteIn() + '</div>';
          }
          const v = !SH.man && SH.drug && (E.vaistai || []).find(x => x.id === SH.drug);
          let foot = SH.man ? manFoot() : '<button class="btn pri mqsave" disabled>Pasirinkite vaistą ir dozę</button>';
          if (v) {
            const q = QDF()[v.id] || [], ah = algHit(s, v), lg = lastGiven(s, v), gn = (ROWG.find(x => x[0] === grpOf(v)) || ['', ''])[1].replace(/ \(.*\)$/, '').toLowerCase();
            h += `<div class="mqpan" id="mqpan"><div class="mqph"><b>${esc(dn(v))}</b><small>C lentelė: ${esc(gn)}</small></div>` +
              (ah ? `<p class="mqwarn" role="alert">Pažymėta alergija: ${esc(ah)} – patikrinkite prieš skiriant.</p>` : alg.length ? `<p class="muted mqhint">Alergijos: ${esc(alg.join(', '))}</p>` : '') +
              (lg ? `<p class="muted mqhint">Paskutinė dozė šiam sužeistajam: ${esc(lg)}</p>` : '') +
              (q.length ? '<div class="mqlab">Dozė ir būdas (iš gido)</div><div class="mqrow">' + q.map(([r, a, u], i) => { const on = SH.dose && !SH.dose.c && SH.dose.i === i; return `<button class="mqc big${on ? ' on' : ''}" data-sa="qd" data-v="${i}" aria-pressed="${!!on}"><b>${esc(a)} ${esc(u)}</b><small>${esc(r)}</small></button>`; }).join('') + '</div>' : '<p class="muted mqhint">Greitųjų dozių gide nėra – įveskite dozę.</p>') +
              `<div class="mqrow"><button class="mqc${SH.dose && SH.dose.c ? ' on' : ''}" data-sa="cdose">${SH.dose && SH.dose.c ? esc(SH.dose.a + ' ' + SH.dose.u + ' ' + SH.dose.r) + ' ✎' : 'Kita dozė / būdas…'}</button><a class="mqc" href="#/vaistas/${esc(v.id)}">Dozės gide ›</a></div>` +
              '<div class="mqlab">Laikas</div>' + tmRow() + noteIn() + '</div>';
            if (SH.dose) foot = `<button class="btn pri mqsave" data-sa="save">Įrašyti: ${esc(dn(v) + ' ' + SH.dose.a + ' ' + SH.dose.u + ' ' + SH.dose.r)} · ${shT()}</button>`;
          }
          return { title: 'Vaistas', h, foot };
        }
        // skysčiai ir kraujas
        const w = typeof KR !== 'undefined' ? LS.get(TCFG.pre + 'wbb', null) : null;
        if (w && typeof w === 'object' && (w.t2 || w.don || w.donG) && !s.rows.some(r => r.src === 'kr'))
          h += `<button class="mqsug" data-sa="kr"><span><b>Šviežias pilnas kraujas</b><small>iš kraujo banko įrašo${w.don || w.donG ? ': donoras ' + esc([w.don, w.donG].filter(Boolean).join(' ')) : ''}${w.t2 ? ' · ' + hm(+w.t2) : ''}</small></span><b>Įrašyti ›</b></button>`;
        const F = SH.fl, isB = BLP.indexOf(F.name) >= 0, amts = F.man ? ['250 ml', '500 ml', '1000 ml', '1 vnt.'] : !F.name ? [] : isB ? ['1 vnt.', '2 vnt.'] : F.name === 'Hipertoninis NaCl' ? ['250 ml'] : ['250 ml', '500 ml', '1000 ml'];
        h += '<div class="mqlab">Kraujo produktai</div><div class="mqrow">' + BLP.map(p => `<button class="mqc${!F.man && F.name === p ? ' on' : ''}" data-sa="flp" data-v="${esc(p)}" aria-pressed="${!F.man && F.name === p}">${esc(p)}</button>`).join('') + '</div>' +
          '<div class="mqlab">Skysčiai</div><div class="mqrow">' + FLP.map(p => `<button class="mqc${!F.man && F.name === p ? ' on' : ''}" data-sa="flp" data-v="${esc(p)}" aria-pressed="${!F.man && F.name === p}">${esc(p)}</button>`).join('') + '</div>' +
          `<div class="mqrow"><button class="mqc${F.man ? ' on' : ''}" data-sa="flman" aria-pressed="${!!F.man}">+ Kitas skystis (įvesti ranka)</button></div>`;
        if (F.man) h += '<div class="mqpan"><label class="mqf">Pavadinimas' + `<input class="inp" data-si="fname" data-dict list="mqfl" value="${esc(F.name)}" placeholder="pvz. Plasma-Lyte" autocomplete="off"></label>` +
          '<datalist id="mqfl">' + BLP.concat(FLP).map(x => `<option value="${esc(x)}">`).join('') + '</datalist>' +
          '<div class="mqlab">C lentelėje</div><div class="mqrow">' + MGRP.slice(3).map(([k, l]) => `<button class="mqc sm${(F.g || 'fl') === k ? ' on' : ''}" data-sa="flg" data-v="${k}" aria-pressed="${(F.g || 'fl') === k}">${l}</button>`).join('') + '</div></div>';
        if (F.name || F.man) h += '<div class="mqpan"><div class="mqlab">Kiekis</div><div class="mqrow">' + amts.map(a => `<button class="mqc${F.amt === a ? ' on' : ''}" data-sa="fla" data-v="${esc(a)}" aria-pressed="${F.amt === a}">${esc(a)}</button>`).join('') +
          `<button class="mqc${F.amt && amts.indexOf(F.amt) < 0 ? ' on' : ''}" data-sa="flc">${F.amt && amts.indexOf(F.amt) < 0 ? esc(F.amt) + ' ✎' : 'Kita…'}</button></div>` +
          '<div class="mqlab">Būdas</div><div class="mqrow">' + ['IV', 'IO'].map(r => `<button class="mqc${F.r === r ? ' on' : ''}" data-sa="flr" data-v="${r}" aria-pressed="${F.r === r}">${r}</button>`).join('') + '</div>' +
          '<div class="mqlab">Laikas</div>' + tmRow() + noteIn() + '</div>';
        return { title: 'Skystis ar kraujas', h, foot: flFoot() };
      }
      case 'mk': {
        const pt = SH.pt, r = pt ? region(SH.sd, pt.x, pt.y) : null, limb = r && r.o >= 6 && r.o <= 9 ? ['ra', 'la', 'rl', 'll'][r.o - 6] : '';
        const marks = s.mk.filter(m => m.s === SH.sd).map(m => { const c = MKC[m.t] || MKC.X; return `<g transform="translate(${m.x} ${m.y})" opacity=".55"><circle r="8" fill="${c[0]}"/><text y="3.6" fill="${c[1]}" class="mqst2">${esc(mkT(m.t)[1])}</text></g>`; }).join('');
        const pv = pt ? (() => { const c = MKC[SH.t] || MKC.X; return `<g transform="translate(${pt.x} ${pt.y})"><circle r="10" fill="none" stroke="#FAC775" stroke-width="2"/><circle r="8" fill="${c[0]}"/><text y="3.6" fill="${c[1]}" class="mqst2">${esc(mkT(SH.t)[1])}</text></g>`; })() : '';
        const lab2 = SH.sd === 'f' ? ['D', 'K'] : ['K', 'D'];
        let h = '<div class="mqtools" role="radiogroup" aria-label="Sutartinis ženklas">' + TOOLS.map(k => `<button class="${SH.t === k ? 'on' : ''}" role="radio" aria-checked="${SH.t === k}" data-sa="mkt" data-v="${k}" aria-label="${esc(mkT(k)[2])}">${badge(k)}<span>${esc(TSH[k] || mkT(k)[2])}</span></button>`).join('') + '</div>' +
          '<div class="mqseg" role="tablist" aria-label="Pusė">' + [['f', 'Priekis'], ['b', 'Nugara']].map(([k, l]) => `<button role="tab" aria-selected="${SH.sd === k}" class="${SH.sd === k ? 'on' : ''}" data-sa="mks" data-v="${k}">${l}</button>`).join('') + '</div>' +
          `<div class="mqbody"><svg viewBox="0 0 120 250" data-sa="mkbody" role="img" aria-label="Kūnas – ${SH.sd === 'f' ? 'priekis' : 'nugara'}. Bakstelėkite sužalojimo vietą."><g class="bo">${SHAPES}</g><g class="bf">${SHAPES}</g>` +
          (SH.sd === 'b' ? '<path class="bsp" d="M60 47V130"/>' : '') + `<text class="blr" x="9" y="14">${lab2[0]}</text><text class="blr" x="111" y="14">${lab2[1]}</text>` + marks + pv + '</svg></div>' +
          (r ? `<div class="mqrow mqreg"><b>${esc(r.t)} · ${esc(mkT(SH.t)[2].toLowerCase())}</b>${limb ? `<button class="mqc${s.tq[limb] && s.tq[limb].on ? ' on tq' : ''}" data-sa="mktq" data-v="${limb}">${s.tq[limb] && s.tq[limb].on ? 'Turniketas · ' + esc(s.tq[limb].tm || '') : '+ Turniketas čia'}</button>` : ''}</div>` : '<p class="muted mqhint">Bakstelėkite sužalojimo vietą schemoje.</p>') +
          (SH.n ? `<p class="muted mqhint">Pridėta žymių: ${SH.n}</p>` : '');
        return { title: 'Sužalojimas', h, foot: `<div class="mqg2"><button class="btn mqsave" data-sa="save" data-v="more"${pt ? '' : ' disabled'}>Pridėti ir dar vieną</button><button class="btn pri mqsave" data-sa="save"${pt ? '' : ' disabled'}>Pridėti</button></div>` };
      }
      case 'tq': {
        const k = SH.k, q = k && s.tq[k];
        let h = '<div class="mqtq4">' + TQ.map(([kk, lt]) => { const x = s.tq[kk]; return `<button class="mqc${kk === k ? ' sel' : ''}${x && x.on ? ' on tq' : ''}" data-sa="tqk" data-v="${kk}" aria-pressed="${kk === k}">${esc(lt)}${x && x.on ? ' · ' + esc(x.tm || '—') : ''}</button>`; }).join('') + '</div>' +
          `<div class="mqrow"><button class="mqc${s.tx.indexOf('tqj') >= 0 ? ' on' : ''}" data-sa="tqj" aria-pressed="${s.tx.indexOf('tqj') >= 0}">Jungties turniketas</button></div>`;
        if (k) h += `<div class="mqpan"><div class="mqlab">${esc(tqName(k).replace(/^./, c => c.toUpperCase()))} – uždėjimo laikas</div>` + tmRow(T.turn ? `<button class="mqc${SH.toff === 'c' && SH.tcust === hm(T.turn) ? ' on' : ''}" data-sa="tmr">⏱ ${hm(T.turn)} · pirmasis</button>` : '') +
          (q && q.on ? '<div class="mqrow"><button class="btn sm dng" data-sa="tqoff">Nuimti turniketą</button></div>' : '') + '</div>';
        else h += '<p class="muted mqhint">Pasirinkite galūnę.</p>';
        return { title: 'Turniketas', h, foot: `<button class="btn pri mqsave" data-sa="save"${k ? '' : ' disabled'}>${k ? 'Įrašyti: ' + esc(TQ.find(x => x[0] === k)[1]) + ' · ' + shT() : 'Pasirinkite galūnę'}</button>` };
      }
      case 'time': {
        const b = timeBody(SH), tq = SH.field === 'turn';
        const h = (SH.cur ? `<p class="muted mqhint">Dabar nustatyta: <b>${esc(SH.cur)}</b> – įveskite naują arba išvalykite.</p>` : '') + b.h +
          (tq ? '<p class="muted mqhint">Turniketų ribos (2 val.) skaičiuojamos nuo pirmojo uždėjimo.</p><div class="mqrow"><button class="mqc" data-sa="totq">Turniketų galūnės ›</button></div>' : '');
        return { title: tq ? 'Turniketo uždėjimo laikas' : 'Traumos laikas', h, foot: SH.cur ? '<div class="mqg2"><button class="btn mqsave" data-sa="tclr">Išvalyti</button>' + b.foot + '</div>' : b.foot };
      }
    }
    return { title: '', h: '', foot: '' };
  }
  // Įrašymo mygtukai (atnaujinami ir rašant pavadinimą – be viso lango perpiešimo)
  function manFoot() {
    const M = SH.man, nm = String(M.name || '').trim(), D = M.dose;
    return `<button class="btn pri mqsave" data-sa="save"${nm ? '' : ' disabled'}>${nm ? 'Įrašyti: ' + esc([nm, D ? D.a + ' ' + D.u : '', D ? D.r : ''].filter(Boolean).join(' ')) + ' · ' + shT() : 'Įveskite vaisto pavadinimą'}</button>`;
  }
  function flFoot() {
    const F = SH.fl, ok2 = String(F.name || '').trim() && F.amt;
    return `<button class="btn pri mqsave" data-sa="save"${ok2 ? '' : ' disabled'}>${ok2 ? 'Įrašyti: ' + esc(String(F.name).trim() + ' ' + F.amt + ' ' + F.r) + ' · ' + shT() : 'Pasirinkite produktą ir kiekį'}</button>`;
  }
  function footUpd() { const f = shEl && shEl.querySelector('.mqshf'); if (f && SH && SH.kind === 'rx') f.innerHTML = SH.tab === 'fl' ? flFoot() : SH.man ? manFoot() : f.innerHTML; }
  function timeBody(o) {
    const b = o.buf || '', d = (b + '____').slice(0, 4), shown = d.slice(0, 2) + ':' + d.slice(2);
    const val = b.length === 4 ? b.slice(0, 2) + ':' + b.slice(2) : '', ok2 = HM_RE.test(val);
    const h = `<div class="mqdisp"><b class="cur${b.length === 4 && !ok2 ? ' ab' : ''}">${shown.replace(/_/g, '–')}</b><small>valandos : minutės</small></div>` +
      '<div class="mqrow mqqv">' + [[0, 'Dabar'], [5, '−5 min'], [10, '−10 min'], [15, '−15 min'], [30, '−30 min']].map(([m, l]) => `<button class="mqc" data-sa="tset" data-v="${m}">${l}</button>`).join('') + '</div>' +
      '<div class="mqkp" role="group" aria-label="Skaičių klaviatūra">' + ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(x => `<button data-sa="tkp" data-v="${x}">${x}</button>`).join('') +
      '<button data-sa="tkp" data-v="clr" aria-label="Išvalyti">C</button><button data-sa="tkp" data-v="0">0</button><button data-sa="tkp" data-v="del" aria-label="Ištrinti">⌫</button></div>';
    return { h, foot: `<button class="btn pri mqsave" data-sa="tok"${ok2 ? '' : ' disabled'}>${ok2 ? 'Gerai · ' + val : 'Įveskite laiką'}</button>` };
  }
  function subBody(s) {
    const o = SH.sub;
    if (o.kind === 'time') { const b = timeBody(o); return { title: 'Laikas', h: b.h, foot: b.foot, back: 1 }; }
    // kita dozė / kiekis
    const rx = o.ctx === 'rx' || o.ctx === 'man', units = o.ctx === 'man' ? UNM : rx ? UN : ['ml', 'vnt.'], routes = o.ctx === 'man' ? RTM : RT;
    const h = `<div class="mqdisp"><b class="cur">${esc(o.buf || '—')}</b><small>${esc(o.unit)}${rx ? ' · ' + esc(o.route) : ''}</small></div>` +
      '<div class="mqlab">Vienetai</div><div class="mqrow">' + units.map(u => `<button class="mqc${o.unit === u ? ' on' : ''}" data-sa="nu" data-v="${u}" aria-pressed="${o.unit === u}">${u}</button>`).join('') + '</div>' +
      (rx ? '<div class="mqlab">Būdas</div><div class="mqrow">' + routes.map(r => `<button class="mqc${o.route === r ? ' on' : ''}" data-sa="nr" data-v="${r}" aria-pressed="${o.route === r}">${r}</button>`).join('') + '</div>' : '') +
      KP('nkp', true);
    const ok2 = /^\d+(,\d+)?$/.test(o.buf || '') && parseFloat(String(o.buf).replace(',', '.')) > 0;
    return { title: rx ? 'Kita dozė' : 'Kitas kiekis', h, foot: `<button class="btn pri mqsave" data-sa="nok"${ok2 ? '' : ' disabled'}>${ok2 ? 'Gerai · ' + esc(o.buf + ' ' + o.unit + (rx ? ' ' + o.route : '')) : 'Įveskite skaičių'}</button>`, back: 1 };
  }
  function shRender(first) {
    if (!SH || !shEl) return;
    const a = document.activeElement, key = a && shEl.contains(a) && a.dataset ? [a.dataset.sa, a.dataset.v].join('|') : '';
    const sb = shEl.querySelector('.mqshb'), y = sb ? sb.scrollTop : 0;
    const B = shBody();
    shEl.innerHTML = '<div class="mqbg" data-sa="close" aria-hidden="true"></div>' +
      `<section class="mqsh" role="dialog" aria-modal="true" aria-labelledby="mqsht" tabindex="-1">` +
      `<div class="mqshh">${B.back ? '<button class="x" data-sa="subback" aria-label="Atgal">‹</button>' : ''}<b id="mqsht">${esc(B.title)}</b><button class="x" data-sa="close" aria-label="Uždaryti">×</button></div>` +
      `<div class="mqshb">${B.h}</div><div class="mqshf">${B.foot}</div></section>`;
    document.documentElement.classList.add('mqopen');
    inertOn();
    try { if (typeof DICT !== 'undefined') DICT.enhance(shEl); } catch (e) {}
    const nb = shEl.querySelector('.mqshb'); if (nb && !first && !SH.top) nb.scrollTop = y; SH.top = 0;
    let f = null;
    if (key) f = Array.from(shEl.querySelectorAll('[data-sa]')).find(x => [x.dataset.sa, x.dataset.v].join('|') === key && !x.disabled);
    if (!f) f = shEl.querySelector('.mqsh');
    try { f.focus({ preventScroll: true }); } catch (e) {}
    if (first && SH.kind === 'rx' && SH.drug) { const p = shEl.querySelector('#mqpan'); if (p && p.scrollIntoView) p.scrollIntoView({ block: 'nearest' }); }
  }
  // ── veiksmai lange ──
  function vitNext() {
    const V = SH.v;
    if (SH.fk === 'bp' && !SH.bpd && V.bpS) { SH.bpd = 1; return; }
    const i = VFS.findIndex(x => x[0] === SH.fk); SH.bpd = 0;
    if (i < VFS.length - 1 && !(VFS[i + 1][0] === 'gcs' && !gcsOn())) SH.fk = VFS[i + 1][0];
    else setTimeout(() => { const b = shEl && shEl.querySelector('.mqsave'); if (b) b.focus(); }, 0); // po perpiešimo – naujas mygtukas
  }
  const gcsOn = () => !!(SH && SH.v && (SH.gcs || SH.v.gcs !== '' || SH.fk === 'gcs'));
  function shAct(el, e) {
    const d = el.dataset, v = d.v;
    switch (d.sa) {
      case 'close': return shClose(false);
      case 'subback': SH.sub = null; return shRender();
      case 'toff': SH.toff = +v || 0; return shRender();
      case 'tcust': SH.sub = { kind: 'time', buf: (SH.tcust || '').replace(':', '') }; SH.top = 1; return shRender();
      case 'tmr': { const T = timers(); if (T.turn) { SH.toff = 'c'; SH.tcust = hm(T.turn); } return shRender(); }
      // laikas (atskiras langas arba poskyris)
      case 'tset': { const o = SH.sub || SH; o.buf = offTm(+v || 0).replace(':', ''); return shRender(); }
      case 'tkp': { const o = SH.sub || SH; if (v === 'del') o.buf = (o.buf || '').slice(0, -1); else if (v === 'clr') o.buf = ''; else if ((o.buf || '').length < 4) o.buf = (o.buf || '') + v; return shRender(); }
      case 'tok': {
        const o = SH.sub || SH, b = o.buf || '', t = b.slice(0, 2) + ':' + b.slice(2);
        if (!HM_RE.test(t)) { toast('Laikas: pvz. 14:05'); return; }
        if (SH.sub) { SH.tcust = t; SH.toff = 'c'; SH.sub = null; return shRender(); }
        if (SH.field === 'turn') return commit(s => { const T = timers(), old = +T.turn ? hm(+T.turn) : ''; T.turn = tsOf(t); LS.set(TCFG.laikai, T); TQ.forEach(([q]) => { const x = s.tq[q]; if (x && x.on && old && x.tm === old) x.tm = t; }); }, 'Turniketo laikas ' + t);
        return commit(s => { trSet(s, (s.dt && s.dt !== today() && s.dt !== yday() ? tsDT(s.dt, t) : 0) || tsOf(t)); }, 'Traumos laikas ' + t);
      }
      case 'tclr': {
        if (SH.field === 'turn') {
          const s = curOf(load()); if (TQ.some(([q]) => s.tq[q] && s.tq[q].on)) { toast('Pažymėtas galūnės turniketas – nuimkite jį „Turniketų galūnės“ lange'); return; }
          return commit(() => { const T = timers(); delete T.turn; LS.set(TCFG.laikai, T); }, 'Turniketo laikas išvalytas');
        }
        return commit(s => trSet(s, 0), 'Traumos laikas išvalytas');
      }
      case 'totq': return shSwap('tq', {});
      case 'gcson': SH.gcs = 1; SH.fk = 'gcs'; SH.bpd = 0; return shRender();
      // požymiai
      case 'av': SH.v.av = SH.v.av === v ? '' : v; return shRender();
      case 'bpd': SH.bpd = +v ? 1 : 0; return shRender();
      case 'fk': SH.fk = v; SH.bpd = v === 'bp' && SH.v.bpS ? 1 : 0; return shRender();
      case 'qv': {
        const V = SH.v;
        if (SH.fk === 'bp') { if (SH.bpd) { if (v === '-') V.bpD = ''; else V.bpD = String(v); } else V.bpS = String(v); vitNext(); }
        else { V[SH.fk] = String(v); vitNext(); }
        return shRender();
      }
      case 'kp': {
        const V = SH.v;
        if (v === 'next') { vitNext(); return shRender(); }
        const key = SH.fk === 'bp' ? (SH.bpd ? 'bpD' : 'bpS') : SH.fk;
        let cur = String(V[key] || ''); if (!/^\d*$/.test(cur)) cur = '';
        if (v === 'del') cur = cur.slice(0, -1); else if (cur.length < 3) cur += v;
        V[key] = cur; return shRender();
      }
      // vaistai ir skysčiai
      case 'tab': SH.tab = v === 'fl' ? 'fl' : 'rx'; SH.top = 1; return shRender();
      case 'man': SH.man = SH.man ? null : { name: '', g: 'ot', dose: null }; SH.drug = ''; SH.dose = null; shRender(); { const p = shEl.querySelector('#mqpan'); if (p) p.scrollIntoView({ block: 'nearest' }); } return;
      case 'mgrp': if (SH.man && MGRP.some(x => x[0] === v)) { SH.man.g = v; SH.man.gt = 1; } return shRender();
      case 'mdose': { const D = SH.man && SH.man.dose; SH.sub = { kind: 'num', ctx: 'man', buf: D ? D.a : '', unit: D ? D.u : 'mg', route: D ? D.r : 'IV' }; SH.top = 1; return shRender(); }
      case 'flman': SH.fl = SH.fl.man ? { name: '', amt: '', r: 'IV' } : { name: '', amt: '', r: 'IV', man: 1, g: 'fl' }; return shRender();
      case 'flg': if (SH.fl.man && (v === 'fl' || v === 'bl')) SH.fl.g = v; return shRender();
      case 'drug': {
        SH.man = null; SH.drug = SH.drug === v ? '' : v; SH.dose = null;
        const q = (QDF()[SH.drug] || []); if (q.length === 1) SH.dose = { i: 0, r: q[0][0], a: q[0][1], u: q[0][2] };
        shRender(); const p = shEl.querySelector('#mqpan'); if (p) p.scrollIntoView({ block: 'nearest' }); return;
      }
      case 'qd': { const q = (QDF()[SH.drug] || [])[+v]; if (!q) return; SH.dose = { i: +v, r: q[0], a: q[1], u: q[2] }; return shRender(); }
      case 'cdose': { const q = (QDF()[SH.drug] || [])[0]; SH.sub = { kind: 'num', ctx: 'rx', buf: SH.dose && SH.dose.c ? SH.dose.a : '', unit: SH.dose ? SH.dose.u : q ? q[2] : 'mg', route: SH.dose ? SH.dose.r : q ? q[0] : 'IV' }; SH.top = 1; return shRender(); }
      case 'flp': SH.fl = { name: !SH.fl.man && SH.fl.name === v ? '' : v, amt: '', r: SH.fl.r || 'IV' }; return shRender();
      case 'fla': SH.fl.amt = v; return shRender();
      case 'flr': SH.fl.r = v; return shRender();
      case 'flc': SH.sub = { kind: 'num', ctx: 'fl', buf: '', unit: BLP.indexOf(SH.fl.name) >= 0 ? 'vnt.' : 'ml' }; SH.top = 1; return shRender();
      case 'nu': SH.sub.unit = v; return shRender();
      case 'nr': SH.sub.route = v; return shRender();
      case 'nkp': { const o = SH.sub; let b = o.buf || ''; if (v === 'del') b = b.slice(0, -1); else if (v === ',') { if (b && b.indexOf(',') < 0) b += ','; } else if (b.length < 6) b += v; o.buf = b; return shRender(); }
      case 'nok': {
        const o = SH.sub, b = o.buf || ''; if (!(/^\d+(,\d+)?$/.test(b) && parseFloat(b.replace(',', '.')) > 0)) return;
        if (o.ctx === 'rx') SH.dose = { c: 1, a: b, u: o.unit, r: o.route }; else if (o.ctx === 'man') SH.man.dose = { a: b, u: o.unit, r: o.route }; else SH.fl.amt = b + ' ' + o.unit;
        SH.sub = null; return shRender();
      }
      case 'kr': {
        const w = LS.get(TCFG.pre + 'wbb', null) || {};
        const note = w.don || w.donG ? 'Šviežias pilnas kraujas – donoras ' + [w.don, w.donG].filter(Boolean).join(' ') : '';
        return commit(s => {
          const x = { g: 'bl', name: 'Šviežias pilnas kraujas', dose: '', route: '', time: w.t2 ? hm(+w.t2) : nowHM(), src: 'kr' };
          const o = s.rows.find(r => r.src === 'kr'); if (o) Object.assign(o, x); else s.rows.push(x);
          if (note && s.txTxt.indexOf(note) < 0) s.txTxt = [s.txTxt.trim(), note].filter(Boolean).join('; ');
        }, 'Įrašyta: šviežias pilnas kraujas');
      }
      // sužalojimas
      case 'mkt': SH.t = v; tool = v; return shRender();
      case 'mks': SH.sd = v === 'b' ? 'b' : 'f'; SH.pt = null; return shRender();
      case 'mkbody': {
        if (!e || (!e.clientX && !e.clientY)) return;
        const p = bodyPoint(el, e); if (!p) { toast('Bakstelėkite ant kūno silueto'); return; }
        SH.pt = { x: Math.round(p.x * 10) / 10, y: Math.round(p.y * 10) / 10 }; return shRender();
      }
      case 'mktq': {
        const k = v; if (!TQ.some(q => q[0] === k)) return;
        return commit(s => { if (s.tq[k] && s.tq[k].on) { delete s.tq[k]; tqGone(s); tqSync(s, true); } else { s.tq[k] = { on: true, tm: tqDefault() }; tqSync(s); } }, '', true);
      }
      // turniketas
      case 'tqk': {
        SH.k = v; const s = curOf(load()), q = s.tq[v], T = timers();
        if (q && q.on && q.tm) { SH.toff = 'c'; SH.tcust = q.tm; } else if (T.turn) { SH.toff = 'c'; SH.tcust = hm(T.turn); } else { SH.toff = 0; SH.tcust = ''; }
        return shRender();
      }
      case 'tqj': return commit(s => { const i = s.tx.indexOf('tqj'); if (i >= 0) s.tx.splice(i, 1); else s.tx.push('tqj'); }, '', true);
      case 'tqoff': { const k = SH.k; if (!k || !confirm('Nuimti turniketą (' + tqName(k) + ')?')) return; return commit(s => { delete s.tq[k]; tqGone(s); tqSync(s, true); }, 'Turniketas nuimtas: ' + tqName(k)); }
      case 'save': return shSave(d.v === 'more');
    }
  }
  const addNote = (s, nm) => { const n = String(SH && SH.note || '').trim(); if (n) { const x = nm + ': ' + n; if (s.txTxt.indexOf(x) < 0) s.txTxt = [s.txTxt.trim(), x].filter(Boolean).join('; '); } };
  // Turniketo laikmatis (priminimams, juostai) = anksčiausias uždėtas galūnės turniketas; nuėmus (removed) – perskaičiuojamas, nuėmus visus – išvalomas
  function tqSync(s, removed) {
    const T = timers(), on = TQ.map(([k]) => s.tq[k]).filter(q => q && q.on), ts = on.filter(q => HM_RE.test(q.tm)).map(q => tsOf(q.tm));
    if (ts.length) { const m = Math.min.apply(null, ts); if (!+T.turn || removed || m < +T.turn) T.turn = m; }
    else if (removed && !on.length && s.tx.indexOf('tqj') < 0) delete T.turn;
    LS.set(TCFG.laikai, T);
  }
  function shSave(more) {
    const t = shT();
    switch (SH.kind) {
      case 'vit': {
        const V = SH.v, n3 = (x, lo, hi) => { x = String(x).trim(); return x === '' || (/^\d{1,3}$/.test(x) && +x >= lo && +x <= hi); };
        if (!n3(V.hr === 'nečiuopiamas' ? '' : V.hr, 0, 300)) { toast('Pulsas: skaičius 0–300'); return; }
        if (!n3(V.rr, 0, 99)) { toast('KD: skaičius 0–99'); return; }
        if (!n3(V.spo2, 0, 100)) { toast('SpO₂: skaičius 0–100'); return; }
        let gNote = ''; if (!n3(V.gcs, 3, 15)) { V.gcs = ''; gNote = ' · GKS praleistas (turi būti 3–15)'; } // GKS – nebūtinas: netinkamas neblokuoja įrašymo
        if (!n3(V.pain, 0, 10)) { toast('Skausmas: skaičius 0–10'); return; }
        if (V.bpS && !/^\d{2,3}$/.test(V.bpS) || V.bpD && !/^\d{2,3}$/.test(V.bpD)) { toast('AKS: pvz. 90/60'); SH.fk = 'bp'; return shRender(); }
        const rec = { ts: t, av: V.av, rr: V.rr, spo2: V.spo2, hr: V.hr, bp: V.bpS ? V.bpS + (V.bpD ? '/' + V.bpD : '') : '', pain: V.pain, gcs: V.gcs };
        if (!rec.av && !['rr', 'spo2', 'hr', 'bp', 'pain', 'gcs'].some(k => rec[k] !== '')) { toast('Įveskite bent vieną požymį'); return; }
        return commit(s => { s.vit.push(rec); s.f = blankF(); }, 'Matavimas įrašytas ' + t + gNote);
      }
      case 'rx': {
        if (SH.tab === 'rx' && SH.man) { // ranka įvestas vaistas: žinomas (ETC) – per vaistų žymėjimą, kitaip – tik C lentelė
          const M = SH.man, nm = String(M.name || '').trim(), D = M.dose; if (!nm) { toast('Įveskite vaisto pavadinimą'); return; }
          const kv = known(nm), lb = [nm, D ? D.a + ' ' + D.u : '', D ? D.r : ''].filter(Boolean).join(' ') + ' · ' + t;
          if (kv && D && typeof VZ !== 'undefined' && VZ.add) {
            VZ.add({ t: tsOf(t), v: kv.id, a: String(D.a).replace('.', ','), u: D.u, r: D.r, n: String(SH.note || '').trim().slice(0, 120) });
            shClose(false); const y = scrollY; render(); scrollTo(0, y); toast('Įrašyta: ' + lb); return;
          }
          return commit(s => { s.rows.push({ g: kv && !M.gt ? grpOf(kv) : M.g, name: nm, dose: D ? D.a + ' ' + D.u : '', route: D ? D.r : '', time: t, src: 'mc:' + Date.now().toString(36) }); addNote(s, nm); }, 'Įrašyta: ' + lb);
        }
        if (SH.tab === 'rx') {
          const v = (E.vaistai || []).find(x => x.id === SH.drug), D = SH.dose; if (!v || !D) return;
          if (typeof VZ !== 'undefined' && VZ.add) {
            VZ.add({ t: tsOf(t), v: v.id, a: String(D.a).replace('.', ','), u: D.u, r: D.r, n: String(SH.note || '').trim().slice(0, 120) });
            shClose(false); const y = scrollY; render(); scrollTo(0, y); toast('Įrašyta: ' + dn(v) + ' ' + D.a + ' ' + D.u + ' ' + D.r + ' · ' + t); return;
          }
          return commit(s => { s.rows.push({ g: grpOf(v), name: dn(v), dose: D.a + ' ' + D.u, route: D.r, time: t, src: 'mc:' + Date.now().toString(36) }); addNote(s, dn(v)); }, 'Įrašyta: ' + dn(v) + ' ' + D.a + ' ' + D.u + ' ' + D.r + ' · ' + t);
        }
        const F = SH.fl, fn = String(F.name || '').trim(); if (!fn || !F.amt) return;
        return commit(s => { s.rows.push({ g: F.man ? (F.g === 'bl' ? 'bl' : 'fl') : BLP.indexOf(fn) >= 0 ? 'bl' : 'fl', name: fn, dose: F.amt, route: F.r, time: t, src: 'mc:' + Date.now().toString(36) }); addNote(s, fn); }, 'Įrašyta: ' + fn + ' ' + F.amt + ' ' + F.r + ' · ' + t);
      }
      case 'mk': {
        const pt = SH.pt; if (!pt) return;
        const m = { t: SH.t, s: SH.sd, x: pt.x, y: pt.y }, lb = mkT(SH.t)[2] + ' – ' + region(SH.sd, pt.x, pt.y).t;
        if (more) { SH.pt = null; SH.n = (SH.n || 0) + 1; }
        return commit(s => { snap(s); s.mk.push(m); }, 'Pridėta: ' + lb, more);
      }
      case 'tq': {
        const k = SH.k; if (!k) return;
        return commit(s => { s.tq[k] = { on: true, tm: t }; tqSync(s, true); }, 'Turniketas: ' + tqName(k) + ' · ' + t);
      }
    }
  }
  // Išoriniams įrankiams (paciento ekranas, juosta): atverti langą
  function sheet(kind, o) {
    const map = { vit: 'vit', vz: 'rx', rx: 'rx', fl: 'rx', tq: 'tq', mk: 'mk', time: 'time' };
    const k = map[kind]; if (!k) return false;
    shOpen(k, Object.assign({}, o || {}, kind === 'fl' ? { tab: 'fl' } : {}));
    return true;
  }
  // Kitiems įrankiams (laikmačiai, sąrašų ⏱): laikas dabartiniam sužeistajam – kartu su kortele
  function setTime(f, ts) {
    const st = load(), s = curOf(st);
    if (f === 'trauma') trSet(s, ts);
    else { const T = timers(); if (ts) T.turn = ts; else delete T.turn; LS.set(TCFG.laikai, T); }
    save(st);
  }
  function setTq(k, tm) {
    if (!TQ.some(q => q[0] === k)) return false;
    const st = load(), s = curOf(st); s.tq[k] = { on: true, tm: HM_RE.test(tm || '') ? tm : nowHM() }; tqSync(s); save(st); return true;
  }
  // Vaistų žymėjimo įrašas ištrintas → jo C lentelės eilutė (src 'vz:id') taip pat
  function dropSrc(src) { if (!src) return; const st = load(); let ch = false; st.pts.forEach(p => { const n = p.rows.length; p.rows = p.rows.filter(r => r.src !== src); if (p.rows.length !== n) ch = true; }); if (ch) save(st); }

  // ── Kortelė paveikslėliu – LK „Nukentėjusiojo kortelės“ išdėstymas (priekis ir galas), su kuopos logotipu ──
  const SHAPE_LIST = (() => { const o = []; SHAPES.replace(/<(ellipse|path) ([^>]*)\/>/g, (m, tg, at) => { const a = {}; at.replace(/(\w+)="([^"]*)"/g, (q, k, v) => { a[k] = v; }); o.push([tg, a]); }); return o; })();
  const CFF = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif', INK = '#1E3A8A', GRN = '#1A9A4A', RED = '#D92D20';
  let logoImg = null;
  const loadLogo = () => logoImg ? Promise.resolve(logoImg) : new Promise(ok => { const i = new Image(); i.onload = () => { logoImg = i; ok(i); }; i.onerror = () => ok(null); i.src = 'img/logo-juod.png'; });
  function cardCanvas(s, n, tot, logo) {
    const W = 1000, P = 34, IW = W - 2 * P, H0 = 5200, cv = document.createElement('canvas'); cv.width = W; cv.height = H0;
    const c = cv.getContext('2d'); c.fillStyle = '#fff'; c.fillRect(0, 0, W, H0); c.textBaseline = 'alphabetic'; c.textAlign = 'left';
    let y = P;
    const font = (sz, b) => { c.font = (b ? '700 ' : '400 ') + sz + 'px ' + CFF; };
    const tx = (t, x, yy, sz, b, col, al) => { font(sz, b); c.fillStyle = col || '#111'; c.textAlign = al || 'left'; c.fillText(String(t), x, yy); c.textAlign = 'left'; return c.measureText(String(t)).width; };
    const fit = (t, w) => { t = String(t || ''); while (t && c.measureText(t).width > w) t = t.slice(0, -2) + '…'; return t; };
    const wrap = (t, x, yy, w, sz, lh, col) => { font(sz, false); c.fillStyle = col || INK; String(t || '').split('\n').forEach(par => { let line = ''; par.split(/\s+/).forEach(wd => { const ts = line ? line + ' ' + wd : wd; if (c.measureText(ts).width > w && line) { c.fillText(line, x, yy); yy += lh; line = wd; } else line = ts; }); c.fillText(line, x, yy); yy += lh; }); return yy; };
    const hr = (yy, col, lw) => { c.fillStyle = col || '#9A9A9A'; c.fillRect(P + 40, yy, IW - 40, lw || 2); };
    const letter = (L, yy, col) => tx(L, P + 2, yy, 30, true, col || GRN);
    const lab = (lt, en, x, yy, sz) => { const w = tx(lt, x, yy, sz || 17, true); tx(en, x, yy + 18, 13, false, '#555'); return w; };
    const dots = (x0, x1, yy) => { c.fillStyle = '#888'; for (let x = x0; x < x1; x += 6) c.fillRect(x, yy, 2, 1.6); };
    const val = (t, x, yy, w, sz) => { font(sz || 21, true); c.fillStyle = INK; c.fillText(fit(t, w), x, yy); };
    const box = (x, yy, on, sz) => { const b = sz || 20; c.lineWidth = 2; c.strokeStyle = '#222'; c.strokeRect(x, yy - b + 3, b, b); if (on) { c.strokeStyle = INK; c.lineWidth = 3.4; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + 4, yy - b + 7); c.lineTo(x + b - 4, yy - 1); c.moveTo(x + b - 4, yy - b + 7); c.lineTo(x + 4, yy - 1); c.stroke(); c.lineCap = 'butt'; } };
    const cbx = (on, lt, en, x, yy) => { box(x, yy, on); lab(lt, en, x + 28, yy); };
    // ── PRIEKIS ──
    if (logo) { const lh = 66, lw = logo.width * lh / logo.height; c.drawImage(logo, P, y, lw, lh); }
    tx('NUKENTĖJUSIOJO KORTELĖ', W / 2 + 60, y + 36, 32, true, '#111', 'center'); tx('FIELD MEDICAL CARD', W / 2 + 60, y + 64, 19, false, '#333', 'center');
    if (tot > 1) { font(13, true); c.fillStyle = '#555'; c.textAlign = 'right'; c.fillText('Sužeistasis ' + n + ' / ' + tot, W - P, y + 14); c.textAlign = 'left'; }
    y += 96;
    // vardas, lytis, ID
    lab('PAVARDĖ, VARDAS', 'Last name, first name', P + 40, y); dots(P + 220, P + 560, y + 2); val(s.name, P + 224, y - 2, 330);
    lab('LYTIS:', 'Gender', P + 590, y); box(P + 660, y, s.sex === 'V'); tx('V', P + 686, y, 15, true); box(P + 712, y, s.sex === 'M'); tx('M', P + 738, y, 15, true);
    lab('ID', '', P + 780, y); dots(P + 810, W - P, y + 2); val(s.id, P + 814, y - 2, W - P - 818);
    y += 50; letter('A', y);
    lab('GIM. DATA', 'Date of birth', P + 40, y); dots(P + 150, P + 330, y + 2); val(s.dob, P + 154, y - 2, 172);
    lab('DALINYS', 'Unit of origin', P + 350, y); dots(P + 440, P + 620, y + 2); val(s.unit, P + 444, y - 2, 172);
    lab('ŠALIS', 'Armed Forces of origin (Nationality)', P + 640, y); dots(P + 700, W - P, y + 2); val(s.country, P + 704, y - 2, W - P - 708);
    y += 50; lab('ALERGIJOS', 'Medical allergies', P + 40, y); val(s.allerg, P + 170, y - 2, IW - 140);
    y += 32; hr(y); y += 36; letter('T', y);
    lab('TRAUMOS AR LIGOS DATA, LAIKAS:', 'Date, time of injury or illness', P + 40, y); val([s.dt, s.t0].filter(Boolean).join(' '), P + 400, y - 2, IW - 380);
    y += 48; lab('POBŪDIS:', 'Nature', P + 40, y);
    NAT.forEach(([k, lt, en], i) => cbx(s.nat.indexOf(k) >= 0, lt, en, P + [160, 380, 625, 735][i], y));
    y += 32; hr(y); y += 36; letter('M', y);
    lab('MECHANIZMAS:', 'Mechanism of injury', P + 40, y);
    MECH.forEach(([k, en], i) => cbx(s.mech.indexOf(k) >= 0, k.toLowerCase(), en, P + 210 + i * 150, y));
    if (s.mechTxt.trim()) { y += 34; val(s.mechTxt.trim(), P + 210, y, IW - 180, 18); }
    y += 32; hr(y); y += 36; letter('I', y);
    lab('SUŽALOJIMAI:', 'Injuries', P + 40, y);
    // ženklų paaiškinimas
    let ly = y + 62;
    MK.slice(0, 5).forEach(([k, g, lt, en]) => { tx(g + ' –', P + 40, ly, 17, true); lab(lt, en.toLowerCase(), P + 82, ly, 16); ly += 46; });
    // kūno schemos ir turniketų langeliai
    const sc = 1.42, fx = [P + 345, P + 585], fy = y - 18;
    ['f', 'b'].forEach((sd, j) => {
      c.save(); c.translate(fx[j], fy); c.scale(sc, sc);
      const each = f => SHAPE_LIST.forEach(([tg, a]) => { if (tg === 'ellipse') { c.beginPath(); c.ellipse(+a.cx, +a.cy, +a.rx, +a.ry, 0, 0, Math.PI * 2); f(null); } else f(new Path2D(a.d)); });
      c.lineJoin = 'round'; c.strokeStyle = '#222'; c.lineWidth = 2; each(p => { if (p) c.stroke(p); else c.stroke(); });
      c.fillStyle = '#fff'; each(p => { if (p) c.fill(p); else c.fill(); });
      c.fillStyle = '#333'; c.font = '700 6.5px ' + CFF; c.textAlign = 'center'; NINES[sd].forEach(([x, yy, t]) => c.fillText(t, x, yy + 2));
      c.font = '800 9px ' + CFF; c.fillStyle = '#555'; const lr = sd === 'f' ? ['D', 'K'] : ['K', 'D']; c.fillText(lr[0], 9, 14); c.fillText(lr[1], 111, 14);
      if (sd === 'f') TQ.forEach(([k, , , p]) => { if (s.tq[k] && s.tq[k].on) { c.strokeStyle = INK; c.lineWidth = 4; c.beginPath(); c.moveTo(p[0] - 7, p[1] - 9); c.lineTo(p[0] + 7, p[1] - 9); c.stroke(); } });
      s.mk.forEach(m => { if (m.s !== sd) return; const g = mkT(m.t)[1]; c.font = '800 13px ' + CFF; c.lineJoin = 'round'; c.strokeStyle = '#fff'; c.lineWidth = 3; c.strokeText(g, m.x, m.y + 4.5); c.fillStyle = INK; c.fillText(g, m.x, m.y + 4.5); });
      c.restore();
    });
    const tqb = ([k, lt, en], x, yy) => {
      const q = s.tq[k] || {}; c.lineWidth = 2; c.strokeStyle = '#222'; c.strokeRect(x, yy, 214, 112);
      tx('TURNIKETAS', x + 10, yy + 24, 15, true); tx(lt.toUpperCase(), x + 10, yy + 45, 15, true); tx('TQ: ' + en, x + 10, yy + 61, 12, false, '#555');
      tx('LAIKAS', x + 10, yy + 91, 15, true); tx('Time', x + 10, yy + 104, 11, false, '#555'); dots(x + 76, x + 204, yy + 93);
      box(x + 182, yy + 28, !!q.on, 22); if (q.on && q.tm) val(q.tm, x + 80, yy + 89, 120, 22);
    };
    const ty = fy + 250 * sc + 16;
    TQ.forEach((q, i) => tqb(q, P + 40 + i * 226, ty));
    y = ty + 112 + 30;
    if (s.injTxt.trim()) y = wrap(s.injTxt.trim(), P + 40, y, IW - 40, 17, 23) + 4;
    hr(y); y += 24; letter('S', y + 34);
    // būklės lentelė
    const V = s.vit.slice(-6), ncol = Math.max(3, V.length), lw = 330, cw = (IW - 40 - lw) / ncol, rh = 44, x0 = P + 40;
    const ROWS = [['ts', 'APŽIŪROS LAIKAS', 'Time of exam'], ['av', 'SĄMONĖ (AVPU)', 'Consciousness'], ['rr', 'KVĖPAVIMO DAŽNIS', 'RR'], ['spo2', 'O₂ SATURACIJA', 'O₂ Saturation'], ['hr', 'PULSAS', 'Pulse'], ['bp', 'AKS', 'BP'], ['pain', 'SKAUSMO SKALĖ (0-10)', 'Pain scale']];
    if (V.some(v => v.gcs)) ROWS.push(['gcs', 'GKS', 'GCS']);
    ROWS.forEach(([k, lt, en], ri) => {
      const yy = y + ri * rh, hh = ri === 0 ? rh + 14 : rh, y1 = ri === 0 ? yy : yy + 14;
      c.lineWidth = 1.6; c.strokeStyle = '#222'; c.strokeRect(x0, y1, lw, hh);
      if (ri === 0) { c.beginPath(); c.moveTo(x0, y1); c.lineTo(x0 + lw, y1 + hh); c.lineWidth = 1; c.stroke(); tx('BŪKLĖ', x0 + 10, y1 + hh - 10, 17, true); tx('Signs', x0 + 80, y1 + hh - 10, 12, false, '#555'); tx(lt, x0 + lw - 10, y1 + 20, 15, true, '#111', 'right'); tx(en, x0 + lw - 10, y1 + 36, 11, false, '#555', 'right'); }
      else { tx(lt, x0 + 10, y1 + 28, 15, true); font(15, true); tx(en, x0 + 16 + c.measureText(lt).width, y1 + 28, 12, false, '#555'); }
      for (let i = 0; i < ncol; i++) {
        const x = x0 + lw + i * cw; c.lineWidth = 1.6; c.strokeStyle = '#222'; c.strokeRect(x, y1, cw, hh);
        const v = V[i]; if (k === 'bp' && !v) tx('/', x + cw / 2, y1 + 28, 16, false, '#444', 'center');
        if (!v) continue;
        let t = k === 'ts' ? v.ts : k === 'spo2' ? (v.spo2 ? v.spo2 + '%' : '') : k === 'gcs' ? (v.gcs || '') : (v[k] || '');
        font(20, true); c.fillStyle = k !== 'ts' && abn(k, v[k]) ? RED : INK; c.textAlign = 'center'; c.fillText(fit(t, cw - 10), x + cw / 2, y1 + (ri === 0 ? 38 : 30)); c.textAlign = 'left';
      }
    });
    y += ROWS.length * rh + 14 + 34;
    lab('NUSISKUNDIMAI', 'Symptoms', P + 40, y); if (s.sympt.trim()) y = wrap(s.sympt.trim(), P + 230, y, IW - 200, 18, 24) - 24;
    y += 40;
    if (s.vit.length > 6) y = wrap('Ankstesni matavimai: ' + s.vit.slice(0, -6).map(v => vitLine(v)).join('; '), P + 40, y, IW - 40, 14, 19) + 6;
    // lapo kraštas
    c.setLineDash([10, 8]); c.strokeStyle = '#999'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); c.setLineDash([]);
    y += 50;
    // ── GALAS: teikta pagalba ──
    const on = k => s.tx.indexOf(k) >= 0;
    letter('T', y); lab('TEIKTA PAGALBA:', 'Treatment', P + 40, y); y += 50;
    tx('„C“', P - 10, y, 22, true, RED); lab('TURNIKETAS:', 'TQ', P + 40, y); cbx(on('tq'), 'galūnės', 'limb', P + 260, y); cbx(on('tqj'), 'jungties', 'junctional', P + 520, y);
    y += 48; lab('TVARSTIS:', 'Dressing', P + 40, y); cbx(on('dh'), 'hemostatinis', 'hemostatic', P + 260, y); cbx(on('dp'), 'spaudžiamasis', 'pressure', P + 520, y); cbx(on('dk'), 'kita', 'other', P + 780, y);
    y += 50; tx('A', P + 2, y, 26, true, RED); cbx(on('npa'), 'NAZOFAR.', 'NPA', P + 40, y); cbx(on('igel'), 'I-GEL', 'I-gel', P + 260, y); cbx(on('cric'), 'KRIKO.', 'CRIC', P + 520, y); cbx(on('ak'), 'KITA', 'Other', P + 780, y);
    y += 50; tx('B', P + 2, y, 26, true, RED); cbx(on('occl'), 'OKLIUZINIS TVARSTIS', 'Chest seal', P + 40, y); cbx(on('dec'), 'AD. DEKOMPRESIJA', 'Needle decompression', P + 330, y); cbx(on('o2'), 'O₂', '', P + 600, y); cbx(on('ctube'), 'KRŪTINĖS DRENAS', 'Chest tube', P + 700, y);
    y += 44; tx('C', P + 2, y + 30, 26, true, RED);
    // C lentelė
    const cx0 = P + 40, gw = 230, cols = [IW - 40 - gw - 3 * 150, 150, 150, 150], ch = 38;
    c.fillStyle = '#E9E9E9'; c.fillRect(cx0 + gw, y, IW - 40 - gw, ch); c.strokeStyle = '#222'; c.lineWidth = 1.6; c.strokeRect(cx0 + gw, y, IW - 40 - gw, ch);
    [['PAVADINIMAS', 'Name'], ['DOZĖ', 'Dose'], ['BŪDAS', 'Route'], ['LAIKAS', 'Time']].reduce((x, [lt, en], i) => { tx(lt, x + cols[i] / 2, y + 18, 14, true, '#111', 'center'); tx(en, x + cols[i] / 2, y + 32, 11, false, '#555', 'center'); c.strokeRect(x, y, cols[i], ch); return x + cols[i]; }, cx0 + gw);
    y += ch;
    ROWG.forEach(([g, lt, en, min]) => {
      const R = s.rows.filter(r => r.g === g && rowText(r)), nr = Math.max(min, R.length), gh = Math.max(nr * 36, g === 'ot' ? 64 : 52), rh = gh / nr;
      c.strokeRect(cx0, y, gw, gh); tx(lt.replace(/ \(.*\)$/, '').toUpperCase(), cx0 + 10, y + 22, 15, true); tx(en.replace(/ \(.*\)$/, ''), cx0 + 10, y + 38, 11, false, '#555');
      if (g === 'ot') tx('(pvz., Traneksamo rūgštis)', cx0 + 10, y + 52, 10, false, '#555');
      for (let i = 0; i < nr; i++) {
        const r = R[i]; let x = cx0 + gw;
        [r ? r.name : '', r ? r.dose : '', r ? r.route : '', r ? r.time : ''].forEach((v, j) => { c.strokeRect(x, y + i * rh, cols[j], rh); if (v) { font(17, true); c.fillStyle = INK; c.fillText(fit(v, cols[j] - 14), x + 8, y + i * rh + rh / 2 + 7); } x += cols[j]; });
      }
      y += gh;
    });
    y += 44;
    cbx(on('dress'), 'TVARSTYMAS', 'Wound dressing', P + 40, y); cbx(on('spl'), 'IMOBILIZAVIMAS', 'Splinting', P + 330, y);
    lab('AKIES GAUBTELIS:', 'Eye shield', P + 620, y); box(P + 810, y, on('eyeR')); tx('D', P + 836, y, 15, true); box(P + 870, y, on('eyeL')); tx('K', P + 896, y, 15, true);
    y += 48; cbx(on('hypo'), 'HIPOTERMIJOS PREVENCIJA', 'Hypothermia prevention', P + 40, y); cbx(on('oth'), 'KITA', 'Other', P + 420, y);
    y += 34;
    // pastabos
    const ny = y; c.strokeStyle = '#222'; c.lineWidth = 1.6; lab('PASTABOS:', 'Notes', P + 52, ny + 28);
    let ey = s.txTxt.trim() ? wrap(s.txTxt.trim(), P + 52, ny + 74, IW - 40, 18, 25) : ny + 120;
    ey = Math.max(ey, ny + 120); c.strokeRect(P + 40, ny, IW - 40, ey - ny); y = ey + 50;
    // evakuacija
    lab('EVAKUACIJA:', 'Evacuation', P + 40, y);
    const EVC = { u: [RED, '#fff'], p: ['#F5D90A', '#111'], r: [GRN, '#fff'] };
    EVAC.forEach(([k, lt, en], i) => { const x = P + 230 + i * 240, [bg, fg] = EVC[k]; c.fillStyle = bg; c.fillRect(x, y - 30, 220, 38); c.fillStyle = '#fff'; c.fillRect(x + 8, y - 24, 24, 24); c.strokeStyle = '#222'; c.lineWidth = 1.5; c.strokeRect(x + 8, y - 24, 24, 24); if (s.evac === k) box(x + 10, y - 2, true, 20); tx(lt.toUpperCase(), x + 42, y - 4, 19, true, fg); tx(en, x + 110, y + 24, 13, false, '#555', 'center'); });
    y += 70; lab('TRANSPORTAVIMO PADĖTIS:', 'Transportation position', P + 40, y);
    POS.forEach(([k], i) => {
      const x = P + 330 + i * 98, p = new Path2D(); c.save(); c.translate(x, y - 34); c.scale(2.2, 2.2); c.fillStyle = '#111';
      const svg = POS_SVG[k]; svg.replace(/<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"\/>/g, (m, a, b, r) => { c.beginPath(); c.arc(+a, +b, +r, 0, Math.PI * 2); c.fill(); });
      svg.replace(/<path d="([^"]+)"( opacity="[^"]+")?\/>/g, (m, d) => { c.fill(new Path2D(d)); });
      c.restore();
      if (s.pos === k) { c.strokeStyle = INK; c.lineWidth = 3.5; c.beginPath(); c.ellipse(x + 37, y - 8, 46, 34, 0, 0, Math.PI * 2); c.stroke(); }
    });
    y += 62; lab('PAGALBOS TEIKĖJO PAVARDĖ, VARDAS, ID', 'Responder last name, first name, ID', P + 40, y);
    [0, 1].forEach(i => { y += 46; tx(String(i + 1), P + 40, y, 18, true); dots(P + 66, W - P, y + 2); val(s.resp[i], P + 72, y - 2, IW - 60); });
    y += 40; c.fillStyle = '#222'; c.fillRect(P, y, IW, 2); y += 24;
    tx('Sugeneruota ' + new Date().toLocaleDateString('lt-LT') + ' ' + nowHM() + ' iš skaitmeninės MIST kortelės – patikrinkite prie sužeistojo. LŠS Vilniaus 1040 medicinos šaulių kuopa.', P, y, 13, false, '#555');
    y += P;
    const out = document.createElement('canvas'); out.width = W; out.height = Math.min(H0, Math.ceil(y));
    out.getContext('2d').drawImage(cv, 0, 0);
    return out;
  }
  async function cardShow(s, n, tot) {
    let cv; try { cv = cardCanvas(s, n, tot, await loadLogo()); } catch (e) { console.error(e); toast('Nepavyko sukurti kortelės'); return; }
    const url = cv.toDataURL('image/png');
    const nm = 'kortele-' + (s.id.trim() || ('suzeistasis-' + n)).replace(/[^\wąčęėįšųūžĄČĘĖĮŠŲŪŽ-]+/g, '_') + '-' + nowHM().replace(':', '') + '.png';
    const save = () => { const a = document.createElement('a'); a.href = url; a.download = nm; document.body.appendChild(a); a.click(); a.remove(); };
    const share = () => cv.toBlob(b => {
      const f = b && typeof File === 'function' ? new File([b], nm, { type: 'image/png' }) : null;
      if (f && navigator.canShare && navigator.canShare({ files: [f] })) navigator.share({ files: [f], title: 'Nukentėjusiojo kortelė' }).catch(() => {}); else save();
    }, 'image/png');
    const print = () => {
      let p = document.getElementById('prt'); if (!p) { p = document.createElement('div'); p.id = 'prt'; document.body.appendChild(p); }
      p.innerHTML = '<img alt="" src="' + url + '">';
      const de = document.documentElement, done = () => { de.classList.remove('prt'); removeEventListener('afterprint', done); };
      de.classList.add('prt'); addEventListener('afterprint', done); setTimeout(() => window.print(), 60);
    };
    readMode('Nukentėjusiojo kortelė', ['<img class="cardimg" alt="Nukentėjusiojo kortelė" src="' + url + '">'], [['Bendrinti', share], ['Išsaugoti', save], ['Spausdinti', print]]);
  }
  // Paciento failui: visa būsena ir dabartinės kortelės tekstas
  return { view, act, onInput, status, text, addGcs, addRows, addInj, current, region, state: load, curText: en => curText(load(), en), cardCanvas, loadLogo, vitLine, tqName, outView, parts: (s, n, tot, en) => parts(s, n || 1, tot || 1, en), injText, abn,
    txText: (s, en) => [lc(txParts(s, en, 1)), String(s.txTxt || '').trim()].filter(Boolean).join('; '), trTs, hydrate, used, setTime, setTq, dropSrc,
    sheet, sheetOpen: () => !!SH, closeSheet: () => shClose(false), profileView, MECH, TX, TQ, MK, ROWG, EVAC, POS };
})();

// ───────── GKS (Glasgow) skaičiuoklė – GCS at 40 ─────────
const GK = (() => {
  const KEY = TCFG.pre + 'gks';
  const G = [
    { k: 'e', lb: 'Akys', ab: 'A', o: [['4', 'Atsimerkia savaime'], ['3', 'Atsimerkia į garsą', 'kalbinamas'], ['2', 'Atsimerkia į spaudimą'], ['1', 'Neatsimerkia'], ['NT', 'Neįvertinama', 'pvz., uždarytos akys dėl patinimo']] },
    { k: 'v', lb: 'Kalba', ab: 'K', o: [['5', 'Orientuotas'], ['4', 'Sumišęs'], ['3', 'Pavieniai žodžiai'], ['2', 'Tik garsai'], ['1', 'Nėra'], ['NT', 'Neįvertinama', 'intubuotas']] },
    { k: 'm', lb: 'Motorika', ab: 'M', o: [['6', 'Vykdo komandas'], ['5', 'Lokalizuoja skausmą (spaudimą)'], ['4', 'Normali fleksija', 'atitraukia'], ['3', 'Patologinė fleksija'], ['2', 'Ekstenzija'], ['1', 'Nėra'], ['NT', 'Neįvertinama', 'pvz., paralyžius ar kitas trukdis']] }
  ];
  const PUP = [['0', 'Abu reaguoja'], ['1', 'Vienas nereaguoja'], ['2', 'Abu nereaguoja']];
  const def = () => ({ e: '', v: '', m: '', p: '', h: [] });
  const okv = (k, v) => v === '' || (G.find(g => g.k === k) || { o: [] }).o.some(o => o[0] === v);
  function get() {
    const raw = LS.get(KEY, null), s = Object.assign(def(), raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {});
    ['e', 'v', 'm', 'p'].forEach(k => { s[k] = s[k] == null ? '' : String(s[k]); });
    ['e', 'v', 'm'].forEach(k => { if (!okv(k, s[k])) s[k] = ''; });
    if (['', '0', '1', '2'].indexOf(s.p) < 0) s.p = '';
    s.h = Array.isArray(s.h) ? s.h.filter(x => x && typeof x === 'object').map(x => { const o = { ts: x.ts == null ? '' : String(x.ts), at: +x.at || 0 }; ['e', 'v', 'm', 'p'].forEach(k => { o[k] = x[k] == null ? '' : String(x[k]); }); return o; }) : [];
    return s;
  }
  const save = s => LS.set(KEY, s);
  function calc(s) {
    const comp = 'A' + (s.e || '–') + ' K' + (s.v || '–') + ' M' + (s.m || '–');
    if (!s.e || !s.v || !s.m) return { done: false, comp };
    if ([s.e, s.v, s.m].indexOf('NT') >= 0) return { done: true, nt: true, comp };
    const tot = +s.e + +s.v + +s.m;
    return { done: true, tot, comp, gp: s.p !== '' ? tot - +s.p : null, sev: tot >= 13 ? 1 : tot >= 9 ? 2 : 3 };
  }
  const SEV = ['', 'Lengva (13–15)', 'Vidutinė (9–12)', 'Sunki (3–8) – ≤ 8: apsaugokite kvėpavimo takus'];
  const label = c => c.nt ? c.comp : !c.done ? c.comp + ' (dalinis)' : 'GKS ' + c.tot + ' (' + c.comp + ')';
  const anyC = s => !!(s.e || s.v || s.m); // GKS nebūtinas: galima įrašyti ir dalinį (be sumos)
  const histLine = x => { const c = calc(x); return x.ts + ' – ' + label(c) + (c.gp != null ? ' · GKS-P ' + c.gp : ''); };
  function status() {
    const s = get(), x = s.h[0];
    return x ? 'Paskutinė: ' + histLine(x) : 'Glasgow komos skalė, GKS-P';
  }
  function resBox(s) {
    const c = calc(s);
    let h = `<div class="gres${c.done && !c.nt ? ' sev' + c.sev : ''}" id="gres" aria-live="polite">`;
    if (!c.done) h += `<div class="gt">GKS – <small>${esc(c.comp)}</small></div><div class="gsv">${anyC(s) ? 'Dalinis vertinimas – sumos nėra; galima įrašyti komponentus' : 'Pasirinkite akių, kalbos ir motorikos atsaką'}</div>`;
    else if (c.nt) h += `<div class="gt">${esc(c.comp)}</div><div class="gsv">Bendros sumos skaičiuoti negalima – perduokite komponentus</div>`;
    else h += `<div class="gt">${esc(label(c))}</div><div class="gsv">${esc(SEV[c.sev])}</div>` + (c.gp != null ? `<div class="gsv"><b>GKS-P ${c.gp}</b> (GKS ${c.tot} − vyzdžiai ${s.p})</div>` : '');
    return h + '</div>';
  }
  function view() {
    const s = get(), learn = mode === 'learn', who = MC.current();
    let h = '<h1>GKS skaičiuoklė</h1><p class="muted">Glasgow komos skalė (GCS at 40). Vertinkite geriausią atsaką; perduokite ir komponentus, ne vien sumą.</p>';
    G.forEach(g => {
      h += `<section class="nl gsec" role="radiogroup" aria-label="${g.lb}"><div class="nlh"><span class="nn">${g.ab}</span><b>${g.lb}</b><small class="gsel">${s[g.k] ? g.ab + s[g.k] : ''}</small></div>` +
        g.o.map(([v, t, sub]) => `<button class="gopt${s[g.k] === v ? ' on' : ''}${v === 'NT' ? ' nt' : ''}" data-act="gk-set" data-g="${g.k}" data-k="${v}" role="radio" aria-checked="${s[g.k] === v}"><span class="gs">${v}</span><span>${esc(t)}${sub ? '<small>' + esc(sub) + '</small>' : ''}</span></button>`).join('') + '</section>';
    });
    const c = calc(s);
    h += '<section class="nl"><div class="nlh"><span class="nn">P</span><b>Vyzdžių reakcija</b><small class="muted">nebūtina</small></div>' +
      '<div class="opts">' + PUP.map(([k, t]) => chip('gk-p', k, s.p === k, esc(t) + ` <small>${k === '0' ? '0' : '−' + k}</small>`)).join('') + '</div>' +
      `<p class="muted">GKS-P = GKS − nereaguojančių vyzdžių skaičius (0–2)${c.done && !c.nt ? '' : '; rodoma, kai įvertinti visi trys komponentai'}.</p></section>`;
    h += resBox(s);
    h += '<div class="acts"><button class="btn pri" data-act="gk-save">Išsaugoti su laiku</button><button class="btn" data-act="gk-mist">Į MIST</button><button class="btn" data-act="gk-clr">Išvalyti</button></div>';
    if (who.tot > 1) h += `<p class="muted">„Į MIST“ – į sužeistojo ${who.n} kortelę (iš ${who.tot}). Kitą sužeistąjį pasirinkite MIST kortelėje.</p>`;
    if (s.h.length) h += '<h2>Istorija</h2><div class="vlist">' + s.h.map((x, i) => `<div class="vr"><span>${esc(histLine(x))}</span><button class="x" data-act="gk-hdel" data-k="${i}" aria-label="Ištrinti įrašą ${esc(x.ts)}">×</button></div>`).join('') + '</div>';
    if (learn) h += '<h2>Kaip vertinti</h2><div class="card esme"><ul>' +
      '<li><b>Patikrinkite</b> trukdžius: klausa, kalbos barjeras, intubacija, patinimas, sedacija, paralyžius.</li>' +
      '<li><b>Stebėkite</b>, ką pacientas daro savaime, tada <b>stimuliuokite</b>: pirmiausia garsas (kalbinkite, jei reikia – garsiai šaukite), tik tada fizinis stimulas.</li>' +
      '<li><b>Spaudimo stimulas</b> (iki 10 s, palaipsniui didinant jėgą): periferinis – <b>nago guolio</b> (piršto galiuko) spaudimas; centriniai – <b>trapecinio raumens</b> suspaudimas tarp nykščio ir pirštų arba <b>antakio – supraorbitalinės įdubos</b> spaudimas. Akims ir fleksijai vertinti – periferinis, lokalizacijai – centrinis stimulas.</li>' +
      '<li><b>Lokalizuoja</b> – ranka pakyla virš raktikaulio link stimulo galvoje ar kakle. <b>Normali fleksija</b> – greitas sulenkimas per alkūnę; <b>patologinė</b> – lėtas, stereotipinis, dilbis prie krūtinės, kumštis sugniaužtas.</li>' +
      '<li>Registruokite komponentus (pvz., A3 K4 M5); neįvertinamą komponentą žymėkite NT ir sumos neskaičiuokite.</li></ul></div>' +
      '<p class="muted">Šaltinis: Teasdale G. et al. The Glasgow Coma Scale at 40 years: standing the test of time. Lancet Neurol 2014; GKS-P – Brennan P. M. et al., J Neurosurg 2018.</p>' +
      '<a class="row" href="https://www.glasgowcomascale.org/" target="_blank" rel="noopener"><div>Glasgow Coma Scale<small>glasgowcomascale.org</small></div><span class="ar">↗</span></a>';
    h += tcfgRows(TCFG.gk());
    return h;
  }
  function act(el) {
    const s = get(), d = el.dataset, k = d.k;
    switch (d.act) {
      case 'gk-set': if (!okv(d.g, k)) return; s[d.g] = s[d.g] === k ? '' : k; break;
      case 'gk-p': s.p = s.p === k ? '' : k; break;
      case 'gk-clr': s.e = s.v = s.m = s.p = ''; break;
      case 'gk-save': {
        if (!anyC(s)) { toast('Pasirinkite bent vieną komponentą'); return; }
        s.h.unshift({ ts: nowHM(), at: Date.now(), e: s.e, v: s.v, m: s.m, p: s.p }); s.h = s.h.slice(0, 12);
        toast('Išsaugota ' + s.h[0].ts); break;
      }
      case 'gk-hdel': { const i = +k; if (i >= 0 && i < s.h.length) s.h.splice(i, 1); break; }
      case 'gk-mist': {
        const c = calc(s), x = s.h[0];
        if (anyC(s) && !(x && x.e === s.e && x.v === s.v && x.m === s.m && x.p === s.p)) { s.h.unshift({ ts: nowHM(), at: Date.now(), e: s.e, v: s.v, m: s.m, p: s.p }); s.h = s.h.slice(0, 12); }
        const y = s.h[0];
        if (!y) { toast('Pasirinkite bent vieną komponentą'); return; }
        const cy = calc(y); // dalinis – kaip NT: perduodami komponentai, suma neskaičiuojama
        const who = MC.addGcs({ ts: y.ts, v: cy.nt || !cy.done ? 'NT' : String(cy.tot), d: cy.comp + (cy.gp != null ? ', GKS-P ' + cy.gp : '') });
        toast('Į MIST kortelę' + (who ? ' (' + who + ')' : '') + ' įrašyta: ' + histLine(y)); break;
      }
      default: return;
    }
    save(s);
    const y = scrollY; render(); scrollTo(0, y);
  }
  return { view, act, status, calc };
})();

// ───────── TST – Ten Second Triage (NHS England, 2023) ─────────
const TS = (() => {
  const KEY = 'mg-tst';
  // Algoritmas: NHS England Ten Second Triage tool (2023 m. balandis); NARU TST papildoma informacija v1.0 (2023); Vassallo et al., Trauma 2024
  const Q = {
    q1: { n: '1 / 4', q: 'Vaikšto?', hint: 'Akivaizdžiai kritinės būklės vaikštantį pasodinkite – laikykite nevaikštančiu.', yes: { c: 'p3' }, no: 'q2', y: 'vaikšto', nn: 'nevaikšto' },
    q2: { n: '2 / 4', q: 'Masyvus kraujavimas?', hint: 'TAIP – iškart: spaudimas, turniketas, tamponavimas.', yes: { c: 'p1', a: 'spaudimas, turniketas, tamponavimas' }, no: 'q3', y: 'masyvus kraujavimas', nn: 'be masyvaus kraujavimo' },
    q3: { n: '3 / 4', q: 'Kalba?', hint: 'Tik dejuoja, murma – „NE“.', yes: 'q3a', no: 'q4', y: 'kalba', nn: 'nekalba' },
    q3a: { n: '3a', q: 'Penetruojantis sužalojimas?', hint: 'Kaklas, krūtinė, pažastys, nugara, pilvas, kirkšnys, sėdmenys – priekyje, nugaroje ir šonuose.', yes: { c: 'p1' }, no: { c: 'p2' }, y: 'penetruojantis sužalojimas', nn: 'be penetruojančio sužalojimo' },
    q4: { n: '4 / 4', q: 'Kvėpuoja?', hint: 'Atverkite kvėpavimo takus, jei galite.', yes: { c: 'p1', a: 'stabili šoninė padėtis' }, no: { c: 'nb', a: 'stabili šoninė padėtis; gaivinimas – tik jei leidžia ištekliai ir netrukdo stabdyti kraujavimo bei atverti kvėpavimo takų' }, y: 'kvėpuoja', nn: 'nekvėpuoja' }
  };
  const CAT = { p1: ['P1', 'Neatidėliotina', 'tp1'], p2: ['P2', 'Skubi', 'tp2'], p3: ['P3', 'Gali palaukti / vaikšto', 'tp3'], nb: ['NEKVĖPUOJA', 'Gaivinimas – tik jei leidžia ištekliai', 'tnb'] };
  const KS = ['p1', 'p2', 'p3', 'nb'];
  const STALE = 15 * 60e3; // po 15 min neveiklumo eiga pradedama nuo 1 klausimo (skaičiavimas lieka)
  let shownAt = 0;         // apsauga nuo atsitiktinio dvigubo bakstelėjimo
  const def = () => ({ st: 'q1', path: [], res: null, n: { p1: 0, p2: 0, p3: 0, nb: 0 } });
  function get(noStale) {
    const raw = LS.get(KEY, null), s = Object.assign(def(), raw && typeof raw === 'object' ? raw : {});
    if (!Q[s.st]) s.st = 'q1';
    if (!Array.isArray(s.path)) s.path = [];
    s.path = s.path.filter(p => p && Q[p.q]);
    s.n = Object.assign(def().n, s.n && typeof s.n === 'object' ? s.n : {});
    KS.forEach(k => { s.n[k] = Math.max(0, Math.min(999, parseInt(s.n[k], 10) || 0)); });
    if (s.res && !CAT[s.res.c]) s.res = null;
    if (!noStale && (s.st !== 'q1' || s.res || s.path.length) && !(s.at > Date.now() - STALE)) { s.st = 'q1'; s.path = []; s.res = null; save(s); }
    return s;
  }
  const save = s => LS.set(KEY, s);
  const total = s => KS.reduce((a, k) => a + s.n[k], 0);
  function status() {
    const s = get(), t = total(s);
    return t ? 'Iš viso ' + t + ' · ' + KS.filter(k => s.n[k]).map(k => (k === 'nb' ? 'Nekv.' : CAT[k][0]) + ' ' + s.n[k]).join(' · ') : 'Ten Second Triage – rūšiavimas per 10\u00a0s';
  }
  const why = s => s.path.map(p => p.a === 2 ? 'vaikas iki 2 metų' : p.a ? Q[p.q].y : Q[p.q].nn).join(' → ');

  function card(s) {
    if (s.res) {
      const C = CAT[s.res.c];
      return `<section class="tres ${C[2]}" aria-live="polite"><div class="trc">${C[0]}</div><div class="trn">${esc(C[1])}</div>` +
        (s.res.a ? `<div class="tra">Veiksmai: ${esc(s.res.a)}</div>` : '') + `<div class="trw">${esc(why(s))}</div>` +
        `<div class="trw">Pridėta prie skaičiavimo: ${C[0] === 'NEKVĖPUOJA' ? 'Nekvėpuoja' : C[0]} = ${s.n[s.res.c]}</div>` +
        `<button class="trnext" data-act="ts-next">Kitas sužeistasis ›</button><button class="btn tbk" data-act="ts-back">‹ Atgal – taisyti atsakymą</button></section>`;
    }
    const q = Q[s.st];
    return `<section class="tq" aria-live="polite"><div class="tqh"><span class="tqn">Klausimas ${q.n}</span>` +
      (s.path.length ? '<button class="btn sm" data-act="ts-back">‹ Atgal</button>' : '') + '</div>' +
      `<p class="tqq">${esc(q.q)}</p>${q.hint ? `<p class="tqs">${esc(q.hint)}</p>` : ''}` +
      `<div class="yn"><button class="yes" data-act="ts-ans" data-k="1">TAIP</button><button class="no" data-act="ts-ans" data-k="0">NE</button></div>` +
      (s.st === 'q1' ? '<button class="btn tchild" data-act="ts-ans" data-k="child">Vaikas iki 2 metų → P1</button>' : '') + '</section>';
  }
  function tally(s) {
    return `<section class="nl tal"><div class="nlh"><b>Skaičiavimas</b><span class="ttot">Iš viso: <b>${total(s)}</b></span></div>` +
      KS.map(k => `<div class="tlr"><span class="tcat ${CAT[k][2]}">${k === 'nb' ? '✕' : CAT[k][0]}</span><span class="tln">${k === 'nb' ? 'Nekvėpuoja' : esc(CAT[k][1])}</span>` +
        `<button data-act="ts-inc" data-k="${k}" data-d="-1" aria-label="Mažiau: ${k === 'nb' ? 'Nekvėpuoja' : CAT[k][0]}">−</button><span class="sv">${s.n[k]}</span><button data-act="ts-inc" data-k="${k}" data-d="1" aria-label="Daugiau: ${k === 'nb' ? 'Nekvėpuoja' : CAT[k][0]}">+</button></div>`).join('') +
      '<div class="acts"><button class="btn dng" data-act="ts-reset">Nunulinti skaičiavimą</button></div></section>';
  }
  function flow(s) {
    const cur = s.res ? '' : s.st, fr = (id, q, sub, out) => `<div class="fr${cur === id || (id === 'q3' && cur === 'q3a') ? ' cur' : ''}"><div class="fq">${q}${sub ? '<small>' + sub + '</small>' : ''}</div><div class="fy">TAIP →</div>${out}</div>`;
    const no = '<div class="fn">NE ↓</div>';
    return '<section class="tfc" aria-label="10S triažo schema"><div class="nlh"><b>Schema</b></div>' +
      fr('q1', '1. Vaikšto?', '', '<div class="fo tp3">P3<small>gali palaukti</small></div>') + no +
      fr('q2', '2. Masyvus kraujavimas?', '', '<div class="fo tp1">P1<small>spaudimas, turniketas, tamponavimas</small></div>') + no +
      fr('q3', '3. Kalba?', 'dejuoja, murma – NE', '<div class="fo fsub">Penetruojantis sužalojimas (kaklas–sėdmenys)?<span><b class="tp1"><small>TAIP</small>P1</b><b class="tp2"><small>NE</small>P2</b></span></div>') + no +
      fr('q4', '4. Kvėpuoja?', 'atverkite kvėpavimo takus', '<div class="fo tp1">P1<small>stabili šoninė padėtis</small></div>') + no +
      '<div class="fr fend"><div class="fo tnb">NEKVĖPUOJA<small>šoninė padėtis; gaivinimas – tik jei leidžia ištekliai</small></div></div>' +
      '<p class="muted fchild">Vaikas iki 2 metų – visada P1.</p></section>';
  }
  function view() {
    const s = get(), learn = mode === 'learn';
    let h = '<h1>10S triažas</h1><p class="muted mt0">Ten Second Triage – rūšiavimas per 10 sekundžių</p>';
    shownAt = Date.now();
    h += card(s) + tally(s) + flow(s);
    if (learn) h += '<div class="card">10S triažas (Ten Second Triage, TST) – Jungtinės Karalystės civilinė masinių nelaimių rūšiavimo priemonė (NHS England, 2023), pakeitusi ankstesnį „triage sieve“. Ją taiko visų tarnybų apmokyti pirmieji reaguotojai: keli paprasti klausimai, apie 10 sekundžių vienam sužeistajam, be fiziologinių matavimų. TCCC rūšiavimas (TCCC 2026 priedas A: I etapas – skubus / neskubus, II etapas – Urgent / Priority / Routine) ir vieneto SOP galioja toliau – TST yra pagalbinė atmintinė masinei nelaimei.</div>' + '<a class="row" href="#/igudis/36"><div>TCCC rūšiavimas ir evakuacijos skubumas<small>Įgūdis #36</small></div><span class="ar">›</span></a>';
    h += '<div class="card"><b>Svarbu</b><ul class="tnotes"><li>Vaikas iki 2 metų – visada P1.</li><li>Akivaizdžiai kritinės būklės vaikštantis – pasodinkite ir laikykite nevaikštančiu.</li><li>10S triažas nenaudoja fiziologinių matavimų (pulso, KD, kapiliarų prisipildymo).</li><li>Skirta vienam vertintojui.</li><li>TST – ne vienkartinis vertinimas: kartokite, būklė keičiasi.</li></ul></div>';
    if (learn) h += '<p class="muted">Šaltiniai: NHS England, Ten Second Triage tool (2023 m. balandis); Vassallo J. et al. Ten second triage: a novel and pragmatic approach to major incident triage. Trauma 2024;26(1); NARU, TST – Non Clinical Responders Supplementary Information, v1.0 (2023).</p>' +
      '<a class="row" href="https://www.england.nhs.uk/long-read/ten-second-triage-tool/" target="_blank" rel="noopener"><div>Ten Second Triage tool<small>NHS England</small></div><span class="ar">↗</span></a>' +
      '<a class="row" href="https://doi.org/10.1177/14604086231156219" target="_blank" rel="noopener"><div>Vassallo et al., Trauma 2024<small>doi 10.1177/14604086231156219</small></div><span class="ar">↗</span></a>';
    return h;
  }
  function act(el) {
    const s = get(true), d = el.dataset, k = d.k;
    if ((d.act === 'ts-ans' || d.act === 'ts-next' || d.act === 'ts-back') && Date.now() - shownAt < 450) return;
    s.at = Date.now();
    switch (d.act) {
      case 'ts-ans': {
        if (s.res) return;
        if (k === 'child') { s.path.push({ q: s.st, a: 2 }); s.res = { c: 'p1', a: 'vaikas iki 2 metų – visada P1' }; s.n.p1 = Math.min(999, s.n.p1 + 1); if (navigator.vibrate) navigator.vibrate(40); break; }
        const q = Q[s.st], yes = k === '1', nx = yes ? q.yes : q.no;
        s.path.push({ q: s.st, a: yes ? 1 : 0 });
        if (typeof nx === 'string') s.st = nx;
        else { s.res = { c: nx.c, a: nx.a || '' }; s.n[nx.c] = Math.min(999, s.n[nx.c] + 1); if (navigator.vibrate) navigator.vibrate(40); }
        break;
      }
      case 'ts-back': {
        if (s.res) { s.n[s.res.c] = Math.max(0, s.n[s.res.c] - 1); s.res = null; }
        const p = s.path.pop(); if (p) s.st = p.q;
        break;
      }
      case 'ts-next': s.st = 'q1'; s.path = []; s.res = null; break;
      case 'ts-inc': if (!CAT[k]) return; s.n[k] = Math.max(0, Math.min(999, s.n[k] + (+d.d))); break;
      case 'ts-reset': if (!confirm('Nunulinti visą rūšiavimo skaičiavimą?')) return; s.n = def().n; break;
      default: return;
    }
    save(s);
    const y = scrollY; render(); shownAt = Date.now();
    if (d.act === 'ts-ans' || d.act === 'ts-next' || d.act === 'ts-back') { const c = app.querySelector('.tq, .tres'); if (c && c.getBoundingClientRect().top < 0) c.scrollIntoView({ block: 'start' }); else scrollTo(0, y); }
    else scrollTo(0, y);
  }
  return { view, act, status };
})();

// ───────── Treniruočių scenarijai (SC) – kodas vienodas ETC ir March giduose; duomenys – scenarijai.js ─────────
const SC = (() => {
  const KEY = TCFG.pre + 'scen';
  let cur = null; // { id, qi, pick: [], done }
  const all = () => (E.scenarijai || []).filter(s => s && Array.isArray(s.q) && s.q.length && (!s.lygis || typeof ok !== 'function' || ok(s.lygis)));
  const best = () => { const b = LS.get(KEY, {}); return b && typeof b === 'object' && !Array.isArray(b) ? b : {}; };
  const byId = id => all().find(s => s.id === id);
  const LET = ['A', 'B', 'C', 'D'];
  const TOOLS = { '#/tst': '10S triažas', '#/9line': '9-Line MEDEVAC', '#/mist': 'MIST kortelė', '#/sitrep': 'SITREP', '#/gks': 'GKS skaičiuoklė', '#/zymejimas': 'Vaistų žymėjimas', '#/nudegimai': 'Nudegimų plotas' };
  function refLabel(r) {
    let m;
    if ((m = r.match(/^#\/igudis\/(\d+)$/))) { const s = (E.igudziai || []).find(x => String(x.id) === m[1]); return s ? ['Įgūdis #' + m[1], s.pav] : null; }
    if ((m = r.match(/^#\/vaistas\/([\w-]+)$/))) { const v = (E.vaistai || []).find(x => x.id === m[1]); return v ? ['Vaistas', v.name] : null; }
    if ((m = r.match(/^#\/s\/([\w-]+)$/))) { const L = (E.sarasai || {})[m[1]]; return L ? ['Kontrolinis sąrašas', L.title] : null; }
    if ((m = r.match(/^#\/p\/([\w-]+)$/))) { const P = (E.puslapiai || {})[m[1]]; return P ? ['Mokymosi medžiaga', P.title] : null; }
    if ((m = r.match(/^#\/f\/(\w+)/))) {
      const t = (r.match(/[?&]t=(\d+)/) || [])[1], F = (E.fazes || []).find(x => x.id === m[1]);
      const lid = F && Array.isArray(F.lists) ? F.lists[t != null ? +t : 0] : null, L = lid ? (E.sarasai || {})[lid] : null;
      return [m[1] + ' – kontrolinis sąrašas', L ? L.title : (F ? F.pav : m[1])];
    }
    if (TOOLS[r]) return ['Įrankis', TOOLS[r]];
    return null;
  }
  function status() {
    const S = all(), B = best(), n = S.filter(s => B[s.id] != null).length;
    return n ? `Išspręsta ${n} iš ${S.length}` : plural(S.length, ['scenarijus', 'scenarijai', 'scenarijų']) + ' – pasitikrinkite žinias';
  }
  function list(q) {
    const S = all(), B = best(), temos = [...new Set(S.map(s => s.tema).filter(Boolean))], f = q.t || '';
    let h = '<h1>Treniruočių scenarijai</h1><p class="muted">Klinikinis atvejis keliais žingsniais: pasirinkite veiksmą – pamatysite paaiškinimą ir nuorodas į gidą. Rezultatai lieka tik šiame telefone.</p>';
    h += '<button class="btn pri" data-act="sc-rand">Atsitiktinis scenarijus</button>';
    if (temos.length > 1) h += '<div class="tabs">' + tabBtn('Visi', '#/scenarijai', !f, 1) + temos.map(t => tabBtn(t, '#/scenarijai?t=' + encodeURIComponent(t), f === t, 1)).join('') + '</div>';
    h += S.filter(s => !f || s.tema === f).map(s => {
      const b = B[s.id], n = s.q.length;
      return row('#/scenarijai/' + s.id, s.pav, [s.tema, s.lygis, plural(n, ['klausimas', 'klausimai', 'klausimų'])].filter(Boolean).join(' · '),
        b != null ? `<span class="tag ${b === n ? 'grn' : 'amb'}">${b} / ${n}</span>` : '');
    }).join('');
    return h;
  }
  function play(id) {
    const s = byId(id); if (!s) return notFound();
    if (!cur || cur.id !== id) cur = { id, qi: 0, pick: [], done: false };
    const n = s.q.length;
    let h = `<div class="scmeta">${esc([s.tema, s.lygis].filter(Boolean).join(' · '))}</div><h1>${esc(s.pav)}</h1>`;
    if (cur.done) {
      const good = s.q.filter((q, i) => q.opt[cur.pick[i]] && q.opt[cur.pick[i]].ok).length;
      h += `<section class="scres ${good === n ? 'ok' : ''}"><div class="scsc">${good} / ${n}</div><div>${good === n ? 'Puiku – visi atsakymai teisingi.' : 'Peržiūrėkite paaiškinimus ir nuorodas į gidą.'}</div></section>`;
      h += s.q.map((q, i) => { const o = q.opt[cur.pick[i]], okk = o && o.ok; return `<div class="scsum"><span class="scm ${okk ? 'ok' : 'bad'}">${okk ? '✓' : '✗'}</span><div><b>${esc(q.klaus)}</b><small>${esc((q.opt.find(x => x.ok) || {}).t || '')}</small></div></div>`; }).join('');
      h += '<div class="acts"><button class="btn pri" data-act="sc-rand">Kitas scenarijus</button><button class="btn" data-act="sc-again">Kartoti</button></div>' + row('#/scenarijai', 'Visi scenarijai', status());
      return h;
    }
    const q = s.q[cur.qi], pk = cur.pick[cur.qi], ans = pk != null;
    h += `<div class="scprog">${s.q.map((x, i) => `<i class="${i < cur.qi ? 'd' : i === cur.qi ? 'c' : ''}"></i>`).join('')}</div>`;
    h += `<section class="scq"><div class="scn">${cur.qi + 1} klausimas iš ${n}</div><p class="scsit">${esc(q.sit)}</p>`;
    const gp = Object.entries(q.gp || {});
    if (gp.length) h += '<div class="scgp">' + gp.map(([k, v]) => `<div><small>${esc(k)}</small><b>${esc(v)}</b></div>`).join('') + '</div>';
    h += `<b class="sck">${esc(q.klaus)}</b>`;
    h += q.opt.map((o, i) => `<button class="sco${ans ? (o.ok ? ' ok' : i === pk ? ' bad' : ' dim') : ''}" data-act="sc-pick" data-k="${i}"${ans ? ' disabled' : ''}><span class="scl">${ans && o.ok ? '✓' : ans && i === pk ? '✗' : LET[i]}</span><span>${esc(o.t)}</span></button>`).join('');
    if (ans) {
      const okk = q.opt[pk] && q.opt[pk].ok;
      h += `<div class="scfb ${okk ? 'ok' : 'bad'}" id="scfb"><b>${okk ? 'Teisingai.' : 'Neteisingai.'}</b> ${esc(q.why)}</div>`;
      h += (q.ref || []).map(r => { const l = refLabel(r); return l ? row(r, l[1], l[0]) : ''; }).join('');
    }
    h += '</section>';
    if (ans) h += cur.qi < n - 1 ? '<button class="btn pri" data-act="sc-next">Kitas klausimas ›</button>' : '<button class="btn pri" data-act="sc-fin">Baigti ir pamatyti rezultatą</button>';
    return h;
  }
  const view = (id, q) => id ? play(id) : list(q || {});
  function act(el) {
    const d = el.dataset, s = cur && byId(cur.id);
    switch (d.act) {
      case 'sc-pick': { if (!s || cur.pick[cur.qi] != null) return; cur.pick[cur.qi] = +d.k; render(); const f = document.getElementById('scfb'); if (f) f.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); if (navigator.vibrate) navigator.vibrate(s.q[cur.qi].opt[+d.k] && s.q[cur.qi].opt[+d.k].ok ? 15 : [30, 40, 30]); return; }
      case 'sc-next': if (!s) return; cur.qi = Math.min(cur.qi + 1, s.q.length - 1); render(); scrollTo(0, 0); return;
      case 'sc-fin': {
        if (!s) return; cur.done = true;
        const good = s.q.filter((q, i) => q.opt[cur.pick[i]] && q.opt[cur.pick[i]].ok).length, B = best();
        B[s.id] = Math.max(good, B[s.id] || 0); LS.set(KEY, B); render(); scrollTo(0, 0); return;
      }
      case 'sc-again': if (!s) return; cur = { id: s.id, qi: 0, pick: [], done: false }; render(); scrollTo(0, 0); return;
      case 'sc-rand': {
        const S = all(), B = best(); if (!S.length) return;
        const pool = S.filter(x => B[x.id] == null && (!cur || x.id !== cur.id)), P = pool.length ? pool : S.filter(x => !cur || x.id !== cur.id);
        const pickS = (P.length ? P : S)[Math.floor(Math.random() * (P.length ? P : S).length)];
        cur = { id: pickS.id, qi: 0, pick: [], done: false };
        if (location.hash === '#/scenarijai/' + pickS.id) { render(); scrollTo(0, 0); } else location.hash = '#/scenarijai/' + pickS.id;
        return;
      }
    }
  }
  return { view, act, status };
})();

// ───────── Paciento failas (PT) – kodas vienodas ETC ir March giduose ─────────
// Pacientų sąrašas = MIST kortelės (kiekviena turi pid). Kitų įrankių duomenys (TCFG.pt raktai) laikomi įprastuose raktuose
// dabartiniam pacientui; perjungus pacientą jie išsaugomi į pre+'pt'.data[pid], o naujojo – įkeliami.
const PT = (() => {
  const KEY = TCFG.pre + 'pt', MK = TCFG.pre + 'mist';
  const keys = () => (TCFG.pt || ['laikai']).map(k => TCFG.pre + k);
  const nid = () => 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const del = k => { try { localStorage.removeItem(k); } catch (e) {} };
  function store() {
    const s = LS.get(KEY, null), o = s && typeof s === 'object' && !Array.isArray(s) ? s : {};
    const obj = v => v && typeof v === 'object' && !Array.isArray(v) ? v : {};
    return { cur: typeof o.cur === 'string' ? o.cur : '', data: obj(o.data), dis: obj(o.dis) };
  }
  function sync() {
    let st; try { st = MC.state(); } catch (e) { return; }
    let ch = false; const seen = {};
    st.pts.forEach(p => { if (!p.pid || typeof p.pid !== 'string' || seen[p.pid]) { p.pid = nid(); ch = true; } seen[p.pid] = 1; });
    if (ch) LS.set(MK, st);
    const s = store(), pid = st.pts[st.cur].pid, alive = st.pts.map(p => p.pid);
    let sch = false;
    if (s.cur !== pid) {
      if (s.cur) {
        if (alive.indexOf(s.cur) >= 0) { const d = {}; keys().forEach(k => { d[k] = LS.get(k, null); }); s.data[s.cur] = d; }
        const n = s.data[pid] || {}; keys().forEach(k => { if (n[k] == null) del(k); else LS.set(k, n[k]); });
      }
      s.cur = pid; sch = true;
    }
    Object.keys(s.data).forEach(k => { if (alive.indexOf(k) < 0 || k === pid) { delete s.data[k]; sch = true; } });
    Object.keys(s.dis).forEach(k => { if (alive.indexOf(k.split(':')[1]) < 0) { delete s.dis[k]; sch = true; } });
    if (sch) LS.set(KEY, s);
    try { MC.hydrate(); } catch (e) {} // traumos laikas: laikmatis ⇄ kortelė
  }
  const get = (pid, k) => { const s = store(); return pid === s.cur ? LS.get(TCFG.pre + k, null) : ((s.data[pid] || {})[TCFG.pre + k] ?? null); };
  function list() {
    let st; try { st = MC.state(); } catch (e) { return { cur: 0, pts: [] }; }
    const raw = typeof MS !== 'undefined' ? LS.get(TCFG.pre + 'mascal', null) : null, ms = raw && Array.isArray(raw.c) ? raw.c : [];
    return { cur: st.cur, pts: st.pts.map((p, i) => { const m = ms.find(x => x && x.pid && x.pid === p.pid); return { i, pid: p.pid, card: p, label: String(p.id || '').trim() || 'Sužeistasis ' + (i + 1), cat: m ? m.k : '' }; }) };
  }
  function select(i) { const st = MC.state(); if (!(i >= 0 && i < st.pts.length)) return false; st.cur = i; LS.set(MK, st); sync(); return true; }
  function selectPid(pid) { const st = MC.state(), i = st.pts.findIndex(p => p.pid === pid); return i >= 0 && select(i); }
  function add(card) { sync(); const st = MC.state(), pid = nid(); st.pts.push(Object.assign({}, card || {}, { pid })); st.cur = st.pts.length - 1; LS.set(MK, st); sync(); return pid; }
  function dismiss(k) { const s = store(); s.dis[k] = 1; LS.set(KEY, s); }
  const dismissed = () => store().dis;
  const hmTs = s => { const m = /^(\d{1,2}):(\d{2})$/.exec(String(s || '').trim()); if (!m) return 0; const d = new Date(); d.setHours(+m[1], +m[2], 0, 0); if (d.getTime() > Date.now() + 5 * 60000) d.setDate(d.getDate() - 1); return d.getTime(); };
  const CATC = { T1: 'msT1', T2: 'msT2', T3: 'msT3', T4: 'msT4', X: 'msX' };
  const due = pid => { try { return typeof REM !== 'undefined' ? REM.items(pid).length : 0; } catch (e) { return 0; } };
  const chipLbl = p => (p.cat ? `<span class="ptc ${CATC[p.cat] || ''}">${p.cat === 'X' ? '✝' : esc(p.cat)}</span>` : '') + '#' + (p.i + 1) + (p.card.id ? ' ' + esc(String(p.card.id).slice(0, 14)) : '') +
    (due(p.pid) ? '<i class="ptdue" aria-hidden="true"></i>' : '');
  function bar() {
    sync(); const L = list(); if (!L.pts.length) return '';
    return '<div class="ptbar" role="tablist" aria-label="Pacientai">' + L.pts.map(p => `<button role="tab" aria-selected="${p.i === L.cur}" class="${p.i === L.cur ? 'on' : ''}" data-act="pt-sel" data-k="${p.i}"${due(p.pid) ? ` aria-label="${esc('#' + (p.i + 1) + (p.card.id ? ' ' + String(p.card.id).slice(0, 14) : '') + ' – yra priminimų')}"` : ''}>${chipLbl(p)}</button>`).join('') +
      '<button class="add" data-act="pt-new" aria-label="Kitas sužeistasis" title="Kitas sužeistasis">+</button><a class="ptf" href="#/pacientas" aria-label="Paciento failas">Failas ›</a></div>';
  }
  // Ką tik pridėtas sužeistasis – „Atšaukti“ (jei dar nepildytas): pašalinamas, grįžtama prie ankstesnio
  function added(prev) {
    const L = list(), n = L.pts.length, pid = (L.pts[n - 1] || {}).pid;
    toastAct('Pridėtas #' + n, 'Atšaukti', () => {
      const st = MC.state(), i = st.pts.findIndex(p => p.pid === pid), c = st.pts[i], la = get(pid, 'laikai') || {};
      if (i < 1 || MC.used(c) || la.trauma || la.turn) { toast('Jau pildoma – neatšaukta'); return; }
      st.pts.splice(i, 1); st.cur = Math.max(0, Math.min(prev, st.pts.length - 1)); LS.set(MK, st); sync(); render(); toast('Atšaukta');
    });
  }
  // Pradžios ekranui: kuris pacientas dabartinis
  function homeRow() {
    const L = list(), p = L.pts[L.cur]; if (!p) return '';
    const n = events(p.pid).length;
    return row('#/pacientas', 'Paciento failas: ' + p.label + (L.pts.length > 1 ? ' (#' + (p.i + 1) + ' iš ' + L.pts.length + ')' : ''), n ? plural(n, ['įvykis', 'įvykiai', 'įvykių']) + ' · perduoti, QR' : 'Visi įrankiai – šiam pacientui');
  }
  function events(pid) {
    const L = list(), p = L.pts.find(x => x.pid === pid); if (!p) return [];
    const c = p.card, ev = [], put = (t, x) => { if (t && x) ev.push([t, x]); };
    const la = get(pid, 'laikai') || {};
    put(+la.trauma || MC.trTs(c) || hmTs(c.t0), 'Trauma' + ((c.mech || []).length ? ' – ' + c.mech.join(', ').toLowerCase() : ''));
    const tqs = c.tq && typeof c.tq === 'object' ? Object.keys(c.tq).filter(k => c.tq[k] && c.tq[k].on && hmTs(c.tq[k].tm)) : [];
    if (tqs.length) tqs.forEach(k => put(hmTs(c.tq[k].tm), 'Turniketas – ' + MC.tqName(k))); else put(+la.turn || hmTs(c.tqT), 'Turniketas');
    const z = get(pid, 'vz'), ze = z && Array.isArray(z.e) ? z.e : [];
    const rw = (c.rows || []).filter(r => r && !/^(vz:|kr)/.test(String(r.src || '')) && hmTs(r.time));
    rw.forEach(r => put(hmTs(r.time), [r.name, r.dose, r.route].map(x => String(x || '').trim()).filter(Boolean).join(' ')));
    if (c.txaT && !ze.some(e => e && e.v === 'txa') && !rw.some(r => /\btxa\b|tranek/i.test(r.name))) put(hmTs(c.txaT), 'TXA');
    (c.vit || []).forEach(v => put(hmTs(v.ts), MC.vitLine(v).replace(/^[^–]*–\s*/, '')));
    if (typeof VZ !== 'undefined') ze.forEach(e => { if (e && +e.t && e.v) put(+e.t, VZ.desc(Object.assign({ a: '', u: '', r: '', n: '' }, e))); });
    const w = get(pid, 'wbb');
    if (w && typeof w === 'object') { put(+w.t1, 'Kraujo transfuzija – paėmimas'); put(+w.t2, 'Kraujo transfuzija – perpylimas' + (w.don || w.donG ? ' (donoras ' + [w.don, w.donG].filter(Boolean).join(' ') + ')' : '')); }
    return ev.sort((a, b) => a[0] - b[0]);
  }
  // Perdavimo priedai prie MIST teksto (dabartinis pacientas): vaistai, dar neperkelti į kortelę (perkelti jau yra C lentelėje – nekartojama), nudegimai, kraujo transfuzija
  function extras(en) {
    const out = [];
    if (typeof VZ !== 'undefined') { const e = VZ.get().e.filter(x => !x.x); if (e.length) out.push((en ? 'MEDICATIONS (not yet on the card)' : 'SULEISTI VAISTAI (dar ne kortelėje)') + '\n' + e.map(x => hm(x.t) + ' ' + VZ.desc(x)).join('\n')); }
    if (typeof NB !== 'undefined' && NB.total()) out.push((en ? 'BURNS: ' : 'NUDEGIMAI: ') + NB.status());
    const w = LS.get(TCFG.pre + 'wbb', null);
    if (w && (w.t1 || w.t2 || w.don)) out.push((en ? 'BLOOD TRANSFUSION (fresh whole blood): ' : 'KRAUJO TRANSFUZIJA: ') + [w.don || w.donG ? (en ? 'donor ' : 'donoras ') + [w.don, w.donG].filter(Boolean).join(' ') : '', w.t1 ? (en ? 'collected ' : 'paėmimas ') + hm(w.t1) : '', w.t2 ? (en ? 'transfusion from ' : 'perpylimas nuo ') + hm(w.t2) : ''].filter(Boolean).join(', '));
    return out.join('\n\n');
  }
  function text() {
    sync(); const L = list(), p = L.pts[L.cur]; if (!p) return '';
    const en = typeof outEn === 'function' && outEn();
    return [MC.curText(en), extras(en)].filter(Boolean).join('\n\n');
  }
  function view() {
    sync(); const L = list(), p = L.pts[L.cur]; if (!p) return notFound();
    const la = LS.get(TCFG.laikai, {}) || {}, ev = events(p.pid);
    let h = bar().replace(/<a class="ptf"[^>]*>[^<]*<\/a>/, '') + `<h1>${esc(p.label)}</h1><p class="muted">Pacientas #${p.i + 1}${la.trauma ? ' · sužeistas ' + hm(la.trauma) + ' (prieš ' + Math.max(0, Math.round((Date.now() - la.trauma) / 60000)) + ' min)' : ''}${p.cat ? ' · ' + p.cat : ''}</p>`;
    h += typeof REM !== 'undefined' ? REM.banners(p.pid) : '';
    const tile = (r, t, s) => `<a class="ptt" href="${r}"><small>${esc(t)}</small><b>${esc(s)}</b></a>`;
    h += '<div class="pttiles">' + tile('#/mist', 'MIST', MC.status()) +
      (typeof VZ !== 'undefined' ? tile('#/zymejimas', 'Vaistai', VZ.status()) : tile('#/9line', '9-Line', NL.status())) +
      (typeof NB !== 'undefined' ? tile('#/nudegimai', 'Nudegimai', NB.status()) : '') +
      (typeof KR !== 'undefined' ? tile('#/pilnas-kraujas', 'Kraujo transfuzija', KR.status()) : '') + '</div>';
    h += '<h2>Įvykių eiga</h2>' + (ev.length ? '<div class="ptev">' + ev.map(([t, x]) => `<div><b>${hm(t)}</b><span>${esc(x)}</span></div>`).join('') + '</div>' : '<p class="muted">Įvykių dar nėra: pažymėkite laikus (Pradžia → Laikai), MIST požymius' + (typeof VZ !== 'undefined' ? ', suleistus vaistus' : '') + '.</p>');
    h += '<div class="acts"><button class="btn pri" data-act="go" data-r="#/qr">Perduoti QR kodu</button><button class="btn" data-act="pt-read">Skaityti perduodant</button><button class="btn" data-act="pt-copy">Kopijuoti viską</button></div>';
    h += row('#/qr-priimti', 'Priimti pacientą QR kodu', 'Nuskaityti kito telefono kodą') + row('#/mist', 'MIST kortelė', 'Sužeistųjų tvarkymas, šalinimas');
    if (mode === 'learn') h += '<p class="muted">Viršuje – pacientų juosta: pasirinktas pacientas galioja visiems įrankiams (MIST, laikai, sąrašų žymėjimai' + (typeof VZ !== 'undefined' ? ', vaistai, nudegimai, šviežias kraujas' : '') + '). „+“ – naujas pacientas, ankstesni lieka sąraše.</p>';
    if (typeof OP !== 'undefined') h += '<button class="btn dng" data-act="op-wipe" style="width:100%;margin-top:14px">Ištrinti visų sužeistųjų duomenis</button>';
    return h;
  }
  function act(el) {
    const d = el.dataset, y = scrollY;
    switch (d.act) {
      case 'pt-sel': if (select(+d.k)) { render(); scrollTo(0, y); } return;
      case 'pt-new': { const prev = list().cur; add(); render(); scrollTo(0, 0); added(prev); return; }
      case 'pt-copy': return copyText(text());
      case 'pt-read': return readMode('Paciento perdavimas', text().split('\n').filter(x => x.trim()).map(x => esc(x)));
    }
  }
  return { sync, get, list, select, selectPid, add, added, bar, homeRow, events, text, extras, view, act, dismiss, dismissed, hmTs };
})();

// ───────── Priminimai (REM): turniketo peržiūra, TXA riba, kartotinės dozės, gyvybės požymiai ─────────
const REM = (() => {
  const VK = TCFG.pre + 'remvit', NK = TCFG.pre + 'rem-n';
  const mm = ms => Math.round(ms / 60000);
  const dur = m => m >= 60 ? Math.floor(m / 60) + ' val. ' + String(m % 60).padStart(2, '0') + ' min' : m + ' min';
  const LV = { r: 0, a: 1, i: 2 };
  // „Atidaryti“ → paciento ekranas su atitinkamu langu (sh – MC.sheet rūšis, d – vaistas); TXA – CMC (March „tik CLS“ – nerodoma)
  const GO = '#/pacientas?sh=';
  const txaOk = () => typeof ok !== 'function' || ok('CMC');
  function items(only) {
    const L = PT.list(), now = Date.now(), dis = PT.dismissed(), out = [], vitN = +LS.get(VK, 0) || 0;
    L.pts.forEach(p => {
      if (only && p.pid !== only) return;
      const c = p.card, la = PT.get(p.pid, 'laikai') || {}, who = L.pts.length > 1 && !only ? p.label + ' · ' : '';
      const push = (key, lvl, title, sub, go) => { if (!dis[key]) out.push({ key, lvl, title, sub: who + sub, go, pid: p.pid }); };
      const tq = +la.turn || PT.hmTs(c.tqT) || 0;
      if (tq) { const left = mm(tq + 2 * 3600e3 - now); if (left <= 15) push('tq:' + p.pid + ':' + tq, left <= 0 ? 'r' : 'a', 'Turniketas – peržiūra', 'uždėtas ' + hm(tq) + ' · ' + (left <= 0 ? 'prieš ' + dur(mm(now - tq)) : 'liko ' + left + ' min'), GO + 'tq'); }
      const z = PT.get(p.pid, 'vz'), ze = z && Array.isArray(z.e) ? z.e : [];
      const txa = (c.tx || []).indexOf('txa') >= 0 || !!c.txaT || ze.some(e => e && e.v === 'txa'), tr = +la.trauma || MC.trTs(c) || 0;
      if (tr && !txa && txaOk()) { const left = mm(tr + 3 * 3600e3 - now); if (left <= 60 && left > -60) push('txa:' + p.pid + ':' + tr, left <= 0 ? 'r' : 'a', left <= 0 ? 'TXA – 3 val. riba praėjo' : 'TXA – iki 3 val. ribos', 'trauma ' + hm(tr) + (left > 0 ? ' · liko ' + dur(left) : ''), GO + 'rx&d=txa'); }
      if (typeof VZ !== 'undefined') {
        const last = {}; ze.forEach(e => { if (e && e.v && +e.t && (!last[e.v] || +e.t > +last[e.v].t)) last[e.v] = e; });
        Object.keys(last).forEach(id => { const e = last[id], iv = VZ.interval(e.v, e.r); if (!iv || now - e.t > 24 * 3600e3 || now < +e.t + iv * 60000) return;
          push('rx:' + p.pid + ':' + e.v + ':' + e.t, 'a', VZ.name(e.v).replace(/ \(.*\)$/, '') + ' – galima kartoti', 'paskutinė ' + hm(+e.t) + ' (prieš ' + dur(mm(now - e.t)) + ') · kas ' + (iv >= 60 ? iv / 60 + ' val.' : iv + ' min'), GO + 'rx&d=' + encodeURIComponent(e.v)); });
      }
      if (vitN) { const vs = (c.vit || []).map(v => PT.hmTs(v.ts)).filter(Boolean), lt = vs.length ? Math.max(...vs) : 0;
        if (lt && now - lt >= vitN * 60000) push('vit:' + p.pid + ':' + lt, 'i', 'Gyvybės požymiai – pakartoti', 'paskutiniai ' + hm(lt) + ' (prieš ' + dur(mm(now - lt)) + ')', GO + 'vit'); }
    });
    return out.sort((a, b) => LV[a.lvl] - LV[b.lvl]);
  }
  const CLOCK = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/></svg>';
  function banners(only) {
    let it; try { it = items(only); } catch (e) { return ''; }
    return it.map(x => `<div class="rem rem-${x.lvl}" role="status">${CLOCK}<div class="remt"><b>${esc(x.title)}</b><small>${esc(x.sub)}</small></div><button class="remb" data-act="rem-go" data-k="${esc(x.pid)}" data-r="${esc(x.go)}">Atidaryti</button><button class="remx" data-act="rem-x" data-k="${esc(x.key)}" aria-label="Atlikta – paslėpti">✓</button></div>`).join('');
  }
  function settings() {
    const v = +LS.get(VK, 0) || 0;
    return '<h2>Priminimai</h2><p class="muted">Turniketo peržiūra (2 val.), TXA riba (3 val. nuo traumos)' + (typeof VZ !== 'undefined' ? ' ir kartotinės dozės pagal gidą' : '') + ' primenamos visada. Gyvybės požymių pakartojimas:</p>' +
      '<div class="seg2">' + [[0, 'Išjungta'], [5, '5 min'], [15, '15 min'], [30, '30 min']].map(([k, t]) => `<button class="${v === k ? 'on' : ''}" data-act="rem-vit" data-k="${k}" aria-pressed="${v === k}">${t}</button>`).join('') + '</div>' +
      '<p class="muted">Priminimas – juosta ir paciento failas, vibracija. Veikia, kol programėlė atidaryta' + (/iPhone|iPad/.test(navigator.userAgent) ? ' (iPhone – tik atidarius)' : ' ar veikia fone') + '.</p>';
  }
  function act(el) {
    const d = el.dataset;
    switch (d.act) {
      case 'rem-x': PT.dismiss(d.k); { const y = scrollY; render(); scrollTo(0, y); } return;
      case 'rem-go': PT.selectPid(d.k); if (location.hash === d.r) { render(); if (typeof HUB !== 'undefined' && HUB.after) HUB.after(); } else location.hash = d.r; return;
      case 'rem-vit': LS.set(VK, +d.k || 0); { const y = scrollY; render(); scrollTo(0, y); } return;
    }
  }
  function tick() {
    let due; try { due = items(); } catch (e) { return; }
    const seen = LS.get(NK, []) || [], nk = x => x.key + ':' + x.lvl; // pasikeitus lygiui (liko 15 min → laikas) – primenama dar kartą
    const fresh = due.filter(x => seen.indexOf(nk(x)) < 0);
    try { if (navigator.setAppBadge) { if (due.length) navigator.setAppBadge(due.length); else navigator.clearAppBadge(); } } catch (e) {}
    if (!fresh.length) return;
    LS.set(NK, seen.concat(fresh.map(nk)).slice(-200));
    if (navigator.vibrate) navigator.vibrate([250, 120, 250]);
    toast('⏰ ' + fresh[0].title);
    const r = route().p[0], ae = document.activeElement;
    if ((r === undefined || r === 'pacientas') && !(ae && /INPUT|TEXTAREA/.test(ae.tagName)) && !tmEdit) { const y = scrollY; render(); scrollTo(0, y); }
  }
  return { items, banners, settings, act, tick };
})();

// ───────── Perdavimas QR kodu (QR): siųsti ir priimti be interneto ─────────
const QR = (() => {
  const APP = TCFG.pre === 'etc-' ? 'etc' : 'march', CH = 260, PRE = 'EG1';
  let sel = null, frames = [], fi = 0, tmr = 0, wl = null, stream = null, loop = 0, rx = null, got = null, err = '', busy = false;
  const PARTS = () => [['m', 'MIST ir laikai']].concat(typeof VZ !== 'undefined' ? [['z', 'Vaistai']] : [], typeof NB !== 'undefined' ? [['n', 'Nudegimai']] : [], typeof KR !== 'undefined' ? [['w', 'Kraujo transfuzija']] : [], [['9', '9-Line']]);
  const has = k => {
    if (k === 'm') return true;
    if (k === 'z') return typeof VZ !== 'undefined' && VZ.get().e.length > 0;
    if (k === 'n') return typeof NB !== 'undefined' && NB.total() > 0;
    if (k === 'w') { const w = LS.get(TCFG.pre + 'wbb', null); return !!(w && (w.t1 || w.t2 || w.don || (w.ck && Object.keys(w.ck).length))); }
    return false;
  };
  function payload() {
    PT.sync(); const st = MC.state(), c = Object.assign({}, st.pts[st.cur]); delete c.pid;
    const L = PT.list(), me = L.pts[L.cur], o = { v: 1, a: APP, t: Date.now() };
    if (sel.m) { o.m = c; const la = LS.get(TCFG.laikai, null); if (la && (la.trauma || la.turn)) o.lk = { trauma: +la.trauma || 0, turn: +la.turn || 0 }; if (me && me.cat) o.c = me.cat; const kg = +LS.get(TCFG.pre + 'svoris', 0); if (kg > 0) o.kg = kg; }
    if (sel.z && typeof VZ !== 'undefined') o.z = VZ.get().e.map(e => ({ id: e.id, t: e.t, v: e.v, a: e.a, u: e.u, r: e.r, n: e.n }));
    if (sel.n) o.n = LS.get(TCFG.pre + 'nb', null);
    if (sel.w) o.w = LS.get(TCFG.pre + 'wbb', null);
    if (sel['9']) o['9'] = LS.get(TCFG.pre + '9line', null);
    return o;
  }
  const b64 = u8 => { let s = ''; for (let i = 0; i < u8.length; i += 8192) s += String.fromCharCode.apply(null, u8.subarray(i, i + 8192)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  const unb64 = s => { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; const b = atob(s), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; };
  async function pipe(u8, T) { const r = new Response(new Blob([u8]).stream().pipeThrough(new T('deflate-raw'))); return new Uint8Array(await r.arrayBuffer()); }
  async function encode(o) {
    const raw = new TextEncoder().encode(JSON.stringify(o));
    let flag = 'j', data = raw;
    if (typeof CompressionStream !== 'undefined') { try { data = await pipe(raw, CompressionStream); flag = 'z'; } catch (e) { data = raw; flag = 'j'; } }
    const s = b64(data), n = Math.max(1, Math.ceil(s.length / CH)), id = flag + Math.random().toString(36).slice(2, 5);
    return Array.from({ length: n }, (x, i) => `${PRE}:${id}:${i + 1}/${n}:${s.slice(i * CH, (i + 1) * CH)}`);
  }
  async function decode(id, s) {
    let u8 = unb64(s);
    if (id[0] === 'z') { if (typeof DecompressionStream === 'undefined') throw new Error('Šis telefonas negali išskleisti duomenų – atnaujinkite naršyklę'); u8 = await pipe(u8, DecompressionStream); }
    if (u8.length > 200000) throw new Error('Per daug duomenų');
    const o = JSON.parse(new TextDecoder().decode(u8));
    if (!o || o.v !== 1 || typeof o !== 'object') throw new Error('Netinkamas kodas');
    return o;
  }
  function svg(str) {
    if (typeof qrcode === 'undefined') return '<p class="muted">QR biblioteka neįkelta.</p>';
    const q = qrcode(0, 'M'); q.addData(str, 'Byte'); q.make();
    return q.createSvgTag({ cellSize: 4, margin: 3, scalable: true });
  }
  function loadLib(src, test) { return new Promise((res, rej) => { if (test()) return res(); const s = document.createElement('script'); s.src = src; s.onload = () => res(); s.onerror = () => rej(new Error('Nepavyko įkelti ' + src)); document.head.appendChild(s); }); }
  function stopAll() {
    clearInterval(tmr); tmr = 0; clearInterval(loop); loop = 0;
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    if (wl) { try { wl.release(); } catch (e) {} wl = null; }
  }
  // ── siųsti ──
  function sendView() {
    PT.sync(); const L = PT.list(), p = L.pts[L.cur];
    if (!sel) { sel = {}; PARTS().forEach(([k]) => { sel[k] = has(k); }); }
    let h = PT.bar().replace(/<a class="ptf"[^>]*>[^<]*<\/a>/, '') + '<h1>Perduoti QR kodu</h1>';
    h += `<p class="muted">${esc(p ? p.label : '')}${p && p.cat ? ' · ' + esc(p.cat) : ''} · be interneto</p>`;
    h += '<div class="opts">' + PARTS().map(([k, t]) => chip('qr-p', k, !!sel[k], (sel[k] ? '✓ ' : '') + esc(t)) + '').join('') + '</div>';
    h += '<div class="qrbox" id="qrbox" aria-label="QR kodas"><p class="muted">Ruošiama…</p></div><div class="qrn" id="qrn"></div>';
    h += '<section class="krc"><b>Kaip priimti</b><p class="muted" style="margin:4px 0 0">Kitame telefone atidarykite ETC ar March gidą → Paciento failas → <b>Priimti pacientą QR kodu</b> ir nukreipkite kamerą. Jei kodų keli – jie keičiasi patys, laikykite kamerą, kol bus nuskaityti visi. Padidinkite šio ekrano ryškumą.</p></section>';
    h += '<div class="acts"><button class="btn" data-act="pt-read">Skaityti vietoje</button><button class="btn" data-act="pt-copy">Kopijuoti tekstą</button></div>';
    h += '<p class="muted">Kode – tik tai, kas pažymėta. Vardo, pavardės ar asmens kodo nėra – tik šaukinys / ID, jei įrašytas.</p>';
    return h;
  }
  async function startSend() {
    const box = document.getElementById('qrbox'); if (!box) return;
    try {
      await loadLib('vendor/qrcode.min.js', () => typeof qrcode !== 'undefined');
      frames = await encode(payload()); fi = 0;
      const show = () => { const b = document.getElementById('qrbox'), n = document.getElementById('qrn'); if (!b || route().p[0] !== 'qr') { stopAll(); return; } b.innerHTML = svg(frames[fi]); if (n) n.textContent = frames.length > 1 ? 'Kodas ' + (fi + 1) + ' iš ' + frames.length + ' – keičiasi automatiškai' : '1 kodas'; fi = (fi + 1) % frames.length; };
      show(); clearInterval(tmr); if (frames.length > 1) tmr = setInterval(show, 900);
      try { if (navigator.wakeLock) wl = await navigator.wakeLock.request('screen'); } catch (e) {}
    } catch (e) { box.innerHTML = '<p class="muted">Nepavyko sukurti kodo: ' + esc(e.message || e) + '</p>'; }
  }
  // ── priimti ──
  function recvView() {
    let h = '<h1>Priimti QR kodą</h1>';
    if (got) {
      const o = got, m = o.m || {}, lines = [];
      if (o.m) lines.push('MIST: ' + [(m.mech || []).join(', '), (m.mk || []).length ? (m.mk.length) + ' žymės' : '', (m.vit || []).length ? m.vit.length + ' matav.' : '', (m.tx || []).length ? m.tx.length + ' gydymo veiksmai' : ''].filter(Boolean).join(' · '));
      if (o.lk && o.lk.trauma) lines.push('Sužeistas ' + hm(o.lk.trauma) + (o.lk.turn ? ' · turniketas ' + hm(o.lk.turn) : ''));
      if (Array.isArray(o.z) && o.z.length) lines.push('Vaistai: ' + o.z.slice(0, 4).map(e => { const v = (E.vaistai || []).find(x => x.id === e.v); return (v ? v.name.replace(/ \(.*\)$/, '') : e.v) + ' ' + [e.a, e.u].filter(Boolean).join(' ') + ' ' + hm(+e.t); }).join(' · ') + (o.z.length > 4 ? ' …' : ''));
      if (o.n && o.n.r) lines.push('Nudegimai: pažymėta');
      if (o.w && (o.w.t1 || o.w.t2)) lines.push('Kraujo transfuzija' + (o.w.t2 ? ' – perpylimas ' + hm(o.w.t2) : ''));
      if (o['9']) lines.push('9-Line forma');
      h += `<section class="krc"><b style="font-size:17px">Gauta: ${esc(m.id || 'be ID')}${o.c ? ' · ' + esc(o.c) : ''}</b><p class="muted" style="margin:4px 0 0">Iš ${o.a === 'march' ? 'March' : 'ETC'} gido · ${hm(+o.t || Date.now())}</p><div class="qrl">${lines.map(x => '<div>' + esc(x) + '</div>').join('')}</div></section>`;
      h += '<button class="btn pri" data-act="qr-new">Įrašyti kaip naują pacientą</button><div class="acts"><button class="btn" data-act="qr-merge">Papildyti dabartinį</button><button class="btn" data-act="qr-cancel">Atmesti</button></div>';
      return h;
    }
    h += '<div class="qrcam"><video id="qrv" playsinline muted></video><div class="qrfr"></div><div class="qrst" id="qrst">' + (err ? esc(err) : 'Įjungiama kamera…') + '</div></div>';
    h += '<div class="qrprog" id="qrprog"></div>';
    h += '<p class="muted">Nukreipkite kamerą į kito telefono QR kodą. Kamera naudojama tik nuskaitymui, vaizdas nesaugomas.</p>';
    return h;
  }
  function onText(t) {
    const m = /^EG1:([a-z0-9]{4}):(\d+)\/(\d+):([A-Za-z0-9_-]*)$/.exec(t || ''); if (!m) return;
    const [, id, k, n] = m, part = m[4];
    if (!rx || rx.id !== id) rx = { id, n: +n, p: {} };
    if (+n !== rx.n || +k < 1 || +k > rx.n) return;
    rx.p[k] = part;
    const cnt = Object.keys(rx.p).length, pr = document.getElementById('qrprog'), st = document.getElementById('qrst');
    if (pr) pr.innerHTML = Array.from({ length: rx.n }, (x, i) => `<i class="${rx.p[i + 1] ? 'd' : ''}"></i>`).join('');
    if (st) st.textContent = rx.n > 1 ? 'Nuskaityta ' + cnt + ' iš ' + rx.n + ' kodų…' : 'Nuskaityta';
    if (cnt === rx.n && !busy) {
      busy = true; const s = Array.from({ length: rx.n }, (x, i) => rx.p[i + 1]).join('');
      stopAll(); if (navigator.vibrate) navigator.vibrate(60);
      decode(rx.id, s).then(o => { got = o; rx = null; busy = false; render(); }).catch(e => { err = e.message || 'Klaida'; rx = null; busy = false; render(); });
    }
  }
  async function startRecv() {
    const v = document.getElementById('qrv'); if (!v || got || stream) return;
    const st = document.getElementById('qrst');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('Šioje naršyklėje kamera nepasiekiama');
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      if (route().p[0] !== 'qr-priimti') { stopAll(); return; }
      v.srcObject = stream; await v.play(); if (st) st.textContent = err ? err : 'Ieškoma kodo…'; err = '';
      let det = null;
      if ('BarcodeDetector' in window) { try { const f = await BarcodeDetector.getSupportedFormats(); if (f.indexOf('qr_code') >= 0) det = new BarcodeDetector({ formats: ['qr_code'] }); } catch (e) {} }
      if (!det) await loadLib('vendor/jsqr.min.js', () => typeof jsQR !== 'undefined');
      const cv = document.createElement('canvas'), cx = cv.getContext('2d', { willReadFrequently: true });
      let run = false;
      loop = setInterval(async () => {
        if (run || !stream || v.readyState < 2) return; run = true;
        try {
          if (det) { const r = await det.detect(v); r.forEach(x => onText(x.rawValue)); }
          else { const w = Math.min(720, v.videoWidth), hh = Math.round(v.videoHeight * w / v.videoWidth); cv.width = w; cv.height = hh; cx.drawImage(v, 0, 0, w, hh); const im = cx.getImageData(0, 0, w, hh), r = jsQR(im.data, w, hh, { inversionAttempts: 'dontInvert' }); if (r) onText(r.data); }
        } catch (e) {}
        run = false;
      }, 180);
    } catch (e) {
      stopAll();
      const msg = e && e.name === 'NotAllowedError' ? 'Kamera neleidžiama – leiskite naršyklės nustatymuose' : (e && e.message) || 'Kamera nepasiekiama';
      if (st) st.textContent = msg;
    }
  }
  function cleanCard(m) { const c = Object.assign({}, m && typeof m === 'object' && !Array.isArray(m) ? m : {}); delete c.pid; return c; }
  function zText(z) { return (z || []).map(e => { const v = (E.vaistai || []).find(x => x.id === e.v); return [(v ? v.name.replace(/ \(.*\)$/, '') : e.v), e.a, e.u, e.r, hm(+e.t)].filter(Boolean).join(' '); }).join('; '); }
  function importNew(o) {
    const c = cleanCard(o.m);
    if (typeof VZ === 'undefined' && Array.isArray(o.z) && o.z.length) c.txTxt = [String(c.txTxt || '').trim(), 'Vaistai: ' + zText(o.z)].filter(Boolean).join('; ');
    PT.add(c);
    if (o.lk && typeof o.lk === 'object') { const la = {}; if (+o.lk.trauma) la.trauma = +o.lk.trauma; if (+o.lk.turn) la.turn = +o.lk.turn; LS.set(TCFG.laikai, la); }
    if (+o.kg > 0 && +o.kg < 400) LS.set(TCFG.pre + 'svoris', +o.kg); // paciento svoris (naujas pacientas jau dabartinis)
    if (typeof VZ !== 'undefined' && Array.isArray(o.z)) LS.set(TCFG.pre + 'vz', { e: o.z });
    if (typeof NB !== 'undefined' && o.n && typeof o.n === 'object') LS.set(TCFG.pre + 'nb', o.n);
    if (typeof KR !== 'undefined' && o.w && typeof o.w === 'object') LS.set(TCFG.pre + 'wbb', o.w);
    if (o['9'] && typeof o['9'] === 'object' && confirm('Kode yra ir 9-Line forma. Perrašyti savo 9-Line formą gautais duomenimis?')) LS.set(TCFG.pre + '9line', o['9']);
    if (o.c && typeof MS !== 'undefined') MS.link(PT.list().pts[PT.list().cur].pid, o.c, c.id);
  }
  function merge(o) {
    PT.sync(); const st = MC.state(), c = st.pts[st.cur], m = cleanCard(o.m);
    ['id', 'name', 'sex', 'dob', 'unit', 'country', 'allerg', 'dt', 't0', 'mechTxt', 'injTxt', 'sympt', 'evac', 'pos', 'tqT', 'txaT'].forEach(k => { if (!c[k] && m[k]) c[k] = String(m[k]); });
    let tt = String(m.txTxt || ''); if (typeof VZ === 'undefined' && Array.isArray(o.z) && o.z.length) tt = [tt, 'Vaistai: ' + zText(o.z)].filter(Boolean).join('; ');
    if (tt && String(c.txTxt || '').indexOf(tt) < 0) c.txTxt = [String(c.txTxt || '').trim(), tt].filter(Boolean).join('; ');
    const uni = (a, b) => a.concat((Array.isArray(b) ? b : []).filter(x => typeof x === 'string' && a.indexOf(x) < 0));
    c.mech = uni(c.mech, m.mech); c.tx = uni(c.tx, m.tx); c.nat = uni(c.nat || [], m.nat);
    if (m.tq && typeof m.tq === 'object' && !Array.isArray(m.tq)) c.tq = Object.assign({}, m.tq, c.tq || {});
    const k3 = x => [x.g, x.name, x.dose, x.route, x.time].join('|'); c.rows = Array.isArray(c.rows) ? c.rows : [];
    (Array.isArray(m.rows) ? m.rows : []).forEach(x => { if (x && typeof x === 'object' && !c.rows.some(y => k3(y) === k3(x) || (x.src && y.src === x.src))) c.rows.push(x); });
    c.resp = [0, 1].map(i => (c.resp || [])[i] || String((Array.isArray(m.resp) ? m.resp : [])[i] || ''));
    const k1 = x => [x.t, x.s, Math.round(x.x), Math.round(x.y)].join('|'), k2 = x => JSON.stringify(x);
    c.mk = c.mk.concat((Array.isArray(m.mk) ? m.mk : []).filter(x => x && !c.mk.some(y => k1(y) === k1(x))));
    c.vit = c.vit.concat((Array.isArray(m.vit) ? m.vit : []).filter(x => x && !c.vit.some(y => k2(y) === k2(x))));
    LS.set(TCFG.pre + 'mist', st);
    const la = LS.get(TCFG.laikai, {}) || {}; if (o.lk) { if (!la.trauma && +o.lk.trauma) la.trauma = +o.lk.trauma; if (!la.turn && +o.lk.turn) la.turn = +o.lk.turn; } LS.set(TCFG.laikai, la);
    if (+o.kg > 0 && +o.kg < 400 && !(+LS.get(TCFG.pre + 'svoris', 0) > 0)) LS.set(TCFG.pre + 'svoris', +o.kg);
    if (typeof VZ !== 'undefined' && Array.isArray(o.z)) { const cur = VZ.get().e; LS.set(TCFG.pre + 'vz', { e: cur.concat(o.z.filter(e => e && !cur.some(x => x.id === e.id))) }); }
    if (typeof NB !== 'undefined' && o.n && !NB.total()) LS.set(TCFG.pre + 'nb', o.n);
    if (typeof KR !== 'undefined' && o.w) { const w = LS.get(TCFG.pre + 'wbb', null); if (!w || !(w.t1 || w.t2 || w.don)) LS.set(TCFG.pre + 'wbb', o.w); }
  }
  function view(r) { return r === 'qr' ? sendView() : recvView(); }
  function after(r) { if (r === 'qr') startSend(); else if (r === 'qr-priimti') startRecv(); else stopAll(); }
  function act(el) {
    const d = el.dataset;
    switch (d.act) {
      case 'qr-p': if (d.k === 'm') return toast('MIST siunčiama visada'); sel[d.k] = !sel[d.k]; { const y = scrollY; render(); scrollTo(0, y); } return;
      case 'qr-new': if (!got) return; importNew(got); got = null; toast('Pacientas įrašytas'); location.hash = '#/pacientas?t=apz'; return; // apžvalga – gauti duomenys iškart matomi
      case 'qr-merge': if (!got) return; if (!confirm('Papildyti dabartinį pacientą gautais duomenimis?')) return; merge(got); got = null; toast('Papildyta'); location.hash = '#/pacientas?t=apz'; return;
      case 'qr-cancel': got = null; err = ''; rx = null; render(); return;
    }
  }
  // Testams: be kameros perduoti nuskaitytą tekstą
  return { view, after, act, stopAll, encode, decode, onText, payload, reset: () => { sel = null; got = null; rx = null; err = ''; } };
})();

// ───────── Balso diktavimas (DICT): mikrofono mygtukas prie tekstinių laukų ─────────
const DICT = (() => {
  const SRc = window.SpeechRecognition || window.webkitSpeechRecognition;
  const SEL = 'textarea.inp, [data-dict], input[data-mc="mechTxt"], input[data-mc="injTxt"], input[data-mc="txTxt"], input[data-vz="n"], input[data-ms="nt"], input[data-sr="comTxt"], input[data-sr="reqTxt"], input[data-sr="enTxt"]';
  const MIC = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
  let rec = null, btn = null;
  function stop() { if (rec) { try { rec.stop(); } catch (e) {} } }
  function start(el, b) {
    if (rec) { stop(); return; }
    const r = new SRc(); r.lang = 'lt-LT'; r.interimResults = true; r.continuous = false; r.maxAlternatives = 1;
    const base = el.value.replace(/\s+$/, ''), sep = base ? ' ' : '';
    r.onresult = ev => {
      let txt = ''; for (let i = 0; i < ev.results.length; i++) txt += ev.results[i][0].transcript;
      el.value = base + sep + txt.trim(); el.dispatchEvent(new Event('input', { bubbles: true }));
    };
    r.onerror = ev => { const m = { 'not-allowed': 'Mikrofonas neleidžiamas – leiskite naršyklės nustatymuose', 'service-not-allowed': 'Diktavimas šiame telefone neleidžiamas', network: 'Diktavimui reikia interneto ryšio', 'no-speech': 'Nieko neišgirsta – bandykite dar kartą', 'language-not-supported': 'Lietuvių kalbos atpažinimas nepasiekiamas' }[ev.error]; if (m) toast(m); };
    r.onend = () => { rec = null; if (btn) { btn.classList.remove('on'); btn.setAttribute('aria-label', 'Diktuoti'); } btn = null; };
    rec = r; btn = b; b.classList.add('on'); b.setAttribute('aria-label', 'Sustabdyti diktavimą');
    try { r.start(); toast('Klausausi… kalbėkite lietuviškai'); } catch (e) { rec = null; b.classList.remove('on'); toast('Diktavimo pradėti nepavyko'); }
  }
  function enhance(root) {
    if (!SRc || !root) return;
    root.querySelectorAll(SEL).forEach(el => {
      if (el.closest('.dictw')) return;
      const w = document.createElement('span'); w.className = 'dictw';
      el.parentNode.insertBefore(w, el); w.appendChild(el);
      const b = document.createElement('button'); b.type = 'button'; b.className = 'dictb'; b.setAttribute('aria-label', 'Diktuoti'); b.title = 'Diktuoti balsu'; b.innerHTML = MIC;
      b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); start(el, b); });
      w.appendChild(b);
    });
  }
  return { enhance, stop, supported: () => !!SRc };
})();
