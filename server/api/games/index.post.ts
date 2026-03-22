import { createGame } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.name?.trim()) throw createError({ statusCode: 400, message: 'Game name is required' })
  if (!body.category?.trim()) throw createError({ statusCode: 400, message: 'Category is required' })
  const game = createGame({
    name: body.name.trim(),
    category: body.category.trim(),
    minPlayers: Number(body.minPlayers) || 2,
    maxPlayers: Number(body.maxPlayers) || 4,
    durationMin: Number(body.durationMin) || 60,
    difficulty: body.difficulty || 'Medium',
    description: body.description?.trim() || '',
    available: body.available !== undefined ? Boolean(body.available) : true,
  })
  setResponseStatus(event, 201)
  return game
})
