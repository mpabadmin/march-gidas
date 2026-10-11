# March gidas

TCCC 2026 **MARCH PAWS** atminties priemonė MEDEVAC šauliams gelbėtojams (TCCC **CLS** ir **CMC** lygis).
LŠS Vilniaus 1040 medicinos šaulių kuopa · https://march.1040medkuopa.lt

## Kas viduje

- **Fazės:** CUF (pagalba apšaudymo metu), TFC (taktinė lauko pagalba, MARCH PAWS), TACEVAC (taktinė evakuacijos pagalba). Kiekviena fazė turi kontrolinius sąrašus.
- **9-Line MEDEVAC prašymas:** karo ir taikos meto versijos, GPS → MGRS, skaitymas per radiją, kopijavimas.
- **MIST kortelė:** kaip ETC gide – kūno schema su žymėmis (žaizda, kraujavimas, lūžis, nudegimas, amputacija, turniketas su laiku), požymių lentelė, gydymas (su „Rodyti tik CLS“ – be CMC veiksmų), skaitymo režimas; keli sužeistieji (skirtukai 1, 2, … ir „+“, „Kopijuoti visus“). Laikmačių laikai – pirmajam sužeistajam. Seni MIST formos duomenys perkeliami automatiškai (originalas – `mg-mist-v1`).
- **GKS skaičiuoklė:** Glasgow komos skalė, GKS-P, perkėlimas į dabartinio sužeistojo MIST kortelę.
- **TST rūšiavimas:** NHS Ten Second Triage, skaičiavimas.
- **Laikmačiai:** sužeidimo laikas (TXA ≤ 3 val.) ir turniketo laikas (konversija ≤ 2 val.).
- **Įgūdžiai (36):** JTS CLS / CMC kortelės, iliustracijos ir vaizdo įrašai iš tccc.org.ua (Deployed Medicine).
- **Vaistai:** pagal TCCC 2026 gaires. Žyma CMC reiškia, kad vaistą skiria kovos medikas.
- **Režimai:** *Taikymas* (tamsus, trumpi sąrašai) ir *Mokymasis* (paaiškinimai, temos, įsivertinimas).
- **Nustatymas „Rodyti tik CLS“:** paslepia CMC / CPP veiksmus.
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
| `tools.js` | 9-Line, MIST kortelė, GKS, TST, MGRS (9-Line, MIST ir GKS kodas toks pat kaip ETC gide – skiriasi tik `TCFG`) |
| `fb.js` | Pranešimai apie klaidas |
| `app.js` | Maršrutai ir veiksmai |
| `sw.js` | Darbas be interneto |

**Atnaujinant turinį:** pakeiskite `E.versija` faile `sarasai.js` ir `VERSION` faile `sw.js`.

## Talpinimas

GitHub Pages iš `main` šakos šaknies; domenas nurodytas faile `CNAME`.

---

Tai atminties priemonė, ne oficialus vadovas. Ji nepakeičia mokymų, vieneto SOP ir mediko nurodymų.
