<template>
  <div>
    <v-app-bar
      class="background"
      absolute
      flat
    >
      <v-toolbar-title
        v-if="title"
        class="text-h4 secondary--text font-weight-bold ml-2 mb-2"
        v-text="title"
        @click="$emit('click: title')"
      />
      <v-spacer />
      <nav-menu
        v-if="!!navMenuItems.length"
        :user="user"
        :items="navMenuItems"
      />
    </v-app-bar>
    <div style="height: 56px;" />
  </div>
</template>

<script>
import NavMenu from '~/components/presentational/NavMenu'
export default {
  components: { NavMenu },
  props: {
    icon: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    sectionMenuTitle: {
      type: Array,
      default: () => []
    },
    sectionMenuItems: {
      type: Array,
      default: () => []
    },
    user: {
      type: Object,
      default: () => ({})
    },
    navMenuItems: {
      type: Array,
      default: () => []
    }
  }
}
</script>
