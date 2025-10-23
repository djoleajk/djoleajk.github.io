# 📖 Brza Uputstva - Sportska Kladionica

## 🚀 Brzi Start

### Za Korisnike
1. Otvorite `index.html` u browser-u
2. Odaberite sport iz navigacije (⚽ Fudbal, 🏀 Košarka, 🎾 Tenis)
3. Kliknite na kvotu (1, X, ili 2) da dodate meč na tiket
4. Unesite iznos uloga
5. Kliknite "💰 Uplati tiket"

### Za Administratore
1. Kliknite na **⚙️ Admin** dugme u header-u
2. Popunite formu za novu utakmicu
3. Odaberite sport, unesite timove, datum, vreme i kvote
4. Dodajte statistiku
5. Kliknite "➕ Dodaj utakmicu"

---

## ⚙️ Admin Panel - Kako upravljati utakmicama

### ➕ Dodavanje nove utakmice

**Korak 1: Osnovni podaci**
```
Sport: [Odabir iz dropdown-a]
Liga: npr. "Premier League", "NBA", "ATP Masters"
Domaćin: npr. "Manchester United", "LA Lakers", "Novak Đoković"
Gost: npr. "Liverpool", "Boston Celtics", "Carlos Alcaraz"
Datum: [Kalendar picker]
Vreme: [Vreme picker]
```

**Korak 2: Kvote**
```
Fudbal:     1: 2.50  |  X: 3.20  |  2: 3.80
Košarka:    1: 1.75  |           |  2: 2.05
Tenis:      1: 1.80  |           |  2: 2.00
```

**Korak 3: Statistika**

**Za Fudbal:**
```
Domaćin:
  - Pobede: 10
  - Nerešeno: 3
  - Porazi: 2
  - Golovi dati: 28
  - Golovi primljeni: 12

Gost:
  - Pobede: 8
  - Nerešeno: 5
  - Porazi: 2
  - Golovi dati: 24
  - Golovi primljeni: 15
```

**Za Košarku:**
```
Domaćin:
  - Pobede: 14
  - Porazi: 3
  - Poeni dati: 1456
  - Poeni primljeni: 1289

Gost:
  - Pobede: 12
  - Porazi: 5
  - Poeni dati: 1398
  - Poeni primljeni: 1312
```

**Za Tenis:**
```
Igrač 1:
  - ATP/WTA Rang: 1
  - Titule ove godine: 5
  - Win Rate %: 87

Igrač 2:
  - ATP/WTA Rang: 2
  - Titule ove godine: 4
  - Win Rate %: 84
```

---

### ✏️ Izmena postojeće utakmice

1. Scroll-ujte do tabele "Sve utakmice"
2. Pronađite utakmicu koju želite da izmenite
3. Kliknite **✏️ Izmeni**
4. Forma će se automatski popuniti sa trenutnim podacima
5. Izmenite šta želite (kvote, datum, statistiku...)
6. Kliknite **💾 Sačuvaj izmene**

**Primer izmene kvota:**
```
Originalno: Man Utd vs Liverpool  |  3.40 / 3.50 / 2.15
Novo:       Man Utd vs Liverpool  |  3.60 / 3.40 / 2.05
```

---

### 🗑️ Brisanje utakmice

1. Pronađite utakmicu u tabeli
2. Kliknite **🗑️ Obriši**
3. Potvrdite u dijalogu:
   ```
   Da li ste sigurni da želite da obrišete utakmicu:
   Manchester United vs Liverpool?
   
   [Otkaži]  [OK]
   ```

---

## 💡 Korisni Saveti

### Određivanje Kvota

**Osnovni principi:**
- Favorit ima nižu kvotu (npr. 1.50)
- Autsajder ima višu kvotu (npr. 4.50)
- Nerešeno obično između 3.00-3.50

**Primeri:**

**Derbi utakmica (izjednačeno):**
```
Crvena Zvezda vs Partizan
1: 2.10  |  X: 3.20  |  2: 3.80
```

**Jasan favorit:**
```
Bayern Munich vs Borussia Dortmund
1: 1.85  |  X: 3.80  |  2: 4.20
```

**Tenis rang razlika:**
```
Novak Đoković (rang 1) vs Carlos Alcaraz (rang 2)
1: 1.80  |  2: 2.00
```

---

### Statistika - Šta unositi?

**Fudbal:**
- Unesi rezultate iz poslednjih 15-20 mečeva
- Golovi: ukupan broj iz sezone
- Formula: Pobede + Nerešeno + Porazi = Ukupno mečeva

**Košarka:**
- Poeni: ukupan zbir iz sezone
- Prosek se računa automatski

**Tenis:**
- Rang: trenutni ATP/WTA ranking
- Titule: broj turnira osvojenih ove godine
- Win Rate: procenat pobeda u sezoni (npr. 87%)

---

## 🎯 Primeri za Vežbu

### Primer 1: Dodavanje fudbalske utakmice

```
Sport: Fudbal
Liga: Superliga Srbije
Domaćin: Crvena Zvezda
Gost: Partizan
Datum: 2025-10-28
Vreme: 20:00

Kvote:
  1: 2.10
  X: 3.20
  2: 3.80

Statistika:
  Crvena Zvezda: 12-3-2 (34:12)
  Partizan: 10-5-2 (28:15)
```

### Primer 2: Dodavanje NBA utakmice

```
Sport: Košarka
Liga: NBA
Domaćin: LA Lakers
Gost: Boston Celtics
Datum: 2025-10-28
Vreme: 02:00

Kvote:
  1: 2.20
  2: 1.65

Statistika:
  LA Lakers: 8-4 (1234:1189)
  Boston Celtics: 10-2 (1298:1145)
```

### Primer 3: Dodavanje tenis meča

```
Sport: Tenis
Liga: ATP Masters
Igrač 1: Novak Đoković
Igrač 2: Carlos Alcaraz
Datum: 2025-10-28
Vreme: 16:00

Kvote:
  1: 1.80
  2: 2.00

Statistika:
  Đoković: Rang 1, Titule 5, Win Rate 87%
  Alcaraz: Rang 2, Titule 4, Win Rate 84%
```

---

## 🔧 Česta Pitanja

**Q: Gde se čuvaju podaci?**
A: Svi podaci se čuvaju lokalno u browser-u (localStorage). Ostaju sačuvani i nakon zatvaranja browser-a.

**Q: Da li mogu da brišem sve utakmice odjednom?**
A: Možete obrisati localStorage ključ "matches" iz browser konzole, ili pojedinačno brisati utakmice.

**Q: Zašto nema X kvote za tenis?**
A: U tenisu i košarci ne postoji nerešeno, pa sistem automatski sakriva X kvotu.

**Q: Kako resetovati na početne utakmice?**
A: Obrišite localStorage u browser-u:
```javascript
localStorage.removeItem('matches');
```
Zatim osvežite stranicu.

**Q: Mogu li da dodam više od 15 utakmica?**
A: Da! Možete dodati neograničen broj utakmica.

**Q: Da li promene u Admin panelu odmah utiču na glavnu stranicu?**
A: Da! Osvežite glavnu stranicu (F5) i videćete promene.

---

## 🎨 Bonus: Kreativne Ideje

### Kreirajte svoje lige:
- "Lokalni turnir"
- "Prijateljske utakmice"
- "Fantasy liga"

### Eksperimentišite sa kvotama:
- Postavite ekstremne kvote (0.01 ili 99.99)
- Napravite "siguran tiket" sa niskim kvotama
- Napravite "rizikovne tikete" sa visokim kvotama

### Dodajte izmišljene timove:
- Vaš omiljeni tim iz igara
- Kreativni nazivi
- Test scenariji

---

## 📞 Podrška

Za dodatna pitanja ili probleme:
1. Proverite konzolu browser-a (F12) za greške
2. Proverite da li su svi fajlovi u istom folderu
3. Pokušajte sa drugim browser-om

---

**Srećno klađenje! 🍀**

