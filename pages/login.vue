<template>
  <v-overlay>
    <v-card
      min-width="320"
      class="primary--text px-4"
      light
    >
      <v-card-title
        class="font-weight-bold text-h4 justify-center mb-6"
        v-text="text.title"
      />

      <v-card-subtitle
        class="text-center pb-0"
        v-text="text.subtitle"
      />

      <v-form
        ref="signForm"
        class="px-4 pb-4"
        :disabled="loading"
        @submit.prevent
      >
        <v-text-field
          v-model="email"
          class="pb-1"
          hide-details="auto"
          color="primary"
          :label="text.email"
          :rules="[rules.email]"
        />

        <v-text-field
          v-model="pwd"
          hide-details="auto"
          color="primary"
          :label="text.pwd"
          :rules="[rules.pwd]"
          :type="pwdVisible ? 'text' : 'password'"
          :append-icon="pwdVisible ? 'visibility' : 'visibility_off'"
          @click:append="pwdVisible = !pwdVisible"
        />
      </v-form>

      <v-card-actions class="pa-4">
        <v-spacer />

        <v-btn
          color="primary"
          :disabled="loading"
          outlined
          @click="submit"
          v-text="text.start"
        />
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  async middleware (context) {
    if (context.store.getters['auth/isAuthenticated']) {
      return context.redirect({
        path: '/'
      })
    }
  },
  head () {
    return {
      title: 'ログイン | progree'
    }
  },
  data () {
    return {
      text: {
        title: 'progree',
        subtitle: '最初にログインしてください',
        email: 'ログインID',
        pwd: 'パスワード',
        inputValidEmail: 'ログインIDを正しく入力してください',
        inputValidPwd: 'パスワードは 8 ~ 20 文字の半角英数字です',
        start: 'ログインしてはじめる'
      },
      loading: false,
      email: null,
      pwd: null,
      pwdVisible: false,
      rules: {
        email: v => this.$regexp.email.test(v) || this.text.inputValidEmail,
        pwd: v => this.$regexp.pwd.test(v) || this.text.inputValidPwd
      }
    }
  },
  methods: {
    async submit () {
      if (this.$refs.signForm.validate()) {
        this.loading = true
        await this.login({
          email: this.email,
          password: this.pwd
        })
      }
    },
    ...mapActions('auth', ['login'])
  },
  watch: {
    isAuthenticated () {
      if (this.isAuthenticated) {
        this.loading = false
        return this.$router.push({
          path: this.$route.query?.next || '/'
        })
      }
    }
  },
  computed: {
    ...mapGetters('auth', [
      'user',
      'isAuthenticated'
    ])
  }
}
</script>

