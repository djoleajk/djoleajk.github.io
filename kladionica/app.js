// ===== PROVERA AUTENTIFIKACIJE =====
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Ako korisnik nije ulogovan, preusmeri na login
if (!currentUser) {
    window.location.href = 'login.html';
}

// ===== DATA - SPORTSKI DOGAĐAJI =====
// Učitavanje utakmica iz localStorage ili korišćenje default vrednosti
let matches = JSON.parse(localStorage.getItem('matches')) || getDefaultMatches();

// Ako nema utakmica, postavi default
if (matches.length === 0) {
    matches = getDefaultMatches();
    localStorage.setItem('matches', JSON.stringify(matches));
}

// Default utakmice
function getDefaultMatches() {
    return [
        // FUDBAL
        {
            id: 1,
            sport: 'fudbal',
            league: 'Superliga Srbije',
            homeTeam: 'Crvena Zvezda',
            awayTeam: 'Partizan',
            date: '2025-10-23',
            time: '20:00',
            odds: { home: 2.10, draw: 3.20, away: 3.80 },
            stats: {
                home: { wins: 12, draws: 3, losses: 2, goalsScored: 34, goalsConceded: 12 },
                away: { wins: 10, draws: 5, losses: 2, goalsScored: 28, goalsConceded: 15 }
            }
        },
        {
            id: 2,
            sport: 'fudbal',
            league: 'Premier League',
            homeTeam: 'Manchester United',
            awayTeam: 'Liverpool',
            date: '2025-10-23',
            time: '18:30',
            odds: { home: 3.40, draw: 3.50, away: 2.15 },
            stats: {
                home: { wins: 8, draws: 4, losses: 3, goalsScored: 24, goalsConceded: 18 },
                away: { wins: 11, draws: 3, losses: 1, goalsScored: 32, goalsConceded: 10 }
            }
        },
        {
            id: 3,
            sport: 'fudbal',
            league: 'La Liga',
            homeTeam: 'Real Madrid',
            awayTeam: 'Barcelona',
            date: '2025-10-24',
            time: '21:00',
            odds: { home: 2.50, draw: 3.30, away: 2.90 },
            stats: {
                home: { wins: 10, draws: 2, losses: 3, goalsScored: 30, goalsConceded: 14 },
                away: { wins: 9, draws: 4, losses: 2, goalsScored: 28, goalsConceded: 12 }
            }
        },
        {
            id: 4,
            sport: 'fudbal',
            league: 'Bundesliga',
            homeTeam: 'Bayern Munich',
            awayTeam: 'Borussia Dortmund',
            date: '2025-10-24',
            time: '17:30',
            odds: { home: 1.85, draw: 3.80, away: 4.20 },
            stats: {
                home: { wins: 13, draws: 2, losses: 0, goalsScored: 38, goalsConceded: 8 },
                away: { wins: 9, draws: 3, losses: 3, goalsScored: 26, goalsConceded: 16 }
            }
        },
        {
            id: 5,
            sport: 'fudbal',
            league: 'Serie A',
            homeTeam: 'Juventus',
            awayTeam: 'Inter Milan',
            date: '2025-10-25',
            time: '19:45',
            odds: { home: 2.65, draw: 3.10, away: 2.75 },
            stats: {
                home: { wins: 9, draws: 5, losses: 1, goalsScored: 25, goalsConceded: 11 },
                away: { wins: 10, draws: 3, losses: 2, goalsScored: 29, goalsConceded: 13 }
            }
        },
        {
            id: 6,
            sport: 'fudbal',
            league: 'Liga Prvaka',
            homeTeam: 'PSG',
            awayTeam: 'Manchester City',
            date: '2025-10-26',
            time: '21:00',
            odds: { home: 3.10, draw: 3.40, away: 2.25 },
            stats: {
                home: { wins: 4, draws: 1, losses: 0, goalsScored: 12, goalsConceded: 3 },
                away: { wins: 4, draws: 0, losses: 1, goalsScored: 14, goalsConceded: 5 }
            }
        },

        // KOŠARKA
        {
            id: 7,
            sport: 'kosarka',
            league: 'ABA Liga',
            homeTeam: 'Crvena Zvezda',
            awayTeam: 'Partizan',
            date: '2025-10-23',
            time: '19:00',
            odds: { home: 1.75, draw: null, away: 2.05 },
            stats: {
                home: { wins: 14, losses: 3, pointsScored: 1456, pointsConceded: 1289 },
                away: { wins: 12, losses: 5, pointsScored: 1398, pointsConceded: 1312 }
            }
        },
        {
            id: 8,
            sport: 'kosarka',
            league: 'NBA',
            homeTeam: 'LA Lakers',
            awayTeam: 'Boston Celtics',
            date: '2025-10-23',
            time: '02:00',
            odds: { home: 2.20, draw: null, away: 1.65 },
            stats: {
                home: { wins: 8, losses: 4, pointsScored: 1234, pointsConceded: 1189 },
                away: { wins: 10, losses: 2, pointsScored: 1298, pointsConceded: 1145 }
            }
        },
        {
            id: 9,
            sport: 'kosarka',
            league: 'Evroliga',
            homeTeam: 'Real Madrid',
            awayTeam: 'Barcelona',
            date: '2025-10-24',
            time: '20:30',
            odds: { home: 1.90, draw: null, away: 1.90 },
            stats: {
                home: { wins: 7, losses: 2, pointsScored: 789, pointsConceded: 745 },
                away: { wins: 6, losses: 3, pointsScored: 756, pointsConceded: 734 }
            }
        },
        {
            id: 10,
            sport: 'kosarka',
            league: 'NBA',
            homeTeam: 'Golden State Warriors',
            awayTeam: 'Milwaukee Bucks',
            date: '2025-10-25',
            time: '03:30',
            odds: { home: 1.95, draw: null, away: 1.85 },
            stats: {
                home: { wins: 9, losses: 3, pointsScored: 1267, pointsConceded: 1198 },
                away: { wins: 10, losses: 2, pointsScored: 1289, pointsConceded: 1167 }
            }
        },

        // TENIS
        {
            id: 11,
            sport: 'tenis',
            league: 'ATP Masters',
            homeTeam: 'Novak Đoković',
            awayTeam: 'Carlos Alcaraz',
            date: '2025-10-23',
            time: '16:00',
            odds: { home: 1.80, draw: null, away: 2.00 },
            stats: {
                home: { rank: 1, titlesThisYear: 5, winRate: 87 },
                away: { rank: 2, titlesThisYear: 4, winRate: 84 }
            }
        },
        {
            id: 12,
            sport: 'tenis',
            league: 'ATP Masters',
            homeTeam: 'Jannik Sinner',
            awayTeam: 'Daniil Medvedev',
            date: '2025-10-23',
            time: '19:00',
            odds: { home: 1.95, draw: null, away: 1.85 },
            stats: {
                home: { rank: 4, titlesThisYear: 3, winRate: 81 },
                away: { rank: 3, titlesThisYear: 2, winRate: 79 }
            }
        },
        {
            id: 13,
            sport: 'tenis',
            league: 'WTA Finals',
            homeTeam: 'Iga Świątek',
            awayTeam: 'Aryna Sabalenka',
            date: '2025-10-24',
            time: '14:00',
            odds: { home: 1.70, draw: null, away: 2.10 },
            stats: {
                home: { rank: 1, titlesThisYear: 6, winRate: 89 },
                away: { rank: 2, titlesThisYear: 4, winRate: 83 }
            }
        },
        {
            id: 14,
            sport: 'tenis',
            league: 'ATP Masters',
            homeTeam: 'Rafael Nadal',
            awayTeam: 'Stefanos Tsitsipas',
            date: '2025-10-25',
            time: '17:00',
            odds: { home: 2.20, draw: null, away: 1.65 },
            stats: {
                home: { rank: 5, titlesThisYear: 2, winRate: 76 },
                away: { rank: 6, titlesThisYear: 3, winRate: 78 }
            }
        },
        {
            id: 15,
            sport: 'tenis',
            league: 'WTA Finals',
            homeTeam: 'Coco Gauff',
            awayTeam: 'Jessica Pegula',
            date: '2025-10-26',
            time: '15:30',
            odds: { home: 1.90, draw: null, away: 1.90 },
            stats: {
                home: { rank: 3, titlesThisYear: 3, winRate: 82 },
                away: { rank: 4, titlesThisYear: 2, winRate: 79 }
            }
        }
    ];
}

// ===== GLOBALNE PROMENLJIVE =====
let currentSport = 'all';
let currentLeague = 'all';
let currentDate = 'all';
let searchQuery = '';
let ticket = JSON.parse(localStorage.getItem('ticket')) || [];

// ===== DOM ELEMENTI =====
const navButtons = document.querySelectorAll('.nav-btn');
const matchesList = document.getElementById('matchesList');
const ticketMatches = document.getElementById('ticketMatches');
const matchCountEl = document.getElementById('matchCount');
const totalOddsEl = document.getElementById('totalOdds');
const stakeAmountEl = document.getElementById('stakeAmount');
const potentialWinEl = document.getElementById('potentialWin');
const placeTicketBtn = document.getElementById('placeTicket');
const clearTicketBtn = document.getElementById('clearTicket');
const searchInput = document.getElementById('searchInput');
const leagueFilter = document.getElementById('leagueFilter');
const dateFilter = document.getElementById('dateFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const matchModal = document.getElementById('matchModal');
const successModal = document.getElementById('successModal');

// ===== INICIJALIZACIJA =====
function init() {
    displayUserInfo();
    displayCurrentDate();
    populateLeagueFilter();
    displayMatches();
    displayTicket();
    setupEventListeners();
}

// ===== PRIKAZ KORISNIČKIH INFORMACIJA =====
function displayUserInfo() {
    const userName = document.getElementById('userName');
    const userBalance = document.getElementById('userBalance');
    
    if (userName && currentUser) {
        userName.textContent = `👤 ${currentUser.name}`;
    }
    
    if (userBalance && currentUser) {
        // Učitaj najnovije stanje iz users
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.id === currentUser.id);
        if (user) {
            currentUser.balance = user.balance;
            userBalance.textContent = `💰 ${user.balance.toLocaleString('sr-RS')} RSD`;
        }
    }
}

// ===== PRIKAZ TRENUTNOG DATUMA =====
function displayCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('sr-RS', options);
}

// ===== POPUNJAVANJE FILTERA LIGA =====
function populateLeagueFilter() {
    const leagues = [...new Set(matches.map(m => m.league))];
    leagues.forEach(league => {
        const option = document.createElement('option');
        option.value = league;
        option.textContent = league;
        leagueFilter.appendChild(option);
    });
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Navigacija sportova
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSport = btn.dataset.sport;
            displayMatches();
        });
    });

    // Pretraga
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        displayMatches();
    });

    // Filteri
    leagueFilter.addEventListener('change', (e) => {
        currentLeague = e.target.value;
        displayMatches();
    });

    dateFilter.addEventListener('change', (e) => {
        currentDate = e.target.value;
        displayMatches();
    });

    // Čišćenje filtera
    clearFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        leagueFilter.value = 'all';
        dateFilter.value = 'all';
        searchQuery = '';
        currentLeague = 'all';
        currentDate = 'all';
        displayMatches();
    });

    // Ulog input
    stakeAmountEl.addEventListener('input', calculatePotentialWin);

    // Uplata tiketa
    placeTicketBtn.addEventListener('click', placeTicket);

    // Čišćenje tiketa
    clearTicketBtn.addEventListener('click', clearTicket);

    // Zatvaranje modala
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    document.querySelectorAll('.close-success-btn').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    // Klik van modala
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
    });
}

// ===== FILTRIRANJE MEČEVA =====
function filterMatches() {
    let filtered = matches;

    // Filter po sportu
    if (currentSport !== 'all') {
        filtered = filtered.filter(m => m.sport === currentSport);
    }

    // Filter po ligi
    if (currentLeague !== 'all') {
        filtered = filtered.filter(m => m.league === currentLeague);
    }

    // Filter po datumu
    if (currentDate !== 'all') {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        const weekEnd = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

        if (currentDate === 'today') {
            filtered = filtered.filter(m => m.date === today);
        } else if (currentDate === 'tomorrow') {
            filtered = filtered.filter(m => m.date === tomorrow);
        } else if (currentDate === 'week') {
            filtered = filtered.filter(m => m.date >= today && m.date <= weekEnd);
        }
    }

    // Pretraga
    if (searchQuery) {
        filtered = filtered.filter(m => 
            m.homeTeam.toLowerCase().includes(searchQuery) ||
            m.awayTeam.toLowerCase().includes(searchQuery) ||
            m.league.toLowerCase().includes(searchQuery)
        );
    }

    return filtered;
}

// ===== PRIKAZ MEČEVA =====
function displayMatches() {
    const filtered = filterMatches();
    
    if (filtered.length === 0) {
        matchesList.innerHTML = `
            <div class="no-matches">
                <div class="no-matches-icon">🔍</div>
                <p>Nema pronađenih mečeva</p>
            </div>
        `;
        return;
    }

    matchesList.innerHTML = filtered.map(match => createMatchCard(match)).join('');
}

// ===== KREIRANJE KARTICE MEČA =====
function createMatchCard(match) {
    const sportEmojis = {
        fudbal: '⚽',
        kosarka: '🏀',
        tenis: '🎾'
    };

    const date = new Date(match.date + 'T' + match.time);
    const dateStr = date.toLocaleDateString('sr-RS', { day: 'numeric', month: 'short' });

    const ticketMatch = ticket.find(t => t.matchId === match.id);
    const homeSelected = ticketMatch?.selection === 'home' ? 'selected' : '';
    const drawSelected = ticketMatch?.selection === 'draw' ? 'selected' : '';
    const awaySelected = ticketMatch?.selection === 'away' ? 'selected' : '';

    const drawOdd = match.odds.draw ? `
        <button class="odd-btn ${drawSelected}" onclick="addToTicket(${match.id}, 'draw', ${match.odds.draw})">
            <span class="odd-label">X</span>
            <span class="odd-value">${match.odds.draw.toFixed(2)}</span>
        </button>
    ` : '';

    return `
        <div class="match-card">
            <div class="match-header">
                <div class="match-info">
                    <span class="sport-badge">${sportEmojis[match.sport]} ${match.sport.toUpperCase()}</span>
                    <div class="league-name">${match.league}</div>
                </div>
                <div class="match-time">
                    <div class="match-date">${dateStr}</div>
                    <div class="match-clock">${match.time}</div>
                </div>
            </div>

            <div class="match-teams">
                <div class="team">
                    <div class="team-name">${match.homeTeam}</div>
                    ${getTeamStats(match, 'home')}
                </div>
                <div class="vs-divider">VS</div>
                <div class="team">
                    <div class="team-name">${match.awayTeam}</div>
                    ${getTeamStats(match, 'away')}
                </div>
            </div>

            <div class="match-odds">
                <button class="odd-btn ${homeSelected}" onclick="addToTicket(${match.id}, 'home', ${match.odds.home})">
                    <span class="odd-label">1</span>
                    <span class="odd-value">${match.odds.home.toFixed(2)}</span>
                </button>
                ${drawOdd}
                <button class="odd-btn ${awaySelected}" onclick="addToTicket(${match.id}, 'away', ${match.odds.away})">
                    <span class="odd-label">${match.odds.draw ? '2' : 'Away'}</span>
                    <span class="odd-value">${match.odds.away.toFixed(2)}</span>
                </button>
            </div>

            <button class="match-stats-btn" onclick="showMatchStats(${match.id})">
                📊 Prikaži statistiku
            </button>
        </div>
    `;
}

// ===== STATISTIKA TIMA =====
function getTeamStats(match, team) {
    const stats = match.stats[team];
    
    if (match.sport === 'fudbal') {
        return `
            <div class="team-stats">
                <span class="stat-item">P: ${stats.wins}</span>
                <span class="stat-item">N: ${stats.draws}</span>
                <span class="stat-item">I: ${stats.losses}</span>
            </div>
        `;
    } else if (match.sport === 'kosarka') {
        return `
            <div class="team-stats">
                <span class="stat-item">P: ${stats.wins}</span>
                <span class="stat-item">I: ${stats.losses}</span>
            </div>
        `;
    } else if (match.sport === 'tenis') {
        return `
            <div class="team-stats">
                <span class="stat-item">Rang: ${stats.rank}</span>
                <span class="stat-item">Win: ${stats.winRate}%</span>
            </div>
        `;
    }
}

// ===== DODAVANJE NA TIKET =====
function addToTicket(matchId, selection, odd) {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    // Provera da li meč već postoji na tiketu
    const existingIndex = ticket.findIndex(t => t.matchId === matchId);

    if (existingIndex !== -1) {
        // Ako je ista selekcija, ukloni sa tiketa
        if (ticket[existingIndex].selection === selection) {
            ticket.splice(existingIndex, 1);
        } else {
            // Ažuriraj selekciju
            ticket[existingIndex] = {
                matchId,
                match,
                selection,
                odd
            };
        }
    } else {
        // Dodaj novi meč na tiket
        ticket.push({
            matchId,
            match,
            selection,
            odd
        });
    }

    saveTicket();
    displayMatches();
    displayTicket();
}

// ===== PRIKAZ TIKETA =====
function displayTicket() {
    if (ticket.length === 0) {
        ticketMatches.innerHTML = `
            <div class="empty-ticket">
                <p>📝 Dodaj mečeve na tiket klikom na kvote</p>
            </div>
        `;
        matchCountEl.textContent = '0';
        totalOddsEl.textContent = '1.00';
        potentialWinEl.textContent = '0.00 RSD';
        placeTicketBtn.disabled = true;
        return;
    }

    ticketMatches.innerHTML = ticket.map((item, index) => {
        const selectionLabels = {
            home: `${item.match.homeTeam} pobeda`,
            draw: 'Nerešeno',
            away: `${item.match.awayTeam} pobeda`
        };

        return `
            <div class="ticket-match">
                <div class="ticket-match-header">
                    <div class="ticket-teams">
                        <strong>${item.match.homeTeam}</strong> vs <strong>${item.match.awayTeam}</strong><br>
                        <small>${item.match.league}</small>
                    </div>
                    <button class="remove-match-btn" onclick="removeFromTicket(${index})">✖</button>
                </div>
                <div class="ticket-selection">
                    <span class="selection-info">${selectionLabels[item.selection]}</span>
                    <span class="selection-odd">${item.odd.toFixed(2)}</span>
                </div>
            </div>
        `;
    }).join('');

    // Ažuriranje statistike tiketa
    matchCountEl.textContent = ticket.length;
    const totalOdds = calculateTotalOdds();
    totalOddsEl.textContent = totalOdds.toFixed(2);
    calculatePotentialWin();
    placeTicketBtn.disabled = false;
}

// ===== UKLANJANJE SA TIKETA =====
function removeFromTicket(index) {
    ticket.splice(index, 1);
    saveTicket();
    displayMatches();
    displayTicket();
}

// ===== ČIŠĆENJE TIKETA =====
function clearTicket() {
    if (ticket.length === 0) return;
    
    if (confirm('Da li ste sigurni da želite da obrišete sve mečeve sa tiketa?')) {
        ticket = [];
        saveTicket();
        displayMatches();
        displayTicket();
        stakeAmountEl.value = '';
    }
}

// ===== RAČUNANJE UKUPNE KVOTE =====
function calculateTotalOdds() {
    if (ticket.length === 0) return 1;
    return ticket.reduce((total, item) => total * item.odd, 1);
}

// ===== RAČUNANJE POTENCIJALNOG DOBITKA =====
function calculatePotentialWin() {
    const stake = parseFloat(stakeAmountEl.value) || 0;
    const totalOdds = calculateTotalOdds();
    const potentialWin = stake * totalOdds;
    potentialWinEl.textContent = potentialWin.toFixed(2) + ' RSD';
}

// ===== ČUVANJE TIKETA U LOCAL STORAGE =====
function saveTicket() {
    localStorage.setItem('ticket', JSON.stringify(ticket));
}

// ===== UPLATA TIKETA =====
function placeTicket() {
    const stake = parseFloat(stakeAmountEl.value);
    
    if (!stake || stake < 10) {
        alert('Minimalni ulog je 10 RSD');
        return;
    }

    if (ticket.length === 0) {
        alert('Dodajte bar jedan meč na tiket');
        return;
    }
    
    // Provera stanja na računu
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) {
        alert('Greška: Korisnik nije pronađen');
        return;
    }
    
    if (users[userIndex].balance < stake) {
        alert(`Nemate dovoljno sredstava! Vaše stanje: ${users[userIndex].balance} RSD`);
        return;
    }

    const totalOdds = calculateTotalOdds();
    const potentialWin = stake * totalOdds;
    const ticketId = generateTicketId();

    // Oduzmi ulog od stanja
    users[userIndex].balance -= stake;
    
    // Sačuvaj tiket u istoriju
    const ticketData = {
        id: ticketId,
        date: new Date().toISOString(),
        matches: ticket.map(t => ({
            match: `${t.match.homeTeam} vs ${t.match.awayTeam}`,
            league: t.match.league,
            selection: t.selection,
            odd: t.odd
        })),
        stake: stake,
        totalOdds: totalOdds,
        potentialWin: potentialWin,
        status: 'pending'
    };
    
    users[userIndex].ticketHistory = users[userIndex].ticketHistory || [];
    users[userIndex].ticketHistory.unshift(ticketData);
    
    // Ograniči istoriju na 50 tiketa
    if (users[userIndex].ticketHistory.length > 50) {
        users[userIndex].ticketHistory = users[userIndex].ticketHistory.slice(0, 50);
    }
    
    // Sačuvaj izmene
    localStorage.setItem('users', JSON.stringify(users));
    currentUser.balance = users[userIndex].balance;
    
    // Ažuriraj prikaz stanja
    displayUserInfo();

    // Prikaz success modal-a
    const ticketSummary = document.getElementById('ticketSummary');
    ticketSummary.innerHTML = `
        <p><strong>Broj mečeva:</strong> ${ticket.length}</p>
        <p><strong>Ukupna kvota:</strong> ${totalOdds.toFixed(2)}</p>
        <p><strong>Ulog:</strong> ${stake.toFixed(2)} RSD</p>
        <p><strong>Potencijalni dobitak:</strong> <span style="color: var(--primary-green); font-size: 1.3rem;">${potentialWin.toFixed(2)} RSD</span></p>
        <hr style="margin: 15px 0; border-color: var(--border-color);">
        <p style="font-size: 0.9rem; color: var(--text-muted);">Tiket ID: ${ticketId}</p>
        <p style="margin-top: 10px;"><strong>Novo stanje:</strong> <span style="color: var(--primary-green);">${users[userIndex].balance.toFixed(2)} RSD</span></p>
    `;

    successModal.classList.add('show');

    // Čišćenje tiketa nakon uplate
    ticket = [];
    stakeAmountEl.value = '';
    saveTicket();
    displayMatches();
    displayTicket();
}

// ===== LOGOUT =====
function logout() {
    if (confirm('Da li ste sigurni da želite da se odjavite?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('ticket');
        window.location.href = 'login.html';
    }
}

// ===== GENERISANJE TIKET ID-a =====
function generateTicketId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `TKT-${timestamp}-${random}`;
}

// ===== PRIKAZ STATISTIKE MEČA =====
function showMatchStats(matchId) {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    const modalBody = document.getElementById('modalBody');
    
    let statsContent = '';
    
    if (match.sport === 'fudbal') {
        statsContent = `
            <h2>📊 Statistika meča</h2>
            <h3 style="color: var(--primary-green); margin: 20px 0;">${match.homeTeam} vs ${match.awayTeam}</h3>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">${match.league}</p>
            
            <div class="stats-grid">
                <div class="stat-box">
                    <h3>${match.homeTeam}</h3>
                    <p>Pobede: ${match.stats.home.wins}</p>
                    <p>Nerešeno: ${match.stats.home.draws}</p>
                    <p>Porazi: ${match.stats.home.losses}</p>
                    <p>Golovi: ${match.stats.home.goalsScored}</p>
                    <p>Primljeni: ${match.stats.home.goalsConceded}</p>
                </div>
                <div class="stat-box">
                    <h3>${match.awayTeam}</h3>
                    <p>Pobede: ${match.stats.away.wins}</p>
                    <p>Nerešeno: ${match.stats.away.draws}</p>
                    <p>Porazi: ${match.stats.away.losses}</p>
                    <p>Golovi: ${match.stats.away.goalsScored}</p>
                    <p>Primljeni: ${match.stats.away.goalsConceded}</p>
                </div>
            </div>
        `;
    } else if (match.sport === 'kosarka') {
        statsContent = `
            <h2>📊 Statistika meča</h2>
            <h3 style="color: var(--primary-green); margin: 20px 0;">${match.homeTeam} vs ${match.awayTeam}</h3>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">${match.league}</p>
            
            <div class="stats-grid">
                <div class="stat-box">
                    <h3>${match.homeTeam}</h3>
                    <p>Pobede: ${match.stats.home.wins}</p>
                    <p>Porazi: ${match.stats.home.losses}</p>
                    <p>Poeni dati: ${match.stats.home.pointsScored}</p>
                    <p>Poeni primljeni: ${match.stats.home.pointsConceded}</p>
                    <p>Prosek: ${(match.stats.home.pointsScored / (match.stats.home.wins + match.stats.home.losses)).toFixed(1)}</p>
                </div>
                <div class="stat-box">
                    <h3>${match.awayTeam}</h3>
                    <p>Pobede: ${match.stats.away.wins}</p>
                    <p>Porazi: ${match.stats.away.losses}</p>
                    <p>Poeni dati: ${match.stats.away.pointsScored}</p>
                    <p>Poeni primljeni: ${match.stats.away.pointsConceded}</p>
                    <p>Prosek: ${(match.stats.away.pointsScored / (match.stats.away.wins + match.stats.away.losses)).toFixed(1)}</p>
                </div>
            </div>
        `;
    } else if (match.sport === 'tenis') {
        statsContent = `
            <h2>📊 Statistika meča</h2>
            <h3 style="color: var(--primary-green); margin: 20px 0;">${match.homeTeam} vs ${match.awayTeam}</h3>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">${match.league}</p>
            
            <div class="stats-grid">
                <div class="stat-box">
                    <h3>${match.homeTeam}</h3>
                    <p>Rang: ${match.stats.home.rank}</p>
                    <p>Titule ove godine: ${match.stats.home.titlesThisYear}</p>
                    <p>Procenat pobeda: ${match.stats.home.winRate}%</p>
                </div>
                <div class="stat-box">
                    <h3>${match.awayTeam}</h3>
                    <p>Rang: ${match.stats.away.rank}</p>
                    <p>Titule ove godine: ${match.stats.away.titlesThisYear}</p>
                    <p>Procenat pobeda: ${match.stats.away.winRate}%</p>
                </div>
            </div>
        `;
    }

    modalBody.innerHTML = statsContent;
    matchModal.classList.add('show');
}

// ===== ZATVARANJE MODALA =====
function closeModals() {
    matchModal.classList.remove('show');
    successModal.classList.remove('show');
}

// ===== POKRETANJE APLIKACIJE =====
document.addEventListener('DOMContentLoaded', init);

