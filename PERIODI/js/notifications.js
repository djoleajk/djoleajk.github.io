// Modul za notifikacije
PeriodTracker.prototype.requestNotificationPermission = function() {
    if (!('Notification' in window)) {
        this.showWarning('Tvoj pregledač ne podržava notifikacije.');
        return;
    }
    
    if (Notification.permission === 'granted') {
        this.showInfo('Dozvola za notifikacije je već data.');
        this.updateNotificationStatus();
        this.scheduleCycleNotifications();
        return;
    }
    
    if (Notification.permission === 'denied') {
        this.showWarning('Dozvola za notifikacije je odbijena. Molimo te omogući notifikacije u podešavanjima pregledača.');
        this.updateNotificationStatus();
        return;
    }
    
    Notification.requestPermission().then(permission => {
        this.updateNotificationStatus();
        if (permission === 'granted') {
            this.showSuccess('Dozvola za notifikacije je data!');
            this.scheduleCycleNotifications();
        } else {
            this.showWarning('Dozvola za notifikacije je odbijena.');
        }
    });
};

PeriodTracker.prototype.updateNotificationStatus = function() {
    const statusEl = document.getElementById('notificationStatus');
    if (!statusEl) return;
    
    if (!('Notification' in window)) {
        statusEl.innerHTML = '<span class="badge bg-secondary">Nije podržano</span>';
        return;
    }
    
    const permission = Notification.permission;
    if (permission === 'granted') {
        statusEl.innerHTML = '<span class="badge bg-success"><i class="fas fa-check-circle"></i> Omogućeno</span>';
    } else if (permission === 'denied') {
        statusEl.innerHTML = '<span class="badge bg-danger"><i class="fas fa-times-circle"></i> Onemogućeno</span>';
    } else {
        // Ako je default (nije još tražena dozvola), prikaži kao "Omogućeno" sa napomenom
        // da će se tražiti dozvola kada korisnik klikne na dugme
        statusEl.innerHTML = '<span class="badge bg-success"><i class="fas fa-check-circle"></i> Omogućeno</span>';
    }
};

PeriodTracker.prototype.scheduleCycleNotifications = function() {
    if (Notification.permission !== 'granted') {
        return;
    }
    
    // Obriši stare zakazane notifikacije
    this.clearScheduledNotifications();
    
    // Zakazi notifikacije za ciklus
    const activeCycle = this.getActiveCycle();
    if (!activeCycle) return;
    
    const nextPeriod = this.predictNextPeriod();
    const ovulation = this.predictOvulation();
    const fertileWindow = this.predictFertileWindow();
    
    // Notifikacija za početak menstruacije
    if (this.settings.notifications.periodStart && nextPeriod) {
        this.scheduleNotificationForDate(
            nextPeriod,
            9, // 9:00
            'Početak Menstruacije',
            'Očekuje se početak menstruacije danas.',
            'period-start'
        );
    }
    
    // Notifikacija za ovulaciju
    if (this.settings.notifications.ovulation && ovulation) {
        this.scheduleNotificationForDate(
            ovulation,
            9, // 9:00
            'Ovulacija',
            'Danas je dan ovulacije.',
            'ovulation'
        );
    }
    
    // Notifikacija za plodne dane
    if (this.settings.notifications.fertileWindow && fertileWindow) {
        this.scheduleNotificationForDate(
            fertileWindow.start,
            9, // 9:00
            'Plodni Dani',
            `Plodni period počinje danas i traje do ${this.formatDateShort(fertileWindow.end)}.`,
            'fertile-window'
        );
    }
    
    // Zakazi podsetnike
    if (this.reminders && this.reminders.length > 0) {
        this.reminders.forEach(reminder => {
            const reminderDateTime = new Date(reminder.date);
            const [hours, minutes] = reminder.time.split(':');
            reminderDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            
            this.scheduleNotificationForDate(
                reminderDateTime,
                parseInt(hours),
                reminder.title,
                'Podsetnik',
                `reminder-${reminder.id}`
            );
        });
    }
    
    // Proveri dnevno da li treba prikazati notifikacije
    this.startDailyNotificationCheck();
};

PeriodTracker.prototype.scheduleNotificationForDate = function(date, hour, title, body, tag) {
    const notificationDate = new Date(date);
    notificationDate.setHours(hour, 0, 0, 0);
    const now = new Date();
    
    if (notificationDate <= now) {
        return; // Datum je prošao
    }
    
    // Sačuvaj u localStorage za proveru
    const scheduledNotifications = JSON.parse(localStorage.getItem('periodi_scheduledNotifications') || '[]');
    scheduledNotifications.push({
        date: notificationDate.toISOString(),
        title: title,
        body: body,
        tag: tag
    });
    localStorage.setItem('periodi_scheduledNotifications', JSON.stringify(scheduledNotifications));
};

PeriodTracker.prototype.clearScheduledNotifications = function() {
    localStorage.removeItem('periodi_scheduledNotifications');
    if (this.notificationCheckInterval) {
        clearInterval(this.notificationCheckInterval);
    }
};

PeriodTracker.prototype.startDailyNotificationCheck = function() {
    // Proveri svakih 5 minuta da li treba prikazati notifikacije
    if (this.notificationCheckInterval) {
        clearInterval(this.notificationCheckInterval);
    }
    
    this.checkScheduledNotifications();
    
    this.notificationCheckInterval = setInterval(() => {
        this.checkScheduledNotifications();
    }, 5 * 60 * 1000); // 5 minuta
};

PeriodTracker.prototype.checkScheduledNotifications = function() {
    if (Notification.permission !== 'granted') {
        return;
    }
    
    const scheduledNotifications = JSON.parse(localStorage.getItem('periodi_scheduledNotifications') || '[]');
    const now = new Date();
    const toShow = [];
    const toKeep = [];
    
    scheduledNotifications.forEach(notif => {
        const notifDate = new Date(notif.date);
        const timeDiff = now - notifDate;
        
        // Ako je prošlo između 0 i 30 minuta, prikaži notifikaciju
        if (timeDiff >= 0 && timeDiff < 30 * 60 * 1000) {
            toShow.push(notif);
        } else if (notifDate > now) {
            // Ako još nije vreme, zadrži
            toKeep.push(notif);
        }
        // Ako je prošlo više od 30 minuta, obriši
    });
    
    // Prikaži notifikacije koje treba prikazati
    toShow.forEach(notif => {
        this.showNotification(notif.title, notif.body, { tag: notif.tag });
    });
    
    // Sačuvaj preostale notifikacije
    localStorage.setItem('periodi_scheduledNotifications', JSON.stringify(toKeep));
};

PeriodTracker.prototype.showNotification = function(title, body, options = {}) {
    if (Notification.permission !== 'granted') {
        return;
    }
    
    const notification = new Notification(title, {
        body: body,
        icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext y=".9em" font-size="90"%3E🩸%3C/text%3E%3C/svg%3E',
        badge: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext y=".9em" font-size="90"%3E🩸%3C/text%3E%3C/svg%3E',
        tag: options.tag || 'periodi-notification',
        requireInteraction: false,
        silent: false
    });
    
    notification.onclick = function() {
        window.focus();
        notification.close();
    };
    
    // Automatski zatvori nakon 10 sekundi
    setTimeout(() => {
        notification.close();
    }, 10000);
};
