const getAttribute = (element, attribute)=> {
  return element.getAttribute(`data-${attribute}`)
}

const setAttribute = (element, attribute, value)=> {
  element.setAttribute(`data-${attribute}`, value)
}

const setText = (element, text)=> {
  element.textContent = text
}

const showElement = (element)=> {
  if (!element.classList.contains("visible")) element.classList.add("visible")
  if (element.classList.contains("hidden")) element.classList.remove("hidden")
}

const hideElement = (element)=> {
  if (!element.classList.contains("hidden")) element.classList.add("hidden")
  if (element.classList.contains("visible")) element.classList.remove("visible")
}

const handleSuccess = ({ message, show })=> {
  const banner = document.getElementById("success-banner")
  if (show) {
    banner.firstChild.nodeValue = message
    showElement(banner)
  } else {
    banner.firstChild.nodeValue = ""
    hideElement(banner)
  }
}

const handleError = ({ message, show })=> {
  const banner = document.getElementById("error-banner")
  if (show) {
    banner.firstChild.nodeValue = message
    showElement(banner)
  } else {
    banner.firstChild.nodeValue = ""
    hideElement(banner)
  }
}

const showSuccess = (message)=> handleSuccess({ message, show: true })
const hideSuccess = ()=> handleSuccess({ show: false })

const showError = (message)=> handleError({ message, show: true })
const hideError = ()=> handleError({ show: false })

const logError = (message, error)=> console.error(`${message}:`, error)

document.addEventListener("DOMContentLoaded", async () => {
  const errorCloseButtonElement = document.getElementById('error-close')
  const successCloseButtonElement = document.getElementById('success-close')
  errorCloseButtonElement.addEventListener('click', hideError)
  successCloseButtonElement.addEventListener('click', hideSuccess)
})