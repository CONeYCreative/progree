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
        <custom-input
          v-model="exerciseId"
          class="pa-3"
          input-type="select"
          label="エキササイズ"
          item-value="id"
          item-text="text"
          :messages="['問題を追加・編集するエキササイズを選択します']"
          :items="exercises"
          :rules="[v => !!v || '選択してください']"
          @change="selectExercise"
        />

        <div
          class="caption text--secondary px-6"
          v-if="exercise && exercise.title"
          v-text="`タイトル：${exercise.title}`"
        />

        <div
          class="caption text--secondary px-6"
          v-if="exercise && exercise.quota"
          v-text="`ノルマ：${exercise.quota}`"
        />

        <v-divider class="my-6" />

        <custom-input
          class="py-3"
          input-type="textarea"
          v-model="questionForm.text"
          label="問題文"
          :messages="['マークダウンで入力してください']"
          :rules="[v => !!v || '入力してください']"
          :counter="1024"
          @input="questionForm._text = (questionForm.text || '').replace(/\n/g, '\\\\n')"
        />

        <markdown
          v-if="questionForm.text"
          class="pa-4 mb-6"
          style="border-radius: 4px; border: 1px solid #419eb2;"
          :text="questionForm._text"
        />

        <v-divider class="my-6" />

        <custom-input
          class="pa-3"
          input-type="select"
          v-model="exerciseForm.type"
          label="問題タイプ"
          item-value="id"
          item-text="title"
          :messages="['問題タイプを設定します']"
          :items="types"
        />

        <custom-input
          v-if="exerciseForm.type && levels[exerciseForm.type]"
          class="pa-3"
          input-type="select"
          v-model="exerciseForm.level"
          label="レベル"
          :messages="['問題のレベルを設定します']"
          :items="levels[exerciseForm.type]"
        />

        <v-divider class="my-6" />

        <custom-input
          class="pa-3"
          v-model="questionForm.answerKey"
          label="解答"
          :messages="['改行はありません']"
          :rules="[v => !!v || '入力してください']"
          @input="selectExercise"
        />

        <div v-if="exerciseForm.type && /(draganddrop|editing|coding)/.test(exerciseForm.type)">
          <v-subheader
            v-text="'コード解答例'"
          />

          <code-input
            class="py-3"
            :code="questionForm.answerKeyCode"
            message="「保存して実行」で結果を確かめてください。これをしないと変更が反映されません。"
            @change="$event => { questionForm.answerKeyCode = $event }"
          />
        </div>

        <v-divider class="my-6" />

        <v-card-actions>
          <v-spacer />

          <v-btn
            class="font-weight-bold"
            color="accent"
            :loading="loading.form"
            v-text="'保存'"
          />
        </v-card-actions>
      </v-form>
    </scroll-box>


    <v-dialog
      v-model="dialogs.selectExercise"
      persistent
    >
      <v-card class="pa-6">
        <v-card-title
          class="secondary--text font-weight-bold px-6"
          v-text="text.selectExercise"
        />

        <v-form
          ref="exerciseForm"
          class="pa-6 d-flex flex-column"
          @submit.prevent
          :disabled="loading.form"
        >
          <custom-input
            class="pa-3"
            v-model="exerciseForm.id"
            label="エキササイズID"
            :messages="['「exercise+数字」にしてください。数字がエキササイズの番号になります。（例） exercise1']"
            :rules="[v => /^exercise\d$/.test(v) || '正しく入力してください']"
            @input="selectExercise"
          />

          <custom-input
            class="pa-3"
            v-model="exerciseForm.title"
            label="タイトル"
            :messages="['エキササイズにタイトルをつけましょう。（例）print関数を使えるようになろう！']"
            :counter="64"
          />

          <custom-input
            class="pa-3"
            input-type="select"
            v-model="exerciseForm.quota"
            label="正解ノルマ"
            :messages="['正解ノルマ数を設定します']"
            :items="[1, 2, 3, 4, 5]"
          />
        </v-form>

        <v-card-actions>
          <v-btn
            color="grey"
            text
            @click="cancelExercise"
            v-text="'キャンセル'"
          />

          <v-spacer />

          <v-btn
            class="font-weight-bold"
            color="accent"
            @click="submitExercise"
            v-text="text.submitExercise"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogs.selectLesson"
      persistent
    >
      <v-card class="pa-6">
        <v-card-title
          class="secondary--text font-weight-bold px-6"
          v-text="text.selectLesson"
        />

        <lessons-list
          :lessons="lessons"
          simple
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
export default {
  components: {
    PageWrapper,
    AppBar,
    ScrollBox,
    LessonsList,
    CustomInput,
    CodeInput,
    Markdown
  },
  data () {
    return {
      // レッスン
      lesson: null,
      // エキササイズ
      exercise: {},
      exerciseId: null,
      exercises: [],
      exerciseForm: {
        id: 'exercise',
        quota: 2,
        title: null
      },
      // 問題
      question: {},
      questionForm: {
        id: null,
        text: null,
        level: null,
        type: null,
        answerKey: null,
        answerKeyCode: null,
        data: []
      },
      types: [
        {
          id: 'choices',
          title: '選択式'
        },
        {
          id: 'writing',
          title: '記述式'
        },
        {
          id: 'draganddrop',
          title: 'ドラッグ&ドロップ'
        },
        {
          id: 'editing',
          title: '間違い修正'
        },
        {
          id: 'coding',
          title: 'コーディング'
        }
      ],
      levels: {
        choices: null,
        writing: null,
        draganddrop: [1, 2, 3],
        editing: [1, 2, 3],
        coding: [1, 2, 3]
      },

      loading: { form: false },
      icons: {
        edit: 'edit'
      },
      text: {
        progree: 'progree',
        title: '問題作成・編集',
        selectLesson: '問題の追加や編集を行うレッスンを選択',
        selectExercise: 'エキササイズの追加',
        submitExercise: '作成して選択'
      },
      dialogs: {
        selectLesson: true,
        selectExercise: false
      },
      markdowned: {
        sampleDescription: null
      },
      form: {
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
        }
      ]
    }
  },
  methods: {
    // エキササイズ
    cancelExercise () {
      this.exercise = {}
      this.exerciseId = null
      this.dialogs.selectExercise = false
    },
    async submitExercise () {
      if (!this.$refs.exerciseForm.validate()) { return alert('正しく入力されていない欄があります。') }
      const exercise = this.exercises.find(item => item.id === this.exerciseForm.id)
      const exerciseIndex = (this.exerciseForm.id.match(/\d+/) || [])[0] || '?'
      const newExercise = { ...this.exerciseForm, text: `Exercise ${exerciseIndex}` }
      if (exercise) {
        this.exercises = this.exercises.map(item => item.id !== exercise.id ? item : newExercise)
      } else {
        const newItem = this.exercises.pop()
        this.exercises.push(newExercise, newItem)
      }
      await new Promise(resolve => { setTimeout(() => { resolve() }, 100) })
      this.exercise = newExercise
      this.exerciseId = newExercise.id
      this.dialogs.selectExercise = false
    },
    selectExercise (event) {
      if (event === 'new') {
        this.exerciseForm = {
          id: 'exercise',
          quota: 2,
          title: null
        }
        this.exercise = {}
        this.dialogs.selectExercise = true
      } else {
        const exercise = this.exercises.find(item => item.id === event)
        this.exerciseForm = {
          id: event,
          quota: exercise ? exercise.quota : 2,
          title: exercise ? exercise.title : null
        }
        this.text.selectExercise = exercise ? 'エキササイズの編集' : 'エキササイズの追加'
        this.text.submitExercise = exercise ? '編集して選択' : '作成して選択'
        this.exercise = exercise
        console.log(this.exercise)
      }
    },
    // レッスン
    clearLesson (pass = false) {
      if (!pass) {
        const confirm = window.confirm('編集した内容が失われる可能性がありますが、別のレッスンにうつりますか？')
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
    selectLesson (lesson = {}) {
      this.lesson = lesson
      this.form = {
        ...this.lesson,
        exercises: { ...this.lesson.exercises }
      }
      this.exercises = Object.keys(this.lesson.exercises).sort().map(exerciseId => {
        const exerciseIndex = (exerciseId.match(/\d+/) || [])[0] || '?'
        return {
          id: exerciseId,
          text: `Exercise ${exerciseIndex}`,
          quota: this.lesson.exercises[exerciseId].quota,
          title: this.lesson.exercises[exerciseId].title
        }
      })
      this.exercises.push({ id: 'new', text: '新しいエキササイズ' })
      this.exercises.unshift({ id: null, text: '------------' })
      this.dialogs.selectLesson = false
    },

    inputMarkdown (name) {
      this.questionForm[`_${name}`] = (this.questionForm.description || '').replace(/\n/g, '\\\\n')
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
          slides.push({ id: slide.id, imageUrl })
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
    ...mapActions('data', ['setLessons'])
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('data', ['lessons'])
  }
}
</script>
