// Serbian state holidays (can be customized)
const STATE_HOLIDAYS = [
    '2026-01-01', // Nova godina
    '2026-01-02', // Nova godina
    '2026-01-07', // Božić (pravoslavni)
    '2026-02-15', // Dan državnosti
    '2026-02-16', // Dan državnosti
    '2026-04-17', // Veliki petak (pravoslavni - promenljiv)
    '2026-04-20', // Vaskrs (pravoslavni - promenljiv)
    '2026-05-01', // Praznik rada
    '2026-05-02', // Praznik rada
    '2026-11-11', // Dan primirja
];

// Projects storage
let projects = JSON.parse(localStorage.getItem('projects')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').value = today;
    document.getElementById('projectStartDate').value = today;
    
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    document.getElementById('startDateHours').value = localDateTime;
    
    // Load projects
    renderProjects();
    
    // PWA installation
    setupPWA();
});

/**
 * Main function: Calculate deadline based on working days
 */
function calculateDeadline() {
    const startDateInput = document.getElementById('startDate').value;
    const workingDaysInput = document.getElementById('workingDays').value;
    const includeHolidays = document.getElementById('includeHolidays').checked;
    
    const errorDiv = document.getElementById('error');
    const resultDiv = document.getElementById('result');
    
    // Reset previous results
    errorDiv.classList.add('hidden');
    resultDiv.classList.add('hidden');
    
    // Validation
    if (!startDateInput) {
        showError('Molimo unesite početni datum!', 'error');
        return;
    }
    
    if (!workingDaysInput || workingDaysInput <= 0) {
        showError('Molimo unesite validan broj radnih dana (veći od 0)!', 'error');
        return;
    }
    
    const startDate = new Date(startDateInput);
    const workingDays = parseInt(workingDaysInput);
    
    // Calculate deadline
    const deadline = addWorkingDays(startDate, workingDays, includeHolidays);
    
    // Display result
    displayResult(deadline, workingDays);
}

/**
 * Add working days to a date (skip weekends and optionally holidays)
 */
function addWorkingDays(startDate, daysToAdd, includeHolidays) {
    let currentDate = new Date(startDate);
    let addedDays = 0;
    
    while (addedDays < daysToAdd) {
        currentDate.setDate(currentDate.getDate() + 1);
        
        // Check if it's a weekend
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            continue; // Skip weekends
        }
        
        // Check if it's a holiday (if enabled)
        if (includeHolidays && isHoliday(currentDate)) {
            continue; // Skip holidays
        }
        
        addedDays++;
    }
    
    return currentDate;
}

/**
 * Check if a date is a state holiday
 */
function isHoliday(date) {
    const dateString = date.toISOString().split('T')[0];
    return STATE_HOLIDAYS.includes(dateString);
}

/**
 * Display the calculated result
 */
function displayResult(deadline, workingDays) {
    const resultDiv = document.getElementById('result');
    const deadlineDateEl = document.getElementById('deadlineDate');
    const deadlineDayEl = document.getElementById('deadlineDay');
    const workingDaysInfoEl = document.getElementById('workingDaysInfo');
    
    const dayNames = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota'];
    const dayName = dayNames[deadline.getDay()];
    
    const formattedDate = formatDate(deadline);
    
    deadlineDateEl.textContent = formattedDate;
    deadlineDayEl.textContent = `(${dayName})`;
    workingDaysInfoEl.textContent = `${workingDays} radnih dana od početnog datuma`;
    
    resultDiv.classList.remove('hidden');
}

/**
 * Format date to DD.MM.YYYY
 */
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

/**
 * Show error message
 */
function showError(message, elementId) {
    const errorDiv = document.getElementById(elementId);
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

/**
 * Calculate deadline with working hours
 */
function calculateDeadlineWithHours() {
    const startDateInput = document.getElementById('startDateHours').value;
    const workingHoursInput = document.getElementById('workingHours').value;
    const hoursPerDayInput = document.getElementById('hoursPerDay').value;
    
    const errorDiv = document.getElementById('errorHours');
    const resultDiv = document.getElementById('resultHours');
    
    // Reset previous results
    errorDiv.classList.add('hidden');
    resultDiv.classList.add('hidden');
    
    // Validation
    if (!startDateInput) {
        showError('Molimo unesite početni datum i vreme!', 'errorHours');
        return;
    }
    
    if (!workingHoursInput || workingHoursInput <= 0) {
        showError('Molimo unesite validan broj radnih sati!', 'errorHours');
        return;
    }
    
    if (!hoursPerDayInput || hoursPerDayInput <= 0 || hoursPerDayInput > 24) {
        showError('Molimo unesite validan broj sati po danu (1-24)!', 'errorHours');
        return;
    }
    
    const startDate = new Date(startDateInput);
    const workingHours = parseFloat(workingHoursInput);
    const hoursPerDay = parseFloat(hoursPerDayInput);
    
    // Calculate deadline
    const deadline = addWorkingHours(startDate, workingHours, hoursPerDay);
    
    // Display result
    displayResultWithHours(deadline, workingHours, hoursPerDay);
}

/**
 * Add working hours to a date
 */
function addWorkingHours(startDate, hoursToAdd, hoursPerDay) {
    let currentDate = new Date(startDate);
    let remainingHours = hoursToAdd;
    
    while (remainingHours > 0) {
        // Check if it's a weekend
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            // Skip to next day
            currentDate.setDate(currentDate.getDate() + 1);
            currentDate.setHours(9, 0, 0, 0); // Start at 9 AM
            continue;
        }
        
        // Add hours
        if (remainingHours >= hoursPerDay) {
            currentDate.setDate(currentDate.getDate() + 1);
            remainingHours -= hoursPerDay;
        } else {
            currentDate.setHours(currentDate.getHours() + remainingHours);
            remainingHours = 0;
        }
    }
    
    return currentDate;
}

/**
 * Display result with hours
 */
function displayResultWithHours(deadline, workingHours, hoursPerDay) {
    const resultDiv = document.getElementById('resultHours');
    const deadlineDateEl = document.getElementById('deadlineDateHours');
    const deadlineDayEl = document.getElementById('deadlineDayHours');
    const workingHoursInfoEl = document.getElementById('workingHoursInfo');
    
    const dayNames = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota'];
    const dayName = dayNames[deadline.getDay()];
    
    const formattedDateTime = formatDateTime(deadline);
    const totalDays = Math.ceil(workingHours / hoursPerDay);
    
    deadlineDateEl.textContent = formattedDateTime;
    deadlineDayEl.textContent = `(${dayName})`;
    workingHoursInfoEl.textContent = `${workingHours}h rada (≈${totalDays} radnih dana po ${hoursPerDay}h/dan)`;
    
    resultDiv.classList.remove('hidden');
}

/**
 * Format date and time
 */
function formatDateTime(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

/**
 * Add a new project
 */
function addProject() {
    const projectName = document.getElementById('projectName').value.trim();
    const projectStartDate = document.getElementById('projectStartDate').value;
    const projectDays = document.getElementById('projectDays').value;
    
    // Validation
    if (!projectName) {
        alert('Molimo unesite naziv projekta!');
        return;
    }
    
    if (!projectStartDate) {
        alert('Molimo unesite početni datum!');
        return;
    }
    
    if (!projectDays || projectDays <= 0) {
        alert('Molimo unesite validan broj radnih dana!');
        return;
    }
    
    const startDate = new Date(projectStartDate);
    const workingDays = parseInt(projectDays);
    const deadline = addWorkingDays(startDate, workingDays, false);
    
    const project = {
        id: Date.now(),
        name: projectName,
        startDate: projectStartDate,
        workingDays: workingDays,
        deadline: deadline.toISOString(),
    };
    
    projects.push(project);
    saveProjects();
    renderProjects();
    
    // Clear inputs
    document.getElementById('projectName').value = '';
    document.getElementById('projectDays').value = '';
}

/**
 * Delete a project
 */
function deleteProject(projectId) {
    projects = projects.filter(p => p.id !== projectId);
    saveProjects();
    renderProjects();
}

/**
 * Save projects to localStorage
 */
function saveProjects() {
    localStorage.setItem('projects', JSON.stringify(projects));
}

/**
 * Render all projects
 */
function renderProjects() {
    const projectsList = document.getElementById('projectsList');
    
    if (projects.length === 0) {
        projectsList.innerHTML = '<p style="text-align: center; color: #6B7280; margin-top: 1rem;">Nema dodatih projekata</p>';
        return;
    }
    
    projectsList.innerHTML = projects.map(project => {
        const deadline = new Date(project.deadline);
        const dayNames = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota'];
        const dayName = dayNames[deadline.getDay()];
        const formattedDate = formatDate(deadline);
        const formattedStartDate = formatDate(new Date(project.startDate));
        
        // Calculate days remaining
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const daysRemaining = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
        const statusColor = daysRemaining < 0 ? '#EF4444' : daysRemaining < 3 ? '#F59E0B' : '#10B981';
        
        return `
            <div class="project-item">
                <div class="project-info">
                    <div class="project-name">${project.name}</div>
                    <div class="project-details">📅 Start: ${formattedStartDate}</div>
                    <div class="project-details">⏱️ Trajanje: ${project.workingDays} radnih dana</div>
                    <div class="project-deadline" style="color: ${statusColor}">
                        🎯 Rok: ${formattedDate} (${dayName})
                        ${daysRemaining >= 0 ? `- Preostalo ${daysRemaining} dana` : `- Prošao pre ${Math.abs(daysRemaining)} dana`}
                    </div>
                </div>
                <div class="project-actions">
                    <button class="btn-danger" onclick="deleteProject(${project.id})">Obriši</button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * PWA Setup
 */
let deferredPrompt;

function setupPWA() {
    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => console.log('Service Worker registered'))
            .catch(error => console.log('Service Worker registration failed:', error));
    }
    
    // Handle install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPrompt();
    });
}

function showInstallPrompt() {
    const installPrompt = document.createElement('div');
    installPrompt.className = 'install-prompt';
    installPrompt.innerHTML = '📱 Instaliraj aplikaciju';
    installPrompt.onclick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            deferredPrompt = null;
            installPrompt.remove();
        }
    };
    document.body.appendChild(installPrompt);
}
