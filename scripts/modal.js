function setupGameCardModals() {
    // Game data - using your existing data
    const gameData = {

      'Cyber Nexus': {
        category: 'Action',
        rating: '4.8',
        players: '2.3K',
        image: '/api/placeholder/900/600',
        description: 'Enter the world of Cyber Nexus, a high-octane action game where you battle in a dystopian future. Master your cybernetic enhancements and battle against rival factions in stunning environments.',
        features: ['Immersive Open World', 'Character Customization', 'Multiplayer Arenas', 'Story Campaign', 'Weekly Challenges', 'Customizable Weapons']
      },
      'Galactic Command': {
        category: 'Strategy',
        rating: '4.6',
        players: '1.8K',
        image: '/api/placeholder/900/600', 
        description: 'Command your fleet across the galaxy in this epic space strategy game. Build alliances, manage resources, and engage in tactical battles to expand your cosmic empire and protect your territory from rival factions.',
        features: ['Real-time Strategy', 'Fleet Customization', 'Resource Management', 'Diplomacy System', 'PvP Battles', 'Alliance Gameplay']
      },
      'Eternal Realms': {
        category: 'RPG',
        rating: '4.9',
        players: '3.1K',
        image: '/api/placeholder/900/600', 
        description: 'Embark on an epic journey through magical lands filled with mystical creatures and ancient powers. Create your unique character, master various skills, and uncover the secrets of the Eternal Realms.',
        features: ['Open World Exploration', 'Character Progression', 'Epic Quests', 'Crafting System', 'Guild Mechanics', 'PvE & PvP Content']
      },
      'Tactical Ops': {
        category: 'Shooter',
        rating: '4.7',
        players: '2.9K',
        image: '/api/placeholder/900/600',
        description: 'Join elite special forces in high-stakes tactical operations around the world. Master weapons, coordinate with your team, and complete objectives in this intense first-person shooter experience.',
        features: ['Team-based Gameplay', 'Realistic Weapons', 'Multiple Game Modes', 'Seasonal Rankings', 'Custom Loadouts', 'Strategic Maps']
      },
      'Snake Game': {  
      category: 'Arcade',  
      rating: '4.2',  
      players: '5.0K',  
      image: '/public/images/snakeGame.jpg',   
      description: 'Classic Snake Game with smooth controls and challenging levels. Guide your snake to eat food and grow longer without crashing into the walls or yourself. Perfect for quick fun and improving reflexes.',  
      features: [  
        'Classic Gameplay','Multiple Levels',  'Simple Controls', 'High Score Tracking', 'Mobile Friendly', 'Retro Graphics'],
        Url: '/pages/Games/snakeGame.html'   
     },
      'Slide Number Game': {  
      category: 'Puzzle',  
      rating: '4.5',  
      players: '3.2K',  
      image: '/public/images/slideNumberGame.jpg',  
      description: 'Engage your brain with the classic Slide Number Puzzle. Slide the numbered tiles to arrange them in numerical order, testing your problem-solving skills and patience. A perfect mix of challenge and fun for all ages.',  
      features: [  
        'Classic Puzzle Gameplay',  
        'Multiple Difficulty Levels',  
        'Smooth Sliding Animations',  
        'Timer and Moves Tracking',  
        'Mobile Friendly',  
        'Clean and Minimalist Design'  
      ],  
      Url: '/pages/Games/slideNumberGame.html'  
    },
    'Image Matching': {  
      category: 'Puzzle',  
      rating: '4.3',  
      players: '4.5K',  
      image: '/public/images/imageMatching.jpg',  
      description: 'Test your memory and concentration with the Image Matching game. Flip cards to find pairs of matching images. Fun and addictive gameplay suitable for players of all ages.',  
      features: [  
        'Classic Memory Match Gameplay',  
        'Variety of Image Themes',  
        'Time Challenge Mode',  
        'Simple and Intuitive Controls',  
        'Mobile Friendly',  
        'Colorful Graphics'  
      ],  
      Url: '/pages/Games/imageMatching.html'  
    },  

    'Color Puzzle': {  
      category: 'Puzzle',  
      rating: '4.6',  
      players: '3.8K',  
      image: '/public/images/colorPuzzle.jpg',  
      description: 'Train your brain with the Color Puzzle game. Arrange and match colors by solving fun and challenging puzzles. A great way to improve logical thinking and color recognition.',  
      features: [  
        'Unique Color Matching Mechanics',  
        'Multiple Challenging Levels',  
        'Smooth and Responsive Controls',  
        'Progress Tracking',  
        'Mobile Friendly',  
        'Bright and Engaging Visuals'  
      ],  
      Url: '/pages/Games/colorPuzzle.html'  
    },       
};
  
    // Create modal container only if it doesn't exist
    let modalContainer = document.querySelector('.game-modal-container');
    if (!modalContainer) {
      modalContainer = document.createElement('div');
      modalContainer.className = 'game-modal-container';
      document.body.appendChild(modalContainer);
      
      // Create close button
      const closeButton = document.createElement('div');
      closeButton.className = 'close-modal';
      closeButton.innerHTML = '<i class="fas fa-times"></i>';
      modalContainer.appendChild(closeButton);
      
      // Close on button click
      closeButton.addEventListener('click', () => closeGameModal(modalContainer));
      
      // Close on ESC key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeGameModal(modalContainer);
      });
      
      // Close when clicking outside the modal
      modalContainer.addEventListener('click', function(e) {
        if (e.target === modalContainer) closeGameModal(modalContainer);
      });
    }
    
    // Add click event to all game cards
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
      card.addEventListener('click', function(e) {
        // Prevent clicking on "Play Now" button from opening modal
        if (e.target.classList.contains('play-now')) return;
        
        const gameTitle = card.querySelector('h3').textContent;
        const game = gameData[gameTitle];
        
        if (!game) {
          console.error(`Game data not found for: ${gameTitle}`);
          return;
        }
        
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
                <button  
                  class="play-now-expanded"  
                  onclick="startGame('${game.Url || '#'}')">  
                  Start Game  
                </button>  
              </div>
            </div>
          </div>
        `;
        
        // Set modal content and show
        modalContainer.innerHTML = '';
        modalContainer.insertAdjacentHTML('beforeend', modalContent);
        
        // Re-add close button after changing innerHTML
        const closeButton = document.createElement('div');
        closeButton.className = 'close-modal';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        modalContainer.appendChild(closeButton);
        closeButton.addEventListener('click', () => closeGameModal(modalContainer));
        
        // Activate modal with slight delay for smooth transition
        requestAnimationFrame(() => {
          modalContainer.classList.add('active');
          setTimeout(() => {
            const gameModal = document.querySelector('.game-modal');
            if (gameModal) {
              gameModal.classList.add('active');
            }
          }, 100);
        });
      });
    });
  }
  
  function closeGameModal(modalContainer) {
    const modal = document.querySelector('.game-modal');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        modalContainer.classList.remove('active');
      }, 300);
    }
  }
  function startGame(url) {  
    if (url) {  
      window.location.href = url;  
    } else {  
      console.error('Game URL not found');  
    }  
  }  
  
  function setupTournamentModals() {
    const tournamentButtons = document.querySelectorAll('.tournament-btn');
    const modalBackdrop = document.querySelector('.tournament-modal-backdrop');
    
    if (!modalBackdrop) {
      console.error('Tournament modal backdrop not found');
      return;
    }
    
    const modalClose = modalBackdrop.querySelector('.tournament-modal-close');
    const registerBtn = modalBackdrop.querySelector('.tournament-register-btn');
    
    // Open modal when clicking tournament buttons
    tournamentButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        openTournamentModal(modalBackdrop);
      });
    });
    
    // Close modal functions
    if (modalClose) {
      modalClose.addEventListener('click', () => closeTournamentModal(modalBackdrop));
    }
    
    modalBackdrop.addEventListener('click', function(e) {
      if (e.target === modalBackdrop) {
        closeTournamentModal(modalBackdrop);
      }
    });
    
    // Register button functionality
    if (registerBtn) {
      registerBtn.addEventListener('click', function() {
        window.location.href = 'register.html';
      });
    }
  }
  
  function openTournamentModal(modalBackdrop) {
    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeTournamentModal(modalBackdrop) {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.addEventListener('DOMContentLoaded', function() {
    setupGameCardModals();
    setupTournamentModals();
  });