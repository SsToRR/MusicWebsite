const API_KEY = '337919db63839c44167b65218c74435c';

const listEl = document.getElementById('track-list');
const limit  = listEl?.dataset.limit || 10;

const API_URL = `https://ws.audioscrobbler.com/2.0/` +
  `?method=chart.getTopTracks` +
  `&api_key=${API_KEY}` +
  `&format=json` +
  `&limit=${limit}`;

async function fetchTopTracks() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { tracks: { track } } = await res.json();
    renderTracks(track);
  } catch {
    listEl.innerHTML = `<li class="track-item">Ошибка загрузки данных.</li>`;
  }
}

function renderTracks(tracks) {
  listEl.innerHTML = '';
  tracks.forEach((t, i) => {
    const li = document.createElement('li');
    li.className = 'track-item';

    const a = document.createElement('a');
    a.className = 'track-link';
    a.href = `song.html?artist=${encodeURIComponent(t.artist.name)}` +
             `&track=${encodeURIComponent(t.name)}`;

    // добавляем нумерацию
    a.textContent = `${i + 1}. ${t.artist.name} – ${t.name}`;

    li.appendChild(a);
    listEl.appendChild(li);
  });
}

if (listEl) fetchTopTracks();
