<template>
  <div>
    <exercise-box
      :question="question"
      :quota="exercise.quota"
      :cleared-question-number="questionIndex"
      :last-code="lastCode"
      @answer="answerTheQuestion"
      @next="nextQuestion"
    />

    <v-btn
      v-if="user.isAdmin"
      class="my-4"
      text
      @click="toAdminPage"
      v-text="'このエクササイズを編集'"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    exercise: {
      type: Object,
      default: () => ({})
    },
    progress: {
      type: Object,
      default: () => ({})
    },
    progresses: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      lessonId: this.$route.params.lessonId,
      scoreId: this.progresses.scoreId,
      question: null,
      isCorrect: false,
      isClear: false,
      lastCode: null,
      questionIndex: false,
      text: {
        prev: 'サンプルコードに戻る',
        next: '次のレッスンへ'
      }
    }
  },
  async fetch () {
    const lastQuestion = this.progresses.lastQuestion
    if (lastQuestion) {
      this.question = this.exercise.questions.find(q => q.id === lastQuestion)
    } else {
      this.question = this.fetchQuestion(this.exercise)
    }
    this.questionIndex = (this.progress.clearedIds.length || 0) + 1
    this.lastCode = (this.progress.codes ? this.progress.codes[this.question.id] : '') || ''
    this.isClear = this.progress.isClear
  },
  methods: {
    // 問題編集ページへ
    toAdminPage () {
      this.$router.push({
        path: '/admin/question_create/',
        query: {
          lesson: this.lessonId,
          exercise: this.exercise.id,
          question: this.question.id
        }
      })
    },
    /* 挑戦すべきクエスチョンを取得する */
    fetchQuestion () {
      // プログレス
      const progress = this.progress
      // 全問題リスト
      let questions = [...this.exercise.questions]
      // 問題リストを次のレベルの問題でフィルタリング、なければフィルタリングなし
      const nextLevelQuestions = questions.filter(q => q.level === progress.next)
      questions = nextLevelQuestions.length ? nextLevelQuestions : questions
      // 問題リストを、解いたことのない問題があればフィルタリング
      // なければ、正解していない問題でフィルタリング
      // それでもなければフィルタリングなし
      const firstTakeQuestions = questions.filter(q => !progress.answeredIds.some(id => id === q.id))
      const mistookQuestions = questions.filter(q => !progress.clearedIds.some(id => id === q.id))
      questions = firstTakeQuestions.length ? firstTakeQuestions
                    : mistookQuestions.length ? mistookQuestions
                      : questions
      // 残った問題リストから、ランダム出題
      return questions[Math.floor(Math.random() * questions.length)]
    },
    /* クエスチョンに回答する */
    async answerTheQuestion (answerObj) {
      // 各種データ
      const question = this.question
      const exercise = this.exercise
      const progress = JSON.parse(JSON.stringify(this.progress))
      // 回答データ
      const code = answerObj.answerCode
      const hinted = !!answerObj.hinted
      const isCorrect = answerObj.isCorrect
      // 成績に記録
      await this.setScores({
        id: this.lessonId,
        merge: true,
        [this.scoreId]: this.$firebase.$push({
          answer: answerObj.answer || null,
          code: code || null,
          isCorrect: isCorrect || false,
          exerciseId: exercise.id || null,
          questionId: question.id || null,
          answeredAt: this.$firedate.$timestamp()
        })
      })
      // 解いた問題追加
      progress.answeredIds.push(question.id)
      // 正解した問題追加
      if (isCorrect) {
        progress.clearedIds.push(question.id)
      }
      // クリアかどうか（最後のエクササイズでかつ通算正解数がノルマを超えたらクリア）
      const isClear = exercise.isFinal && progress.clearedIds.length >= exercise.quota
      const isChoice = question.type === 'choices'
      console.log({
        id: this.lessonId,
        merge: !isClear,
        isOpen: !isClear,
        isDoing: !isClear,
        isClear: this.isClear || isClear,
        scoreId: !isClear ? this.scoreId : null,
        exercises: !isClear ? {
          [exercise.id]: {
            next: Math.min(Math.max(progress.next + !isCorrect ? 0 : hinted ? -1 : 1, 1), 3),
            answeredIds: [...new Set(progress.answeredIds)],
            clearedIds: [...new Set(progress.clearedIds)],
            codes: {
              [question.id]: code
            },
            lastQuestion: !isCorrect && !isChoice ? question.id : null
          }
        } : {}
      })
      // 進捗の記録
      await this.setProgress({
        id: this.lessonId,
        merge: !isClear,
        isOpen: !isClear,
        isDoing: !isClear,
        isClear: this.isClear || isClear,
        scoreId: !isClear ? this.scoreId : null,
        exercises: !isClear ? {
          [exercise.id]: {
            next: Math.min(Math.max(progress.next + !isCorrect ? 0 : hinted ? -1 : 1, 1), 3),
            answeredIds: [...new Set(progress.answeredIds)],
            clearedIds: [...new Set(progress.clearedIds)],
            codes: {
              [question.id]: code
            },
            lastQuestion: !isCorrect && !isChoice ? question.id : null
          }
        } : {}
      })
      // 判定終了
      this.isCorrect = isCorrect
      this.lastCode = code || ''
    },
    async nextQuestion () {
      const isLessonClear = this.exercise.isFinal && this.progress.clearedIds.length + this.isCorrect >= this.exercise.quota
      if (isLessonClear) {
        alert('クリアしました。次のレッスンに進みます。')
      }
      this.$emit(isLessonClear ? 'clear' : 'next')
    },
    ...mapActions('data', ['setProgress', 'setScores'])
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('data', ['theLesson'])
  }
}
</script>
