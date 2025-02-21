import { types, actions, locations } from './prompt'

const OPENAI_API_KEY = process.env.PROJECT_OPENAI_API_KEY

const getRandomBoolean = ()=> Math.random() < 0.5

const getRandomNumber = (max) => Math.floor(Math.random() * (max + 1))

const getBooleanWithProbability = (probability) => Math.random() < probability

const getAnimal = () => {
  return getRandomBoolean() ? "cat" : "kitten"
}

const getType = () => {
  const useType = getBooleanWithProbability(0.25)
  if (useType) return types[getRandomNumber(types.length - 1)]
  return ""
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
    A detailed, realistic photograph capturing a realistic adorable and friendly ${type} ${animal}. 
    The ${animal} looks content and relaxed, ${action}. 
    It is situated ${location}, adding to the cozy ambiance. 
    The scene is enriched by a setting inspired by ${tags.join(" and ")}, 
    featuring intricate background details and a warm, inviting atmosphere.
    The lighting is soft and natural, enhancing the textures of the ${animal}'s fur 
    and the surrounding environment, evoking a sense of charm and tranquility.
  `
}

export const getImage = async (prompt)=> {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: "dall-e-3", prompt, n: 1, size: "1024x1024" }),
  })
  return response
}