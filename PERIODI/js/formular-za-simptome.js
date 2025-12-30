// Modul za Formular za Simptome
class FormularZaSimptome {
    constructor(tracker) {
        this.tracker = tracker;
        this.init();
    }

    init() {
        // Sačekaj da se DOM učita pre dodavanja event listener-a
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupForm());
        } else {
            this.setupForm();
        }
    }

    setupForm() {
        // Dodaj event listener za dugme za čuvanje simptoma
        const saveBtn = document.getElementById('save-symptoms-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveSymptoms());
        }

        // Dodaj event listener-e za range input-e
        document.querySelectorAll('.form-range').forEach(range => {
            range.addEventListener('input', (e) => this.updateRangeValue(e.target));
        });

        // Postavi podrazumevani datum na danas
        const symptomDate = document.getElementById('symptom-date');
        if (symptomDate) {
            symptomDate.valueAsDate = new Date();
        }
    }

    updateRangeValue(range) {
        const valueEl = document.getElementById(range.id.replace('-level', '-value'));
        if (valueEl) {
            valueEl.textContent = range.value;
        }
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

        // Ukloni postojeći unos za ovaj datum
        this.tracker.symptoms = this.tracker.symptoms.filter(s => s.date !== date);
        this.tracker.symptoms.push(symptomEntry);

        this.tracker.saveData();
        this.tracker.updateSymptomsDisplay();

        // Resetuj formular
        this.resetForm();

        alert('Simptomi su sačuvani!');
    }

    resetForm() {
        // Resetuj datum na danas
        const symptomDate = document.getElementById('symptom-date');
        if (symptomDate) {
            symptomDate.valueAsDate = new Date();
        }

        // Resetuj range input-e na podrazumevane vrednosti
        document.querySelectorAll('.form-range').forEach(range => {
            if (range.id === 'pain-level') {
                range.value = 1;
            } else {
                range.value = 5;
            }
            this.updateRangeValue(range);
        });

        // Resetuj checkbox-e
        document.querySelectorAll('.symptoms-checklist input').forEach(checkbox => {
            checkbox.checked = false;
        });
    }
}

