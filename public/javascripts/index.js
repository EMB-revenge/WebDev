import { $ } from './common.js'

const content = $('#contentContainer')

async function loadFragment(path) {
  const res = await fetch(path)
  const html = await res.text()
  content.innerHTML = html
}

async function showLogin() {
  await loadFragment('/templates/login.html')
  const mod = await import('./login/login.js')
  mod.default()
}

async function showSignup() {
  await loadFragment('/templates/signup.html')
  const mod = await import('./login/signup.js')
  mod.default()
}

$('#getLoginPageBtn')?.addEventListener('click', (e) => {
  e.preventDefault()
  showLogin()
})

$('#getSignupPageBtn')?.addEventListener('click', (e) => {
  e.preventDefault()
  showSignup()
})

// Delegated links inside fragments
document.addEventListener('click', (e) => {
  const t = e.target
  if (t && t.id === 'loginPageLink') {
    e.preventDefault()
    showLogin()
  } else if (t && t.id === 'signupPageLink') {
    e.preventDefault()
    showSignup()
  }
})

// Default view
showSignup()
