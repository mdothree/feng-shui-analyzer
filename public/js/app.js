import { firebaseConfig } from './config/firebase.js';
const elementInfo = {
  wood: { name: 'Wood', color: '#22c55e', crystals: [{ name: 'Jade', purpose: 'Growth & Vitality' }, { name: 'Green Aventurine', purpose: 'Prosperity' }] },
  fire: { name: 'Fire', color: '#ef4444', crystals: [{ name: 'Red Jasper', purpose: 'Energy & Passion' }, { name: 'Carnelian', purpose: 'Motivation' }] },
  earth: { name: 'Earth', color: '#a16207', crystals: [{ name: 'Tiger\'s Eye', purpose: 'Protection & Stability' }, { name: 'Yellow Jade', purpose: 'Nourishment' }] },
  metal: { name: 'Metal', color: '#94a3b8', crystals: [{ name: 'Clear Quartz', purpose: 'Clarity & Focus' }, { name: 'Silver Leaf Jasper', purpose: 'Precision' }] },
  water: { name: 'Water', color: '#3b82f6', crystals: [{ name: 'Blue Lace Agate', purpose: 'Calm & Flow' }, { name: 'Aquamarine', purpose: 'Peace & Communication' }] }
};

const directionInfo = {
  north: { element: 'water', tip: 'Use mirrors and water features to enhance career energy' },
  south: { element: 'fire', tip: 'Add bright lights and red items for fame and recognition' },
  east: { element: 'wood', tip: 'Plants and green colors promote health and family harmony' },
  west: { element: 'metal', tip: 'Circular shapes and white items enhance children and creativity' },
  northeast: { element: 'earth', tip: 'Crystals and earth tones support knowledge and self-cultivation' },
  northwest: { element: 'metal', tip: 'Metal objects and white colors attract helpful people' },
  southeast: { element: 'wood', tip: 'Wooden furniture and plants attract wealth and abundance' },
  southwest: { element: 'earth', tip: 'Earth tones and crystals enhance love and relationships' }
};

const recommendations = {
  living: ['Arrange seating to face the door for better social energy', 'Add plants to bring life force (Chi) into the space', 'Keep the area clutter-free to allow energy to flow freely'],
  bedroom: ['Position bed diagonally from the door for better rest', 'Avoid mirrors facing the bed to prevent sleep disturbances', 'Use soft, calming colors for relaxation'],
  kitchen: ['Keep the stove area clean and functional for wealth energy', 'Ensure good ventilation to let stagnant energy flow out', 'Fill cabinets completely to symbolize abundance'],
  office: ['Place desk facing the door but not directly in line with it', 'Add a plant for focus and creativity', 'Keep the space organized to enhance mental clarity'],
  bathroom: ['Use mirrors strategically to reflect positive energy back into the home', 'Keep the lid down on toilets to prevent energy from draining away', 'Add plants to absorb moisture and add life'],
  entrance: ['Ensure the entrance is well-lit to welcome positive energy', 'Remove obstacles that block the flow from entering', 'Add a welcome mat and plants to invite good Chi']
};

function analyzeFengShui(roomType, selectedElements, direction) {
  let score = 50;
  const elementScores = {};
  
  const allElements = ['wood', 'fire', 'earth', 'metal', 'water'];
  allElements.forEach(elem => {
    elementScores[elem] = selectedElements.includes(elem) ? 80 : 20;
  });
  
  if (selectedElements.length >= 3) score += 20;
  else if (selectedElements.length === 2) score += 10;
  
  if (direction) {
    const dirInfo = directionInfo[direction];
    if (selectedElements.includes(dirInfo.element)) score += 15;
  }
  
  const roomRecs = recommendations[roomType] || [];
  
  let crystals = [];
  selectedElements.forEach(elem => {
    if (elementInfo[elem]) {
      crystals.push(elementInfo[elem].crystals[0]);
    }
  });
  
  return { score: Math.min(95, score), elementScores, recommendations: roomRecs, crystals };
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase
    firebaseConfig.initialize().catch(console.warn);
  const analyzeBtn = document.getElementById('analyze-btn');
  const resultsSection = document.getElementById('results-section');
  const newBtn = document.getElementById('new-btn');
  
  analyzeBtn?.addEventListener('click', () => {
    const roomType = document.getElementById('room-type').value;
    const direction = document.getElementById('facing-direction').value;
    
    if (!roomType) { alert('Please select a room type'); return; }
    
    const selectedElements = [];
    ['wood', 'fire', 'earth', 'metal', 'water'].forEach(elem => {
      if (document.getElementById(`elem-${elem}`).checked) {
        selectedElements.push(elem);
      }
    });
    
    const results = analyzeFengShui(roomType, selectedElements, direction);
    displayResults(results);
  });
  
  newBtn?.addEventListener('click', () => {
    resultsSection.style.display = 'none';
    document.getElementById('room-type').value = '';
    document.getElementById('facing-direction').value = '';
    ['wood', 'fire', 'earth', 'metal', 'water'].forEach(elem => {
      document.getElementById(`elem-${elem}`).checked = false;
    });
  });
});

function displayResults(results) {
  document.getElementById('energy-score').textContent = results.score + '%';
  document.getElementById('energy-fill').style.width = results.score + '%';
  
  const elementBars = document.getElementById('element-bars');
  elementBars.innerHTML = Object.entries(results.elementScores).map(([elem, score]) => `
    <div class="element-bar">
      <div class="element-bar-fill" style="height: ${score}%; background: ${elementInfo[elem].color};"></div>
      <span class="element-bar-label">${elem.charAt(0).toUpperCase()}</span>
    </div>
  `).join('');
  
  const recsList = document.getElementById('recommendations-list');
  recsList.innerHTML = results.recommendations.map(r => `<li>✨ ${r}</li>`).join('');
  
  const crystalGrid = document.getElementById('crystal-grid');
  crystalGrid.innerHTML = results.crystals.map(c => `
    <div class="crystal-item">
      <span class="crystal-icon">💎</span>
      <span class="crystal-name">${c.name}</span>
      <span class="crystal-purpose">${c.purpose}</span>
    </div>
  `).join('');
  
  document.getElementById('results-section').style.display = 'block';
  document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
}
