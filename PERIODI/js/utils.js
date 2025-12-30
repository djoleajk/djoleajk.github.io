// Pomoćne funkcije

// Upravljanje Tabovima
PeriodTracker.prototype.switchTab = function(tabName) {
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
};

// Upravljanje Modalnim Prozorima
PeriodTracker.prototype.closeModal = function() {
    document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('show'));
};

// Ispravi česte gramatičke greške u tekstu i konvertuj ijekavicu u ekavicu
PeriodTracker.prototype.fixGrammarErrors = function(text) {
    if (!text) return text;
    
    let corrected = text;
    
    // KONVERZIJA IJEKAVICE U EKAVICU - OBAVEZNO
    corrected = corrected.replace(/\blijepo\b/gi, 'lepo');
    corrected = corrected.replace(/\blijep\b/gi, 'lep');
    corrected = corrected.replace(/\blijepa\b/gi, 'lepa');
    corrected = corrected.replace(/\blijepi\b/gi, 'lepi');
    corrected = corrected.replace(/\blijepu\b/gi, 'lepu');
    corrected = corrected.replace(/\blijepom\b/gi, 'lepom');
    corrected = corrected.replace(/\blijepim\b/gi, 'lepim');
    corrected = corrected.replace(/\blijepih\b/gi, 'lepih');
    corrected = corrected.replace(/\blijepima\b/gi, 'lepima');
    corrected = corrected.replace(/\bdio\b/gi, 'deo');
    corrected = corrected.replace(/\bmlijeko\b/gi, 'mleko');
    corrected = corrected.replace(/\bsretan\b/gi, 'srećan');
    corrected = corrected.replace(/\bsretna\b/gi, 'srećna');
    corrected = corrected.replace(/\bsretni\b/gi, 'srećni');
    corrected = corrected.replace(/\bsretno\b/gi, 'srećno');
    corrected = corrected.replace(/\bželio\b/gi, 'želeo');
    corrected = corrected.replace(/\bhtio\b/gi, 'hteo');
    corrected = corrected.replace(/\bosjećaš\b/gi, 'osećaš');
    corrected = corrected.replace(/\bosjećam\b/gi, 'osećam');
    corrected = corrected.replace(/\bosjeća\b/gi, 'oseća');
    corrected = corrected.replace(/\bosjećaju\b/gi, 'osećaju');
    corrected = corrected.replace(/\bosjećanje\b/gi, 'osećanje');
    corrected = corrected.replace(/\bosjećaj\b/gi, 'osećaj');
    
    // Ispravi "osećaš se dobro" umesto "osećaš dobro"
    corrected = corrected.replace(/\bosećaš\s+dobro\b/gi, 'osećaš se dobro');
    corrected = corrected.replace(/\bosećaš\s+loše\b/gi, 'osećaš se loše');
    corrected = corrected.replace(/\bosećaš\s+umorno\b/gi, 'osećaš se umorno');
    corrected = corrected.replace(/\bosećaš\s+stresno\b/gi, 'osećaš se pod stresom');
    corrected = corrected.replace(/\bosećaš\s+energično\b/gi, 'osećaš se energično');
    corrected = corrected.replace(/\bosećaš\s+pozitivno\b/gi, 'osećaš se pozitivno');
    corrected = corrected.replace(/\bosećaš\s+negativno\b/gi, 'osećaš se negativno');
    
    // Ispravi "imaš energiju" umesto "imaš energija"
    corrected = corrected.replace(/\bimaš\s+energija\b/gi, 'imaš energiju');
    corrected = corrected.replace(/\bimaš\s+dovoljno\s+energija\b/gi, 'imaš dovoljno energije');
    
    // Ispravi "tvoje stanje" umesto "tvoj stanje"
    corrected = corrected.replace(/\btvoj\s+stanje\b/gi, 'tvoje stanje');
    corrected = corrected.replace(/\btvoj\s+raspoloženje\b/gi, 'tvoje raspoloženje');
    corrected = corrected.replace(/\btvoj\s+osećanje\b/gi, 'tvoje osećanje');
    corrected = corrected.replace(/\btvoj\s+psihičko\s+stanje\b/gi, 'tvoje psihičko stanje');
    corrected = corrected.replace(/\btvoj\s+emocionalno\s+stanje\b/gi, 'tvoje emocionalno stanje');
    
    // Ispravi "tvoja energija" umesto "tvoj energija"
    corrected = corrected.replace(/\btvoj\s+energija\b/gi, 'tvoja energija');
    
    // Ispravi "tvoje raspoloženje" umesto "tvoj raspoloženje"
    corrected = corrected.replace(/\btvoj\s+raspoloženje\b/gi, 'tvoje raspoloženje');
    
    // Ispravi "utiče na tvoje raspoloženje" umesto "utiče na tvoj raspoloženje"
    corrected = corrected.replace(/\butiče\s+na\s+tvoj\s+raspoloženje\b/gi, 'utiče na tvoje raspoloženje');
    corrected = corrected.replace(/\butiče\s+na\s+tvoj\s+stanje\b/gi, 'utiče na tvoje stanje');
    
    // Ispravi "imaš dovoljno snage" umesto "imaš dovoljno snaga"
    corrected = corrected.replace(/\bimaš\s+dovoljno\s+snaga\b/gi, 'imaš dovoljno snage');
    
    // Ispravi "za sve aktivnosti" umesto "za sve aktivnost"
    corrected = corrected.replace(/\bza\s+sve\s+aktivnost\b/gi, 'za sve aktivnosti');
    
    // Ispravi "što pokazuje" umesto "što pokazuju"
    corrected = corrected.replace(/\bšto\s+pokazuju\b/gi, 'što pokazuje');
    
    // Ispravi interpunkciju - razmak posle tačke
    corrected = corrected.replace(/\.([A-Za-zА-Яа-я])/g, '. $1');
    
    // Ispravi višestruke razmake
    corrected = corrected.replace(/\s+/g, ' ');
    
    // Ispravi razmake pre interpunkcije
    corrected = corrected.replace(/\s+([.,!?;:])/g, '$1');
    
    // Ispravi razmake posle interpunkcije (osim ako već postoji)
    corrected = corrected.replace(/([.,!?;:])([A-Za-zА-Яа-я])/g, '$1 $2');
    
    return corrected.trim();
};

