// Autentifikacija i autorizacija
let currentUser = null;

// Provera da li je korisnik prijavljen
function isLoggedIn() {
    return currentUser !== null;
}

// Provera da li je korisnik admin
function isAdmin() {
    return currentUser && currentUser.uloga === 'admin';
}

// Provera da li je korisnik radnik
function isRadnik() {
    return currentUser && currentUser.uloga === 'radnik';
}

// Provera da li je korisnik user (običan korisnik)
function isUser() {
    return currentUser && currentUser.uloga === 'user';
}

// Prijava korisnika
async function login(username, password) {
    try {
        console.log('Pokušaj login-a za:', username);
        
        const korisnik = await getKorisnikByUsername(username);
        console.log('Pronađen korisnik:', korisnik ? korisnik.username : 'null');
        
        if (!korisnik) {
            console.error('Korisnik nije pronađen:', username);
            throw new Error('Neispravno korisničko ime ili lozinka');
        }

        console.log('Provera lozinke...');
        console.log('Hash funkcije dostupne:', typeof hashPassword !== 'undefined' && typeof verifyPassword !== 'undefined');
        console.log('Dužina lozinke u bazi:', korisnik.password ? korisnik.password.length : 'undefined');

        // Proveri lozinku (hash-ovanu ili plain text za retroaktivnu kompatibilnost)
        let passwordMatch = false;
        
        if (typeof hashPassword !== 'undefined' && typeof verifyPassword !== 'undefined') {
            // Nova verzija sa hash-ovanjem
            if (korisnik.password && korisnik.password.length === 64) {
                // Hash-ovana lozinka (SHA-256 = 64 karaktera)
                console.log('Koristi hash-ovanu lozinku za proveru');
                passwordMatch = await verifyPassword(password, korisnik.password);
                console.log('Provera hash-ovane lozinke:', passwordMatch);
            } else {
                // Stara plain text lozinka - hash-uj i uporedi
                console.log('Koristi plain text lozinku za proveru');
                const hashedPassword = await hashPassword(password);
                passwordMatch = hashedPassword === korisnik.password || korisnik.password === password;
                console.log('Provera plain text lozinke:', passwordMatch);
                
                // Ako se poklapa, ažuriraj na hash-ovanu verziju
                if (passwordMatch) {
                    const newHashedPassword = await hashPassword(password);
                    await updateKorisnik({ ...korisnik, password: newHashedPassword });
                    console.log('Lozinka ažurirana na hash-ovanu verziju');
                }
            }
        } else {
            // Fallback na plain text ako hash funkcije nisu dostupne
            console.log('Fallback na plain text proveru');
            passwordMatch = korisnik.password === password;
        }

        if (!passwordMatch) {
            console.error('Lozinka se ne poklapa');
            throw new Error('Neispravno korisničko ime ili lozinka');
        }

        console.log('Login uspešan!');
        
        // Ukloni password iz objekta korisnika pre čuvanja
        const { password: _, ...userWithoutPassword } = korisnik;
        currentUser = userWithoutPassword;
        
        // Sačuvaj sesiju u sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        return currentUser;
    } catch (error) {
        console.error('Login greška:', error);
        throw error;
    }
}

// Odjava korisnika
function logout() {
    currentUser = null;
    sessionStorage.removeItem('currentUser');
    location.reload();
}

// Učitaj sesiju ako postoji
function loadSession() {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
}

// Ažuriranje UI-a na osnovu uloge
function updateUIForRole() {
    const adminElements = document.querySelectorAll('.admin-only');
    const adminUserElements = document.querySelectorAll('.admin-user-only');
    const radnikElements = document.querySelectorAll('.radnik-only');
    const userElements = document.querySelectorAll('.user-only');
    
    if (isAdmin()) {
        adminElements.forEach(el => {
            el.style.display = '';
        });
        adminUserElements.forEach(el => {
            el.style.display = '';
        });
        radnikElements.forEach(el => {
            el.style.display = 'none';
        });
        userElements.forEach(el => {
            el.style.display = 'none';
        });
    } else if (isRadnik()) {
        adminElements.forEach(el => {
            el.style.display = 'none';
        });
        adminUserElements.forEach(el => {
            el.style.display = 'none';
        });
        radnikElements.forEach(el => {
            el.style.display = '';
        });
        userElements.forEach(el => {
            el.style.display = 'none';
        });
        // Aktiviraj prvi radnik tab
        const firstRadnikTab = document.querySelector('.radnik-only.tab-btn');
        if (firstRadnikTab) {
            firstRadnikTab.click();
        }
    } else if (isUser()) {
        adminElements.forEach(el => {
            el.style.display = 'none';
        });
        adminUserElements.forEach(el => {
            el.style.display = 'none';
        });
        radnikElements.forEach(el => {
            el.style.display = 'none';
        });
        userElements.forEach(el => {
            el.style.display = '';
        });
        // Aktiviraj prvi user tab
        const firstUserTab = document.querySelector('.user-only.tab-btn');
        if (firstUserTab) {
            firstUserTab.click();
        }
    } else {
        adminElements.forEach(el => {
            el.style.display = 'none';
        });
        adminUserElements.forEach(el => {
            el.style.display = 'none';
        });
        radnikElements.forEach(el => {
            el.style.display = 'none';
        });
        userElements.forEach(el => {
            el.style.display = 'none';
        });
    }

    // Ažuriraj ime i ulogu korisnika
    if (currentUser) {
        document.getElementById('current-user-name').textContent = currentUser.ime;
        const roleBadge = document.getElementById('current-user-role');
        let roleText = 'Korisnik';
        if (currentUser.uloga === 'admin') roleText = 'Administrator';
        else if (currentUser.uloga === 'radnik') roleText = 'Radnik';
        else if (currentUser.uloga === 'user') roleText = 'Korisnik';
        roleBadge.textContent = roleText;
        roleBadge.className = `role-badge role-${currentUser.uloga}`;
    }
}

