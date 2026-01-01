// Glavna klasa PeriodTracker
class PeriodTracker {
    constructor() {
        // Inicijalizacija podataka
        this.cycles = [];
        this.symptoms = [];
        this.settings = {
            avgCycleLength: 28,
            avgPeriodLength: 5,
            notifications: {
                periodStart: true,
                ovulation: true,
                fertileWindow: true
            }
        };
        this.reminders = [];
        this.currentDate = new Date();
        this.calendarDate = new Date();
        
        // Inicijalizuj module
        this.surveyModule = new Anketa(this);
        this.symptomFormModule = new FormularZaSimptome(this);
        
        // Inicijalizuj aplikaciju
        this.init();
    }
    
    init() {
        // Učitaj podatke iz localStorage
        this.loadData();
        
        // Postavi event listenere
        this.setupEventListeners();
        
        // Ažuriraj UI
        this.updateDashboard();
        this.renderCalendar();
        this.updateSymptomsDisplay();
        this.loadSettings();
        this.initTheme();
        
        // Zakazi notifikacije
        this.scheduleCycleNotifications();
        
        // Ažuriraj status notifikacija
        if (this.updateNotificationStatus) {
            this.updateNotificationStatus();
        }
        
        // Mobile optimizacije
        if (this.initMobileOptimizations) {
            this.initMobileOptimizations();
        }
        
        // Anketa se ne pokreće automatski - korisnik može da je pokrene klikom na dugme
    }
    
    // Metode će biti dodate preko prototype-a u modulima
}

// Pokreni aplikaciju kada se DOM učita
document.addEventListener('DOMContentLoaded', () => {
    window.tracker = new PeriodTracker();
});
