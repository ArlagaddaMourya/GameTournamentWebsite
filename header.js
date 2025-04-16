// Header functionality - Save as header.js
function initHeader() {
    // Check login status from localStorage
    const isLoggedIn = localStorage.getItem('gameHavenLoggedIn') === 'true';
    const currentUser = isLoggedIn ? 
        JSON.parse(localStorage.getItem('gameHavenUser')) || { username: 'Player', avatar: '/api/placeholder/30/30' } 
        : null;
    
    // Update auth UI based on login status
    updateAuthUI(isLoggedIn, currentUser);
    
    // Set active navigation item
    setActiveNavLink();
    
    // Setup header scroll behavior
    setupHeaderScroll();
    
    // Setup mobile menu
    setupMobileMenu();
}

function updateAuthUI(isLoggedIn, user) {
    const desktopAuthButtons = document.getElementById('desktop-auth-buttons');
    const mobileAuthButtons = document.getElementById('mobile-auth-buttons');
    
    if (!desktopAuthButtons || !mobileAuthButtons) return;
    
    // Clear skeleton loaders
    const skeletons = document.querySelectorAll('.auth-skeleton');
    skeletons.forEach(skeleton => skeleton.style.display = 'none');
    
    if (isLoggedIn && user) {
        // Desktop profile button
        if (!desktopAuthButtons.querySelector('.profile-btn')) {
            // Only rebuild if profile button doesn't exist yet
            desktopAuthButtons.innerHTML = `
                <div class="profile-btn">
                    <img src="${user.avatar}" alt="Profile" class="user-avatar">
                    <span class="username">${user.username}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="profile-menu">
                    <ul>
                        <li><a href="profile.html"><i class="fas fa-user"></i> My Profile</a></li>
                        <li><a href="dashboard.html"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
                        <li><a href="settings.html"><i class="fas fa-cog"></i> Settings</a></li>
                        <li class="logout"><a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
                    </ul>
                </div>
            `;
            
            // Mobile profile buttons
            mobileAuthButtons.innerHTML = `
                <a href="profile.html" class="btn login-btn"><i class="fas fa-user"></i> My Profile</a>
                <a href="#" id="mobile-logout-btn" class="btn register-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
            `;
            
            // Add logout event listeners
            document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
            document.getElementById('mobile-logout-btn')?.addEventListener('click', handleLogout);
            
            // Profile dropdown toggle
            const profileBtn = document.querySelector('.profile-btn');
            if (profileBtn) {
                profileBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    this.classList.toggle('active');
                });
                
                // Close dropdown when clicking outside
                document.addEventListener('click', function() {
                    profileBtn.classList.remove('active');
                });
            }
        } else {
            // Just update the existing elements
            const avatars = desktopAuthButtons.querySelectorAll('.user-avatar');
            const usernames = desktopAuthButtons.querySelectorAll('.username');
            
            avatars.forEach(avatar => avatar.src = user.avatar);
            usernames.forEach(username => username.textContent = user.username);
        }
    } else {
        // Not logged in - show login/register buttons
        desktopAuthButtons.innerHTML = `
            <a href="login.html" class="btn login-btn">Login</a>
            <a href="register.html" class="btn register-btn">Sign Up</a>
        `;
        
        mobileAuthButtons.innerHTML = `
            <a href="login.html" class="btn login-btn">Login</a>
            <a href="register.html" class="btn register-btn">Sign Up</a>
        `;
    }
}

function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('gameHavenLoggedIn');
    localStorage.removeItem('gameHavenUser');
    updateAuthUI(false, null);
}

function setActiveNavLink() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageName = currentPage.split('.')[0];
    
    // Find matching nav link and add active class to parent li
    const navLinks = document.querySelectorAll('.nav-links li a');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('data-page');
        if ((linkPage === pageName) || 
           (pageName === '' && linkPage === 'index')) {
            link.parentElement.classList.add('active');
        }
    });
}

function setupHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    
    // Initial state check - Important to prevent jumps when page loads
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    }
    
    // Performance-optimized scroll handler using requestAnimationFrame
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if (window.scrollY > 10) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true }); // Passive listener for better performance
}

function setupMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');
    
    if (!mobileMenuToggle || !nav) return;
    
    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        
        // Toggle icon
        const icon = this.querySelector('i');
        if (nav.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (nav.classList.contains('active') && 
            !nav.contains(event.target) && 
            !mobileMenuToggle.contains(event.target)) {
            nav.classList.remove('active');
            mobileMenuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
        }
    });
}