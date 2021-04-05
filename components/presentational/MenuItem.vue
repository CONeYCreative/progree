<template>
  <v-list-item
    @click="$emit('click')"
    :disabled="selected"
  >
    <v-list-item-avatar v-if="icon">
      <v-icon
        v-text="icon"
        color="accent"
        large
      />
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title
        class="body-2 secondary--text font-weight-bold"
        :class="{ 'grey--text': selected }"
        v-text="text"
      />
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: null
    },
    text: {
      type: String,
      default: null
    },
    selected: {
      type: Boolean,
      defaul: false
    }
  }
}
</script>
