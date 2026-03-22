import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'

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
  { id: randomUUID(), name: 'Exploding Kittens', category: 'Party', minPlayers: 2, maxPlayers: 5, durationMin: 20, difficulty: 'Easy', description: 'A highly strategic, kitty-powered version of Russian Roulette.', available: true, createdAt: new Date().toISOString() },
  { id: randomUUID(), name: 'Gloomhaven', category: 'Cooperative', minPlayers: 1, maxPlayers: 4, durationMin: 120, difficulty: 'Expert', description: 'A game of tactical combat in an ever-changing dungeon crawl world.', available: false, createdAt: new Date().toISOString() },
]

function getDbPath() {
  const dir = join(process.cwd(), 'server', 'data')
  const file = join(dir, 'games.json')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  if (!existsSync(file)) writeFileSync(file, JSON.stringify(SEED, null, 2), 'utf-8')
  return file
}

export function readGames(): Game[] {
  try {
    const raw = readFileSync(getDbPath(), 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function writeGames(games: Game[]): void {
  writeFileSync(getDbPath(), JSON.stringify(games, null, 2), 'utf-8')
}

export function createGame(data: Omit<Game, 'id' | 'createdAt'>): Game {
  const games = readGames()
  const game: Game = { ...data, id: randomUUID(), createdAt: new Date().toISOString() }
  games.push(game)
  writeGames(games)
  return game
}

export function updateGame(id: string, data: Partial<Game>): Game | null {
  const games = readGames()
  const idx = games.findIndex(g => g.id === id)
  if (idx === -1) return null
  games[idx] = { ...games[idx], ...data, id, updatedAt: new Date().toISOString() }
  writeGames(games)
  return games[idx]
}

export function deleteGame(id: string): boolean {
  const games = readGames()
  const next = games.filter(g => g.id !== id)
  if (next.length === games.length) return false
  writeGames(next)
  return true
}
