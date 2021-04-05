<template>
  <v-menu offset-y>
    <template #activator="{ on, attrs, value }">
      <div
        v-bind="attrs"
        v-on="on"
      >
        <user-item
          :user="user"
          :value="value"
        />
      </div>
    </template>
    <v-list>
      <v-divider class="mx-2" />
      <menu-item
        v-for="(item, i) of items"
        :key="i"
        :icon="item.icon"
        :text="item.text"
        @click="$router.push(item.location)"
      />
      <v-divider class="mx-2" />
    </v-list>
  </v-menu>
</template>

<script>
import UserItem from '~/components/presentational/UserItem'
import MenuItem from '~/components/presentational/MenuItem'
export default {
  components: { UserItem, MenuItem },
  props: {
    user: {
      type: Object,
      default: () => ({})
    },
    items: {
      type: Array,
      default: () => []
    }
  }
}
</script>
