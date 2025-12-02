import { $, showMessage } from '../common.js'

export default function initSignup() {
  const form = $('#signupForm')
  if (!form) return
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const fd = new FormData(form)
    const payload = {
      firstname: fd.get('firstname'),
      lastname: fd.get('lastname'),
      email: fd.get('email'),
      birthdate: fd.get('birthdate'),
      password: fd.get('password'),
      repassword: fd.get('repassword')
    }
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const result = await res.json()
      if (result.success) {
        showMessage(result.message, 'success')
        form.reset()
        setTimeout(() => {
          window.location.href = '/login'
        }, 800)
      } else {
        showMessage(result.message, 'error')
      }
    } catch (err) {
      showMessage('An error occurred. Please try again.', 'error')
      console.error('Signup error:', err)
    }
  })
}
