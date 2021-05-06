<template>
  <v-responsive
    class="ma-auto"
    max-width="1100"
    :aspect-ratio="2"
  >
    <v-carousel
      v-model="model"
      style="position: absolute;"
      id="slideBox"
      class="slide-box"
      height="auto"
      :continuous="false"
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
            v-text="prevIcon"
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
            v-text="nextIcon"
          />
        </v-btn>
      </template>

      <v-carousel-item
        v-for="slide of lesson.slides"
        :key="slide.title"
        :src="slide.imageUrl"
        :ripple="false"
        eager
        @click="$emit('click:slide', slide)"
      />
    </v-carousel>
  </v-responsive>
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
      prevIcon: 'arrow_back_ios',
      nextIcon: 'arrow_forward_ios'
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
  mounted () {
    const slideBox = document.getElementById('slideBox')
    slideBox.style.width = '100%'
    setTimeout(() => {
      slideBox.style.height = `${slideBox.clientWidth / 2}px`
    }, 100)
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
.slide-box {
  max-width: 1100px;
}
.slide-box .v-image {
  height: auto !important;
}
</style>
