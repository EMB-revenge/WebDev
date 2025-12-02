export const $ = (selector) => document.querySelector(selector);

export function showMessage(message, type) {
  const el = $('#message');
  if (!el) return;
  el.textContent = message;
  el.className = `message ${type}`;
  el.style.display = 'block';
  setTimeout(() => {
    if (el) el.style.display = 'none';
  }, 5000);
}
