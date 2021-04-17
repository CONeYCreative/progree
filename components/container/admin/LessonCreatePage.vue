<template>
  <page-wrapper>
    <app-bar
      :title="text.progree"
      :user="user"
      :navMenuItems="navMenuItems"
    />

    <scroll-box v-if="lesson">
      <div class="d-flex align-center px-6">
        <v-icon
          color="accent"
          v-text="icons.edit"
        />
        <v-card-title
          class="primary--text font-weight-bold"
          v-text="text.title"
        />
        <v-btn
          text
          v-text="'レッスンを再選択'"
          @click="clearLesson(false)"
        />
      </div>

      <v-form
        class="pa-6 d-flex flex-column"
        ref="form"
        @submit.prevent
        :disabled="loading.form"
      >
        <div
          v-if="form.rank"
          class="caption primary--text font-weight-bold text-right px-6"
          v-text="`このレッスンは ${form.rank} 番目のレッスンです`"
        />

        <custom-input
          class="pa-3"
          v-model="form.title"
          label="タイトル"
          :messages="['（例） Lesson1 ※ 数字を含んでください。タイトル内に最初に出てきた数字の若い順にレッスン一覧は表示されます。']"
          :rules="[v => !!v || '入力してください']"
          :counter="16"
        />

        <custom-input
          class="pa-3"
          v-model="form.description"
          label="説明"
          :messages="['（例） プログラミング言語「Python3」の文法の基礎を学びましょう！']"
          :rules="[v => !!v || '入力してください']"
          :counter="64"
        />

        <custom-input
          class="pa-3"
          input-type="select"
          v-model="form.prevLessonId"
          label="前のレッスン"
          item-value="id"
          item-text="title"
          :messages="['このレッスンの前のレッスンを指定します（指定したレッスンの次のレッスンはこのレッスンになります）']"
          :items="lessons"
        />

        <custom-input
          class="pa-3"
          input-type="select"
          v-model="form.nextLessonId"
          label="次のレッスン"
          item-value="id"
          item-text="title"
          :messages="['このレッスンの次のレッスンを指定します（指定したレッスンの前のレッスンはこのレッスンになります）']"
          :items="lessons"
        />

        <v-divider class="my-6" />

        <div class="pa-3">
          <v-subheader
            class="body-1 font-weight-bold px-1 py-3 ma-0"
            style="height: auto;"
            v-text="'サンプルコード'"
          />

          <custom-input
            class="py-3"
            input-type="textarea"
            v-model="form.sample.description"
            label="サンプルコード解説"
            :messages="['マークダウンで入力してください']"
            :rules="[v => !!v || '入力してください']"
            :counter="1024"
            @input="inputMarkdown"
          />

          <markdown
            v-if="form.sample.description"
            class="pa-4 mb-6"
            style="border-radius: 4px; border: 1px solid #419eb2;"
            :text="markdowned.sampleDescription"
          />

          <code-input
            class="py-3"
            :code="form.sample.code"
            message="「保存して実行」で結果を確かめてください。これをしないと変更が反映されません。"
            @change="$event => { form.sample.code = $event }"
          />
        </div>

        <v-divider class="my-6" />

        <div class="pa-3">
          <v-subheader
            class="body-1 font-weight-bold px-1 py-3 ma-0"
            style="height: auto;"
            v-text="'スライド'"
          />

          <div
            v-if="!loading.slideFileUpload"
            class="d-flex align-center"
          >
            <custom-input
              class="py-3"
              input-type="file"
              accept="image/*"
              prepend-icon="add_photo_alternate"
              hideInput
              @change="selectFile"
            />

            <v-spacer />

            <div
              v-if="showedSlide"
              class="body-2 font-weight-bold primary--text"
              v-text="showedSlide.title"
            />
          </div>

          <v-progress-circular
            v-else
            class="my-3"
            width="3"
            size="24"
            indeterminate
          />

          <v-menu
            v-model="slideMenuModel"
            absolute
            offset-y
          >
            <template v-slot:activator="{ on, attrs }">
              <div
                v-bind="attrs"
                v-on="on"
              >
                <slide-box
                  v-if="!loading.slideFileUpload"
                  :lesson="form"
                  @click:slide="$event => { selectedSlide = $event }"
                  @input="slideSlide"
                />
              </div>
            </template>

            <v-list>
              <v-list-item
                v-for="(item, i) of slideMenu"
                :key="i"
                @click="selectSlide(item.type)"
              >
                <v-list-item-title v-text="item.title" />
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <v-divider class="my-6" />

        <v-card-actions>
          <v-spacer />

          <v-btn
            class="font-weight-bold"
            color="accent"
            :loading="loading.form"
            @click="submit"
            v-text="'保存'"
          />
        </v-card-actions>
      </v-form>
    </scroll-box>

    <v-dialog
      v-model="dialogs.selectLesson"
      persistent
    >
      <v-card
        class="pa-6"
        color="#fffc"
      >
        <v-card-title
          class="secondary--text font-weight-bold px-6"
          v-text="text.selectLesson"
        />

        <lessons-list
          :lessons="lessons"
          simple
          create
          @click:create="selectLesson()"
          @click:lesson="selectLesson($event)"
        />
      </v-card>
    </v-dialog>
  </page-wrapper>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import PageWrapper from '~/components/presentational/PageWrapper'
import AppBar from '~/components/presentational/AppBar'
import ScrollBox from '~/components/presentational/ScrollBox'
import LessonsList from '~/components/presentational/LessonsList'
import CustomInput from '~/components/presentational/CustomInput'
import CodeInput from '~/components/presentational/CodeInput'
import Markdown from '~/components/presentational/Markdown'
import SlideBox from '~/components/presentational/SlideBox'
export default {
  components: {
    PageWrapper,
    AppBar,
    ScrollBox,
    LessonsList,
    CustomInput,
    CodeInput,
    Markdown,
    SlideBox
  },
  data () {
    return {
      slideMenuModel: false,
      lesson: null,
      loading: {
        slideFileUpload: false,
        form: false
      },
      icons: {
        edit: 'edit'
      },
      text: {
        progree: 'progree',
        title: 'レッスン作成・編集',
        selectLesson: '編集するレッスンを選択または作成'
      },
      dialogs: {
        selectLesson: true
      },
      markdowned: {
        sampleDescription: null
      },
      form: {
        id: null,
        title: null,
        rank: null,
        nextLessonId: null,
        prevLessonId: null,
        sample: {
          code: null,
          description: null
        },
        slides: [],
        exercises: {}
      },
      navMenuItems: [
        {
          icon: 'home',
          text: 'ホーム',
          location: '/'
        },
        {
          icon: 'logout',
          text: 'ログアウト',
          location: '/logout/'
        },
        {
          icon: 'person',
          text: '管理者ページ',
          location: '/admin/'
        },
      ],
      slideMenu: [
        { title: 'スライドのタイトルを変更', type: 'title' },
        { title: 'スライドを削除', type: 'delete' }
      ],
      selectedSlide: null,
      showedSlide: null
    }
  },
  methods: {
    slideSlide (event) {
      this.showedSlide = this.form.slides[event]
    },
    async selectSlide (type) {
      this.loading.slideFileUpload = true
      const slide = this.selectedSlide
      this.form.slides = this.form.slides.map(item => {
        return !!item.id ? item : { ...item, id: `${Date.now()}` }
      })
      if (type === 'title') {
        const title = window.prompt('このスライドのタイトルを入力してください。入力がない場合、キャンセルされます。')
        if (title) {
          this.form.slides = this.form.slides.map(item => {
            return item.id !== slide.id ? item : { ...item, title }
          })
        }
      } else if (type === 'delete') {
        const confirm = window.confirm('このスライドを削除しますか？')
        if (!confirm) { return }
        this.form.slides = this.form.slides.filter(item => item.id !== slide.id)
      }
      await new Promise(resolve => { setTimeout(() => { resolve() }, 500) })
      this.loading.slideFileUpload = false
    },
    clearLesson (pass = false) {
      if (!pass) {
        const confirm = window.confirm('編集した内容が失われる可能性がありますが、別のレッスンの作成・編集にうつりますか？')
        if (!confirm) { return alert('キャンセルしました') }
      }
      this.lesson = null
      this.form = {
        id: null,
        title: null,
        rank: null,
        nextLessonId: null,
        prevLessonId: null,
        sample: {
          code: null,
          description: null
        },
        slides: [],
        exercises: {}
      }
      this.dialogs.selectLesson = true
    },
    inputMarkdown () {
      this.markdowned.sampleDescription = (this.form.sample.description || '').replace(/\n/g, '\\\\n')
    },
    async selectFile (event) {
      this.loading.slideFileUpload = true
      const title = window.prompt('このスライドのタイトルを入力してください。入力がない場合、キャンセルされます。')
      if (title) {
        if (event && event[0]) {
          const { file, url } = await this.readImage(event[0])
          this.form.slides.push({
            id: file.name,
            imageUrl: url,
            file,
            title
          })
        }
      }
      await new Promise(resolve => { setTimeout(() => { resolve() }, 500) })
      this.loading.slideFileUpload = false
    },
    selectLesson (lesson = {}) {
      this.lesson = lesson
      this.lesson.id = this.lesson.id || this.$uuid()
      this.form = {
        ...this.form,
        ...this.lesson,
        sample: { ...this.lesson.sample },
        slides: this.lesson.slides ? [...this.lesson.slides] : [],
        exercises: { ...this.lesson.exercises }
      }
      this.showedSlide = this.form.slides[0]
      this.markdowned.sampleDescription = this.form.sample.description
      this.form.sample.description = (this.form.sample.description || '').replace(/\\\\n/g, '\n')
      this.dialogs.selectLesson = false
    },
    async submit () {
      if (!this.$refs.form.validate()) { return alert('正しく入力されていない欄があります。') }
      const confirm = window.confirm('保存するとデータが書き換えられますが、よろしいですか？')
      if (!confirm) { return alert('キャンセルしました') }
      const prevLesson = this.lessons.find(lesson => lesson.id === this.form.prevLessonId)
      const nextLesson = this.lessons.find(lesson => lesson.id === this.form.nextLessonId)
      if (prevLesson && nextLesson && prevLesson.rank >= nextLesson.rank) {
        return alert('前後関係が矛盾しています')
      }
      this.loading.form = true
      const lessonIndex = (this.form.title.match(/(\d|\.)+/) || [])[0] || '999'
      this.form.rank = Number(lessonIndex)
      if (prevLesson && prevLesson.nextLessonId !== this.form.id) {
        const prevLessonData = { ...prevLesson, nextLessonId: this.form.id }
        const prevConfirm = window.confirm('前のレッスンの次のレッスンをこのレッスンに書き換えます、よろしいですか？')
        if (prevConfirm) {
          await this.setLessons(prevLessonData)
        }
      }
      if (nextLesson && nextLesson.prevLessonId !== this.form.id) {
        const nextLessonData = { ...nextLesson, prevLessonId: this.form.id }
        const nextConfirm = window.confirm('次のレッスンの前のレッスンをこのレッスンに書き換えます、よろしいですか？')
        if (nextConfirm) {
          await this.setLessons(nextLessonData)
        }
      }
      const slides = []
      for (const slide of this.form.slides) {
        if (slide.file) {
          const imageUrl = await this.uploadFile(slide.file)
          slides.push({ ...slide, imageUrl, file: null })
        } else {
          slides.push({ ...slide })
        }
      }
      this.form.slides = slides
      await this.setLessons(this.form)
      this.loading.form = false
      alert('完了しました')
      this.clearLesson(true)
    },
    async readImage (file) {
      return await new Promise(resolve => {
        const image = new Image()
        const reader = new FileReader()
        const canvas = document.createElement('canvas')
        image.height = 1280
        image.width = 2560
        canvas.width = image.width
        canvas.height = image.height
        reader.onload = () => { image.src = reader.result }
        image.onload = () => {
          if (file.name.split('.').pop() === 'svg') {
            resolve({ file, url: image.src })
          } else {
            canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height)
            const dataUrl = canvas.toDataURL('image/jpeg')
            const binary = atob(dataUrl.split(',')[1])
            const data = new Uint8Array(binary.length)
            Array(binary.length).fill().forEach((e, i) => { data[i] = binary.charCodeAt(i) })
            const resizeFile = new File([data], `${Date.now()}.jpg`, { type: 'image/jpeg' })
            resolve({ file: resizeFile, url: dataUrl })
          }
        }
        reader.readAsDataURL(file)
      })
    },
    ...mapActions('data', ['uploadFile', 'setLessons'])
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('data', ['lessons'])
  }
}
</script>
