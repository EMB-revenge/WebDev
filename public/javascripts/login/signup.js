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

function isStrongPassword(value) {
  const s = String(value || '')
  if (s.length < 8) return false
  let upper = false, lower = false, digit = false
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (ch >= 'A' && ch <= 'Z') upper = true
    else if (ch >= 'a' && ch <= 'z') lower = true
    else if (ch >= '0' && ch <= '9') digit = true
  }
  return upper && lower && digit
}

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
    if (!isValidEmail(signupPayload.email)) {
      displayMessage('Please enter a valid email address', 'error')
      return
    }
    if (!isStrongPassword(signupPayload.password)) {
      displayMessage('Password must be at least 8 characters and include uppercase, lowercase, and a number', 'error')
      return
    }
    if (signupPayload.password !== signupPayload.repassword) {
      displayMessage('Passwords do not match', 'error')
      return
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
