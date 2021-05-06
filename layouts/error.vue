<template>
  <v-app>
    <v-overlay
      opacity="1"
      color="primary"
    >
      <v-card
        min-width="300"
        max-width="600"
        class="primary--text"
        light
      >
        <v-card-title v-text="title" />

        <v-card-subtitle v-text="subtitle" />

        <v-card-actions>
          <v-btn
            color="primary"
            block
            @click="goBack"
            v-text="back"
          />
        </v-card-actions>
      </v-card>
    </v-overlay>
  </v-app>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      title: null,
      subtitle: null,
      notFound: '404 Not Found.',
      notFoundMessage: 'ページが見つかりませんでした。',
      internalServerError: '500 Internal Server Error.',
      internalServerErrorMessage: 'エラーが発生しました。',
      back: '戻る'
    }
  },
  created () {
    if (this.error.statusCode === 404) {
      this.title = this.notFound
      this.subtitle = this.notFoundMessage
    } else {
      this.title = this.error.statusCode || this.internalServerError
      this.subtitle = this.error.message || this.internalServerErrorMessage
    }
  },
  head () {
    return {
      title: this.title
    }
  },
  methods: {
    goBack () {
      if (this.error.statusCode === 404) {
        this.$router.go(-1)
        return
      }
      const nextLocation = this.error.next || this.$nuxt.context.from || { path: '/' }
      const toSamePage = nextLocation.path === this.$route.path
      this.$router.push(nextLocation)
      if (toSamePage) {
        this.$router.go(0)
      }
    }
  }
}
</script>
