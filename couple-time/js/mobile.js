// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

// Toggle mobile menu with animation
function toggleMobileMenu() {
  const isExpanded = mobileNav.style.display === 'flex';
  
  if (isExpanded) {
    mobileNav.style.animation = 'slideUp 0.3s forwards';
    setTimeout(() => {
      mobileNav.style.display = 'none';
    }, 300);
  } else {
    mobileNav.style.display = 'flex';
    mobileNav.style.animation = 'slideDown 0.3s forwards';
  }
  
  // Animate hamburger icon
  menuToggle.textContent = isExpanded ? '☰' : '✕';
}

// Event Listeners
menuToggle.addEventListener('click', toggleMobileMenu);

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.mobile-nav') && !e.target.closest('#menu-toggle')) {
    mobileNav.style.display = 'none';
    menuToggle.textContent = '☰';
  }
});

// Handle orientation changes
window.addEventListener('orientationchange', () => {
  if (window.innerWidth > 768) {
    mobileNav.style.display = 'none';
    menuToggle.textContent = '☰';
  }
});