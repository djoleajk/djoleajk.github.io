// Podsetnici

PeriodTracker.prototype.showReminderModal = function() {
    const modal = document.getElementById('reminder-modal');
    modal.classList.add('show');
};

PeriodTracker.prototype.saveReminder = function() {
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

    // Resetuj formular
    document.getElementById('reminder-title').value = '';
    document.getElementById('reminder-time').value = '';
    document.getElementById('reminder-repeat').value = 'once';

    alert('Podsetnik je sačuvan!');
};

PeriodTracker.prototype.scheduleNotification = function(reminder) {
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
};

