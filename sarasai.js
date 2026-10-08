// March gidas – FAZĖS, KONTROLINIAI SĄRAŠAI, MOKYMOSI PUSLAPIAI IR TEMOS
// Pagrindas: TCCC gairės 2026-05-01 (CoTCCC), JTS CLS / CMC kursai (tccc.org.ua, Deployed Medicine),
// M. Grinevičiaus TCCC CLS kursas (lietuviški terminai). Jei šaltiniai skiriasi – vadovaujamasi TCCC 2026.
// Sąrašo punktas: { t: tekstas, s: [papunkčiai], g: 'CMC' | 'CPP' – kam skirta (be g – CLS), k: true – svarbiausias,
//   sk: įgūdžio Nr. (nuoroda), r: kitas maršrutas (pvz. '#/9line'), i: paaiškinimas mokymosi režimui (HTML) }
// { h: 'Antraštė' } – skyriaus antraštė sąraše.
window.ETC = window.ETC || {};

(function () {
const E = window.ETC;
const fig = (src, cap) => `<figure class="fig"><a href="img/tccc/${src}.webp" target="_blank" rel="noopener"><img loading="lazy" src="img/tccc/${src}.webp" alt="${cap}"></a><figcaption>${cap}<small>Iliustracija: Joint Trauma System (Deployed Medicine) · tccc.org.ua</small></figcaption></figure>`;
const sk = (n, t) => `<a href="#/igudis/${n}">${t || 'Įgūdis #' + n}</a>`;

E.versija = '2026-10-08 v1 (pirmoji versija: TCCC 2026, CLS / CMC, 36 įgūdžiai, 9-Line ir MIST)';
E.programa = 'March gidas';
// Pranešimų priėmimas – ta pati Google lentelė kaip ETC gido (pranešimai žymimi „March gidas“)
E.atsiliepimai = { url: 'https://script.google.com/macros/s/AKfycbyUpzDmAClJ40FMltkHi21Ozc4PpItRr3u6yy4rU0DKNGe7JkRBnOr0y42wLwpJcBau/exec' };

// ───────── FAZĖS ─────────
E.fazes = [
  { id: 'CUF', cls: 'fCUF', pav: 'Pagalba apšaudymo metu', en: 'Care Under Fire', sub: 'Ugnis, priedanga, turniketas', lists: ['cuf'],
    aprasymas: 'Efektyvi priešo ugnis ar kita tiesioginė grėsmė. Geriausias „vaistas“ – ugnies pranašumas. Suteikiama tik būtiniausia pagalba: turniketas gyvybei pavojingam galūnės kraujavimui ir sužeistojo perkėlimas į priedangą.' },
  { id: 'TFC', cls: 'fTFC', pav: 'Taktinė lauko pagalba', en: 'Tactical Field Care', sub: 'MARCH PAWS', lists: ['tfc-s', 'tfc-m', 'tfc-a', 'tfc-r', 'tfc-c', 'tfc-h', 'tfc-paws', 'tfc-evak'],
    aprasymas: 'Tiesioginės ugnies nebėra, bet grėsmė išlieka – situacinį budrumą išlaikykite visą laiką. Pagalba teikiama nuosekliai pagal MARCH PAWS; būklė gali bet kada vėl tapti CUF.' },
  { id: 'TACEVAC', cls: 'fTAC', pav: 'Taktinė evakuacijos pagalba', en: 'Tactical Evacuation Care', sub: 'Perėmimas, pervežimas, perdavimas', lists: ['tac-perimimas', 'tac-march', 'tac-transport', 'tac-perdavimas'],
    aprasymas: 'Sužeistasis perimamas ir gabenamas į medicinos įstaigą ar stabilizavimo punktą. Medicininė pagalba – tokia pati kaip TFC, papildomai: deguonis, išplėstinis stebėjimas, pakartotinis vertinimas po kiekvieno perkėlimo ir aiškus perdavimas.' }
];

E.sarasai = {
  // ───────── CUF ─────────
  cuf: {
    title: 'Pagalba apšaudymo metu (CUF)', short: 'CUF',
    intro: 'Kol tęsiasi efektyvi priešo ugnis. Gelbėtojo ir sužeistojo saugumas – pirmiausia.',
    items: [
      { t: 'Atsakykite į ugnį ir pasislėpkite priedangoje', k: true, i: 'Ugnies pranašumas sumažina riziką ir sužeistajam, ir gelbėtojams. Neikite prie sužeistojo, kol jis yra „mirties zonoje“, o ugnis nenuslopinta.' },
      { t: 'Sužeistajam: toliau kovoti, jei gali', s: ['Paliepkite pereiti į priedangą ir suteikti pagalbą sau'] },
      { t: 'Neleiskite sužeistajam patirti papildomų sužalojimų' },
      { t: 'Iš degančios technikos ar pastato ištraukite ir sustabdykite degimą' },
      { t: 'Gyvybei pavojingas galūnės kraujavimas – turniketas, jei leidžia taktinė situacija', k: true, sk: 4,
        s: ['Pirmiausia – sužeistasis pats, jei gali', 'Aukštai ir tvirtai, ant uniformos, virš kraujavimo vietos', 'Užveržkite, kol kraujavimas sustos, ir judėkite į priedangą'],
        i: 'Sau – ' + sk(4) + ', draugui – ' + sk(5) + '. Naudokite sužeistojo turniketą, ne savo.' },
      { t: 'Nejudantį sužeistąjį perkelkite į priedangą – vilkimas ar nešimas', sk: 2, i: sk(2, 'Vieno žmogaus') + ' ir ' + sk(3, 'dviejų žmonių') + ' vilkimas ir nešimas.' },
      { t: 'Kvėpavimo takų valdymą atidėkite iki TFC' },
      { t: 'Kai saugu – pažymėkite turniketo laiką', tm: 'turn', i: 'Mygtukas ⏱ pažymi dabartinį laiką; keisti galima pradžios ekrane (kortelė „Turniketas“). Keičiant turniketą laiko nekeiskite – 2 ir 6 val. skaičiuojamos nuo pirmojo uždėjimo.' }
    ]
  },

  // ───────── TFC ─────────
  'tfc-s': {
    title: 'TFC: saugumas ir rūšiavimas', short: 'Saugumas',
    intro: 'Taktinė lauko pagalba prasideda, kai tiesioginės ugnies nebėra. Būklė gali bet kada vėl tapti CUF.',
    items: [
      { t: 'Perimetro sauga pagal SOP, situacinis budrumas', k: true },
      { t: 'Keli sužeistieji – rūšiavimas', sk: 36, s: ['Pirmiausia: masyvus kraujavimas, penetruojanti liemens trauma, kvėpavimo takų sutrikimas, kvėpavimo distresas, sutrikusi sąmonė'] },
      { t: 'Sutrikusios sąmonės sužeistąjį nuginkluokite (ginklas, granatos) ir apsaugokite ryšio priemones', k: true },
      { t: 'Pažymėkite sužeidimo laiką', tm: 'trauma', i: 'Mygtukas ⏱ pažymi dabartinį laiką; jei sužeista anksčiau – pataisykite pradžios ekrane (kortelė „Sužeidimas“). Nuo jo skaičiuojamas TXA terminas (3 val.).' },
      { t: 'Pasakykite sužeistajam, kas vyksta, nuraminkite' }
    ]
  },
  'tfc-m': {
    title: 'M – masyvus kraujavimas', short: 'M',
    items: [
      { t: 'Greita kraujo apčiuopa: kaklas, pažastys, kirkšnys, kojos, rankos, pilvas, krūtinė, nugara', k: true, sk: 1, i: 'Nepastebėtas kraujavimas gali nužudyti per 3 min. Ieškokite kraujo balų, permirkusių drabužių, amputacijų.' },
      { t: 'Galūnės kraujavimas ar amputacija – turniketas 5–7,5 cm virš žaizdos, tiesiai ant odos', k: true, sk: 5 },
      { t: 'Nesustojo – antras turniketas greta pirmojo' },
      { t: 'Kaklo, pažasties, kirkšnies ar kita neužveržiama žaizda – tamponavimas hemostatiniu tvarsčiu ir ≥ 3 min spaudimas', k: true, sk: 6, s: ['Po to – spaudžiamasis tvarstis'] },
      { t: 'Jungties vietos kraujavimas – improvizuotas spaudimo įtaisas arba jungties turniketas', sk: 7, i: 'CLS – tamponavimas, spaudimas, improvizuotas spaudimo įtaisas (' + sk(7) + '). Komercinis jungties turniketas (pvz., SAM JT) – CMC.' },
      { t: 'Patikrinkite CUF metu uždėtus turniketus – ar veiksmingi (žr. C)', sk: 8 },
      { t: 'Turniketo laikas užrašytas ant turniketo ir kortelėje', tm: 'turn' },
      { t: 'Įvertinkite hemoraginį šoką: sąmonė ir radialinis pulsas', k: true, sk: 17 }
    ]
  },
  'tfc-a': {
    title: 'A – kvėpavimo takai', short: 'A',
    items: [
      { t: 'Įvertinkite: ar kvėpavimo takai laisvi (kalba, kvėpavimo garsai)' },
      { t: 'Sąmoningas – leiskite pasirinkti padėtį, geriausiai saugančią kvėpavimo takus (sėdėti, palinkti į priekį)', k: true },
      { t: 'Be sąmonės – stabili šoninė padėtis: galva atlošta, smakras nuo krūtinės', k: true, sk: 10 },
      { t: 'Kvėpavimo takų atvėrimas: galvos atlošimas ir smakro pakėlimas arba apatinio žandikaulio stūmimas', sk: 9 },
      { t: 'Atsiurbimas, jei yra priemonių', g: 'CMC' },
      { t: 'Obstrukcija išlieka (veido trauma, kraujas, deformacija, nudegimai) – chirurginė krikotiroidotomija', g: 'CMC', sk: 13, i: 'TCCC 2026: atvira technika su bougie arba standartinė atvira; vietą patvirtinti kapnografija (EtCO₂).' },
      { t: 'Kaklo stabilizacija nereikalinga, jei trauma tik penetruojanti' },
      { t: 'Kvėpavimo takus dažnai vertinkite iš naujo' }
    ]
  },
  'tfc-r': {
    title: 'R – kvėpavimas', short: 'R',
    items: [
      { t: 'Atidenkite ir apžiūrėkite krūtinę: priekį, šonus, nugarą', k: true, sk: 14 },
      { t: 'Atvira („čiulpianti“) krūtinės žaizda – ventiliuojamas krūtinės lipdukas', k: true, sk: 15 },
      { t: 'Įtarkite įtampos pneumotoraksą', k: true, sk: 14, s: ['Liemens trauma ar sprogimas IR bent vienas: sunkėjantis kvėpavimo distresas, dažnas kvėpavimas, vienoje pusėje negirdėti kvėpavimo, SpO₂ < 90 %, šokas, trauminis sustojimas'] },
      { t: 'Atkelkite ar nuimkite krūtinės lipduką; padėtis – ant nugaros ar šoninė' },
      { t: 'Adatos dekompresija (NDC): 14 G arba 10 G, 8 cm', k: true, sk: 16, s: ['5 tarpšonkaulinis tarpas priekinėje pažasties linijoje ARBA 2 tarpas vidurinėje raktikaulio linijoje', 'Statmenai, virš apatinio šonkaulio, iki galo; palaikykite 5–10 s'] },
      { t: 'Nepadėjo – antra NDC toje pačioje pusėje kitoje vietoje; svarstykite kitą pusę' },
      { t: 'Pulsoksimetras, jei yra' },
      { t: 'Sutrikusi ventiliacija ir neištaisoma hipoksija (SpO₂ < 90 %, galvos trauma – < 92 %) – NPA ir ventiliacija 1000 ml ambu maišu', sk: 12, i: sk(11, 'Nazofaringinis vamzdelis') + ', ' + sk(12, 'ambu maišas') + '.' }
    ]
  },
  'tfc-c': {
    title: 'C – kraujotaka', short: 'C',
    items: [
      { t: 'Šoko požymiai: sutrikusi sąmonė (be galvos traumos) ir / ar silpnas, nečiuopiamas radialinis pulsas', k: true, sk: 17 },
      { t: 'Dubens diržas: sunki buka ar sprogimo trauma IR dubens skausmas, didelė kojos amputacija ar beveik amputacija, dubens lūžio požymiai, be sąmonės ar šokas', g: 'CMC', sk: 18 },
      { t: 'Turniketų peržiūra: atidenkite žaizdą – ar turniketo reikia? Reikia – naujas 5–7,5 cm virš žaizdos ant odos, senąjį atlaisvinkite', k: true, sk: 8 },
      { t: 'Konversija per 2 val., jei: nėra šoko, žaizdą galima stebėti, ne amputacija', k: true, sk: 8, s: ['CLS po 2 val. – tik CMC ar aukštesnio lygio mediko nurodymu', 'Ilgiau nei 6 val. uždėto turniketo lauke nenuimkite'] },
      { t: 'IV / IO prieiga (šokas ar jo rizika, reikia vaistų) – 18 G arba IO', g: 'CMC', sk: 19 },
      { t: 'TXA 2 g lėtai IV / IO – kuo anksčiau, ne vėliau kaip per 3 val.', g: 'CMC', k: true, sk: 20, r: '#/vaistas/txa' },
      { t: 'Hemoraginis šokas – kraujas, kol: čiuopiamas radialinis pulsas, gerėja sąmonė ar sAKS 100 mm Hg', g: 'CMC', sk: 20, s: ['Šaltai laikytas mažo titro O pilnas kraujas → iš anksto ištirtų donorų šviežias mažo titro O pilnas kraujas → plazma : eritrocitai : trombocitai 1 : 1 : 1 → 1 : 1 → plazma ar eritrocitai', 'Neištirtas šviežias kraujas – tik mediko nurodymu, apmokyto personalo'] },
      { t: 'Po pirmo kraujo vieneto – kalcis: 30 ml 10 % kalcio gliukonato (arba 10 ml 10 % kalcio chlorido)', g: 'CMC', r: '#/vaistas/kalcis' },
      { t: 'Nėra šoko – IV skysčių nereikia; sąmoningas ir galintis nuryti gali gerti' },
      { t: 'Gaivinant pradėkite hipotermijos prevenciją' },
      { t: 'Šokas kartojasi – vėl patikrinkite visą kraujavimą; nepadeda skysčiai – galvokite apie įtampos pneumotoraksą' }
    ]
  },
  'tfc-h': {
    title: 'H – hipotermija, galva, akys', short: 'H',
    items: [
      { t: 'Hipotermijos prevencija – kuo anksčiau', k: true, sk: 21, s: ['Izoliacija nuo žemės, šlapius drabužius keiskite sausais', 'Aktyvus šildymas ant krūtinės ir pažasčių – ne tiesiai ant odos', 'Apvyniokite nepralaidžiu apvalkalu, veido neuždenkite'] },
      { t: 'Galvos smegenų trauma: nevykdo paprastų komandų ilgiau nei 10 min po sužalojimo', k: true, sk: 22, s: ['SpO₂ ≥ 92 %; sAKS > 100 mm Hg (arba normalus radialinis pulsas)', 'Jei nėra šoko – galva ir liemuo pakelti > 30°', 'Neurologinė patikra kas 5–10 min', 'Evakuoti kuo skubiau – operacija geriausia per 5 val.'] },
      { t: 'Išvaržos požymiai (asimetriški arba fiksuoti ir išsiplėtę vyzdžiai, patologinė laikysena) – hipertoninis NaCl', g: 'CMC', sk: 22, r: '#/vaistas/nacl-hipert' },
      { t: 'Penetruojanti akies trauma: greitas regėjimo testas, standus skydelis (ne spaudžiamasis tvarstis), antibiotikas', k: true, sk: 23 },
      { t: 'Elektroninis stebėjimas (SpO₂, EtCO₂, AKS), jei yra', g: 'CMC', sk: 30 }
    ]
  },
  'tfc-paws': {
    title: 'P · A · W · S – skausmas, antibiotikai, žaizdos, įtvėrimas', short: 'PAWS',
    items: [
      { h: 'P – skausmas' },
      { t: 'Gali kovoti – kovinių žaizdų vaistų paketas (CWMP)', k: true, sk: 24, s: ['Paracetamolis 1000–1300 mg kas 8 val.', 'Meloksikamas 15 mg kartą per parą', 'Suzetriginas 100 mg, po to 50 mg kas 12 val.'] },
      { t: 'Negali kovoti – CWMP (jei dar negavo) ir ketaminas', g: 'CMC', sk: 25, r: '#/vaistas/ketaminas', s: ['Prieš ketaminą – nuginkluoti, AVPU įrašyti į kortelę'] },
      { t: 'Pykinimas ar vėmimas – ondansetronas 4 mg', g: 'CMC', r: '#/vaistas/ondansetronas' },
      { h: 'A – antibiotikai' },
      { t: 'Atvira kovinė žaizda – antibiotikas', k: true, sk: 26, s: ['Gali nuryti – cefadroksilis 1 g per burną', 'Negali nuryti – ceftriaksonas 2 g IV / IO / IM (CMC)'] },
      { h: 'W – žaizdos ir nudegimai' },
      { t: 'Apžiūrėkite ir sutvarstykite visas žaizdas; ieškokite papildomų', sk: 27 },
      { t: 'Nudegimai: plotas devynių taisykle, sausi sterilūs tvarsčiai, šildymas', sk: 28, s: ['> 20 % – skysčiai IV / IO (CMC)'] },
      { h: 'S – įtvėrimas' },
      { t: 'Įtverkite lūžius ir patikrinkite distalinį pulsą', sk: 29 },
      { h: 'Gaivinimas' },
      { t: 'Sprogimo ar penetruojanti trauma be pulso, kvėpavimo ir kitų gyvybės požymių – gaivinimas nepradedamas', sk: 35 },
      { t: 'Liemens trauma ar politrauma be pulso ir kvėpavimo – prieš nutraukiant pagalbą abipusė NDC', sk: 35 }
    ]
  },
  'tfc-evak': {
    title: 'TFC: ryšys, dokumentai, pasiruošimas evakuacijai', short: 'Evakuacija',
    items: [
      { t: 'Praneškite vadui: sužeistųjų būklė ir evakuacijos poreikis', k: true },
      { t: '9 eilučių MEDEVAC prašymas', k: true, sk: 32, r: '#/9line' },
      { t: 'Užpildykite nukentėjusiojo kortelę (DD 1380)', k: true, sk: 31 },
      { t: 'Paruoškite MIST evakuacijos medikui', sk: 32, r: '#/mist' },
      { t: 'Pasiruošimas evakuacijai', k: true, sk: 33, s: ['Kortelė pritvirtinta prie sužeistojo', 'Tvarsčių galai, hipotermijos apvalkalas ir diržai pritvirtinti', 'Neštuvų diržai; ilgai evakuacijai – paminkštinimas'] },
      { t: 'Nurodymai vaikštantiems sužeistiesiems' },
      { t: 'Sustatykite sužeistuosius pagal SOP ir užtikrinkite evakuacijos taško saugą' }
    ]
  },

  // ───────── TACEVAC ─────────
  'tac-perimimas': {
    title: 'TACEVAC: perėmimas', short: 'Perėmimas',
    intro: 'Taktinis padalinys saugo evakuacijos tašką ir sustato sužeistuosius; evakuacijos komanda juos perima, pakrauna ir pritvirtina.',
    items: [
      { t: 'Evakuacijos taškas saugus', k: true },
      { t: 'Išklausykite perdavimą: stabilus ar nestabilus, sužalojimai, suteiktas gydymas (MIST)', k: true, sk: 34 },
      { t: 'Gaukite nukentėjusiojo kortelę (DD 1380) ir sutikrinkite su MIST' },
      { t: 'Ginklai iškrauti, sprogmenų nėra; sutrikusios sąmonės sužeistasis nuginkluotas' },
      { t: 'Pakraukite ir pritvirtinkite pagal platformos konfigūraciją ir saugos reikalavimus', k: true }
    ]
  },
  'tac-march': {
    title: 'TACEVAC: pakartotinis vertinimas (MARCH)', short: 'MARCH',
    intro: 'Kiekvieną sužeistąjį, visus sužalojimus ir visas ankstesnes intervencijas įvertinkite iš naujo.',
    items: [
      { t: 'M: turniketai (laikas, veiksmingumas), tvarsčiai; nėra naujo kraujavimo', k: true, sk: 8 },
      { t: 'A: kvėpavimo takai laisvi; be sąmonės – šoninė padėtis', k: true },
      { t: 'Intubacija vietoj krikotiroidotomijos – tik apmokytam', g: 'CPP' },
      { t: 'R: krūtinės lipdukai laikosi, dusulys nedidėja (įtampos pneumotoraksas – NDC)', k: true, sk: 16 },
      { t: 'Deguonis: žemas SpO₂, be sąmonės, galvos trauma (SpO₂ ≥ 92 %), šokas, skrydis aukštyje, dūmų įkvėpimas', g: 'CMC' },
      { t: 'C: radialinis pulsas ir sąmonė; šokas – kraujas pagal TFC', k: true, sk: 17 },
      { t: 'H: hipotermijos apvalkalas sandarus ir sausas; saugokite nuo vėjo ir kritulių', k: true, sk: 21 },
      { t: 'Galvos trauma: SpO₂ ≥ 92 %, sAKS > 100 mm Hg; operacija – per 5 val.', sk: 22 },
      { t: 'P · A · W · S: skausmas, antibiotikai, žaizdos, įtvarai – kaip TFC' }
    ]
  },
  'tac-transport': {
    title: 'TACEVAC: pervežimo metu', short: 'Pervežimas',
    items: [
      { t: 'Kas 5–10 min ir po kiekvieno perkėlimo – pakartotinis MARCH', k: true, sk: 30 },
      { t: 'Rodikliai su laiku – į kortelę ir MIST', r: '#/mist' },
      { t: 'Būklė blogėja – informuokite priimančią grandį ir vadą, patikslinkite skubumą' },
      { t: 'Liemens trauma ar politrauma be pulso ir kvėpavimo – abipusė NDC', sk: 35 },
      { t: 'Gaivinimas – tik jei nėra mirtinų sužalojimų, chirurginė pagalba greitai pasiekiama ir tai netrukdo kitiems; jei yra medikas – sprendžia jis', sk: 35 },
      { t: 'Iš anksto praneškite priimančiai grandžiai: sužeistųjų skaičius, būklė, MIST' }
    ]
  },
  'tac-perdavimas': {
    title: 'TACEVAC: perdavimas', short: 'Perdavimas',
    items: [
      { t: 'Perduokite tiesiogiai priimančiam medikui', k: true, sk: 34 },
      { t: 'MIST: mechanizmas ir laikas, sužalojimai, simptomai ir rodikliai (su pokyčiais), gydymas', k: true, r: '#/mist' },
      { t: 'Kas tęstina: turniketo laikas, paskutinė vaistų dozė, alergijos' },
      { t: 'Perduokite nukentėjusiojo kortelę (DD 1380)' },
      { t: 'Atsakykite į klausimus prieš išvykdami' },
      { t: 'Po užduoties – aptarimas (AAR) ir įrangos papildymas' }
    ]
  }
};

// ───────── MOKYMOSI PUSLAPIAI ─────────
E.puslapiai = {
  pagrindai: {
    title: 'TCCC pagrindai: tikslai, fazės, MARCH PAWS', sub: 'Kas yra TCCC ir kodėl pagalba teikiama būtent taip',
    html:
      '<p>Taktinė kovinė sužeistųjų priežiūra (angl. <i>Tactical Combat Casualty Care</i>, TCCC) – JAV gynybos departamento sukurtos ir nuolat atnaujinamos gairės, kaip teikti pagalbą sužeistajam kovos sąlygomis. Jas rengia TCCC komitetas (CoTCCC); šioje programėlėje remiamasi <b>2026 m. gegužės 1 d.</b> redakcija.</p>' +
      '<h3>Trys TCCC tikslai</h3><ul><li>Gydyti sužeistąjį.</li><li>Išvengti papildomų sužeistųjų.</li><li>Įvykdyti užduotį.</li></ul>' +
      fig('cls1__module1-principles-and-application-of-tccc-en-12', 'Trys TCCC tikslai: gydyti sužeistąjį, išvengti papildomų sužeistųjų, įvykdyti užduotį') +
      '<h3>Ko siekiama išvengti</h3><p>Dažniausios išvengiamos mirties mūšio lauke priežastys: kraujavimas iš galūnių, kraujavimas iš jungties vietų (kaklas, pažastys, kirkšnys), neužveržiamas kraujavimas liemenyje, įtampos pneumotoraksas ir kvėpavimo takų sutrikimai. Todėl pirmiausia stabdomas kraujavimas.</p>' +
      fig('cls1__module1-principles-and-application-of-tccc-en-11', 'TCCC dėmesys – išvengiamos mirties priežastys: kraujavimas, įtampos pneumotoraksas, kvėpavimo takai') +
      '<h3>Trys fazės</h3><div class="tw"><table><tr><th>Fazė</th><th>Situacija</th><th>Pagalba</th></tr>' +
      '<tr><td><b>CUF</b> – pagalba apšaudymo metu</td><td>Efektyvi priešo ugnis</td><td>Ugnis ir priedanga, turniketas, perkėlimas į priedangą</td></tr>' +
      '<tr><td><b>TFC</b> – taktinė lauko pagalba</td><td>Tiesioginės ugnies nebėra, grėsmė išlieka</td><td>Nuosekli pagalba pagal MARCH PAWS</td></tr>' +
      '<tr><td><b>TACEVAC</b> – taktinė evakuacijos pagalba</td><td>Sužeistasis gabenamas</td><td>Tokia pati kaip TFC + deguonis, stebėjimas, perdavimas</td></tr></table></div>' +
      '<p>Fazės keičiasi pagal situaciją: didėjant grėsmei pagalbos apimtis mažėja, ir atvirkščiai.</p>' +
      fig('cls1__module1-principles-and-application-of-tccc-en-14', 'Trys TCCC fazės: CUF, TFC ir TACEVAC') +
      '<h3>MARCH PAWS</h3><p>Santrumpa padeda įsiminti pagalbos eiliškumą taktinės lauko pagalbos metu:</p><ul>' +
      '<li><b>M</b> – masyvus kraujavimas</li><li><b>A</b> – kvėpavimo takai</li><li><b>R</b> – kvėpavimas</li><li><b>C</b> – kraujotaka</li><li><b>H</b> – hipotermija ir galvos trauma</li>' +
      '<li><b>P</b> – skausmas</li><li><b>A</b> – antibiotikai</li><li><b>W</b> – žaizdos</li><li><b>S</b> – įtvėrimas</li></ul>' +
      '<p>MARCH – gyvybei pavojingos būklės, PAWS – gydoma tik sutvarkius MARCH.</p>' +
      fig('cls4__module-4-principles-and-application-of-tactical-field-care-en-10', 'MARCH PAWS: gyvybei pavojingos būklės ir tai, kas sprendžiama po jų') +
      '<h3>Lygiai</h3><div class="tw"><table><tr><th>Lygis</th><th>Kas</th><th>Ką daro (pavyzdžiai)</th></tr>' +
      '<tr><td><b>ASM</b></td><td>Visi kariai</td><td>Turniketas, tamponavimas, spaudžiamasis tvarstis, kvėpavimo takų atvėrimas, vilkimas, greita apžiūra</td></tr>' +
      '<tr><td><b>CLS</b></td><td>Kovos gelbėtojas (ne medikas)</td><td>+ jungties vietų kraujavimas, šoninė padėtis, NPA, ambu maišas, krūtinės lipdukas, adatos dekompresija, turniketo konversija (≤ 2 val.), hipotermija, akies skydelis, CWMP, kortelė, 9-Line, neštuvai</td></tr>' +
      '<tr><td><b>CMC</b></td><td>Kovos medikas</td><td>+ IV / IO, TXA, kraujas, ketaminas, krikotiroidotomija, dubens diržas, IV antibiotikai</td></tr>' +
      '<tr><td><b>CPP</b></td><td>Kovos paramedikas / gydytojas</td><td>+ procedūrinė sedacija, intubacija, pirštinė torakostomija</td></tr></table></div>' +
      '<p class="muted">Programėlėje CMC ir CPP veiksmai pažymėti. Nustatymuose galite rodyti tik CLS veiksmus.</p>' +
      '<h3>CASEVAC ir MEDEVAC</h3><p><b>CASEVAC</b> – sužeistųjų gabenimas ne medicininiu transportu (be medicinos personalo ar įrangos). <b>MEDEVAC</b> – specializuota medicininė evakuacija su medicinos personalu ir įranga. TACEVAC apima abu.</p>',
    saltinis: 'TCCC gairės 2026-05-01; JTS CLS kursas (1 ir 4 moduliai); M. Grinevičiaus TCCC kursas'
  },
  cuf: {
    title: 'Pagalba apšaudymo metu (CUF)', sub: 'Kodėl planas yra būtent toks',
    html:
      '<p>Apšaudymo metu sužeistasis ir gelbėtojas bet kurią akimirką gali būti sužeisti ar nukauti, o medicininės priemonės ribotos. Todėl CUF fazėje atliekama tik tai, kas būtina gyvybei išsaugoti.</p>' +
      fig('cls3__module3-care-under-fire-en-05', 'CUF: atsakykite į ugnį, sužeistasis kovoja ir padeda sau, tik tada – pagalba') +
      '<h3>Veiksmų eiga</h3><ol><li>Atsakykite į ugnį ir pasislėpkite priedangoje – ugnies pranašumas yra geriausia apsauga.</li><li>Paliepkite sužeistajam toliau kovoti, jei gali, pereiti į priedangą ir padėti sau.</li><li>Neleiskite sužeistajam patirti papildomų sužalojimų.</li><li>Iš degančios technikos ar pastato ištraukite ir sustabdykite degimą.</li><li>Gyvybei pavojingas galūnės kraujavimas – turniketas „aukštai ir tvirtai“ ant uniformos, jei leidžia taktinė situacija.</li><li>Perkelkite sužeistąjį į priedangą.</li><li>Kvėpavimo takų valdymą atidėkite iki TFC.</li></ol>' +
      fig('cls3__module3-care-under-fire-en-13', 'Gyvybei pavojingas kraujavimas: pulsuojantis ar telkšantis kraujas, permirkę drabužiai, amputacija') +
      fig('cls3__module3-care-under-fire-en-14', 'Nukraujuoti iš didelės arterijos galima vos per 3 minutes') +
      '<h3>Kodėl turniketas „aukštai ir tvirtai“</h3><p>Apšaudymo metu nėra laiko atidengti ir apžiūrėti žaizdą, todėl turniketas dedamas ant uniformos kuo aukščiau ant sužeistos galūnės. TFC fazėje jis peržiūrimas ir, jei reikia, pakeičiamas nauju 5–7,5 cm virš žaizdos tiesiai ant odos.</p>' +
      fig('cls3__module3-care-under-fire-en-10', 'CUF: turniketas „aukštai ir tvirtai“ ir sužeistojo perkėlimas') +
      '<h3>Perkėlimas</h3><p>Pasirinkite perkėlimo būdą pagal situaciją, sužeistojo būklę ir gelbėtojų skaičių. Apšaudymo metu stuburo traumos rizika nėra pagrindinis rūpestis – svarbiausia greitai pasiekti priedangą.</p>' +
      fig('cls3__module3-care-under-fire-en-26', 'Vieno žmogaus vilkimas ir nešimas') +
      fig('cls3__module3-care-under-fire-en-28', 'Dviejų žmonių vilkimas ir nešimas'),
    saltinis: 'TCCC gairės 2026-05-01 (CUF); JTS CLS kursas (3 modulis); M. Grinevičiaus TCCC kursas („Pagalbos apšaudymo metu veiksmų planas“)'
  },
  tfc: {
    title: 'Taktinė lauko pagalba (TFC)', sub: '20 TCCC 2026 žingsnių trumpai',
    html:
      '<p>TFC prasideda, kai tiesioginės priešo ugnies nebėra. Grėsmė išlieka, todėl situacinis budrumas – privalomas, o priemonės ribotos tuo, ką turite su savimi.</p>' +
      fig('cls4__module-4-principles-and-application-of-tactical-field-care-en-06', 'TFC fazė: tiesioginės ugnies nebėra, bet būklė gali vėl tapti CUF') +
      fig('cls4__module-4-principles-and-application-of-tactical-field-care-en-07', 'Saugumas TFC metu: perimetras, situacinis budrumas, sutrikusios sąmonės sužeistojo nuginklavimas') +
      '<h3>Eiga (TCCC 2026)</h3><ol>' +
      '<li>Perimetro sauga, situacinis budrumas.</li><li>Rūšiavimas, jei sužeistųjų keli; sutrikusios sąmonės sužeistąjį nuginkluoti.</li>' +
      '<li><b>M</b> – visi kraujavimo šaltiniai: turniketas ant odos, tamponavimas, jungties vietos; įvertinti šoką.</li>' +
      '<li><b>A</b> – kvėpavimo takai: padėtis, šoninė padėtis, atsiurbimas, krikotiroidotomija (CMC).</li>' +
      '<li><b>R</b> – krūtinės lipdukas, įtampos pneumotoraksas ir NDC, SpO₂, ventiliacija.</li>' +
      '<li><b>C</b> – dubens diržas, turniketų peržiūra ir konversija, IV / IO, TXA, kraujas ir kalcis.</li>' +
      '<li><b>H</b> – hipotermijos prevencija.</li><li>Galvos smegenų trauma.</li><li>Penetruojanti akies trauma.</li><li>Stebėjimas.</li>' +
      '<li><b>P</b> – skausmo malšinimas.</li><li><b>A</b> – antibiotikai.</li><li><b>W</b> – žaizdos.</li><li>Papildomų žaizdų paieška.</li><li>Nudegimai.</li>' +
      '<li><b>S</b> – įtvėrimas ir pulso patikra.</li><li>Gaivinimas.</li><li>Ryšys: sužeistasis, vadas, evakuacijos sistema.</li><li>Dokumentavimas (DD 1380).</li><li>Pasiruošimas evakuacijai.</li></ol>' +
      '<h3>Keli sužeistieji</h3><p>Pirmiausia gydomi tie, kurių būklė labiausiai kelia grėsmę gyvybei: masyvus kraujavimas, penetruojanti liemens trauma, kvėpavimo takų sutrikimas, kvėpavimo distresas, sutrikusi sąmonė.</p>' +
      fig('cls4__module-4-principles-and-application-of-tactical-field-care-en-13', 'Rūšiavimas: masyvus kraujavimas, penetruojanti liemens trauma, kvėpavimo takai, kvėpavimas, sąmonė') +
      fig('CLS5__module-5-tactical-trauma-assessment-en-09', 'Kraujo apčiuopa: greitas patikrinimas nuo galvos iki kojų – kaklas, pažastys, kirkšnys, galūnės, liemuo ir nugara'),
    saltinis: 'TCCC gairės 2026-05-01 (TFC 1–20); JTS CLS kursas (4 ir 5 moduliai)'
  },
  tacevac: {
    title: 'Taktinė evakuacijos pagalba (TACEVAC)', sub: 'MEDEVAC komandos darbas nuo perėmimo iki perdavimo',
    html:
      '<p>TACEVAC – trečioji TCCC fazė: sužeistasis gabenamas į medicinos įstaigą ar stabilizavimo punktą. Medicininės pagalbos principai tie patys kaip TFC, tačiau atsiranda daugiau priemonių (deguonis, monitoriai, kraujas) ir daugiau pavojų (triukšmas, vibracija, šaltis, sraigtasparnio oro srautas, perkėlimai).</p>' +
      fig('CLS5__module-5-tactical-trauma-assessment-en-26', 'TACEVAC: stebėjimas, MIST, 9 eilučių prašymas ir pasiruošimas evakuacijai') +
      '<h3>Perėmimas</h3><ul><li>Taktinis padalinys užtikrina evakuacijos taško saugumą ir sustato sužeistuosius.</li><li>Minimali perduodama informacija: stabilus ar nestabilus, nustatyti sužalojimai, suteiktas gydymas.</li><li>Evakuacijos komanda pakrauna ir pritvirtina sužeistuosius pagal platformos konfigūraciją ir saugos reikalavimus.</li><li>Evakuacijos medicinos personalas iš naujo įvertina visus sužeistuosius, sužalojimus ir intervencijas.</li></ul>' +
      '<h3>Kas kitaip nei TFC (TCCC 2026)</h3><ul>' +
      '<li><b>Kvėpavimo takai:</b> apmokytas specialistas gali intubuoti vietoj krikotiroidotomijos.</li>' +
      '<li><b>Deguonis:</b> daugumai sužeistųjų nereikia; naudingas esant žemam SpO₂, oksigenaciją bloginantiems sužalojimams, sąmonės netekimui, galvos traumai (SpO₂ ≥ 92 %), šokui, skrydžiui aukštyje, dūmų įkvėpimui.</li>' +
      '<li><b>Gaivinimas:</b> liemens trauma ar politrauma be pulso ir kvėpavimo – abipusė NDC; gaivinti galima, jei nėra akivaizdžiai mirtinų sužalojimų ir chirurginė pagalba bus pasiekta greitai, bet tai negali trukdyti užduočiai ar kitų sužeistųjų gydymui.</li>' +
      '<li><b>Hipotermija:</b> evakuacijos priemonėje saugokite nuo vėjo ir kritulių.</li></ul>' +
      '<h3>Pervežimo metu</h3><p>Po kiekvieno perkėlimo (ant neštuvų, į transportą, iš jo) ir kas 5–10 min pakartokite MARCH: tvarsčiai ir turniketai pasislenka, šokas ir įtampos pneumotoraksas gali išsivystyti kelyje. Rodiklius su laiku rašykite į kortelę.</p>' +
      fig('CLS19__module-19-pre-evacuation-procedures-comms-and-doc-en-07', 'Evakuacija: CASEVAC – ne medicininiu transportu, MEDEVAC – su medicinos personalu ir įranga') +
      '<h3>Perdavimas</h3><p>Perduokite tiesiogiai priimančiam medikui: MIST, pokyčiai kelionės metu, kas tęstina (turniketo laikas, paskutinė vaistų dozė, alergijos), nukentėjusiojo kortelė. Prieš išvykdami atsakykite į klausimus.</p>',
    saltinis: 'TCCC gairės 2026-05-01 (TACEVAC 1–18); JTS CLS kursas (5, 19, 20 moduliai); M. Grinevičiaus TCCC kursas („Taktinė evakuacijos pagalba“)'
  },
  devynios: {
    title: '9 eilučių MEDEVAC prašymas ir MIST', sub: 'Ką reiškia kiekviena eilutė ir kaip nustatyti skubumą',
    html:
      '<p>9 eilučių prašymas (9-Line MEDEVAC) – standartinis radijo pranešimas evakuacijos priemonei iškviesti. Jis skirtas evakuacijos koordinatoriams, o ne medikams. Pirmų 5 eilučių pakanka priemonei išsiųsti; 6–9 eilutes galima perduoti jai jau judant. Prieš kviesdami surinkite visą informaciją ir laikykitės ryšio saugumo bei kodų pagal operacijos planą ir SOP.</p>' +
      '<p><a class="btn" href="#/9line">Atidaryti 9-Line formą</a></p>' +
      fig('CLS19__module-19-pre-evacuation-procedures-comms-and-doc-en-09', '9 eilučių prašymas: 1–5 eilutės (būtinos priemonei išsiųsti)') +
      fig('CLS19__module-19-pre-evacuation-procedures-comms-and-doc-en-10', '9 eilučių prašymas: 6–9 eilutės') +
      '<h3>Eilutės</h3><div class="tw"><table><tr><th>Eil.</th><th>Turinys</th><th>Kodai</th></tr>' +
      '<tr><td>1</td><td>Paėmimo vietos koordinatės</td><td>8 skaitmenų tinklelio koordinatė (MGRS)</td></tr>' +
      '<tr><td>2</td><td>Paėmimo vietos radijo dažnis, šaukinys ir priesaga</td><td>–</td></tr>' +
      '<tr><td>3</td><td>Sužeistųjų skaičius pagal skubumą</td><td>A skubi, B skubi chirurginė, C prioritetinė, D įprastinė, E patogumo; tarp kategorijų – „break“</td></tr>' +
      '<tr><td>4</td><td>Specialioji įranga</td><td>A nereikia, B gervė, C ištraukimo įranga, D plaučių ventiliatorius</td></tr>' +
      '<tr><td>5</td><td>Sužeistieji pagal tipą</td><td>L – neštuvuose, A – vaikštantys (pvz., L2 break A1)</td></tr>' +
      '<tr><td>6</td><td>Karo metu – paėmimo vietos saugumas; taikos metu – sužalojimų skaičius ir tipas</td><td>N priešo nėra, P galimas priešas, E priešas yra – artėti atsargiai, X priešas yra – reikia ginkluotos palydos</td></tr>' +
      '<tr><td>7</td><td>Vietos žymėjimas</td><td>A skydai, B pirotechnika, C dūmai, D nežymima, E kita</td></tr>' +
      '<tr><td>8</td><td>Sužeistųjų pilietybė ir statusas</td><td>A savos ir sąjungininkų (koalicijos) pajėgos, B savos šalies ir sąjungininkų civiliai, C ne koalicijos kariai ar saugumo pajėgos, D ne koalicijos civiliai, E priešo kariai ar sulaikytieji</td></tr>' +
      '<tr><td>9</td><td>Karo metu – CBRN užterštumas; taikos metu – vietovės aprašymas</td><td>N branduolinis, B biologinis, C cheminis (R radiologinis – jei numato SOP)</td></tr></table></div>' +
      '<p class="muted">8 eilutės kodai JTS kortelėje apibrėžti JAV kariuomenei (A – JAV kariai, B – JAV civiliai, C – ne JAV kariai, D – ne JAV civiliai, E – karo belaisviai); čia pateikta koalicijos versija. Vadovaukitės savo vieneto ir NATO SOP.</p>' +
      '<h3>Evakuacijos skubumas (3 eilutė)</h3>' +
      fig('CLS19__module-19-pre-evacuation-procedures-comms-and-doc-en-12', 'Sužeistųjų kategorijos (JTS CLS): skubi, skubi chirurginė, prioritetinė, įprastinė, patogumo') +
      '<div class="tw"><table><tr><th>Kategorija</th><th>JTS CLS terminas</th><th>Pavyzdžiai (JTS)</th></tr>' +
      '<tr><td><b>A – skubi</b> (Urgent)</td><td>&lt; 2 val. – gyvybei, galūnei ar regėjimui išsaugoti</td><td>Turniketai, sustabdytas kraujavimas, galvos smegenų trauma</td></tr>' +
      '<tr><td><b>B – skubi chirurginė</b> (Urgent surgical)</td><td>&lt; 2 val. iki artimiausio chirurgijos padalinio</td><td>Adatos dekompresija, krikotiroidotomija, didelis vidinis kraujavimas, sunki galvos trauma</td></tr>' +
      '<tr><td><b>C – prioritetinė</b> (Priority)</td><td>&lt; 4 val. arba būklė gali pablogėti iki skubios</td><td>Kompensuotas šokas, lūžis su išnykusiu distaliniu pulsu</td></tr>' +
      '<tr><td><b>D – įprastinė</b> (Routine)</td><td>&lt; 24 val.</td><td>Nubrozdinimai, smulkūs lūžiai, nušalimai</td></tr>' +
      '<tr><td><b>E – patogumo</b> (Convenience)</td><td>Mediciniškai nebūtina</td><td>Administracinis perkėlimas</td></tr></table></div>' +
      '<p class="muted">Terminai priklauso nuo doktrinos ir SOP: JTS CLS (2020) nurodo &lt; 2 val., kai kurios JAV ir NATO procedūros skubiai kategorijai numato 1 val. ar 90 min. Vadovaukitės savo vieneto SOP.</p>' +
      '<p><b>Pervertinimas</b> – polinkis priskirti per aukštą kategoriją. Tai atima priemones iš labiausiai jų reikalingų sužeistųjų; kategoriją tikslinkite keičiantis būklei.</p>' +
      fig('CLS19__module-19-pre-evacuation-procedures-comms-and-doc-en-13', 'Pervertinimas: per aukšta kategorija atima evakuacijos priemones iš kitų') +
      '<h3>MIST</h3><ul><li><b>M</b> – mechanizmas ir sužeidimo laikas (jei žinomas)</li><li><b>I</b> – sužalojimai (sunkiausi pirmiausia)</li><li><b>S</b> – simptomai ir gyvybiniai rodikliai</li><li><b>T</b> – suteiktas gydymas</li></ul>' +
      '<p>MIST sudaromas iš nukentėjusiojo kortelės (DD 1380) ir perduodamas evakuacijos medikams ar priimančiai grandžiai. <a href="#/mist">Atidaryti MIST formą</a>.</p>',
    saltinis: 'JTS CLS kursas (19 modulis, įgūdžio kortelė 19.2, 2020); TCCC gairės 2026-05-01 (TFC 18)'
  },
  nestuvai: {
    title: 'Neštuvai ir pasiruošimas evakuacijai', sub: 'Kaip supakuoti sužeistąjį ir saugiai jį nešti',
    html:
      '<p>Prieš evakuaciją sužeistasis „supakuojamas“: kortelė pritvirtinta, laisvi galai sutvirtinti, hipotermijos apvalkalas sandarus, neštuvų diržai užsegti. Kiekvienas pakėlimas gali pajudinti tvarsčius ir turniketus, todėl po kiekvieno perkėlimo – trumpas pakartotinis vertinimas.</p>' +
      fig('cls20__module-20-evacuation-procedures-en-05', 'Svarbiausi veiksmai: pritvirtinti daiktus, paruošti neštuvus ir įrangą, supakuoti sužeistąjį') +
      fig('cls20__module-20-evacuation-procedures-en-06', 'Sužeistojo įranga: ginklą iškrauti ir padaryti saugų, sprogmenų su sužeistuoju nesiųsti') +
      fig('cls20__module-20-evacuation-procedures-en-08', 'Neštuvai palengvina judėjimą; sužeistasis turi būti pritvirtintas prieš judant') +
      fig('cls20__module-20-evacuation-procedures-en-09', 'Neštuvų parinkimas: lengvi, kompaktiški, tinkami vietovei ir evakuacijos priemonei') +
      fig('cls20__module-20-evacuation-procedures-en-10', 'Supakuokite sužeistąjį: sutvirtinkite tvarsčių galus, antklodes ir hipotermijos priemones, pritvirtinkite prie neštuvų') +
      '<h3>Nešimas</h3><ul><li>Nešimui vadovauja vienas karys – keliama ir nuleidžiama tik jo komanda.</li><li>Paprastai nešama kojomis į priekį, išskyrus kylant į kalną ar laiptais.</li><li>Neštuvus laikykite kuo horizontaliau, ypač kertant kliūtis.</li><li>Galiniai nešėjai prisitaiko prie priekinių; judėkite švelniai ir neskubėdami.</li><li>Reguliariai sustokite, pasikeiskite pozicijomis ir patikrinkite sužeistąjį.</li></ul>' +
      fig('cls20__module-20-evacuation-procedures-en-11', 'Įtarus stuburo traumą: kuo tiesesnis stuburas, tinkami neštuvai') +
      fig('cls20__module-20-evacuation-procedures-en-12', 'Vaikštantys sužeistieji: nurodymai, savipagalba, veskite dezorientuotus') +
      fig('cls20__module-20-evacuation-procedures-en-13', 'Sužeistųjų sustatymas evakuacijai pagal SOP ir evakuacijos taško saugumas') +
      fig('cls20__module-20-evacuation-procedures-en-14', 'Medicininis aptarimas po užduoties (AAR)'),
    saltinis: 'TCCC gairės 2026-05-01 (TFC 20); JTS CLS kursas (20 modulis); M. Grinevičiaus TCCC kursas („Neštuvai“)'
  },
  vaistai26: {
    title: 'TCCC 2026 vaistai', sub: 'Kas ir kada – trumpai',
    html:
      '<p>TCCC 2026 gairėse vaistų sąrašas sutrumpėjo: nebeliko fentanilio ir morfino, kovinių žaizdų vaistų pakete (CWMP) nebėra antibiotiko – atsirado suzetriginas, o geriamasis antibiotikas – cefadroksilis. Dozės – skiltyje <a href="#/vaistai">Vaistai</a>.</p>' +
      '<div class="tw"><table><tr><th>Kada</th><th>Vaistas</th><th>Lygis</th></tr>' +
      '<tr><td>Skausmas, gali kovoti</td><td>CWMP: paracetamolis 1000–1300 mg kas 8 val. + meloksikamas 15 mg kartą per parą + suzetriginas 100 mg, po to 50 mg kas 12 val.</td><td>CLS (sau ar draugui)</td></tr>' +
      '<tr><td>Skausmas, negali kovoti</td><td>CWMP + ketaminas 100 mg IM arba 50 mg IN, arba 25 mg (0,2–0,3 mg/kg) IV / IO; arba esketaminas 14 ar 28 mg IN</td><td>CMC</td></tr>' +
      '<tr><td>Pykinimas</td><td>Ondansetronas 4 mg kas 8 val.</td><td>CMC</td></tr>' +
      '<tr><td>Atvira kovinė žaizda</td><td>Cefadroksilis 1 g per burną (alt. cefaleksinas 500 mg kas 6 val.); negali nuryti – ceftriaksonas 2 g IV / IO / IM</td><td>CLS (per burną) / CMC</td></tr>' +
      '<tr><td>Tikėtina transfuzija, galvos trauma</td><td>TXA 2 g lėtai IV / IO, ≤ 3 val. nuo sužalojimo</td><td>CMC</td></tr>' +
      '<tr><td>Po pirmo kraujo vieneto</td><td>Kalcis: 30 ml 10 % kalcio gliukonato (ne 10 ml) arba 10 ml 10 % kalcio chlorido</td><td>CMC</td></tr>' +
      '<tr><td>Smegenų išvaržos požymiai</td><td>Hipertoninis NaCl 250 ml 3 % ar 5 % per ≥ 10 min</td><td>CMC</td></tr></table></div>' +
      '<p class="muted">Vaistai skiriami tik pagal kompetenciją, vieneto protokolus ir mediko nurodymus.</p>',
    saltinis: 'TCCC gairės 2026-05-01 (TFC 6, 8, 11, 12)'
  }
};

// ───────── MOKYMOSI TEMOS ─────────
E.temos = [
  { id: 'pagrindai', zenklas: 'TCCC', pav: 'TCCC pagrindai', sub: 'Tikslai, fazės, MARCH PAWS, lygiai', puslapiai: ['pagrindai', 'tfc'], igudziai: [1, 36], sarasai: ['tfc-s'] },
  { id: 'cuf', zenklas: 'CUF', cls: 'fCUF', pav: 'Pagalba apšaudymo metu', sub: 'Turniketas sau ir draugui, ištraukimas', puslapiai: ['cuf'], igudziai: [4, 5, 2, 3], sarasai: ['cuf'] },
  { id: 'm', zenklas: 'M', pav: 'Masyvus kraujavimas', sub: 'Turniketas, tamponavimas, jungties vietos, konversija', igudziai: [5, 6, 7, 8], sarasai: ['tfc-m'] },
  { id: 'ar', zenklas: 'A·R', pav: 'Kvėpavimo takai ir kvėpavimas', sub: 'Padėtis, NPA, ambu maišas, krūtinės lipdukas, NDC', igudziai: [9, 10, 11, 12, 13, 14, 15, 16], sarasai: ['tfc-a', 'tfc-r'] },
  { id: 'c', zenklas: 'C', pav: 'Kraujotaka ir šokas', sub: 'Šoko atpažinimas, dubuo, IV / IO, TXA, kraujas', igudziai: [17, 18, 19, 20, 35], sarasai: ['tfc-c'], vaistai: ['txa', 'kalcis'] },
  { id: 'h', zenklas: 'H', pav: 'Hipotermija, galva, akys', sub: 'Šildymas, galvos smegenų trauma, akies skydelis', igudziai: [21, 22, 23], sarasai: ['tfc-h'], vaistai: ['nacl-hipert'] },
  { id: 'paws', zenklas: 'PAWS', pav: 'Vaistai, žaizdos, nudegimai, lūžiai', sub: 'CWMP, ketaminas, antibiotikai, žaizdos, įtvarai', puslapiai: ['vaistai26'], igudziai: [24, 25, 26, 27, 28, 29], sarasai: ['tfc-paws'], vaistai: ['paracetamolis', 'meloksikamas', 'suzetriginas', 'ketaminas', 'cefadroksilis', 'ceftriaksonas'] },
  { id: 'tacevac', zenklas: 'EVAC', cls: 'fTAC', pav: 'MEDEVAC ir TACEVAC', sub: '9-Line, MIST, kortelė, neštuvai, perdavimas', puslapiai: ['tacevac', 'devynios', 'nestuvai'], igudziai: [32, 31, 33, 34, 30, 36], sarasai: ['tfc-evak', 'tac-perimimas', 'tac-march', 'tac-transport', 'tac-perdavimas'] }
];
})();
