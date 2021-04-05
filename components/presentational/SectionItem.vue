<template>
  <v-list-item>
    <v-list-item-content class="d-block pr-3">
      <v-list-item-title
        class="body-2 primary--text font-weight-bold"
        v-text="title"
      />
    </v-list-item-content>

    <v-icon
      color="primary"
      v-text="value ? 'arrow_drop_up' : 'arrow_drop_down'"
    />
  </v-list-item>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: null
    },
    value: {
      type: Boolean,
      default: false
    }
  }
}
</script>
