export const state = () => ({
  user: null
})

export const mutations = {
  user (state, obj) { state.user = obj }
}

export const getters = {
  user: state => state.user,
  isAuthenticated: state => !!state.user?.uid
}

export const actions = {
  async setUser (context, authUser) {
    if (authUser) {
      if (!context.getters.isAuthenticated) {
        const ref = this.$firestore.doc(`/versions/0.0.0/users/${authUser.uid}/`)
        const doc = await ref.get()
        const user = doc.exists ? { uid: doc.id, ...doc.data() } : null
        context.commit('user', user)
      }
    } else {
      context.commit('user', null)
    }
  },
  async login (context, { email, password }) {
    const result = await this.$fireauth.signInWithEmailAndPassword(email, password).catch(e => ({ error: e }))
    if ('error' in result && result.error) {
      if (result.error.code === 'auth/too-many-requests') {
        throw {
          statusCode: 'ログインできませんでした',
          message: '何度もパスワードを間違えています。パスワードを確認してください。'
        }
      }
      if (result.error.code === 'auth/wrong-password') {
        throw {
          statusCode: 'ログインできませんでした',
          message: 'パスワードが間違っています。'
        }
      }
      if (result.error.code === 'auth/user-not-found') {
        throw {
          statusCode: 'ログインできませんでした',
          message: 'ログインIDが間違っています。'
        }
      }
    }
  },
  async logout () {
    await this.$fireauth.signOut()
  }
}
