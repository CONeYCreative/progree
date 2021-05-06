<template>
  <v-dialog
    :value="value"
    min-width="320"
    max-width="600"
    width="auto"
    persistent
    @click:outside="close"
  >
    <v-card
      class="d-flex flex-column align-center justify-center"
      width="auto"
      min-width="320"
      max-width="600"
      min-height="120"
    >
      <v-btn
        absolute
        top
        right
        icon
        @click="close"
      >
        <v-icon
          color="primary"
          v-text="closeIcon"
        />
      </v-btn>

      <v-card-title
        class="primary--text font-weight-bold"
        v-text="text.hint"
      />

      <div class="pa-6">
        <markdown :text="hint" />
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    hint: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      closeIcon: 'close',
      text: {
        hint: 'ヒント'
      }
    }
  },
  methods: {
    close () {
      this.$emit('input', false)
    }
  }
}
</script>
