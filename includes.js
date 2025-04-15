document.addEventListener('DOMContentLoaded', function () {
  // Load Header
  const headerPlaceholder = document.getElementById('header-placeholder');
  if (headerPlaceholder) {
    fetch('../Pages/header.html')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load header');
        return response.text();
      })
      .then(html => {
        headerPlaceholder.innerHTML = html;
      })
      .catch(error => {
        headerPlaceholder.innerHTML = '<p>Error loading header content.</p>';
      });
  }

  // Load Footer
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    fetch('../Pages/footer.html')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load footer');
        return response.text();
      })
      .then(html => {
        footerPlaceholder.innerHTML = html;
      })
      .catch(error => {
        footerPlaceholder.innerHTML = '<p>Error loading footer content.</p>';
      });
  }
});
