// =====================================================
// TravelTech Solutions - Frontend Script
// =====================================================

let currentCountry = null;

// ---- TOAST ----
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast' + (type ? ' ' + type : '');
  setTimeout(() => { toast.className = 'toast hidden'; }, 3000);
}

// =====================================================
// CERCA DE PAÍS  (API externa: restcountries.com)
// =====================================================
async function searchCountry() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return;

  const resultDiv = document.getElementById('countryResult');
  resultDiv.className = 'country-card';
  resultDiv.innerHTML = '<p class="loading-msg">Cercant...</p>';

  try {
    const res = await fetch(`${CONFIG.COUNTRIES_API}/name/${encodeURIComponent(query)}?fullText=false`);
    if (!res.ok) throw new Error('País no trobat');
    const data = await res.json();
    const country = data[0];

    currentCountry = {
      name: country.name.common,
      official: country.name.official,
      capital: country.capital ? country.capital[0] : 'N/A',
      region: country.region,
      subregion: country.subregion || '',
      population: country.population.toLocaleString(),
      flag: country.flag || '',
      flagPng: country.flags ? country.flags.png : '',
      languages: country.languages ? Object.values(country.languages).join(', ') : 'N/A',
      currency: country.currencies
        ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol || ''})`).join(', ')
        : 'N/A'
    };

    resultDiv.innerHTML = `
      <div class="country-flag-img">
        ${currentCountry.flagPng
          ? `<img src="${currentCountry.flagPng}" alt="Bandera de ${currentCountry.name}" />`
          : `<span class="flag-emoji">${currentCountry.flag}</span>`}
      </div>
      <div class="country-info">
        <h3>${currentCountry.name}</h3>
        <p class="official-name">${currentCountry.official}</p>
        <div class="info-grid">
          <div class="info-item"><span>Capital</span>${currentCountry.capital}</div>
          <div class="info-item"><span>Regió</span>${currentCountry.region}</div>
          <div class="info-item"><span>Població</span>${currentCountry.population}</div>
          <div class="info-item"><span>Idiomes</span>${currentCountry.languages}</div>
          <div class="info-item"><span>Moneda</span>${currentCountry.currency}</div>
          <div class="info-item"><span>Subregió</span>${currentCountry.subregion || '—'}</div>
        </div>
      </div>
    `;

    // Mostrar botons d'acció als serveis
    document.getElementById('favForm').className = 'service-form';
    document.getElementById('visitedForm').className = 'service-form';
    document.getElementById('commentForm').className = 'service-form';

  } catch (err) {
    resultDiv.innerHTML = `<p class="error-msg">❌ ${err.message}</p>`;
    currentCountry = null;
  }
}

// Enter per cercar
document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') searchCountry();
});


// =====================================================
// FAVORITES SERVICE  (reutilitzat/adaptat de TravelTech)
// =====================================================

async function loadFavorites() {
  const list = document.getElementById('favoritesList');
  list.innerHTML = '<li class="loading-msg">Carregant...</li>';
  try {
    const res = await fetch(`${CONFIG.FAVORITES_API}/favorites`);
    const data = await res.json();
    if (!data.length) {
      list.innerHTML = '<li class="empty-msg">Encara no hi ha favorits</li>';
      return;
    }
    list.innerHTML = data.map(item => `
      <li>
        <div>
          <span class="item-name">${item.flag} ${item.name}</span>
          <div class="item-meta">${item.capital} · ${item.region}</div>
        </div>
        <button class="btn-delete" onclick="deleteFavorite('${item.id}')" title="Eliminar">✕</button>
      </li>
    `).join('');
  } catch {
    list.innerHTML = '<li class="empty-msg">No s\'ha pogut connectar amb el servei</li>';
  }
}

async function addFavorite() {
  if (!currentCountry) return;
  try {
    const res = await fetch(`${CONFIG.FAVORITES_API}/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: currentCountry.name,
        capital: currentCountry.capital,
        region: currentCountry.region,
        flag: currentCountry.flag
      })
    });
    if (res.status === 409) { showToast('Ja és a la llista de favorits', 'error'); return; }
    if (!res.ok) throw new Error();
    showToast(`${currentCountry.name} afegit als favorits ⭐`, 'success');
    loadFavorites();
  } catch {
    showToast('Error en afegir als favorits', 'error');
  }
}

async function deleteFavorite(id) {
  try {
    await fetch(`${CONFIG.FAVORITES_API}/favorites/${id}`, { method: 'DELETE' });
    showToast('Eliminat dels favorits');
    loadFavorites();
  } catch {
    showToast('Error en eliminar', 'error');
  }
}


// =====================================================
// VISITED SERVICE  (nou)
// =====================================================

async function loadVisited() {
  const list = document.getElementById('visitedList');
  list.innerHTML = '<li class="loading-msg">Carregant...</li>';
  try {
    const res = await fetch(`${CONFIG.VISITED_API}/visited`);
    const data = await res.json();
    if (!data.length) {
      list.innerHTML = '<li class="empty-msg">Encara no hi ha països visitats</li>';
      return;
    }
    list.innerHTML = data.map(item => `
      <li>
        <div>
          <span class="item-name">${item.flag} ${item.name}</span>
          <div class="item-meta">${item.capital} · ${item.region}</div>
          <div class="item-meta date">${new Date(item.visitedAt).toLocaleDateString('ca-ES', {day:'numeric', month:'short', year:'numeric'})}</div>
        </div>
        <button class="btn-delete" onclick="deleteVisited('${item.id}')" title="Eliminar">✕</button>
      </li>
    `).join('');
  } catch {
    list.innerHTML = '<li class="empty-msg">No s\'ha pogut connectar amb el servei</li>';
  }
}

async function addVisited() {
  if (!currentCountry) return;
  try {
    const res = await fetch(`${CONFIG.VISITED_API}/visited`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: currentCountry.name,
        capital: currentCountry.capital,
        region: currentCountry.region,
        flag: currentCountry.flag
      })
    });
    if (res.status === 409) { showToast('Aquest país ja està marcat com a visitat', 'error'); return; }
    if (!res.ok) throw new Error();
    showToast(`${currentCountry.name} marcat com a visitat 🌍`, 'success');
    loadVisited();
  } catch {
    showToast('Error en afegir als visitats', 'error');
  }
}

async function deleteVisited(id) {
  try {
    await fetch(`${CONFIG.VISITED_API}/visited/${id}`, { method: 'DELETE' });
    showToast('Eliminat dels visitats');
    loadVisited();
  } catch {
    showToast('Error en eliminar', 'error');
  }
}


// =====================================================
// COMMENTS SERVICE  (nou)
// =====================================================

async function loadComments() {
  const list = document.getElementById('commentsList');
  list.innerHTML = '<li class="loading-msg">Carregant...</li>';
  try {
    const res = await fetch(`${CONFIG.COMMENTS_API}/comments`);
    const data = await res.json();
    if (!data.length) {
      list.innerHTML = '<li class="empty-msg">Encara no hi ha comentaris</li>';
      return;
    }
    list.innerHTML = data.map(item => `
      <li>
        <div>
          <span class="item-name">${item.flag} ${item.country}</span>
          <div class="item-meta">${item.text}</div>
          <div class="item-meta date">${new Date(item.createdAt).toLocaleDateString('ca-ES', {day:'numeric', month:'short', year:'numeric'})}</div>
        </div>
        <button class="btn-delete" onclick="deleteComment('${item.id}')" title="Eliminar">✕</button>
      </li>
    `).join('');
  } catch {
    list.innerHTML = '<li class="empty-msg">No s\'ha pogut connectar amb el servei</li>';
  }
}

async function addComment() {
  if (!currentCountry) return;
  const text = document.getElementById('commentText').value.trim();
  if (!text) { showToast('Escriu un comentari primer', 'error'); return; }
  try {
    const res = await fetch(`${CONFIG.COMMENTS_API}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        country: currentCountry.name,
        flag: currentCountry.flag,
        text
      })
    });
    if (!res.ok) throw new Error();
    document.getElementById('commentText').value = '';
    showToast('Comentari afegit 💬', 'success');
    loadComments();
  } catch {
    showToast('Error en afegir el comentari', 'error');
  }
}

async function deleteComment(id) {
  try {
    await fetch(`${CONFIG.COMMENTS_API}/comments/${id}`, { method: 'DELETE' });
    showToast('Comentari eliminat');
    loadComments();
  } catch {
    showToast('Error en eliminar', 'error');
  }
}


// Càrrega inicial
loadFavorites();
loadVisited();
loadComments();
