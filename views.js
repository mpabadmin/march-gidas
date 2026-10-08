'use strict';
const W_LIST = [50, 60, 70, 80, 90, 100, 120];
const tabBtn = (lb, r, on, rep) => `<button class="${on ? 'on' : ''}" data-act="go"${rep ? ' data-rep="1"' : ''} data-r="${r}">${esc(lb)}</button>`;
const ul = a => '<ul>' + a.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
const drugById = id => (E.vaistai || []).find(x => x.id === id);
const skillById = id => (E.igudziai || []).find(x => String(x.id) === String(id));
const fazeById = id => (E.fazes || []).find(x => x.id === id);
const ratings = () => LS.get('mg-ivert', {});
const progBar = (n, tot) => `<div class="prog"><i style="width:${tot ? Math.round(n / tot * 100) : 0}%"></i></div>`;
const wChips = w => '<div class="chips" role="group" aria-label="Paciento svoris">' + W_LIST.map(x => `<button class="${x === w ? 'on' : ''}" data-act="w" data-w="${x}">${x}</button>`).join('') + '</div>';
const rateBadge = (R, id) => R[id] ? `<span class="tag ${R[id] >= 3 ? 'grn' : 'amb'}">${R[id]} / 4</span>` : '';
const listDone = id => {
  const L = (E.sarasai || {})[id]; if (!L) return [0, 0];
  const d = ckAll()[id] || []; let n = 0, t = 0;
  (L.items || []).forEach((it, i) => { if (it.h || !ok(it.g)) return; t++; if (d.indexOf(i) >= 0) n++; });
  return [n, t];
};
const listRow = id => {
  const L = (E.sarasai || {})[id]; if (!L) return '';
  const [n, t] = listDone(id);
  return row(listRoute(id), L.title, '', n ? `<span class="tag ${n === t ? 'grn' : 'amb'}">${n} / ${t}</span>` : '');
};
function doseShort(v, w) {
  const d = (v.dozes || [])[0]; if (!d) return v.klase || '';
  return d.k + ': ' + (d.c ? calc(d.c, w) + ' (' + w + ' kg)' : d.d);
}
function tocHtml(html) {
  const hs = []; let i = 0;
  const out = html.replace(/<h3>([\s\S]*?)<\/h3>/g, (m, t) => { const id = 'h' + (i++); hs.push([id, strip(t)]); return `<h3 id="${id}">${t}</h3>`; });
  if (hs.length < 3) return html;
  return '<div class="toc">' + hs.map(([id, t]) => `<button data-act="toc" data-t="${id}">${esc(t)}</button>`).join('') + '</div>' + out;
}
const videos = a => (a || []).length ? '<h2>Vaizdo įrašai</h2>' + a.map(videoHtml).join('') : '';
const brand = () => '<div class="brand"><img class="lg-d" src="img/badge-balt.png" alt="LŠS Vilniaus 1040 medicinos šaulių kuopa"><img class="lg-l" src="img/badge-juod.png" alt="LŠS Vilniaus 1040 medicinos šaulių kuopa"><span><b>March gidas</b><br>TCCC 2026 · CLS / CMC · MEDEVAC</span></div>';
const installed = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone;
const installRow = () => installed() ? '' : row('#/idiegimas', 'Įdiekite programėlę telefone', 'Android ir iPhone – 1 minutė, veikia be interneto');

const GRUPES = [['K', 'Principai, apžiūra, ištraukimas'], ['M', 'M – masyvus kraujavimas'], ['A', 'A – kvėpavimo takai'], ['R', 'R – kvėpavimas'], ['C', 'C – kraujotaka ir šokas'], ['H', 'H – hipotermija, galva, akys'], ['P', 'P · A – skausmas ir antibiotikai'], ['W', 'W · S – žaizdos, nudegimai, įtvėrimas'], ['E', 'Evakuacija (MEDEVAC)']];
const grupesPav = g => (GRUPES.find(x => x[0] === g) || ['', ''])[1];
const skillOrder = () => GRUPES.reduce((a, [g]) => a.concat((E.igudziai || []).filter(s => s.grupe === g)), []);
const figHtml = f => `<figure class="fig"><a href="${esc(f.src)}" target="_blank" rel="noopener"><img loading="lazy" src="${esc(f.src)}" alt="${esc(f.cap)}"></a><figcaption>${esc(f.cap)}<small>Iliustracija: Joint Trauma System (Deployed Medicine)${f.orig ? ` · <a href="${esc(f.orig)}" target="_blank" rel="noopener">tccc.org.ua</a>` : ''}</small></figcaption></figure>`;
const lvTag = s => s.lygis && s.lygis !== 'CLS' ? tag(s.lygis) : '<span class="tag grn">CLS</span>';

const V = {
  home() { return mode === 'field' ? V.homeField() : V.homeLearn(); },

  phaseTiles(field) {
    return '<div class="phases">' + (E.fazes || []).map(f =>
      `<a class="phase ${f.cls}" href="#/f/${f.id}"><b>${esc(f.id)}</b><span>${esc(f.pav)}</span>${field ? '<small>' + esc(f.sub) + '</small>' : ''}</a>`).join('') + '</div>';
  },

  toolTiles() {
    const nl = typeof NL !== 'undefined' ? NL.status() : '', mi = typeof MI !== 'undefined' ? MI.status() : '';
    return '<div class="tools">' +
      `<a class="tool" href="#/9line" aria-label="9-Line MEDEVAC prašymas: ${esc(nl)}"><span class="ti">9</span><b>9-Line</b><small>${esc(nl)}</small></a>` +
      `<a class="tool" href="#/mist" aria-label="MIST perdavimas: ${esc(mi)}"><span class="ti">M</span><b>MIST</b><small>${esc(mi)}</small></a></div>`;
  },

  homeField() {
    const w = LS.get('mg-svoris', 80);
    const quick = ['paracetamolis', 'ketaminas', 'txa', 'cefadroksilis', 'ceftriaksonas', 'ondansetronas'].map(drugById).filter(v => v && ok(v.lygis));
    return brand() + disclaimer() +
      '<h2>Fazė</h2>' + V.phaseTiles(true) +
      '<h2>MEDEVAC</h2>' + V.toolTiles() +
      '<h2>Laikai</h2><div id="tm">' + timersHtml() + '</div>' +
      '<h2>Dažniausi vaistai</h2>' + quick.map(v => row('#/vaistas/' + v.id, v.name, doseShort(v, w), tag(v.lygis))).join('') +
      row('#/vaistai', 'Visi vaistai', lt((E.vaistai || []).filter(v => ok(v.lygis)).length, ['vaistas', 'vaistai', 'vaistų']) + ' pagal TCCC 2026') +
      '<h2>Greitai</h2>' +
      row('#/igudis/36', 'Rūšiavimas ir evakuacijos skubumas', 'Keli sužeistieji') +
      row(listRoute('tfc-evak'), 'Pasiruošimas evakuacijai', 'Ryšys, kortelė, supakavimas') +
      row(listRoute('tac-perdavimas'), 'Perdavimas priimančiai grandžiai', 'MIST, kas tęstina') +
      row('#/p/devynios', '9-Line kodai ir skubumo kategorijos') +
      installRow() + row('#/nustatymai', 'Nustatymai');
  },

  homeLearn() {
    const S = (E.igudziai || []).filter(s => ok(s.lygis)), R = ratings(), n = S.length, rated = S.filter(s => R[s.id]).length, good = S.filter(s => R[s.id] >= 3).length;
    return brand() + disclaimer() +
      '<input type="search" id="q" placeholder="Paieška: vaistas, įgūdis, veiksmas" autocomplete="off" aria-label="Paieška">' +
      (timersMini() ? '<h2>Laikai</h2><div id="tm">' + timersHtml() + '</div>' : '') +
      `<a class="card prog-card" href="#/igudziai"><b>Mano pažanga</b><div class="muted">Įsivertinta: ${rated} iš ${n} · atlieku savarankiškai (3–4): ${good}</div>${progBar(rated, n)}</a>` +
      '<h2>Temos</h2>' + V.topicCards() +
      '<h2>Fazės</h2>' + V.phaseTiles(false) +
      '<h2>Viskas vienoje vietoje</h2>' +
      row('#/igudziai', 'Įgūdžiai', lt(n, ['įgūdis', 'įgūdžiai', 'įgūdžių']) + ' su JTS kortelėmis ir vaizdo įrašais') +
      row('#/sarasai', 'Kontroliniai sąrašai', 'CUF, TFC (MARCH PAWS), TACEVAC') +
      row('#/vaistai', 'Vaistai', 'TCCC 2026: CWMP, ketaminas, antibiotikai, TXA') +
      row('#/9line', '9-Line MEDEVAC forma') + row('#/mist', 'MIST perdavimo forma') +
      installRow() + row('#/nustatymai', 'Nustatymai');
  },

  topicCards() {
    const R = ratings();
    return '<div class="tgrid">' + (E.temos || []).map(t => {
      const ids = (t.igudziai || []).filter(id => { const s = skillById(id); return s && ok(s.lygis); });
      const r = ids.filter(id => R[id]).length;
      return `<a class="tcard" href="#/tema/${t.id}"><span class="tz ${t.cls || ''}">${esc(t.zenklas)}</span><b>${esc(t.pav)}</b><small>${esc(t.sub)}</small>${ids.length ? '<small class="muted">Įgūdžiai: ' + r + ' / ' + ids.length + '</small>' + progBar(r, ids.length) : ''}</a>`;
    }).join('') + '</div>';
  },

  topics() { return '<h1>Temos</h1><p class="muted">Kiekviena tema sujungia mokymosi medžiagą, įgūdžius, kontrolinius sąrašus ir vaistus.</p>' + V.topicCards(); },

  topic(id) {
    const t = (E.temos || []).find(x => x.id === id);
    if (!t) return notFound();
    const P = E.puslapiai || {}, R = ratings();
    const sk = (t.igudziai || []).map(skillById).filter(s => s && ok(s.lygis));
    const r = sk.filter(s => R[s.id]).length;
    let h = `<h1>${esc(t.pav)}</h1><p class="muted">${esc(t.sub)}</p>`;
    const pg = (t.puslapiai || []).filter(x => P[x]);
    if (pg.length) h += '<h2>Mokymosi medžiaga</h2>' + pg.map(x => row('#/p/' + x, P[x].title, P[x].sub)).join('');
    if (sk.length) h += `<h2>Įgūdžiai · įsivertinta ${r} / ${sk.length}</h2>` + progBar(r, sk.length) +
      sk.map(s => row('#/igudis/' + s.id, s.pav, '#' + s.id + ' · ' + s.lygis + ((s.video || []).length ? ' · ▶ ' + s.video.length : ''), rateBadge(R, s.id))).join('');
    const ls = (t.sarasai || []).filter(x => (E.sarasai || {})[x]);
    if (ls.length) h += '<h2>Kontroliniai sąrašai</h2>' + ls.map(listRow).join('');
    const dr = (t.vaistai || []).map(drugById).filter(v => v && ok(v.lygis));
    if (dr.length) h += '<h2>Vaistai</h2>' + dr.map(v => row('#/vaistas/' + v.id, v.name, v.klase, tag(v.lygis))).join('');
    return h;
  },

  lists() {
    let h = '<h1>Kontroliniai sąrašai</h1><p class="muted">Pagal TCCC fazes. Žymėjimai išlieka, kol paspausite „Naujas sužeistasis“.</p>';
    (E.fazes || []).forEach(f => {
      h += `<h2>${esc(f.id)} – ${esc(f.pav)}</h2>` + (f.lists || []).map(listRow).join('');
    });
    return h;
  },

  phase(id, t) {
    const f = fazeById(id);
    if (!f) return notFound();
    t = Math.min(Math.max(0, t | 0), f.lists.length - 1);
    const S = E.sarasai || {}, lid = f.lists[t];
    let h = `<div class="phead ${f.cls}"><b>${esc(f.id)}</b><h1 class="pht" data-title="${esc(f.id + (f.lists.length > 1 ? ' · ' + ((S[lid] || {}).short || '') : '') + ' – ' + f.pav)}">${esc(f.pav)} <small>${esc(f.en)}${f.lists.length > 1 ? ' · ' + esc((S[lid] || {}).short || '') : ''}</small></h1></div>`;
    h += '<div class="tmini-box">' + timersMini() + '</div>';
    if (mode === 'learn' && f.aprasymas) h += `<p class="muted">${esc(f.aprasymas)}</p>`;
    if (f.lists.length > 1) h += '<div class="tabs">' + f.lists.map((l, i) => {
      const [n, tot] = listDone(l);
      return `<button class="${i === t ? 'on' : ''}${n && n === tot ? ' done' : ''}" data-act="go" data-rep="1" data-r="#/f/${id}?t=${i}" aria-current="${i === t ? 'step' : 'false'}">${esc((S[l] || {}).short || l)}</button>`;
    }).join('') + '</div>';
    if (S[lid] && S[lid].intro) h += '<p class="muted">' + br(S[lid].intro) + '</p>';
    h += renderList(lid);
    if (t < f.lists.length - 1) h += `<button class="row nxt" data-act="go" data-rep="1" data-r="#/f/${id}?t=${t + 1}">Toliau: ${esc(((S[f.lists[t + 1]] || {}).title || '').replace(/^(CUF|TFC|TACEVAC): /, ''))}<span class="ar">›</span></button>`;
    else {
      const i = (E.fazes || []).indexOf(f), nf = (E.fazes || [])[i + 1];
      if (nf) h += `<button class="row nxt" data-act="go" data-r="#/f/${nf.id}">Kita fazė: ${esc(nf.id)} – ${esc(nf.pav)}<span class="ar">›</span></button>`;
    }
    if (id !== 'CUF') h += '<div class="tools sm">' + `<a class="tool" href="#/9line"><span class="ti">9</span><b>9-Line</b></a><a class="tool" href="#/mist"><span class="ti">M</span><b>MIST</b></a>` + '</div>';
    return h;
  },

  list(id) {
    const L = (E.sarasai || {})[id];
    if (!L) return notFound();
    let h = `<h1>${esc(L.title)}</h1>`;
    if (L.intro) h += '<p class="muted">' + br(L.intro) + '</p>';
    return h + renderList(id);
  },

  drugs() {
    const D = (E.vaistai || []).filter(v => ok(v.lygis)), w = LS.get('mg-svoris', 80), field = mode === 'field';
    let h = '<h1>Vaistai</h1><p class="muted">Pagal TCCC 2026 gaires. Žyma CMC – skiria kovos medikas.</p>';
    (E.vaistuGrupes || []).forEach(g => {
      const a = D.filter(v => v.grupe === g.id);
      if (!a.length) return;
      h += '<h2>' + esc(g.pav) + '</h2>' + a.map(v => row('#/vaistas/' + v.id, v.name, field ? doseShort(v, w) : v.klase, tag(v.lygis))).join('');
    });
    return h + '<p class="muted">Vaistai skiriami tik pagal kompetenciją, vieneto protokolus ir mediko nurodymus.</p>' + row('#/p/vaistai26', 'TCCC 2026 vaistai trumpai');
  },

  drug(id) {
    const v = drugById(id);
    if (!v) return notFound();
    const w = LS.get('mg-svoris', 80), learn = mode === 'learn';
    const doseHtml = d => `<div class="dose"><div class="lb">${esc(d.k)}${d.c ? ' · ' + esc(d.d) : ''}</div><div class="big">${esc(d.c ? calc(d.c, w) : d.d)}</div>${d.p ? '<div class="lb">' + br(d.p) + '</div>' : ''}</div>`;
    let h = `<h1>${esc(v.name)}</h1><p class="muted">${esc(v.klase || '')}</p>`;
    h += '<span class="tag grn">TCCC 2026</span>' + (v.lygis === 'CLS' ? '<span class="tag grn">CLS</span>' : tag(v.lygis));
    if (v.ind) h += `<p class="ind">${esc(v.ind)}</p>`;
    if ((v.dozes || []).some(d => d.c)) h += '<h2>Paciento svoris, kg</h2>' + wChips(w);
    if ((v.dozes || []).length) h += '<h2>Dozė</h2>' + v.dozes.map(doseHtml).join('');
    const iw = v.ispejimai || [];
    if (iw.length) h += '<div class="warn wl"><b>Įspėjimai</b>' + (iw.length > 1 ? ul(iw) : '<div>' + esc(iw[0]) + '</div>') + '</div>';
    let more = '';
    if (v.kontra) more += `<div class="kv"><b>Kontraindikacijos</b><span>${esc(v.kontra)}</span></div>`;
    if (v.pakuote) more += `<div class="kv"><b>Pakuotė</b><span>${br(v.pakuote)}</span></div>`;
    if ((v.pastabos || []).length) more += '<h3>Pastabos</h3>' + ul(v.pastabos);
    if (v.saltinis) more += '<p class="muted" style="margin-top:10px">Šaltiniai: ' + esc(v.saltinis) + '</p>';
    if ((v.nuorodos || []).length) more += v.nuorodos.map(([t, u]) => `<a class="row" href="${esc(u)}" target="_blank" rel="noopener"><div>${esc(t)}</div><span class="ar">↗</span></a>`).join('');
    if (more) h += `<details class="alt"${learn ? ' open' : ''}><summary>Kontraindikacijos ir daugiau</summary>${more}</details>`;
    if ((v.susije || []).length) h += '<h2>Susiję vaistai</h2>' + v.susije.map(s => { const o = drugById(s); return o && ok(o.lygis) ? row('#/vaistas/' + o.id, o.name, o.klase, tag(o.lygis)) : ''; }).join('');
    return h;
  },

  skills(q) {
    const all = (E.igudziai || []).filter(s => ok(s.lygis)), R = ratings();
    const F = [['', 'Visi'], ['CUF', 'CUF'], ['TFC', 'TFC'], ['TACEVAC', 'TACEVAC']].concat(tikCLS() ? [] : [['CLS', 'Tik CLS']], [['N', 'Neįsivertinti']]);
    const f = q.f || '';
    const S = all.filter(s => !f || (f === 'N' ? !R[s.id] : f === 'CLS' ? s.lygis === 'CLS' : (s.fazes || []).indexOf(f) >= 0));
    const rated = all.filter(s => R[s.id]).length;
    let h = `<h1>Įgūdžiai</h1><p class="muted">${lt(all.length, ['įgūdis', 'įgūdžiai', 'įgūdžių'])} · įsivertinta ${rated}</p>` + progBar(rated, all.length);
    h += '<div class="tabs">' + F.map(([k, l]) => tabBtn(l, '#/igudziai' + (k ? '?f=' + k : ''), k === f, true)).join('') + '</div>';
    GRUPES.forEach(([g, gp]) => {
      const a = S.filter(s => s.grupe === g);
      if (!a.length) return;
      h += '<h2>' + esc(gp) + '</h2>' + a.map(s => row('#/igudis/' + s.id, s.pav, '#' + s.id + ' · ' + s.lygis + ((s.vaizdai || []).length ? ' · ▣ ' + s.vaizdai.length : '') + ((s.video || []).length ? ' · ▶ ' + s.video.length : ''), rateBadge(R, s.id))).join('');
    });
    return h + (S.length ? '' : '<p class="muted">Nėra įgūdžių pagal šį filtrą.</p>');
  },

  skill(id) {
    const s = skillById(id);
    if (!s) return notFound();
    const r = ratings()[s.id] || 0;
    const all = skillOrder().filter(x => ok(x.lygis)), i = all.indexOf(s);
    let h = `<h1>${esc(s.pav)}</h1><span class="tag">#${s.id}</span>${lvTag(s)}` + (s.fazes || []).map(f => `<span class="tag ph${f}">${esc(f)}</span>`).join('');
    if (s.aprasas) h += `<p class="lead">${esc(s.aprasas)}</p>`;
    if ((s.esme || []).length) h += '<div class="card esme"><b>Esmė</b>' + ul(s.esme) + '</div>';
    if ((s.vaizdai || []).length) h += '<div class="figs">' + s.vaizdai.map(figHtml).join('') + '</div>';
    if ((s.zingsniai || []).length) h += '<h2>Žingsniai</h2><ol class="steps">' + s.zingsniai.map(x => '<li>' + esc(x) + '</li>').join('') + '</ol>';
    if ((s.klaidos || []).length) h += '<div class="warn wl"><b>Dažnos klaidos ir pavojai</b>' + ul(s.klaidos) + '</div>';
    if ((s.tccc || []).length) h += '<div class="dose tc"><div class="lb">TCCC gairės 2026</div>' + ul(s.tccc) + '</div>';
    h += videos(s.video);
    if (s.kortele) h += `<a class="row" href="${esc(s.kortele.url)}" target="_blank" rel="noopener"><div>JTS įgūdžio kortelė<small>${esc(s.kortele.pav)}</small></div><span class="ar">↗</span></a>`;
    if ((s.saltiniai || []).length) h += '<p class="muted">Šaltiniai: ' + esc(s.saltiniai.join('; ')) + '</p>';
    h += '<h2>Mano įsivertinimas</h2><div class="chips">' + [1, 2, 3, 4].map(x => `<button class="${x === r ? 'on' : ''}" data-act="rate" data-id="${s.id}" data-v="${x}">${x}</button>`).join('') + '</div>';
    h += '<p class="muted">1 – nežinau · 2 – žinau teoriją · 3 – atlieku su pagalba · 4 – atlieku savarankiškai</p>';
    const prev = all[i - 1], next = all[i + 1];
    h += '<div class="pn">' + (prev ? `<a class="btn" href="#/igudis/${prev.id}">‹ #${prev.id}</a>` : '<span></span>') + '<a class="btn" href="#/igudziai">Visi įgūdžiai</a>' + (next ? `<a class="btn" href="#/igudis/${next.id}">#${next.id} ›</a>` : '<span></span>') + '</div>';
    return h;
  },

  page(id) {
    const p = (E.puslapiai || {})[id];
    if (!p) return notFound();
    return `<h1>${esc(p.title)}</h1>` + (p.sub ? '<p class="muted">' + esc(p.sub) + '</p>' : '') + tocHtml(p.html || '') + videos(p.video) +
      (p.saltinis ? '<p class="muted" style="margin-top:12px">Šaltiniai: ' + esc(p.saltinis) + '</p>' : '');
  },

  search(q) {
    return `<h1>Paieška</h1><input type="search" id="qs" placeholder="Vaistas, įgūdis, veiksmas" autocomplete="off" value="${esc(q)}" aria-label="Paieška"><div id="res">${results(q)}</div>`;
  },

  install() {
    let h = '<h1>Kaip įsidiegti programėlę</h1><p class="muted">Programėlė įsidiegia iš naršyklės – parduotuvės nereikia. Įdiegta ji atsidaro visame ekrane ir veikia be interneto.</p>';
    if (installed()) h += '<div class="card">Ši programėlė jau įdiegta šiame įrenginyje.</div>';
    else if (installEv) h += '<button class="btn pri" data-act="install">Įdiegti dabar</button>';
    h += '<h2>Android (Chrome)</h2><ol class="steps">' +
      '<li>Atidarykite <b>march.1040medkuopa.lt</b> naršyklėje <b>Chrome</b>.</li>' +
      '<li>Jei apačioje pasirodo pasiūlymas „Įdiegti programą“ – paspauskite jį. Jei ne – viršuje dešinėje paspauskite meniu <b>⋮</b>.</li>' +
      '<li>Pasirinkite <b>„Įdiegti programą“</b> arba <b>„Pridėti prie pradžios ekrano“</b> ir patvirtinkite.</li>' +
      '<li>Ženkliukas <b>„March gidas“</b> atsiras pradžios ekrane.</li></ol>' +
      '<p class="muted">Samsung naršyklėje: meniu ☰ → „Pridėti puslapį prie“ → „Pradžios ekranas“.</p>' +
      '<h2>iPhone / iPad (Safari)</h2><ol class="steps">' +
      '<li>Atidarykite <b>march.1040medkuopa.lt</b> naršyklėje <b>Safari</b>.</li>' +
      '<li>Paspauskite <b>„Bendrinti“</b> – kvadratą su rodykle aukštyn (naujesnėse iOS – pirmiausia <b>⋯</b> šalia adreso juostos).</li>' +
      '<li>Pasirinkite <b>„Įtraukti į pradžios ekraną“</b>.</li>' +
      '<li>Paspauskite <b>„Įtraukti“</b> viršuje dešinėje.</li></ol>' +
      '<h2>Po įdiegimo</h2><ul><li>Pirmą kartą atidarykite su internetu – turinys išsisaugos telefone.</li><li>Programėlė atsinaujina pati, kai atidaroma su internetu.</li><li>Vaizdo įrašams reikia interneto; iliustracijos išsisaugo jas peržiūrėjus.</li></ul>' +
      '<h2>Pasidalinkite</h2><p class="muted">Nuskenuokite telefono kamera:</p><img class="qr" src="img/qr.svg" alt="QR kodas: march.1040medkuopa.lt"><p style="text-align:center"><b>march.1040medkuopa.lt</b></p>';
    return h;
  },

  settings() {
    const b = (act, t, s) => `<button class="row" data-act="${act}"><div>${t}<small>${s}</small></div></button>`;
    let h = '<h1>Nustatymai</h1>';
    h += `<div class="ck${tikCLS() ? ' on' : ''}" data-act="tikcls" role="checkbox" aria-checked="${tikCLS()}" tabindex="0"><span class="bx">✓</span><div class="t">Rodyti tik CLS veiksmus<div class="muted">Paslepia kovos mediko (CMC) ir paramediko (CPP) veiksmus, vaistus ir įgūdžius.</div></div></div>`;
    h += '<h2>Sužeistasis</h2>' + b('new-pt', 'Naujas sužeistasis', 'Išvalo sąrašų žymėjimus ir laikus (9-Line ir MIST lieka)');
    h += '<h2>Atsiliepimai</h2>' + b('fb', 'Pranešti apie klaidą ar pasiūlyti', 'Komentaras ir ekrano vaizdas – keliauja gido rengėjams');
    const nOut = FB.pending();
    if (nOut) h += b('fb-flush', 'Neišsiųsti pranešimai: ' + nOut, 'Siųsti dabar (reikia interneto)');
    h += '<h2>Mokymasis</h2>' + b('reset-ivert', 'Ištrinti įsivertinimus', 'Visi 1–4 balai bus pašalinti');
    h += '<h2>Programėlė</h2>';
    if (installed()) h += '<p class="muted">Programėlė įdiegta ir veikia be interneto (vaizdo įrašams reikia interneto).</p>';
    else if (installEv) h += b('install', 'Įdiegti į telefoną', 'Atsiras ženkliukas pradžios ekrane');
    else h += row('#/idiegimas', 'Kaip įsidiegti telefone', 'Android ir iPhone instrukcija, QR kodas');
    const nImg = allImgs().length, have = LS.get('mg-img', 0);
    h += b('img-dl', have >= nImg ? 'Iliustracijos išsaugotos telefone ✓' : 'Išsaugoti iliustracijas naudojimui be interneto', have >= nImg ? lt(nImg, ['vaizdas', 'vaizdai', 'vaizdų']) + ' · paspauskite, jei norite atnaujinti' : lt(nImg, ['vaizdas', 'vaizdai', 'vaizdų']) + ', apie 7 MB · rekomenduojama per Wi-Fi');
    h += b('upd', 'Atnaujinti turinį', 'Reikia interneto ryšio');
    h += '<h2>Apie</h2><p class="muted">Turinio versija: ' + esc(E.versija || '—') + '. Parengė LŠS Vilniaus 1040 medicinos šaulių kuopa pagal TCCC gaires 2026, JTS CLS / CMC kursus ir M. Grinevičiaus TCCC kursą. Tai atminties priemonė, ne oficialus vadovas.</p>';
    h += '<a class="row" href="https://tccc.org.ua/en/collection/tccc-cls" target="_blank" rel="noopener"><div>TCCC CLS kursas (JTS)<small>tccc.org.ua</small></div><span class="ar">↗</span></a>';
    h += '<a class="row" href="https://deployedmedicine.allogy.net/learner/collections/11" target="_blank" rel="noopener"><div>TCCC gairės<small>Deployed Medicine</small></div><span class="ar">↗</span></a>';
    h += '<a class="row" href="https://mindaugas-grinevicius-s-school.teachable.com/p/tactical-combat-casualty-care-tccc" target="_blank" rel="noopener"><div>TCCC kursas lietuviškai (nemokamas)<small>M. Grinevičius · Stop The Bleed Lietuva</small></div><span class="ar">↗</span></a>';
    h += '<a class="row" href="https://etc.1040medkuopa.lt" target="_blank" rel="noopener"><div>ETC kišeninis gidas<small>Ligoninės traumos komandai</small></div><span class="ar">↗</span></a>';
    return h;
  }
};
