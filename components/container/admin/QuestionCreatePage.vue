<template>
  <page-wrapper>
    <app-bar
      :title="text.progree"
      :user="user"
      :navMenuItems="navMenuItems"
    />

    <scroll-box v-if="lesson && exercise">
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
          v-text="'レッスン・エキササイズを再選択'"
          @click="clearLesson(false)"
        />
      </div>

      <div
        class="body-1 primary--text font-weight-bold px-6"
        v-text="`${lesson.title} / ${exercise.id} ${exercise.title}`"
      />

      <v-form
        class="pa-6"
        ref="questionForm"
        @submit.prevent
        :disabled="loading"
      >
        <v-divider class="my-6" />

        <custom-input
          class="pa-3"
          input-type="select"
          v-model="question.type"
          label="問題タイプ"
          :messages="['問題タイプを設定します']"
          :rules="[v => !!v || '選択してください']"
          :items="types"
        />

        <div v-if="question.type && /(draganddrop|editing|coding)/.test(question.type)">
            <custom-input
              class="pa-3"
              input-type="select"
              v-model="question.level"
              label="レベル"
              :messages="['問題のレベルを設定します']"
              :rules="[v => !!v || '選択してください']"
              :items="levels"
            />
        </div>

        <v-divider class="my-6" />

        <custom-input
          class="pa-3"
          input-type="textarea"
          v-model="question.text"
          label="問題文"
          :messages="['マークダウンで入力してください']"
          :rules="[v => !!v || '入力してください']"
          :counter="1024"
        />

        <custom-input
          class="pa-3"
          v-model="question.answerKey"
          label="解答"
          :rules="[v => !!v || '入力してください']"
        />

        <div v-if="question.type && /(draganddrop|editing|coding)/.test(question.type)">
          <div
            class="body-2 text--secondary pa-4 pb-0"
            v-text="'コード例'"
          />

          <code-input
            class="pa-3"
            :code="question.answerKeyCode"
            message="「保存して実行」で結果を確かめてください。これをしないと変更が反映されません。"
            @change="$event => { question.answerKeyCode = $event }"
          />
        </div>

        <div v-if="question.type">
          <v-divider class="my-6" />

          <div
            v-for="dataItem, i of question.data"
            :key="i"
            class="d-flex pa-3"
          >
            <custom-input
              v-model="dataItem.type"
              input-type="select"
              class="pa-2"
              style="max-width: 160px;"
              label="タイプ"
              :rules="[v => !!v || '選択してください']"
              :items="dataItemTypes[question.type]"
            />

            <custom-input
              v-if="dataItem.type === 'option'"
              v-model="dataItem.id"
              class="pa-2"
              style="max-width: 160px;"
              label="選択肢ID"
              :rules="[v => !!v || '入力してください']"
            />

            <custom-input
              v-model="dataItem.text"
              class="pa-2"
              style="width: 100%;"
              label="データコンテンツ"
              input-type="textarea"
              :rules="[v => !!v || '入力してください']"
            />

            <v-btn
              icon
              @click="() => { question.data = question.data.filter(item => item !== dataItem) }"
            >
              <v-icon v-text="'close'" />
            </v-btn>
          </div>

          <v-btn
            class="d-flex align-center"
            text
            @click="question.data.push({})"
          >
            <v-icon>add</v-icon>
            <span>固有データを追加</span>
          </v-btn>

          <v-divider class="my-6" />

        </div>

        <v-card-actions>
          <v-spacer />

          <v-btn
            class="font-weight-bold"
            color="accent"
            :loading="loading"
            @click="confirm"
            v-text="'確認'"
          />
        </v-card-actions>

        <div v-if="confirmed">
          <v-divider class="my-6" />

          <exercise-box
            :question="question"
          />
        </div>

        <v-divider class="my-6" />

        <v-card-actions>
          <v-spacer />

          <v-btn
            class="font-weight-bold"
            color="accent"
            :loading="loading"
            @click="submit"
            v-text="'追加・編集を完了して保存'"
          />
        </v-card-actions>
      </v-form>
    </scroll-box>

    <select-exercise
      v-if="lesson"
      v-model="dialogs.selectExercise"
      :title="text.selectExercise"
      :lesson="lesson"
      create
      @canceled="clearLesson(true)"
      @selected="setExercise"
    />

    <select-lesson
      v-model="dialogs.selectLesson"
      :title="text.selectLesson"
      @selected="setLesson"
    />
  </page-wrapper>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SelectLesson from '~/components/container/admin/SelectLesson'
import SelectExercise from '~/components/container/admin/SelectExercise'
import PageWrapper from '~/components/presentational/PageWrapper'
import AppBar from '~/components/presentational/AppBar'
import ScrollBox from '~/components/presentational/ScrollBox'
import CustomInput from '~/components/presentational/CustomInput'
import CodeInput from '~/components/presentational/CodeInput'
import Markdown from '~/components/presentational/Markdown'
import ExerciseBox from '~/components/presentational/ExerciseBox'
export default {
  components: {
    SelectLesson,
    SelectExercise,
    PageWrapper,
    AppBar,
    ScrollBox,
    CustomInput,
    CodeInput,
    Markdown,
    ExerciseBox
  },
  data () {
    return {
      loading: false,
      lesson: null,
      exercise: null,
      question: null,
      dialogs: {
        selectLesson: true,
        selectExercise: false
      },
      text: {
        progree: 'progree',
        title: '問題作成・編集',
        selectLesson: 'レッスンを選択',
        selectExercise: 'エキササイズを選択',
        submitExercise: '作成して選択'
      },
      icons: {
        edit: 'edit'
      },
      types: ['choices', 'writing', 'draganddrop', 'editing', 'coding'],
      levels: [1, 2, 3],

      confirmed: false,
      questionForm: {
        id: null,
        text: null,
        level: null,
        type: null,
        answerKey: null,
        answerKeyCode: null,
        data: []
      },
      dataItemTypes: {
        choices: ['option', 'condition', 'hint'],
        writing: ['condition', 'hint'],
        draganddrop: ['option', 'format', 'hint'],
        editing: ['code', 'hint'],
        coding: ['code', 'hint']
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
    // レッスン
    async clearLesson (pass = false) {
      if (!pass) {
        const confirm = window.confirm('編集した内容が失われる可能性がありますが、別のレッスンにうつりますか？')
        if (!confirm) { return alert('キャンセルしました') }
      }
      this.$router.push({ query: {} })
      await new Promise(resolve => setTimeout(resolve, 200))
      this.lesson = null
      this.dialogs.selectLesson = true
    },
    setLesson (lesson) {
      this.lesson = lesson
      this.dialogs.selectExercise = true
      this.dialogs.selectLesson = false
    },
    // エキササイズ
    setExercise (exercise) {
      this.exercise = exercise
      this.dialogs.selectExercise = false
      const questionId = this.$route.query.question || this.$uuid()
      this.setQuestion(questionId)
    },
    // クエスチョン
    setQuestion (questionId) {
      const question = (this.exercise.questions || []).find(question => question.id === questionId)
      this.question = question ? JSON.parse(JSON.stringify(question)) : { id: questionId }
      this.question = {
        ...this.question,
        text: (this.question.text || '').replace(/\\\\n/g, '\n'),
        data: (this.question.data || []).map(item => ({ ...item, text: item.text.replace(/\\\\n/g, '\n') }))
      }
    },
    async confirm () {
      if (!this.$refs.questionForm.validate()) {
        return alert('正しく入力されていない欄があります。')
      }
      this.loading = true
      this.confirmed = false
      await new Promise(resolve => setTimeout(resolve, 200))
      this.loading = false
      this.confirmed = true
    },
    async submit () {
      const confirm = window.confirm('問題を追加・編集完了し、保存します。')
      if (!confirm) { return alert('キャンセルしました') }
      this.loading = true
      const questions = (this.exercise.questions || []).filter(item => item.id !== this.question.id)
      const question = JSON.parse(JSON.stringify(this.question))
      question.text = question.text.replace(/\n/g, '\\\\n')
      question.data = question.data.map(item => ({ ...item, text: item.text.replace(/\n/g, '\\\\n') }))
      await this.setLessons({
        id: this.lesson.id,
        merge: true,
        exercises: {
          [this.exercise.id]: {
            ...this.exercise,
            questions: [
              ...questions,
              question
            ]
          }
        }
      })
      this.loading = false
      alert('完了しました')
      this.clearLesson(true)
    },
    ...mapActions('data', ['setLessons'])
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('data', ['lessons', 'theLesson'])
  }
}
</script>
