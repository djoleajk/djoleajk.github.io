# 🔧 Rešavanje Problema - Sportska Kladionica

## ⚠️ Česti Problemi i Rešenja

### 1. ❌ Logout Dugme Ne Radi

**Problem:** Kliknem na "🚪 Odjava" i ništa se ne dešava.

**Rešenje:**

**A) Proveri da li je dugme pravilno povezano:**
```javascript
// Otvori browser konzolu (F12) i unesi:
console.log(typeof window.logout);
// Očekivano: "function"
```

**B) Manuelna odjava preko konzole:**
```javascript
// U browser konzoli (F12):
localStorage.removeItem('currentUser');
localStorage.removeItem('ticket');
window.location.href = 'login.html';
```

**C) Hard refresh:**
- Windows: `Ctrl + Shift + R` ili `Ctrl + F5`
- Mac: `Cmd + Shift + R`

**D) Proveri da li je app.js učitan:**
```javascript
// U konzoli:
console.log('App.js loaded?', typeof displayMatches);
// Očekivano: "function"
```

---

### 2. 🔄 Stranica se Ne Osvežava Nakon Izmena

**Problem:** Izmenio sam kod ali ništa se ne menja.

**Rešenje:**

**A) Hard Refresh (Preporučeno):**
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**B) Obriši Cache:**
1. `F12` (Developer Tools)
2. Desni klik na Refresh dugme
3. "Empty Cache and Hard Reload"

**C) Proveri da li je fajl sačuvan:**
- Proveri da li ima `*` pored imena fajla
- Sačuvaj sa `Ctrl + S`

---

### 3. 🚫 "Pristup Odbijen" - Ne Mogu Da Pristupim Admin Panelu

**Problem:** Prijavio sam se ali ne mogu da pristupim admin.html

**Rešenje:**

**A) Proveri korisničku ulogu:**
```javascript
// U browser konzoli (F12):
let user = JSON.parse(localStorage.getItem('currentUser'));
console.log('Role:', user.role);
// Mora biti: "admin"
```

**B) Prijavi se kao admin:**
- Username: `admin`
- Password: `admin123`

**C) Manuelno postavi admin ulogu:**
```javascript
// SAMO ZA TESTIRANJE!
let users = JSON.parse(localStorage.getItem('users'));
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Pronađi korisnika i izmeni ulogu
let user = users.find(u => u.username === currentUser.username);
user.role = 'admin';
currentUser.role = 'admin';

// Sačuvaj
localStorage.setItem('users', JSON.stringify(users));
localStorage.setItem('currentUser', JSON.stringify(currentUser));

// Obnovi stranicu
location.reload();
```

---

### 4. 💰 Stanje Se Ne Ažurira

**Problem:** Uplatio sam tiket ali stanje je isto.

**Rešenje:**

**A) Obnovi stranicu:**
- `F5` ili `Ctrl + R`

**B) Proveri stanje u localStorage:**
```javascript
let users = JSON.parse(localStorage.getItem('users'));
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let user = users.find(u => u.id === currentUser.id);
console.log('Stanje:', user.balance);
```

**C) Manuelno dodaj novac:**
```javascript
let users = JSON.parse(localStorage.getItem('users'));
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let userIndex = users.findIndex(u => u.id === currentUser.id);

users[userIndex].balance += 10000; // Dodaj 10,000 RSD
localStorage.setItem('users', JSON.stringify(users));

currentUser.balance = users[userIndex].balance;
localStorage.setItem('currentUser', JSON.stringify(currentUser));

location.reload();
```

---

### 5. 📋 Ne Vidim Utakmice

**Problem:** Stranica je prazna, nema mečeva.

**Rešenje:**

**A) Proveri da li postoje mečevi:**
```javascript
let matches = JSON.parse(localStorage.getItem('matches'));
console.log('Broj mečeva:', matches?.length || 0);
```

**B) Resetuj na default mečeve:**
```javascript
localStorage.removeItem('matches');
location.reload();
// Automatski će se učitati 15 default mečeva
```

**C) Manuelno dodaj mečeve preko admin panela:**
1. Prijavi se kao admin
2. Otvori admin.html
3. Dodaj novu utakmicu

---

### 6. 🔒 Ne Mogu Da Se Prijavim

**Problem:** Unosim username i password ali ne radi.

**Rešenje:**

**A) Proveri da li korisnik postoji:**
```javascript
let users = JSON.parse(localStorage.getItem('users'));
console.log('Korisnici:', users.map(u => u.username));
```

**B) Koristi demo naloge:**
- `demo` / `demo123`
- `admin` / `admin123`

**C) Resetuj sve:**
```javascript
localStorage.clear();
location.reload();
// Default nalozi će biti kreirani automatski
```

**D) Ručno kreiraj novog korisnika:**
```javascript
let users = JSON.parse(localStorage.getItem('users')) || [];

users.push({
    id: 'test-' + Date.now(),
    username: 'test',
    password: 'test123',
    name: 'Test User',
    email: 'test@test.com',
    role: 'user',
    balance: 5000,
    createdAt: new Date().toISOString(),
    ticketHistory: []
});

localStorage.setItem('users', JSON.stringify(users));
console.log('✅ Korisnik kreiran: test / test123');
```

---

### 7. 🎫 Tiket Se Ne Čuva

**Problem:** Dodao sam mečeve na tiket, obnovio stranicu i tiket je prazan.

**Rešenje:**

**A) Proveri da li se tiket čuva:**
```javascript
let ticket = JSON.parse(localStorage.getItem('ticket'));
console.log('Tiket:', ticket);
```

**B) Tiket se čisti nakon uplate:**
- Ovo je normalno ponašanje
- Nakon što uplatite tiket, on se čisti
- Tiket se čuva u ticketHistory

**C) Proveri istoriju tiketa:**
```javascript
let users = JSON.parse(localStorage.getItem('users'));
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let user = users.find(u => u.id === currentUser.id);
console.log('Istorija:', user.ticketHistory);
```

---

### 8. 🌐 Stranica Ne Učitava CSS

**Problem:** Stranica izgleda čudno, nema stilova.

**Rešenje:**

**A) Proveri putanju do CSS-a:**
```html
<!-- U HTML fajlu treba da stoji: -->
<link rel="stylesheet" href="styles.css">
```

**B) Proveri da li je styles.css u istom folderu:**
```
kladionica/
  ├── index.html
  ├── styles.css  ← Mora biti ovde!
  └── ...
```

**C) Hard refresh:**
- `Ctrl + Shift + R`

---

### 9. ⚠️ JavaScript Greške u Konzoli

**Problem:** Vidim crvene greške u konzoli (F12).

**Rešenje:**

**A) Proveri da li su svi fajlovi učitani:**
```javascript
// U konzoli:
console.log('Scripts loaded?', {
    matches: typeof matches !== 'undefined',
    ticket: typeof ticket !== 'undefined',
    currentUser: typeof currentUser !== 'undefined'
});
```

**B) Obriši localStorage i ponovo učitaj:**
```javascript
localStorage.clear();
location.reload();
```

**C) Proveri da li ima typo-a u fajlu:**
- Otvori Developer Tools (F12)
- Idi na "Console" tab
- Pročitaj grešku

---

### 10. 📱 Responsive Dizajn Ne Radi

**Problem:** Na mobilnom izgleda loše.

**Rešenje:**

**A) Proveri viewport meta tag:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**B) Testiraj responsive u browser-u:**
1. `F12` (Developer Tools)
2. `Ctrl + Shift + M` (Toggle Device Toolbar)
3. Odaberi mobilni uređaj

**C) Obnovi CSS:**
- Hard refresh: `Ctrl + Shift + R`

---

## 🛠️ Debug Komande

### Provera Celog Sistema

```javascript
// Kopiraj ovo u browser konzolu (F12):

console.log('=== SISTEM STATUS ===');

// Korisnici
let users = JSON.parse(localStorage.getItem('users')) || [];
console.log('👥 Korisnici:', users.length);
console.log('   Usernames:', users.map(u => u.username).join(', '));

// Trenutni korisnik
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
console.log('👤 Trenutni:', currentUser?.username || 'NIJE ULOGOVAN');
console.log('   Uloga:', currentUser?.role || 'N/A');
console.log('   Stanje:', currentUser?.balance || 0, 'RSD');

// Utakmice
let matches = JSON.parse(localStorage.getItem('matches')) || [];
console.log('⚽ Utakmice:', matches.length);

// Tiket
let ticket = JSON.parse(localStorage.getItem('ticket')) || [];
console.log('🎫 Na tiketu:', ticket.length, 'mečeva');

console.log('==================');
```

### Brzi Reset

```javascript
// PAŽNJA: Ovo briše SVE podatke!

if (confirm('Da li ste sigurni da želite da resetujete aplikaciju?')) {
    localStorage.clear();
    console.log('✅ LocalStorage obrisan!');
    console.log('🔄 Osvežavam stranicu...');
    setTimeout(() => location.reload(), 1000);
}
```

### Dodaj Test Podatke

```javascript
// Dodaj test korisnika sa novcem
let users = JSON.parse(localStorage.getItem('users')) || [];

users.push({
    id: 'rich-' + Date.now(),
    username: 'millionaire',
    password: 'rich123',
    name: 'Rich User',
    email: 'rich@example.com',
    role: 'user',
    balance: 1000000, // Milion!
    createdAt: new Date().toISOString(),
    ticketHistory: []
});

localStorage.setItem('users', JSON.stringify(users));
console.log('✅ Kreiran korisnik: millionaire / rich123 (1,000,000 RSD)');
```

---

## 📞 Još Uvek Ima Problema?

### Proveri:
1. ✅ Da li su svi fajlovi u istom folderu?
2. ✅ Da li je browser podržan? (Chrome, Firefox, Edge)
3. ✅ Da li je JavaScript omogućen?
4. ✅ Da li localStorage radi? (proveri u Incognito mode)

### Krajnje Rešenje:

```javascript
// 1. Sačuvaj mečeve ako ih ne želiš izgubiti
let matches = localStorage.getItem('matches');
console.log('Matches saved:', !!matches);

// 2. Obriši SVE
localStorage.clear();

// 3. Vrati mečeve ako su bili sačuvani
if (matches) {
    localStorage.setItem('matches', matches);
}

// 4. Obnovi
location.reload();

// 5. Prijavi se ponovo
```

---

## 🎓 Tips & Tricks

### 1. Brza Prijava

Dodaj bookmark sa ovim kodom:
```javascript
javascript:(function(){
    localStorage.setItem('currentUser', JSON.stringify({
        id: 'demo-001',
        username: 'demo',
        name: 'Demo Korisnik',
        role: 'user',
        balance: 10000
    }));
    location.href = 'index.html';
})();
```

### 2. Provera Stanja Tiketa

```javascript
setInterval(() => {
    let ticket = JSON.parse(localStorage.getItem('ticket')) || [];
    if (ticket.length > 0) {
        console.log('🎫 Tiket:', ticket.length, 'mečeva');
    }
}, 5000); // Svaki 5 sekundi
```

### 3. Auto-Save Reminder

```javascript
// Dodaj u app.js ako želiš:
window.addEventListener('beforeunload', (e) => {
    let ticket = JSON.parse(localStorage.getItem('ticket')) || [];
    if (ticket.length > 0 && !confirm('Imate mečeve na tiketu. Želite da napustite?')) {
        e.preventDefault();
        e.returnValue = '';
    }
});
```

---

**Problem nije ovde? Proveri AUTENTIFIKACIJA.md za detaljnije informacije!** 📚

