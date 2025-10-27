import OpenAI from 'openai'
import { types, actions, locations } from './video-prompt.json'

const openai = new OpenAI({
  apiKey: process.env.PROJECT_OPENAI_API_KEY,
})

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
  const response = await openai.videos.create({
    prompt,
    size: '720x1280',
    seconds: '8',
    model: 'sora-2-pro'
  })
  return response
}

export const checkVideo = async (videoId) => {
  const video = await openai.videos.retrieve(videoId)
  return video.status
}

export const downloadVideo = async (videoId) => {
  const response = await openai.videos.downloadContent(videoId)
  const content = await response.blob()
  const arrayBuffer = await content.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer
}
