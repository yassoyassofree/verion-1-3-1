// User Management Functions
function loadUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Login Function
function login(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const users = loadUsers();
    const user = users.find(u => u.name === username);
    
    if (!user) {
        alert("User not found.");
        return false;
    }

    if (user.password !== password) {
        alert("Incorrect password.");
        return false;
    }

    if (user.blocked) {
        alert("Your account is currently blocked. Please contact an administrator.");
        return false;
    }

    if (user.status !== 'active') {
        alert("Your account is pending approval. Please wait for an administrator to approve your account.");
        return false;
    }

    localStorage.setItem('currentUser', user.name);
    localStorage.setItem('currentUserId', user.id);
    window.location.href = 'welcome.html';
    return true;
}

// Registration Function
function registerUser() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const email = document.getElementById('reg-email').value;
    
    if (!username || !password || !email) {
        alert("Please fill in all fields.");
        return;
    }

    const users = loadUsers();
    const existingUser = users.find(u => u.name === username || u.email === email);
    
    if (existingUser) {
        alert("Username or email already exists.");
        return;
    }

    const newUser = {
        id: Date.now().toString(),
        name: username,
        password: password,
        email: email,
        status: 'pending',
        blocked: false,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);
    
    alert("Registration successful! Your account is pending approval.");
    document.getElementById('register-form').reset();
    showLoginForm();
}

// UI Functions
document.addEventListener('DOMContentLoaded', () => {
    // Initialize PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => {
                console.log('Service Worker registered!', reg);
                
                // Listen for installation prompt
                window.addEventListener('beforeinstallprompt', (e) => {
                    e.preventDefault();
                    window.deferredPrompt = e;
                    
                    const installButton = document.querySelector('.install-button');
                    installButton.style.display = 'block';
                    
                    installButton.addEventListener('click', async () => {
                        const promptEvent = window.deferredPrompt;
                        if (!promptEvent) return;
                        
                        try {
                            await promptEvent.prompt();
                            const result = await promptEvent.userChoice;
                            if (result.outcome === 'accepted') {
                                console.log('User accepted the A2HS prompt');
                            } else {
                                console.log('User dismissed the A2HS prompt');
                            }
                            window.deferredPrompt = null;
                            installButton.style.display = 'none';
                        } catch (err) {
                            console.error('Error during A2HS prompt:', err);
                        }
                    });
                });
            })
            .catch(err => console.error('Service Worker registration failed:', err));
    }
});
