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
  mc: () => [['#/pacientas', 'Paciento failas', 'Įvykių eiga, perdavimas QR'], ['#/qr-priimti', 'Priimti pacientą QR kodu', 'Nuskaityti kito telefono kodą'], ['#/9line', '9-Line MEDEVAC', NL.status()], [listRoute('tac-perdavimas'), 'Perdavimas priimančiai grandžiai', 'Kontrolinis sąrašas'], ['#/igudis/34', 'Perdavimas ir perėmimas', 'Įgūdis #34'], ['#/sitrep', 'SITREP – padėties pranešimas', SR.status()]],
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
    h += `<section class="outp"><div class="nlh"><b>Perduoti</b></div><pre id="nl-out">${esc(text(s))}</pre>` +
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

// ───────── MIST kortelė (vizuali: kūno schema, požymių lentelė; keli sužeistieji – kiekvienam sava kortelė) ─────────
const MC = (() => {
  const KEY = TCFG.pre + 'mist';
  const MECH = ['Šautinė žaizda', 'Skeveldros', 'Sprogimas', 'Bukas sužalojimas', 'Nudegimas', 'Kritimas', 'Eismo įvykis', 'Kita'];
  // Žymės: [raktas, raidė, pavadinimas, spalva, raidės spalva]
  const MK = [['Z', 'Ž', 'Žaizda', '#C2410C', '#fff'], ['K', 'K', 'Kraujavimas', '#C0182B', '#fff'], ['L', 'L', 'Lūžis', '#1D5FB4', '#fff'],
    ['N', 'N', 'Nudegimas', '#F2B705', '#1B1B1B'], ['A', 'A', 'Amputacija', '#6B2A8C', '#fff'], ['T', 'T', 'Turniketas', '#111111', '#fff']];
  const mkT = k => MK.find(x => x[0] === k) || MK[0];
  // Gydymas: [raktas, pavadinimas, lygis]. Lygis 'CMC' – March gide slepiama, kai įjungta „Rodyti tik CLS“ (ETC gide ok('CMC') visada tiesa).
  const TX = [['tq', 'Turniketas'], ['pack', 'Tamponavimas'], ['press', 'Spaudžiamasis tvarstis'], ['occl', TCFG.occl || 'Okliuzinis tvarstis'], ['dec', 'Dekompresija'],
    ['aw', 'Kvėpavimo takai'], ['iv', 'IV / IO', 'CMC'], ['txa', 'TXA', 'CMC'], ['blood', 'Kraujas', 'CMC'], ['ca', 'Kalcis', 'CMC'], ['an', 'Analgezija'], ['ab', 'Antibiotikai'],
    ['spl', 'Įtvaras'], ['hypo', 'Hipotermijos prevencija']];
  const txShown = (x, s) => !x[2] || typeof ok !== 'function' || ok(x[2]) || s.tx.indexOf(x[0]) >= 0; // jau pažymėtas – rodomas, kad būtų galima atžymėti
  const AVPU = [['A', 'budrus'], ['V', 'balsas'], ['P', 'skausmas'], ['U', 'nereaguoja']];
  const SEX = [['V', 'Vyras'], ['M', 'Moteris']];
  const VF = ['t', 'av', 'hr', 'rr', 'bp', 'spo2', 'gcs', 'pain'];
  const blankF = () => ({ t: '', av: '', hr: '', rr: '', bp: '', spo2: '', gcs: '', pain: '' });
  const def = () => ({ id: '', sex: '', t0: '', mech: [], mechTxt: '', mk: [], injTxt: '', vit: [], f: blankF(), tx: [], tqT: '', txaT: '', txTxt: '' });
  const str = v => v == null ? '' : String(v);
  // Vienos kortelės tvarkymas (netikėti duomenys – nelūžta)
  function fix(raw) {
    const s = Object.assign(def(), raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {});
    ['id', 'sex', 't0', 'mechTxt', 'injTxt', 'tqT', 'txaT', 'txTxt'].forEach(k => { s[k] = str(s[k]); });
    ['mech', 'mk', 'vit', 'tx'].forEach(k => { if (!Array.isArray(s[k])) s[k] = []; });
    s.mech = s.mech.filter(x => typeof x === 'string'); s.tx = s.tx.filter(x => typeof x === 'string');
    const f = s.f && typeof s.f === 'object' ? s.f : {}; s.f = blankF(); VF.forEach(k => { s.f[k] = str(f[k]); });
    s.mk = s.mk.filter(m => m && (m.s === 'f' || m.s === 'b') && isFinite(m.x) && isFinite(m.y)).map(m => ({ t: mkT(m.t)[0], s: m.s, x: +m.x, y: +m.y, tm: str(m.tm) }));
    s.vit = s.vit.filter(v => v && typeof v === 'object').map(v => { const o = { ts: str(v.ts) }; VF.slice(1).concat('gcsD').forEach(k => { o[k] = str(v[k]); }); return o; });
    return s;
  }
  // Saugojimas: { v: 2, cur, pts: [kortelė, …] }. Ankstesnis vienos kortelės formatas perkeliamas; kiti seni formatai – TCFG.migrate
  // (originalas – KEY-v1); nežinomas formatas – kopija į KEY-v1 ir nauja kortelė.
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
  const save = st => LS.set(KEY, st);
  const curOf = st => st.pts[st.cur];
  // Pradžios ekrano laikmačiai (sužeidimas, turniketas) – dabartinio paciento (paciento failas juos perjungia kartu su kortele)
  const timers = st => LS.get(TCFG.laikai, {}) || {};
  let tool = 'Z', undo = [];
  const snap = s => { undo.push(JSON.stringify(s.mk)); if (undo.length > 30) undo.shift(); };

  // ── kūno siluetas: viewBox 0 0 120 250, centras x = 60; priekis – paciento dešinė ekrano kairėje ──
  const SHAPES = '<ellipse cx="60" cy="20" rx="12" ry="15"/><path d="M54 31h12l1.5 14h-15z"/>' +
    '<path d="M50 43.5C41 44 35.5 46.5 34 55L37.5 99C36.5 112 36.5 125 38 138L59 143H61L82 138C83.5 125 83.5 112 82.5 99L86 55C84.5 46.5 79 44 70 43.5Z"/>' +
    '<path d="M35 49C27 50.5 24.5 56 24 64L19.5 101L13.5 139H21.5L28 104L33.5 80Z"/><path d="M85 49C93 50.5 95.5 56 96 64L100.5 101L106.5 139H98.5L92 104L86.5 80Z"/>' +
    '<ellipse cx="17" cy="148" rx="5.5" ry="9.5"/><ellipse cx="103" cy="148" rx="5.5" ry="9.5"/>' +
    '<path d="M38 134L39.5 182L42.5 228H54L56 182L59.5 142Z"/><path d="M82 134L80.5 182L77.5 228H66L64 182L60.5 142Z"/>' +
    '<ellipse cx="47.5" cy="235" rx="7.5" ry="5"/><ellipse cx="72.5" cy="235" rx="7.5" ry="5"/>';
  // Apytikslė kūno sritis pagal koordinates (tokia pati geometrija kaip SHAPES)
  function region(sd, x, y) {
    const dx = x - 60, ad = Math.abs(dx), back = sd === 'b';
    const right = (dx < 0) === !back, side = right ? 'dešinė' : 'kairė', Side = right ? 'Dešinė' : 'Kairė', bk = back ? ', užpakalinė pusė' : '';
    if (y < 35.5) return { o: 1, t: back ? 'Galva, pakaušis' : 'Galva, veidas' };
    if (y < 45 && ad <= 8.5) return { o: 2, t: back ? 'Sprandas' : 'Kaklas' };
    const th = y < 55 ? 26 : y < 99 ? 26 - (y - 55) / 44 * 3.5 : 22.5;
    if ((y < 58 && ad > 17) || (y < 140 && ad > th) || (y >= 140 && ad > 30)) {
      const part = y < 58 ? 'petys' : y < 101 ? 'žastas' : y < 138 ? 'dilbis' : 'plaštaka';
      return { o: right ? 6 : 7, t: Side + ' ranka – ' + part + bk };
    }
    if (y < 140) {
      const nmT = y < 90 ? (back ? 'Nugara' : 'Krūtinė') : y < 117 ? (back ? 'Juosmuo' : 'Pilvas') : (back ? 'Sėdmenys' : 'Dubuo / kirkšnis');
      return { o: y < 90 ? 3 : y < 117 ? 4 : 5, t: nmT + ', ' + (ad <= 5 ? 'vidurio linija' : side + ' pusė') };
    }
    const part = y < 182 ? 'šlaunis' : y < 228 ? 'blauzda' : 'pėda';
    return { o: right ? 8 : 9, t: Side + ' koja – ' + part + bk };
  }
  const mkName = m => mkT(m.t)[2].toLowerCase() + (m.t === 'T' && m.tm ? ' ' + m.tm : '');
  function sortedMk(s) {
    return s.mk.map((m, i) => ({ m, i, r: region(m.s, m.x, m.y) }))
      .sort((a, b) => a.r.o - b.r.o || (a.m.s === b.m.s ? 0 : a.m.s === 'f' ? -1 : 1) || a.m.y - b.m.y);
  }
  function injText(s) {
    const g = [];
    sortedMk(s).forEach(({ m, r }) => { const l = g[g.length - 1]; if (l && l.t === r.t) l.a.push(mkName(m)); else g.push({ t: r.t, a: [mkName(m)] }); });
    return [g.map(x => x.t + ': ' + x.a.join(', ')).join('; '), s.injTxt.trim()].filter(Boolean).join('; ');
  }
  const markerSvg = (m, i) => {
    const T = mkT(m.t), lb = T[2] + ' – ' + region(m.s, m.x, m.y).t;
    return `<g class="mk" data-act="mc-mdel" data-k="${i}" role="button" tabindex="0" aria-label="Pašalinti žymę: ${esc(lb)}" transform="translate(${m.x} ${m.y})"><circle class="hit" r="11"/><circle class="dot" r="8" fill="${T[3]}"/><text y="3.6" fill="${T[4]}">${T[1]}</text></g>`;
  };
  function figure(s, sd) {
    const lab = sd === 'f' ? ['D', 'K'] : ['K', 'D'], nmF = sd === 'f' ? 'Priekis' : 'Nugara';
    return `<figure class="bfig"><svg viewBox="0 0 120 250" data-act="mc-body" data-s="${sd}" role="img" aria-label="Kūnas – ${nmF.toLowerCase()}. Bakstelėkite sužalojimo vietą.">` +
      `<g class="bo">${SHAPES}</g><g class="bf">${SHAPES}</g>` + (sd === 'b' ? '<path class="bsp" d="M60 47V130"/>' : '') +
      `<text class="blr" x="9" y="14">${lab[0]}</text><text class="blr" x="111" y="14">${lab[1]}</text>` +
      s.mk.map((m, i) => m.s === sd ? markerSvg(m, i) : '').join('') + `</svg><figcaption>${nmF}</figcaption></figure>`;
  }
  const bdg = k => { const T = mkT(k); return `<span class="bdg" style="--c:${T[3]};--fg:${T[4]}" aria-hidden="true">${T[1]}</span>`; };

  // ── požymiai: tikrinimas ir išdėstymas ──
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
  function vitLine(v) {
    return [v.ts + ' –', v.av ? 'AVPU ' + v.av : '', v.hr ? 'ŠSD ' + v.hr : '', v.rr ? 'KD ' + v.rr : '', v.bp ? 'AKS ' + v.bp : '', v.spo2 ? 'SpO₂ ' + v.spo2 + ' %' : '',
      v.gcs ? (v.gcs === 'NT' ? 'GKS ' + (v.gcsD || 'NT') + ' (suma neskaičiuojama)' : 'GKS ' + v.gcs + (v.gcsD ? ' (' + v.gcsD + ')' : '')) : '', v.pain !== '' && v.pain != null ? 'skausmas ' + v.pain + '/10' : '']
      .filter(Boolean).join(', ').replace(' –,', ' –');
  }
  const ACR = /^(TXA|IV|IO)\b/;
  const lc = a => a.map((x, i) => i === 0 || ACR.test(x) ? x : x.toLowerCase()).join(', ');
  function txList(s) { return TX.filter(([k]) => s.tx.indexOf(k) >= 0).map(([k, t]) => k === 'tq' && s.tqT ? t + ' ' + s.tqT : k === 'txa' && s.txaT ? t + ' ' + s.txaT : t); }
  const sexName = s => (SEX.find(x => x[0] === s.sex) || ['', ''])[1].toLowerCase();
  // n / tot – sužeistojo numeris ir kiek iš viso (kai keli – antraštėje „MIST 2/3“)
  function parts(s, n, tot) {
    const hd = ['MIST' + (tot > 1 ? ' ' + n + '/' + tot : '') + (s.id.trim() ? ' – ' + s.id.trim() : ''), sexName(s)].filter(Boolean).join(' · ');
    const M = [lc(s.mech), s.mechTxt.trim()].filter(Boolean).join('; ') + (s.t0 ? (s.mech.length || s.mechTxt.trim() ? '; ' : '') + 'sužeista ' + s.t0 : '');
    const S = s.vit.slice().reverse().map(vitLine);
    return { hd, M: M || '—', I: injText(s) || '—', S: S.length ? S : ['—'], T: [lc(txList(s)), s.txTxt.trim()].filter(Boolean).join('; ') || '—' };
  }
  function text(s, n, tot) { const P = parts(s, n, tot); return [P.hd, 'M: ' + P.M, 'I: ' + P.I, 'S: ' + P.S.join('\n   '), 'T: ' + P.T].join('\n'); }
  const curText = st => text(curOf(st), st.cur + 1, st.pts.length);
  const allText = st => st.pts.map((p, i) => text(p, i + 1, st.pts.length)).join('\n\n');
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
    if (!a.length && (s.mech.length || s.tx.length || s.t0)) a.push('Pildoma');
    return a.length ? a.join(' · ') : 'Vizuali sužeistojo kortelė';
  }

  function secHead(letter, title, sub) { return `<div class="mcl"><span class="lt">${letter}</span><b>${title}</b>${sub ? '<small>' + sub + '</small>' : ''}</div>`; }
  const tabLabel = (i, id) => 'Sužeistasis ' + (i + 1) + (id ? ' – ' + id : '');
  function tabs(st) {
    return '<div class="ptabs" role="tablist" aria-label="Sužeistieji">' + st.pts.map((p, i) => {
      const id = p.id.trim(), on = i === st.cur;
      return `<button class="${on ? 'on' : ''}" data-act="mc-sel" data-k="${i}" role="tab" aria-selected="${on}" aria-label="${esc(tabLabel(i, id))}">${i + 1}${id ? '<small>' + esc(id) + '</small>' : ''}</button>`;
    }).join('') + '<button class="add" data-act="mc-add" aria-label="Pridėti sužeistąjį" title="Pridėti sužeistąjį">+</button></div>';
  }

  function view() {
    const st = load(), s = curOf(st), n = st.cur + 1, tot = st.pts.length, learn = mode === 'learn', T = timers(st), F = s.f;
    let h = '<h1>MIST kortelė</h1>';
    if (learn) h += '<p class="muted">MIST – struktūruotas sužeistojo perdavimas: <b>M</b> – mechanizmas ir laikas, <b>I</b> – sužalojimai, <b>S</b> – požymiai ir jų dinamika, <b>T</b> – suteiktas gydymas. Kortelė pildoma eigoje ir perskaitoma perduodant. Keli sužeistieji – kiekvienam atskira kortelė (skirtukai 1, 2, … ir „+“).</p>';
    h += tabs(st);
    h += `<article class="mc" aria-label="MIST kortelė – sužeistasis ${n}">`;
    h += `<div class="mch"><b>MIST</b><span>${tot > 1 ? 'sužeistasis ' + n + ' iš ' + tot : 'sužeistojo kortelė'}</span></div>`;
    // antraštė: ID, lytis, sužeidimo laikas
    h += `<div class="mcid"><div class="in2"><label>ID / šaukinys<input class="inp" data-mc="id" value="${esc(s.id)}" autocomplete="off" placeholder="pvz. Vilkas 2"></label>` +
      `<div><span class="lbl0">Lytis</span><div class="chips">${SEX.map(([k, t]) => chip('mc-sex', k, s.sex === k, t)).join('')}</div></div></div>` +
      `<div class="tline"><span>Sužeidimo laikas</span><input type="time" class="inp" data-mc="t0" value="${esc(s.t0)}" aria-label="Sužeidimo laikas">` +
      (T.trauma ? `<button class="btn sm" data-act="mc-t0" data-k="tm">⏱ Laikmatis ${hm(T.trauma)}</button>` : '') + '<button class="btn sm" data-act="mc-now" data-k="t0">Dabar</button></div>' +
      (T.trauma ? '' : '<p class="muted mt0">Traumos laikmatis nenustatytas (Pradžia → Laikai).</p>') + '</div>';
    // M
    h += '<section class="mcs sM">' + secHead('M', 'Mechanizmas', 'galima keli') +
      '<div class="opts">' + MECH.map(m => chip('mc-mech', m, s.mech.indexOf(m) >= 0, esc(m))).join('') + '</div>' +
      `<input class="inp" data-mc="mechTxt" value="${esc(s.mechTxt)}" placeholder="Patikslinimas (nebūtina)" autocomplete="off" aria-label="Mechanizmo patikslinimas"></section>`;
    // I
    h += '<section class="mcs sI">' + secHead('I', 'Sužalojimai', 'pasirinkite žymę ir bakstelėkite kūną') +
      '<div class="mtool" role="radiogroup" aria-label="Žymės tipas">' + MK.map(([k, , t]) => `<button class="${tool === k ? 'on' : ''}" data-act="mc-tool" data-k="${k}" role="radio" aria-checked="${tool === k}">${bdg(k)}<span>${t}</span></button>`).join('') + '</div>' +
      '<div class="bfigs">' + figure(s, 'f') + figure(s, 'b') + '</div>' +
      `<div class="acts"><button class="btn" data-act="mc-undo"${undo.length ? '' : ' disabled'}>↶ Atšaukti</button><button class="btn" data-act="mc-mclr"${s.mk.length ? '' : ' disabled'}>Išvalyti žymes</button></div>`;
    const SM = sortedMk(s);
    h += SM.length ? '<ul class="mlist" aria-label="Žymės pagal kūno sritį">' + SM.map(({ m, i, r }) =>
      `<li>${bdg(m.t)}<div class="mt"><b>${esc(r.t)}</b> – ${esc(mkT(m.t)[2].toLowerCase())}` +
      (m.t === 'T' ? `<label class="mtq">Uždėtas<input type="time" class="inp" data-mcm="${i}" value="${esc(m.tm)}"></label>` : '') + '</div>' +
      `<button class="x" data-act="mc-mdel" data-k="${i}" aria-label="Pašalinti: ${esc(mkT(m.t)[2] + ' – ' + r.t)}">×</button></li>`).join('') + '</ul>'
      : '<p class="muted">Pasirinkite žymės tipą ir bakstelėkite kūno schemoje. Bakstelėjus žymę – ji pašalinama. D – paciento dešinė, K – kairė.</p>';
    h += `<input class="inp" data-mc="injTxt" value="${esc(s.injTxt)}" placeholder="Kiti sužalojimai, patikslinimas (nebūtina)" autocomplete="off" aria-label="Sužalojimų patikslinimas"></section>`;
    // S
    const num = (k, lb, ph, im) => `<label>${lb}<input class="inp" data-mcf="${k}" value="${esc(F[k])}" inputmode="${im || 'numeric'}" placeholder="${ph}" autocomplete="off"></label>`;
    h += '<section class="mcs sS">' + secHead('S', 'Požymiai', 'kartokite kas 5–10 min') +
      `<div class="tline"><span>Laikas <small>(tuščia – dabar)</small></span><input type="time" class="inp" data-mcf="t" value="${esc(F.t)}" aria-label="Matavimo laikas"></div>` +
      '<div class="lbl">Sąmonė (AVPU)</div><div class="chips avpu">' + AVPU.map(([k, t]) => chip('mc-av', k, F.av === k, `<b>${k}</b><small>${t}</small>`, ` aria-label="${k} – ${t}"`)).join('') + '</div>' +
      '<div class="vgrid">' + num('hr', 'ŠSD', 'k./min') + num('rr', 'KD', 'k./min') + num('bp', 'AKS', '120/80', 'text') + num('spo2', 'SpO₂', '%') + num('gcs', 'GKS', '3–15') + num('pain', 'Skausmas', '0–10') + '</div>' +
      '<button class="btn pri" data-act="mc-vit">+ Matavimas</button>';
    if (s.vit.length) {
      const V = s.vit.map((v, i) => ({ v, i })).reverse();
      const rowV = (k, lb, fmtv) => `<tr><th scope="row">${lb}</th>` + V.map(({ v }) => `<td class="${abn(k, v[k]) ? 'ab' : ''}">${esc(fmtv ? fmtv(v) : v[k]) || '·'}</td>`).join('') + '</tr>';
      h += '<div class="vtw"><table class="vt"><thead><tr><th scope="col">Laikas</th>' + V.map(({ v }) => `<th scope="col">${esc(v.ts)}</th>`).join('') + '</tr></thead><tbody>' +
        rowV('av', 'AVPU') + rowV('hr', 'ŠSD') + rowV('rr', 'KD') + rowV('bp', 'AKS') + rowV('spo2', 'SpO₂') + rowV('gcs', 'GKS') + rowV('pain', 'Skausmas') +
        '<tr class="vdel"><th scope="row"><span class="vh">Ištrinti</span></th>' + V.map(({ v, i }) => `<td><button class="x" data-act="mc-vdel" data-k="${i}" aria-label="Ištrinti ${esc(v.ts)} matavimą">×</button></td>`).join('') + '</tr>' +
        '</tbody></table></div><p class="muted">Naujausias – kairėje. Raudonai – už orientacinių ribų (suaugusiajam).</p>';
    } else h += '<p class="muted">Dar nėra matavimų. Pirmą įrašykite kuo anksčiau – svarbiausia dinamika.</p>';
    h += '</section>';
    // T
    h += '<section class="mcs sT">' + secHead('T', 'Gydymas', 'pažymėkite, kas atlikta') +
      '<div class="opts">' + TX.filter(x => txShown(x, s)).map(([k, t]) => chip('mc-tx', k, s.tx.indexOf(k) >= 0, esc(t))).join('') + '</div>' +
      (s.tx.indexOf('tq') >= 0 ? `<div class="tline"><span>Turniketo laikas</span><input type="time" class="inp" data-mc="tqT" value="${esc(s.tqT)}" aria-label="Turniketo laikas"><button class="btn sm" data-act="mc-now" data-k="tqT">Dabar</button></div>` : '') +
      (s.tx.indexOf('txa') >= 0 ? `<div class="tline"><span>TXA laikas</span><input type="time" class="inp" data-mc="txaT" value="${esc(s.txaT)}" aria-label="TXA laikas"><button class="btn sm" data-act="mc-now" data-k="txaT">Dabar</button></div>` : '') +
      `<textarea class="inp" data-mc="txTxt" rows="2" placeholder="Vaistai, dozės, būdai ir laikai, pvz. ketaminas 25 mg IV 14:20" aria-label="Gydymo patikslinimas">${esc(s.txTxt)}</textarea></section>`;
    h += '</article>';
    h += `<section class="outp"><div class="nlh"><b>Perduoti</b>${tot > 1 ? `<small class="muted">sužeistasis ${n} iš ${tot}</small>` : ''}</div><pre id="mc-out">${esc(text(s, n, tot))}</pre>` +
      '<div class="acts"><button class="btn pri" data-act="mc-read">Skaityti</button><button class="btn" data-act="mc-copy">Kopijuoti</button><button class="btn" data-act="mc-share">Bendrinti</button></div>' +
      (tot > 1 ? `<div class="acts"><button class="btn" data-act="mc-copyall">Kopijuoti visus (${tot})</button><button class="btn" data-act="mc-shareall">Bendrinti visus</button></div>` : '') +
      `<div class="acts"><button class="btn" data-act="mc-add">+ Kitas sužeistasis</button><button class="btn dng" data-act="mc-new">${tot > 1 ? 'Išvalyti šią kortelę' : 'Naujas sužeistasis – išvalyti kortelę'}</button></div>` +
      (tot > 1 ? `<div class="acts"><button class="btn dng" data-act="mc-pdel">Ištrinti sužeistąjį ${n}</button><button class="btn dng" data-act="mc-allclr">Išvalyti visus</button></div>` : '') + '</section>';
    h += tcfgRows(TCFG.mc());
    return h;
  }

  // Bakstelėjimas ant schemos → viewBox koordinatės; tik ant silueto (arba šalia – pritraukiama)
  function bodyPoint(svg, e) {
    const ctm = svg.getScreenCTM(); if (!ctm) return null;
    let p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; p = p.matrixTransform(ctm.inverse());
    const shapes = svg.querySelectorAll('.bf > *');
    const inside = (x, y) => {
      const q = svg.createSVGPoint(); q.x = x; q.y = y;
      try { for (const sh of shapes) if (sh.isPointInFill(q)) return true; return false; } catch (err) { return true; }
    };
    if (!shapes.length || !shapes[0].isPointInFill || inside(p.x, p.y)) return { x: p.x, y: p.y };
    for (let r = 2; r <= 6; r += 2) for (let a = 0; a < 8; a++) {
      const x = p.x + r * Math.cos(a * Math.PI / 4), y = p.y + r * Math.sin(a * Math.PI / 4);
      if (inside(x, y)) return { x, y };
    }
    return null;
  }

  function act(el, e) {
    const st = load(), s = curOf(st), d = el.dataset, k = d.k, n = st.cur + 1, tot = st.pts.length;
    switch (d.act) {
      // ── sužeistieji ──
      case 'mc-sel': { const i = +k; if (!(i >= 0 && i < tot) || i === st.cur) return; st.cur = i; undo = []; save(st); render(); return; }
      case 'mc-add': {
        if (tot >= 30) { toast('Daugiausia 30 sužeistųjų'); return; }
        st.pts.push(def()); st.cur = st.pts.length - 1; undo = []; save(st); render(); scrollTo(0, 0);
        toast('Pridėtas sužeistasis ' + st.pts.length); return;
      }
      case 'mc-pdel': {
        if (tot < 2) return;
        if (!confirm('Ištrinti sužeistąjį ' + n + (s.id.trim() ? ' (' + s.id.trim() + ')' : '') + ' ir visą jo kortelę?')) return;
        st.pts.splice(st.cur, 1); st.cur = Math.min(st.cur, st.pts.length - 1); undo = []; save(st); render(); scrollTo(0, 0);
        toast('Sužeistasis ištrintas'); return;
      }
      case 'mc-allclr': if (!confirm('Išvalyti visų ' + plural(tot, ['sužeistojo', 'sužeistųjų', 'sužeistųjų']) + ' korteles?')) return; undo = []; save(fresh()); render(); scrollTo(0, 0); toast('Visos kortelės išvalytos'); return;
      case 'mc-new': if (!confirm(tot > 1 ? 'Išvalyti visą sužeistojo ' + n + ' MIST kortelę?' : 'Naujas sužeistasis: išvalyti visą MIST kortelę?')) return; undo = []; st.pts[st.cur] = def(); save(st); render(); scrollTo(0, 0); toast('Kortelė išvalyta'); return;
      // ── kortelė ──
      case 'mc-sex': s.sex = s.sex === k ? '' : k; break;
      case 'mc-t0': { const T = timers(st); if (!T.trauma) { toast('Traumos laikmatis nenustatytas'); return; } s.t0 = hm(T.trauma); toast('Sužeidimo laikas ' + s.t0); break; }
      case 'mc-now': s[k] = nowHM(); break;
      case 'mc-mech': { const i = s.mech.indexOf(k); if (i >= 0) s.mech.splice(i, 1); else s.mech.push(k); break; }
      case 'mc-tool': {
        tool = mkT(k)[0];
        app.querySelectorAll('.mtool button').forEach(b => { const on = b.dataset.k === tool; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
        return;
      }
      case 'mc-body': {
        if (!e || (!e.clientX && !e.clientY)) return;
        const p = bodyPoint(el, e);
        if (!p) { toast('Bakstelėkite ant kūno silueto'); return; }
        snap(s);
        const m = { t: tool, s: d.s === 'b' ? 'b' : 'f', x: Math.round(p.x * 10) / 10, y: Math.round(p.y * 10) / 10, tm: '' };
        if (tool === 'T') {
          const T = timers(st);
          m.tm = T.turn ? hm(T.turn) : nowHM();
          if (s.tx.indexOf('tq') < 0) s.tx.push('tq');
          if (!s.tqT) s.tqT = m.tm;
          toast('Turniketas ' + m.tm + ' – laiką galite pakeisti sąraše po schema');
        }
        s.mk.push(m);
        if (navigator.vibrate) navigator.vibrate(15);
        break;
      }
      case 'mc-mdel': { const i = +k; if (!(i >= 0 && i < s.mk.length)) return; snap(s); s.mk.splice(i, 1); break; }
      case 'mc-undo': { if (!undo.length) return; try { s.mk = JSON.parse(undo.pop()); } catch (err) { return; } break; }
      case 'mc-mclr': if (!s.mk.length) return; snap(s); s.mk = []; toast('Žymės išvalytos – galite atšaukti'); break;
      case 'mc-av': s.f.av = s.f.av === k ? '' : k; break;
      case 'mc-vit': {
        const f = s.f;
        if (!VF.slice(1).some(x => String(f[x]).trim() !== '')) { toast('Įveskite bent vieną požymį'); return; }
        const n3 = (v, lo, hi) => { v = String(v).trim(); return v === '' || (/^\d{1,3}$/.test(v) && +v >= lo && +v <= hi); };
        if (f.t && !HM_RE.test(f.t)) { toast('Laikas: pvz. 14:05'); return; }
        if (!n3(f.hr, 0, 300)) { toast('ŠSD: skaičius 0–300'); return; }
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
      case 'mc-tx': {
        const i = s.tx.indexOf(k);
        if (i >= 0) s.tx.splice(i, 1);
        else {
          if (!TX.some(x => x[0] === k)) return;
          s.tx.push(k);
          if (k === 'tq' && !s.tqT) { const T = timers(st); const tm = s.mk.find(m => m.t === 'T' && m.tm); s.tqT = tm ? tm.tm : T.turn ? hm(T.turn) : nowHM(); }
          if (k === 'txa' && !s.txaT) s.txaT = nowHM();
        }
        break;
      }
      // ── perdavimas ──
      case 'mc-copy': return copyText(text(s, n, tot));
      case 'mc-share': return shareText('MIST', text(s, n, tot));
      case 'mc-copyall': return copyText(allText(st));
      case 'mc-shareall': return shareText('MIST', allText(st));
      case 'mc-read': {
        const P = parts(s, n, tot), L = (c, l, t) => `<span class="rn ${c}">${l}</span>${esc(t)}`, one = text(s, n, tot);
        const B = [['Kopijuoti', () => copyText(one)]];
        if (tot > 1) B.push(['Kopijuoti visus (' + tot + ')', () => copyText(allText(load()))]);
        return readMode(P.hd, [L('rM', 'M', P.M), L('rI', 'I', P.I), L('rS', 'S', P.S.join('\n')), L('rT', 'T', P.T)], B);
      }
      default: return;
    }
    save(st); render();
  }

  function onInput(t) {
    const st = load(), s = curOf(st), d = t.dataset;
    if (d.mc) s[d.mc] = t.value;
    else if (d.mcf) s.f[d.mcf] = t.value;
    else if (d.mcm != null) {
      const m = s.mk[+d.mcm]; if (!m) return;
      if (s.tqT === m.tm || !s.tqT) s.tqT = t.value;
      m.tm = t.value;
    }
    save(st);
    const o = document.getElementById('mc-out'); if (o) o.textContent = curText(st);
    if (d.mc === 'id') { // skirtuko užrašas be perpiešimo
      const b = app.querySelector('.ptabs button.on'); if (!b) return;
      const v = t.value.trim(); let sm = b.querySelector('small');
      if (v) { if (!sm) { sm = document.createElement('small'); b.appendChild(sm); } sm.textContent = v; } else if (sm) sm.remove();
      b.setAttribute('aria-label', tabLabel(st.cur, v));
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
  // Dabartinis sužeistasis: { n, tot }
  const current = () => { const st = load(); return { n: st.cur + 1, tot: st.pts.length }; };
  // Paciento failui: visa būsena ir dabartinės kortelės tekstas
  return { view, act, onInput, status, text, addGcs, current, region, state: load, curText: () => curText(load()) };
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
    put(+la.turn || hmTs(c.tqT), 'Turniketas');
    const z = get(pid, 'vz'), ze = z && Array.isArray(z.e) ? z.e : [];
    if (c.txaT && !ze.some(e => e && e.v === 'txa')) put(hmTs(c.txaT), 'TXA');
    (c.vit || []).forEach(v => put(hmTs(v.ts), [v.av && 'AVPU ' + v.av, v.hr && 'ŠSD ' + v.hr, v.rr && 'KD ' + v.rr, v.bp && 'AKS ' + v.bp, v.spo2 && 'SpO₂ ' + v.spo2 + ' %', v.gcs && 'GKS ' + v.gcs, v.pain && 'skausmas ' + v.pain + '/10'].filter(Boolean).join(' · ')));
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
      const tq = +la.turn || 0;
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
    ['id', 'sex', 't0', 'mechTxt', 'injTxt', 'tqT', 'txaT'].forEach(k => { if (!c[k] && m[k]) c[k] = String(m[k]); });
    let tt = String(m.txTxt || ''); if (typeof VZ === 'undefined' && Array.isArray(o.z) && o.z.length) tt = [tt, 'Vaistai: ' + zText(o.z)].filter(Boolean).join('; ');
    if (tt && String(c.txTxt || '').indexOf(tt) < 0) c.txTxt = [String(c.txTxt || '').trim(), tt].filter(Boolean).join('; ');
    const uni = (a, b) => a.concat((Array.isArray(b) ? b : []).filter(x => typeof x === 'string' && a.indexOf(x) < 0));
    c.mech = uni(c.mech, m.mech); c.tx = uni(c.tx, m.tx);
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
