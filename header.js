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

/**
 * Footer functionality for GamersHaven
 * Handles newsletter subscription, social links, and dynamic footer features
 */

// Footer Module using IIFE pattern
const FooterModule = (function() {
    // Private variables
    let isFooterLoaded = false;
    const currentYear = new Date().getFullYear();
    
    // Initialize the footer
    function initFooter() {
      // Update copyright year
      updateCopyrightYear();
      
      // Setup newsletter form
      setupNewsletterForm();
      
      // Setup quick links highlighting
      highlightCurrentPageLink();
      
      // Setup social media interaction tracking
      setupSocialTracking();
      
      // Set footer as loaded
      isFooterLoaded = true;
      
      // Add scroll-to-top functionality
      addScrollToTop();
      
      console.log('Footer initialized successfully');
    }
    
    // Update the copyright year in footer
    function updateCopyrightYear() {
      const copyrightElement = document.querySelector('.footer-bottom p');
      if (copyrightElement) {
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace(/\d{4}/, currentYear);
      }
    }
    
    // Setup newsletter subscription form
    function setupNewsletterForm() {
      const newsletterForm = document.querySelector('.newsletter-form');
      if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const emailInput = this.querySelector('input[type="email"]');
          const email = emailInput.value.trim();
          
          if (!email) {
            showNewsletterMessage('Please enter your email address', 'error');
            return;
          }
          
          if (!isValidEmail(email)) {
            showNewsletterMessage('Please enter a valid email address', 'error');
            return;
          }
          
          // Here you would typically send the email to your backend
          // For now, we'll simulate success
          subscribeToNewsletter(email);
        });
      }
    }
    
    // Validate email format
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    
    // Subscribe to newsletter
    function subscribeToNewsletter(email) {
      // Show loading state
      const button = document.querySelector('.newsletter-form button');
      const originalContent = button.innerHTML;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      button.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        // Reset button
        button.innerHTML = originalContent;
        button.disabled = false;
        
        // Clear input
        document.querySelector('.newsletter-form input').value = '';
        
        // Show success message
        showNewsletterMessage('Thank you for subscribing!', 'success');
        
        // Store subscription in local storage to remember user
        localStorage.setItem('gameHavenNewsletter', email);
      }, 1000);
    }
    
    // Show newsletter message
    function showNewsletterMessage(message, type) {
      // Remove any existing message
      const existingMessage = document.querySelector('.newsletter-message');
      if (existingMessage) {
        existingMessage.remove();
      }
      
      // Create new message
      const messageElement = document.createElement('div');
      messageElement.className = `newsletter-message ${type}`;
      messageElement.textContent = message;
      
      // Insert after the form
      const newsletterForm = document.querySelector('.newsletter-form');
      newsletterForm.insertAdjacentElement('afterend', messageElement);
      
      // Remove after 3 seconds
      setTimeout(() => {
        messageElement.classList.add('fade-out');
        setTimeout(() => {
          messageElement.remove();
        }, 300);
      }, 3000);
    }
    
    // Highlight the current page in quick links
    function highlightCurrentPageLink() {
      // Get current page filename
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const pageName = currentPage.split('.')[0];
      
      // Find and highlight the matching link in footer
      const quickLinks = document.querySelectorAll('.footer-column ul li a');
      quickLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        if (href === '#') {
          // For placeholder links, try to match by text content
          const linkText = link.textContent.toLowerCase();
          if (pageName === linkText || 
              (pageName === 'index' && linkText === 'home')) {
            link.classList.add('active-link');
          }
        } else if (href.includes(pageName) || 
                  (pageName === '' && href.includes('index'))) {
          link.classList.add('active-link');
        }
      });
    }
    
    // Track social media interactions
    function setupSocialTracking() {
      // This would typically use actual social links, but we'll adapt to the existing structure
      const quickLinks = document.querySelectorAll('.footer-column ul li a');
      
      quickLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          // If this is a social media link or similar important link
          const linkText = this.textContent.trim().toLowerCase();
          const socialPlatforms = ['facebook', 'twitter', 'instagram', 'discord', 'youtube'];
          
          // Check if this is a likely social link
          const isSocialLink = socialPlatforms.some(platform => linkText.includes(platform));
          
          if (isSocialLink) {
            // Track click with analytics if available
            if (window.gtag) {
              gtag('event', 'social_click', {
                'event_category': 'footer',
                'event_label': linkText
              });
            }
            
            console.log(`Social link clicked: ${linkText}`);
          }
        });
      });
    }
    
    // Add scroll to top functionality
    function addScrollToTop() {
      // Create scroll to top button if doesn't exist
      if (!document.querySelector('.scroll-to-top')) {
        const scrollButton = document.createElement('button');
        scrollButton.className = 'scroll-to-top';
        scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(scrollButton);
        
        // Style the button using inline styles (could be moved to CSS)
        scrollButton.style.position = 'fixed';
        scrollButton.style.bottom = '20px';
        scrollButton.style.right = '20px';
        scrollButton.style.zIndex = '99';
        scrollButton.style.display = 'none';
        scrollButton.style.width = '40px';
        scrollButton.style.height = '40px';
        scrollButton.style.borderRadius = '50%';
        scrollButton.style.backgroundColor = '#7e57c2';
        scrollButton.style.color = 'white';
        scrollButton.style.border = 'none';
        scrollButton.style.cursor = 'pointer';
        scrollButton.style.opacity = '0.7';
        scrollButton.style.transition = 'opacity 0.3s';
        
        // Show/hide based on scroll position
        window.addEventListener('scroll', function() {
          if (window.scrollY > 500) {
            scrollButton.style.display = 'block';
          } else {
            scrollButton.style.display = 'none';
          }
        }, { passive: true });
        
        // Add hover effect
        scrollButton.addEventListener('mouseenter', function() {
          this.style.opacity = '1';
        });
        
        scrollButton.addEventListener('mouseleave', function() {
          this.style.opacity = '0.7';
        });
        
        // Scroll to top when clicked
        scrollButton.addEventListener('click', function() {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });
      }
    }
    
    // Check if footer needs theme updates based on user preferences
    function checkFooterTheme() {
      // Check if user has dark mode preference stored
      const darkModePreference = localStorage.getItem('gameHavenDarkMode');
      
      if (darkModePreference === 'true') {
        // Add dark mode class if not already present
        if (!document.body.classList.contains('dark-mode')) {
          document.body.classList.add('dark-mode');
        }
      }
    }
    
    // Public API
    return {
      init: function() {
        // Initialize footer when DOM is ready
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initFooter);
        } else {
          initFooter();
        }
      },
      
      // Update copyright year manually if needed
      updateCopyright: function() {
        updateCopyrightYear();
      },
      
      // Check and apply user preferences
      applyUserPreferences: function() {
        checkFooterTheme();
      },
      
      // Subscribe to newsletter programmatically
      subscribe: function(email) {
        if (isValidEmail(email)) {
          subscribeToNewsletter(email);
          return true;
        }
        return false;
      },
      
      // Check if footer is initialized
      isInitialized: function() {
        return isFooterLoaded;
      }
    };
  })();
  
  // Initialize the footer
  FooterModule.init();
  
  // Apply any user preferences
  FooterModule.applyUserPreferences();
  
  // CSS for newsletter messages
  const newsletterCss = `
  .newsletter-message {
    margin-top: 10px;
    padding: 8px 12px;
    border-radius: var(--border-radius-md);
    font-size: var(--font-sm);
    transition: opacity 0.3s ease;
  }
  
  .newsletter-message.success {
    background-color: rgba(76, 175, 80, 0.2);
    color: #81c784;
    border: 1px solid rgba(76, 175, 80, 0.3);
  }
  
  .newsletter-message.error {
    background-color: rgba(244, 67, 54, 0.2);
    color: #e57373;
    border: 1px solid rgba(244, 67, 54, 0.3);
  }
  
  .newsletter-message.fade-out {
    opacity: 0;
  }
  
  .active-link {
    color: var(--primary-light) !important;
    font-weight: 500;
  }
  `;
  
  // Add the CSS to the page
  const styleElement = document.createElement('style');
  styleElement.textContent = newsletterCss;
  document.head.appendChild(styleElement);