<template>
  <nav class="nav" :class="{ scrolled: isScrolled }">
    <div class="container nav-inner">
      <NuxtLink to="/" class="nav-logo">
        <span class="logo-box">GitGud</span>
        <span class="logo-sub">Boardgame &amp; Cafe</span>
      </NuxtLink>
      <ul class="nav-links">
        <li><NuxtLink to="/" :class="{ active: route.path === '/' }">Home</NuxtLink></li>
        <li><a href="/#about">About</a></li>
        <li><a href="/#games">Games</a></li>
        <li>
          <NuxtLink to="/games" class="btn btn-primary" style="padding: 0.5rem 1.25rem; font-size: 0.82rem;">
            🎲 Manage Library
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
const route = useRoute()
const isScrolled = ref(false)
onMounted(() => {
  const handler = () => { isScrolled.value = window.scrollY > 40 }
  window.addEventListener('scroll', handler, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', handler))
})
</script>