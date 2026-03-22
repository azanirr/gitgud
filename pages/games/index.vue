<template>
  <main class="games-page">
    <div class="container">

      <!-- ── Page Header ── -->
      <div class="page-header">
        <div>
          <NuxtLink to="/" class="back-link">← Back to Home</NuxtLink>
          <h1 class="page-title">🎲 Game Library</h1>
          <p class="page-sub">Manage your GitGud board game collection</p>
        </div>
        <button class="btn btn-primary" @click="openModal()">+ Add Game</button>
      </div>

      <!-- ── Stats ── -->
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-emoji">🎲</span>
          <div><strong>{{ allGames.length }}</strong><span>Total Games</span></div>
        </div>
        <div class="stat-card stat-green">
          <span class="stat-emoji">✅</span>
          <div><strong>{{ availCount }}</strong><span>Available</span></div>
        </div>
        <div class="stat-card stat-red">
          <span class="stat-emoji">🕹️</span>
          <div><strong>{{ inUseCount }}</strong><span>In Use</span></div>
        </div>
        <div class="stat-card stat-yellow">
          <span class="stat-emoji">📂</span>
          <div><strong>{{ uniqueCategories }}</strong><span>Categories</span></div>
        </div>
      </div>

      <!-- ── Toolbar ── -->
      <div class="toolbar">
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input v-model="search" class="search-input" placeholder="Search games..." />
        </div>
        <div class="filter-group">
          <select v-model="filterCategory" class="filter-select">
            <option value="">All Categories</option>
            <option v-for="c in categories" :key="c">{{ c }}</option>
          </select>
          <select v-model="filterAvail" class="filter-select">
            <option value="">All Status</option>
            <option value="true">Available</option>
            <option value="false">In Use</option>
          </select>
          <select v-model="filterDiff" class="filter-select">
            <option value="">All Difficulty</option>
            <option v-for="d in difficulties" :key="d">{{ d }}</option>
          </select>
        </div>
      </div>

      <!-- ── Games Table ── -->
      <div v-if="pending" class="loading-state">
        <div class="spin-dice">🎲</div>
        <p>Loading your collection...</p>
      </div>

      <div v-else-if="filteredGames.length === 0" class="empty-state">
        <span style="font-size:3.5rem">📭</span>
        <p>No games found.</p>
        <button class="btn btn-primary" @click="openModal()">+ Add First Game</button>
      </div>

      <div v-else class="table-wrap">
        <table class="games-table">
          <thead>
            <tr>
              <th @click="setSort('name')" class="sortable">Name {{ sortIcon('name') }}</th>
              <th>Category</th>
              <th @click="setSort('minPlayers')" class="sortable">Players {{ sortIcon('minPlayers') }}</th>
              <th @click="setSort('durationMin')" class="sortable">Duration {{ sortIcon('durationMin') }}</th>
              <th>Difficulty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="game in paginatedGames"
              :key="game.id"
              class="game-row"
              @click="viewGame(game)"
            >
              <td class="name-cell">
                <span class="game-name">{{ game.name }}</span>
                <span v-if="game.description" class="game-desc">{{ game.description }}</span>
              </td>
              <td><span class="badge badge-yellow">{{ game.category }}</span></td>
              <td class="mono-cell">{{ game.minPlayers }}–{{ game.maxPlayers }}</td>
              <td class="mono-cell">{{ game.durationMin }}m</td>
              <td>
                <span class="diff-pill" :class="`diff-${game.difficulty?.toLowerCase()}`">
                  {{ diffEmoji(game.difficulty) }} {{ game.difficulty }}
                </span>
              </td>
              <td @click.stop>
                <span class="avail-pill" @click="toggleAvailable(game)">
                  <span class="badge" :class="game.available ? 'badge-green' : 'badge-red'">
                    {{ game.available ? '✓ Available' : '● In Use' }}
                  </span>
                </span>
              </td>
              <td @click.stop>
                <div class="action-btns">
                  <button class="btn btn-ghost" title="Edit" @click="openModal(game)">✏️</button>
                  <button class="btn btn-danger" title="Delete" @click="confirmDelete(game)">🗑</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── Pagination ── -->
      <div v-if="totalPages > 1" class="pagination">
        <button class="btn btn-outline" :disabled="page === 1" @click="page--">← Prev</button>
        <span class="page-info">Page {{ page }} of {{ totalPages }}</span>
        <button class="btn btn-outline" :disabled="page === totalPages" @click="page++">Next →</button>
      </div>
    </div>

    <!-- ── View Detail Modal ── -->
    <div v-if="viewingGame" class="modal-backdrop" @click.self="viewingGame = null">
      <div class="modal-box">
        <button class="modal-close" @click="viewingGame = null">✕</button>
        <div class="detail-badges">
          <span class="badge badge-yellow">{{ viewingGame.category }}</span>
          <span class="badge" :class="viewingGame.available ? 'badge-green' : 'badge-red'">
            {{ viewingGame.available ? '✓ Available' : '● In Use' }}
          </span>
        </div>
        <h2 class="detail-title">{{ viewingGame.name }}</h2>
        <p class="detail-desc">{{ viewingGame.description || 'No description provided.' }}</p>
        <div class="detail-meta">
          <div class="meta-row"><span>Players</span><strong>{{ viewingGame.minPlayers }}–{{ viewingGame.maxPlayers }} people</strong></div>
          <div class="meta-row"><span>Duration</span><strong>~{{ viewingGame.durationMin }} minutes</strong></div>
          <div class="meta-row"><span>Difficulty</span><strong>{{ diffEmoji(viewingGame.difficulty) }} {{ viewingGame.difficulty }}</strong></div>
          <div class="meta-row"><span>Added</span><strong>{{ formatDate(viewingGame.createdAt) }}</strong></div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-green" @click="openModal(viewingGame); viewingGame = null">Edit Game</button>
          <button class="btn btn-outline" @click="viewingGame = null">Close</button>
        </div>
      </div>
    </div>

    <!-- ── Add/Edit Modal ── -->
    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal-box">
        <button class="modal-close" @click="closeModal">✕</button>
        <h2 class="modal-title">{{ isEditing ? '✏️ Edit Game' : '🎲 Add New Game' }}</h2>

        <div class="form-grid">
          <div class="input-group" style="grid-column:1/-1">
            <label>Game Name *</label>
            <input v-model="form.name" placeholder="e.g. Wingspan" />
          </div>

          <div class="input-group">
            <label>Category *</label>
            <select v-model="form.category">
              <option value="">Select category...</option>
              <option v-for="c in categories" :key="c">{{ c }}</option>
              <option value="__custom">+ Custom...</option>
            </select>
          </div>
          <div v-if="form.category === '__custom'" class="input-group">
            <label>Custom Category</label>
            <input v-model="form.customCategory" placeholder="e.g. Deck-Builder" />
          </div>

          <div class="input-group">
            <label>Min Players *</label>
            <input v-model.number="form.minPlayers" type="number" min="1" max="20" />
          </div>
          <div class="input-group">
            <label>Max Players *</label>
            <input v-model.number="form.maxPlayers" type="number" min="1" max="20" />
          </div>

          <div class="input-group">
            <label>Duration (minutes) *</label>
            <input v-model.number="form.durationMin" type="number" min="5" placeholder="e.g. 60" />
          </div>
          <div class="input-group">
            <label>Difficulty *</label>
            <select v-model="form.difficulty">
              <option v-for="d in difficulties" :key="d">{{ d }}</option>
            </select>
          </div>

          <div class="input-group" style="grid-column:1/-1">
            <label>Description</label>
            <textarea v-model="form.description" placeholder="Short description of the game..." rows="3" />
          </div>

          <div class="input-group" style="grid-column:1/-1">
            <label>Availability</label>
            <div class="toggle-row">
              <button class="toggle-btn" :class="{ active: form.available }" @click="form.available = true">
                ✓ Available
              </button>
              <button class="toggle-btn" :class="{ active: !form.available }" @click="form.available = false">
                ● In Use
              </button>
            </div>
          </div>
        </div>

        <div v-if="formError" class="form-error">⚠️ {{ formError }}</div>

        <div class="modal-actions" style="margin-top:1.5rem">
          <button class="btn btn-primary" :disabled="saving" @click="saveGame">
            {{ saving ? 'Saving...' : (isEditing ? 'Update Game' : 'Add Game') }}
          </button>
          <button class="btn btn-outline" @click="closeModal">Cancel</button>
        </div>
      </div>
    </div>

    <!-- ── Delete Confirm ── -->
    <div v-if="deletingGame" class="modal-backdrop" @click.self="deletingGame = null">
      <div class="modal-box" style="max-width:400px; text-align:center;">
        <div style="font-size:3.5rem; margin-bottom:1rem;">🗑️</div>
        <h2 style="font-size:1.5rem; margin-bottom:0.75rem;">Remove Game?</h2>
        <p style="color:var(--text-muted); font-weight:600; margin-bottom:2rem;">
          Remove <strong style="color:var(--text)">{{ deletingGame.name }}</strong> from the library?
          This cannot be undone.
        </p>
        <div class="modal-actions" style="justify-content:center;">
          <button class="btn btn-danger" style="border:none; background:var(--red); color:var(--white); padding:0.75rem 1.75rem; border-radius:var(--radius-pill);" :disabled="saving" @click="deleteGame">
            {{ saving ? 'Removing...' : 'Yes, Remove' }}
          </button>
          <button class="btn btn-outline" @click="deletingGame = null">Cancel</button>
        </div>
      </div>
    </div>

    <!-- ── Toast ── -->
    <Transition name="toast">
      <div v-if="toast" class="toast" :class="`toast-${toast.type}`">{{ toast.msg }}</div>
    </Transition>
  </main>
</template>

<script setup>
useHead({ title: "Game Library — GitGud Boardgame & Cafe" })

const { data: gamesData, pending, refresh } = await useFetch('/api/games')
const allGames = computed(() => gamesData.value || [])

const categories = [
  'Strategy', 'Party', 'Cooperative', 'RPG', 'Deck-Builder',
  'Worker Placement', 'Trivia', 'Abstract', 'Thematic', 'Filler', 'Wargame'
]
const difficulties = ['Easy', 'Medium', 'Hard', 'Expert']

// ── Filters ───────────────────────────────────────────────────
const search = ref('')
const filterCategory = ref('')
const filterAvail = ref('')
const filterDiff = ref('')
const sortField = ref('')
const sortDir = ref('asc')

const filteredGames = computed(() => {
  return allGames.value.filter(g => {
    const s = search.value.toLowerCase()
    if (s && !g.name.toLowerCase().includes(s) && !(g.description||'').toLowerCase().includes(s)) return false
    if (filterCategory.value && g.category !== filterCategory.value) return false
    if (filterAvail.value !== '' && String(g.available) !== filterAvail.value) return false
    if (filterDiff.value && g.difficulty !== filterDiff.value) return false
    return true
  }).sort((a, b) => {
    if (!sortField.value) return 0
    const av = a[sortField.value], bv = b[sortField.value]
    return sortDir.value === 'asc'
      ? (av < bv ? -1 : av > bv ? 1 : 0)
      : (av > bv ? -1 : av < bv ? 1 : 0)
  })
})

const availCount      = computed(() => allGames.value.filter(g => g.available).length)
const inUseCount      = computed(() => allGames.value.filter(g => !g.available).length)
const uniqueCategories = computed(() => new Set(allGames.value.map(g => g.category)).size)

const setSort = (f) => {
  if (sortField.value === f) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  else { sortField.value = f; sortDir.value = 'asc' }
}
const sortIcon = (f) => sortField.value !== f ? '↕' : sortDir.value === 'asc' ? '↑' : '↓'

const page = ref(1)
const perPage = 12
watch([search, filterCategory, filterAvail, filterDiff], () => { page.value = 1 })
const totalPages = computed(() => Math.ceil(filteredGames.value.length / perPage))
const paginatedGames = computed(() =>
  filteredGames.value.slice((page.value-1)*perPage, page.value*perPage)
)

// ── Modals ────────────────────────────────────────────────────
const showModal = ref(false)
const isEditing = ref(false)
const editId = ref(null)
const viewingGame = ref(null)
const deletingGame = ref(null)
const saving = ref(false)
const formError = ref('')
const toast = ref(null)

const defaultForm = () => ({
  name: '', category: '', customCategory: '',
  minPlayers: 2, maxPlayers: 4,
  durationMin: 60, difficulty: 'Medium',
  description: '', available: true
})
const form = ref(defaultForm())

const openModal = (game = null) => {
  formError.value = ''
  if (game) {
    isEditing.value = true; editId.value = game.id
    form.value = { ...defaultForm(), ...game, customCategory: '' }
  } else {
    isEditing.value = false; editId.value = null
    form.value = defaultForm()
  }
  showModal.value = true
}
const closeModal = () => { showModal.value = false }
const viewGame = (game) => { viewingGame.value = game }
const confirmDelete = (game) => { deletingGame.value = game }

const showToast = (msg, type = 'success') => {
  toast.value = { msg, type }
  setTimeout(() => { toast.value = null }, 3200)
}

const validateForm = () => {
  if (!form.value.name.trim()) return 'Game name is required.'
  const cat = form.value.category === '__custom' ? form.value.customCategory : form.value.category
  if (!cat?.trim()) return 'Category is required.'
  if (form.value.minPlayers < 1 || form.value.maxPlayers < form.value.minPlayers) return 'Invalid player count.'
  if (form.value.durationMin < 1) return 'Duration must be positive.'
  return null
}

const saveGame = async () => {
  const err = validateForm()
  if (err) { formError.value = err; return }
  const payload = { ...form.value }
  if (payload.category === '__custom') payload.category = payload.customCategory
  delete payload.customCategory
  saving.value = true
  try {
    if (isEditing.value) {
      await $fetch(`/api/games/${editId.value}`, { method: 'PUT', body: payload })
      showToast(`✓ "${payload.name}" updated!`)
    } else {
      await $fetch('/api/games', { method: 'POST', body: payload })
      showToast(`🎲 "${payload.name}" added to library!`)
    }
    await refresh(); closeModal()
  } catch { showToast('Something went wrong. Try again.', 'error') }
  finally { saving.value = false }
}

const deleteGame = async () => {
  if (!deletingGame.value) return
  saving.value = true
  try {
    await $fetch(`/api/games/${deletingGame.value.id}`, { method: 'DELETE' })
    showToast(`"${deletingGame.value.name}" removed`)
    deletingGame.value = null; await refresh()
  } catch { showToast('Failed to delete.', 'error') }
  finally { saving.value = false }
}

const toggleAvailable = async (game) => {
  try {
    await $fetch(`/api/games/${game.id}`, { method: 'PUT', body: { ...game, available: !game.available } })
    await refresh()
    showToast(`"${game.name}" is now ${!game.available ? 'available' : 'in use'}`)
  } catch { showToast('Failed to update.', 'error') }
}

const diffEmoji = (d) => ({ Easy: '🟢', Medium: '🟡', Hard: '🔴', Expert: '💀' }[d] || '⚪')
const formatDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '—'
</script>

<style scoped>
.games-page { padding-top: 7rem; padding-bottom: 5rem; min-height: 100vh; }

.back-link {
  font-size: 0.82rem; font-weight: 700;
  color: var(--text-muted); display: inline-block;
  margin-bottom: 0.75rem; transition: color var(--transition);
}
.back-link:hover { color: var(--green-dark); }

.page-header {
  display: flex; justify-content: space-between; align-items: flex-end;
  margin-bottom: 2rem; gap: 1rem; flex-wrap: wrap;
}
.page-title { font-size: clamp(1.8rem,5vw,3rem); line-height: 1; margin-bottom: 0.2rem; }
.page-sub { color: var(--text-muted); font-weight: 700; font-size: 0.92rem; }

/* ── Stats ── */
.stats-row { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; }
.stat-card {
  display: flex; align-items: center; gap: 0.9rem;
  background: var(--white); border: 2px solid var(--green-pale);
  border-radius: var(--radius-lg); padding: 1rem 1.5rem;
  flex: 1; min-width: 140px;
  transition: all var(--transition);
}
.stat-card:hover { border-color: var(--green); box-shadow: var(--shadow-sm); transform: translateY(-2px); }
.stat-card.stat-green { border-color: rgba(23,191,111,0.3); }
.stat-card.stat-red   { border-color: rgba(232,58,58,0.25); }
.stat-card.stat-yellow { border-color: rgba(245,201,62,0.35); }
.stat-emoji { font-size: 1.8rem; }
.stat-card div { display: flex; flex-direction: column; }
.stat-card strong { font-family: var(--font-display); font-size: 1.6rem; line-height: 1; color: var(--dark); }
.stat-card span  { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); }

/* ── Toolbar ── */
.toolbar { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.5rem; align-items: center; }
.search-wrap { position: relative; flex: 1; min-width: 200px; }
.search-icon { position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); font-size: 0.9rem; pointer-events: none; }
.search-input { padding-left: 2.4rem !important; }
.filter-group { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.filter-select { width: auto; min-width: 130px; font-size: 0.88rem; }

/* ── Table ── */
.table-wrap { overflow-x: auto; border: 2px solid var(--green-pale); border-radius: var(--radius-lg); background: var(--white); }
.games-table { width: 100%; border-collapse: collapse; }
.games-table thead th {
  background: var(--green-light);
  color: var(--text-mid);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 1rem 1.25rem;
  text-align: left;
  white-space: nowrap;
  border-bottom: 2px solid var(--green-pale);
}
.sortable { cursor: pointer; user-select: none; transition: color var(--transition); }
.sortable:hover { color: var(--green-dark); }
.game-row {
  border-bottom: 1px solid var(--green-light);
  cursor: pointer;
  transition: background var(--transition);
}
.game-row:last-child { border-bottom: none; }
.game-row:hover { background: var(--off-white); }
.games-table td { padding: 1rem 1.25rem; vertical-align: middle; }
.name-cell { max-width: 220px; }
.game-name { display: block; font-weight: 800; font-size: 0.95rem; color: var(--dark); }
.game-desc {
  display: block; font-size: 0.8rem; color: var(--text-muted); font-weight: 600;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; margin-top: 2px;
}
.mono-cell { font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-mid); }
.action-btns { display: flex; gap: 0.25rem; }
.avail-pill { cursor: pointer; transition: opacity var(--transition); }
.avail-pill:hover { opacity: 0.75; }

/* ── Difficulty pills ── */
.diff-pill {
  font-size: 0.72rem; font-weight: 800;
  padding: 0.22rem 0.65rem; border-radius: var(--radius-pill);
  white-space: nowrap;
}
.diff-easy   { background: rgba(23,191,111,0.12);  color: var(--green-dark); }
.diff-medium { background: rgba(245,201,62,0.18);  color: #8A6A00; }
.diff-hard   { background: rgba(232,58,58,0.12);   color: var(--red); }
.diff-expert { background: rgba(100,50,200,0.1);   color: #7C3AED; }

/* ── Pagination ── */
.pagination {
  display: flex; align-items: center; justify-content: center;
  gap: 1.5rem; margin-top: 2rem;
}
.page-info { font-weight: 700; color: var(--text-muted); font-size: 0.88rem; }

/* ── Loading / Empty ── */
.loading-state, .empty-state {
  text-align: center; padding: 5rem 2rem;
  color: var(--text-muted); font-weight: 700; font-size: 1.05rem;
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
}
.spin-dice { font-size: 3rem; animation: spin 1.2s linear infinite; }

/* ── Modal ── */
.modal-title { font-size: 1.5rem; margin-bottom: 1.5rem; }
.modal-close {
  position: absolute; top: 1.25rem; right: 1.25rem;
  background: var(--green-light); border: 1.5px solid var(--green-pale);
  cursor: pointer; color: var(--text-mid); font-size: 0.85rem;
  width: 30px; height: 30px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; transition: all var(--transition);
}
.modal-close:hover { background: var(--green); color: var(--white); border-color: var(--green); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-error {
  margin-top: 1rem; padding: 0.75rem 1rem;
  background: var(--red-light); border: 1.5px solid rgba(232,58,58,0.3);
  border-radius: var(--radius-md); color: var(--red);
  font-size: 0.85rem; font-weight: 700;
}
.modal-actions { display: flex; gap: 0.75rem; }
.toggle-row { display: flex; gap: 0.5rem; }
.toggle-btn {
  flex: 1; padding: 0.65rem;
  background: var(--off-white);
  border: 2px solid var(--green-pale);
  border-radius: var(--radius-md);
  color: var(--text-muted); font-weight: 800; font-size: 0.85rem; cursor: pointer;
  transition: all var(--transition);
}
.toggle-btn.active {
  background: var(--green-light); border-color: var(--green); color: var(--green-dark);
}

/* ── Detail Modal ── */
.detail-badges { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.detail-title  { font-size: 2rem; margin-bottom: 0.75rem; }
.detail-desc   { color: var(--text-mid); font-weight: 600; margin-bottom: 1.5rem; font-size: 1rem; }
.detail-meta { background: var(--off-white); border-radius: var(--radius-md); overflow: hidden; border: 1.5px solid var(--green-pale); margin-bottom: 1.5rem; }
.meta-row { display: flex; justify-content: space-between; padding: 0.75rem 1rem; border-bottom: 1px solid var(--green-pale); }
.meta-row:last-child { border-bottom: none; }
.meta-row span { color: var(--text-muted); font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
.meta-row strong { font-weight: 800; }

/* ── Toast transition ── */
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(16px); }

@media (max-width: 600px) {
  .form-grid { grid-template-columns: 1fr; }
  .stats-row { gap: 0.75rem; }
  .stat-card { padding: 0.75rem 1rem; }
}
</style>
