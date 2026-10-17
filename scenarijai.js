// March gidas – TRENIRUOČIŲ SCENARIJAI (tools.js SC). Kiekvienas atsakymas paremtas gido turiniu (ref – nuorodos į įgūdžius, sąrašus, vaistus).
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
    "sit": "Po pakartotinio tamponavimo kraujavimas sustojo. Turite turniketą ir gertuvę.",
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
    "sit": "Skeveldra pataikė į šlaunį, masyvaus kraujavimo nėra. Sužeistasis be sąmonės guli ant nugaros ir knarkia. Krito ne iš aukščio, kaklo trauma neįtariama.",
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
    "sit": "Po 10 min kvėpavimas suretėjo ir tapo paviršinis, SpO₂ nekyla. Galvos traumos požymių nėra.",
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
      "t": "Tamponuojate žaizdą hemostatiniu tvarsčiu",
      "ok": false
     },
     {
      "t": "Uždengiate delnu, nuvalote odą ir klijuojate ventiliuojamą krūtinės lipduką",
      "ok": true
     },
     {
      "t": "Klijuojate lipduką tiesiai ant kruvinos odos",
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
      "t": "Ties spenelio linija, po šonkaulio apatiniu kraštu",
      "ok": false
     },
     {
      "t": "Dešinėje: 14 G ar 10 G, 8 cm, 5-asis tarpšonkaulis, priekinė pažasties linija",
      "ok": true
     }
    ],
    "why": "NDC – pažeistoje pusėje: 5-asis tarpšonkaulis priekinėje pažasties linijoje (arba 2-asis vidurinėje raktikaulio linijoje), statmenai, virš apatinio šonkaulio. Mediališkiau spenelio linijos – klaida.",
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
      "t": "Kalcis: 10 ml 10 % kalcio gliukonato",
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
  "pav": "Apvirtęs automobilis (CMC)",
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
    "sit": "(CMC) IV / IO prieigos dar nėra. Skiriate ketaminą į raumenis.",
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
 }
];
