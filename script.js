const form = document.getElementById('form');
const result = document.getElementById('result');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData();
  fd.append('images', img1.files[0]);
  fd.append('images', img2.files[0]);

  result.src = '';
  const res = await fetch('/merge', { method: 'POST', body: fd });
  const data = await res.json();
  if (data.url) result.src = data.url;
  else alert('فشل الدمج');
});
