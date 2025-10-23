// ===== PROVERA AUTENTIFIKACIJE =====
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Ako korisnik nije ulogovan ili nije admin, preusmeri
if (!currentUser) {
    window.location.href = 'login.html';
} else if (currentUser.role !== 'admin') {
    alert('⛔ Pristup odbijen! Ova stranica je dostupna samo administratorima.');
    window.location.href = 'index.html';
}

// ===== UČITAVANJE UTAKMICA IZ LOCALSTORAGE =====
let matches = JSON.parse(localStorage.getItem('matches')) || [];

// Ako nema utakmica u localStorage, učitaj default podatke iz app.js
if (matches.length === 0) {
    matches = getDefaultMatches();
    saveMatches();
}

// ===== DOM ELEMENTI =====
const matchForm = document.getElementById('matchForm');
const sportSelect = document.getElementById('sport');
const matchesList = document.getElementById('matchesList');
const successMessage = document.getElementById('successMessage');
const footballStats = document.getElementById('footballStats');
const basketballStats = document.getElementById('basketballStats');
const tennisStats = document.getElementById('tennisStats');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEdit');

let editingMatchId = null;

// ===== INICIJALIZACIJA =====
function init() {
    displayAdminInfo();
    displayMatches();
    setupEventListeners();
    updateStatsFields();
}

// ===== PRIKAZ ADMIN INFORMACIJA =====
function displayAdminInfo() {
    const adminName = document.getElementById('adminName');
    if (adminName && currentUser) {
        adminName.textContent = `👤 ${currentUser.name}`;
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Promena sporta
    sportSelect.addEventListener('change', updateStatsFields);

    // Submit forme
    matchForm.addEventListener('submit', handleSubmit);

    // Otkaži izmenu
    cancelEditBtn.addEventListener('click', cancelEdit);
}

// ===== LOGOUT =====
function logout() {
    if (confirm('Da li ste sigurni da želite da se odjavite?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// Učini logout dostupnim globalno
window.logout = logout;

// ===== PRIKAZ/SAKRIVANJE STATISTIKE POLJA =====
function updateStatsFields() {
    const sport = sportSelect.value;

    footballStats.style.display = sport === 'fudbal' ? 'block' : 'none';
    basketballStats.style.display = sport === 'kosarka' ? 'block' : 'none';
    tennisStats.style.display = sport === 'tenis' ? 'block' : 'none';

    // Za tenis i košarku, sakrij X kvotu
    const drawOddGroup = document.getElementById('oddDraw').parentElement;
    if (sport === 'tenis' || sport === 'kosarka') {
        drawOddGroup.style.display = 'none';
        document.getElementById('oddDraw').removeAttribute('required');
    } else {
        drawOddGroup.style.display = 'block';
        document.getElementById('oddDraw').setAttribute('required', 'required');
    }
}

// ===== SUBMIT FORME =====
function handleSubmit(e) {
    e.preventDefault();

    const sport = document.getElementById('sport').value;
    const league = document.getElementById('league').value;
    const homeTeam = document.getElementById('homeTeam').value;
    const awayTeam = document.getElementById('awayTeam').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const oddHome = parseFloat(document.getElementById('oddHome').value);
    const oddDraw = document.getElementById('oddDraw').value ? parseFloat(document.getElementById('oddDraw').value) : null;
    const oddAway = parseFloat(document.getElementById('oddAway').value);

    // Kreiranje stats objekta na osnovu sporta
    let stats = {};

    if (sport === 'fudbal') {
        stats = {
            home: {
                wins: parseInt(document.getElementById('homeWins').value) || 0,
                draws: parseInt(document.getElementById('homeDraws').value) || 0,
                losses: parseInt(document.getElementById('homeLosses').value) || 0,
                goalsScored: parseInt(document.getElementById('homeGoalsScored').value) || 0,
                goalsConceded: parseInt(document.getElementById('homeGoalsConceded').value) || 0
            },
            away: {
                wins: parseInt(document.getElementById('awayWins').value) || 0,
                draws: parseInt(document.getElementById('awayDraws').value) || 0,
                losses: parseInt(document.getElementById('awayLosses').value) || 0,
                goalsScored: parseInt(document.getElementById('awayGoalsScored').value) || 0,
                goalsConceded: parseInt(document.getElementById('awayGoalsConceded').value) || 0
            }
        };
    } else if (sport === 'kosarka') {
        stats = {
            home: {
                wins: parseInt(document.getElementById('homeWinsBb').value) || 0,
                losses: parseInt(document.getElementById('homeLossesBb').value) || 0,
                pointsScored: parseInt(document.getElementById('homePointsScored').value) || 0,
                pointsConceded: parseInt(document.getElementById('homePointsConceded').value) || 0
            },
            away: {
                wins: parseInt(document.getElementById('awayWinsBb').value) || 0,
                losses: parseInt(document.getElementById('awayLossesBb').value) || 0,
                pointsScored: parseInt(document.getElementById('awayPointsScored').value) || 0,
                pointsConceded: parseInt(document.getElementById('awayPointsConceded').value) || 0
            }
        };
    } else if (sport === 'tenis') {
        stats = {
            home: {
                rank: parseInt(document.getElementById('homeRank').value) || 1,
                titlesThisYear: parseInt(document.getElementById('homeTitles').value) || 0,
                winRate: parseInt(document.getElementById('homeWinRate').value) || 50
            },
            away: {
                rank: parseInt(document.getElementById('awayRank').value) || 1,
                titlesThisYear: parseInt(document.getElementById('awayTitles').value) || 0,
                winRate: parseInt(document.getElementById('awayWinRate').value) || 50
            }
        };
    }

    const match = {
        id: editingMatchId || Date.now(),
        sport,
        league,
        homeTeam,
        awayTeam,
        date,
        time,
        odds: {
            home: oddHome,
            draw: oddDraw,
            away: oddAway
        },
        stats
    };

    if (editingMatchId) {
        // Izmena postojeće utakmice
        const index = matches.findIndex(m => m.id === editingMatchId);
        if (index !== -1) {
            matches[index] = match;
            showSuccess('✅ Utakmica uspešno izmenjena!');
        }
        cancelEdit();
    } else {
        // Dodavanje nove utakmice
        matches.push(match);
        showSuccess('✅ Utakmica uspešno dodata!');
        matchForm.reset();
    }

    saveMatches();
    displayMatches();
}

// ===== PRIKAZ UTAKMICA U TABELI =====
function displayMatches() {
    if (matches.length === 0) {
        matchesList.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
                    Nema dodanih utakmica
                </td>
            </tr>
        `;
        return;
    }

    matchesList.innerHTML = matches.map(match => {
        const sportEmojis = {
            fudbal: '⚽',
            kosarka: '🏀',
            tenis: '🎾'
        };

        const oddsText = match.odds.draw 
            ? `${match.odds.home.toFixed(2)} / ${match.odds.draw.toFixed(2)} / ${match.odds.away.toFixed(2)}`
            : `${match.odds.home.toFixed(2)} / ${match.odds.away.toFixed(2)}`;

        return `
            <tr>
                <td>
                    <span class="sport-badge-small">${sportEmojis[match.sport]} ${match.sport}</span>
                </td>
                <td>${match.league}</td>
                <td><strong>${match.homeTeam}</strong> vs <strong>${match.awayTeam}</strong></td>
                <td>${formatDate(match.date)}</td>
                <td>${match.time}</td>
                <td style="color: var(--gold); font-weight: 600;">${oddsText}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="editMatch(${match.id})">✏️ Izmeni</button>
                        <button class="btn-delete" onclick="deleteMatch(${match.id})">🗑️ Obriši</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ===== FORMATIRANJE DATUMA =====
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sr-RS', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ===== IZMENA UTAKMICE =====
function editMatch(matchId) {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    editingMatchId = matchId;

    // Popunjavanje forme
    document.getElementById('sport').value = match.sport;
    updateStatsFields();

    document.getElementById('league').value = match.league;
    document.getElementById('homeTeam').value = match.homeTeam;
    document.getElementById('awayTeam').value = match.awayTeam;
    document.getElementById('date').value = match.date;
    document.getElementById('time').value = match.time;
    document.getElementById('oddHome').value = match.odds.home;
    document.getElementById('oddDraw').value = match.odds.draw || '';
    document.getElementById('oddAway').value = match.odds.away;

    // Popunjavanje statistike
    if (match.sport === 'fudbal') {
        document.getElementById('homeWins').value = match.stats.home.wins;
        document.getElementById('homeDraws').value = match.stats.home.draws;
        document.getElementById('homeLosses').value = match.stats.home.losses;
        document.getElementById('homeGoalsScored').value = match.stats.home.goalsScored;
        document.getElementById('homeGoalsConceded').value = match.stats.home.goalsConceded;
        document.getElementById('awayWins').value = match.stats.away.wins;
        document.getElementById('awayDraws').value = match.stats.away.draws;
        document.getElementById('awayLosses').value = match.stats.away.losses;
        document.getElementById('awayGoalsScored').value = match.stats.away.goalsScored;
        document.getElementById('awayGoalsConceded').value = match.stats.away.goalsConceded;
    } else if (match.sport === 'kosarka') {
        document.getElementById('homeWinsBb').value = match.stats.home.wins;
        document.getElementById('homeLossesBb').value = match.stats.home.losses;
        document.getElementById('homePointsScored').value = match.stats.home.pointsScored;
        document.getElementById('homePointsConceded').value = match.stats.home.pointsConceded;
        document.getElementById('awayWinsBb').value = match.stats.away.wins;
        document.getElementById('awayLossesBb').value = match.stats.away.losses;
        document.getElementById('awayPointsScored').value = match.stats.away.pointsScored;
        document.getElementById('awayPointsConceded').value = match.stats.away.pointsConceded;
    } else if (match.sport === 'tenis') {
        document.getElementById('homeRank').value = match.stats.home.rank;
        document.getElementById('homeTitles').value = match.stats.home.titlesThisYear;
        document.getElementById('homeWinRate').value = match.stats.home.winRate;
        document.getElementById('awayRank').value = match.stats.away.rank;
        document.getElementById('awayTitles').value = match.stats.away.titlesThisYear;
        document.getElementById('awayWinRate').value = match.stats.away.winRate;
    }

    // Izmena UI
    formTitle.textContent = '✏️ Izmeni utakmicu';
    submitBtn.textContent = '💾 Sačuvaj izmene';
    cancelEditBtn.style.display = 'block';

    // Scroll na vrh
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== OTKAŽI IZMENU =====
function cancelEdit() {
    editingMatchId = null;
    matchForm.reset();
    formTitle.textContent = 'Dodaj novu utakmicu';
    submitBtn.textContent = '➕ Dodaj utakmicu';
    cancelEditBtn.style.display = 'none';
    updateStatsFields();
}

// ===== BRISANJE UTAKMICE =====
function deleteMatch(matchId) {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    if (confirm(`Da li ste sigurni da želite da obrišete utakmicu:\n${match.homeTeam} vs ${match.awayTeam}?`)) {
        matches = matches.filter(m => m.id !== matchId);
        saveMatches();
        displayMatches();
        showSuccess('✅ Utakmica uspešno obrisana!');
    }
}

// ===== ČUVANJE U LOCALSTORAGE =====
function saveMatches() {
    localStorage.setItem('matches', JSON.stringify(matches));
}

// ===== PRIKAZ SUCCESS PORUKE =====
function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.classList.add('show');

    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

// ===== DEFAULT UTAKMICE =====
function getDefaultMatches() {
    return [
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

// ===== POKRETANJE =====
document.addEventListener('DOMContentLoaded', init);

