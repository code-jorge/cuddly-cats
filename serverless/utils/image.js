import { types, actions, locations } from './prompt'

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
    A photorealistic, high-resolution photograph capturing a lifelike ${type} ${animal}.  
    The ${animal} looks content and relaxed, ${action}.  
    It is situated ${location}.  
    The scene is inspired by ${tags.join(" and ")}, featuring intricate.  
  `
}

export const getImage = async (prompt)=> {
  const response = await fetch(`${OPENAI_API_URL}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: "1024x1024"
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to generate image: ${error}`)
  }

  const data = await response.json()
  return data
}
