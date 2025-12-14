# 🎬 FilmFinder - Tragač Filmova

Inteligentni sistem za preporuku filmova koji pomaže korisnicima da pronađu savršen film na osnovu njihovog ukusa i raspoloženja.

## ✨ Karakteristike

- 🎯 **Personalizovana Preporuka** - Anketa sa 3 koraka za preciznu preporuku
- 🎨 **Moderan UI/UX** - Dark/Light mode sa animacijama i glow efektima
- 📱 **Potpuno Responzivan** - Optimizovan za desktop, tablet i mobilne uređaje
- 🔄 **Višestruke Preporuke** - "Sledeći Predlog" funkcija za brze dodatne preporuke
- 🎞️ **Detaljne Informacije** - Postere, ocene, glumci, režija iz OMDb API
- 🔗 **Direktni Linkovi** - Brze veze ka streaming platformama
- 🎥 **Trailer Pretraga** - Direktan link ka YouTube trailer-ima
- 💾 **Cache Sistem** - Brže učitavanje već pretraženih filmova
- 🌐 **PWA Podrška** - Instalacija kao aplikacija na uređaj

## 🎯 Kako Funkcioniše

### Korak 1: Odabir Žanra
Korisnik bira jedan ili više žanrova:
- ⚡ Akcija
- 😄 Komedija
- 💔 Drama
- 👻 Horor
- 🚀 Sci-Fi
- 🔍 Triler

### Korak 2: Period Filma
Odabir vremenskog perioda:
- 📼 Klasici (1970-1999)
- 💿 2000-te (2000-2009)
- 🎬 2010-te (2010-2019)
- 🎥 Moderni (2020+)

### Korak 3: Raspoloženje
Odabir trenutnog raspoloženja:
- 😊 Srećan/na - zabavni sadržaj
- 😢 Tužan/na - emotivne priče
- 🤩 Uzbuđen/a - akcija i avantura
- 😨 Želim se uplašiti - horor
- 🤔 Zamišljen/a - duboke teme
- 😌 Opušten/a - bilo šta

## 🛠️ Tehnologije

- **HTML5** - Semantički markup
- **CSS3** - Custom properties, animacije, gradijenti
- **Bootstrap 5** - Responzivni grid i komponente
- **JavaScript (ES6+)** - Async/Await, Fetch API, Local Storage
- **OMDb API** - Baza podataka o filmovima
- **PWA** - Manifest i service worker podrška

## 🎨 Dizajn Karakteristike

### Dark Mode (Default)
- Tamna tema sa ljubičastim gradijentima (#667eea, #764ba2)
- Glow efekti na interaktivnim elementima
- Neon svetlucanje na posterima

### Light Mode
- Svetla tema sa pastelnim bojama
- Minimalistički dizajn
- Suptilne senke

### Animacije
- Fade-in efekti
- Hover transformacije
- Progress bar animacije
- Pulse efekti na dugmadima

## 📊 Baza Filmova

Sistem koristi 20 popularnih naslova po žanru:
- **Akcija**: 20 filmova (Terminator, John Wick, Matrix...)
- **Komedija**: 20 filmova (Hangover, Superbad...)
- **Drama**: 20 filmova (Shawshank, Forrest Gump...)
- **Horor**: 20 filmova (Conjuring, IT, Hereditary...)
- **Sci-Fi**: 20 filmova (Interstellar, Inception...)
- **Triler**: 20 filmova (Gone Girl, Seven...)

**Ukupno: 120+ filmova** sa mogućnošću proširenja

## 🚀 Funkcionalnosti

### Pretraga Filmova
```javascript
// Generisanje upita prema anketnim parametrima
generateSearchQuery(surveyData)

// Pretraga preko OMDb API
searchMovies(query)

// Dohvatanje detaljnih informacija
getMovieDetails(imdbID)
```

### Cache Sistem
- Čuva rezultate pretrage
- Smanjuje broj API poziva
- Brže učitavanje ponovljenih upita

### Anti-Duplicate Sistem
- Prati prikazane filmove
- Izbegava ponavljanje
- Automatski reset kada se iscrpe opcije

## 🔗 Streaming Linkovi

Aplikacija pruža direktne linkove ka:
- 🎬 **FilmoTip**
- ▶️ **Online sa Prevodom**
- 🎥 **FilmoviTex**
- 📺 **FilmoviPlex**

## 📱 PWA Funkcionalnost

- ✅ Instalacija kao standalone aplikacija
- ✅ Custom favicon i ikonica
- ✅ Theme color za mobilne browser-e
- ✅ Offline spremnost (manifest)

## 🎯 Budući Razvoj

- [ ] Favoriti sistem
- [ ] Ocenjivanje filmova
- [ ] Deljenje preporuka
- [ ] Napredni filteri (glumci, režiser, ocena)
- [ ] Watchlist funkcionalnost
- [ ] Socijalna integracija
- [ ] Multilingual podrška

## 👨‍💻 Autor

**Đorđe Živanović**
- 📧 djoleajkzivanovic@gmail.com
- 🌐 Agencija Sprint
- 📱 065 85 60 207

## 📄 Licenca

© 2024 Đorđe Živanović - Agencija Sprint. Sva prava zadržana.

---

**Powered by OMDb API** 🎬

