<template>
  <nav>
    <NuxtLink to="/">início</NuxtLink>
    <NuxtLink to="/perfil">perfil</NuxtLink>
  </nav>
</template>

<style scoped>
nav {
  @apply flex flex-row;
}
a {
  @apply px-2 py-0.5 font-bold;
}
</style>