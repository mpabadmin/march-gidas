// March gidas – TRENIRUOČIŲ SCENARIJAI (tools.js SC). Kiekvienas atsakymas paremtas gido turiniu (ref – nuorodos į įgūdžius, sąrašus, vaistus).
// Visi scenarijai – kariniai (kariai, kovos veiksmai, pratybos, karinė technika, Role 1).
// Laukai: id, pav, tema, lygis (CLS | CMC), q: [{sit, gp (gyvybės požymiai), klaus, opt: [{t, ok}], why, ref}].
window.ETC = window.ETC || {};

window.ETC.scenarijai = [
 {
  "id": "m1",
  "pav": "Apšaudymas kelyje",
  "tema": "CUF",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Patrulis apšaudomas iš miško. Draugas krenta 10 m nuo jūsų, šlaunis kraujuoja srove. Priešo ugnis tęsiasi.",
    "gp": {},
    "klaus": "Ką darote pirmiausia?",
    "opt": [
     {
      "t": "Atsakote ugnimi ir pasislepiate priedangoje",
      "ok": true
     },
     {
      "t": "Iškart bėgate prie sužeistojo tamponuoti žaizdos",
      "ok": false
     },
     {
      "t": "Pradedate vertinti jo kvėpavimo takus",
      "ok": false
     }
    ],
    "why": "CUF metu geriausias „vaistas“ – ugnies pranašumas. Prie sužeistojo „mirties zonoje“ neikite, kol ugnis nenuslopinta; kvėpavimo takai atidedami iki TFC.",
    "ref": [
     "#/f/CUF",
     "#/p/cuf"
    ]
   },
   {
    "sit": "Ugnis prislopinta, bet apšaudymas tęsiasi. Prišliaužėte prie draugo: pats turniketo užsidėti negali, kraujavimo vieta ant šlaunies aiškiai matoma.",
    "gp": {
     "AVPU": "V"
    },
    "klaus": "Kur dedate turniketą?",
    "opt": [
     {
      "t": "„Aukštai ir tampriai“ – kirkšnyje, nors žaizda matoma",
      "ok": false
     },
     {
      "t": "Atidengę žaizdą, tiesiai ant odos 5–7,5 cm virš jos",
      "ok": false
     },
     {
      "t": "Ant uniformos, aiškiai virš kraujavimo vietos",
      "ok": true
     }
    ],
    "why": "CUF metu turniketas – ant uniformos aiškiai virš kraujavimo vietos. „Aukštai ir tampriai“ – tik kai vietos nematyti; ant odos 5–7,5 cm virš žaizdos – TFC metu.",
    "ref": [
     "#/igudis/5",
     "#/f/CUF"
    ]
   },
   {
    "sit": "Turniketas užveržtas, kraujavimas sustojo. Kito masyvaus kraujavimo nėra, apšaudymas dar vyksta.",
    "gp": {},
    "klaus": "Ką darote toliau?",
    "opt": [
     {
      "t": "Pildote kortelę (DD 1380) čia pat, ugnies zonoje",
      "ok": false
     },
     {
      "t": "Traukiate sužeistąjį į priedangą; laiką pažymite, kai saugu",
      "ok": true
     },
     {
      "t": "Įvedate NPA ir vertinate kvėpavimą",
      "ok": false
     }
    ],
    "why": "Sustabdę kraujavimą – iškart į priedangą (vilkimas ar nešimas). Turniketo laiką pažymėkite, kai saugu; kvėpavimo takų valdymas – TFC metu.",
    "ref": [
     "#/igudis/2",
     "#/f/CUF"
    ]
   }
  ]
 },
 {
  "id": "m2",
  "pav": "Sprogimas prie posto: TST",
  "tema": "Rūšiavimas",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Po sprogimo – 5 sužeistieji, jūs vienintelis CLS. Pirmasis vaikšto ir rodo nubrozdintą ranką.",
    "gp": {},
    "klaus": "Kaip jį surūšiuojate pagal TST?",
    "opt": [
     {
      "t": "P1 – sužeistas, todėl gydomas pirmas",
      "ok": false
     },
     {
      "t": "Vertinti nebereikia – sužalojimas lengvas",
      "ok": false
     },
     {
      "t": "P3 – nukreipiate į nurodytą vietą, vėliau įvertinsite",
      "ok": true
     }
    ],
    "why": "TST: vaikšto – P3 (gali palaukti). Vaikščiojančius nukreipkite į nurodytą vietą ir duokite nurodymus, bet vėliau įvertinkite ir juos.",
    "ref": [
     "#/tst",
     "#/igudis/36"
    ]
   },
   {
    "sit": "Antrasis guli, nevaikšto, masyvus kraujavimas iš šlaunies.",
    "gp": {},
    "klaus": "Kategorija ir veiksmai?",
    "opt": [
     {
      "t": "P1 – iškart turniketas, tada einate prie kito",
      "ok": true
     },
     {
      "t": "P2 – pirmiausia apžiūrite visus kitus",
      "ok": false
     },
     {
      "t": "P1 – liekate prie jo, kol atliksite visą MARCH PAWS",
      "ok": false
     }
    ],
    "why": "Masyvus kraujavimas – P1: iškart spaudimas, turniketas ar tamponavimas. Atlikite tik greitas gyvybę gelbstinčias intervencijas ir eikite prie kito – neužstrikite prie vieno.",
    "ref": [
     "#/tst",
     "#/igudis/36"
    ]
   },
   {
    "sit": "Trečiasis nevaikšto, masyvaus kraujavimo nėra, kalba aiškiai. Blauzda deformuota, penetruojančių sužalojimų nuo kaklo iki sėdmenų nėra.",
    "gp": {},
    "klaus": "Kokia TST kategorija?",
    "opt": [
     {
      "t": "P1 – nevaikšto, todėl neatidėliotina",
      "ok": false
     },
     {
      "t": "P2 – skubi",
      "ok": true
     },
     {
      "t": "P3 – gali palaukti",
      "ok": false
     }
    ],
    "why": "TST: nevaikšto → masyvaus kraujavimo nėra → kalba → penetruojančio sužalojimo nėra – P2. Rūšiavimą kartokite – būklė keičiasi.",
    "ref": [
     "#/tst"
    ]
   }
  ]
 },
 {
  "id": "m3",
  "pav": "Skeveldra kirkšnyje",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Taktinė lauko pagalba. Skeveldra kirkšnyje, kraujas teka srove. Galūnės turniketu šios vietos neužveršite.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "čiuopiamas"
    },
    "klaus": "Ką darote?",
    "opt": [
     {
      "t": "Iškart spaudžiate, tamponuojate hemostatiniu tvarsčiu, spaudžiate ≥ 3 min",
      "ok": true
     },
     {
      "t": "Hemostatinį tvarstį dedate ant paviršiaus ir apvyniojate",
      "ok": false
     },
     {
      "t": "Laukiate, kol kas nors paduos spaudimo įtaisą",
      "ok": false
     }
    ],
    "why": "Jungties vietos (kaklas, pažastis, kirkšnis) – tamponavimas hemostatiniu tvarsčiu tiesiai į šaltinį ir ≥ 3 min spaudimas. Marlė ant paviršiaus ir delsimas – dažnos klaidos.",
    "ref": [
     "#/igudis/7",
     "#/igudis/6",
     "#/f/TFC?t=1"
    ]
   },
   {
    "sit": "Praėjo 3 min. Pro hemostatinį tvarstį ir aplink jį vis dar sunkiasi kraujas.",
    "gp": {},
    "klaus": "Ką darote?",
    "opt": [
     {
      "t": "Ant viršaus dedate daugiau tvarsčio sluoksnių",
      "ok": false
     },
     {
      "t": "Atleidžiate spaudimą ir žiūrite, iš kur bėga",
      "ok": false
     },
     {
      "t": "Hemostatinį tvarstį išimate ir tamponuojate iš naujo",
      "ok": true
     }
    ],
    "why": "Kraujuojant pro hemostatinį tvarstį – jį išimkite ir tamponuokite iš naujo, tada vėl spauskite ≥ 3 min. Nauji sluoksniai ant viršaus ar atleistas spaudimas – klaidos.",
    "ref": [
     "#/igudis/6",
     "#/igudis/7"
    ]
   },
   {
    "sit": "Po pakartotinio tamponavimo kraujavimas sustojo. Komercinio jungties turniketo neturite.",
    "gp": {},
    "klaus": "Kaip CLS išlaiko spaudimą kirkšnyje?",
    "opt": [
     {
      "t": "Ant tampono – gertuvė (PDD), per ją turniketas aplink klubus",
      "ok": true
     },
     {
      "t": "Užtenka pleistro ant tampono – spaudimo nereikia",
      "ok": false
     },
     {
      "t": "Turniketą užveržiate ant šlaunies žemiau žaizdos",
      "ok": false
     }
    ],
    "why": "CLS kirkšniai – improvizuotas spaudimo įtaisas (pvz., gertuvė) ant tampono ir per jį turniketas aplink klubus. Komercinis jungties turniketas – CMC arba CLS, jei apmokytas ir jį turi.",
    "ref": [
     "#/igudis/7",
     "#/f/TFC?t=1"
    ]
   }
  ]
 },
 {
  "id": "m4",
  "pav": "Be sąmonės po skeveldros sužeidimo",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Už kelių metrų sprogo minosvaidžio mina: skeveldra pataikė į šlaunį, masyvaus kraujavimo nėra. Sprogimo banga parbloškė karį – jis be sąmonės (uždara galvos trauma), guli ant nugaros ir knarkia. Kaklo trauma neįtariama.",
    "gp": {
     "AVPU": "U",
     "KD": "10"
    },
    "klaus": "Ką darote?",
    "opt": [
     {
      "t": "Paliekate ant nugaros – juk kvėpuoja",
      "ok": false
     },
     {
      "t": "Atveriate takus: galvos atlošimas ir smakro pakėlimas",
      "ok": true
     },
     {
      "t": "Pirštais aklai krapštote burną",
      "ok": false
     }
    ],
    "why": "Knarkimas – obstrukcijos požymis: liežuvio šaknis užveria takus. Atverkite galvos atlošimu ir smakro pakėlimu; matomus svetimkūnius šalinkite, aklai nekrapštykite.",
    "ref": [
     "#/igudis/9",
     "#/f/TFC?t=2"
    ]
   },
   {
    "sit": "Takai atverti, knarkimas dingo, kvėpuoja pakankamai. Reikia eiti prie kitų MARCH veiksmų.",
    "gp": {
     "KD": "14"
    },
    "klaus": "Kokioje padėtyje paliekate?",
    "opt": [
     {
      "t": "Stabili šoninė padėtis: galva atlošta, smakras atitrauktas",
      "ok": true
     },
     {
      "t": "Pasodinate ir palenkiate į priekį",
      "ok": false
     },
     {
      "t": "Ant nugaros, galva palenkta, smakras prie krūtinės",
      "ok": false
     }
    ],
    "why": "Nesąmoningam be obstrukcijos – stabili šoninė padėtis, galva atlošta, smakras atitrauktas nuo krūtinės. Sėdėti, pasilenkus – sąmoningam.",
    "ref": [
     "#/igudis/10",
     "#/f/TFC?t=2"
    ]
   },
   {
    "sit": "Po 10 min kvėpavimas suretėjo ir tapo paviršinis, SpO₂ nekyla. Kaukolės pamato lūžio požymių nėra.",
    "gp": {
     "KD": "6",
     "SpO₂": "84 %",
     "AVPU": "U"
    },
    "klaus": "Ką darote?",
    "opt": [
     {
      "t": "Duodate CWMP ir laukiate",
      "ok": false
     },
     {
      "t": "Ventiliuojate ambu maišu kuo dažniau, be NPA",
      "ok": false
     },
     {
      "t": "NPA ir ventiliacija 1000 ml ambu maišu",
      "ok": true
     }
    ],
    "why": "Sutrikusi ventiliacija ir neištaisoma hipoksija (SpO₂ < 90 %) – NPA ir 1000 ml ambu maišas, kas 5–6 s. Per dažnai pučiant oras patenka į skrandį.",
    "ref": [
     "#/igudis/11",
     "#/igudis/12",
     "#/f/TFC?t=3"
    ]
   }
  ]
 },
 {
  "id": "m5",
  "pav": "Šautinė krūtinės žaizda",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Šautinė žaizda dešinėje krūtinės pusėje; įkvepiant girdėti siurbiantis garsas, burbuliuoja kraujas.",
    "gp": {
     "KD": "24",
     "AVPU": "A"
    },
    "klaus": "Ką darote?",
    "opt": [
     {
      "t": "Tamponuojate žaizdą hemostatiniu tvarsčiu ir spaudžiate",
      "ok": false
     },
     {
      "t": "Uždengiate delnu, nuvalote odą ir klijuojate ventiliuojamą krūtinės lipduką",
      "ok": true
     },
     {
      "t": "Klijuojate lipduką tiesiai ant kruvinos odos, kad nesugaištumėte",
      "ok": false
     }
    ],
    "why": "Atvira (siurbianti) krūtinės žaizda – iškart uždenkite ranka, nuvalykite odą ir klijuokite ventiliuojamą krūtinės lipduką. Ant kruvinos odos lipdukas neprilimpa.",
    "ref": [
     "#/igudis/15",
     "#/f/TFC?t=3"
    ]
   },
   {
    "sit": "Po 10 min kvėpavimas vis dažnėja, distresas didėja, dešinėje kvėpavimo garsai labai susilpnėję.",
    "gp": {
     "KD": "36",
     "SpO₂": "86 %"
    },
    "klaus": "Ką darote pirmiausia?",
    "opt": [
     {
      "t": "„Atpučiate“ lipduką (pakeliate kraštą) ir vertinate iš naujo",
      "ok": true
     },
     {
      "t": "Laukiate kaklo venų išsipūtimo ir trachėjos poslinkio",
      "ok": false
     },
     {
      "t": "Pasodinate ir toliau nebestebite",
      "ok": false
     }
    ],
    "why": "Krūtinės trauma ir didėjantis distresas, susilpnėję garsai vienoje pusėje, SpO₂ < 90 % – įtarkite įtampos pneumotoraksą. Pirma „atpūskite“ lipduką; vėlyvų požymių nelaukite.",
    "ref": [
     "#/igudis/14",
     "#/igudis/15",
     "#/f/TFC?t=3"
    ]
   },
   {
    "sit": "Atpūtus lipduką būklė nepagerėjo.",
    "gp": {
     "KD": "40",
     "SpO₂": "82 %"
    },
    "klaus": "Kaip atliekate adatinę dekompresiją (NDC)?",
    "opt": [
     {
      "t": "Kairėje, sveikoje pusėje, kad ji kvėpuotų geriau",
      "ok": false
     },
     {
      "t": "Mediališkiau spenelio linijos, po šonkaulio apatiniu kraštu",
      "ok": false
     },
     {
      "t": "Dešinėje: 14 G ar 10 G, 8 cm, 5-asis tarpšonkaulis, priekinė pažasties linija",
      "ok": true
     }
    ],
    "why": "NDC – pažeistoje pusėje: 5-asis tarpšonkaulis priekinėje pažasties linijoje (arba 2-asis vidurinėje raktikaulio linijoje), statmenai, virš apatinio šonkaulio. Mediališkiau spenelio linijos ar po šonkaulio apatiniu kraštu – klaida.",
    "ref": [
     "#/igudis/16",
     "#/f/TFC?t=3"
    ]
   }
  ]
 },
 {
  "id": "m6",
  "pav": "Pėdos amputacija ir šokas (CMC)",
  "tema": "TFC",
  "lygis": "CMC",
  "q": [
   {
    "sit": "Mina nutraukė pėdą prieš 30 min; turniketas veiksmingas. Sužeistasis mieguistas, atsimerkia tik užkalbintas. Galvos traumos požymių nėra.",
    "gp": {
     "AVPU": "V",
     "Radialinis pulsas": "silpnas",
     "ŠSD": "128"
    },
    "klaus": "Ar sužeistasis šoke?",
    "opt": [
     {
      "t": "Ne – miego arterijos pulsas čiuopiamas",
      "ok": false
     },
     {
      "t": "Neaišku – pirmiausia reikia išmatuoti AKS",
      "ok": false
     },
     {
      "t": "Taip – sutrikusi sąmonė ir silpnas radialinis pulsas",
      "ok": true
     }
    ],
    "why": "Šokas: sutrikusi sąmonė be galvos traumos ir (ar) silpnas ar nečiuopiamas radialinis pulsas. Čiuopiamas miego arterijos pulsas šoko neatmeta; hipotenzijos nelaukite.",
    "ref": [
     "#/igudis/17",
     "#/f/TFC?t=4"
    ]
   },
   {
    "sit": "(CMC) IO prieiga įvesta. Nuo sužeidimo praėjo 40 min.",
    "gp": {
     "AVPU": "V",
     "Radialinis pulsas": "silpnas"
    },
    "klaus": "(CMC) Kaip skiriate TXA?",
    "opt": [
     {
      "t": "2 g lėtai IV / IO – dabar, ne vėliau kaip per 3 val.",
      "ok": true
     },
     {
      "t": "2 g greita IV / IO injekcija per kelias sekundes",
      "ok": false
     },
     {
      "t": "Tik jei po 3 val. kraujavimas atsinaujins",
      "ok": false
     }
    ],
    "why": "Šokas ir didelė amputacija – tikėtina transfuzija: TXA 2 g lėtai IV / IO kuo anksčiau, ne vėliau kaip per 3 val. nuo sužeidimo. Greitai leidžiant gali kristi kraujospūdis.",
    "ref": [
     "#/vaistas/txa",
     "#/igudis/20",
     "#/f/TFC?t=4"
    ]
   },
   {
    "sit": "(CMC) Perpilamas šaltai laikytas mažo titro O pilnas kraujas; pirmasis vienetas baigtas.",
    "gp": {
     "Radialinis pulsas": "silpnas"
    },
    "klaus": "(CMC) Ką skiriate po pirmojo vieneto?",
    "opt": [
     {
      "t": "Kalcis: 10 ml 10 % kalcio gliukonato IV / IO",
      "ok": false
     },
     {
      "t": "Kalcis: 30 ml 10 % kalcio gliukonato IV / IO",
      "ok": true
     },
     {
      "t": "Kalcio nereikia – TXA jau suleista",
      "ok": false
     }
    ],
    "why": "Po pirmojo kraujo vieneto – 30 ml 10 % kalcio gliukonato (arba 10 ml 10 % kalcio chlorido). Tik 10 ml gliukonato – dažna klaida.",
    "ref": [
     "#/vaistas/kalcis",
     "#/igudis/20"
    ]
   }
  ]
 },
 {
  "id": "m7",
  "pav": "Galvos trauma lyjant",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Sprogimas prieš 15 min. Sužeistasis nevykdo paprastų komandų, kraujavimo nėra, radialinis pulsas stiprus. Prie jo – ginklas ir granatos.",
    "gp": {
     "AVPU": "V",
     "Radialinis pulsas": "stiprus"
    },
    "klaus": "Ką darote pirmiausia?",
    "opt": [
     {
      "t": "Paimate ginklą, granatas ir ryšio priemones",
      "ok": true
     },
     {
      "t": "Ginklą paliekate – gali prireikti gintis",
      "ok": false
     },
     {
      "t": "Duodate CWMP nuo galvos skausmo",
      "ok": false
     }
    ],
    "why": "Sutrikusios sąmonės sužeistąjį nuginkluokite. CWMP duodamas tik sąmoningam (AVPU – A), galinčiam nuryti.",
    "ref": [
     "#/igudis/22",
     "#/f/TFC"
    ]
   },
   {
    "sit": "Kvėpuoja retai ir paviršiškai, SpO₂ nepakyla. Įtariate vidutinę ar sunkią galvos smegenų traumą.",
    "gp": {
     "SpO₂": "88 %",
     "KD": "8"
    },
    "klaus": "Koks tikslas ir veiksmai?",
    "opt": [
     {
      "t": "SpO₂ 88 % priimtina – tik stebite",
      "ok": false
     },
     {
      "t": "SpO₂ ≥ 92 %: NPA ir ambu maišas, 10 įpūtimų/min",
      "ok": true
     },
     {
      "t": "Ambu maišu ventiliuojate 20–30 k./min",
      "ok": false
     }
    ],
    "why": "Galvos traumai tikslas SpO₂ ≥ 92 %. Sutrikus ventiliacijai – NPA ir ambu maišas; be EtCO₂ – 10 įpūtimų/min (kas 6 s) mažu tūriu.",
    "ref": [
     "#/igudis/22",
     "#/igudis/12",
     "#/f/TFC?t=5"
    ]
   },
   {
    "sit": "Ventiliacija veikia, šoko nėra. Lyja, sužeistasis guli ant šlapios žemės.",
    "gp": {
     "SpO₂": "94 %",
     "Radialinis pulsas": "stiprus"
    },
    "klaus": "Kas teisinga?",
    "opt": [
     {
      "t": "Šildymo priemonę dedate tiesiai ant odos, apvyniojate liemenį",
      "ok": false
     },
     {
      "t": "Hipotermijos prevenciją atidedate iki evakuacijos",
      "ok": false
     },
     {
      "t": "Izoliuojate nuo žemės, apvyniojate su galva (veidas atviras), galva ir liemuo > 30°",
      "ok": true
     }
    ],
    "why": "Hipotermijos prevencija – kuo anksčiau: izoliacija nuo žemės, apvalkalas su galva, veidas atviras, šildymas ne ant odos. Be šoko galva ir liemuo pakeliami > 30°.",
    "ref": [
     "#/igudis/21",
     "#/igudis/22",
     "#/f/TFC?t=5"
    ]
   }
  ]
 },
 {
  "id": "m8",
  "pav": "Skeveldra blauzdoje: PAWS",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Atvira blauzdos žaizda sutvarstyta, MARCH sutvarkytas. Sužeistasis budrus, gali kovoti ir nuryti, skausmas 6/10.",
    "gp": {
     "AVPU": "A",
     "Skausmas": "6/10"
    },
    "klaus": "Kaip malšinate skausmą?",
    "opt": [
     {
      "t": "Ketaminas 100 mg IM",
      "ok": false
     },
     {
      "t": "CWMP ir papildomai ibuprofenas stipresniam poveikiui",
      "ok": false
     },
     {
      "t": "CWMP: paracetamolis, meloksikamas, suzetriginas – iš karto",
      "ok": true
     }
    ],
    "why": "Galintis kovoti – CWMP (paracetamolis, meloksikamas, suzetriginas). Kitų NVNU kartu negerti; ketaminas – negalinčiam kovoti, skiria CMC.",
    "ref": [
     "#/igudis/24",
     "#/vaistas/meloksikamas",
     "#/f/TFC?t=6"
    ]
   },
   {
    "sit": "CWMP išgertas. Žaizda atvira kovinė, alergijų neturi, nuryti gali.",
    "gp": {
     "AVPU": "A"
    },
    "klaus": "Kaip su antibiotiku?",
    "opt": [
     {
      "t": "Cefadroksilis 1 g per burną dabar",
      "ok": true
     },
     {
      "t": "Nereikia – CWMP apsaugo nuo infekcijos",
      "ok": false
     },
     {
      "t": "Atidedate iki ligoninės",
      "ok": false
     }
    ],
    "why": "Atvira kovinė žaizda – antibiotikas kuo skubiau: galinčiam nuryti cefadroksilis 1 g per burną. TCCC 2026 CWMP antibiotiko nebeturi.",
    "ref": [
     "#/igudis/26",
     "#/vaistas/cefadroksilis",
     "#/f/TFC?t=6"
    ]
   },
   {
    "sit": "Blauzda deformuota – įtariate lūžį. Turite SAM įtvarą.",
    "gp": {},
    "klaus": "Kaip įtveriate?",
    "opt": [
     {
      "t": "Įtveriate tik lūžio vietą, sąnarių nefiksuojate",
      "ok": false
     },
     {
      "t": "Pulsas prieš, įtveriate sąnarius virš ir žemiau, pulsas po",
      "ok": true
     },
     {
      "t": "Užveržiate įtvarą kuo stipriau, pulso netikrinate",
      "ok": false
     }
    ],
    "why": "Distalinį pulsą tikrinkite prieš ir po įtvėrimo; įtverkite sąnarius virš ir žemiau lūžio, tvirtai, bet neužspausdami. Pulso nėra – atlaisvinkite ir pataisykite.",
    "ref": [
     "#/igudis/29",
     "#/f/TFC?t=6"
    ]
   }
  ]
 },
 {
  "id": "m9",
  "pav": "Apvirtęs šarvuotis (CMC)",
  "tema": "TFC",
  "lygis": "CMC",
  "q": [
   {
    "sit": "(CMC) Apvirto šarvuotis. Sunki buka trauma, stiprus dubens skausmas, matomo kraujavimo nėra.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "silpnas",
     "ŠSD": "124"
    },
    "klaus": "(CMC) Kur dedate dubens diržą?",
    "opt": [
     {
      "t": "Didžiųjų gūbrių (trochanter major) lygyje, kojas surišate",
      "ok": true
     },
     {
      "t": "Ant klubakaulių keterų ar juosmens",
      "ok": false
     },
     {
      "t": "Nereikia – matomo kraujavimo nėra",
      "ok": false
     }
    ],
    "why": "Sunki buka trauma ir dubens skausmas – dubens diržas didžiųjų gūbrių lygyje, kojos surišamos. Per aukštai lūžis nesumažinamas; dubens lūžis kraujuoja viduje.",
    "ref": [
     "#/igudis/18",
     "#/f/TFC?t=4"
    ]
   },
   {
    "sit": "(CMC) Diržas uždėtas. Skausmas 9/10, užduoties tęsti negali, sąmoningas. Planuojate ketaminą.",
    "gp": {
     "AVPU": "A",
     "Skausmas": "9/10"
    },
    "klaus": "(CMC) Ką būtina padaryti prieš ketaminą?",
    "opt": [
     {
      "t": "Kartu skirti midazolamą sujaudinimui išvengti",
      "ok": false
     },
     {
      "t": "Nuginkluoti ir AVPU įrašyti į kortelę (DD 1380)",
      "ok": true
     },
     {
      "t": "Nieko – AVPU įrašysite po vaisto",
      "ok": false
     }
    ],
    "why": "Prieš ketaminą – nuginkluoti ir AVPU įrašyti į kortelę, kitaip neatskirsite vaisto poveikio nuo šoko ar galvos traumos. Benzodiazepinų kartu neskirti.",
    "ref": [
     "#/igudis/25",
     "#/vaistas/ketaminas",
     "#/f/TFC?t=6"
    ]
   },
   {
    "sit": "(CMC) Antrasis CMC dar įvedinėja IO ir ruošia TXA, skausmas nemažėja. Kad nelauktumėte prieigos, ketaminą skiriate į raumenis.",
    "gp": {},
    "klaus": "(CMC) Dozė ir kartojimas?",
    "opt": [
     {
      "t": "100 mg IM; kartoti kas 5 min, kol užmigs",
      "ok": false
     },
     {
      "t": "25 mg IM; kartoti tik ligoninėje",
      "ok": false
     },
     {
      "t": "100 mg IM; kartoti kas 30 min pagal poreikį",
      "ok": true
     }
    ],
    "why": "Ketaminas 100 mg IM; kartoti kas 30 min pagal poreikį, kol skausmas sumažės ar atsiras nistagmas. Tikslas – pakenčiamas skausmas, ne sedacija.",
    "ref": [
     "#/vaistas/ketaminas",
     "#/igudis/25"
    ]
   }
  ]
 },
 {
  "id": "m10",
  "pav": "MEDEVAC ir perdavimas",
  "tema": "TACEVAC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Sužeistasis su turniketu ant šlaunies paruoštas evakuacijai. Vadas liepia kviesti MEDEVAC, bet dalies duomenų dar trūksta.",
    "gp": {},
    "klaus": "Kurių 9-Line eilučių reikia priemonei išsiųsti?",
    "opt": [
     {
      "t": "Visų 9 – kitaip priemonė neišskris",
      "ok": false
     },
     {
      "t": "1–5 eilučių; 6–9 – kai priemonė jau juda",
      "ok": true
     },
     {
      "t": "Tik 1 ir 3 eilučių",
      "ok": false
     }
    ],
    "why": "1–5 eilutės būtinos priemonei išsiųsti, 6–9 galima perduoti, kai priemonė jau juda. Prieš kviesdami surinkite informaciją ir perduokite eilutes iš eilės.",
    "ref": [
     "#/9line",
     "#/igudis/32",
     "#/p/devynios"
    ]
   },
   {
    "sit": "Sužeistasis perkeltas ant neštuvų ir į transporto priemonę. Turniketas uždėtas prieš 50 min.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "stiprus"
    },
    "klaus": "Ką darote po perkėlimo?",
    "opt": [
     {
      "t": "Kartojate MARCH: tikrinate turniketą, kraujavimą, tvarsčius",
      "ok": true
     },
     {
      "t": "Atlaisvinate turniketą, kad galūnė „pakvėpuotų“",
      "ok": false
     },
     {
      "t": "Turniketo netikrinate iki ligoninės",
      "ok": false
     }
    ],
    "why": "Po kiekvieno perkėlimo ir kas 5–10 min – pakartotinis MARCH: turniketai (laikas, veiksmingumas), tvarsčiai, naujas kraujavimas. Atlaisvinti „pakvėpuoti“ – klaida.",
    "ref": [
     "#/f/TACEVAC?t=1",
     "#/igudis/30",
     "#/igudis/8"
    ]
   },
   {
    "sit": "Atvykote į stabilizavimo punktą. Aplink triukšminga, priimantis medikas skuba.",
    "gp": {
     "AVPU": "A",
     "ŠSD": "96"
    },
    "klaus": "Kaip perduodate sužeistąjį?",
    "opt": [
     {
      "t": "Kortelę paliekate ant neštuvų ir išvykstate",
      "ok": false
     },
     {
      "t": "Perskaitote 9-Line eilutes vietoj MIST",
      "ok": false
     },
     {
      "t": "Akis į akį: MIST, pokyčiai, kas tęstina, kortelė (DD 1380)",
      "ok": true
     }
    ],
    "why": "Perduokite tiesiogiai priimančiam medikui: MIST, pokyčiai kelionės metu, kas tęstina (turniketo laikas, paskutinė vaistų dozė, alergijos) ir kortelė (DD 1380).",
    "ref": [
     "#/mist",
     "#/igudis/34",
     "#/f/TACEVAC?t=3"
    ]
   }
  ]
 },
 {
  "id": "m11",
  "pav": "Sužeistas, bet kovoja",
  "tema": "CUF",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Gynybinėje pozicijoje priešas atidengia ugnį. Kulka pataiko jums į kairįjį dilbį – kraujas teka srove. Dešine ranka dar galite šaudyti.",
    "gp": {},
    "klaus": "Ką darote pirmiausia?",
    "opt": [
     {
      "t": "Atsakote ugnimi, traukiatės už priedangos ir pranešate apie sužeidimą",
      "ok": true
     },
     {
      "t": "Šaukiate mediką ir gulėdami vietoje laukiate, kol jis prišliauš",
      "ok": false
     },
     {
      "t": "Čia pat, neatsitraukę, tamponuojate dilbio žaizdą hemostatiniu tvarsčiu",
      "ok": false
     }
    ],
    "why": "Atsakykite ugnimi, jei galite – pasitraukite už priedangos ir praneškite artimiausiems kariams ar vadui, kad esate sužeistas. Turniketą užsidedate pats; tamponavimas naikinimo zonoje – klaida.",
    "ref": [
     "#/igudis/4",
     "#/f/CUF"
    ]
   },
   {
    "sit": "Už priedangos iš IFAK ištraukėte veržtuvinį turniketą. Ranką prakišote pro kilpą, turniketas – ant uniformos aukštai virš žaizdos.",
    "gp": {},
    "klaus": "Kas svarbiausia prieš sukant strypą?",
    "opt": [
     {
      "t": "Palikti juostoje laisvumo, kad strypas lengviau suktųsi",
      "ok": false
     },
     {
      "t": "Pirmiausia užrašyti uždėjimo laiką ant turniketo",
      "ok": false
     },
     {
      "t": "Ištraukti visą laisvumą – po juosta netelpa 3 pirštų galiukai",
      "ok": true
     }
    ],
    "why": "Prieš sukant veržtuvą ištraukite visą juostos laisvumą ir užklijuokite juostą – po ja neturi tilpti 3 pirštų galiukai. Palikus laisvumo kraujavimas nesustoja. Laiko CUF metu nerašykite – įsiminkite jį.",
    "ref": [
     "#/igudis/4"
    ]
   },
   {
    "sit": "Strypas užfiksuotas laikiklyje, kraujavimas sustojo, kito masyvaus kraujavimo nėra. Apšaudymas tęsiasi.",
    "gp": {},
    "klaus": "Ką darote toliau?",
    "opt": [
     {
      "t": "Kas kelias minutes atlaisvinate turniketą, kad ranka „pakvėpuotų“",
      "ok": false
     },
     {
      "t": "Kovojate toliau, laiką įsimenate; TFC metu turniketas bus įvertintas",
      "ok": true
     },
     {
      "t": "Nusimaunate pirštinę ir vyniojate spaudžiamąjį tvarstį",
      "ok": false
     }
    ],
    "why": "Kito masyvaus kraujavimo nėra – likite priedangoje ir, jei galite, kovokite toliau. Laiką įsiminkite; TFC metu turniketas atidengiamas ir įvertinamas iš naujo. Atlaisvinti, „kad galūnė pakvėpuotų“, – klaida.",
    "ref": [
     "#/igudis/4",
     "#/igudis/8"
    ]
   }
  ]
 },
 {
  "id": "m12",
  "pav": "Naktinis apšaudymas",
  "tema": "CUF",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Naktinis patrulis apšaudomas iš griuvėsių. Tamsoje girdite, kaip draugas už 15 m šaukia, kad sužeista koja. Jis dar juda, priešo ugnis nenuslopinta.",
    "gp": {},
    "klaus": "Ką darote?",
    "opt": [
     {
      "t": "Bėgate prie jo su žibintuvėliu, kad rastumėte žaizdą",
      "ok": false
     },
     {
      "t": "Pirmiausia per radiją kviečiate MEDEVAC",
      "ok": false
     },
     {
      "t": "Atsakote ugnimi, liepiate jam pereiti į priedangą ir padėti sau",
      "ok": true
     }
    ],
    "why": "CUF: atsakykite į ugnį ir pasislėpkite priedangoje. Sužeistajam liepkite pereiti į priedangą ir suteikti pagalbą sau; prie jo neikite, kol jis „mirties zonoje“, o ugnis nenuslopinta.",
    "ref": [
     "#/s/cuf",
     "#/p/cuf"
    ]
   },
   {
    "sit": "Draugas nebeatsiliepia ir nejuda. Ugnis prislopinta, prišliaužėte prie jo. Tamsu – kraujavimo vietos nematote, bet kelnė permirkusi krauju.",
    "gp": {},
    "klaus": "Kur dedate turniketą?",
    "opt": [
     {
      "t": "„Aukštai ir tampriai“ – ant uniformos kuo aukščiau šlaunyje",
      "ok": true
     },
     {
      "t": "Ant kelio sąnario – ten lengviausia užčiuopti ir užveržti",
      "ok": false
     },
     {
      "t": "Atidengiate koją, randate žaizdą ir dedate 5–7,5 cm virš jos",
      "ok": false
     }
    ],
    "why": "CUF metu žaizdos neatidengiama. Kraujavimo vietos aiškiai nematant – „aukštai ir tampriai“, kuo arčiau galūnės pradžios. Ant odos 5–7,5 cm virš žaizdos – TFC metu.",
    "ref": [
     "#/igudis/5",
     "#/p/cuf"
    ]
   },
   {
    "sit": "Turniketas užveržtas, kraujavimas sustojo. Su antru kariu draugą turite perkelti 20 m iki griuvėsių sienos; priešas dar gali šaudyti.",
    "gp": {
     "AVPU": "U"
    },
    "klaus": "Kaip jį perkeliate?",
    "opt": [
     {
      "t": "Nešate „priekis–galas“, abu ginklus užsimetę ant nugaros",
      "ok": false
     },
     {
      "t": "Velkate už užsegtos ekipuotės, laisva ranka laikote ginklą parengtą",
      "ok": true
     },
     {
      "t": "Vienas užsikelia jį ant nugaros ir eina visu ūgiu",
      "ok": false
     }
    ],
    "why": "CUF metu dviese velkama už ekipuotės trumpais greitais brūkšniais, laisva ranka laikant ginklą parengtą; ekipuotė turi būti užsegta. Ant nugaros nešamas tik sąmoningas sužeistasis.",
    "ref": [
     "#/igudis/3",
     "#/igudis/2"
    ]
   }
  ]
 },
 {
  "id": "m13",
  "pav": "Pataikymas į šarvuotį",
  "tema": "CUF",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Prieštankinė raketa pataiko į kolonos šarvuotį, viduje kyla gaisras. Vairuotojas sąmoningas, bet pats išlipti negali – blauzda nutraukta. Priešas šaudo į koloną.",
    "gp": {
     "AVPU": "A"
    },
    "klaus": "Kas pirmiausia?",
    "opt": [
     {
      "t": "Viduje pradedate apžiūrą nuo kvėpavimo takų",
      "ok": false
     },
     {
      "t": "Laukiate, kol užges, – šarvai saugo nuo kulkų",
      "ok": false
     },
     {
      "t": "Ištraukiate jį iš degančios technikos į saugesnę vietą",
      "ok": true
     }
    ],
    "why": "CUF: sužeistąjį iš degančios technikos ar pastato ištraukite į saugesnę vietą ir sustabdykite degimą. Kvėpavimo takų valdymas atidedamas iki TFC.",
    "ref": [
     "#/s/cuf",
     "#/igudis/2"
    ]
   },
   {
    "sit": "Ištraukėte vairuotoją už šarvuočio ir užgesinote smilkstančią uniformą. Iš blauzdos bigės kraujas teka srove, kolona vis dar apšaudoma.",
    "gp": {
     "AVPU": "A"
    },
    "klaus": "Kaip stabdote kraujavimą?",
    "opt": [
     {
      "t": "Turniketas ant uniformos virš bigės, veržiate, kol kraujavimas sustos",
      "ok": true
     },
     {
      "t": "Tamponuojate bigę hemostatiniu tvarsčiu ir spaudžiate 3 min",
      "ok": false
     },
     {
      "t": "Ant bigės uždedate spaudžiamąjį tvarstį ir tęsiate kovą",
      "ok": false
     }
    ],
    "why": "CUF metu gyvybei pavojingam galūnės kraujavimui – turniketas ant uniformos aiškiai virš kraujavimo vietos, užveržiamas, kol kraujavimas sustos. Tamponavimas ir spaudžiamasis tvarstis – TFC priemonės; amputacijai – visada turniketas.",
    "ref": [
     "#/igudis/5",
     "#/f/CUF"
    ]
   },
   {
    "sit": "Kolona ištrūko iš pasalos, tiesioginės ugnies nebėra (TFC). Turniketą atidengėte ir įvertinote: kraujavimas sustojęs, sužeistasis budrus, evakuacija – po 1 val.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "stiprus"
    },
    "klaus": "Ar konvertuojate turniketą į spaudžiamąjį tvarstį?",
    "opt": [
     {
      "t": "Taip – šoko nėra ir dar nepraėjo 2 val.",
      "ok": false
     },
     {
      "t": "Ne – amputacijai turniketas nekonvertuojamas",
      "ok": true
     },
     {
      "t": "Taip – staigiai atlaisvinate ir žiūrite, ar kraujuoja",
      "ok": false
     }
    ],
    "why": "Konversija – tik tenkinant visas 3 sąlygas: nėra šoko, žaizdą galima atidžiai stebėti, tai ne amputacija. Trauminei amputacijai – visada turniketas; jį tikrinkite po kiekvieno perkėlimo.",
    "ref": [
     "#/igudis/8",
     "#/igudis/5"
    ]
   }
  ]
 },
 {
  "id": "m14",
  "pav": "Per laisvas turniketas",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Po susišaudymo miške – taktinė lauko pagalba. Draugas CUF metu užsidėjo turniketą ant šlaunies per uniformą. Atidengę matote: iš žaizdos vis dar sunkiasi kraujas, pėdoje juntamas pulsas.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "čiuopiamas"
    },
    "klaus": "Ką darote pirmiausia?",
    "opt": [
     {
      "t": "Suveržiate turniketą stipriau",
      "ok": true
     },
     {
      "t": "Nuimate turniketą ir tamponuojate žaizdą",
      "ok": false
     },
     {
      "t": "Paliekate – kraujavimas juk sumažėjo",
      "ok": false
     }
    ],
    "why": "Kraujuoja ar juntamas distalinis pulsas – turniketas suveržtas per silpnai: suveržkite stipriau. Palikti tokį turniketą – dažna klaida.",
    "ref": [
     "#/igudis/8",
     "#/igudis/5"
    ]
   },
   {
    "sit": "Strypo pasukti nebeįmanoma, o pulsas pėdoje vis dar juntamas ir kraujas sunkiasi.",
    "gp": {},
    "klaus": "Ką darote?",
    "opt": [
     {
      "t": "Atsukate strypą ir užveržiate iš naujo kita kryptimi",
      "ok": false
     },
     {
      "t": "Spaudžiate žaizdą ir laukiate, kol kraujavimas sustos",
      "ok": false
     },
     {
      "t": "Dedate antrą turniketą greta pirmojo, proksimaliau",
      "ok": true
     }
    ],
    "why": "Distalinis pulsas vis dar juntamas – iškart dėkite naują turniketą: antrąjį greta pirmojo, proksimaliau. Nedėti antro turniketo – klaida.",
    "ref": [
     "#/igudis/5",
     "#/s/tfc-m"
    ]
   },
   {
    "sit": "Kraujavimas sustojo, pulso pėdoje nebėra. Sužeistasis prašo atlaisvinti turniketus – koja labai skauda.",
    "gp": {
     "Skausmas": "7/10"
    },
    "klaus": "Kaip elgiatės?",
    "opt": [
     {
      "t": "Atlaisvinate kelioms minutėms, kad koja „pakvėpuotų“",
      "ok": false
     },
     {
      "t": "Neatlaisvinate; laikus užrašote ant turniketų ir kortelėje",
      "ok": true
     },
     {
      "t": "Neatlaisvinate, o laiko nerašote – jį įsiminėte CUF metu",
      "ok": false
     }
    ],
    "why": "Atlaisvinti turniketą, „kad galūnė pakvėpuotų“, ir nepažymėti laiko – klaidos. Laiką užrašykite ant turniketo nenuplaunamu žymekliu ir DD 1380 kortelėje; 2 ir 6 val. skaičiuojamos nuo pirmojo uždėjimo.",
    "ref": [
     "#/igudis/5",
     "#/igudis/8",
     "#/igudis/31"
    ]
   }
  ]
 },
 {
  "id": "m15",
  "pav": "Skeveldra kakle",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Artilerijos ugnis nutilo, skyrius priedangoje (TFC). Kariui skeveldra pataikė į kairę kaklo pusę – iš žaizdos kraujas teka srove.",
    "gp": {
     "AVPU": "A"
    },
    "klaus": "Ką darote pirmiausia?",
    "opt": [
     {
      "t": "Ieškote turniketo – be jo kraujavimo nesustabdysite",
      "ok": false
     },
     {
      "t": "Iškart spaudžiate žaizdą ir atplėšiate hemostatinį tvarstį",
      "ok": true
     },
     {
      "t": "Pirmiausia vertinate kvėpavimo takus – jie svarbiausi",
      "ok": false
     }
    ],
    "why": "Kaklo kraujavimo galūnės turniketu nesustabdysite. Iškart spauskite ir tamponuokite hemostatiniu tvarsčiu; laukti priemonių ir nespausti – klaida. M eina prieš A.",
    "ref": [
     "#/igudis/7",
     "#/s/tfc-m"
    ]
   },
   {
    "sit": "Tamponavote, kol užpildėte ertmę; tamponas kyšo virš odos. Spaudžiate jau 3 min, kraujavimas sustojo.",
    "gp": {},
    "klaus": "Kaip tvarstote kaklą?",
    "opt": [
     {
      "t": "Spaudžiamąjį tvarstį su spaudimo plokštele vyniojate aplink kaklą",
      "ok": false
     },
     {
      "t": "Tamponą prilaikote pleistru – tvarsčio ant kaklo nereikia",
      "ok": false
     },
     {
      "t": "Elastinį tvarstį per tamponą, tada įstrižai po priešinga pažastimi",
      "ok": true
     }
    ],
    "why": "Kaklui: elastinis tvarstis ant tampono (≥ 1,5 karto per tamponą), tada įstrižai per krūtinę po priešinga pažastimi, aplink nugarą ir vėl per žaizdą. Spaudimo plokštelė ant kaklo ir tvarstis ne po priešinga pažastimi – klaidos.",
    "ref": [
     "#/igudis/7"
    ]
   },
   {
    "sit": "Tvarstis surištas neslystančiu mazgu, mazgas apvyniotas pleistru. Ruošiate karį nešti iki evakuacijos taško.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "čiuopiamas"
    },
    "klaus": "Ką dar darote?",
    "opt": [
     {
      "t": "Sužeistos pusės žastą pririšate prie krūtinės; po perkėlimo tikrinate",
      "ok": true
     },
     {
      "t": "Ant tvarsčio pridedate gertuvę kaip spaudimo įtaisą ir užveržiate",
      "ok": false
     },
     {
      "t": "Nieko daugiau – tvarstis tvirtas ir išlaikys visą evakuaciją",
      "ok": false
     }
    ],
    "why": "Kaklui ir pažasčiai sužeistos pusės žastas pririšamas prie krūtinės. Kaklui spaudimo įtaiso nenaudojama. Po kiekvieno perkėlimo kartokite M–A–R–C ir tikrinkite tvarstį.",
    "ref": [
     "#/igudis/7",
     "#/igudis/30"
    ]
   }
  ]
 },
 {
  "id": "m16",
  "pav": "Turniketo keitimas TFC",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Prieš 40 min, per susišaudymą, draugas užsidėjo turniketą ant žasto per uniformą. Dabar esate saugioje pozicijoje (TFC), kraujavimas sustabdytas.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "stiprus"
    },
    "klaus": "Ką darote su CUF metu uždėtu turniketu?",
    "opt": [
     {
      "t": "Paliekate kaip yra – kraujavimas juk sustabdytas, žaizdos neliečiate",
      "ok": false
     },
     {
      "t": "Nuimate iš karto ir nieko nededate – praėjo mažiau nei valanda",
      "ok": false
     },
     {
      "t": "Atidengiate ir keičiate nauju ant odos 5–7,5 cm virš žaizdos",
      "ok": true
     }
    ],
    "why": "TFC metu kiekvieną anksčiau uždėtą turniketą atidenkite ir įvertinkite. Keičiant naujas turniketas dedamas tiesiai ant odos 5–7,5 cm virš kraujavimo vietos. CUF turniketo nepatikrinti – klaida.",
    "ref": [
     "#/igudis/8",
     "#/s/tfc-m"
    ]
   },
   {
    "sit": "Naujas turniketas uždėtas ir užveržtas. Dabar reikia atlaisvinti senąjį.",
    "gp": {},
    "klaus": "Kaip jį atlaisvinate?",
    "opt": [
     {
      "t": "Lėtai per ~1 min, stebėdami žaizdą",
      "ok": true
     },
     {
      "t": "Staigiai – greičiau pamatysite, ar laiko naujasis",
      "ok": false
     },
     {
      "t": "Perpjaunate senąjį ir išmetate",
      "ok": false
     }
    ],
    "why": "Senąjį atlaisvinkite lėtai per ~1 min, stebėdami žaizdą. Kraujavimo ir distalinio pulso nėra – nuslinkite jį link naujojo ir palikite virš jo neveržtą; kraujuoja – vėl suveržkite senąjį.",
    "ref": [
     "#/igudis/8"
    ]
   },
   {
    "sit": "Kraujavimo nėra. Evakuacija vėluos; nuo pirmojo turniketo uždėjimo praėjo 1 val. 10 min. Šoko nėra, žaizdą galite stebėti, tai ne amputacija.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "stiprus"
    },
    "klaus": "Ar konvertuojate turniketą?",
    "opt": [
     {
      "t": "Ne – 2 val. skaičiuojamos nuo naujojo turniketo, skubėti nereikia",
      "ok": false
     },
     {
      "t": "Taip: tamponavimas, spaudimas ≥ 3 min, tvarstis, lėtas atlaisvinimas",
      "ok": true
     },
     {
      "t": "Taip: pirmiausia nuimate turniketą, tada tamponuojate ir tvarstote",
      "ok": false
     }
    ],
    "why": "Visos 3 sąlygos tenkinamos, o 2 val. (skaičiuojamos nuo pirmojo turniketo) nepraėjo. Tamponuokite, spauskite ≥ 3 min, uždėkite spaudžiamąjį tvarstį, tada turniketą LĖTAI atlaisvinkite per ~1 min ir palikite ant galūnės.",
    "ref": [
     "#/igudis/8",
     "#/igudis/6"
    ]
   }
  ]
 },
 {
  "id": "m17",
  "pav": "Ištraukimas iš pastato",
  "tema": "CUF",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Valant pastatą gyvenvietėje, koridoriuje sprogsta priešo granata. Karys guli koridoriuje, apšaudomame pro langą; šlaunis kraujuoja srove. Jis sąmoningas, rankos sveikos.",
    "gp": {
     "AVPU": "A"
    },
    "klaus": "Ką darote?",
    "opt": [
     {
      "t": "Iš priedangos liepiate jam užsidėti turniketą ir šliaužti pas jus",
      "ok": true
     },
     {
      "t": "Bėgate per apšaudomą koridorių pas jį ir pats tamponuojate žaizdą",
      "ok": false
     },
     {
      "t": "Liepiate jam gulėti ramiai ir nejudėti, kol atvyks medikas",
      "ok": false
     }
    ],
    "why": "CUF: sužeistajam liepkite pereiti į priedangą ir suteikti pagalbą sau – turniketą pirmiausia deda pats, jei gali. Į „mirties zoną“ neikite, kol ugnis nenuslopinta.",
    "ref": [
     "#/s/cuf",
     "#/igudis/4"
    ]
   },
   {
    "sit": "Turniketą jis užsidėjo, bet nusilpo ir nebejuda. Būrys ugnimi slopina langą; jūs vienas turite jį ištraukti 8 m už sienos kampo.",
    "gp": {
     "AVPU": "V"
    },
    "klaus": "Kaip jį ištraukiate?",
    "opt": [
     {
      "t": "Pirmiausia apžiūrite visą kūną, ar nėra kitų žaizdų",
      "ok": false
     },
     {
      "t": "Už vilkimo rankenos trumpu greitu brūkšniu tempiate atbulomis",
      "ok": true
     },
     {
      "t": "Velkate už rankos per visą pastatą iki išėjimo",
      "ok": false
     }
    ],
    "why": "Vienas gelbėtojas sugriebia už vilkimo rankenos, dirželio ar rankos ir trumpais greitais brūkšniais tempia atbulomis į artimiausią priedangą. Toli taip velkama neefektyvu; apžiūra – jau priedangoje (TFC).",
    "ref": [
     "#/igudis/2",
     "#/p/cuf"
    ]
   },
   {
    "sit": "Pasiekėte saugų kambarį, tiesioginės ugnies nebėra. Kiti kariai saugo duris ir langus.",
    "gp": {
     "AVPU": "V"
    },
    "klaus": "Ką pirmiausia darote su sužeistuoju?",
    "opt": [
     {
      "t": "Pildote kortelę (DD 1380) ir per radiją kviečiate MEDEVAC",
      "ok": false
     },
     {
      "t": "Pirmiausia duodate CWMP tabletes, kad sumažėtų skausmas",
      "ok": false
     },
     {
      "t": "Tikrinate turniketą ir kraujavimą – vilkimas galėjo jį pastumti",
      "ok": true
     }
    ],
    "why": "Po kiekvieno perkėlimo tikrinkite turniketą ir kraujavimą; perimetrą saugant kitiems, TFC tęsiama nuo M. Kortelė, evakuacija ir PAWS – vėliau.",
    "ref": [
     "#/igudis/5",
     "#/igudis/1",
     "#/f/TFC"
    ]
   }
  ]
 },
 {
  "id": "m18",
  "pav": "Minosvaidžio ugnis: rūšiavimas",
  "tema": "Rūšiavimas",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Minosvaidžio sviediniai sprogsta lauko stovykloje. Kai apšaudymas liaujasi, randate 4 sužeistuosius; esate vienintelis CLS, medikas pakeliui.",
    "gp": {},
    "klaus": "Nuo ko pradedate?",
    "opt": [
     {
      "t": "Nuo artimiausio sužeistojo – atliekate visą MARCH PAWS",
      "ok": false
     },
     {
      "t": "Užtikrinate saugumą, apžvelgiate vietą ir pranešate vadui",
      "ok": true
     },
     {
      "t": "Pirmiausia surašote visų duomenis į korteles (DD 1380)",
      "ok": false
     }
    ],
    "why": "Rūšiavimas prasideda nuo saugumo ir vietos apžvalgos (kiek sužeistųjų, gelbėtojų, priemonių) bei pranešimo vadui. Užstrigti prie vieno sužeistojo – dažna klaida.",
    "ref": [
     "#/igudis/36",
     "#/s/tfc-s"
    ]
   },
   {
    "sit": "Vienas sužeistasis be sąmonės guli ant nugaros ir garsiai knarkia, kraujavimo nesimato. Kiti dar neįvertinti.",
    "gp": {
     "AVPU": "U"
    },
    "klaus": "Ką darote I etape?",
    "opt": [
     {
      "t": "Atveriate takus, paguldote į šoninę padėtį ir einate prie kito",
      "ok": true
     },
     {
      "t": "Liekate prie jo, įvedate NPA ir ventiliuojate ambu maišu",
      "ok": false
     },
     {
      "t": "Praleidžiate – be sąmonės, todėl laukiantysis",
      "ok": false
     }
    ],
    "why": "I etape – tik greitos gyvybę gelbstinčios intervencijos (turniketas, kvėpavimo takai, šoninė padėtis), tada prie kito. Kvėpavimo takų sutrikimas ir sutrikusi sąmonė – tarp pirmiausia vertinamų; 10s triaže kvėpuojantis nekalbantis – P1, stabili šoninė padėtis.",
    "ref": [
     "#/igudis/36",
     "#/tst"
    ]
   },
   {
    "sit": "Kitas sužeistasis kalbėjo aiškiai, dilbio žaizda sutvarstyta, eiti negali dėl kulkšnies. Po 15 min pastebite, kad jis tapo mieguistas.",
    "gp": {
     "AVPU": "V",
     "Radialinis pulsas": "silpnas"
    },
    "klaus": "Ką darote?",
    "opt": [
     {
      "t": "Kategorija jau priskirta – jos nekeičiate ir tęsiate darbą",
      "ok": false
     },
     {
      "t": "Laikote laukiančiuoju ir einate prie kitų sužeistųjų",
      "ok": false
     },
     {
      "t": "Atnaujinate kategoriją į skubų, ieškote kraujavimo ir pranešate",
      "ok": true
     }
    ],
    "why": "Rūšiavimą kartokite; pasikeitus būklei – atnaujinkite kategoriją ir praneškite. Sutrikusi sąmonė ir silpnas radialinis pulsas – šokas: iš naujo patikrinkite visus kraujavimo šaltinius.",
    "ref": [
     "#/igudis/36",
     "#/igudis/17"
    ]
   }
  ]
 },
 {
  "id": "m19",
  "pav": "Dronų ataka (CMC)",
  "tema": "Rūšiavimas",
  "lygis": "CMC",
  "q": [
   {
    "sit": "Drono numestas sprogmuo sužeidė tris artilerijos įgulos karius; CLS jau atliko I etapą. Atvykote kaip CMC. Pirmasis – skeveldra pilve, sumišęs.",
    "gp": {
     "AVPU": "V",
     "Radialinis pulsas": "silpnas"
    },
    "klaus": "Kokia jo II etapo kategorija?",
    "opt": [
     {
      "t": "Routine – išorinio kraujavimo nesimato, tvarstyti nereikia",
      "ok": false
     },
     {
      "t": "Priority – gydymas gali palaukti iki evakuacijos",
      "ok": false
     },
     {
      "t": "Urgent – išgyvens tik su skubia operacija ar kraujo perpylimu",
      "ok": true
     }
    ],
    "why": "II etapas: Urgent – išgyvens tik su skubia operacija, kraujo perpylimu ar kitu pažangiu gydymu. Penetruojanti liemens trauma su šoko požymiais (sutrikusi sąmonė, silpnas radialinis pulsas) atitinka šią kategoriją.",
    "ref": [
     "#/igudis/36",
     "#/igudis/17"
    ]
   },
   {
    "sit": "Antrasis budrus, kalba, skeveldra įsmigo į akį, kitų sunkių sužalojimų nėra. Trečiasis vaikšto, dilbis nubrozdintas.",
    "gp": {},
    "klaus": "Kaip juos skirstote?",
    "opt": [
     {
      "t": "Abu Routine – nė vienas nemiršta",
      "ok": false
     },
     {
      "t": "Akies – Priority, dilbio – Routine",
      "ok": true
     },
     {
      "t": "Akies – Urgent, dilbio – Priority",
      "ok": false
     }
    ],
    "why": "Priority – gydymas gali palaukti, bet gali grėsti galūnei ar regėjimui; Routine – lengvi sužalojimai. Venkite pervertinimo.",
    "ref": [
     "#/igudis/36",
     "#/igudis/23"
    ]
   },
   {
    "sit": "(CMC) Dėl dronų pas Urgent sužeistąjį pavyko prieiti tik po 3 val., evakuoti kol kas neįmanoma. Įvedėte IO, perpilamas kraujas. Nuo sužeidimo praėjo 3 val. 20 min, TXA dar nesuleista.",
    "gp": {
     "AVPU": "V",
     "Radialinis pulsas": "silpnas"
    },
    "klaus": "(CMC) Ką darote su TXA?",
    "opt": [
     {
      "t": "Nebeskiriate – praėjo daugiau nei 3 val.",
      "ok": true
     },
     {
      "t": "Skiriate 2 g greitai, kad atsigriebtumėte už vėlavimą",
      "ok": false
     },
     {
      "t": "Skiriate 2 g lėtai – vėliau geriau nei niekada",
      "ok": false
     }
    ],
    "why": "TXA skiriama kuo anksčiau, ne vėliau kaip per 3 val. nuo sužalojimo; po 3 val. neskiriama. Leidžiama lėtai – per greitai leidžiant gali kristi kraujospūdis.",
    "ref": [
     "#/vaistas/txa",
     "#/igudis/20"
    ]
   }
  ]
 },
 {
  "id": "m20",
  "pav": "Pažasties kraujavimas (CMC)",
  "tema": "TFC",
  "lygis": "CMC",
  "q": [
   {
    "sit": "Snaiperio kulka pataikė kariui į dešinę pažastį. Ugnies nebėra (TFC), iš žaizdos kraujas teka srove.",
    "gp": {
     "AVPU": "A"
    },
    "klaus": "Kaip stabdote kraujavimą?",
    "opt": [
     {
      "t": "Turniketą dedate ant žasto – „aukštai ir tampriai“",
      "ok": false
     },
     {
      "t": "Spaudžiate, ranką atitraukiate 90° ant savo peties ir tamponuojate",
      "ok": true
     },
     {
      "t": "Ant žaizdos paviršiaus dedate spaudžiamąjį tvarstį ir stipriai vyniojate",
      "ok": false
     }
    ],
    "why": "Pažasties kraujavimo galūnės turniketu nesustabdysite. Iškart spauskite, sužeistojo ranką atitraukite 90° ir padėkite ant savo peties, tamponuokite hemostatiniu tvarsčiu ir spauskite ≥ 3 min.",
    "ref": [
     "#/igudis/7",
     "#/s/tfc-m"
    ]
   },
   {
    "sit": "Po 3 min spaudimo kraujavimas sustojo. Sužeistasis sėdi atsirėmęs į apkaso sienelę.",
    "gp": {
     "AVPU": "A"
    },
    "klaus": "Kaip tvarstote pažastį?",
    "opt": [
     {
      "t": "Du kartus aplink sužeistą petį, tada aštuoniuke aplink priešingą petį",
      "ok": true
     },
     {
      "t": "Spaudžiamąjį tvarstį vyniojate aplink krūtinę po abiem pažastimis",
      "ok": false
     },
     {
      "t": "Ant tampono – gertuvė, per ją turniketas aplink krūtinę",
      "ok": false
     }
    ],
    "why": "Pažastis: tvarstį du kartus apvyniokite aplink sužeistą petį, uždengdami tamponą, tada skersai per nugarą po priešinga pažastimi ir aplink priešingą petį – aštuoniuke. Geriausia tvarstyti sėdintį; žastą pririškite prie krūtinės.",
    "ref": [
     "#/igudis/7"
    ]
   },
   {
    "sit": "(CMC) Sutvarsčius sužeistasis tapo mieguistas, radialinis pulsas – silpnas (šokas). Įvedėte IO, suleidote TXA ir perpylėte vieną šaltai laikyto mažo titro O pilno kraujo vienetą. Dabar radialinis pulsas čiuopiamas, sąmonė pagerėjo.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "čiuopiamas"
    },
    "klaus": "(CMC) Ką darote toliau?",
    "opt": [
     {
      "t": "Perpilate kitą vienetą – kraujo per daug nebūna",
      "ok": false
     },
     {
      "t": "Kalcio neskiriate – tikslas pasiektas, jo nebereikia",
      "ok": false
     },
     {
      "t": "Skiriate kalcį, perpylimą stabdote – tikslas pasiektas",
      "ok": true
     }
    ],
    "why": "Po pirmojo perpilto produkto – kalcis: 30 ml 10 % kalcio gliukonato IV / IO. Gaivinama tik iki tikslo (čiuopiamas radialinis pulsas, pagerėjusi sąmonė ar sAKS 100 mm Hg); pasiekus – stabdykite.",
    "ref": [
     "#/igudis/20",
     "#/vaistas/kalcis"
    ]
   }
  ]
 },
 {
  "id": "m21",
  "pav": "Veido žaizda: leiskite sėdėti",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Minosvaidžio sviedinio skeveldra pataikė kariui į skruostą ir nosį, kraujas teka į burną. Jis sąmoningas, atsako, nori sėdėti, o kolega bando jį paguldyti ant nugaros.",
    "gp": {
     "AVPU": "A",
     "KD": "20"
    },
    "klaus": "Kokią padėtį pasirenkate?",
    "opt": [
     {
      "t": "Paguldote ant nugaros – taip lengviau apžiūrėti veidą",
      "ok": false
     },
     {
      "t": "Leidžiate sėdėti palinkus į priekį, kad kraujas ištekėtų",
      "ok": true
     },
     {
      "t": "Per prievartą guldote į stabilią šoninę padėtį",
      "ok": false
     }
    ],
    "why": "Sąmoningam su veido trauma leiskite pasirinkti padėtį, geriausiai saugančią kvėpavimo takus – sėdėti, palinkti į priekį. Sąmoningo per prievartą neguldykite.",
    "ref": [
     "#/igudis/9",
     "#/s/tfc-a"
    ]
   },
   {
    "sit": "Kolega siūlo stabilizuoti kaklą ir visą laiką rankomis laikyti galvą. Kitų sužalojimų, išskyrus skeveldros žaizdas, nėra; karys nekrito ir nebuvo nusviestas.",
    "gp": {
     "AVPU": "A"
    },
    "klaus": "Ar reikia stabilizuoti kaklą?",
    "opt": [
     {
      "t": "Ne – trauma tik penetruojanti, kaklo stabilizuoti nereikia",
      "ok": true
     },
     {
      "t": "Taip – veido trauma visada reikalauja kaklo stabilizacijos",
      "ok": false
     },
     {
      "t": "Taip – ir paguldyti ant kieto paviršiaus ant nugaros",
      "ok": false
     }
    ],
    "why": "Kai trauma tik penetruojanti, kaklo stabilizacija nereikalinga. Ji trukdytų sužeistajam sėdėti palinkus ir saugoti kvėpavimo takus.",
    "ref": [
     "#/s/tfc-a",
     "#/igudis/9"
    ]
   },
   {
    "sit": "Laukiant evakuacijos, karys apsnūsta, atsimerkia tik nuo skausmo, gargaliuoja, burnoje kraujas. Jis susmunka ant šono.",
    "gp": {
     "AVPU": "P",
     "KD": "10"
    },
    "klaus": "Ką darote?",
    "opt": [
     {
      "t": "Pasodinate atgal ir palenkiate jo galvą prie krūtinės",
      "ok": false
     },
     {
      "t": "Paguldote ant nugaros ir pirštais aklai išvalote burną",
      "ok": false
     },
     {
      "t": "Ant šono išvalote matomą kraują, tada – stabili šoninė padėtis",
      "ok": true
     }
    ],
    "why": "Gargaliavimas ir kraujas burnoje – obstrukcija. Matomą kraują šalinkite paguldę ant šono, aklai pirštais nekrapštykite. Atvėrus takus, nesąmoningą palikite stabilioje šoninėje padėtyje ir dažnai vertinkite iš naujo.",
    "ref": [
     "#/igudis/9",
     "#/igudis/10",
     "#/s/tfc-a"
    ]
   }
  ]
 },
 {
  "id": "m22",
  "pav": "Sudarkytas žandikaulis (CMC)",
  "tema": "TFC",
  "lygis": "CMC",
  "q": [
   {
    "sit": "(CMC) Drono numesta granata sprogo prie apkaso. Kario apatinis žandikaulis sudarkytas, jis guli, gargaliuoja, burnoje kraujas ir dantų skeveldros. Šalia yra CLS.",
    "gp": {
     "AVPU": "V",
     "KD": "28",
     "SpO₂": "88 %"
    },
    "klaus": "(CMC) Ką darote pirmiausia?",
    "opt": [
     {
      "t": "Iškart atliekate krikotiroidotomiją, nebandę atsiurbti",
      "ok": false
     },
     {
      "t": "Atsiurbiate, keičiate padėtį, atveriate kvėpavimo takus",
      "ok": true
     },
     {
      "t": "Įvedate NPA ir paliekate ant nugaros – takai apsaugoti",
      "ok": false
     }
    ],
    "why": "Prieš krikotiroidotomiją įsitikinkite, kad obstrukcija išlieka po padėties, atvėrimo manevrų ir atsiurbimo. NPA nuo aspiracijos neapsaugo.",
    "ref": [
     "#/igudis/13",
     "#/igudis/9",
     "#/s/tfc-a"
    ]
   },
   {
    "sit": "(CMC) Nepaisant atsiurbimo ir padėties, kraujas vis užlieja ryklę, oras beveik nepraeina, SpO₂ krenta.",
    "gp": {
     "SpO₂": "82 %",
     "KD": "32"
    },
    "klaus": "(CMC) Ką darote?",
    "opt": [
     {
      "t": "Laukiate, kol SpO₂ nukris dar žemiau, – tada pjaunate",
      "ok": false
     },
     {
      "t": "Krikotiroidotomija: 1 cm skersinis odos pjūvis, membraną duriate giliai",
      "ok": false
     },
     {
      "t": "Krikotiroidotomija: ~2,5 cm vertikalus odos pjūvis, membrana – skersai ~1,3 cm",
      "ok": true
     }
    ],
    "why": "Neišsprendžiama obstrukcija dėl veido ir žandikaulių sužalojimų ir kraujo – krikotiroidotomija be delsimo. Odos pjūvis ~2,5 cm vertikalus, membrana perpjaunama skersai ~1,3 cm, ne giliau. Atidėti, kol sužeistasis taps hipoksiškas, – klaida.",
    "ref": [
     "#/igudis/13",
     "#/s/tfc-a"
    ]
   },
   {
    "sit": "(CMC) Kaniulė įvesta ant bužo, manžetė pripūsta 10 ml oro. Dešinėje kvėpavimas girdimas, kairėje – ne, krūtinė kyla nevienodai.",
    "gp": {
     "SpO₂": "85 %"
    },
    "klaus": "(CMC) Ką darote?",
    "opt": [
     {
      "t": "Šiek tiek atitraukiate kaniulę, tikrinate EtCO₂",
      "ok": true
     },
     {
      "t": "Įstumiate kaniulę giliau – ji įvesta per sekliai",
      "ok": false
     },
     {
      "t": "Nieko nekeičiate – dešinėje kvėpavimas girdėti",
      "ok": false
     }
    ],
    "why": "Kairėje negirdėti kvėpavimo – kaniulė per giliai, ją atitraukite. Padėtį tikrinkite garsais abipus, vienodu krūtinės kilimu ir nuolatine kapnografija (EtCO₂), tada kaniulę pritvirtinkite.",
    "ref": [
     "#/igudis/13"
    ]
   }
  ]
 },
 {
  "id": "m23",
  "pav": "Lipdukas ir nugaros žaizda",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Patrulio metu granatos skeveldra pataikė kariui į kairę krūtinės pusę. Priekinę burbuliuojančią žaizdą jau užklijavote ventiliuojamu lipduku.",
    "gp": {
     "AVPU": "A",
     "KD": "26"
    },
    "klaus": "Ką darote toliau R dalyje?",
    "opt": [
     {
      "t": "Pasodinate ir iškart pereinate prie C",
      "ok": false
     },
     {
      "t": "Ant pirmojo lipduko klijuojate dar vieną",
      "ok": false
     },
     {
      "t": "Paverčiate ir apžiūrite pažastis bei nugarą",
      "ok": true
     }
    ],
    "why": "Užklijavę lipduką, paverskite sužeistąjį ir apžiūrėkite pažastis bei nugarą – neapžiūrėjus praleidžiamos išėjimo žaizdos. Kitas atviras žaizdas klijuokite ta tvarka, kuria randate.",
    "ref": [
     "#/igudis/15",
     "#/igudis/14",
     "#/s/tfc-r"
    ]
   },
   {
    "sit": "Nugaroje, virš apatinių šonkaulių, – dar viena burbuliuojanti žaizda. Krūtinės lipdukų nebeliko, turite plastikinį maišelį ir lipnią juostą.",
    "gp": {
     "KD": "28"
    },
    "klaus": "Kaip sandarinate?",
    "opt": [
     {
      "t": "Maišelis ≥ 5 cm aplink žaizdą, priklijuotas iš visų 4 pusių",
      "ok": true
     },
     {
      "t": "Maišelis, priklijuotas tik iš 3 pusių, kad išeitų oras",
      "ok": false
     },
     {
      "t": "Paliekate atvirą – nugaros žaizdų nesandarina",
      "ok": false
     }
    ],
    "why": "Sandarinkite visas atviras liemens žaizdas (nugaroje – iki apatinių šonkaulių). Improvizuotas lipdukas – orui nelaidi plėvelė, dengianti ≥ 5 cm aplink žaizdą, priklijuota iš visų 4 pusių.",
    "ref": [
     "#/igudis/15",
     "#/s/tfc-r"
    ]
   },
   {
    "sit": "Perkėlus ant neštuvų, kvėpavimas dažnėja, distresas didėja, kairėje kvėpavimo garsai labai susilpnėję.",
    "gp": {
     "KD": "34",
     "SpO₂": "87 %"
    },
    "klaus": "Ką darote pirmiausia?",
    "opt": [
     {
      "t": "Laukiate kaklo venų išsipūtimo ir trachėjos poslinkio",
      "ok": false
     },
     {
      "t": "„Atpučiate“ lipdukus ir vertinate iš naujo",
      "ok": true
     },
     {
      "t": "Iškart atliekate NDC dešinėje, sveikoje pusėje",
      "ok": false
     }
    ],
    "why": "Liemens trauma, didėjantis distresas, susilpnėję garsai vienoje pusėje ir SpO₂ < 90 % – įtampos pneumotoraksas. Pirma „atpūskite“ ar nuimkite lipdukus (ypač neventiliuojamą nugaroje) ir įvertinkite iš naujo; vėlyvų požymių nelaukite. Vertinkite po kiekvieno perkėlimo.",
    "ref": [
     "#/igudis/14",
     "#/igudis/15",
     "#/s/tfc-r"
    ]
   }
  ]
 },
 {
  "id": "m24",
  "pav": "NDC po sprogimo bangos",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Prie kolonos sprogo SSU; karį sprogimo banga nusviedė nuo šarvuočio. Krūtinėje žaizdų nėra, bet jis dūsta, dešinėje kvėpavimas negirdimas.",
    "gp": {
     "AVPU": "A",
     "KD": "36",
     "SpO₂": "84 %"
    },
    "klaus": "Ką darote?",
    "opt": [
     {
      "t": "Krūtinės žaizdos nėra – pneumotorakso būti negali",
      "ok": false
     },
     {
      "t": "Laukiate kaklo venų išsipūtimo ir trachėjos poslinkio",
      "ok": false
     },
     {
      "t": "Įtariate įtampos pneumotoraksą – NDC dešinėje",
      "ok": true
     }
    ],
    "why": "Pirminė sprogimo trauma ir distresas, vienoje pusėje negirdimas kvėpavimas, SpO₂ < 90 % – įtampos pneumotoraksas galimas ir po bukos traumos. Lipduko nėra – iškart NDC pažeistoje pusėje.",
    "ref": [
     "#/igudis/14",
     "#/igudis/16",
     "#/s/tfc-r"
    ]
   },
   {
    "sit": "NDC atlikta 5-ajame tarpšonkaulyje priekinėje pažasties linijoje. Dėl variklių triukšmo šnypštimo negirdėjote, bet karys kvėpuoja lengviau, SpO₂ lėtai kyla.",
    "gp": {
     "KD": "28",
     "SpO₂": "89 %"
    },
    "klaus": "Kaip vertinate NDC?",
    "opt": [
     {
      "t": "Nepavyko – negirdėjote šnypštimo, kartojate",
      "ok": false
     },
     {
      "t": "Pavyko – stebite; SpO₂ ≥ 90 % gali užtrukti kelias minutes",
      "ok": true
     },
     {
      "t": "Pavyko – kateterį ištraukiate, nes jo nebereikia",
      "ok": false
     }
    ],
    "why": "Sėkmė – palengvėjęs distresas, šnypštimas, SpO₂ ≥ 90 % (gali užtrukti kelias minutes). Triukšme negirdint šnypštimo NDC nepavykusia nelaikoma. Kateteris paliekamas ir stebimas.",
    "ref": [
     "#/igudis/16",
     "#/s/tfc-r"
    ]
   },
   {
    "sit": "Po 20 min, laukiant evakuacijos, distresas vėl didėja, dešinėje kvėpavimo garsai vėl susilpnėję.",
    "gp": {
     "KD": "34",
     "SpO₂": "86 %"
    },
    "klaus": "Ką darote?",
    "opt": [
     {
      "t": "Kartojate NDC toje pačioje vietoje nauja adata",
      "ok": true
     },
     {
      "t": "Į esamą kateterį vėl įkišate tą pačią adatą",
      "ok": false
     },
     {
      "t": "Kartojate NDC kairėje, sveikoje pusėje",
      "ok": false
     }
    ],
    "why": "Simptomai grįžo po sėkmingos NDC – kartokite toje pačioje vietoje nauja adata. Kartoti ta pačia adata – klaida; kateteris galėjo užsilenkti ar užsikimšti.",
    "ref": [
     "#/igudis/16",
     "#/s/tfc-r"
    ]
   }
  ]
 },
 {
  "id": "m25",
  "pav": "NDC nepadėjo",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Artilerijos skeveldra – kairėje krūtinės pusėje. Lipdukas užklijuotas ir „atpūstas“, bet distresas didėja. Duriate NDC 5-ajame tarpšonkaulyje priekinėje pažasties linijoje, adata įvesta iki jungties.",
    "gp": {
     "KD": "38",
     "SpO₂": "84 %"
    },
    "klaus": "Ką darote su adata?",
    "opt": [
     {
      "t": "Paliekate adatą kateteryje, kad šis neužsilenktų",
      "ok": false
     },
     {
      "t": "Iškart ištraukiate adatą kartu su kateteriu",
      "ok": false
     },
     {
      "t": "Laikote 5–10 s, adatą ištraukiate, kateterį paliekate",
      "ok": true
     }
    ],
    "why": "Įdūrę iki jungties, laikykite 5–10 s, adatą ištraukite, kateterį palikite. Tada įvertinkite sėkmę.",
    "ref": [
     "#/igudis/16",
     "#/s/tfc-r"
    ]
   },
   {
    "sit": "Po kelių minučių distresas nesumažėjo, kairėje kvėpavimas vis dar negirdimas.",
    "gp": {
     "KD": "38",
     "SpO₂": "82 %"
    },
    "klaus": "Ką darote toliau?",
    "opt": [
     {
      "t": "Antra NDC nauja adata: kairėje, 2-asis tarpšonkaulis",
      "ok": true
     },
     {
      "t": "Antra NDC ta pačia adata, toje pačioje vietoje",
      "ok": false
     },
     {
      "t": "Antra NDC prie krūtinkaulio, mediališkiau spenelio linijos",
      "ok": false
     }
    ],
    "why": "NDC nepadėjo – antra NDC toje pačioje pusėje, kitoje vietoje, nauja adata (galima ir priešinga pusė). Duriama ne mediališkiau spenelio linijos; ta pati adata ar vieta – klaida.",
    "ref": [
     "#/igudis/16",
     "#/s/tfc-r"
    ]
   },
   {
    "sit": "Nepadėjo ir antra NDC. Karys sumišęs, odą išpylė šaltas prakaitas, galvos traumos požymių nėra.",
    "gp": {
     "AVPU": "V",
     "Radialinis pulsas": "silpnas",
     "ŠSD": "132"
    },
    "klaus": "Ką darote?",
    "opt": [
     {
      "t": "Trečia NDC toje pačioje vietoje, ta pačia adata",
      "ok": false
     },
     {
      "t": "Pereinate prie C: tikrinate kraujavimą, šildote",
      "ok": true
     },
     {
      "t": "Nuimate lipduką ir paliekate žaizdą atvirą orui",
      "ok": false
     }
    ],
    "why": "Nepadėjo ir antra NDC – pereikite prie C. Sutrikusi sąmonė be galvos traumos ir silpnas radialinis pulsas – šokas: iš naujo tikrinkite kraujavimą, šildykite, praneškite medikui, skubinkite evakuaciją.",
    "ref": [
     "#/igudis/16",
     "#/igudis/17",
     "#/s/tfc-c"
    ]
   }
  ]
 },
 {
  "id": "m26",
  "pav": "Sprogimo banga ir dubuo",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Pėsčiųjų patrulio narį nusviedė SSU sprogimas. Kairė blauzda beveik nutraukta, turniketas uždėtas, kraujavimas sustojo. Jūs – CLS, apmokytas dėti dubens diržą.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "čiuopiamas",
     "Skausmas": "8/10"
    },
    "klaus": "Ar reikia dubens diržo?",
    "opt": [
     {
      "t": "Ne – turniketas kraujavimą jau sustabdė",
      "ok": false
     },
     {
      "t": "Taip – sprogimo trauma ir beveik amputacija",
      "ok": true
     },
     {
      "t": "Tik jei dubuo akivaizdžiai deformuotas",
      "ok": false
     }
    ],
    "why": "Indikacija – sunki buka ar sprogimo trauma IR bent vienas požymis, pvz., didelė kojos amputacija ar beveik amputacija. Turniketas dėl amputacijos diržo poreikio neatmeta.",
    "ref": [
     "#/igudis/18",
     "#/s/tfc-c"
    ]
   },
   {
    "sit": "Komercinio dubens diržo nėra. Turite skarą, kišenėse – žiebtuvėlis ir šovinių dėtuvė.",
    "gp": {},
    "klaus": "Kaip elgiatės?",
    "opt": [
     {
      "t": "Diržo nėra – dubens nestabilizuojate, tik pranešate",
      "ok": false
     },
     {
      "t": "Skarą užveržiate ties juosmeniu, kišenių netikrinate",
      "ok": false
     },
     {
      "t": "Ištuštinate kišenes, skarą užveržiate didžiųjų gūbrių lygyje",
      "ok": true
     }
    ],
    "why": "Nesant diržo – improvizuotas (pvz., skara) didžiųjų gūbrių lygyje. Prieš tai išimkite daiktus iš kišenių; ant juosmens ar klubakaulių keterų lūžis nesumažinamas.",
    "ref": [
     "#/igudis/18",
     "#/s/tfc-c"
    ]
   },
   {
    "sit": "Laukiant evakuacijos, po 15 min karys tampa mieguistas, radialinis pulsas susilpnėja. Turniketo vieta nekraujuoja.",
    "gp": {
     "AVPU": "V",
     "Radialinis pulsas": "silpnas",
     "ŠSD": "128"
    },
    "klaus": "Ką darote?",
    "opt": [
     {
      "t": "Tikrinate kraujavimą, diržą uždedate iš naujo",
      "ok": true
     },
     {
      "t": "Atlaisvinate diržą – gal jis per stipriai spaudžia",
      "ok": false
     },
     {
      "t": "Atrišate kojas, kad pagerėtų jų kraujotaka",
      "ok": false
     }
    ],
    "why": "Šokas atsiranda ar blogėja – iš naujo patikrinkite visą kraujavimą ir turniketus, jei leidžia taktinė situacija, diržą uždėkite iš naujo, praneškite medikui ir skubinkite evakuaciją. Diržo nenuimkite, kojos lieka surištos.",
    "ref": [
     "#/igudis/18",
     "#/igudis/17",
     "#/s/tfc-c"
    ]
   }
  ]
 },
 {
  "id": "m27",
  "pav": "Šokas be matomo kraujavimo (CMC)",
  "tema": "TFC",
  "lygis": "CMC",
  "q": [
   {
    "sit": "Minosvaidžio skeveldra pataikė į pilvą žemiau šonkaulių; įėjimo anga maža, išorinis kraujavimas menkas. Po 20 min karys atsimerkia ir sudejuoja tik spaudžiant nago guolį. Galvos traumos požymių nėra.",
    "gp": {
     "KD": "26"
    },
    "klaus": "Kaip vertinate sąmonę?",
    "opt": [
     {
      "t": "V – reaguoja į balsą, šoko požymių nėra",
      "ok": false
     },
     {
      "t": "A – akys atmerktos, sąmonė nesutrikusi",
      "ok": false
     },
     {
      "t": "P – sąmonė sutrikusi, tai šoko požymis",
      "ok": true
     }
    ],
    "why": "Reaguoja tik į skausmą (nago guolio spaudimas) – P. Sąmonės sutrikimas be galvos smegenų traumos – šoko požymis.",
    "ref": [
     "#/igudis/17",
     "#/s/tfc-c"
    ]
   },
   {
    "sit": "Dešinysis dilbis sužeistas, ant jo – turniketas. Kairioji ranka sveika.",
    "gp": {
     "AVPU": "P"
    },
    "klaus": "Kaip čiuopiate radialinį pulsą?",
    "opt": [
     {
      "t": "Kairėje, smiliumi ir didžiuoju pirštu, 15 s × 4",
      "ok": true
     },
     {
      "t": "Dešinėje, su turniketu, nykščiu",
      "ok": false
     },
     {
      "t": "Kairėje, nykščiu, skaičiuojate visą minutę",
      "ok": false
     }
    ],
    "why": "Radialinis pulsas – sveikoje rankoje, smiliumi ir didžiuoju pirštu; dūžiai per 15 s × 4. Nykščiu jaučiamas savas pulsas; rankoje su turniketu pulsas nevertinamas.",
    "ref": [
     "#/igudis/17"
    ]
   },
   {
    "sit": "(CMC) Radialinis pulsas silpnas, dažnas.",
    "gp": {
     "AVPU": "P",
     "Radialinis pulsas": "silpnas",
     "ŠSD": "130"
    },
    "klaus": "(CMC) Ką darote?",
    "opt": [
     {
      "t": "IV skysčių nereikia – išorinio kraujavimo nėra",
      "ok": false
     },
     {
      "t": "IV / IO, TXA 2 g lėtai ir kraujas – tikėtina transfuzija",
      "ok": true
     },
     {
      "t": "250 ml hipertoninio NaCl tūriui atkurti",
      "ok": false
     }
    ],
    "why": "Hemoraginis šokas ir penetruojanti liemens trauma – tikėtina transfuzija: IV / IO, TXA 2 g lėtai, kraujo produktai. Hipertoninis NaCl skiriamas tik esant smegenų išvaržos požymiams, ne tūriui atkurti.",
    "ref": [
     "#/igudis/20",
     "#/vaistas/nacl-hipert",
     "#/s/tfc-c"
    ]
   }
  ]
 },
 {
  "id": "m28",
  "pav": "TXA laiko langas (CMC)",
  "tema": "TFC",
  "lygis": "CMC",
  "q": [
   {
    "sit": "(CMC) 13:10 drono numesta granata sužeidė du karius apkase; dėl dronų grėsmės juos pasiekiate tik 15:30. Pirmajam – turniketas ant šlaunies, jis šoke. Dešinysis žastas subjaurotas skeveldrų, du IV bandymai nepavyko.",
    "gp": {
     "AVPU": "V",
     "Radialinis pulsas": "silpnas",
     "ŠSD": "126"
    },
    "klaus": "(CMC) Kur įvedate prieigą?",
    "opt": [
     {
      "t": "IO į dešinįjį žastikaulį – jis arčiau",
      "ok": false
     },
     {
      "t": "IO į kairįjį, nesužeistą žastikaulį",
      "ok": true
     },
     {
      "t": "Bandote IV dar 10 min, IO – tik paskutinė išeitis",
      "ok": false
     }
    ],
    "why": "IV greitai nepavyksta (pvz., 2 bandymai) – IO. Į sužalotą kaulą IO nedėkite. Per ilgai bandant IV vėluoja TXA ir kraujas.",
    "ref": [
     "#/igudis/19",
     "#/s/tfc-c"
    ]
   },
   {
    "sit": "(CMC) 15:45 IO veikia. Nuo sužeidimo praėjo 2 val. 35 min.",
    "gp": {
     "Radialinis pulsas": "silpnas"
    },
    "klaus": "(CMC) Ar skiriate TXA?",
    "opt": [
     {
      "t": "Taip – 2 g greita injekcija, nes baigiasi laikas",
      "ok": false
     },
     {
      "t": "Ne – praėjo daugiau kaip 1 val.",
      "ok": false
     },
     {
      "t": "Taip – 2 g lėtai IV / IO dabar, dar per 3 val.",
      "ok": true
     }
    ],
    "why": "TXA 2 g lėtai IV / IO kuo anksčiau, ne vėliau kaip per 3 val. nuo sužeidimo. Greitai leidžiant gali kristi kraujospūdis. Laiką užrašykite į kortelę.",
    "ref": [
     "#/vaistas/txa",
     "#/igudis/20",
     "#/s/tfc-c"
    ]
   },
   {
    "sit": "(CMC) Antrasis karys iš to paties apkaso: išorinio kraujavimo nėra, radialinis pulsas stiprus, bet po sprogimo jis sumišęs.",
    "gp": {
     "AVPU": "V",
     "Radialinis pulsas": "stiprus"
    },
    "klaus": "(CMC) Ar jam reikia TXA?",
    "opt": [
     {
      "t": "Taip – sutrikusi sąmonė po sprogimo yra indikacija",
      "ok": true
     },
     {
      "t": "Ne – nėra nei šoko, nei kraujavimo",
      "ok": false
     },
     {
      "t": "Ne – vietoj jo profilaktiškai hipertoninis NaCl",
      "ok": false
     }
    ],
    "why": "TXA indikacija – ir reikšminga galvos smegenų trauma ar sąmonės sutrikimas po sprogimo ar bukos traumos, net be šoko. Hipertoninio NaCl profilaktiškai neskirkite – tik esant išvaržos požymiams.",
    "ref": [
     "#/vaistas/txa",
     "#/vaistas/nacl-hipert",
     "#/igudis/20"
    ]
   }
  ]
 },
 {
  "id": "m29",
  "pav": "Kraujo perpylimas lauke (CMC)",
  "tema": "TFC",
  "lygis": "CMC",
  "q": [
   {
    "sit": "(CMC) Kuopos medicinos punkte – karys po šautinės šlaunies žaizdos, šoke; turniketas veiksmingas, IO veikia, TXA suleista. Turite tik šaltai laikyto mažo titro O Rh teigiamo pilno kraujo, EldonCard dar nepadaryta.",
    "gp": {
     "AVPU": "V",
     "Radialinis pulsas": "silpnas",
     "ŠSD": "134"
    },
    "klaus": "(CMC) Ką darote?",
    "opt": [
     {
      "t": "Laukiate EldonCard grupės nustatymo rezultato",
      "ok": false
     },
     {
      "t": "Neperpilate – Rh neigiamo kraujo neturite",
      "ok": false
     },
     {
      "t": "Perpilate iš karto – šoke tinka Rh teigiamas",
      "ok": true
     }
    ],
    "why": "Pirmenybė – šaltai laikytas mažo titro O pilnas kraujas. Jei Rh neigiamo iš karto nėra, šoke tinka Rh teigiamas; grupės nustatymas perpylimo nevėlina.",
    "ref": [
     "#/igudis/20",
     "#/s/tfc-c"
    ]
   },
   {
    "sit": "(CMC) Ruošiate perpylimo sistemą. Kolega siūlo sutaupyti laiko.",
    "gp": {},
    "klaus": "(CMC) Kaip perpilate?",
    "opt": [
     {
      "t": "Su filtru ir šildytuvu (38 °C), sužeistąjį šildote",
      "ok": true
     },
     {
      "t": "Be filtro – taip kraujas suteka daug greičiau",
      "ok": false
     },
     {
      "t": "Be šildytuvo – kraujas sušils pačiame kūne",
      "ok": false
     }
    ],
    "why": "Kraujas perpilamas per sistemą su kraujo filtru ir šildytuvu (38 °C); per IO – su spaudimo maišu. Sužeistąjį šildykite – hipotermija blogina krešėjimą.",
    "ref": [
     "#/igudis/20",
     "#/igudis/19"
    ]
   },
   {
    "sit": "(CMC) Pirmasis vienetas baigtas, 30 ml 10 % kalcio gliukonato suleista. Radialinis pulsas čiuopiamas, karys atsimerkęs, atsako aiškiai.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "čiuopiamas",
     "ŠSD": "108"
    },
    "klaus": "(CMC) Ar pilate antrą vienetą?",
    "opt": [
     {
      "t": "Taip – pilate visus vienetus iš eilės",
      "ok": false
     },
     {
      "t": "Ne – tikslas pasiektas: stabdote ir stebite",
      "ok": true
     },
     {
      "t": "Taip – kol sAKS pasieks 140 mm Hg",
      "ok": false
     }
    ],
    "why": "Gaivinama tik iki tikslo: čiuopiamas radialinis pulsas, pagerėjusi sąmonė ar sAKS 100 mm Hg. Po kiekvieno vieneto vertinkite iš naujo; šokas kartojasi – tikrinkite visą kraujavimą.",
    "ref": [
     "#/igudis/20",
     "#/vaistas/kalcis",
     "#/s/tfc-c"
    ]
   }
  ]
 },
 {
  "id": "m30",
  "pav": "Trauminis sustojimas po šūvio",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Snaiperio kulka pataikė kariui į krūtinę. Jį ištraukus už priedangos, miego arterijos pulso nėra, nekvėpuoja, kitų gyvybės požymių nėra. Netoliese – dar vienas sužeistasis.",
    "gp": {
     "AVPU": "U",
     "KD": "0",
     "Radialinis pulsas": "nečiuopiamas"
    },
    "klaus": "Ką darote?",
    "opt": [
     {
      "t": "CPR nepradedate; prieš nutraukdami – abipusė NDC",
      "ok": true
     },
     {
      "t": "Pradedate CPR ir tęsiate iki evakuacijos",
      "ok": false
     },
     {
      "t": "Iškart nutraukiate pagalbą ir einate prie kito",
      "ok": false
     }
    ],
    "why": "TFC metu penetruojančios traumos sužeistojo be gyvybės požymių negaivinkite. Liemens trauma be pulso ir kvėpavimo – prieš nutraukdami pagalbą atlikite NDC abiejose pusėse.",
    "ref": [
     "#/igudis/35",
     "#/igudis/16"
    ]
   },
   {
    "sit": "Ruošiatės NDC. Kulkos anga – dešinėje, kairė krūtinės pusė nesužeista.",
    "gp": {},
    "klaus": "Kaip atliekate NDC?",
    "opt": [
     {
      "t": "Tik dešinėje, pažeistoje pusėje – kairėje nereikia",
      "ok": false
     },
     {
      "t": "Abiejose pusėse ties spenelio linija ar mediališkiau",
      "ok": false
     },
     {
      "t": "Abiejose pusėse: 5-asis tarpšonkaulis, priekinė pažasties linija",
      "ok": true
     }
    ],
    "why": "Trauminiam sustojimui – NDC abiejose pusėse: 14 G ar 10 G, 8 cm adata-kateteris, 5-asis tarpšonkaulis priekinėje pažasties linijoje arba 2-asis vidurinėje raktikaulio linijoje, ne mediališkiau spenelio linijos.",
    "ref": [
     "#/igudis/35",
     "#/igudis/16"
    ]
   },
   {
    "sit": "Abipusė NDC atlikta. Sąmonė ir radialinis pulsas negrįžta.",
    "gp": {
     "AVPU": "U",
     "Radialinis pulsas": "nečiuopiamas"
    },
    "klaus": "Ką darote?",
    "opt": [
     {
      "t": "Kartojate NDC kas 5 min iki pat evakuacijos",
      "ok": false
     },
     {
      "t": "Pradedate CPR, nes abipusė NDC nepadėjo",
      "ok": false
     },
     {
      "t": "Nutraukiate pagalbą ir padedate kitam sužeistajam",
      "ok": true
     }
    ],
    "why": "Sąmonė ir radialinis pulsas negrįžta – TFC metu pagalba nutraukiama, rūpinkitės kitais sužeistaisiais. Sprendimą, laikus ir veiksmus įrašykite į kortelę (DD 1380), praneškite vadui.",
    "ref": [
     "#/igudis/35",
     "#/igudis/31"
    ]
   }
  ]
 },
 {
  "id": "m31",
  "pav": "Kritimas į upę forsuojant",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Forsuojant upę naktį skeveldra sužeidė kario dilbį – jis įkrito į šaltą vandenį. Ištrauktas į krantą už priedangos, turniketas veiksmingas, drabužiai permirkę, karys stipriai dreba.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "stiprus",
     "ŠSD": "104"
    },
    "klaus": "Kada pradedate hipotermijos prevenciją?",
    "opt": [
     {
      "t": "Tik prieš evakuaciją, kai atvyks transportas",
      "ok": false
     },
     {
      "t": "Dabar – kraujavimas sustabdytas, šokas įvertintas",
      "ok": true
     },
     {
      "t": "Nereikia – jis budrus, nešoke ir dreba",
      "ok": false
     }
    ],
    "why": "Hipotermijos lengviau išvengti, nei ją gydyti: prevenciją pradėkite iškart sustabdę kraujavimą ir įvertinę šoką, ne prieš evakuaciją. Ji taikoma visiems sužeistiesiems.",
    "ref": [
     "#/igudis/21",
     "#/s/tfc-h"
    ]
   },
   {
    "sit": "Karys guli ant akmenuoto kranto, pučia vėjas. Turite šildantį apvalkalą, aktyvaus šildymo antklodę ir sausą aprangos komplektą.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "stiprus"
    },
    "klaus": "Kas teisinga?",
    "opt": [
     {
      "t": "Izoliuojate nuo žemės, šlapius drabužius keičiate sausais",
      "ok": true
     },
     {
      "t": "Apvyniojate su šlapiais drabužiais – apvalkalas sulaikys šilumą",
      "ok": false
     },
     {
      "t": "Šarvinę liemenę ir šalmą paliekate krante",
      "ok": false
     }
    ],
    "why": "Izoliuokite nuo šaltos žemės, pridenkite nuo vėjo; šlapius drabužius nuimkite ir, jei įmanoma, pakeiskite sausais. Apsaugos priemones (liemenę, šalmą) laikykite su sužeistuoju.",
    "ref": [
     "#/igudis/21",
     "#/s/tfc-h"
    ]
   },
   {
    "sit": "Karys guli išskleisto šildančio apvalkalo viduryje, bus vežamas atviru visureigiu. Atidarote aktyvaus šildymo antklodę.",
    "gp": {
     "AVPU": "A"
    },
    "klaus": "Kaip ją uždedate?",
    "opt": [
     {
      "t": "Tiesiai ant odos, apvyniodami aplink liemenį",
      "ok": false
     },
     {
      "t": "Ant pėdų ir plaštakų; galvą ir veidą uždengiate",
      "ok": false
     },
     {
      "t": "Ant krūtinės ir pažasčių, ne ant odos; veidas atviras",
      "ok": true
     }
    ],
    "why": "Aktyvaus šildymo antklodė – ant priekinio liemens ir pažasčių, ne tiesiai ant odos ir neapvyniojant liemens (nudegimai). Apvyniokite visą kūną su galva, veidą palikite atidengtą; atviroje transporto priemonėje saugokite nuo vėjo, prevenciją pažymėkite kortelėje (DD 1380).",
    "ref": [
     "#/igudis/21",
     "#/s/tfc-h"
    ]
   }
  ]
 },
 {
  "id": "m32",
  "pav": "Skeveldra akyje",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "FPV dronas numetė granatą prie apkaso. Karys be balistinių akinių laikosi už kairės akies – iš jos kyšo smulki metalo skeveldra, aplink patinę. MARCH sutvarkytas.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "stiprus",
     "Skausmas": "6/10"
    },
    "klaus": "Kaip patikrinate regėjimą?",
    "opt": [
     {
      "t": "Pirštais atveriate patinusią akį ir pašviečiate žibintuvėliu",
      "ok": false
     },
     {
      "t": "Praleidžiate – akis vis tiek bus uždengta skydeliu",
      "ok": false
     },
     {
      "t": "Uždengia sveiką akį: tekstas, pirštai, judesys, šviesa; tada kita",
      "ok": true
     }
    ],
    "why": "Greita regėjimo patikra: uždengus sveiką akį, per ištiestos rankos atstumą – skaito tekstą, skaičiuoja pirštus, mato rankos judesį, skiria šviesą nuo tamsos; pakartokite kitai akiai. Patinusios akies jėga neatverkite, rezultatą užrašykite.",
    "ref": [
     "#/igudis/23",
     "#/s/tfc-h"
    ]
   },
   {
    "sit": "Kaire akimi karys skiria tik šviesą nuo tamsos. Skeveldra kyšo apie 1 cm; turite standų akies skydelį ir pleistrą.",
    "gp": {},
    "klaus": "Kaip uždengiate akį?",
    "opt": [
     {
      "t": "Ištraukiate skeveldrą ir dedate spaudžiamąjį tvarstį ant akies",
      "ok": false
     },
     {
      "t": "Skydelyje išpjaunate angą, tvirtinate 45° per kaktą ir skruostą",
      "ok": true
     },
     {
      "t": "Spaudžiamasis tvarstis per abi akis, kad nejudėtų",
      "ok": false
     }
    ],
    "why": "Įsmigusio daikto netraukite. Standus skydelis remiasi į akiduobės kaulus ir akies neliečia – išpjaukite angą daiktui, pritvirtinkite pleistru 45° kampu. Spaudžiamasis tvarstis gali išstumti akies turinį; sveikos akies neuždenkite.",
    "ref": [
     "#/igudis/23",
     "#/s/tfc-h"
    ]
   },
   {
    "sit": "Skydelis pritvirtintas. Karys budrus, gali nuryti, alergijų neturi.",
    "gp": {
     "AVPU": "A",
     "Skausmas": "6/10"
    },
    "klaus": "Kokius vaistus duodate?",
    "opt": [
     {
      "t": "CWMP ir cefadroksilis 1 g per burną kuo greičiau",
      "ok": true
     },
     {
      "t": "Tik CWMP – akies traumai antibiotiko nereikia",
      "ok": false
     },
     {
      "t": "Tik CWMP – jame yra antibiotikas moksifloksacinas",
      "ok": false
     }
    ],
    "why": "Penetruojantis akies sužalojimas – antibiotikas kuo greičiau: cefadroksilis 1 g per burną; sąmoningam – CWMP. TCCC 2026 CWMP antibiotiko nebeturi, moksifloksacinas – pasenęs.",
    "ref": [
     "#/igudis/23",
     "#/igudis/26",
     "#/vaistas/cefadroksilis"
    ]
   }
  ]
 },
 {
  "id": "m33",
  "pav": "Pilvo evisceracija",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Prie posto sprogo minosvaidžio mina. Karys turi skeveldros žaizdą pilve – pro ją iškritusios žarnų kilpos. Masyvaus kraujavimo nėra.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "stiprus",
     "ŠSD": "112"
    },
    "klaus": "Ką darote su iškritusiais organais?",
    "opt": [
     {
      "t": "Sugrąžinate į pilvą ir užklijuojate žaizdą",
      "ok": false
     },
     {
      "t": "Paliekate atvirus, kad matytumėte, ar nekraujuoja",
      "ok": false
     },
     {
      "t": "Ant nugaros, keliai sulenkti; drėgnas tvarstis ir plėvelė",
      "ok": true
     }
    ],
    "why": "Paguldykite ant nugaros sulenktais keliais; organus uždenkite drėgnu steriliu tvarsčiu ir skaidria nelipnia vandeniui nepralaidžia plėvele, kraštus priklijuokite. Atviri ar sausi organai džiūsta ir atšąla; organų grąžinimas – CMC.",
    "ref": [
     "#/igudis/27",
     "#/s/tfc-paws"
    ]
   },
   {
    "sit": "Žaizda uždengta. Karys skundžiasi stipriu skausmu, prašo vandens ir tablečių nuo skausmo.",
    "gp": {
     "AVPU": "A",
     "Skausmas": "8/10"
    },
    "klaus": "Ką darote?",
    "opt": [
     {
      "t": "Nieko per burną – kviečiate mediką (CMC)",
      "ok": true
     },
     {
      "t": "CWMP ir cefadroksilis su gurkšniu vandens",
      "ok": false
     },
     {
      "t": "Tik cefadroksilis – infekcija svarbiausia",
      "ok": false
     }
    ],
    "why": "Evisceracija – nieko per burną: nei CWMP, nei geriamojo antibiotiko. Medikas (CMC) skiria ketaminą ir antibiotiką IV / IO / IM.",
    "ref": [
     "#/igudis/27",
     "#/igudis/26"
    ]
   },
   {
    "sit": "Sužeistąjį perkeliate ant neštuvų ir nešate į evakuacijos punktą; lauke šlapdriba.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "stiprus"
    },
    "klaus": "Ką darote po perkėlimo?",
    "opt": [
     {
      "t": "Nieko – tvarstį ir kraujavimą patikrins Role 1",
      "ok": false
     },
     {
      "t": "Tvarstį, kraujavimą, šoko požymius; saugote nuo šalčio",
      "ok": true
     },
     {
      "t": "Tik pulsą – tvarstis pritvirtintas, plėvelė sandari",
      "ok": false
     }
    ],
    "why": "Po kiekvieno perkėlimo patikrinkite tvarsčius, kraujavimą, kraujotaką ir šoko požymius, įrašykite į kortelę (DD 1380). Iškritusius organus saugokite nuo šalčio; uždėtas ir pamirštas tvarstis – dažna klaida.",
    "ref": [
     "#/igudis/27",
     "#/igudis/21"
    ]
   }
  ]
 },
 {
  "id": "m34",
  "pav": "Įsmigęs metalo strypas",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Kolonoje sprogus SSU, nuo sunkvežimio atplyšęs metalo strypas įsmigo kariui į šlaunį ir kyšo apie 15 cm. Masyvaus kraujavimo nėra, MARCH sutvarkytas.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "stiprus",
     "Skausmas": "7/10"
    },
    "klaus": "Ką darote su strypu?",
    "opt": [
     {
      "t": "Atsargiai atidengiate, netraukiate, tikrinate pulsą pėdoje",
      "ok": true
     },
     {
      "t": "Ištraukiate, kad galėtumėte tamponuoti ir sutvarstyti žaizdą",
      "ok": false
     },
     {
      "t": "Tvirtai spaudžiate tiesiai ant strypo, kad nekraujuotų",
      "ok": false
     }
    ],
    "why": "Įsmigusio daikto netraukite: atsargiai atidenkite ir galūnėje patikrinkite distalinį pulsą (sutrikusi kraujotaka – skubesnė evakuacija). Kraujuojant spauskite šalia daikto, ne ant jo.",
    "ref": [
     "#/igudis/27",
     "#/s/tfc-paws"
    ]
   },
   {
    "sit": "Pulsas pėdoje čiuopiamas. Aplink strypą lėtai sunkiasi kraujas.",
    "gp": {},
    "klaus": "Kaip stabilizuojate?",
    "opt": [
     {
      "t": "Spaudžiate ant strypo ir užveržiate tvarstį per jį",
      "ok": false
     },
     {
      "t": "Spaudžiate šalia; kitas laiko strypą, apdedate ir pritvirtinate",
      "ok": true
     },
     {
      "t": "Tvarstote tik aplink, strypo netvirtinate – nešant laikysis pats",
      "ok": false
     }
    ],
    "why": "Kraujuojant spauskite šalia daikto, ne ant jo. Kitas gelbėtojas laiko daiktą nejudantį; apdėkite jį tvarsčiais ir pritvirtinkite juosta ar skarelėmis.",
    "ref": [
     "#/igudis/27"
    ]
   },
   {
    "sit": "Strypas pritvirtintas. Karys budrus, gali nuryti, alergijų neturi; laukia ilgas nešimas iki evakuacijos punkto.",
    "gp": {
     "AVPU": "A",
     "Skausmas": "6/10"
    },
    "klaus": "Kas dar teisinga PAWS etape?",
    "opt": [
     {
      "t": "Galūnės neįtveriate – įtvaras gali pajudinti strypą",
      "ok": false
     },
     {
      "t": "Antibiotiko neduodate, kol strypas neišimtas ligoninėje",
      "ok": false
     },
     {
      "t": "Įtveriate, tikrinate pulsą; CWMP ir cefadroksilis 1 g",
      "ok": true
     }
    ],
    "why": "Galūnę su įsmigusiu daiktu įtverkite ir patikrinkite pulsą, judesius bei jutimą. Nuskausminkite (CWMP) ir skirkite antibiotiką atvirai kovinei žaizdai – cefadroksilis 1 g per burną.",
    "ref": [
     "#/igudis/27",
     "#/igudis/29",
     "#/igudis/26"
    ]
   }
  ]
 },
 {
  "id": "m35",
  "pav": "Šarvuočio gaisras: nudegimai",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Prieštankinė raketa pataikė į šarvuotį, jis užsidegė. Vairuotoją ištraukėte su rūkstančia uniforma, degimą užgesinote; kairės blauzdos skeveldros žaizda smarkiai kraujuoja.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "silpnas",
     "ŠSD": "118"
    },
    "klaus": "Ką darote pirmiausia?",
    "opt": [
     {
      "t": "Vertinate nudegimo plotą devynių taisykle",
      "ok": false
     },
     {
      "t": "Turniketas kraujuojančiai kojai – pirma MARCH",
      "ok": true
     },
     {
      "t": "Nuplėšiate prilipusią uniformą nudegimams apžiūrėti",
      "ok": false
     }
    ],
    "why": "Nudegęs sužeistasis pirmiausia yra traumos pacientas: pirma MARCH, tik tada nudegimai. Visas TCCC intervencijas galima atlikti ant nudegusios odos ar per ją; prilipusių drabužių neplėškite.",
    "ref": [
     "#/igudis/28",
     "#/igudis/5"
    ]
   },
   {
    "sit": "Kraujavimas sustabdytas. Nudegusi visa liemens priekinė dalis, visa dešinė ranka ir dar trys delno dydžio plotai ant kaklo.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "silpnas"
    },
    "klaus": "Koks plotas ir ką tai lemia?",
    "opt": [
     {
      "t": "≈ 30 %: kviečiate CMC skysčiams, šilumą atspindintis apvalkalas",
      "ok": true
     },
     {
      "t": "≈ 20 %: skysčių nereikia, šildyti nebūtina",
      "ok": false
     },
     {
      "t": "≈ 40 %: tvarstote drėgnais, tvirtai suveržtais tvarsčiais",
      "ok": false
     }
    ],
    "why": "Devynių taisyklė: liemens priekis 18 % + ranka 9 % + 3 delnai ≈ 3 % = 30 %. > 20 % – kvieskite CMC skysčiams IV / IO, naudokite šilumą atspindintį apvalkalą ar „Blizzard“ antklodę; tvarsčiai – sausi, sterilūs, laisvi.",
    "ref": [
     "#/igudis/28",
     "#/s/tfc-paws"
    ]
   },
   {
    "sit": "Šarvuotyje buvo daug dūmų. Po 10 min karys užkimsta ir kosti, antakiai apsvilę, veidas paraudęs, nosyje ir burnoje – suodžiai.",
    "gp": {
     "AVPU": "A",
     "SpO₂": "91 %",
     "KD": "24"
    },
    "klaus": "Kas teisinga?",
    "opt": [
     {
      "t": "Įkišate NPA, kad apdegę kvėpavimo takai liktų atviri",
      "ok": false
     },
     {
      "t": "Užkimimas po gaisro įprastas – tęsiate nudegimų tvarstymą",
      "ok": false
     },
     {
      "t": "Stebite takus ir SpO₂, NPA nekišate, prašote skubios evakuacijos",
      "ok": true
     }
    ],
    "why": "Veido nudegimai uždaroje erdvėje – įkvėpimo trauma: stebėkite kvėpavimo takus ir SpO₂; užkimimas, kosulys, dusulys – skubi evakuacija. Esant kvėpavimo takų nudegimo požymiams NPA nekiškite; distresas ar krintantis SpO₂ – CMC svarsto ankstyvą krikotiroidotomiją.",
    "ref": [
     "#/igudis/28",
     "#/s/tfc-paws"
    ]
   }
  ]
 },
 {
  "id": "m36",
  "pav": "Alergija penicilinui",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Po artilerijos apšaudymo karys poste turi skeveldros žaizdą dilbyje; ji sutvarstyta, MARCH sutvarkytas. Budrus, gali tęsti užduotį; iš kišenės traukia ibuprofeną. Paklaustas apie alergijas, mini tik peniciliną.",
    "gp": {
     "AVPU": "A",
     "Skausmas": "5/10"
    },
    "klaus": "Kaip malšinate skausmą?",
    "opt": [
     {
      "t": "CWMP ir ibuprofenas – stipresnis poveikis",
      "ok": false
     },
     {
      "t": "Tik ibuprofenas – CWMP pasiliekate vėlesniam laikui",
      "ok": false
     },
     {
      "t": "Visas CWMP tabletes iš karto, ibuprofeno negeria",
      "ok": true
     }
    ],
    "why": "Galintis kovoti – CWMP: paracetamolis 1000–1300 mg, meloksikamas 15 mg, suzetriginas 100 mg, visos tabletės iš karto. Kitų NVNU (ibuprofeno, diklofenako) kartu negerti.",
    "ref": [
     "#/igudis/24",
     "#/vaistas/meloksikamas"
    ]
   },
   {
    "sit": "Patikslinus, karys sako, kad po penicilino jam buvo sutinęs veidas ir sunku kvėpuoti – vežė į ligoninę.",
    "gp": {
     "AVPU": "A"
    },
    "klaus": "Kaip su antibiotiku?",
    "opt": [
     {
      "t": "Cefadroksilio neduodate – pranešate medikui",
      "ok": true
     },
     {
      "t": "Duodate cefaleksiną – jis ne penicilinas",
      "ok": false
     },
     {
      "t": "Duodate cefadroksilį – alergija tik penicilinui",
      "ok": false
     }
    ],
    "why": "Alergija cefalosporinams ar sunki reakcija į penicilinus – geriamojo antibiotiko neduokite, praneškite medikui. Cefaleksinas – irgi cefalosporinas, tad ne išeitis.",
    "ref": [
     "#/igudis/26",
     "#/vaistas/cefadroksilis"
    ]
   },
   {
    "sit": "Evakuacija vėluoja. Nuo CWMP praėjo 8 val., skausmas vėl 5/10.",
    "gp": {
     "AVPU": "A",
     "Skausmas": "5/10"
    },
    "klaus": "Ką galite pakartoti dabar?",
    "opt": [
     {
      "t": "Visą CWMP iš naujo – praėjo jau 8 valandos",
      "ok": false
     },
     {
      "t": "Paracetamolį; suzetriginą po 12 val., meloksikamą po paros",
      "ok": true
     },
     {
      "t": "Nieko – CWMP kartoti leidžiama tik Role 1 punkte",
      "ok": false
     }
    ],
    "why": "Kartojama pagal grafiką: paracetamolis kas 8 val., suzetriginas 50 mg kas 12 val., meloksikamas – kartą per parą. Laiką užrašykite į kortelę (DD 1380), kitaip dozės viršijamos.",
    "ref": [
     "#/igudis/24",
     "#/p/vaistai26"
    ]
   }
  ]
 },
 {
  "id": "m37",
  "pav": "Be sąmonės: nieko per burną",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Artilerijos sviedinys sprogo apie 20 m nuo apkaso. Karys reaguoja tik į skausmą, dilbio skeveldros žaizda sutvarstyta. Draugas nori įdėti jam į burną CWMP ir cefadroksilį.",
    "gp": {
     "AVPU": "P",
     "Radialinis pulsas": "stiprus",
     "KD": "14"
    },
    "klaus": "Ką atsakote draugui?",
    "opt": [
     {
      "t": "Galima – tabletes ištirpinkite vandenyje",
      "ok": false
     },
     {
      "t": "Nieko per burną – antibiotikui kviečiame mediką",
      "ok": true
     },
     {
      "t": "Antibiotiką atidėkime iki ligoninės",
      "ok": false
     }
    ],
    "why": "Geriamieji vaistai – tik sąmoningam (AVPU – A), galinčiam nuryti; kitaip užspringimo ir aspiracijos pavojus. Negali nuryti – kvieskite mediką (CMC: ceftriaksonas 2 g IV / IO / IM); antibiotiko neatidėkite iki ligoninės.",
    "ref": [
     "#/igudis/26",
     "#/igudis/24"
    ]
   },
   {
    "sit": "Sužeistasis guli ant nugaros ir pradeda vemti.",
    "gp": {
     "AVPU": "P"
    },
    "klaus": "Ką darote?",
    "opt": [
     {
      "t": "Verčiate ant šono, išvalote burną, stabili šoninė padėtis",
      "ok": true
     },
     {
      "t": "Pakeliate galvą 30° ir laukiate, kol nustos",
      "ok": false
     },
     {
      "t": "Paliekate ant nugaros, smakrą prispaudžiate prie krūtinės",
      "ok": false
     }
    ],
    "why": "Vemiant – paverskite ant šono ir išvalykite burną; be sąmonės – stabili šoninė padėtis. Ant nugaros paliktam vėmalai ar kraujas užkemša kvėpavimo takus.",
    "ref": [
     "#/igudis/22",
     "#/igudis/10"
    ]
   },
   {
    "sit": "Pakartotinai vertinant po 10 min: kairysis vyzdys išsiplėtęs ir nereaguoja, dešinysis – normalus.",
    "gp": {
     "AVPU": "P",
     "Radialinis pulsas": "stiprus",
     "SpO₂": "94 %"
    },
    "klaus": "Ką darote?",
    "opt": [
     {
      "t": "Kitą patikrą atliksite prieš perduodami",
      "ok": false
     },
     {
      "t": "Pats suleidžiate hipertoninio NaCl iš mediko kuprinės",
      "ok": false
     },
     {
      "t": "Nedelsdami pranešate medikui, skubinate evakuaciją, užrašote",
      "ok": true
     }
    ],
    "why": "Asimetriški ar fiksuoti ir išsiplėtę vyzdžiai – išvaržos požymis: nedelsdami praneškite medikui (hipertoninį NaCl skiria CMC). Neurologinę būklę kartokite kas 5–10 min ir užrašykite į kortelę; chirurgija geriausia per 5 val.",
    "ref": [
     "#/igudis/22",
     "#/s/tfc-h"
    ]
   }
  ]
 },
 {
  "id": "m38",
  "pav": "Ketaminas ir jo poveikis (CMC)",
  "tema": "TFC",
  "lygis": "CMC",
  "q": [
   {
    "sit": "(CMC) Granatos skeveldros sužeidė abi kario kojas; kraujavimas sustabdytas, CWMP išgertas, užduoties tęsti negali. IV / IO prieigos nėra; turite 100 mg/ml ketamino ir purkštuvą.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "stiprus",
     "Skausmas": "8/10"
    },
    "klaus": "(CMC) Kokią dozę skiriate į nosį?",
    "opt": [
     {
      "t": "50 mg IN – 0,5 ml",
      "ok": true
     },
     {
      "t": "100 mg IN – 1 ml",
      "ok": false
     },
     {
      "t": "25 mg IN – 0,25 ml, kartoti kas 5 min",
      "ok": false
     }
    ],
    "why": "Ketaminas į nosį – 50 mg, tik iš 100 mg/ml ampulės (0,5 ml). Prieš tai nuginkluokite, AVPU ir skausmą įrašykite į kortelę; kartoti – kas 30 min pagal poreikį.",
    "ref": [
     "#/vaistas/ketaminas",
     "#/igudis/25"
    ]
   },
   {
    "sit": "(CMC) Po 15 min skausmas 4/10, bet karys sujaudintas, dezorientuotas ir jį pykina.",
    "gp": {
     "AVPU": "A",
     "Skausmas": "4/10"
    },
    "klaus": "(CMC) Ką darote?",
    "opt": [
     {
      "t": "Skiriate midazolamo sujaudinimui ir pykinimui nuraminti",
      "ok": false
     },
     {
      "t": "Iškart kartojate 50 mg IN, kad greičiau nurimtų",
      "ok": false
     },
     {
      "t": "Pritvirtinate diržais; ondansetronas 4 mg, vemiant – ant šono",
      "ok": true
     }
    ],
    "why": "Sujaudintą ar dezorientuotą sužeistąjį pritvirtinkite neštuvų diržais; benzodiazepinų su ketaminu neskirkite. Pykinimui – ondansetronas 4 mg (ODT / IV / IO / IM); vemiantį paguldykite ant šono. Ketaminą kartoti – ne dažniau kaip kas 30 min.",
    "ref": [
     "#/igudis/25",
     "#/vaistas/ondansetronas"
    ]
   },
   {
    "sit": "(CMC) Pervežant pastebite, kad kvėpavimas suretėjo ir tapo paviršinis.",
    "gp": {
     "AVPU": "V",
     "KD": "7",
     "SpO₂": "89 %"
    },
    "klaus": "(CMC) Kokie veiksmai?",
    "opt": [
     {
      "t": "Naloksonas 0,4 mg IM – ketamino poveikiui nutraukti",
      "ok": false
     },
     {
      "t": "„Uostymo“ padėtis; nepadeda – ventiliacija ambu maišu",
      "ok": true
     },
     {
      "t": "Kita ketamino dozė – kvėpavimas susireguliuos",
      "ok": false
     }
    ],
    "why": "Po ketamino suretėjus kvėpavimui – „uostymo“ padėtis, nepadeda – ventiliacija ambu maišu. Naloksonas skirtas opioidų sukeltam kvėpavimo slopinimui ir TCCC 2026 nebeminimas.",
    "ref": [
     "#/igudis/25",
     "#/igudis/12",
     "#/vaistas/naloksonas"
    ]
   }
  ]
 },
 {
  "id": "m39",
  "pav": "Žandikaulio žaizda (CMC)",
  "tema": "TFC",
  "lygis": "CMC",
  "q": [
   {
    "sit": "(CMC) Snaiperio kulka sužalojo kario apatinį žandikaulį. Jis sėdi pasilenkęs į priekį, kvėpavimo takai laisvi, kraujavimas sustabdytas; nuryti negali.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "stiprus",
     "SpO₂": "95 %"
    },
    "klaus": "(CMC) Kokį antibiotiką skiriate?",
    "opt": [
     {
      "t": "Cefadroksilis 1 g – ištirpinate ir supilate į burną",
      "ok": false
     },
     {
      "t": "Nereikia – kulka išėjo kiaurai",
      "ok": false
     },
     {
      "t": "Ceftriaksonas 2 g IV / IO / IM",
      "ok": true
     }
    ],
    "why": "Atvira kovinė žaizda, o sužeistasis negali nuryti (sunki veido trauma) – CMC skiria ceftriaksoną 2 g IV / IO / IM kartą per parą.",
    "ref": [
     "#/igudis/26",
     "#/vaistas/ceftriaksonas"
    ]
   },
   {
    "sit": "(CMC) IV / IO prieigos nėra – ceftriaksoną 2 g leisite į raumenis.",
    "gp": {},
    "klaus": "(CMC) Kaip suleidžiate?",
    "opt": [
     {
      "t": "Dalijate į dvi vietas – ne daugiau 1 g į vieną",
      "ok": true
     },
     {
      "t": "Visus 2 g į vieną didelį raumenį, pvz., šlaunį",
      "ok": false
     },
     {
      "t": "1 g dabar, likusį 1 g – po 24 val.",
      "ok": false
     }
    ],
    "why": "Į vieną vietą IM – ne daugiau kaip 1 g, todėl 2 g dalijami į dvi vietas. Kita dozė – po 24 val.; laiką įrašykite į kortelę (DD 1380).",
    "ref": [
     "#/vaistas/ceftriaksonas",
     "#/igudis/26"
    ]
   },
   {
    "sit": "(CMC) Skausmas 8/10, užduoties tęsti negali. CWMP dar negavo.",
    "gp": {
     "AVPU": "A",
     "Skausmas": "8/10"
    },
    "klaus": "(CMC) Kaip nuskausminate?",
    "opt": [
     {
      "t": "CWMP tabletes susmulkinate ir supilate į burną",
      "ok": false
     },
     {
      "t": "Ketaminas 100 mg IM, prieš tai AVPU įrašote į kortelę",
      "ok": true
     },
     {
      "t": "Ketaminas 25 mg IM, kartojate kas 5 min",
      "ok": false
     }
    ],
    "why": "CWMP – tik galinčiam nuryti. Negalinčiam tęsti užduoties CMC skiria ketaminą, pvz., 100 mg IM; prieš tai nuginkluoja ir AVPU įrašo į kortelę. Kartoti – kas 30 min pagal poreikį.",
    "ref": [
     "#/igudis/25",
     "#/vaistas/ketaminas"
    ]
   }
  ]
 },
 {
  "id": "m40",
  "pav": "Atviras dilbio lūžis (CMC)",
  "tema": "TFC",
  "lygis": "CMC",
  "q": [
   {
    "sit": "Šturmuojant pastatą karys nukrito nuo antro aukšto: dilbio žaizdoje matyti kaulas, kraujuoja nedaug. MARCH sutvarkytas; ant tos rankos – laikrodis ir žiedas.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "stiprus",
     "Skausmas": "8/10"
    },
    "klaus": "Ką darote prieš įtverdami?",
    "opt": [
     {
      "t": "Sutvarstote žaizdą, nuimate žiedą ir laikrodį, tikrinate pulsą",
      "ok": true
     },
     {
      "t": "Įtveriate iškart – žaizdą sutvarstys Role 1 punkte",
      "ok": false
     },
     {
      "t": "Įtveriate, o pulsą ir jutimą tikrinsite tik po įtvėrimo",
      "ok": false
     }
    ],
    "why": "Prieš įtvėrimą: atviros žaizdos sutvarstytos, kraujavimas sustabdytas, žiedai ir laikrodis nuimti, patikrintas distalinis pulsas, kapiliarų prisipildymas, judesiai ir jutimas. Atviram lūžiui – ir antibiotikas.",
    "ref": [
     "#/igudis/29",
     "#/s/tfc-paws"
    ]
   },
   {
    "sit": "SAM įtvaras uždėtas, riešas ir alkūnė fiksuoti. Po įtvėrimo radialinio pulso sužeistoje rankoje nebeužčiuopiate.",
    "gp": {},
    "klaus": "Ką darote?",
    "opt": [
     {
      "t": "Nieko – po lūžio pulsas dažnai laikinai išnyksta",
      "ok": false
     },
     {
      "t": "Užveržiate įtvarą dar stipriau, kad lūžis nejudėtų",
      "ok": false
     },
     {
      "t": "Atlaisvinate, pataisote, uždedate iš naujo, vėl tikrinate",
      "ok": true
     }
    ],
    "why": "Po įtvėrimo vėl patikrinkite distalinį pulsą; nėra – atlaisvinkite, pataisykite ir uždėkite iš naujo. Galūnei tinstant įtvaras gali tapti veržiantis – pulsą tikrinkite ir evakuacijos metu.",
    "ref": [
     "#/igudis/29"
    ]
   },
   {
    "sit": "(CMC) Pulsas grįžo. CWMP išgertas, bet skausmas 8/10, užduoties tęsti negali. Prieigos nėra; turite esketamino 28 mg purškalą.",
    "gp": {
     "AVPU": "A",
     "Skausmas": "8/10"
    },
    "klaus": "(CMC) Kaip skiriate esketaminą?",
    "opt": [
     {
      "t": "28 mg į vieną šnervę, kartojate kas 30 min pagal poreikį",
      "ok": false
     },
     {
      "t": "28 mg: po 1 purškimą į kiekvieną šnervę, vieną kartą",
      "ok": true
     },
     {
      "t": "Po 2 purškimus į kiekvieną šnervę iš karto (56 mg)",
      "ok": false
     }
    ],
    "why": "Esketaminas – 14 arba 28 mg IN vieną kartą; 1 purškimas = 14 mg, tad 28 mg – po 1 purškimą į kiekvieną šnervę. Kaip ir ketaminui: nuginkluoti, AVPU įrašyti, stebėti kvėpavimą.",
    "ref": [
     "#/vaistas/esketaminas",
     "#/igudis/25"
    ]
   }
  ]
 },
 {
  "id": "m41",
  "pav": "9-Line trims sužeistiesiems",
  "tema": "Rūšiavimas",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Minosvaidžio mina sprogo prie posto. Po TFC būrio CMC nustatė: pirmajam po adatinės dekompresijos – neatidėliotina evakuacija, antrajam (blauzdos lūžis, distalinio pulso nėra) – skubi, trečiajam (nubrozdinimai) – įprastinė.",
    "gp": {},
    "klaus": "Kaip perduodate 9-Line 3 eilutę?",
    "opt": [
     {
      "t": "A1 break B1 break C1",
      "ok": false
     },
     {
      "t": "A1 break C1 break D1",
      "ok": true
     },
     {
      "t": "U1 break P1 break R1",
      "ok": false
     }
    ],
    "why": "3 eilutė – sužeistųjų skaičius pagal pirmenybę: A neatidėliotini, B neatidėliotini – chirurginiai, C skubūs, D įprastinė evakuacija, E pagal galimybes; tarp kategorijų – „break“. Raidės nėra eilės numeriai.",
    "ref": [
     "#/9line",
     "#/igudis/32",
     "#/p/devynios"
    ]
   },
   {
    "sit": "Pirmasis ir antrasis guli ant neštuvų, trečiasis vaikšto pats.",
    "gp": {},
    "klaus": "Kaip perduodate 5 eilutę?",
    "opt": [
     {
      "t": "L2 break A1",
      "ok": true
     },
     {
      "t": "A2 break L1",
      "ok": false
     },
     {
      "t": "L3 – visi bus vežami neštuvuose",
      "ok": false
     }
    ],
    "why": "5 eilutė – sužeistųjų skaičius pagal tipą: L – gulintys (neštuvuose), A – sėdintys (ambulatoriniai). Čia A reiškia vaikštantį, o ne 3 eilutės neatidėliotiną kategoriją.",
    "ref": [
     "#/9line",
     "#/p/devynios"
    ]
   },
   {
    "sit": "Būrio vadas siūlo: „Sakyk, kad visi trys neatidėliotini – greičiau atskris.“ Antrojo ir trečiojo būklė nepakitusi.",
    "gp": {},
    "klaus": "Ką atsakote?",
    "opt": [
     {
      "t": "Sutinkate – aukštesnė kategorija niekam nepakenks",
      "ok": false
     },
     {
      "t": "Sutinkate, bet trečiąjį paliekate įprastinei",
      "ok": false
     },
     {
      "t": "Ne – pervertinimas atima priemones iš kitų",
      "ok": true
     }
    ],
    "why": "Venkite pervertinimo: per aukšta kategorija atima priemones iš labiausiai jų reikalingų. Kategoriją nustato medicinos personalas ir atnaujina tik pasikeitus būklei.",
    "ref": [
     "#/igudis/36",
     "#/igudis/32"
    ]
   }
  ]
 },
 {
  "id": "m42",
  "pav": "Sraigtasparnio nusileidimo vieta",
  "tema": "TACEVAC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Būrys parengė evakuacijos tašką miško aikštelėje; 1–5 eilutės jau perduotos, sraigtasparnis pakilo. Vietą pažymėsite dūmų granata.",
    "gp": {},
    "klaus": "Ką perduodate 9-Line 7 eilutėje?",
    "opt": [
     {
      "t": "B – pirotechnika",
      "ok": false
     },
     {
      "t": "D – nėra, pilotas ras pagal koordinates",
      "ok": false
     },
     {
      "t": "C – dūmai",
      "ok": true
     }
    ],
    "why": "7 eilutė – surinkimo vietos pažymėjimo būdas: A spalvotas ženklas, B pirotechnika, C dūmai, D nėra, E kita. 6–9 eilutes galima perduoti, kai priemonė jau juda.",
    "ref": [
     "#/9line",
     "#/p/devynios"
    ]
   },
   {
    "sit": "Iki atskridimo 5 min. Sužeistasis su turniketu ant šlaunies guli ant neštuvų, apvyniotas hipotermijos apvalkalu; tvarsčio galai ir diržai kabo laisvi.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "stiprus"
    },
    "klaus": "Ką sutvarkote prieš sraigtasparnio oro srautą?",
    "opt": [
     {
      "t": "Apvalkalą užtraukiate ant veido ir turniketo",
      "ok": false
     },
     {
      "t": "Sutvirtinate galus ir diržus; veidas, turniketas matomi",
      "ok": true
     },
     {
      "t": "Nieko – sužeistąjį pritvirtins sraigtasparnio įgula",
      "ok": false
     }
    ],
    "why": "Laisvi tvarsčių galai, antklodės ir diržai užkliūva ar nunešami oro srauto – juos sutvirtinkite. Veido neuždenkite; turniketai lieka matomi, laikas pažymėtas.",
    "ref": [
     "#/igudis/33",
     "#/p/nestuvai"
    ]
   },
   {
    "sit": "Sraigtasparnis nusileido. Jūsų skyrius evakuacijos taške su trimis sužeistaisiais, sustatytais pakrovimo eile.",
    "gp": {},
    "klaus": "Kaip pasiskirstomi darbai?",
    "opt": [
     {
      "t": "Skyrius saugo tašką; evakuacijos komanda pakrauna ir pritvirtina",
      "ok": true
     },
     {
      "t": "Skyrius pats sukrauna ir pritvirtina sužeistuosius savaip",
      "ok": false
     },
     {
      "t": "Visi bėga krauti – taško saugoti nebereikia",
      "ok": false
     }
    ],
    "why": "Taktinis padalinys saugo evakuacijos tašką ir sustato sužeistuosius; evakuacijos komanda juos pakrauna, pritvirtina pagal platformos konfigūraciją ir saugos reikalavimus ir iš naujo įvertina.",
    "ref": [
     "#/f/TACEVAC",
     "#/igudis/34"
    ]
   }
  ]
 },
 {
  "id": "m43",
  "pav": "Turniketas šarvuotyje",
  "tema": "TACEVAC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Sužeistąjį su turniketu ant šlaunies (uždėtas apšaudymo metu 1410L) vežate šarvuočiu duobėtu keliu. Po stipraus krestelėjimo tvarstis ant žaizdos žemiau turniketo greitai permirksta, pėdoje čiuopiamas pulsas.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "stiprus"
    },
    "klaus": "Ką darote?",
    "opt": [
     {
      "t": "Suveržiate stipriau; nepadeda – iškart dar vienas turniketas",
      "ok": true
     },
     {
      "t": "Dedate dar vieną tvarstį ant viršaus ir važiuojate",
      "ok": false
     },
     {
      "t": "Turniketą nuimate ir žaizdą tamponuojate iš naujo",
      "ok": false
     }
    ],
    "why": "Po perkėlimų ir krestelėjimų tikrinkite turniketus. Juntamas distalinis pulsas ar kraujavimas – suveržkite stipriau; neužtenka – iškart naujas turniketas ant odos 5–7,5 cm virš žaizdos.",
    "ref": [
     "#/igudis/8",
     "#/f/TACEVAC?t=2"
    ]
   },
   {
    "sit": "Antrasis turniketas uždėtas 1455L; kraujavimas sustojo, distalinio pulso nebėra.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "stiprus"
    },
    "klaus": "Kaip užrašote laikus?",
    "opt": [
     {
      "t": "Pirmąjį laiką ištrinate – skaičiuojama nuo naujojo",
      "ok": false
     },
     {
      "t": "Pasakysite žodžiu – važiuojant rašyti nepatogu",
      "ok": false
     },
     {
      "t": "Abu laikai – ant turniketo ir kortelėje; terminai nuo 1410L",
      "ok": true
     }
    ],
    "why": "Turniketo laikus nenuplaunamu žymekliu rašykite ant turniketo ir tos galūnės langelyje kortelėje (DD 1380). 2 ir 6 val. skaičiuojami nuo pirmojo turniketo – jo laiką palikite.",
    "ref": [
     "#/igudis/31",
     "#/igudis/8"
    ]
   },
   {
    "sit": "Po 10 min sužeistasis išblyškęs, atsako tik užkalbintas, radialinis pulsas silpnas. Iki stabilizavimo punkto – 20 min.",
    "gp": {
     "AVPU": "V",
     "Radialinis pulsas": "silpnas",
     "ŠSD": "128"
    },
    "klaus": "Kas svarbiausia dabar?",
    "opt": [
     {
      "t": "Atlaisvinate turniketus, kad pagerėtų kraujotaka",
      "ok": false
     },
     {
      "t": "Tikrinate kraujavimą, šildote, pranešate vadui ir punktui",
      "ok": true
     },
     {
      "t": "Laukiate punkto – ten išmatuos AKS ir nuspręs",
      "ok": false
     }
    ],
    "why": "Sutrikusi sąmonė ir silpnas radialinis pulsas – šokas. Iš naujo patikrinkite visus kraujavimo šaltinius ir turniketus, šildykite; būklei blogėjant informuokite priimančią grandį ir vadą, patikslinkite skubumą.",
    "ref": [
     "#/igudis/17",
     "#/f/TACEVAC?t=2"
    ]
   }
  ]
 },
 {
  "id": "m44",
  "pav": "Dusulys sraigtasparnyje",
  "tema": "TACEVAC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Lydite sužeistąjį su šautine krūtinės žaizda sraigtasparnyje; ventiliuojamas krūtinės lipdukas uždėtas. Po pakilimo dusulys sparčiai didėja, triukšme kvėpavimo garsų neišgirsite.",
    "gp": {
     "AVPU": "A",
     "KD": "36",
     "SpO₂": "85 %",
     "Radialinis pulsas": "silpnas"
    },
    "klaus": "Ką darote pirmiausia?",
    "opt": [
     {
      "t": "Iškart atliekate NDC, lipduko visai neliečiate",
      "ok": false
     },
     {
      "t": "„Atpučiate“ ar nuimate lipduką ir vertinate iš naujo",
      "ok": true
     },
     {
      "t": "Ant pirmojo lipduko užklijuojate dar vieną",
      "ok": false
     }
    ],
    "why": "Progresuojantis kvėpavimo distresas su krūtinės lipduku – pirmiausia „atpūskite“ ar nuimkite lipduką ir įvertinkite iš naujo. Nepadeda – adatinė dekompresija (NDC).",
    "ref": [
     "#/igudis/14",
     "#/igudis/30"
    ]
   },
   {
    "sit": "Lipduką atpūtus būklė nepagerėjo; SpO₂ toliau krenta, sužeistasis neramus.",
    "gp": {
     "KD": "40",
     "SpO₂": "82 %",
     "Radialinis pulsas": "silpnas"
    },
    "klaus": "Kur atliekate NDC?",
    "opt": [
     {
      "t": "2-asis tarpšonkaulinis tarpas prie pat krūtinkaulio",
      "ok": false
     },
     {
      "t": "5-asis tarpšonkaulinis tarpas, po šonkaulio apatiniu kraštu",
      "ok": false
     },
     {
      "t": "Pažeistoje pusėje: 5-asis (pažasties) ar 2-asis (raktikaulio) tarpas",
      "ok": true
     }
    ],
    "why": "NDC – pažeistoje pusėje: 5-asis tarpšonkaulinis tarpas priekinėje pažasties linijoje arba 2-asis vidurinėje raktikaulio linijoje; 14 G ar 10 G 8 cm adata, statmenai krūtinės sienai, virš apatinio šonkaulio. Mediališkiau spenelio linijos ar po šonkauliu – klaida.",
    "ref": [
     "#/igudis/16",
     "#/s/tfc-r"
    ]
   },
   {
    "sit": "Po NDC oro šnypštimo dėl triukšmo neišgirdote, bet kvėpuoti akivaizdžiai lengviau.",
    "gp": {
     "KD": "24",
     "SpO₂": "92 %",
     "Radialinis pulsas": "stiprus"
    },
    "klaus": "Kaip vertinate?",
    "opt": [
     {
      "t": "Pavyko – užrašote vietą, laiką, rezultatą ir stebite",
      "ok": true
     },
     {
      "t": "Nepavyko – kartojate toje pačioje vietoje ta pačia adata",
      "ok": false
     },
     {
      "t": "Pavyko – stebėti nebereikia, pneumotoraksas išspręstas",
      "ok": false
     }
    ],
    "why": "Sėkmė – palengvėjęs distresas ir SpO₂ ≥ 90 %; negirdint šnypštimo triukšme NDC nelaikoma nepavykusia. Po NDC stebėkite – kateteris gali užsilenkti ar užsikimšti; simptomai grįžo – kartokite nauja adata.",
    "ref": [
     "#/igudis/16",
     "#/igudis/31"
    ]
   }
  ]
 },
 {
  "id": "m45",
  "pav": "Perėmimas be kortelės",
  "tema": "TACEVAC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Esate MEDEVAC komandoje. Evakuacijos taške kito būrio karys atneša sužeistąjį su turniketu ant dilbio: „Kortelės nėra, jis stabilus“ – ir jau nori grįžti į poziciją.",
    "gp": {},
    "klaus": "Ką darote?",
    "opt": [
     {
      "t": "Leidžiate grįžti – informaciją surinksite kelyje",
      "ok": false
     },
     {
      "t": "Paimate sužeistąjį ir paklausiate tik pavardės",
      "ok": false
     },
     {
      "t": "Akis į akį išklausote: būklė, sužalojimai, gydymas",
      "ok": true
     }
    ],
    "why": "Perduodama ir priimama akis į akį, sustojus: stabilus ar nestabilus, nustatyti sužalojimai, suteiktas gydymas (MIST), turniketo laikas. Klausimus užduokite iškart – karys išėjus informacijos nebebus.",
    "ref": [
     "#/igudis/34",
     "#/f/TACEVAC"
    ]
   },
   {
    "sit": "Karys sako, kad turniketas uždėtas apie 1320L. Sužeistasis atsimerkia tik užkalbintas, ant liemenės – granatos ir užtaisytas pistoletas.",
    "gp": {
     "AVPU": "V",
     "Radialinis pulsas": "silpnas"
    },
    "klaus": "Ką darote prieš pakraudami?",
    "opt": [
     {
      "t": "Nuginkluojate ir iš naujo įvertinate jį bei intervencijas",
      "ok": true
     },
     {
      "t": "Pakraunate – karys sakė, kad jis stabilus",
      "ok": false
     },
     {
      "t": "Ginklus paliekate – jis kovotojas, gali prireikti",
      "ok": false
     }
    ],
    "why": "Pasitikėti vien gauta informacija – klaida: iš naujo įvertinkite sužeistąjį ir intervencijas (MARCH). Ginklai iškrauti, sprogmenų nėra, sutrikusios sąmonės sužeistasis nuginkluotas.",
    "ref": [
     "#/igudis/34",
     "#/f/TACEVAC"
    ]
   },
   {
    "sit": "Sužeistasis pakrautas ir pritvirtintas; kortelės vis dar nėra.",
    "gp": {
     "AVPU": "V",
     "Radialinis pulsas": "silpnas"
    },
    "klaus": "Kaip tvarkote dokumentus?",
    "opt": [
     {
      "t": "Kortelę užpildysite punkte iš atminties",
      "ok": false
     },
     {
      "t": "Pildote naują kortelę su laikais, tvirtinate prie riešo",
      "ok": true
     },
     {
      "t": "Užpildote ir įkišate į jo kuprinę, kad nesušlaptų",
      "ok": false
     }
    ],
    "why": "Kortelę (DD 1380) pildykite iškart ir atnaujinkite po kiekvieno vertinimo – iš atminties pamirštami laikai ir dozės. Ji tvirtinama matomoje vietoje (riešas, kelnių diržo kilpa) ir keliauja su sužeistuoju; kišenėje ar kuprinėje atsiskiria.",
    "ref": [
     "#/igudis/31",
     "#/mist"
    ]
   }
  ]
 },
 {
  "id": "m46",
  "pav": "Ilgas laukimas poste",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Dėl dronų grėsmės evakuacija atidėta apie 3 val. Kariui skeveldra sužeidė dilbį; turniketas uždėtas apšaudymo metu prieš 40 min. Šoko nėra, žaizdą galite stebėti, amputacijos nėra.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "stiprus"
    },
    "klaus": "Ką darote su turniketu?",
    "opt": [
     {
      "t": "Konvertuojate į tvarstį, turniketą paliekate ant rankos",
      "ok": true
     },
     {
      "t": "Paliekate iki evakuacijos – turniketo liesti nevalia",
      "ok": false
     },
     {
      "t": "Laukiate 2 val. – tik po jų leidžiama konversija",
      "ok": false
     }
    ],
    "why": "Konversija – kai nėra šoko, žaizdą galima stebėti ir tai ne amputacija; siekite greičiau nei per 2 val. Tamponuokite, spauskite ≥ 3 min, uždėkite spaudžiamąjį tvarstį, turniketą lėtai atlaisvinkite ir palikite ant galūnės.",
    "ref": [
     "#/igudis/8",
     "#/s/tfc-c"
    ]
   },
   {
    "sit": "Kraujavimas nesikartoja. Karys budrus, gali nuryti, alergijų neturi.",
    "gp": {
     "AVPU": "A",
     "Skausmas": "6/10"
    },
    "klaus": "Ką duodate?",
    "opt": [
     {
      "t": "Tik CWMP – antibiotikas jau yra pakete",
      "ok": false
     },
     {
      "t": "CWMP – visas tabletes iš karto – ir cefadroksilį 1 g",
      "ok": true
     },
     {
      "t": "Paracetamolio tabletę kas valandą, kol praeis",
      "ok": false
     }
    ],
    "why": "CWMP: paracetamolis 1000–1300 mg, meloksikamas 15 mg, suzetriginas 100 mg – visos tabletės iš karto. Atvirai kovinei žaizdai – atskirai cefadroksilis 1 g per burną: TCCC 2026 CWMP antibiotiko neturi. Dozes ir laiką – į kortelę.",
    "ref": [
     "#/igudis/24",
     "#/igudis/26"
    ]
   },
   {
    "sit": "Po 1,5 val. karys mieguistas, atsimerkia tik užkalbintas. Draugas sako: „Tai nuo tablečių – tegul miega.“",
    "gp": {
     "AVPU": "V",
     "KD": "26",
     "Radialinis pulsas": "silpnas"
    },
    "klaus": "Ką darote?",
    "opt": [
     {
      "t": "Leidžiate miegoti – patikrinsite atvykus evakuacijai",
      "ok": false
     },
     {
      "t": "Duodate vandens ir žadinate kas valandą",
      "ok": false
     },
     {
      "t": "Kartojate visą MARCH PAWS, nuginkluojate, pranešate vadui",
      "ok": true
     }
    ],
    "why": "Blogėjančią sąmonę nurašyti vaistams ar nuovargiui – dažna klaida. Kartokite visą MARCH PAWS (tvarstis, šokas), ne visiškai budrų nuginkluokite, praneškite vadui ir patikslinkite skubumą.",
    "ref": [
     "#/igudis/30",
     "#/igudis/17"
    ]
   }
  ]
 },
 {
  "id": "m47",
  "pav": "Neštuvai žiemą",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Žiemos operacija, −10 °C, sninga. Minosvaidžio skeveldra sužeidė karį į blauzdą; turniketas veiksmingas. Iki transporto – 800 m miško keliu į kalvą.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "stiprus"
    },
    "klaus": "Kaip paruošiate jį nešti?",
    "opt": [
     {
      "t": "Šildymo antklodę apvyniojate aplink liemenį ant odos",
      "ok": false
     },
     {
      "t": "Apvyniojate visą, ir veidą, kad neatšaltų",
      "ok": false
     },
     {
      "t": "Ant neštuvų, šildymas ant krūtinės; veidas, turniketas matomi",
      "ok": true
     }
    ],
    "why": "Nuo žemės pakeltą lengviau apsaugoti nuo hipotermijos. Aktyvaus šildymo antklodė – ant krūtinės ir pažasčių, ne tiesiai ant odos ir ne aplink liemenį; apvyniokite visą su galva, veidą palikite atidengtą, turniketą – matomą.",
    "ref": [
     "#/igudis/21",
     "#/igudis/33"
    ]
   },
   {
    "sit": "Sužeistasis pritvirtintas neštuvų diržais. Keturi nešėjai pradeda kilti į kalvą.",
    "gp": {},
    "klaus": "Kaip nešate?",
    "opt": [
     {
      "t": "Galva į priekį; keliama tik vieno vadovo komanda",
      "ok": true
     },
     {
      "t": "Kojomis į priekį – taip nešama visada",
      "ok": false
     },
     {
      "t": "Kiekvienas kelia, kai pasiruošęs – taip greičiau",
      "ok": false
     }
    ],
    "why": "Paprastai nešama kojomis į priekį, bet kylant į kalną – galva į priekį; neštuvai kuo horizontaliau. Nešimui vadovauja vienas – keliama ir nuleidžiama tik jo komanda.",
    "ref": [
     "#/p/nestuvai",
     "#/igudis/33"
    ]
   },
   {
    "sit": "Sustojus pailsėti pastebite, kad apvalkalas prasiskyrė, viduje – šlapias sniegas; sužeistasis dreba.",
    "gp": {
     "AVPU": "A",
     "KD": "20"
    },
    "klaus": "Ką darote sustoję?",
    "opt": [
     {
      "t": "Skubate toliau – apvalkalą sutvarkysite transporto priemonėje",
      "ok": false
     },
     {
      "t": "Tikrinate turniketą, kvėpavimą; sausinate ir sandarinate",
      "ok": true
     },
     {
      "t": "Ant šlapio apvalkalo užklojate dar vieną antklodę ir nešate",
      "ok": false
     }
    ],
    "why": "Sustoję pasikeiskite pozicijomis ir patikrinkite turniketus, tvarsčius, kvėpavimą. Šlapius drabužius nuimkite ir, jei įmanoma, pakeiskite sausais; hipotermijos apvalkalas turi būti sandarus ir sausas.",
    "ref": [
     "#/igudis/21",
     "#/s/tfc-h"
    ]
   }
  ]
 },
 {
  "id": "m48",
  "pav": "SITREP po drono atakos",
  "tema": "TFC",
  "lygis": "CLS",
  "q": [
   {
    "sit": "Spalio 19 d. 14.35 val. vietos laiku dronas numetė granatą ant 9 karių patrulio. Pagalba teikiama, vadas liepia parengti SITREP.",
    "gp": {},
    "klaus": "Kaip užrašote 1 eilutę (DTG)?",
    "opt": [
     {
      "t": "14:35, spalio 19",
      "ok": false
     },
     {
      "t": "191435L OCT 26",
      "ok": true
     },
     {
      "t": "1435",
      "ok": false
     }
    ],
    "why": "SITREP 1 eilutė – data ir laikas (DTG): DDHHMM, zona (L – vietinis, Z – Zulu), mėnuo, metai. Vien valanda be datos ir zonos netinka.",
    "ref": [
     "#/sitrep"
    ]
   },
   {
    "sit": "Vienas karys žuvo, du sužeisti laukia evakuacijos, kiti šeši gali tęsti užduotį. Dingusių nėra.",
    "gp": {},
    "klaus": "Ką rašote 6 eilutėje (asmenys ir nuostoliai)?",
    "opt": [
     {
      "t": "Kovingi 9, sužeisti 2, žuvę 1, dingę 0",
      "ok": false
     },
     {
      "t": "Kovingi 6, sužeisti 3, žuvę 0, dingę 0",
      "ok": false
     },
     {
      "t": "Kovingi 6, sužeisti 2, žuvę 1, dingę 0",
      "ok": true
     }
    ],
    "why": "6 eilutė – kovingi (gali tęsti užduotį), sužeisti (WIA), žuvę (KIA), dingę be žinios (MIA). Sužeistieji ir žuvęs į kovingų skaičių neįeina, žuvęs nepriskiriamas sužeistiesiems.",
    "ref": [
     "#/sitrep"
    ]
   },
   {
    "sit": "SITREP perduosite atviru kanalu; sužeistiesiems reikia MEDEVAC.",
    "gp": {},
    "klaus": "Kaip perduodate?",
    "opt": [
     {
      "t": "Trumpai, be slaptos informacijos; MEDEVAC – 10 eilutėje ir 9-Line",
      "ok": true
     },
     {
      "t": "SITREP tekste – sužeistųjų vardai, pavardės ir MIST",
      "ok": false
     },
     {
      "t": "Visas 10 eilučių kartojate kas 5 min, net nieko nepasikeitus",
      "ok": false
     }
    ],
    "why": "SITREP – trumpas pranešimas vadui: tik tai, kas pasikeitė ar svarbu; atviru kanalu – be slaptos informacijos. MEDEVAC prašymas nurodomas 10 eilutėje, o priemonei iškviesti perduodamas 9-Line.",
    "ref": [
     "#/sitrep",
     "#/9line"
    ]
   }
  ]
 },
 {
  "id": "m49",
  "pav": "Ketaminas pervežant (CMC)",
  "tema": "TACEVAC",
  "lygis": "CMC",
  "q": [
   {
    "sit": "Sunkvežimis užvažiavo ant minos. Vairuotojo šlaunikaulio lūžis įtvertas, IV prieiga įvesta. Vežate jį sanitariniu šarvuočiu; skausmas nepakenčiamas, užduoties tęsti negali.",
    "gp": {
     "AVPU": "A",
     "Radialinis pulsas": "stiprus",
     "Skausmas": "8/10"
    },
    "klaus": "(CMC) Ką padarote prieš skirdami ketaminą?",
    "opt": [
     {
      "t": "Klausiate alergijų, AVPU ir skausmą įrašote, nuginkluojate",
      "ok": true
     },
     {
      "t": "Suleidžiate midazolamo, kad ketaminas veiktų švelniau",
      "ok": false
     },
     {
      "t": "Nieko – AVPU įrašysite, kai vaistas suveiks",
      "ok": false
     }
    ],
    "why": "Prieš ketaminą paklauskite apie alergijas, AVPU ir skausmą (0–10) įrašykite į kortelę, nuginkluokite ir apsvarstykite ryšio priemonių atjungimą. Benzodiazepinų su ketaminu neskirkite.",
    "ref": [
     "#/igudis/25",
     "#/igudis/31"
    ]
   },
   {
    "sit": "(CMC) Alergijų nėra, ginklas paimtas, AVPU ir skausmas įrašyti. IV prieiga veikia.",
    "gp": {
     "AVPU": "A",
     "Skausmas": "8/10"
    },
    "klaus": "(CMC) Kaip skiriate ketaminą?",
    "opt": [
     {
      "t": "100 mg IV per kelias sekundes",
      "ok": false
     },
     {
      "t": "25 mg IV lėtai per 1 min; kartoti ne dažniau kaip kas 30 min",
      "ok": true
     },
     {
      "t": "25 mg IV greitai; kartoti kas 5 min, kol skausmas išnyks",
      "ok": false
     }
    ],
    "why": "Ketaminas IV / IO – 25 mg lėtai per 1 min; kartoti kas 30 min pagal poreikį, kol skausmas sumažės ar atsiras nistagmas. Tikslas – pakenčiamas skausmas, ne visiškas jo panaikinimas.",
    "ref": [
     "#/vaistas/ketaminas",
     "#/igudis/25"
    ]
   },
   {
    "sit": "(CMC) Po 10 min sužeistasis neramus, blaškosi ant neštuvų ir pradeda vemti.",
    "gp": {
     "KD": "18",
     "SpO₂": "96 %",
     "Skausmas": "3/10"
    },
    "klaus": "(CMC) Ką darote?",
    "opt": [
     {
      "t": "Midazolamas – nuramins ir sumažins vėmimą",
      "ok": false
     },
     {
      "t": "Kartojate ketaminą – vėmimas rodo per mažą dozę",
      "ok": false
     },
     {
      "t": "Ondansetronas 4 mg, šoninė padėtis, diržai užveržti",
      "ok": true
     }
    ],
    "why": "Pykinimas ar vėmimas – ondansetronas 4 mg (ODT / IV / IO / IM), vemiantį paguldykite į šoninę padėtį. Po ketamino sužeistasis gali būti sujaudintas – pritvirtinkite neštuvų diržais; benzodiazepinų neskirkite. Ketamino nekartokite: praėjo tik 10 min (kartoti – ne dažniau kaip kas 30 min), skausmas jau 3/10.",
    "ref": [
     "#/vaistas/ondansetronas",
     "#/igudis/25"
    ]
   }
  ]
 },
 {
  "id": "m50",
  "pav": "Galvos trauma skrydyje (CMC)",
  "tema": "TACEVAC",
  "lygis": "CMC",
  "q": [
   {
    "sit": "Artilerijos sviedinys sprogo 20 m nuo kario; skeveldra sužeidė pilvą, išorinio kraujavimo nėra. Praėjus 30 min jis vis dar nevykdo paprastų komandų, vyzdžiai simetriški. Skrendate sraigtasparniu; kvėpuoja savarankiškai.",
    "gp": {
     "AVPU": "V",
     "KD": "16",
     "SpO₂": "89 %",
     "Radialinis pulsas": "stiprus"
    },
    "klaus": "(CMC) Ar skiriate deguonį?",
    "opt": [
     {
      "t": "Ne – daugumai sužeistųjų deguonies nereikia",
      "ok": false
     },
     {
      "t": "Ne – SpO₂ virš 85 % pakanka",
      "ok": false
     },
     {
      "t": "Taip – galvos trauma, tikslas SpO₂ ≥ 92 %",
      "ok": true
     }
    ],
    "why": "TACEVAC metu deguonies daugumai nereikia, bet jis skiriamas esant žemam SpO₂, galvos traumai (SpO₂ ≥ 92 %), sąmonės sutrikimui, šokui, skrydžiui aukštyje. Šis sužeistasis atitinka kelias indikacijas.",
    "ref": [
     "#/f/TACEVAC?t=1",
     "#/igudis/22"
    ]
   },
   {
    "sit": "(CMC) Po 10 min radialinis pulsas susilpnėjo, sAKS 88 mm Hg. Turite kraujo.",
    "gp": {
     "AVPU": "V",
     "SpO₂": "93 %",
     "Radialinis pulsas": "silpnas",
     "ŠSD": "124"
    },
    "klaus": "(CMC) Koks prioritetas?",
    "opt": [
     {
      "t": "Šokas – kraujas per šildytuvą; tikslas sAKS > 100 mm Hg",
      "ok": true
     },
     {
      "t": "Hipertoninis NaCl 250 ml – tūriui atkurti",
      "ok": false
     },
     {
      "t": "Skysčių neskiriate, kad nedidėtų spaudimas galvoje",
      "ok": false
     }
    ],
    "why": "Galvos traumos atveju šoką gydykite pirmiau: tikslas – normalus radialinis pulsas (sAKS > 100 mm Hg). Kraujas – kaip TFC, per šildytuvą. Hipertoninis NaCl tūriui atkurti neskiriamas.",
    "ref": [
     "#/igudis/22",
     "#/igudis/20"
    ]
   },
   {
    "sit": "(CMC) Prieš nusileidžiant kairysis vyzdys išsiplėtęs ir nereaguoja, atsiranda patologinė laikysena.",
    "gp": {
     "AVPU": "P",
     "SpO₂": "93 %",
     "Radialinis pulsas": "silpnas"
    },
    "klaus": "(CMC) Ką skiriate?",
    "opt": [
     {
      "t": "Nieko – hipertoninis NaCl skiriamas tik ligoninėje",
      "ok": false
     },
     {
      "t": "250 ml 3 % arba 5 % NaCl IV / IO per ≥ 10 min",
      "ok": true
     },
     {
      "t": "30 ml 3 % NaCl greita IV injekcija",
      "ok": false
     }
    ],
    "why": "Išvaržos požymiai (asimetriški arba fiksuoti ir išsiplėtę vyzdžiai, patologinė laikysena) – 250 ml 3 % ar 5 % NaCl (arba 30 ml 23,4 %) per ≥ 10 min; nėra atsako – kartoti po 20 min (maks. 2 dozės). Iš anksto praneškite priimančiai grandžiai.",
    "ref": [
     "#/vaistas/nacl-hipert",
     "#/igudis/22",
     "#/f/TACEVAC?t=2"
    ]
   }
  ]
 }
];
