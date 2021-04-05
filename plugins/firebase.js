import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

export default ({ store, env }, inject) => {
  const config = env.firebaseConfig
  const firebaseApp = firebase.initializeApp(config)
  const auth = firebaseApp.auth()
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  auth.onAuthStateChanged(async user => { await store.dispatch('auth/setUser', user) })
  const firestore = firebaseApp.firestore()
  const $timestamp = (date = null) => firebase.firestore.Timestamp.fromDate(date || new Date())
  const $date = (timestamp = null) => timestamp ? new Date(timestamp.seconds * 1000) : new Date()
  const storage = firebaseApp.storage()

  // const firebaseIncrement = n => firebase.firestore.FieldValue.increment(n)
  // const documentId = firebase.firestore.FieldPath.documentId()
  const $push = v => firebase.firestore.FieldValue.arrayUnion(v)

  inject('fireauth', auth)
  inject('firestore', firestore)
  inject('firestorage', storage)
  inject('firedate', { $timestamp, $date })
  inject('firebase', { $push })
}
