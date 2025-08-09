// DOM Elements
const activityDisplay = document.getElementById('activity-display');
const activityButton = document.querySelector('.cta-button');

// Fetch Couple Activity from BoredAPI
async function fetchCoupleActivity() {
  try {
    activityButton.disabled = true;
    activityButton.textContent = 'Loading...';
    
    const response = await fetch('https://www.boredapi.com/api/activity?participants=2');
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    // Apply Family Clinic color coding by activity type
    const activityType = data.type.toLowerCase();
    let typeColor = '';
    
    switch(activityType) {
      case 'social': 
        typeColor = 'var(--primary-green)';
        break;
      case 'recreational':
        typeColor = 'var(--secondary-orange)';
        break;
      default:
        typeColor = 'var(--accent-brown)';
    }
    
    activityDisplay.innerHTML = `
      <p style="color: ${typeColor}; font-weight: 600;">${data.activity}</p>
      <small>Type: ${data.type} | Participants: ${data.participants}</small>
    `;
    
  } catch (error) {
    activityDisplay.innerHTML = `
      <p class="error">Couldn't load activity. Try again later.</p>
      <small>${error.message}</small>
    `;
    console.error('API Error:', error);
  } finally {
    activityButton.disabled = false;
    activityButton.textContent = 'Get New Activity';
  }
}

// fallback local
const localActivities = [
  "Cook a meal together blindfolded",
  "Write each other love letters",
  "Plan your dream vacation"
];

function getFallbackActivity() {
  return {
    activity: localActivities[Math.floor(Math.random() * localActivities.length)],
    type: "fallback"
  };
}


// Event Listeners
activityButton.addEventListener('click', fetchCoupleActivity);

// Initialize first activity
document.addEventListener('DOMContentLoaded', fetchCoupleActivity);