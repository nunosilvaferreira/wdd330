/* Couple Time – app.js
   Demonstrates:
   - JavaScript modules and non-trivial logic
   - Third-party APIs (3 endpoints): Bored API, DummyJSON Recipes, Quotable
   - JSON arrays/objects with 8+ unique attributes (recipes endpoint)
   - 5+ DOM events (clicks, submit, change, keyup)
   - LocalStorage for settings, favorites, and memories (array of objects incl. images as dataURL)
*/
const $ = (s, ctx=document) => ctx.querySelector(s);
const $$ = (s, ctx=document) => [...ctx.querySelectorAll(s)];

const els = {
  challengeCard: $('#challenge-card'),
  challengeText: $('.challenge-text'),
  challengeMeta: $('#challenge-meta'),
  btnGenerate: $('#btn-generate'),
  btnComplete: $('#btn-complete'),
  btnFavorite: $('#btn-favorite'),

  recipeCard: $('#recipe-card'),
  recipeContent: $('#recipe-content'),
  btnRecipe: $('#btn-recipe'),

  tipText: $('#tip-text'),
  tipAuthor: $('#tip-author'),
  btnTip: $('#btn-tip'),

  memoriesList: $('#memories-list'),
  memoryForm: $('#memory-form'),
  memoryDate: $('#memory-date'),
  memoryNote: $('#memory-note'),
  memoryPhoto: $('#memory-photo'),

  favoritesList: $('#favorites-list'),

  settingsDialog: $('#settings-dialog'),
  btnSettings: $('#btn-settings'),
  saveSettings: $('#save-settings'),
  meName: $('#me-name'),
  partnerName: $('#partner-name'),
  themeToggle: $('#theme-toggle'),
};

// ---------- State & Storage ----------
const store = {
  get key(){ return 'couple-time:v1'; },
  load(){
    const raw = localStorage.getItem(this.key);
    return raw ? JSON.parse(raw) : { settings:{ me:'', partner:'', dark:false }, favorites:[], memories:[], streak:0, lastCompleted:null };
  },
  save(data){ localStorage.setItem(this.key, JSON.stringify(data)); },
};
let state = store.load();

function applyTheme(){
  document.documentElement.setAttribute('data-theme', state.settings.dark ? 'dark' : 'light');
  els.themeToggle.checked = !!state.settings.dark;
}

// ---------- Utilities ----------
function titleCase(s){ return s ? s[0].toUpperCase() + s.slice(1) : s; }
function fmtPrice(p){ if(p===0) return 'Free'; if(p<0.2) return 'Low'; if(p<0.5) return 'Medium'; return 'High'; }
function safeHTML(str){ const d=document.createElement('div'); d.textContent = str; return d.innerHTML; }

// ---------- APIs ----------
// 1) Bored API: random activity for 2 participants
async function getChallenge() {
  const res = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random');
  const data = await res.json();
  return {
    activity: `Debate this fact: "${data.text}"`, // Turn the fact into a topic
    type: "couple",
    participants: 2,
    price: 0,
    key: "fact_" + Date.now()
  };
}
// 2) DummyJSON: random recipe (rich JSON 8+ attrs)
async function getRecipe(){
  const res = await fetch('https://dummyjson.com/recipes/1');
  if(!res.ok) throw new Error('Recipe API failed');
  return res.json(); // {recipes: [ { ... many attributes ... } ]}
}

// 3) Quotable: quote tagged love/friendship
async function getTip() {
  try {
    const res = await fetch('https://api.quotable.io/random?tags=love|friendship');
    if (!res.ok) throw new Error('Quote API failed');
    return res.json();
  } catch (err) {
    // Fallback quote
    return {
      content: "The best thing to hold onto in life is each other.",
      author: "Audrey Hepburn"
    };
  }
}

// ---------- Renderers ----------
function renderChallenge(data){
  const { activity, type, participants, price, accessibility, key, link } = data;
  els.challengeText.innerHTML = safeHTML(activity);
  els.challengeMeta.innerHTML = `
    <li><strong>Type:</strong> ${titleCase(type)}</li>
    <li><strong>Participants:</strong> ${participants}</li>
    <li><strong>Price:</strong> ${fmtPrice(price)}</li>
    <li><strong>Accessibility:</strong> ${Math.round(accessibility*100)}%</li>
    <li><strong>Key:</strong> ${key}</li>
    ${link ? `<li><a href="${link}" target="_blank" rel="noopener">More info</a></li>` : ''}
  `;
  els.btnComplete.disabled = false;
  els.btnFavorite.disabled = false;
  els.challengeCard.classList.add('flipped');
  setTimeout(()=> els.challengeCard.classList.remove('flipped'), 1800);
}

function renderRecipe(payload){
  const r = (payload.recipes && payload.recipes[0]) ? payload.recipes[0] : payload;
  const ingredients = (r.ingredients || []).slice(0,8).map(i=>`<li>${safeHTML(i)}</li>`).join('');
  const instructions = Array.isArray(r.instructions) ? r.instructions.map(step=>`<li>${safeHTML(step)}</li>`).join('') : `<li>${safeHTML(r.instructions || '')}</li>`;
  els.recipeContent.innerHTML = `
    <article class="recipe">
      <h3>${safeHTML(r.name || 'Recipe')}</h3>
      <p><strong>Ready in:</strong> ${r.cookTimeMinutes || r.prepTimeMinutes || '?'} mins • <strong>Servings:</strong> ${r.servings || '?'}</p>
      <details>
        <summary>Ingredients</summary>
        <ul>${ingredients}</ul>
      </details>
      <details>
        <summary>Instructions</summary>
        <ol>${instructions}</ol>
      </details>
    </article>
  `;
}

function renderTip(q){
  els.tipText.textContent = `“${q.content}”`;
  els.tipAuthor.textContent = q.author ? `— ${q.author}` : '';
}

// ---------- Favorites ----------
function addFavorite(text, meta){
  state.favorites.unshift({ id: crypto.randomUUID(), text, meta, savedAt: Date.now() });
  store.save(state);
  renderFavorites();
}
function removeFavorite(id){
  state.favorites = state.favorites.filter(f=>f.id!==id);
  store.save(state);
  renderFavorites();
}
function renderFavorites(){
  els.favoritesList.innerHTML = state.favorites.map(f=>`
    <li class="favorite">
      <span>${safeHTML(f.text)}</span>
      <button data-id="${f.id}" class="btn outline small remove-fav">Remove</button>
    </li>
  `).join('') || '<li>No favorites yet.</li>';
  $$('.remove-fav').forEach(btn=> btn.addEventListener('click', e=>{
    removeFavorite(e.currentTarget.dataset.id);
  }));
}

// ---------- Memories ----------
function renderMemories(){
  els.memoriesList.innerHTML = state.memories.map(m=>`
    <li>
      ${m.photo ? `<img alt="" src="${m.photo}" loading="lazy">` : ''}
      <div class="meta"><time>${new Date(m.date).toLocaleDateString()}</time><button data-id="${m.id}" class="icon-btn del" title="Delete memory">🗑</button></div>
      <p class="note">${safeHTML(m.note)}</p>
    </li>
  `).join('');
  $$('.del').forEach(btn=> btn.addEventListener('click', (e)=>{
    const id = e.currentTarget.dataset.id;
    state.memories = state.memories.filter(m=>m.id!==id);
    store.save(state);
    renderMemories();
  }));
}

// ---------- Events ----------
els.btnGenerate.addEventListener('click', async ()=>{
  els.btnGenerate.disabled = true;
  try{
    const data = await getChallenge();
    renderChallenge(data);
    els.btnGenerate.textContent = 'New Challenge';
  }catch(err){
    els.challengeText.textContent = 'Failed to fetch a challenge. Please try again.';
    console.error(err);
  }finally{
    els.btnGenerate.disabled = false;
  }
});

els.btnComplete.addEventListener('click', ()=>{
  const today = new Date().toDateString();
  if(state.lastCompleted !== today){
    state.streak = (state.lastCompleted === new Date(Date.now()-86400000).toDateString())
      ? state.streak + 1
      : 1;
    state.lastCompleted = today;
    store.save(state);
  }
  els.btnComplete.textContent = `Completed ✔ (Streak: ${state.streak})`;
  els.btnComplete.classList.add('pulse');
  setTimeout(()=> els.btnComplete.classList.remove('pulse'), 900);
});

els.btnFavorite.addEventListener('click', ()=>{
  const text = els.challengeText?.textContent?.trim();
  const meta = els.challengeMeta?.textContent?.trim();
  if(text){
    addFavorite(text, meta);
  }
});

els.btnRecipe.addEventListener('click', async ()=>{
  els.btnRecipe.disabled = true;
  try{
    const data = await getRecipe();
    renderRecipe(data);
  }catch(err){
    els.recipeContent.textContent = 'Failed to fetch a recipe. Please try again.';
    console.error(err);
  }finally{
    els.btnRecipe.disabled = false;
  }
});

els.btnTip.addEventListener('click', async ()=>{
  els.btnTip.disabled = true;
  try{
    const tip = await getTip();
    renderTip(tip);
  }catch(err){
    els.tipText.textContent = 'Could not load a tip right now.';
    console.error(err);
  }finally{
    els.btnTip.disabled = false;
  }
});

els.memoryForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const date = els.memoryDate.value || new Date().toISOString().slice(0,10);
  const note = els.memoryNote.value.trim();
  if(!note) return;
  let photo = '';
  const file = els.memoryPhoto.files[0];
  if(file){
    photo = await new Promise((resolve)=>{
      const rdr = new FileReader();
      rdr.onload = ()=> resolve(rdr.result);
      rdr.readAsDataURL(file);
    });
  }
  state.memories.unshift({ id: crypto.randomUUID(), date, note, photo });
  store.save(state);
  els.memoryForm.reset();
  renderMemories();
});

// Settings dialog
els.btnSettings.addEventListener('click', ()=> els.settingsDialog.showModal());
els.saveSettings.addEventListener('click', ()=>{
  state.settings.me = els.meName.value.trim();
  state.settings.partner = els.partnerName.value.trim();
  state.settings.dark = !!els.themeToggle.checked;
  store.save(state);
  applyTheme();
});

// Keyboard shortcut: press 't' to toggle theme
document.addEventListener('keyup', (e)=>{
  if(e.key.toLowerCase() === 't'){
    state.settings.dark = !state.settings.dark;
    store.save(state);
    applyTheme();
  }
});

// Restore on load
function init(){
  applyTheme();
  els.meName.value = state.settings.me || '';
  els.partnerName.value = state.settings.partner || '';
  renderFavorites();
  renderMemories();
}
init();
