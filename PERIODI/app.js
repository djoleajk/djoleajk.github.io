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
        
        // Konfiguracija Groq API-ja
        this.groqApiKey = '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';
        this.groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions';
        this.surveyQuestions = [];
        this.currentQuestionIndex = 0;
        this.surveyAnswers = [];
        this.surveyActive = false;
        this.checkboxTimeout = null;

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

        // Postavi podrazumevani datum za unos simptoma
        document.getElementById('symptom-date').valueAsDate = new Date();

        // Zakazuj notifikacije za ciklus
        this.scheduleCycleNotifications();
        
        // Pokreni dnevnu anketu
        this.startDailySurvey();
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
