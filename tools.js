'use strict';
// March gidas – įrankiai: 9 eilučių MEDEVAC prašymas (NL), vizuali MIST kortelė su keliais sužeistaisiais (MC),
// Ten Second Triage rūšiavimas (TS), SITREP padėties pranešimas (SR). NL, MC ir GK kodas toks pat kaip ETC gide – skiriasi tik TCFG.
// GKS skaičiuoklė (GK) March gide nerodoma (vietoje jos – SITREP), bet kodas paliktas, kad bendra dalis sutaptų su ETC gidu.

// ───────── Programėlės nustatymai (vienintelis NL / MC / GK kodo skirtumas tarp March ir ETC gido) ─────────
const TCFG = {
  pre: 'mg-',          // localStorage raktų prefiksas
  laikai: 'mg-laikai', // pradžios ekrano laikmačiai { trauma, turn }
  // nuorodos puslapių apačioje: [adresas, pavadinimas, paantraštė]
  nl: () => [['#/mist', 'MIST kortelė', MC.status()], ['#/p/devynios', '9-Line kodai ir skubumo kategorijos', 'Mokymosi medžiaga'], ['#/igudis/32', 'Kaip perduoti 9-Line ir MIST', 'Įgūdis #32'], ['#/sitrep', 'SITREP – padėties pranešimas', SR.status()]],
  mc: () => [['#/skenuoti', 'Nuskaityti popierinę kortelę', 'DD 1380 nuotrauka → MIST, be interneto'], ['#/pacientas', 'Paciento failas', 'Įvykių eiga, perdavimas QR'], ['#/qr-priimti', 'Priimti pacientą QR kodu', 'Nuskaityti kito telefono kodą'], ['#/9line', '9-Line MEDEVAC', NL.status()], [listRoute('tac-perdavimas'), 'Perdavimas priimančiai grandžiai', 'Kontrolinis sąrašas'], ['#/igudis/34', 'Perdavimas ir perėmimas', 'Įgūdis #34'], ['#/sitrep', 'SITREP – padėties pranešimas', SR.status()]],
  gk: () => [['#/mist', 'MIST kortelė', MC.status()], ['#/igudis/17', 'Šoko atpažinimas: pulsas ir sąmonė (AVPU)', 'Įgūdis #17'], ['#/igudis/22', 'Galvos smegenų trauma', 'Įgūdis #22']],
  occl: 'Krūtinės lipdukas (okliuzinis tvarstis)', // MIST gydymo lusto pavadinimas (TCCC CLS terminas)
  pt: ['laikai', 'ck'], // paciento failas: šie raktai priklauso dabartiniam pacientui (perjungiami kartu su MIST kortele)
  migrate: o => migrateOldMist(o) // senos MIST formos duomenys (žr. žemiau)
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
  const def = () => ({ peace: false, l1: '', freq: '', cs: '', sfx: '', p: { A: 0, B: 0, C: 0, D: 0, E: 0 }, eq: [], lit: 0, amb: 0, sec: '', wounds: '', mark: '', markTxt: '', nat: { A: 0, B: 0, C: 0, D: 0, E: 0 }, cbrn: [], terrain: '' });
  const num99 = v => Math.max(0, Math.min(99, parseInt(v, 10) || 0));
  const get = () => {
    const raw = LS.get(KEY, {}), d = def(), s = Object.assign(d, raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {});
    ['l1', 'freq', 'cs', 'sfx', 'sec', 'wounds', 'mark', 'markTxt', 'terrain'].forEach(k => { if (typeof s[k] !== 'string') s[k] = s[k] == null ? '' : String(s[k]); });
    ['eq', 'cbrn'].forEach(k => { s[k] = Array.isArray(s[k]) ? s[k].filter(x => typeof x === 'string') : []; });
    s.lit = num99(s.lit); s.amb = num99(s.amb); s.peace = !!s.peace;
    ['p', 'nat'].forEach(g => { const o = s[g] && typeof s[g] === 'object' ? s[g] : {}; s[g] = def()[g]; Object.keys(s[g]).forEach(k => { s[g][k] = num99(o[k]); }); });
    return s;
  };
  const save = s => LS.set(KEY, s);
  const PREC = [['A', 'Skubi', 'Urgent'], ['B', 'Skubi chirurginė', 'Urgent surgical'], ['C', 'Prioritetinė', 'Priority'], ['D', 'Įprastinė', 'Routine'], ['E', 'Patogumo', 'Convenience']];
  const EQ = [['A', 'Nereikia'], ['B', 'Gervė (hoist)'], ['C', 'Ištraukimo įranga'], ['D', 'Plaučių ventiliatorius']];
  const SEC = [['N', 'Priešo nėra'], ['P', 'Galimas priešas'], ['E', 'Priešas yra – artėti atsargiai'], ['X', 'Priešas yra – reikia ginkluotos palydos']];
  const MARK = [['A', 'Skydai'], ['B', 'Pirotechnika'], ['C', 'Dūmai'], ['D', 'Nežymima'], ['E', 'Kita']];
  const NAT = [['A', 'Savos ir sąjungininkų (koalicijos) pajėgos'], ['B', 'Savos šalies ir sąjungininkų civiliai'], ['C', 'Ne koalicijos kariai ar saugumo pajėgos'], ['D', 'Ne koalicijos civiliai'], ['E', 'Priešo kariai ar sulaikytieji']];
  const CBRN = [['C', 'Cheminis'], ['B', 'Biologinis'], ['R', 'Radiologinis'], ['N', 'Branduolinis'], ['-', 'Nėra']];
  const counts = o => Object.keys(o).filter(k => o[k] > 0).map(k => k + o[k]).join(' BREAK ');
  const TITLES = ['Paėmimo vietos koordinatės', 'Dažnis, šaukinys, priesaga', 'Sužeistieji pagal skubumą', 'Specialioji įranga', 'Sužeistieji pagal tipą', 'Paėmimo vietos saugumas', 'Vietos žymėjimas', 'Pilietybė ir statusas', 'CBRN užterštumas'];
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
      [s.freq.trim(), s.cs.trim(), s.sfx.trim() ? (en ? 'suffix ' : 'priesaga ') + s.sfx.trim() : ''].filter(Boolean).join(', '),
      counts(s.p),
      s.eq.slice().sort().join(', '),
      [s.lit ? 'L' + s.lit : '', s.amb ? 'A' + s.amb : ''].filter(Boolean).join(' BREAK '),
      s.peace ? s.wounds.trim() : s.sec,
      s.mark ? s.mark + (s.markTxt.trim() ? ' – ' + s.markTxt.trim() : '') : '',
      counts(s.nat),
      s.peace ? s.terrain.trim() : (s.cbrn.indexOf('-') >= 0 ? (en ? 'None' : 'Nėra') : s.cbrn.join(', '))
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
        s.peace ? '' : s.cbrn.filter(k => k !== '-').map(k => CBRN_EN[k] || k).join(', ')];
    }
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
  const titles = (s, en) => (en ? TITLES_EN : TITLES).map((t, i) => s.peace && i === 5 ? (en ? 'Number and type of wound, injury or illness' : 'Sužalojimų skaičius ir tipas') : s.peace && i === 8 ? (en ? 'Terrain description' : 'Vietovės aprašymas') : t);
  const text = (s, en) => '9-LINE MEDEVAC (' + nowHM() + ')\n' + lines(s, en).map((x, i) => (i + 1) + '. ' + (x || '—')).join('\n');
  function status() {
    const L = lines(get()), n = L.slice(0, 5).filter(Boolean).length, all = L.filter(Boolean).length;
    return all ? (n < 5 ? `Būtinos ${n}/5 · iš viso ${all}/9` : `Užpildyta ${all}/9 eilučių`) : 'Pildyti prašymą';
  }

  function card(n, s, body, hint) {
    const v = lines(s)[n - 1];
    return `<section class="nl${v ? ' ok' : ''}${n <= 5 ? ' req' : ''}"><div class="nlh"><span class="nn">${n}</span><b>${esc(titles(s)[n - 1])}</b>${n <= 5 ? '<small class="rq">būtina</small>' : ''}</div>${hint ? '<p class="muted">' + hint + '</p>' : ''}${body}</section>`;
  }

  // Skubumo kategorijų paaiškinimas (iš March gido „9 eilučių MEDEVAC prašymas ir MIST“, JTS CLS)
  const precHelp = () => '<details class="alt"><summary>Skubumo kategorijos (JTS CLS)</summary><div class="tw"><table><tr><th>Kategorija</th><th>Terminas</th><th>Pavyzdžiai</th></tr>' +
    '<tr><td><b>A – skubi</b> (Urgent)</td><td>&lt; 2 val. – gyvybei, galūnei ar regėjimui išsaugoti</td><td>Turniketai, sustabdytas kraujavimas, adatinė dekompresija, krikotiroidotomija</td></tr>' +
    '<tr><td><b>B – skubi chirurginė</b> (Urgent surgical)</td><td>&lt; 2 val. iki artimiausio chirurgijos padalinio</td><td>Didelis vidinis kraujavimas, sunki galvos trauma, kompensuotas šokas</td></tr>' +
    '<tr><td><b>C – prioritetinė</b> (Priority)</td><td>&lt; 4 val. arba būklė gali pablogėti iki skubios</td><td>Lūžis su išnykusiu distaliniu pulsu, II laipsnio nudegimai dideliame pilvo ar galūnių plote</td></tr>' +
    '<tr><td><b>D – įprastinė</b> (Routine)</td><td>&lt; 24 val.</td><td>Nubrozdinimai, smulkūs lūžiai, nušalimai</td></tr>' +
    '<tr><td><b>E – patogumo</b> (Convenience)</td><td>Mediciniškai nebūtina</td><td>Administracinis perkėlimas</td></tr></table></div>' +
    '<p class="muted">Terminai priklauso nuo doktrinos ir SOP: JTS CLS (2020) nurodo &lt; 2 val., kai kurios JAV ir NATO procedūros skubiai kategorijai numato 1 val. ar 90 min. Vadovaukitės savo vieneto SOP.</p></details>';

  function view() {
    const s = get(), L = lines(s), req = L.slice(0, 5).filter(Boolean).length;
    let h = '<h1>9 eilučių MEDEVAC prašymas</h1>';
    if (mode === 'learn') h += '<p class="muted">9 eilučių prašymas (9-Line MEDEVAC) – standartinis radijo pranešimas evakuacijos priemonei iškviesti. Pirmų 5 eilučių pakanka priemonei išsiųsti; 6–9 eilutes galima perduoti jai jau judant.</p>';
    h += `<div class="seg2" role="group" aria-label="Situacija">${chip('nl-peace', '0', !s.peace, 'Karo metu')}${chip('nl-peace', '1', s.peace, 'Taikos metu')}</div>`;
    h += `<div class="nlprog"><div class="prog"><i style="width:${req * 20}%"></i></div><small class="muted">Būtinos 1–5 eilutės: ${req} / 5. Prieš kviesdami surinkite visą informaciją; kodus ir ryšio saugumą – pagal SOP.</small></div>`;
    h += card(1, s, `<input class="inp" data-nl="l1" value="${esc(s.l1)}" placeholder="pvz. 35U LA 1234 5678" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Paėmimo vietos koordinatės (MGRS)"><button class="btn sm" data-act="nl-gps">📍 Mano vieta (GPS → MGRS)</button>`, '8 skaitmenų tinklelio koordinatė (MGRS). GPS koordinates patikrinkite žemėlapyje.');
    h += card(2, s, `<div class="in3"><input class="inp" data-nl="freq" value="${esc(s.freq)}" placeholder="Dažnis" inputmode="decimal" autocomplete="off" aria-label="Dažnis"><input class="inp" data-nl="cs" value="${esc(s.cs)}" placeholder="Šaukinys" autocomplete="off" aria-label="Šaukinys"><input class="inp" data-nl="sfx" value="${esc(s.sfx)}" placeholder="Priesaga" autocomplete="off" aria-label="Priesaga"></div>`, 'Paėmimo vietos (ne retransliatoriaus) dažnis.');
    h += card(3, s, PREC.map(([k, lt, en]) => stepper('nl-p', k, s.p[k], k + ' – ' + lt, en)).join('') + precHelp(), 'Kiekvienai kategorijai – sužeistųjų skaičius.');
    h += card(4, s, '<div class="opts">' + EQ.map(([k, t]) => chip('nl-eq', k, s.eq.indexOf(k) >= 0, k + ' – ' + t)).join('') + '</div>');
    h += card(5, s, stepper('nl-lit', 'lit', s.lit, 'L – neštuvuose', 'Litter') + stepper('nl-amb', 'amb', s.amb, 'A – vaikštantys', 'Ambulatory'));
    h += s.peace ? card(6, s, `<textarea class="inp" data-nl="wounds" rows="2" placeholder="pvz. 2 šautinės žaizdos, 1 lūžis" aria-label="Sužalojimų skaičius ir tipas">${esc(s.wounds)}</textarea>`)
      : card(6, s, '<div class="opts">' + SEC.map(([k, t]) => chip('nl-sec', k, s.sec === k, k + ' – ' + t)).join('') + '</div>');
    h += card(7, s, '<div class="opts">' + MARK.map(([k, t]) => chip('nl-mark', k, s.mark === k, k + ' – ' + t)).join('') + `</div><input class="inp" data-nl="markTxt" value="${esc(s.markTxt)}" placeholder="Patikslinimas, pvz. žali dūmai" autocomplete="off" aria-label="Žymėjimo patikslinimas">`);
    h += card(8, s, NAT.map(([k, t]) => stepper('nl-nat', k, s.nat[k], k + ' – ' + t)).join(''), 'Koalicijos versija (JTS kortelėje – JAV / ne JAV). Vadovaukitės vieneto SOP.');
    h += s.peace ? card(9, s, `<textarea class="inp" data-nl="terrain" rows="2" placeholder="pvz. lygus laukas, šiaurėje elektros linija" aria-label="Vietovės aprašymas">${esc(s.terrain)}</textarea>`)
      : card(9, s, '<div class="opts">' + CBRN.map(([k, t]) => chip('nl-cbrn', k, s.cbrn.indexOf(k) >= 0, (k === '-' ? '' : k + ' – ') + t)).join('') + '</div>');
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
      case 'nl-read': { const en = outEn(), M = meaning(s, en), T = titles(s, en); return readMode('9-Line MEDEVAC', lines(s, en).map((x, i) => `<span class="rn">${i + 1}</span>${esc(x || '—')}<small>${esc(T[i])}${M[i] ? ' · ' + esc(M[i]) : ''}</small>`)); }
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
    const o = document.getElementById('nl-out'); if (o) o.textContent = text(s, outEn());
    const sec = t.closest('section.nl'); if (sec) { const n = [...document.querySelectorAll('section.nl')].indexOf(sec); sec.classList.toggle('ok', !!lines(s)[n]); }
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
    ['occl', 'okliuzinis tvarstis', 'chest seal', 'b'], ['dec', 'ad. dekompresija', 'needle decompression', 'b'], ['o2', 'O₂', 'O₂', 'b', 'CMC'], ['ctube', 'krūtinės vamz.', 'chest tube', 'b', 'CPP'],
    ['dress', 'tvarstymas', 'wound dressing', 'o'], ['spl', 'imobilizavimas', 'splinting', 'o'], ['eyeR', 'D', 'R', 'eye'], ['eyeL', 'K', 'L', 'eye'],
    ['hypo', 'hipotermijos prevencija', 'hypothermia prevention', 'o2'], ['oth', 'kita', 'other', 'o2']];
  const txT = k => TX.find(x => x[0] === k);
  const txShown = (x, s) => !x[4] || typeof ok !== 'function' || ok(x[4]) || s.tx.indexOf(x[0]) >= 0;
  // C lentelė: [grupė, LT, EN, eilučių kortelėje]
  const ROWG = [['fl', 'Skysčiai', 'Fluids', 2], ['bl', 'Kraujo produktai', 'Blood product', 1], ['an', 'Analgetikai', 'Analgesic', 2], ['ab', 'Antibiotikai', 'Antibiotic', 1], ['ot', 'Kita (pvz., TXA)', 'Other (e.g., TXA)', 2]];
  const EVAC = [['u', 'Neatidėliotina', 'Urgent'], ['p', 'Skubi', 'Priority'], ['r', 'Įprastinė', 'Routine']];
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
    if (s.tqT && !Object.keys(s.tq).length && s.tx.indexOf('tq') >= 0 && s.injTxt.indexOf('turniketas ' + s.tqT) < 0) s.injTxt = [s.injTxt.trim(), 'turniketas ' + s.tqT].filter(Boolean).join('; ');
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
  const save = st => { st.pts.forEach(derive); LS.set(KEY, st); };
  const curOf = st => st.pts[st.cur];
  const timers = () => LS.get(TCFG.laikai, {}) || {};
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
  function txParts(s, en) {
    const on = k => s.tx.indexOf(k) >= 0, nm = k => { const x = txT(k); return en ? x[2] : x[1]; }, out = [];
    const grp = (ids, lt, e) => { const a = ids.filter(on).map(nm); if (a.length) out.push((en ? e : lt) + ' ' + a.join(', ')); };
    grp(['tq', 'tqj'], 'turniketas:', 'tourniquet:'); grp(['dh', 'dp', 'dk'], 'tvarstis:', 'dressing:');
    const a = ['npa', 'igel', 'cric', 'ak'].filter(on).map(k => k === 'ak' ? (en ? 'airway – other' : 'kvėpavimo takai – kita') : nm(k)); if (a.length) out.push(a.join(', '));
    ['occl', 'dec', 'o2', 'ctube'].filter(on).forEach(k => out.push(nm(k)));
    ROWG.forEach(([g, lt, e]) => { const r = s.rows.filter(x => x.g === g && rowText(x)); if (r.length) out.push((en ? e.replace(/ \(.*\)$/, '') : lt.replace(/ \(.*\)$/, '')).toLowerCase() + ': ' + r.map(rowText).join(', ')); });
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
    const when = [s.dt && s.dt !== new Date().toISOString().slice(0, 10) ? s.dt : '', s.t0].filter(Boolean).join(' ');
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

  // ── vaizdas: kortelė kaip LK „Nukentėjusiojo kortelė“ ──
  const lbl = (lt, en) => `<span class="lkf"><b>${lt}</b><small>${en}</small></span>`;
  const cb = (act, k, on, lt, en, extra) => `<button class="lkcb${on ? ' on' : ''}" data-act="${act}" data-k="${esc(k)}" aria-pressed="${!!on}"${extra || ''}><span class="lkbx" aria-hidden="true"></span><span class="lkf"><b>${lt}</b>${en ? '<small>' + en + '</small>' : ''}</span></button>`;
  const fld = (k, v, lt, en, extra) => `<label class="lkin">${lbl(lt, en)}<input class="lkv" data-mc="${k}" value="${esc(v)}" autocomplete="off"${extra || ''}></label>`;
  const sec = (letter, cls, body) => `<section class="lks"><span class="lkl ${cls || 'g'}">${letter}</span><div class="lkb">${body}</div></section>`;
  const mkGlyph = (m, i, del) => {
    const T = mkT(m.t), lb = T[2] + ' – ' + region(m.s, m.x, m.y).t;
    return `<g class="mk lkmk" ${del ? `data-act="mc-mdel" data-k="${i}" role="button" tabindex="0" aria-label="Pašalinti žymę: ${esc(lb)}"` : ''} transform="translate(${m.x} ${m.y})"><circle class="hit" r="11"/><text class="halo" y="4.4">${esc(T[1])}</text><text y="4.4">${esc(T[1])}</text></g>`;
  };
  function figure(s, sd) {
    const lab = sd === 'f' ? ['D', 'K'] : ['K', 'D'], nmF = sd === 'f' ? 'Priekis' : 'Nugara';
    const bands = sd === 'f' ? TQ.filter(([k]) => s.tq[k] && s.tq[k].on).map(([k, , , p]) => `<path class="lktq" d="M${p[0] - 7} ${p[1] - 9}h14"/>`).join('') : '';
    return `<figure class="bfig lkfig"><svg viewBox="0 0 120 250" data-act="mc-body" data-s="${sd}" role="img" aria-label="Kūnas – ${nmF.toLowerCase()}. Bakstelėkite sužalojimo vietą.">` +
      `<g class="bo">${SHAPES}</g><g class="bf">${SHAPES}</g>` + (sd === 'b' ? '<path class="bsp" d="M60 47V130"/>' : '') +
      NINES[sd].map(([x, y, t]) => `<text class="lk9" x="${x}" y="${y}">${t}</text>`).join('') +
      `<text class="blr" x="9" y="14">${lab[0]}</text><text class="blr" x="111" y="14">${lab[1]}</text>` + bands +
      s.mk.map((m, i) => m.s === sd ? mkGlyph(m, i, true) : '').join('') + `</svg><figcaption>${nmF}</figcaption></figure>`;
  }
  const tqBox = (s, [k, lt, en]) => { const q = s.tq[k] || {}; return `<div class="lktqb${q.on ? ' on' : ''}">${cb('mc-tq', k, q.on, 'TURNIKETAS – ' + lt.toUpperCase(), 'TQ: ' + en)}` +
    (q.on ? `<div class="lktm"><span class="lkf"><b>LAIKAS</b><small>Time</small></span><input type="time" class="lkv" data-mctq="${k}" value="${esc(q.tm || '')}" aria-label="${esc(lt)} – turniketo laikas"><button class="btn sm" data-act="mc-tqnow" data-k="${k}">Dabar</button></div>` : '') + '</div>'; };
  function tabs(st) {
    const tabLabel = (i, id) => 'Sužeistasis ' + (i + 1) + (id ? ' – ' + id : '');
    return '<div class="ptabs" role="tablist" aria-label="Sužeistieji">' + st.pts.map((p, i) => {
      const id = p.id.trim(), on = i === st.cur;
      return `<button class="${on ? 'on' : ''}" data-act="mc-sel" data-k="${i}" role="tab" aria-selected="${on}" aria-label="${esc(tabLabel(i, id))}">${i + 1}${id ? '<small>' + esc(id) + '</small>' : ''}</button>`;
    }).join('') + '<button class="add" data-act="mc-add" aria-label="Pridėti sužeistąjį" title="Pridėti sužeistąjį">+</button></div>';
  }
  const DRUGS = () => (E.vaistai || []).map(v => v.name.replace(/ \(.*\)$/, ''));
  // o.embed – be antraštės, skirtukų ir perdavimo dalies (paciento ekrano skiltis „Kortelė“)
  function view(o) {
    const emb = !!(o && o.embed);
    const st = load(), s = curOf(st), n = st.cur + 1, tot = st.pts.length, learn = mode === 'learn', T = timers(), F = s.f;
    let h = emb ? '' : '<h1>MIST kortelė</h1>';
    if (learn && !emb) h += '<p class="muted">Nukentėjusiojo kortelė kaip LK patvirtintoje formoje (DD 1380 lietuviškas variantas): A – asmens duomenys, T – traumos laikas ir pobūdis, M – mechanizmas, I – sužalojimai ir turniketai, S – būklė, T – teikta pagalba, evakuacija. Pildoma eigoje; perduodant perskaitomas MIST tekstas. Keli sužeistieji – skirtukai 1, 2, … ir „+“.</p>';
    if (!emb) h += tabs(st);
    h += `<article class="lk" aria-label="Nukentėjusiojo kortelė – sužeistasis ${n}">`;
    h += `<div class="lkh"><b>NUKENTĖJUSIOJO KORTELĖ</b><span>FIELD MEDICAL CARD${tot > 1 ? ' · ' + n + ' / ' + tot : ''}</span></div>`;
    // A
    h += `<div class="lkrow lkr1">${fld('name', s.name, 'PAVARDĖ, VARDAS', 'Last name, first name')}<div class="lkin lksex">${lbl('LYTIS', 'Gender')}<div class="lksx">${SEX.map(([k, lt]) => `<button class="${s.sex === k ? 'on' : ''}" data-act="mc-sex" data-k="${k}" aria-pressed="${s.sex === k}" aria-label="${lt}" title="${lt}">${k === 'V' ? '<svg viewBox="0 0 12 24" aria-hidden="true"><circle cx="6" cy="2.6" r="2.4"/><path d="M2.6 6h6.8l1 9H9v8.4H7V15.6H5v7.8H3V15H1.6z"/></svg>' : '<svg viewBox="0 0 12 24" aria-hidden="true"><circle cx="6" cy="2.6" r="2.4"/><path d="M3.4 6h5.2l2.4 10H8.6v7.4H6.8V16.6H5.2v6.8H3.4V16H1z"/></svg>'}</button>`).join('')}</div></div>${fld('id', s.id, 'ID', 'šaukinys / ID', ' placeholder="pvz. Vilkas 2"')}</div>`;
    h += sec('A', 'g', `<div class="lkrow">${fld('dob', s.dob, 'GIM. DATA', 'Date of birth')}${fld('unit', s.unit, 'DALINYS', 'Unit of origin')}${fld('country', s.country, 'ŠALIS', 'Armed Forces of origin (Nationality)')}</div>${fld('allerg', s.allerg, 'ALERGIJOS', 'Medical allergies')}` +
      (learn ? '<p class="muted mt0">Duomenų apsauga: per radiją perduodamas tik ID / šaukinys.</p>' : ''));
    // T – traumos laikas ir pobūdis
    h += sec('T', 'g', `<div class="lkrow lkwhen">${lbl('TRAUMOS AR LIGOS DATA, LAIKAS:', 'Date, time of injury or illness')}<div class="lkdt"><input type="date" class="lkv" data-mc="dt" value="${esc(s.dt)}" aria-label="Traumos data"><input type="time" class="lkv" data-mc="t0" value="${esc(s.t0)}" aria-label="Traumos laikas">` +
      (T.trauma ? `<button class="btn sm" data-act="mc-t0" data-k="tm">⏱ ${hm(T.trauma)}</button>` : '') + '<button class="btn sm" data-act="mc-now" data-k="t0">Dabar</button></div></div>' +
      `<div class="lkrow lkcbs">${lbl('POBŪDIS:', 'Nature')}${NAT.map(([k, lt, en]) => cb('mc-nat', k, s.nat.indexOf(k) >= 0, lt, en)).join('')}</div>`);
    // M
    h += sec('M', 'g', `<div class="lkrow lkcbs">${lbl('MECHANIZMAS:', 'Mechanism of injury')}${MECH.map(([k, en]) => cb('mc-mech', k, s.mech.indexOf(k) >= 0, k.toLowerCase(), en)).join('')}</div>` +
      `<input class="lkv lkwide" data-mc="mechTxt" value="${esc(s.mechTxt)}" placeholder="Patikslinimas (nebūtina), pvz. mina, skeveldros" autocomplete="off" aria-label="Mechanizmo patikslinimas">`);
    // I
    const SM = sortedMk(s);
    h += sec('I', 'g', `${lbl('SUŽALOJIMAI:', 'Injuries')}<div class="lktools" role="radiogroup" aria-label="Sutartinis ženklas">` +
      TOOLS.map(k => { const x = mkT(k); return `<button class="${tool === k ? 'on' : ''}" data-act="mc-tool" data-k="${k}" role="radio" aria-checked="${tool === k}"><span class="lkg">${esc(x[1])}</span><span class="lkf"><b>${esc(x[2])}</b><small>${esc(x[3].toLowerCase())}</small></span></button>`; }).join('') + '</div>' +
      `<div class="lkbody"><div class="lktq2">${tqBox(s, TQ[0])}${tqBox(s, TQ[1])}</div><div class="bfigs">${figure(s, 'f')}${figure(s, 'b')}</div><div class="lktq2">${tqBox(s, TQ[2])}${tqBox(s, TQ[3])}</div></div>` +
      `<div class="acts"><button class="btn" data-act="mc-undo"${undo.length ? '' : ' disabled'}>↶ Atšaukti</button><button class="btn" data-act="mc-mclr"${s.mk.length ? '' : ' disabled'}>Išvalyti žymes</button></div>` +
      (SM.length ? '<ul class="mlist" aria-label="Žymės pagal kūno sritį">' + SM.map(({ m, i, r }) => `<li><span class="lkg">${esc(mkT(m.t)[1])}</span><div class="mt"><b>${esc(r.t)}</b> – ${esc(mkT(m.t)[2].toLowerCase())}</div><button class="x" data-act="mc-mdel" data-k="${i}" aria-label="Pašalinti: ${esc(mkT(m.t)[2] + ' – ' + r.t)}">×</button></li>`).join('') + '</ul>'
        : '<p class="muted">Pasirinkite ženklą ir bakstelėkite kūno schemoje (bakstelėjus žymę – ji pašalinama). D – paciento dešinė, K – kairė. Turniketą pažymėkite galūnės langelyje.</p>') +
      `<input class="lkv lkwide" data-mc="injTxt" value="${esc(s.injTxt)}" placeholder="Kiti sužalojimai, patikslinimas (nebūtina)" autocomplete="off" aria-label="Sužalojimų patikslinimas">`);
    // S – būklė
    const V = s.vit.map((v, i) => ({ v, i }));
    const rowV = (k, lt, en, f) => `<tr><th scope="row">${lbl(lt, en)}</th>` + V.map(({ v }) => `<td class="${abn(k, v[k]) ? 'ab' : ''}">${esc(f ? f(v) : v[k]) || ''}</td>`).join('') + (V.length < 3 ? '<td></td>'.repeat(3 - V.length) : '') + '</tr>';
    const num = (k, lt, en, ph, im) => `<label class="lkin">${lbl(lt, en)}<input class="lkv" data-mcf="${k}" value="${esc(F[k])}" inputmode="${im || 'numeric'}" placeholder="${ph}" autocomplete="off"></label>`;
    h += sec('S', 'g', '<div class="vtw"><table class="lkt"><thead><tr><th class="lkdg"><span>BŪKLĖ <small>Signs</small></span><span>APŽIŪROS LAIKAS <small>Time of exam</small></span></th>' + V.map(({ v }) => `<th scope="col">${esc(v.ts)}</th>`).join('') + (V.length < 3 ? '<th></th>'.repeat(3 - V.length) : '') + '</tr></thead><tbody>' +
      rowV('av', 'SĄMONĖ (AVPU)', 'Consciousness') + rowV('rr', 'KVĖPAVIMO DAŽNIS', 'RR') + rowV('spo2', 'O₂ SATURACIJA', 'O₂ Saturation') + rowV('hr', 'PULSAS', 'Pulse') + rowV('bp', 'AKS', 'BP') + rowV('pain', 'SKAUSMO SKALĖ (0–10)', 'Pain scale') +
      (V.some(({ v }) => v.gcs) ? rowV('gcs', 'GKS', 'GCS', v => v.gcs + (v.gcsD ? ' ' + v.gcsD : '')) : '') +
      (V.length ? '<tr class="vdel"><th scope="row"><span class="vh">Ištrinti</span></th>' + V.map(({ v, i }) => `<td><button class="x" data-act="mc-vdel" data-k="${i}" aria-label="Ištrinti ${esc(v.ts)} matavimą">×</button></td>`).join('') + (V.length < 3 ? '<td></td>'.repeat(3 - V.length) : '') + '</tr>' : '') +
      '</tbody></table></div>' +
      '<div class="lkadd"><div class="lbl">Naujas matavimas</div>' +
      `<div class="tline"><span>Apžiūros laikas <small>(tuščia – dabar)</small></span><input type="time" class="inp" data-mcf="t" value="${esc(F.t)}" aria-label="Apžiūros laikas"></div>` +
      '<div class="chips avpu">' + AVPU.map(([k, t]) => chip('mc-av', k, F.av === k, `<b>${k}</b><small>${t}</small>`, ` aria-label="${k} – ${t}"`)).join('') + '</div>' +
      '<div class="vgrid">' + num('rr', 'KD', 'RR', 'k./min') + num('spo2', 'O₂ SAT.', 'SpO₂', '%') + num('hr', 'PULSAS', 'Pulse', 'k./min') + num('bp', 'AKS', 'BP', '120/80', 'text') + num('pain', 'SKAUSMAS', '0–10', '0–10') + num('gcs', 'GKS', 'GCS', '3–15') + '</div>' +
      '<button class="btn pri" data-act="mc-vit">+ Įrašyti matavimą</button></div>' +
      `<label class="lkin lkfull">${lbl('NUSISKUNDIMAI', 'Symptoms')}<textarea class="lkv" data-mc="sympt" rows="2">${esc(s.sympt)}</textarea></label>`);
    h += '<div class="lkcut" aria-hidden="true"></div>';
    // T – teikta pagalba
    const tcb = keys => keys.map(k => txT(k)).filter(x => txShown(x, s)).map(x => cb('mc-tx', x[0], s.tx.indexOf(x[0]) >= 0, x[3] === 'a' || x[3] === 'b' ? x[1].toUpperCase() : x[1], x[2])).join('');
    const rowsOf = g => s.rows.map((r, i) => ({ r, i })).filter(x => x.r.g === g);
    const rowIn = (i, r) => `<div class="lkcr"><input class="lkv lkcn" data-mcr="${i}.name" value="${esc(r.name)}" placeholder="Pavadinimas" list="lk-drugs" autocomplete="off" aria-label="Pavadinimas">` +
      `<input class="lkv" data-mcr="${i}.dose" value="${esc(r.dose)}" placeholder="Dozė" autocomplete="off" aria-label="Dozė"><input class="lkv" data-mcr="${i}.route" value="${esc(r.route)}" placeholder="Būdas" list="lk-routes" autocomplete="off" aria-label="Būdas">` +
      `<input type="time" class="lkv" data-mcr="${i}.time" value="${esc(r.time)}" aria-label="Laikas"><button class="x" data-act="mc-rdel" data-k="${i}" aria-label="Ištrinti eilutę">×</button></div>`;
    h += sec('T', 'g', lbl('TEIKTA PAGALBA:', 'Treatment') +
      `<div class="lkrow lkcbs"><span class="lkl r">„C“</span><div class="lkcbw">${lbl('TURNIKETAS:', 'TQ')}${tcb(['tq', 'tqj'])}</div></div>` +
      `<div class="lkrow lkcbs"><span class="lkl r"></span><div class="lkcbw">${lbl('TVARSTIS:', 'Dressing')}${tcb(['dh', 'dp', 'dk'])}</div></div>` +
      `<div class="lkrow lkcbs"><span class="lkl r">A</span><div class="lkcbw">${tcb(['npa', 'igel', 'cric', 'ak'])}</div></div>` +
      `<div class="lkrow lkcbs"><span class="lkl r">B</span><div class="lkcbw">${tcb(['occl', 'dec', 'o2', 'ctube'])}</div></div>` +
      `<div class="lkrow"><span class="lkl r">C</span><div class="lkc">` + ROWG.map(([g, lt, en]) => `<div class="lkcg"><div class="lkcgl">${lbl(lt.toUpperCase().replace(' (PVZ., TXA)', ''), en.replace(/ \(.*\)$/, ''))}${g === 'ot' ? '<small class="muted">pvz., traneksamo rūgštis</small>' : ''}</div><div class="lkcgr">` +
        rowsOf(g).map(({ r, i }) => rowIn(i, r)).join('') + `<button class="btn sm" data-act="mc-radd" data-k="${g}">+ eilutė</button></div></div>`).join('') +
      `<datalist id="lk-drugs">${DRUGS().map(d => `<option value="${esc(d)}">`).join('')}<option value="Šviežias pilnas kraujas"><option value="Ringerio laktatas"><option value="NaCl 0,9 %"></datalist><datalist id="lk-routes">${['IV', 'IO', 'IM', 'IN', 'PO', 'ODT'].map(r => `<option value="${r}">`).join('')}</datalist>` +
      (typeof VZ !== 'undefined' && VZ.get().e.some(e => !e.x) ? '<button class="btn" data-act="mc-vz">Įrašyti iš vaistų žymėjimo</button>' : '') + '</div></div>' +
      `<div class="lkrow lkcbs">${tcb(['dress', 'spl'])}<span class="lkeye">${lbl('AKIES GAUBTELIS:', 'Eye shield')}${tcb(['eyeR', 'eyeL'])}</span></div>` +
      `<div class="lkrow lkcbs">${tcb(['hypo', 'oth'])}</div>` +
      `<label class="lkin lkfull lknotes">${lbl('PASTABOS:', 'Notes')}<textarea class="lkv" data-mc="txTxt" rows="3">${esc(s.txTxt)}</textarea></label>` +
      `<div class="lkrow lkev">${lbl('EVAKUACIJA:', 'Evacuation')}${EVAC.map(([k, lt, en]) => `<button class="lkevb ev${k}${s.evac === k ? ' on' : ''}" data-act="mc-ev" data-k="${k}" aria-pressed="${s.evac === k}"><span class="lkbx" aria-hidden="true"></span><b>${lt.toUpperCase()}</b><small>${en}</small></button>`).join('')}</div>` +
      `<div class="lkrow lkpos">${lbl('TRANSPORTAVIMO PADĖTIS:', 'Transportation position')}<div class="lkposb">${POS.map(([k, lt]) => `<button class="${s.pos === k ? 'on' : ''}" data-act="mc-pos" data-k="${k}" aria-pressed="${s.pos === k}" aria-label="${lt}" title="${lt}"><svg viewBox="0 0 34 24" aria-hidden="true">${POS_SVG[k]}</svg></button>`).join('')}</div></div>` +
      `<div class="lkresp">${lbl('PAGALBOS TEIKĖJO PAVARDĖ, VARDAS, ID', 'Responder last name, first name, ID')}${[0, 1].map(i => `<label class="lkrn"><b>${i + 1}</b><input class="lkv" data-mcp="${i}" value="${esc(s.resp[i])}" autocomplete="off" aria-label="Pagalbos teikėjas ${i + 1}"></label>`).join('')}</div>`);
    h += '</article>';
    if (emb) return h + mgmtInner(st) + tcfgRows(TCFG.mc());
    return h + '<section class="outp">' + outInner(st) + mgmtInner(st) + '</section>' + tcfgRows(TCFG.mc());
  }
  // Perdavimo dalis (MIST tekstas, skaityti, kopijuoti, kortelės paveikslėlis) ir sužeistųjų tvarkymas – atskirai, kad paciento ekranas galėtų rodyti skirtingose skiltyse
  function outInner(st) {
    const s = curOf(st), n = st.cur + 1, tot = st.pts.length;
    return `<div class="nlh"><b>Perduoti (MIST)</b>${tot > 1 ? `<small class="muted">sužeistasis ${n} iš ${tot}</small>` : ''}</div>${langSeg('mc-lang')}<pre id="mc-out">${esc(text(s, n, tot, outEn()))}</pre>` +
      '<div class="acts"><button class="btn pri" data-act="mc-read">Skaityti</button><button class="btn" data-act="mc-copy">Kopijuoti</button><button class="btn" data-act="mc-share">Bendrinti</button></div>' +
      '<div class="acts"><button class="btn" data-act="mc-card">Kortelė (paveikslėlis, spausdinti)</button></div>' +
      (tot > 1 ? `<div class="acts"><button class="btn" data-act="mc-copyall">Kopijuoti visus (${tot})</button><button class="btn" data-act="mc-shareall">Bendrinti visus</button></div>` : '');
  }
  function mgmtInner(st) {
    const n = st.cur + 1, tot = st.pts.length;
    return `<div class="acts"><button class="btn" data-act="mc-add">+ Kitas sužeistasis</button><button class="btn dng" data-act="mc-new">${tot > 1 ? 'Išvalyti šią kortelę' : 'Naujas sužeistasis – išvalyti kortelę'}</button></div>` +
      (tot > 1 ? `<div class="acts"><button class="btn dng" data-act="mc-pdel">Ištrinti sužeistąjį ${n}</button><button class="btn dng" data-act="mc-allclr">Išvalyti visus</button></div>` : '');
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
  const tqDefault = () => { const T = timers(); return T.turn ? hm(T.turn) : nowHM(); };
  function act(el, e) {
    const st = load(), s = curOf(st), d = el.dataset, k = d.k, n = st.cur + 1, tot = st.pts.length;
    const toggle = (a, v) => { const i = a.indexOf(v); if (i >= 0) a.splice(i, 1); else a.push(v); };
    switch (d.act) {
      // ── sužeistieji ──
      case 'mc-sel': { const i = +k; if (!(i >= 0 && i < tot) || i === st.cur) return; st.cur = i; undo = []; save(st); render(); return; }
      case 'mc-add': { if (tot >= 30) { toast('Daugiausia 30 sužeistųjų'); return; } st.pts.push(def()); st.cur = st.pts.length - 1; undo = []; save(st); render(); scrollTo(0, 0); toast('Pridėtas sužeistasis ' + st.pts.length); return; }
      case 'mc-pdel': {
        if (tot < 2) return;
        if (!confirm('Ištrinti sužeistąjį ' + n + (s.id.trim() ? ' (' + s.id.trim() + ')' : '') + ' ir visą jo kortelę?')) return;
        st.pts.splice(st.cur, 1); st.cur = Math.min(st.cur, st.pts.length - 1); undo = []; save(st); render(); scrollTo(0, 0); toast('Sužeistasis ištrintas'); return;
      }
      case 'mc-allclr': if (!confirm('Išvalyti visų ' + plural(tot, ['sužeistojo', 'sužeistųjų', 'sužeistųjų']) + ' korteles?')) return; undo = []; save(fresh()); render(); scrollTo(0, 0); toast('Visos kortelės išvalytos'); return;
      case 'mc-new': if (!confirm(tot > 1 ? 'Išvalyti visą sužeistojo ' + n + ' kortelę?' : 'Naujas sužeistasis: išvalyti visą kortelę?')) return; undo = []; st.pts[st.cur] = def(); save(st); render(); scrollTo(0, 0); toast('Kortelė išvalyta'); return;
      // ── kortelė ──
      case 'mc-sex': s.sex = s.sex === k ? '' : k; break;
      case 'mc-t0': { const T = timers(); if (!T.trauma) { toast('Traumos laikmatis nenustatytas'); return; } s.t0 = hm(T.trauma); if (!s.dt) s.dt = new Date(T.trauma).toISOString().slice(0, 10); toast('Traumos laikas ' + s.t0); break; }
      case 'mc-now': s[k] = nowHM(); if (k === 't0' && !s.dt) s.dt = new Date().toISOString().slice(0, 10); break;
      case 'mc-nat': toggle(s.nat, k); break;
      case 'mc-mech': toggle(s.mech, k); break;
      case 'mc-tool': {
        tool = TOOLS.indexOf(k) >= 0 ? k : 'X';
        app.querySelectorAll('.lktools button').forEach(b => { const on = b.dataset.k === tool; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
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
      case 'mc-tq': { if (s.tq[k] && s.tq[k].on) delete s.tq[k]; else { s.tq[k] = { on: true, tm: tqDefault() }; toast('Turniketas ' + s.tq[k].tm + ' – laiką galite pakeisti'); } break; }
      case 'mc-tqnow': s.tq[k] = { on: true, tm: nowHM() }; break;
      case 'mc-tx': { if (!txT(k)) return; toggle(s.tx, k); break; }
      case 'mc-radd': if (!ROWG.some(g => g[0] === k)) return; s.rows.push({ g: k, name: '', dose: '', route: '', time: '', src: '' }); break;
      case 'mc-rdel': { const i = +k; if (!(i >= 0 && i < s.rows.length)) return; s.rows.splice(i, 1); break; }
      case 'mc-vz': if (typeof VZ !== 'undefined') { VZ.toMist(); render(); } return;
      case 'mc-ev': s.evac = s.evac === k ? '' : k; break;
      case 'mc-pos': s.pos = s.pos === k ? '' : k; break;
      case 'mc-av': s.f.av = s.f.av === k ? '' : k; break;
      case 'mc-vit': {
        const f = s.f;
        if (!VF.slice(1).some(x => String(f[x]).trim() !== '')) { toast('Įveskite bent vieną požymį'); return; }
        const n3 = (v, lo, hi) => { v = String(v).trim(); return v === '' || (/^\d{1,3}$/.test(v) && +v >= lo && +v <= hi); };
        if (f.t && !HM_RE.test(f.t)) { toast('Laikas: pvz. 14:05'); return; }
        if (!n3(f.hr, 0, 300)) { toast('Pulsas: skaičius 0–300'); return; }
        if (!n3(f.rr, 0, 99)) { toast('KD: skaičius 0–99'); return; }
        if (!n3(f.spo2, 0, 100)) { toast('SpO₂: skaičius 0–100'); return; }
        if (!n3(f.gcs, 3, 15)) { toast('GKS: skaičius 3–15'); return; }
        if (!n3(f.pain, 0, 10)) { toast('Skausmas: skaičius 0–10'); return; }
        if (String(f.bp).trim() && !/^\d{2,3}\s*\/\s*\d{2,3}$|^\d{2,3}$/.test(String(f.bp).trim())) { toast('AKS: pvz. 90/60 arba tik sistolinis, pvz. 90'); return; }
        const v = { ts: f.t || nowHM() };
        VF.slice(1).forEach(x => { v[x] = String(f[x] == null ? '' : f[x]).trim().replace(/\s*\/\s*/, '/'); });
        s.vit.push(v); s.f = Object.assign(blankF(), { av: f.av }); toast('Matavimas įrašytas ' + v.ts); break;
      }
      case 'mc-vdel': { const i = +k; if (!(i >= 0 && i < s.vit.length)) return; if (!confirm('Ištrinti ' + s.vit[i].ts + ' matavimą?')) return; s.vit.splice(i, 1); break; }
      // ── perdavimas ──
      case 'mc-lang': { LS.set(OUTLANG, k === 'en' ? 'en' : 'lt'); const y = scrollY; render(); scrollTo(0, y); return; }
      case 'mc-card': return cardShow(s, n, tot);
      case 'mc-copy': return copyText(text(s, n, tot, outEn()));
      case 'mc-share': return shareText('MIST', text(s, n, tot, outEn()));
      case 'mc-copyall': return copyText(allText(st, outEn()));
      case 'mc-shareall': return shareText('MIST', allText(st, outEn()));
      case 'mc-read': {
        const en = outEn(), P = parts(s, n, tot, en), L = (c, l, t) => `<span class="rn ${c}">${l}</span>${esc(t)}`, one = text(s, n, tot, en);
        const B = [['Kopijuoti', () => copyText(one)]];
        if (tot > 1) B.push(['Kopijuoti visus (' + tot + ')', () => copyText(allText(load(), en))]);
        return readMode(P.hd, [L('rM', 'M', P.M), L('rI', 'I', P.I), L('rS', 'S', P.S.join('\n')), L('rT', 'T', P.T)].concat(P.E ? [L('rT', 'E', P.E)] : [], P.A ? [L('rT', 'A', (en ? 'Allergies: ' : 'Alergijos: ') + P.A)] : []), B);
      }
      default: return;
    }
    const y = scrollY; save(st); render(); scrollTo(0, y);
  }

  function onInput(t) {
    const st = load(), s = curOf(st), d = t.dataset;
    if (d.mc) s[d.mc] = t.value;
    else if (d.mcf) s.f[d.mcf] = t.value;
    else if (d.mctq) { s.tq[d.mctq] = { on: true, tm: t.value }; }
    else if (d.mcp != null) s.resp[+d.mcp] = t.value;
    else if (d.mcr) { const [i, f] = d.mcr.split('.'), r = s.rows[+i]; if (!r) return; r[f] = t.value; }
    save(st);
    const o = document.getElementById('mc-out'); if (o) o.textContent = curText(load(), outEn());
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
  const current = () => { const st = load(); return { n: st.cur + 1, tot: st.pts.length }; };
  const tqName = (k, en) => { const x = TQ.find(q => q[0] === k); return x ? (en ? x[2] : x[1].toLowerCase()) : k; };

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
    y += 50; tx('B', P + 2, y, 26, true, RED); cbx(on('occl'), 'OKLIUZINIS TVARSTIS', 'Chest seal', P + 40, y); cbx(on('dec'), 'AD. DEKOMPRESIJA', 'Needle decompression', P + 330, y); cbx(on('o2'), 'O₂', '', P + 600, y); cbx(on('ctube'), 'KRŪTINĖS VAMZ.', 'Chest tube', P + 700, y);
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
  return { view, act, onInput, status, text, addGcs, addRows, current, region, state: load, curText: () => curText(load()), cardCanvas, loadLogo, vitLine, tqName, outView, parts: (s, n, tot, en) => parts(s, n || 1, tot || 1, en), injText, abn, MECH, TX, TQ, MK, ROWG, EVAC, POS };
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
  const label = c => c.nt ? c.comp : 'GKS ' + c.tot + ' (' + c.comp + ')';
  const histLine = x => { const c = calc(x); return x.ts + ' – ' + label(c) + (c.gp != null ? ' · GKS-P ' + c.gp : ''); };
  function status() {
    const s = get(), x = s.h[0];
    return x ? 'Paskutinė: ' + histLine(x) : 'Glasgow komos skalė, GKS-P';
  }
  function resBox(s) {
    const c = calc(s);
    let h = `<div class="gres${c.done && !c.nt ? ' sev' + c.sev : ''}" id="gres" aria-live="polite">`;
    if (!c.done) h += `<div class="gt">GKS – <small>${esc(c.comp)}</small></div><div class="gsv">Pasirinkite akių, kalbos ir motorikos atsaką</div>`;
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
        if (!calc(s).done) { toast('Įvertinkite visus tris komponentus'); return; }
        s.h.unshift({ ts: nowHM(), at: Date.now(), e: s.e, v: s.v, m: s.m, p: s.p }); s.h = s.h.slice(0, 12);
        toast('Išsaugota ' + s.h[0].ts); break;
      }
      case 'gk-hdel': { const i = +k; if (i >= 0 && i < s.h.length) s.h.splice(i, 1); break; }
      case 'gk-mist': {
        const c = calc(s), x = s.h[0];
        if (c.done && !(x && x.e === s.e && x.v === s.v && x.m === s.m && x.p === s.p)) { s.h.unshift({ ts: nowHM(), at: Date.now(), e: s.e, v: s.v, m: s.m, p: s.p }); s.h = s.h.slice(0, 12); }
        const y = s.h[0];
        if (!y) { toast('Pirmiausia įvertinkite visus tris komponentus'); return; }
        const cy = calc(y);
        const who = MC.addGcs({ ts: y.ts, v: cy.nt ? 'NT' : String(cy.tot), d: cy.comp + (cy.gp != null ? ', GKS-P ' + cy.gp : '') });
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
    return '<section class="tfc" aria-label="TST schema"><div class="nlh"><b>Schema</b></div>' +
      fr('q1', '1. Vaikšto?', '', '<div class="fo tp3">P3<small>gali palaukti</small></div>') + no +
      fr('q2', '2. Masyvus kraujavimas?', '', '<div class="fo tp1">P1<small>spaudimas, turniketas, tamponavimas</small></div>') + no +
      fr('q3', '3. Kalba?', 'dejuoja, murma – NE', '<div class="fo fsub">Penetruojantis sužalojimas (kaklas–sėdmenys)?<span><b class="tp1"><small>TAIP</small>P1</b><b class="tp2"><small>NE</small>P2</b></span></div>') + no +
      fr('q4', '4. Kvėpuoja?', 'atverkite kvėpavimo takus', '<div class="fo tp1">P1<small>stabili šoninė padėtis</small></div>') + no +
      '<div class="fr fend"><div class="fo tnb">NEKVĖPUOJA<small>šoninė padėtis; gaivinimas – tik jei leidžia ištekliai</small></div></div>' +
      '<p class="muted fchild">Vaikas iki 2 metų – visada P1.</p></section>';
  }
  function view() {
    const s = get(), learn = mode === 'learn';
    let h = '<h1>TST – rūšiavimas per 10 sekundžių</h1>';
    shownAt = Date.now();
    h += card(s) + tally(s) + flow(s);
    if (learn) h += '<div class="card">Ten Second Triage (TST) – Jungtinės Karalystės civilinė masinių nelaimių rūšiavimo priemonė (NHS England, 2023), pakeitusi ankstesnį „triage sieve“. Ją taiko visų tarnybų apmokyti pirmieji reaguotojai: keli paprasti klausimai, apie 10 sekundžių vienam sužeistajam, be fiziologinių matavimų. TCCC rūšiavimas (TCCC 2026 priedas A: I etapas – skubus / neskubus, II etapas – Urgent / Priority / Routine) ir vieneto SOP galioja toliau – TST yra pagalbinė atmintinė masinei nelaimei.</div>' + '<a class="row" href="#/igudis/36"><div>TCCC rūšiavimas ir evakuacijos skubumas<small>Įgūdis #36</small></div><span class="ar">›</span></a>';
    h += '<div class="card"><b>Svarbu</b><ul class="tnotes"><li>Vaikas iki 2 metų – visada P1.</li><li>Akivaizdžiai kritinės būklės vaikštantis – pasodinkite ir laikykite nevaikštančiu.</li><li>TST nenaudoja fiziologinių matavimų (pulso, KD, kapiliarų prisipildymo).</li><li>Skirta vienam vertintojui.</li><li>TST – ne vienkartinis vertinimas: kartokite, būklė keičiasi.</li></ul></div>';
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

// ───────── SITREP – padėties pranešimas (trumpasis taktinis formatas; tik March gide) ─────────
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
    return n ? `Užpildyta ${n}/10 eilučių` : 'Padėties pranešimas vadui';
  }
  function card(n, s, body, hint) {
    const v = lines(s)[n - 1], req = n <= 3;
    return `<section class="nl${v ? ' ok' : ''}${req ? ' req' : ''}"><div class="nlh"><span class="nn">${n}</span><b>${esc(TITLES[n - 1])}</b>${req ? '<small class="rq">būtina</small>' : ''}</div>${hint ? '<p class="muted">' + hint + '</p>' : ''}${body}</section>`;
  }
  const ta = (k, v, ph, lb, rows) => `<textarea class="inp" data-sr="${k}" rows="${rows || 2}" placeholder="${esc(ph)}" aria-label="${esc(lb)}">${esc(v)}</textarea>`;
  const inp = (k, v, ph, lb, extra) => `<input class="inp" data-sr="${k}" value="${esc(v)}" placeholder="${esc(ph)}" autocomplete="off" aria-label="${esc(lb)}"${extra || ''}>`;
  // Duomenys iš MIST kortelės ir TST skaičiavimo
  function others() {
    const ms = LS.get(TCFG.pre + 'mist', null), tst = LS.get(TCFG.pre + 'tst', null);
    const mist = ms && Array.isArray(ms.pts) ? ms.pts.length : 0;
    const t = tst && tst.n && typeof tst.n === 'object' ? tst.n : null;
    const tTot = t ? ['p1', 'p2', 'p3', 'nb'].reduce((a, k) => a + n99(t[k]), 0) : 0;
    return { mist, t, tTot };
  }
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
    if (o.mist > 1 || o.tTot) fill = '<p class="muted">' + [o.mist > 1 ? 'MIST kortelėje: ' + plural(o.mist, ['sužeistasis', 'sužeistieji', 'sužeistųjų']) : '', o.tTot ? `TST: P1 ${n99(o.t.p1)} · P2 ${n99(o.t.p2)} · P3 ${n99(o.t.p3)} · nekvėpuoja ${n99(o.t.nb)}` : ''].filter(Boolean).join(' · ') + '</p><button class="btn sm" data-act="sr-fill">Įrašyti sužeistuosius iš MIST / TST</button>';
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
        s.wia = Math.max(o.mist > 1 ? o.mist : 0, tw, s.wia);
        if (o.tTot) { const add = `TST: P1 ${n99(o.t.p1)}, P2 ${n99(o.t.p2)}, P3 ${n99(o.t.p3)}, nekvėpuoja ${n99(o.t.nb)}`; if (s.perTxt.indexOf('TST:') < 0) s.perTxt = [s.perTxt.trim(), add].filter(Boolean).join('; '); }
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

// ───────── Treniruočių scenarijai (SC) – kodas vienodas ETC ir March giduose; duomenys – scenarijai.js ─────────
const SC = (() => {
  const KEY = TCFG.pre + 'scen';
  let cur = null; // { id, qi, pick: [], done }
  const all = () => (E.scenarijai || []).filter(s => s && Array.isArray(s.q) && s.q.length && (!s.lygis || typeof ok !== 'function' || ok(s.lygis)));
  const best = () => { const b = LS.get(KEY, {}); return b && typeof b === 'object' && !Array.isArray(b) ? b : {}; };
  const byId = id => all().find(s => s.id === id);
  const LET = ['A', 'B', 'C', 'D'];
  const TOOLS = { '#/tst': 'TST rūšiavimas', '#/9line': '9-Line MEDEVAC', '#/mist': 'MIST kortelė', '#/sitrep': 'SITREP', '#/gks': 'GKS skaičiuoklė', '#/zymejimas': 'Vaistų žymėjimas', '#/nudegimai': 'Nudegimų plotas' };
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
  const chipLbl = p => (p.cat ? `<span class="ptc ${CATC[p.cat] || ''}">${p.cat === 'X' ? '✝' : p.cat}</span>` : '') + '#' + (p.i + 1) + (p.card.id ? ' ' + esc(String(p.card.id).slice(0, 14)) : '');
  function bar() {
    sync(); const L = list(); if (!L.pts.length) return '';
    return '<div class="ptbar" role="tablist" aria-label="Pacientai">' + L.pts.map(p => `<button role="tab" aria-selected="${p.i === L.cur}" class="${p.i === L.cur ? 'on' : ''}" data-act="pt-sel" data-k="${p.i}">${chipLbl(p)}</button>`).join('') +
      '<button class="add" data-act="pt-new" aria-label="Naujas pacientas">+</button><a class="ptf" href="#/pacientas" aria-label="Paciento failas">Failas ›</a></div>';
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
    put(+la.trauma || hmTs(c.t0), 'Sužeidimas' + ((c.mech || []).length ? ' – ' + c.mech.join(', ').toLowerCase() : ''));
    const tqs = c.tq && typeof c.tq === 'object' ? Object.keys(c.tq).filter(k => c.tq[k] && c.tq[k].on && hmTs(c.tq[k].tm)) : [];
    if (tqs.length) tqs.forEach(k => put(hmTs(c.tq[k].tm), 'Turniketas – ' + MC.tqName(k))); else put(+la.turn || hmTs(c.tqT), 'Turniketas');
    const z = get(pid, 'vz'), ze = z && Array.isArray(z.e) ? z.e : [];
    const rw = (c.rows || []).filter(r => r && !/^(vz:|kr)/.test(String(r.src || '')) && hmTs(r.time));
    rw.forEach(r => put(hmTs(r.time), [r.name, r.dose, r.route].map(x => String(x || '').trim()).filter(Boolean).join(' ')));
    if (c.txaT && !ze.some(e => e && e.v === 'txa') && !rw.some(r => /\btxa\b|tranek/i.test(r.name))) put(hmTs(c.txaT), 'TXA');
    (c.vit || []).forEach(v => put(hmTs(v.ts), MC.vitLine(v).replace(/^[^–]*–\s*/, '')));
    if (typeof VZ !== 'undefined') ze.forEach(e => { if (e && +e.t && e.v) put(+e.t, VZ.desc(Object.assign({ a: '', u: '', r: '', n: '' }, e))); });
    const w = get(pid, 'wbb');
    if (w && typeof w === 'object') { put(+w.t1, 'Šviežias kraujas – paėmimas'); put(+w.t2, 'Šviežias kraujas – perpylimas' + (w.don || w.donG ? ' (donoras ' + [w.don, w.donG].filter(Boolean).join(' ') + ')' : '')); }
    return ev.sort((a, b) => a[0] - b[0]);
  }
  function text() {
    sync(); const L = list(), p = L.pts[L.cur]; if (!p) return '';
    const out = [MC.curText()];
    if (typeof VZ !== 'undefined' && VZ.get().e.length) out.push(VZ.text(VZ.get()));
    if (typeof NB !== 'undefined' && NB.total()) out.push('NUDEGIMAI: ' + NB.status());
    const w = LS.get(TCFG.pre + 'wbb', null);
    if (w && (w.t1 || w.t2 || w.don)) out.push('ŠVIEŽIAS KRAUJAS: ' + [w.don || w.donG ? 'donoras ' + [w.don, w.donG].filter(Boolean).join(' ') : '', w.t1 ? 'paėmimas ' + hm(w.t1) : '', w.t2 ? 'perpylimas nuo ' + hm(w.t2) : ''].filter(Boolean).join(', '));
    return out.join('\n\n');
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
      (typeof KR !== 'undefined' ? tile('#/pilnas-kraujas', 'Šviežias kraujas', KR.status()) : '') + '</div>';
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
      case 'pt-new': { add(); const L = list(); toast('Naujas pacientas #' + (L.cur + 1)); render(); scrollTo(0, 0); return; }
      case 'pt-copy': return copyText(text());
      case 'pt-read': return readMode('Paciento perdavimas', text().split('\n').filter(x => x.trim()).map(x => esc(x)));
    }
  }
  return { sync, get, list, select, selectPid, add, bar, homeRow, events, text, view, act, dismiss, dismissed, hmTs };
})();

// ───────── Priminimai (REM): turniketo peržiūra, TXA riba, kartotinės dozės, gyvybės požymiai ─────────
const REM = (() => {
  const VK = TCFG.pre + 'remvit', NK = TCFG.pre + 'rem-n';
  const mm = ms => Math.round(ms / 60000);
  const dur = m => m >= 60 ? Math.floor(m / 60) + ' val. ' + String(m % 60).padStart(2, '0') + ' min' : m + ' min';
  const LV = { r: 0, a: 1, i: 2 };
  function items(only) {
    const L = PT.list(), now = Date.now(), dis = PT.dismissed(), out = [], vitN = +LS.get(VK, 0) || 0;
    L.pts.forEach(p => {
      if (only && p.pid !== only) return;
      const c = p.card, la = PT.get(p.pid, 'laikai') || {}, who = L.pts.length > 1 && !only ? p.label + ' · ' : '';
      const push = (key, lvl, title, sub, go) => { if (!dis[key]) out.push({ key, lvl, title, sub: who + sub, go, pid: p.pid }); };
      const tq = +la.turn || PT.hmTs(c.tqT) || 0;
      if (tq) { const left = mm(tq + 2 * 3600e3 - now); if (left <= 15) push('tq:' + p.pid + ':' + tq, left <= 0 ? 'r' : 'a', 'Turniketas – peržiūra', 'uždėtas ' + hm(tq) + ' · ' + (left <= 0 ? 'prieš ' + dur(mm(now - tq)) : 'liko ' + left + ' min'), '#/mist'); }
      const z = PT.get(p.pid, 'vz'), ze = z && Array.isArray(z.e) ? z.e : [];
      const txa = (c.tx || []).indexOf('txa') >= 0 || !!c.txaT || ze.some(e => e && e.v === 'txa'), tr = +la.trauma || 0;
      if (tr && !txa) { const left = mm(tr + 3 * 3600e3 - now); if (left <= 60 && left > -60) push('txa:' + p.pid + ':' + tr, left <= 0 ? 'r' : 'a', left <= 0 ? 'TXA – 3 val. riba praėjo' : 'TXA – iki 3 val. ribos', 'sužeistas ' + hm(tr) + (left > 0 ? ' · liko ' + dur(left) : ''), typeof VZ !== 'undefined' ? '#/zymejimas' : '#/vaistas/txa'); }
      if (typeof VZ !== 'undefined') {
        const last = {}; ze.forEach(e => { if (e && e.v && +e.t && (!last[e.v] || +e.t > +last[e.v].t)) last[e.v] = e; });
        Object.keys(last).forEach(id => { const e = last[id], iv = VZ.interval(e.v, e.r); if (!iv || now - e.t > 24 * 3600e3 || now < +e.t + iv * 60000) return;
          push('rx:' + p.pid + ':' + e.v + ':' + e.t, 'a', VZ.name(e.v).replace(/ \(.*\)$/, '') + ' – galima kartoti', 'paskutinė ' + hm(+e.t) + ' (prieš ' + dur(mm(now - e.t)) + ') · kas ' + (iv >= 60 ? iv / 60 + ' val.' : iv + ' min'), '#/zymejimas'); });
      }
      if (vitN) { const vs = (c.vit || []).map(v => PT.hmTs(v.ts)).filter(Boolean), lt = vs.length ? Math.max(...vs) : 0;
        if (lt && now - lt >= vitN * 60000) push('vit:' + p.pid + ':' + lt, 'i', 'Gyvybės požymiai – pakartoti', 'paskutiniai ' + hm(lt) + ' (prieš ' + dur(mm(now - lt)) + ')', '#/mist'); }
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
    return '<h2>Priminimai</h2><p class="muted">Turniketo peržiūra (2 val.), TXA riba (3 val. nuo sužeidimo)' + (typeof VZ !== 'undefined' ? ' ir kartotinės dozės pagal gidą' : '') + ' primenamos visada. Gyvybės požymių pakartojimas:</p>' +
      '<div class="seg2">' + [[0, 'Išjungta'], [5, '5 min'], [15, '15 min'], [30, '30 min']].map(([k, t]) => `<button class="${v === k ? 'on' : ''}" data-act="rem-vit" data-k="${k}" aria-pressed="${v === k}">${t}</button>`).join('') + '</div>' +
      '<p class="muted">Priminimas – juosta pradžios ekrane ir paciento faile, vibracija. Veikia, kol programėlė atidaryta' + (/iPhone|iPad/.test(navigator.userAgent) ? ' (iPhone – tik atidarius)' : ' ar veikia fone') + '.</p>';
  }
  function act(el) {
    const d = el.dataset;
    switch (d.act) {
      case 'rem-x': PT.dismiss(d.k); { const y = scrollY; render(); scrollTo(0, y); } return;
      case 'rem-go': PT.selectPid(d.k); if (location.hash === d.r) render(); else location.hash = d.r; return;
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
  const PARTS = () => [['m', 'MIST ir laikai']].concat(typeof VZ !== 'undefined' ? [['z', 'Vaistai']] : [], typeof NB !== 'undefined' ? [['n', 'Nudegimai']] : [], typeof KR !== 'undefined' ? [['w', 'Šviežias kraujas']] : [], [['9', '9-Line']]);
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
    if (sel.m) { o.m = c; const la = LS.get(TCFG.laikai, null); if (la && (la.trauma || la.turn)) o.lk = { trauma: +la.trauma || 0, turn: +la.turn || 0 }; if (me && me.cat) o.c = me.cat; }
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
    h += `<p class="muted">${esc(p ? p.label : '')}${p && p.cat ? ' · ' + p.cat : ''} · be interneto</p>`;
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
      if (o.w && (o.w.t1 || o.w.t2)) lines.push('Šviežias kraujas' + (o.w.t2 ? ' – perpylimas ' + hm(o.w.t2) : ''));
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
      case 'qr-new': if (!got) return; importNew(got); got = null; toast('Pacientas įrašytas'); location.hash = '#/pacientas'; return;
      case 'qr-merge': if (!got) return; if (!confirm('Papildyti dabartinį pacientą gautais duomenimis?')) return; merge(got); got = null; toast('Papildyta'); location.hash = '#/pacientas'; return;
      case 'qr-cancel': got = null; err = ''; rx = null; render(); return;
    }
  }
  // Testams: be kameros perduoti nuskaitytą tekstą
  return { view, after, act, stopAll, encode, decode, onText, reset: () => { sel = null; got = null; rx = null; err = ''; } };
})();

// ───────── Balso diktavimas (DICT): mikrofono mygtukas prie tekstinių laukų ─────────
const DICT = (() => {
  const SRc = window.SpeechRecognition || window.webkitSpeechRecognition;
  const SEL = 'textarea.inp, input[data-mc="mechTxt"], input[data-mc="injTxt"], input[data-mc="txTxt"], input[data-vz="n"], input[data-ms="nt"], input[data-sr="comTxt"], input[data-sr="reqTxt"], input[data-sr="enTxt"]';
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
