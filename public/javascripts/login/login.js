import { $, showMessage } from '../common.js'

export default function initLogin() {
  const form = $('#loginForm')
  if (!form) return
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const fd = new FormData(form)
    const payload = {
      email: fd.get('email'),
      password: fd.get('password')
    }
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const result = await res.json()
      if (result.success) {
        showMessage(`Welcome back, ${result.user.firstname}!`, 'success')
        form.reset()
      } else {
        showMessage(result.message, 'error')
      }
    } catch (err) {
      showMessage('An error occurred. Please try again.', 'error')
      console.error('Login error:', err)
    }
  })
}
