'use strict';
// Pranešimai apie klaidas ir pasiūlymai: komentaras + ekrano vaizdas → ta pati Google lentelė kaip ETC gido (etc-gidas/tools/atsiliepimai.gs).
// Pranešimai žymimi: Puslapis „[March] …“, Programėlės versija „March gidas · …“, Kliento ID prasideda „m“.
// Be ryšio arba kol priėmimas neįjungtas – pranešimai laukia telefone (localStorage) ir išsiunčiami vėliau.
const FB = (() => {
  const OUT = 'mg-fb-out', WHO = 'mg-fb-vardas', MAX_OUT = 10, MAX_IMG = 3;
  const TIPAI = [['klaida', 'Klaida turinyje'], ['doze', 'Dozė / skaičiuoklė'], ['technine', 'Techninė klaida'], ['truksta', 'Trūksta turinio'], ['pasiulymas', 'Pasiūlymas']];
  const SVARBA = [['kritine', 'Kritinė'], ['svarbi', 'Svarbi'], ['smulki', 'Smulki']];
  const url = () => String((E.atsiliepimai || {}).url || '').trim();
  let box = null, st = null, h2cP = null, busy = false;

  const outbox = () => { try { return JSON.parse(localStorage.getItem(OUT) || '[]') || []; } catch (e) { return []; } };
  function saveOut(a) {
    a = a.slice(-MAX_OUT);
    for (let i = 0; i <= a.length; i++) {
      try { localStorage.setItem(OUT, JSON.stringify(a)); return true; }
      catch (e) { const k = a.findIndex(x => x.ekranai && x.ekranai.length); if (k < 0) break; a[k] = Object.assign({}, a[k], { ekranai: [], pastaba: 'Ekrano vaizdas netilpo telefono atmintyje' }); }
    }
    return false;
  }

  function device() {
    const ua = navigator.userAgent || '';
    const os = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows' : /Mac/.test(ua) ? 'macOS' : 'Kita';
    const br = /SamsungBrowser/.test(ua) ? 'Samsung' : /Edg\//.test(ua) ? 'Edge' : /CriOS|Chrome\//.test(ua) ? 'Chrome' : /FxiOS|Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Kita';
    const dark = getComputedStyle(document.body).getPropertyValue('--bg').trim().toUpperCase() === '#161912';
    return `${os} · ${br} · ${installed() ? 'įdiegta' : 'naršyklėje'} · ${innerWidth}×${innerHeight} · ${dark ? 'tamsi' : 'šviesi'} tema`;
  }

  function context() {
    const h1 = document.querySelector('#app h1');
    let sel = '';
    try { sel = String(getSelection() || '').trim().slice(0, 600); } catch (e) {}
    return {
      puslapis: '[March] ' + (h1 ? (h1.dataset.title || [(h1.childNodes[0] || h1).textContent.trim(), (h1.querySelector('small') || {}).textContent].filter(Boolean).join(' · ')) : 'Pradžia'),
      marsrutas: location.hash || '#/',
      pazymeta: sel,
      versija: (E.programa || 'March gidas') + ' · ' + (E.versija || ''),
      irenginys: device(),
      rezimas: (mode === 'field' ? 'Taikymas' : 'Mokymasis') + (tikCLS() ? ' · tik CLS' : '')
    };
  }

  function loadH2c() {
    if (window.html2canvas) return Promise.resolve(window.html2canvas);
    if (!h2cP) h2cP = new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'vendor/html2canvas.min.js';
      s.onload = () => window.html2canvas ? res(window.html2canvas) : rej(new Error('h2c'));
      s.onerror = () => { h2cP = null; rej(new Error('h2c')); };
      document.head.appendChild(s);
    });
    return h2cP;
  }

  // Matomos ekrano dalies vaizdas (be pranešimo lango), ~720 px pločio JPEG
  async function capture() {
    const h2c = await loadH2c();
    const w = document.documentElement.clientWidth, h = innerHeight;
    const scale = Math.max(0.5, Math.min(2, 720 / w));
    const c = await h2c(document.body, {
      x: scrollX, y: scrollY, width: w, height: h, windowWidth: w, windowHeight: h, scale,
      useCORS: true, logging: false, imageTimeout: 4000,
      backgroundColor: getComputedStyle(document.body).backgroundColor || '#fff',
      ignoreElements: el => el.id === 'fb'
    });
    return c.toDataURL('image/jpeg', 0.72);
  }

  // Nuotrauka iš galerijos – sumažinama iki 1600 px ilgiausios kraštinės
  function fromFile(f) {
    return new Promise((res, rej) => {
      const u = URL.createObjectURL(f), img = new Image();
      img.onload = () => {
        const k = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.naturalWidth * k)); c.height = Math.max(1, Math.round(img.naturalHeight * k));
        const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(u); res(c.toDataURL('image/jpeg', 0.75));
      };
      img.onerror = () => { URL.revokeObjectURL(u); rej(new Error('img')); };
      img.src = u;
    });
  }

  const opts = (name, arr, on) => `<div class="opts" data-g="${name}">` + arr.map(([k, t]) => `<button type="button" data-f="opt" data-k="${k}" class="${k === on ? 'on' : ''}${k === 'kritine' ? ' krit' : ''}">${esc(t)}</button>`).join('') + '</div>';

  function shotsHtml() {
    let h = st.imgs.map((s, i) => `<div class="shot"><img src="${s}" alt="Ekrano vaizdas ${i + 1}"><button type="button" data-f="rm" data-i="${i}" aria-label="Pašalinti vaizdą">×</button></div>`).join('');
    if (st.capturing) h += '<div class="shot">Kuriamas vaizdas…</div>';
    if (!st.imgs.length && !st.capturing) h += '<div class="muted">Ekrano vaizdo nėra.</div>';
    return h;
  }
  const updShots = () => { const s = box && box.querySelector('.shots'); if (s) s.innerHTML = shotsHtml(); const a = box && box.querySelector('.shotb'); if (a) a.style.display = st.imgs.length >= MAX_IMG ? 'none' : ''; };

  function formHtml() {
    const c = st.ctx;
    return `<div class="fbp"><div class="fbhd"><h1 id="fbh">Pranešti apie klaidą ar pasiūlyti</h1><button type="button" class="ib" data-f="close" aria-label="Uždaryti"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
<p class="muted">Puslapis: <b>${esc(c.puslapis)}</b>. Kartu bus išsiųsta programėlės versija ir įrenginio tipas.</p>
<h2>Kas tai?</h2>${opts('tipas', TIPAI, st.tipas)}
<h2>Svarba</h2>${opts('svarba', SVARBA, st.svarba)}
<label class="fl" for="fb-k">Kas negerai arba ką siūlote? *</label><textarea id="fb-k" rows="4" placeholder="Pvz.: TFC sąraše trūksta žingsnio…; 9-Line 8 eilutės kodai neatitinka mūsų SOP…"></textarea>
${c.pazymeta ? `<div class="card fbsel"><small class="muted">Pažymėtas tekstas (bus pridėtas):</small><br>„${esc(c.pazymeta)}“</div>` : ''}
<h2>Ekrano vaizdas</h2><div class="shots">${shotsHtml()}</div>
<div class="shotb"><button type="button" class="btn" data-f="cap">+ Ekrano vaizdas</button><label class="btn">+ Iš galerijos<input type="file" id="fb-file" accept="image/*" hidden></label></div>
<details class="alt"><summary>Daugiau (nebūtina)</summary>
<label class="fl" for="fb-kaip">Kaip turėtų būti?</label><textarea id="fb-kaip" rows="3"></textarea>
<label class="fl" for="fb-s">Kuo remiatės? (šaltinis, puslapis)</label><input id="fb-s" autocomplete="off">
<label class="fl" for="fb-v">Vardas arba kontaktas</label><input id="fb-v" autocomplete="name" value="${esc(LS.get(WHO, ''))}">
</details>
<input id="fb-hp" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
<button type="button" class="btn pri" data-f="send">Siųsti</button>
<p id="fb-msg" class="muted" role="status"></p>
<p class="muted">Jei klaida gali pakenkti pacientui – praneškite ir kuopos medikui iškart.</p></div>`;
  }

  function addShot() {
    if (st.imgs.length >= MAX_IMG || st.capturing) return;
    st.capturing = true; updShots();
    const my = st;
    capture().then(d => { if (my === st) st.imgs.push(d); }, () => { if (my === st) msg('Vaizdo sukurti nepavyko – galite pridėti iš galerijos.'); })
      .then(() => { if (my === st) { st.capturing = false; updShots(); } });
  }

  const msg = (t, cls) => { const m = box && box.querySelector('#fb-msg'); if (m) { m.textContent = t; m.className = cls || 'muted'; } };

  function open() {
    if (!box) {
      box = document.createElement('div');
      box.id = 'fb'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-labelledby', 'fbh'); box.hidden = true;
      document.body.appendChild(box);
      box.addEventListener('click', onClick);
      box.addEventListener('change', onChange);
    }
    if (!box.hidden) return;
    const p = (location.hash || '').split('/')[1] || '';
    st = { ctx: context(), tipas: /^vaist/.test(p) ? 'doze' : 'klaida', svarba: '', imgs: [], capturing: false };
    box.innerHTML = formHtml();
    box.hidden = false;
    document.documentElement.classList.add('fbopen');
    try { history.pushState(Object.assign({}, history.state, { fb: 1 }), ''); } catch (e) {}
    addShot();
    setTimeout(() => { const k = box.querySelector('#fb-k'); if (k && matchMedia('(pointer:fine)').matches) k.focus(); }, 50);
  }

  function hideBox() {
    if (!box || box.hidden) return;
    box.hidden = true; box.innerHTML = ''; st = null;
    document.documentElement.classList.remove('fbopen');
  }
  const hasText = () => { const k = box && box.querySelector('#fb-k'); return !!(k && k.value.trim()); };
  function close() { if (history.state && history.state.fb) history.back(); else hideBox(); }

  function onChange(e) {
    if (e.target.id !== 'fb-file' || !e.target.files || !e.target.files[0]) return;
    const f = e.target.files[0], my = st;
    e.target.value = '';
    if (st.imgs.length >= MAX_IMG) return;
    fromFile(f).then(d => { if (my === st) { st.imgs.push(d); updShots(); } }, () => msg('Šio failo atidaryti nepavyko.'));
  }

  function onClick(e) {
    if (e.target === box) { if (hasText()) { toast('Uždaryti – mygtukas ✕ (įvestas tekstas bus prarastas)'); return; } close(); return; }
    const el = e.target.closest('[data-f]');
    if (!el) return;
    switch (el.dataset.f) {
      case 'close': close(); break;
      case 'opt': {
        const g = el.parentNode.dataset.g, k = el.dataset.k;
        st[g] = g === 'svarba' && st.svarba === k ? '' : k;
        el.parentNode.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.k === st[g]));
        break;
      }
      case 'cap': addShot(); break;
      case 'rm': st.imgs.splice(+el.dataset.i, 1); updShots(); break;
      case 'send': submit(); break;
      case 'again': close(); break;
    }
  }

  const val = id => { const x = box.querySelector('#' + id); return x ? x.value.trim() : ''; };

  async function submit() {
    if (busy) return;
    const k = val('fb-k');
    if (!k) { msg('Parašykite, kas negerai arba ką siūlote.', 'err'); box.querySelector('#fb-k').focus(); return; }
    if (st.capturing) { msg('Palaukite – kuriamas ekrano vaizdas…'); return; }
    const vardas = val('fb-v');
    LS.set(WHO, vardas);
    const p = Object.assign({
      id: 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      sukurta: new Date().toISOString(),
      tipas: st.tipas, svarba: st.svarba, komentaras: k, kaip: val('fb-kaip'), saltinis: val('fb-s'), kontaktas: vardas,
      ekranai: st.imgs.slice(0, MAX_IMG), hp: val('fb-hp')
    }, st.ctx);
    busy = true;
    const btn = box.querySelector('[data-f=send]'); btn.disabled = true; btn.textContent = 'Siunčiama…';
    let r = null;
    try { r = await send(p); } catch (e) { r = null; }
    busy = false;
    if (r && r.ok) return done('Ačiū! Pranešimas ' + (r.nr && r.nr !== '-' ? '<b>' + esc(r.nr) + '</b> ' : '') + 'gautas.', 'Jis bus peržiūrėtas ir, jei reikia, programėlė bus pataisyta.');
    const a = outbox(); a.push(p); saveOut(a);
    done('Pranešimas išsaugotas telefone.', url() ? 'Nepavyko išsiųsti dabar – bus išsiųsta automatiškai, kai atsiras interneto ryšys.' : 'Pranešimų priėmimas dar neįjungtas – pranešimas bus išsiųstas automatiškai, kai tik jis veiks.');
  }

  function done(title, sub) {
    if (!box) return;
    box.querySelector('.fbp').innerHTML = `<div class="fbok"><div class="fbic">✓</div><h1>${title}</h1><p class="muted">${esc(sub)}</p><button type="button" class="btn pri" data-f="again">Grįžti į programėlę</button></div>`;
  }

  async function send(p) {
    const u = url();
    if (!u) throw new Error('nėra adreso');
    const body = JSON.stringify(p), headers = { 'Content-Type': 'text/plain;charset=utf-8' };
    try {
      const r = await fetch(u, { method: 'POST', body, headers, redirect: 'follow' });
      const j = await r.json().catch(() => null);
      if (j && j.ok) return j;
      if (j && j.ok === false) throw Object.assign(new Error(j.klaida || 'serveris'), { server: true });
      if (r.ok) return { ok: true };
      throw Object.assign(new Error('HTTP ' + r.status), { server: true });
    } catch (e) {
      if (e.server || !navigator.onLine) throw e;
      // Jei naršyklė neleidžia perskaityti atsakymo (CORS) – siunčiama dar kartą be atsakymo; dublikatus atmeta serveris pagal ID.
      await fetch(u, { method: 'POST', body, headers, mode: 'no-cors' });
      return { ok: true };
    }
  }

  let flushing = false;
  async function flush() {
    if (flushing || !url() || !navigator.onLine) return 0;
    let a = outbox();
    if (!a.length) return 0;
    flushing = true;
    let sent = 0;
    for (const p of a.slice()) {
      try { const r = await send(p); if (r && r.ok) { sent++; a = outbox().filter(x => x.id !== p.id); saveOut(a); } }
      catch (e) { if (!navigator.onLine) break; }
    }
    flushing = false;
    return sent;
  }

  addEventListener('popstate', () => { if (box && !box.hidden && !(history.state && history.state.fb)) hideBox(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && box && !box.hidden) { if (hasText()) { toast('Uždaryti – mygtukas ✕ (įvestas tekstas bus prarastas)'); return; } close(); } });
  addEventListener('online', () => flush());
  setTimeout(flush, 4000);

  return { open, flush, pending: () => outbox().length, configured: () => !!url() };
})();
