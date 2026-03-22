import { updateGame } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const updated = updateGame(id, {
    name: body.name?.trim(),
    category: body.category?.trim(),
    minPlayers: Number(body.minPlayers),
    maxPlayers: Number(body.maxPlayers),
    durationMin: Number(body.durationMin),
    difficulty: body.difficulty,
    description: body.description?.trim() ?? '',
    available: Boolean(body.available),
  })
  if (!updated) throw createError({ statusCode: 404, message: 'Game not found' })
  return updated
})
