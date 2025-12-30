// Podešavanja

PeriodTracker.prototype.loadSettings = function() {
    document.getElementById('cycle-length').value = this.settings.cycleLength;
    document.getElementById('period-length').value = this.settings.periodLength;
    document.getElementById('notify-period-start').checked = this.settings.notifications.periodStart;
    document.getElementById('notify-ovulation').checked = this.settings.notifications.ovulation;
    document.getElementById('notify-fertile-window').checked = this.settings.notifications.fertileWindow;
};

PeriodTracker.prototype.saveSettings = function() {
    this.settings.cycleLength = parseInt(document.getElementById('cycle-length').value);
    this.settings.periodLength = parseInt(document.getElementById('period-length').value);
    this.settings.notifications.periodStart = document.getElementById('notify-period-start').checked;
    this.settings.notifications.ovulation = document.getElementById('notify-ovulation').checked;
    this.settings.notifications.fertileWindow = document.getElementById('notify-fertile-window').checked;

    this.saveData();
    this.updateDashboard();
    this.renderCalendar();
    this.updateCycleNotifications();

    alert('Podešavanja su sačuvana!');
};

PeriodTracker.prototype.exportData = function() {
    const data = {
        cycles: this.cycles,
        symptoms: this.symptoms,
        settings: this.settings,
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `periodi-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);
};

PeriodTracker.prototype.clearAllData = function() {
    if (confirm('Da li ste sigurni da želite obrisati sve podatke? Ova akcija se ne može poništiti.')) {
        // Obriši sve nizove
        this.cycles = [];
        this.symptoms = [];
        this.reminders = [];
        
        // Resetuj podešavanja na podrazumevane vrednosti
        this.settings = {
            cycleLength: 28,
            periodLength: 5,
            notifications: {
                periodStart: true,
                ovulation: true,
                fertileWindow: false
            }
        };
        
        // Obriši sve stavke iz lokalnog skladišta
        localStorage.removeItem('periodi_cycles');
        localStorage.removeItem('periodi_symptoms');
        localStorage.removeItem('periodi_settings');
        localStorage.removeItem('periodi_reminders');
        localStorage.removeItem('periodi_theme');
        
        // Reset theme to default
        this.setTheme('light');
        
        // Update UI
        this.loadSettings();
        this.saveData();
        this.updateDashboard();
        this.renderCalendar();
        this.updateSymptomsDisplay();
        
        // Clear cycle notification timeouts
        if (this.cycleNotificationTimeouts) {
            this.cycleNotificationTimeouts.forEach(timeout => clearTimeout(timeout));
            this.cycleNotificationTimeouts = [];
        }
        
        alert('Svi podaci su obrisani. Aplikacija je resetovana na početno stanje.');
    }
};

