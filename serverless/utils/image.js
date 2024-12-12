const OPENAI_API_KEY = process.env.PROJECT_OPENAI_API_KEY

const getRandomBoolean = ()=> Math.random() < 0.5

export const getPrompt = (tags) => {
  const type = getRandomBoolean() ? "cat" : "kitten"
  const action = getRandomBoolean() ? "sleeping peacefully" : "staring at the ceiling"
  const furniture = getRandomBoolean() ? "a cozy bed with soft blankets" : "a plush couch with vibrant cushions"
  return `
    A highly detailed, realistic photograph capturing an adorable and friendly ${type}. 
    The ${type} looks content and relaxed, ${action}. 
    It is situated on ${furniture}, adding to the cozy ambiance. 
    The scene is enriched by a setting inspired by ${tags.join(" and ")}, 
    featuring intricate background details and a warm, inviting atmosphere.
    The lighting is soft and natural, enhancing the textures of the ${type}'s fur 
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