<template>
  <main>
    <h2>Pessoas:</h2>
    <NuxtLink to="pessoa/dani">dani</NuxtLink><br>
    <NuxtLink to="pessoa/beyonce">beyoncé</NuxtLink>
    <h2>Comunidades:</h2>
    <NuxtLink to="abro-a-geladeira-pra-pensar">Abro a geladeira pra pensar</NuxtLink><br>
    <NuxtLink to="radio-maloca">Rádio Maloca</NuxtLink>
  </main>
</template>

<script>
export default {}
</script>

<style scoped>
a {
    @apply font-bold;
}
</style>