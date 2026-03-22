import { randomUUID } from 'node:crypto'
import { Redis } from '@upstash/redis'

export interface Game {
  id: string
  name: string
  category: string
  minPlayers: number
  maxPlayers: number
  durationMin: number
  difficulty: string
  description: string
  available: boolean
  createdAt: string
  updatedAt?: string
}

const SEED: Game[] = [
  { id: randomUUID(), name: 'Catan', category: 'Strategy', minPlayers: 3, maxPlayers: 4, durationMin: 90, difficulty: 'Medium', description: 'Trade, build, and settle the island of Catan. A modern classic gateway game.', available: true, createdAt: new Date().toISOString() },
  { id: randomUUID(), name: 'Codenames', category: 'Party', minPlayers: 4, maxPlayers: 8, durationMin: 20, difficulty: 'Easy', description: 'Two rival spymasters give one-word clues to help their team guess secret agent names.', available: true, createdAt: new Date().toISOString() },
  { id: randomUUID(), name: 'Pandemic', category: 'Cooperative', minPlayers: 2, maxPlayers: 4, durationMin: 60, difficulty: 'Medium', description: 'Work together to stop four deadly diseases from spreading across the globe.', available: false, createdAt: new Date().toISOString() },
  { id: randomUUID(), name: 'Terraforming Mars', category: 'Strategy', minPlayers: 1, maxPlayers: 5, durationMin: 180, difficulty: 'Hard', description: 'Compete to make Mars habitable by raising temperature, oxygen, and ocean coverage.', available: true, createdAt: new Date().toISOString() },
  { id: randomUUID(), name: 'Exploding Kittens', category: 'Party', minPlayers: 2, maxPlayers: 5, durationMin: 20, difficulty: 'Easy', description: 'A highly strategic kitty-powered version of Russian Roulette.', available: true, createdAt: new Date().toISOString() },
  { id: randomUUID(), name: 'Gloomhaven', category: 'Cooperative', minPlayers: 1, maxPlayers: 4, durationMin: 120, difficulty: 'Expert', description: 'A game of tactical combat in an ever-changing dungeon crawl world.', available: false, createdAt: new Date().toISOString() },
]

const KV_KEY = 'gitgud:games'

let memStore: Game[] | null = null

function getRedis(): Redis | null {
  // Try all possible env var names Vercel/Upstash might inject
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

export async function readGames(): Promise<Game[]> {
  const redis = getRedis()
  if (redis) {
    try {
      const raw = await redis.get(KV_KEY)
      if (!raw) {
        await redis.set(KV_KEY, JSON.stringify(SEED))
        return SEED
      }
      return typeof raw === 'string' ? JSON.parse(raw) : raw as Game[]
    } catch (e) {
      console.error('Redis read error:', e)
      return []
    }
  }
  if (!memStore) memStore = [...SEED]
  return memStore
}

export async function writeGames(games: Game[]): Promise<void> {
  const redis = getRedis()
  if (redis) {
    try {
      await redis.set(KV_KEY, JSON.stringify(games))
    } catch (e) {
      console.error('Redis write error:', e)
    }
  } else {
    memStore = games
  }
}

export async function createGame(data: Omit<Game, 'id' | 'createdAt'>): Promise<Game> {
  const games = await readGames()
  const game: Game = { ...data, id: randomUUID(), createdAt: new Date().toISOString() }
  await writeGames([...games, game])
  return game
}

export async function updateGame(id: string, data: Partial<Game>): Promise<Game | null> {
  const games = await readGames()
  const idx = games.findIndex(g => g.id === id)
  if (idx === -1) return null
  games[idx] = { ...games[idx], ...data, id, updatedAt: new Date().toISOString() }
  await writeGames(games)
  return games[idx]
}

export async function deleteGame(id: string): Promise<boolean> {
  const games = await readGames()
  const next = games.filter(g => g.id !== id)
  if (next.length === games.length) return false
  await writeGames(next)
  return true
}