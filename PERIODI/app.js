// Periodi - Aplikacija za Praćenje Menstrualnog Ciklusa
class PeriodTracker {
    constructor() {
        this.currentDate = new Date();
        this.cycles = [];
        this.symptoms = [];
        this.settings = {
            cycleLength: 28,
            periodLength: 5,
            notifications: {
                periodStart: true,
                ovulation: true,
                fertileWindow: false
            }
        };
        this.reminders = [];
        
        // Inicijalizuj modul za anketu
        this.surveyModule = new Anketa(this);
        
        // Inicijalizuj modul za formular za simptome
        this.symptomFormModule = new FormularZaSimptome(this);

        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateDashboard();
        this.renderCalendar();
        this.updateSymptomsDisplay();
        this.loadSettings();
        this.initTheme();

        // Zakazuj notifikacije za ciklus
        this.scheduleCycleNotifications();
        
        // Pokreni dnevnu anketu
        this.surveyModule.startDailySurvey();
    }
}

// Zatraži dozvolu za notifikacije pri učitavanju
if ('Notification' in window) {
    Notification.requestPermission();
}

// Inicijalizuj aplikaciju
document.addEventListener('DOMContentLoaded', () => {
    new PeriodTracker();
});
