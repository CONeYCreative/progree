const ID = {}
const TEXT = {}
const BOOL = {}
const INT = {}
const DATETIME = {}

export const Collections = {
  versions: { // バージョン（認証済全員）
    version_id: { // バージョン 1 （認証済全員）
      schools: { // 学校 （認証済全員）
        school_id: { // 学校ID （認証済全員）
          user_id: ID, // 責任者ID
          teachar_ids: [ID], // 先生方ID
          name: TEXT, // 学校名
          classes: { // 開講しているクラス （責任者&生徒）
            class_id: { // クラスID
              teachar_id: ID, // 責任者ID
              student_ids: [ID], // 生徒ID
              name: TEXT, // クラス名
              lesson: { // 開講しているレッスン
                lesson_id: { // レッスンID
                  title: TEXT, // タイトル
                  slides: { // レッスンのスライド
                    slide_id: {}
                  }
                }
              },
              students: { // 生徒
                user_id: { // 生徒のユーザー情報 （責任者&生徒本人）
                  teachar_id: ID, // 責任者ID
                  is_logged_in: BOOL, // ログイン
                  login_history: [DATETIME], // ログイン履歴
                  last_lesson_id: ID, // 最後に入ったレッスン
                  last_slide_id: ID, // 最後に扱ったスライド
                  progress: { // 進捗
                    lesson_id: {
                      is_started: BOOL,
                      is_finished: BOOL,
                      started_at: BOOL,
                      finished_at: BOOL,
                      slides: {
                        slide_id: {
                          is_read: BOOL,
                          code: TEXT,
                          score: INT,
                          max_score: INT
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      user: {
        user_id: {
          name: TEXT,
          accounted: BOOL
        }
      },
      lesson: { // レッスンのテンプレート
        lesson_id: { // レッスンID
          title: TEXT, // タイトル
          slides: { // レッスンのスライド
            slide_id: {}
          }
        }
      }
    }
  }
}
