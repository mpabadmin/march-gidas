# March gidas

TCCC 2026 **MARCH PAWS** atminties priemonė MEDEVAC šauliams gelbėtojams (TCCC **CLS** ir **CMC** lygis).
LŠS Vilniaus 1040 medicinos šaulių kuopa · https://march.1040medkuopa.lt

## Kas viduje

- **Fazės:** CUF (pagalba apšaudymo metu), TFC (taktinė lauko pagalba, MARCH PAWS), TACEVAC (taktinė evakuacijos pagalba). Kiekviena fazė turi kontrolinius sąrašus.
- **9-Line MEDEVAC prašymas:** karo ir taikos meto versijos, GPS → MGRS, skaitymas per radiją, kopijavimas.
- **Nukentėjusiojo kortelė (DD1380):** kaip ETC gide – kūno schema su žymėmis (žaizda, kraujavimas, lūžis, nudegimas, amputacija, turniketas su laiku), požymiai, gydymas, MIST perdavimo tekstas ir skaitymo režimas; keli sužeistieji. Popierinės kortelės nuskaitymas (be interneto), perdavimas QR kodu tarp ETC, March ir PCC gidų (vardo, gimimo datos ir teikėjų kode nėra). Seni MIST formos duomenys perkeliami automatiškai (originalas – `mg-mist-v1`).
- **GKS skaičiuoklė:** Glasgow komos skalė, GKS-P, perkėlimas į dabartinio sužeistojo kortelę.
- **10s triažas:** NHS Ten Second Triage, skaičiavimas.
- **SITREP, CONTREP, SALUTE:** pranešimų formos su DTG (DDHHMM, zona, mėnuo, metai).
- **Laikmačiai:** sužeidimo laikas (TXA ≤ 3 val.) ir turniketo laikas (konversija ≤ 2 val.).
- **Įgūdžiai (36):** JTS CLS / CMC kortelės, iliustracijos ir vaizdo įrašai iš tccc.org.ua (Deployed Medicine).
- **Vaistai:** pagal TCCC 2026 gaires. Žyma CMC reiškia, kad vaistą skiria kovos medikas. Vaisto puslapyje – „Lietuvoje: preparatai ir pakuotės“ (VVKT).
- **Sąsaja:** vienas režimas. Pradžia – piktogramos (fazės CUF / TFC / TACEVAC ir MEDEVAC įrankiai), apačioje – Pradžia, Pacientas, Vaistai, Įgūdžiai, Vertinimas, Treniruotė. Antraštėje – lygis CLS / CMC (CLS lygyje CMC veiksmai paslėpti), naktinis režimas, pranešimas apie klaidą, paieška, nustatymai. Paaiškinimai ir šaltiniai – po ⓘ arba „Paaiškinimas“. Juosta „Tik pagalbinė priemonė“ su TCCC kurso nuoroda.
- **Nustatymai:** lygis, sužeistųjų duomenų trynimas (ir automatinis), priminimai, iliustracijos be interneto, „Kitos programėlės“ (SIM, ETC, PCC, apps.1040medkuopa.lt).
- **Pranešimai apie klaidas:** komentaras ir ekrano vaizdas keliauja į tą pačią Google lentelę kaip ETC gido pranešimai (`etc-gidas/tools/atsiliepimai.gs`). Pranešimai žymimi „[March]“.

## Šaltiniai (pirmenybės tvarka)

1. TCCC gairės 2026 (CoTCCC, Deployed Medicine)
2. JTS TCCC CLS / CMC kursai (tccc.org.ua, Deployed Medicine)
3. M. Grinevičiaus TCCC kursas (lietuviški terminai)

## Failai

| Failas | Paskirtis |
|---|---|
| `sarasai.js` | Fazės, kontroliniai sąrašai, mokymosi puslapiai, temos, versija, pranešimų adresas |
| `vaistai.js` | Vaistai |
| `igudziai.js` | Įgūdžiai (generuojama) |
| `core.js`, `views.js` | Bendros funkcijos ir puslapių vaizdai |
| `tools.js` | 9-Line, nukentėjusiojo kortelė, GKS, 10s triažas, scenarijai, pacientas, QR, MGRS (didžioji dalis kodo – kaip ETC ir PCC giduose, skiriasi `TCFG`) |
| `sitrep.js`, `contrep.js`, `salute.js` | SITREP, CONTREP, SALUTE |
| `pacientas.js`, `march-hub.js` | Paciento ekranas ir MARCH PAWS apžvalga |
| `priedai.js`, `skenas.js`, `guide.js` | Vertinimas, dozių kortelės, duomenų apsauga; kortelės nuskaitymas; instrukcija |
| `fb.js` | Pranešimai apie klaidas |
| `app.js` | Maršrutai ir veiksmai |
| `sw.js` | Darbas be interneto |

**Atnaujinant turinį:** pakeiskite `E.versija` faile `sarasai.js` ir `VERSION` faile `sw.js`.

## Talpinimas

GitHub Pages iš `main` šakos šaknies; domenas nurodytas faile `CNAME`.

---

Tai atminties priemonė, ne oficialus vadovas. Ji nepakeičia mokymų, vieneto SOP ir mediko nurodymų.
