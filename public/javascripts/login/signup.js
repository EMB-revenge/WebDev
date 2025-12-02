import { select, displayMessage } from '../common.js'

export default function initSignup() {
  const signupForm = select('#signupForm')
  if (!signupForm) return
  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    const formData = new FormData(signupForm)
    const signupPayload = {
      firstname: formData.get('firstname'),
      lastname: formData.get('lastname'),
      email: formData.get('email'),
      birthdate: formData.get('birthdate'),
      password: formData.get('password'),
      repassword: formData.get('repassword')
    }
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupPayload)
      })
      const data = await response.json()
      if (data.success) {
        displayMessage(data.message, 'success')
        signupForm.reset()
        setTimeout(() => {
          window.location.href = '/login'
        }, 800)
      } else {
        displayMessage(data.message, 'error')
      }
    } catch (error) {
      displayMessage('An error occurred. Please try again.', 'error')
      console.error('Signup error:', error)
    }
  })
}
