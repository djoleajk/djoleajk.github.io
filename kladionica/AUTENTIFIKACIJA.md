# 🔐 Sistem Autentifikacije - Sportska Kladionica

## 📋 Pregled

Aplikacija sada zahteva **obaveznu registraciju i prijavu** za sve korisnike. Admin panel je zaštićen i dostupan samo administratorima.

---

## 🚀 Brzi Start

### 1. Prvo korišćenje

1. Otvorite `login.html` u browser-u
2. Kliknite na tab **"Registracija"**
3. Popunite formu:
   - Ime i prezime
   - Korisničko ime (minimum 3 karaktera)
   - Email adresa
   - Lozinka (minimum 6 karaktera)
   - Potvrda lozinke
4. Kliknite **"✨ Registruj se"**
5. Automatski ćete biti prijavljeni i dobićete **1,000 RSD bonus!**

### 2. Ponovne prijave

1. Unesite korisničko ime i lozinku
2. Kliknite **"🚀 Prijavi se"**

### 3. Demo Nalozi (za testiranje)

**Obični Korisnik:**
```
Username: demo
Password: demo123
Stanje: 10,000 RSD
```

**Administrator:**
```
Username: admin
Password: admin123
Pristup: Admin panel + Kladionica
```

---

## 🔒 Nivoi Pristupa

### 👤 Obični Korisnik (role: "user")

**Pristup:**
- ✅ Glavna stranica kladionice (`index.html`)
- ✅ Pregled i dodavanje mečeva na tiket
- ✅ Uplata tiketa
- ✅ Prikaz stanja na računu
- ✅ Istorija uplaćenih tiketa
- ❌ Admin panel (pristup odbijen)

**Funkcionalnosti:**
- Klađenje na sportske događaje
- Pregled statistike mečeva
- Upravljanje tiketom
- Provera stanja računa
- Odjava

### 👨‍💼 Administrator (role: "admin")

**Pristup:**
- ✅ Glavna stranica kladionice (`index.html`)
- ✅ Admin panel (`admin.html`)

**Funkcionalnosti:**
- Sve što i obični korisnik
- **+ Dodavanje** novih utakmica
- **+ Izmena** postojećih utakmica
- **+ Brisanje** utakmica
- **+ Upravljanje** kvotama i statistikom

---

## 💾 Struktura Korisničkih Podataka

### User Object (LocalStorage)

```javascript
{
    id: "user-1234567890",          // Jedinstveni ID
    username: "johndoe",             // Korisničko ime
    password: "password123",         // Lozinka (plaintext - DEMO SVRHE!)
    name: "John Doe",                // Ime i prezime
    email: "john@example.com",       // Email
    role: "user",                    // "user" ili "admin"
    balance: 1000,                   // Stanje u RSD
    createdAt: "2025-10-23T...",     // Datum registracije
    ticketHistory: [                 // Istorija tiketa
        {
            id: "TKT-...",
            date: "2025-10-23T...",
            matches: [...],
            stake: 100,
            totalOdds: 5.40,
            potentialWin: 540,
            status: "pending"        // pending, won, lost
        }
    ]
}
```

### Current User (Sesija)

```javascript
{
    id: "user-1234567890",
    username: "johndoe",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    balance: 1000,
    loginTime: "2025-10-23T..."
}
```

---

## 🔧 Kako Funkcioniše Zaštita

### 1. Zaštita Glavne Stranice (`index.html`)

```javascript
// app.js - Početak fajla
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser) {
    window.location.href = 'login.html';  // Preusmeri na login
}
```

**Efekat:**
- Svaki put kada neko pokuša da otvori `index.html`
- Proverava se da li postoji `currentUser` u localStorage
- Ako ne postoji → automatski redirect na `login.html`

### 2. Zaštita Admin Panela (`admin.html`)

```javascript
// admin.js - Početak fajla
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser) {
    window.location.href = 'login.html';  // Nije ulogovan
} else if (currentUser.role !== 'admin') {
    alert('⛔ Pristup odbijen!');
    window.location.href = 'index.html';  // Nije admin
}
```

**Efekat:**
- Prvo proverava da li je korisnik ulogovan
- Zatim proverava da li ima `role: "admin"`
- Ako nema → alert + redirect na glavnu stranicu

### 3. Validacija pri Uplati Tiketa

```javascript
// app.js - placeTicket()
const users = JSON.parse(localStorage.getItem('users'));
const userIndex = users.findIndex(u => u.id === currentUser.id);

if (users[userIndex].balance < stake) {
    alert(`Nemate dovoljno sredstava!`);
    return;
}

users[userIndex].balance -= stake;  // Oduzmi ulog
localStorage.setItem('users', JSON.stringify(users));
```

**Efekat:**
- Provera da li korisnik ima dovoljno sredstava
- Automatsko oduzimanje uloga sa računa
- Ažuriranje stanja u realnom vremenu

---

## 📊 Tok Podataka

### Registracija

```
[Login Page]
    ↓
Korisnik popunjava formu
    ↓
Validacija podataka
    ↓
Kreiranje user objekta
    ↓
localStorage.setItem('users', [...])
    ↓
localStorage.setItem('currentUser', {...})
    ↓
Redirect → index.html
```

### Prijava

```
[Login Page]
    ↓
Korisnik unosi username/password
    ↓
Pronalaženje korisnika u 'users'
    ↓
Provera lozinke
    ↓
Kreiranje 'currentUser' sesije
    ↓
localStorage.setItem('currentUser', {...})
    ↓
Redirect → index.html (user) ili admin.html (admin)
```

### Uplata Tiketa

```
[Index Page]
    ↓
Korisnik sastavlja tiket
    ↓
Unosi ulog
    ↓
Klikne "Uplati tiket"
    ↓
Provera stanja na računu
    ↓
users[i].balance -= stake
    ↓
Dodavanje tiketa u ticketHistory
    ↓
localStorage.setItem('users', [...])
    ↓
Ažuriranje prikaza stanja
    ↓
Prikaz success modal-a
```

### Odjava

```
[Bilo koja stranica]
    ↓
Korisnik klikne "Odjava"
    ↓
Potvrda (confirm dialog)
    ↓
localStorage.removeItem('currentUser')
    ↓
localStorage.removeItem('ticket')
    ↓
Redirect → login.html
```

---

## 🛡️ Sigurnosne Mere

### ✅ Implementirano

1. **Obavezna autentifikacija** - Ne može se pristupiti bez naloga
2. **Role-based access** - Admin panel samo za admina
3. **Validacija unosa** - Email format, dužina lozinke, itd.
4. **Password strength checker** - Indikator jačine lozinke
5. **Jedinstveno korisničko ime** - Provera duplikata
6. **Balance validation** - Ne može da se kladi više od stanja
7. **Session persistence** - Ostaje ulogovan nakon refresh-a

### ⚠️ Napomene za Produkciju

**Ova aplikacija je demo i NE bi trebalo da se koristi u realnom okruženju bez:**

1. **Backend server** - Node.js, PHP, Python, itd.
2. **Prava baza podataka** - MongoDB, PostgreSQL, MySQL
3. **Heshovane lozinke** - bcrypt, Argon2
4. **JWT tokeni** - Za sesije
5. **HTTPS** - Enkriptovana komunikacija
6. **Rate limiting** - Zaštita od brute force
7. **CSRF zaštita** - Sigurnost formi
8. **SQL injection prevencija** - Prepared statements
9. **XSS zaštita** - Sanitizacija unosa
10. **2FA** - Dvofaktorska autentifikacija

---

## 🧪 Testiranje Autentifikacije

### Test 1: Pristup bez logovanja

1. Obrišite localStorage: `localStorage.clear()`
2. Pokušajte otvoriti `index.html`
3. **Očekivano:** Automatski redirect na `login.html`

### Test 2: Obični korisnik pokušava pristup admin panelu

1. Prijavite se kao `demo` / `demo123`
2. Pokušajte otvoriti `admin.html`
3. **Očekivano:** Alert "Pristup odbijen" + redirect na `index.html`

### Test 3: Admin pristup

1. Prijavite se kao `admin` / `admin123`
2. Otvorite `admin.html`
3. **Očekivano:** Uspešan pristup admin panelu

### Test 4: Uplata tiketa bez dovoljno sredstava

1. Prijavite se
2. Sastavite tiket
3. Unesite ulog veći od stanja
4. **Očekivano:** Alert "Nemate dovoljno sredstava"

### Test 5: Registracija novog korisnika

1. Kreirajte novi nalog
2. **Očekivano:** Automatska prijava + 1,000 RSD bonus

---

## 🔍 Debugging

### Pregled LocalStorage u Browser-u

```javascript
// Browser konzola (F12)

// Svi korisnici
console.log(JSON.parse(localStorage.getItem('users')));

// Trenutni korisnik
console.log(JSON.parse(localStorage.getItem('currentUser')));

// Trenutni tiket
console.log(JSON.parse(localStorage.getItem('ticket')));

// Utakmice
console.log(JSON.parse(localStorage.getItem('matches')));
```

### Reset Sistema

```javascript
// Obriši sve podatke
localStorage.clear();

// Ili selektivno
localStorage.removeItem('currentUser');
localStorage.removeItem('ticket');
localStorage.removeItem('users');
localStorage.removeItem('matches');
```

### Kreiranje Test Korisnika

```javascript
let users = JSON.parse(localStorage.getItem('users')) || [];

users.push({
    id: 'test-' + Date.now(),
    username: 'testuser',
    password: 'test123',
    name: 'Test User',
    email: 'test@test.com',
    role: 'user',
    balance: 5000,
    createdAt: new Date().toISOString(),
    ticketHistory: []
});

localStorage.setItem('users', JSON.stringify(users));
```

### Dodavanje Sredstava Korisniku

```javascript
let users = JSON.parse(localStorage.getItem('users'));
let user = users.find(u => u.username === 'demo');
user.balance += 10000;  // Dodaj 10,000 RSD
localStorage.setItem('users', JSON.stringify(users));

// Ažuriraj i currentUser ako je ulogovan
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (currentUser && currentUser.username === 'demo') {
    currentUser.balance = user.balance;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// Refresh stranicu
location.reload();
```

---

## 📚 Fajlovi Autentifikacije

```
kladionica/
│
├── login.html          - Login/Registracija forma
├── auth.js             - Logika autentifikacije
│
├── index.html          - Zaštićena glavna stranica
├── app.js              - Provera autentifikacije na početku
│
├── admin.html          - Zaštićen admin panel
└── admin.js            - Provera admin pristupa
```

---

## 🎯 Budući Dodaci (Opciono)

1. **Password reset** - "Zaboravili ste lozinku?"
2. **Istorija tiketa** - Posebna stranica sa detaljima
3. **Profil stranica** - Izmena podataka, avatar
4. **Depozit/Povlačenje** - Simulacija dodavanja sredstava
5. **Rang lista** - Najbolji igrači
6. **Notifikacije** - Push notifikacije za završene tikete
7. **Email verifikacija** - Potvrda email adrese

---

**Sistem je spreman za korišćenje! 🎉**

Prijavite se ili kreirajte nalog da biste počeli sa klađenjem!

