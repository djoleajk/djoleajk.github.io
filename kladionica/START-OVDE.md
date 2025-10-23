# 🚀 ZAPOČNITE OVDE - Sportska Kladionica

## ⚡ Brzi Start

### 1. Otvorite aplikaciju
Otvorite fajl **`login.html`** u vašem browser-u

### 2. Prijavite se sa demo nalogom

**Za obično klađenje:**
```
Korisničko ime: demo
Lozinka: demo123
Stanje: 10,000 RSD
```

**Za admin pristup:**
```
Korisničko ime: admin
Lozinka: admin123
Pristup: Admin panel + sve funkcije
```

### 3. Ili kreirajte svoj nalog
- Kliknite "Registracija"
- Popunite formu
- Dobijate **1,000 RSD bonus!**

---

## 📁 Struktura Projekta

```
kladionica/
│
├── 🔐 login.html              - POČETNA STRANICA (start here!)
├── ⚙️ auth.js                 - Autentifikacija
│
├── 🏠 index.html              - Glavna kladionica (zaštićeno)
├── 📱 app.js                  - Logika kladionice
│
├── 👨‍💼 admin.html              - Admin panel (samo za admin!)
├── ⚙️ admin.js                - Admin logika
│
├── 🎨 styles.css              - Svi stilovi
│
├── 📖 README.md               - Opšta dokumentacija
├── 📖 AUTENTIFIKACIJA.md      - Detaljno o sigurnosti
├── 📖 UPUTSTVO.md             - Korak-po-korak uputstva
├── 📖 STRUKTURA-PROJEKTA.md   - Tehnička dokumentacija
└── 📖 START-OVDE.md           - Ovaj fajl
```

---

## 🎯 Šta Možete Da Radite?

### 👤 Kao Korisnik
- ✅ Klađenje na sportske događaje
- ✅ Pregled statistike timova
- ✅ Dodavanje mečeva na tiket
- ✅ Praćenje stanja računa
- ✅ Istorija uplaćenih tiketa
- ✅ Filter i pretraga utakmica

### 👨‍💼 Kao Administrator
- ✅ Sve što i obični korisnik
- ✅ **+ Dodavanje** novih utakmica
- ✅ **+ Izmena** kvota i statistika
- ✅ **+ Brisanje** utakmica
- ✅ **+ Kreiranje** različitih sportova

---

## 🔒 Sigurnosne Funkcije

### ✅ Implementirano
- **Obavezan nalog** za pristup
- **Zaštićen admin panel** - samo za administratore
- **Validacija podataka** - email, lozinka, itd.
- **Provera stanja** - ne može se kladiti više od dostupnog
- **Istorija tiketa** - svi tiketi se pamte
- **Sesije** - ostajete ulogovani

### ⚠️ Važna Napomena
Ovo je **DEMO aplikacija** za edukativne svrhe:
- Lozinke se NE heš-uju (u realnoj bi bile)
- Sve se čuva u localStorage (realno: baza podataka)
- Nema backend servera (realno: Node.js/PHP/Python)
- Ne koristi se za pravo klađenje!

---

## 🎮 Tok Korišćenja

### Prvi Put

```
1. Otvori login.html
   ↓
2. Registruj se
   ↓
3. Dobij 1,000 RSD bonus
   ↓
4. Automatska prijava
   ↓
5. Istraži kladionicu!
```

### Klađenje

```
1. Odaberi sport (⚽ 🏀 🎾)
   ↓
2. Klikni na kvote (1, X, 2)
   ↓
3. Unesi ulog
   ↓
4. Uplati tiket
   ↓
5. Ulog se oduzima sa računa
```

### Admin Panel (samo admin)

```
1. Prijavi se kao admin
   ↓
2. Automatski redirect na admin.html
   ↓
3. Dodaj/izmeni/obriši utakmice
   ↓
4. Promene odmah vidljive na glavnoj strani
```

---

## 💡 Brzi Saveti

### Testiranje
- Koristite `demo` nalog za testiranje (10,000 RSD)
- Koristite `admin` nalog za admin funkcije
- Možete kreirati neograničen broj naloga

### Debugging
```javascript
// Browser konzola (F12)

// Proveri trenutnog korisnika
console.log(localStorage.getItem('currentUser'));

// Proveri sve korisnike
console.log(localStorage.getItem('users'));

// Reset svega
localStorage.clear();
location.reload();
```

### Dodavanje Novca
```javascript
// U browser konzoli (F12)
let users = JSON.parse(localStorage.getItem('users'));
let user = users.find(u => u.username === 'demo');
user.balance += 10000;  // Dodaj 10,000 RSD
localStorage.setItem('users', JSON.stringify(users));
location.reload();
```

---

## 📚 Dokumentacija

| Fajl | Sadržaj |
|------|---------|
| **README.md** | Opšti pregled, funkcionalnosti, instalacija |
| **AUTENTIFIKACIJA.md** | Detalji o sigurnosti, korisnicima, pristupima |
| **UPUTSTVO.md** | Korak-po-korak uputstva za sve funkcije |
| **STRUKTURA-PROJEKTA.md** | Tehnička dokumentacija, kod struktura |

---

## 🛠️ Tehnologije

- **HTML5** - Struktura
- **CSS3** - Stilovi (Grid, Flexbox, Animacije)
- **Vanilla JavaScript** - Logika (bez framework-a)
- **LocalStorage** - Skladištenje podataka

---

## ⚡ Karakteristike

### Dizajn
- 🌑 Tamna tema
- 💚 Zeleno-zlatni akcenti
- ✨ Smooth animacije
- 📱 Potpuno responsive

### Funkcionalnosti
- 🔐 Kompletan auth sistem
- ⚽ 3 sporta (Fudbal, Košarka, Tenis)
- 📊 Detaljna statistika
- 💰 Korisnički računi
- 🎫 Istorija tiketa
- 🔍 Napredna pretraga

---

## 🎉 Uživajte!

Sve je spremno za korišćenje. Otvorite **`login.html`** i počnite da se kladite!

### Potrebna Pomoć?
- Pogledajte **UPUTSTVO.md** za detaljne korake
- Pogledajte **AUTENTIFIKACIJA.md** za sigurnosne detalje
- Pitajte developera 😊

---

**Srećno klađenje! 🍀**

