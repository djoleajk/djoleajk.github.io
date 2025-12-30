// Kalendar funkcionalnost

PeriodTracker.prototype.renderCalendar = function() {
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

        // Označi trenutni mesec
        if (startDate.getMonth() === month) {
            dayEl.classList.add('current-month');
        } else {
            dayEl.classList.add('other-month');
        }

        // Označi danas
        if (this.isToday(startDate)) {
            dayEl.classList.add('today');
        }

        // Označi dane menstruacije
        if (this.isPeriodDay(startDate)) {
            dayEl.classList.add('period');
        }

        // Označi dan ovulacije
        if (this.isOvulationDay(startDate)) {
            dayEl.classList.add('ovulation');
        }

        // Označi plodne dane
        if (this.isFertileDay(startDate)) {
            dayEl.classList.add('fertile');
        }

        calendarDays.appendChild(dayEl);
        startDate.setDate(startDate.getDate() + 1);
    }
};

PeriodTracker.prototype.changeMonth = function(delta) {
    this.currentDate.setMonth(this.currentDate.getMonth() + delta);
    this.renderCalendar();
};

PeriodTracker.prototype.getMonthName = function(month) {
    const months = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
                   'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];
    return months[month];
};

PeriodTracker.prototype.isToday = function(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
};

PeriodTracker.prototype.isPeriodDay = function(date) {
    return this.cycles.some(cycle => {
        const startDate = new Date(cycle.startDate);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + cycle.periodLength - 1);

        return date >= startDate && date <= endDate;
    });
};

PeriodTracker.prototype.isOvulationDay = function(date) {
    return this.cycles.some(cycle => {
        const startDate = new Date(cycle.startDate);
        const ovulationDate = new Date(startDate);
        ovulationDate.setDate(startDate.getDate() + 14); // Pretpostavljamo ovulaciju na danu 14

        return date.toDateString() === ovulationDate.toDateString();
    });
};

PeriodTracker.prototype.isFertileDay = function(date) {
    return this.cycles.some(cycle => {
        const startDate = new Date(cycle.startDate);
        const fertileStart = new Date(startDate);
        fertileStart.setDate(startDate.getDate() + 10); // Plodni period počinje ~10 dana nakon menstruacije
        const fertileEnd = new Date(startDate);
        fertileEnd.setDate(startDate.getDate() + 16); // Plodni period završava se ~16 dana nakon menstruacije

        return date >= fertileStart && date <= fertileEnd;
    });
};

