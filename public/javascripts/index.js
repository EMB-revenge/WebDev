import { select } from './common.js'

const contentContainer = select('#contentContainer')

async function fetchFragmentHtml(templatePath) {
  const response = await fetch(templatePath)
  const html = await response.text()
  contentContainer.innerHTML = html
}

async function renderLoginView() {
  await fetchFragmentHtml('/templates/login.html')
  const loginModule = await import('./login/login.js')
  loginModule.default()
}

async function renderSignupView() {
  await fetchFragmentHtml('/templates/signup.html')
  const signupModule = await import('./login/signup.js')
  signupModule.default()
}

select('#getLoginPageBtn')?.addEventListener('click', (event) => {
  event.preventDefault()
  renderLoginView()
})

select('#getSignupPageBtn')?.addEventListener('click', (event) => {
  event.preventDefault()
  renderSignupView()
})

document.addEventListener('click', (event) => {
  const target = event.target
  if (target && target.id === 'loginPageLink') {
    event.preventDefault()
    renderLoginView()
  } else if (target && target.id === 'signupPageLink') {
    event.preventDefault()
    renderSignupView()
  }
})

renderLoginView()
