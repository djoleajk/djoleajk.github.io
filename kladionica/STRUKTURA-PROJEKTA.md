# 📂 Struktura Projekta - Sportska Kladionica

## 📁 Fajlovi i njihova namena

```
kladionica/
│
├── 📄 index.html           - Glavna stranica kladionice
├── 📄 admin.html           - Admin panel za upravljanje utakmicama
│
├── 🎨 styles.css           - Svi stilovi (zajednički za obe stranice)
│
├── ⚙️ app.js               - Glavna logika kladionice
├── ⚙️ admin.js             - Logika admin panela
│
├── 📖 README.md            - Opšte informacije i dokumentacija
├── 📖 UPUTSTVO.md          - Detaljna uputstva za korišćenje
└── 📖 STRUKTURA-PROJEKTA.md - Ovaj fajl
```

---

## 🔍 Detaljni Opis Fajlova

### 📄 `index.html` (Glavna Stranica)

**Namena:** Korisni interfejs za klađenje

**Sekcije:**
- **Header** - Logo, naziv, admin link, datum
- **Navigacija** - Filteri po sportovima (Svi, Fudbal, Košarka, Tenis)
- **Filteri** - Pretraga, liga, datum
- **Lista mečeva** - Kartice sa utakmicama i kvotama
- **Tiket** - Sticky sekcija sa izabranim mečevima
- **Modali** - Statistika meča i uspešna uplata

**Ključni elementi:**
```html
<nav class="main-nav">           - Navigacija po sportovima
<section class="filter-section"> - Filteri i pretraga
<section class="matches-section"> - Prikaz mečeva
<aside class="ticket-section">   - Tiket sistem
<div id="matchModal">            - Modal za statistiku
<div id="successModal">          - Modal za potvrdu uplate
```

---

### 📄 `admin.html` (Admin Panel)

**Namena:** Upravljanje utakmicama, kvotama i statistikama

**Sekcije:**
- **Header** - Admin oznaka, link nazad na kladionicu
- **Forma za dodavanje/izmenu** - Sva polja za unos utakmice
- **Tabela utakmica** - Pregled svih postojećih utakmica
- **Akcije** - Dugmići za izmenu i brisanje

**Ključni elementi:**
```html
<form id="matchForm">            - Forma za unos/izmenu
<select id="sport">              - Odabir sporta
<div id="footballStats">         - Statistika za fudbal
<div id="basketballStats">       - Statistika za košarku
<div id="tennisStats">           - Statistika za tenis
<table class="matches-table">    - Tabela svih utakmica
```

**Dinamička polja:** Polja za statistiku se menjaju na osnovu odabranog sporta.

---

### 🎨 `styles.css` (Stilovi)

**Namena:** Kompletna vizuelna prezentacija

**Sekcije:**
```css
/* ===== RESET & BASE ===== */
:root { ... }                    - CSS promenljive (boje, senke)

/* ===== HEADER ===== */
header { ... }                   - Gornji header
.logo { ... }                    - Logo i naziv
.admin-link { ... }              - Link ka admin panelu

/* ===== NAVIGATION ===== */
.main-nav { ... }                - Navigaciona traka
.nav-btn { ... }                 - Dugmići za sportove

/* ===== FILTER SECTION ===== */
.filter-section { ... }          - Sekcija za pretragu
.filter-group { ... }            - Grupa filtera

/* ===== MATCHES LIST ===== */
.match-card { ... }              - Kartica pojedinačnog meča
.match-teams { ... }             - Prikaz timova
.match-odds { ... }              - Prikaz kvota
.odd-btn { ... }                 - Dugme za kvotu

/* ===== TICKET SECTION ===== */
.ticket-section { ... }          - Sticky tiket
.ticket-match { ... }            - Meč na tiketu
.ticket-calculation { ... }      - Računanje dobitka

/* ===== MODAL ===== */
.modal { ... }                   - Modal overlay
.modal-content { ... }           - Sadržaj modala

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 1024px) { ... }  - Tablet
@media (max-width: 768px) { ... }   - Mobile
@media (max-width: 480px) { ... }   - Small mobile
```

**Boje:**
```css
--dark-bg: #0f1419           - Tamna pozadina
--card-bg: #1a1f29           - Pozadina kartice
--primary-green: #00ff41     - Primarna zelena
--gold: #ffd700              - Zlatna za akcente
```

**Animacije:**
- `@keyframes fadeIn`        - Za prikaz mečeva
- `@keyframes slideIn`       - Za dodavanje na tiket
- `@keyframes pulse`         - Za selekciju kvote
- `@keyframes rotate`        - Za logo ikonu
- `@keyframes scaleIn`       - Za success modal

---

### ⚙️ `app.js` (Glavna Logika)

**Namena:** Sva logika korisničkog interfejsa

**Glavne funkcije:**

**Inicijalizacija:**
```javascript
init()                          - Pokretanje aplikacije
displayCurrentDate()            - Prikaz trenutnog datuma
populateLeagueFilter()          - Popunjavanje dropdown-a liga
setupEventListeners()           - Postavljanje event listener-a
```

**Filtriranje i prikaz:**
```javascript
filterMatches()                 - Filtriranje mečeva (sport, liga, datum, pretraga)
displayMatches()                - Prikaz filtriranih mečeva
createMatchCard(match)          - Kreiranje HTML kartice meča
getTeamStats(match, team)       - Prikaz statistike tima
```

**Tiket sistem:**
```javascript
addToTicket(matchId, selection, odd)  - Dodavanje meča na tiket
removeFromTicket(index)                - Uklanjanje meča sa tiketa
clearTicket()                          - Brisanje celog tiketa
displayTicket()                        - Prikaz tiketa
calculateTotalOdds()                   - Računanje ukupne kvote
calculatePotentialWin()                - Računanje potencijalnog dobitka
saveTicket()                           - Čuvanje u localStorage
```

**Uplata i modali:**
```javascript
placeTicket()                   - Uplata tiketa
showMatchStats(matchId)         - Prikaz statistike meča
closeModals()                   - Zatvaranje modala
generateTicketId()              - Generisanje ID-a tiketa
```

**Podaci:**
```javascript
matches                         - Niz svih utakmica (učitava iz localStorage)
getDefaultMatches()             - Vraća default utakmice
ticket                          - Niz mečeva na tiketu
```

---

### ⚙️ `admin.js` (Admin Logika)

**Namena:** Upravljanje utakmicama

**Glavne funkcije:**

**Inicijalizacija:**
```javascript
init()                          - Pokretanje admin panela
setupEventListeners()           - Event listener-i
updateStatsFields()             - Prikazivanje/sakrivanje polja za statistiku
```

**CRUD operacije:**
```javascript
handleSubmit(e)                 - Submit forme (dodavanje ili izmena)
editMatch(matchId)              - Izmena postojeće utakmice
deleteMatch(matchId)            - Brisanje utakmice
cancelEdit()                    - Otkazivanje izmene
```

**Prikaz:**
```javascript
displayMatches()                - Prikaz svih utakmica u tabeli
formatDate(dateStr)             - Formatiranje datuma
showSuccess(message)            - Prikaz success poruke
```

**LocalStorage:**
```javascript
saveMatches()                   - Čuvanje utakmica
getDefaultMatches()             - Default utakmice (iste kao u app.js)
```

**Promenljive:**
```javascript
matches                         - Niz svih utakmica
editingMatchId                  - ID utakmice koja se trenutno edituje
```

---

## 🔗 Kako Fajlovi Komuniciraju

### 1. **LocalStorage - Centralno Skladište**

```
┌─────────────┐
│ localStorage│
│  "matches"  │ ←──────┐
│  "ticket"   │ ←──┐   │
└─────────────┘    │   │
      ↑ ↓          │   │
      │ │          │   │
┌─────┴─┴────┐  ┌──┴───┴───┐
│   app.js   │  │ admin.js │
│ (Čita/Piše)│  │ (Piše)   │
└────────────┘  └──────────┘
```

- **app.js** čita "matches" i "ticket"
- **admin.js** piše "matches"
- Obe stranice dele iste podatke

### 2. **Stilovi - Zajednički CSS**

```
┌──────────────┐
│  styles.css  │
└──────┬───────┘
       ├─────────────┐
       ↓             ↓
┌─────────────┐ ┌─────────────┐
│ index.html  │ │ admin.html  │
└─────────────┘ └─────────────┘
```

- Obe stranice koriste isti CSS fajl
- Konzistentna vizuelna prezentacija

### 3. **Tok Podataka - Dodavanje Utakmice**

```
[Admin Panel]
     │
     ├─ Korisnik popunjava formu
     ├─ admin.js → handleSubmit()
     ├─ Kreira match objekat
     ├─ Dodaje u matches[]
     └─ localStorage.setItem('matches')
           │
           ↓
    [LocalStorage]
           │
           ↓
[Glavna Stranica]
     │
     ├─ app.js → init()
     ├─ Učitava matches iz localStorage
     ├─ Filtrira mečeve
     └─ Prikazuje na stranici
```

### 4. **Tok Podataka - Uplata Tiketa**

```
[Glavna Stranica]
     │
     ├─ Korisnik klikne na kvotu
     ├─ app.js → addToTicket()
     ├─ Dodaje u ticket[]
     ├─ localStorage.setItem('ticket')
     │
     ├─ Korisnik unese ulog
     ├─ app.js → calculatePotentialWin()
     │
     ├─ Korisnik klikne "Uplati tiket"
     ├─ app.js → placeTicket()
     ├─ Prikazuje successModal
     └─ Čisti ticket[]
```

---

## 📊 Format Podataka

### Match Object (Utakmica)

```javascript
{
    id: 1,                          // Jedinstveni ID (timestamp)
    sport: 'fudbal',                // 'fudbal' | 'kosarka' | 'tenis'
    league: 'Premier League',       // Naziv lige
    homeTeam: 'Manchester United',  // Domaćin
    awayTeam: 'Liverpool',          // Gost
    date: '2025-10-23',             // YYYY-MM-DD
    time: '18:30',                  // HH:MM
    odds: {
        home: 3.40,                 // Kvota domaćin
        draw: 3.50,                 // Kvota nerešeno (null za tenis/košarku)
        away: 2.15                  // Kvota gost
    },
    stats: {
        home: { ... },              // Statistika domaćina
        away: { ... }               // Statistika gosta
    }
}
```

### Stats Object - Fudbal

```javascript
stats: {
    home: {
        wins: 8,                    // Pobede
        draws: 4,                   // Nerešeni
        losses: 3,                  // Porazi
        goalsScored: 24,            // Golovi dati
        goalsConceded: 18           // Golovi primljeni
    },
    away: { ... }
}
```

### Stats Object - Košarka

```javascript
stats: {
    home: {
        wins: 8,                    // Pobede
        losses: 4,                  // Porazi
        pointsScored: 1234,         // Poeni dati
        pointsConceded: 1189        // Poeni primljeni
    },
    away: { ... }
}
```

### Stats Object - Tenis

```javascript
stats: {
    home: {
        rank: 1,                    // ATP/WTA rang
        titlesThisYear: 5,          // Broj titula
        winRate: 87                 // Procenat pobeda
    },
    away: { ... }
}
```

### Ticket Item (Stavka na tiketu)

```javascript
{
    matchId: 1,                     // ID utakmice
    match: { ... },                 // Kompletan match objekat
    selection: 'home',              // 'home' | 'draw' | 'away'
    odd: 3.40                       // Odabrana kvota
}
```

---

## 🎯 Ključne Funkcionalnosti po Fajlovima

### index.html + app.js
- ✅ Prikaz utakmica
- ✅ Filtriranje po sportu, ligi, datumu
- ✅ Tekstualna pretraga
- ✅ Dodavanje na tiket
- ✅ Računanje kvote i dobitka
- ✅ Čuvanje tiketa u localStorage
- ✅ Prikaz statistike
- ✅ Uplata tiketa

### admin.html + admin.js
- ✅ Dodavanje novih utakmica
- ✅ Izmena postojećih utakmica
- ✅ Brisanje utakmica
- ✅ Dinamička forma za različite sportove
- ✅ Validacija unosa
- ✅ Automatsko čuvanje
- ✅ Pregled svih utakmica

### styles.css
- ✅ Responsive dizajn (desktop, tablet, mobile)
- ✅ Tamna tema sa zeleno-zlatnim akcentima
- ✅ Animacije i prelazi
- ✅ Custom scrollbar
- ✅ Hover efekti
- ✅ Modal prozori

---

## 🔧 Kako Modifikovati

### Dodavanje Novog Sporta

1. **U admin.html:**
   ```html
   <option value="rukomet">🤾 Rukomet</option>
   ```

2. **U admin.js - dodaj stats sekciju:**
   ```javascript
   // HTML
   <div id="handballStats" class="stats-fields">
       <!-- Polja za rukomet -->
   </div>
   
   // JS
   updateStatsFields() {
       handballStats.style.display = sport === 'rukomet' ? 'block' : 'none';
   }
   ```

3. **U app.js - dodaj emoji:**
   ```javascript
   const sportEmojis = {
       fudbal: '⚽',
       kosarka: '🏀',
       tenis: '🎾',
       rukomet: '🤾'  // Novi sport
   };
   ```

4. **U index.html - dodaj nav button:**
   ```html
   <button class="nav-btn" data-sport="rukomet">
       <span>🤾</span> Rukomet
   </button>
   ```

### Promena Boja

U `styles.css` sekciji `:root`:
```css
:root {
    --primary-green: #00ff41;    /* Promeni u drugu boju */
    --gold: #ffd700;              /* Promeni zlatnu */
    --dark-bg: #0f1419;           /* Promeni pozadinu */
}
```

### Dodavanje Novih Filtera

1. **U index.html:**
   ```html
   <select id="newFilter">
       <option value="all">Svi</option>
   </select>
   ```

2. **U app.js:**
   ```javascript
   const newFilter = document.getElementById('newFilter');
   newFilter.addEventListener('change', (e) => {
       // Logika filtera
       displayMatches();
   });
   ```

---

## 📱 Responsive Breakpoints

```css
Desktop:       1024px+     (Grid 2 kolone)
Tablet:        768px-1024px (Grid 1 kolona)
Mobile:        480px-768px  (Kompaktni prikaz)
Small Mobile:  <480px       (Minimizirani elementi)
```

---

## 🚀 Deployovanje

Aplikacija je **potpuno statička** i može se pokrenuti bilo gdje:

1. **Lokalno** - Samo otvorite `index.html`
2. **GitHub Pages** - Upload-ujte sve fajlove
3. **Netlify** - Drag & drop folder
4. **Vercel** - Deploy static files
5. **Bilo koji web server** - Postavite fajlove u root

**Nema potrebe za:**
- Node.js
- Build process
- Backend server
- Baza podataka

---

## 📚 Dodatni Resursi

- **README.md** - Opšte informacije i features
- **UPUTSTVO.md** - Detaljna uputstva za korišćenje
- **Ovaj fajl** - Tehnička dokumentacija strukture

---

**Sretno sa razvojem! 🎉**

