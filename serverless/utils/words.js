import words from './words.json'

const seededRandom = (seed)=> {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export const getWords = (numWords)=> {
  const selectedWords = []
  const today = new Date().toISOString().split('T')[0]
  let seed = Array.from(today).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  while (selectedWords.length < numWords) {
    const randomIndex = Math.floor(seededRandom(seed++) * words.length)
    const word = words[randomIndex % words.length]
    if (!selectedWords.includes(word)) {
      selectedWords.push(word)
    }
  }
  return selectedWords
}
