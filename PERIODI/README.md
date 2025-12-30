# Periodi - Aplikacija za Praćenje Menstrualnog Ciklusa

Jednostavna i intuitivna web aplikacija za praćenje menstrualnog ciklusa sa svim potrebnim funkcijama.

## 🚀 Funkcionalnosti

### 🌟 **Novine u UI**
- **Dark/Light Mode** - Automatsko pamćenje teme sa smooth tranzicijama
- **Moderni dizajn** - Gradijenti, animacije i micro-interactions
- **Floating Action Button** - Brzi pristup najčešćim akcijama
- **Progress bar** - Vizuelni prikaz napretka ciklusa
- **Animated counters** - Smooth animacije brojeva u statistici
- **Backdrop blur** - Moderne modal prozori sa blur efektom

### 📊 Dashboard
- **Trenutni status ciklusa** - Prikazuje u kojoj fazi ciklusa se nalazite
- **Predviđanje sledećeg ciklusa** - Tačno predviđa kada će početi sledeća menstruacija
- **Statistika** - Prosečna dužina ciklusa i menstruacije, ukupan broj ciklusa
- **Brze akcije** - Jednim klikom započnite ciklus ili zabeležite simptome
- **Progress bar** - Vizuelni prikaz napretka kroz ciklus

### 📅 Kalendar
- **Vizuelni prikaz** ciklusa sa bojama za različite faze
- **Navigacija** kroz mesece
- **Legenda** koja objašnjava boje
- **Obeležavanje** dana menstruacije, ovulacije i plodnih dana

### 📈 Praćenje Simptoma
- **Dnevni unos simptoma** - Energija, raspoloženje, bol, libido
- **Dodatni simptomi** - Grčevi, glavobolja, mučnina, nadutost, itd.
- **Istorija simptoma** - Pregled svih zabeleženih simptoma
- **Vizuelni prikaz** sa rang skalama

### ⚙️ Podešavanja
- **Personalizacija ciklusa** - Prosečna dužina ciklusa i menstruacije
- **Notifikacije** - Podsetnici za početak menstruacije, ovulaciju i plodne dane
- **Upravljanje podacima** - Izvoz podataka ili brisanje svih podataka

### 🔔 Podsetnici
- **Prilagodljivi podsetnici** - Naslov, vreme, ponavljanje
- **Browser notifikacije** - Podsetnici direktno u browser-u

## 🛠️ Tehnologije

- **HTML5** - Semantička struktura
- **CSS3** - Moderni, responzivni dizajn sa CSS Grid i Flexbox
- **Vanilla JavaScript** - Bez eksternih biblioteka za maksimalnu brzinu
- **Local Storage** - Svi podaci se čuvaju lokalno na uređaju

## 📱 Kompletno Responzivni Dizajn

Aplikacija je potpuno optimizovana za sve veličine ekrana:

### 🖥️ **Desktop**
- **Ultra-wide (2560px+)** - Maksimalna širina 2000px, velike kartice
- **Large desktop (1440px-2559px)** - Maksimalna širina 1400px
- **Standard desktop (1024px-1439px)** - Optimizovan grid layout

### 📱 **Tablet**
- **Landscape (768px-1023px)** - 2-kolonski grid, horizontalni scroll
- **Portrait (481px-767px)** - 1-kolonski grid, optimizovane forme

### 📱 **Mobilni**
- **Large mobile (481px-767px)** - Adaptivni elementi
- **Standard mobile (320px-480px)** - Kompaktni dizajn, touch-optimized
- **Small mobile (≤320px)** - Minimalni spacing, jednokolonski layout

### 🎯 **Posebne Optimizacije**
- **Touch uređaji** - Min 44px target size za dugmad
- **High DPI** - Optimizovane ikone za retina ekrane
- **Landscape mode** - Posebni stilovi za horizontalnu orijentaciju
- **Print** - Čista štampa bez UI elemenata
- **Fluid typography** - Skalabilni fontovi sa clamp()
- **iOS zoom prevention** - 16px minimum za input polja

## 🔒 Privatnost

- **Nema cloud storage** - Svi podaci ostaju na vašem uređaju
- **Nema tracking-a** - Bez analitike ili deljenja podataka
- **Izvoz podataka** - Možete izvesti sve podatke u JSON formatu

## 🚀 Kako Pokrenuti

### Opcija 1: Lokalni Server
```bash
# Otvorite terminal u folderu aplikacije
python -m http.server 8000
# Ili koristite Node.js
npx serve .
```

### Opcija 2: Otvorite Direktno
Jednostavno otvorite `index.html` u vašem web browser-u.

## 📖 Kako Koristiti

### 1. Prvi Put
1. Kliknite na "Počni Ciklus" na dashboard-u
2. Izaberite datum početka menstruacije
3. Podešavanja će automatski predvideti sledeći ciklus

### 2. Dnevno Praćenje
- **Simptomi**: Idite na tab "Simptomi" i zabeležite kako se osećate
- **Menstruacija**: Kliknite "Zabeleži Menstruaciju" kada počne
- **Podsetnici**: Dodajte podsetnike za lekove ili važne datume

### 3. Pregled Podataka
- **Dashboard**: Brzi pregled trenutnog statusa
- **Kalendar**: Vizuelni pregled celog meseca
- **Statistika**: Analiza vaših obrazaca kroz vreme

## 🎨 Boje i Značenja

- 🔴 **Crvena** - Dani menstruacije
- 🟢 **Zelena** - Dani ovulacije
- 🟡 **Žuta** - Plodni dani
- 🔵 **Plava** - Normalni dani

## 🌙 Dark Mode

Aplikacija podržava tamni režim koji se automatski pamti. Kliknite na dugme sa suncem/mesecem u gornjem desnom uglu da promenite temu.

## 🎯 UI Poboljšanja

### Moderni Dizajn
- **Gradijenti** - Lepe boje i prelazi
- **Animacije** - Smooth tranzicije i micro-interactions
- **3D efekti** - Dubina sa box-shadows
- **Glass morphism** - Moderna transparentna pozadina

### Interaktivni Elementi
- **Hover efekti** - Feedback na sve interaktivne elemente
- **Loading states** - Vizuelni feedback prilikom učitavanja
- **Pulse animacije** - Za važne informacije (današnji dan)
- **Floating Action Button** - Brzi pristup akcijama

### Vizuelni Feedback
- **Progress bars** - Za prikaz napretka ciklusa
- **Animated counters** - Smooth promene brojeva
- **Glow efekti** - Za dugmad i važne elemente
- **Backdrop blur** - Moderne modal prozori

## 📋 Faze Ciklusa

1. **Menstruacija** (1-5 dan) - Krvarenje
2. **Folikularna faza** (6-13 dan) - Rast folikula
3. **Ovulacija** (14 dan) - Oslobađanje jajne ćelije
4. **Lutealna faza** (15-28 dan) - Priprema za trudnoću

## 🔧 Podešavanja

Prilagodite aplikaciju vašim potrebama:
- **Dužina ciklusa**: Prosečan broj dana između menstruacija
- **Dužina menstruacije**: Koliko dana traje krvarenje
- **Notifikacije**: Koje podsetnike želite da primate

## 📤 Izvoz Podataka

Kliknite na "Izvezi Podatke" u podešavanjima da sačuvate sve vaše podatke u JSON fajl. Ovo je korisno za:
- Backup podataka
- Deljenje sa lekarom
- Migracija na drugi uređaj

## 🗑️ Brisanje Podataka

Ako želite da obrišete sve podatke:
1. Idite u Podešavanja
2. Kliknite "Obriši Sve Podatke"
3. Potvrdite akciju

**⚠️ Ova akcija se ne može poništiti!**

## 🌟 Napredne Funkcionalnosti

### Predviđanje Ciklusa
Aplikacija uči iz vaših prethodnih ciklusa i daje sve preciznija predviđanja.

### Personalizovani Saveti
Na osnovu vaših simptoma, aplikacija može dati savete o tome kada ste najplodniji ili kada da očekujete PMS simptome.

### Analiza Obrazaca
Statistika vam pomaže da identifikujete nepravilnosti u ciklusu i kada da posetite lekara.

## 📋 Datoteke Kreirane
- `index.html` - Glavna struktura aplikacije
- `styles.css` - Moderni, responzivni CSS sa dark mode
- `app.js` - Kompletna JavaScript logika
- `README.md` - Detaljna dokumentacija
- `manifest.json` - PWA konfiguracija

## 🤝 Doprinos

Ovaj projekat je open source. Slobodno ga koristite, modifikujte i delite!

## 📄 Licenca

MIT License - koristite kako želite!

---

**Napomena**: Ova aplikacija nije zamena za medicinski savet. Uvek se konsultujte sa lekarom za zdravstvene probleme.
