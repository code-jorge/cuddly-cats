import { types, actions, locations } from './video-prompt.json'

const OPENAI_API_KEY = process.env.PROJECT_OPENAI_API_KEY
const OPENAI_API_URL = 'https://api.openai.com/v1'

const getRandomBoolean = ()=> Math.random() < 0.5

const getRandomNumber = (max) => Math.floor(Math.random() * (max + 1))

const getBooleanWithProbability = (probability) => Math.random() < probability

const getAnimal = () => {
  return getRandomBoolean() ? "cat" : "kitten"
}

const getType = () => {
  const useType = getBooleanWithProbability(0.25)
  if (useType) return types[getRandomNumber(types.length - 1)]
  return "ordinary"
}

const getAction = () => {
  return actions[getRandomNumber(actions.length - 1)]
}

const getLocation = () => {
  return locations[getRandomNumber(locations.length - 1)]
}

export const getPrompt = (tags) => {
  const type = getType()
  const animal = getAnimal()
  const action = getAction()
  const location = getLocation()
  return `
    A smooth, cinematic video capturing a lifelike ${type} ${animal}.
    The ${animal} looks content and relaxed, ${action}.
    It is situated ${location}.
    The scene is inspired by ${tags.join(" and ")}, featuring natural movement and intricate details.
    The camera is steady with soft lighting.
  `
}

export const getVideo = async (prompt)=> {
  const response = await fetch(`${OPENAI_API_URL}/videos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'sora-2-pro',
      prompt: prompt,
      size: '720x1280',
      seconds: '8',
    })
  })
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create video: ${error}`)
  }
  const data = await response.json()
  return data
}

export const checkVideo = async (videoId) => {
  const response = await fetch(`${OPENAI_API_URL}/videos/${videoId}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
  })
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to retrieve video: ${error}`)
  }
  const video = await response.json()
  return video.status
}

export const downloadVideo = async (videoId) => {
  const response = await fetch(`${OPENAI_API_URL}/videos/${videoId}/content`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
  })
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to download video: ${error.message}`)
  }
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return buffer
}
