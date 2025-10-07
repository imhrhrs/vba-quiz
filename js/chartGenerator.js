export function generateChart(resultByGenre) {
  const ctx = document.getElementById('result-chart').getContext('2d');

  // chartInstance はグローバル変数として持っておくか、モジュール内変数でも可
  if (window.chartInstance) {
    window.chartInstance.destroy();
  }

  const labels = Object.keys(resultByGenre);
  const correctCounts = labels.map(label => resultByGenre[label].correct);
  const totalCounts = labels.map(label => resultByGenre[label].total);

  window.chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: '正解数',
          data: correctCounts,
          backgroundColor: 'green'
        },
        {
          label: '総問題数',
          data: totalCounts,
          backgroundColor: 'lightgray'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: 'ジャンル別 正答数グラフ'
        }
      }
    }
  });
}
