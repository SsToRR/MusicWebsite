const LASTFM_KEY = '337919db63839c44167b65218c74435c';

const params = new URLSearchParams(window.location.search);
const artist = params.get('artist');
const track  = params.get('track');

async function fetchTrackInfo() {
  const url =
    `https://ws.audioscrobbler.com/2.0/` +
    `?method=track.getInfo` +
    `&api_key=${LASTFM_KEY}` +
    `&artist=${encodeURIComponent(artist)}` +
    `&track=${encodeURIComponent(track)}` +
    `&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Last.fm error ' + res.status);
  const data = await res.json();
  return data.track;
}

async function fetchLyrics() {
  const url =
    `https://api.lyrics.ovh/v1/` +
    `${encodeURIComponent(artist)}/` +
    `${encodeURIComponent(track)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Lyrics.ovh error ' + res.status);
  const data = await res.json();
  return data.lyrics;
}

async function renderSong() {
  try {
    const info = await fetchTrackInfo();
    document.getElementById('track-title').textContent  = info.name;
    document.getElementById('track-artist').textContent = 'Исполнитель: ' + info.artist.name;
    document.getElementById('track-album').textContent  =
      info.album?.title ? 'Альбом: ' + info.album.title : 'Альбом: —';

    let lyrics;
    try {
      lyrics = await fetchLyrics();
    } catch {
      lyrics = 'Текст не найден.';
    }
    const lyricsContainer = document.getElementById('lyrics');
    lyricsContainer.innerHTML = "";
    lyrics.split("\n").forEach(line => {
      const p = document.createElement("p");
      p.className = "lyric-line";
      p.textContent = line || "\u00A0";
      lyricsContainer.appendChild(p);
    });
  } catch (e) {
    console.error(e);
    document.getElementById('lyrics').textContent = 'Не удалось загрузить данные.';
  }
}

renderSong();
