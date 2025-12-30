// Simptomi funkcionalnost

PeriodTracker.prototype.updateRangeValue = function(range) {
    const valueEl = document.getElementById(range.id.replace('-level', '-value'));
    valueEl.textContent = range.value;
};

PeriodTracker.prototype.saveSymptoms = function() {
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
    this.symptoms = this.symptoms.filter(s => s.date !== date);
    this.symptoms.push(symptomEntry);

    this.saveData();
    this.updateSymptomsDisplay();

    // Resetuj formular
    document.getElementById('symptom-date').valueAsDate = new Date();
    document.querySelectorAll('.form-range').forEach(range => {
        range.value = 5;
        this.updateRangeValue(range);
    });
    document.querySelectorAll('.symptoms-checklist input').forEach(checkbox => {
        checkbox.checked = false;
    });

    alert('Simptomi su sačuvani!');
};

PeriodTracker.prototype.getSymptomNameInSerbian = function(symptomKey) {
    const symptomMap = {
        'cramps': 'Grčevi',
        'headache': 'Glavobolja',
        'nausea': 'Mučnina',
        'bloating': 'Nadutost',
        'breast-tenderness': 'Osetljivost grudi',
        'acne': 'Akne'
    };
    return symptomMap[symptomKey] || symptomKey;
};

PeriodTracker.prototype.generateSurveySummary = async function(symptomEntry) {
    try {
        const answers = symptomEntry.surveyAnswers || [];
        const questions = symptomEntry.surveyQuestions || [];
        
        if (!answers.length || !questions.length) {
            return null;
        }

        // Kreiraj kontekst iz odgovora
        let context = '';
        answers.forEach((answer, index) => {
            if (questions[index]) {
                const questionText = questions[index].question;
                let answerText = '';
                
                if (Array.isArray(answer)) {
                    answerText = answer.join(', ');
                } else {
                    answerText = answer.toString();
                }
                
                if (answerText) {
                    context += `${questionText} ${answerText}. `;
                }
            }
        });

        const prompt = `Na osnovu sledećih odgovora iz ankete za praćenje menstrualnog ciklusa, napiši kratak sažetak u jednoj ili dve rečenice na čistom, gramatički ispravnom srpskom jeziku ekavskom dijalektu (latinica).

Odgovori:
${context}

Sažetak treba da bude:
- Na čistom, gramatički ispravnom srpskom jeziku ekavskom dijalektu (latinica). Koristi EKAVICU - npr. "lepo", "deo", "mleko", "srećan", "želeo", "hteo". NE koristi ijekavicu (lijepo, dio, mlijeko, sretan, želio, htio).
- GRAMATIČKI ISPRAVAN - koristi pravilne padeže, glagolske oblike i sintaksu srpskog jezika
- Prirodan i razgovoran tekst na srpskom jeziku
- U jednoj ili dve rečenice sa pravilnom interpunkcijom
- Bez prepisivanja pojmova iz ankete (npr. umesto "energija 7/10" napiši "osećaš se energično" ili "imaš dovoljno energije")
- Upućen ženskoj osobi u drugom licu jednine (koristi "ti", "tebe", "tvoj", "tvoja", "tvoje", "si", "imaš", "osećaš", "osećaš se")
- Fokusiran na opšte stanje i osećanja, ne na brojeve i tehničke pojmove
- NE koristi engleske reči ili fraze. SVE mora biti na srpskom jeziku
- Koristi pravilne srpske glagolske oblike i padeže (npr. "osećaš se", "imaš", "želiš", "bi", "si")

Primeri gramatički ispravnih rečenica:
- "Danas se osećaš energično i imaš dovoljno snage za sve aktivnosti."
- "Osećaš se umorno i pod stresom, što utiče na tvoje raspoloženje."
- "Tvoje emocionalno stanje je uravnoteženo, iako osećaš određenu napetost."

Vrati samo sažetak bez dodatnih objašnjenja.`;

        const response = await fetch(this.groqApiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.groqApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    {
                        role: 'system',
                        content: 'Ti si asistent za praćenje menstrualnog ciklusa. Odgovori samo sa kratkim sažetkom na čistom, gramatički ispravnom srpskom jeziku ekavskom dijalektu (latinica), u jednoj ili dve rečenice, upućen ženskoj osobi u drugom licu jednine. Koristi EKAVICU - npr. "lepo", "deo", "mleko", "srećan", "želeo", "hteo". NE koristi ijekavicu (lijepo, dio, mlijeko, sretan, želio, htio). OBAVEZNO koristi gramatički ispravne srpske rečenice sa pravilnim padežima, glagolskim oblicima i sintaksom. Koristi pravilne glagolske oblike kao što su "osećaš se", "imaš", "želiš", "bi", "si". OBAVEZNO koristi pravilne padeže: "tvoje stanje" (ne "tvoj stanje"), "tvoja energija" (ne "tvoj energija"), "tvoje raspoloženje" (ne "tvoj raspoloženje"), "imaš energiju" (ne "imaš energija"), "imaš dovoljno energije" (ne "imaš dovoljno energija"), "utiče na tvoje raspoloženje" (ne "utiče na tvoj raspoloženje").'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 150
            })
        });

        if (!response.ok) {
            throw new Error(`Greška Groq API-ja: ${response.status}`);
        }

        const data = await response.json();
        let summary = data.choices[0].message.content.trim();
        
        // Ispravi gramatičke greške u sažetku
        summary = this.fixGrammarErrors(summary);
        
        return summary;
    } catch (error) {
        console.error('Greška pri generisanju sažetka ankete:', error);
        return null;
    }
};

PeriodTracker.prototype.updateSymptomsDisplay = function() {
    const symptomsList = document.getElementById('symptoms-list');
    symptomsList.innerHTML = '';

    if (this.symptoms.length === 0) {
        symptomsList.innerHTML = '<p>Nema zabeleženih simptoma.</p>';
        this.updateSymptomsStatistics();
        return;
    }

    this.symptoms.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(symptom => {
        const cardEl = document.createElement('div');
        cardEl.className = 'symptom-card';

        // Formatiraj datum jednostavno na srpskom
        const dateObj = new Date(symptom.date);
        const day = dateObj.getDate();
        const monthNames = ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 
                           'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'];
        const month = monthNames[dateObj.getMonth()];
        const year = dateObj.getFullYear();
        const date = `${day}. ${month} ${year}.`;
        
        // Prevedi dodatne simptome na srpski
        const additionalSymptoms = symptom.additional.map(s => this.getSymptomNameInSerbian(s));
        const additionalText = additionalSymptoms.length > 0 ?
            `<div class="symptom-additional"><strong>Dodatni simptomi:</strong> ${additionalSymptoms.join(', ')}</div>` : '';

        // Prikaži sažetak ako postoji
        const summaryText = symptom.summary ?
            `<div class="symptom-summary">${symptom.summary}</div>` : '';
        

        cardEl.innerHTML = `
            <div class="symptom-card-header">
                <div class="symptom-card-date">${date}</div>
                ${symptom.source === 'groq_survey' ? '<span class="symptom-badge">Anketa</span>' : ''}
            </div>
            <div class="symptom-card-body">
                ${summaryText}
                <div class="symptom-card-details">
                    <div class="symptom-stat">
                        <span class="symptom-stat-label">Energija</span>
                        <span class="symptom-stat-value">${symptom.energy}/10</span>
                    </div>
                    <div class="symptom-stat">
                        <span class="symptom-stat-label">Raspoloženje</span>
                        <span class="symptom-stat-value">${symptom.mood}/10</span>
                    </div>
                    <div class="symptom-stat">
                        <span class="symptom-stat-label">Bol</span>
                        <span class="symptom-stat-value">${symptom.pain}/10</span>
                    </div>
                    <div class="symptom-stat">
                        <span class="symptom-stat-label">Libido</span>
                        <span class="symptom-stat-value">${symptom.libido}/10</span>
                    </div>
                </div>
                ${additionalText}
            </div>
        `;

        symptomsList.appendChild(cardEl);
    });
    
    // Ažuriraj statistiku nakon prikazivanja simptoma
    this.updateSymptomsStatistics();
};

