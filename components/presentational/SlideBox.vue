<template>
  <v-card>
    <v-carousel
      v-model="model"
      style="height: auto;"
      :continuous="false"
      hide-delimiter-background
      hide-delimiters
    >
      <template #prev="{ on, attrs }">
        <v-btn
          color="#fffa"
          depressed
          fab
          large
          v-bind="attrs"
          v-on="on"
        >
          <v-icon
            color="primary"
            right
            large
            v-text="icons.prev"
          />
        </v-btn>
      </template>

      <template #next="{ on, attrs }">
        <v-btn
          color="#fffa"
          depressed
          fab
          large
          v-bind="attrs"
          v-on="on"
        >
          <v-icon
            class="pr-2"
            color="primary"
            right
            large
            v-text="icons.next"
          />
        </v-btn>
      </template>

      <v-carousel-item
        v-for="(slide, i) of lesson.slides"
        :key="i"
        :aspect-ratio="2"
        :src="slide.imageUrl"
        :ripple="false"
        eager
        @click="$emit('click:slide', slide)"
      />
    </v-carousel>
  </v-card>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    lesson: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      model: false,
      icons: {
        prev: 'arrow_back_ios',
        next: 'arrow_forward_ios'
      }
    }
  },
  fetch () {
    if (this.value !== this.model) {
      const vector = Number(this.value > this.model) || -1
      const size = Math.abs(this.value - this.model)
      const array = [...Array(size)]
      array.forEach((e, i) => {
        setTimeout(() => { this.model += vector }, 100 * i)
      })
    }
  },
  watch: {
    value () {
      this.$fetch()
    },
    model (model) {
      this.$emit('input', model)
      const hash = `#slide${model}`
      if (hash !== this.$route.hash) {
        this.$router.replace({ hash })
      }
    }
  }
}
</script>

<style>
.slide-box .v-image {
  height: auto !important;
}
</style>
