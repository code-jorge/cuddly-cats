import words from './words.json'

const randomIndex = (hash, offset, limit)=> {
  const base = Math.floor(Math.abs(Math.sin(hash + offset) * 10000))
  return base % limit
}

export const getWords = (numWords)=> {
  const selectedWords = []
  const today = new Date().toISOString().split('T')[0]
  const hash = Array.from(today).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  // Generate deterministic "random" indices
  let offset = 0;
  while (selectedWords.length < numWords) {
    const index = randomIndex(hash, offset++, words.length)
    const word = words[index]
    if (!selectedWords.includes(word)) selectedWords.push(word)
  }
  return selectedWords
}
