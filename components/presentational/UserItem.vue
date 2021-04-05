<template>
  <v-list-item v-if="user">
    <v-list-item-avatar>
      <v-icon
        v-text="'account_circle'"
        :color="user.isTeachar ? 'secondary' : 'accent'"
        x-large
      />
    </v-list-item-avatar>
    <v-list-item-content class="d-block pr-3">
      <v-list-item-title
        class="body-2 secondary--text font-weight-bold"
        v-text="`${user.name} ${user.isTeachar ? '先生' : 'さん'}`"
      />
      <v-list-item-subtitle
        class="body-2 grey--text font-weight-bold"
        v-text="`${user.schoolName} ${user.className} クラス`"
      />
    </v-list-item-content>
    <v-icon v-text="value ? 'arrow_drop_up' : 'arrow_drop_down'"/>
  </v-list-item>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: Boolean,
      default: false
    }
  }
}
</script>
