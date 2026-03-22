<template>
  <main>
    <!-- ── HERO ── -->
    <section class="hero pattern-bg">
      <!-- Floating board game icons -->
      <div class="floaters" aria-hidden="true">
        <span class="floater" style="top:12%;left:8%;animation-delay:0s;font-size:2.5rem">🎲</span>
        <span class="floater" style="top:20%;right:12%;animation-delay:0.8s;font-size:2rem">♟️</span>
        <span class="floater" style="top:60%;left:5%;animation-delay:1.5s;font-size:1.8rem">🃏</span>
        <span class="floater" style="top:70%;right:8%;animation-delay:0.4s;font-size:2.2rem">🎯</span>
        <span class="floater" style="top:35%;left:3%;animation-delay:1.1s;font-size:1.5rem">⭐</span>
        <span class="floater" style="top:45%;right:4%;animation-delay:0.2s;font-size:1.5rem">🏆</span>
        <span class="floater" style="bottom:20%;left:15%;animation-delay:0.7s;font-size:1.8rem">🎮</span>
        <span class="floater" style="top:8%;right:35%;animation-delay:1.3s;font-size:1.4rem">⚡</span>
      </div>

      <div class="container hero-content">
        <div class="hero-badge anim-fade-up">
          ☕ Bandung's #1 Board Game Café
        </div>
        <h1 class="hero-title anim-fade-up delay-1">
          Play Hard,<br/>
          <span class="hero-accent">Brew Good</span>
        </h1>
        <p class="hero-sub anim-fade-up delay-2">
          The spot in Bandung where great coffee meets epic board games.
          Gather your crew, pick a game, and let's git gud together!
        </p>
        <div class="hero-cta anim-fade-up delay-3">
          <a href="#games" class="btn btn-primary">🎲 Browse Games</a>
          <a href="#about" class="btn btn-outline-white">Our Story</a>
        </div>

        <!-- Quick stats -->
        <div class="hero-stats anim-fade-up delay-4">
          <div class="stat-pill">
            <span class="stat-icon">🎲</span>
            <span><strong>{{ games.length > 0 ? games.length + '+' : '50+' }}</strong> Board Games</span>
          </div>
          <div class="stat-pill">
            <span class="stat-icon">☕</span>
            <span><strong>20+</strong> Coffee Menu</span>
          </div>
          <div class="stat-pill">
            <span class="stat-icon">🌟</span>
            <span><strong>4.8★</strong> Rating</span>
          </div>
        </div>
      </div>

      <!-- Wave divider -->
      <div class="hero-wave">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#F7FEFA"/>
        </svg>
      </div>
    </section>

    <!-- ── ABOUT ── -->
    <section class="section" id="about" style="background: var(--off-white);">
      <div class="container about-grid">
        <div class="about-visual">
          <div class="about-card-big">
            <span class="about-emoji">🎲</span>
            <p>100+</p>
            <small>Game Collection</small>
          </div>
          <div class="about-card-small about-card-top">
            <span>☕</span>
            <p>Fresh Brews</p>
          </div>
          <div class="about-card-small about-card-bottom">
            <span>🏆</span>
            <p>Win or Lose,<br/>Have Fun!</p>
          </div>
          <!-- Deco blobs -->
          <div class="deco-blob blob-1" />
          <div class="deco-blob blob-2" />
        </div>

        <div class="about-text">
          <span class="overline">Who We Are</span>
          <h2>Where Every Table<br/>Has a Story</h2>
          <p>
            GitGud Boardgame & Cafe started from a simple belief: the best memories
            are made over a great cup of coffee and an intense board game session.
          </p>
          <p>
            Located in Bandung, we've curated a collection of games for every type
            of player — from casual party games to deep strategy titles that'll
            keep you at the table all night long.
          </p>
          <div class="about-features">
            <div class="feature-chip">🎲 100+ Games</div>
            <div class="feature-chip">☕ Specialty Coffee</div>
            <div class="feature-chip">🍪 Snacks & Meals</div>
            <div class="feature-chip">🎉 Group Friendly</div>
          </div>
          <NuxtLink to="/games" class="btn btn-green" style="margin-top:1.5rem">
            Explore Game Library →
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ── GAMES PREVIEW ── -->
    <section class="section" id="games" style="background: var(--green-light);">
      <div class="container">
        <div class="section-header">
          <span class="overline">Game Library</span>
          <h2>Pick Your Game 🎯</h2>
          <p class="section-sub">
            {{ games.length > 0 ? `${games.length} titles in our collection` : 'Loading collection...' }}
          </p>
        </div>

        <div v-if="pending" class="loading-state">
          <div class="spin-dice">🎲</div>
          <p>Loading games...</p>
        </div>

        <div v-else-if="games.length === 0" class="empty-state">
          <span style="font-size:3rem">📭</span>
          <p>No games yet. <NuxtLink to="/games">Add some!</NuxtLink></p>
        </div>

        <div v-else class="games-grid">
          <div
            v-for="(game, i) in previewGames"
            :key="game.id"
            class="game-card card anim-fade-up"
            :style="`animation-delay:${i*0.08}s`"
          >
            <div class="game-card-top">
              <span class="badge badge-yellow">{{ game.category }}</span>
              <span class="badge" :class="game.available ? 'badge-green' : 'badge-red'">
                {{ game.available ? '● Available' : '○ In Use' }}
              </span>
            </div>
            <h3 class="game-card-name">{{ game.name }}</h3>
            <p class="game-card-desc">{{ game.description || 'A great game waiting to be played!' }}</p>
            <div class="game-card-meta">
              <span class="meta-tag">👥 {{ game.minPlayers }}–{{ game.maxPlayers }} players</span>
              <span class="meta-tag">⏱ ~{{ game.durationMin }}min</span>
              <span class="meta-tag">{{ diffEmoji(game.difficulty) }} {{ game.difficulty }}</span>
            </div>
          </div>
        </div>

        <div v-if="games.length > 6" class="view-all-wrap">
          <NuxtLink to="/games" class="btn btn-green">
            See All {{ games.length }} Games 🎲
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ── HOW IT WORKS ── -->
    <section class="section" style="background:var(--white)">
      <div class="container">
        <div class="section-header">
          <span class="overline">The Vibe</span>
          <h2>How To Git Gud ⚡</h2>
        </div>
        <div class="steps-grid">
          <div
            v-for="(step, i) in steps"
            :key="i"
            class="step-card anim-fade-up"
            :style="`animation-delay:${i*0.12}s`"
          >
            <div class="step-num">{{ String(i+1).padStart(2,'0') }}</div>
            <div class="step-icon">{{ step.icon }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA BANNER ── -->
    <section class="cta-banner pattern-bg">
      <div class="container cta-inner">
        <div class="cta-text">
          <h2 style="color:var(--white)">Ready to Play? 🎲</h2>
          <p style="color:rgba(255,255,255,0.85)">
            Come visit us in Bandung. Bring your friends, grab a coffee, and let the games begin!
          </p>
        </div>
        <div class="cta-actions">
          <a href="https://www.instagram.com/letsgitgud/" target="_blank" rel="noopener" class="btn btn-primary">
            📸 Follow on Instagram
          </a>
          <NuxtLink to="/games" class="btn btn-outline-white">Manage Games ⚙️</NuxtLink>
        </div>
      </div>
    </section>

    <!-- ── FOOTER ── -->
    <footer class="footer">
      <div class="container footer-inner">
        <div>
          <div class="nav-logo" style="margin-bottom:0.5rem">
            <span class="logo-box">GitGud</span>
            <span class="logo-sub">Boardgame &amp; Cafe</span>
          </div>
          <p class="footer-tagline">Coffee & Board Games · Bandung, Indonesia</p>
        </div>
        <div class="footer-links">
          <a href="https://www.instagram.com/letsgitgud/" target="_blank" rel="noopener">📸 Instagram</a>
          <NuxtLink to="/games">🎲 Game Library</NuxtLink>
        </div>
      </div>
      <div class="container footer-bottom">
        <p>© {{ new Date().getFullYear() }} GitGud Boardgame & Cafe. All rights reserved.</p>
      </div>
    </footer>
  </main>
</template>

<script setup>
const { data: gamesData, pending } = await useFetch('/api/games')
const games = computed(() => gamesData.value || [])
const previewGames = computed(() => games.value.slice(0, 6))

const steps = [
  { icon: '☕', title: 'Order Your Drink', desc: 'Start with our signature coffee or a refreshing drink from our menu. Fuel up before the battle.' },
  { icon: '🎲', title: 'Pick a Game', desc: 'Browse our curated library of 100+ games. Need help choosing? Our staff has your back.' },
  { icon: '🏆', title: 'Play & Win', desc: 'Rally your crew, make memories, and leave with a story to tell. Win or lose — always a good time.' },
]

const diffEmoji = (d) => ({ Easy: '🟢', Medium: '🟡', Hard: '🔴', Expert: '💀' }[d] || '⚪')
</script>

<style scoped>
/* ── Hero ── */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: var(--green);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%230FA05D' stroke-width='1.8' opacity='0.35'%3E%3Crect x='8' y='8' width='22' height='22' rx='3'/%3E%3Crect x='13' y='13' width='5' height='5'/%3E%3Crect x='22' y='13' width='5' height='5'/%3E%3Crect x='13' y='22' width='5' height='5'/%3E%3Crect x='22' y='22' width='5' height='5'/%3E%3Cpath d='M52 12 L58 8 L64 12 L58 18 Z'/%3E%3Ccircle cx='57' cy='57' r='9'/%3E%3Cpath d='M53 57 L57 53 L61 57 L57 61 Z'/%3E%3Cpath d='M18 55 Q22 50 26 55 Q30 60 34 55'/%3E%3C/g%3E%3C/svg%3E");
}

.floaters { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.floater {
  position: absolute;
  animation: floatBounce 3s ease-in-out infinite alternate;
  opacity: 0.6;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
}
@keyframes floatBounce {
  from { transform: translateY(0) rotate(-5deg); }
  to   { transform: translateY(-14px) rotate(5deg); }
}

.hero-content {
  position: relative;
  z-index: 1;
  padding-top: 7rem;
  padding-bottom: 6rem;
  text-align: center;
  max-width: 720px;
  margin: 0 auto;
}
.hero-badge {
  display: inline-block;
  background: rgba(255,255,255,0.2);
  border: 1.5px solid rgba(255,255,255,0.35);
  color: var(--white);
  font-size: 0.85rem;
  font-weight: 800;
  padding: 0.4rem 1.1rem;
  border-radius: var(--radius-pill);
  margin-bottom: 1.5rem;
  letter-spacing: 0.04em;
}
.hero-title {
  font-size: clamp(3.5rem, 8vw, 6.5rem);
  font-family: var(--font-display);
  color: var(--white);
  line-height: 1;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 24px rgba(0,0,0,0.15);
}
.hero-accent {
  color: var(--yellow);
  display: block;
  -webkit-text-stroke: 2px var(--yellow-dark);
  paint-order: stroke fill;
}
.hero-sub {
  font-size: 1.15rem;
  color: rgba(255,255,255,0.9);
  max-width: 520px;
  margin: 0 auto 2.5rem;
  font-weight: 600;
}
.hero-cta { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 3rem; }
.hero-stats {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
.stat-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.18);
  border: 1.5px solid rgba(255,255,255,0.3);
  color: var(--white);
  padding: 0.5rem 1.1rem;
  border-radius: var(--radius-pill);
  font-size: 0.88rem;
  font-weight: 700;
  backdrop-filter: blur(4px);
}
.stat-pill strong { color: var(--yellow); }
.stat-icon { font-size: 1.1rem; }

.hero-wave {
  position: absolute;
  bottom: -1px; left: 0; right: 0;
  z-index: 2;
}
.hero-wave svg { display: block; width: 100%; height: 80px; }

/* ── About ── */
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 5rem;
  align-items: center;
}
.about-visual {
  position: relative;
  height: 380px;
}
.about-card-big {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 180px; height: 180px;
  background: var(--green);
  border-radius: var(--radius-lg);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  color: var(--white);
  box-shadow: 0 12px 40px rgba(23,191,111,0.3);
  z-index: 2;
}
.about-card-big .about-emoji { font-size: 2.5rem; margin-bottom: 0.25rem; }
.about-card-big p { font-family: var(--font-display); font-size: 2.2rem; line-height: 1; color: var(--yellow); }
.about-card-big small { font-size: 0.75rem; font-weight: 700; opacity: 0.85; text-transform: uppercase; letter-spacing: 0.08em; }
.about-card-small {
  position: absolute;
  background: var(--white);
  border: 2px solid var(--green-pale);
  border-radius: var(--radius-md);
  padding: 1rem 1.25rem;
  box-shadow: var(--shadow-sm);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text);
  z-index: 3;
}
.about-card-small span { font-size: 1.5rem; display: block; margin-bottom: 0.25rem; }
.about-card-top    { top: 20px; right: 20px; transform: rotate(6deg); }
.about-card-bottom { bottom: 20px; left: 20px; transform: rotate(-4deg); }
.deco-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(32px);
  pointer-events: none;
}
.blob-1 { width: 200px; height: 200px; background: rgba(23,191,111,0.15); top: -20px; right: -20px; }
.blob-2 { width: 150px; height: 150px; background: rgba(245,201,62,0.15); bottom: -10px; left: -10px; }

.about-text h2 { font-size: clamp(1.8rem, 3.5vw, 2.6rem); margin-bottom: 1rem; }
.about-text p { color: var(--text-mid); font-weight: 600; margin-bottom: 1rem; font-size: 1.02rem; }
.about-features {
  display: flex; flex-wrap: wrap; gap: 0.5rem;
  margin-top: 1.25rem;
}
.feature-chip {
  background: var(--green-light);
  border: 1.5px solid var(--green-pale);
  color: var(--green-dark);
  padding: 0.35rem 0.9rem;
  border-radius: var(--radius-pill);
  font-size: 0.82rem;
  font-weight: 800;
}

/* ── Games Grid ── */
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
}
.game-card { background: var(--white); }
.game-card-top { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }
.game-card-name { font-size: 1.15rem; margin-bottom: 0.4rem; }
.game-card-desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.game-card-meta { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.meta-tag {
  background: var(--green-light);
  color: var(--text-mid);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-pill);
}
.view-all-wrap { text-align: center; margin-top: 2.5rem; }

/* ── Loading / Empty ── */
.loading-state, .empty-state {
  text-align: center;
  padding: 4rem;
  color: var(--text-muted);
  font-weight: 700;
}
.spin-dice {
  font-size: 3rem;
  display: inline-block;
  animation: spin 1.2s linear infinite;
  margin-bottom: 0.75rem;
}

/* ── Steps ── */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}
.step-card {
  text-align: center;
  padding: 2.5rem 1.75rem;
  background: var(--off-white);
  border: 2px solid var(--green-pale);
  border-radius: var(--radius-lg);
  transition: all var(--transition);
  position: relative;
  overflow: hidden;
}
.step-card:hover {
  border-color: var(--green);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  background: var(--white);
}
.step-num {
  font-family: var(--font-display);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: var(--green);
  margin-bottom: 1rem;
  background: var(--green-light);
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-pill);
}
.step-icon { font-size: 2.8rem; margin-bottom: 1rem; display: block; }
.step-card h3 { font-size: 1.15rem; margin-bottom: 0.6rem; }
.step-card p  { font-size: 0.92rem; color: var(--text-muted); font-weight: 600; }

/* ── CTA Banner ── */
.cta-banner {
  background-color: var(--green);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%230FA05D' stroke-width='1.8' opacity='0.35'%3E%3Crect x='8' y='8' width='22' height='22' rx='3'/%3E%3Crect x='13' y='13' width='5' height='5'/%3E%3Crect x='22' y='13' width='5' height='5'/%3E%3Crect x='13' y='22' width='5' height='5'/%3E%3Crect x='22' y='22' width='5' height='5'/%3E%3C/g%3E%3C/svg%3E");
  padding: 5rem 0;
}
.cta-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  flex-wrap: wrap;
}
.cta-text h2 { font-size: clamp(1.6rem, 3vw, 2.2rem); }
.cta-text p { margin-top: 0.5rem; font-weight: 600; }
.cta-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

/* ── Footer ── */
.footer {
  background: var(--dark);
  padding: 3rem 0 1.5rem;
}
.footer-inner {
  display: flex; justify-content: space-between;
  align-items: flex-start; gap: 2rem; flex-wrap: wrap; margin-bottom: 2rem;
}
.footer .logo-box  { font-size: 1.2rem; }
.footer .nav-logo  { color: var(--white); }
.footer-tagline { color: var(--text-muted); font-size: 0.88rem; font-weight: 600; margin-top: 0.25rem; }
.footer-links { display: flex; flex-direction: column; gap: 0.5rem; }
.footer-links a {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-muted);
}
.footer-links a:hover { color: var(--green); }
.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.06);
  padding-top: 1.5rem;
}
.footer-bottom p {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255,255,255,0.3);
}

@media (max-width: 768px) {
  .about-grid { grid-template-columns: 1fr; }
  .about-visual { display: none; }
  .cta-inner { flex-direction: column; text-align: center; }
  .cta-actions { justify-content: center; }
}
</style>
