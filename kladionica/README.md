# ⚽ Sportska Kladionica

Interaktivna web aplikacija za sportsku kladionicu napravljena samo pomoću HTML, CSS i JavaScript.

## 🎯 Funkcionalnosti

### 🔐 Sistem autentifikacije
- **Registracija i prijava** korisnika
- **Zaštita admin panela** - samo za administratore
- **Obavezan nalog** za klađenje
- **Korisnički račun** sa stanjem u RSD
- **Istorija tiketa** - svi uplaćeni tiketi
- **Početni bonus** od 1,000 RSD za nove korisnike

### 🏆 Sportski događaji
- **15 mečeva** iz 3 sporta: Fudbal, Košarka i Tenis
- Prikaz kvota (1, X, 2 za fudbal i košarku; 1, 2 za tenis)
- Detaljna statistika za svaki tim/igrača
- Informacije o ligi, datumu i vremenu

### 💰 Tiket sistem
- Dodavanje mečeva klikom na kvote
- Automatsko računanje ukupne kvote
- Proračun potencijalnog dobitka
- Uklanjanje pojedinačnih mečeva
- Čišćenje celog tiketa
- Vizuelna animacija pri dodavanju

### 🔍 Napredna pretraga i filteri
- **Filter po sportu** - Fudbal, Košarka, Tenis ili Svi
- **Filter po ligi** - Superliga, Premier League, NBA, ATP Masters, itd.
- **Filter po datumu** - Danas, Sutra, Ove nedelje, ili Svi
- **Tekstualna pretraga** - Po imenu tima, igrača ili lige
- Dugme za brzo čišćenje svih filtera

### 💾 LocalStorage
- Tiket se automatski čuva u browser-u
- Nakon osvežavanja stranice, tiket ostaje sačuvan
- Mogućnost nastavka tamo gdje ste stali

### 📊 Statistika
- **Fudbal**: Pobede, nerešeni, porazi, golovi
- **Košarka**: Pobede, porazi, poeni, prosek
- **Tenis**: Rang, titule, procenat pobeda
- Modal prozor sa detaljnom statistikom

### 🎨 Dizajn
- **Tamna tema** - Profesionalan i moderan izgled
- **Zeleno-zlatne nijanse** - Boje koje asociraju na sport i novac
- **Animacije** - Smooth prelazi i interaktivni elementi
- **Responsive** - Potpuno prilagođen za telefone i tablete

## 🚀 Pokretanje

1. Otvorite `login.html` u browser-u
2. Prijavite se ili kreirajte novi nalog
3. Nema potrebe za instalacijom ili serverom
4. Sve radi lokalno u browser-u

### 🔐 Demo Nalozi

**Korisnik:**
- Username: `demo`
- Password: `demo123`
- Stanje: 10,000 RSD

**Administrator:**
- Username: `admin`
- Password: `admin123`
- Pristup admin panelu za upravljanje utakmicama

## 📱 Responsive dizajn

- **Desktop (1400px+)**: Grid sa 2 kolone (mečevi + tiket)
- **Tablet (1024px)**: Grid sa 1 kolonom, tiket ispod
- **Mobile (768px)**: Kompaktni prikaz, optimizovane kartice
- **Small mobile (480px)**: Pojednostavljeni UI elementi

## 🎮 Kako koristiti

### Korisnici:
1. **Registracija/Prijava** - Napravite nalog ili se prijavite (dobijate 1,000 RSD bonus)
2. **Odabir sporta** - Kliknite na dugme u navigaciji (⚽ 🏀 🎾)
3. **Dodavanje na tiket** - Kliknite na kvotu (1, X ili 2)
4. **Uklanjanje sa tiketa** - Kliknite ✖ pored meča ili klikom na istu kvotu
5. **Unos uloga** - Upišite iznos u RSD (minimum 10, maksimum do vašeg stanja)
6. **Uplata tiketa** - Kliknite "💰 Uplati tiket" (ulog se oduzima sa vašeg računa)
7. **Pretraga** - Upišite naziv tima ili lige
8. **Statistika** - Kliknite "📊 Prikaži statistiku"
9. **Odjava** - Kliknite "🚪 Odjava" u gornjem desnom uglu

### Admin Panel (⚙️):
1. **Dodavanje utakmice** - Popunite formu i kliknite "➕ Dodaj utakmicu"
2. **Izmena utakmice** - Kliknite "✏️ Izmeni" pored utakmice, izmenite podatke i sačuvajte
3. **Brisanje utakmice** - Kliknite "🗑️ Obriši" pored utakmice
4. **Statistika** - Prilagođena polja za svaki sport (Fudbal, Košarka, Tenis)
5. **Kvote** - Za tenis i košarku nema nerešenog (X)
6. **Automatsko čuvanje** - Sve promene se čuvaju u localStorage i odmah su vidljive na glavnoj strani

## 💡 Tehnički detalji

- **HTML5** - Semantička struktura
- **CSS3** - Grid, Flexbox, Animacije, CSS Variables
- **Vanilla JavaScript** - Nema external biblioteka
- **LocalStorage API** - Čuvanje tiketa
- **Event Delegation** - Optimizovane interakcije

## 🎲 Primer podataka

Aplikacija sadrži:
- 6 fudbalskih mečeva (Srbija, Engleska, Španija, Nemačka, Italija, Liga Prvaka)
- 4 košarkaška meča (ABA Liga, NBA, Evroliga)
- 5 teniskih mečeva (ATP Masters, WTA Finals)

## 🌟 Posebne funkcije

- ✅ **Admin Panel** - Kompletno upravljanje utakmicama i kvotama
- ✅ Animacija rotacije logo ikone
- ✅ Gradient tekst na naslovu
- ✅ Pulse animacija pri dodavanju na tiket
- ✅ Smooth scroll za liste
- ✅ Custom scrollbar dizajn
- ✅ Box shadow i glow efekti
- ✅ Hover efekti na svim interaktivnim elementima

## ⚙️ Admin Panel - Detaljno

### Pristup Admin Panelu
- Kliknite na **⚙️ Admin** dugme u gornjem desnom uglu glavne stranice
- Ili direktno otvorite `admin.html` fajl

### Dodavanje nove utakmice

1. **Odaberite sport** - Fudbal, Košarka ili Tenis
2. **Unesite osnovne podatke:**
   - Liga (npr. Premier League, NBA)
   - Domaćin / Igrač 1
   - Gost / Igrač 2
   - Datum i vreme

3. **Unesite kvote:**
   - **Fudbal**: 1 (domaćin), X (nerešeno), 2 (gost)
   - **Košarka**: 1 (domaćin), 2 (gost) - nema X
   - **Tenis**: 1 (igrač 1), 2 (igrač 2) - nema X

4. **Unesite statistiku** (različito za svaki sport):
   
   **Fudbal:**
   - Pobede, nerešeni, porazi
   - Golovi dati i primljeni
   
   **Košarka:**
   - Pobede i porazi
   - Poeni dati i primljeni
   
   **Tenis:**
   - ATP/WTA rang
   - Broj titula ove godine
   - Procenat pobeda (Win Rate)

5. Kliknite **➕ Dodaj utakmicu**

### Izmena postojeće utakmice

1. U tabeli sa svim utakmicama pronađite utakmicu koju želite da izmenite
2. Kliknite **✏️ Izmeni** dugme
3. Forma će se popuniti sa postojećim podacima
4. Izmenite šta želite
5. Kliknite **💾 Sačuvaj izmene**
6. Kliknite **✖ Otkaži izmenu** ako ste predomislili

### Brisanje utakmice

1. Pronađite utakmicu u tabeli
2. Kliknite **🗑️ Obriši** dugme
3. Potvrdite brisanje u dijalogu

### Napomene

- ✅ Sve promene se **automatski čuvaju** u localStorage
- ✅ Promene su **odmah vidljive** na glavnoj stranici (osvežite stranicu)
- ✅ Podaci **ostaju sačuvani** nakon zatvaranja browser-a
- ✅ Svaka utakmica dobija **jedinstveni ID** automatski
- ⚠️ Za tenis i košarku **nema kvote X** (nerešeno)
- ⚠️ Minimalna kvota je **1.01**

## 🔒 Sigurnost i Pristup

### Zaštita Admin Panela
- **Admin panel je zaštićen** - dostupan samo korisnicima sa admin ulogom
- Pokušaj pristupa bez admin prava rezultira preusmeravanjem
- Automatska provera prilikom svakog pristupa

### Korisnički Nalozi
- **Obavezan nalog** za korišćenje aplikacije
- **Jedinstveno korisničko ime** i email
- **Validacija lozinke** - minimalno 6 karaktera
- **Password strength checker** pri registraciji
- Podaci se čuvaju lokalno u browser-u

### Sesije
- Automatska prijava nakon registracije
- Sesija ostaje aktivna do odjave
- Mogućnost odjave sa bilo koje stranice

## 📝 Napomene

- Minimalni ulog je **10 RSD**
- Maksimalni ulog je **do stanja na računu**
- Tiket ID se automatski generiše pri uplati
- **Istorija tiketa** se čuva za svakog korisnika
- **Početni bonus** od 1,000 RSD za nove korisnike
- Podaci su statički i generisani za demo svrhe
- Kvote su fiktivne i služe samo za ilustraciju
- **VAŽNO:** U realnoj aplikaciji lozinke bi bile heshovane!

## 📚 Kompletna Dokumentacija

| Fajl | Opis | Kada Koristiti |
|------|------|----------------|
| **START-OVDE.md** | 🚀 Brzi početak i osnove | Prvi put koristiš aplikaciju |
| **demo.html** | 🖼️ Interaktivni demo stranica | Želiš da vidiš primere |
| **PRIMERI-KORISCENJA.md** | 📋 Scenariji i primeri podataka | Trebaš konkretne primere |
| **RESAVANJE-PROBLEMA.md** | 🔧 Rešavanje problema i debug | Nešto ne radi |
| **AUTENTIFIKACIJA.md** | 🔐 Sigurnost i korisnici | Pitanja o login/sigurnosti |
| **UPUTSTVO.md** | 📖 Detaljna uputstva | Korak-po-korak vodiči |
| **STRUKTURA-PROJEKTA.md** | 🏗️ Tehnička dokumentacija | Developer dokumentacija |
| **README.md** | 📄 Ovaj fajl | Opšte informacije |

### 🆘 Problem?
1. **Logout ne radi?** → Pogledaj **RESAVANJE-PROBLEMA.md**
2. **Nema mečeva?** → Pogledaj **demo.html** i **PRIMERI-KORISCENJA.md**
3. **Kako dodati utakmicu?** → Pogledaj **UPUTSTVO.md**
4. **Admin pristup?** → Pogledaj **AUTENTIFIKACIJA.md**

---

## 🎉 Uživajte u igri!

---

*Projekat kreiran za edukativne svrhe. Ne podstiče kockanje.*

