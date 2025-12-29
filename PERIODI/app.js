// Periodi - Menstrual Cycle Tracking App
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

        // Set default date for symptom input
        document.getElementById('symptom-date').valueAsDate = new Date();

        // Schedule cycle notifications
        this.scheduleCycleNotifications();
    }

    // Local Storage Management
    loadData() {
        const cycles = localStorage.getItem('periodi_cycles');
        const symptoms = localStorage.getItem('periodi_symptoms');
        const settings = localStorage.getItem('periodi_settings');
        const reminders = localStorage.getItem('periodi_reminders');

        if (cycles) this.cycles = JSON.parse(cycles);
        if (symptoms) this.symptoms = JSON.parse(symptoms);
        if (settings) this.settings = { ...this.settings, ...JSON.parse(settings) };
        if (reminders) this.reminders = JSON.parse(reminders);
    }

    saveData() {
        localStorage.setItem('periodi_cycles', JSON.stringify(this.cycles));
        localStorage.setItem('periodi_symptoms', JSON.stringify(this.symptoms));
        localStorage.setItem('periodi_settings', JSON.stringify(this.settings));
        localStorage.setItem('periodi_reminders', JSON.stringify(this.reminders));
    }

    // Event Listeners
    setupEventListeners() {
        // Tab Navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        // Dashboard Actions
        document.getElementById('start-cycle-btn').addEventListener('click', () => this.showCycleModal());
        document.getElementById('log-period-btn').addEventListener('click', () => this.showCycleModal());
        document.getElementById('log-symptoms-btn').addEventListener('click', () => this.switchTab('symptoms'));
        document.getElementById('add-reminder-btn').addEventListener('click', () => this.showReminderModal());

        // Calendar Navigation
        document.getElementById('prev-month').addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('next-month').addEventListener('click', () => this.changeMonth(1));

        // Modals
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        // Cycle Modal
        document.getElementById('save-cycle-btn').addEventListener('click', () => this.saveCycle());

        // Symptoms
        document.getElementById('save-symptoms-btn').addEventListener('click', () => this.saveSymptoms());
        document.querySelectorAll('.form-range').forEach(range => {
            range.addEventListener('input', (e) => this.updateRangeValue(e.target));
        });

        // Settings
        document.getElementById('save-settings-btn').addEventListener('click', () => this.saveSettings());
        document.getElementById('export-data-btn').addEventListener('click', () => this.exportData());
        document.getElementById('clear-data-btn').addEventListener('click', () => this.clearAllData());

        // Reminder Modal
        document.getElementById('save-reminder-btn').addEventListener('click', () => this.saveReminder());

        // FAB
        document.getElementById('fab').addEventListener('click', () => this.showQuickActions());
    }

    // Tab Management
    switchTab(tabName) {
        document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    // Dashboard
    updateDashboard() {
        this.updateCycleStatus();
        this.updatePredictions();
        this.updateStatistics();
    }

    updateCycleStatus() {
        const statusEl = document.getElementById('cycle-status');
        const progressEl = document.getElementById('cycle-progress');
        const progressFill = document.getElementById('progress-fill');
        const activeCycle = this.getActiveCycle();

        if (activeCycle) {
            const startDate = new Date(activeCycle.startDate);
            const today = new Date();
            const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
            const phase = this.getCyclePhase(daysDiff);
            const progressPercent = Math.min((daysDiff / activeCycle.length) * 100, 100);

            statusEl.innerHTML = `
                <div class="cycle-phase">${phase}</div>
                <div class="cycle-days">Dan ${daysDiff} od ${activeCycle.length}</div>
            `;

            progressEl.style.display = 'block';
            progressFill.style.width = `${progressPercent}%`;

            // Color progress bar based on phase
            if (daysDiff <= activeCycle.periodLength) {
                progressFill.style.background = 'var(--error-gradient)';
            } else if (daysDiff >= 14 && daysDiff <= 16) {
                progressFill.style.background = 'var(--success-gradient)';
            } else {
                progressFill.style.background = 'var(--primary-gradient)';
            }
        } else {
            statusEl.innerHTML = `
                <div class="cycle-phase">Nema aktivnog ciklusa</div>
                <div class="cycle-days">Dan 0</div>
            `;
            progressEl.style.display = 'none';
        }
    }

    updatePredictions() {
        const nextPeriodEl = document.getElementById('next-period');
        const daysUntilEl = document.getElementById('days-until');

        const nextPeriod = this.predictNextPeriod();
        if (nextPeriod) {
            const daysUntil = Math.ceil((nextPeriod - new Date()) / (1000 * 60 * 60 * 24));

            nextPeriodEl.textContent = nextPeriod.toLocaleDateString('sr-RS');

            if (daysUntil > 0) {
                daysUntilEl.textContent = `${daysUntil} dana`;
                daysUntilEl.className = 'days-count';
            } else if (daysUntil === 0) {
                daysUntilEl.textContent = 'Danas!';
                daysUntilEl.className = 'days-count today';
            } else {
                daysUntilEl.textContent = 'Prošlo';
                daysUntilEl.className = 'days-count past';
            }
        } else {
            nextPeriodEl.textContent = 'Nije izračunato';
            daysUntilEl.textContent = '-';
        }
    }

    updateStatistics() {
        const avgCycleEl = document.getElementById('avg-cycle-length');
        const avgPeriodEl = document.getElementById('avg-period-length');
        const totalCyclesEl = document.getElementById('total-cycles');

        if (this.cycles.length > 0) {
            const avgCycle = this.cycles.reduce((sum, cycle) => sum + cycle.length, 0) / this.cycles.length;
            const avgPeriod = this.cycles.reduce((sum, cycle) => sum + cycle.periodLength, 0) / this.cycles.length;

            this.animateCounter(avgCycleEl, Math.round(avgCycle), ' dana');
            this.animateCounter(avgPeriodEl, Math.round(avgPeriod), ' dana');
            this.animateCounter(totalCyclesEl, this.cycles.length, '');
        }
    }

    animateCounter(element, target, suffix = '') {
        const current = parseInt(element.textContent) || 0;
        const increment = target > current ? 1 : -1;
        const timer = setInterval(() => {
            element.textContent = current + suffix;
            if (current === target) {
                clearInterval(timer);
            }
            current += increment;
        }, 50);
    }

    // Cycle Management
    getActiveCycle() {
        return this.cycles.find(cycle => !cycle.endDate);
    }

    getCyclePhase(day) {
        const cycleLength = this.settings.cycleLength;
        const periodLength = this.settings.periodLength;

        if (day <= periodLength) return 'Menstruacija';
        if (day >= 14 && day <= 16) return 'Ovulacija';
        if (day >= 10 && day <= 18) return 'Plodni period';
        if (day > periodLength && day < cycleLength - 7) return 'Folikularna faza';
        return 'Lutealna faza';
    }

    predictNextPeriod() {
        if (this.cycles.length === 0) return null;

        const lastCycle = this.cycles[this.cycles.length - 1];
        if (!lastCycle.endDate) return null;

        const lastEndDate = new Date(lastCycle.endDate);
        const avgCycleLength = this.cycles.reduce((sum, cycle) => sum + cycle.length, 0) / this.cycles.length;

        return new Date(lastEndDate.getTime() + avgCycleLength * 24 * 60 * 60 * 1000);
    }

    showCycleModal() {
        const modal = document.getElementById('cycle-modal');
        const today = new Date().toISOString().split('T')[0];

        document.getElementById('cycle-start-date').value = today;
        document.getElementById('cycle-duration').value = this.settings.cycleLength;

        modal.classList.add('show');
    }

            saveCycle() {
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
            }

    // Calendar
    renderCalendar() {
        const calendarDays = document.getElementById('calendar-days');
        const monthYear = document.getElementById('current-month-year');

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        monthYear.textContent = `${this.getMonthName(month)} ${year}`;

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay() + 1);

        calendarDays.innerHTML = '';

        for (let i = 0; i < 42; i++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'day';
            dayEl.textContent = startDate.getDate();

            // Mark current month
            if (startDate.getMonth() === month) {
                dayEl.classList.add('current-month');
            } else {
                dayEl.classList.add('other-month');
            }

            // Mark today
            if (this.isToday(startDate)) {
                dayEl.classList.add('today');
            }

            // Mark period days
            if (this.isPeriodDay(startDate)) {
                dayEl.classList.add('period');
            }

            // Mark ovulation day
            if (this.isOvulationDay(startDate)) {
                dayEl.classList.add('ovulation');
            }

            // Mark fertile days
            if (this.isFertileDay(startDate)) {
                dayEl.classList.add('fertile');
            }

            calendarDays.appendChild(dayEl);
            startDate.setDate(startDate.getDate() + 1);
        }
    }

    changeMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.renderCalendar();
    }

    getMonthName(month) {
        const months = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
                       'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];
        return months[month];
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    isPeriodDay(date) {
        return this.cycles.some(cycle => {
            const startDate = new Date(cycle.startDate);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + cycle.periodLength - 1);

            return date >= startDate && date <= endDate;
        });
    }

    isOvulationDay(date) {
        return this.cycles.some(cycle => {
            const startDate = new Date(cycle.startDate);
            const ovulationDate = new Date(startDate);
            ovulationDate.setDate(startDate.getDate() + 14); // Assuming ovulation on day 14

            return date.toDateString() === ovulationDate.toDateString();
        });
    }

    isFertileDay(date) {
        return this.cycles.some(cycle => {
            const startDate = new Date(cycle.startDate);
            const fertileStart = new Date(startDate);
            fertileStart.setDate(startDate.getDate() + 10); // Fertile window starts ~10 days after period
            const fertileEnd = new Date(startDate);
            fertileEnd.setDate(startDate.getDate() + 16); // Fertile window ends ~16 days after period

            return date >= fertileStart && date <= fertileEnd;
        });
    }

    // Symptoms
    updateRangeValue(range) {
        const valueEl = document.getElementById(range.id.replace('-level', '-value'));
        valueEl.textContent = range.value;
    }

    saveSymptoms() {
        const date = document.getElementById('symptom-date').value;
        const energy = document.getElementById('energy-level').value;
        const mood = document.getElementById('mood-level').value;
        const pain = document.getElementById('pain-level').value;
        const libido = document.getElementById('libido-level').value;

        const additionalSymptoms = [];
        document.querySelectorAll('.symptoms-checklist input:checked').forEach(checkbox => {
            additionalSymptoms.push(checkbox.id.replace('symptom-', ''));
        });

        if (!date) {
            alert('Molimo izaberite datum.');
            return;
        }

        const symptomEntry = {
            id: Date.now(),
            date: date,
            energy: parseInt(energy),
            mood: parseInt(mood),
            pain: parseInt(pain),
            libido: parseInt(libido),
            additional: additionalSymptoms
        };

        // Remove existing entry for this date
        this.symptoms = this.symptoms.filter(s => s.date !== date);
        this.symptoms.push(symptomEntry);

        this.saveData();
        this.updateSymptomsDisplay();

        // Reset form
        document.getElementById('symptom-date').valueAsDate = new Date();
        document.querySelectorAll('.form-range').forEach(range => {
            range.value = 5;
            this.updateRangeValue(range);
        });
        document.querySelectorAll('.symptoms-checklist input').forEach(checkbox => {
            checkbox.checked = false;
        });

        alert('Simptomi su sačuvani!');
    }

    updateSymptomsDisplay() {
        const symptomsList = document.getElementById('symptoms-list');
        symptomsList.innerHTML = '';

        if (this.symptoms.length === 0) {
            symptomsList.innerHTML = '<p>Nema zabeleženih simptoma.</p>';
            return;
        }

        this.symptoms.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(symptom => {
            const entryEl = document.createElement('div');
            entryEl.className = 'symptom-entry';

            const date = new Date(symptom.date).toLocaleDateString('sr-RS');
            const additionalText = symptom.additional.length > 0 ?
                `<br>Dodatni simptomi: ${symptom.additional.join(', ')}` : '';

            entryEl.innerHTML = `
                <div class="symptom-date">${date}</div>
                <div class="symptom-details">
                    <div>Energija: ${symptom.energy}/10</div>
                    <div>Raspoloženje: ${symptom.mood}/10</div>
                    <div>Bol: ${symptom.pain}/10</div>
                    <div>Libido: ${symptom.libido}/10</div>
                    ${additionalText ? `<div>${additionalText}</div>` : ''}
                </div>
            `;

            symptomsList.appendChild(entryEl);
        });
    }

    // Settings
    loadSettings() {
        document.getElementById('cycle-length').value = this.settings.cycleLength;
        document.getElementById('period-length').value = this.settings.periodLength;
        document.getElementById('notify-period-start').checked = this.settings.notifications.periodStart;
        document.getElementById('notify-ovulation').checked = this.settings.notifications.ovulation;
        document.getElementById('notify-fertile-window').checked = this.settings.notifications.fertileWindow;
    }

            saveSettings() {
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
            }

    exportData() {
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
    }

    clearAllData() {
        if (confirm('Da li ste sigurni da želite obrisati sve podatke? Ova akcija se ne može poništiti.')) {
            this.cycles = [];
            this.symptoms = [];
            this.reminders = [];
            this.saveData();
            this.updateDashboard();
            this.renderCalendar();
            this.updateSymptomsDisplay();
            alert('Svi podaci su obrisani.');
        }
    }

    // Reminders
    showReminderModal() {
        const modal = document.getElementById('reminder-modal');
        modal.classList.add('show');
    }

    saveReminder() {
        const title = document.getElementById('reminder-title').value;
        const time = document.getElementById('reminder-time').value;
        const repeat = document.getElementById('reminder-repeat').value;

        if (!title || !time) {
            alert('Molimo popunite naslov i vreme podsetnika.');
            return;
        }

        const reminder = {
            id: Date.now(),
            title: title,
            time: time,
            repeat: repeat,
            active: true
        };

        this.reminders.push(reminder);
        this.saveData();

        // Schedule notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
            this.scheduleNotification(reminder);
        }

        this.closeModal();

        // Reset form
        document.getElementById('reminder-title').value = '';
        document.getElementById('reminder-time').value = '';
        document.getElementById('reminder-repeat').value = 'once';

        alert('Podsetnik je sačuvan!');
    }

    scheduleNotification(reminder) {
        const reminderTime = new Date(reminder.time);
        const now = new Date();

        if (reminderTime > now) {
            setTimeout(() => {
                new Notification('Periodi - Podsetnik', {
                    body: reminder.title,
                    icon: '/favicon.ico'
                });
            }, reminderTime - now);
        }
    }

    // Theme Management
    initTheme() {
        const savedTheme = localStorage.getItem('periodi_theme') || 'light';
        this.setTheme(savedTheme);

        document.getElementById('theme-toggle').addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('periodi_theme', theme);

        // Update theme toggle button
        const toggleBtn = document.getElementById('theme-toggle');
        if (theme === 'dark') {
            toggleBtn.title = 'Prebaci na svetlu temu';
        } else {
            toggleBtn.title = 'Prebaci na tamnu temu';
        }
    }

    // Quick Actions
    showQuickActions() {
        const activeCycle = this.getActiveCycle();
        let actions = [];

        if (!activeCycle) {
            actions = [
                { icon: 'fa-play', text: 'Počni ciklus', action: () => this.showCycleModal() },
                { icon: 'fa-notes-medical', text: 'Zabeleži simptome', action: () => this.switchTab('symptoms') }
            ];
        } else {
            actions = [
                { icon: 'fa-tint', text: 'Zabeleži menstruaciju', action: () => this.showCycleModal() },
                { icon: 'fa-notes-medical', text: 'Zabeleži simptome', action: () => this.switchTab('symptoms') },
                { icon: 'fa-bell', text: 'Dodaj podsetnik', action: () => this.showReminderModal() }
            ];
        }

        this.showQuickActionsModal(actions);
    }

    showQuickActionsModal(actions) {
        const modalHTML = `
            <div id="quick-actions-modal" class="modal">
                <div class="modal-content quick-actions-content">
                    <div class="modal-header">
                        <h3>Brze akcije</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="quick-actions-grid">
                            ${actions.map(action => `
                                <button class="quick-action-btn" data-action="${action.icon}">
                                    <i class="fas ${action.icon}"></i>
                                    <span>${action.text}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Add event listeners
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const actionIcon = btn.dataset.action;
                const action = actions.find(a => a.icon === actionIcon);
                if (action) action.action();
                this.closeModal();
                // Remove modal from DOM
                document.getElementById('quick-actions-modal').remove();
            });
        });

        document.querySelector('#quick-actions-modal .close-modal').addEventListener('click', () => {
            this.closeModal();
            document.getElementById('quick-actions-modal').remove();
        });

        // Show modal
        setTimeout(() => {
            document.getElementById('quick-actions-modal').classList.add('show');
        }, 10);
    }

    // Cycle Notifications
    scheduleCycleNotifications() {
        if (!('Notification' in window) || Notification.permission !== 'granted') {
            return;
        }

        // Clear existing cycle notifications
        if (this.cycleNotificationTimeouts) {
            this.cycleNotificationTimeouts.forEach(timeout => clearTimeout(timeout));
        }
        this.cycleNotificationTimeouts = [];

        const activeCycle = this.getActiveCycle();
        if (!activeCycle) return;

        const now = new Date();
        const startDate = new Date(activeCycle.startDate);

        // Schedule period start notification (if enabled)
        if (this.settings.notifications.periodStart) {
            const nextPeriodDate = this.predictNextPeriod();
            if (nextPeriodDate && nextPeriodDate > now) {
                const timeUntil = nextPeriodDate - now;
                const timeout = setTimeout(() => {
                    new Notification('Periodi - Početak Menstruacije', {
                        body: 'Vaša sledeća menstruacija počinje danas. Vodite računa o sebi!',
                        icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext y=".9em" font-size="90"%3E🩸%3C/text%3E%3C/svg%3E'
                    });
                }, timeUntil);
                this.cycleNotificationTimeouts.push(timeout);
            }
        }

        // Schedule ovulation notification (if enabled)
        if (this.settings.notifications.ovulation) {
            const ovulationDate = new Date(startDate);
            ovulationDate.setDate(startDate.getDate() + 14); // Day 14 is typically ovulation

            if (ovulationDate > now) {
                const timeUntil = ovulationDate - now;
                const timeout = setTimeout(() => {
                    new Notification('Periodi - Ovulacija', {
                        body: 'Danas je vaš dan ovulacije. Plodni period je aktivan!',
                        icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext y=".9em" font-size="90"%3E🌸%3C/text%3E%3C/svg%3E'
                    });
                }, timeUntil);
                this.cycleNotificationTimeouts.push(timeout);
            }
        }

        // Schedule fertile window notification (if enabled)
        if (this.settings.notifications.fertileWindow) {
            const fertileStartDate = new Date(startDate);
            fertileStartDate.setDate(startDate.getDate() + 10); // Fertile window starts around day 10

            if (fertileStartDate > now) {
                const timeUntil = fertileStartDate - now;
                const timeout = setTimeout(() => {
                    new Notification('Periodi - Plodni Period', {
                        body: 'Počinje vaš plodni period. Pratite svoje simptome!',
                        icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext y=".9em" font-size="90"%3E🌺%3C/text%3E%3C/svg%3E'
                    });
                }, timeUntil);
                this.cycleNotificationTimeouts.push(timeout);
            }
        }
    }

    // Update cycle notifications when settings change
    updateCycleNotifications() {
        this.scheduleCycleNotifications();
    }

    // Modal Management
    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('show'));
    }
}

// Request notification permission on load
if ('Notification' in window) {
    Notification.requestPermission();
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new PeriodTracker();
});
