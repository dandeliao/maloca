<template>
  <nav>
    <a href="/"><img src="/icon.png" alt="maloca" title="início" /></a>
    <a href="/perfil"><img src="/person.png" alt="pessoa" title="perfil" /></a>
  </nav>
</template>

<style scoped>
nav {
  @apply flex flex-row;
}
a {
  @apply px-2 py-0.5 font-bold;
}
img {
  @apply h-7 w-auto;
}
</style>