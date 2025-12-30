// Dashboard funkcionalnost

// Pregled
PeriodTracker.prototype.updateDashboard = function() {
    this.updateCycleStatus();
    this.updatePredictions();
    this.updateStatistics();
    // this.updateMentalState(); // Uklonjeno
};

PeriodTracker.prototype.updateCycleStatus = function() {
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

        // Oboji traku napretka na osnovu faze
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
};

PeriodTracker.prototype.updatePredictions = function() {
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
};

PeriodTracker.prototype.updateStatistics = function() {
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
    
    // Ažuriraj statistiku simptoma
    this.updateSymptomsStatistics();
};

PeriodTracker.prototype.updateSymptomsStatistics = function() {
    if (this.symptoms.length === 0) {
        // Sakrij ili resetuj statistiku simptoma ako ih nema
        return;
    }

    // Izračunaj proseke
    const totalSymptoms = this.symptoms.length;
    const avgEnergy = this.symptoms.reduce((sum, s) => sum + (s.energy || 0), 0) / totalSymptoms;
    const avgMood = this.symptoms.reduce((sum, s) => sum + (s.mood || 0), 0) / totalSymptoms;
    const avgPain = this.symptoms.reduce((sum, s) => sum + (s.pain || 0), 0) / totalSymptoms;
    const avgLibido = this.symptoms.reduce((sum, s) => sum + (s.libido || 0), 0) / totalSymptoms;

    // Prebroj dodatne simptome
    const symptomCounts = {};
    this.symptoms.forEach(symptom => {
        if (symptom.additional && symptom.additional.length > 0) {
            symptom.additional.forEach(symptomKey => {
                const serbianName = this.getSymptomNameInSerbian(symptomKey);
                symptomCounts[serbianName] = (symptomCounts[serbianName] || 0) + 1;
            });
        }
    });

    // Pronađi najčešće simptome
    const mostCommonSymptoms = Object.entries(symptomCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, count]) => `${name} (${count}x)`);

    // Ažuriraj elemente interfejsa ako postoje
    const avgEnergyEl = document.getElementById('avg-energy');
    const avgMoodEl = document.getElementById('avg-mood');
    const avgPainEl = document.getElementById('avg-pain');
    const avgLibidoEl = document.getElementById('avg-libido');
    const totalSymptomsEl = document.getElementById('total-symptoms');
    const commonSymptomsEl = document.getElementById('common-symptoms');

    if (avgEnergyEl) {
        avgEnergyEl.textContent = `${avgEnergy.toFixed(1)}/10`;
    }
    if (avgMoodEl) {
        avgMoodEl.textContent = `${avgMood.toFixed(1)}/10`;
    }
    if (avgPainEl) {
        avgPainEl.textContent = `${avgPain.toFixed(1)}/10`;
    }
    if (avgLibidoEl) {
        avgLibidoEl.textContent = `${avgLibido.toFixed(1)}/10`;
    }
    if (totalSymptomsEl) {
        totalSymptomsEl.textContent = totalSymptoms;
    }
    if (commonSymptomsEl) {
        commonSymptomsEl.textContent = mostCommonSymptoms.length > 0 
            ? mostCommonSymptoms.join(', ') 
            : 'Nema dodatnih simptoma';
    }
};

PeriodTracker.prototype.animateCounter = function(element, target, suffix = '') {
    const current = parseInt(element.textContent) || 0;
    const increment = target > current ? 1 : -1;
    const timer = setInterval(() => {
        element.textContent = current + suffix;
        if (current === target) {
            clearInterval(timer);
        }
        current += increment;
    }, 50);
};

