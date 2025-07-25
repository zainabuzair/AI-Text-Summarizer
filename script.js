function summarizeText() {
  const text = document.getElementById("inputText").value;
  if (!text.trim()) {
    alert("Please enter some text.");
    return;
  }

  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
  const wordFreq = {};

  text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .forEach(word => {
      if (word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

  const scoredSentences = sentences.map(sentence => {
    const words = sentence.toLowerCase().split(/\s+/);
    let score = 0;
    words.forEach(word => {
      if (wordFreq[word]) score += wordFreq[word];
    });
    return { sentence, score };
  });

  scoredSentences.sort((a, b) => b.score - a.score);

  const summary = scoredSentences.slice(0, Math.max(1, sentences.length / 3)).map(s => s.sentence).join(" ");
  document.getElementById("summary").value = summary.trim();
}
