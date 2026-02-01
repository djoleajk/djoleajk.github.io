// Konstante za konverziju
const CONVERSIONS = {
    // Konverzija u kilometre
    toKm: {
        km: 1,
        m: 0.001,
        mi: 1.60934
    },
    // Konverzija iz km/h
    fromKmh: {
        ms: 0.277778,  // m/s
        mph: 0.621371  // milje na sat
    }
};

// Ograničenja brzine (u km/h)
const SPEED_LIMITS = {
    walking: 5,
    bicycle: 25,
    city: 50,
    highway: 130,
    motorway: 130,
    dangerous: 180
};

// Selektori elemenata
const form = document.getElementById('speedForm');
const resultsDiv = document.getElementById('results');
const distanceInput = document.getElementById('distance');
const distanceUnit = document.getElementById('distanceUnit');
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const fuelConsumptionInput = document.getElementById('fuelConsumption');
const fuelPriceInput = document.getElementById('fuelPrice');
const currencySelect = document.getElementById('currency');

// Event listener za formu
form.addEventListener('submit', function(e) {
    e.preventDefault();
    calculateSpeed();
});

function calculateSpeed() {
    // Prikupljanje podataka
    const distance = parseFloat(distanceInput.value);
    const unit = distanceUnit.value;
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    const fuelConsumption = parseFloat(fuelConsumptionInput.value);
    const fuelPrice = parseFloat(fuelPriceInput.value) || 0;
    const currency = currencySelect.value;

    // Validacija
    if (!distance || distance <= 0) {
        alert('Molimo unesite validnu udaljenost!');
        return;
    }

    if (!fuelConsumption || fuelConsumption <= 0) {
        alert('Molimo unesite validnu potrošnju goriva!');
        return;
    }

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    
    if (totalSeconds <= 0) {
        alert('Molimo unesite validno vreme!');
        return;
    }

    // Konverzija udaljenosti u kilometre
    const distanceInKm = distance * CONVERSIONS.toKm[unit];

    // Konverzija vremena u sate
    const timeInHours = totalSeconds / 3600;

    // Izračunavanje brzine u km/h
    const speedKmh = distanceInKm / timeInHours;

    // Konverzija u druge jedinice
    const speedMs = speedKmh * CONVERSIONS.fromKmh.ms;
    const speedMph = speedKmh * CONVERSIONS.fromKmh.mph;

    // Izračunavanje potrošnje goriva
    const fuelAmount = (fuelConsumption * distanceInKm) / 100;
    const totalFuelCost = fuelPrice > 0 ? fuelAmount * fuelPrice : 0;

    // Prikaz rezultata
    displayResults(speedKmh, speedMs, speedMph, distanceInKm, timeInHours, fuelAmount, totalFuelCost, currency);
}

function displayResults(speedKmh, speedMs, speedMph, distance, time, fuelAmount, fuelCost, currency) {
    // Prikazivanje glavne brzine
    document.getElementById('mainSpeed').textContent = `${speedKmh.toFixed(2)} km/h`;
    
    // Prikazivanje brzine u različitim jedinicama
    document.getElementById('speedKmh').textContent = speedKmh.toFixed(2);
    document.getElementById('speedMs').textContent = speedMs.toFixed(2);
    document.getElementById('speedMph').textContent = speedMph.toFixed(2);

    // Prikazivanje potrošnje goriva
    document.getElementById('fuelAmount').textContent = `${fuelAmount.toFixed(2)} L`;

    // Prikazivanje cene goriva ako je uneta
    const fuelCostCard = document.getElementById('fuelCostCard');
    if (fuelCost > 0) {
        const currencySymbol = currency === 'rsd' ? 'RSD' : '€';
        document.getElementById('fuelCost').textContent = `${fuelCost.toFixed(2)} ${currencySymbol}`;
        fuelCostCard.style.display = 'block';
    } else {
        fuelCostCard.style.display = 'none';
    }

    // Generisanje dodatnih informacija
    const additionalInfo = generateAdditionalInfo(speedKmh, distance, time, fuelAmount, fuelCost, currency);
    document.getElementById('additionalInfo').innerHTML = additionalInfo;

    // Prikazivanje rezultata sa animacijom
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function generateAdditionalInfo(speedKmh, distance, time, fuelAmount, fuelCost, currency) {
    let info = [];

    // Informacije o udaljenosti i vremenu
    info.push(`<p><strong>Udaljenost:</strong> ${distance.toFixed(2)} km</p>`);
    info.push(`<p><strong>Vreme putovanja:</strong> ${formatTime(time)}</p>`);

    // Kategorija brzine
    let category = getSpeedCategory(speedKmh);
    info.push(`<p><strong>Kategorija:</strong> <span class="${category.class}">${category.text}</span></p>`);

    // Preporuke
    if (speedKmh <= SPEED_LIMITS.walking) {
        info.push(`<p class="success">✓ Ova brzina je idealna za hodanje ili trčanje.</p>`);
    } else if (speedKmh <= SPEED_LIMITS.bicycle) {
        info.push(`<p class="success">✓ Ova brzina je pogodna za bicikl ili električni trotinet.</p>`);
    } else if (speedKmh <= SPEED_LIMITS.city) {
        info.push(`<p class="success">✓ Ova brzina je u skladu sa gradskim ograničenjima.</p>`);
    } else if (speedKmh <= SPEED_LIMITS.highway) {
        info.push(`<p class="warning">⚠ Ova brzina zahteva vožnju van grada ili autoputem.</p>`);
    } else if (speedKmh <= SPEED_LIMITS.dangerous) {
        info.push(`<p class="danger">⚠ UPOZORENJE: Ova brzina prelazi zakonska ograničenja!</p>`);
        info.push(`<p class="danger">Preporučujemo da planirate više vremena za putovanje.</p>`);
    } else {
        info.push(`<p class="danger">⛔ OPASNO: Ova brzina je ekstremno visoka i nerealna za bezbednu vožnju!</p>`);
        info.push(`<p class="danger">Molimo vas da planirate znatno više vremena.</p>`);
    }

    // Informacije o gorivu
    info.push(`<p><strong>⛽ Potrošnja goriva:</strong> ${fuelAmount.toFixed(2)} litara</p>`);
    if (fuelCost > 0) {
        const currencySymbol = currency === 'rsd' ? 'RSD' : '€';
        info.push(`<p><strong>💰 Cena goriva:</strong> ${fuelCost.toFixed(2)} ${currencySymbol}</p>`);
    }

    // Procena efikasnosti vožnje
    const fuelEfficiency = getFuelEfficiency(speedKmh);
    info.push(`<p><strong>Efikasnost:</strong> <span class="${fuelEfficiency.class}">${fuelEfficiency.text}</span></p>`);

    // Vreme u različitim scenarijima
    info.push(`<p><strong>Uporedna vremena:</strong></p>`);
    info.push(`<p>• Hodanjem (5 km/h): ${formatTime(distance / 5)}</p>`);
    info.push(`<p>• Biciklom (20 km/h): ${formatTime(distance / 20)}</p>`);
    info.push(`<p>• Gradska vožnja (50 km/h): ${formatTime(distance / 50)}</p>`);
    info.push(`<p>• Autoput (120 km/h): ${formatTime(distance / 120)}</p>`);

    return info.join('');
}

function getSpeedCategory(speed) {
    if (speed <= SPEED_LIMITS.walking) {
        return { text: 'Hodanje/Trčanje', class: 'success' };
    } else if (speed <= SPEED_LIMITS.bicycle) {
        return { text: 'Bicikl/Trotinet', class: 'success' };
    } else if (speed <= SPEED_LIMITS.city) {
        return { text: 'Gradska vožnja', class: 'success' };
    } else if (speed <= SPEED_LIMITS.highway) {
        return { text: 'Vožnja autoputem', class: 'warning' };
    } else if (speed <= SPEED_LIMITS.dangerous) {
        return { text: 'Prekoračenje brzine', class: 'danger' };
    } else {
        return { text: 'Ekstremno opasna brzina', class: 'danger' };
    }
}

function getFuelEfficiency(speed) {
    // Optimalna brzina za potrošnju goriva je 80-90 km/h
    if (speed >= 80 && speed <= 90) {
        return { text: 'Optimalna - najniža potrošnja goriva', class: 'success' };
    } else if (speed >= 60 && speed < 80) {
        return { text: 'Dobra - niska potrošnja goriva', class: 'success' };
    } else if (speed > 90 && speed <= 110) {
        return { text: 'Dobra - umerena potrošnja goriva', class: 'success' };
    } else if (speed > 110 && speed <= 130) {
        return { text: 'Umerena - povećana potrošnja goriva', class: 'warning' };
    } else if (speed > 130) {
        return { text: 'Loša - visoka potrošnja goriva', class: 'danger' };
    } else {
        return { text: 'Gradska vožnja - povećana potrošnja', class: 'warning' };
    }
}

function formatTime(hours) {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const s = Math.floor(((hours - h) * 60 - m) * 60);

    let result = [];
    if (h > 0) result.push(`${h}h`);
    if (m > 0) result.push(`${m}min`);
    if (s > 0 || result.length === 0) result.push(`${s}s`);

    return result.join(' ');
}

// Validacija unosa u realnom vremenu
distanceInput.addEventListener('input', function() {
    if (this.value < 0) this.value = 0;
});

hoursInput.addEventListener('input', function() {
    if (this.value < 0) this.value = 0;
});

minutesInput.addEventListener('input', function() {
    if (this.value < 0) this.value = 0;
    if (this.value > 59) this.value = 59;
});

secondsInput.addEventListener('input', function() {
    if (this.value < 0) this.value = 0;
    if (this.value > 59) this.value = 59;
});

fuelConsumptionInput.addEventListener('input', function() {
    if (this.value < 0) this.value = 0;
});

fuelPriceInput.addEventListener('input', function() {
    if (this.value < 0) this.value = 0;
});

// Animacija za input fokus
const inputs = document.querySelectorAll('input, select');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});
