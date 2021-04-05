export const state = () => ({
  lessons: [],
  scores: [],
  progress: []
})

export const getters = {
  lessons: state => state.lessons,
  isLessonsExisted: state => !!state.lessons.length,
  theLesson: state => id => state.lessons.find(lesson => id === lesson.id),
  scores: state => state.scores,
  isScoresExisted: state => !!state.scores.length,
  theScore: state => id => state.scores.find(scores => id === scores.id),
  progress: state => state.progress,
  isProgressExisted: state => !!state.progress.length,
  theProgress: state => id => state.progress.find(progress => id === progress.id),
  openedLessons: state => state.progress.filter(progress => progress.isOpen).map(progress => state.lessons.find(lesson => progress.id === lesson.id))
}

export const mutations = {
  lessons (state, array) { state.lessons = array || [] },
  setLesson (state, lesson) { state.lessons.push(lesson) },
  progress (state, object) { state.progress = object || [] },
  setProgress (state, progress) {
    state.progress = state.progress.filter(p => progress.id !== p.id)
    state.progress.push(progress)
  },
  scores (state, object) { state.scores = object || [] },
  setScores (state, score) {
    state.scores = state.scores.filter(s => score.id !== s.id)
    state.scores.push(score)
  }
}

export const actions = {
  async fetchLessons (context) {
    if (!context.getters.isLessonsExisted) {
      const ref = this.$firestore.collection('/versions/0.0.0/lessons/')
      const snap = await ref.orderBy('rank').get()
      for (const doc of snap.docs) {
        context.commit('setLesson', { id: doc.id, ...doc.data() })
      }
    }
  },
  async fetchProgress (context) {
    if (!context.getters.isProgressExisted) {
      const user = context.rootGetters['auth/user']
      const ref = this.$firestore.collection(`/versions/0.0.0/users/${user.uid}/progress/`)
      const snap = await ref.get()
      for (const doc of snap.docs) {
        context.commit('setProgress', { id: doc.id, ...doc.data() })
      }
    }
  },
  async setProgress (context, payload) {
    const { id, merge, ...request } = payload
    const user = context.rootGetters['auth/user']
    const ref = this.$firestore.doc(`/versions/0.0.0/users/${user.uid}/progress/${id}/`)
    await ref.set(request, { merge })
    const doc = await ref.get()
    if (doc.exists) {
      context.commit('setProgress', { id: doc.id, ...doc.data() })
    }
  },
  async setScores (context, payload) {
    const { id, merge, ...request } = payload
    const user = context.rootGetters['auth/user']
    const ref = this.$firestore.doc(`/versions/0.0.0/users/${user.uid}/scores/${id}/`)
    await ref.set(request, { merge })
    const doc = await ref.get()
    if (doc.exists) {
      context.commit('setScores', { id: doc.id, ...doc.data() })
    }
  },
  async submitCode (context, code) {
    const apiEndpoint = 'https://wandbox.org/api/compile.json'
    const compiler = 'cpython-3.7.5'
    const response = await this.$axios.$post(apiEndpoint, { code, compiler })
    return response.program_message || '実行結果がありません'
  }
}
