<template>
  <div class="d-flex align-center flex-wrap">
    <v-card
      v-for="(lesson, i) of lessons"
      :key="i"
      @click="$router.push({ path: `/lessons/${lesson.id}/` })"
      class="ml-6 mb-6 d-flex flex-column align-center justify-center"
      width="420"
      height="320"
      max-width="420"
      max-height="320"
    >
      <v-card-title class="secondary--text font-weight-bold">
        <v-icon
          color="accent"
          v-text="'flash_on'"
          size="28"
          left
        />
        <div v-text="lesson.title" />
      </v-card-title>
      <div class="pa-4">
        <div
          v-for="(slide, j) of lesson.slides"
          :key="j"
          class="pb-2 body-1 font-weight-normal"
          v-text="`・ ${slide.title}`"
        />
      </div>
    </v-card>
    <v-card
      v-if="!lessons.length"
      class="ml-6 mb-6 transparent d-flex flex-column align-center justify-center"
      width="420"
      height="120"
      max-width="420"
      max-height="120"
      flat
    >
      <v-card-title
        class="grey--text"
        v-text="noLessons.title"
      />
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    lessons: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      noLessons: {
        title: 'レッスンはありません'
      }
    }
  }
}
</script>
