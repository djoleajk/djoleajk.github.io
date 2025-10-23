// ===== AUTENTIFIKACIJA =====

// Provera da li korisnik već postoji u localStorage
function initializeUsers() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Dodaj default admin nalog ako ne postoji
    if (!users.find(u => u.username === 'admin')) {
        users.push({
            id: 'admin-001',
            username: 'admin',
            password: 'admin123', // U realnoj aplikaciji ovo bi bilo heshovano!
            name: 'Administrator',
            email: 'admin@kladionica.rs',
            role: 'admin',
            balance: 100000,
            createdAt: new Date().toISOString(),
            ticketHistory: []
        });
    }
    
    // Dodaj default demo nalog ako ne postoji
    if (!users.find(u => u.username === 'demo')) {
        users.push({
            id: 'demo-001',
            username: 'demo',
            password: 'demo123',
            name: 'Demo Korisnik',
            email: 'demo@kladionica.rs',
            role: 'user',
            balance: 10000,
            createdAt: new Date().toISOString(),
            ticketHistory: []
        });
    }
    
    localStorage.setItem('users', JSON.stringify(users));
}

// Inicijalizuj korisnike pri učitavanju
initializeUsers();

// DOM elementi
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

// Tab switching
function switchTab(tab) {
    const loginTab = document.querySelector('.tab-btn:first-child');
    const registerTab = document.querySelector('.tab-btn:last-child');
    
    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
    
    hideMessages();
}

// Prikaz poruka
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    successMessage.classList.remove('show');
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.classList.add('show');
    errorMessage.classList.remove('show');
}

function hideMessages() {
    errorMessage.classList.remove('show');
    successMessage.classList.remove('show');
}

// Password strength checker
const registerPassword = document.getElementById('registerPassword');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');

if (registerPassword) {
    registerPassword.addEventListener('input', (e) => {
        const password = e.target.value;
        const strength = calculatePasswordStrength(password);
        
        strengthFill.className = 'strength-fill';
        
        if (strength === 0) {
            strengthFill.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
            strengthText.textContent = '';
        } else if (strength < 3) {
            strengthFill.classList.add('strength-weak');
            strengthText.textContent = 'Slaba lozinka';
            strengthText.style.color = 'var(--danger)';
        } else if (strength < 5) {
            strengthFill.classList.add('strength-medium');
            strengthText.textContent = 'Srednja lozinka';
            strengthText.style.color = '#ffa500';
        } else {
            strengthFill.classList.add('strength-strong');
            strengthText.textContent = 'Jaka lozinka';
            strengthText.style.color = 'var(--primary-green)';
        }
    });
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    return strength;
}

// LOGIN FORMA
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        showError('⚠️ Molimo popunite sva polja');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Uspešna prijava
        const currentUser = {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role,
            balance: user.balance,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showSuccess('✅ Uspešna prijava! Preusmeravanje...');
        
        setTimeout(() => {
            // Ako je admin, idi na admin panel, inače na glavnu stranicu
            if (user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 1000);
    } else {
        showError('❌ Pogrešno korisničko ime ili lozinka');
    }
});

// REGISTRACIONA FORMA
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    
    // Validacija
    if (!name || !username || !email || !password || !passwordConfirm) {
        showError('⚠️ Molimo popunite sva polja');
        return;
    }
    
    if (username.length < 3) {
        showError('⚠️ Korisničko ime mora imati najmanje 3 karaktera');
        return;
    }
    
    if (password.length < 6) {
        showError('⚠️ Lozinka mora imati najmanje 6 karaktera');
        return;
    }
    
    if (password !== passwordConfirm) {
        showError('⚠️ Lozinke se ne poklapaju');
        return;
    }
    
    // Email validacija
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('⚠️ Unesite validnu email adresu');
        return;
    }
    
    // Provera da li korisnik već postoji
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.find(u => u.username === username)) {
        showError('⚠️ Korisničko ime već postoji');
        return;
    }
    
    if (users.find(u => u.email === email)) {
        showError('⚠️ Email već postoji');
        return;
    }
    
    // Kreiranje novog korisnika
    const newUser = {
        id: 'user-' + Date.now(),
        username,
        password, // U realnoj aplikaciji ovo bi bilo heshovano!
        name,
        email,
        role: 'user',
        balance: 1000, // Početni bonus
        createdAt: new Date().toISOString(),
        ticketHistory: []
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showSuccess('✅ Registracija uspešna! Dobili ste 1000 RSD bonusa. Prijavljujemo vas...');
    
    // Automatska prijava nakon registracije
    setTimeout(() => {
        const currentUser = {
            id: newUser.id,
            username: newUser.username,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            balance: newUser.balance,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.location.href = 'index.html';
    }, 2000);
});

// Provera da li je korisnik već ulogovan
function checkIfLoggedIn() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        // Već ulogovan, preusmeri
        if (currentUser.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'index.html';
        }
    }
}

// Proveri pri učitavanju
checkIfLoggedIn();

