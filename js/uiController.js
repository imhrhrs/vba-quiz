import { showFireworks } from './main.js';

export class UIController {
  constructor(quizManager) {
    this.quizManager = quizManager;
  }

  // 最初の問題 or 現在の問題を表示
  renderQuestion() {
    const question = this.quizManager.getCurrentQuestion();

    if (!question) {
      document.getElementById('question').textContent = '問題を読み込んでください。';
      document.getElementById('genre').textContent = '';
      return;
    }

    document.getElementById('genre').textContent = `[ジャンル] ${question.genre}`;
    document.getElementById('question').textContent = question.question;

    this.reset();
  }

  // ✅ 次の問題に進んで表示（「次へ」ボタン用）
renderNextQuestion() {
  const hasNext = this.quizManager.nextQuestion();

  if (hasNext) {
    this.renderQuestion(); // 次の問題を表示
  } else {
    // クイズ終了時の処理

    // 正解数をカウント
    const total = this.quizManager.history.length;
    const correct = this.quizManager.history.filter(q => q.isCorrect).length;

    document.getElementById('question').textContent = 'クイズは終了しました。';
    document.getElementById('genre').textContent = '';
    document.getElementById('true-btn').disabled = true;
    document.getElementById('false-btn').disabled = true;
    document.getElementById('next-btn').style.display = 'none';

    document.getElementById('feedback').textContent = `正解数：${correct} / ${total} 問`;

    // 全問正解なら花火を表示
    if (total > 0 && correct === total) {
      showFireworks();
    }

    document.getElementById('feedback').style.color = 'black';

    document.getElementById('explanation').textContent = '';
    document.getElementById('law-reference').textContent = '';
    
  }
}


  // 回答ボタンが押されたときの処理
  handleAnswer(userAnswer) {
    const isCorrect = this.quizManager.checkAnswer(userAnswer);

    document.getElementById('feedback').textContent = isCorrect ? '正解！' : '不正解';
    document.getElementById('feedback').style.color = isCorrect ? 'green' : 'red';

    const current = this.quizManager.getCurrentQuestion();
    document.getElementById('explanation').textContent = `解説: ${current.explanation || ''}`;
    document.getElementById('law-reference').textContent = `参考条文: ${current.lawReference || ''}`;

    // 回答後、「次へ」ボタンを表示
    document.getElementById('next-btn').style.display = 'block';

    // 回答ボタンを無効化
    document.getElementById('true-btn').disabled = true;
    document.getElementById('false-btn').disabled = true;
  }

  // フィードバックなどをリセット（次の問題表示時）
  reset() {
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').style.color = 'black';
    document.getElementById('explanation').textContent = '';
    document.getElementById('law-reference').textContent = '';
    document.getElementById('next-btn').style.display = 'none';

    // 回答ボタンを有効化
    document.getElementById('true-btn').disabled = false;
    document.getElementById('false-btn').disabled = false;
  }
}
