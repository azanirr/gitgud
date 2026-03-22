import { deleteGame } from '../../utils/db'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')!
  const deleted = deleteGame(id)
  if (!deleted) throw createError({ statusCode: 404, message: 'Game not found' })
  return { success: true }
})
