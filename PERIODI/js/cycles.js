// Upravljanje Ciklusima

PeriodTracker.prototype.getActiveCycle = function() {
    return this.cycles.find(cycle => !cycle.endDate);
};

PeriodTracker.prototype.getCyclePhase = function(day) {
    const cycleLength = this.settings.cycleLength;
    const periodLength = this.settings.periodLength;

    if (day <= periodLength) return 'Menstruacija';
    if (day >= 14 && day <= 16) return 'Ovulacija';
    if (day >= 10 && day <= 18) return 'Plodni period';
    if (day > periodLength && day < cycleLength - 7) return 'Folikularna faza';
    return 'Lutealna faza';
};

PeriodTracker.prototype.predictNextPeriod = function() {
    if (this.cycles.length === 0) return null;

    const lastCycle = this.cycles[this.cycles.length - 1];
    if (!lastCycle.endDate) return null;

    const lastEndDate = new Date(lastCycle.endDate);
    const avgCycleLength = this.cycles.reduce((sum, cycle) => sum + cycle.length, 0) / this.cycles.length;

    return new Date(lastEndDate.getTime() + avgCycleLength * 24 * 60 * 60 * 1000);
};

PeriodTracker.prototype.showCycleModal = function() {
    const modal = document.getElementById('cycle-modal');
    const today = new Date().toISOString().split('T')[0];

    document.getElementById('cycle-start-date').value = today;
    document.getElementById('cycle-duration').value = this.settings.cycleLength;

    modal.classList.add('show');
};

PeriodTracker.prototype.saveCycle = function() {
    const startDate = document.getElementById('cycle-start-date').value;
    const duration = parseInt(document.getElementById('cycle-duration').value);

    if (!startDate) {
        alert('Molimo izaberite datum početka ciklusa.');
        return;
    }

    const newCycle = {
        id: Date.now(),
        startDate: startDate,
        length: duration,
        periodLength: this.settings.periodLength,
        endDate: null
    };

    this.cycles.push(newCycle);
    this.saveData();
    this.updateDashboard();
    this.renderCalendar();
    this.updateCycleNotifications();
    this.closeModal();
};

PeriodTracker.prototype.getCurrentCycleDay = function() {
    const activeCycle = this.getActiveCycle();
    if (!activeCycle) return null;
    
    const startDate = new Date(activeCycle.startDate);
    const today = new Date();
    const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
    return daysDiff;
};

