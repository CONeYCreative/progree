<template>
  <v-dialog
    :value="value"
    persistent
  >
    <v-card class="pa-6">
      <v-card-title
        class="secondary--text font-weight-bold px-6"
        v-text="title"
      />

      <lessons-list
        :lessons="lessons"
        :create="create"
        simple
        @click:create="selectLesson({})"
        @click:lesson="selectLesson($event)"
      />
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import LessonsList from '~/components/presentational/LessonsList'
export default {
  components: { LessonsList },
  props: {
    value: {
      type: Boolean,
      default: false,
      require: true
    },
    create: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: null,
      require: true
    }
  },
  fetch () {
    const lessonId = this.$route.query?.lesson
    if (lessonId) {
      const lesson = this.theLesson(lessonId)
      if (lesson) {
        this.selectLesson(lesson)
      }
    }
  },
  methods: {
    selectLesson (lesson) {
      if (!lesson.id) {
        lesson.id = this.$uuid()
      }
      const json = JSON.stringify(lesson)
      const clone = JSON.parse(json)
      this.$emit('selected', clone)
    }
  },
  computed: {
    ...mapGetters('data', ['lessons', 'theLesson'])
  }
}
</script>
