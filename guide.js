'use strict';
// ── Trumpa instrukcija „Kaip naudotis“: rodoma pirmą kartą atidarius pradžios ekraną, vėliau – mygtukas „?“ (pradžioje) ir Nustatymuose ──
// Bendras visoms 1040 medkuopos programėlėms; turinys – STEPS žemiau. Mygtukai su data-g="open" atidaro instrukciją.
const GUIDE = (() => {
  const KEY = 'mg-guide', VER = 2;
  const IC = {
    search: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Z|M20 20l-4-4', moon: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z',
    chat: 'M20.5 11.5a8.5 8.5 0 0 1-12.3 7.6L3.5 20.5l1.4-4.6a8.5 8.5 0 1 1 15.6-4.4z', refresh: 'M20 11a8 8 0 0 0-14.3-4.9L4 8|M4 3v5h5|M4 13a8 8 0 0 0 14.3 4.9L20 16|M20 21v-5h-5',
    gear: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0|M16 4v4M10 10v4M18 16v4', wave: 'M22 12h-2.5a2 2 0 0 0-1.9 1.5l-2.4 8.3a.25.25 0 0 1-.5 0L9.2 2.2a.25.25 0 0 0-.5 0L6.4 10.5A2 2 0 0 1 4.5 12H2',
    stop: 'M6 6h12v12H6z', help: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z|M9.5 9.3a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2.3-2.5 3.8|M12 17h.01'
  };
  const svg = (k, c) => `<svg class="${c || 'gdi'}" viewBox="0 0 24 24" aria-hidden="true">${(IC[k] || k).split('|').map(d => `<path d="${d}"/>`).join('')}</svg>`;
  const txt = s => s.replace(/\{(\w+)\}/g, (m, k) => IC[k] ? svg(k, 'gdii') : m);
  const STEPS = [
  { ic: 'M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z|M12 8v5|M12 16h.01', t: 'Tik pagalbinė priemonė', p: 'March gidas primena, ką išmokote. <b>Jis neatstoja oficialių TCCC kursų</b>, vieneto SOP ir mediko nurodymų. Rekomenduojame išklausyti taktinės medicinos kursą internetu.',
    x: () => '<a class="gdcourse" href="https://mindaugas-grinevicius-s-school.teachable.com/p/tactical-combat-casualty-care-tccc" target="_blank" rel="noopener"><b>Taktinės medicinos kursas internetu ↗</b><small>TCCC · M. Grinevičius · nemokamas</small></a>' },
  { ic: 'M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z|M5 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2', t: 'Jūsų lygis', p: 'Pasirinkite, kokį kursą baigėte – tai lemia, kokie veiksmai ir vaistai rodomi. Vėliau perjungsite viršuje: <b>CLS</b> / <b>CMC</b>.',
    x: () => { const c = typeof tikCLS === 'function' && tikCLS(); return `<div class="gdopt"><button data-g="lvl" data-k="CLS" class="${c ? 'on' : ''}" aria-pressed="${c}"><b>CLS</b><small>kovos gelbėtojas – tik CLS veiksmai</small></button><button data-g="lvl" data-k="CMC" class="${c ? '' : 'on'}" aria-pressed="${!c}"><b>CMC</b><small>kovos medikas – viskas, CMC pažymėta geltonai</small></button></div>`; },
    on: (g, b) => { if (g !== 'lvl') return; try { localStorage.setItem('mg-tikcls', JSON.stringify(b.dataset.k === 'CLS')); } catch (e) {} try { IDX = null; } catch (e) {} if (typeof render === 'function') render(); } },
  { ic: 'M9 3h6v6h6v6h-6v6H9v-6H3V9h6z', t: 'Fazės', p: 'Pradžioje – trys fazės. Atidarykite ir žymėkite atliktus punktus. Mygtukas <b>ⓘ</b> prie punkto parodo paaiškinimą.', x: () => '<ul><li><b>CUF</b> – pagalba apšaudymo metu.</li><li><b>TFC</b> – taktinė lauko pagalba pagal MARCH PAWS.</li><li><b>TACEVAC</b> – evakuacija ir perdavimas.</li></ul>' },
  { ic: 'M3 4h18|M12 4v4|M6 12a6 4 0 0 1 6-4h3a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z|M8 19h12|M10 15v4|M16 15v4', t: 'MEDEVAC įrankiai', p: '<b>10 s triažas, Nukentėjusiojo kortelė (DD1380), 9-Line, SITREP, CONTREP, SALUTE</b> – formos pildomos telefone; perduokite balsu arba tekstu. <b>Nuskaityti kortelę</b> – popierinės DD1380 nuotrauka perkeliama į programėlę. Apačioje juosta <b>„#1 Sužeistasis“</b> – laikai, kortelė ir priminimai.' },
  { ic: 'M4 8h12v12H4z|M8 4h12v12|M7 13h6|M7 16h4', t: 'Apatinė juosta', p: '<b>Pacientas</b> – sužeistųjų kortelės. <b>Vaistai</b> ir <b>Įgūdžiai</b> – žinynas su video. <b>Vertinimas</b> – CLS vertinimo lapas instruktoriui. <b>Treniruotė</b> – situacijos ir dozių patikra.' },
  { ic: 'help', t: 'Mygtukai viršuje', p: '{search} – paieška, {moon} – raudonas naktinis režimas, {chat} – pranešti apie klaidą, <svg class="gdii" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></svg> – nustatymai. Instrukciją vėl atidarysite mygtuku <b>„Kaip naudotis“</b> pradžioje.' }
];
  let i = 0, el = null, last = null;
  const seen = () => { try { return +JSON.parse(localStorage.getItem(KEY) || '0') >= VER; } catch (e) { return false; } };
  const mark = () => { try { localStorage.setItem(KEY, JSON.stringify(VER)); } catch (e) {} };
  function draw() {
    const S = STEPS[i], n = STEPS.length, end = i === n - 1;
    el.innerHTML = `<div class="gdc" role="dialog" aria-modal="true" aria-labelledby="gdt"><div class="gdh"><div class="gdd">${STEPS.map((x, j) => `<button data-g="go" data-i="${j}" class="${j === i ? 'on' : ''}" aria-label="${j + 1} iš ${n}"></button>`).join('')}</div><button class="gdx" data-g="close">${end ? 'Uždaryti' : 'Praleisti'}</button></div>` +
      `<div class="gdb"><div class="gdic">${svg(S.ic)}</div><h2 id="gdt">${S.t}</h2><p>${txt(S.p)}</p>${S.x ? S.x() : ''}</div>` +
      `<div class="gdf">${i ? '<button class="gdbk" data-g="prev">Atgal</button>' : '<span></span>'}<button class="gdgo" data-g="${end ? 'close' : 'next'}">${end ? 'Pradėti' : 'Toliau'}</button></div></div>`;
    const b = el.querySelector('.gdgo'); if (b) b.focus({ preventScroll: true });
  }
  function open(at) {
    if (el) return;
    last = document.activeElement; i = Math.max(0, Math.min(STEPS.length - 1, +at || 0));
    el = document.createElement('div'); el.className = 'gd'; document.body.appendChild(el); document.body.classList.add('gdon');
    draw();
  }
  function close() {
    if (!el) return;
    mark(); el.remove(); el = null; document.body.classList.remove('gdon');
    if (last && last.focus) try { last.focus({ preventScroll: true }); } catch (e) {}
    if (typeof GUIDE_DONE === 'function') try { GUIDE_DONE(); } catch (e) {}
  }
  const go = d => { i = Math.max(0, Math.min(STEPS.length - 1, i + d)); draw(); };
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('[data-g]'); if (!b) { if (el && e.target === el) close(); return; }
    e.preventDefault(); e.stopPropagation();
    const g = b.dataset.g;
    if (g === 'open') return open();
    if (!el) return;
    if (g === 'next') go(1); else if (g === 'prev') go(-1); else if (g === 'go') { i = +b.dataset.i; draw(); } else if (g === 'close') close();
    else if (STEPS[i].on) { STEPS[i].on(g, b); draw(); }
  }, true);
  document.addEventListener('keydown', e => { if (!el) return; if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1); });
  let tx = null;
  document.addEventListener('touchstart', e => { if (el && e.target.closest('.gdc')) tx = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', e => { if (!el || tx == null) return; const d = e.changedTouches[0].clientX - tx; tx = null; if (Math.abs(d) > 60) go(d < 0 ? 1 : -1); }, { passive: true });
  // pirmą kartą – kai atidaromas pradžios ekranas (automatiniuose testuose nerodoma)
  const home = () => !location.hash || location.hash === '#/' || location.hash === '#';
  const maybe = () => { if (!el && !seen() && !navigator.webdriver && home()) open(); };
  addEventListener('hashchange', () => setTimeout(maybe, 400));
  setTimeout(maybe, 700);
  return { open, close, seen, svg };
})();
