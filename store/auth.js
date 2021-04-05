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
    await this.$fireauth.signInWithEmailAndPassword(email, password)
  },
  async logout () {
    await this.$fireauth.signOut()
  }
}
