export default {
  ssr: false,
  target: 'static',
  head: {
    titleTemplate: '%s | progree',
    title: 'progree',
    link: [
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  css: [
    '@fortawesome/fontawesome-free/css/all.css',
    '@mdi/font/css/materialdesignicons.css',
    'material-design-icons-iconfont/dist/material-design-icons.css'
  ],
  plugins: [
    '~/plugins/axios',
    '~/plugins/firebase'
  ],
  components: true,
  buildModules: [
    '@nuxtjs/vuetify'
  ],
  modules: [
    "@nuxtjs/axios",
    '@nuxtjs/pwa'
  ],
  pwa: {
    manifest: { lang: 'ja' }
  },
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    icons: { iconfont: ['mdi', 'md', 'fa'] },
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#419eb2',
          secondary: '#323f62',
          accent: '#faba40',
          grey: '#aeaeae',
          background: '#fbfbfb',
          surface: '#ffffff'
        }
      }
    }
  },
  env: {
    firebaseConfig: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BACKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID
    }
  }
}
