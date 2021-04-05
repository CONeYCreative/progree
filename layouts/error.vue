<template>
  <v-app>
    <v-overlay
      opacity="1"
      color="primary"
    >
      <v-card
        min-width="300"
        class="primary--text"
        light
      >
        <v-card-title v-text="title" />
        <v-card-subtitle v-text="subtitle" />
        <v-card-actions>
          <v-btn
            color="primary"
            text
            @click="goBack"
            v-text="'キャンセル'"
          />
          <v-spacer />
          <v-btn
            color="primary"
            @click="$router.go({ path: $router.currentRoute.path , force: true })"
            v-text="'OK'"
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
      subtitle: null
    }
  },
  created () {
    this.title = `${this.error.statusCode}`
    this.subtitle = this.error.message
  },
  head () {
    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.subtitle
        }
      ]
    }
  },
  methods: {
    goBack () {
      if (this.$nuxt.context.from.name === this.$router.currentRoute.name) {
        this.$router.go({ path: '/' , force: true })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>
