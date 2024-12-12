import { getWords } from '../utils/words'

export default async ()=> {
  const tags = getWords(2)
  return Response.json({ tags })
}
