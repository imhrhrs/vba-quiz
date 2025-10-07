export function exportHistoryToCSV(history) {
  if (!history.length) {
    alert('履歴がありません。');
    return;
  }

  const header = ['ジャンル', '問題文', '正解', 'あなたの回答', '正誤', '解説', '参考条文'];
  const rows = history.map(entry => [
    entry.genre,
    entry.question,
    entry.answer,
    entry.userAnswer,
    entry.isCorrect ? '正解' : '不正解',
    entry.explanation,
    entry.lawReference
  ]);

  const csvContent = [header, ...rows]
    .map(e => e.map(v => `"${v}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'quiz-history.csv');
  link.click();
}
