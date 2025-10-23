# 🖼️ Primeri Korišćenja - Sportska Kladionica

## 📱 Pregled Stranica

### 1. Login/Registracija Stranica (`login.html`)

**Šta vidite:**
```
┌─────────────────────────────────────┐
│        ⚽ Sportska Kladionica        │
│        Dobrodošli nazad!             │
├─────────────────────────────────────┤
│  [Prijava]  [Registracija]          │
├─────────────────────────────────────┤
│  👤 Korisničko ime: [_______]       │
│  🔒 Lozinka: [_______]               │
│                                      │
│  [🚀 Prijavi se]                    │
├─────────────────────────────────────┤
│  🎮 Demo Nalog                       │
│  Korisnik: demo                      │
│  Lozinka: demo123                    │
│                                      │
│  Admin: admin / admin123             │
└─────────────────────────────────────┘
```

**Demo Nalozi:**
- **demo** / **demo123** → Obični korisnik (10,000 RSD)
- **admin** / **admin123** → Administrator (100,000 RSD)

---

### 2. Glavna Stranica - Kladionica (`index.html`)

**Header:**
```
┌─────────────────────────────────────────────────┐
│ ⚽ Sportska Kladionica    👤 Demo Korisnik      │
│                           💰 10,000 RSD         │
│                           [🚪 Odjava]           │
└─────────────────────────────────────────────────┘
```

**Navigacija:**
```
┌─────────────────────────────────────────────┐
│ [🏆 Svi sportovi] [⚽ Fudbal] [🏀 Košarka]   │
│ [🎾 Tenis]                                    │
└─────────────────────────────────────────────┘
```

**Filteri:**
```
┌──────────────────────────────────────────────────┐
│ 🔍 [Pretraži...]  [Liga ▼]  [Datum ▼]  [Očisti] │
└──────────────────────────────────────────────────┘
```

**Prikaz Meča:**
```
┌────────────────────────────────────────────┐
│ ⚽ FUDBAL           Superliga Srbije       │
│                    23. Okt  20:00          │
├────────────────────────────────────────────┤
│    Crvena Zvezda      VS      Partizan     │
│    P:12 N:3 I:2              P:10 N:5 I:2  │
├────────────────────────────────────────────┤
│   [  1  ]       [  X  ]       [  2  ]      │
│   2.10          3.20          3.80         │
├────────────────────────────────────────────┤
│            [📊 Prikaži statistiku]         │
└────────────────────────────────────────────┘
```

**Tiket (desna strana):**
```
┌─────────────────────────────┐
│ 🧾 Tvoj Tiket    [Očisti]   │
├─────────────────────────────┤
│ Crvena Zvezda vs Partizan   │
│ Superliga Srbije            │
│ Domaćin pobeda        2.10  │
│                        [✖]   │
├─────────────────────────────┤
│ Real Madrid vs Barcelona    │
│ La Liga                     │
│ Barcelona pobeda      2.90  │
│                        [✖]   │
├─────────────────────────────┤
│ Broj mečeva: 2              │
│ Ukupna kvota: 6.09          │
│                             │
│ Ulog (RSD): [100___]        │
│                             │
│ Potencijalni dobitak:       │
│ 609.00 RSD                  │
├─────────────────────────────┤
│   [💰 Uplati tiket]         │
└─────────────────────────────┘
```

---

### 3. Admin Panel (`admin.html`)

**Header:**
```
┌─────────────────────────────────────────────┐
│ ⚙️ Admin Panel      👤 Administrator       │
│                     [🚪 Odjava]             │
└─────────────────────────────────────────────┘
```

**Forma za Dodavanje:**
```
┌──────────────────────────────────────────────┐
│ ➕ Dodaj novu utakmicu                       │
├──────────────────────────────────────────────┤
│ Sport: [Fudbal ▼]                            │
│ Liga: [Premier League_____________]          │
│                                              │
│ Domaćin: [Manchester United____]             │
│ Gost: [Liverpool____________]                │
│                                              │
│ Datum: [2025-10-28]  Vreme: [20:00]         │
│                                              │
│ Kvote:                                       │
│   1: [2.50]  X: [3.20]  2: [3.80]           │
│                                              │
│ 📊 Statistika (Fudbal):                     │
│ Domaćin Pobede: [10]  Nerešeno: [3]         │
│ ...                                          │
│                                              │
│ [➕ Dodaj utakmicu]                          │
└──────────────────────────────────────────────┘
```

**Tabela Utakmica:**
```
┌────────────────────────────────────────────────────────────┐
│ Sport    │ Liga      │ Utakmica         │ Akcije          │
├────────────────────────────────────────────────────────────┤
│ ⚽ fudbal │ Superliga │ Zvezda vs Partn  │ [✏️][🗑️]      │
│ 🏀 košarka│ NBA      │ Lakers vs Celtics│ [✏️][🗑️]      │
│ 🎾 tenis  │ ATP      │ Đoković vs Alcrz │ [✏️][🗑️]      │
└────────────────────────────────────────────────────────────┘
```

---

## 🎮 Primeri Scenarija Korišćenja

### Scenario 1: Novi Korisnik - Registracija

```
Korak 1: Otvori login.html
         ↓
Korak 2: Klikni "Registracija" tab
         ↓
Korak 3: Popuni formu:
         • Ime: Marko Marković
         • Username: marko123
         • Email: marko@example.com
         • Lozinka: marko2025
         • Potvrda: marko2025
         ↓
Korak 4: Klikni "✨ Registruj se"
         ↓
Rezultat: ✅ "Registracija uspešna! Dobili ste 1000 RSD bonusa."
         ✅ Automatska prijava
         ✅ Redirect na index.html
```

---

### Scenario 2: Klađenje na Utakmicu

```
Korak 1: Prijava (demo / demo123)
         Stanje: 10,000 RSD
         ↓
Korak 2: Odaberi sport "⚽ Fudbal"
         ↓
Korak 3: Pronađi utakmicu:
         "Crvena Zvezda vs Partizan"
         ↓
Korak 4: Klikni kvotu "1" (2.10)
         → Meč se dodaje na tiket
         → Animacija: Zeleni flash
         ↓
Korak 5: Dodaj još jedan meč:
         "Real Madrid vs Barcelona"
         Klikni "2" (2.90)
         ↓
Korak 6: Tiket automatski računa:
         • Broj mečeva: 2
         • Ukupna kvota: 6.09
         ↓
Korak 7: Unesi ulog: 100 RSD
         → Automatski prikazuje: 609.00 RSD
         ↓
Korak 8: Klikni "💰 Uplati tiket"
         ↓
Rezultat: ✅ Modal sa potvrdom
         ✅ Novo stanje: 9,900 RSD
         ✅ Tiket u istoriji
         ✅ Tiket očišćen
```

---

### Scenario 3: Admin Dodaje Novu Utakmicu

```
Korak 1: Prijava kao admin (admin / admin123)
         ↓
Korak 2: Automatski redirect na admin.html
         ↓
Korak 3: Popuni formu:
         • Sport: Fudbal
         • Liga: Serie A
         • Domaćin: AC Milan
         • Gost: Napoli
         • Datum: 2025-10-30
         • Vreme: 21:00
         • Kvote: 2.40 / 3.10 / 2.95
         ↓
Korak 4: Unesi statistiku:
         • Milan: 11-4-2, 32:14
         • Napoli: 12-3-2, 35:11
         ↓
Korak 5: Klikni "➕ Dodaj utakmicu"
         ↓
Rezultat: ✅ "Utakmica uspešno dodata!"
         ✅ Pojavljuje se u tabeli
         ✅ Odmah vidljiva na index.html
```

---

### Scenario 4: Izmena Kvota

```
Korak 1: Admin panel (admin.html)
         ↓
Korak 2: U tabeli pronađi:
         "Crvena Zvezda vs Partizan"
         ↓
Korak 3: Klikni "✏️ Izmeni"
         ↓
Korak 4: Forma se popunjava postojećim podacima
         ↓
Korak 5: Izmeni kvote:
         • Bilo: 2.10 / 3.20 / 3.80
         • Novo: 1.95 / 3.40 / 4.00
         ↓
Korak 6: Klikni "💾 Sačuvaj izmene"
         ↓
Rezultat: ✅ "Utakmica uspešno izmenjena!"
         ✅ Nove kvote odmah aktivne
         ✅ Korisnici vide nove kvote
```

---

## 📊 Primeri Podataka

### Fudbal Meč - Kompletan Prikaz

```javascript
{
    id: 1,
    sport: 'fudbal',
    league: 'Superliga Srbije',
    homeTeam: 'Crvena Zvezda',
    awayTeam: 'Partizan',
    date: '2025-10-23',
    time: '20:00',
    odds: {
        home: 2.10,
        draw: 3.20,
        away: 3.80
    },
    stats: {
        home: {
            wins: 12,
            draws: 3,
            losses: 2,
            goalsScored: 34,
            goalsConceded: 12
        },
        away: {
            wins: 10,
            draws: 5,
            losses: 2,
            goalsScored: 28,
            goalsConceded: 15
        }
    }
}
```

**Kako izgleda:**
```
┌─────────────────────────────────────────┐
│ ⚽ FUDBAL        Superliga Srbije       │
│                 23. Okt  20:00          │
├─────────────────────────────────────────┤
│     Crvena Zvezda    VS    Partizan     │
│     P:12 N:3 I:2          P:10 N:5 I:2  │
├─────────────────────────────────────────┤
│    [  1  ]     [  X  ]     [  2  ]      │
│    2.10        3.20        3.80         │
└─────────────────────────────────────────┘
```

---

### Košarka Meč

```javascript
{
    id: 7,
    sport: 'kosarka',
    league: 'NBA',
    homeTeam: 'LA Lakers',
    awayTeam: 'Boston Celtics',
    date: '2025-10-23',
    time: '02:00',
    odds: {
        home: 2.20,
        draw: null,  // Nema X za košarku
        away: 1.65
    },
    stats: {
        home: {
            wins: 8,
            losses: 4,
            pointsScored: 1234,
            pointsConceded: 1189
        },
        away: {
            wins: 10,
            losses: 2,
            pointsScored: 1298,
            pointsConceded: 1145
        }
    }
}
```

**Kako izgleda:**
```
┌────────────────────────────────────┐
│ 🏀 KOŠARKA           NBA           │
│                 23. Okt  02:00     │
├────────────────────────────────────┤
│   LA Lakers    VS   Boston Celtics │
│   P:8 I:4             P:10 I:2     │
├────────────────────────────────────┤
│      [  1  ]          [  2  ]      │
│      2.20             1.65         │
└────────────────────────────────────┘
```

---

### Tenis Meč

```javascript
{
    id: 11,
    sport: 'tenis',
    league: 'ATP Masters',
    homeTeam: 'Novak Đoković',
    awayTeam: 'Carlos Alcaraz',
    date: '2025-10-23',
    time: '16:00',
    odds: {
        home: 1.80,
        draw: null,  // Nema X za tenis
        away: 2.00
    },
    stats: {
        home: {
            rank: 1,
            titlesThisYear: 5,
            winRate: 87
        },
        away: {
            rank: 2,
            titlesThisYear: 4,
            winRate: 84
        }
    }
}
```

**Kako izgleda:**
```
┌──────────────────────────────────────┐
│ 🎾 TENIS         ATP Masters         │
│                  23. Okt  16:00      │
├──────────────────────────────────────┤
│  Novak Đoković  VS  Carlos Alcaraz   │
│  Rang:1 Win:87%     Rang:2 Win:84%   │
├──────────────────────────────────────┤
│       [  1  ]         [  2  ]        │
│       1.80            2.00           │
└──────────────────────────────────────┘
```

---

## 💡 Saveti za Testiranje

### 1. Testiraj Logout

```javascript
// U browser konzoli (F12):
console.log('Current user:', localStorage.getItem('currentUser'));

// Klikni "Odjava" dugme
// Očekivano: Confirm dijalog → Redirect na login.html
```

### 2. Testiraj Balance

```javascript
// Registruj se kao novi korisnik
// Očekivano: 1,000 RSD početni bonus

// Kladi se sa 500 RSD
// Očekivano: Stanje postaje 500 RSD

// Pokušaj da se kladiš sa 600 RSD
// Očekivano: Alert "Nemate dovoljno sredstava!"
```

### 3. Testiraj Admin Pristup

```javascript
// Prijavi se kao 'demo'
// Pokušaj otvoriti admin.html
// Očekivano: Alert "Pristup odbijen!" → Redirect na index.html

// Prijavi se kao 'admin'
// Otvori admin.html
// Očekivano: Uspešan pristup
```

### 4. Testiraj Tiket Sistem

```
1. Dodaj 3 meča na tiket
   Očekivano: Kvota se množi (npr. 2.0 × 3.0 × 1.5 = 9.0)

2. Ukloni jedan meč
   Očekivano: Kvota se preračunava

3. Uplati tiket
   Očekivano: Stanje se smanjuje, tiket u istoriji

4. Obnovi stranicu
   Očekivano: Istorija tiketa i dalje postoji
```

---

## 🎨 Boje i Stil

### Boje

```css
Tamna pozadina:  #0f1419
Kartice:         #1a1f29
Zelena:          #00ff41
Zlatna:          #ffd700
Crvena (danger): #ff4757
Bela:            #ffffff
Siva:            #b0b8c1
```

### Ikone

```
⚽ - Fudbal
🏀 - Košarka
🎾 - Tenis
👤 - Korisnik
💰 - Novac/Stanje
🧾 - Tiket
📊 - Statistika
⚙️ - Admin
🚪 - Odjava
✏️ - Izmeni
🗑️ - Obriši
```

---

## 🔥 Brzi Testovi

### Test 1: Registracija i Prvi Tiket

```
1. Otvori login.html
2. Registruj se (ime: Test, user: test, pass: test123)
3. Proveri: Stanje = 1,000 RSD ✓
4. Dodaj jedan meč na tiket (kvota 2.0)
5. Uplati 100 RSD
6. Proveri: Stanje = 900 RSD ✓
7. Proveri: Potencijalni dobitak bio = 200 RSD ✓
```

### Test 2: Admin Funkcionalnost

```
1. Prijavi se kao admin
2. Dodaj novu utakmicu
3. Odjavi se
4. Prijavi se kao demo
5. Proveri: Nova utakmica je vidljiva ✓
```

### Test 3: Logout i Zaštita

```
1. Prijavi se kao demo
2. Kopiraj URL: index.html
3. Odjavi se
4. Pokušaj otvoriti index.html direktno
5. Očekivano: Automatski redirect na login.html ✓
```

---

**Sve je spremno za testiranje! 🎉**

Otvorite **demo.html** za interaktivni pregled ili **login.html** za početak.

