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
    const centerY = Math.random() * canvas.height;

    let particles = [];
    const colors = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: centerX,
        y: centerY,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    function hexToRgb(hex) {
      hex = hex.replace('#', '');
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `${r},${g},${b}`;
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;

        if (p.alpha > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${hexToRgb(p.color)},${p.alpha})`;
          ctx.fill();
        }
      });

      particles = particles.filter((p) => p.alpha > 0);

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

  for (let i = 0; i < 10; i++) {
    await playFireworkAnimation(canvas, ctx);
    // 少し待つ
    await new Promise((r) => setTimeout(r, 300));
  }
}

export { showFireworks };
