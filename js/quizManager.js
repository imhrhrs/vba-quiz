export class QuizManager {
  constructor(quizData) {
    this.quizData = quizData;      // クイズ配列
    this.currentIndex = 0;         // 現在の問題番号
    this.history = [];             // 回答履歴
  }

  // 現在の問題を取得
  getCurrentQuestion() {
    return this.quizData[this.currentIndex];
  }

  // 回答をチェックし、履歴に記録する
  checkAnswer(userAnswer) {
    const current = this.getCurrentQuestion();
    const isCorrect = current.answer === userAnswer;
    this.history.push({
      ...current,
      userAnswer,
      isCorrect
    });
    return isCorrect;
  }

  // 次の問題があるか確認して進める
  nextQuestion() {
    this.currentIndex++;
    return this.currentIndex < this.quizData.length;
  }

  // 新しいクイズセットを読み込む（履歴リセット）
  loadNewQuiz(newQuizData) {
    this.quizData = newQuizData;
    this.currentIndex = 0;
    this.history = [];
  }

  // ジャンルごとに正解数と合計数を集計
  aggregateByGenre() {
    const result = {};
    this.history.forEach(entry => {
      if (!result[entry.genre]) {
        result[entry.genre] = { total: 0, correct: 0 };
      }
      result[entry.genre].total++;
      if (entry.isCorrect) result[entry.genre].correct++;
    });
    return result;
  }
}

