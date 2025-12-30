// Rukovanje Događajima

PeriodTracker.prototype.setupEventListeners = function() {
    // Navigacija između tabova
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });

    // Akcije na pregledu
    document.getElementById('start-cycle-btn').addEventListener('click', () => this.showCycleModal());
    document.getElementById('log-period-btn').addEventListener('click', () => this.showCycleModal());
    document.getElementById('log-symptoms-btn').addEventListener('click', () => this.switchTab('symptoms'));
    document.getElementById('add-reminder-btn').addEventListener('click', () => this.showReminderModal());
    const startSurveyBtn = document.getElementById('start-survey-btn');
    if (startSurveyBtn) {
        startSurveyBtn.addEventListener('click', () => this.startDailySurvey(true));
    }

    // Navigacija kroz kalendar
    document.getElementById('prev-month').addEventListener('click', () => this.changeMonth(-1));
    document.getElementById('next-month').addEventListener('click', () => this.changeMonth(1));

    // Modalni prozori
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => this.closeModal());
    });

    // Modal za ciklus
    document.getElementById('save-cycle-btn').addEventListener('click', () => this.saveCycle());

    // Simptomi
    document.getElementById('save-symptoms-btn').addEventListener('click', () => this.saveSymptoms());
    document.querySelectorAll('.form-range').forEach(range => {
        range.addEventListener('input', (e) => this.updateRangeValue(e.target));
    });

    // Podešavanja
    document.getElementById('save-settings-btn').addEventListener('click', () => this.saveSettings());
    document.getElementById('export-data-btn').addEventListener('click', () => this.exportData());
    document.getElementById('clear-data-btn').addEventListener('click', () => this.clearAllData());

    // Modal za podsetnik
    document.getElementById('save-reminder-btn').addEventListener('click', () => this.saveReminder());

    // Plutajuće dugme za brze akcije
    document.getElementById('fab').addEventListener('click', () => this.showQuickActions());
    
    // Groq anketa
    document.getElementById('survey-next-btn').addEventListener('click', () => this.nextSurveyQuestion());
    document.getElementById('survey-submit-btn').addEventListener('click', () => this.submitSurvey());
    document.getElementById('survey-skip-btn').addEventListener('click', () => this.skipSurvey());
    document.getElementById('survey-prev-btn').addEventListener('click', () => this.prevSurveyQuestion());
    document.getElementById('survey-text-input').addEventListener('input', () => {
        const textInput = document.getElementById('survey-text-input');
        const nextBtn = document.getElementById('survey-next-btn');
        const submitBtn = document.getElementById('survey-submit-btn');
        const isLastQuestion = this.currentQuestionIndex === this.surveyQuestions.length - 1;
        
        if (textInput.value.trim()) {
            if (isLastQuestion) {
                submitBtn.style.display = 'inline-block';
            } else {
                nextBtn.style.display = 'inline-block';
            }
        } else {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'none';
        }
    });
};

