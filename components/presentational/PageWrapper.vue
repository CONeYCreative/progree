<template>
  <v-overlay
    opacity="1"
    color="primary"
  >
    <v-card
      class="background"
      width="calc(100vw - 24px)"
      height="100vh"
      light
      flat
    >
      <slot />
    </v-card>
  </v-overlay>
</template>
