const snippetInput = document.getElementById('snippet-input');
const annotateBtn   = document.getElementById('annotate-btn');
const outputDiv     = document.getElementById('annotation-output');
const lyricsDiv     = document.getElementById('lyrics');

lyricsDiv.addEventListener('mouseup', () => {
  const sel = window.getSelection().toString().trim();
  if (sel) snippetInput.value = sel;
});

annotateBtn.addEventListener('click', async () => {
  const selectedText = snippetInput.value.trim();
  const fullText     = lyricsDiv.textContent.trim();

  if (!selectedText) {
    outputDiv.textContent = 'Пожалуйста, введите или выделите отрывок для аннотации.';
    return;
  }

  outputDiv.textContent = 'Генерируем аннотацию…';

  try {
    const res = await fetch('http://localhost:8000/api/annotate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedText, fullText })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { annotation } = await res.json();
    outputDiv.textContent = annotation;
  } catch (err) {
    console.error(err);
    outputDiv.textContent = 'Ошибка при получении аннотации.';
  }
});
