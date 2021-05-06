export default {
  versions: { version: {
    users: { userId: {
      classId: ID,
      className: String,
      isTeachar: Boolean,
      name: String,
      schoolId: ID,
      schoolName: String,
      progress: { lessonId: {
        isOpen: Boolean, // レッスンを開いているかどうか
        isDoing: Boolean, // レッスンの途中かどうか
        isClear: Boolean, // 終わっているかどうか
        scoreId: String, // 記録している成績ID
        exercises: {
          id: {
            next: Number, // 次のレベル
            answeredIds: [], // 解いたID
            clearedIds: [], // 正解したID
            lastQuestion: String,
            codes: {
              id: String
            }
          }
        }
      }},
      score: { lessonId: { // 成績・レッスンID
        id: [ // スタートしたタイムスタンプをIDに
          {
            answeredAt: DateTime, // 回答日時
            exerciseId: String, // エクササイズID
            questionId: String, // 問題ID
            code: String, // 回答コード
            answer: String, // 回答
            answerKey: String, // 模範解答
            type: String, // 問題タイプ
            level: Number, // 問題レベル
            isCorrect: Boolean, // 正解かどうか
          }
        ]
      }}
    }},
    lessons: { lessonId: {
      title: String,
      rank: Number,
      nextLessonId: ID,
      prevLessonId: ID,
      sample: {
        code: String,
        description: String
      },
      slides: [
        {
          imageUrl: URL,
          title: String
        }
      ],
      exercises: {
        id: {
          title: String,
          quota: Number,
          questions: [
            {
              id: ID,
              level: Number,
              type: String,
              text: String,
              data: AnyType,
              answerKey: String
            }
          ]
        }
      }
    }}
  }}
}
