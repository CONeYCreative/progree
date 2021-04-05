<template>
  <v-card
    class="transparent scroll-box-card"
    width="100%"
    height="calc(100% - 56px)"
    light
    flat
  >
    <slot />
  </v-card>
</template>

<style scoped>
.scroll-box-card {
  overflow: auto;
  position: relative;
}
</style>
