// March gidas – VAISTAI (TCCC gairės 2026-05-01; gamintojų PCS)
// Laukai: id, name, klase, grupe, lygis ('CLS' – skiria kovos gelbėtojas (sau ar draugui), 'CMC' – kovos medikas),
// ind, kontra, dozes [{k, d, p, c: skaičiuoklė {min, max, conc} mg/kg}], ispejimai, pakuote, pastabos, susije, saltinis, nuorodos.
window.ETC = window.ETC || {};
(function () {
const E = window.ETC;
const TCCC = ['TCCC gairės 2026-05-01 (PDF, Deployed Medicine)', 'https://learning-media.allogy.com/api/v1/pdf/18ccfdfc-a076-47e9-8a34-376efdd81b43/contents'];
const TCCCUA = ['TCCC gairės 2026 (ukr. / angl., tccc.org.ua)', 'https://tccc.org.ua/en/guide/tccc-guidelines-2026'];

E.vaistuGrupes = [
  { id: 'skausmas', pav: 'Skausmas' },
  { id: 'antibiotikai', pav: 'Antibiotikai' },
  { id: 'kraujas', pav: 'Kraujavimas ir transfuzija' },
  { id: 'vemimas', pav: 'Pykinimas ir vėmimas' },
  { id: 'galva', pav: 'Galvos smegenų trauma' }
];

E.vaistai = [
  {
    id: 'paracetamolis', name: 'Paracetamolis', klase: 'CWMP – nuskausminamieji', grupe: 'skausmas', lygis: 'CLS',
    ind: 'Skausmas – kovinių žaizdų vaistų paketo (CWMP) dalis: sužeistasis, kuris gali tęsti užduotį, vartoja pats arba duoda draugas. Negalinčiam tęsti užduoties – CWMP (jei dar negavo) kartu su ketaminu.',
    kontra: 'PCS: padidėjęs jautrumas paracetamoliui.',
    dozes: [{ k: 'Per burną (TCCC 2026)', d: '1000–1300 mg kas 8 val.', p: 'CWMP – 2 × 650 mg prailginto atpalaidavimo tabletės; 500 mg tabletės – 2 tab. (1000 mg).' }],
    ispejimai: ['Nevartoti kartu su kitais paracetamolio turinčiais vaistais (PCS).'],
    pakuote: 'Tabletės 650 mg (prailginto atpalaidavimo) arba 500 mg',
    pastabos: ['CWMP (TCCC 2026): paracetamolis + meloksikamas + suzetriginas. Antibiotiko CWMP nebėra – geriamasis antibiotikas (cefadroksilis) skiriamas atskirai.'],
    susije: ['meloksikamas', 'suzetriginas', 'ketaminas'],
    saltinis: 'TCCC gairės 2026-05-01 (TFC 11); PCS (paracetamolis)',
    nuorodos: [TCCC, ['PCS – paracetamolis 500 mg (JK eMC)', 'https://www.medicines.org.uk/emc/product/5164/smpc']]
  },
  {
    id: 'meloksikamas', name: 'Meloksikamas', klase: 'CWMP – nuskausminamieji (NVNU)', grupe: 'skausmas', lygis: 'CLS',
    ind: 'Skausmas – CWMP dalis (kaip paracetamolis).',
    kontra: 'PCS: padidėjęs jautrumas NVNU ar aspirinui; virškinamojo trakto kraujavimas, perforacija ar aktyvi opa; smegenų kraujavimas ar kiti kraujavimo sutrikimai; sunkus kepenų, inkstų ar širdies nepakankamumas; III nėštumo trimestras.',
    dozes: [{ k: 'Per burną (TCCC 2026)', d: '15 mg kartą per parą', p: 'Ne daugiau kaip 15 mg per parą (PCS).' }],
    ispejimai: ['Hipovolemija ir šokas – inkstų pažeidimo rizika (PCS).', 'Nevartoti su kitais NVNU (ibuprofenu, diklofenaku ir pan.).'],
    pakuote: 'Tabletės 15 mg',
    susije: ['paracetamolis', 'suzetriginas'],
    saltinis: 'TCCC gairės 2026-05-01 (TFC 11); PCS (meloksikamas 15 mg)',
    nuorodos: [TCCC, ['PCS – meloksikamas 15 mg (JK eMC)', 'https://www.medicines.org.uk/emc/product/101306/smpc']]
  },
  {
    id: 'suzetriginas', name: 'Suzetriginas', klase: 'CWMP – neopioidinis nuskausminamasis', grupe: 'skausmas', lygis: 'CLS',
    ind: 'Skausmas – nauja CWMP dalis TCCC 2026 gairėse (kartu su paracetamoliu ir meloksikamu).',
    kontra: 'Gamintojo informacija (JAV): nevartoti kartu su stipriais CYP3A inhibitoriais (pvz., klaritromicinu, itrakonazolu); vengti vidutinių ir stiprių CYP3A induktorių, sunkaus kepenų nepakankamumo (Child-Pugh C) ir kai eGFR < 15 ml/min.',
    dozes: [{ k: 'Per burną (TCCC 2026)', d: '100 mg vieną kartą, po to 50 mg kas 12 val.', p: 'Pirmoji dozė – 2 tabletės po 50 mg.' }],
    ispejimai: ['Naudokite, jei jis yra jūsų CWMP pakuotėje; vartokite pagal pakuotės lapelį.', 'Pirmąją dozę – nevalgius (≥ 1 val. prieš ar 2 val. po valgio); vengti greipfrutų (gamintojo informacija).'],
    pakuote: 'Tabletės 50 mg',
    pastabos: ['Neopioidinis vaistas (blokuoja skausmo signalus perduodančius NaV1.8 kanalus) – nesukelia sedacijos ir kvėpavimo slopinimo kaip opioidai.'],
    susije: ['paracetamolis', 'meloksikamas'],
    saltinis: 'TCCC gairės 2026-05-01 (TFC 11); gamintojo informacija (JAV)',
    nuorodos: [TCCC, ['Gamintojo informacija – JOURNAVX (suzetriginas), JAV', 'https://pi.vrtx.com/files/uspi_suzetrigine.pdf']]
  },
  {
    id: 'ketaminas', name: 'Ketaminas', klase: 'Stiprus nuskausminamasis', grupe: 'skausmas', lygis: 'CMC',
    ind: 'Vidutinis ar stiprus skausmas, kai sužeistasis negali tęsti užduoties (kartu su CWMP, jei dar negavo). Skiria TCCC medicinos personalas.',
    kontra: 'Alergija. PCS dar nurodo būklės, kai kraujospūdžio padidėjimas pavojingas; TCCC 2026: galvos smegenų ar akies trauma ketamino nedraudžia.',
    dozes: [
      { k: 'IM', d: '100 mg', p: '50 mg/ml – 2 ml; 100 mg/ml – 1 ml.' },
      { k: 'Į nosį (IN)', d: '50 mg', p: 'Tik 100 mg/ml – 0,5 ml (purkštuvu).' },
      { k: 'IV / IO', d: '25 mg (≈ 0,2–0,3 mg/kg)', p: 'Lėtai per 1 min. Neskiesta: 50 mg/ml – 0,5 ml; 100 mg/ml – 0,25 ml. Praskiedus iki 5 mg/ml: 50 mg/ml ampulė – 1 ml + 9 ml 0,9 % NaCl; 100 mg/ml ampulė – 0,5 ml + 9,5 ml 0,9 % NaCl; tada 25 mg = 5 ml.' },
      { k: 'Kartoti', d: 'kas 30 min pagal poreikį', p: 'Tikslas – skausmas sumažėjo arba atsirado nistagmas (akių obuolių trūkčiojimas).' }
    ],
    ispejimai: [
      'Prieš skiriant – nuginkluoti, apsvarstyti ryšio priemonių atjungimą, AVPU įrašyti į kortelę.',
      'Stebėti kvėpavimo takus, kvėpavimą ir kraujotaką; kvėpavimui retėjant – „uostymo“ padėtis, toliau – ventiliacija.',
      'Benzodiazepinų (pvz., midazolamo) kartu neskirti; dalinė disociacija – papildoma ketamino dozė.',
      'Tikrinkite ampulės stiprumą (50 ar 100 mg/ml) – nuo jo priklauso ml.'
    ],
    pakuote: 'Ampulės 50 mg/ml arba 100 mg/ml',
    pastabos: ['Galima skirti ir po opioido.', 'Procedūrinė sedacija (1–2 mg/kg IV / IO arba 300 mg IM) – tik kovos paramedikams (CPP), pasiruošusiems užtikrinti kvėpavimo takus.', 'Pykinimui – ondansetronas.'],
    susije: ['esketaminas', 'ondansetronas', 'paracetamolis'],
    saltinis: 'TCCC gairės 2026-05-01 (TFC 11); PCS (Ketalar)',
    nuorodos: [TCCC, ['PCS – Ketalar (ketaminas) (JK eMC)', 'https://www.medicines.org.uk/emc/product/5202/smpc']]
  },
  {
    id: 'esketaminas', name: 'Esketaminas', klase: 'Nuskausminamasis (į nosį)', grupe: 'skausmas', lygis: 'CMC',
    ind: 'Alternatyva ketaminui, kai sužeistasis negali tęsti užduoties (TCCC 2026).',
    kontra: 'PCS (Spravato): padidėjęs jautrumas; aneurizminė kraujagyslių liga ar arterioveninė malformacija; intracerebrinis kraujavimas anamnezėje.',
    dozes: [{ k: 'Į nosį (TCCC 2026)', d: '14 arba 28 mg vieną kartą', p: '28 mg prietaisas: po 1 purškimą į kiekvieną šnervę (1 purškimas = 14 mg).' }],
    ispejimai: ['Kaip ir ketaminui: nuginkluoti, AVPU įrašyti į kortelę, stebėti kvėpavimą; benzodiazepinų neskirti.'],
    pakuote: 'Nosies purškalas 28 mg (2 purškimai)',
    susije: ['ketaminas'],
    saltinis: 'TCCC gairės 2026-05-01 (TFC 11); PCS (Spravato)',
    nuorodos: [TCCC, ['PCS – Spravato (esketaminas), EMA', 'https://www.ema.europa.eu/en/medicines/human/EPAR/spravato']]
  },
  {
    id: 'cefadroksilis', name: 'Cefadroksilis', klase: 'Geriamasis antibiotikas (cefalosporinas)', grupe: 'antibiotikai', lygis: 'CLS',
    ind: 'Visos atviros kovinės žaizdos ir invazinės procedūros, kai sužeistasis gali nuryti; penetruojanti akies trauma (TCCC 2026).',
    kontra: 'PCS: padidėjęs jautrumas cefalosporinams; sunki reakcija į penicilinus ar kitus beta laktamus anamnezėje.',
    dozes: [{ k: 'Per burną (TCCC 2026)', d: '1 g kartą per parą', p: '500 mg kapsulės – 2 kapsulės.' }],
    ispejimai: ['Paklauskite apie alergijas; esant alergijai penicilinams – praneškite medikui.'],
    pakuote: 'Kapsulės 500 mg',
    pastabos: ['Alternatyva – cefaleksinas 500 mg kas 6 val.', 'Negali nuryti (šokas, be sąmonės) – ceftriaksonas 2 g IV / IO / IM (CMC).', 'Nudegimams be penetruojančių žaizdų antibiotikų nereikia.'],
    susije: ['cefaleksinas', 'ceftriaksonas'],
    saltinis: 'TCCC gairės 2026-05-01 (TFC 9, 12); PCS (cefadroksilis)',
    nuorodos: [TCCC, ['PCS – cefadroksilis 500 mg (JK eMC)', 'https://www.medicines.org.uk/emc/product/6543/smpc']]
  },
  {
    id: 'cefaleksinas', name: 'Cefaleksinas', klase: 'Geriamasis antibiotikas (alternatyva)', grupe: 'antibiotikai', lygis: 'CLS',
    ind: 'Alternatyva cefadroksiliui – atviros kovinės žaizdos, kai sužeistasis gali nuryti (TCCC 2026).',
    kontra: 'PCS: padidėjęs jautrumas cefalosporinams.',
    dozes: [{ k: 'Per burną (TCCC 2026)', d: '500 mg kas 6 val.' }],
    ispejimai: ['Paklauskite apie alergijas; kitos dozės laiką įrašykite į kortelę.'],
    pakuote: 'Kapsulės 250 mg arba 500 mg',
    susije: ['cefadroksilis', 'ceftriaksonas'],
    saltinis: 'TCCC gairės 2026-05-01 (TFC 12); PCS (cefaleksinas)',
    nuorodos: [TCCC]
  },
  {
    id: 'ceftriaksonas', name: 'Ceftriaksonas', klase: 'Parenterinis antibiotikas (cefalosporinas)', grupe: 'antibiotikai', lygis: 'CMC',
    ind: 'Atviros kovinės žaizdos, kai sužeistasis negali nuryti (šokas, be sąmonės); penetruojanti akies trauma (TCCC 2026).',
    kontra: 'PCS: padidėjęs jautrumas cefalosporinams; sunki alergija kitiems beta laktamams anamnezėje.',
    dozes: [{ k: 'IV / IO / IM (TCCC 2026)', d: '2 g kartą per parą', p: 'IV – lėtai per 5 min arba infuzija ≥ 30 min. IM – į vieną vietą ne daugiau kaip 1 g: 2 g dalyti į dvi vietas (PCS).' }],
    ispejimai: ['Su kalcio tirpalais nemaišyti ir neleisti vienu metu ta pačia linija – galima paeiliui, tarp jų praplovus liniją, arba per atskirą prieigą (PCS).', 'Ištirpintas lidokainu – niekada neleisti į veną (PCS).'],
    pakuote: 'Milteliai flakone 1 g arba 2 g',
    susije: ['cefadroksilis', 'kalcis'],
    saltinis: 'TCCC gairės 2026-05-01 (TFC 9, 12); PCS (ceftriaksonas 2 g)',
    nuorodos: [TCCC, ['PCS – ceftriaksonas 2 g (JK eMC)', 'https://www.medicines.org.uk/emc/product/15078/smpc']]
  },
  {
    id: 'txa', name: 'Traneksamo rūgštis (TXA)', klase: 'Antifibrinolitikas', grupe: 'kraujas', lygis: 'CMC',
    ind: 'Kai tikėtina transfuzija (hemoraginis šokas, viena ar daugiau didelių amputacijų, penetruojanti liemens trauma, stiprus kraujavimas) arba reikšminga galvos smegenų trauma ar sutrikusi sąmonė po sprogimo ar bukos traumos (TCCC 2026).',
    kontra: 'PCS: padidėjęs jautrumas; ūminė trombozė; traukulių anamnezė.',
    dozes: [{ k: 'IV / IO (TCCC 2026)', d: '2 g lėtai – kuo anksčiau, ne vėliau kaip per 3 val. nuo sužalojimo', p: '4 ampulės po 500 mg / 5 ml = 20 ml.' }],
    ispejimai: ['Po 3 val. nuo sužalojimo neskirti. Pažymėkite sužeidimo laiką pradžios ekrane – „TXA iki“ parodys terminą.', 'TCCC: lėta IV / IO injekcija. PCS nurodo ne greičiau kaip 1 ml/min – per greitai leidžiant gali kristi kraujospūdis.', 'Tik IV / IO.'],
    pakuote: 'Ampulės 500 mg / 5 ml (100 mg/ml)',
    pastabos: ['Įrašykite į kortelę dozę ir laiką.'],
    susije: ['kalcis'],
    saltinis: 'TCCC gairės 2026-05-01 (TFC 6d); PCS (Cyklokapron)',
    nuorodos: [TCCC, ['PCS – Cyklokapron (JK eMC)', 'https://www.medicines.org.uk/emc/product/1077/smpc']]
  },
  {
    id: 'kalcis', name: 'Kalcio gliukonatas 10 %', klase: 'Elektrolitai', grupe: 'kraujas', lygis: 'CMC',
    ind: 'Po pirmo perpilto kraujo produkto vieneto (TCCC 2026).',
    kontra: 'PCS: hiperkalcemija; vartojantiems digoksiną – tik gyvybei pavojingos būklės atveju.',
    dozes: [{ k: 'IV / IO (TCCC 2026)', d: '30 ml 10 % kalcio gliukonato (arba 10 ml 10 % kalcio chlorido)', p: 'Po pirmojo perpilto kraujo produkto vieneto. Gliukonato reikia 30 ml (3 ampulės po 10 ml), ne 10 ml. TCCC tai vadina „1 g kalcio“. Leisti lėtai (PCS – apie 2 ml/min).' }],
    ispejimai: ['Su ceftriaksonu nemaišyti ir neleisti vienu metu ta pačia linija – galima paeiliui, tarp jų praplovus liniją 0,9 % NaCl, arba per atskirą prieigą (PCS).', 'Ekstravazacija sukelia audinių nekrozę (PCS).'],
    pakuote: '10 % tirpalas (100 mg/ml)',
    susije: ['txa'],
    saltinis: 'TCCC gairės 2026-05-01 (TFC 6e); PCS (kalcio gliukonatas 10 %)',
    nuorodos: [TCCC, ['PCS – kalcio gliukonatas 10 % (JK eMC)', 'https://www.medicines.org.uk/emc/product/6264/smpc']]
  },
  {
    id: 'ondansetronas', name: 'Ondansetronas', klase: 'Vėmimą slopinantys', grupe: 'vemimas', lygis: 'CMC',
    ind: 'Pykinimas ir vėmimas (pvz., po ketamino).',
    kontra: 'Alergija. PCS: vengti esant įgimtam ilgo QT sindromui.',
    dozes: [{ k: 'ODT / IV / IO / IM (TCCC 2026)', d: '4 mg kas 8 val. pagal poreikį', p: 'ODT – burnoje tirpstanti tabletė. IV – lėtai, ne greičiau kaip per 30 s (PCS).' }],
    ispejimai: ['Vemiantį sužeistąjį saugokite nuo aspiracijos (šoninė padėtis).'],
    pakuote: 'Tirpstančios tabletės 4 mg; ampulės 2 mg/ml',
    susije: ['ketaminas'],
    saltinis: 'TCCC gairės 2026-05-01 (TFC 11); PCS (ondansetronas)',
    nuorodos: [TCCC, ['PCS – ondansetronas (JK eMC)', 'https://www.medicines.org.uk/emc/product/13193/smpc']]
  },
  {
    id: 'nacl-hipert', name: 'Hipertoninis NaCl', klase: '3 % arba 5 % (arba 23,4 %)', grupe: 'galva', lygis: 'CMC',
    ind: 'Tik esant galvos smegenų išvaržos požymiams: asimetriški arba fiksuoti ir išsiplėtę vyzdžiai, patologinė laikysena (TCCC 2026). Profilaktiškai neskirti.',
    kontra: 'Profilaktiškai ir kaip gaivinimo (tūrio) skysčio neskirti.',
    dozes: [{ k: 'IV / IO (TCCC 2026)', d: '250 ml 3 % arba 5 % NaCl (arba 30 ml 23,4 %) per ≥ 10 min, po to praplauti', p: 'Nėra atsako – kartoti po 20 min (maks. 2 dozės).' }],
    ispejimai: ['Ekstravazacijos atveju – nutraukti (TCCC 2026).'],
    pakuote: 'Pagal vieneto rinkinį',
    pastabos: ['Galvos smegenų trauma (TCCC 2026): SpO₂ ≥ 92 %, sAKS > 100 mm Hg (arba normalus radialinis pulsas), ventiliuojant EtCO₂ 35–45 mm Hg (be EtCO₂ – 10 įkvėpimų/min), galva ir liemuo > 30° (jei nėra šoko), neurologinė patikra kas 5–10 min.'],
    saltinis: 'TCCC gairės 2026-05-01 (TFC 8)',
    nuorodos: [TCCC]
  }
];
})();
