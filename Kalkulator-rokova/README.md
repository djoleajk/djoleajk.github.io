# 📅 Kalkulator Rokova - Radni Dani

Moderna web aplikacija za računanje rokova završetka projekata na osnovu radnih dana.

## ✨ Funkcionalnosti

### 1. **Osnovni Kalkulator Rokova**
- Unos početnog datuma
- Unos broja radnih dana
- Automatsko preskakanje vikenda (subota i nedelja)
- Opcija za uključivanje državnih praznika
- Prikaz krajnjeg datuma i dana u nedelji

### 2. **Kalkulator Radnih Sati** ⏰
- Računanje na osnovu radnih sati
- Podešavanje broja sati po danu
- Prikaz tačnog datuma i vremena završetka
- Automatska konverzija sati u dane

### 3. **Menadžer Projekata** 📊
- Dodavanje više projekata sa različitim rokovima
- Praćenje statusa svakog projekta
- Prikaz preostalog vremena
- Vizuelna indikacija hitnosti (zeleno/žuto/crveno)
- Čuvanje projekata u localStorage
- Brisanje završenih projekata

### 4. **PWA Podrška** 📱
- Instalacija kao mobilna aplikacija
- Rad offline
- Brzo učitavanje
- Responzivan dizajn

## 🚀 Kako koristiti

1. Otvorite `index.html` u web pretraživaču
2. Unesite početni datum
3. Unesite broj radnih dana
4. Kliknite "Izračunaj rok"
5. Rezultat će biti prikazan sa tačnim datumom i danom u nedelji

## 🎨 Dizajn

- Moderan gradient pozadina
- Čiste kartice sa senkama
- Hover efekti na dugmićima
- Animacije za rezultate
- Potpuno responzivan za mobilne uređaje

## 📁 Struktura projekta

```
Kalkulator rokova/
├── index.html          # Glavna HTML struktura
├── style.css           # Stilovi i animacije
├── script.js           # JavaScript logika
├── manifest.json       # PWA manifest
├── service-worker.js   # Service worker za offline rad
└── README.md          # Dokumentacija
```

## 🔧 Tehnologije

- **HTML5** - Struktura
- **CSS3** - Stilovi, animacije, grid layout
- **Vanilla JavaScript** - Logika bez framework-a
- **PWA** - Progressive Web App funkcionalnost
- **LocalStorage** - Čuvanje projekata

## 📅 Državni praznici

Aplikacija podržava sledeće državne praznike (mogu se prilagoditi u `script.js`):

- 1-2. januar - Nova godina
- 7. januar - Božić (pravoslavni)
- 15-16. februar - Dan državnosti
- Veliki petak i Vaskrs (promenljivi)
- 1-2. maj - Praznik rada
- 11. novembar - Dan primirja

## 🌐 PWA Instalacija

1. Otvorite aplikaciju u Chrome/Edge pretraživaču
2. Kliknite na dugme "Instaliraj aplikaciju" koje se pojavi
3. Aplikacija će biti dostupna kao samostalna aplikacija na vašem uređaju

## 💡 Napredne funkcionalnosti

### Validacija
- Provera da li je datum unet
- Provera da li je broj dana validan (> 0)
- Prikaz grešaka sa animacijama

### Računanje
- Preskakanje vikenda
- Opciono preskakanje državnih praznika
- Tačno računanje radnih dana
- Podrška za računanje sa satima

### Projekti
- Neograničen broj projekata
- Automatsko sortiranje
- Vizuelna indikacija statusa
- Persistentno čuvanje podataka

## 📱 Mobilna optimizacija

- Responzivan grid layout
- Touch-friendly dugmići
- Optimizovani input elementi
- PWA podrška za instalaciju

## 🎯 Budući razvoj

Moguća proširenja:
- Export projekata u PDF/Excel
- Kalendarski prikaz
- Podsetnici i notifikacije
- Integracija sa Google Calendar
- Timski projekti sa deljenim rokovima
- Različite vremenske zone

## 📄 Licenca

Slobodno za korišćenje i modifikaciju.

---

**Napravljeno sa ❤️ za lakše upravljanje rokovima**
