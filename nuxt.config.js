export default {
  ssr: false,
  target: 'static',
  head: {
    title: 'progree',
    link: [
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap'
      },
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ]
  },
  css: [
    '@fortawesome/fontawesome-free/css/all.css',
    '@mdi/font/css/materialdesignicons.css',
    'material-design-icons-iconfont/dist/material-design-icons.css'
  ],
  plugins: [
    '~/plugins/axios',
    '~/plugins/helpers',
    '~/plugins/firebase'
  ],
  components: [
    '~/components',
    {
      path: '~/components/container/',
      prefix: ''
    },
    {
      path: '~/components/presentational/',
      prefix: ''
    }
  ],
  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxt/components'
  ],
  modules: [
    "@nuxtjs/axios",
    '@nuxtjs/pwa'
  ],
  pwa: {
    manifest: {
      lang: 'ja'
    }
  },
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    icons: {
      iconfont: ['mdi', 'md', 'fa']
    },
    theme: {
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
