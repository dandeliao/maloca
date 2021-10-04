<template>
  <div class="barra">
    <NavbarNav />
    <img src="/icon.png" alt="maloca"/>
    <NavbarActions />
  </div>
</template>

<style scoped>
.barra {
  @apply flex flex-row justify-between items-center bg-red-200;
}
img {
  @apply h-7 w-auto;
}
</style>