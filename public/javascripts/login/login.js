import { select, displayMessage } from '../common.js'

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
