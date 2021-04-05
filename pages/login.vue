<template>
  <v-overlay>
    <v-card
      min-width="320"
      class="primary--text px-4"
      light
    >
      <v-card-title
        class="font-weight-bold text-h4 justify-center mb-6"
        v-text="title"
      />
      <v-card-subtitle
        class="text-center pb-0"
        v-text="subtitle"
      />
      <v-form
        ref="signForm"
        class="px-4 pb-4"
        :disabled="loading"
      >
        <v-text-field
          v-model="form.email"
          class="pb-1"
          hide-details="auto"
          color="primary"
          :label="labels.email"
          :rules="[rules.email]"
        />
        <v-text-field
          v-model="form.password"
          hide-details="auto"
          color="primary"
          :label="labels.password"
          :type="form.passwordVisible ? 'text' : 'password'"
          :append-icon="form.passwordVisible ? 'visibility' : 'visibility_off'"
          :rules="[rules.password]"
          @click:append="form.passwordVisible = !form.passwordVisible"
        />
      </v-form>
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          color="primary"
          outlined
          :disabled="loading"
          @click="submitLogin"
          v-text="buttonText"
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
      return context.redirect({ path: '/' })
    }
  },
  head () {
    return {
      title: 'ログイン'
    }
  },
  data () {
    const emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/
    const passwordReg = /^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{8,20}$/
    return {
      title: 'progree',
      subtitle: '最初にログインしてください',
      loading: false,
      form: {
        email: null,
        password: null,
        passwordVisible: false
      },
      labels: {
        email: 'ログインID',
        password: 'パスワード'
      },
      rules: {
        email: value => emailReg.test(value) || 'ログインIDを正しく入力してください',
        password: value => passwordReg.test(value) || 'パスワードは 8 ~ 20 文字の半角英数字です'
      },
      buttonText: 'ログインしてはじめる'
    }
  },
  methods: {
    async submitLogin () {
      if (!this.$refs.signForm.validate()) { return }
      this.loading = true
      await this.login(this.form)
    },
    ...mapActions('auth', ['login'])
  },
  watch: {
    isAuthenticated () {
      if (this.isAuthenticated) {
        this.loading = false
        const next = this.$route.query?.next
        return this.$router.push({ path: next || '/' })
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['user', 'isAuthenticated'])
  }
}
</script>

