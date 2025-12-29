// Demo data za testiranje aplikacije
// Kopirajte ovaj kod u browser konzolu da dodate demo podatke

const demoData = {
    cycles: [
        {
            id: 1,
            startDate: "2024-12-15",
            length: 28,
            periodLength: 5,
            endDate: "2025-01-12"
        },
        {
            id: 2,
            startDate: "2025-01-12",
            length: 29,
            periodLength: 5,
            endDate: "2025-02-10"
        }
    ],
    symptoms: [
        {
            id: 1,
            date: "2024-12-20",
            energy: 7,
            mood: 6,
            pain: 2,
            libido: 8,
            additional: ["cramps"]
        },
        {
            id: 2,
            date: "2024-12-22",
            energy: 5,
            mood: 4,
            pain: 6,
            libido: 3,
            additional: ["headache", "bloating"]
        },
        {
            id: 3,
            date: "2024-12-25",
            energy: 8,
            mood: 8,
            pain: 1,
            libido: 9,
            additional: []
        }
    ],
    settings: {
        cycleLength: 28,
        periodLength: 5,
        notifications: {
            periodStart: true,
            ovulation: true,
            fertileWindow: false
        }
    }
};

// Funkcija za učitavanje demo podataka
function loadDemoData() {
    localStorage.setItem('periodi_cycles', JSON.stringify(demoData.cycles));
    localStorage.setItem('periodi_symptoms', JSON.stringify(demoData.symptoms));
    localStorage.setItem('periodi_settings', JSON.stringify(demoData.settings));
    console.log('Demo podaci učitani! Osvežite stranicu.');
    location.reload();
}

// Funkcija za brisanje svih podataka
function clearAllData() {
    localStorage.removeItem('periodi_cycles');
    localStorage.removeItem('periodi_symptoms');
    localStorage.removeItem('periodi_settings');
    localStorage.removeItem('periodi_reminders');
    localStorage.removeItem('periodi_theme');
    console.log('Svi podaci obrisani! Osvežite stranicu.');
    location.reload();
}

// Upute za korišćenje:
// 1. Otvorite browser konzolu (F12)
// 2. Kopirajte i nalepite: loadDemoData()
// 3. Pritisnite Enter
// 4. Osvežite stranicu (F5)

// Za brisanje demo podataka:
// clearAllData()
