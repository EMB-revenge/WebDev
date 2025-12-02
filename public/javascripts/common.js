export const select = (selector) => document.querySelector(selector);

export function displayMessage(message, type) {
  const messageElement = select('#message');
  if (!messageElement) return;
  messageElement.textContent = message;
  messageElement.className = `message ${type}`;
  messageElement.style.display = 'block';
  setTimeout(() => {
    if (messageElement) messageElement.style.display = 'none';
  }, 5000);
}
