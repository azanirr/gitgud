import { readGames } from '../../utils/db'

export default defineEventHandler(() => {
  return readGames()
})
