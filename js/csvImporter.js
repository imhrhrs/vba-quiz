export function parseCSVToQuiz(csvText) {
  
  const lines = csvText
    .trim()
    .split('\n')
    .map(line => line.replace(/\r/g, '').trim()); // ← 改行や\r削除

  const headers = lines[0]
    .replace(/\uFEFF/g, '') // BOM削除
    .split(',')
    .map(h => h.trim());

  const requiredHeaders = ['genre', 'question', 'answer', 'explanation', 'lawReference'];
  const isValid = requiredHeaders.every(h => headers.includes(h));
  if (!isValid) {
    throw new Error('CSVのヘッダーが正しくありません。');
  }

  const headerIndex = Object.fromEntries(headers.map((h, i) => [h, i]));

  const quizzes = lines.slice(1).map((line, index) => {
    const cols = line.split(',').map(c => c.trim());

    // 列数が不足していたらスキップ or エラー
    if (cols.length < headers.length) {
      console.warn(`スキップ: ${index + 2}行目の列数が足りません`);
      return null;
    }

    return {
      genre: cols[headerIndex['genre']],
      question: cols[headerIndex['question']],
      answer: cols[headerIndex['answer']].toLowerCase() === 'true',
      explanation: cols[headerIndex['explanation']],
      lawReference: cols[headerIndex['lawReference']]
    };
  }).filter(Boolean); // null を除去

  return quizzes;
}
