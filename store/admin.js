const VERSION = '0.0.0'

export const state = () => ({
  creating: {}
})

export const getters = {
  creating: state => state.creating
}

export const mutations = {
  creating (state, obj) { state.creating = obj || {} }
}

export const actions = {
  async createLesson (context, payload) {
    const { id, data } = payload
    const ref = this.$firestore.doc(`/versions/${VERSION}/lessons/${id}/`)
    await ref.set(data, { merge: true })
    const snap = await ref.get()
    for (const doc of snap.docs) {
      context.commit('data/setLesson', { id: doc.id, ...doc.data() }, { root: true })
    }
  },
  async setProgress (context, payload) {
    const { id, merge, ...request } = payload
    const user = context.rootGetters['auth/user']
    const ref = this.$firestore.doc(`/versions/${VERSION}/users/${user.uid}/progress/${id}/`)
    await ref.set(request, { merge })
    const doc = await ref.get()
    if (doc.exists) {
      context.commit('setProgress', { id: doc.id, ...doc.data() })
    }
  },
  async submitCode (context, code) {
    const apiEndpoint = 'https://wandbox.org/api/compile.json'
    const compiler = 'cpython-3.7.5'
    const response = await this.$axios.$post(apiEndpoint, { code, compiler })
    return response.program_message || '実行結果がありません'
  }
}
