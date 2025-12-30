// Notifikacije za Ciklus

PeriodTracker.prototype.scheduleCycleNotifications = function() {
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
                    body: 'Danas je vaš dan ovulacije. Vaš plodni period je aktivan!',
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
};

// Ažuriraj notifikacije za ciklus kada se podešavanja promene
PeriodTracker.prototype.updateCycleNotifications = function() {
    this.scheduleCycleNotifications();
};

