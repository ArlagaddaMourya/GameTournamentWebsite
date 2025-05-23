// Load the header when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Add loading class to body during initial render
  document.body.classList.add('loading');
  
  // Fetch and inject the header
  fetch('pages/header.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('header-container').innerHTML = html;
      // Initialize the header functionality
      initHeader();
      // Remove loading class after a short delay to ensure smooth transition
      setTimeout(() => document.body.classList.remove('loading'), 200);
    })
    .catch(error => {
      console.error('Error loading header:', error);
      document.getElementById('header-container').innerHTML = '<p>Error loading header content.</p>';
      document.body.classList.remove('loading');
    });
});

document.addEventListener('DOMContentLoaded', function() {
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    fetch('pages/footer.html')
      .then(response => response.text())
      .then(html => {
        // footerContainer.innerHTML = html; // This line is redundant
        // footerContainer.innerHTML = html; // This line is redundant
        document.getElementById('footer-container').innerHTML = html;
        // Initialize the header functionality - This seems to be a bug, initHeader should not be called here again.
        // initHeader(); // Assuming this was a copy-paste error and removing it. 
        // If header re-initialization is truly needed for footer, it's a design smell.
        // Remove loading class after a short delay to ensure smooth transition
        // setTimeout(() => document.body.classList.remove('loading'), 200); // This is also likely tied to header loading, not footer.
      })
      .catch(error => {
        console.error('Error loading footer:', error);
        footerContainer.innerHTML = '<div class="error-message">Unable to load footer.</div>';
      });
  }
});

window.onload = function() {
  // Force scroll to top on page load/refresh
  window.scrollTo(0, 0);
  
  // Initialize your modals
  setupGameCardModals();
  setupTournamentModals();
};
