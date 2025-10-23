# ⚽ Sportska Kladionica

Interaktivna web aplikacija za sportsku kladionicu napravljena samo pomoću HTML, CSS i JavaScript.

## 🎯 Funkcionalnosti

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

1. Otvorite `index.html` u browser-u
2. Nema potrebe za instalacijom ili serverom
3. Sve radi lokalno u browser-u

## 📱 Responsive dizajn

- **Desktop (1400px+)**: Grid sa 2 kolone (mečevi + tiket)
- **Tablet (1024px)**: Grid sa 1 kolonom, tiket ispod
- **Mobile (768px)**: Kompaktni prikaz, optimizovane kartice
- **Small mobile (480px)**: Pojednostavljeni UI elementi

## 🎮 Kako koristiti

1. **Odabir sporta** - Kliknite na dugme u navigaciji (⚽ 🏀 🎾)
2. **Dodavanje na tiket** - Kliknite na kvotu (1, X ili 2)
3. **Uklanjanje sa tiketa** - Kliknite ✖ pored meča ili klikom na istu kvotu
4. **Unos uloga** - Upišite iznos u RSD (minimum 10)
5. **Uplata tiketa** - Kliknite "💰 Uplati tiket"
6. **Pretraga** - Upišite naziv tima ili lige
7. **Statistika** - Kliknite "📊 Prikaži statistiku"

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

- ✅ Animacija rotacije logo ikone
- ✅ Gradient tekst na naslovu
- ✅ Pulse animacija pri dodavanju na tiket
- ✅ Smooth scroll za liste
- ✅ Custom scrollbar dizajn
- ✅ Box shadow i glow efekti
- ✅ Hover efekti na svim interaktivnim elementima

## 📝 Napomene

- Minimalni ulog je **10 RSD**
- Tiket ID se automatski generiše pri uplati
- Podaci su statički i generisani za demo svrhe
- Kvote su fiktivne i služe samo za ilustraciju

## 🎉 Uživajte u igri!

---

*Projekat kreiran za edukativne svrhe. Ne podstiče kockanje.*

