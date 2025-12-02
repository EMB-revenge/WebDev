import { select, displayMessage } from '../common.js'

function isValidEmail(value) {
  const str = String(value || '').toLowerCase().trim()
  const atIndex = str.indexOf('@')
  if (atIndex <= 0) return false
  const dotIndex = str.indexOf('.', atIndex + 1)
  if (dotIndex <= atIndex + 1) return false
  if (dotIndex >= str.length - 1) return false
  return true
}

export default function initLogin() {
  const loginForm = select('#loginForm')
  if (!loginForm) return
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    const formData = new FormData(loginForm)
    const loginPayload = {
      email: formData.get('email'),
      password: formData.get('password')
    }
    if (!isValidEmail(loginPayload.email)) {
      displayMessage('Please enter a valid email address', 'error')
      return
    }
    if (!loginPayload.password) {
      displayMessage('Password is required', 'error')
      return
    }
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginPayload)
      })
      const data = await response.json()
      if (data.success) {
        displayMessage(`Welcome back, ${data.user.firstname}!`, 'success')
        loginForm.reset()
      } else {
        displayMessage(data.message, 'error')
      }
    } catch (error) {
      displayMessage('An error occurred. Please try again.', 'error')
      console.error('Login error:', error)
    }
  })
}
