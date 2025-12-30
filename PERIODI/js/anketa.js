// Modul za Groq Anketu
class Anketa {
    constructor(tracker) {
        this.tracker = tracker;
        
        // Konfiguracija Groq API-ja
        this.groqApiKey = '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';
        this.groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions';
        
        // Stanje ankete
        this.surveyQuestions = [];
        this.currentQuestionIndex = 0;
        this.surveyAnswers = [];
        this.surveyActive = false;
        this.checkboxTimeout = null;
    }

    async startDailySurvey(force = false) {
        // Sačekaj da se DOM učita
        if (!document.getElementById('groq-survey-modal')) {
            setTimeout(() => this.startDailySurvey(force), 100);
            return;
        }

        // Proveri da li je anketa već popunjena danas (osim ako se ne forsira)
        if (!force) {
            const lastSurveyDate = localStorage.getItem('periodi_last_survey_date');
            const today = new Date().toDateString();
            
            if (lastSurveyDate === today) {
                console.log('Anketa je već popunjena danas. Koristi startDailySurvey(true) da je forsiraš.');
                return; // Anketa je već popunjena danas
            }
        }

        // Prikaži modal za anketu
        const modal = document.getElementById('groq-survey-modal');
        if (modal) {
            modal.classList.add('show');
            
            // Resetuj stanje ankete
            this.currentQuestionIndex = 0;
            this.surveyAnswers = [];
            this.surveyQuestions = [];
            this.surveyActive = true;

            // Generiši pitanja za anketu koristeći Groq API
            await this.generateSurveyQuestions();
        } else {
            console.error('Modal za anketu nije pronađen!');
        }
    }

    async generateSurveyQuestions() {
        const loadingEl = document.getElementById('survey-loading');
        const contentEl = document.getElementById('survey-content');
        
        loadingEl.style.display = 'block';
        contentEl.style.display = 'none';

        try {
            const activeCycle = this.tracker.getActiveCycle();
            const cycleDay = activeCycle ? this.tracker.getCurrentCycleDay() : null;
            const cyclePhase = activeCycle ? this.tracker.getCyclePhase(cycleDay) : 'Nema aktivnog ciklusa';

            const prompt = `Kreiraj 5 kratkih pitanja za svakodnevnu anketu praćenja menstrualnog ciklusa. 
Korisnik je ŽENSKA OSOBA trenutno u fazi: ${cyclePhase}${cycleDay ? ` (dan ${cycleDay})` : ''}.

VAŽNO - SVE MORA BITI NA ČISTOM SRPSKOM JEZIKU EKAVSKOM DIJALEKTU (LATINICA): 
- SVA PITANJA MORAJU BITI POSTAVLJENA DIREKTNO OSOBI U DRUGOM LICU JEDNINE (koristi "ti", "tebe", "tvoj", "tvoja", "tvoje", "si", "imaš", "osećaš", "želiš", "bi", itd.)
- SVA PITANJA MORAJU BITI UPUĆENA ŽENSKOJ OSOBI (koristi ženski rod: "svoju", "svoje", "si", "bi", "želiš", "imaš", "osećaš", itd.)
- SVA PITANJA I OPCIJE MORAJU BITI NA ČISTOM SRPSKOM JEZIKU EKAVSKOM DIJALEKTU (latinica). Koristi EKAVICU - npr. "lepo", "deo", "mleko", "srećan", "želeo", "hteo", "osećaš", "imaš", "želiš". NE koristi ijekavicu (lijepo, dio, mlijeko, sretan, želio, htio, osjećaš, imaš, želiš).
- Koristi prirodan čist srpski jezik ekavskog dijalekta upućen ženskoj osobi u drugom licu jednine.
- NE koristi engleske reči ili fraze. SVE mora biti na srpskom jeziku.

Pitanja treba da budu o:
1. Opšte stanje i energija (1-10 skala) - pitanje tipa "scale" - POSTAVLJENO DIREKTNO U DRUGOM LICU JEDNINE ŽENSKOJ OSOBI
2. Raspoloženje (1-10 skala) - pitanje tipa "scale" - POSTAVLJENO DIREKTNO U DRUGOM LICU JEDNINE ŽENSKOJ OSOBI
3. Imaš li fizičke simptome (bol, grčevi, itd.) - OVO MORA BITI TYPE "checkbox" sa opcijama: ["Grčevi", "Glavobolja", "Mučnina", "Nadutost", "Osetljivost grudi", "Akne"] - POSTAVLJENO DIREKTNO U DRUGOM LICU JEDNINE ŽENSKOJ OSOBI
4. Emocionalno stanje - OVO MORA BITI TYPE "radio" sa opcijama kao što su: ["Srećna", "Umorna", "Pod stresom", "Anksiozna", "Raspoložena", "Tužna", "Iritirana", "Mirna", "Nervozna", "Opuštena"] - POSTAVLJENO DIREKTNO U DRUGOM LICU JEDNINE ŽENSKOJ OSOBI (samo jedna opcija se može izabrati)
5. Dodatni komentari ili napomene - OVO MORA BITI TYPE "radio" sa opcijama kao što su: ["Nema napomena", "Osećam se bolje nego juče", "Potrebno je više odmora", "Osećam se loše", "Sve je u redu", "Imam potrebu za podrškom"] - POSTAVLJENO DIREKTNO U DRUGOM LICU JEDNINE ŽENSKOJ OSOBI (samo jedna opcija se može izabrati)

Primeri pitanja u drugom licu jednine:
- "Kako ocenjuješ svoju energiju danas?"
- "Kako se osećaš danas?"
- "Imaš li fizičke simptome?"
- "Kako bi opisala svoje emocionalno stanje?"

Vrati samo JSON array sa pitanjima u formatu:
[
  {"question": "Tekst pitanja NA SRPSKOM POSTAVLJEN DIREKTNO U DRUGOM LICU JEDNINE ŽENSKOJ OSOBI", "type": "scale" ili "text" ili "checkbox" ili "radio", "options": ["opcija1", "opcija2", ...]},
  ...
]

Ako je type "scale", options treba da budu brojevi od 1 do 10 kao stringovi: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].
Ako je type "checkbox", options treba da budu niz stringova sa opcijama za checkbox (minimum 4-6 opcija).
Ako je type "radio", options treba da budu niz stringova sa opcijama za radio (samo jedna opcija se može izabrati).
Pitanja 4 i 5 MORAJU biti type "radio" sa ponuđenim opcijama, NE type "text" ili "checkbox".

VAŽNO - SVE MORA BITI NA ČISTOM SRPSKOM JEZIKU EKAVSKOM DIJALEKTU (LATINICA): 
- Sva pitanja i opcije moraju biti na čistom srpskom jeziku ekavskom dijalektu (latinica). Koristi EKAVICU - npr. "lepo", "deo", "mleko", "srećan", "želeo", "hteo". NE koristi ijekavicu (lijepo, dio, mlijeko, sretan, želio, htio).
- Sva pitanja moraju biti postavljena direktno osobi u drugom licu jednine (koristi "ti", "tebe", "tvoj", "tvoja", "tvoje", "si", "imaš", "osećaš", "želiš", "bi")
- Sva pitanja moraju biti upućena ženskoj osobi (koristi ženski rod)
- Za pitanje o fizičkim simptomima (pitanje 3) MORA biti type "checkbox" sa tačno ovim opcijama: ["Grčevi", "Glavobolja", "Mučnina", "Nadutost", "Osetljivost grudi", "Akne"]
- Za pitanje o emocionalnom stanju (pitanje 4) MORA biti type "radio" sa opcijama kao što su: ["Srećna", "Umorna", "Pod stresom", "Anksiozna", "Raspoložena", "Tužna", "Iritirana", "Mirna", "Nervozna", "Opuštena"] (samo jedna opcija se može izabrati)
- Za pitanje o dodatnim komentarima (pitanje 5) MORA biti type "radio" sa opcijama kao što su: ["Nema napomena", "Osećam se bolje nego juče", "Potrebno je više odmora", "Osećam se loše", "Sve je u redu", "Imam potrebu za podrškom"] (samo jedna opcija se može izabrati)
- Pitanja treba da budu prirodna i razgovorna na čistom srpskom jeziku ekavskom dijalektu postavljena direktno ženskoj osobi u drugom licu jednine
- NE koristi engleske reči ili fraze. SVE mora biti na srpskom jeziku`;

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
                            content: 'Ti si asistent za praćenje menstrualnog ciklusa. Odgovori samo sa validnim JSON array-om na čistom srpskom jeziku ekavskom dijalektu (latinica). SVA PITANJA I OPCIJE MORAJU BITI NA ČISTOM SRPSKOM JEZIKU EKAVSKOM DIJALEKTU. SVA PITANJA MORAJU BITI POSTAVLJENA DIREKTNO OSOBI U DRUGOM LICU JEDNINE (koristi "ti", "tebe", "tvoj", "tvoja", "tvoje", "si", "imaš", "osećaš", "želiš", "bi"). SVA PITANJA MORAJU BITI UPUĆENA ŽENSKOJ OSOBI (koristi ženski rod: "svoju", "svoje", "si", "bi", "želiš", "imaš", "osećaš"). Koristi EKAVICU - npr. "lepo", "deo", "mleko", "srećan", "želeo", "hteo", "osećaš", "imaš", "želiš". NE koristi ijekavicu (lijepo, dio, mlijeko, sretan, želio, htio, osjećaš, imaš, želiš). NE koristi engleske reči ili fraze. SVE mora biti na srpskom jeziku.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });

            if (!response.ok) {
                throw new Error(`Greška Groq API-ja: ${response.status}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content;
            
            // Parse JSON from response (might be wrapped in markdown code blocks)
            let questionsJson = content.trim();
            if (questionsJson.startsWith('```')) {
                questionsJson = questionsJson.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            }
            
            try {
                this.surveyQuestions = JSON.parse(questionsJson);
                
                // Validate that questions are in Serbian Ekavian and second person singular - check for common English words, Ijekavian, and third person plural
                const englishWords = ['how', 'what', 'when', 'where', 'why', 'energy', 'mood', 'pain', 'symptoms'];
                const ijekavianWords = ['lijepo', 'dio', 'mlijeko', 'sretan', 'želio', 'htio', 'lijep', 'lijepa', 'lijepi', 'lijepu', 'lijepom', 'lijepim', 'lijepih', 'lijepima', 'osjećaš', 'osjećam', 'osjeća', 'osjećaju', 'osjećanje', 'osjećaj', 'sretna', 'sretni', 'sretno'];
                const thirdPersonPlural = ['ocenjujete', 'ste', 'biste', 'želite', 'imate', 'osećate', 'imate li', 'ste li', 'biste li'];
                const hasEnglish = this.surveyQuestions.some(q => 
                    englishWords.some(word => q.question.toLowerCase().includes(word))
                );
                const hasIjekavian = this.surveyQuestions.some(q => 
                    ijekavianWords.some(word => q.question.toLowerCase().includes(word))
                );
                const hasThirdPersonPlural = this.surveyQuestions.some(q => 
                    thirdPersonPlural.some(word => q.question.toLowerCase().includes(word))
                );
                
                // Ensure questions 4 and 5 (indices 3 and 4) are radio type
                if (this.surveyQuestions.length > 3 && this.surveyQuestions[3].type !== 'radio') {
                    this.surveyQuestions[3].type = 'radio';
                }
                if (this.surveyQuestions.length > 4 && this.surveyQuestions[4].type !== 'radio') {
                    this.surveyQuestions[4].type = 'radio';
                }
                
                if (hasEnglish || hasIjekavian || hasThirdPersonPlural) {
                    console.warn('API je generisao pitanja u pogrešnom obliku, koristim podrazumevana srpska ekavska pitanja u drugom licu jednine');
                    this.surveyQuestions = this.getDefaultSerbianQuestions(cyclePhase, cycleDay);
                }
            } catch (error) {
                console.error('Greška pri parsiranju pitanja ankete, koristim podrazumevana:', error);
                this.surveyQuestions = this.getDefaultSerbianQuestions(cyclePhase, cycleDay);
            }
            
            // Initialize progress steps
            this.initProgressSteps();
            
            loadingEl.style.display = 'none';
            contentEl.style.display = 'block';
            
            this.displayCurrentQuestion();
        } catch (error) {
            console.error('Greška pri generisanju ankete:', error);
            loadingEl.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--error-color); margin-bottom: 1rem;"></i>
                    <p>Greška pri učitavanju ankete. Molimo pokušajte ponovo.</p>
                    <button class="btn btn-secondary" onclick="document.getElementById('groq-survey-modal').classList.remove('show')">Zatvori</button>
                </div>
            `;
        }
    }

    getDefaultSerbianQuestions(cyclePhase, cycleDay) {
        return [
            {
                question: "Kako ocenjuješ svoju energiju danas?",
                type: "scale",
                options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
            },
            {
                question: "Kako ocenjuješ svoje raspoloženje danas?",
                type: "scale",
                options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
            },
            {
                question: "Imaš li fizičke simptome danas?",
                type: "checkbox",
                options: ["Grčevi", "Glavobolja", "Mučnina", "Nadutost", "Osetljivost grudi", "Akne"]
            },
            {
                question: "Kako bi opisala svoje emocionalno stanje?",
                type: "radio",
                options: ["Srećna", "Umorna", "Pod stresom", "Anksiozna", "Raspoložena", "Tužna", "Iritirana", "Mirna", "Nervozna", "Opuštena"]
            },
            {
                question: "Ima li još nešto što želiš da zabeležiš?",
                type: "radio",
                options: ["Nema napomena", "Osećam se bolje nego juče", "Potrebno je više odmora", "Osećam se loše", "Sve je u redu", "Imam potrebu za podrškom"]
            }
        ];
    }

    displayCurrentQuestion() {
        if (this.currentQuestionIndex >= this.surveyQuestions.length) {
            this.showSurveySummary();
            return;
        }

        // Clear any existing checkbox timeout
        if (this.checkboxTimeout) {
            clearTimeout(this.checkboxTimeout);
            this.checkboxTimeout = null;
        }

        const question = this.surveyQuestions[this.currentQuestionIndex];
        const questionEl = document.getElementById('survey-question');
        const questionNumberEl = document.getElementById('survey-question-number');
        const questionHintEl = document.getElementById('survey-question-hint');
        const optionsEl = document.getElementById('survey-options');
        const inputEl = document.getElementById('survey-input');
        const nextBtn = document.getElementById('survey-next-btn');
        const submitBtn = document.getElementById('survey-submit-btn');
        const skipBtn = document.getElementById('survey-skip-btn');
        const prevBtn = document.getElementById('survey-prev-btn');
        const progressFill = document.getElementById('survey-progress-fill');
        const currentQEl = document.getElementById('current-q');
        const totalQEl = document.getElementById('total-q');

        // Add fade animation
        const contentEl = document.getElementById('survey-content');
        contentEl.style.opacity = '0';
        setTimeout(() => {
            // Update question number and text
            questionNumberEl.textContent = `Pitanje ${this.currentQuestionIndex + 1}`;
            questionEl.textContent = question.question;
            
            // Set hint based on question type
            if (question.type === 'scale') {
                questionHintEl.textContent = 'Izaberite jedan od ponuđenih odgovora';
            } else if (question.type === 'checkbox') {
                questionHintEl.textContent = 'Možete izabrati više opcija';
            } else if (question.type === 'radio') {
                questionHintEl.textContent = 'Izaberite jednu opciju';
            } else {
                questionHintEl.textContent = 'Unesite svoj odgovor';
            }
            
            // Update progress
            const progress = ((this.currentQuestionIndex + 1) / this.surveyQuestions.length) * 100;
            progressFill.style.width = `${progress}%`;
            currentQEl.textContent = this.currentQuestionIndex + 1;
            totalQEl.textContent = this.surveyQuestions.length;
            
            // Update progress steps
            this.updateProgressSteps();
            
            // Show/hide previous button
            prevBtn.style.display = this.currentQuestionIndex > 0 ? 'inline-block' : 'none';
            
            contentEl.style.opacity = '1';
        }, 150);

        if (question.type === 'scale' && question.options && question.options.length > 0) {
            optionsEl.innerHTML = '';
            question.options.forEach((option, index) => {
                const optionEl = document.createElement('div');
                optionEl.className = 'survey-option';
                optionEl.dataset.value = option;
                
                const optionText = document.createElement('span');
                optionText.textContent = option;
                optionEl.appendChild(optionText);
                
                optionEl.addEventListener('click', () => {
                    document.querySelectorAll('.survey-option').forEach(opt => opt.classList.remove('selected'));
                    optionEl.classList.add('selected');
                    this.surveyAnswers[this.currentQuestionIndex] = option;
                    this.updateSurveyButtons();
                    
                    // Za treće pitanje (indeks 2) ne prebacuj automatski, već prikaži dugme "Sledeće"
                    if (this.currentQuestionIndex === 2) {
                        // Treće pitanje - samo prikaži dugme, ne prebacuj automatski
                        const nextBtn = document.getElementById('survey-next-btn');
                        if (nextBtn) {
                            nextBtn.style.display = 'inline-block';
                            nextBtn.classList.add('pulse-animation');
                        }
                    } else {
                        // Automatski prebaci na sledeće pitanje nakon kratke animacije
                        setTimeout(() => {
                            if (this.currentQuestionIndex < this.surveyQuestions.length - 1) {
                                this.nextSurveyQuestion();
                            } else {
                                // Ako je poslednje pitanje, prikaži submit dugme
                                const submitBtn = document.getElementById('survey-submit-btn');
                                submitBtn.style.display = 'inline-block';
                                submitBtn.classList.add('pulse-animation');
                            }
                        }, 600);
                    }
                });
                
                // Check if this option was previously selected
                if (this.surveyAnswers[this.currentQuestionIndex] === option) {
                    optionEl.classList.add('selected');
                }
                
                optionsEl.appendChild(optionEl);
            });
            optionsEl.style.display = 'block';
            inputEl.style.display = 'none';
        } else if (question.type === 'checkbox' && question.options && question.options.length > 0) {
            // Initialize answer as array if not exists
            if (!this.surveyAnswers[this.currentQuestionIndex]) {
                this.surveyAnswers[this.currentQuestionIndex] = [];
            }
            
            optionsEl.innerHTML = '';
            question.options.forEach((option, index) => {
                const optionEl = document.createElement('label');
                optionEl.className = 'survey-checkbox-option';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = option;
                checkbox.id = `survey-checkbox-${this.currentQuestionIndex}-${index}`;
                
                // Check if this option is already selected
                if (Array.isArray(this.surveyAnswers[this.currentQuestionIndex]) && 
                    this.surveyAnswers[this.currentQuestionIndex].includes(option)) {
                    checkbox.checked = true;
                }
                
                checkbox.addEventListener('change', () => {
                    if (!Array.isArray(this.surveyAnswers[this.currentQuestionIndex])) {
                        this.surveyAnswers[this.currentQuestionIndex] = [];
                    }
                    
                    if (checkbox.checked) {
                        if (!this.surveyAnswers[this.currentQuestionIndex].includes(option)) {
                            this.surveyAnswers[this.currentQuestionIndex].push(option);
                        }
                    } else {
                        this.surveyAnswers[this.currentQuestionIndex] = 
                            this.surveyAnswers[this.currentQuestionIndex].filter(opt => opt !== option);
                    }
                    this.updateSurveyButtons();
                    
                    // Za treće pitanje (indeks 2) ne prebacuj automatski
                    if (this.currentQuestionIndex === 2) {
                        // Treće pitanje - samo prikaži dugme, ne prebacuj automatski
                        const nextBtn = document.getElementById('survey-next-btn');
                        if (nextBtn && this.surveyAnswers[this.currentQuestionIndex] && 
                            this.surveyAnswers[this.currentQuestionIndex].length > 0) {
                            nextBtn.style.display = 'inline-block';
                            nextBtn.classList.add('pulse-animation');
                        }
                    } else {
                        // Automatski prebaci na sledeće pitanje nakon izbora (sa vremenom za dodatne izbore)
                        // Clear existing timeout if user is still selecting
                        if (this.checkboxTimeout) {
                            clearTimeout(this.checkboxTimeout);
                        }
                        
                        this.checkboxTimeout = setTimeout(() => {
                            if (this.surveyAnswers[this.currentQuestionIndex] && 
                                this.surveyAnswers[this.currentQuestionIndex].length > 0) {
                                if (this.currentQuestionIndex < this.surveyQuestions.length - 1) {
                                    this.nextSurveyQuestion();
                                } else {
                                    // Ako je poslednje pitanje, prikaži submit dugme
                                    this.updateSurveyButtons();
                                }
                            }
                        }, 1500); // 1.5 sekunde da korisnik može izabrati više opcija
                    }
                });
                
                const labelText = document.createElement('span');
                labelText.textContent = option;
                
                optionEl.appendChild(checkbox);
                optionEl.appendChild(labelText);
                optionsEl.appendChild(optionEl);
            });
            optionsEl.style.display = 'block';
            inputEl.style.display = 'none';
        } else if (question.type === 'radio' && question.options && question.options.length > 0) {
            // Radio button questions (pitanja 4 i 5 - indeksi 3 i 4)
            optionsEl.innerHTML = '';
            question.options.forEach((option, index) => {
                const optionEl = document.createElement('label');
                optionEl.className = 'survey-radio-option';
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = `survey-radio-${this.currentQuestionIndex}`;
                radio.value = option;
                radio.id = `survey-radio-${this.currentQuestionIndex}-${index}`;
                
                // Check if this option is already selected
                if (this.surveyAnswers[this.currentQuestionIndex] === option) {
                    radio.checked = true;
                }
                
                radio.addEventListener('change', () => {
                    if (radio.checked) {
                        this.surveyAnswers[this.currentQuestionIndex] = option;
                        this.updateSurveyButtons();
                        
                        // Automatski prebaci na sledeće pitanje nakon izbora
                        setTimeout(() => {
                            if (this.currentQuestionIndex < this.surveyQuestions.length - 1) {
                                this.nextSurveyQuestion();
                            } else {
                                // Ako je poslednje pitanje, prikaži submit dugme
                                const submitBtn = document.getElementById('survey-submit-btn');
                                submitBtn.style.display = 'inline-block';
                                submitBtn.classList.add('pulse-animation');
                            }
                        }, 600);
                    }
                });
                
                const labelText = document.createElement('span');
                labelText.textContent = option;
                
                optionEl.appendChild(radio);
                optionEl.appendChild(labelText);
                optionsEl.appendChild(optionEl);
            });
            optionsEl.style.display = 'block';
            inputEl.style.display = 'none';
        } else {
            optionsEl.style.display = 'none';
            inputEl.style.display = 'block';
            const textInput = document.getElementById('survey-text-input');
            textInput.value = this.surveyAnswers[this.currentQuestionIndex] || '';
            
            // Show buttons based on text input
            const isLastQuestion = this.currentQuestionIndex === this.surveyQuestions.length - 1;
            if (textInput.value.trim()) {
                if (isLastQuestion) {
                    submitBtn.style.display = 'inline-block';
                    nextBtn.style.display = 'none';
                } else {
                    nextBtn.style.display = 'inline-block';
                    submitBtn.style.display = 'none';
                }
            } else {
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'none';
            }
            // Skip button removed - all questions are mandatory
            skipBtn.style.display = 'none';
            return;
        }

        // Show/hide buttons for scale and radio questions
        this.updateSurveyButtons();
    }

    initProgressSteps() {
        const stepsContainer = document.getElementById('progress-steps-container');
        if (!stepsContainer) return;
        
        stepsContainer.innerHTML = '';
        
        for (let i = 0; i < this.surveyQuestions.length; i++) {
            const stepEl = document.createElement('div');
            stepEl.className = 'progress-step';
            stepEl.id = `progress-step-${i}`;
            
            const stepNumber = document.createElement('div');
            stepNumber.className = 'progress-step-number';
            stepNumber.textContent = i + 1;
            
            stepEl.appendChild(stepNumber);
            stepsContainer.appendChild(stepEl);
        }
    }

    updateProgressSteps() {
        for (let i = 0; i < this.surveyQuestions.length; i++) {
            const stepEl = document.getElementById(`progress-step-${i}`);
            if (!stepEl) continue;
            
            stepEl.classList.remove('active', 'completed');
            
            if (i < this.currentQuestionIndex) {
                stepEl.classList.add('completed');
            } else if (i === this.currentQuestionIndex) {
                stepEl.classList.add('active');
            }
        }
    }

    updateSurveyButtons() {
        const nextBtn = document.getElementById('survey-next-btn');
        const submitBtn = document.getElementById('survey-submit-btn');
        const skipBtn = document.getElementById('survey-skip-btn');
        const isLastQuestion = this.currentQuestionIndex === this.surveyQuestions.length - 1;
        const isThirdQuestion = this.currentQuestionIndex === 2; // Treće pitanje (indeks 2)
        const currentAnswer = this.surveyAnswers[this.currentQuestionIndex];
        
        // For checkbox questions, allow proceeding even if no options selected (optional question)
        // For scale and radio questions, require an answer
        const hasAnswer = currentAnswer && (
            (Array.isArray(currentAnswer) && currentAnswer.length > 0) || 
            (!Array.isArray(currentAnswer) && currentAnswer)
        );
        
        // Check if current question is radio type (pitanja 4 i 5)
        const isRadioQuestion = this.surveyQuestions[this.currentQuestionIndex]?.type === 'radio';
        
        if (isLastQuestion) {
            submitBtn.style.display = hasAnswer ? 'inline-block' : 'none';
            nextBtn.style.display = 'none';
        } else if (isThirdQuestion) {
            // Za treće pitanje prikaži dugme samo ako ima odgovor, ali ne prebacuj automatski
            nextBtn.style.display = hasAnswer ? 'inline-block' : 'none';
            submitBtn.style.display = 'none';
        } else if (isRadioQuestion) {
            // Za radio pitanja (4 i 5) dugme se ne prikazuje jer se automatski prebacuje nakon izbora
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'none';
        } else {
            // Za ostala pitanja dugme se prikazuje samo ako nema odgovora (automatsko prebacivanje će se desiti)
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'none';
        }
        // Skip button removed - all questions are mandatory
        skipBtn.style.display = 'none';
    }

    prevSurveyQuestion() {
        if (this.currentQuestionIndex > 0) {
            // Save current answer if it's text input
            const textInput = document.getElementById('survey-text-input');
            if (textInput && textInput.style.display !== 'none') {
                this.surveyAnswers[this.currentQuestionIndex] = textInput.value;
            }
            
            this.currentQuestionIndex--;
            this.displayCurrentQuestion();
        }
    }

    nextSurveyQuestion() {
        const currentQuestion = this.surveyQuestions[this.currentQuestionIndex];
        const currentAnswer = this.surveyAnswers[this.currentQuestionIndex];
        
        // Remove pulse animation if exists
        const submitBtn = document.getElementById('survey-submit-btn');
        const nextBtn = document.getElementById('survey-next-btn');
        if (submitBtn) {
            submitBtn.classList.remove('pulse-animation');
        }
        if (nextBtn) {
            nextBtn.classList.remove('pulse-animation');
        }
        
        // For checkbox questions, allow proceeding even if no options selected (optional)
        // For radio questions, require an answer
        if (currentQuestion.type === 'checkbox') {
            // Answer is already saved as array, proceed
        } else if (currentQuestion.type === 'radio') {
            // For radio questions, require an answer
            if (!currentAnswer) {
                alert('Molimo odgovorite na pitanje pre nego što nastavite.');
                return;
            }
        } else if (!currentAnswer) {
            // If it's a text question, get the value from textarea
            const textInput = document.getElementById('survey-text-input');
            if (textInput && textInput.style.display !== 'none') {
                this.surveyAnswers[this.currentQuestionIndex] = textInput.value;
            } else {
                // For scale questions, require an answer
                if (currentQuestion.type === 'scale') {
                    alert('Molimo odgovorite na pitanje pre nego što nastavite.');
                    return;
                }
            }
        }

        this.currentQuestionIndex++;
        this.displayCurrentQuestion();
    }

    submitSurvey() {
        // Get last answer if it's text input, checkbox, or radio
        const currentQuestion = this.surveyQuestions[this.currentQuestionIndex];
        const textInput = document.getElementById('survey-text-input');
        
        if (currentQuestion.type === 'text' && textInput && textInput.style.display !== 'none') {
            if (!this.surveyAnswers[this.currentQuestionIndex]) {
                this.surveyAnswers[this.currentQuestionIndex] = textInput.value;
            }
        }
        // For checkbox, answer is already saved as array
        // For radio, answer is already saved as string
        
        // Validate that all questions are answered (all questions are mandatory)
        for (let i = 0; i < this.surveyQuestions.length; i++) {
            const answer = this.surveyAnswers[i];
            const question = this.surveyQuestions[i];
            
            if (!answer || 
                (Array.isArray(answer) && answer.length === 0) || 
                (typeof answer === 'string' && answer.trim() === '')) {
                // Navigate to unanswered question
                this.currentQuestionIndex = i;
                this.displayCurrentQuestion();
                alert('Molimo odgovorite na sva pitanja pre nego što završite anketu.');
                return;
            }
        }

        // Save survey completion date
        localStorage.setItem('periodi_last_survey_date', new Date().toDateString());
        
        // Process answers and save to symptoms
        this.processSurveyAnswers();
        
        // Show summary
        this.showSurveySummary();
    }

    processSurveyAnswers() {
        // Extract data from survey answers
        const today = new Date().toISOString().split('T')[0];
        let energy = 5, mood = 5, pain = 1, libido = 5;
        const additionalSymptoms = [];

        this.surveyAnswers.forEach((answer, index) => {
            const question = this.surveyQuestions[index];
            const questionText = question.question.toLowerCase();
            
            if (questionText.includes('energij') || questionText.includes('energi')) {
                energy = parseInt(answer) || 5;
            } else if (questionText.includes('raspoloženj') || questionText.includes('mood')) {
                mood = parseInt(answer) || 5;
            } else if (questionText.includes('fizičk') || questionText.includes('simptom')) {
                // Handle checkbox answers for physical symptoms
                if (Array.isArray(answer)) {
                    answer.forEach(symptom => {
                        const symptomLower = symptom.toLowerCase();
                        if (symptomLower.includes('grč') || symptomLower === 'grčevi') {
                            additionalSymptoms.push('cramps');
                        } else if (symptomLower.includes('glavobolj') || symptomLower === 'glavobolja') {
                            additionalSymptoms.push('headache');
                        } else if (symptomLower.includes('mučnin') || symptomLower === 'mučnina') {
                            additionalSymptoms.push('nausea');
                        } else if (symptomLower.includes('nadutost') || symptomLower === 'nadutost') {
                            additionalSymptoms.push('bloating');
                        } else if (symptomLower.includes('osetljivost') || symptomLower.includes('grudi')) {
                            additionalSymptoms.push('breast-tenderness');
                        } else if (symptomLower.includes('akne') || symptomLower === 'akne') {
                            additionalSymptoms.push('acne');
                        }
                    });
                    // If any physical symptoms selected, set pain to at least 3
                    if (answer.length > 0) {
                        pain = Math.max(pain, 3);
                    }
                }
            } else if (questionText.includes('emocionaln') || questionText.includes('stanje')) {
                // Handle radio answers for emotional state (pitanje 4)
                // Radio answers are strings, not arrays
                if (typeof answer === 'string' && answer.trim()) {
                    // Could add emotional state tracking here if needed
                }
            } else if (questionText.includes('napomen') || questionText.includes('komentar') || questionText.includes('zabeleži')) {
                // Handle radio answers for additional comments (pitanje 5)
                // Radio answers are strings, not arrays
                if (typeof answer === 'string' && answer.trim()) {
                    // Could add comment tracking here if needed
                }
            } else if (questionText.includes('bol') || questionText.includes('pain')) {
                pain = parseInt(answer) || 1;
            } else if (questionText.includes('libido') || questionText.includes('seksualn')) {
                libido = parseInt(answer) || 5;
            }
        });

        // Remove existing entry for today
        this.tracker.symptoms = this.tracker.symptoms.filter(s => s.date !== today);

        // Create new symptom entry
        const symptomEntry = {
            id: Date.now(),
            date: today,
            energy: energy,
            mood: mood,
            pain: pain,
            libido: libido,
            additional: additionalSymptoms,
            source: 'groq_survey',
            surveyAnswers: this.surveyAnswers,
            surveyQuestions: this.surveyQuestions
        };

        this.tracker.symptoms.push(symptomEntry);
        this.tracker.saveData();
        
        // Generate summary using Groq API
        this.tracker.generateSurveySummary(symptomEntry).then(summary => {
            symptomEntry.summary = summary;
            this.tracker.saveData();
            this.tracker.updateSymptomsDisplay();
        }).catch(() => {
            // If summary generation fails, still update display
            this.tracker.updateSymptomsDisplay();
        });
    }

    showSurveySummary() {
        const contentEl = document.getElementById('survey-content');
        const summaryEl = document.getElementById('survey-summary');
        const nextBtn = document.getElementById('survey-next-btn');
        const submitBtn = document.getElementById('survey-submit-btn');
        const skipBtn = document.getElementById('survey-skip-btn');

        contentEl.style.display = 'none';
        summaryEl.style.display = 'block';
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'none';
        skipBtn.style.display = 'none';

        summaryEl.querySelector('#survey-summary-text').textContent = 
            'Vaši odgovori su sačuvani. Hvala vam što pratite svoje zdravlje!';

        // Auto-close after 3 seconds
        setTimeout(() => {
            this.tracker.closeModal();
            this.surveyActive = false;
        }, 3000);
    }

    skipSurvey() {
        this.tracker.closeModal();
        this.surveyActive = false;
    }
}

