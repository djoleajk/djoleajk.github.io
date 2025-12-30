// Upravljanje Lokalnim Skladištem
PeriodTracker.prototype.loadData = function() {
    const cycles = localStorage.getItem('periodi_cycles');
    const symptoms = localStorage.getItem('periodi_symptoms');
    const settings = localStorage.getItem('periodi_settings');
    const reminders = localStorage.getItem('periodi_reminders');

    if (cycles) this.cycles = JSON.parse(cycles);
    if (symptoms) this.symptoms = JSON.parse(symptoms);
    if (settings) this.settings = { ...this.settings, ...JSON.parse(settings) };
    if (reminders) this.reminders = JSON.parse(reminders);
};

PeriodTracker.prototype.saveData = function() {
    localStorage.setItem('periodi_cycles', JSON.stringify(this.cycles));
    localStorage.setItem('periodi_symptoms', JSON.stringify(this.symptoms));
    localStorage.setItem('periodi_settings', JSON.stringify(this.settings));
    localStorage.setItem('periodi_reminders', JSON.stringify(this.reminders));
};

