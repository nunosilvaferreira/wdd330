// Theme Toggle Elements
const themeToggle = document.createElement('button');
themeToggle.id = 'theme-toggle';
themeToggle.innerHTML = '🌓';

// Set initial theme from localStorage or preference
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.body.classList.add(`theme-${savedTheme}`);
  themeToggle.setAttribute('aria-label', `Switch to ${savedTheme === 'light' ? 'dark' : 'light'} mode`);
  
  // Adjust Family Clinic colors for dark mode
  if (savedTheme === 'dark') {
    document.documentElement.style.setProperty('--primary-green', '#00a308');
    document.documentElement.style.setProperty('--light-bg', '#121212');
  }
}

// Toggle between themes
function toggleTheme() {
  const currentTheme = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.body.classList.replace(`theme-${currentTheme}`, `theme-${newTheme}`);
  localStorage.setItem('theme', newTheme);
  
  // Adjust colors for dark mode
  if (newTheme === 'dark') {
    document.documentElement.style.setProperty('--primary-green', '#00a308');
    document.documentElement.style.setProperty('--light-bg', '#121212');
  } else {
    document.documentElement.style.setProperty('--primary-green', '#005303');
    document.documentElement.style.setProperty('--light-bg', '#F5F5F5');
  }
  
  themeToggle.setAttribute('aria-label', `Switch to ${currentTheme} mode`);
}

// Initialize and add toggle button
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  
  // Add to header
  const header = document.querySelector('header');
  if (header) {
    themeToggle.addEventListener('click', toggleTheme);
    header.appendChild(themeToggle);
  }
});