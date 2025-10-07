import { QuizManager } from './quizManager.js';
import { UIController } from './uiController.js';
import { parseCSVToQuiz } from './csvImporter.js';
import { exportHistoryToCSV } from './csvExporter.js';
import { generateChart } from './chartGenerator.js';

let quizManager;
let ui;

// 配列をシャッフルするユーティリティ関数
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

document.addEventListener('DOMContentLoaded', () => {
  quizManager = new QuizManager([]);
  ui = new UIController(quizManager);

  document.getElementById('true-btn').addEventListener('click', () => ui.handleAnswer(true));
  document.getElementById('false-btn').addEventListener('click', () => ui.handleAnswer(false));
  document.getElementById('next-btn').addEventListener('click', () => ui.renderNextQuestion());

  // CSV問題読み込み処理
  document.getElementById('csv-import').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      let quizArray = parseCSVToQuiz(text);

      // 出題数取得＆バリデーション
      const inputCount = document.getElementById('question-count').value;
      let questionCount = parseInt(inputCount, 10);
      if (isNaN(questionCount) || questionCount <= 0) {
        questionCount = quizArray.length;
      } else {
        questionCount = Math.min(questionCount, quizArray.length);
      }

      // ランダム出題のチェックボックス判定
      const randomize = document.getElementById('randomize-questions').checked;
      if (randomize) {
        quizArray = shuffleArray(quizArray);
      }

      // 問題数分だけスライス
      quizArray = quizArray.slice(0, questionCount);

      quizManager.loadNewQuiz(quizArray);
      ui.reset();
      ui.renderQuestion();
      alert(`CSVファイルから${quizArray.length}問を読み込みました。`);
    } catch (error) {
      alert("CSV読み込みエラー: " + error.message);
    }
  });

  // 履歴CSVエクスポート
  document.getElementById('export-csv').addEventListener('click', () => {
    exportHistoryToCSV(quizManager.history);
  });

  // 成績グラフ表示
  document.getElementById('show-graph').addEventListener('click', () => {
    const result = quizManager.aggregateByGenre();
    generateChart(result);
  });
});

// 花火を表示する関数群
async function playFireworkAnimation(canvas, ctx) {
  return new Promise((resolve) => {
    const centerX = Math.random() * canvas.width;
    const centerY = Math.random() * canvas.height / 2; // 上半分に表示

    let particles = [];

    const count = 100;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: centerX,
        y: centerY,
        angle: Math.random() * 2 * Math.PI,
        speed: Math.random() * 5 + 2,
        radius: 2,
        alpha: 1,
        color: `hsl(${Math.random() * 360}, 100%, 60%)`
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // ← 残像なし

      particles = particles.filter((p) => p.alpha > 0.01);

      particles.forEach((p) => {
        // 位置更新
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.alpha -= 0.015;

        // 描画
        ctx.beginPath();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      if (particles.length > 0) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    }

    animate();
  });
}

async function showFireworks() {
  const canvas = document.getElementById('result-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // キャンバスサイズ調整
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  for (let i = 0; i < 10; i++) {
    await playFireworkAnimation(canvas, ctx);
    await new Promise((r) => setTimeout(r, 300));
  }
}

export { showFireworks };


