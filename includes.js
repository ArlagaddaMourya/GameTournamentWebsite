/**
 * includes.js - Optimized for GamersHaven
 * Handles loading of header/footer and user authentication state
 */

// Store DOM references to avoid repeated queries
let headerPlaceholder, footerPlaceholder;
let isHeaderLoaded = false;
let isFooterLoaded = false;
let userIsLoggedIn = false;
let currentUser = null;

// Check if user is logged in (using localStorage for demo)
function checkLoginStatus() {
  userIsLoggedIn = localStorage.getItem('gameHavenLoggedIn') === 'true';
  if (userIsLoggedIn) {
    currentUser = JSON.parse(localStorage.getItem('gameHavenUser')) || { 
      username: 'Player', 
      avatar: '/api/placeholder/30/30'
    };
  }
  return userIsLoggedIn;
}

// Update auth UI based on login status
function updateAuthUI() {
  const desktopAuthButtons = document.querySelector('.desktop-buttons');
  const mobileAuthButtons = document.querySelector('.mobile-buttons');
  
  if (!desktopAuthButtons || !mobileAuthButtons) return;
  
  if (userIsLoggedIn && currentUser) {
    // Desktop profile button
    desktopAuthButtons.innerHTML = `
      <div class="profile-btn">
        <img src="${currentUser.avatar}" alt="Profile">
        <span>${currentUser.username}</span>
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
    
    // Add event listeners for logout
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
    document.getElementById('mobile-logout-btn')?.addEventListener('click', handleLogout);
    
    // Profile dropdown toggle
    const profileBtn = document.querySelector('.profile-btn');
    if (profileBtn) {
      profileBtn.addEventListener('click', function() {
        this.classList.toggle('active');
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', function(event) {
        if (!profileBtn.contains(event.target)) {
          profileBtn.classList.remove('active');
        }
      });
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

// Handle logout action
function handleLogout(e) {
  e.preventDefault();
  localStorage.removeItem('gameHavenLoggedIn');
  localStorage.removeItem('gameHavenUser');
  userIsLoggedIn = false;
  currentUser = null;
  updateAuthUI();
}

// Load header with enhanced error handling and caching
function loadHeader() {
  if (isHeaderLoaded || !headerPlaceholder) return Promise.resolve();
  
  return fetch('header.html', { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error('Failed to load header');
      return response.text();
    })
    .then(html => {
      headerPlaceholder.innerHTML = html;
      isHeaderLoaded = true;
      
      // Set up active navigation
      setActiveNavLink();
      
      // Update auth UI based on login status
      updateAuthUI();
      
      // Set up scroll behavior
      setupHeaderScroll();
      
      // Set up mobile menu
      setupMobileMenu();
      
      return true;
    })
    .catch(error => {
      console.error('Header loading error:', error);
      headerPlaceholder.innerHTML = '<div class="error-message">Unable to load header. Please refresh the page.</div>';
      return false;
    });
}

// Load footer with enhanced error handling and caching
function loadFooter() {
  if (isFooterLoaded || !footerPlaceholder) return Promise.resolve();
  
  return fetch('footer.html', { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error('Failed to load footer');
      return response.text();
    })
    .then(html => {
      footerPlaceholder.innerHTML = html;
      isFooterLoaded = true;
      return true;
    })
    .catch(error => {
      console.error('Footer loading error:', error);
      footerPlaceholder.innerHTML = '<div class="error-message">Unable to load footer. Please refresh the page.</div>';
      return false;
    });
}

// Set active navigation link based on current page
function setActiveNavLink() {
  // Get current page filename
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const pageName = currentPage.split('.')[0];
  
  // Find matching nav link and add active class to parent li
  const navLinks = document.querySelectorAll('.nav-links li a');
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('data-page');
    if (linkPage === pageName) {
      link.parentElement.classList.add('active');
    } else {
      link.parentElement.classList.remove('active');
    }
  });
}

// Setup header scroll behavior with performance optimizations
function setupHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  
  // Initial state check
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  }
  
  // Use requestAnimationFrame for scroll efficiency
  let lastKnownScrollPosition = 0;
  let ticking = false;
  
  window.addEventListener('scroll', function() {
    lastKnownScrollPosition = window.scrollY;
    
    if (!ticking) {
      window.requestAnimationFrame(function() {
        if (lastKnownScrollPosition > 10) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      
      ticking = true;
    }
  }, { passive: true }); // Use passive event listener for performance
}

// Setup mobile menu with optimized event handling
function setupMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.main-nav');
  const icon = document.querySelector('.mobile-menu-toggle i');
  
  if (!mobileMenuToggle || !nav || !icon) return;
  
  mobileMenuToggle.addEventListener('click', function() {
    nav.classList.toggle('active');
    
    // Toggle icon
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
      icon.classList.replace('fa-times', 'fa-bars');
    }
  });
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Cache DOM references
  headerPlaceholder = document.getElementById('header-placeholder');
  footerPlaceholder = document.getElementById('footer-placeholder');
  
  // Check login status first
  checkLoginStatus();
  
  // Load header and footer components
  Promise.all([
    headerPlaceholder ? loadHeader() : Promise.resolve(),
    footerPlaceholder ? loadFooter() : Promise.resolve()
  ]).then(() => {
    // Emit a custom event when all components are loaded
    document.dispatchEvent(new CustomEvent('componentsLoaded'));
  });
  
  // For demo login functionality (remove in production)
  if (window.location.pathname.includes('login.html')) {
    setupDemoLogin();
  }
});

// Demo login functionality (for testing only)
function setupDemoLogin() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Save login state to localStorage (demo only)
      localStorage.setItem('gameHavenLoggedIn', 'true');
      localStorage.setItem('gameHavenUser', JSON.stringify({
        username: document.getElementById('username').value || 'Player',
        avatar: '/api/placeholder/30/30'
      }));
      
      // Redirect to home page
      window.location.href = 'index.html';
    });
  }
}
// Game Card Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Game data - you can expand this with your actual game data
  const gameData = {
      'Cyber Nexus': {
        category: 'Action',
        rating: '4.8',
        players: '24h', // Updated to match your new structure
        image: '/api/placeholder/900/600', // Replace with actual image path
        description: 'Enter the world of Cyber Nexus...',
        features: ['Immersive Open World', 'Character Customization', '...']
      },
    
    'Galactic Command': {
      category: 'Strategy',
      rating: '4.6',
      players: '1.8K',
      image: '../public/images/galantic commands.jpg', // Use your actual image path
      description: 'Command your fleet across the galaxy in this epic space strategy game. Build alliances, manage resources, and engage in tactical battles to expand your cosmic empire and protect your territory from rival factions.',
      features: ['Real-time Strategy', 'Fleet Customization', 'Resource Management', 'Diplomacy System', 'PvP Battles', 'Alliance Gameplay']
    },
    'Eternal Realms': {
      category: 'RPG',
      rating: '4.9',
      players: '3.1K',
      image: '../public/images/Eternalrelme.jpg', // Use your actual image path
      description: 'Embark on an epic journey through magical lands filled with mystical creatures and ancient powers. Create your unique character, master various skills, and uncover the secrets of the Eternal Realms.',
      features: ['Open World Exploration', 'Character Progression', 'Epic Quests', 'Crafting System', 'Guild Mechanics', 'PvE & PvP Content']
    },
    'Tactical Ops': {
      category: 'Shooter',
      rating: '4.7',
      players: '2.9K',
      image: '/api/placeholder/900/600', // Replace with actual image path
      description: 'Join elite special forces in high-stakes tactical operations around the world. Master weapons, coordinate with your team, and complete objectives in this intense first-person shooter experience.',
      features: ['Team-based Gameplay', 'Realistic Weapons', 'Multiple Game Modes', 'Seasonal Rankings', 'Custom Loadouts', 'Strategic Maps']
    }
  };

  // Create modal container once
  const modalContainer = document.createElement('div');
  modalContainer.className = 'game-modal-container';
  document.body.appendChild(modalContainer);
  
  // Close button
  const closeButton = document.createElement('div');
  closeButton.className = 'close-modal';
  closeButton.innerHTML = '<i class="fas fa-times"></i>';
  modalContainer.appendChild(closeButton);
  
  // Close modal function
  function closeModal() {
    const modal = document.querySelector('.game-modal');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        modalContainer.classList.remove('active');
      }, 300);
    }
  }
  
  // Close on button click
  closeButton.addEventListener('click', closeModal);
  
  // Close on ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });
  
  // Close when clicking outside the modal
  modalContainer.addEventListener('click', function(e) {
    if (e.target === modalContainer) closeModal();
  });
  
  // Add click event to all game cards
  const gameCards = document.querySelectorAll('.game-card');
  gameCards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Prevent clicking on "Play Now" button from opening modal
      if (e.target.classList.contains('play-now')) return;
      
      const gameTitle = card.querySelector('h3').textContent;
      const game = gameData[gameTitle];
      
      if (!game) return;
      
      // Create modal content
      const modalContent = `
        <div class="game-modal">
          <div class="game-modal-image">
            <img src="${game.image}" alt="${gameTitle}">
            <span class="game-category">${game.category}</span>
          </div>
          <div class="game-modal-content">
            <h2>${gameTitle}</h2>
            <div class="game-meta-expanded">
              <span><i class="fas fa-star"></i> ${game.rating}</span>
              <span><i class="fas fa-users"></i> ${game.players} Active</span>
            </div>
            <p class="game-description">${game.description}</p>
            <div class="game-features">
              <h3>Key Features</h3>
              <div class="feature-list">
                ${game.features.map(feature => `<span class="feature-item">${feature}</span>`).join('')}
              </div>
            </div>
            <div class="game-modal-buttons">
              <a href="#" class="play-now-expanded">Play Now</a>
            </div>
          </div>
        </div>
      `;
      
      // Set modal content and show
      modalContainer.innerHTML = '';
      modalContainer.insertAdjacentHTML('beforeend', modalContent);
      modalContainer.appendChild(closeButton);
      
      // Activate modal with slight delay for smooth transition
      requestAnimationFrame(() => {
        modalContainer.classList.add('active');
        setTimeout(() => {
          document.querySelector('.game-modal').classList.add('active');
        }, 100);
      });
    });
  });
});

// Tournament modal functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get all tournament buttons/links
  const tournamentButtons = document.querySelectorAll('.tournament-btn, .play-now');
  const modalBackdrop = document.querySelector('.tournament-modal-backdrop');
  const modalClose = document.querySelector('.tournament-modal-close');
  const registerBtn = document.querySelector('.tournament-register-btn');
  
  // Open modal when clicking tournament buttons
  tournamentButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      openTournamentModal();
    });
  });
  
  // Close modal functions
  if (modalClose) {
    modalClose.addEventListener('click', closeTournamentModal);
  }
  
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', function(e) {
      if (e.target === modalBackdrop) {
        closeTournamentModal();
      }
    });
  }
  
  // Escape key to close modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeTournamentModal();
    }
  });
  
  // Register button functionality
  if (registerBtn) {
    registerBtn.addEventListener('click', function() {
      window.location.href = 'register.html';
    });
  }
  
  function openTournamentModal() {
    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeTournamentModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Tournament modal functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get all tournament buttons/links
  const tournamentButtons = document.querySelectorAll('.tournament-btn, .play-now');
  const modalBackdrop = document.querySelector('.tournament-modal-backdrop');
  const modalClose = document.querySelector('.tournament-modal-close');
  const registerBtn = document.querySelector('.tournament-register-btn');
  
  // Open modal when clicking tournament buttons
  tournamentButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      openTournamentModal();
    });
  });
  
  // Close modal functions
  if (modalClose) {
    modalClose.addEventListener('click', closeTournamentModal);
  }
  
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', function(e) {
      if (e.target === modalBackdrop) {
        closeTournamentModal();
      }
    });
  }
  
  // Escape key to close modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeTournamentModal();
    }
  });
  
  // Register button functionality
  if (registerBtn) {
    registerBtn.addEventListener('click', function() {
      window.location.href = 'register.html';
    });
  }
  
  function openTournamentModal() {
    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeTournamentModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
});