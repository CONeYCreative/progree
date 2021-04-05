<template>
  <v-menu offset-y>
    <template #activator="{ on, attrs, value }">
      <div
        v-bind="attrs"
        v-on="on"
      >
        <section-item
          :title="title"
          :value="value"
        />
      </div>
    </template>

    <v-list>
      <div
        v-for="(item, i) of items"
        :key="i"
      >
        <v-divider
          v-if="item.divider"
          class="mx-3"
        />
        <menu-item
          :text="item.text"
          :selected="item.location.path === $route.path && (!item.location.hash || `#${item.location.hash}` === $route.hash)"
          @click="$router.push(item.location)"
        />
      </div>
    </v-list>
  </v-menu>
</template>

<script>
import SectionItem from '~/components/presentational/SectionItem'
import MenuItem from '~/components/presentational/MenuItem'
export default {
  components: {
    SectionItem,
    MenuItem
  },
  props: {
    title: {
      type: String,
      default: null
    },
    items: {
      type: Array,
      default: () => []
    }
  }
}
</script>
