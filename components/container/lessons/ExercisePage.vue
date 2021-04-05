<template>
  <lesson-page
    :title-icon="icons.exercise"
    :title-text="text.exercise"
    :prev-button-text="text.prev"
    :next-button-text="text.next"
    :next-button-disabled="!isClear"
    @click:prev="$router.push({ path: `/lessons/${lesson.id}/code` })"
    @click:next="$router.push({ path: `/lessons/${lesson.nextLessonId}/` })"
  >
    <v-overlay v-if="loading">
      <v-progress-circular indeterminate />
    </v-overlay>

    <exercise-box
      v-else
      :question="question"
      :quota="exercise.quota"
      :cleared-question-number="clearedQuestionNumber"
      :last-code="lastCode"
      @answer="answerTheQuestion"
    />

    <answer-dialog
      v-model="dialogs.answer"
      :loading="loading"
      :correct="isCorrect"
      :question="question"
      @next="nextQuestion"
    />
  </lesson-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import LessonPage from '~/components/container/lessons/LessonPage'
import AnswerDialog from '~/components/container/lessons/AnswerDialog'
import ExerciseBox from '~/components/presentational/ExerciseBox'
export default {
  components: {
    LessonPage,
    ExerciseBox,
    AnswerDialog
  },
  data () {
    return {
      lesson: null,
      exercise: null,
      question: null,
      progress: null,
      isCorrect: false,
      isClear: false,
      lastCode: null,
      clearedQuestionNumber: false,
      icons: { exercise: 'mdi-head-lightbulb' },
      text: {
        exercise: null,
        prev: 'サンプルコードに戻る',
        next: '次のレッスンへ'
      },
      dialogs: { answer: false },
      loading: false
    }
  },
  async fetch () {
    const lessonId = this.$route.params.lessonId
    this.lesson = this.$store.getters['data/theLesson'](lessonId)
    this.progress = this.$store.getters['data/theProgress'](lessonId)
    this.exercise = this.fetchExercise(this.lesson, this.progress)
    this.question = this.progress.lastQuestion ? this.exercise.questions.find(q => q.id === this.progress.lastQuestion) : null
    if (!this.question?.id) {
      this.question = this.fetchQuestion(this.exercise)
    }
    this.clearedQuestionNumber = (this.exercise.progress.clearedIds.length || 0) + 1
    this.lastCode = (this.exercise.progress.codes ? this.exercise.progress.codes[this.question.id] : '') || ''
    this.isClear = this.exercise.progress.isClear
    this.text.exercise = `Exercise ${this.exercise.id.replace(/[^\d]/g, '')} 〜${this.exercise.title}〜`
  },
  methods: {
    /* 挑戦すべきエキササイズを取得する */
    fetchExercise (lesson, progress) {
      // エキササイズのIDだけを取り出し、番号若い順に並び替え（exercise1, exercise2, ...）
      const exerciseIds = [...Object.keys(lesson.exercises)].sort()
      // エキササイズのID若い順に回してユーザーの挑戦すべきエキササイズを取得する
      for (const exerciseId of exerciseIds) {
        // エキササイズ
        const exercise = lesson.exercises[exerciseId]
        // そのエキササイズの進捗
        const exerciseProgress = progress.exercises[exerciseId] || {}
        // そのエキササイズの正解した問題リスト
        const clearedIds = exerciseProgress.clearedIds || []
        // そのエキササイズの通算正解数がノルマより低ければそのエキササイズの問題をとく
        if (clearedIds.length < exercise.quota) {
          return {
            id: exerciseId,
            ...exercise,
            isFinal: exerciseId === exerciseIds.slice(-1)[0],
            progress: {
              next: 2,
              answeredIds: [],
              clearedIds: [],
              ...exerciseProgress
            }
          }
        }
      }
    },
    /* 挑戦すべきクエスチョンを取得する */
    fetchQuestion (exercise) {
      // 全問題リスト
      let questions = [...exercise.questions]
      // 問題リストを次のレベルの問題でフィルタリング、なければフィルタリングなし
      const nextLevelQuestions = questions.filter(q => q.level === exercise.progress.next)
      questions = nextLevelQuestions.length ? nextLevelQuestions : questions
      // 問題リストを、解いたことのない問題があればフィルタリング
      // なければ、正解していない問題でフィルタリング
      // それでもなければフィルタリングなし
      const firstTakeQuestions = questions.filter(q => !exercise.progress.answeredIds.some(id => id === q.id))
      const mistookQuestions = questions.filter(q => !exercise.progress.clearedIds.some(id => id === q.id))
      questions = firstTakeQuestions.length ? firstTakeQuestions
                    : mistookQuestions.length ? mistookQuestions
                      : questions
      // 残った問題リストから、ランダム出題
      return questions[Math.floor(Math.random() * questions.length)]
    },
    /* クエスチョンに回答する */
    async answerTheQuestion (answerObj, lesson = this.lesson, progress = this.progress, question = this.question, exercise = this.exercise) {
      // ダイアログ開いて判定中に
      this.dialogs.answer = true
      this.loading = true
      // 回答データ
      const answer = String(answerObj.answer).trim().replace(/\n/g, '\\\\n')
      const code = answerObj.code ? answerObj.code.replace(/\n/g, '\\\\n') : null
      const hinted = !!answerObj.hinted
      // 正解かどうか
      const isCorrect = question.answerKey === answer
      // 解いた問題追加
      exercise.progress.answeredIds.push(question.id)
      // 正解した問題追加
      if (isCorrect) { exercise.progress.clearedIds.push(question.id) }
      // クリアかどうか（最後のエキササイズでかつ通算正解数がノルマを超えたらクリア）
      const isClear = exercise.isFinal && (exercise.progress.clearedIds.length >= exercise.quota)
      // 新しい進捗
      const exerciseProgress = {
        next: Math.min(Math.max(exercise.progress.next + Number(isCorrect && !hinted) - Number(isCorrect && hinted), 1), 3),
        answeredIds: [...new Set(exercise.progress.answeredIds)],
        clearedIds: [...new Set(exercise.progress.clearedIds)],
        codes: { [question.id]: code },
        lastQuestion: (!isCorrect && question.type !== 'choices') ? question.id : null
      }
      // 成績に記録
      await this.setScores({
        id: lesson.id,
        merge: true,
        [progress.scoreId]: this.$firebase.$push({
          answer: answer || null,
          code: code || null,
          isCorrect: isCorrect || false,
          exerciseId: exercise.id || null,
          questionId: question.id || null,
          type: question.type || null,
          level: question.level || null,
          answerKey: question.answerKey || null,
          answeredAt: this.$firedate.$timestamp()
        })
      })
      // 進捗の記録
      await this.setProgress({
        id: lesson.id,
        merge: !isClear,
        isOpen: !isClear,
        isDoing: !isClear,
        isClear: this.isClear || isClear,
        scoreId: isClear ? null : progress.scoreId,
        exercises: isClear ? {} : { [exercise.id]: exerciseProgress }
      })
      // 判定終了
      this.isCorrect = isCorrect
      // 間違っていたら問題を読み込む（書いたコードを入力させておくため）
      if (!isCorrect) { this.$fetch() }
      this.loading = false
    },
    async nextQuestion (exercise = this.exercise) {
      // ダイアログ閉じる
      this.dialogs.answer = false
      // 正解かどうかをリセット
      this.isCorrect = false
      // 一旦隠す
      this.loading = true
      // クリアであれば次のレッスンへ
      if (exercise.isFinal && exercise.progress.clearedIds.length >= exercise.quota) {
        const confirm = window.confirm('レッスンをクリアしました。次のレッスンに進みますか？')
        return this.$router.push({ path: confirm ? `/lessons/${this.lesson.nextLessonId}/` : '/' })
      }
      // 少し待つ
      await new Promise(resolve => setTimeout(() => { resolve() }, 800))
      // 問題を読み込む
      this.$fetch()
      // 表示
      this.loading = false
    },
    ...mapActions('data', ['setProgress', 'setScores'])
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('data', ['theLesson'])
  }
}
</script>

<style>
.v-dialog {
  width: auto !important;
}
</style>
