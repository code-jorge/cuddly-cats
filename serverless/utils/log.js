export const log = (message)=> {
  const date = new Date().toLocaleDateString('en-GB')
  const time = new Date().toLocaleTimeString('en-GB', { hour12: false })
  console.log(`[LOG][${date} ${time}]: ${message}`)
}